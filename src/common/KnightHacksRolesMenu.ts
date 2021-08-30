import { SelectMenu } from '@knighthacks/dispatch';
import { SelectMenuInteraction, GuildMember, Role, Guild } from 'discord.js';

const roles = [
  { label: 'OPS', description: 'The Knight Hacks Operations Team' },
  { label: 'Python', description: 'The Python programming language.' },
  { label: 'Java', description: 'The Java programming language.' },
  { label: 'C++', description: 'The C++ programming language.' },
  { label: 'C#', description: 'The C# programming language.' },
  { label: 'JavaScript', description: 'The JavaScript programming language.' },
  { label: 'Typescript', description: 'The TypeScript programming language.' },
  {
    label: 'HTML/CSS',
    description: 'Static website creation/design technologies.',
  },
  { label: 'Rust', description: 'The Rust programming language.' },
  { label: 'Lua', description: 'The Lua programming language.' },
  { label: 'Linux', description: 'The Linux kernel.' },
  { label: 'Windows', description: 'The Windows operating system.' },
  { label: 'MacOS', description: 'The macOS operating system.' },
  { label: 'Math', description: 'The subject of mathematics.' },
  { label: 'Physics', description: 'The subject of physics.' },
];

const getRole = (guild: Guild, roleName: string) =>
  guild.roles.cache.find((role) => role.name === roleName);

function KnightHacksRolesMenu(
  action: 'add' | 'remove',
  maybeMember?: GuildMember
): SelectMenu {
  const rolesMenu: SelectMenu = {
    options: roles,
    maxValues: roles.length,
    async onSelect({
      deferReply,
      editReply,
      member: interactionMember,
      values: roleNames,
    }: SelectMenuInteraction) {
      await deferReply({ ephemeral: true });
      const member: GuildMember =
        maybeMember ?? (interactionMember as GuildMember);
      const roles: (Role | undefined)[] = roleNames.map((roleName) => {
        const role = getRole(member.guild, roleName);
        if (!role) console.log(`Role lookup for ${roleName} failed!`);
        return role;
      });
      const validRoles = roles.filter((role): role is Role => !!role);
      if (action === 'add') {
        validRoles.forEach((role) => member.roles.add(role));
      } else {
        validRoles.forEach((role) => member.roles.remove(role));
      }
      const successMsg = action === 'add' ? 'added' : 'removed';
      await editReply({
        content: `Successfully ${successMsg} selected roles.`,
      });
    },
  };
  return rolesMenu;
}

export { KnightHacksRolesMenu };
