import { Command } from '@knighthacks/dispatch';
import { API, ClubEvent } from '@knighthacks/hackathon';
import { RelativeDate } from '@knighthacks/hackathon/dist/controllers/club';
import { ApplicationCommandOptionData, MessageEmbed } from 'discord.js';
import { sendPaginatedEmbeds } from 'discord.js-embed-pagination';
import Colors from '../../colors';

// type RelativeDateRange = 'Today' | 'NextWeek' | 'NextMonth' | 'NextYear';

const hackathon = new API();

const options: ApplicationCommandOptionData[] = [
  {
    name: 'range',
    type: 'STRING',
    description: 'The relative date range to fetch events from.',
    choices: [
      {
        name: 'Today',
        value: 'Today',
      },
      {
        name: 'NextWeek',
        value: 'NextWeek',
      },
      {
        name: 'NextMonth',
        value: 'NextMonth',
      },
      {
        name: 'NextYear',
        value: 'NextYear',
      },
    ],
  },
];

function generateEmbed(event: ClubEvent) {
  const unixStartTime = event.start.getTime() / 1000;
  const unixEndTime = event.end.getTime() / 1000;

  return new MessageEmbed()
    .setTitle(event.name)
    .setAuthor(event.presenter)
    .setColor(Colors.embedColor)
    .setDescription(event.description)
    .addField('Location', event.location)
    .addField('Date', `<t:${unixStartTime}:D>`, true)
    .addField('Starts', `<t:${unixStartTime}:t>`, true)
    .addField('Ends', `<t:${unixEndTime}:t>`, true)
    .addField('Tags', event.tags.map((tag) => `\`${tag}\``).join(', '));
}

export async function getEmbedEvents(
  range?: RelativeDate
): Promise<MessageEmbed[] | undefined> {
  const events = await hackathon.club.getEvents({
    rdate: range ?? 'Today',
    confirmed: true,
    count: 10,
  });

  if (events === undefined) {
    return undefined;
  }

  const embeds = events.map(generateEmbed);
  return embeds;
}

const ClubEventsCommand: Command = {
  name: 'clubevents',
  description: 'Fetches upcoming Knight Hacks club events.',
  options,
  async run({ interaction }) {
    await interaction.deferReply();

    const range = interaction.options.getString('range') as
      | RelativeDate
      | undefined;

    const embeds = await getEmbedEvents(range);

    if (embeds === undefined) {
      await interaction.followUp('Error fetching events');
      return;
    }

    if (embeds.length === 0) {
      await interaction.followUp('There are no events during this period.');
      return;
    }

    await sendPaginatedEmbeds(interaction, embeds, {
      pageLabel: 'Event',
      nextLabel: 'Next Event',
      previousLabel: 'Previous Event',
    });
  },
};

export default ClubEventsCommand;
