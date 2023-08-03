import React, { Component } from "react";
import { TextField } from "~/components/Forms";
class AlphaNumericMaskInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actualField: "",
      maskedField: "",
      keyPressed : false
    };

    this.handleChange = this.handleChange.bind(this);
    this.resetValue = this.resetValue.bind(this);
  }

  componentDidMount() {
    const { value } = this.props;
    const prevValue = "";
    const newValue = "";
    const actual = value || "";
    this.mask(prevValue, newValue, actual);
  }

  resetValue() {
    if(!this.state.keyPressed){
      this.setState({
        keyPressed: true
      }, () => this.props.resetValue());
    }
  }

  handleChange(event) {
    const { maskedField, actualField } = this.state;
    const prevValue = maskedField;
    const newValue = event.target.value||"";
    const actual = actualField;
    this.mask(prevValue, newValue, actual);
  }

  mask = (prevValue, newValue, actual) => {
    if (newValue.length > prevValue.length) {
      const newChar = newValue.split("").pop();
      if(! /[^a-zA-Z0-9]/.test(newChar) ) {
          actual = `${actual}${newChar}`;
      }
    }
    // backspacing / deleting
    else {
      const charsRemovedCount = prevValue.length - newValue.length;
      if (newValue.length === 1) {
        actual = newValue;
      } else {
        actual =
          (actual &&
            actual.toString().substr(0, actual.length - charsRemovedCount)) ||
          "";
      }
    }
    this.setState({
      actualField: actual,
      maskedField: this.starredMask(actual),
    });
    this.props.getValue(actual);
  };

  starredMask = (ssn) => {
    ssn = ssn && ssn.toString();
    const maskedCharsLength = ssn && ssn.length > 4 ? ssn.length - 4 : 0;
    let str = "";
    str = ssn && "*".repeat(maskedCharsLength) + ssn.slice(maskedCharsLength);

    return str;
  };

  render() {
    const {
      disabled,
      maxLength,
      name,
      value,
      autoFocus,
      label,
      ...restProps
    } = this.props;
    const masked = this.starredMask(value);
    return (
      <div>
        <div>
          <TextField
            name={name}
            type="text"
            className="MaskedField"
            value={masked} //masked from props
            onChange={this.handleChange}
            onKeyDown={this.resetValue}
            onBlur={() => {this.setState({keyPressed : false})}}
            tabIndex={0}
            disabled={disabled}
            autoFocus={autoFocus}
            label={label}
            fullWidth={true}
            inputProps={{ maxLength: maxLength }}
            {...restProps}
          />
        </div>
      </div>
    );
  }
}

export default AlphaNumericMaskInput;
