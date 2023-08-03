import React from "react";
import { connect } from "react-redux";
import { AlertDialog } from "~/components/Dialogs";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { Grid, Box, Card, Button, CircularProgress } from "@material-ui/core";
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
    message: "",
    flag: false,
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

  handleChange(val) {
    this.setState({ html: val });
  }

  updateData() {
    if (this.validateForm()) {
      const { loginWelcomeMsg, logo } = this.state;
      const payload = {
        logo: logo,
        loginWelcomeMsg: loginWelcomeMsg,
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
        logo: response.data && response.data.logo,
        loginWelcomeMsg: response.data && response.data.loginWelcomeMsg,
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
    const { logo, loginWelcomeMsg } = this.state;
    const error = {};
    let valid = true;
    const { t } = this.props;

    if (!logo || logo.toString().trim().length === 0) {
      error["logo"] = t("componentData.clientLogo.logoEmptyMsg");
      valid = false;
    }
    // if (logo && logo.toString().trim()) {
    //   error["logo"] = "Logo can not be empty.";
    //   valid = false;
    // }
    if (!loginWelcomeMsg || loginWelcomeMsg.toString().trim().length === 0) {
      error["loginWelcomeMsg"] = t("componentData.clientLogo.welcomeEmptyMsg");
      valid = false;
    }

    this.setState({ error: error });
    return valid;
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
    } = this.state;    

    const { user } = this.props;
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
                  <Box className={"errorMessage"} ml={5}>{error["logo"]}</Box>
                )}
              </Grid>
              <Box py={5} px={5}>
                <div>{t("componentData.clientLogo.editWelcMsg")}</div>
                <textarea
                  disabled={!isBrandingSupplierSiteViewEnabled}
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
                  <div className={"errorMessage"}>
                    {error["loginWelcomeMsg"]}
                  </div>
                )}
                <div>{`${(loginWelcomeMsg && loginWelcomeMsg.length) || 0
                  } Chars`}</div>
                <Box my={5}>{t("componentData.clientLogo.noteTxt")}</Box>
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
