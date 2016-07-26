/** @jsx React.DOM */

var React = require('react'),
    GalleryApp = require('../../components/GalleryApp.react');

var initialState = window.Pods; //JSON object for pods collection

React.renderComponent(
  <GalleryApp data={initialState} />,
  document.getElementById('gallery-app')
);
