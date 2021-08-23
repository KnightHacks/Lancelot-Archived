import { Client, Role } from 'discord.js';

export function getRoles(client: Client, roles: string[]): Role[] {
  if (!process.env.GUILD_ID) {
    throw new Error('GUILD_ID, not set!');
  }

  const guild = client.guilds.cache.get(process.env.GUILD_ID);

  const fetchedRoles = roles.map((role) => {
    const fetchedRole = guild?.roles.cache.find(
      (discordRole) => discordRole.name === role
    );

    if (!fetchedRole) {
      throw new Error(`Could not fetch role: ${role}`);
    }

    return fetchedRole;
  });

  return fetchedRoles;
}
