import { Command } from '@knighthacks/scythe';
import {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  EmbedBuilder,
} from 'discord.js';
import { MDNBase, MDNDocument, searchMDN } from '../../util/mdn';

const options: ApplicationCommandOptionData[] = [
  {
    name: 'query',
    description: 'The lookup query for MDN documentation.',
    type: ApplicationCommandOptionType.String,
    required: true,
    autocomplete: true,
  },
];

function generateEmbed(doc: MDNDocument): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(doc.title)
    .setURL(`${MDNBase}/docs/${doc.slug}`)
    .setDescription(doc.summary);
}

const MDNCommand: Command = {
  name: 'mdn',
  description: 'Search MDN documentation.',
  options,
  async run({ interaction }) {
    await interaction.deferReply();
    const query = interaction.options.getString('query', true);

    const documents = await searchMDN(query);

    if (documents.length < 1) {
      await interaction.followUp({
        content: `No results matching the query '${query}' were found`,
        ephemeral: true,
      });
      return;
    }

    await interaction.followUp({
      content: 'MDN Results:',
      embeds: [generateEmbed(documents[0])],
    });
  },
};

export default MDNCommand;
