import { Command, inChannelNames } from '@knighthacks/dispatch';
import { Channels } from '../../channels';

function getFlip(): string {
  const flip = Math.round(Math.random());
  return flip ? '**heads**' : '**tails**';
}

const CoinFlipCommand: Command = {
  name: 'coinflip',
  description: 'Performs a coin flip',
  permissionHandler: inChannelNames(Channels.bot),
  async run({ interaction, registerUI }): Promise<void> {
    await interaction.reply({
      content: `${interaction.user.username}, you got ${getFlip()}`,
      components: registerUI({
        style: 'PRIMARY',
        label: 'Flip Again',
        async onClick({ update }) {
          await update(`${interaction.user.username}, you got ${getFlip()}`);
        },
      }),
    });
  },
};

export default CoinFlipCommand;
