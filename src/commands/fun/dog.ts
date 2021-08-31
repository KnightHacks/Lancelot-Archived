import { Command, UI } from '@knighthacks/dispatch';
import axios from 'axios';
import {
  InteractionReplyOptions,
  MessageActionRow,
  MessageEmbed,
} from 'discord.js';
import Colors from '../../colors';

const url = 'https://dog.ceo/api/breeds/image/random';

type DogResponse = { message: string; status: 'success' | 'failure' };

async function getDogImage(): Promise<string | null> {
  return axios
    .get<DogResponse>(url)
    .then((response) => response.data.message)
    .catch(() => null);
}

async function getMessage(
  registerUI: (ui: UI) => MessageActionRow[]
): Promise<InteractionReplyOptions> {
  // Get the image URL.
  const dogImageURL = await getDogImage();

  if (!dogImageURL) {
    return { content: 'Error fetching Dog Image' };
  }

  const embed = new MessageEmbed()
    .setTitle('Random Dog')
    .setColor(Colors.embedColor)
    .setImage(dogImageURL);

  return {
    embeds: [embed],
    components: registerUI({
      style: 'PRIMARY',
      label: 'Another!',
      async onClick({ deferUpdate, editReply }) {
        await deferUpdate();
        const dogMessage = await getMessage(registerUI);
        await editReply(dogMessage);
      },
    }),
  };
}

const DogCommand: Command = {
  name: 'dog',
  description: 'Downloads an image of a dog from the internet',
  async run({ interaction, registerUI }) {
    // Defer interaction while we fetch the image.
    await interaction.deferReply();
    await interaction.followUp(await getMessage(registerUI));
  },
};

export default DogCommand;
