module.exports = async function(skill, info, bot, message, senti, controller) {
  controller.storage.phrases.findOne({skill: skill}, (err, data) => {
    console.log (' RESULT ', err, data);
    bot.startPrivateConversation(message, function(err, conv) {
      if(err) {
        console.log(skill, err);
      } else {
        const msg = require('./helpers/create-private-message')(data.answer, skill);
        conv.say(msg);
      }
    });
  });
};
