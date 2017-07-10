"use strict";

const fs = require('fs');

module.exports = Train;

function Train(Brain, speech, message, Bot) {
  console.log('Inside on-the-fly training module.');
  console.log('Asking user for name of skill.');
  const phraseExamples = [];
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
            });
            convo.next();
          }
        },
        {
          pattern: '^answer$',
          callback: function(response, convo) {
            convo.say('Type your answer for the questions, if you are done after that, type done');
            answer = response.text;
            reprompt(convo);
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
  });
}

async function writeSkill(name, vocab, answer, Bot, callback) {
  console.log('Writing new data to database...');
  
  const res = Bot.storage.phrases.find({skill: name});
  
  let result;
  
  if(res.length > 0) {
    result = await Bot.storage.phrases.findOneAndUpdate({skill: name}, {$addToSet: {phrases: vocab}});
  } else {
    result = await Bot.storage.phrases.insert({
      skill: name,
      phrases: vocab,
      answer: answer
    });
  }
  
  console.log(' RESULT WRITING ', result);
  
  callback();
}
