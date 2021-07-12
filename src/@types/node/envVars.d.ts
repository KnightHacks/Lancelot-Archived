declare namespace NodeJS {
  export interface ProcessEnv {
    DISCORD_TOKEN?: string;
    GUILD_ID?: `${bigint}`;
  }
}
