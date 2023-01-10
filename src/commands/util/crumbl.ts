import { Command } from '@knighthacks/scythe';
import { fetch } from 'undici';
import { EmbedBuilder } from 'discord.js';
import { sendPaginatedEmbeds } from 'discord.js-embed-pagination';
import Colors from '../../colors';

interface Cookie {
  name: string;
  description: string;
  image: string;
}

async function fetchCookiesData(): Promise<Cookie[]> {
  return (
    await fetch('https://crumbl-api-2.rb32020.workers.dev/')
  ).json() as Promise<Cookie[]>;
}

const crumbl: Command = {
  name: 'crumbl',
  description: 'View the current weekly specialty cookies at Crumbl Cookies!',
  async run({ interaction: i }) {
    await i.deferReply();
    const cookiesData = await fetchCookiesData();

    const embeds = cookiesData.map((c) =>
      new EmbedBuilder()
        .setTitle(c.name)
        .setColor(Colors.embedColor)
        .setDescription(c.description)
        .setThumbnail(c.image)
    );

    await sendPaginatedEmbeds(i, embeds, {
      content: 'Here are the weekly specialty cookies!',
      pageLabel: 'Cookie',
      nextLabel: 'Next Cookie',
      previousLabel: 'Previous Cookie',
    });
  },
};

export default crumbl;
