import { Command } from '@knighthacks/dispatch';
import { API, ClubEvent } from '@knighthacks/hackathon';
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
  return new MessageEmbed()
    .setTitle(event.name)
    .setAuthor(event.presenter)
    .setColor(Colors.embedColor)
    .setDescription(event.description)
    .addField('Location', event.location)
    .addField('Starts', event.start.toLocaleString())
    .addField('Ends', event.end.toLocaleString())
    .addField(
      'Tags',
      event.tags.reduce((str, tag) => str + `${tag} `)
    );
}

const ClubEventsCommand: Command = {
  name: 'clubevents',
  description: 'Fetches upcoming Knight Hacks club events.',
  options,
  async run({ interaction }) {
    await interaction.deferReply();

    // const range = interaction.options.getString('range') as
    //   | RelativeDateRange
    //   | undefined;

    const events = await hackathon.club.getEvents();

    if (events === undefined) {
      await interaction.followUp('Error fetching events');
      return;
    }

    if (events.length === 0) {
      await interaction.followUp('There are no events during this period.');
      return;
    }

    const embeds = events.map(generateEmbed);
    await sendPaginatedEmbeds(interaction, embeds);
  },
};

export default ClubEventsCommand;
