import { MessageEmbed } from 'discord.js';
import { Command, inChannelNames } from '@knighthacks/dispatch';
import { Channels } from '../../channels';
import { sendPaginatedEmbeds } from 'discord.js-embed-pagination';

const embed1 = new MessageEmbed()
  .setTitle('test1');
const embed2 = new MessageEmbed()
  .setTitle('test2');
const embed3 = new MessageEmbed()
  .setTitle('test3');

const command: Command = {
  name: 'test',
  description: 'a test command',
  permissionHandler: inChannelNames(Channels.bot),
  async run({ interaction }): Promise<void> {
    await sendPaginatedEmbeds(interaction, [
      embed1,
      embed2,
      embed3,
    ], {
      nextLabel: 'Bar',
      previousLabel: 'foo',
      style: 'DANGER',
    });
  }
};

export default command;
