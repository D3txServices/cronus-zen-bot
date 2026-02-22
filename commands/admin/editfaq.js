const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { editFAQ } = require('../../handlers/faqManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('editfaq')
    .setDescription('Edit an existing FAQ entry')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName('id')
        .setDescription('The FAQ entry ID')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('question')
        .setDescription('New question (leave blank to keep current)')
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt.setName('answer')
        .setDescription('New answer (leave blank to keep current)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const adminRoleId = process.env.ADMIN_ROLE_ID;
    if (adminRoleId && !interaction.member.roles.cache.has(adminRoleId)) {
      return interaction.reply({ content: '❌ You do not have permission.', ephemeral: true });
    }

    const id = interaction.options.getString('id');
    const question = interaction.options.getString('question');
    const answer = interaction.options.getString('answer');

    if (!question && !answer) {
      return interaction.reply({ content: '❌ Provide at least a new question or answer.', ephemeral: true });
    }

    const success = editFAQ(id, question, answer);
    if (!success) {
      return interaction.reply({ content: `❌ No FAQ entry found with ID \`${id}\`.`, ephemeral: true });
    }

    return interaction.reply({
      embeds: [{
        color: 0xffa500,
        title: '✏️ FAQ Entry Updated',
        description: `Entry \`${id}\` has been updated successfully.`,
        fields: [
          ...(question ? [{ name: 'New Question', value: question }] : []),
          ...(answer ? [{ name: 'New Answer', value: answer }] : []),
        ],
      }],
      ephemeral: true,
    });
  },
};
