const { askOpenAI } = require('../handlers/openai');
const { isAIPaused } = require('../handlers/humanTakeover');

const cooldowns = new Map();
const OWNER_ROLE_NAME = 'owner'; // matches your role name (case-insensitive)

async function getOwnerPing(guild) {
  try {
    await guild.roles.fetch();
    const ownerRole = guild.roles.cache.find(
      r => r.name.toLowerCase() === OWNER_ROLE_NAME
    );
    return ownerRole ? `<@&${ownerRole.id}>` : '';
  } catch {
    return '';
  }
}

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    const supportChannelId = process.env.SUPPORT_CHANNEL_ID;
    const isTicket = message.channel.name?.startsWith('ticket-');
    const isSupport = message.channel.id === supportChannelId;

    if (!isSupport && !isTicket) return;

    // ── If AI is paused in this channel, human has taken over ──
    if (isAIPaused(message.channel.id)) return;

    // ── Cooldown: 1 message per 3s per user ───────────────────
    const now = Date.now();
    if (cooldowns.has(message.author.id)) {
      if (now < cooldowns.get(message.author.id)) return;
    }
    cooldowns.set(message.author.id, now + 3000);

    message.channel.sendTyping();

    try {
      const reply = await askOpenAI(message.author.id, message.content);

      // ── Helper: send long messages in chunks ───────────────
      async function sendInChunks(channel, text, replyToMsg = null) {
        const MAX = 1900;
        if (text.length <= MAX) {
          if (replyToMsg) return replyToMsg.reply(text);
          return channel.send(text);
        }
        const chunks = [];
        let current = '';
        for (const line of text.split('\n')) {
          if ((current + '\n' + line).length > MAX) {
            if (current) chunks.push(current.trim());
            current = line;
          } else {
            current = current ? current + '\n' + line : line;
          }
        }
        if (current) chunks.push(current.trim());
        for (let i = 0; i < chunks.length; i++) {
          if (i === 0 && replyToMsg) await replyToMsg.reply(chunks[i]);
          else await channel.send(chunks[i]);
        }
      }

      // ── Check if AI is escalating ──────────────────────────
      if (reply.includes('[ESCALATE]')) {
        const cleanReply = reply.replace('[ESCALATE]', '').trim();
        const ownerPing = await getOwnerPing(message.guild);

        await sendInChunks(message.channel, cleanReply, message);

        await message.channel.send({
          embeds: [{
            color: 0xff0000,
            title: '🚨 Human Support Needed',
            description: `The AI couldn't fully resolve this issue.\n\n${ownerPing ? `${ownerPing} please take a look!` : 'A staff member is needed here.'}\n\nUse \`/takeover\` to pause the AI and assist manually.`,
            footer: { text: 'D3TX Support System' },
            timestamp: new Date().toISOString(),
          }],
          content: ownerPing || '',
        });

      } else {
        await sendInChunks(message.channel, reply, message);
      }

    } catch (error) {
      console.error('OpenAI error:', error);
      await message.reply('⚠️ Something went wrong on my end. A staff member will be with you shortly!');
    }
  },
};
