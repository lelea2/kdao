'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 8080;

app.use(express.static('./public'));

app.post('/api', (req, res) => {
  req.pipe(fs.createWriteStream('./public/' + req.url));
  res.status(200).json({data: 'test'});
});

app.get('/', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello World\n");
});

app.listen(port, function () {
  console.log('Server started on port: ', port);
});
