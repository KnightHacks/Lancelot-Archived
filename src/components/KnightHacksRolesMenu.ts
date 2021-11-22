import { SelectMenu } from '@knighthacks/scythe';
import { SelectMenuInteraction, GuildMember, Role, Guild } from 'discord.js';

const roles = [
  {
    label: 'OPS',
    description: 'The Knight Hacks Operations Team',
    emoji: '892851216072183868',
  },
  {
    label: 'Python',
    description: 'The Python programming language.',
    emoji: '624252356447567903',
  },
  {
    label: 'Java',
    description: 'The Java programming language.',
    emoji: '624252318027874357',
  },
  {
    label: 'C++',
    description: 'The C++ programming language.',
    emoji: '626922021581750272',
  },
  {
    label: 'C',
    description: 'The C programming language',
    emoji: '892838124579868802',
  },
  {
    label: 'C#',
    description: 'The C# programming language.',
    emoji: '626922461996253204',
  },
  {
    label: 'JavaScript',
    description: 'The JavaScript programming language.',
    emoji: '892848919984345118',
  },
  {
    label: 'Typescript',
    description: 'The TypeScript programming language.',
    emoji: '892837806332850256',
  },
  {
    label: 'HTML/CSS',
    description: 'Static website creation/design technologies.',
    emoji: '892838896549896193',
  },
  {
    label: 'Rust',
    description: 'The Rust programming language.',
    emoji: '626922021376360449',
  },
  {
    label: 'Lua',
    description: 'The Lua programming language.',
    emoji: '626922021355257886',
  },
  {
    label: 'Linux',
    description: 'The Linux kernel.',
    emoji: '626921471888850944',
  },
  {
    label: 'Windows',
    description: 'The Windows operating system.',
    emoji: '624252389700010023',
  },
  {
    label: 'MacOS',
    description: 'The macOS operating system.',
    emoji: '892848628157272134',
  },
  {
    label: 'Math',
    description: 'The subject of mathematics.',
    emoji: '632647801590906940',
  },
  {
    label: 'Physics',
    description: 'The subject of physics.',
    emoji: '892849713433423922',
  },
];

const majors = [
  'Computer Science',
  'Computer Engineering',
  'Information Technology',
  'Engineering',
  'Biology',
  'Chemistry',
  'Mathematics',
  'Physics',
  'Digital Media - Web Design',
  'Digital Media - Game Design',
  'Communication',
  'Performing Arts',
  'Graphic Design',
  'Psychology',
  'Philosophy',
  'Business',
  'Medical',
  'Nursing',
  'Hospitality',
];

const getRole = (guild: Guild, roleName: string) =>
  guild.roles.cache.find((role) => role.name === roleName);

export function KnightHacksMajorsMenu(
  action: 'add' | 'remove',
  maybeMember?: GuildMember
): SelectMenu {
  const rolesMenu: SelectMenu = {
    options: majors.map((major) => ({ label: major })),
    maxValues: 2,
    placeholder: 'Select Majors',
    async onSelect({
      deferReply,
      editReply,
      member: interactionMember,
      values: majorNames,
    }: SelectMenuInteraction) {
      await deferReply({ ephemeral: true });
      const member: GuildMember =
        maybeMember ?? (interactionMember as GuildMember);
      const roles: (Role | undefined)[] = majorNames.map((roleName) => {
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
        content: `Successfully ${successMsg} selected majors.`,
      });
    },
  };
  return rolesMenu;
}

function KnightHacksRolesMenu(
  action: 'add' | 'remove',
  maybeMember?: GuildMember
): SelectMenu {
  const rolesMenu: SelectMenu = {
    options: roles,
    maxValues: roles.length,
    placeholder: 'Select Roles',
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
