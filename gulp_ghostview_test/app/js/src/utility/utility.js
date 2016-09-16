/**
 * Component utility abstract utility function
 */

var $ = require('jQuery');


/**
 * Function checking for empty string
 * @method isEmpty
 */
function isEmpty(str) {
  str = $.trim(str);
  return (str === '' || str === null);
}

/**
 * Function checking for empty object
 * @method isEmptyObject
 */
function isEmptyObject(obj) {
  var flag = false;
  try {
    flag = (Object.keys(obj).length === 0 && obj.constructor === Object);
  } catch(ex) {}
  return flag;
}

/**
 * Function checking if given string is number
 * @method isNumber
 */
function isNumeric(input) {
  var RE = /^-{0,1}\d*\.{0,1}\d+$/;
  return (RE.test(input));
}

/**
 * Function checking for valid email
 * @method isValidEmail
 */
function isValidEmail(email) {
  var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
  return (regex.test(email)) ? true : false;
}

/**
 * Function to check valid password
 * @method isValidPassword
 */
function isValidPassword(password) {
  password = password || '';
  return (password.length >= 6);
}

function _stringToDigit(str) {
  str = $.trim(str || '');
  return str.replace(/\D/g, '');
}

/**
 * Function to convert phone format to digit only
 * @method phoneToDigitOnly
 */
function phoneToDigitOnly(phone) {
  return _stringToDigit(phone);
}

/**
 * Function translate card format to digit only
 * @method cardToDigitOnly
 */
function cardToDigitOnly(card) {
  return _stringToDigit(card);
}

/**
 * Function checking number is valid card number
 * @method isValidCard
 */
function isValidCard(cardNumber) {
  var valid = false;
  try {
    valid = (isNumeric(cardNumber, 10) && cardNumber.toString().length === 16);
  } catch(ex) {}
  return valid;
}

/**
 * Function checking for valid card code
 * @method isValidCardCode
 */
function isValidCardCode(cardCode) {
  var valid = false;
  try {
    valid = (isNumeric(cardCode) && cardCode.toString().length === 3);
  } catch(ex) {}
  return valid;
}

/**
 * Function checkin for valid date value string
 * @method isValidDate
 */
function isValidDate(str) {
  try {
    var ts = Date.parse(str);
    return !(isNaN(ts));
  } catch(ex) {
    return false;
  }
}

/**
 * Helper function to polyfil consolelog
 * @method
 */
function safeLog() {
  if (window.console) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('custom_log: '); //mutate array
    console.log.apply(console, args); //passing array argument, therefore use apply
  }
}

/**
 * Helper function for deep merge object or array. Eventually this will be also serve as our isomorphic function for server side
 * @method deepMerge
 */
function deepMerge(target, src) {
  var array = Array.isArray(src); //checking if sort is array
  var dst = array ? [] : {}; //assign destination variable
  if (array) {
    target = target || [];
    dst = dst.concat(target);
    src.forEach(function(e, i) {
      if (typeof dst[i] === 'undefined') {
        dst[i] = e;
      } else if (typeof e === 'object') {
        dst[i] = deepMerge(target[i], e);
      } else {
        if (target.indexOf(e) === -1) {
          dst.push(e);
        }
      }
    });
  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach(function (key) {
        dst[key] = target[key];
      });
    }
    Object.keys(src).forEach(function (key) {
      if (typeof src[key] !== 'object' || !src[key]) {
        dst[key] = src[key];
      } else {
        if (!target[key]) {
          dst[key] = src[key];
        } else {
          dst[key] = deepMerge(target[key], src[key]);
        }
      }
    });
  }
  return dst;
}

/**
 * Function to execute merge left (only modify value on left obj)
 * @mergeLeft
 */
function mergeLeft(left, right) {
  Object.keys(left).forEach(function(key) {
    if (right[key] != null) {
      left[key] = right[key];
    }
  });
  return left;
}


/** TODO: Move this out ouf utility and create our own date library function **/
/**
 * Helper function to get data format, in current, pass or future
 * @method getFormattedDate
 */
function getFormattedDate(separator, numDays, currDate) {
  var INTERVAL = 24 * 60 * 60 * 1000,
      now = currDate || new Date(),
      dateTime = now.getTime(),
      unixDate,
      currMonth,
      currYear;
  if (numDays < 0) {
    dateTime -= (numDays * INTERVAL);
  } else if (numDays > 0) {
    dateTime += (numDays * INTERVAL);
  }
  unixDate = new Date(dateTime);
  currDate = unixDate.getDate();
  currDate = (currDate < 10) ? ('0' + currDate) : currDate;
  currMonth = unixDate.getMonth() + 1;
  currMonth = (currMonth < 10) ? ('0' + currMonth) : currMonth;
  currYear = unixDate.getFullYear();
  return currMonth + separator + currDate + separator + currYear;
}

