// Channels where AI is paused — human has taken over
const pausedChannels = new Set();

function pauseAI(channelId) {
  pausedChannels.add(channelId);
}

function resumeAI(channelId) {
  pausedChannels.delete(channelId);
}

function isAIPaused(channelId) {
  return pausedChannels.has(channelId);
}

module.exports = { pauseAI, resumeAI, isAIPaused };
