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

    const supportButton = new ButtonBuilder()
      .setCustomId('open_support_ticket')
      .setLabel('🛠️ Support Ticket')
      .setStyle(ButtonStyle.Primary);

    const buyButton = new ButtonBuilder()
      .setCustomId('open_buy_ticket')
      .setLabel('🛒 Buy / Upgrade')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(supportButton, buyButton);

    await interaction.channel.send({
      embeds: [{
        color: 0x00b4d8,
        title: '🎮 D3TX Services — Support Center',
        description: [
          '**Welcome to D3TX Services — #1 Cronus Zen Script Provider!**',
          '',
          'Choose a ticket type below:',
          '',
          '─────────────────────────────',
          '',
          '🛠️ **Support Ticket** *(Script issues, setup help, troubleshooting)*',
          '> AI Assistant responds instantly 24/7.',
          '> You\'ll be asked a few quick questions so we can help you faster.',
          '',
          '🛒 **Buy / Upgrade Ticket** *(Purchase scripts, ask about tiers)*',
          '> Find out which script is right for you.',
          '> Get the Patreon link and payment info.',
          '',
          '─────────────────────────────',
          '',
          '📋 **Scripts available for:** BO6, Warzone, R6, Apex, Fortnite, PUBG, NBA 2K, Rust, Valorant & more',
        ].join('\n'),
        footer: { text: 'D3TX Services • AI + Human Support • 24/7' },
        timestamp: new Date().toISOString(),
      }],
      components: [row],
    });

    return interaction.reply({ content: '✅ Panel sent!', ephemeral: true });
  },
};
