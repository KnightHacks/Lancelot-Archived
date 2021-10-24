/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { runProcess } from './util/sendProblems';
import { getAllProblems } from './util/retrieveProblems';
import { Problem } from './util/problemTypes';
import { Client, Guild } from 'discord.js';

// This module doesn't work as an import
// eslint-disable-next-line @typescript-eslint/no-var-requires
const schedule = require('node-schedule');

// --------- Problem Storage ---------

let easyProblems: Problem[], mediumProblems: Problem[], hardProblems: Problem[];

let easyIndex = 0,
  mediumIndex = 0,
  hardIndex = 0;

// --------- Main execution ---------

const generateNextProblems = (): Problem[] => {
  const newProblems: Problem[] = [
    easyProblems[easyIndex]!,
    mediumProblems[mediumIndex]!,
    hardProblems[hardIndex]!,
  ];

  easyIndex = (easyIndex + 1) % easyProblems.length;
  mediumIndex = (mediumIndex + 1) % mediumProblems.length;
  hardIndex = (hardIndex + 1) % hardProblems.length;

  return newProblems;
};

export default async function setupProcess(client: Client) {
  // 24 hour clock
  let triggerHour = 0,
    triggerMinute = 0;

  const scheduleData = process.env.PROBLEM_SEND_TIME;
  if (!scheduleData) throw new Error('Could not load problem send time.');

  const split = scheduleData.split(':');

  if (split.length !== 2)
    throw new Error(
      'Splitting problem send time by the colon did not produce two parts.'
    );
  else if (split[0]!.length > 2 || split[1]!.length !== 4)
    throw new Error('Invalid time string format.');

  triggerHour = parseInt(split[0]!);
  triggerMinute = parseInt(split[1]!.substring(0, split[1]!.length - 2));
  const AM = split[1]?.substring(split[1].length - 2).toLowerCase() === 'am';

  if (
    triggerHour < 1 ||
    triggerHour > 12 ||
    triggerMinute < 0 ||
    triggerMinute > 59
  )
    throw new Error('Problem send time is not valid.');

  // Fix the hour to be 0-23 range
  if (AM) triggerHour %= 12;
  else if (triggerHour !== 12) triggerHour += 12;

  if (!process.env.GUILD_ID || !client.guilds.cache.get(process.env.GUILD_ID))
    throw new Error('Could not retrieve GUILD_ID from env variables.');

  const guild: Guild | undefined = client.guilds.cache.get(
    process.env.GUILD_ID
  );

  if (!guild)
    throw new Error('Could not retrieve the guild matching GUILD_ID.');

  const allProblems: Problem[][] = await getAllProblems();

  if (!allProblems[0] || allProblems[0].length === 0)
    throw new Error('No easy problems retrieved.');
  else if (!allProblems[1] || allProblems[1].length === 0)
    throw new Error('No medium problems retrieved.');
  else if (!allProblems[2] || allProblems[2].length === 0)
    throw new Error('No hard problems retrieved.');

  easyProblems = allProblems[0];
  mediumProblems = allProblems[1];
  hardProblems = allProblems[2];

  const rule = new schedule.RecurrenceRule();
  rule.hour = triggerHour;
  rule.minute = triggerMinute;
  rule.tz = 'America/New_York';

  schedule.scheduleJob(rule, () => {
    generateNextProblems();
    runProcess(client, [
      easyProblems[easyIndex]!,
      mediumProblems[mediumIndex]!,
      hardProblems[hardIndex]!,
    ]);
  });
}
