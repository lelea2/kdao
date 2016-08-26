'use strict';

var dateFormat = require('dateformat'),
    crypto = require('crypto');

module.exports = function(options) {
  var CONFIG = options.config || {};
  var CLIENT_CODE = CONFIG.CLIENT_CODE;
  var API_TOKEN = CONFIG.API_TOKEN;
  var SECRET_KEY = CONFIG.SECRET_KEY;

  //Helper function to generate MD5
  function generateMD5(str) {
    var md5 = crypto.createHash('md5').update(str).digest();
    return new Buffer(md5).toString('base64');
  }

  //Helper function to generate signature
  function generateSig(sig) {
    var hash = crypto.createHmac('sha256', SECRET_KEY);
    var digestVal = hash.update(sig).digest('hex');
    return digestVal;
  }

  //Helper function to geenrate lonewolf token
  function generateLoneWolfToken(uri, method, md5) {
    var now = new Date();
    var currentDate = dateFormat(now, 'yyyy-mm-dd-HH-MM-ss', true);
    currentDate = currentDate + '-674Z';
    var sig = method + ':' + uri + ':' + currentDate + ':' + md5;
    var sigHash = generateSig(sig);
    var lonewolftoken = API_TOKEN + ':' + CLIENT_CODE + ':' + sigHash + ':' + currentDate;
    return lonewolftoken;
  }

  //Helper function to generate header for lonewolf API call
  function generateLWHeader(uri, method, body) {
    var content = (body || '');
    var md5result = generateMD5(content);
    var lonewolftoken = generateLoneWolfToken(uri, method, md5result);

    return {
      'Authorization': 'LoneWolfToken ' + lonewolftoken,
      'Content-MD5': md5result,
      'Content-Length': content.length,
      'Content-Type': 'application/json'
    };
  }

  return {
    generateMD5: generateMD5,
    generateSig: generateSig,
    generateLWHeader: generateLWHeader
  };

};
