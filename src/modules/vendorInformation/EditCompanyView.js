import React, { Component } from "react";
import {
  Grid,
  Box,
  Card,
  Typography,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";

import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { TextField, Button } from "~/components/Forms";
import { updatePayeeDetails } from "~/redux/helpers/suppliers";
import { fetchLocationTypeList } from "~/redux/actions/client";
import { Country, City, State } from "~/components/CSC";
import CountryPhoneCode from "~/components/Forms/CountryPhoneCode";
import MaskInput from "~/components/MaskInput";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withTranslation } from "react-i18next";

import { AlertDialog } from "~/components/Dialogs";

class EditCompanyView extends Component {
  state = {
    companyDetail:
      (this.props.vendorInfo && {
        ...this.props.vendorInfo,
        ...this.props.vendorInfo.payeeLocations,
      }) ||
      {},
    website: this.props.vendorInfo.website,
    dunsNumber: this.props.vendorInfo.dunsNumber,
    locationTypeList: [],
    alertMessage: null,
    alertMessageCallbackType: null,
    validation: {},
  };

  componentDidMount() {
    this.fetchLocationTypes();
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

  fetchLocationTypes = () => {
    this.props.dispatch(fetchLocationTypeList()).then((response) => {
      if (!response) {
        return false;
      }
      this.setState({
        locationTypeList: this.props.client.locationTypeList,
      });
    });
  };

  handleSubmit = () => {
    const isValid = this.validateCompanyForm();
    if (isValid) {
      this.saveCompanyData();
    }
  };

  handleValidation = () => {
    const errorText = {};
    const { website, dunsNumber } = this.state;
    const { t } = this.props;
    let valid = true;
    if (website.toString().trim().length !== 0) {
      const re =
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      if (!re.test(website.toString().trim())) {
        errorText["website"] = t("componentData.editCompanyView.enterWeb");
        valid = false;
      }
    }
    if (dunsNumber.toString().trim().length !== 9) {
      valid = false;
      errorText["dunsNumber"] = t("componentData.editCompanyView.dunsLen");
    }
    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };
  saveCompanyData = () => {
    const { vendorInfo } = this.props;
    const { companyDetail } = this.state;
    const data = {
      payeeId: vendorInfo.payeeId,
      companyName: companyDetail.companyName || null,
      taxId: companyDetail.taxId || null,
      isTaxIdSsn: companyDetail.isTaxIdSsn || false,
      dunsNumber: companyDetail.dunsNumber || null,
      npiId: companyDetail.npiId || null,
      website: companyDetail.website || null,
      payeeLocations: [
        {
          address1: companyDetail.address1 || null,
          address2: companyDetail.address2 || null,
          city: companyDetail.city || null,
          state: companyDetail.state || null,
          country: companyDetail.country || null,
          zipCode: companyDetail.zipCode || null,
          physicalCountryISO: companyDetail.physicalCountryISO || null,
          fax: companyDetail.fax || null,
          phone: companyDetail.phone || null,
          phoneCountryCode: companyDetail.phoneCountryCode || null,
          phoneExt: companyDetail.phoneExt || null,
          locationTypeId: companyDetail.locationTypeId || null,
        },
      ],
    };

    updatePayeeDetails(data)
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

  handleCompanyChange = (field, event, value, position) => {
    const { companyDetail } = this.state;
    const newDetail = { ...companyDetail };
    const fieldName = event ? event.target.name : null;

    switch (field) {
      case "phone":
        const phoneValue = event.target.value;
        newDetail["phoneCountryCode"] = phoneValue.ccode;
        newDetail["phone"] = phoneValue.phone;
        newDetail["phoneExt"] = phoneValue.ext;
        break;
      case "isTaxIdSsn":
        const isTaxIdSsn = event.target.value;
        if (isTaxIdSsn == 1) {
          newDetail[field] = true;
        } else {
          newDetail[field] = false;
        }
        break;
      case "country":
        newDetail[fieldName] = event.target.value;
        newDetail["state"] = null;
        newDetail["city"] = null;
        newDetail["physicalCountryISO"] =
          event.target.value == "CA" ? "CA" : "US";
        newDetail["isTaxIdSsn"] =
          event.target.value == "CA" ? false : newDetail["isTaxIdSsn"];
        break;
      case "state":
        newDetail[fieldName] = event.target.value;
        newDetail["city"] = null;
        break;
      case "taxId":
        newDetail["taxId"] = event.target.value;
        break;
      case "dunsNumber":
        newDetail["dunsNumber"] = value;
        break;
      case "fax":
        newDetail["fax"] = event.target.value.replace(/[^0-9+.]/g, "");
        break;
      case "companyName":
        const validCharacters = /[a-zA-Z0-9 @#$%&()_+\-=;:".\/]$/g;
        const newCompanyName = event.target.value;
        if (!newCompanyName || validCharacters.test(newCompanyName)) {
          newDetail[fieldName] = event.target.value;
        }
        break;
      default:
        newDetail[fieldName] = event.target.value;
        break;
    }

    this.setState({ companyDetail: { ...newDetail } });
  };

  validateCompanyForm = () => {
    const { companyDetail } = this.state;
    const { t } = this.props;
    let valid = true;
    const validation = {};
    if (
      !companyDetail ||
      !companyDetail.companyName ||
      companyDetail.companyName.trim() === ""
    ) {
      validation["companyName"] = t("componentData.editCompanyView.compName");
      valid = false;
    }
    if (
      !companyDetail ||
      !companyDetail.address1 ||
      companyDetail.address1.trim() === ""
    ) {
      validation["address1"] = t("componentData.editCompanyView.addReq");
      valid = false;
    }
    if (
      !companyDetail ||
      !companyDetail.city ||
      companyDetail.city.trim() === ""
    ) {
      validation["city"] = t("componentData.editCompanyView.cityReq");
      valid = false;
    }
    if (
      !companyDetail ||
      !companyDetail.state ||
      companyDetail.state.trim() === ""
    ) {
      validation["state"] = t("componentData.editCompanyView.stateReq");
      valid = false;
    }
    if (
      !companyDetail ||
      !companyDetail.country ||
      companyDetail.country.trim() === ""
    ) {
      validation["country"] = t("componentData.editCompanyView.countryReq");
      valid = false;
    }
    if (
      !companyDetail ||
      !companyDetail.zipCode ||
      companyDetail.zipCode.toString().trim() === ""
    ) {
      validation["zipCode"] = t("componentData.editCompanyView.zipReq");
      valid = false;
    }
    if (
      companyDetail &&
      companyDetail.country &&
      companyDetail.country.trim() == "CA"
    ) {
      if (companyDetail?.zipCode?.trim().length > 0) {
        const re = /^([a-zA-Z0-9_-]){6,9}$/;
        if (!re.test(companyDetail.zipCode.trim())) {
          validation["zipCode"] = t("componentData.editCompanyView.postalLen");
          valid = false;
        }
      }
    } else {
      if (
        companyDetail &&
        companyDetail.zipCode &&
        companyDetail.zipCode.trim().length > 0
      ) {
        const re = /^([0-9]){5,9}$/;
        if (!re.test(companyDetail.zipCode.trim())) {
          validation["zipCode"] = t("componentData.editCompanyView.zipLen");
          valid = false;
        }
      }
    }
    if (
      !companyDetail ||
      !companyDetail.locationTypeId ||
      companyDetail.locationTypeId.toString().trim() === ""
    ) {
      validation["locationTypeId"] = t(
        "componentData.editCompanyView.locationReq"
      );
      valid = false;
    }
    if (
      !companyDetail ||
      !companyDetail.phone ||
      companyDetail.phone.toString().trim() === ""
    ) {
      validation["phone"] = t("componentData.editCompanyView.phoneLen");
      valid = false;
    }

    if (
      companyDetail &&
      companyDetail.phone &&
      companyDetail.phone.toString().trim().length != 10
    ) {
      validation["phone"] = t("componentData.editCompanyView.phoneMaxLen");
      valid = false;
    }
    if (
      !companyDetail ||
      !companyDetail.taxId ||
      companyDetail.taxId.trim() == ""
    ) {
      validation["taxId"] = t("componentData.editCompanyView.FederalLen");
      valid = false;
    }

    if (
      companyDetail &&
      companyDetail.taxId &&
      companyDetail.taxId.trim().length != 9
    ) {
      validation["taxId"] = t("componentData.editCompanyView.FederalMaxLen");
      valid = false;
    }

    if (
      companyDetail &&
      companyDetail.taxId &&
      companyDetail.taxId.trim().length > 0
    ) {
      const re = /^[0-9]*$/;
      if (!re.test(companyDetail.taxId.trim())) {
        validation["taxId"] = t("componentData.editCompanyView.FederalMaxLen");
        valid = false;
      }
    }

    if (
      companyDetail &&
      companyDetail.dunsNumber &&
      companyDetail.dunsNumber.toString().trim().length != 9
    ) {
      validation["dunsNumber"] = t("componentData.editCompanyView.DUNSMaxLen");
      valid = false;
    }
    if (
      companyDetail &&
      companyDetail.dunsNumber &&
      companyDetail.dunsNumber.toString().trim().length > 0
    ) {
      const re = /^[0-9]*$/;
      if (!re.test(companyDetail.dunsNumber.toString().trim())) {
        validation["dunsNumber"] = t(
          "componentData.editCompanyView.DUNSMaxLen"
        );
        valid = false;
      }
    }
    if (
      companyDetail &&
      companyDetail.npiId &&
      companyDetail.npiId.toString().trim().length != 10
    ) {
      validation["npiId"] = t("componentData.editCompanyView.NPILen");
      valid = false;
    }
    if (
      companyDetail &&
      companyDetail.website &&
      companyDetail.website.trim().length > 0
    ) {
      const re =
        /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
      if (!re.test(companyDetail.website.trim())) {
        validation["website"] = t("componentData.editCompanyView.enterWeb");
        valid = false;
      }
    }

    this.setState({ validation: { ...validation } });

    return valid;
  };

  render() {
    const { classes, t } = this.props;
    const {
      validation,
      companyDetail,
      locationTypeList,
      alertMessage,
      alertMessageCallbackType,
    } = this.state;

    return (
      <>
        <Card className={classes.card} style={{ padding: "25px" }}>
          <Grid container className={classes.details} spacing={2}>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation.companyName}
                  helperText={validation.companyName}
                  fullWidth={true}
                  autoComplete="off"
                  label={t("componentData.editCompanyView.compNameReq")}
                  variant="outlined"
                  value={(companyDetail && companyDetail.companyName) || ""}
                  name="companyName"
                  inputProps={{
                    maxLength: 100,
                  }}
                  onChange={(event) =>
                    this.handleCompanyChange("companyName", event)
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation.address1}
                  helperText={validation.address1}
                  fullWidth={true}
                  label={t("componentData.editCompanyView.add1")}
                  autoComplete="off"
                  variant="outlined"
                  value={(companyDetail && companyDetail.address1) || ""}
                  name="address1"
                  inputProps={{
                    maxLength: 100,
                  }}
                  onChange={(event) =>
                    this.handleCompanyChange("address1", event)
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation.website}
                  helperText={validation.website}
                  fullWidth={true}
                  label={t("componentData.editCompanyView.enterWeb")}
                  autoComplete="off"
                  variant="outlined"
                  value={(companyDetail && companyDetail.website) || ""}
                  name="website"
                  onChange={(event) =>
                    this.handleCompanyChange("website", event)
                  }
                  inputProps={{
                    maxLength: 200,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation.address2}
                  helperText={validation.address2}
                  fullWidth={true}
                  label={t("componentData.editCompanyView.add2")}
                  autoComplete="off"
                  variant="outlined"
                  value={(companyDetail && companyDetail.address2) || ""}
                  name="address2"
                  inputProps={{
                    maxLength: 100,
                  }}
                  onChange={(event) =>
                    this.handleCompanyChange("address2", event)
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <Grid container xs={12} item>
                  <Grid item xs={6} md={6} style={{ marginRight: 24 }}>
                    {" "}
                    <TextField
                      required
                      disabled={true}
                      autoComplete="off"
                      error={validation.isTaxIdSsn}
                      helperText={validation.isTaxIdSsn}
                      select
                      value={
                        companyDetail && companyDetail.isTaxIdSsn == true
                          ? 1
                          : 0
                      }
                      name="SSN"
                      label={t(
                        "componentData.editCompanyView.IdentificationNumber"
                      )}
                      variant="outlined"
                      fullWidth
                      onChange={(event) =>
                        this.handleCompanyChange("isTaxIdSsn", event)
                      }
                      dir="horizontal"
                    >
                      {[
                        companyDetail && companyDetail.country != "CA"
                          ? t("componentData.editCompanyView.FederalTaxID")
                          : t("componentData.editCompanyView.BusinessNumber"),
                        t("componentData.editCompanyView.SSN"),
                      ]
                        .filter((item, index) => {
                          if (
                            companyDetail &&
                            companyDetail.country == "CA" &&
                            index == 1
                          ) {
                            return false;
                          }
                          return true;
                        })
                        .map((option, index) => (
                          <MenuItem key={index} value={index}>
                            {option}
                          </MenuItem>
                        ))}
                    </TextField>{" "}
                  </Grid>
                  <Grid item xs md>
                    {" "}
                    <TextField
                      label={
                        companyDetail && companyDetail.country != "CA"
                          ? t("componentData.editCompanyView.FederalTaxReq")
                          : t("componentData.editCompanyView.BusinessNumberReq")
                      }
                      error={validation.taxId}
                      helperText={validation.taxId}
                      fullWidth={true}
                      autoComplete="off"
                      variant="outlined"
                      value={(companyDetail && companyDetail.taxId) || ""}
                      name="taxId"
                      inputProps={{
                        maxLength: 9,
                      }}
                      onChange={(event) =>
                        this.handleCompanyChange("taxId", event)
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={3} md={3} className={classes.gridItem}>
              <Box my={1}>
                <Country
                  name="country"
                  label={t("componentData.editCompanyView.CountryReq")}
                  selectedCountry={
                    (companyDetail && companyDetail.country) || ""
                  }
                  error={validation.country}
                  helperText={validation.country}
                  onChange={(event) =>
                    this.handleCompanyChange("country", event)
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={3} md={3} className={classes.gridItem}>
              <Box my={1}>
                <State
                  name="state"
                  label={
                    companyDetail && companyDetail.country != "CA"
                      ? t("componentData.editCompanyView.state")
                      : t("componentData.editCompanyView.Province")
                  }
                  error={validation.state}
                  helperText={validation.state}
                  onChange={(event) => this.handleCompanyChange("state", event)}
                  selectedState={(companyDetail && companyDetail.state) || ""}
                  selectedCountry={
                    (companyDetail && companyDetail.country) || ""
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={2}>
                <MaskInput
                  error={validation.dunsNumber}
                  helperText={validation.dunsNumber}
                  value={(companyDetail && companyDetail.dunsNumber) || ""}
                  name="dunsNumber"
                  label={t("componentData.editCompanyView.DUNSNumber")}
                  variant="outlined"
                  fullWidth={true}
                  // onChange={(event) => handleChange("dunsNumber", event)}
                  getValue={(val) =>
                    this.handleCompanyChange("dunsNumber", null, val)
                  }
                  dir="horizontal"
                  autoComplete="off"
                  inputProps={{
                    maxLength: 9,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={3} md={3} className={classes.gridItem}>
              <Box my={1}>
                <City
                  name="city"
                  label={t("componentData.editCompanyView.City")}
                  error={validation.city}
                  helperText={validation.city}
                  selectedState={(companyDetail && companyDetail.state) || ""}
                  selectedCountry={
                    (companyDetail && companyDetail.country) || ""
                  }
                  selectedCity={(companyDetail && companyDetail.city) || ""}
                  onChange={(event) => this.handleCompanyChange("city", event)}
                />
              </Box>
            </Grid>
            <Grid item xs={3} md={3} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  required
                  error={validation.zipCode}
                  helperText={validation.zipCode}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  label={
                    companyDetail && companyDetail.country != "CA"
                      ? t("componentData.editCompanyView.ZipCode")
                      : t("componentData.editCompanyView.PostalCode")
                  }
                  value={(companyDetail && companyDetail.zipCode) || ""}
                  name="zipCode"
                  inputProps={{
                    maxLength: 9,
                  }}
                  onChange={(event) =>
                    this.handleCompanyChange("zipCode", event)
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation.locationTypeId}
                  helperText={validation.locationTypeId}
                  select
                  disabled={true}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  label={t("componentData.editCompanyView.Locationtype")}
                  value={(companyDetail && companyDetail.locationTypeId) || ""}
                  id="locationTypeId"
                  name="locationTypeId"
                  onChange={(event) =>
                    this.handleCompanyChange("locationTypeId", event)
                  }
                >
                  {locationTypeList ? (
                    locationTypeList.map((option) => (
                      <MenuItem
                        key={option.locationTypeId}
                        value={option.locationTypeId}
                      >
                        {option.locationTypeName}
                      </MenuItem>
                    ))
                  ) : (
                    <Box
                      width="100px"
                      display="flex"
                      mt={1.875}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CircularProgress color="primary" />
                    </Box>
                  )}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation.fax}
                  helperText={validation.fax}
                  fullWidth={true}
                  autoComplete="off"
                  label={t("componentData.editCompanyView.Fax")}
                  variant="outlined"
                  value={(companyDetail && companyDetail.fax) || ""}
                  name="fax"
                  inputProps={{
                    maxLength: 10,
                  }}
                  onChange={(event) => this.handleCompanyChange("fax", event)}
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
                      label={t("componentData.editCompanyView.Country")}
                      value={
                        (companyDetail && companyDetail.phoneCountryCode) ||
                        "+1"
                      }
                      error={validation.phoneCountryCode}
                      helperText={validation.phoneCountryCode}
                      onChange={(e) =>
                        this.setState({
                          companyDetail: {
                            ...companyDetail,
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
                      label={t("componentData.editCompanyView.PhoneNumber")}
                      value={(companyDetail && companyDetail.phone) || ""}
                      error={validation.phone}
                      helperText={validation.phone}
                      onChange={(e) =>
                        this.setState({
                          companyDetail: {
                            ...companyDetail,
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
                      label={t("componentData.editCompanyView.Ext")}
                      value={(companyDetail && companyDetail.phoneExt) || ""}
                      error={validation.phoneExt}
                      helperText={validation.phoneExt}
                      onChange={(e) =>
                        this.setState({
                          companyDetail: {
                            ...companyDetail,
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
            {companyDetail &&
              companyDetail.npiId &&
              companyDetail.npiId !== null && (
                <Grid item xs={6} md={6} className={classes.gridItem}>
                  <Box my={1}>
                    <TextField
                      error={validation.npiId}
                      helperText={validation.npiId}
                      fullWidth={true}
                      autoComplete="off"
                      variant="outlined"
                      label={t("componentData.editCompanyView.NPIID")}
                      value={(companyDetail && companyDetail.npiId) || ""}
                      name="npiId"
                      inputProps={{
                        maxLength: 10,
                      }}
                      onChange={(event) =>
                        this.handleCompanyChange("npiId", event)
                      }
                    />
                  </Box>
                </Grid>
              )}
            <Grid item xs={12} className={classes.gridItem}>
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
                      {t("componentData.editCompanyView.cancel")}
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
                      {t("componentData.editCompanyView.SAVEANDEXIT")}
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

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.client,
    ...state.csc,
  }))(withStyles(styles)(EditCompanyView))
);
