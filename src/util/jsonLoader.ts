import { promises as fs } from 'fs';
import path from 'path';

export async function loadReplies(): Promise<string[]> {
  const fileData = await fs.readFile(
    path.join(__dirname, '../../replies.json')
  );
  return JSON.parse(fileData.toString());
}
