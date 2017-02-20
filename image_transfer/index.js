'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const port = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const gm = require('gm');

let options = {
  inflate: true,
  limit: '100kb',
  type: 'application/octet-stream'
};
app.use(bodyParser.raw(options));

// app.use(function(req, res, next) {
//   req.rawBody = '';
//   req.setEncoding('utf8');
//   req.on('data', function(chunk) {
//     req.rawBody += chunk;
//   });
//   req.on('end', function() {
//     next();
//   });
// });
// app.use(express.bodyParser());

app.use(express.static('./public'));

app.post('/api', (req, res) => {
  console.log(req.body);
  var ts = Math.ceil(new Date().getTime() / 1000);
  fs.writeFile('./public/khanh' + ts + '.jpg', req.body, 'binary', function(err) {
    console.log(err); // writes out file without error, but it's not a valid image
  });
  res.status(200).json({data: 'test'});
});

app.get('/', (req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("Hello World\n");
});

app.get('/files', (req, res) => {
  var files = getFiles('./public');
  res.status(200).json({
    files: files
  });
});

app.get('/property/:image_path', (req, res) => {
  // obtain the size of an image
  console.log(req.params.image_path);
  gm('./public/' + req.params.image_path)
  .size(function (err, size) {
    console.log(err);
    if (!err) {
      console.log('width = ' + size.width);
      console.log('height = ' + size.height);
      res.status(200).json(size);
    } else {
      res.status(500).send(err);
    }
  });
});

app.delete('/property/:image_path', (req, res) => {
  fs.unlink('./public/' + req.params.image_path, (err) => {
    if (err) {
      return console.log(err);
      res.status(500).send(err);
    } else {
      console.log('file deleted successfully');
      res.status(200).json({});
    }
  });
});

app.listen(port, function () {
  console.log('Server started on port: ', port);
});


var getFiles = (dir, files_) => {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
          getFiles(name, files_);
      } else {
          files_.push(name);
      }
  }
  return files_;
}
