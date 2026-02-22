const { PermissionFlagsBits, ChannelType } = require('discord.js');

async function createTicket(interaction) {
  const guild = interaction.guild;
  const user = interaction.user;
  const categoryId = process.env.TICKET_CATEGORY_ID;
  const staffRoleId = process.env.STAFF_ROLE_ID;

  // Check if user already has an open ticket
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
    const ticketChannel = await guild.channels.create({
      name: `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      type: ChannelType.GuildText,
      parent: categoryId || null,
      permissionOverwrites: [
        {
          id: guild.id, // @everyone - deny
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: user.id, // ticket creator - allow
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        ...(staffRoleId ? [{
          id: staffRoleId, // staff - allow
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        }] : []),
      ],
    });

    await ticketChannel.send({
      embeds: [{
        color: 0x00b4d8,
        title: '🎫 Cronus Zen Support Ticket',
        description: `Hey ${user}, welcome to your support ticket!\n\nDescribe your issue and our **AI assistant** will help you right away. A staff member will also check in soon.\n\nType \`/close\` to close this ticket when resolved.`,
        footer: { text: 'Powered by Cronus Zen Support Bot' },
        timestamp: new Date().toISOString(),
      }],
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

  await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...' });
  setTimeout(() => channel.delete().catch(console.error), 5000);
}

module.exports = { createTicket, closeTicket };
