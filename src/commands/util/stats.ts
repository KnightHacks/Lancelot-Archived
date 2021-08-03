import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Command, inChannelNames } from '@knighthacks/dispatch';
import { Channels } from '../../channels';
import Colors from '../../colors';

const StatsCommand: Command = {
  name: 'stats',
  description: 'Displays statistics for this guild',
  permissionHandler: inChannelNames(Channels.bot),
  async run(interaction: CommandInteraction) {

    const members = interaction.guild?.members.cache;
    const { guild } = interaction;

    if (!members || !guild) {
      await interaction.reply('Error pulling up stats');
      return;
    }

    const totalOnline = members
      .filter((member => member.presence?.status === 'online')).size;
    const totalMembers = members.size;
    const owner = (await guild.fetchOwner()).displayName;

    console.log(interaction.guild?.iconURL());

    const embed = new MessageEmbed()
      .setColor(Colors.embedColor)
      .setTitle(`Server Info - ${guild.name}`)
      .setThumbnail(interaction.guild?.iconURL() ?? '')
      .addField('Created on:', guild.createdAt.toUTCString())
      .addField('Owner:', owner)
      .addField('Total Online:', totalOnline.toString())
      .addField('Total Members:', totalMembers.toString())
      .addField('Nitro Boosters: ', guild.premiumSubscriptionCount?.toString() ?? '0');

    await interaction.reply({ embeds: [embed] });
  }
};

export default StatsCommand;
