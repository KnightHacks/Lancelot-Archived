import { MessageSelectMenu, MessageActionRow } from 'discord.js';

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
  
const KnightHacksRolesMenu = new MessageActionRow().addComponents([roleMenu]);

export { KnightHacksRolesMenu };
