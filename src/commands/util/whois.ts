import { ApplicationCommandOption, MessageEmbed } from 'discord.js';
import { Command } from '@knighthacks/dispatch';
import Colors from '../../colors';

const options: ApplicationCommandOption[] = [
  {
    name: 'user',
    type: 'USER',
    description: 'Displays the specified user\'s info. If no user is tagged, displays the author\'s info.',
  }
];

const WhoIs: Command = {
  name: 'whois',
  description: 'Displays info about a given user',
  options,
  async run({ interaction }) {
    const user = interaction.options.get('user')?.user ?? interaction.user;
    await interaction.deferReply();
    if(!user || !user.id)
    {
      await interaction.followUp('Please give a valid user');
      return;
    }
    // ! used since the command would have never ran if the user wasnt in the server
    const userJoinedAt = interaction.guild?.members.cache.get(user.id)?.joinedAt?.toUTCString() ?? '<N/A>';

    const embed = new MessageEmbed({
      color: Colors.embedColor,
      timestamp: interaction.createdTimestamp,
      title:`User Info - ${user.username}`,
      thumbnail: {url: user.avatarURL() ?? ''},
      footer: {text: `Requested by ${interaction.member?.user.username}`},
      fields: [
        {name: 'ID: ', value: user.id, inline: false},
        {name: 'Display Name: ', value: user.username, inline: false},
        {name: 'Created Account On: ', value: user.createdAt.toUTCString(), inline: false},
        {name: 'Joined Server On: ', value: userJoinedAt, inline: false},
      ],      
    });
    await interaction.followUp({embeds: [embed]});
  }
};

export default WhoIs;
