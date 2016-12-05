'use strict';

var express = require('express');
var app = express();
var json2csv = require('json2csv');
var Massage = require('massage');
var fs = require('fs');
var BPromise = require('bluebird');

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/pdf', function(req, res) {
  var doc = fs.readFileSync('./assets/ios-Assignment2.pdf');
  Massage.getMetaData(doc).then(function(data) {
    res.status(200).json(data);
  });
});

app.get('/jpg', function(req, res) {
  var doc = fs.readFileSync('./assets/dumbo.jpg');
  Massage.getMetaData(doc).then(function(data) {
    res.status(200).json(data);
  });
});

//Serving PDF on browser
app.get('/mypdf', function(req, res) {
  var filePath = "/assets/ios-Assignment2.pdf";
  fs.readFile(__dirname + filePath , function (err,data) {
    res.contentType("application/pdf");
    res.send(data);
  });
});

//Generate JSON to PDF file
//Referenced: https://www.hacksparrow.com/using-node-js-to-download-files.html
//<a href="path_to_file" download="proposed_file_name">Download</a>
app.get('/download', function(req, res) {
  var fields = ['car.make', 'car.model', 'price', 'color'];
  var myCars = [{
      "car": {"make": "Audi", "model": "A3"},
      "price": 40000,
      "color": "blue"
    }, {
      "car": {"make": "BMW", "model": "F20"},
      "price": 35000,
      "color": "black"
    }, {
      "car": {"make": "Porsche", "model": "9PA AF1"},
      "price": 60000,
      "color": "green"
    }];
  var csv = json2csv({ data: myCars, fields: fields });
  fs.writeFile('assets/file.csv', csv, function(err) {
    if (err) throw err;
    res.download('')
    console.log('file saved');
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
