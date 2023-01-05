import { Message } from 'discord.js';
import fetch from 'node-fetch';

const ghRegex = /https?:\/\/github.com\/([\d\w-.]+\/[\d\w-.]+)/;
const contentsRegex = /\{\+path\}/;

const githubAPI = 'https://api.github.com/repos/';

type GitHubResponse = SuccessfulGitHubResponse | FailedGitHubResponse;

interface SuccessfulGitHubResponse {
  content: string;
}

interface FailedGitHubResponse {
  message: string;
}

const checkForLicense = async (message: Message) => {
  const matches = message.content.match(ghRegex);
  if (matches) {
    const repo = await fetch(githubAPI + matches[1]).then((b: any) => b.json());
    if (repo.license === null) {
      const responses = <PromiseSettledResult<GitHubResponse>[]>(
        await Promise.allSettled(
          ['README', 'README.md'].map((x) =>
            fetch(repo.contents_url.replace(contentsRegex, x)).then((b: any) =>
              b.json()
            )
          )
        )
      );

      const content: string =
        responses.filter(
          (
            response
          ): response is PromiseFulfilledResult<SuccessfulGitHubResponse> =>
            response.status === 'fulfilled' && 'content' in response.value
        )[0]?.value.content ?? '';

      const buffer = Buffer.from(content, 'base64')
        .toString('utf-8')
        .toLowerCase();

      const isCopyrightOrLicensePresent = ['copyright', 'license']
        .map((term) => buffer.includes(term))
        .reduce((acc, cur) => acc || cur);

      if (!isCopyrightOrLicensePresent) {
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
};

export { checkForLicense };
