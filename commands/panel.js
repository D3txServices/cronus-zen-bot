const { SlashCommandBuilder, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Send the Cronus Zen support panel')
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
        title: '🎮 Cronus Zen — Support Center',
        description: [
          '**Need help with your Cronus Zen? We got you covered!**',
          '',
          'Click the button below to open a **private support ticket**.',
          'Your ticket is only visible to you and staff.',
          '',
          '─────────────────────────────',
          '',
          '🤖 **AI Support** *(Instant — 24/7)*',
          '> Our AI assistant responds immediately to your messages.',
          '> Setup help, scripts, values, troubleshooting & more.',
          '',
          '👤 **Human Support** *(Staff check in regularly)*',
          '> A real staff member will review your ticket.',
          '> Complex issues, script requests, or anything the AI can\'t solve.',
          '',
          '─────────────────────────────',
          '',
          '📋 **What we help with:**',
          '`Device Setup` `GamePacks` `GPC Scripts` `Anti-Recoil`',
          '`Connection Issues` `Script Values` `Troubleshooting`',
        ].join('\n'),
        footer: { text: 'Cronus Zen Support Bot • AI + Human Support • 24/7' },
        timestamp: new Date().toISOString(),
      }],
      components: [row],
    });

    return interaction.reply({ content: '✅ Support panel sent!', ephemeral: true });
  },
};