/**
 * Helper function to get month string based on index
 * @method getMonth
 */
function getMonth(date, fullName, isUTC) {
  var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (date instanceof Date) {
    var month = (isUTC === true) ? date.getUTCMonth() : date.getMonth();
    var monthIndex = parseInt(month, 10);
    if (fullName === true) {
      return mL[monthIndex];
    } else {
      return mS[monthIndex];
    }
  }
  return '';
}

/**
 * Helper function to get short data format
 * @method getShortDate
 */
function getShortDate(currDate, displayHour) {
  var date;
  if (currDate instanceof Date) {
    date = currDate;
  } else {
    date = new Date(currDate);
  }
  try {
    var result = getMonth(date, false, true) + ' ' + date.getUTCDate() + ', ' + date.getUTCFullYear();
    if (displayHour === true) {
      result = result + ' @ ' + getFormattedHour(date, true); //generate UTC date
    }
    return result;
  } catch(ex) {}
  return '';
}

/**
 * Helper function to get date based on PST
 * @method getBrowserShortDate
 */
function getPSTShortDate(currDate, displayHour) {
  var date;
  if (currDate instanceof Date) {
    date = currDate;
  } else {
    currDate = currDate.replace('-07:00', '-00:00'); //TODO: this is BAD, write PST convert based on momentJS
    date = new Date(currDate);
  }
  try {
    var result = getMonth(date, false, false) + ' ' + date.getDate() + ', ' + date.getFullYear();
    if (displayHour === true) {
      result = result + ' @ ' + getFormattedHour(date, false);
    }
    return result;
  } catch(ex) {}
  return '';
}

//Helper function to get hour
function getHour(date, isUTC) {
  if (isUTC === false) {
    return {
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds()
    };
  } else {
    return {
      h: date.getUTCHours(),
      m: date.getUTCMinutes(),
      s: date.getUTCSeconds()
    };
  }
}

/**
 * Helper function to get time of current date
 * @method getFormattedHour
 */
function getFormattedHour(currDate) {
  var date;
  if (currDate instanceof Date) {
    date = currDate;
  } else {
    date = new Date(currDate);
  }
  try {
    var formattedHour = getHour(date, true);
    var h = formattedHour.h,
        m = formattedHour.m,
        s = formattedHour.s
        dd = 'AM';
    if (h >= 12) {
      h = h - 12;
      dd = 'PM';
    } else if (h === 0) {
      h = 12;
    }
    m = m < 10 ? ('0' + m) : m;
    return (h + ':' + m + ' ' + dd);
  } catch(ex) {}
  return '';
}

/**
 * Helper function to clone object
 * TODO: pure javascript method should be used for better performance of larger object
 * @method cloneObj
 */
function cloneObject(obj, deepClone) {
  var deepclone = deepClone || false;
  return $.extend(deepclone, {}, obj);
}

/**
 * Helper function to get object value based on key in JSON object
 * @method getObject
 */
function getObject(obj, key, val, includeIndex) {
  for (var i = 0; i < obj.length; i++) {
    if(obj[i][key] === val) {
      if (includeIndex === true) {
        return {obj: obj[i], index: i};
      } else {
        return obj[i];
      }
    }
  }
  return (includeIndex === true) ? {obj: {}, index: -1} : {};
}

/**
 * Helper function to format currency
 * @method formatCurrency
 */
function formatCurrency(number, fixFloat) {
  var tofix = fixFloat || 0;
  var num = parseFloat(number);
  return num.toFixed(tofix).replace(/./g, function(c, i, a) {
    return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
  });
}

/**
 * Helper function to get value from formatted currency
 * @method getValueFromCurrency
 */
function geValueFromCurrency(currency, fixFloat) {
  var tofix,
      number = '';
  try {
    tofix = fixFloat || 0,
    number = parseFloat(currency.replace(/,/g, '')).toFixed(tofix);
    if (tofix === 0) {
      return parseInt(number, 10);
    }
  } catch(ex) {}
  return number;
}

/**
 * Helper function to convert each character in a string to a number
 * based on alphabet index postion in array
 */
