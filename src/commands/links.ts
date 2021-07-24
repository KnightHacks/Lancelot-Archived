import { Command } from '@knighthacks/dispatch';
import { MessageActionRow, MessageButton } from 'discord.js';

type LinkButtonData = { link: string; label: string };
const links: Record<string, LinkButtonData> = {
  LinkTree: { link: 'https://knighthacks.org/linktree', label: 'Link Tree' },
  Dues: { link: 'https://knighthacks.org/dues', label: 'Pay Dues' },
  Feedback: { link: 'https://knighthacks.org/feedback', label: 'Workshop Feedback' },
  Ops: { link: 'https://knighthacks.org/ops', label: },
};

const buttons: MessageButton[] = Object.entries(links).map(([name, link]) => {
  return new MessageButton()
    .setLabel(name)
    .setStyle('LINK')
    .setURL(link);
});

const row = new MessageActionRow().addComponents(buttons);

const LinksCommand: Command = {
  name: 'links',
  description: 'Gets helpful links for KnightHacks.',
  async run(interaction) {
    await interaction.reply({ content: 'View our links here!', components: [row] });
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
