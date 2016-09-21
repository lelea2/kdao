//= require ../../../node_modules/jquery/dist/jquery

//= require ./common
//= stub ./pages/page3
//= require_tree ./pages

require('react');
require('react-dom');

window.onload = function() {
  (new Page1()).build();
  (new Page2()).build();
  (new Common()).toJson('aaa');
};
