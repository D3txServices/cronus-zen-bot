const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getStats, readFeedback } = require('../handlers/feedbackManager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ratings')
    .setDescription('View support rating stats')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const stats = getStats();

    if (!stats) {
      return interaction.reply({ content: '📭 No ratings received yet.', ephemeral: true });
    }

    const bar = (count, total) => {
      const filled = Math.round((count / total) * 10);
      return '█'.repeat(filled) + '░'.repeat(10 - filled);
    };

    return interaction.reply({
      embeds: [{
        color: 0xffd700,
        title: '⭐ Support Rating Statistics',
        fields: [
          {
            name: 'Overall Average',
            value: `${'⭐'.repeat(Math.round(stats.avg))} **${stats.avg}/5** (${stats.total} ratings)`,
          },
          {
            name: 'Breakdown',
            value: [
              `5⭐ ${bar(stats.breakdown[5], stats.total)} ${stats.breakdown[5]}`,
              `4⭐ ${bar(stats.breakdown[4], stats.total)} ${stats.breakdown[4]}`,
              `3⭐ ${bar(stats.breakdown[3], stats.total)} ${stats.breakdown[3]}`,
              `2⭐ ${bar(stats.breakdown[2], stats.total)} ${stats.breakdown[2]}`,
              `1⭐ ${bar(stats.breakdown[1], stats.total)} ${stats.breakdown[1]}`,
            ].join('\n'),
          },
        ],
        footer: { text: 'D3TX Cronus Zen Support' },
        timestamp: new Date().toISOString(),
      }],
      ephemeral: true,
    });
  },
};
