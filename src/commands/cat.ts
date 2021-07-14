import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import Colors from '../colors';

const url = 'https://api.thecatapi.com/v1/images/search';

type CatResponse = [{ url: string }];

async function getCatImage(): Promise<string | null> {
  return axios.get<CatResponse>(url)
    .then(response => response.data[0].url)
    .catch(() => null);
}

const CatCommand: Command = {
  name: 'cat',
  description: 'Gets a random image of a cat',
  async run(interaction: CommandInteraction) {
    // Defer while we fetch the image.
    await interaction.defer();

    // Get the image URL.
    const catImageURL = await getCatImage();

    if (!catImageURL) {
      await interaction.followUp({ content: 'Error fetching Cat Image' });
      return;
    }
  
    const embed = new MessageEmbed()
      .setTitle('Random Cat')
      .setColor(Colors.embedColor)
      .setImage(catImageURL);
      
    await interaction.followUp({ embeds: [embed] });
  }
};

export default CatCommand;
