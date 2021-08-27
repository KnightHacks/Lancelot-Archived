import { Client } from 'discord.js';

const CHANNEL_ID = '486628710946963458';

export function sendMOTD(client: Client): void {
  // Get the general channel.
  const channel = client.channels.cache.get(CHANNEL_ID);

  if (!channel) {
    throw new Error('Cannot fetch #general channel!');
  }
}
