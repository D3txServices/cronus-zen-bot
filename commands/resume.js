const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { resumeAI } = require('../handlers/humanTakeover');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Hand the ticket back to the AI assistant')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const adminRoleId = process.env.ADMIN_ROLE_ID;

    await interaction.guild.roles.fetch();
    await interaction.guild.members.fetch(interaction.user.id);

    const isGuildOwner = interaction.guild.ownerId === interaction.user.id;
    const isStaff = staffRoleId && interaction.member.roles.cache.has(staffRoleId);
    const isAdmin = adminRoleId && interaction.member.roles.cache.has(adminRoleId);

    if (!isGuildOwner && !isStaff && !isAdmin) {
      return interaction.reply({ content: '❌ Only staff can use this command.', ephemeral: true });
    }

    if (!interaction.channel.name.startsWith('ticket-') && !interaction.channel.name.startsWith('support-') && !interaction.channel.name.startsWith('buy-')) {
      return interaction.reply({ content: '❌ This command only works inside ticket channels.', ephemeral: true });
    }

    resumeAI(interaction.channel.id);

    await interaction.reply({
      content: '✅ AI is back in control of this ticket.',
      ephemeral: true,
    });
  },
};
