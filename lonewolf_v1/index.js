'use strict';

require('dotenv').load();

var LoneWolf = require('lone-wolf');
var api = new LoneWolf({
    apiToken: process.env.LW_API_TOKEN,
    clientCode: process.env.LW_CLIENTCODE,
    secretKey: process.env.LW_SECRET_KEY
});

// api.getTransactions().then(function(result) {
//   console.log(result);
// });

// api.deleteTransaction("BOkzznAH6GxqgukyrYk-Lw==").then(function(result) {
//   console.log(result);
// }, function(err) {
//   console.log(err);
// });


api.getClassifications().then(function(result) {
  var arr = [];
  if (result.length > 0) {
    for (var i = 0; i < result.length; i++) {
      if (!!result[i].LWCompanyCode) {
        arr.push(result[i]);
      }
    }
    console.log(">>>>>>>>>>>>>>>> Classification <<<<<<<<<<<<<<<<<<");
    console.log(arr);
  }
});


// api.getPropertyTypes().then(function(result) {
//   var arr = [];
//   if (result.length > 0) {
//     for (var i = 0; i < result.length; i++) {
//       if (!!result[i].LWCompanyCode) {
//         arr.push(result[i]);
//       }
//     }
//     console.log(">>>>>>>>>>>>>>>> Property Type <<<<<<<<<<<<<<<<<<");
//     console.log(arr);
//   }
// });

api.getMembers().then(function(result) {
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>> Get Members <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
  console.log(result);
});

api.getContactTypes().then(function(result) {
  var arr = [];
  if (result.length > 0) {
    for (var i = 0; i < result.length; i++) {
      if (!!result[i].LWCompanyCode) {
        arr.push(result[i]);
      }
    }
    console.log(">>>>>>>>>>>>>>>> Contact Type <<<<<<<<<<<<<<<<<<");
    console.log(arr);
  }
});


// api.getTransactions().then(function(result) {
//   console.log(">>>>>>>>>>>>>>>> Transactions <<<<<<<<<<<<<<<<<<");
//   var arr = [];
//   for (var i = 0; i < result.length; i++) {
//     if (/*result[i].Classification.EndCount  === 1 && */ result[i].MLSAddress.StreetNumber === '40') {//< 2) {
//       arr.push(result[i]);
//     }
//   }
//   console.log(arr);
// });
