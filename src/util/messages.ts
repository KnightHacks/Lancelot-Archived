import { Message, PartialMessage } from 'discord.js';

export async function getPrevious(
  message: Message | PartialMessage
): Promise<Message | undefined> {
  const result = await message.channel.messages.fetch({
    before: message.id,
    limit: 1,
  });

  return result.first();
}
