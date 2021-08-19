import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { sendPaginatedEmbeds } from 'discord.js-embed-pagination';
import Colors from '../../colors';

interface Cookie {
  name: string;
  description: string;
  image: string;
}

async function fetchCookiesData(): Promise<Cookie[]> {
  return (
    await axios.get(
      'https://crumbl-api-2.rb32020.workers.dev/'
    )
  ).data;
}

const crumbl: Command = {
  name: 'crumbl',
  description: 'View the current weekly specialty cookies at Crumbl Cookies!',
  async run({ interaction: i }) {
    await i.deferReply();
    const cookiesData = await fetchCookiesData();

    const embeds = cookiesData.map((c) => new MessageEmbed()
      .setTitle(c.name)
      .setColor(Colors.embedColor)
      .setDescription(c.description)
      .setThumbnail(c.image));

    await sendPaginatedEmbeds(i, embeds, {
      content: 'Here are the weekly specialty cookies!'
    });
  }
};

export default crumbl;
