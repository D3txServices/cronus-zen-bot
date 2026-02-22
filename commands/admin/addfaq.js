const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { addFAQ } = require('../../handlers/faqManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addfaq')
    .setDescription('Add a new FAQ entry to the AI knowledge base')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName('question')
        .setDescription('The question')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('answer')
        .setDescription('The answer')
        .setRequired(true)
    ),

  async execute(interaction) {
    const adminRoleId = process.env.ADMIN_ROLE_ID;
    if (adminRoleId && !interaction.member.roles.cache.has(adminRoleId)) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    const question = interaction.options.getString('question');
    const answer = interaction.options.getString('answer');
    const id = addFAQ(question, answer);

    return interaction.reply({
      embeds: [{
        color: 0x00c851,
        title: '✅ FAQ Entry Added',
        fields: [
          { name: 'ID', value: `\`${id}\``, inline: true },
          { name: 'Question', value: question },
          { name: 'Answer', value: answer },
        ],
        footer: { text: 'The AI will now use this in future responses.' },
      }],
      ephemeral: true,
    });
  },
};
