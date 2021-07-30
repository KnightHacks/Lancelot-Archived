import { Command } from '@knighthacks/dispatch';
import { Client, CommandInteraction, GuildMember, Message, MessageActionRow, MessageSelectMenu } from 'discord.js';
const roles = [
  { label: 'OPS', description: 'The Knight Hacks Operations Team' },
  { label: 'Python', description: 'The Python programming language.' },
  { label: 'Java', description: 'The Java programming language.'},
  { label: 'C++', description: 'The C++ programming language.' },
  { label: 'C#', description: 'The C# programming language.' },
  { label: 'JavaScript', description: 'The JavaScript programming language.' },
  { label: 'Typescript', description: 'The TypeScript programming language.' },
  { label: 'HTML/CSS', description: 'Static website creation/design technologies.'},
  { label: 'Rust', description: 'The Rust programming language.' },
  { label: 'Lua', description: 'The Lua programming language.' },
  { label: 'Linux', description: 'The Linux kernel.' },
  { label: 'Windows', description: 'The Windows operating system.'},
  { label: 'MacOS', description: 'The macOS operating system.' },
  { label: 'Math', description: 'The subject of mathematics.' },
  { label: 'Physics', description: 'The subject of physics.' },
];

const roleMenu = new MessageSelectMenu().addOptions(roles.map(role => ({
  label: role.label,
  description: role.description,
  value: role.label,
})))
  .setCustomId('roleSelectMenu')
  .setMaxValues(roles.length);

const row = new MessageActionRow().addComponents([roleMenu]);

function getRoles(client: Client, roles: string[]) {

  if (!process.env.GUILD_ID) {
    throw new Error('GUILD_ID, not set!');
  }

  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  const fetchedRoles = roles.map(role => {
    const fetchedRole = guild?.roles.cache.find(discordRole => discordRole.name === role);
  
    if (!fetchedRole) {
      throw new Error(`Could not fetch role: ${role}`);
    }
  
    return fetchedRole;
  });

  return fetchedRoles;
}

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
    components: [row],
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
      description: 'Remove roles to your account',
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
