import { Command } from '@knighthacks/scythe';
import { fetch } from 'undici';
import { ButtonStyle, ComponentType, Interaction } from 'discord.js';

const url = 'https://uselessfacts.jsph.pl/random.json?language=en';

type FactResponse = { text: string | null };

async function getFact(): Promise<string | null> {
  return fetch(url)
    .then((response) => response.json() as Promise<FactResponse>)
    .then((response) => response.text)
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
  async run({ interaction }) {
    const fact = await getFact();
    if (!fact) {
      await interaction.reply({ content: 'Error: `something went wrong.`' });
      return;
    }

    // Send message.
    await interaction.reply({
      content: fact,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              customId: 'factButton',
              label: 'New Fact',
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
      await interaction.deferUpdate();
      const content = await getFact();
      if (content) {
        await interaction.editReply({ content });
      } else {
        await interaction.editReply({
          content: 'Error: `something went wrong.`',
        });
      }
    });
  },
};

export default FactCommand;
