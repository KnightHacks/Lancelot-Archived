/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getChannel, sendProblems } from './util/sendProblems';
import { getAllProblems } from './util/retrieveProblems';
import { Problem } from './util/problemTypes';
import { Client, TextChannel } from 'discord.js';
import { RecurrenceRule, scheduleJob } from 'node-schedule';
import * as channels from './problemChannels.json';

// --------- Problem Storage ---------

let easyProblems: Problem[];
let mediumProblems: Problem[];
let hardProblems: Problem[];

let easyIndex = 0;
let mediumIndex = 0;
let hardIndex = 0;

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

export default async function setupDailyProblems(client: Client) {
  // 24 hour clock
  let triggerHour = 0;
  let triggerMinute = 0;

  const scheduleData = channels.problemSendTime;
  if (!scheduleData) throw new Error('Could not load problem send time.');

  const split = scheduleData.split(':') as [string, string];

  if (split.length !== 2)
    throw new Error(
      'Splitting problem send time by the colon did not produce two parts.'
    );
  else if (split[0].length > 2 || split[1].length < 3)
    throw new Error('Invalid time string format.');

  triggerHour = parseInt(split[0]);
  triggerMinute = parseInt(split[1].substring(0, split[1].length - 2));
  const AM = split[1].substring(split[1].length - 2).toLowerCase() === 'am';

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

  const [easyBank, mediumBank, hardBank] = await getAllProblems();

  if (easyBank.length === 0) throw new Error('No easy problems retrieved.');
  else if (mediumBank.length === 0)
    throw new Error('No medium problems retrieved.');
  else if (hardBank.length === 0)
    throw new Error('No hard problems retrieved.');

  easyProblems = easyBank;
  mediumProblems = mediumBank;
  hardProblems = hardBank;

  const rule = new RecurrenceRule();
  rule.hour = triggerHour;
  rule.minute = triggerMinute;
  rule.tz = 'America/New_York';

  const postChannel: TextChannel = getChannel(client);

  if (!postChannel)
    throw new Error(
      'Could not find the text channel ' +
        channels.problemChannel +
        ' in the specified guild.'
    );

  scheduleJob(rule, () => {
    generateNextProblems();
    sendProblems(postChannel, [
      easyProblems[easyIndex]!,
      mediumProblems[mediumIndex]!,
      hardProblems[hardIndex]!,
    ]);
  });
}
