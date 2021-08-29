import { Command, UI } from '@knighthacks/dispatch';
import axios from 'axios';
import {
  InteractionReplyOptions,
  MessageActionRowOptions,
  MessageEmbed,
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

async function getMessage(
  registerUI: (ui: UI) => MessageActionRowOptions[]
): Promise<InteractionReplyOptions> {
  // Get the image URL.
  const catImageURL = await getCatImage();

  if (!catImageURL) {
    return { content: 'Error fetching Cat Image' };
  }

  const embed = new MessageEmbed()
    .setTitle('Random Cat')
    .setColor(Colors.embedColor)
    .setImage(catImageURL);

  return {
    embeds: [embed],
    components: registerUI({
      style: 'PRIMARY',
      label: 'Another!',
      async onClick({ deferUpdate, editReply }) {
        await deferUpdate();
        const catImage = await getMessage(registerUI);
        await editReply(catImage);
      },
    }),
  };
}

const CatCommand: Command = {
  name: 'cat',
  description: 'Gets a random image of a cat',
  async run({ interaction, registerUI }) {
    // Defer while we fetch the image.
    await interaction.deferReply();

    const message = await getMessage(registerUI);
    await interaction.followUp(message);
  },
};

export default CatCommand;
