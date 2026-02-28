const { SlashCommandBuilder } = require('discord.js');
const { generateTranscript } = require('../handlers/ticketManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('Get a transcript of this ticket (works while ticket is still open)'),

  async execute(interaction) {
    const channel = interaction.channel;
    const guild = interaction.guild;
    const member = interaction.member;
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const adminRoleId = process.env.ADMIN_ROLE_ID;

    if (!channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ This command only works inside a ticket channel.', flags: 64 });
    }

    const isOwner = guild.ownerId === interaction.user.id;
    const isStaff = staffRoleId && member.roles.cache.has(staffRoleId);
    const isAdmin = adminRoleId && member.roles.cache.has(adminRoleId);
    const isTicketOwner = channel.topic === interaction.user.id;

    if (!isOwner && !isStaff && !isAdmin && !isTicketOwner) {
      return interaction.reply({ content: '❌ You do not have permission to get this transcript.', flags: 64 });
    }

    // Defer first to prevent timeout
    await interaction.deferReply({ flags: 64 });

    try {
      const transcriptChannel = await generateTranscript(channel, guild, interaction.user.tag);
      await interaction.editReply({ content: `✅ Transcript saved to ${transcriptChannel}!` });
    } catch (err) {
      console.error('Transcript error:', err);
      await interaction.editReply({ content: '❌ Failed to generate transcript: ' + err.message });
    }
  },
};
