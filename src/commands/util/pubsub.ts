import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { camelizeKeys } from 'humps';
import { sendPaginatedEmbeds } from 'discord.js-embed-pagination';
import { toTitleCase } from '../../util/formatters';

const URL = 'https://api.pubsub-api.dev/onsale';

type SubData = {
  image: string;
  lastOnSale: string;
  name: string;
  onSale: string;
  price: string;
  queryName: string;
};

async function getSubs(): Promise<SubData[] | null> {
  return await axios.get<SubData[]>(URL)
    .then(response => camelizeKeys(response.data) as SubData[])
    .catch((error) => {
      console.log(error);
      return null;
    });
}

function generateSubEmbed(data: SubData) {
  return new MessageEmbed()
    .setTitle(toTitleCase(data.name))
    .setImage(data.image)
    .addField('Price', data.price)
    .addField('On Sale?', data.onSale === 'True' ? 'Yup!' : 'Nope!')
    .addField('Last on Sale', data.lastOnSale);
}

const PubSubCommand: Command = {
  name: 'pubsub',
  description: 'Fetches the current sales on Publix Subs.',
  async run ({ interaction }) {
    await interaction.deferReply();

    // We only want a max of ten subs.
    const subs = (await getSubs())?.slice(0, 10);
    if (!subs) {
      await interaction.followUp('Could not fetch subs.');
      return;
    }

    const embeds = subs.map(generateSubEmbed);
    await sendPaginatedEmbeds(interaction, embeds);
  }
};

export default PubSubCommand;
