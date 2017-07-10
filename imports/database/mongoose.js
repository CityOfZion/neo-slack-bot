var mongoose = require('mongoose');

/**
 * botkit-storage-mongoose - MongoDB/Mongoose driver for Botkit
 *
 * @param  {Object} config Must contain a mongoUri property
 * @return {Object} A storage object conforming to the Botkit storage interface
 */
module.exports = function(config) {
  
  if (!config || !config.mongoUri) {
    throw new Error('Need to provide mongo address.');
  }
  
  const db = mongoose.createConnection(config.mongoUri);
  const storage = {};
  let zones = ['teams', 'channels', 'users', 'questions', 'ignore', 'devskills', 'phrases'];
  
  if(config.tables) {
    zones = zones.concat(config.tables);
  }
  
  zones.forEach(function(zone) {
    var model = createModel(db, zone);
    storage[zone] = getStorage(model);
  });
  
  return storage;
};

function createModel(db, zone) {
  var schema = new mongoose.Schema({}, {
    strict: false,
    collection: zone
  });
  return db.model(zone, schema);
}

function getStorage(model) {
  return {
    get: function(id, cb) {
      model.findOne({
        id: id
      }).lean().exec(cb);
    },
    save: function(data, cb) {
      model.findOneAndUpdate({
        id: data.id
      }, data, {
        upsert: true,
        new: true
      }).lean().exec(cb);
    },
    all: function(cb) {
      model.find({}).lean().exec(cb);
    },
    find: function(data, cb) {
      model.find(data).lean().exec(cb);
    },
    findOne: function(data, cb) {
      model.findOne(data).lean().exec(cb);
    },
    findOneAndUpdate: function(cond, data, cb) {
      model.findOneAndUpdate(cond, data, cb)
    }
  };
}