import { Command, inChannelNames } from '@knighthacks/scythe';
import { Channels } from '../../channels';

const PingCommand: Command = {
  name: 'ping',
  description: 'Displays bot ping latency',
  permissionHandler: inChannelNames(Channels.bot),
  async run({ interaction }) {
    const message = await interaction.reply({
      content: 'Ping!',
      fetchReply: true,
    });

    await message.edit(
      `Pong! ${message.createdTimestamp - interaction.createdTimestamp}ms`
    );
  },
};

export default PingCommand;
