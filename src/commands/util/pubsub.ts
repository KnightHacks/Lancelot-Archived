import { Command } from '@knighthacks/scythe';
import axios from 'axios';
import { EmbedBuilder } from 'discord.js';
import { camelizeKeys } from 'humps';
import { sendPaginatedEmbeds } from 'discord.js-embed-pagination';
import { toTitleCase } from '../../util/formatters';
import Colors from '../../colors';

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
  return await axios
    .get<SubData[]>(URL)
    .then((response) => camelizeKeys(response.data) as SubData[])
    .catch((error) => {
      console.log(error);
      return null;
    });
}

function generateSubEmbed(data: SubData) {
  return new EmbedBuilder()
    .setTitle(toTitleCase(data.name))
    .setImage(data.image)
    .setColor(Colors.embedColor)
    .addFields([
      { name: 'Price', value: data.price, inline: true },
      {
        name: 'On Sale?',
        value: data.onSale === 'True' ? 'Yup!' : 'Nope!',
        inline: true,
      },
      { name: 'Last on Sale', value: data.lastOnSale, inline: true },
    ]);
}

const PubSubCommand: Command = {
  name: 'pubsub',
  description: 'Fetches the current sales on Publix Subs.',
  async run({ interaction }) {
    await interaction.deferReply();

    // We only want a max of ten subs.
    const subs = (await getSubs())?.slice(0, 10);
    if (!subs) {
      await interaction.followUp('Could not fetch subs.');
      return;
    }

    const embeds = subs.map(generateSubEmbed);
    await sendPaginatedEmbeds(interaction, embeds, {
      nextLabel: 'Next Sub',
      previousLabel: 'Previous Sub',
      pageLabel: 'Sub',
    });
  },
};

export default PubSubCommand;
