import { ApplicationCommandOption, CommandInteraction, EmbedFieldData, MessageEmbed, User } from 'discord.js';
import { Command } from 'dispatch';

const options: ApplicationCommandOption[] = [
  {
    name: 'user',
    type: 'USER',
    description: 'The user to vibe check',
  }
];

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
  const results: Result[] = categories.map(category => (
    { category, score: Math.floor(Math.random() * 101) }
  ));

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
  const status = Math.random() ? '**✅ | Vibe Check Passed**' : '**❌ | Vibe Check failed**';

  // Create embeds and add fields.
  const embed = new MessageEmbed()
    .setAuthor(recipient.username, recipient.avatarURL() ?? undefined) // This is whatever.
    .setDescription(status)
    .setTitle('Vibe Check')
    .addFields(fields)
    .setColor('#7ce4f7')
    .setFooter(`checked by ${sender.username}`, sender.avatarURL() ?? undefined);

  return embed;
}

const VibeCommand: Command = {
  name: 'vibe',
  description: 'Performs a vibe check on the given user.',
  options,

  async run(interaction: CommandInteraction) {
    const user = interaction.options.get('user')?.user;
    const sender = interaction.user;

    // Show that the bot is thinking.
    await interaction.defer();

    // If there's no user, that means it's just a sender check.
    if (!user) {
      await interaction.followUp({ embeds: [generateVibeEmbed(sender, sender)] });
      return;
    }

    // Defer because the bot is thinking.
    await interaction.followUp({ embeds: [generateVibeEmbed(sender, user)] });
  }
};

export default VibeCommand;
