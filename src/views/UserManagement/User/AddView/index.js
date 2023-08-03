import React from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  Grid,
  Box,
  Paper,
  Button,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
} from "@material-ui/core";

import TextField from "~/components/Forms/TextField";
import { TabPanel } from "~/components/TabPanel/index";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { withStyles } from "@material-ui/styles";
import Phone from "~/components/TextBox/Phone";
import PublishIcon from "@material-ui/icons/Publish";
import Notification from "~/components/Notification";
import { AlertDialog } from "~/components/Dialogs";
import {
  createUser,
  updateUserDetails,
  fetchSecurityQuestions,
} from "~/redux/actions/user";
import { fetchRoles } from "~/redux/actions/role";
import NotificationSetting from "~/modules/NotificationSetting";
import config from "~/config";
import styles from "./styles";
import trim from "deep-trim-node";

class UserAdd extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      user: {
        ...state,
        newPassword: (state && state.password) || null,
        isSSO: config.ssoEnabled,//Enabled sso based on environment
      },
      validation: {},
      roleList: [], //System Role list
      //roles: state && state.RoleID.split(',').map(Number) || [], //assigned user roles
      roles: (state && state.roles) || [], //assigned user roles
      securityQuestionList: [],
      updateProgress: false,
      alertType: "success",
      alertMessage: null,
      alertMessageCallbackType: null,
      isLoading: true,
      saveNotificationSetup: false,
      userIdCreatUpdate: null,
    };
  }

  componentDidMount = async () => {
    await this.fetchRoleList();
    this.fetchSQList();
  };

  fetchRoleList = () => {
    this.props
      .dispatch(
        fetchRoles()
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertMessage: this.props.role.error,
            alertType: "error",
            alertMessageCallbackType: null,
            isLoading: false,
          });
          return false;
        }
        this.setState({
          isLoading: false,
          roleList: this.props.role.list,
        });
      });
  };

  fetchSQList = () => {
    this.props.dispatch(fetchSecurityQuestions()).then((response) => {
      if (!response) {
        this.setState({
          alertMessage: this.props.user.error,
          alertType: "error",
          alertMessageCallbackType: null,
          isLoading: false,
        });
        return false;
      }
      this.setState({
        isLoading: false,
        securityQuestionList: this.props.user.securityQuestionList,
      });
    });
  };

  validateForm = () => {
    const { user } = this.state;
    const { t } = this.props;

    let valid = true;
    let validation = {};
    if (!user || !user.title || user.title.trim() === "") {
      validation["title"] = t("componentData.roleAddView.PrefixRequired");
      valid = false;
    }
    if (!user || !user.firstName || user.firstName.trim() === "") {
      validation["firstName"] = t("componentData.roleAddView.fNameReq");
      valid = false;
    }
    if (!user || !user.lastName || user.lastName.trim() === "") {
      validation["lastName"] = t("componentData.roleAddView.lNameReq");
      valid = false;
    }
    if (
      !user ||
      !user.phone ||
      user.phone.toString().trim() === "" ||
      user.phone.toString().trim().length !== 10
    ) {
      validation["phone"] = t("componentData.roleAddView.phoneLen");
      valid = false;
    }
    if (!user || !user.email || user.email.trim() === "") {
      validation["email"] = t("componentData.roleAddView.emailReq");
      valid = false;
    }
    if (user && user.email && user.email.trim().length > 0) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(user.email.trim().toLowerCase())) {
        validation["email"] = t("componentData.roleAddView.InvalidEmail");
        valid = false;
      }
    }
    //if(!user || !user.userName || user.userName.trim()=== ''){
    //  validation["userName"] = true;
    //valid=false;
    //}
    /*if(!user || !user.roleId || user.roleId.length== 0){
            validation["roleId"] = "Please select atleast one role";
            valid=false;
        }
        if(!user || !user.securityQuestionId || user.securityQuestionId === 0){
            validation["securityQuestionId"] = true;
            valid=false;
        }
        if(!user || !user.securityAnswer || user.securityAnswer.trim()=== ''){
            validation["securityAnswer"] = true;
            valid=false;
        }*/

    if (!user || !user.isSSO || user.isSSO == false) {
      if (!user || !user.userName || user.userName.trim() === "") {
        validation["userName"] = t(
          "componentData.roleAddView.userNameRequired"
        );
        valid = false;
      }
      /*if(!user || !user.securityQuestionId || user.securityQuestionId === 0){
                validation["securityQuestionId"] = true;
                valid=false;
            }
            if(!user || !user.securityAnswer || user.securityAnswer.trim()=== ''){
                validation["securityAnswer"] = true;
                valid=false;
            }*/

      if (
        !user ||
        !user.password ||
        !user.newPassword ||
        user.newPassword.trim() != user.password.trim()
      ) {
        if (
          !user ||
          !user.newPassword ||
          (user.newPassword && user.newPassword.trim() === "")
        ) {
          validation["password"] = t("componentData.roleAddView.passLenMsg");
          valid = false;
        }
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
        if (user.newPassword && !re.test(user.newPassword.trim())) {
          validation["password"] = t("componentData.roleAddView.passLenMsg");
          valid = false;
        }
        if (
          !user ||
          !user.confirmPassword ||
          user.confirmPassword.trim() === ""
        ) {
          validation["confirmPassword"] = t(
            "componentData.roleAddView.confirmPassword"
          );
          valid = false;
        }
        if (user && user.newPassword != user.confirmPassword) {
          validation["confirmPassword"] = t(
            "componentData.roleAddView.passSameTxt"
          );
          valid = false;
        }
      }
    } else {
      if (!user || !user.SSOUserId || user.SSOUserId.trim() === "") {
        validation["SSOUserId"] = t("componentData.roleAddView.validSSOID");
        valid = false;
      }
      if (user && user.SSOUserId && user.SSOUserId.trim().length > 0) {
        const re = /^[0-9a-zA-Z]+$/; //Alphanumeric check expression
        if (!re.test(user.SSOUserId.trim())) {
          validation["SSOUserId"] = t("componentData.roleAddView.validSSOID");
          valid = false;
        }
      }
    }

    this.setState({ validation: { ...validation } });

    return valid;
  };

  handleChangeISO = (event, value) => {
    const { user } = this.state;
    const newUserDetail = { ...user };
    if (value == 1) {
      newUserDetail["isSSO"] = true;
    } else {
      newUserDetail["isSSO"] = false;
    }
    this.setState({ user: { ...newUserDetail } });
  };

  handleChange = (field, event, value, position) => {
    const { user } = this.state;
    const newUserDetail = { ...user };
    const fieldName = event.target.name;

    switch (field) {
      case "roleId":
        const { value: options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
          //if (options[i].selected) {
          value.push(options[i]);
          //}
        }
        //newUserDetail[fieldName] = value.join();
        newUserDetail[fieldName] = value;
        this.setState({ roles: value });

        break;
      case "phone":
        const phoneValue = event.target.value;
        newUserDetail["phoneCountryCode"] = phoneValue.ccode;
        newUserDetail["phone"] = phoneValue.phone;
        newUserDetail["phoneExt"] = phoneValue.ext;
        break;
      case "SSOUserId":
        const SSOUserId = event.target.value;
        newUserDetail["SSOUserId"] = SSOUserId.replace(/[^a-zA-Z0-9]/g, "");
        break;
      default:
        newUserDetail[fieldName] = event.target.value;
        break;
    }

    this.setState({ user: { ...newUserDetail } });
  };

  handleSubmit = () => {
    let { user } = this.state;
    const valid = this.validateForm();
    if (!valid) {
      return false;
    }
    // Trimming payload data for user
    user = trim(user);
    this.setState(
      {
        updateProgress: true,
      },
      () => {
        const { userData } = this.props.user;
        const { t } = this.props;
        if (user && user.userId) {
          this.props
            .dispatch(
              updateUserDetails({
                portalProfileId: userData.portalProfileId,
                portalTypeId: userData.portalTypeId,
                user,
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertMessageCallbackType: null,
                  alertType: "error",
                  updateProgress: false,
                });
                return false;
              }
              this.setState({
                userIdCreatUpdate: user.userId,
                saveNotificationSetup: true,
                updateProgress: false,
                alertMessage: t("componentData.roleAddView.userInfoUpdated"),
                alertMessageCallbackType: "REDIRECT",
                alertType: "success",
              });
              //this.props.history.push(`${config.baseName}/manage/user`);
            });
        } else {
          this.props
            .dispatch(
              createUser({
                portalProfileId: userData.portalProfileId,
                portalTypeId: userData.portalTypeId,
                user,
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertMessageCallbackType: null,
                  alertType: "error",
                  updateProgress: false,
                });
                return false;
              }
              this.setState({
                userIdCreatUpdate: response.userId || "",
                saveNotificationSetup: true,
                updateProgress: false,
                alertMessage: t("componentData.roleAddView.userAddedd"),
                alertMessageCallbackType: "REDIRECT",
                alertType: "success",
              });
              //this.props.history.push(`${config.baseName}/manage/user`);
            });
        }
      }
    );
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
    this.props.history.push(`${config.baseName}/manage/user`);
  };

  handleCancel = () => {
    this.props.history.push(`${config.baseName}/manage/user`);
  };

  render() {
    const { t } = this.props;
    const {
      userIdCreatUpdate,
      saveNotificationSetup,
      validation,
      user,
      updateProgress,
      securityQuestionList,
      roles,
      alertType,
      alertMessage,
      alertMessageCallbackType,
    } = this.state;
    const { classes } = this.props;
    const { pathname } = this.props.location;
    const isAddUserScreen = pathname.includes("add");
    const title = isAddUserScreen
      ? t("componentData.roleAddView.AddUser")
      : t("componentData.roleAddView.EditUser");

    const tooltipObj = {
        title: t("componentData.firstLogin.passTypeTxt"),
        arrow: true,
        placement: "top-end",
    }
    return (
      <Grid container justify="center" className={classes.root}>
        <Grid item container xs={12}>
          <Paper className={classes.paper} square>
            <Grid container>
              <Grid
                item
                xs={this.props.i18n.language === "fr" ? 7 : 6}
                sm={this.props.i18n.language === "fr" ? 7 : 6}
                className={classes.gridItem}
              >
                <Grid item xs={12} sm={12} container justify="flex-start">
                  <Grid item xs={3} sm={3}>
                    <Box mr={1} mb={1}>
                      <TextField
                        error={validation && validation.title}
                        helperText={validation && validation.title}
                        fullWidth={true}
                        select
                        autoComplete="off"
                        variant="outlined"
                        name="title"
                        label={t("componentData.roleAddView.Prefix")}
                        value={(user && user.title) || ""}
                        onChange={(event) => this.handleChange("title", event)}
                      >
                        <MenuItem value=" ">
                          <em>{t("componentData.roleAddView.Select")}</em>
                        </MenuItem>
                        <MenuItem value="Mr">{t('componentData.roleEditView.mr')}</MenuItem>
                        <MenuItem value="Mrs">{t('componentData.roleEditView.mrs')}</MenuItem>
                        <MenuItem value="Ms">{t('componentData.roleEditView.ms')}</MenuItem>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item xs={5} sm={5}>
                    <Box mr={1} mb={1}>
                      <input
                        type="text"
                        name="userName"
                        style={{ display: "none" }}
                      />
                      <input
                        type="password"
                        name="password"
                        autocomplete="new-password"
                        style={{ display: "none" }}
                      />
                      <TextField
                        required
                        label={t("componentData.roleAddView.FirstName")}
                        error={validation.firstName}
                        helperText={validation.firstName}
                        fullWidth={true}
                        autoComplete="off"
                        autoFocus={false}
                        inputProps={{
                          maxLength: 20,
                        }}
                        variant="outlined"
                        value={(user && user.firstName) || ""}
                        name="firstName"
                        onChange={(event) =>
                          this.handleChange("firstName", event)
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <Box mb={1}>
                      <TextField
                        required
                        label={t("componentData.roleAddView.LastName")}
                        error={validation.lastName}
                        helperText={validation.lastName}
                        fullWidth={true}
                        autoComplete="off"
                        autoFocus={false}
                        variant="outlined"
                        value={(user && user.lastName) || ""}
                        name="lastName"
                        onChange={(event) =>
                          this.handleChange("lastName", event)
                        }
                        inputProps={{
                          maxLength: 20,
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={12} className={classes.gridItem}>
                    <Box>
                      <Phone
                        required
                        error={validation.phone}
                        helperText={validation.phone}
                        id="phone"
                        name="phone"
                        ext={(user && user.phoneExt) || ""}
                        value={(user && user.phone) || ""}
                        ccode={(user && user.phoneCountryCode) || ""}
                        prefixCcode="+1"
                        fullWidth={true}
                        variant="outlined"
                        onChange={(event) => this.handleChange("phone", event)}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={12} className={classes.gridItem}>
                    <Box mb={1.5}>
                      <TextField
                        required
                        label={t("componentData.roleAddView.Email")}
                        error={validation.email}
                        helperText={validation.email}
                        fullWidth={true}
                        autoFocus={false}
                        autoComplete="off"
                        variant="outlined"
                        value={(user && user.email) || ""}
                        name="email"
                        onChange={(event) => this.handleChange("email", event)}
                        inputProps={{
                            maxLength: 50,
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} sm={12} className={classes.gridItem}>
                {" "}
              </Grid> */}

                  <Grid item xs={12} sm={12} className={classes.gridItem}>
                    <Box
                      display="flex"
                      border={1}
                      borderRadius={4}
                      borderColor="#cccccc"
                      width="100%"
                    >
                      <Tabs
                        value={user && user.isSSO ? 1 : 0}
                        onChange={(event, value) => {
                            //Disable clicking if sso is not enabled in environment
                            if(!config.ssoEnabled) {
                                return false;
                            }
                          this.handleChangeISO(event, value);
                        }}
                        variant="fullWidth"
                        className={classes.tabClass}
                        indicatorColor="none"
                      >
                        <Tab
                          key="tab-0"
                          label={
                            <span className={classes.checkedIcon}>
                              <span>
                                {t("componentData.roleAddView.SetupUserName")}
                              </span>
                              {user && !user.isSSO && (
                                <CheckCircleIcon
                                  fontSize="small"
                                  className={classes.checkClass}
                                />
                              )}
                            </span>
                          }
                          disabled={user && user.isSSO}
                          style={{ minHeight: "20px", height: "35px" }}
                          classes={classes}
                        />
                        <Tab
                          key="tab-1"
                          label={
                            <span className={classes.checkedIcon}>
                              <span style={{ marginRight: "8px" }}>
                                {t("componentData.roleAddView.SingleSignOn")}
                              </span>
                              {user && user.isSSO && (
                                <CheckCircleIcon
                                  fontSize="small"
                                  className={classes.checkClass}
                                />
                              )}
                            </span>
                          }
                          disabled={user && !user.isSSO}
                          style={{ minHeight: "20px", height: "35px" }}
                          classes={classes}
                        />
                      </Tabs>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <TabPanel value={user && user.isSSO ? 1 : 0} index={1}>
                      <Grid
                        item
                        container
                        direction="row"
                        xs={12}
                        sm={12}
                        className={classes.gridItem}
                      >
                        <Box mx={1} pt={1} pl={1}>
                          <TextField
                            required
                            label={t("componentData.roleAddView.SSOId")}
                            error={validation.SSOUserId}
                            helperText={validation.SSOUserId}
                            disabled={user && user.isSSO ? false : true}
                            inputProps={{
                              maxLength: 20,
                            }}
                            fullWidth={true}
                            autoComplete="off"
                            autoFocus={false}
                            variant="outlined"
                            value={(user && user.SSOUserId) || ""}
                            name="SSOUserId"
                            onChange={(event) =>
                              this.handleChange("SSOUserId", event)
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={6} className={classes.gridItem}>
                        {" "}
                      </Grid>
                    </TabPanel>
                  </Grid>

                  <Grid item xs={12}>
                    <TabPanel value={user && user.isSSO ? 1 : 0} index={0}>
                      <Grid
                        item
                        container
                        direction="row"
                        xs={12}
                        sm={12}
                        className={classes.gridItem}
                      >
                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                          <Box>
                            <TextField
                              required
                              label={t("componentData.roleAddView.UserName")}
                              error={validation.userName}
                              helperText={validation.userName}
                              fullWidth={true}
                              autoFocus={false}
                              autoComplete="off"
                              variant="outlined"
                              value={(user && user.userName) || ""}
                              name="userName"
                              onChange={(event) =>
                                this.handleChange("userName", event)
                              }
                              inputProps={{
                                maxLength: 50,
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          sm={6}
                          className={classes.gridItem}
                        ></Grid>
                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                          <Box>
                            <TextField
                              required
                              label={t("componentData.roleAddView.Password")}
                              error={validation.password}
                              fullWidth={true}
                              autoFocus={false}
                              autoComplete="off"
                              onPaste={(e) => e.preventDefault()}
                              onCopy={(e) => e.preventDefault()}
                              onDrag={(e) => e.preventDefault()}
                              onDrop={(e) => e.preventDefault()}
                              variant="outlined"
                              value={(user && user.newPassword) || ""}
                              name="newPassword"
                              type="password"
                              tooltipProps={tooltipObj}
                              onChange={(event) =>
                                this.handleChange("newPassword", event)
                              }
                            />
                            <Typography variant="caption" color="error">
                              <Box pl={2}>{validation.password}</Box>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                          <Box>
                            <TextField
                              required
                              label={t(
                                "componentData.roleAddView.ConfirmPassword"
                              )}
                              error={validation.confirmPassword}
                              helperText={validation.confirmPassword}
                              fullWidth={true}
                              autoComplete="off"
                              autoFocus={false}
                              onPaste={(e) => e.preventDefault()}
                              onCopy={(e) => e.preventDefault()}
                              onDrag={(e) => e.preventDefault()}
                              onDrop={(e) => e.preventDefault()}
                              variant="outlined"
                              value={(user && user.confirmPassword) || ""}
                              name="confirmPassword"
                              type="password"
                              onChange={(event) =>
                                this.handleChange("confirmPassword", event)
                              }
                            />
                          </Box>
                        </Grid>
                        {1 == 0 && (
                          <>
                            <Grid
                              item
                              xs={6}
                              sm={6}
                              className={classes.gridItem}
                            >
                              <Box>
                                <TextField
                                  label={t(
                                    "componentData.roleAddView.SecurityQuestion"
                                  )}
                                  type="password"
                                  required
                                  error={validation.securityQuestionId}
                                  helperText={validation.securityQuestionId}
                                  disabled={user && user.isSSO ? true : false}
                                  fullWidth={true}
                                  select
                                  value={
                                    (user && user.securityQuestionId) || ""
                                  }
                                  autoComplete="off"
                                  autoFocus={false}
                                  variant="outlined"
                                  name="securityQuestionId"
                                  onChange={(event) =>
                                    this.handleChange(
                                      "securityQuestionId",
                                      event
                                    )
                                  }
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
                            </Grid>
                            <Grid
                              item
                              xs={6}
                              sm={6}
                              className={classes.gridItem}
                            >
                              <Box mx={1} pt={1}>
                                <TextField
                                  label={t(
                                    "componentData.roleAddView.SecurityAnswer"
                                  )}
                                  required
                                  error={validation.securityAnswer}
                                  helperText={validation.securityAnswer}
                                  disabled={user && user.isSSO ? true : false}
                                  fullWidth={true}
                                  autoComplete="off"
                                  autoFocus={false}
                                  variant="outlined"
                                  value={(user && user.securityAnswer) || ""}
                                  name="securityAnswer"
                                  onChange={(event) =>
                                    this.handleChange("securityAnswer", event)
                                  }
                                />
                              </Box>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </TabPanel>
                  </Grid>
                </Grid>
              </Grid>

              {/*<Grid item xs={6} sm={6} className={classes.gridItem}>
                              <Box pl={2} width="100%" pt={1}>
                                <input
                                    accept="image/*"
                                    className={classes.input}
                                    id="userPhoto"
                                    type="file"
                                />
                                  <label htmlFor="userPhoto">
                                    <Button variant="outlined" color="primary" 
                                        component="span"
                                        className={classes.uploadBtn}
                                        startIcon={<PublishIcon />}
                                        >
                                        Upload a user profile photo
                                    </Button>
                                  </label>
                              </Box>
                            </Grid>*/}

              <Grid item xs={12} className={classes.gridItem}>
                <Box pb={3}>
                  <NotificationSetting
                    userId={userIdCreatUpdate}
                    submit={saveNotificationSetup}
                    controlled={true}
                  />
                </Box>
              </Grid>
              <Grid
                item
                container
                xs={12}
                sm={12}
                className={classes.gridItem}
                justify="center"
              >
                <Box display="flex" my={3} justifyContent="space-between">
                  {updateProgress ? (
                    <CircularProgress color="primary" />
                  ) : (<>
                    <Button
                        variant="outlined"
                        style={{
                          fontSize: 14,
                          color: "#0B1941",
                        }}
                        color="primary"
                        onClick={() => this.handleCancel()}
                      >
                        {t("componentData.roleAddView.CancelBtn")}
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disableElevation
                      style={{ marginLeft: "32px", fontSize: 14, color: "#fff" }}
                      onClick={() => this.handleSubmit()}
                    >
                      {t("componentData.roleAddView.CreateUser")}
                    </Button>
                  </>)}
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} className={classes.gridItem}>
                {" "}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </Grid>
    );
  }

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
      />
    );
  };

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
  connect((state) => ({ ...state.user, ...state.role }))(
    withStyles(styles)(UserAdd)
  )
);
