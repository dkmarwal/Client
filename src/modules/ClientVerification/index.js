import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Paper,
  Box,
  CircularProgress,
  Typography,
  ClickAwayListener,
  Grid,
  MenuItem,
  MenuList,
  Grow,
  Popper,
} from "@material-ui/core";
import { TextField, Button } from "~/components/Forms";
import Notification from "~/components/Notification";
import { updateLanguage } from "~/redux/actions/user";
import { withStyles } from "@material-ui/core/styles";
import { verifyClient } from "~/redux/actions/client";
import config from "~/config";
import { entityType } from "~/config/entityTypes";
import { styles } from "./styles";
import { withTranslation } from "react-i18next";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Cookies from "universal-cookie";

class ClientVerification extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  state = {
    error: null,
    processing: false,
    federalTax_Id: "",
    activationCode: "",
    clientId: null,
    taxIdIsSSN: 0,
    isVerified: true, //since recaptcha is commented , needs to be false incase recaptcha is there
    validation: {},
    langAnchorEl: null,
    anchorEl: null,
    langMenuOpen: false,
  };
  componentDidMount() {
    if (this.props.user.isLoggedIn) {
      this.props.history.push(`${config.baseName}/dashboard`);
    }    
    const urlParams = new URLSearchParams(window.location.search);
    this.setState({
      clientId: urlParams.get("id"),
      taxIdIsSSN: urlParams.get("taxIdIsSSN"),
    });
  }
  handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    switch (name) {
      case "federalTax_Id":
        this.setState({
          [name]: value.replace(/[^0-9]/g, ""),
        });
        break;
      default:
        this.setState({
          [name]: value,
        });
        break;
    }
  };

  handleLangToggle = (event) => {
    this.setState({
      langMenuOpen: !this.state.langMenuOpen,
      langAnchorEl: event.currentTarget,
    });
  };

  handleLangClose = () => {
    this.setState({
      langMenuOpen: false,
      langAnchorEl: null,
    });
  };

  handleLanguageChange = (event, langCode) => {
    let cookies = new Cookies(window.document.cookie);
    const { isLoggedIn } = this.props.user;
    if (isLoggedIn) {
      this.setState(
        {
          langMenuOpen: false,
        },
        () => {
          // API call to change user selected language
          this.props
            .dispatch(updateLanguage({ locale: langCode }))
            .then((response) => {
              if (!response) {
                return false;
              }
              this.props.i18n.changeLanguage(langCode);
              cookies.set("localeLang", this.props.i18n.language);

              this.setState({
                langMenuOpen: false,
              });
            });
        }
      );
    } else {
      this.props.i18n.changeLanguage(langCode);
      cookies.set("localeLang", this.props.i18n.language);

      this.setState({
        langMenuOpen: false,
      });
    }
    window.location.reload();
  };

  handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      this.setState({
        langMenuOpen: false,
      });
    }
  };

  handleRecaptcha = (value) => {
    const recaptchaValue = this.myRef.current.getValue();
    if (recaptchaValue.length === 0) {
      this.setState({ isVerified: false });
    } else {
      this.setState({ isVerified: true });
    }
  };
  validateFields = () => {
    const { federalTax_Id, activationCode } = this.state;
    const { t } = this.props;
    let valid = true,
      errorText = {};
    if (federalTax_Id.length === 0) {
      errorText["federalTax_Id"] = t(
        "componentData.clientVarification.validField"
      );
      valid = false;
    }
    if (activationCode.length === 0) {
      errorText["activationCode"] = t(
        "componentData.clientVarification.activationCode"
      );
      valid = false;
    }
    this.setState({ validation: errorText });
    return valid;
  };
  processVerification = (e) => {
    e.preventDefault();
    const isValid = this.validateFields();
    if (this.state.isVerified && isValid) {      
      const { t } = this.props;
      const {
        processing,
        federalTax_Id,
        activationCode,
        clientId,
        taxIdIsSSN,
      } = this.state;
      if (!processing) {
        this.setState(
          {
            processing: true,
            error: null,
          },
          () => {
            const data = {
              activationCode: activationCode,
              taxId: federalTax_Id,
              taxIdIsSSN: taxIdIsSSN,
              clientId: clientId,
            };
            this.props
              .dispatch(verifyClient(data))
              .then((response) => {
                if (!response) {
                  throw this.props.client.error;
                }
                const urlParams = new URLSearchParams(window.location.search);
                sessionStorage.setItem(
                  "appType",
                  this.props.client.appType || entityType.B2B
                );
                this.props.history.push(
                  `${config.baseName}/onboard/profile?id=${urlParams.get("id")}`
                );
              })
              .catch((error) => {                
                this.setState({
                  processing: false,
                  error:
                    typeof error === "string"
                      ? error
                      : t(
                          "componentData.clientVarification.AnUnknownErrorOccured"
                        ),
                });
              });
          }
        );
      }
    }
  };
  render() {
    const { t } = this.props;
    const { classes } = this.props;
    const {
      processing,
      error,
      federalTax_Id,
      taxIdIsSSN,
      activationCode,
      validation,
      langAnchorEl,      
      langMenuOpen,
    } = this.state;
    const { user } = this.props;
    return (
      <Box
        className={classes.verificationBoxContainer}        
      >
        {config.willTranslate && (
          <Grid
            item
            style={{
              textAlign: "end",
              position: "absolute",
              right: "30px",
              top: "0",
            }}
          >
            <Box className={classes.rightNavContainer}>
              <Box p={1} className={classes.rightNavIconContainer}>
                <Button
                  ref={langAnchorEl}
                  aria-controls={langMenuOpen ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  variant="text"
                  onClick={this.handleLangToggle}
                >
                  {this.props.i18n.language &&
                    this.props.i18n.language.toUpperCase()}
                  <ArrowDropDownIcon />
                </Button>
                <Popper
                  open={langMenuOpen}
                  anchorEl={langAnchorEl}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={this.handleLangClose}>
                          <MenuList
                            autoFocusItem={langMenuOpen}
                            id="menu-list-grow"
                            onKeyDown={this.handleListKeyDown}
                          >
                            {user.slList &&
                              user.slList.map((lang, index) => (
                                <MenuItem
                                  key={`${lang}-${index}`}
                                  value={lang.code}
                                  onClick={(event) =>
                                    this.handleLanguageChange(event, lang.code)
                                  }
                                >
                                  {`${
                                    lang.description
                                  } (${lang.code.toUpperCase()})`}
                                </MenuItem>
                              ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Box>
            </Box>
          </Grid>
        )}
        <Paper className={classes.verificationBox}>
          <Box className={classes.verificationBoxHeader}>
            <Typography variant="h5">
              {t("componentData.clientVarification.ClientVerification")}
            </Typography>
          </Box>
          <Box className={classes.verificationBoxContent}>
            <form
              noValidate
              onSubmit={this.processVerification}
              className={classes.loginForm}
            >
              <TextField
                fullWidth
                required
                color="secondary"
                autoComplete="off"
                name="activationCode"
                value={activationCode}
                label={t("componentData.clientVarification.ActivationCode")}
                variant="outlined"
                margin="normal"
                onChange={this.handleInputChange}
                helperText={validation.activationCode}
                error={
                  validation.activationCode &&
                  validation.activationCode.length > 0
                }
              />
              <TextField
                fullWidth
                required
                color="secondary"
                autoComplete="off"
                name="federalTax_Id"
                value={federalTax_Id}
                label={
                  taxIdIsSSN == 1
                    ? t("componentData.clientVarification.SocialSecurityNumber")
                    : taxIdIsSSN == 2 ? t("componentData.clientVarification.identificationNumber")
                    :t("componentData.clientVarification.FederalTaxID")
                }
                variant="outlined"
                margin="normal"
                onChange={this.handleInputChange}
                helperText={validation.federalTax_Id}
                error={
                  validation.federalTax_Id &&
                  validation.federalTax_Id.length > 0
                }
                inputProps={{
                  maxLength: 9,
                }}
              />
              
              <Box className={classes.buttonContainer}>
                {processing ? (
                  <CircularProgress color="primary" />
                ) : (
                  <Button
                    type="submit"
                    fullWidth={false}
                    variant="contained"
                    color={this.state.isVerified ? "primary" : ""}
                    disabled={this.state.isVerified ? false : true}
                  >
                    {t("componentData.clientVarification.Verify")}
                  </Button>
                )}
              </Box>
            </form>
          </Box>
        </Paper>
        {error && <Notification variant="error" message={error} handleClose={() => { this.setState({ error: false }) }} />}
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.client }))(
    withStyles(styles)(ClientVerification)
  )
);
