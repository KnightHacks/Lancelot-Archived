import { Command } from '@knighthacks/dispatch';
import { MessageActionRow, MessageButton } from 'discord.js';

type LinkButtonData = { link: string; label: string };
const links: LinkButtonData[] = [
  { link: 'https://www.knighthacks.org/', label: 'Website' },
  { link: 'https://www.knighthacks.org/linktree', label: 'Link Tree' },
  { link: 'https://www.knighthacks.org/dues', label: 'Pay Dues' },
  { link: 'https://www.knighthacks.org/feedback', label: 'Workshop Feedback' },
  { link: 'https://www.knighthacks.org/ops', label: 'Operator Meetings' },
];

const buttons: MessageButton[] = links.map(data => {
  return new MessageButton()
    .setLabel(data.label)
    .setStyle('LINK')
    .setURL(data.link);
});

const row = new MessageActionRow().addComponents(buttons);

const LinksCommand: Command = {
  name: 'links',
  description: 'Gets helpful links for KnightHacks.',
  async run({ interaction }) {
    await interaction.reply({ content: '**Here\'s some helpful KnightHacks links!**', components: [row] });
  }
};

export default LinksCommand;
