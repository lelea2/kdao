//OData reference:
// https://olingo.apache.org/doc/odata4/tutorials/sqo_tcs/tutorial_sqo_tcs.html

'use strict';

require('dotenv').load();

var needle = require('needle');
var context = {
  fail: function(err) {
    console.log(err);
  },
  done: function(err, data) {
    console.log(data);
  }
}
var CONFIG = {
  'CLIENT_CODE': process.env.LW_CLIENTCODE,
  'API_TOKEN': process.env.LW_API_TOKEN,
  'CONSUMER_KEY': process.env.LW_CONSUMER_KEY,
  'SECRET_KEY': process.env.LW_SECRET_KEY,
  'HOST': process.env.LW_HOST
};
var util = require('./helper')({config: CONFIG});

function getUser(event, context) {
  var params = event.params || {};
  var id = params.id; //Eg: 2380
  var all_flag = (id === 'all') ? true : false;
  var uri = '';
  if (all_flag === true) { //Get all members
    uri = '/wolfconnect/members/v1/';
  } else {
    uri = '/wolfconnect/members/v1/?$filter=Number eq \'' + id + '\'))';
  }
  var url = CONFIG.HOST + uri;
  var options = {
    headers: util.generateLWHeader(uri, 'GET')
  };
  needle.get(url, options, function(error, response) {
    if (!error && response.statusCode === 200 && response.body) {
      if (all_flag === true) {
        context.done(null, {'data': response.body}); //collection of members
      } else {
        console.info(response.body[0]);
        context.done(null, {'id': response.body[0].Id, 'client_code': client_id});
      }
    } else {
      console.error('Error:', 'Invalid LW id=' + id);
    }
  });
}

function getTransactions(event, context) {
  var uri = '/wolfconnect/transactions/v1';
  var url = CONFIG.HOST + uri;
  var options = {
    headers: util.generateLWHeader(uri, 'GET')
  };
  needle.get(url, options, function(error, response) {
    if (!error && response.statusCode === 200 && response.body) {
      console.log(response.body);
    } else {
      console.log('err=', error);
    }
  });
}

function getFilterTransaction(id) {
  // var uri ="/wolfconnect/transactions/v1/?$filter=Tiers/any(x:x/AgentCommissions/any(y:y/AgentId eq '1SwCrKcLarAU1ZXAtfjVsg=='))";
  // var uri = "/wolfconnect/transactions/v1/?$filter=MLSAddress";///any(x:x/StreetNumber eq '40')"; //and MLSAddress/any(x:x/StreetNumber eq 'Darrell') and MLSAddress/any(x:x/PostalCode eq '94133')";
  // var uri = '/wolfconnect/transactions/v1/?$filter=CloseDate eq \'' + '2016-08-30' + '\'))';
  var url = CONFIG.HOST + uri;
  var options = {
    headers: util.generateLWHeader(uri, 'GET')
  };
  needle.get(url, options, function(error, response) {
    if (!error && response.statusCode === 200 && response.body) {
      // console.log(response);
      console.log(">>>>>>>>>>>>>>>>> Response length: " + response.body.length + "<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      console.log(response.body);
    } else {
      console.log(response);
      console.log('err=', error);
    }
  });
}

function deleteTransaction(transactionId) {
  var uri = "/wolfconnect/transactions/v1/" + transactionId;
  var url = CONFIG.HOST + uri;
  var options = {
    headers: util.generateLWHeader(uri, 'DELETE')
  };
  needle.delete(url, null, options, function(error, response) {
    if (!error && response.statusCode === 200 && response.body) {
      console.log(response.body);
    } else {
      console.log(url);
      console.log('err=', error);
    }
  });
}

// getUser({params: {id: 'all'}}, context);
// getTransactions(null, context);
getFilterTransaction('443624');
// deleteTransaction("9Eo50Z7i3cY6HQdyKyeSTA==");
