import { Command } from '@knighthacks/scythe';
import { ApplicationCommandOptionData, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

const MDNBase = 'https://developer.mozilla.org';
const searchMDNURL = (query: string) =>
  `${MDNBase}/api/v1/search?q=${query}` as const;

interface MDNDocument {
  mdn_url: string;
  score: number;
  title: string;
  locale: string;
  slug: string;
  popularity: number;
  summary: string;
  highlight: MDNDocumentHighlight;
}

interface MDNDocumentHighlight {
  body: string[];
  title: string;
}

interface MDNResponse {
  documents: MDNDocument[];
}

async function searchMDN(query: string): Promise<MDNDocument[]> {
  return await fetch(searchMDNURL(query))
    .then((res) => res.json())
    .then((json) => (json as MDNResponse).documents);
}

const options: ApplicationCommandOptionData[] = [
  {
    name: 'query',
    description: 'The lookup query for MDN documentation.',
    type: 'STRING',
    required: true,
  },
];

function generateEmbed(doc: MDNDocument): MessageEmbed {
  return new MessageEmbed()
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
