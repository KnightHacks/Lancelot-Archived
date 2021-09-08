import { Command } from '@knighthacks/scythe';
import axios from 'axios';

const url = 'https://uselessfacts.jsph.pl/random.json?language=en';

type FactResponse = { text: string | null };

async function getFact(): Promise<string | null> {
  return axios
    .get<FactResponse>(url)
    .then((response) => response.data.text)
    .then((fact) => (fact ? fact.replaceAll('`', "'") : null))
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
  async run({ interaction, registerUI }) {
    const fact = await getFact();
    if (!fact) {
      await interaction.reply({ content: 'Error: `something went wrong.`' });
      return;
    }

    // Send message.
    await interaction.reply({
      content: fact,
      components: registerUI({
        style: 'PRIMARY',
        label: 'New Fact',
        async onClick({ update }) {
          const newFact = await getFact();
          if (newFact) {
            update({ content: newFact });
          } else {
            update({ content: 'Error: `something went wrong.`' });
          }
        },
      }),
    });
  },
};

export default FactCommand;