function stringToNumber(inputString){
  var inputString = inputString.toUpperCase(),
      alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      count = 0;
  for (i = 0; i < inputString.length; i++) {
    var letterPosition = alphabets.indexOf(inputString[i])+1;
    count = count + letterPosition;
  }
  return count;
}

/**
 * Helper function to check whether given value exists in an array or not
 */
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

/**
 * Helper function to get params value of a url
 * @method getParamVal
 */
function getParamVal(name, url) {
  if (!url) {
    url = location.href;
  }
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return (results == null) ? '' : results[1];
}

/**
 * Helper function to round number
 * @method roundNumber
 */
function roundNumber(number, round) {
  var result = parseFloat(number);
  return result.toFixed(round);
}

/**
 * Helper function to titlize a camel case string
 * active_contigent => Active Contigent
 */
function titlize(string) {
  try {
    var arrSplit = string.split(','),
        arrResult = [];
    for (var i = 0; i < arrSplit.length; i++) {
      var camelCased = arrSplit[i].replace(/_([a-z])/g, function (g) { return " " + g[1].toUpperCase(); });
      var resultStr = camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
      arrResult.push(resultStr);
    }
    // var camelCased = string.replace(/_([a-z])/g, function (g) { return " " + g[1].toUpperCase(); });
    // return camelCased.charAt(0).toUpperCase() + camelCased.slice(1);
    return arrResult.join(',');
  } catch(ex) {}
}

/**
 * Helper function to snakecase a string
 * ActiveContigent => active_contigent
 */
function toUnderscore(string) {
  try {
    var snakeCase = string.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();}).replace(/ /g,'');
    if (snakeCase.charAt(0) == "_") {
      return snakeCase.slice(1);
    }
    return snakeCase;
  } catch(ex) {}
}

//Helper function to find number of days in month
var daysInMonth = (function() {
  var cache = {};
  return function(month, year) {
    var entry = year + '-' + month;
    if (cache[entry]) return cache[entry];
    return cache[entry] = new Date(year, month, 0).getDate();
  }
})();

//Helper function to find number of days in years
function daysInYear(year) {
  if(year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
    // Leap year
    return 366;
  } else {
    // Not a leap year
    return 365;
  }
}

//Function to calculate seconds in current month
function getSecondsPerMonth() {
  var now = new Date(),
      month = now.getMonth() + 1,
      year = now.getFullYear();
  return daysInMonth(month, year) * 24 * 3600;
}

//Function to calculate seconds in current year
function getSecondsPerYear(currYear) {
  var now = new Date(),
      year = now.getFullYear();
  return daysInYear(year) * 24 * 3600;
}

//Helper function checking for isMobile device
function isMobile() {
  var isMobile = (/iphone|ipod|android|ie|blackberry|fennec/).test(navigator.userAgent.toLowerCase());
  return (isMobile === true); // || (localStorage.getItem('mobile_override') === 'true') || (getParamVal('mobile_override') === 'true');
}

//Helper function to handle number with comma
function numberWithCommas(x) {
  try {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } catch(ex) { //Just return original string if any exception thrown
    return x;
  }
}

module.exports = {
    isEmpty: isEmpty,
    isEmptyObject: isEmptyObject,
    isNumeric: isNumeric,
    isValidEmail: isValidEmail,
    isValidPassword: isValidPassword,
    isValidDate: isValidDate,
    isValidCard: isValidCard,
    isValidCardCode: isValidCardCode,
    phoneToDigitOnly: phoneToDigitOnly,
    cardToDigitOnly: cardToDigitOnly,
    stringToDigit: _stringToDigit,
    safeLog: safeLog,
    deepMerge: deepMerge,
    mergeLeft: mergeLeft,
    getFormattedDate: getFormattedDate,
    getShortDate: getShortDate,
    getPSTShortDate: getPSTShortDate,
    cloneObject: cloneObject,
    getObject: getObject,
    formatCurrency: formatCurrency,
    geValueFromCurrency: geValueFromCurrency,
    stringToNumber: stringToNumber,
    getParamVal: getParamVal,
    roundNumber: roundNumber,
    isInArray: isInArray,
    titlize: titlize,
    toUnderscore: toUnderscore,
    daysInMonth: daysInMonth,
    daysInYear: daysInYear,
    getSecondsPerMonth: getSecondsPerMonth,
    getSecondsPerYear: getSecondsPerYear,
    isMobile: isMobile,
    numberWithCommas: numberWithCommas
  }
};
