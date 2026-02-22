const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const faqPath = path.join(__dirname, '../data/faq.json');

function readFAQ() {
  if (!fs.existsSync(faqPath)) fs.writeFileSync(faqPath, '[]');
  return JSON.parse(fs.readFileSync(faqPath, 'utf8'));
}

function writeFAQ(data) {
  fs.writeFileSync(faqPath, JSON.stringify(data, null, 2));
}

async function learnFromTicket(messages) {
  try {
    // Build conversation text from ticket messages (skip embeds/bot system messages)
    const convo = messages
      .filter(m => m.content && !m.author.bot)
      .map(m => `${m.author.bot ? 'AI' : 'User'}: ${m.content}`)
      .join('\n');

    if (convo.length < 50) return; // Not enough content to learn from

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an assistant that extracts useful Q&A pairs from Cronus Zen support conversations.
Extract only clear, helpful question and answer pairs that would be useful for future support.
Only extract pairs where the answer is actually helpful and correct.
Return ONLY a valid JSON array, no other text, like this:
[{"question": "...", "answer": "..."}]
If there are no good Q&A pairs to extract, return an empty array: []`,
        },
        {
          role: 'user',
          content: `Extract Q&A pairs from this support conversation:\n\n${convo}`,
        },
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const raw = response.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const pairs = JSON.parse(cleaned);

    if (!Array.isArray(pairs) || pairs.length === 0) return;

    const faq = readFAQ();
    let added = 0;

    for (const pair of pairs) {
      if (!pair.question || !pair.answer) continue;

      // Avoid duplicates — check if similar question already exists
      const duplicate = faq.some(f =>
        f.question.toLowerCase().includes(pair.question.toLowerCase().slice(0, 30))
      );
      if (duplicate) continue;

      faq.push({
        id: `auto_${Date.now()}_${added}`,
        question: pair.question,
        answer: pair.answer,
        source: 'auto-learned',
        learnedAt: new Date().toISOString(),
      });
      added++;
    }

    writeFAQ(faq);
    if (added > 0) console.log(`🧠 Auto-learned ${added} new Q&A pair(s) from ticket`);
  } catch (err) {
    console.error('Learning error:', err.message);
  }
}

module.exports = { learnFromTicket };
