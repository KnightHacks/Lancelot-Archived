import { Command } from '@knighthacks/scythe';
import { fetch } from 'undici';
import {
  ApplicationCommandOptionData,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} from 'discord.js';
import { Buffer } from 'buffer';

const url = 'https://carbonara.vercel.app/api/cook';

const options: ApplicationCommandOptionData[] = [
  {
    name: 'input',
    description: 'The source code to format',
    type: ApplicationCommandOptionType.String,
    required: true,
  },
];

async function getImage(code: string) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      code: code,
      backgroundColor: 'rgba(0, 0, 0, 0)',
    }),
  });

  return response.arrayBuffer().then((buffer) => Buffer.from(buffer));
}

const CodeGenCommand: Command = {
  name: 'code',
  description: 'Generate a screenshot of your code',
  options,
  cooldown: 60,
  async run({ interaction }) {
    await interaction.deferReply();

    const code = interaction.options.getString('input', true);
    const buffer = await getImage(code);

    const attachment = new AttachmentBuilder(buffer).setName('code.png');
    await interaction.followUp({ files: [attachment] });
  },
};

export default CodeGenCommand;
