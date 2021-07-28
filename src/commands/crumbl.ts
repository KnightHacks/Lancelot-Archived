import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';

interface Cookie {
  name: string;
  description: string;
  image: string;
}

async function fetchCookiesData(): Promise<Cookie[]> {
  return (
    await axios.get(
      'https://jpswqfm3od.execute-api.us-east-1.amazonaws.com/default/crumbl-api'
    )
  ).data;
}

const crumbl: Command = {
  name: 'crumbl',
  description: 'View the current weekly specialty cookies at Crumbl Cookies!',
  async run(i) {
    await i.defer();
    const cookiesData = await fetchCookiesData();
    await i.followUp({
      content: 'Here are the weekly specialty cookies!',
      embeds: cookiesData.map((c) =>
        new MessageEmbed()
          .setTitle(c.name)
          .setDescription(c.description)
          .setThumbnail(c.image)
      ),
    });
  },
};

export default crumbl;
