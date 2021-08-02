import { Message } from 'discord.js';

export async function getPrevious(message: Message): Promise<Message | undefined> {
  const result = await message.channel.messages.fetch({
    before: message.id,
    limit: 1,
  });

  return result.first();
}
