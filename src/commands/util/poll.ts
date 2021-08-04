import { Command } from '@knighthacks/dispatch';
import { ApplicationCommandOptionData, CommandInteractionOption, Message, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

function generateChoiceOptions(numChoices: number): ApplicationCommandOptionData[] {
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

function generateButtonOptions(options: CommandInteractionOption[]): MessageActionRow[] {
  const buttons = options.map(option => new MessageButton()
    .setCustomId(option.value as string)
    .setLabel(option.value as string)
    .setStyle('PRIMARY')
  );

  const components: MessageActionRow[] = [];
  let curRow = 0;
  buttons.forEach((button, i) => {
    if (i > 4) {
      curRow++;
    }

    if (!components[curRow]) {
      components[curRow] = new MessageActionRow();
    }

    components[curRow]?.addComponents(button);
  });

  return components;
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
    }
    ,...generateChoiceOptions(10)
  ],
  async run(interaction) {
    const { options } = interaction;
    const title = options.get('title', true);
    const embed = new MessageEmbed()
      .setTitle(`Poll: ${title.value}`);

    const normalizedOptions = options.data.filter(option => typeof option.value === 'string' && (option.name !== 'title' && option.name !== 'time'));

    const votes = new Map<string, number>();

    normalizedOptions.forEach((elem, i) => {
      if (typeof elem.value !== 'string') {
        return;
      }

      // Initialize map values.
      votes.set(elem.name, 0);
      embed.addField(`Choice #${i + 1}`, '0');
    });

    const row = generateButtonOptions(normalizedOptions);

    const message = await interaction.reply({ embeds: [embed], fetchReply: true, components: row }) as Message;
    const collector = message.createMessageComponentCollector({ componentType: 'BUTTON' });

    collector.on('collect', (collectInteraction) => {
      if (!collectInteraction.isButton()) {
        return;
      }

      console.log(collectInteraction.customId);
    });
  }
};

export default PollCommand;
