import { Command } from '@knighthacks/scythe';
import { ButtonStyle, ComponentType, Interaction } from 'discord.js';

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
  async run({ interaction }) {
    await interaction.reply({
      content: `You rolled a  :${diceRoll()}:`,
      fetchReply: true,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              customId: 'diceButton',
              label: 'Reroll',
            },
          ],
        },
      ],
    });

    const filter = (i: Interaction) => i.user.id === interaction.user.id;

    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      time: 1000 * 60 * 5,
      componentType: ComponentType.Button,
    });

    collector?.on('collect', async (interaction) => {
      await interaction.update({
        content: `You rolled a  :${diceRoll()}:`,
      });
    });
  },
};

export default DiceCommand;
