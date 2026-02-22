const { askOpenAI } = require('../handlers/openai');

const cooldowns = new Map(); // Prevent spam

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    const supportChannelId = process.env.SUPPORT_CHANNEL_ID;
    const isTicket = message.channel.name?.startsWith('ticket-');
    const isSupport = message.channel.id === supportChannelId;

    if (!isSupport && !isTicket) return;

    // Cooldown: 1 message per 3 seconds per user
    const now = Date.now();
    const cooldownTime = 3000;
    if (cooldowns.has(message.author.id)) {
      const expiry = cooldowns.get(message.author.id);
      if (now < expiry) return;
    }
    cooldowns.set(message.author.id, now + cooldownTime);

    // Show typing indicator
    message.channel.sendTyping();

    try {
      const reply = await askOpenAI(message.author.id, message.content);

      await message.reply({
        embeds: [{
          color: 0x00b4d8,
          description: reply,
          footer: {
            text: 'Cronus Zen AI Support • Use /ticket for private help',
          },
          timestamp: new Date().toISOString(),
        }],
      });
    } catch (error) {
      console.error('OpenAI error:', error);
      await message.reply({
        content: '⚠️ I ran into an issue processing your question. Please try again or open a `/ticket`.',
      });
    }
  },
};
