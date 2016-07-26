/** @jsx React.DOM */

var React = require('react');
var Gallery = require('./Gallery.react');

module.exports = GalleryApp = React.createClass({

  // Set the initial component state
  getInitialState: function(props) {
    props = props || this.props;

    // Set initial application state using props
    return {
      pods: props.pods || []
    };
  },

  componentWillReceiveProps: function(newProps, oldProps) {
    this.setState(this.getInitialState(newProps));
  },

  render: function() {
    //console.log(this.state.pods);
    return (
      <div className="gallery-app">
        <Gallery pods={this.state.pods} />
      </div>
    );
  }

});
