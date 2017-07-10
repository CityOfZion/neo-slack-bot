
module.exports = function(skill, info, bot, message) {
  bot.reply(message, 'I understood this as `' + skill +
    '`, but you haven\'t configured how to make me work yet!');
};
