module.exports = function(webserver, controller) {
  webserver.get('/\.well-known/acme-challenge/ioBrxPucTdjVrAYLNwnb6JZQSDaaRzeTqKe8ReeDre0', function(req, res) {
    console.log(req, res);
    res.redirect('/.well-known/acme-challenge/ioBrxPucTdjVrAYLNwnb6JZQSDaaRzeTqKe8ReeDre0');
  })
};