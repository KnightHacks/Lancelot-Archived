import { Command } from '@knighthacks/scythe';
import {
  ApplicationCommandOptionData,
  CommandInteractionOption,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  MessageSelectOptionData,
  Snowflake,
  User,
} from 'discord.js';
import Colors from '../../colors';

function generateChoiceOptions(
  numChoices: number
): ApplicationCommandOptionData[] {
  const retVal: ApplicationCommandOptionData[] = [];
  for (let i = 1; i <= numChoices; i++) {
    let required = false;

    if (i <= 2) {
      required = true;
    }

    retVal.push({
      name: `option${i}`,
      type: 'STRING',
      description: `Poll option number ${i}.`,
      required,
    });
  }

  return retVal;
}

export class PollManager {
  private readonly voteMap = new Map<string, number>();
  private readonly userVoteMap = new Map<Snowflake, string>();
  private readonly title;

  constructor(
    private readonly time: number,
    title: string,
    options: CommandInteractionOption[]
  ) {
    // Initialize vote map
    options.forEach((option) => {
      if (typeof option.value !== 'string') {
        return;
      }

      this.voteMap.set(option.value, 0);
    });

    this.title = title;
  }

  generateEmbed(): MessageEmbed {
    const entries = [...this.voteMap.entries()].sort((a, b) => {
      const [, aCount] = a;
      const [, bCount] = b;

      return bCount - aCount;
    });

    return new MessageEmbed()
      .addFields(
        entries.map((entry, i) => {
          const [optionName, voteCount] = entry;
          return {
            name: `${i + 1}) ${optionName}`,
            value: `Votes: ${voteCount}`,
          };
        })
      )
      .setTitle(this.title)
      .setDescription(`Duration: ${this.time} minute(s)`)
      .setColor(Colors.embedColor);
  }

  vote(user: User, choice: string): void {
    const userVoteChoice = this.userVoteMap.get(user.id);

    // The user has already voted for this
    // ignore it.
    if (userVoteChoice) {
      // You can't vote for the same thing more than once.
      if (userVoteChoice === choice) {
        return;
      }

      // Decrement the other vote number.
      const voteCount = this.getVoteCount(userVoteChoice);
      this.voteMap.set(userVoteChoice, voteCount - 1);
    }

    // Set the users vote.
    this.userVoteMap.set(user.id, choice);

    // Get the total votes.
    const voteCount = this.getVoteCount(choice);

    // Increment votes.
    this.voteMap.set(choice, voteCount + 1);
  }

  private getVoteCount(choice: string) {
    const voteCount = this.voteMap.get(choice);

    if (voteCount === undefined) {
      throw new Error(`Could not get vote count for ${choice}`);
    }

    return voteCount;
  }

  get results(): [choice: string, votes: number][] {
    return [...this.voteMap.entries()];
  }
}

function generateMenu(options: CommandInteractionOption[]): MessageSelectMenu {
  const choices: MessageSelectOptionData[] = options.map((option) => {
    return {
      label: option.value as string,
      value: option.value as string,
    };
  });

  return new MessageSelectMenu()
    .setCustomId('pollMenu')
    .setMaxValues(1)
    .setPlaceholder('Pick your vote')
    .addOptions(choices);
}

const PollCommand: Command = {
  name: 'poll',
  description: 'Creates an interactive poll',
  options: [
    {
      name: 'title',
      type: 'STRING',
      description: 'The title of the poll',
      required: true,
    },
    {
      name: 'time',
      type: 'INTEGER',
      description: 'The amount of time in minutes to run the poll for.',
      required: true,
    },
    ...generateChoiceOptions(10),
  ],
  async run({ interaction }) {
    const { options } = interaction;
    const title = options.get('title', true).value as string;
    const time = options.get('time', true).value as number;

    if (time > 60) {
      await interaction.reply({
        content: 'Time cannot exceed 60 minutes',
        ephemeral: true,
      });
      return;
    }

    const channel = interaction.channel;

    if (!channel) {
      throw new Error('Could not find channel');
    }

    const normalizedOptions = options.data.filter(
      (option) =>
        typeof option.value === 'string' &&
        option.name !== 'title' &&
        option.name !== 'time'
    );

    const poll = new PollManager(time, title, normalizedOptions);
    const embed = poll.generateEmbed();

    const row = new MessageActionRow().addComponents(
      generateMenu(normalizedOptions)
    );

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
      components: [row],
    });
    const collector = message.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      time: time * 60000,
    });

    collector.on('collect', async (collectInteraction) => {
      await collectInteraction.deferUpdate();
      if (!collectInteraction.isSelectMenu()) {
        return;
      }

      const [choice] = collectInteraction.values;

      if (!choice) {
        return;
      }

      poll.vote(collectInteraction.user, choice);
      const updatedEmbed = poll.generateEmbed();

      await collectInteraction.editReply({ embeds: [updatedEmbed] });
    });

    collector.on('end', async () => {
      // Remove select menu since poll is over.
      if (message.editable) {
        await message.edit({ components: [] });
      }

      const embed = poll.generateEmbed();
      embed.description = null;
      embed.title = `Results of '${title}':`;
      await message.reply({
        content: '**Poll has concluded**',
        embeds: [embed],
      });
    });
  },
};

export default PollCommand;
