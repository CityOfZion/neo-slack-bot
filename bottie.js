const Bot = require('./bot.js');

const Train = require('./src/train');
const Brain = require('./src/brain');
const Ears = require('./src/ears');

const Bottie = {
  Brain: new Brain(),
  Ears: new Ears(Bot, process.env.token)
};


Bottie.Teach = Bottie.Brain.teach.bind(Bottie.Brain);
eachKey(customPhrases, Bottie.Teach);
Bottie.Brain.think();
Bottie.Ears
  .listen()
  .hear('TRAINING TIME!!!', function(speech, message) {
    console.log('Delegating to on-the-fly training module...');
    Train(Bottie.Brain, speech, message);
  })
  .hear('.*', function(speech, message) {
    const regex = /^(how|when|is|which|what|whose|who|whom|where|why|can)(.*)|([^.!?]+\?)/igm;

    const isQuestion = regex.test(message.text);
    // append.write [message.text] ---> to a file
    Bot.storage.questions.save({
      _id: new ObjectID(),
      id: new ObjectID(),
      isQuestion: isQuestion,
      text: message.text
    });
    if(isQuestion) {
      const interpretation = Bottie.Brain.interpret(message.text);
      console.log('Bottie heard: ' + message.text);
      console.log('Bottie interpretation: ', interpretation);
      if (interpretation.guess) {
        console.log('Invoking skill: ' + interpretation.guess);
        database.ignore.findOne({user: message.user, skill: interpretation.guess}, function(err, res) {
          const dateDiff = require('./imports/helpers/date-diff');
          let invoke = true;
          if(err === null && res !== null) {
            const newDate = new Date(res.dateUpdated);
            switch(res.interval) {
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
          if(invoke) {
            Bottie.Brain.invoke(interpretation.guess, interpretation, speech, message, Bot);
          }
        });
      }
    }
  });



function eachKey(object, callback) {
  Object.keys(object).forEach(function(key) {
    callback(key, object[key]);
  });
}
