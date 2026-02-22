const fs = require('fs');
const path = require('path');

const feedbackPath = path.join(__dirname, '../data/feedback.json');

function readFeedback() {
  if (!fs.existsSync(feedbackPath)) fs.writeFileSync(feedbackPath, '[]');
  return JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
}

function saveFeedback(entry) {
  const data = readFeedback();
  data.push(entry);
  fs.writeFileSync(feedbackPath, JSON.stringify(data, null, 2));
}

function getStats() {
  const data = readFeedback();
  if (data.length === 0) return null;
  const total = data.reduce((sum, e) => sum + e.rating, 0);
  const avg = (total / data.length).toFixed(2);
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  data.forEach(e => breakdown[e.rating]++);
  return { avg, total: data.length, breakdown };
}

module.exports = { saveFeedback, getStats, readFeedback };
