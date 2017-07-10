"use strict";

const mongo = require('mongodb');
const ObjectID = mongo.ObjectID;
const mongoose = require('mongoose');
const env = require('node-env-file');
env(__dirname + '/.env');

const fs = require('fs');
const Bot = require('./bot.js');
const Train = require('./src/train');
const Brain = require('./src/brain');
const Ears = require('./src/ears');

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('----------DB CONNECTED----------');

  const Bottie = {
    Brain: new Brain(),
    Ears: new Ears(Bot, process.env.token)
  };
  
  Bot.storage.phrases.all((err, docs) => {
    console.log('----------INITIAL DOCS-----------')
    console.log(err, docs);
    const customPhrases = {};
    docs.forEach(phrase => {
      customPhrases[phrase.skill] = phrase.phrases;
    });
  
    Bottie.Teach = Bottie.Brain.teach.bind(Bottie.Brain);
    eachKey(customPhrases, Bottie.Teach);
    Bottie.Brain.think();
    Bottie.Ears
      .listen()
      .hear('TRAINING TIME!!!', function (speech, message) {
        Train(Bottie.Brain, speech, message, Bot);
      })
      .hear('.*', function (speech, message) {
        const regex = /^(how|when|is|which|what|whose|who|whom|where|why|can)(.*)|([^.!?]+\?)/igm;
  
        const isQuestion = regex.test(message.text);
        // Save question to database for later analysis
        Bot.storage.questions.save({
          id: new ObjectID(),
          isQuestion: isQuestion,
          text: message.text
        });
  
        if (isQuestion) {
          const interpretation = Bottie.Brain.interpret(message.text);
          console.log('Bottie heard: ' + message.text);
          console.log('Bottie interpretation: ', interpretation);
          if (interpretation.guess) {
            console.log('Invoking skill: ' + interpretation.guess);
            Bot.storage.ignore.find({user: message.user, skill: interpretation.guess}, function (err, res) {
  
              console.log('FOUND SKILL? ', err, res);
  
              const dateDiff = require('./imports/helpers/date-diff');
              let invoke = true;
              if (err === null && res !== null) {
                const newDate = new Date(res.dateUpdated);
                switch (res.interval) {
                  case '1h':
                    invoke = (dateDiff(new Date(), newDate, 'hours') > 1);
                    break;
                  case '12h':
                    invoke = (dateDiff(new Date(), newDate, 'hours') > 12);
                    break;
                  case '24h':
                    invoke = (dateDiff(new Date(), newDate, 'hours') > 24);
                    break;
                  case 'forever':
                    invoke = false;
                    break;
                }
              }
              if (invoke) {
                Bottie.Brain.invoke(interpretation.guess, interpretation, speech, message, Bot);
              }
            });
          }
        }
      });
  });
});

function eachKey(object, callback) {
  Object.keys(object).forEach(function (key) {
    callback(key, object[key]);
  });
}