import path from 'path';
import dotenv from 'dotenv';
import { Client } from '@knighthacks/dispatch';

// Load env vars.
dotenv.config();

(async function main() {
  // Create client.
  const client = new Client({intents: ['GUILDS', 'GUILD_MESSAGES']});

  // Load commands in.
  await client.registerCommands(path.join(__dirname, 'commands'));

  // Start up client.
  await client.login(process.env.DISCORD_TOKEN);

  console.log('Client is now running.');
})();
