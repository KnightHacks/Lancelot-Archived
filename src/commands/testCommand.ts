import { CommandInteraction } from 'discord.js';
import { Command } from 'dispatch';

const command: Command = {
  name: 'test',
  description: 'a test command',
  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Hello from dispatch');
  }
};

export default command;
