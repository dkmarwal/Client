import React, { Fragment, Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Paper,
  Box,  
  Typography,
  Button,
  MenuItem,  
  CircularProgress,
  ClickAwayListener,
  MenuList,
  Grow,
  Popper,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styles from "./../styles";
import {
  resetExpiredPassword,
  fetchSecurityQuestions,
  updateLanguage,
} from "~/redux/actions/user";

import Footer from "~/components/Footer";
import TextField from "~/components/Forms/TextField";
import config from "~/config";
import { fetchSecurityQuestion } from "~/redux/helpers/user";
import Cookies from "universal-cookie";
import { withTranslation } from "react-i18next";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {PortalLogo, PortalBankLabel} from '~/components/PortalDetails'

class PasswordExpired extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSecurityQuestion: 0,
	  selectedQuestion: "",
      progress: false,
      buttonDisabled: true,
      confirmPassword: null,
      password: null,
      securityQuestionId: null,
      securityAnswer: null,
      securityQuestionList: null,
      error: null,
      validation: {},
      oldPassword: null,
      variant: "",
      modalMessage: "",
      langAnchorEl: null,
      anchorEl: null,
      langMenuOpen: false,
    };
  }

  componentDidMount = async() => {
	await this.getSecurityQuestion();
	this.fetchSQList();
  };

  getSecurityQuestion = () => {
    // let search = window.location.search;
    // let params = new URLSearchParams(search);
    const { userName } = this.props;
    fetchSecurityQuestion(userName, 2).then((res) => {
      this.setState({
        selectedSecurityQuestion:
          res && res.data && res.data.securityQuestionId,
      });
    });
  };

  fetchSQList = () => {
    this.props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        this.setState({
          error: this.props.user.error,
          alertMessageCallbackType: null,
          isLoading: false,
        });
        return false;
      }

      const selectedQuestionobj = this.props.user.securityQuestionList.find((item) => item.questionId === this.state.selectedSecurityQuestion);
      this.setState({
        isLoading: false,
        securityQuestionList: this.props.user.securityQuestionList,
	     	selectedQuestion: typeof (selectedQuestionobj) !== "undefined" ? selectedQuestionobj["question"] : ""
      });
    });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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

  validateInput = () => {
    const {
      password,
      confirmPassword,      
      securityAnswer     
    } = this.state;
    let valid = true;
    let validation = {};
    const { t } = this.props;

    //const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!password || !re.test(password.trim())) {
      validation["password"] = t("componentData.firstLogin.passLimitTxt");
      valid = false;
    }
    
    if (
      !confirmPassword ||
      confirmPassword !== password ||
      confirmPassword.length === 0
    ) {
      validation["confirmPassword"] = t(
        "componentData.firstLogin.passNotMatched"
      );
      valid = false;
    }

    
    if (!securityAnswer || securityAnswer.length === 0) {
      validation["securityAnswer"] = t(
        "componentData.passExpired.securityAnsReq"
      );
      valid = false;
    }
    if (
      !securityAnswer ||
      (securityAnswer.length > 0 && securityAnswer.length < 6)
    ) {
      validation["securityAnswer"] = t(
        "componentData.firstLogin.securityLenTxt"
      );
      valid = false;
    }
    this.setState({ validation: { ...validation } });
    return valid;
  };

  getQueryVar = (key) => {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) === key) {
        return decodeURIComponent(pair[1]);
      }
    }
  };
  onSubmit = async () => {
    const isValid = this.validateInput();
    if (isValid) {
      this.setState(
        {
          progress: true,
        },
        async () => {
          const {
            password,            
            selectedSecurityQuestion,
            securityAnswer,
            oldPassword,
          } = this.state;
          //const token = this.getQueryVar("resetCode");
          const { userName } = this.props;

          this.props
            .dispatch(
              resetExpiredPassword({
                userName,
                oldPassword,
                updatedPassword: password,
                securityQuestionId: selectedSecurityQuestion,
                securityAnswer,
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  error: this.props.user.error,
                  progress: false,
                  variant: "error",
                  modalMessage: this.props.user.error,
                });
                return false;
              }
              this.setState({
                progress: false,
                buttonDisabled: true,
                error: null,
                variant: "success",
                modalMessage: this.props.user.error,
              });
              this.props.history.push(`${config.baseName}/`);
            });
        }
      );
    }
  };

  render() {
    const { t, user } = this.props;
    const {
      securityQuestionList,
      oldPassword,
      password,
      confirmPassword,      
      securityAnswer,      
      error,
      validation,
      selectedSecurityQuestion,      
      langAnchorEl,      
      langMenuOpen,
	  selectedQuestion
    } = this.state;
    const { classes } = this.props;
    const tooltipObj = {
      title: t("componentData.firstLogin.passTypeTxt"),
      arrow: true,
      placement: "top-end",
    };
    
    return (
      <Fragment>
        {config.willTranslate && (
          <Grid
            item
            style={{
              textAlign: "end",
              position: "absolute",
              top: "10px",
              right: "30px",
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

        <Grid container justify="center" className={classes.root}>
          <Grid item xs={12} md={6} lg={6} className={classes.leftWrap}>
            <Box display="flex" mt={2}></Box>
          </Grid>
          <Grid item xs={12} md={6} lg={6} className={classes.startupContainer}>
            <Box m={2}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                className={classes.clientLogo}
              >
                <Grid item xs={6} md={6} lg={6} className={classes.logoImg}>
                  <PortalLogo t={t}/>
                </Grid>
                { <Grid item xs={6} md={6} lg={6} className={classes.logoLabel}><PortalBankLabel t={t}/> </Grid> }
              </Box>
              <Box display="flex" pt={3} justifyContent="center">
                <Typography variant="body1" className={classes.heading}>
                  {t("componentData.forgotPassword.resetPassBtn")}
                </Typography>
              </Box>
              <Box p={2}>
                <Box p={1}>
                  <TextField
                    required
                    name="oldPassword"
                    id="oldPassword"
                    placeholder={t("componentData.passExpired.oldPassTxt")}
                    type="password"
                    value={oldPassword}
                    onChange={this.handleChange}
                    inputProps={{ minLength: 8 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    tooltipProps={tooltipObj}
                  />
                </Box>
                
                <Box p={1}>
                  <TextField
                    required
                    error={validation && validation.password}
                    helperText={validation && validation.password}
                    name="password"
                    id="password"
                    placeholder={t("componentData.passExpired.newPassTxt")}
                    type="password"
                    value={password}
                    onChange={this.handleChange}
                    inputProps={{ minLength: 8 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
                <Box p={1}>
                  <TextField
                    required
                    error={validation && validation.confirmPassword}
                    helperText={validation && validation.confirmPassword}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder={t("componentData.passExpired.confirmNewPass")}
                    type="password"
                    value={confirmPassword}
                    onChange={this.handleChange}
                    inputProps={{ minLength: 8 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Box>
                <Box p={1}>
                  <TextField
                    disabled={true}
                    label={t("componentData.firstLogin.securityQueTxt")}
                    required
                    error={validation && validation.securityQuestionId}
                    helperText={validation && validation.securityQuestionId}
				          	title={selectedQuestion || ""}
                    fullWidth={true}
                    select
                    value={selectedSecurityQuestion}
                    autoComplete="off"
                    variant="outlined"
                    name="securityQuestionId"
                    onChange={this.handleChange}
                  >
                    {securityQuestionList ? (
                      securityQuestionList.map((option) => (
                        <MenuItem
                          key={option.questionId}
                          value={option.questionId}
                        >
                          {option.question}
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
                <Box p={1}>
                  <TextField
                    required
                    error={validation && validation.securityAnswer}
                    helperText={validation && validation.securityAnswer}
                    name="securityAnswer"
                    id="securityAnswer"
                    label={t("componentData.firstLogin.securityAnsTxt")}
                    type="password"
                    variant="outlined"
                    value={securityAnswer}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{ minLength: 6 }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1" color="error">
                    {error}
                  </Typography>
                </Box>
                <Box mt={4} justifyContent="center" display="flex">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.onSubmit()}
                    size="smaill"
                  >
                    {t("componentData.passExpired.saveBtnTxt")}
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box>
              <Footer {...this.props} />
            </Box>
          </Grid>
        </Grid>        
      </Fragment>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user }))(withStyles(styles)(PasswordExpired))
);
