import { ButtonBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonStyle } from 'discord.js';

type LinkButtonData = { link: string; label: string };
const links: LinkButtonData[] = [
  { link: 'https://www.knighthacks.org/', label: 'Website' },
  { link: 'https://www.knighthacks.org/membership', label: 'Membership Form' },
  { link: 'https://www.knighthacks.org/linktree', label: 'Link Tree' },
  { link: 'https://www.knighthacks.org/dues', label: 'Pay Dues' },
  { link: 'https://www.knighthacks.org/ops', label: 'Operations Meetings' },
];

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  links.map((data) => {
    return new ButtonBuilder()
      .setLabel(data.label)
      .setStyle(ButtonStyle.Link)
      .setURL(data.link);
  })
);

export { row as KnightHacksLinkButtons };
