import { Command } from '@knighthacks/dispatch';
import axios from 'axios';
import { ApplicationCommandOptionData, MessageAttachment } from 'discord.js';

const url = 'https://carbonara.vercel.app/api/cook';

const options: ApplicationCommandOptionData[] = [
  {
    name: 'input',
    description: 'The source code to format',
    type: 'STRING',
    required: true,
  },
];

async function getImage(code: string) {
  const response = await axios.post<Buffer>(
    url,
    { code, backgroundColor: 'rgba(0, 0, 0, 0)' },
    { responseType: 'arraybuffer' }
  );
  return response.data;
}

const CodeGenCommand: Command = {
  name: 'code',
  description: 'Generate a screenshot of your code',
  options,
  async run({ interaction }) {
    await interaction.deferReply();

    const code = interaction.options.get('input', true).value as string;
    const buffer = await getImage(code);

    const attachment = new MessageAttachment(buffer, 'code.png');
    await interaction.followUp({ files: [attachment] });
  },
};

export default CodeGenCommand;
