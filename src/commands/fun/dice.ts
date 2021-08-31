import { Command } from '@knighthacks/dispatch';

const numberToString: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
};

const randNumber = () => Math.floor(Math.random() * 6) + 1; // +1 to exclude 0 and include 6

const diceRoll = () => numberToString[randNumber()];

const DiceCommand: Command = {
  name: 'dice',
  description: 'Roll a die to get a random number between 1 and 6',
  async run({ interaction, registerUI }) {
    await interaction.reply({
      content: `You rolled a  :${diceRoll()}:`,
      fetchReply: true,
      components: registerUI({
        style: 'PRIMARY',
        label: 'Reroll',
        async onClick({ update }) {
          await update({ content: `You rolled a  :${diceRoll()}:` });
        },
      }),
    });
  },
};

export default DiceCommand;
