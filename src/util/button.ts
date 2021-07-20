import { MessageActionRow, MessageButton, MessageButtonStyleResolvable } from 'discord.js';

/**
 * A convenience function for creating a single button in a row.
 * @param label The title of the button.
 * @param customID The custom ID for the button.
 * @param style The button style.
 * @returns A new action row component.
 */
export function singleButton(
  label: string, 
  customID: string,
  style: MessageButtonStyleResolvable = 'PRIMARY'
): MessageActionRow {
  const button = new MessageButton()
    .setLabel(label)
    .setCustomId(customID)
    .setStyle(style);

  return new MessageActionRow().addComponents(button);
}
