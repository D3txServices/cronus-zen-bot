const { handleRatingReaction } = require('../handlers/ticketManager');

module.exports = {
  name: 'messageReactionAdd',
  async execute(reaction, user, client) {
    if (user.bot) return;

    // Handle partial reactions
    try {
      if (reaction.partial) await reaction.fetch();
      if (reaction.message.partial) await reaction.message.fetch();
    } catch (err) {
      console.error('Error fetching reaction:', err);
      return;
    }

    await handleRatingReaction(reaction, user);
  },
};
