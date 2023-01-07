import { Command } from '@knighthacks/scythe';
import {
  ApplicationCommandOptionType,
  ComponentType,
  Interaction,
} from 'discord.js';
import { onRoleSelect, rolesMenu } from '../../components/KnightHacksRolesMenu';

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
  async run({ interaction }) {
    const action = interaction.options.getSubcommand() as 'add' | 'remove';
    await interaction.reply({
      content: `Pick Roles to ${action}`,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [rolesMenu()],
        },
      ],
      ephemeral: true,
    });

    const filter = (i: Interaction) => i.user.id === interaction.user.id;

    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      time: 1000 * 60 * 5,
      componentType: ComponentType.StringSelect,
    });

    collector?.on('collect', async (interaction) => {
      await onRoleSelect(interaction, action);
    });
  },
};

export default RolesCommand;
