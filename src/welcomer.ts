import { Client, GuildMember, Message } from 'discord.js';
import { KnightHacksLinkButtons } from './common/button';
import { KnightHacksRolesMenu } from './common/selectMenu';
import { getRoles } from './util/members';

const welcomeMessage = `
**Hi! I'm Lancelot, the discord bot made for Knight Hacks**
I'm glad you could make it. If you have any questions don't be afraid to ask the staff. 

__**Slash Commands**__
In the Knight Hacks discord if you type \`/\` it'll give a list of the commands I have to offer.\n
`;

const rolesMessage = `
__**Roles**__
To add roles, select them from the drop-down. Adding specific roles will grant you access to channels.
`;

const linksMessage = `
__**Links**__
Below are some helpful links for Knight Hacks.
`;
  
async function addRoles(client: Client, user: GuildMember, roles: string[]) {

  // Filter out roles that the user already has
  const rolesToAdd = getRoles(client, roles)
    .filter(roleToAdd => !user.roles.cache.has(roleToAdd.id));
  
  await user.roles.add(rolesToAdd);
}

export async function onWelcome(client: Client, member: GuildMember): Promise<void> {

  // Send the DM to the new User.
  let message: Message | undefined;
  try {
    const DM = await member.createDM();
    await DM.send({ content: welcomeMessage });
    await DM.send({ content: linksMessage, components: [KnightHacksLinkButtons] });
    message = await DM.send({ content: rolesMessage, components: [KnightHacksRolesMenu] });
  } catch {
    console.log('User doesn\'t allow DM\'s.');
    return;
  }

  if (!message) {
    throw new Error('Could not look up DM message');
  }

  // Create a collector.
  const collector = message.createMessageComponentCollector({ componentType: 'SELECT_MENU' });
  collector.on('collect', async (interaction) => {
    if (!interaction.isSelectMenu()) {
      return;
    }
  
    await interaction.defer();
  
    const { values, user } = interaction;
    const { id } = user;
   
    if (!process.env.GUILD_ID) {
      throw new Error('GUILD_ID is not set');
    }

    // Fetch guild member (since this a DM)
    const guildMember = client.guilds.cache.get(process.env.GUILD_ID)?.members.cache.get(id);
    await addRoles(client, guildMember as GuildMember, values);
    await interaction.editReply({ content: 'Successfully added selected roles.'});
  });
}
