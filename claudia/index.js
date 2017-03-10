'use strict';

var ApiBuilder = require('claudia-api-builder');
var api = new ApiBuilder();

api.get('/', function () {
  return 'Hello World';
});

module.exports = api;
