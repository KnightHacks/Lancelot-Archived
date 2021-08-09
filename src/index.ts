import path from 'path';
import dotenv from 'dotenv';
import { Client } from '@knighthacks/dispatch';
import { countingFilter } from './countingFilter';
import { onWelcome } from './welcomer';
import * as Sentry from '@sentry/node';
import { setupSentry } from './sentry';

// Load env vars.
dotenv.config();

// Setup Sentry
setupSentry();

(async function main() {
  // Create client.
  const client = new Client({intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_PRESENCES', 'GUILD_MEMBERS'], partials: ['MESSAGE']});

  // Load commands in.
  await client.registerCommands(path.join(__dirname, 'commands'));
  client.registerMessageFilters([countingFilter]);

  // Start up client.
  await client.login(process.env.DISCORD_TOKEN);

  if (client.isReady()) {
    client.user.setPresence({
      activities: [
        {
          name: 'Slash Commands be run.',
          type: 'WATCHING'
        }
      ]
    });
  }


  // New user handler
  client.on('guildMemberAdd', async (member) => onWelcome(client.eventHandler.registerUI, member));

  const transaction = Sentry.startTransaction({
    op: 'test',
    name: 'My First Test Transaction',
  });
  
  setTimeout(() => {
    try {
      throw new Error('test');
    } catch (e) {
      Sentry.captureException(e);
    } finally {
      transaction.finish();
    }
  }, 99);
  console.log('Client is now running.');
})();
