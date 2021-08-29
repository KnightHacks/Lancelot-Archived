import { Command } from '@knighthacks/dispatch';
import axios from 'axios';

const url = 'https://www.affirmations.dev/';

type AffirmationResponse = { affirmation: string };

async function getAffirmation(): Promise<string> {
  return axios
    .get<AffirmationResponse>(url)
    .then((response) => `"${response.data.affirmation}"`)
    .catch(() => 'Error fetching affirmation.');
}

const AffirmationCommand: Command = {
  name: 'affirmation',
  description: 'Get an affirmation',
  async run({ interaction, registerUI }) {
    await interaction.deferReply();

    const content = await getAffirmation();
    interaction.followUp({
      content,
      components: registerUI({
        style: 'PRIMARY',
        label: 'Another!',
        async onClick({ deferUpdate, editReply }) {
          await deferUpdate();
          const content = await getAffirmation();
          await editReply({ content });
        },
      }),
    });
  },
};

export default AffirmationCommand;
