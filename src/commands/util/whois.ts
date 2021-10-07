import { MessageEmbed } from 'discord.js';
import { Command } from '@knighthacks/scythe';
import Colors from '../../colors';

const WhoIs: Command = {
  type: 'USER',
  name: 'Get User Statistics',
  async run({ interaction }) {
    const guildMember = interaction.guild?.members.cache.get(
      interaction.targetId
    );
    const user = guildMember?.user;

    if (!user || !guildMember) {
      throw new Error(
        `Could not perform whois on user with ID: ${interaction.targetId}`
      );
    }

    await interaction.deferReply();
    if (!user || !user.id) {
      await interaction.followUp('Please give a valid user');
      return;
    }

    const embed = new MessageEmbed({
      color: Colors.embedColor,
      timestamp: interaction.createdTimestamp,
      author: { name: 'User Server Profile', iconURL: user.avatarURL() ?? '' },
      title: `User Info - ${user.username}`,
      thumbnail: { url: guildMember.avatarURL() ?? user.avatarURL() ?? '' },
      fields: [
        { name: 'ID: ', value: user.id, inline: false },
        { name: 'Display Name: ', value: user.username, inline: false },
        {
          name: 'Created Account On: ',
          value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`,
          inline: false,
        },
        {
          name: 'Joined Server On: ',
          value: `<t:${Math.floor(guildMember.joinedTimestamp ?? 0 / 1000)}:D>`,
          inline: false,
        },
      ],
    });

    await interaction.followUp({ embeds: [embed] });
  },
};

export default WhoIs;
