/** @jsx React.DOM */

var React = require('react'),
    Pod = require('./Pod.react');

module.exports = Gallery = React.createClass({

  //Rendering gallery component
  render: function() {
    var content = this.props.pods.map(function(pod, i) {
      return (
        <Pod key={pod.offerId} data={pod} />
      );
    });
    return (
      <div className="mod-gallery">
        {content}
      </div>
    );
  }
});
