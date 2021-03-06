var qr = require('qr-image');
var express = require('express');
var port = 3000;

var app = express();

app.set('view engine', 'jade');

app.get('/', function(req, res) {
  var code = qr.image('San Joser Performance Art Center', { type: 'svg', size: 5 });
  //console.log(code);
  res.type('svg');
  code.pipe(res);
});

app.get('/imagerender', function(req, res) {
  var code = qr.svgObject('San Joser Performance Art Center', { type: 'svg', size: 5 });
  //console.log(code);
  res.render('index', {path: code.path});
});

app.get('/qrcode1', function(req, res) {
  var code = qr.svgObject('45304c60-9eac-48bf-9d0b-c02dda6c6cb3', { type: 'svg', size: 5 });
  //console.log(code);
  res.render('index', {path: code.path});
});

app.get('/qrcode2', function(req, res) {
  var code = qr.svgObject('8f14886c-d267-44b8-8518-8cf363634929', { type: 'svg', size: 5 });
  //console.log(code);
  res.render('index', {path: code.path});
});

app.listen(port, function (err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
