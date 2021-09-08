/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UI } from '@knighthacks/scythe';
import { GuildMember, MessageActionRow } from 'discord.js';
import { KnightHacksLinkButtons } from './components/KnightHacksLinkButtons';
import {
  KnightHacksMajorsMenu,
  KnightHacksRolesMenu,
} from './components/KnightHacksRolesMenu';
import { getEmbedEvents } from './commands/admin/clubEvents';

const welcomeMessage = `
**Hi! I'm Lancelot, the discord bot made for Knight Hacks**
I'm glad you could make it. If you have any questions don't be afraid to ask the staff. 

__**Slash Commands**__
In the Knight Hacks discord if you type \`/\` it'll give a list of the commands I have to offer.

__**Roles**__
To add roles, select them from the drop-down. Adding specific roles will grant you access to channels.

__**Majors**__
To add majors, select them from the drop-down.

__**Events**__
Below is the list of upcoming events we have planned.
`;

export async function onWelcome(
  registerUI: (ui: UI) => MessageActionRow[],
  member: GuildMember
): Promise<void> {
  // Send the DM to the new User.
  try {
    const DM = await member.createDM();
    const embeds = await getEmbedEvents();

    await DM.send({
      content: welcomeMessage,
      embeds,
      components: [
        registerUI(KnightHacksRolesMenu('add', member))[0]!,
        registerUI(KnightHacksMajorsMenu('add', member))[0]!,
        KnightHacksLinkButtons,
      ],
    });
  } catch {
    console.log("User doesn't allow DMs.");
    return;
  }
}
