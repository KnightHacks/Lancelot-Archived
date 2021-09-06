import { Command } from '@knighthacks/dispatch';

const URL = 'https://github.com/KnightHacks/Lancelot';

const SourceCommand: Command = {
  name: 'source',
  description: 'The source code for this bot.',
  async run({ interaction }) {
    const content = `Github SHA: \`${
      process.env.GITHUB_SHA ?? 'DEVELOPMENT'
    }\`\nSource: ${URL}`;

    await interaction.reply(content);
  },
};

export default SourceCommand;
