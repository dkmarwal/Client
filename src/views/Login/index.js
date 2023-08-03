import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {  
  Grid,
  Paper,
  Box,
  Button,  
  MenuItem,  
  Modal,
  ClickAwayListener,
  MenuList,
  Grow,
  Popper
} from "@material-ui/core";

import { withStyles } from "@material-ui/styles";
import {AlertDialog } from "~/components/Dialogs";
import { login, setNewPassword, forgotPassword, fetchSupportedLanguageList } from "~/redux/actions/user";

import { updateLanguage } from "~/redux/actions/user";

import styles from "./styles";
import LoginView from "./View/";
import ForgotPassword from "./ForgotPassword/";
import PasswordExpired from "./PasswordExpired/";
import FirstLogin from "./FirstLogin/";
import { withTranslation } from 'react-i18next';
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Cookies from "universal-cookie";
import config from "~/config";

class Login extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      loginProgress: false,
      buttonDisabled: false, //commented to be true in case of recaptcha is there
      showUpdatePasswordModal: false,
      loginId: null,
      password: null,
      forgotPasswordView: this.props.forgotPasswordView,
      isVerified: !config.showCaptcha, //needs to be false in case of recaptcha is there
      error: null,
      validation: {},
      alertMessage: null,
      alertMessageCallbackType: null,
      showResetModal: false,
      langAnchorEl: null,
      anchorEl: null,
      langMenuOpen: false
    };
    this.handleRecaptcha = this.handleRecaptcha.bind(this);        
  }  

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.user.isLoggedIn) { 
      
      //.log(nextProps.user.isLoggedIn);
      if (nextProps.user.isFirstLogin) {
        
      } else {
        const cookies = new Cookies();
        const language = cookies.get("localeLang") || "en";
        if (config.willTranslate && nextProps.user.userData.locale !== language) {
          if(!nextProps.user.userData.activeBankParentProfileId){
            nextProps
            .dispatch(updateLanguage({ locale: language }))
            .then((response) => {
              if (!response) {
                return false;
              }
              nextProps.i18n.changeLanguage(language);
            });
          }          
        }
        //Calll language drop down after login
        if (config.willTranslate) {
          const { userData } = nextProps.user;
            const appType = (userData && userData?.appType) || 1;//Default to 1 in client portal
            nextProps.dispatch(fetchSupportedLanguageList({lang:nextProps?.i18n?.language, appType: appType})).then((response) => {
              if (!response) {
              }
            });
        }

        nextProps.history.push(`${config.baseName}/dashboard`);
      }
    }
    return null;
  }  

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
              cookies.set('localeLang', this.props.i18n.language);
              
              this.setState({
                langMenuOpen: false,
              });
            });
        }
      );
    } else {
      this.props.i18n.changeLanguage(langCode);
      cookies.set('localeLang', this.props.i18n.language);

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

  // onChange = (value) =>{

  //   if(value.length=== 0){
  //     this.setState({isVerified:false})
  //   }
  // }
  handleRecaptcha = (value) => {
    const recaptchaValue = value;

    if (recaptchaValue.length === 0) {
      this.setState({ isVerified: false, error: null });
    } else {
      this.setState({ isVerified: true, error: null });
    }
  };
  resetRecaptcha = () => {
    window.grecaptcha && window.grecaptcha.reset();
  };

  handleChange = (field, event, position) => {
    const { isVerified} = this.state;   

    switch (field) {
      case "Email":
        this.setState({ loginId: event.target.value,error: null });
        break;
      case "Password":
        this.setState({ password: event.target.value,error: null });
        break;
      // case "recaptchaValue":
      //   this.setState({recaptchaValue:event.target.value})

      default:
        break;
    }
  };

  hideAlertMessage = () => {
    this.props.history.push(`${config.baseName}`);
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
      forgotPasswordView: false,
    });
  };

  validateForm = () => {
    const { loginId, password, isVerified } = this.state;
    const { t } = this.props;

    let valid = true;
    const validation = {};

    if (!loginId || (loginId && loginId.trim() === "")) {
      validation["Email"] = t('componentData.Login.enterUserName');
      valid = false;
    }

    if (!password || (password && password.trim() === "")) {
      validation["Password"] = t('componentData.Login.enterPass');
      valid = false;
    }
    if (!isVerified) {
      validation["recaptchaValue"] = t('componentData.Login.selectCaptcha');
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
  };

  processLogin = (event) => {
    const {      
      loginId,
      password,
      loginProgress,
      isVerified,
    } = this.state;

    const valid = this.validateForm();
    if (!valid) {
      return false;
    }

    if (loginId && password && isVerified && !loginProgress) {
      this.setState(
        {
          loginProgress: true,
          error: null,
        },
        async () => {
          const creds = {
            userName: loginId,
            password: password,
            portalTypeId: 2,
          };

          await this.props.dispatch(login(creds, this.props.i18n.language)).then((response) => {
            if (!response) {
              const { user } = this.props;
              if (user && user["data"] && user.data["isExpired"]) {
                this.setState({ showResetModal: true });
              }
              this.setState({
                //error: this.props.user.error,
                validation: { Password: this.props.user.error || "" },
                //alertMessage: this.props.user.error,
                //alertMessageCallbackType: null,
                loginProgress: false,
              });
              this.resetRecaptcha();
              return false;
            }

            const { user } = this.props;
            if (user && user.userData && user.isFirstLogin) {
              this.setState({
                loginProgress: false,
                error: null,
                showUpdatePasswordModal: true,
              });
            }
          });
        }
      );
    }
  };

  processReset = ({ password, securityQuestionId, securityAnswer }) => {
    const resetData = {
      userName: this.props.user.userData.userName,
      password: password,
      securityQuestionId: securityQuestionId,
      securityAnswer: securityAnswer,
    };
    return this.props.dispatch(setNewPassword(resetData));
  };

  handleForgotPassword = () => {
    this.setState({ forgotPasswordView: true, validation: {}, error: null });
    this.props.history.push(`${config.baseName}/forgot-password`);
  };

  onCancel = () => {
    this.setState({ forgotPasswordView: false, validation: {}, error: null });
    this.props.history.push(`${config.baseName}/`);
  };

  processForgotPassword = () => {
    const { loginId } = this.state;
    const { t } = this.props;
    if (loginId && loginId.trim() !== "") {
      this.setState(
        {
          loginProgress: true,
          validation: {},
          error: null,
        },
        async () => {
          await this.props
            .dispatch(forgotPassword({ loginId }))
            .then((response) => {
              if (!response) {
                this.setState({
                  error: this.props.user.error,
                  loginProgress: false,
                });

                return false;
              }

              this.setState({
                loginProgress: false,
                error: null,
                alertMessage:
                t('componentData.Login.resetPassLInkTxt'),
                alertMessageCallbackType: null,
              });
            });
        }
      );
    } else {
      this.setState({
        validation: { Email: true },
      });
    }
  };

  render() {    
    const {
      loginId,
      password,
      forgotPasswordView,
      showUpdatePasswordModal,
      alertMessage,
      alertMessageCallbackType,
      buttonDisabled,
      loginProgress,
      error,
      validation,
      showResetModal,
      langAnchorEl,      
      langMenuOpen
    } = this.state;
    const { classes, user } = this.props; 

    return (
      <Fragment>           

        {showResetModal ? (
          <PasswordExpired userName={loginId} history={this.props.history} />
        ) : (
          <Grid container justify="center" className={classes.root}>
            <Grid item xs={12} md={6} lg={6} className={classes.leftWrap}>
              <Box display="flex" mt={2}></Box>
            </Grid>
            
            <Grid
              item
              xs={12}
              md={6}
              lg={6}
              className={classes.startupContainer}
              style= {{backgroundColor: "#fff"}}
            >  

              {config.willTranslate && (
                <Grid item style={{textAlign: 'end', 'position': 'absolute', 'top': "10px", 'right': "30px"}}>
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
                              placement === "bottom" ? "center top" : "center bottom",
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

              <Box
                px={5}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width={1}
              >
                {forgotPasswordView ? (
                  <ForgotPassword
                    credentials={{ Email: loginId }}
                    handleChange={this.handleChange}
                    onSubmit={this.processForgotPassword}
                    onCancel={this.onCancel}
                    updateProgress={loginProgress}
                    error={error}
                    validation={validation}
                    buttonDisabled={buttonDisabled}
                  />
                ) : (
                  <LoginView
                    credentials={{ Email: loginId, Password: password }}
                    handleChange={this.handleChange}
                    onSubmit={this.processLogin}
                    handleForgotPassword={this.handleForgotPassword}
                    handleRecaptcha={this.handleRecaptcha}
                    updateProgress={loginProgress}
                    error={error}
                    validation={validation}
                    buttonDisabled={buttonDisabled}
                  />
                )}
              </Box>
              {/* <Box>
              <Footer {...this.props} />
          </Box> */}
            </Grid>
            {alertMessage &&
              this.renderAlertMessage(
                "",
                alertMessage,
                alertMessageCallbackType
              )}
          </Grid>
        )}
        <Modal open={showUpdatePasswordModal} onClose={() => null}>
          <Paper className="update-password-modal-container">
            <Grid container justify="center">
              <Grid item sm={6} xs={12}>
                <FirstLogin
                  error={this.props.user.error}
                  processReset={this.processReset}
                />
              </Grid>
            </Grid>
          </Paper>
        </Modal>
      </Fragment>
    );
  }

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => this.hideAlertMessage()}
      />
    );
  };
}

export default withTranslation()(connect((state) => ({ ...state.user }))(
  withStyles(styles)(Login)
));
