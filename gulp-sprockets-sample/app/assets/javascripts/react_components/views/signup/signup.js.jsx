/**
 * Create Signup component
 */
var RSSignup = (function($) {

  return React.createClass({

    displayName: 'RSSignup',

    setInitialData: function() {
      var utility = REESIO.utility;
      this.isEmpty = utility.isEmpty;
      this.isValidEmail = utility.isValidEmail;
      this.isValidPassword = utility.isValidPassword;
      this.HEADING = 'Create An Account';
      this.moduleName = 'mod-signup';
    },

    getInitialState: function() {
      this.setInitialData();
      return {
        user_fistname: '',
        user_lastname: '',
        user_email: '',
        user_phone: '',
        user_password: '',
        valid_form: false,
        showState: '',
        visible: '',
        err: {
          user_firstname: 'hidden',
          user_lastname: 'hidden',
          user_email: 'hidden',
          user_phone: 'hidden',
          user_password: 'hidden'
        }
      };
    },

    /**
     * Bind to jquery event when component done rendering
     * @method componentDidMount
     */
    componentDidMount: function() {
      this.setState({
        showState: this.props.showState || false
      });
      $(document).bind('reesio:show_signup', this.showSignup);
      $(document).bind('reesio:show_signup_slide', this.show);
      $(document).bind('reesio:show_signup_popup', this.showDialog);
    },

    showDialog: function() {
      if (this.refs.signup) {
        this.refs.signup.showDialog();
      }
    },

    show: function() {
      this.setState({ visible: 'visible' });
      //$(document).trigger('reesio:body_scroll_disabled'); //disabled body scrolling
    },

    hide: function() {
      this.setState({ visible: '' });
      //$(document).trigger('reesio:body_scroll_enabled'); //enable body scrolling
    },

    /**
     * Helper function handle input on change
     * @method callbackParent
     */
    callbackParent: function(data) {
      this.setState(data, this.validateForm);
    },

    validateForm: function() {
      if (this.isEmpty(this.state.user_firstname) || this.isEmpty(this.state.user_lastname) || !this.isValidEmail(this.state.user_email) || this.isEmpty(this.state.user_phone) || !this.isValidPassword(this.state.user_password)) {
        this.setState({ valid_form: false });
      } else {
        this.setState({ valid_form: true });
      }
    },

    showSignup: function() {
      this.setState({ showState: '' });
    },

    showSignin: function() {
      if (this.props.signin_newpage === false) {
        this.setState({
          showState: 'hidden'
        });
        $(document).trigger('reesio:show_signin');
      }
    },

    //Function to handle submit form
    handleFormSubmit: function(e) {
      if (this.state.valid_form === false) {
        e.preventDefault();
        this.setState({
          err: {
            user_firstname: this.isEmpty(this.state.user_firstname) ? '' : 'hidden',
            user_lastname: this.isEmpty(this.state.user_lastname) ? '' : 'hidden',
            user_email: this.isValidEmail(this.state.user_email) ? 'hidden' : '',
            user_phone: this.isEmpty(this.state.user_phone) ? '' : 'hidden',
            user_password: this.isValidPassword(this.state.user_password) ? 'hidden' : ''
          }
        });
      }
    },

    /**
     * Helper function for rendering input field
     * @method renderInputField
     */
    renderInputField: function(label, placeholder, type, id, name, required, errText) {
      /*jshint ignore:start */
      return (
        <RSInput inputClass="rs-input" errText={errText} label={label} err_hidden={this.state.err[id]} required={required} placeholder={placeholder} name={name} callbackParent={this.callbackParent} type={type} id={id} defaultValue={this.state[id]} />
      );
      /*jshint ignore:end */
    },

    //Render content
    renderContent: function() {
      /*jshint ignore:start */
      return (
        <form noValidate action="/users" method="POST" autoComplete="off" onSubmit={this.handleFormSubmit}>
          {/* <h2>Create An Account</h2> */}
          <input type="hidden" name="authenticity_token" value={this.props.authenticity_token} />
          {this.renderInputField('First Name', 'Enter First Name', 'text', 'user_firstname', 'user[first_name]', true)}
          {this.renderInputField('Last Name', 'Enter Last Name', 'text', 'user_lastname', 'user[last_name]', true)}
          {this.renderInputField('Email', 'Enter Email', 'email', 'user_email', 'user[email]', true, 'Please enter valid email.')}
          {this.renderInputField('Phone', 'Enter Phone', 'tel', 'user_phone', 'user[phone]', true, 'Please enter valid phone')}
          {this.renderInputField('Password', 'Enter Password', 'password', 'user_password', 'user[password]', true, 'Password has to be at least 6 characters long.')}
          <input id="user_joined_from" name="user[joined_from]" type="hidden" value={this.props.joined_from || 'homepage'} />
          <input id="user_onyx_tracking" name="user[onyx_tracking]" type="hidden" value={REESIO.utility.getParamVal('onyx_tracking') || 'enabled'} />
          <p>By clicking Get Started Today, you agree to Reesio&#39;s <a href="/terms_of_service" target="_blank">Terms of Service.</a></p>
          <div className="form-group">
            <button type="submit" id="#btn_home_signup" className="btn btn-lg btn-primary">Get Started Today</button>
          </div>
          <p>Already have an account? <a href={this.props.signin_link} onClick={this.showSignin}>Log In</a> to your account now!</p>
        </form>
      );
      /*jshint ignore:end */
    },

    /**
     * Function to render component
     * @method render
     */
    render: function() {
      var content = this.renderContent();
      if (this.props.slide === true) {
        /*jshint ignore:start */
        return (
          <RSOverlay moduleName={this.moduleName + " fixed-header"} id="new_user" visible={this.state.visible} direction={this.props.direction} title={this.HEADING} onClose={this.hide}>
            {content}
          </RSOverlay>
        );
        /*jshint ignore:end */
      } else if (this.props.popup === true) {
        /*jshint ignore:start */
        return (
          <RSDialog moduleName={this.moduleName} ref="signup" title={this.HEADING} modalBody={content} closeOnResize={true} />
        );
        /*jshint ignore:end */
      } else {
        /*jshint ignore:start */
        return (
          <div className={this.moduleName + " in-page " + this.state.showState} id="new_user">
            {content}
          </div>
        );
        /*jshint ignore:end */
      }
    }
  });
}(RS_jQuery));
