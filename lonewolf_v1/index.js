'use strict';

require('dotenv').load();

var LoneWolf = require('lone-wolf');
// console.log(process.env);
var api = new LoneWolf({
    apiToken: process.env.LW_API_TOKEN,
    clientCode: process.env.LW_CLIENT_CODE,
    secretKey: process.env.LW_SECRET_KEY
});

// console.log(api);

// api.getTransactions().then(function(result) {
//   console.log(result);
// });

// api.deleteTransaction("BOkzznAH6GxqgukyrYk-Lw==").then(function(result) {
//   console.log(result);
// }, function(err) {
//   console.log(err);
// });


// api.getClassifications().then(function(result) {
//   var arr = [];
//   if (result.length > 0) {
//     for (var i = 0; i < result.length; i++) {
//       if (!!result[i].LWCompanyCode) {
//         arr.push(result[i]);
//       }
//     }
//     console.log(">>>>>>>>>>>>>>>> Classification <<<<<<<<<<<<<<<<<<");
//     console.log(arr);
//   }
// });


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

// api.getContactTypes().then(function(result) {
//   var arr = [];
//   if (result.length > 0) {
//     for (var i = 0; i < result.length; i++) {
//       // if (!!result[i].LWCompanyCode) {
//         arr.push(result[i]);
//       // }
//     }
//     console.log(">>>>>>>>>>>>>>>> Contact Type <<<<<<<<<<<<<<<<<<");
//     console.log(arr);
//   }
// });


// api.getTransactions().then(function(result) {
//   console.log(">>>>>>>>>>>>>>>> Transactions <<<<<<<<<<<<<<<<<<");
//   var arr = [];
//   for (var i = 0; i < result.length; i++) {
//     if (result[i].Classification.EndCount  === 1 &&  result[i].Id === '41_izV00dh-GkuITUEg6dw==') {//< 2) {
//       arr.push(JSON.stringify(result[i]));
//       console.log(JSON.stringify(result[i]));
//     }
//   }
//   console.log(arr.length);
// }, function(err) {
//   console.log(err);
// });
