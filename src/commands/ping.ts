import { CommandInteraction } from 'discord.js';
import { Command } from '@knighthacks/dispatch';

const PingCommand: Command = {
  name: 'ping',
  description: 'Displays bot ping latency',
  async run(interaction: CommandInteraction) {
    await interaction.reply(`Pong (${interaction.client.ws.ping}ms)`);
  }
};

export default PingCommand;
