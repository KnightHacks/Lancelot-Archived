import { Command } from '@knighthacks/scythe';
import axios from 'axios';
import {
  InteractionReplyOptions,
  EmbedBuilder,
  ComponentType,
  ButtonStyle,
  Interaction,
} from 'discord.js';
import Colors from '../../colors';

const url = 'https://api.thecatapi.com/v1/images/search';

type CatResponse = [{ url: string }];

async function getCatImage(): Promise<string | null> {
  return axios
    .get<CatResponse>(url)
    .then((response) => response.data[0].url)
    .catch(() => null);
}

async function getMessage(): Promise<InteractionReplyOptions> {
  // Get the image URL.
  const catImageURL = await getCatImage();

  if (!catImageURL) {
    return { content: 'Error fetching Cat Image' };
  }

  const embed = new EmbedBuilder()
    .setTitle('Random Cat')
    .setColor(Colors.embedColor)
    .setImage(catImageURL);

  return {
    embeds: [embed],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
            customId: 'catButton',
          },
        ],
      },
    ],
  };
}

const CatCommand: Command = {
  name: 'cat',
  description: 'Gets a random image of a cat',
  cooldown: 60,
  async run({ interaction }) {
    // Defer while we fetch the image.
    await interaction.deferReply();

    const message = await getMessage();
    await interaction.followUp(message);

    const filter = (i: Interaction) => i.user.id === interaction.user.id;

    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      time: 1000 * 60 * 5,
      componentType: ComponentType.Button,
    });

    collector?.on('collect', async (interaction) => {
      await interaction.deferUpdate();
      const message = await getMessage();
      await interaction.editReply(message);
    });
  },
};

export default CatCommand;
