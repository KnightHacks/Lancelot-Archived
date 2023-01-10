import { Command } from '@knighthacks/scythe';
import { fetch } from 'undici';
import { ButtonStyle, ComponentType, Interaction } from 'discord.js';

const url = 'https://www.affirmations.dev/';

type AffirmationResponse = { affirmation: string };

async function getAffirmation(): Promise<string> {
  return fetch(url)
    .then((response) => response.json())
    .then((response) => `"${(response as AffirmationResponse).affirmation}"`)
    .catch(() => 'Error fetching affirmation.');
}

const AffirmationCommand: Command = {
  name: 'affirmation',
  description: 'Get an affirmation',
  async run({ interaction }) {
    await interaction.deferReply();
    const content = await getAffirmation();

    interaction.followUp({
      content,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              customId: 'affirmationButton',
              label: 'Another!',
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
      const content = await getAffirmation();
      await interaction.editReply({ content });
    });
  },
};

export default AffirmationCommand;
