import {
  CircularProgress,
  MenuItem,
  withStyles,
  TextField,
} from "@material-ui/core";
import { getAllCountries } from "~/redux/actions/csc";
import { connect } from "react-redux";
import { styles } from "./styles";
import React from "react";
import { entityType } from "~/config/entityTypes";

class CountryIso extends React.Component {
  state = {
    countries: [],
    isLoading: false,
  };

  componentDidMount() {
    this.getCountriesList();
  }

  getCountriesList() {
    this.setState({ isLoading: true }, () => {
      this.props.dispatch(getAllCountries()).then((res) => {
        if (res) {
          const { csc } = this.props;
          this.setState({
            countries: csc && csc["countryList"],
            isLoading: false,
          });
        }
      });
    });
  }

  render() {
    const {
      onChange,
      error,
      helperText,
      isoCode3,
      label,
      name,
      value,
      InputLabelProps,
      required,
      disabled,
      inputProps,
    } = this.props;
    const { countries, isLoading } = this.state;
    const countryCodeKey = isoCode3 ? "isoCode3" : "isoCode";
    const { userData } = this.props.user;
    const isB2C = parseInt(userData.appType) === entityType.B2C;
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
          value={value}
          onChange={onChange}
          error={error}
          helperText={helperText}
          InputLabelProps={{
            shrink: (InputLabelProps && InputLabelProps.shrink) || false,
          }}
          required={required || false}
          disabled={disabled || false}
          inputProps={{
            readOnly: inputProps && inputProps.readOnly ? true : false,
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : isB2C ? (
            countries &&
            countries
              .filter((country) => country.isoCode !== "CA")
              .map((c) => (
                <MenuItem key={c.isoCode} value={c[countryCodeKey]}>
                  {c["isoCode"]}
                </MenuItem>
              ))
          ) : (
            countries &&
            countries.map((c) => (
              <MenuItem key={c.isoCode} value={c[countryCodeKey]}>
                {c["isoCode"]}
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
  ...state.user,
}))(withStyles(styles)(CountryIso));
