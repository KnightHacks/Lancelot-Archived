import path from 'path';
import dotenv from 'dotenv';
import { Client } from '@knighthacks/scythe';
import { countingFilter } from './countingFilter';
import { onWelcome } from './welcomer';
import * as Sentry from '@sentry/node';
import { setupSentry } from './sentry';
import * as random from './util/random';
import replies from './replies.json';
import setupDailyProblems from './problemSchedule';

// Load env vars.
dotenv.config();

// Setup Sentry
setupSentry();

(async function main() {
  if (!process.env.GUILD_ID) {
    throw new Error('GUILD_ID is not set in your env file!');
  }

  // Create client.
  const client = await Client.create({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILD_MEMBERS'],
    partials: ['MESSAGE'],
    presence: {
      activities: [
        {
          name: 'Slash Commands',
          type: 'WATCHING',
        },
      ],
    },
    guildID: process.env.GUILD_ID,
    discordToken: process.env.DISCORD_TOKEN,
    commandsPath: path.join(__dirname, 'commands'),
    messageFilters: [countingFilter],
  });

  client.registerAutocompleteHandlers(path.join(__dirname, 'autocomplete'));

  client.on('messageCreate', async (message) => {
    if (client.isReady()) {
      const everyone = message.guild?.roles.everyone.id;
      if (!everyone) {
        return;
      }

      if (message.mentions.has(everyone)) {
        return;
      }

      if (message.mentions.has(client.user)) {
        await message.reply(random.choice(replies) ?? 'Something went wrong!');
      }
    }
  });

  // New user handler
  client.on('guildMemberAdd', async (member) =>
    onWelcome(client.eventHandler.registerUI, member)
  );

  // Handle command errors.
  client.onError = (_, error) => {
    console.error(error);
    const transaction = Sentry.startTransaction({
      op: 'Command Running',
      name: 'Command Execution',
    });

    Sentry.captureException(error);
    transaction.finish();
  };

  await setupDailyProblems(client);
  console.log('Lancelot is now running.');
})();
