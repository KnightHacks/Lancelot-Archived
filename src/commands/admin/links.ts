import { Command } from '@knighthacks/dispatch';
import { KnightHacksLinkButtons } from '../../common/button';

const LinksCommand: Command = {
  name: 'links',
  description: 'Gets helpful links for Knight Hacks.',
  async run({ interaction }) {
    await interaction.reply({ content: '**Here\'s some helpful Knight Hacks links!**', components: [KnightHacksLinkButtons] });
  }
};

export default LinksCommand;
