import { Button, Command } from '@knighthacks/scythe';
import { EmbedFieldData, MessageEmbed, User } from 'discord.js';
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

function generateVibeEmbed(sender: User, recipient: User): MessageEmbed {
  // Generate a random percentage per each category
  const results: Result[] = categories.map((category) => ({
    category,
    score: Math.floor(Math.random() * 101),
  }));

  const fields = results.map((result): EmbedFieldData => {
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
  return new MessageEmbed()
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
  type: 'USER',
  async run({ interaction, registerUI }) {
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

    const ui: Button = {
      style: 'PRIMARY',
      label: 'Recheck',
      async onClick(i) {
        await i.deferUpdate();
        await i.editReply({
          embeds: [generateVibeEmbed(sender, user ?? sender)],
        });
      },
    };

    // If there's no user, that means it's just a sender check.
    // Defer because the bot is thinking.
    await interaction.followUp({
      embeds: [generateVibeEmbed(sender, user ?? sender)],
      fetchReply: true,
      components: registerUI(ui),
    });
  },
};

export default VibeCommand;
