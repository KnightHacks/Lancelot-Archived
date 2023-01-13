import { EmbedBuilder } from '@discordjs/builders';
import { Command } from '@knighthacks/scythe';
import { fetch } from 'undici';
import { sendPaginatedEmbeds } from 'discord.js-embed-pagination';
import Colors from '../../colors';

interface APIHackathonEvent {
  attendees_count: number;
  date_time: string;
  description: string;
  end_date_time: string;
  event_status: string;
  event_type: string;
  image: string;
  link: string;
  name: string;
  loc: string;
}

function generateEmbed(event: APIHackathonEvent) {
  const adjustedStart = new Date(event.date_time);
  adjustedStart.setUTCHours(adjustedStart.getUTCHours() + 5);

  const adjustedEnd = new Date(event.end_date_time);
  adjustedEnd.setUTCHours(adjustedEnd.getUTCHours() + 5);

  const unixStartTime = adjustedStart.getTime() / 1000;
  const unixEndTime = adjustedEnd.getTime() / 1000;

  return new EmbedBuilder()
    .setTitle(event.name)
    .setDescription(event.description)
    .setColor(Colors.embedColor)
    .addFields(
      { name: 'Location', value: event.loc },
      { name: 'Date', value: `<t:${unixStartTime}:D>`, inline: true },
      { name: 'Starts', value: `<t:${unixStartTime}:t>`, inline: true },
      { name: 'Ends', value: `<t:${unixEndTime}:t>`, inline: true },
      { name: 'Status', value: event.event_status },
      { name: 'Type', value: event.event_type }
    )
    .setThumbnail(event.image);
}

export async function getEmbedEvents(): Promise<EmbedBuilder[] | undefined> {
  const events = (await fetch(
    'https://api.knighthacks.org/api/events/get_all_events/'
  ).then((res) => res.json())) as { events: APIHackathonEvent[] };

  if (events === undefined) {
    return undefined;
  }

  return events.events.map(generateEmbed);
}

const HackathonEventsCommand: Command = {
  name: 'hackathonevents',
  description: 'Fetches upcoming hackathon events.',
  async run({ interaction }) {
    // await interaction.deferReply();
    // const embeds = await getEmbedEvents();

    // if (embeds === undefined) {
    //   await interaction.followUp('Error fetching events');
    //   return;
    // }

    // if (embeds.length === 0) {
    //   await interaction.followUp('There are not upcoming events.');
    //   return;
    // }

    // await sendPaginatedEmbeds(interaction, embeds, {
    //   pageLabel: 'Event',
    //   nextLabel: 'Next Event',
    //   previousLabel: 'Previous Event',
    // });

    await interaction.reply({
      content: "Hackathon events aren't available right now.",
      ephemeral: true,
    });
  },
};

export default HackathonEventsCommand;
