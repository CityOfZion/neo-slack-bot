const mongoose = require('mongoose');
const env = require('node-env-file');
env(__dirname + '/.env');

if (!process.env.clientId || !process.env.clientSecret || !process.env.PORT) {
  console.log('Error: Specify clientId clientSecret and PORT in environment');
  process.exit(1);
}

const Botkit = require('botkit');
const debug = require('debug')('botkit:main');

const bot_options = {
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  token: process.env.token,
  // debug: true,
  retry: true,
  scopes: ['bot', 'commands', 'incoming-webhook', 'identify']
};

bot_options.storage = require('./imports/database/mongoose')({
  mongoUri: process.env.MONGO_URI
});

// Create the Botkit controller, which controls all instances of the bot.
const controller = Botkit.slackbot(bot_options);

controller.startTicking();

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(__dirname + '/components/express-webserver.js')(controller);

const normalizedSkillsPath = require("path").join(__dirname,"imports", "events");
require("fs").readdirSync(normalizedSkillsPath).forEach(function(file) {
  if(file.indexOf('.') > -1) {
    require(normalizedSkillsPath + '/' + file)(controller);
  }
});

module.exports = controller;