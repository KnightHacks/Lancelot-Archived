import {
  ThreadChannel,
  GuildChannel,
  TextChannel,
  Message,
  Client,
  MessageEmbed,
  Guild,
} from 'discord.js';
import { Problem, ProblemInfo, getDifficultyString } from './problemTypes';
import { getAdditionalProblemInfo } from './retrieveProblems';
import * as channels from '../problemChannels.json';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// --------- Execution Functions ---------

export const runProcess = (
  client: Client,
  currentProblems: Problem[]
): void => {
  const postChannel: TextChannel = getChannel(client);

  if (!postChannel)
    throw new Error(
      'Could not find the text channel ' +
        channels.problemChannel +
        ' in the specified guild.'
    );

  sendProblems(postChannel, currentProblems);
};

export const getChannel = (client: Client): TextChannel => {
  // Go through once and look for channel with name 'Daily Challenge Problems' and type 'GUILD_CATEGORY'
  // Get the .id of that category
  // Go back through and look for all channels 'easy', 'medium', and 'hard' with
  // .parentId = .id of the category channel

  const channelData: string | undefined = channels.problemChannel;

  if (!channelData) {
    throw new Error(
      'Could not retrieve channel to send problems to from the environment variable PROBLEM_CHANNEL.'
    );
  }

  const guild: Guild | undefined = client.guilds.cache.get(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    process.env.GUILD_ID!
  );
  if (!guild) {
    throw new Error(
      'Could not access the guild when attempting to send problems.'
    );
  }

  const retrievedChannel: TextChannel = <TextChannel>(
    guild.channels.cache.find(
      (channel: GuildChannel | ThreadChannel) =>
        channel.name.toLowerCase() === channelData.toLowerCase() &&
        channel.type === 'GUILD_TEXT'
    )
  );

  return retrievedChannel;
};

export const sendProblems = async (
  sendChannel: TextChannel,
  problemData: Problem[]
): Promise<void> => {
  // Index 0 is easy problem, index 1 is medium problem, index 2 is hard problem
  const channelData: string | undefined = channels.problemChannel;

  if (!channelData) {
    throw new Error(
      'Could not retrieve channel to send problems to from the environment variable PROBLEM_CHANNEL.'
    );
  }

  for (let i = 0; i < 3; i++) {
    const sendProblem = problemData[i];

    if (!sendProblem) {
      throw new Error(
        'Could not send the ' +
          getDifficultyString(i + 1) +
          ' problem, which was undefined.'
      );
    }

    const today = new Date();
    const stringDate = months[today.getMonth()] + ' ' + today.getDate();

    const message: Message = await sendChannel.send({
      embeds: [await getProblemEmbed(sendProblem)],
    });

    const thread: ThreadChannel = await message.startThread({
      name: 'Discussion (' + stringDate + ') - ' + sendProblem.name,
      autoArchiveDuration: 1440, // One day
    });

    thread.send(
      'This thread will archive after 24h of inactivity.\n\n**Discuss!**'
    );
  }
};

const getProblemEmbed = async (problem: Problem): Promise<MessageEmbed> => {
  const today = new Date();
  const difficultyString = getDifficultyString(problem.difficulty);
  const additionalProblemInfo = await getAdditionalProblemInfo(problem);
  return new MessageEmbed()
    .setTitle(
      `Daily Challenge for ${days[today.getDay()]} ${
        months[today.getMonth()]
      } ${today.getDate()} ${today.getFullYear()}`
    )
    .setURL(problem.URL)
    .addField('Problem', '(' + problem.id + ') ' + problem.name)
    .addField('URL', problem.URL)
    .addField('Submissions', problem.numAttempts.toString(), true)
    .addField('Accepted', problem.numAccepts.toString(), true)
    .addField(
      'Accepted %',
      ((problem.numAccepts / problem.numAttempts) * 100).toFixed(2) + '%',
      true
    )
    .addField('Difficulty', difficultyString, true)
    .addField('Likes', additionalProblemInfo.likes.toString(), true)
    .addField('Dislike', additionalProblemInfo.dislikes.toString(), true)
    .addField('Tagged Topics', generateTagsString(additionalProblemInfo))
    .addField('Similar Problems', generateSimilarString(additionalProblemInfo));
};

const generateSimilarString = (info: ProblemInfo): string => {
  const build = info.similarQuestions.reduce((accumulated, question) => {
    return accumulated + question.difficulty + ' - ' + question.url + '\n';
  }, '');
  return build === '' ? 'None' : build;
};

const generateTagsString = (info: ProblemInfo): string => {
  const build = info.similarQuestions.reduce((accumulated, topic) => {
    if (!topic)
      throw new Error(
        'Trying to generate string of problem topics from an undefined ProblemInfo object. Full similarQuestions array: ' +
          info.similarQuestions
      );

    return accumulated + topic.name + ' - ' + topic.url + '\n';
  }, '');

  return build === '' ? 'None' : build;
};
