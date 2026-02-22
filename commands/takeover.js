const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { pauseAI } = require('../handlers/humanTakeover');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('takeover')
    .setDescription('Stop the AI and take over this ticket manually')
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

    if (!interaction.channel.name.startsWith('ticket-')) {
      return interaction.reply({ content: '❌ This command only works inside ticket channels.', ephemeral: true });
    }

    pauseAI(interaction.channel.id);

    // Silent — only you see this confirmation, customer has no idea
    await interaction.reply({
      content: '✅ AI paused. You have control — use `/say` to respond as the bot or type normally. Use `/resume` when done.',
      ephemeral: true,
    });
  },
};
