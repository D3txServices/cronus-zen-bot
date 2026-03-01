const { closeTicket } = require('../handlers/ticketManager');
const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    // ── Button clicks ──────────────────────────────────────────
    if (interaction.isButton()) {

      // Support ticket — show intake modal first
      if (interaction.customId === 'open_support_ticket') {
        const modal = new ModalBuilder()
          .setCustomId('support_intake_modal')
          .setTitle('Support Ticket — Quick Info');

        const scriptInput = new TextInputBuilder()
          .setCustomId('script_name')
          .setLabel('Which D3TX script do you have?')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('e.g. R6 Script, BO6 SupremeShot, Warzone Pro...')
          .setRequired(true);

        const deviceInput = new TextInputBuilder()
          .setCustomId('device')
          .setLabel('Which device/platform are you on?')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('e.g. PS5, Xbox Series X, PC...')
          .setRequired(true);

        const gameInput = new TextInputBuilder()
          .setCustomId('game')
          .setLabel('Which game?')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('e.g. Rainbow Six Siege, Warzone, BO6...')
          .setRequired(true);

        const issueInput = new TextInputBuilder()
          .setCustomId('issue')
          .setLabel('What is your issue?')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Describe what\'s wrong — e.g. anti-recoil not working, can\'t open mod menu, script won\'t load...')
          .setRequired(true);

        const languageInput = new TextInputBuilder()
          .setCustomId('language')
          .setLabel('Preferred language for support?')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('e.g. English, French, Spanish, Portuguese...')
          .setRequired(false);

        modal.addComponents(
          new ActionRowBuilder().addComponents(scriptInput),
          new ActionRowBuilder().addComponents(deviceInput),
          new ActionRowBuilder().addComponents(gameInput),
          new ActionRowBuilder().addComponents(issueInput),
          new ActionRowBuilder().addComponents(languageInput),
        );

        return interaction.showModal(modal);
      }

      // Buy ticket — open directly
      if (interaction.customId === 'open_buy_ticket') {
        const { createTicket } = require('../handlers/ticketManager');
        return createTicket(interaction, 'buy');
      }

      // Legacy support
      if (interaction.customId === 'open_ticket') {
        const { createTicket } = require('../handlers/ticketManager');
        return createTicket(interaction, 'support');
      }

      if (interaction.customId === 'close_ticket') {
        return closeTicket(interaction);
      }

      return;
    }

    // ── Modal submission — support intake ──────────────────────
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'support_intake_modal') {
        const script = interaction.fields.getTextInputValue('script_name');
        const device = interaction.fields.getTextInputValue('device');
        const game = interaction.fields.getTextInputValue('game');
        const issue = interaction.fields.getTextInputValue('issue');
        const language = interaction.fields.getTextInputValue('language') || 'English';

        // Create the ticket with intake data
        const { createSupportTicketWithIntake } = require('../handlers/ticketManager');
        return createSupportTicketWithIntake(interaction, { script, device, game, issue, language });
      }
    }

    // ── Slash commands ─────────────────────────────────────────
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command ${interaction.commandName}:`, error);
      const msg = { content: '❌ An error occurred while running this command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg);
      } else {
        await interaction.reply(msg);
      }
    }
  },
};
