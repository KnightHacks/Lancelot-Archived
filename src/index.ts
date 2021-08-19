import path from 'path';
import dotenv from 'dotenv';
import { Client } from '@knighthacks/dispatch';
import { countingFilter } from './countingFilter';
import { onWelcome } from './welcomer';
import * as Sentry from '@sentry/node';
import { setupSentry } from './sentry';
import { PresenceData } from 'discord.js';
import { getRandomIntInclusive } from './util/random';
import replies from './replies.json';

// Load env vars.
dotenv.config();

// Setup Sentry
setupSentry();

(async function main() {

  const presence: PresenceData = {
    activities: [
      {
        name: 'Slash Commands',
        type: 'WATCHING'
      }
    ]
  };

  // Create client.
  const client = new Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILD_MEMBERS'], partials: ['MESSAGE'], presence });

  // Load commands in.
  await client.registerCommands(path.join(__dirname, 'commands'));

  if (!process.env.GUILD_ID) {
    throw new Error('GUILD_ID is not set in your env file!');
  }

  client.setGuildID(process.env.GUILD_ID);
  client.registerMessageFilters([countingFilter]);

  // Start up client.
  await client.login(process.env.DISCORD_TOKEN);

  client.on('messageCreate', async message => {
    if (client.isReady()) {
      const everyone = message.guild?.roles.everyone.id;
      if (!everyone) {
        return;
      }

      if (message.mentions.has(everyone)) {
        return;
      }

      if (message.mentions.has(client.user)) {
        const index = getRandomIntInclusive(0, replies.length - 1);
        await message.reply(replies[index] ?? 'Something went wrong!');
      }
    }
  });

  // New user handler
  client.on('guildMemberAdd', async (member) => onWelcome(client.eventHandler.registerUI, member));

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

  console.log('Client is now running.');
})();
