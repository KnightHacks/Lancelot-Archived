import { CommandInteraction, InteractionButtonOptions, InteractionReplyOptions, Message, MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed } from 'discord.js';

type PageButtonOptions = {
  style?: InteractionButtonOptions['style'];
  nextLabel?: string;
  previousLabel?: string;
  content?: string;
  showPagePosition?: boolean;
  time?: number;
};

// Default to half an hour.
const defaultTime = 1800000;

/**
 * Sends a paginated message from the given embeds.
 * @param interaction The interaction to reply to.
 * @param embeds The array of embeds to use.
 */
export async function sendPaginatedEmbeds(
  interaction: CommandInteraction | MessageComponentInteraction,
  embeds: MessageEmbed[],
  options?: PageButtonOptions
): Promise<void> {
  let currentPage = 0;

  // Precheck
  if (interaction.replied) {
    throw new Error('Cannot paginate when interaction is already replied to.');
  }

  const generateOptionsForPage = (page: number): InteractionReplyOptions => {

    const beginning = page === 0;
    const end = page === embeds.length - 1;
    const currentEmbed = embeds[page];
    
    const buttonStyle = options?.style ?? 'PRIMARY';

    if (!currentEmbed) {
      throw new Error('Embed page number out of bounds');
    }

    const nextButton = new MessageButton()
      .setCustomId('nextButton')
      .setLabel(options?.nextLabel ?? 'Next')
      .setStyle(buttonStyle);

    if (end) {
      nextButton.disabled = true;
    }

    const previousButton = new MessageButton()
      .setCustomId('previousButton')
      .setLabel(options?.previousLabel ?? 'Previous')
      .setStyle(buttonStyle);

    if (beginning) {
      previousButton.disabled = true;
    }

    const row = new MessageActionRow().addComponents([previousButton, nextButton]);

    if ((options?.showPagePosition ?? true) === true) {
      currentEmbed.setFooter(`Page ${currentPage + 1} of ${embeds.length}`);
    }

    return {
      embeds: [currentEmbed],
      components: [row],
    };
  };

  const messageOptions = generateOptionsForPage(0);
  const message = interaction.deferred ?
    await interaction.followUp({ ...messageOptions, fetchReply: true, content: options?.content }) as Message :
    await interaction.reply({ ...messageOptions, fetchReply: true, content: options?.content }) as Message;

  const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: options?.time ?? defaultTime });

  collector.on('collect', async collectInteraction => {

    await collectInteraction.deferUpdate();
    if (!collectInteraction.isButton()) {
      return;
    }

    if (collectInteraction.customId === 'nextButton') {
      currentPage++;
    } else {
      currentPage--;
    }

    const replyOptions = generateOptionsForPage(currentPage);
    await collectInteraction.editReply(replyOptions);
  });

  collector.on('end', async () => {
    if (!message.editable) {
      return;
    }
    // remove footer if enabled
    if (options?.showPagePosition === undefined || options?.showPagePosition === true) {

      const [ embed ] = message.embeds;

      if (embed) {
        embed.footer = null;
        await message.edit({ components: [], embeds: [embed] });
        return;
      }
    }
    
    await message.edit({ components: [] });
  });
}
