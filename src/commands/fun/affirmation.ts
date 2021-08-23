import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { Message } from 'discord.js';
import { singleButtonRow } from '../../util/button';

const url = 'https://www.affirmations.dev/';
const row = singleButtonRow({
  label: 'Another!',
  style: 'PRIMARY',
  customId: 'affirmationButton',
});

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
  async run({ interaction }) {
    await interaction.deferReply();

    const content = await getAffirmation();
    const message = (await interaction.followUp({
      content,
      components: [row],
      fetchReply: true,
    })) as Message;

    const collector = message.createMessageComponentCollector({
      componentType: 'BUTTON',
    });
    collector.on('collect', async (collectInteraction) => {
      await collectInteraction.deferUpdate();

      const content = await getAffirmation();
      await collectInteraction.editReply({ content });
    });
  },
};

export default AffirmationCommand;
