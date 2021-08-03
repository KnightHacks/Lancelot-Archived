import { Command } from '@knighthacks/dispatch';
import { CommandInteraction, GuildMember, Message } from 'discord.js';
import { KnightHacksRolesMenu } from '../../common/selectMenu';
import { getRoles } from '../../util/members';

async function removeRoles(user: GuildMember, roles: string[]) {
  // Fetch roles by name.
  const { client } = user;
  
  // Filter out roles the user doesn't currently have.
  const rolesToRemove = getRoles(client, roles)
    .filter(roleToRemove => user.roles.cache.has(roleToRemove.id));

  await user.roles.remove(rolesToRemove);
}

async function addRoles(user: GuildMember, roles: string[]) {
  // Fetch roles by name.
  const { client } = user;

  // Filter out roles that the user already has
  const rolesToAdd = getRoles(client, roles)
    .filter(roleToAdd => !user.roles.cache.has(roleToAdd.id));

  await user.roles.add(rolesToAdd);
}

async function sendMessage(interaction: CommandInteraction, type: 'add' | 'remove') {

  const successMsg = type === 'add' ? 'added' : 'removed';
  const message = await interaction.reply({ 
    content: `Pick Roles to ${type}`,
    components: [KnightHacksRolesMenu],
    fetchReply: true 
  }) as Message;


  const collector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU' });
  collector.on('collect', async (collectInteraction) => {
    if (!collectInteraction.isSelectMenu()) {
      return;
    }

    await collectInteraction.defer({ ephemeral: true });

    const { member, values } = collectInteraction;
    if (type === 'add') {
      await addRoles(member as GuildMember, values);
    } else {
      await removeRoles(member as GuildMember, values);
    }

    await collectInteraction.editReply({ content: `Successfully ${successMsg} selected roles.`});
  });
}

const RolesCommand: Command = {
  name: 'roles',
  description: 'Manage the roles for this server.',
  options: [
    {
      name: 'add',
      description: 'Add roles to your account',
      type: 'SUB_COMMAND'
    },
    {
      name: 'remove',
      description: 'Remove roles from your account',
      type: 'SUB_COMMAND'
    },
  ],
  async run(interaction) {
    const subCommand = interaction.options.getSubCommand();

    if (subCommand === 'add') {
      await sendMessage(interaction, 'add');
    } else {
      await sendMessage(interaction, 'remove');
    }
  }
};

export default RolesCommand;
