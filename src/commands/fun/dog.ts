import { Command } from '@knighthacks/scythe';
import { fetch } from 'undici';
import {
  InteractionReplyOptions,
  EmbedBuilder,
  ButtonStyle,
  ComponentType,
  Interaction,
} from 'discord.js';
import Colors from '../../colors';

const url = 'https://dog.ceo/api/breeds/image/random';

type DogResponse = { message: string; status: 'success' | 'failure' };

async function getDogImage(): Promise<string | null> {
  return fetch(url)
    .then((response) => response.json() as Promise<DogResponse>)
    .then((response) => response.message)
    .catch(() => null);
}

async function getMessage(): Promise<InteractionReplyOptions> {
  // Get the image URL.
  const dogImageURL = await getDogImage();

  if (!dogImageURL) {
    return { content: 'Error fetching Dog Image' };
  }

  const embed = new EmbedBuilder()
    .setTitle('Random Dog')
    .setColor(Colors.embedColor)
    .setImage(dogImageURL);

  return {
    embeds: [embed],
    components: [
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            style: ButtonStyle.Primary,
            customId: 'dogButton',
            label: 'Another!',
          },
        ],
      },
    ],
  };
}

const DogCommand: Command = {
  name: 'dog',
  description: 'Downloads an image of a dog from the internet',
  cooldown: 60,
  async run({ interaction }) {
    // Defer interaction while we fetch the image.
    await interaction.deferReply();
    await interaction.followUp(await getMessage());

    const filter = (i: Interaction) => i.user.id === interaction.user.id;

    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      time: 60000,
      componentType: ComponentType.Button,
    });

    collector?.on('collect', async (interaction) => {
      await interaction.deferUpdate();
      await interaction.editReply(await getMessage());
    });
  },
};

export default DogCommand;
