const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { saveLearnedFile, getLearnedFiles } = require('../../handlers/openai');
const https = require('https');
const http = require('http');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('learn')
    .setDescription('Upload a file for the AI to learn from')
    .addSubcommand(sub => sub
      .setName('file')
      .setDescription('Upload a .txt, .md, or .gpc file for the AI to learn from')
      .addAttachmentOption(opt => opt
        .setName('file')
        .setDescription('The file to upload (.txt, .md, .gpc supported)')
        .setRequired(true))
      .addStringOption(opt => opt
        .setName('description')
        .setDescription('What is this file about? (e.g. "R6 script setup guide")')
        .setRequired(false)))
    .addSubcommand(sub => sub
      .setName('text')
      .setDescription('Type or paste text directly for the AI to learn')
      .addStringOption(opt => opt
        .setName('title')
        .setDescription('Title for this knowledge (e.g. "R6 Xbox setup steps")')
        .setRequired(true))
      .addStringOption(opt => opt
        .setName('content')
        .setDescription('The text content to add (max 4000 chars)')
        .setRequired(true)))
    .addSubcommand(sub => sub
      .setName('list')
      .setDescription('Show all files the AI has learned from'))
    .addSubcommand(sub => sub
      .setName('clear')
      .setDescription('Remove a learned file by filename')
      .addStringOption(opt => opt
        .setName('filename')
        .setDescription('Filename to remove')
        .setRequired(true))),

  async execute(interaction) {
    // Permission check
    const member = interaction.member;
    const isOwner = interaction.guild.ownerId === member.id;
    const isAdmin = member.permissions.has(PermissionFlagsBits.Administrator);
    const staffRoleId = process.env.STAFF_ROLE_ID;
    const isStaff = staffRoleId && member.roles.cache.has(staffRoleId);

    if (!isOwner && !isAdmin && !isStaff) {
      return interaction.reply({ content: '❌ You need staff permissions to use this.', ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();

    // ── LIST ──────────────────────────────────────────────────────────────────
    if (sub === 'list') {
      const files = getLearnedFiles();
      if (!files.length) {
        return interaction.reply({ content: '📚 No files learned yet. Use `/learn file` or `/learn text` to add some!', ephemeral: true });
      }
      const list = files.map((f, i) =>
        `${i + 1}. **${f.filename}** — ${f.content.length} chars — Added <t:${Math.floor(new Date(f.addedAt).getTime() / 1000)}:R>`
      ).join('\n');
      return interaction.reply({ content: `📚 **AI Knowledge Base (${files.length} files):**\n${list}`, ephemeral: true });
    }

    // ── CLEAR ─────────────────────────────────────────────────────────────────
    if (sub === 'clear') {
      const filename = interaction.options.getString('filename');
      const files = getLearnedFiles();
      const fs = require('fs');
      const path = require('path');
      const LEARNED_FILES_PATH = path.join(__dirname, '../../data/learned_files.json');
      const filtered = files.filter(f => f.filename !== filename);
      if (filtered.length === files.length) {
        return interaction.reply({ content: `❌ File "${filename}" not found in knowledge base.`, ephemeral: true });
      }
      fs.writeFileSync(LEARNED_FILES_PATH, JSON.stringify(filtered, null, 2));
      return interaction.reply({ content: `✅ Removed **${filename}** from AI knowledge base.`, ephemeral: true });
    }

    // ── TEXT ──────────────────────────────────────────────────────────────────
    if (sub === 'text') {
      await interaction.deferReply({ ephemeral: true });
      const title = interaction.options.getString('title');
      const content = interaction.options.getString('content');

      if (content.length > 4000) {
        return interaction.editReply({ content: '❌ Text too long — max 4000 characters. Split into multiple entries.' });
      }

      const filename = title.replace(/[^a-zA-Z0-9 _-]/g, '').trim().replace(/ /g, '_') + '.txt';
      saveLearnedFile(filename, `[${title}]\n${content}`);

      return interaction.editReply({
        content: `✅ AI has learned from **${filename}**!\n📊 ${content.length} characters added to knowledge base.\nThe AI will use this in all future tickets.`
      });
    }

    // ── FILE ──────────────────────────────────────────────────────────────────
    if (sub === 'file') {
      await interaction.deferReply({ ephemeral: true });

      const attachment = interaction.options.getAttachment('file');
      const description = interaction.options.getString('description') || '';

      // Check file type
      const allowed = ['.txt', '.md', '.gpc', '.json', '.csv'];
      const ext = attachment.name.substring(attachment.name.lastIndexOf('.')).toLowerCase();
      if (!allowed.includes(ext)) {
        return interaction.editReply({ content: `❌ File type not supported. Allowed: ${allowed.join(', ')}` });
      }

      // Check file size (max 500KB)
      if (attachment.size > 500000) {
        return interaction.editReply({ content: '❌ File too large — max 500KB.' });
      }

      // Download the file
      try {
        const content = await downloadFile(attachment.url);
        const label = description ? `[${attachment.name} — ${description}]\n` : `[${attachment.name}]\n`;
        saveLearnedFile(attachment.name, label + content);

        return interaction.editReply({
          content: `✅ AI has learned from **${attachment.name}**!\n📊 ${content.length} characters added to knowledge base.\n${description ? `📝 Description: ${description}\n` : ''}The AI will use this information in all future tickets.`
        });
      } catch (err) {
        console.error('Learn file error:', err);
        return interaction.editReply({ content: '❌ Failed to read the file. Make sure it\'s a plain text file.' });
      }
    }
  }
};

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}
