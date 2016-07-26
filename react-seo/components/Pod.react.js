/** @jsx React.DOM */

var React = require('react');

module.exports = Pod = React.createClass({

  /**
   * Function hanlde pod click
   * @return {[type]} [description]
   */
  handlePodClick: function(e) {

  },

  render: function() {
    return (
      <div className="pod" data-podid={this.props.podId} onClick={this.handlePodClick}>
        <div className="media">
          <div className="media-object pull-left">
            <img alt="" src={this.props.data.offerImage} />
          </div>
          <div class="media-body">
            <p class="pod_summary">{this.props.data.offerSummary}</p>
            <p class="pod_brand">{this.props.data.brandName}</p>
            <p class="pod_description">{this.props.data.offerDescription}</p>
            <p class="pod_expiry">Exp: {this.props.data.expiryDate}</p>
          </div>
        </div>
      </div>
    );
  }
});
