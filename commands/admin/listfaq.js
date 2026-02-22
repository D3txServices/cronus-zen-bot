const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { listFAQ } = require('../../handlers/faqManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('listfaq')
    .setDescription('List all FAQ entries in the knowledge base')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const adminRoleId = process.env.ADMIN_ROLE_ID;
    if (adminRoleId && !interaction.member.roles.cache.has(adminRoleId)) {
      return interaction.reply({ content: '❌ You do not have permission.', ephemeral: true });
    }

    const faq = listFAQ();

    if (faq.length === 0) {
      return interaction.reply({ content: '📭 No FAQ entries yet. Use `/addfaq` to add some.', ephemeral: true });
    }

    const fields = faq.slice(0, 10).map(f => ({
      name: `❓ ${f.question}`,
      value: `${f.answer}\n\`ID: ${f.id}\``,
    }));

    return interaction.reply({
      embeds: [{
        color: 0x00b4d8,
        title: '📋 FAQ Knowledge Base',
        fields,
        footer: { text: `${faq.length} total entries • Showing first 10` },
      }],
      ephemeral: true,
    });
  },
};
