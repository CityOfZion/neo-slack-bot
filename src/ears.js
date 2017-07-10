"use strict";


module.exports = Ears;
let Bot;
function Ears(bot, token) {
  this.scopes = [
    'direct_mention',
    'direct_message',
    'mention',
    'message_received',
    'message',
    'ambient'
  ];
  Bot = bot;
  // if we haven't defined a token, get the token from the session variable.
  if (Bot.token === undefined) {
    this.token = token;
    }
}

Ears.prototype.listen = function() {
  this.bot = Bot.spawn({
    token: this.token
  }).startRTM();
  return this;
};

Ears.prototype.hear = function(pattern, callback) {
  Bot.hears(pattern, this.scopes, callback);
  return this;
};
