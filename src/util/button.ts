import { MessageActionRow, MessageButton, MessageButtonOptions } from 'discord.js';

/**
 * A convenience function for creating a single button in a row.
 * @param options The options for the button.
 * @returns A new action row component.
 */
export function singleButtonRow(
  options: MessageButtonOptions
): MessageActionRow {
  const button = new MessageButton(options);
  return new MessageActionRow().addComponents(button);
}
