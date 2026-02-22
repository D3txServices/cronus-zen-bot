const { PermissionFlagsBits, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const counterPath = path.join(__dirname, '../data/ticketCounter.json');

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

  // Check if user already has an open ticket
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
      topic: user.id, // store user ID in topic for lookup
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
          '🤖 **AI Assistant** is active and will respond to your messages automatically.',
          '👤 **A staff member** will also check in when available.',
          '',
          'Just describe your issue below and we\'ll get you sorted!',
          '',
          'Click **🔒 Close Ticket** below when your issue is resolved.',
        ].join('\n'),
        fields: [
          { name: 'Ticket Number', value: `#${ticketNumber}`, inline: true },
          { name: 'Opened By', value: `${user.tag}`, inline: true },
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
  const staffRoleId = process.env.STAFF_ROLE_ID;
  const member = interaction.member;

  const isStaff = staffRoleId && member.roles.cache.has(staffRoleId);
  const isOwner = channel.topic === interaction.user.id;

  if (!channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ This is not a ticket channel.', ephemeral: true });
  }

  if (!isStaff && !isOwner) {
    return interaction.reply({ content: '❌ You do not have permission to close this ticket.', ephemeral: true });
  }

  await interaction.reply({ content: '🔒 Saving transcript and closing in 5 seconds...' });

  try {
    const messages = await channel.messages.fetch({ limit: 100 });
    const sorted = [...messages.values()].reverse();
    const ticketName = channel.name;
    const closedBy = interaction.user.tag;
    const closedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

    // Build .txt transcript file content
    const lines = [
      `╔════════════════════════════════════════╗`,
      `  Cronus Zen Support — Ticket Transcript`,
      `╚════════════════════════════════════════╝`,
      `Ticket  : ${ticketName}`,
      `Closed  : ${closedAt} UTC`,
      `Closed By: ${closedBy}`,
      `${'─'.repeat(50)}`,
      '',
    ];

    for (const m of sorted) {
      const time = m.createdAt.toLocaleString('en-US', { timeZone: 'UTC' });
      if (m.embeds.length > 0 && !m.content) {
        const embed = m.embeds[0];
        lines.push(`[${time}] [EMBED] ${m.author.tag}: ${embed.title ?? ''} — ${embed.description ?? ''}`);
      } else if (m.content) {
        lines.push(`[${time}] ${m.author.tag}: ${m.content}`);
      }
    }

    lines.push('');
    lines.push(`${'─'.repeat(50)}`);
    lines.push(`End of transcript — ${ticketName}`);

    const transcriptText = lines.join('\n');

    // Save as .txt file
    const tmpPath = path.join('/tmp', `${ticketName}.txt`);
    fs.writeFileSync(tmpPath, transcriptText, 'utf8');
    const attachment = new AttachmentBuilder(tmpPath, { name: `${ticketName}.txt` });

    // Find or create #transcripts channel
    let transcriptChannel = interaction.guild.channels.cache.find(
      c => c.name === 'transcripts' && c.type === ChannelType.GuildText
    );

    if (!transcriptChannel) {
      transcriptChannel = await interaction.guild.channels.create({
        name: 'transcripts',
        type: ChannelType.GuildText,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          ...(staffRoleId ? [{ id: staffRoleId, allow: [PermissionFlagsBits.ViewChannel] }] : []),
        ],
      });
    }

    await transcriptChannel.send({
      embeds: [{
        color: 0xff6b6b,
        title: `📋 Transcript — ${ticketName}`,
        fields: [
          { name: 'Closed By', value: closedBy, inline: true },
          { name: 'Closed At', value: `${closedAt} UTC`, inline: true },
          { name: 'Messages', value: `${sorted.length}`, inline: true },
        ],
        footer: { text: 'Transcript saved as .txt file below' },
        timestamp: new Date().toISOString(),
      }],
      files: [attachment],
    });

    // Cleanup tmp file
    fs.unlinkSync(tmpPath);

  } catch (err) {
    console.error('Transcript error:', err);
  }

  setTimeout(() => channel.delete().catch(console.error), 5000);
}

module.exports = { createTicket, closeTicket };
