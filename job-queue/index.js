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
