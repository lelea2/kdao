/**
 * Model function return gallery response
 */

'use strict';

var Promise = require('bluebird'),
    data = require('./data/coupons');

module.exports = (function() {
  function getCouponsCollection(startIndex, n) {
    return new Promise(function(resolve, reject) {
      resolve(data);
    });
  };

  return {
    getCouponsCollection: getCouponsCollection
  };
}());
