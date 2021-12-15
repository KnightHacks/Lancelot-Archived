import { Message } from 'discord.js';
import fetch from 'node-fetch';

const ghRegex = /https?:\/\/github.com\/([\d\w-.]+\/[\d\w-.]+)/;
const contentsRegex = /\{\+path\}/;

const githubAPI = 'https://api.github.com/repos/';

interface GitHubResponse {
  value: {
    content?: string;
  };
}

const checkForLicense = async (message: Message) => {
  if (message.content) {
    const matches = message.content.match(ghRegex);
    if (matches) {
      const repo = await fetch(githubAPI + matches[1]).then((b) => b.json());
      if (repo.license === null) {
        const responses: GitHubResponse[] = <GitHubResponse[]>(
          await Promise.allSettled(
            [
              fetch(repo.contents_url.replace(contentsRegex, 'README')).then(
                (b) => b.json()
              ),
              fetch(repo.contents_url.replace(contentsRegex, 'README.md')).then(
                (b) => b.json()
              ),
            ].filter((x) => 'value' in x)
          )
        );

        const isCopyrightAsserted = responses
          .filter((r) => 'content' in r.value)
          .map((r) => <string>r.value.content)
          .map((base64) => Buffer.from(base64, 'base64').toString('utf-8'))
          .map((content) => {
            return ['copyright', 'license']
              .map((term) => content.toLowerCase().includes(term))
              .reduce((acc, cur) => acc || cur);
          })
          .reduce((acc, cur) => acc || cur, false);

        if (!isCopyrightAsserted) {
          message.reply(
            `No license detected on <${matches[0]}>! ` +
              'Check out https://choosealicense.com to learn why having a ' +
              'license is important and for advice choosing an appropriate one.' +
              "\n\nIf you don't want to make your code open source, consider " +
              'adding an explicit copyright statement to make your intentions clear.'
          );
        }
      }
    }
  }
};

export { checkForLicense };