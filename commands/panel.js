const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Send the Cronus Zen support panel with ticket button')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const adminRoleId = process.env.ADMIN_ROLE_ID;
    if (adminRoleId && !interaction.member.roles.cache.has(adminRoleId)) {
      return interaction.reply({ content: '❌ You do not have permission.', ephemeral: true });
    }

    const openButton = new ButtonBuilder()
      .setCustomId('open_ticket')
      .setLabel('🎫 Open a Ticket')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(openButton);

    await interaction.channel.send({
      embeds: [{
        color: 0x00b4d8,
        title: '🎮 Cronus Zen Support',
        description: [
          '**Welcome to the Cronus Zen Support Center!**',
          '',
          'Our AI assistant is available **24/7** to help you with:',
          '',
          '🔧 **Device Setup** — USB, Bluetooth, console connection',
          '📦 **GamePacks** — Installation and configuration',
          '📜 **Scripts & Values** — Anti-recoil, rapid fire, macros',
          '🛠️ **Troubleshooting** — Fixing common issues',
          '',
          'Click the button below to open a **private support ticket**.',
          'Your conversation is only visible to you and staff.',
        ].join('\n'),
        footer: { text: 'Powered by Cronus Zen AI Support Bot • Available 24/7' },
        timestamp: new Date().toISOString(),
      }],
      components: [row],
    });

    return interaction.reply({ content: '✅ Support panel sent!', ephemeral: true });
  },
};
