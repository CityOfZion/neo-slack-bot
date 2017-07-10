module.exports = function(controller) {
  controller.on('interactive_message_callback', function(bot, message) {
    const getCommand = require('../get-command');
    const args = message.callback_id.split('|');
    args.push(message.text);
    // Get the macro
    const command = args.shift();
  
    // Gets the macro
    const commandObject = getCommand(command, 'interactive_message_callback');
    if (commandObject !== false) {
      // call the macro and send the rest of the arguments with it
      commandObject.interactive_message_callback(controller, bot, message, args);
    } else {
      console.log('Macro does not exist: ', command);
    }
  })
};