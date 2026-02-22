const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { resumeAI } = require('../handlers/humanTakeover');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Hand the ticket back to the AI assistant')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const isStaff = staffRoleId && interaction.member.roles.cache.has(staffRoleId);

    if (!isStaff) {
      return interaction.reply({ content: '❌ Only staff can use this command.', ephemeral: true });
    }

    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ This command only works inside ticket channels.', ephemeral: true });
    }

    resumeAI(interaction.channel.id);

    await interaction.reply({
      embeds: [{
        color: 0x00b4d8,
        title: '🤖 AI Support Resumed',
        description: 'The AI assistant is now active again in this ticket.',
        footer: { text: 'D3TX Support' },
        timestamp: new Date().toISOString(),
      }],
    });
  },
};
