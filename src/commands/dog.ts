import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Colors from '../colors';

const url = 'https://dog.ceo/api/breeds/image/random';

type DogResponse = { message: string; status: 'success' | 'failure' };

async function getDogImage(): Promise<string | null> {
  return axios.get<DogResponse>(url)
    .then(response => response.data.message)
    .catch(() => null);
}

const DogCommand: Command = {
  name: 'dog',
  description: 'Downloads an image of a dog from the internet',
  async run(interaction: CommandInteraction) {

    // Defer interaction while we fetch the image.
    await interaction.defer();

    const dogImageURL = await getDogImage();
    
    if (!dogImageURL) {
      await interaction.followUp({ content: 'Error fetching Dog Image' });
      return;
    }

    const embed = new MessageEmbed()
      .setTitle('Random Dog')
      .setColor(Colors.embedColor)
      .setImage(dogImageURL);
    
    await interaction.followUp({ embeds: [embed] });
  }
};

export default DogCommand;
