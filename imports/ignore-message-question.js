const createIgnoreMessage = (type) => {
  const ignoreAttachment =  {
    "text": "In the future, how long would you like to ignore this message?",
    "callback_id": "ignore|" + type,
    "attachment_type": "default",
    "actions": [
      {
        "name": "forever",
        "text": "Forever",
        "type": "button",
        "value": "forever"
      },{
        "name": "1 hour",
        "text": "1 hour",
        "type": "button",
        "value": "1h"
      },{
        "name": "12 hours",
        "text": "12 hours",
        "type": "button",
        "value": "12h"
      },{
        "name": "1 day",
        "text": "1 day",
        "type": "button",
        "value": "24h"
      }
    ]
  };
  return ignoreAttachment;
};

module.exports = createIgnoreMessage;