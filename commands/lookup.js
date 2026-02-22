const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lookup')
    .setDescription('Look up a Cronus Zen script or value')
    .addStringOption(opt =>
      opt.setName('query')
        .setDescription('Script name or keyword to search for')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query').toLowerCase();

    let scripts = [];
    try {
      const scriptsPath = path.join(__dirname, '../data/scripts.json');
      scripts = JSON.parse(fs.readFileSync(scriptsPath, 'utf8'));
    } catch {
      scripts = [];
    }

    const results = scripts.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      (s.tags && s.tags.some(t => t.toLowerCase().includes(query)))
    );

    if (results.length === 0) {
      return interaction.reply({
        embeds: [{
          color: 0xff6b6b,
          title: '🔍 No Results Found',
          description: `No scripts or values found for **"${query}"**.\n\nTry a different keyword or ask in <#${process.env.SUPPORT_CHANNEL_ID}>.`,
        }],
        ephemeral: true,
      });
    }

    const fields = results.slice(0, 5).map(s => ({
      name: `📜 ${s.name}`,
      value: `**Description:** ${s.description}\n**Values:** \`${s.values}\``,
    }));

    return interaction.reply({
      embeds: [{
        color: 0x00b4d8,
        title: `🔍 Results for "${query}"`,
        fields,
        footer: { text: `Found ${results.length} result(s) • Showing top 5` },
      }],
    });
  },
};
