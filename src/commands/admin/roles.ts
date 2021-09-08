import { Command } from '@knighthacks/scythe';
import { KnightHacksRolesMenu } from '../../components/KnightHacksRolesMenu';

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
      description: 'Remove roles from your account',
      type: 'SUB_COMMAND',
    },
  ],
  async run({ interaction: { options, reply }, registerUI }) {
    const action = options.getSubcommand() as 'add' | 'remove';
    const ui = KnightHacksRolesMenu(action);
    await reply({
      content: `Pick Roles to ${action}`,
      components: registerUI(ui),
    });
  },
};

export default RolesCommand;
