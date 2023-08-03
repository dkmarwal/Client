import React from "react";
import {
  Grid,
  Card,
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem
} from "@material-ui/core";
import { connect } from "react-redux";
import "./styles.scss";
import { fetchSecurityQuestions } from "../../redux/helpers/user";
import { AlertDialog } from "../../components/Dialogs";
import { updateUserInfo } from "../../redux/actions/user";
import CountryPhoneCode from "../../components/Forms/CountryPhoneCode";
import { withTranslation } from "react-i18next";
import trim from 'deep-trim-node';

class Profile extends React.Component {
  state = {
    errors: {},
    userData: {},
    questions: [],
    flag: false,
    message: "",
    btnLoader: false,
    loader: false,
  };

  componentDidMount() {
    this.getDetails();
    this.getSecurityQuestions();
  }

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: true });
  }

  hideAlertMessage() {
    this.setState({ message: "", flag: false });
  }

  getSecurityQuestions() {
    fetchSecurityQuestions().then((response) => {
      if (response.error) {
        this.setDialogMessage(true, response.message);
      }
      this.setState({ questions: response.data });
    });
  }

  // getSecurityQuestion() {
  //     getSecurityQuestions
  // }

  validateForm() {
    const { userData } = this.state;
    const { t } = this.props;
    const errors = {};
    const { isSSO } = this.props.user.userData;
    let valid = true;
    const userNameValidation =
      !userData ||
      !userData["userName"] ||
      userData["userName"].toString().trim().length === 0;
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      !userData ||
      !userData["title"] ||
      userData["title"].toString().trim().length === 0
    ) {
      errors["title"] = t("componentData.profileComp.titleReq");
      valid = false;
    }
    if (
      !userData ||
      !userData["firstName"] ||
      userData["firstName"].toString().trim().length === 0
    ) {
      errors["firstName"] = t("componentData.profileComp.fnReq");
      valid = false;
    }

    if (userNameValidation && !isSSO) {
      errors["userName"] = t("componentData.profileComp.UsernameReq");
      valid = false;
    }
    if (
      !userData ||
      !userData["phone"] ||
      userData["phone"].toString().trim().length === 0
    ) {
      errors["phone"] = t("componentData.profileComp.PhoneReq");
      valid = false;
    }

    if (
      userData &&
      userData["phone"] &&
      userData["phone"].toString().trim().length != 10
    ) {
      errors["phone"] = "Phone number must be of 10 digits.";
      valid = false;
    }

    if (
      !userData ||
      !userData["phoneCountryCode"] ||
      userData["phoneCountryCode"].toString().trim().length === 0
    ) {
      errors["phoneCountryCode"] = t("componentData.profileComp.CountryReq");
      valid = false;
    }
    if (
      !userData ||
      !userData["lastName"] ||
      userData["lastName"].toString().trim().length === 0
    ) {
      errors["lastName"] = t("componentData.profileComp.lnReq");
      valid = false;
    }
    if (
      !userData ||
      !userData["email"] ||
      userData["email"].toString().trim().length === 0
    ) {
      errors["email"] = t("componentData.profileComp.emailReq");
      valid = false;
    }
    if (
      userData &&
      userData["email"] &&
      userData["email"].toString().trim().length &&
      !re.test(String(userData["email"]).toLowerCase())
    ) {
      errors["email"] = t("componentData.profileComp.enterEmail");
      valid = false;
    }
    if (
      (!userData ||
        !userData["securityAnswer"] ||
        userData["securityAnswer"].toString().trim().length === 0) &&
      !isSSO
    ) {
      errors["securityAnswer"] = t("componentData.profileComp.securityAnsReq");
      valid = false;
    }
    if (
      userData &&
      userData["securityAnswer"] &&
      userData["securityAnswer"].toString().trim().length < 6 &&
      !isSSO
    ) {
      errors["securityAnswer"] = t("componentData.profileComp.securityAnsMinL");
      valid = false;
    }
    if (
      (!userData ||
        !userData["securityQuestionId"] ||
        userData["securityQuestionId"].toString().trim().length === 0) &&
      !isSSO
    ) {
      errors["securityQuestionId"] = t(
        "componentData.profileComp.SecurityQuesReq"
      );
      valid = false;
    }
    //console.log(errors)
    this.setState({ errors: errors });
    return valid;
  }

  saveDetails() {
    if (this.validateForm()) {
      const { userId, isSSO } = this.props.user.userData;
      let payload = {
        userId: userId,
        ...this.state.userData,
      };
      delete payload["displayName"];
      delete payload["appType"]; 
      delete payload["payerTypeId"];

      if (isSSO) {
        delete payload["userName"];
      }
      this.setState({ btnLoader: true }, () => {
        this.props.updateUserProfileDetails(payload= trim(payload)).then((response) => {
          //dispatch the action for updating user data in redux store.
          let { userData } = this.props.user;
          const userData_ = this.state.userData;
          const { firstName, lastName } = userData_;
          userData = trim(userData_);
          // userData["firstName"] = firstName;
          // userData["lastName"] = lastName;
          // userData["displayName"] = `${firstName} ${lastName}`;
          userData_["displayName"] = `${firstName} ${lastName}`;

          this.props.dispatch(updateUserInfo(userData));
          this.setDialogMessage(true, response.message);
          this.setState({ ...this.state, btnLoader: false });
        });
      });
    }
  }

  handleInputChange(e) {
    let obj = {};
    let fieldName = e.target.name;
    obj[fieldName] = e.target.value;
    this.setState({ userData: { ...this.state.userData, ...obj } });
  }

  getDetails() {
    const { getUserProfileDetails } = this.props;
    const { userId } = this.props.user.userData;
    this.setState({ loader: true }, () => {
      getUserProfileDetails(userId).then((response) => {
        if (response.error) {
          this.setDialogMessage(true, response.message);
        }
        this.setState({ userData: response.data, loader: false });
      });
    });
  }

  render() {
    const { isSSO } = this.props.user.userData;
    const { t } = this.props;
    const {
      flag,
      message,
      questions,
      userData,
      btnLoader,
      errors,
      loader,
    } = this.state;
    return (
      <Box mx={6} my={1}>
        <Card>
          <Box px={6} py={3}>
            <Grid item sm={12} xs={12}>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid item sm={6} xs={6}>
                  {loader ? (
                    <Box display="flex" justifyContent="center">
                      <CircularProgress color="primary" />
                    </Box>
                  ) : (
                    <Grid>
                      {/* <Box my={4}>
                    <Grid>
                        <span className="profilePhotoContainer">
                            <img />
                            <span>Upload Profile Image</span>
                        </span> */}
                      {/* <span className="">

                    </span> */}
                      {/* </Grid>
                </Box> */}

                      {/* <Box my={4}>
    <Grid>
      <div className="profileInfo">
        <span className="name">
          {userData && `${userData.displayName}`}
        </span>
        <span className="designation">
                                system administrator
                        </span>
      </div>
    </Grid>
  </Box> */}

                      <Box my={4}>
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={this.props.i18n.language === "fr" ? 3 : 2}
                          >
                            <input
                              type="email"
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
                              select
                              fullWidth={true}
                              error={errors.title && errors.title.length > 0}
                              helperText={errors.title}
                              // onBlur={() => this.validateData()}
                              autoComplete="off"
                              // value={transactionType}
                              name="title"
                              value={userData.title}
                              label={t("componentData.profileComp.Prefix")}
                              placeholder=""
                              onChange={(e) => this.handleInputChange(e)}
                              variant="outlined"
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 100,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              className={""}
                            >
                              <MenuItem id={"Mr"} value={"Mr"} key={"Mr"}>
                                {t('componentData.roleEditView.mr')}
                              </MenuItem>
                              <MenuItem id={"Ms"} value={"Ms"} key={"Ms"}>
                                {t('componentData.roleEditView.ms')}
                              </MenuItem>
                              <MenuItem id={"Mrs"} value={"Mrs"} key={"Mrs"}>
                                {t('componentData.roleEditView.mrs')}
                              </MenuItem>
                            </TextField>
                          </Grid>

                          <Grid
                            item
                            xs={this.props.i18n.language === "fr" ? true : 5}
                          >
                            <TextField
                              fullWidth={true}
                              error={
                                errors.firstName && errors.firstName.length > 0
                              }
                              helperText={errors.firstName}
                              // onBlur={() => this.validateData()}
                              autoComplete="off"
                              // value={transactionType}
                              name="firstName"
                              value={userData.firstName}
                              label={t("componentData.profileComp.FirstName")}
                              placeholder=""
                              onChange={(e) => this.handleInputChange(e)}
                              variant="outlined"
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 20,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              className={""}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={this.props.i18n.language === "fr" ? true : 5}
                          >
                            <TextField
                              fullWidth={true}
                              error={
                                errors.lastName && errors.lastName.length > 0
                              }
                              helperText={errors.lastName}
                              // onBlur={() => this.validateData()}
                              autoComplete="off"
                              // value={transactionType}
                              name="lastName"
                              value={userData.lastName}
                              label={t("componentData.profileComp.LastName")}
                              placeholder=""
                              onChange={(e) => this.handleInputChange(e)}
                              variant="outlined"
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 20,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              className={""}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      <Box my={3}>
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={this.props.i18n.language === "fr" ? 3 : 2}
                          >
                            <CountryPhoneCode
                              fullWidth={true}
                              error={
                                errors.phoneCountryCode &&
                                errors.phoneCountryCode.length > 0
                              }
                              helperText={errors.phoneCountryCode}
                              // onBlur={() => this.validateData()}
                              autoComplete="off"
                              // value={transactionType}
                              name="phoneCountryCode"
                              value={`${userData.phoneCountryCode}`}
                              label={t("componentData.profileComp.Country")}
                              placeholder=""
                              onChange={(e) => this.handleInputChange(e)}
                              type={"select"}
                              excludeCountryCode={["CA", "UM"]}
                              variant="outlined"
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 4,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              className={""}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={this.props.i18n.language === "fr" ? true : 6}
                          >
                            <TextField
                              fullWidth={true}
                              error={errors.phone && errors.phone.length > 0}
                              helperText={errors.phone}
                              // onBlur={() => this.validateData()}
                              autoComplete="off"
                              // value={transactionType}
                              name="phone"
                              value={userData.phone}
                              label={t("componentData.profileComp.PhoneNumber")}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  userData: {
                                    ...this.state.userData,
                                    phone: e.target.value.replace(
                                      /[^0-9]/g,
                                      ""
                                    ),
                                  },
                                })
                              }
                              variant="outlined"
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 10,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              className={""}
                            />
                          </Grid>

                          <Grid
                            item
                            xs={this.props.i18n.language === "fr" ? true : 4}
                          >
                            <TextField
                              fullWidth={true}
                              // error={validation.transactionType && validation.transactionType.length > 0}
                              // helperText={validation.transactionType}
                              // onBlur={() => this.validateData()}
                              autoComplete="off"
                              value={userData.phoneExt}
                              name="phoneExt"
                              label={t("componentData.profileComp.Extension")}
                              placeholder=""
                              onChange={(e) => this.handleInputChange(e)}
                              variant="outlined"
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 100,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              className={""}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      <Box my={4}>
                        <Grid xs={12} sm={12}>
                          <TextField
                            fullWidth={true}
                            // error={validation.transactionType && validation.transactionType.length > 0}
                            // helperText={validation.transactionType}
                            // onBlur={() => this.validateData()}
                            autoComplete="off"
                            disabled={isSSO}
                            value={
                              isSSO ? userData.SSOUserId : userData.userName
                            }
                            name={isSSO ? "SSOUserId" : "userName"}
                            label={
                              isSSO
                                ? t("componentData.profileComp.SSOUserID")
                                : t("componentData.profileComp.UserName")
                            }
                            placeholder=""
                            onChange={(e) => this.handleInputChange(e)}
                            variant="outlined"
                            dir="horizontal"
                            size="small"
                            inputProps={{
                              maxLength: 100,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            className={""}
                            error={
                              errors.userName && errors.userName.length > 0
                            }
                            helperText={errors.userName}
                          />
                        </Grid>
                      </Box>

                      <Box my={4}>
                        <Grid xs={12} sm={12}>
                          <TextField
                            fullWidth={true}
                            error={errors.email && errors.email.length > 0}
                            helperText={errors.email}
                            // onBlur={() => this.validateData()}
                            autoComplete="off"
                            value={userData.email}
                            name="email"
                            label={t("componentData.profileComp.Email")}
                            placeholder=""
                            onChange={(e) => this.handleInputChange(e)}
                            variant="outlined"
                            dir="horizontal"
                            size="small"
                            inputProps={{
                              maxLength: 50,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            className={""}
                          />
                        </Grid>
                      </Box>

                      {!isSSO && (
                        <Box my={4}>
                          <Grid xs={12} sm={12}>
                            <TextField
                              select
                              fullWidth={true}
                              error={
                                errors.securityQuestionId &&
                                errors.securityQuestionId.length > 0
                              }
                              helperText={errors.securityQuestionId}
                              // onBlur={() => this.validateData()}
                              autoComplete="off"
                              value={
                                userData.securityQuestionId
                                  ? Number(userData.securityQuestionId)
                                  : ""
                              }
                              name="securityQuestionId"
                              label={t(
                                "componentData.profileComp.SecurityQuestion"
                              )}
                              placeholder=""
                              onChange={(e) =>
                                this.setState({
                                  userData: {
                                    ...this.state.userData,
                                    securityQuestionId: e.target.value,
                                    securityAnswer: "",
                                  },
                                })
                              }
                              variant="outlined"
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 100,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              className={""}
                            >
                              {questions &&
                                questions.map((q) => (
                                  <MenuItem
                                    id={q.questionId}
                                    value={q.questionId}
                                    key={q.questionId}
                                  >
                                    {q.question}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Grid>
                        </Box>
                      )}

                      {!isSSO && (
                        <Box my={4}>
                          <Grid xs={12} sm={12}>
                            <TextField
                              fullWidth={true}
                              error={
                                errors.securityAnswer &&
                                errors.securityAnswer.length > 0
                              }
                              helperText={errors.securityAnswer}
                              // onBlur={() => this.validateData()}
                              autoComplete="off"
                              value={userData.securityAnswer}
                              name="securityAnswer"
                              label={t(
                                "componentData.profileComp.SecurityAnswer"
                              )}
                              placeholder=""
                              onChange={(e) => this.handleInputChange(e)}
                              variant="outlined"
                              dir="horizontal"
                              size="small"
                              type="password"
                              inputProps={{
                                maxLength: 100,
                              }}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              className={""}
                            />
                          </Grid>
                        </Box>
                      )}

                      <Grid justify="center">
                        <Box mt={10} mb={3}>
                          <div
                            style={{
                              justify: "center",
                              margin: "0 auto",
                              display: "table",
                            }}
                          >
                            {/* <Box px={5}>
          <Button
            variant="contained"
            style={{
              display: "inline-block",
              float: "left",
              padding: "6px 10px",
              width: "120px",
              margin: "0px 10px 0 0",
              background: theme.palette.secondary.contrastText,
              color: theme.palette.button.primary,
            }}
            color=""
          // onClick={onCancel}
          >
            Cancel
          </Button>
        </Box> */}

                            <Box px={2}>
                              {btnLoader ? (
                                <CircularProgress color="primary" />
                              ) : (
                                <Button
                                  disableElevation
                                  variant="contained"
                                  style={{
                                    display: "inline-block",
                                    padding: "6px 10px",
                                    width: "140px",
                                    margin: "0px 0px 0 0",
                                  }}
                                  color="primary"
                                  onClick={this.saveDetails.bind(this)}
                                >
                                  {t("componentData.profileComp.Save")}
                                </Button>
                              )}
                            </Box>
                          </div>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Grid item sm={6} xs={6}></Grid>
              </Box>
            </Grid>
          </Box>
        </Card>

        {flag && (
          <AlertDialog
            title={message}
            open={flag}
            onConfirm={() => this.hideAlertMessage()}
          />
        )}
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
  }))(Profile)
);
