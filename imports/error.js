module.exports = function(controller, error) {
  controller.storage.error.save({error: error});
};