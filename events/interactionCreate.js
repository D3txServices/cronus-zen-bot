const { closeTicket } = require('../handlers/ticketManager');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {

    // Handle button clicks
    if (interaction.isButton()) {
      if (interaction.customId === 'close_ticket') {
        return closeTicket(interaction);
      }
      if (interaction.customId === 'open_ticket') {
        const { createTicket } = require('../handlers/ticketManager');
        return createTicket(interaction);
      }
      return;
    }

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
