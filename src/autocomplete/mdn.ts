import { AutocompleteHandler } from '@knighthacks/scythe';
import { searchMDN } from '../util/mdn';

const MDNAutocompletHandler: AutocompleteHandler = {
  commandName: 'mdn',
  async onAutocomplete(interaction) {
    const query = interaction.options.getString('query', true);
    if (query.length === 0) return;
    const documents = await searchMDN(query);

    await interaction.respond(
      documents.map((document) => ({
        name: document.title,
        value: document.title,
      }))
    );
  },
};

export default MDNAutocompletHandler;
