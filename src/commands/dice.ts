import { CommandInteraction } from 'discord.js';
import { Command } from '@knighthacks/dispatch';

const numberToString: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
};

const DiceCommand: Command = {
  name: 'dice',
  description: 'Roll a die to get a random number between 1 and 6',
  async run(interaction: CommandInteraction) {
    const randNumber = Math.floor(Math.random() * 6) + 1; // +1 to exclude 0 and include 6
    await interaction.reply(`You rolled a  :${numberToString[randNumber]}:`);
  }
};

export default DiceCommand;
