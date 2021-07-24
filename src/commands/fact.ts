import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { CommandInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';

const url = 'https://uselessfacts.jsph.pl/random.json?language=en';

type FactResponse = { text: string | null };

const newFactButton = new MessageButton()
  .setLabel('New Fact')
  .setCustomId('newFactButton')
  .setStyle('PRIMARY');

const row = new MessageActionRow().addComponents(newFactButton);

async function getFact(): Promise<string | null> {
  return axios.get<FactResponse>(url)
    .then(response => response.data.text)
    .catch((e) => {
      // Spam limit on api.
      if (e.response.status === 429) {
        return 'Error: `too many requests have been made lately, please try again later.`';
      }
      return null;
    });
}

const FactCommand: Command = {
  name: 'fact',
  description: 'Get a random fact',
  async run(interaction: CommandInteraction) {
    const fact = await getFact();

    if (fact) {
      // Send message.
      const message = await interaction.reply({
        content: fact,
        fetchReply: true,
        components: [row],
      }) as Message;

      // Create a button collector.
      const collector = message.createMessageComponentCollector({ componentType: 'BUTTON'});

      // Listen for button interactions.
      collector.on('collect', async (collectInteraction) => {
        const fact = await getFact();
        if (fact) {
          await collectInteraction.update({ content: fact });
        } else {
          await collectInteraction.update({ content: 'Error: `something went wrong.`' });
        }
      });
    } else {
      await interaction.reply({
        content: 'Error: `something went wrong.`',
        fetchReply: true,
      });
    }
  }
};

export default FactCommand;
