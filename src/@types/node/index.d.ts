// This allows TypeScript to detect our global value
declare global {
  module 'NodeJS' {
    interface Global {
      __rootdir__: string;
    }
  }
}
