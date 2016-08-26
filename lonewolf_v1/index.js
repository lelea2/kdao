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

api.deleteTransaction("BOkzznAH6GxqgukyrYk-Lw==").then(function(result) {
  console.log(result);
}, function(err) {
  console.log(err);
});
