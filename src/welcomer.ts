import { UI } from '@knighthacks/dispatch';
import { GuildMember, MessageActionRow } from 'discord.js';
import { KnightHacksLinkButtons } from './components/KnightHacksLinkButtons';
import {
  KnightHacksMajorsMenu,
  KnightHacksRolesMenu,
} from './components/KnightHacksRolesMenu';

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

const majorsMessage = `
__**Majors**__
To add majors, select them from the drop-down.
`;

const linksMessage = `
__**Links**__
Below are some helpful links for Knight Hacks.
`;

export async function onWelcome(
  registerUI: (ui: UI) => MessageActionRow[],
  member: GuildMember
): Promise<void> {
  // Send the DM to the new User.
  try {
    const DM = await member.createDM();
    await DM.send({ content: welcomeMessage });
    await DM.send({
      content: linksMessage,
      components: [KnightHacksLinkButtons],
    });
    await DM.send({
      content: rolesMessage,
      components: registerUI(KnightHacksRolesMenu('add', member)),
    });
    await DM.send({
      content: majorsMessage,
      components: registerUI(KnightHacksMajorsMenu('add', member)),
    });
  } catch {
    console.log("User doesn't allow DMs.");
    return;
  }
}
