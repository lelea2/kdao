#!/usr/bin/env node

var fs = require('fs');
var commandLineArguments = process.argv.slice(2);
console.log(commandLineArguments);

// Run example node testFolder.js test.json <skip_folder>
// Folder separated by ','
function f() {
  try {
    var data = require(commandLineArguments[0]);
    var outputFile = commandLineArguments[1];
    var excludeFiles = commandLineArguments[2] || '';
    var excludeFilesArr = excludeFiles.split(',');
    var items = data.item;
    var newItem = [];
    if (excludeFilesArr.length === 0) {
      fs.writeFileSync(outputFile, JSON.stringify(newData), 'utf-8');
      return 'Done';
    }
    items.forEach(function(val, index) {
      if (excludeFilesArr.indexOf(val.name) < 0) {
        newItem.push(val);
      }
    });
    var newData = data;
    newData.item = newItem;
    fs.writeFileSync(outputFile, JSON.stringify(newData), 'utf-8');
    return 'Done';
  } catch(ex) {
    console.log(ex);
    return '>>>> Error';
  }
}

return f();
