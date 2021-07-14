import { CommandInteraction } from 'discord.js';
import { Command } from '@knighthacks/dispatch';

const CoinFlipCommand: Command = {
  name: 'coinflip',
  description: 'Performs a coin flip',
  async run(interaction: CommandInteraction): Promise<void> {
    const flip = Math.round(Math.random());
    const side = flip ? '**heads**' : '**tails**';
    await interaction.reply(`${interaction.user.username}, you got ${side}`);
  }
};

export default CoinFlipCommand;
