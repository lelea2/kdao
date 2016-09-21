/* global React */
/**
 * Common component for rendering input view on reesio
 * Eg:
 * <RSInput inputClass="rs-input" type="text" placeholder="Enter zip here" name="trans_zip" id="zip" ref="zip" handleChangeInput={this.handleChangeInput} label="Zip" />
 */
var RSInput = React.createClass({

  displayName: 'RSInput',

  propTypes: {
    placeholder: React.PropTypes.string,
    name: React.PropTypes.string,
    id: React.PropTypes.string.isRequired,
    type: React.PropTypes.string, //TODO: we could narrow support for input type if needed here
    size: React.PropTypes.number,
    err_hidden: React.PropTypes.string,
    inputClass: React.PropTypes.string,
    handleChangeInput: React.PropTypes.func.isRequired,
    callbackParent: React.PropTypes.func,
    readOnly: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onFocus: React.PropTypes.func,
    defaultValue: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
    prefix: React.PropTypes.string, //input-add-on pre-fix
    suffix: React.PropTypes.string, //input-add-on suffix
    prefix_icon: React.PropTypes.string,
    suffix_icon: React.PropTypes.string,
    maskedFormat: React.PropTypes.string, //optional react format so input component could be flexible
    patterns: React.PropTypes.string, //optional pattern key input
    prefixText: React.PropTypes.string, //optional for prefix text in input value
    errText: React.PropTypes.string,
    required: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      defaultValue: '',
      placeholder: '',
      name: '',
      id: '',
      type: 'text',
      err_hidden: 'hidden',
      inputClass: '',
      size: 40,
      handleChangeInput: function() {},
      onFocus: function() {},
      prefix: '',
      suffix: '',
      prefix_icon: '',
      suffix_icon: '',
      maskedFormat: '',
      patterns: '',
      readOnly: false,
      disabled: false,
      prefixText: '',
      errText: 'This field is required.',
      required: false
    };
  },

  setInitialData: function() {
    //Set config for support type
    this.inputType = {
      TEL: 'tel',
      MONEY: 'currency',
      DATE: 'date',
      CARD: 'card'
    };
    this.DEFAULT_INPUT_TYPE = 'text';
    this.NUMBER_INPUT_TYPE = 'tel'; //well this is a hack! to get number keyboard while string still working
    this.utility = REESIO.utility;
    this.backward = false;
  },

  getInitialState: function() {
    this.setInitialData();
    return {
      err_hidden: 'hidden', //state for err_hidden label
      defaultValue: '',
      type: '',
      maskedFormat: this.getMaskedFormat()
    };
  },

  /**
   * Helper function to get input type
   * @method getType
   */
  getType: function(type) {
    if (type === this.inputType.DATE) {
      return this.DEFAULT_INPUT_TYPE;
    } else if (type === this.inputType.MONEY || type === this.inputType.CARD) {
      return this.NUMBER_INPUT_TYPE;
    }
    return type;
  },

  /**
   * Helper function to get value of input
   * @method getValue
   */
  getValue: function(value) {
    var type = this.props.type,
        val = (value || '').toString(),
        maskedFormat = this.state.maskedFormat;
    if (type === this.inputType.MONEY) {
      val = val.replace(/[^0-9]+/g, '');
      if (!!val) {
        val = this.utility.formatCurrency(this.utility.geValueFromCurrency(val), 0);
      }
    } else if (type === this.inputType.TEL || type === this.inputType.CARD) {
      val = val.replace(/[^0-9]+/g, '');
      if (!!val) {
        val = maskedFormat.masked.apply(val);
      }
    }
    return (!!this.props.prefixText) ? (this.props.prefixText + val) : val;
  },

  componentDidMount: function() {
    this.setState({
      err_hidden: this.props.err_hidden,
      defaultValue: this.getValue(this.props.defaultValue),
      type: this.getType(this.props.type),
      maskedFormat: this.getMaskedFormat()
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      err_hidden: nextProps.err_hidden
    });
    //Should ONLY change state when needed
    if ((nextProps.defaultValue !== null) || (nextProps.defaultValue !== undefined)) {
      this.setState({
        defaultValue: (this.backward === true) ? nextProps.defaultValue : this.getValue(nextProps.defaultValue)
      });
    }
  },

  /**
   * Helper function handle onchange for input. We generate inhouse here just in case in future something more can be consolidated
   * @method onChange
   */
  onChange: function(e) {
    var target = e.target || e.srcElement;
        value = this.getValue(target.value);
    if ((target.value === this.state.defaultValue) || (this.backward === true)) {
      //don't do anything here, not meant for change
      return;
    }
    this.updateValue(e, value);
  },

  //Function handle update change input
  updateChangeInput: function(value) {
    if (this.props.callbackParent) {
      var data = {};
      data[this.props.id] = value;
      this.props.callbackParent(data);
    }
  },

  //Helper function to update value state
  updateValue: function(e, value) {
    this.setState({ defaultValue: value });
    this.props.handleChangeInput(e);
    this.updateChangeInput(value);
  },

  /**
   * Helper function to detect onKeydown event
   * @method onKeyDown
   */
  onKeyDown: function(e) {
    var key = e.which || e.keyCode || e.charCode;
    if (key === 8) { //backspace
      this.backward = true;
      if (this.state.defaultValue.length > 0) {
        var val = this.state.defaultValue.substring(0, this.state.defaultValue.length - 1);
        this.setState({ defaultValue: val });
        this.updateChangeInput(val);
      }
    } else {
      this.backward = false;
    }
  },

  onFocus: function() {}, //currently it's not doing anything, just put here for placeholder

  onBlur: function(e) {
    var target = e.target || e.srcElement,
        value = this.getValue(target.value);
    this.updateValue(e, value);
  },

  renderLabel: function() {
    if (!!this.props.label) {
      /*jshint ignore:start */
      return (
        <label htmlFor={this.props.id}>{this.props.label}</label>
      );
      /*jshint ignore:end */
    }
  },

  renderErrLabel: function() {
    if (this.props.required === true) {
      /*jshint ignore:start */
      return (
        <label className={'error ' + this.state.err_hidden} htmlFor={this.props.id}>{this.props.errText}</label>
      );
      /*jshint ignore:end */
    }
  },

  //Helper function to get masked input format
  getMaskedFormat: function() {
    var type = this.props.type;
    if (!!this.props.maskedFormat) { //maskedFormat passed by parent should take precedence
      return {
        masked: new StringMask(this.props.maskedFormat),
        pattern: ''
      };
    }
    if (type === this.inputType.TEL) {
      return {
        masked: new StringMask('(000) 000-0000'),
        pattern: '\d*' //help android tablet phone to display only number
      };
    } else if (type === this.inputType.CARD) {
      return {
        masked: new StringMask('0000-0000-0000-0000'),
        pattern: '\d*' //help android tablet phone to display only number
      };
    } else if (type === this.inputType.MONEY) {
      return {
        masked: '',
        pattern: '[0-9]+([\.,][0-9]+)?'
      };
    }
    return {
      masked: '',
      pattern: this.props.patterns || ''
    };
  },

  //Helper function rendering prefix for input box
  renderPrefixAddOn: function() {
    if (!!this.props.prefix_icon) {
      /*jshint ignore:start */
      return (
        <span className="input-group-addon"><i className="material-icons">{this.props.prefix_icon}</i></span>
      );
      /*jshint ignore:end */
    }
    if (!!this.props.prefix) {
      /*jshint ignore:start */
      return (
        <span className="input-group-addon">{this.props.prefix}</span>
      );
      /*jshint ignore:end */
    }
  },

  //Helper function rendering suffix for input box
  renderSuffixAddOn: function() {
    if (this.props.suffix_icon) {
      /*jshint ignore:start */
      return (
        <span className="input-group-addon"><i className="material-icons">{this.props.suffix_icon}</i></span>
      );
      /*jshint ignore:start */
    }
    if (!!this.props.suffix) {
      /*jshint ignore:start */
      return (
        <span className="input-group-addon">{this.props.suffix}</span>
      );
      /*jshint ignore:end */
    }
  },

  //Helper function to get input size
  getSize: function() {
    var type = this.props.type;
    if (type === this.inputType.TEL) {
      return 14; //(000) 000-0000
    } else if (type === this.inputType.CARD) {
      return 19; //0000-0000-0000-0000
    }
    return this.props.size;
  },

  //Helper function to render input field, only masked input field when necessary
  renderMaskedInput: function() {
    var maskedFormat = this.state.maskedFormat,
        requiredClass = (this.props.required === true) ? 'required' : '',
        readOnly = this.props.readOnly || false,
        disabled = this.props.disabled || false,
        type = this.props.type;
    /*jshint ignore:start */
    if (readOnly === true && type !== 'date') { //If readonly and type is not date, then just display span class
      if (type === 'email') {
        return (
          <span className="form-control"><a href={"mailto:" + this.state.defaultValue}>{this.state.defaultValue}</a></span>
        );
      } else if (type === 'tel') {
        return (
          <span className="form-control"><a href={"tel:" + REESIO.utility.phoneToDigitOnly(this.state.defaultValue)}>{this.state.defaultValue}</a></span>
        );
      } else {
        return (
          <span className="form-control">{this.state.defaultValue}</span>
        );
      }
    } else {
      return (
        <input disabled={disabled} readOnly={readOnly} type={this.state.type} value={this.state.defaultValue} pattern={maskedFormat.pattern} data-type={this.props.id} className={"form-control " + requiredClass} placeholder={this.props.placeholder} maxLength={this.getSize()} size={this.props.size} name={this.props.name} id={this.props.id} ref={this.props.id} onChange={this.onChange} onKeyDown={this.onKeyDown} onBlur={this.onBlur} onFocus={this.onFocus} />
      );
    }
    /*jshint ignore:end */
  },

  //Checking if should return label for input
  hasLabel: function() {
    return (!!this.props.prefix || !!this.props.suffix || !!this.props.suffix_icon || !!this.props.prefix_icon);
  },

  render: function() {
    var addOnClass = (this.hasLabel())  ? 'input-group' : '';
    /*jshint ignore:start */
    return (
      <div className={"form-group " + this.props.inputClass}>
        {this.renderLabel()}
        <div className={addOnClass}>
          {this.renderPrefixAddOn()}
          {this.renderMaskedInput()}
          {this.renderSuffixAddOn()}
        </div>
        {this.renderErrLabel()}
      </div>
    );
    /*jshint ignore:end */
  }
});

module.exports = RSInput;
