module.exports = (controller, message) => {
  //const ignore = controller.db.ignore.find({id: message.callback_id + '|' + message.user});
  console.log('IGNORE', message);
  //return ignore;
};