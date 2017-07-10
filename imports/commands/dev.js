const options = {
  add: {
    description: "Add yourself to the devs list",
    action(controller, bot, message, arguments) {
      console.log('-----------------------------')
      controller.storage.devskills.all(function (err, res) {
        console.log('FOUND SKILLS?', err, res);
        const skills = [];
        if (!err) {
          res.forEach(function (skill) {
            skills.push({
              name: skill.id,
              text: skill.id,
              type: "button",
              value: skill.id
            });
          });
        }
        
        console.log('GOT SKILLS', skills);
  
        const attachments = [{
          "text": "Choose one or multiple skills",
          "fallback": "You are unable to choose a skill",
          "callback_id": "dev|adduserskill",
          "color": "#3AA3E3",
          "attachment_type": "default",
          "actions": skills
        }];
        
        const skillQuestion = {
          text: "What are your skills?",
          attachments: attachments
        };
        
        console.log('GENERATED QUESTION')
  
        bot.replyPrivate(message, skillQuestion, function(err, res) {
          console.log('SENT QUESTION', err,res);
        });
      });
    }
  },
  list: {
    description: "List the devs",
    options: [
      "[skills:C++,C#]"
    ],
    action(controller, bot, message, arguments) {
    
    }
  },
  modify: {
    description: "Modify your skills",
    action(controller, bot, message, arguments) {
    
    }
  },
  addskill: {
    description: "Adds a skill to the skill list",
    action(controller, bot, message, arguments) {
      const skill = arguments.join(' ');
      console.log('KJHADLKSJAHDLKA', skill, message);
      controller.storage.devskills.save({id: skill}, function(err, res) {
        console.log('trying to save: ', skill, res, err);
        if(err) {
          bot.replyPrivate(message, {text: "An error occurred saving the skill, try again"}, function(res, req) {
            console.log('PRIVATE REPLY', res, req);
          })
        } else {
          bot.replyPrivate(message, {text: `The skill [${skill}] was saved`}, function(res, req) {
            console.log('PRIVATE REPLY', res, req);
          })
        }
      });
    }
  }
};

const interactive_message_feedback = function(controller, bot, message, arguments) {
  console.log('Command message feedback: ', message, arguments);
};

const command = function(controller, bot, message, arguments) {
  if(arguments.length > 0) {
    const option = arguments.shift();
    if(options.hasOwnProperty(option)) {
      options[option].action(controller, bot, message, arguments);
    }
  } else {
    
    const attachments = [];
    for(let opt in options) {
      
      const at = {
        title: options[opt].description,
        fields: [{
          value: message.command + ' ' + opt,
          short: true
        }]
      };
      
      if(options[opt].options) {
        options[opt].options.forEach(function(o) {
          at.fields.push({
            value: o,
            short: true
          });
        });
      }
      
      attachments.push(at);
    }
    
    const list = {
      text: "These commands are available to you",
      attachments: attachments
    };
    
    console.log('LIST', list);
    bot.replyPrivate(message, list, function(res, req) {
      console.log('PRIVATE REPLY', res, req);
    })
  }
};

module.exports = {
  command: command,
  interactive_message_feedback: interactive_message_feedback
};