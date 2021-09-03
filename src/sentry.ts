/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Sentry from '@sentry/node';
import { RewriteFrames } from '@sentry/integrations';

// This allows TypeScript to detect our global value
declare global {
  namespace NodeJS {
    interface Global {
      __rootdir__: string;
    }
  }
}

// @ts-ignore
global.__rootdir__ = __dirname || process.cwd();

export function setupSentry(): void {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENV ?? process.env.NODE_ENV,
    release: process.env.GITHUB_SHA,
    integrations: [
      new RewriteFrames({
        // @ts-ignore
        root: global.__rootdir__,
      }),
    ],
    enabled: process.env.NODE_ENV === 'production',
    debug: true,
  });
}
