import { Command, inChannelNames } from '@knighthacks/dispatch';
import { Channels } from '../../channels';

const command: Command = {
  name: 'test',
  description: 'a test command',
  permissionHandler: inChannelNames(Channels.bot),
  async run({ interaction }): Promise<void> {
    await interaction.reply('Hello from dispatch');
  }
};

export default command;
