module.exports = function(webserver, controller) {
  
  const handler = {
    login: function(req, res) {
      res.redirect(controller.getAuthorizeURL());
    },
    oauth: function(req, res) {
      const code = req.query.code;
      const state = req.query.state;
      
      // we need to use the Slack API, so spawn a generic bot with no token
      const slackapi = controller.spawn({});
  
      const opts = {
        client_id: controller.config.clientId,
        client_secret: controller.config.clientSecret,
        code: code
      };
      
      slackapi.api.oauth.access(opts, function(err, auth) {
        
        if (err) {
          return res.redirect('/login-error.html');
        }
        
        // what scopes did we get approved for?
        const scopes = auth.scope.split(/\,/);
        
        // use the token we got from the oauth
        // to call auth.test to make sure the token is valid
        // but also so that we reliably have the team_id field!
        slackapi.api.auth.test({token: auth.access_token}, function(err, identity) {
          
          if (err) {
            return res.redirect('/login-error.html');
          }
          
          // Now we've got all we need to connect to this user's team
          // spin up a bot instance, and start being useful!
          // We just need to make sure this information is stored somewhere
          // and handled with care!
          
          // In order to do this in the most flexible way, we fire
          // a botkit event here with the payload so it can be handled
          // by the developer without meddling with the actual oauth route.
          
          auth.identity = identity;
          controller.trigger('oauth:success', [auth]);
          
          res.cookie('team_id', auth.team_id);
          res.cookie('bot_user_id', auth.bot.bot_user_id);
          res.redirect('/login-success.html');
          
        });
        
        
      });
    }
  };
  
  
  // Create a /login link
  // This link will send user's off to Slack to authorize the app
  // See: https://github.com/howdyai/botkit/blob/master/readme-slack.md#custom-auth-flows
  webserver.get('/login', handler.login);
  
  // Create a /oauth link
  // This is the link that receives the postback from Slack's oauth system
  // So in Slack's config, under oauth redirect urls,
  // your value should be https://<my custom domain or IP>/oauth
  webserver.get('/oauth', handler.oauth);
  
  return handler;
};