/**
 * Create signin component
 */
var RSSignin = (function($) {
  return React.createClass({

    displayName: 'RSSignin',

    getInitialState: function() {
      return {
        user_email: '',
        user_password: '',
        validForm: false,
        showState: this.props.showState, //show for hide sign-in form
        err: { //error state show
          user_email: 'hidden',
          user_password: 'hidden'
        }
      };
    },

    componentDidMount: function() {
      //Checking on DOM ready for pre-filled form by browser memory
      var self = this;
      setTimeout(function() {
        self.setState({
          user_email: ReactDOM.findDOMNode(self.refs.user_email.refs.user_email).value,
          user_password: ReactDOM.findDOMNode(self.refs.user_password.refs.user_password).value
        }, self.validateForm);
      }, 150);
      $(document).bind('reesio:show_signin', this.showSignin);
    },

    /**
     * Function handle on input change
     * @method callbackParent
     */
    //Issue with state does not mutated immediately on React
    //http://stackoverflow.com/questions/30782948/why-calling-react-setstate-method-doesnt-mutate-the-state-immediately
    callbackParent: function(data) {
      this.setState(data, this.validateForm);
    },

    //Function to validate signin form
    validateForm: function() {
      var utility = REESIO.utility;
      this.setState({
        validForm: (!utility.isValidEmail(this.state.user_email) || utility.isEmpty(this.state.user_password)) ? false : true
      });
    },

    showSignin: function() {
      this.setState({
        showState: ''
      });
    },

    /**
     * Function trigger to show signup module
     * @method showSignup
     */
    showSignup: function() {
      this.setState({
        showState: 'hidden'
      });
      $(document).trigger('reesio:show_signup');
    },

    //Helper function to handle submit form
    handleSubmitForm: function(e) {
      var utility = REESIO.utility;
      if (this.state.validForm === false) {
        e.preventDefault();
        this.setState({
          err: {
            user_email: (utility.isValidEmail(this.state.user_email)) ? 'hidden' : '',
            user_password: (utility.isEmpty(this.state.user_password)) ? '' : 'hidden'
          }
        });
      }
    },

    /**
     * Helper function rendring input form
     * @method renderInputForm
     */
    renderInputForm: function(label, name, id, placeholder, type, errText) {
      /*jshint ignore:start */
      return (
        <RSInput required={true} label={label} inputClass="rs-input" err_hidden={this.state.err[id]} type={type} placeholder={placeholder} name={name} id={id} ref={id} callbackParent={this.callbackParent} defaultValue={this.state[id]} errText={errText} />
      );
      /*jshint ignore:end */
    },

    render: function() {
      /*jshint ignore:start */
      return (
        <div className={"mod-signin " + this.state.showState} onSubmit={this.handleSubmitForm}>
          {/* <h2>Log In</h2> */}
          <form noValidate action={this.props.action} className="new_user" id="new_login" method="POST" autoComplete="off">
            <input type="hidden" name="authenticity_token" value={this.props.authenticity_token} />
            {this.renderInputForm('Email', 'user[email]', 'user_email', 'Enter Email', 'email', 'Please enter valid email address.')}
            {this.renderInputForm('Password', 'user[password]', 'user_password', 'Enter Password', 'password', 'Please enter valid password.')}
            <p className="pull-right"><a href={this.props.forgotpwd_link} target="_self">Forgot your password?</a></p>
            <div className="form-group">
              <button type="submit" className={"btn btn-lg btn-primary"}>Submit</button>
            </div>
            <p>Don&#39;t have an account? <a href="#createAccount" onClick={this.showSignup}>Sign Up</a> to get started today!</p>
          </form>
        </div>
      );
      /*jshint ignore:end */
    }
  });
}(RS_jQuery));
