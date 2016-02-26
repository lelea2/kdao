var qr = require('qr-image');
var express = require('express');
var port = 3000;

var app = express();

app.get('/', function(req, res) {
  var code = qr.image(new Date().toString(), { type: 'svg', size: 5 });
  res.type('svg');
  code.pipe(res);
});


app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
