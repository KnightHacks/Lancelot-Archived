import { CommandInteraction } from 'discord.js';
import { Command, inChannels } from '@knighthacks/dispatch';
import { Channels } from '../channels';

const PingCommand: Command = {
  name: 'ping',
  description: 'Displays bot ping latency',
  permissions: inChannels(Channels.bot),
  async run(interaction: CommandInteraction) {
    await interaction.reply(`Pong (${interaction.client.ws.ping}ms)`);
  }
};

export default PingCommand;
