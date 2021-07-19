import { CommandInteraction } from 'discord.js';
import { Command, inChannelNames } from '@knighthacks/dispatch';
import { Channels } from '../channels';

const PingCommand: Command = {
  name: 'ping',
  description: 'Displays bot ping latency',
  permissions: inChannelNames(Channels.bot),
  async run(interaction: CommandInteraction) {
    await interaction.reply(`Pong (${interaction.client.ws.ping}ms)`);
  }
};

export default PingCommand;
