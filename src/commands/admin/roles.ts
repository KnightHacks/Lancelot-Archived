import { Command, SelectMenuOptions } from '@knighthacks/dispatch';
import { Guild, GuildMember, Role, SelectMenuInteraction } from 'discord.js';

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

const RolesCommand: Command = {
  name: 'roles',
  description: 'Manage the roles for this server.',
  options: [
    {
      name: 'add',
      description: 'Add roles to your account',
      type: 'SUB_COMMAND',
    },
    {
      name: 'remove',
      description: 'Remove roles to your account',
      type: 'SUB_COMMAND',
    },
  ],
  async run({ interaction: { options, reply, guild }, registerUI }) {
    if (!guild) {
      await reply({
        content: 'Unexpected null guild!',
      });
      return;
    }
    const action = options.getSubcommand() as 'add' | 'remove';
    const ui: SelectMenuOptions = {
      options: roles.map((role) => ({
        label: role.label,
        description: role.description,
      })),
      maxValues: roles.length,
      async onSelect({
        defer,
        editReply,
        member,
        values: roleNames,
      }: SelectMenuInteraction) {
        await defer({ ephemeral: true });
        if (!member || !(member instanceof GuildMember)) {
          await editReply({
            content: `Invalid member property: ${member}`,
          });
          return;
        }
        const roles: (Role | undefined)[] = roleNames.map((roleName) =>
          getRole(guild, roleName)
        );
        const validRoles = roles.filter((role): role is Role => !!role);
        // FIXME this error message could be better
        if (roles.filter((role) => role === undefined).length > 0) {
          await editReply({ content: 'Role lookup failed!' });
          return;
        }
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
    await reply({
      content: `Pick Roles to ${action}`,
      components: registerUI(ui),
    });
  },
};

export default RolesCommand;
