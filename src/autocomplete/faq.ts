import { AutocompleteHandler } from '@knighthacks/scythe';
import topics from '../faq.json';

const FAQHandler: AutocompleteHandler = {
  commandName: 'faq',
  async onAutocomplete(interaction) {
    const inputTopic = interaction.options.getString('topic', true);
    await interaction.respond(
      topics
        .filter((topic) => topic.name.includes(inputTopic))
        .map((topic) => ({
          name: topic.name,
          value: topic.name,
        }))
    );
  },
};

export default FAQHandler;
