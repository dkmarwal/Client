import React from "react";
import { connect } from "react-redux";
import { AlertDialog } from "~/components/Dialogs";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { Grid, Box, Card, Button, CircularProgress, FormControlLabel, Checkbox } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import Phone from "~/components/TextBox/Phone";
import {
  fetchClientLogoData,
  saveClientLogoData,
} from "~/redux/helpers/branding";
import "./styles.scss";
import { accessRights } from "~/config/accessRights";
import { withTranslation } from "react-i18next";

class ClientLogo extends React.Component {
  state = {
    logo: "",
    error: {},
    btnLoader: false,
    loginWelcomeMsg: "",
    phone: null,
    phoneExt: null,
    phoneCountryCode: null,
    email: null,
    slugUrl: null,
    fromEmail: null,
    message: "",
    flag: false,
    isPoweredBy: false,
  };

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: true });
  }

  hideAlertMessage() {
    this.setState({ message: "", flag: false });
  }

  componentDidMount() {
    this.getData();
  }

  handleChange = (field, event) => {
    const fieldName = event.target.name;

    switch (fieldName) {
      case "phone":
        this.setState({
          ...event.target.value,
        });
        break;
      case "slugUrl":
        this.setState({
            slugUrl: event.target.value.replace(/[^a-zA-Z0-9 @$_-]/g, ""),
        });
        break;
      case "email":
        this.setState({
          email: event.target.value,
        });
        break;
       case "fromEmail":
        this.setState({
          fromEmail: event.target.value,
        });
        break;
      default:
        this.setState({ field: event.target.value });
        break;
    }

  }

  updateData() {
    if (this.validateForm()) {
      const { loginWelcomeMsg, logo, phone, email, fromEmail, slugUrl, isPoweredBy } = this.state;      
      const payload = {
        logo: logo,
        loginWelcomeMsg: loginWelcomeMsg || null,
        supportPhone: phone,
        supportEmail: email.trim(),
        fromEmail: (fromEmail && fromEmail.trim()) || null,
        consumerSlugUrl: (slugUrl && slugUrl.trim()) || null,
        checkStatus: isPoweredBy ? 1 : 0
      };
      this.setState({ btnLoader: true }, () => {
        saveClientLogoData(payload).then((response) => {
          this.setDialogMessage(true, response.message);
          this.setState({ btnLoader: false });
        });
      });
    }
  }

  getData() {
    const clientId = this.props.user.userData.portalProfileId;
    const appType = this.props.user.userData.appType;
    fetchClientLogoData(clientId, appType).then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message);
        return false;
      }      
      this.setState({
        logo: response?.data?.logo ?? "",
        loginWelcomeMsg: response.data && response.data.loginWelcomeMsg,
        phone: response?.data?.supportPhone ?? null,
        email: response?.data?.supportEmail ?? null,
        fromEmail: response?.data?.fromEmail ?? null,
        slugUrl: response?.data?.consumerSlugUrl ?? null,
        isPoweredBy: response?.data?.checkStatus === 0 ? false : true
      });
    });
  }

  handleEditor(value) {
    this.setState({ html: value });
  }

  onFileUpload(e) {
    let file = e.target.files[0];
    if (e.target.files[0] && file) {
      let reader = new FileReader();
      reader.onload = (upload) => {
        this.setState(
          {
            logo: upload.target.result,
          },
          () => {
            // console.log(this.state.logo);
          }
        );
      };
      reader.readAsDataURL(file);
    }
  }

  validateForm() {
    const { logo, loginWelcomeMsg, email, fromEmail, phone, slugUrl } = this.state;
    const error = {};
    let valid = true;
    const { t, user} = this.props;
    const bankParentProfileId = user.userData.activeBankParentProfileId;

    if (!logo || logo.toString().trim().length === 0) {
      error["logo"] = t("componentData.clientLogo.logoEmptyMsg");
      valid = false;
    }
    // if (logo && logo.toString().trim()) {
    //   error["logo"] = "Logo can not be empty.";
    //   valid = false;
    // }
    if (bankParentProfileId == 1 && (!loginWelcomeMsg || loginWelcomeMsg.toString().trim().length === 0)) {
      error["loginWelcomeMsg"] = t("componentData.clientLogo.welcomeEmptyMsg");
      valid = false;
    }

    if (bankParentProfileId == 1 && (!slugUrl || (slugUrl && slugUrl.trim() === "") ) ) {
      error["slugUrl"] = t("componentData.clientLogo.slugUrlMsg");
      valid = false;
    }
    if (
      !phone ||
      ((phone && phone.toString().trim() === "") ||
        (phone.toString().trim().length !== 10))
    ) {
      error["phone"] = t("componentData.clientLogo.phoneLen");
      valid = false;
    }
    if (!email || (email && email.trim() === "")) {
      error["email"] = t("componentData.clientLogo.emailMsg");
      valid = false;
    }
    if (email && (email && email.trim().length > 0)) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email.trim().toLowerCase())) {
        error["email"] = t("componentData.clientLogo.invalidEmail");
        valid = false;
      }
    }

    if (bankParentProfileId == 1 && (!fromEmail || (fromEmail && fromEmail.trim() === "")) ) {
      error["fromEmail"] = t("componentData.clientLogo.fromEmail");
      valid = false;
    }
    if (bankParentProfileId == 1 && fromEmail && (fromEmail && fromEmail.trim().length > 0)) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(fromEmail.trim().toLowerCase())) {
        error["fromEmail"] = t("componentData.clientLogo.invalidEmail");
        valid = false;
      }
    }

    this.setState({ error: error });
    return valid;
  }

  poweredByCheck=(e)=>{    
    this.setState({
      isPoweredBy : e.currentTarget.checked
    })
  }

  render() {
    const { t } = this.props;    
    const {
      btnLoader,
      flag,
      message,      
      logo,
      loginWelcomeMsg,
      error,
      phone,
      phoneExt,
      phoneCountryCode,
      email,
      fromEmail,
      slugUrl,
      isPoweredBy
    } = this.state;    

    const { user } = this.props;
    const bankParentProfileId = user.userData.activeBankParentProfileId;
    const isBrandingSupplierSiteViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["BRANDING_SUPPLIER_SITE_EDIT"])) ||
      false;

    return (
      <div className={"clientLogoContainer"}>
        <Grid>
          <Box my={2} mx={6}>
            <Card>
              <Box my={4} mx={5}>
                {t("componentData.clientLogo.uploadLogoMSg")}
              </Box>
              <Grid>
                {logo && logo.length > 0 ? (
                  <span className="clientLogo">
                    <img src={logo} className="imageAvatar" alt="" />
                    {isBrandingSupplierSiteViewEnabled && (
                      <label
                        style={{ margin: "20px 0px 0px 40px", color: "blue" }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => this.onFileUpload(e)}
                        />{" "}
                        {t("componentData.clientLogo.uploadNewLogo")}
                      </label>
                    )}
                    <IconButton
                      color="primary"
                      aria-label={t("componentData.clientLogo.uploadPicture")}
                      component="span"
                    >
                      <Tooltip
                        title={t("componentData.clientLogo.imgSupportMsg")}
                      >
                        <InfoIcon fontSize="small" color="primary" />
                      </Tooltip>
                    </IconButton>
                  </span>
                ) : isBrandingSupplierSiteViewEnabled ? (
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => this.onFileUpload(e)}
                    />
                    <span
                      className="avatar"
                      style={
                        this.props.i18n.language === "fr"
                          ? { fontSize: 12 }
                          : {}
                      }
                    >
                      {t("componentData.clientLogo.clickToUpload")}
                    </span>
                  </label>
                ) : null}
                {error["logo"] && (
                  <Box className={"errorMessage"} ml={7}>{error["logo"]}</Box>
                )}
              </Grid>
              <Box mt={5} px={5} width={1 / 2}>
                <TextField
                  required= {bankParentProfileId == 1? true: false}
                  error={error.slugUrl}
                  helperText={error.slugUrl || ""}
                  disabled={bankParentProfileId != 1}
                  fullWidth={true}
                  autoComplete="off"
                  autoFocus={true}
                  value={slugUrl || ""}
                  name="slugUrl"
                  onChange={(event) => this.handleChange("slugUrl", event)}
                  dir="horizontal"
                  size="medium"
                  variant="outlined"
                  inputProps={{
                    maxLength: 50,
                  }}
                  label={t("componentData.clientLogo.slugUrl")}
                />
              </Box>
              <Box px={5} width={1 / 2}>
                <Phone
                  required
                  error={error.phone}
                  helperText={error.phone || ""}
                  disabled={!isBrandingSupplierSiteViewEnabled}
                  id="phone"
                  name="phone"
                  ext={phoneExt || ""}
                  value={phone || ""}
                  ccode={phoneCountryCode || ""}
                  isExt={false}
                  prefixCcode="+1"
                  fullWidth={true}
                  variant="outlined"
                  onChange={(event) => this.handleChange("phone", event)}
                />
              </Box>
              <Box px={5} width={1 / 2}>
                <TextField
                  required
                  label={t("componentData.clientLogo.email")}
                  disabled={!isBrandingSupplierSiteViewEnabled}
                  error={error.email}
                  helperText={error.email || ""}
                  fullWidth={true}
                  autoFocus={false}
                  autoComplete="off"
                  variant="outlined"
                  value={email || ""}
                  name="email"
                  onChange={(event) => this.handleChange("email", event)}
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Box>
              <Box px={5} width={1 / 2}>
                <TextField
                  required = {bankParentProfileId == 1? true: false}
                  label={t("componentData.clientLogo.fromEmail")}
                  disabled={bankParentProfileId != 1}
                  error={error.fromEmail}
                  helperText={error.fromEmail || ""}
                  fullWidth={true}
                  autoFocus={false}
                  autoComplete="off"
                  variant="outlined"
                  value={fromEmail || ""}
                  name="fromEmail"
                  onChange={(event) => this.handleChange("fromEmail", event)}
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Box>

              <Box my={1} ml={5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPoweredBy}
                      onChange={(e)=>this.poweredByCheck(e)}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label={t("componentData.clientLogo.poweredByTxt")}
                />
              </Box>

              <Box py={1} px={5}>
                <div>{t("componentData.clientLogo.editWelcMsg")}</div>
                <textarea
                  disabled={bankParentProfileId != 1}
                  style={{
                    background: "#0B1941",
                    color: "rgba(255,255,255,0.87)",
                  }}
                  value={loginWelcomeMsg}
                  rows="8"
                  cols="60"
                  onChange={(e) =>
                    this.setState({ loginWelcomeMsg: e.target.value })
                  }
                ></textarea>
                {error["loginWelcomeMsg"] && (
                  <Box className={"errorMessage"} ml={2}>
                    {error["loginWelcomeMsg"]}
                  </Box>
                )}
                <Box ml={2}>{`${(loginWelcomeMsg && loginWelcomeMsg.length) || 0
                  } Chars`}</Box>  

                <Box my={5} ml={2}>{t("componentData.clientLogo.noteTxt")}</Box>
              </Box>
            </Card>
          </Box>
        </Grid>
        <Grid justify="end">
          <Box mt={5}>
            {/* {savingDetails ? (
                <CircularProgress color="primary" />
            ) : ( */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              {isBrandingSupplierSiteViewEnabled && (
                <Box>
                  {btnLoader ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <Button
                      variant="contained"
                      disableElevation
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",

                        margin: "0px 10px 0 0",
                      }}
                      color="primary"
                      onClick={this.updateData.bind(this)}
                    >
                      {t("componentData.clientLogo.saveBtn")}
                    </Button>
                  )}
                </Box>
              )}
            </div>
            {/* )} */}
          </Box>
        </Grid>

        {flag && (
          <AlertDialog
            title={message}
            open={flag}
            onConfirm={() => this.hideAlertMessage()}
          />
        )}
      </div>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
  }))(ClientLogo)
);
