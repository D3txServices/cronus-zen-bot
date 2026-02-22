const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { removeFAQ, listFAQ } = require('../../handlers/faqManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removefaq')
    .setDescription('Remove an FAQ entry from the AI knowledge base')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName('id')
        .setDescription('The FAQ entry ID (use /listfaq to find IDs)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const adminRoleId = process.env.ADMIN_ROLE_ID;
    if (adminRoleId && !interaction.member.roles.cache.has(adminRoleId)) {
      return interaction.reply({ content: '❌ You do not have permission.', ephemeral: true });
    }

    const id = interaction.options.getString('id');
    const success = removeFAQ(id);

    if (!success) {
      return interaction.reply({ content: `❌ No FAQ entry found with ID \`${id}\`.`, ephemeral: true });
    }

    return interaction.reply({
      embeds: [{
        color: 0xff6b6b,
        title: '🗑️ FAQ Entry Removed',
        description: `Entry \`${id}\` has been deleted from the knowledge base.`,
      }],
      ephemeral: true,
    });
  },
};
