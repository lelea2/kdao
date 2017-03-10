'use strict';

const axios = require('axios');
const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');

// parse various different custom JSON types as JSON
app.use(bodyParser.urlencoded({'extended': false}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

//Allow origin
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Server started on port', process.env.PORT);
});

app.get('/checkspam', (req, res) => res.render('index.html'));

app.post('/checkspam', (req, res) => {
  console.log('>>>> Check spam <<<<<<');
  console.log(req);
  res.status(200).json({});
  // axios({
  //   method: 'post',
  //   url: 'http://spamcheck.postmarkapp.com/filter',
  //   data: req.body.content
  // }).then((response) => {
  //   res.status(200).json(response);
  // }).catch((err) => {
  //   res.status(500).send(err);
  // });
});
