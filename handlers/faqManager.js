const fs = require('fs');
const path = require('path');

const faqPath = path.join(__dirname, '../data/faq.json');

function readFAQ() {
  if (!fs.existsSync(faqPath)) {
    fs.writeFileSync(faqPath, JSON.stringify([], null, 2));
  }
  return JSON.parse(fs.readFileSync(faqPath, 'utf8'));
}

function writeFAQ(data) {
  fs.writeFileSync(faqPath, JSON.stringify(data, null, 2));
}

function addFAQ(question, answer) {
  const faq = readFAQ();
  const id = Date.now().toString();
  faq.push({ id, question, answer });
  writeFAQ(faq);
  return id;
}

function removeFAQ(id) {
  const faq = readFAQ();
  const index = faq.findIndex(f => f.id === id);
  if (index === -1) return false;
  faq.splice(index, 1);
  writeFAQ(faq);
  return true;
}

function editFAQ(id, question, answer) {
  const faq = readFAQ();
  const entry = faq.find(f => f.id === id);
  if (!entry) return false;
  if (question) entry.question = question;
  if (answer) entry.answer = answer;
  writeFAQ(faq);
  return true;
}

function listFAQ() {
  return readFAQ();
}

module.exports = { addFAQ, removeFAQ, editFAQ, listFAQ };
