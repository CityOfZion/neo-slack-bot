const interactive_message_callback = function(controller, bot, message, arguments) {
  const [skill, interval] = arguments;
  
  controller.storage.ignore.save({
    id: message.callback_id + '|' + message.user,
    user: message.user,
    skill: skill,
    interval: interval,
    dateUpdated: new Date()
  });
  console.log('MESSAGE', message);
  
  message.original_message.attachments = [
    {text: `You've ignored this message for [${message.actions[0].name}]`}
  ];
  
  bot.replyInteractive(message, message.original_message, function(err, res) {
    console.log('REPLAYING INT', err, res);
  });
};

module.exports = {
  interactive_message_callback: interactive_message_callback
};