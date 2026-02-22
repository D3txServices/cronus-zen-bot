const { askOpenAI } = require('../handlers/openai');

const cooldowns = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    const supportChannelId = process.env.SUPPORT_CHANNEL_ID;
    const isTicket = message.channel.name?.startsWith('ticket-');
    const isSupport = message.channel.id === supportChannelId;

    if (!isSupport && !isTicket) return;

    const now = Date.now();
    if (cooldowns.has(message.author.id)) {
      if (now < cooldowns.get(message.author.id)) return;
    }
    cooldowns.set(message.author.id, now + 3000);

    message.channel.sendTyping();

    try {
      const reply = await askOpenAI(message.author.id, message.content);
      // Plain text reply — no embed box
      await message.reply(reply);
    } catch (error) {
      console.error('OpenAI error:', error);
      await message.reply('⚠️ I ran into an issue. Please try again or open a `/ticket`.');
    }
  },
};
