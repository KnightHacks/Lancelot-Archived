import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { InteractionReplyOptions, Message, MessageEmbed } from 'discord.js';
import Colors from '../../colors';
import { singleButtonRow } from '../../util/button';

const url = 'https://dog.ceo/api/breeds/image/random';

type DogResponse = { message: string; status: 'success' | 'failure' };

const row = singleButtonRow({
  label: 'Another!',
  customId: 'dogButton',
  style: 'PRIMARY',
});

async function getDogImage(): Promise<string | null> {
  return axios
    .get<DogResponse>(url)
    .then((response) => response.data.message)
    .catch(() => null);
}

async function getMessage(): Promise<InteractionReplyOptions> {
  // Get the image URL.
  const dogImageURL = await getDogImage();

  if (!dogImageURL) {
    return { content: 'Error fetching Dog Image' };
  }

  const embed = new MessageEmbed()
    .setTitle('Random Dog')
    .setColor(Colors.embedColor)
    .setImage(dogImageURL);

  return { embeds: [embed], components: [row] };
}

const DogCommand: Command = {
  name: 'dog',
  description: 'Downloads an image of a dog from the internet',
  async run({ interaction }) {
    // Defer interaction while we fetch the image.
    await interaction.deferReply();

    const message = await getMessage();
    const repliedMessage = (await interaction.followUp({
      ...message,
      fetchReply: true,
    })) as Message;

    const collector = repliedMessage.createMessageComponentCollector({
      componentType: 'BUTTON',
    });
    collector.on('collect', async (i) => {
      await i.deferUpdate();
      const dogMessage = await getMessage();
      await i.editReply(dogMessage);
    });
  },
};

export default DogCommand;
