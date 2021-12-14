import { Command } from '@knighthacks/scythe';
import { ApplicationCommandOptionData } from 'discord.js';
import topics from '../../faq.json';

const options: ApplicationCommandOptionData[] = [
  {
    name: 'topic',
    description: 'The topic to learn about',
    type: 'STRING',
    autocomplete: true,
    required: true,
  },
  {
    name: 'tag',
    description: 'The user to tag',
    type: 'USER',
  },
];

const FAQCommand: Command = {
  name: 'faq',
  description: 'Gives a description of a selected FAQ',
  options,
  async run({ interaction }) {
    const selectedTopic = interaction.options.getString('topic', true);
    const { answer } = topics.find((t) => t.name === selectedTopic) ?? {
      answer: 'unknown',
    };

    const user = interaction.options.getUser('tag');

    const response = `${user ? `Response for user ${user}:\n\n` : ''}${answer}`;
    
    await interaction.reply(response);
  },
};

export default FAQCommand;
