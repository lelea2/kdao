'use strict';

console.log('>>>>> index controller <<<< ');

var JSX = require('node-jsx').install(), //to render react on server
    React = require('react'),
    ReactDOMServer = require('react-dom/server'),
    GalleryModel = require('../models/GalleryModel'),
    GalleryApp = require('../components/GalleryApp.react');

module.exports = function (app) {

  app.get('/', function (req, res) {
    GalleryModel.getCouponsCollection().then(function(data) {
      //console.log(data);
      //var result = GalleryApp({pods: data});
      var result = React.createElement(GalleryApp, {pods : data});
      var markup;
      try {
        markup = ReactDOMServer.renderToString(result);
      } catch(Ex) {
      }
      res.render('home', {
        markup: markup,
        pods: data
      });
    });
  });
};
