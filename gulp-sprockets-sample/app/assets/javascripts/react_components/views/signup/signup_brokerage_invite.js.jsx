/**
 * Component view for signup brokerage invite
 * Ideally, this module should be server rendering, but i will keep this in React for consistency,
 * and reusable code in both invite and show brokerage flow
 * Component being display in eg URL:
 * https://www.reesio.com/brokerages/invite/IlZiKXKlV3r3obLLE8OUSg
 */

var RSSignupBrokerageInvite = (function($) {

  return React.createClass({

    displayName: 'RSSignupBrokerageInvite',

    setInitialData: function() {
      this.REESIO_SIGNUP = 'Create an account to join this brokerage.';
      this.JOIN_BROKERAGE = '<p><strong>Welcome!</strong></p><p>Thank you for creatig an account. Now you can join others in your brokerage who are using Reesio to manage their transactions.</p>';
      this.DEFAULT_LIMIT_MEMBERS_DISLAY = 20;
    },

    getInitialState: function() {
      this.setInitialData();
      return {
        invitation_code: ''
      };
    },

    componentDidMount: function() {
      //Display tooltip on member
      $(ReactDOM.findDOMNode(this.refs.member)).tooltip();
    },

    /**
     * Helper function rendering message
     * @method renderMessage
     */
    renderMessage: function() {
      var msg = (this.props.action === 'invite') ? this.REESIO_SIGNUP : this.JOIN_BROKERAGE;
      /*jshint ignore:start */
      return (
        <div className={"message " + this.props.action}  dangerouslySetInnerHTML={{__html: msg}} />
      );
      /*jshint ignore:end */
    },

    /**
     * Helper function rednering brokerage members
     * Eg data:
     *    [{"account_type":"Realtor","api_access_token":null,"api_access_token_expiration":null,"avatar":{"url":"https://reaslo-test.s3.amazonaws.com/uploads/user/avatar/875/d3a6de78-28f0-11e6-aee0-000a27020068.png","thumb":{"url":"https://reaslo-test.s3.amazonaws.com/uploads/user/avatar/875/thumb_d3a6de78-28f0-11e6-aee0-000a27020068.png"},"portrait":{"url":"https://reaslo-test.s3.amazonaws.com/uploads/user/avatar/875/portrait_d3a6de78-28f0-11e6-aee0-000a27020068.png"}},"created_at":"2016-03-02T13:42:18-08:00","disabled":false,"ds_base_url":null,"ds_oauth_token":null,"echo_sign_registered":false,"echo_sign_registered_at":null,"email":"khanh.dao@reesio.com","first_name":"Khanh","id":875,"joined_from":"login","last_name":"Dao","mailchimp_access_token":null,"nutshell_contact_id":null,"oauth_refresh_token":null,"phone":"4086930409","receive_marketing_emails":false,"receive_notification_emails":true,"receive_third_party_emails":false,"stripe_customer_id":"cus_80jCOmpXnOG8QZ","time_zone":"Pacific Time (US & Canada)","trial_end":"2016-03-02T13:42:18-08:00","updated_at":"2016-06-02T11:35:48-07:00"}]
     * @method renderBrokrageMembers
     */
    renderBrokerageMembers: function() {
      var members = this.props.brokerage_members || [],
          limit = this.props.members_display || this.DEFAULT_LIMIT_MEMBERS_DISLAY,
          Items;
      Items = members.map(function(value, i) {
        if (i < limit) {
          /*jshint ignore:start */
          return (
            <li key={i} ref="member" data-placement="bottom" data-toggle="tooltip" data-original-title={value.first_name + ' ' + value.last_name}><RSImage alt="" src={value.avatar.url} /></li>
          );
          /*jshint ignore:end */
        } /** Dont process extra value **/ else {}
      });
      /*jshint ignore:start */
      return (
        <div className="brokerage-members">
          <p className="subtitle">{members.length} member(s) have joined this brokerage.</p>
          <ul>
            {Items}
          </ul>
        </div>
      );
      /*jshint ignore:end */
    },

    handleShowSignup: function() {
      $(document).trigger('reesio:show_signup_slide');
    },

    handleSwitchBrokerage: function() {
      $(document).trigger('reesio:signup_switch_brokerage');
    },

    /**
     * Helper function to render CTA group
     * @method renderCTAGroup
     */
    renderCTAGroup: function() {
      if (this.props.action === 'invite') {
        /*jshint ignore:start */
        return (
          <div className="cta-group">
            <button className="btn btn-primary" type="button" onClick={this.handleShowSignup}>Create Account</button>
            <button className="btn btn-transparent" type="button" onClick={this.handleSwitchBrokerage}>Already have a Reesio account?</button>
          </div>
        );
        /*jshint ignore:end */
      } else {
        //Eg: POST https://www.reesio.com/brokerages/10183/sign-ups
        /*jshint ignore:start */
        return (
          <form noValidate className="cta-group" method="post" action={"/brokerages/" + this.props.brokerage.id + "/sign-ups"}>
            <input type="hidden" value={this.props.authenticity_token} name="authenticity_token" />
            <button className="btn btn-primary" type="submit" onClick={this.handleJoinBrokerage}>Join Brokerage</button>
          </form>
        );
        /*jshint ignore:end */
      }
    },

    render: function() {
      var brokerage = this.props.brokerage || {};
      /*jshint ignore:start */
      return (
        <div className="mod-signup-brokerage-invite">
          <div className="heading">
            <RSImage alt="" src={brokerage.logo.url} />
            <h3>{brokerage.name}</h3>
            <p className="address">{brokerage.address + ' ' + brokerage.city + ', ' + brokerage.state + ', ' + brokerage.zip}</p>
          </div>
          <div className="content">
            {this.renderMessage()}
            {this.renderBrokerageMembers()}
            {this.renderCTAGroup()}
          </div>
        </div>
      );
      /*jshint ignore:end */
    }

  });
}(RS_jQuery));
