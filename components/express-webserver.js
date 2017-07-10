const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('botkit:webserver');

module.exports = function(controller) {
  
  const webserver = express();
  webserver.use(bodyParser.json());
  webserver.use(bodyParser.urlencoded({ extended: true }));
  
  webserver.use('/', express.static('public'));
  
  webserver.listen(process.env.PORT || 3000, null, function() {
    
    debug('Express webserver configured and listening at http://localhost:' + process.env.PORT || 3000);
    
  });
  
  // import all the pre-defined routes that are present in /components/routes
  const normalizedPath = require("path").join(__dirname,'..','imports', "routes");
  require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require(normalizedPath + "/" + file)(webserver, controller);
  });
  
  controller.webserver = webserver;
  
  return webserver;
  
};