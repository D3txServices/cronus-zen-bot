const { initInactivityTracker } = require('../handlers/ticketManager');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`✅ Bot is online as ${client.user.tag}`);
    client.user.setActivity('Cronus Zen Support 🎮', { type: 3 });
    initInactivityTracker(client);
    console.log('✅ Inactivity tracker started');
  },
};
