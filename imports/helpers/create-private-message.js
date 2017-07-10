const ignore = require('../ignore-message-question');
module.exports = (text, skill) => {
  return {
    text: text,
    attachments: [
      ignore(skill)
    ]
  };
};