'use strict'

const axios = require('axios');
const fs = require('fs');

var fetchData = (url) => {
  console.log('>>> Fetching data');
  return new Promise((resolve, reject) => {
    axios.get(url).then((response) => {
      var data = response.data;
      resolve(data.matches);
    })
    .catch((err) => {
      console.log(err);
      reject(err);
    });
  });
};

var findEmail = (str) => {
  var tmp = str.split(' ');
  var mail = tmp[3];
  if (mail && mail.indexOf('@') > -1) {
    return mail;
  }
  return '';
};

var token = '';
var base_url = `https://www.scalyr.com/api/query?queryType=log&token=${token}&filter=%22Sent%20mail%20to%22&maxCount=5000`;
var urls = [
  `${base_url}&startTime=75h&endTime=65h`,
  `${base_url}&startTime=65h&endTime=55h`,
  `${base_url}&startTime=55h&endTime=45h`,
  `${base_url}&startTime=45h&endTime=35h`,
  `${base_url}&startTime=35h&endTime=25h`,
  `${base_url}&startTime=25h&endTime=15h`,
  `${base_url}&startTime=15h&endTime=1h`,
];

var execute = () => {
  //excute function

  var urlPromises = urls.map(fetchData);
  // console.log(urlPromises);
  var mailArr = [];
  Promise.all(urlPromises)
  .then((results) => {
    var newArr = results[0].concat(results[1]).concat(results[2]).concat(results[3]).concat(results[4]).concat(results[5]).concat(results[6]);
    for(var i = 0; i < newArr.length; i++) {
      var obj = newArr[i].attributes;
      var mail = findEmail(obj.details);
      console.log(mail);
      if (!!mail && mailArr.indexOf(mail) < 0) {
        mailArr.push(mail);
      }
    }
    fs.writeFile("mail.csv", mailArr.join(','), function(err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
    // console.log(mailArr);
  })
  .catch((err) => {
  });
}

console.log('>>>>> Start executing <<<<<');
execute();
