import React, { Component } from "react";
import { Grid, Box, Card, Typography, MenuItem } from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { Button } from "~/components/Forms";
import { TextField } from "~/components/Forms";
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";
import {
  fetchContactTypeList,
  updatePayeeContactDetails,
} from "~/redux/helpers/suppliers";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withTranslation } from "react-i18next";
import { AlertDialog } from "~/components/Dialogs";

class EditContactView extends Component {
  state = {
    contactData: this.props.data,
    contactTypeList: [],
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
    fetchContactTypeList()
      .then((response) => {
        this.setState({ contactTypeList: response.data && response.data.rows });
      })
      .catch((error) => {
        this.setState({ contactTypeList: [] });
      });
  };
  handleSubmit = () => {
    const isValid = this.validateForm();
    if (isValid) {
      this.saveContactData();
    }
  };

  validateForm = () => {
    const { contactData } = this.state;
    const { t } = this.props;
    let valid = true;
    const contactValidation = {};
    if (!contactData || !contactData.title || contactData.title.trim() === "") {
      contactValidation["title"] = t(
        "componentData.editContactView.PrefixRequired"
      );
      valid = false;
    }
    if (
      !contactData ||
      !contactData.firstName ||
      contactData.firstName.trim() === ""
    ) {
      contactValidation["firstName"] = t(
        "componentData.editContactView.fNameReq"
      );
      valid = false;
    }
    if (
      !contactData ||
      !contactData.lastName ||
      contactData.lastName.trim() === ""
    ) {
      contactValidation["lastName"] = t(
        "componentData.editContactView.lNameReq"
      );
      valid = false;
    }
    if (
      !contactData ||
      !contactData.phone ||
      contactData.phone.toString().trim() === ""
    ) {
      contactValidation["phone"] = t("componentData.editContactView.phoneLen");
      valid = false;
    }

    if (
      contactData &&
      contactData.phone &&
      contactData.phone.toString().trim().length != 10
    ) {
      contactValidation["phone"] = t("componentData.editContactView.phoneLen");
      valid = false;
    }
    if (!contactData || !contactData.email || contactData.email.trim() === "") {
      contactValidation["email"] = t("componentData.editContactView.emailReq");
      valid = false;
    }
    if (
      contactData &&
      contactData.email &&
      contactData.email.trim().length > 0
    ) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(contactData.email.trim().toLowerCase())) {
        contactValidation["email"] = t(
          "componentData.editContactView.InvalidEmail"
        );
        valid = false;
      }
    }
    if (
      !contactData ||
      !contactData.jobTitle ||
      contactData.jobTitle.trim() === ""
    ) {
      contactValidation["jobTitle"] = t(
        "componentData.editContactView.jobTitleReq"
      );
      valid = false;
    }
    if (
      !contactData ||
      !contactData.contactTypeId ||
      contactData.contactTypeId.length == 0
    ) {
      contactValidation["contactTypeId"] = t(
        "componentData.editContactView.contactType"
      );
      valid = false;
    }

    this.setState({ validation: { ...contactValidation } });
    return valid;
  };

  handleValidation = () => {
    const errorText = {};
    const { contactData } = this.state;
    const { t } = this.props;
    let valid = true;
    if (contactData.firstName.toString().trim().length === 0) {
      valid = false;
      errorText["firstName"] = t("componentData.editContactView.enterFName");
    }
    if (contactData.lastName.toString().trim().length === 0) {
      valid = false;
      errorText["lastName"] = t("componentData.editContactView.enterLName");
    }
    if (contactData.title.toString().trim().length === 0) {
      valid = false;
      errorText["title"] = t("componentData.editContactView.title");
    }
    if (contactData.jobTitle.toString().trim().length === 0) {
      valid = false;
      errorText["jobTitle"] = t("componentData.editContactView.jobTitle");
    }
    if (contactData.phone.toString().trim().length !== 10) {
      valid = false;
      errorText["phone"] = t("componentData.editContactView.phoneN");
    }
    if (
      contactData.email.toString().trim().length === 0 ||
      contactData.email
        .toString()
        .match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/) === null
    ) {
      errorText["email"] = t("componentData.editContactView.emailID");
    }
    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };
  saveContactData = () => {
    const { id } = this.props;
    const { contactData } = this.state;
    const data = {
      payeeId: id,
      contactId: contactData.payeeContactId,
      title: contactData.title || null,
      firstName: contactData.firstName || null,
      lastName: contactData.lastName || null,
      jobTitle: contactData.jobTitle || null,
      email: contactData.email || null,
      fax: contactData.fax || null,
      phoneCountryCode: contactData.phoneCountryCode || null,
      phone: contactData.phone || null,
      phoneExt: contactData.phoneExt || null,
      contactTypeId: contactData.contactTypeId || null,
    };

    updatePayeeContactDetails(data)
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
      contactData,
      contactTypeList,
      alertMessage,
      alertMessageCallbackType,
    } = this.state;

    return (
      <>
        <Card className={classes.card} style={{ padding: "25px" }}>
          <Grid container className={classes.details} spacing={3}>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.title}
                  helperText={validation && validation.title}
                  fullWidth={true}
                  select
                  value={(contactData && contactData.title) || ""}
                  autoComplete="off"
                  variant="outlined"
                  name="title"
                  color="secondary"
                  label={t("componentData.editContactView.NamePrefix")}
                  required
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                >
                  <MenuItem value="Mr">
                    {t("componentData.roleEditView.mr")}
                  </MenuItem>
                  <MenuItem value="Mrs">
                    {t("componentData.roleEditView.mrs")}
                  </MenuItem>
                  <MenuItem value="Ms">
                    {t("componentData.roleEditView.ms")}
                  </MenuItem>
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.firstName}
                  helperText={validation && validation.firstName}
                  fullWidth={true}
                  autoComplete="off"
                  label={t("componentData.editContactView.fName")}
                  variant="outlined"
                  color="secondary"
                  value={(contactData && contactData.firstName) || ""}
                  name="firstName"
                  required
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.lastName}
                  helperText={validation && validation.lastName}
                  label={t("componentData.editContactView.lName")}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  value={(contactData && contactData.lastName) || ""}
                  color="secondary"
                  name="lastName"
                  required
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.jobTitle}
                  helperText={validation && validation.jobTitle}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  label={t("componentData.editContactView.JBTitle")}
                  color="secondary"
                  value={(contactData && contactData.jobTitle) || ""}
                  name="jobTitle"
                  required
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.email}
                  helperText={validation && validation.email}
                  fullWidth={true}
                  autoComplete="off"
                  label={t("componentData.editContactView.email")}
                  variant="outlined"
                  color="secondary"
                  value={(contactData && contactData.email) || ""}
                  name="email"
                  required
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 50,
                  }}
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
                      label={t("componentData.editContactView.Country")}
                      value={
                        (contactData && contactData.phoneCountryCode) || "+1"
                      }
                      error={validation.phoneCountryCode}
                      helperText={validation.phoneCountryCode}
                      onChange={(e) =>
                        this.setState({
                          contactData: {
                            ...contactData,
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
                      label={t("componentData.editContactView.PhoneNumber")}
                      value={(contactData && contactData.phone) || ""}
                      error={validation.phone}
                      helperText={validation.phone}
                      onChange={(e) =>
                        this.setState({
                          contactData: {
                            ...contactData,
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
                      label={t("componentData.editContactView.Ext")}
                      value={(contactData && contactData.phoneExt) || ""}
                      error={validation.phoneExt}
                      helperText={validation.phoneExt}
                      onChange={(e) =>
                        this.setState({
                          contactData: {
                            ...contactData,
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
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.contactTypeId}
                  helperText={validation && validation.contactTypeId}
                  select
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  color="secondary"
                  label={t("componentData.editContactView.ContactType")}
                  value={(contactData && contactData.contactTypeId) || ""}
                  id="contactTypeId"
                  name="contactTypeId"
                  required
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value,
                      },
                    })
                  }
                >
                  {contactTypeList.map((option) => (
                    <MenuItem
                      key={option.contactTypeId}
                      value={option.contactTypeId}
                    >
                      {option.contactTypeName}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={6} md={6} className={classes.gridItem}>
              <Box my={1}>
                <TextField
                  error={validation && validation.fax}
                  helperText={validation && validation.fax}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  label={t("componentData.editContactView.Fax")}
                  value={(contactData && contactData.fax) || ""}
                  name="fax"
                  onChange={(e) =>
                    this.setState({
                      contactData: {
                        ...contactData,
                        [e.target.name]: e.target.value.replace(
                          /[^0-9+.]/g,
                          ""
                        ),
                      },
                    })
                  }
                  inputProps={{
                    maxLength: 10,
                  }}
                />
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
                      {t("componentData.editContactView.cancel")}
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
                      {t("componentData.editContactView.SAVEANDEXIT")}
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

export default withTranslation()(withStyles(styles)(EditContactView));
