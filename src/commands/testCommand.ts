import { CommandInteraction } from 'discord.js';
import { Command, inChannels } from '@knighthacks/dispatch';
import { Channels } from '../channels';

const command: Command = {
  name: 'test',
  description: 'a test command',
  permissions: inChannels(Channels.bot),
  async run(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Hello from dispatch');
  }
};

export default command;
