require("babel-core/register");
require("babel-polyfill");

const Test1 = require('./test1');
const Test2 = require('./test2');

Test1.doAsyncTask();
Test2.doAsyncTask();