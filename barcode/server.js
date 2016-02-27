var qr = require('qr-image');
var express = require('express');
var port = 3000;

var app = express();

app.set('view engine', 'jade');

app.get('/', function(req, res) {
  var code = qr.image('San Joser Performance Art Center', { type: 'svg', size: 5 });
  console.log(code);
  res.type('svg');
  code.pipe(res);
});

app.get('/imagerender', function(req, res) {
  var code = qr.svgObject('San Joser Performance Art Center', { type: 'svg', size: 5 });
  console.log(code);
  res.render('index');
});


app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
