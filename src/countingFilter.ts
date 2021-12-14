import { Message } from 'discord.js';
import { Channels } from './channels';
import { getPrevious } from './util/messages';

export async function countingFilter(message: Message): Promise<boolean> {
  const previousMessage = await getPrevious(message);

  const countingChannel = message.guild?.channels.cache.find(
    (channel) => channel.name === Channels.counting
  );

  if (!countingChannel) {
    throw new Error(`Could not find counting channel: ${Channels.counting}`);
  }

  // It's not in the counting channel so we don't care.
  if (message.channel.id !== countingChannel.id) {
    return true;
  }

  if (!previousMessage) {
    return false;
  }

  const previousValue = parseInt(previousMessage.content);
  const newValue = parseFloat(message.content);

  // Verify if number is integer
  if (!Number.isInteger(newValue)) {
    return false;
  }

  return newValue === previousValue + 1;
}
