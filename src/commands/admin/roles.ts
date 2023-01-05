import { Command } from '@knighthacks/scythe';
import { ApplicationCommandOptionType } from 'discord.js';
import { KnightHacksRolesMenu } from '../../components/KnightHacksRolesMenu';

const RolesCommand: Command = {
  name: 'roles',
  description: 'Manage the roles for this server.',
  options: [
    {
      name: 'add',
      description: 'Add roles to your account',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'remove',
      description: 'Remove roles from your account',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  async run({ interaction: { options, reply }, registerUI }) {
    const action = options.getSubcommand() as 'add' | 'remove';
    const ui = KnightHacksRolesMenu(action);
    await reply({
      content: `Pick Roles to ${action}`,
      components: registerUI(ui),
      ephemeral: true,
    });
  },
};

export default RolesCommand;
