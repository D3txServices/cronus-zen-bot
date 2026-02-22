const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { pauseAI } = require('../handlers/humanTakeover');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Send a message as the AI bot (hides that a human is responding)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('What to say as the bot')
        .setRequired(true)
    ),

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
      return interaction.reply({ content: '❌ This only works inside ticket channels.', ephemeral: true });
    }

    const message = interaction.options.getString('message');

    // Auto-pause AI so it doesn't respond after you do
    pauseAI(interaction.channel.id);

    // Show typing indicator briefly so it feels natural
    await interaction.channel.sendTyping();
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Find the latest customer message to reply to
    const messages = await interaction.channel.messages.fetch({ limit: 20 });
    const latestCustomerMsg = messages.find(m => !m.author.bot);

    // Reply to their latest message so it looks like AI responded to them
    if (latestCustomerMsg) {
      await latestCustomerMsg.reply(message);
    } else {
      await interaction.channel.send(message);
    }

    // Confirm silently to you only
    await interaction.reply({
      content: `✅ Sent! AI is paused in this ticket. Use \`/resume\` to hand back to AI.`,
      ephemeral: true,
    });
  },
};
