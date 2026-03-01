const { SlashCommandBuilder } = require('discord.js');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('summary')
    .setDescription('Get an AI summary of this ticket (owner only)'),

  async execute(interaction) {
    const guild = interaction.guild;
    const channel = interaction.channel;

    // Owner only — fetch guild fresh to ensure ownerId is loaded
    const fetchedGuild = await guild.fetch();
    const isOwner = fetchedGuild.ownerId === interaction.user.id;
    const isAdmin = process.env.ADMIN_ROLE_ID && interaction.member.roles.cache.has(process.env.ADMIN_ROLE_ID);
    if (!isOwner && !isAdmin) {
      return interaction.reply({ content: `❌ This command is for the server owner only. (your id: ${interaction.user.id} | owner id: ${fetchedGuild.ownerId})`, flags: 64 });
    }

    if (!channel.name.startsWith('ticket-') && !channel.name.startsWith('support-') && !channel.name.startsWith('buy-')) {
      return interaction.reply({ content: '❌ This command only works inside a ticket channel.', flags: 64 });
    }

    await interaction.deferReply({ flags: 64 });

    try {
      // Fetch messages
      const fetched = await channel.messages.fetch({ limit: 100 });
      const sorted = [...fetched.values()].reverse();

      // Build conversation text (skip embeds/bot system messages)
      const lines = [];
      for (const m of sorted) {
        if (m.content && !m.content.includes('[INTAKE FORM')) {
          const speaker = m.author.bot ? 'AI' : m.author.username;
          lines.push(`${speaker}: ${m.content}`);
        }
      }

      if (lines.length < 2) {
        return interaction.editReply({ content: '❌ Not enough messages to summarize.' });
      }

      const convo = lines.join('\n');

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are summarizing a D3TX Services customer support ticket for the business owner.
Give a concise summary covering:
1. 🧑 Customer issue — what they were trying to do and what went wrong
2. 🤖 AI response — what fixes were attempted
3. ✅ Resolution — was it solved? If not, what's still unresolved?
4. ⚠️ Action needed — anything the owner needs to do?
Keep it brief and practical — owner just needs a quick overview.`
          },
          { role: 'user', content: `Summarize this support ticket conversation:\n\n${convo}` }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      const summary = response.choices[0].message.content;
      await interaction.editReply({ content: `📋 **Ticket Summary — ${channel.name}**\n\n${summary}` });

    } catch (err) {
      console.error('Summary error:', err);
      await interaction.editReply({ content: `❌ Failed to generate summary: ${err.message}` });
    }
  },
};
