import { Command } from '@knighthacks/scythe';
import {
  ApplicationCommandType,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  Interaction,
  User,
} from 'discord.js';
import Colors from '../../colors';

const categories = [
  { name: 'Royalty', emoji: '👑' },
  { name: 'Artsy', emoji: '👩‍🎨' },
  { name: 'Strange', emoji: '🌝' },
  { name: 'Charming', emoji: '🌹' },
  { name: 'Chutzpah', emoji: '🥊' },
  { name: 'Cozy', emoji: '☕️' },
  { name: 'Cursed', emoji: '💀' },
  { name: 'Ravenous', emoji: '🍫' },
];

type Result = {
  category: {
    name: string;
    emoji: string;
  };
  score: number;
};

function generateVibeEmbed(sender: User, recipient: User): EmbedBuilder {
  // Generate a random percentage per each category
  const results: Result[] = categories.map((category) => ({
    category,
    score: Math.floor(Math.random() * 101),
  }));

  const fields = results.map((result) => {
    // Dexponetiate the score.
    const intPercent = Math.floor(result.score / 10);
    const { category } = result;
    const name = `${category.emoji} ${category.name} | ${result.score}% |`;
    let value = '|';

    // Plot bars
    for (let i = 1; i <= 10; i++) {
      if (intPercent === i) {
        value += '🔘';
        continue;
      }
      value += '▬';
    }

    value += '|';
    return { name, value };
  });
  const status = Math.round(Math.random())
    ? '**✅ | Vibe Check Passed**'
    : '**❌ | Vibe Check failed**';

  // Create embed and add fields, and return.
  return new EmbedBuilder()
    .setAuthor({
      name: recipient.username,
      iconURL: recipient.avatarURL() ?? undefined,
    })
    .setDescription(status)
    .setTitle('Vibe Check')
    .addFields(fields)
    .setColor(Colors.embedColor)
    .setFooter({
      text: `checked by ${sender.username}`,
      iconURL: sender.avatarURL() ?? undefined,
    });
}

const VibeCommand: Command = {
  name: 'Vibe Check',
  type: ApplicationCommandType.User,
  async run({ interaction }) {
    const guildMember = interaction.guild?.members.cache.get(
      interaction.targetId
    );
    const user = guildMember?.user;

    if (!user) {
      throw new Error(
        `Could not perform whois on user with ID: ${interaction.targetId}`
      );
    }

    const sender = interaction.user;

    // Show that the bot is thinking.
    await interaction.deferReply();

    // If there's no user, that means it's just a sender check.
    // Defer because the bot is thinking.
    await interaction.followUp({
      embeds: [generateVibeEmbed(sender, user ?? sender)],
      fetchReply: true,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              customId: 'vibeCheck',
              label: 'Recheck',
            },
          ],
        },
      ],
    });

    const filter = (i: Interaction) => i.user.id === sender.id;

    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      time: 60000,
      componentType: ComponentType.Button,
    });

    collector?.on('collect', async (i) => {
      await i.deferUpdate();
      await i.editReply({
        embeds: [generateVibeEmbed(sender, user ?? sender)],
      });
    });
  },
};

export default VibeCommand;
