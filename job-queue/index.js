'use strict';

var RedisSMQ = require('rsmq');
var rsmq = new RedisSMQ( {host: '127.0.0.1', port: 6379, ns: 'rsmq'} );
var RSMQWorker = require( 'rsmq-worker' );
var worker = new RSMQWorker( 'myqueue' );

console.log('testing rsmq');

worker.on( 'message', function( msg, next, id ){
  // process your message
  console.log('Message id : ' + id);
  console.log(msg);
  next();
});

worker.on('ready', function() {
  console.log('queue is ready...');
});

// optional error listeners
worker.on('error', function( err, msg ){
  console.log( 'ERROR', err, msg.id );
});
worker.on('exceeded', function( msg ){
  console.log( 'EXCEEDED', msg.id );
});
worker.on('timeout', function( msg ){
  console.log( 'TIMEOUT', msg.id, msg.rc );
});

worker.start();


//Create queue
rsmq.createQueue({qname:'myqueue'}, function (err, resp) {
  if (resp===1) {
    console.log('queue created');
  }
});

//Send a message to queue
rsmq.sendMessage({qname: 'myqueue', message: 'Hello World'}, function (err, resp) {
  if (resp) {
    console.log("Message sent. ID:", resp);
  }
});

//Receive messege
rsmq.receiveMessage({qname: 'myqueue'}, function (err, resp) {
  if (resp.id) {
    console.log('Message received.', resp);
  }
  else {
    console.log('No messages for me...');
  }
});

// delete message
// rsmq.deleteMessage({qname: 'myqueue', id: 'dhoiwpiirm15ce77305a5c3a3b0f230c6e20f09b55'}, function (err, resp) {
//   if (resp===1) {
//     console.log('Message deleted.')
//   }
//   else {
//     console.log('Message not found.')
//   }
// });

//list queue
rsmq.listQueues( function (err, queues) {
  if( err ){
    console.error( err )
    return
  }
  console.log('Active queues: ' + queues.join( ',' ) );
});
