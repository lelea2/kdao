'use strict';

require('dotenv').load();

var express = require('express');
var app = express();

// console.log(app);
/// middleware
// ...
app.use(require('cookie-parser')());
app.use(require('rails-cookie-parser')('_reaslo_session', process.env.TOKEN));
// ...

app.use('/', function (req, res) {
  //console.log(req);
  console.log(req.cookies['_reaslo_session']); // Rails session cookie
  res.send('Hello world');
});

app.listen(3001);

// { session_id: '1242dffa2444d09b57216f1a50b7b7c4',
//_csrf_token: '9+X1Gqej3Ttfz1p1QLKWKO++wRBm8ojW6BmK8sSdUP4=',
//'warden.user.user.key': [ 'User', [ 217 ], '$2a$12$cFE0WaVdOS4qgctwKHclBu' ] }
