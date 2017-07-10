const interactive_message_feedback = function(controller, bot, message, arguments) {
  console.log('message', message);
  console.log('arguments', arguments);
};

const command = function(controller, bot, message, arguments) {
  console.log('message', message);
  console.log('arguments', arguments);
};

module.exports = {
  command: command,
  interactive_message_feedback: interactive_message_feedback
};