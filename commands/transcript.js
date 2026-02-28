const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transcript')
    .setDescription('Get a transcript of this ticket (works while ticket is still open)'),

  async execute(interaction) {
    // Defer IMMEDIATELY before anything else - prevents timeout
    await interaction.deferReply({ flags: 64 });

    try {
      const channel = interaction.channel;
      const guild = interaction.guild;
      const member = interaction.member;
      const staffRoleId = process.env.STAFF_ROLE_ID;
      const adminRoleId = process.env.ADMIN_ROLE_ID;

      if (!channel.name.startsWith('ticket-')) {
        return interaction.editReply({ content: '❌ This command only works inside a ticket channel.' });
      }

      const isOwner = guild.ownerId === interaction.user.id;
      const isStaff = staffRoleId && member.roles.cache.has(staffRoleId);
      const isAdmin = adminRoleId && member.roles.cache.has(adminRoleId);
      const isTicketOwner = channel.topic === interaction.user.id;

      if (!isOwner && !isStaff && !isAdmin && !isTicketOwner) {
        return interaction.editReply({ content: '❌ You do not have permission to get this transcript.' });
      }

      // Fetch messages
      const fetched = await channel.messages.fetch({ limit: 100 });
      const sorted = [...fetched.values()].reverse();
      const ticketName = channel.name;
      const generatedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

      const openerId = channel.topic;
      let openerTag = openerId;
      try {
        const opener = await guild.members.fetch(openerId);
        openerTag = opener.user.tag;
      } catch {}

      // Build transcript
      const lines = [
        `╔══════════════════════════════════════════════╗`,
        `        Cronus Zen Support — Ticket Transcript  `,
        `╚══════════════════════════════════════════════╝`,
        `Ticket   : ${ticketName}`,
        `Opened By: ${openerTag}`,
        `Generated: ${generatedAt} UTC`,
        `Status   : OPEN`,
        `Messages : ${sorted.length}`,
        `${'─'.repeat(50)}`,
        '',
      ];

      for (const m of sorted) {
        const time = m.createdAt.toLocaleString('en-US', { timeZone: 'UTC' });
        if (m.content) {
          lines.push(`[${time}] ${m.author.tag}: ${m.content}`);
        } else if (m.embeds[0]?.description) {
          lines.push(`[${time}] [EMBED] ${m.author.tag}: ${m.embeds[0].description}`);
        }
      }

      lines.push('', `${'─'.repeat(50)}`, `End of Transcript — ${ticketName}`);
      const tmpPath = path.join('/tmp', `${ticketName}-live.txt`);
      fs.writeFileSync(tmpPath, lines.join('\n'), 'utf8');
      const attachment = new AttachmentBuilder(tmpPath, { name: `${ticketName}-transcript.txt` });

      // Find or create transcripts channel
      let transcriptChannel = guild.channels.cache.find(
        c => c.name === 'transcripts' && c.type === ChannelType.GuildText
      );
      if (!transcriptChannel) {
        transcriptChannel = await guild.channels.create({
          name: 'transcripts',
          type: ChannelType.GuildText,
          permissionOverwrites: [
            { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            ...(staffRoleId ? [{ id: staffRoleId, allow: [PermissionFlagsBits.ViewChannel] }] : []),
          ],
        });
      }

      await transcriptChannel.send({
        embeds: [{
          color: 0x00b4d8,
          title: `📋 Live Transcript — ${ticketName}`,
          fields: [
            { name: 'Opened By', value: openerTag, inline: true },
            { name: 'Requested By', value: interaction.user.tag, inline: true },
            { name: 'Messages', value: `${sorted.length}`, inline: true },
            { name: 'Status', value: '🟢 Ticket Still Open', inline: false },
          ],
          footer: { text: 'Full transcript attached as .txt file' },
          timestamp: new Date().toISOString(),
        }],
        files: [attachment],
      });

      try { fs.unlinkSync(tmpPath); } catch {}

      await interaction.editReply({ content: `✅ Transcript saved to ${transcriptChannel}!` });

    } catch (err) {
      console.error('Transcript command error:', err);
      await interaction.editReply({ content: `❌ Error: ${err.message}` });
    }
  },
};
