const { SlashCommandBuilder } = require('discord.js');
const { createTicket } = require('../handlers/ticketManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Open a private Cronus Zen support ticket'),

  async execute(interaction) {
    await createTicket(interaction);
  },
};
