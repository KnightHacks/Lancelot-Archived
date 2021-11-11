import { Command } from '@knighthacks/scythe';
import axios from 'axios';
import { MessageEmbed } from 'discord.js';
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

  return new MessageEmbed()
    .setTitle(event.name)
    .setDescription(event.description)
    .setColor(Colors.embedColor)
    .addField('Location', event.loc)
    .addField('Date', `<t:${unixStartTime}:D>`, true)
    .addField('Start', `<t:${unixStartTime}:t>`, true)
    .addField('End', `<t:${unixEndTime}:t>`, true)
    .addField('Status', event.event_status)
    .addField('Type', event.event_type)
    .setThumbnail(event.image);
}

export async function getEmbedEvents(): Promise<MessageEmbed[] | undefined> {
  const events = await axios.get<{ events: APIHackathonEvent[] }>(
    'https://api.knighthacks.org/api/events/get_all_events/'
  );

  if (events === undefined) {
    return undefined;
  }

  return events.data.events.map(generateEmbed);
}

const HackathonEventsCommand: Command = {
  name: 'hackathonevents',
  description: 'Fetches upcoming hackathon events.',
  async run({ interaction }) {
    await interaction.deferReply();
    const embeds = await getEmbedEvents();

    if (embeds === undefined) {
      await interaction.followUp('Error fetching events');
      return;
    }

    if (embeds.length === 0) {
      await interaction.followUp('There are not upcoming events.');
      return;
    }

    await sendPaginatedEmbeds(interaction, embeds, {
      pageLabel: 'Event',
      nextLabel: 'Next Event',
      previousLabel: 'Previous Event',
    });
  },
};

export default HackathonEventsCommand;
