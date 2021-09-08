import { Command, inChannelNames } from '@knighthacks/scythe';
import { Channels } from '../../channels';

const PingCommand: Command = {
  name: 'ping',
  description: 'Displays bot ping latency',
  permissionHandler: inChannelNames(Channels.bot),
  async run({ interaction }) {
    await interaction.reply(`Pong (${interaction.client.ws.ping}ms)`);
  },
};

export default PingCommand;
