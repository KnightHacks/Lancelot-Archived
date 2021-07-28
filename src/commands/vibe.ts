import {
  Command,
  DispatchButton,
  inChannelNames,
  UIComponent,
} from '@knighthacks/dispatch';
import {
  ApplicationCommandOption,
  EmbedFieldData,
  MessageEmbed,
  User,
} from 'discord.js';
import { Channels } from '../channels';
import Colors from '../colors';

const options: ApplicationCommandOption[] = [
  {
    name: 'user',
    type: 'USER',
    description: 'The user to vibe check',
  },
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
    .setAuthor(recipient.username, recipient.avatarURL() ?? undefined) // This is whatever.
    .setDescription(status)
    .setTitle('Vibe Check')
    .addFields(fields)
    .setColor(Colors.embedColor)
    .setFooter(
      `checked by ${sender.username}`,
      sender.avatarURL() ?? undefined
    );
}

const VibeCommand: Command = {
  name: 'vibe',
  description: 'Performs a vibe check on the given user.',
  options,
  permissionHandler: inChannelNames(Channels.bot),
  async run({ interaction, client }) {
    const user = interaction.options.get('user')?.user;
    const sender = interaction.user;

    // Show that the bot is thinking.
    await interaction.defer();

    const ui: UIComponent = new DispatchButton({
      style: 'PRIMARY',
      label: 'Recheck',
      async onClick(i) {
        await i.deferUpdate();
        await i.editReply({
          embeds: [generateVibeEmbed(sender, user ?? sender)],
        });
      },
    });

    // If there's no user, that means it's just a sender check.
    // Defer because the bot is thinking.
    await interaction.followUp({
      embeds: [generateVibeEmbed(sender, user ?? sender)],
      fetchReply: true,
      components: client.registerUI(ui),
    });
  },
};

export default VibeCommand;
