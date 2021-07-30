import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { Message } from 'discord.js';
import { singleButtonRow } from '../../util/button';

const url = 'https://uselessfacts.jsph.pl/random.json?language=en';

type FactResponse = { text: string | null };

const row = singleButtonRow({
  label: 'New Fact',
  customId: 'newFactButton',
  style: 'PRIMARY'
});

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
  async run({ interaction }) {
    const fact = await getFact();

    if (fact) {
      // Send message.
      const message = await interaction.reply({
        content: fact.replaceAll('`', '\''),
        fetchReply: true,
        components: [row],
      }) as Message;

      // Create a button collector.
      const collector = message.createMessageComponentCollector({ componentType: 'BUTTON'});

      // Listen for button interactions.
      collector.on('collect', async (collectInteraction) => {
        const fact = await getFact();
        if (fact) {
          await collectInteraction.update({ content: fact.replaceAll('`', '\'') });
        } else {
          await collectInteraction.update({ content: 'Error: `something went wrong.`' });
        }
      });
    } else {
      await interaction.reply({
        content: 'Error: `something went wrong.`'
      });
    }
  }
};

export default FactCommand;
