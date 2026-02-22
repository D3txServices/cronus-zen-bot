const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Conversation history per user (in-memory, resets on bot restart)
const conversationHistory = new Map();

function getFAQ() {
  try {
    const faqPath = path.join(__dirname, '../data/faq.json');
    return JSON.parse(fs.readFileSync(faqPath, 'utf8'));
  } catch {
    return [];
  }
}

function getScripts() {
  try {
    const scriptsPath = path.join(__dirname, '../data/scripts.json');
    return JSON.parse(fs.readFileSync(scriptsPath, 'utf8'));
  } catch {
    return [];
  }
}

function buildSystemPrompt() {
  const faq = getFAQ();
  const scripts = getScripts();

  const faqText = faq.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n');
  const scriptText = scripts.map(s =>
    `Script: ${s.name}\nDescription: ${s.description}\nValues: ${s.values}`
  ).join('\n\n');

  return `You are a friendly and knowledgeable Cronus Zen support assistant for a Discord server.
Your job is to help users with:
- Setting up their Cronus Zen device
- Installing and configuring GamePacks
- Understanding and tweaking GPC scripts and values
- Troubleshooting connection issues (USB, Bluetooth, PS4/PS5/Xbox)
- General Cronus Zen questions

Always be helpful, clear, and concise. If you don't know something, say so honestly.
Format your answers clearly using bullet points or numbered steps when explaining processes.
Do NOT help with anything unrelated to Cronus Zen.

=== KNOWLEDGE BASE (FAQ) ===
${faqText || 'No FAQ entries yet.'}

=== SCRIPTS & VALUES DATABASE ===
${scriptText || 'No scripts added yet.'}`;
}

async function askOpenAI(userId, userMessage) {
  // Get or create conversation history for this user
  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, []);
  }
  const history = conversationHistory.get(userId);

  // Keep only last 10 messages to save tokens
  if (history.length > 10) {
    history.splice(0, history.length - 10);
  }

  history.push({ role: 'user', content: userMessage });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      ...history,
    ],
    max_tokens: 600,
    temperature: 0.7,
  });

  const reply = response.choices[0].message.content;
  history.push({ role: 'assistant', content: reply });

  return reply;
}

// Clear a user's conversation history
function clearHistory(userId) {
  conversationHistory.delete(userId);
}

module.exports = { askOpenAI, clearHistory };
