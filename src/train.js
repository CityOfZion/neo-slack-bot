"use strict";

const fs = require('fs');

module.exports = Train;

function Train(Brain, speech, message, Bot) {
  let phraseExamples = [];
  let answer = "";
  let phraseName;
  speech.startConversation(message, function(err, convo) {
      convo.ask('Sure, what do you want to call this skill? ' +
        'This is the machine name, so pick a good name for a file basename.', [
          {
            pattern: '.*',
            callback: function(response, convo) {
              phraseName = response.text;
              convo.say('Right, I\'ll call it `' + phraseName + '`.');
              convo.say('Okay, now give me a bunch of ways you might say this. ' +
                'When you\'re done, just sent me the word done all by itself on a line.');
              convo.ask('How might you say this?', [
                {
                  pattern: '.*',
                  callback: function(response, convo) {
                    phraseExamples.push(response.text);
                    reprompt(convo);
                    convo.next();
                  }
                }
              ]);
              convo.next();
            }
          }
        ]);

    function reprompt(convo) {
      convo.ask('Okay, how else?', [
        {
          pattern: '^done$',
          callback: function(response, convo) {
            convo.say('Great, now let me think about that...');
            Brain.teach(phraseName, phraseExamples);
            Brain.think();
            writeSkill(phraseName, phraseExamples, answer, Bot, function() {
              convo.say('All done! You should try seeing if I understood now!');
              convo.next();
            });
            convo.next();
          }
        },
        {
          pattern: '^cancel$',
          callback: function(response, convo) {
            convo.say('Canceling');
            answer = '';
            phraseName = '';
            phraseExamples = [];
            convo.next();
          }
        },
        {
          pattern: '^answer$',
          callback: function(response, convo) {
            askAnswer(convo);
            convo.next();
          }
        },
        {
          pattern: '.*',
          callback: function(response, convo) {
            phraseExamples.push(response.text);
            reprompt(convo);
            convo.next();
          }
        }
      ]);
    }
    
    function askAnswer(convo) {
      convo.say('You are adding an answer');
      
      convo.ask('Type your answer for the questions, if you are done after that, type done', [
        {
          pattern: '.*',
          callback: function(response, convo) {
            answer = response.text;
        
            reprompt(convo);
            convo.next();
          }
        }
      ]);
    }
  });
}

function writeSkill(name, vocab, answer, Bot, callback) {
  try {
  
  Bot.storage.phrases.findOne({skill: name}, (err, res) => {
    if (err) {
      callback();
      return;
    }
  
    if (res) {
      Bot.storage.phrases.findOneAndUpdate({skill: name}, {answer: answer, $addToSet: {phrases: {$each: vocab}}}, (err, res) => {
        if(err) {
          throw err;
        } else {
          callback();
        }
      });
    } else {
      Bot.storage.phrases.save({
        skill: name,
        phrases: vocab,
        answer: answer
      }, (err, res) => {
        if(err) {
          throw err;
        } else {
          callback();
        }
      });
    }
  });
  } catch (e) {
    require('../imports/error')(Bot, e);
  }
 
}
