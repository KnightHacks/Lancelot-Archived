/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { GuildMember } from 'discord.js';
import { KnightHacksLinkButtons } from './components/KnightHacksLinkButtons';

const welcomeMessage = `
**Hi! I'm Lancelot, the discord bot made for Knight Hacks**
I'm glad you could make it. If you have any questions don't be afraid to ask the staff. 

__**Slash Commands**__
In the Knight Hacks discord if you type \`/\` it'll give a list of the commands I have to offer.

__**Roles**__
To add roles, head over to the #bot-spam and run \`/roles add\`.

__**Majors**__
To add roles, head over to the #bot-spam and run \`/roles add\`.
`;

export async function onWelcome(member: GuildMember): Promise<void> {
  // Send the DM to the new User.
  try {
    const DM = await member.createDM();
    await DM.send({
      content: welcomeMessage,
      components: [KnightHacksLinkButtons],
    });
  } catch {
    console.log("User doesn't allow DMs.");
    return;
  }
}
