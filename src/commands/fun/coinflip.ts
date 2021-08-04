import { Message } from 'discord.js';
import { Command, inChannelNames } from '@knighthacks/dispatch';
import { Channels } from '../../channels';
import { singleButtonRow } from '../../util/button';

const row = singleButtonRow({
  label: 'Flip Again',
  style: 'PRIMARY',
  customId: 'flipButton',
});

function getFlip(): string {
  const flip = Math.round(Math.random());
  return flip ? '**heads**' : '**tails**';
}

const CoinFlipCommand: Command = {
  name: 'coinflip',
  description: 'Performs a coin flip',
  permissionHandler: inChannelNames(Channels.bot),
  async run({ interaction }): Promise<void> {
    const message = await interaction.reply({ 
      content: `${interaction.user.username}, you got ${getFlip()}`,
      fetchReply: true,
      components: [row],
    }) as Message;

    const collector = message.createMessageComponentCollector({ componentType: 'BUTTON' });
    collector.on('collect', async (i) => {
      await i.update(`${interaction.user.username}, you got ${getFlip()}`);
    });

  }
};

export default CoinFlipCommand;
