import { ApplicationCommandOption, CommandInteraction, MessageEmbed } from 'discord.js';
import { Command } from '@knighthacks/dispatch';

const options: ApplicationCommandOption[] = [
  {
    name: 'user',
    type: 'USER',
    description: 'The user to vibe check',
  }
];

const WhoIs: Command = {
  name: 'whois',
  description: 'Displays info about a given user',
  options,
  async run(interaction: CommandInteraction) {
    const user = interaction.options.get('user')?.user;
    await interaction.defer();
    if(!user || !user.id)
    {
      await interaction.followUp('Please give a valid user');
      return;
    }
    // ! used since the command would have never ran if the user wasnt in the server
    const userJoinedAt = interaction.guild?.members.cache.get(user.id)?.joinedAt?.toUTCString()!;


    const embed = new MessageEmbed({
      color: 0x7ce4f7,
      timestamp: interaction.createdTimestamp,
      title:'User Info - {member}',
      thumbnail: {proxyURL: user.avatarURL() ?? ''},
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
