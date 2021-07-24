import { Command } from '@knighthacks/dispatch';
import { MessageActionRow, MessageButton } from 'discord.js';

type LinkButtonData = { link: string; label: string };
const links: LinkButtonData[] = [
  { link: 'https://club.knighthacks.org/', label: 'Website' },
  { link: 'https://knighthacks.org/linktree', label: 'Link Tree' },
  { link: 'https://knighthacks.org/dues', label: 'Pay Dues' },
  { link: 'https://knighthacks.org/feedback', label: 'Workshop Feedback' },
  { link: 'https://knighthacks.org/ops', label: 'Operator Meetings' },
];

const buttons: MessageButton[] = links.map(data => {
  return new MessageButton()
    .setLabel(data.label)
    .setStyle('LINK')
    .setURL(data.link);
});

const row = new MessageActionRow().addComponents(buttons);

const LinksCommand: Command = {
  name: 'links',
  description: 'Gets helpful links for KnightHacks.',
  async run(interaction) {
    await interaction.reply({ content: '**Here\'s some helpful KnightHacks links!**', components: [row] });
  }
};

export default LinksCommand;



// async def khlinks(self, ctx):
//         links = (
//             """[Find current events happening this week!](https://knighthacks.org/linktree)
//             \n[Pay your dues](https://knighthacks.org/dues)\n
//             [Give feedback on a specific workshop]"""
//             """(https://knighthacks.org/feedback)\n
//             [Sign up to be a Knight Hacks club member]"""
//             """(https://knighthacks.org/membership)\n
//             [Come to our ops meeting](https://knighthacks.org/ops)""")

//         await ctx.send(
//             f"{ctx.author.mention}"
//         )
//         embed = discord.Embed(color=0x7ce4f7, timestamp=ctx.message.created_at)
//         embed.add_field(name="KnightHacks links", value=links)
//         embed.set_thumbnail(
//             url="https://github.com/lienne/ModiBot/blob/master/cogs/img/headphonesdog.png?raw=true"
//         )
//         await ctx.send(embed=embed)
