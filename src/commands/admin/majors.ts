import { Command } from '@knighthacks/scythe';
import {
  ApplicationCommandOptionType,
  ComponentType,
  Interaction,
} from 'discord.js';
import {
  majorsMenu,
  onRoleSelect,
} from '../../components/KnightHacksRolesMenu';

const MajorsCommand: Command = {
  name: 'majors',
  description: 'Manage the your majors for this server.',
  options: [
    {
      name: 'add',
      description: 'Add majors to your account',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'remove',
      description: 'Remove majors from your account',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  async run({ interaction }) {
    const action = interaction.options.getSubcommand() as 'add' | 'remove';
    await interaction.reply({
      content: `Pick Majors to ${action}`,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [majorsMenu()],
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

export default MajorsCommand;
