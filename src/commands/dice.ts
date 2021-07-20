import { CommandInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';
import { Command } from '@knighthacks/dispatch';

const numberToString: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
};

const rerollButton = new MessageButton()
  .setLabel('Reroll')
  .setCustomId('rerollButton')
  .setStyle('PRIMARY');

const row = new MessageActionRow().addComponents(rerollButton);

const randNumber = () => Math.floor(Math.random() * 6) + 1; // +1 to exclude 0 and include 6

const DiceCommand: Command = {
  name: 'dice',
  description: 'Roll a die to get a random number between 1 and 6',
  async run(interaction: CommandInteraction) {
    // Send message.
    const message = await interaction.reply({ 
      content: `You rolled a  :${numberToString[randNumber()]}:`, 
      fetchReply: true,
      components: [row],
    }) as Message;

    // Create a button collector.
    const collector = message.createMessageComponentCollector({ componentType: 'BUTTON'});

    // Listen for button interactions.
    collector.on('collect', async (collectInteraction) => {
      const rand = Math.floor(Math.random() * 6) + 1;
      await collectInteraction.update({ content: `You rolled a  :${numberToString[rand]}:` });
    });
  }
};

export default DiceCommand;
