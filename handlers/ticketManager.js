const {
  PermissionFlagsBits, ChannelType, ButtonBuilder,
  ButtonStyle, ActionRowBuilder, AttachmentBuilder
} = require('discord.js');
const fs = require('fs');
const path = require('path');
const { learnFromTicket } = require('./learningManager');
const { saveFeedback } = require('./feedbackManager');

const counterPath = path.join(__dirname, '../data/ticketCounter.json');

// Lock set to prevent duplicate closes
const closingTickets = new Set();

// Pending ratings: messageId -> { userId, ticketName, guildId }
const pendingRatings = new Map();

function getNextTicketNumber() {
  if (!fs.existsSync(counterPath)) {
    fs.writeFileSync(counterPath, JSON.stringify({ count: 320 }));
  }
  const data = JSON.parse(fs.readFileSync(counterPath, 'utf8'));
  const current = data.count;
  fs.writeFileSync(counterPath, JSON.stringify({ count: current + 1 }));
  return current;
}

async function createTicket(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const categoryId = process.env.TICKET_CATEGORY_ID;
  const staffRoleId = process.env.STAFF_ROLE_ID;

  const existingChannel = guild.channels.cache.find(
    c => c.name.startsWith('ticket-') && c.topic === user.id
  );

  if (existingChannel) {
    return interaction.reply({
      content: `❌ You already have an open ticket: ${existingChannel}`,
      ephemeral: true,
    });
  }

  try {
    await guild.roles.fetch();
    await guild.members.fetch(user.id);

    const ticketNumber = getNextTicketNumber();

    const permissionOverwrites = [
      { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
      { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
    ];

    if (staffRoleId) {
      const staffRole = guild.roles.cache.get(staffRoleId);
      if (staffRole) {
        permissionOverwrites.push({
          id: staffRole.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        });
      }
    }

    const ticketChannel = await guild.channels.create({
      name: `ticket-${ticketNumber}`,
      type: ChannelType.GuildText,
      parent: categoryId || null,
      topic: user.id,
      permissionOverwrites,
    });

    const closeButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('🔒 Close Ticket')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(closeButton);

    await ticketChannel.send({
      embeds: [{
        color: 0x00b4d8,
        title: `🎫 Ticket #${ticketNumber}`,
        description: [
          `Hey ${user}, welcome to your support ticket!`,
          '',
          '🤖 **AI Assistant** is active — responds instantly 24/7.',
          '👤 **Staff** will also check in when available.',
          '',
          'Describe your issue and we\'ll get you sorted!',
          'Click **🔒 Close Ticket** when resolved.',
        ].join('\n'),
        fields: [
          { name: 'Ticket', value: `#${ticketNumber}`, inline: true },
          { name: 'Opened By', value: user.tag, inline: true },
          { name: 'Status', value: '🟢 Open', inline: true },
        ],
        footer: { text: 'Powered by Cronus Zen Support Bot' },
        timestamp: new Date().toISOString(),
      }],
      components: [row],
    });

    return interaction.reply({
      content: `✅ Your ticket has been created: ${ticketChannel}`,
      ephemeral: true,
    });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return interaction.reply({
      content: '❌ Failed to create ticket. Please contact staff.',
      ephemeral: true,
    });
  }
}

async function closeTicket(interaction) {
  const channel = interaction.channel;
  const guild = interaction.guild;
  const staffRoleId = process.env.STAFF_ROLE_ID;
  const adminRoleId = process.env.ADMIN_ROLE_ID;
  const member = interaction.member;

  if (!channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ This is not a ticket channel.', ephemeral: true });
  }

  // Fetch roles to make sure cache is populated
  await guild.roles.fetch();
  await guild.members.fetch(interaction.user.id);

  const isGuildOwner = guild.ownerId === interaction.user.id;
  const isStaff = staffRoleId && member.roles.cache.has(staffRoleId);
  const isAdmin = adminRoleId && member.roles.cache.has(adminRoleId);
  const isTicketOwner = channel.topic === interaction.user.id;

  const canClose = isGuildOwner || isStaff || isAdmin || isTicketOwner;

  if (!canClose) {
    return interaction.reply({ content: '❌ You do not have permission to close this ticket.', ephemeral: true });
  }

  // Prevent duplicate closes
  if (closingTickets.has(channel.id)) {
    return interaction.reply({ content: '⏳ This ticket is already being closed!', ephemeral: true });
  }
  closingTickets.add(channel.id);

  // Disable the close button immediately
  try {
    const messages = await channel.messages.fetch({ limit: 20 });
    const botMsg = messages.find(m => m.author.bot && m.components?.length > 0);
    if (botMsg) {
      const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
      const disabledBtn = new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('🔒 Closing...')
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true);
      await botMsg.edit({ components: [new ActionRowBuilder().addComponents(disabledBtn)] });
    }
  } catch {}

  await interaction.reply({ content: '🔒 Saving transcript and closing in 3 seconds...' });

  try {
    // Fetch all messages
    const fetched = await channel.messages.fetch({ limit: 100 });
    const sorted = [...fetched.values()].reverse();
    const ticketName = channel.name;
    const closedBy = interaction.user.tag;
    const closedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

    // Find the ticket opener via channel.topic
    const openerId = channel.topic;
    let opener = null;
    try { opener = await guild.members.fetch(openerId); } catch {}

    // ── Build transcript file ──────────────────────────────
    const lines = [
      `╔══════════════════════════════════════════════╗`,
      `        Cronus Zen Support — Ticket Transcript  `,
      `╚══════════════════════════════════════════════╝`,
      `Ticket   : ${ticketName}`,
      `Opened By: ${opener?.user.tag ?? openerId}`,
      `Closed By: ${closedBy}`,
      `Closed At: ${closedAt} UTC`,
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
    const transcriptText = lines.join('\n');
    const tmpPath = path.join('/tmp', `${ticketName}.txt`);
    fs.writeFileSync(tmpPath, transcriptText, 'utf8');
    const attachment = new AttachmentBuilder(tmpPath, { name: `${ticketName}.txt` });

    // ── Post to #transcripts channel ───────────────────────
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
        color: 0xff6b6b,
        title: `📋 Transcript — ${ticketName}`,
        fields: [
          { name: 'Opened By', value: opener?.user.tag ?? openerId, inline: true },
          { name: 'Closed By', value: closedBy, inline: true },
          { name: 'Messages', value: `${sorted.length}`, inline: true },
          { name: 'Closed At', value: `${closedAt} UTC`, inline: false },
        ],
        footer: { text: 'Full transcript attached below as .txt file' },
        timestamp: new Date().toISOString(),
      }],
      files: [attachment],
    });

    // ── DM transcript + rating to opener ──────────────────
    if (opener) {
      try {
        const dmAttachment = new AttachmentBuilder(tmpPath, { name: `${ticketName}.txt` });

        await opener.send({
          embeds: [{
            color: 0x00b4d8,
            title: `📋 Your Support Transcript — ${ticketName}`,
            description: [
              `Hey **${opener.user.username}**, your ticket has been closed.`,
              '',
              'A copy of your full conversation is attached below.',
              '',
              '🙏 **Thank you for using D3TX Cronus Zen Support!**',
              'If you need help again just open a new ticket anytime.',
            ].join('\n'),
            footer: { text: 'D3TX Cronus Zen Support • Available 24/7' },
            timestamp: new Date().toISOString(),
          }],
          files: [dmAttachment],
        });

        // ── Send rating request ────────────────────────────
        const ratingMsg = await opener.send({
          embeds: [{
            color: 0xffd700,
            title: '⭐ Rate Your Support Experience',
            description: [
              'How would you rate the support you received today?',
              '',
              'React with:',
              '1️⃣ — Very Bad',
              '2️⃣ — Bad',
              '3️⃣ — Okay',
              '4️⃣ — Good',
              '5️⃣ — Excellent',
            ].join('\n'),
            footer: { text: 'Your feedback helps us improve!' },
          }],
        });

        // Add reaction options
        for (const emoji of ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']) {
          await ratingMsg.react(emoji);
        }

        // Store pending rating
        pendingRatings.set(ratingMsg.id, {
          userId: opener.user.id,
          ticketName,
          guildId: guild.id,
          channelId: transcriptChannel.id,
        });

      } catch (dmErr) {
        console.log('Could not DM user (DMs may be disabled):', dmErr.message);
      }
    }

    // ── Auto-learn from ticket ─────────────────────────────
    await learnFromTicket(sorted);

    // Cleanup
    fs.unlinkSync(tmpPath);

  } catch (err) {
    console.error('Close ticket error:', err);
  }

  setTimeout(() => channel.delete().catch(console.error), 3000);
}

