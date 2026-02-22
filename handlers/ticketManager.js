const { PermissionFlagsBits, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

async function createTicket(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const categoryId = process.env.TICKET_CATEGORY_ID;
  const staffRoleId = process.env.STAFF_ROLE_ID;

  const existingChannel = guild.channels.cache.find(
    c => c.name === `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`
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
      name: `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      type: ChannelType.GuildText,
      parent: categoryId || null,
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
        title: '🎫 Cronus Zen Support Ticket',
        description: `Hey ${user}, welcome to your support ticket!\n\nDescribe your issue and our **AI assistant** will help you right away. A staff member will also check in soon.\n\nClick **🔒 Close Ticket** below or type \`/close\` when resolved.`,
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
  const isOwner = channel.permissionOverwrites.cache.some(
    po => po.id === interaction.user.id && po.allow.has(PermissionFlagsBits.ViewChannel)
  );

  if (!channel.name.startsWith('ticket-')) {
    return interaction.reply({ content: '❌ This is not a ticket channel.', ephemeral: true });
  }

  if (!isStaff && !isOwner) {
    return interaction.reply({ content: '❌ You do not have permission to close this ticket.', ephemeral: true });
  }

  await interaction.reply({ content: '🔒 Saving transcript and closing in 5 seconds...' });

  // Save transcript
  try {
    const messages = await channel.messages.fetch({ limit: 100 });
    const sorted = [...messages.values()].reverse();

    const transcriptLines = sorted.map(m => {
      const time = m.createdAt.toLocaleString('en-US', { timeZone: 'UTC' });
      const content = m.content || (m.embeds[0]?.description ?? '[embed]');
      return `[${time}] ${m.author.tag}: ${content}`;
    });

    const ticketName = channel.name;
    const closedBy = interaction.user.tag;
    const closedAt = new Date().toLocaleString('en-US', { timeZone: 'UTC' });

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
      content: `📋 **Transcript: #${ticketName}**\nClosed by: ${closedBy} | ${closedAt} UTC\n${'─'.repeat(40)}`,
    });

    // Send in chunks to avoid Discord 2000 char limit
    const chunks = [];
    let current = '```\n';
    for (const line of transcriptLines) {
      if ((current + line + '\n```').length > 1990) {
        chunks.push(current + '```');
        current = '```\n' + line + '\n';
      } else {
        current += line + '\n';
      }
    }
    chunks.push(current + '```');
    for (const chunk of chunks) {
      await transcriptChannel.send({ content: chunk });
    }

    await transcriptChannel.send({
      embeds: [{
        color: 0xff6b6b,
        description: `✅ Ticket **#${ticketName}** closed by **${closedBy}**`,
        timestamp: new Date().toISOString(),
      }],
    });

  } catch (err) {
    console.error('Transcript error:', err);
  }

  setTimeout(() => channel.delete().catch(console.error), 5000);
}

module.exports = { createTicket, closeTicket };
