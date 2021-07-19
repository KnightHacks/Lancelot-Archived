import { CommandInteraction } from 'discord.js';
import { Command, inChannelNames } from '@knighthacks/dispatch';
import { Channels } from '../channels';

const CoinFlipCommand: Command = {
  name: 'coinflip',
  description: 'Performs a coin flip',
  permissions: inChannelNames(Channels.bot),
  async run(interaction: CommandInteraction): Promise<void> {
    const flip = Math.round(Math.random());
    const side = flip ? '**heads**' : '**tails**';
    await interaction.reply(`${interaction.user.username}, you got ${side}`);
  }
};

export default CoinFlipCommand;