async function handleRatingReaction(reaction, user) {
  if (user.bot) return;
  if (!pendingRatings.has(reaction.message.id)) return;

  const emojiToRating = { '1️⃣': 1, '2️⃣': 2, '3️⃣': 3, '4️⃣': 4, '5️⃣': 5 };
  const rating = emojiToRating[reaction.emoji.name];
  if (!rating) return;

  const pending = pendingRatings.get(reaction.message.id);
  pendingRatings.delete(reaction.message.id);

  const stars = '⭐'.repeat(rating);
  const entry = {
    id: Date.now().toString(),
    userId: user.id,
    userTag: user.tag,
    ticketName: pending.ticketName,
    rating,
    ratedAt: new Date().toISOString(),
  };

  saveFeedback(entry);

  // Confirm to user
  try {
    await user.send({
      embeds: [{
        color: 0x00c851,
        title: '✅ Thanks for your rating!',
        description: `You gave us **${stars} (${rating}/5)**\nWe appreciate your feedback! 🙏`,
        footer: { text: 'D3TX Cronus Zen Support' },
      }],
    });
  } catch {}

  // Post to #feedback channel
  try {
    const { Client } = require('discord.js');
    const guild = reaction.client.guilds.cache.get(pending.guildId);
    if (!guild) return;

    let feedbackChannel = guild.channels.cache.find(c => c.name === 'feedback');
    if (!feedbackChannel) {
      const staffRoleId = process.env.STAFF_ROLE_ID;
      feedbackChannel = await guild.channels.create({
        name: 'feedback',
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          ...(staffRoleId ? [{ id: staffRoleId, allow: [PermissionFlagsBits.ViewChannel] }] : []),
        ],
      });
    }

    await feedbackChannel.send({
      embeds: [{
        color: rating >= 4 ? 0x00c851 : rating === 3 ? 0xffa500 : 0xff6b6b,
        title: `${stars} New Rating — ${rating}/5`,
        fields: [
          { name: 'From', value: user.tag, inline: true },
          { name: 'Ticket', value: pending.ticketName, inline: true },
          { name: 'Rating', value: `${stars} (${rating}/5)`, inline: true },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'D3TX Cronus Zen Support Feedback' },
      }],
    });
  } catch (err) {
    console.error('Feedback channel error:', err);
  }
}

module.exports = { createTicket, closeTicket, handleRatingReaction };
