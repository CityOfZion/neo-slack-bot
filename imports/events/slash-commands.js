module.exports = function(controller) {
  controller.on('slash_command', function(bot, message) {
    console.log('slash_command', message);
    const getCommand = require('../get-command');
    let args = [];
    if(message.text !== '') {
      args = message.text.split(' ');
    }
  
    // Gets the macro
    const commandObject = getCommand(message.command, 'command');
    if (commandObject !== false) {
      // call the macro and send the rest of the arguments with it
      commandObject.command(controller, bot, message, args);
    } else {
      console.log('Macro does not exist: ', message.command);
    }
  })
};