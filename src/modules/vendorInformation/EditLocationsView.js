import React, { Component } from "react";
import { Grid, Box, Card, Typography, MenuItem } from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { Button } from "~/components/Forms";
import { TextField } from "~/components/Forms";
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";
import {
  fetchLocationsList,
  updatePayeeLocationDetails,
} from "~/redux/helpers/suppliers";
//import csc from 'country-state-city';
import { Country, City, State } from "~/components/CSC";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withTranslation } from "react-i18next";
import { AlertDialog } from "~/components/Dialogs";

class EditLocationsView extends Component {
  state = {
    locationData: this.props.data,
    locationsList: [],
    validation: {},
    alertMessage: null,
    alertMessageCallbackType: null,
  };

  componentDidMount() {
    this.fetchContactTypes();
  }

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
  };
  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
    this.props.showListView();
  };

  fetchContactTypes = () => {
    fetchLocationsList()
      .then((response) => {
        this.setState({ locationsList: response.data && response.data.rows });
      })
      .catch((error) => {
        this.setState({ locationsList: [] });
      });
  };
  handleSubmit = () => {
    const isValid = this.validateLocationForm();
    if (isValid) {
      this.saveContactData();
    }
  };
  validateLocationForm = () => {
    const { locationData } = this.state;
    const { t } = this.props;
    let valid = true;
    const locationValidation = {};
    if (
      !locationData ||
      !locationData.address1 ||
      locationData.address1.toString().trim() === ""
    ) {
      locationValidation["address1"] = t(
        "componentData.editLocationsView.addReq"
      );
      valid = false;
    }
    if (
      !locationData ||
      !locationData.locationTypeId ||
      (locationData.locationTypeId &&
        locationData.locationTypeId.toString().trim() === "")
    ) {
      locationValidation["locationTypeId"] = t(
        "componentData.editLocationsView.locationTypeReq"
      );
      valid = false;
    }

    if (
      !locationData ||
      !locationData.city ||
      (locationData.city && locationData.city.trim() === "")
    ) {
      locationValidation["city"] = t("componentData.editLocationsView.cityReq");
      valid = false;
    }

    if (
      !locationData ||
      !locationData.state ||
      (locationData.state && locationData.state.trim() === "")
    ) {
      if (locationData.country != "CA") {
        locationValidation["state"] = t(
          "componentData.editLocationsView.stateReq"
        );
      } else {
        locationValidation["state"] = t(
          "componentData.editLocationsView.ProvinceReq"
        );
      }
      valid = false;
    }

    if (
      !locationData ||
      !locationData.country ||
      (locationData.country && locationData.country.trim() === "")
    ) {
      locationValidation["country"] = t(
        "componentData.editLocationsView.CountryReq"
      );
      valid = false;
    }

    if (
      !locationData ||
      !locationData.zipCode ||
      (locationData.zipCode && locationData.zipCode.toString().trim() === "")
    ) {
      if (locationData.country != "CA") {
        locationValidation["zipCode"] = t(
          "componentData.editLocationsView.zipReq"
        );
      } else {
        locationValidation["zipCode"] = t(
          "componentData.editLocationsView.postalReq"
        );
      }
      valid = false;
    }
    if (
      locationData &&
      locationData.country &&
      locationData.country.trim() == "CA"
    ) {
      if (
        locationData &&
        locationData.zipCode &&
        locationData.zipCode.trim().length > 0
      ) {
        const re = /^([a-zA-Z0-9_-]){6,9}$/;
        if (!re.test(locationData.zipCode.trim())) {
          locationValidation["zipCode"] = t(
            "componentData.editLocationsView.alphanumericTxt"
          );
          valid = false;
        }
      }
    } else {
      if (
        locationData &&
        locationData.zipCode &&
        locationData.zipCode.trim().length > 0
      ) {
        const re = /^([0-9]){5,9}$/;
        if (!re.test(locationData.zipCode.trim())) {
          locationValidation["zipCode"] = t(
            "componentData.editLocationsView.zipLen"
          );
          valid = false;
        }
      }
    }

    if (
      !locationData ||
      !locationData.locationName ||
      locationData.locationName.toString().trim() === ""
    ) {
      locationValidation["locationName"] = t(
        "componentData.editLocationsView.locationReq"
      );
      valid = false;
    }
    if (
      !locationData ||
      !locationData.phone ||
      locationData.phone.toString().trim() === ""
    ) {
      locationValidation["phone"] = t(
        "componentData.editLocationsView.phoneLen"
      );
      valid = false;
    }

    if (
      locationData &&
      locationData.phone &&
      locationData.phone.toString().trim().length != 10
    ) {
      locationValidation["phone"] = t(
        "componentData.editLocationsView.phoneLen"
      );
      valid = false;
    }
    this.setState({ validation: { ...locationValidation } });
    return valid;
  };

  handleValidation = () => {
    const errorText = {};
    const { locationData } = this.state;
    const { t } = this.props;
    let valid = true;
    if (locationData.address1.toString().trim().length === 0) {
      valid = false;
      errorText["address1"] = t("componentData.editLocationsView.reqField");
    }
    if (locationData.city.toString().trim().length === 0) {
      valid = false;
      errorText["city"] = t("componentData.editLocationsView.reqField");
    }
    if (locationData.state.toString().trim().length === 0) {
      valid = false;
      errorText["state"] = t("componentData.editLocationsView.reqField");
    }
    if (locationData.country.toString().trim().length === 0) {
      valid = false;
      errorText["country"] = t("componentData.editLocationsView.reqField");
    }
    if (locationData.zipCode.toString().trim().length === 0) {
      valid = false;
      errorText["zipCode"] = t("componentData.editLocationsView.reqField");
    }
    if (locationData.phone.toString().trim().length !== 10) {
      valid = false;
      errorText["phone"] = t("componentData.editLocationsView.validPhone");
    }
    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };
  saveContactData = () => {
    const { id } = this.props;
    const { locationData } = this.state;
    const data = {
      payeeId: id,
      locationId: locationData.payeeLocationId,
      locationName: locationData.locationName || null,
      address1: locationData.address1 || null,
      address2: locationData.address2 || null,
      city: locationData.city || null,
      state: locationData.state || null,
      country: locationData.country || null,
      zipCode: locationData.zipCode || null,
      phone: locationData.phone || null,
      phoneCountryCode: locationData.phoneCountryCode || null,
      phoneExt: locationData.phoneExt || null,
      locationTypeId: locationData.locationTypeId || null,
      physicalCountryISO: locationData.physicalCountryISO || null,
    };

    updatePayeeLocationDetails(data)
      .then((response) => {
        if (response.error) {
          this.setState({
            alertMessage: response.message,
            alertMessageCallbackType: null,
          });
          return false;
        }

        this.setState({
          alertMessage: response.message,
          alertMessageCallbackType: "REDIRECT",
        });
      })
      .catch((error) => {});
  };
  render() {
    const { classes, t } = this.props;
    const {
      validation,
      locationData,
      locationsList,
      alertMessage,
      alertMessageCallbackType,
    } = this.state;
    return (
      <>
        <Card className={classes.card} style={{ padding: "25px" }}>
          <Grid container className={classes.details} spacing={3}>
            {
              <Grid item xs={6} md={6} className={classes.gridItem}>
                <Box my={1}>
                  <TextField
                    label={t("componentData.editLocationsView.locationName")}
                    error={validation && validation.locationName}
                    helperText={validation && validation.locationName}
                    fullWidth={true}
                    autoComplete="off"
                    variant="outlined"
                    value={locationData.locationName || ""}
                    id="locationName"
                    name="locationName"
                    inputProps={{
                      maxLength: 45,
                    }}
                    onChange={(e) =>
                      this.setState({
                        locationData: {
                          ...locationData,
                          [e.target.name]: e.target.value,
                        },
                      })
                    }
                  />
                </Box>
              </Grid>
            }
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.locationTypeId}
                  helperText={validation && validation.locationTypeId}
                  select
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  color="secondary"
                  label={t("componentData.editLocationsView.LocationType")}
                  value={(locationData && locationData.locationTypeId) || ""}
                  id="locationTypeId"
                  name="locationTypeId"
                  required
                  disabled={true}
                  onChange={(e) =>
                    this.setState({
                      locationData: {
                        ...locationData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                >
                  {locationsList
                    .filter((item) => {
                      if (
                        !locationData.isPrimary &&
                        item.locationTypeName.toLowerCase() == "headquarters"
                      ) {
                        return false;
                      }
                      return true;
                    })
                    .map((option) => (
                      <MenuItem
                        key={option.locationTypeId}
                        value={option.locationTypeId}
                      >
                        {option.locationTypeName}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.address1}
                  helperText={validation && validation.address1}
                  fullWidth={true}
                  autoComplete="off"
                  label={t("componentData.editLocationsView.Address1")}
                  variant="outlined"
                  color="secondary"
                  value={(locationData && locationData.address1) || ""}
                  name="address1"
                  required
                  onChange={(e) =>
                    this.setState({
                      locationData: {
                        ...locationData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 75,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <Country
                  name="country"
                  label={t("componentData.editLocationsView.reqCountry")}
                  selectedCountry={(locationData && locationData.country) || ""}
                  error={validation.country}
                  helperText={validation.country}
                  onChange={(e) => {
                    locationData.state = null;
                    locationData.city = null;
                    this.setState({
                      locationData: {
                        ...locationData,
                        [e.target.name]: e.target.value,
                      },
                    });
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.address2}
                  helperText={validation && validation.address2}
                  fullWidth={true}
                  autoComplete="off"
                  label={t("componentData.editLocationsView.Address2")}
                  variant="outlined"
                  color="secondary"
                  value={(locationData && locationData.address2) || ""}
                  name="address2"
                  onChange={(e) =>
                    this.setState({
                      locationData: {
                        ...locationData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 75,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <State
                  name="state"
                  label={
                    locationData && locationData.country != "CA"
                      ? t("componentData.editLocationsView.State")
                      : t("componentData.editLocationsView.Province")
                  }
                  error={validation.state}
                  helperText={validation.state}
                  required
                  onChange={(e) =>
                    this.setState({
                      locationData: {
                        ...locationData,
                        [e.target.name]: e.target.value,
                        city: null,
                      },
                    })
                  }
                  selectedState={(locationData && locationData.state) || ""}
                  selectedCountry={(locationData && locationData.country) || ""}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.zipCode}
                  helperText={validation && validation.zipCode}
                  fullWidth={true}
                  autoComplete="off"
                  label={
                    locationData && locationData.country != "CA"
                      ? t("componentData.editLocationsView.ZipCode")
                      : t("componentData.editLocationsView.PostalCode")
                  }
                  variant="outlined"
                  color="secondary"
                  value={(locationData && locationData.zipCode) || ""}
                  name="zipCode"
                  required
                  onChange={(e) =>
                    this.setState({
                      locationData: {
                        ...locationData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 9,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <City
                  name="city"
                  label={t("componentData.editLocationsView.City")}
                  error={validation.city}
                  helperText={validation.city}
                  selectedState={(locationData && locationData.state) || ""}
                  selectedCountry={(locationData && locationData.country) || ""}
                  selectedCity={(locationData && locationData.city) || ""}
                  onChange={(e) =>
                    this.setState({
                      locationData: {
                        ...locationData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <Grid container direction="row" spacing={3}>
                  <Grid item xs={3} sm={3}>
                    <CountryPhoneCode
                      select
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      variant="outlined"
                      name="phoneCountryCode"
                      id="country_code"
                      label={t("componentData.editLocationsView.Country")}
                      value={
                        (locationData && locationData.phoneCountryCode) || "+1"
                      }
                      error={validation.phoneCountryCode}
                      helperText={validation.phoneCountryCode}
                      onChange={(e) =>
                        this.setState({
                          locationData: {
                            ...locationData,
                            [e.target.name]: e.target.value,
                          },
                        })
                      }
                      inputProps={{ maxLength: 4 }}
                      required
                      excludeCountryCode={["CA", "UM"]}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <TextField
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      variant="outlined"
                      name="phone"
                      id="phone"
                      label={t("componentData.editLocationsView.PhoneNumber")}
                      value={(locationData && locationData.phone) || ""}
                      error={validation.phone}
                      helperText={validation.phone}
                      onChange={(e) =>
                        this.setState({
                          locationData: {
                            ...locationData,
                            [e.target.name]: e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ),
                          },
                        })
                      }
                      inputProps={{ maxLength: 10 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <TextField
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      variant="outlined"
                      name="phoneExt"
                      id="phoneExt"
                      label={t("componentData.editLocationsView.Ext")}
                      value={(locationData && locationData.phoneExt) || ""}
                      error={validation.phoneExt}
                      helperText={validation.phoneExt}
                      onChange={(e) =>
                        this.setState({
                          locationData: {
                            ...locationData,
                            [e.target.name]: e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            ),
                          },
                        })
                      }
                      inputProps={{ maxLength: 10 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box my={4} className={`button-container`}>
                <Box mx={2}>
                  <Button
                    type="submit"
                    fullWidth={false}
                    variant="outlined"
                    color="primary"
                    className={classes.btnSave}
                    onClick={this.props.onCancel}
                  >
                    <Typography variant="h4">
                      {" "}
                      {t("componentData.editLocationsView.cancel")}
                    </Typography>
                  </Button>
                </Box>
                <Box mx={2}>
                  <Button
                    type="submit"
                    fullWidth={false}
                    variant="contained"
                    color="primary"
                    onClick={this.handleSubmit}
                    style={{ padding: "10px" }}
                  >
                    <span
                      style={{
                        height: "18px",
                      }}
                    >
                      <span className={classes.checkIconClass}>
                        <CheckCircleIcon />
                      </span>
                    </span>
                    <Typography variant="h4">
                      {t("componentData.editLocationsView.SAVEANDEXIT")}
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Card>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </>
    );
  }
  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          callbackType === "REDIRECT" ? this.goBack() : this.hideAlertMessage();
        }}
      />
    );
  };
}

export default withTranslation()(withStyles(styles)(EditLocationsView));
