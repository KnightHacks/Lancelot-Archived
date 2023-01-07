import { Command, inChannelNames } from '@knighthacks/scythe';
import { ButtonStyle, ComponentType, Interaction } from 'discord.js';
import { Channels } from '../../channels';

function getFlip(): string {
  const flip = Math.round(Math.random());
  return flip ? '**heads**' : '**tails**';
}

const CoinFlipCommand: Command = {
  name: 'coinflip',
  description: 'Performs a coin flip',
  permissionHandler: inChannelNames(Channels.bot),
  async run({ interaction }): Promise<void> {
    await interaction.reply({
      content: `${interaction.user.username}, you got ${getFlip()}`,
      components: [
        {
          type: ComponentType.ActionRow,
          components: [
            {
              type: ComponentType.Button,
              style: ButtonStyle.Primary,
              customId: 'coinflipButton',
              label: 'Flip Again',
            },
          ],
        },
      ],
    });

    const filter = (i: Interaction) => i.user.id === interaction.user.id;

    const collector = interaction.channel?.createMessageComponentCollector({
      filter,
      time: 1000 * 60 * 5,
      componentType: ComponentType.Button,
    });

    collector?.on('collect', async (interaction) => {
      await interaction.update({
        content: `${interaction.user.username}, you got ${getFlip()}`,
      });
    });
  },
};

export default CoinFlipCommand;
