import {
  CircularProgress,
  MenuItem,
  withStyles,
  TextField,
} from "@material-ui/core";
import { getCitiesOfStateByISO } from "~/redux/actions/csc";
import { connect } from "react-redux";
import { styles } from "./styles";
import React from "react";

export class CityIso extends React.Component {
  state = {
    cities: [],
    isLoading: false,
  };
  componentDidMount() {
    const { selectedState } = this.props;
    if (selectedState !== "") {
      this.getCitiesOfStateByIso(selectedState);
    }
  }
  componentDidUpdate(prevProps) {
    //This is called when state field is changed. and REST API is called.
    if (prevProps["selectedState"] !== this.props["selectedState"]) {
      if (!this.props["selectedState"]) {
        this.setState({ cities: [] });
      } else {
        const { selectedState } = this.props;
        this.getCitiesOfStateByIso(selectedState);
      }
    }

    //This is called when country field is changed. and clear the city field.
    if (prevProps["selectedCountry"] !== this.props["selectedCountry"]) {
      this.setState({ cities: [] });
    }
  }

  getCitiesOfStateByIso(selectedState) {
    this.setState({ isLoading: true }, () => {
      this.props.dispatch(getCitiesOfStateByISO(selectedState)).then((res) => {
        if (res) {
          const { csc } = this.props;
          this.setState({ cities: csc && csc["cityList"], isLoading: false });
        }
      });
    });
  }

  render() {
    const {
      selectedState,
      selectedCity,
      onChange,
      error,
      helperText,
      name,
      label,
      InputLabelProps,
      required,
      disabled,
      inputProps,
    } = this.props;
    const { cities, isLoading } = this.state;

    return (
      <span>
        <TextField
          select
          fullWidth={true}
          color="secondary"
          autoComplete="off"
          name={name}
          label={label}
          variant="outlined"
          value={selectedCity}
          onChange={onChange}
          error={error}
          helperText={helperText}
          InputLabelProps={{
            shrink: InputLabelProps?.shrink || false,
          }}
          required={required || false}
          disabled={disabled || false}
          inputProps={{
            readOnly: inputProps && inputProps.readOnly ? true : false,
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            selectedState &&
            cities &&
            cities.map((s, index) => (
              <MenuItem key={`${s["name"]}_${index}`} value={s["name"]}>
                {s["name"]}
              </MenuItem>
            ))
          )}
        </TextField>
      </span>
    );
  }
}

export default connect((state) => ({
  ...state.csc,
}))(withStyles(styles)(CityIso));
