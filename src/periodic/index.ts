import { Client } from 'discord.js';
import { schedule } from 'node-cron';

const at8PM = '0 8 * * *';

export function scheduleTasks(client: Client): void {
  schedule(at8PM, () => {
    console.log('test');
  });
}
