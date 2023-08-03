import React from "react";
import {
  Grid,
  Card,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";
import "./styles.scss";
import { updateUserPassword } from "../../redux/helpers/user";
import { AlertDialog } from "../../components/Dialogs";
import { withTranslation } from "react-i18next";

class Password extends React.Component {
  state = {
    password: "",
    oldPassword: "",
    confirmNewPassword: "",
    userData: {},
    questions: [],
    flag: false,
    message: "",
    btnLoader: false,
    validation: {},
  };

  componentDidMount() {
    //this.getDetails();
  }

  isFormValid() {
    const { password, oldPassword, confirmNewPassword } = this.state;
    const { t } = this.props;
    const errorText = {};
    let valid = true;
    const regex = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
    );
    if (!oldPassword || oldPassword.toString().trim().length == 0) {
      valid = false;
      errorText["oldPassword"] = t("componentData.passwordComp.oldPassReq");
    }
    if (!password || password.toString().trim().length == 0) {
      valid = false;
      errorText["password"] = t("componentData.passwordComp.passReq");
    }
    if (
      !confirmNewPassword ||
      confirmNewPassword.toString().trim().length == 0
    ) {
      valid = false;
      errorText["confirmNewPassword"] = t("componentData.passwordComp.confirmPassReq");
    }
    if (password != confirmNewPassword) {
      valid = false;
      errorText["confirmNewPassword"] = t(
        "componentData.passwordComp.passNotMatch"
      );
    }
    if (password != confirmNewPassword) {
      valid = false;
      errorText["confirmNewPassword"] = t(
        "componentData.passwordComp.passNotMatch"
      );
    }
    if (
      password &&
      password.toString().trim().length > 0 &&
      !regex.test(password)
    ) {
      valid = false;
      errorText["password"] = t("componentData.passwordComp.passMsg");
    }
    if (
      oldPassword &&
      oldPassword.toString().trim().length > 0 &&
      !regex.test(oldPassword)
    ) {
      valid = false;
      errorText["oldPassword"] = t("componentData.passwordComp.passMsg");
    }

    this.setState({
      validation: { ...errorText },
    });

    return valid;
  }  

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: true });
  }

  hideAlertMessage() {
    this.setState({ message: "", flag: false });
  }  

  saveDetails() {
    if (this.isFormValid()) {
      const { password, oldPassword } = this.state;
      let payload = {
        password: password,
        oldPassword: oldPassword,
      };
      this.setState({ btnLoader: true }, () => {
        updateUserPassword(payload).then((response) => {
          this.setDialogMessage(true, response.message);
          this.setState({ btnLoader: false });
        });
      });
    }
  }

  handleInputChange(e) {
    const obj = {};
    const fieldName = e.target.name;
    obj[fieldName] = e.target.value;
    this.setState(obj);
  }

  render() {
    const {
      flag,
      message,
      btnLoader,
      oldPassword,
      password,
      confirmNewPassword,
      validation,
    } = this.state;
    const { t } = this.props;
    return (
      <Box mx={6} my={1} className="passwordContainer">
        <Card>
          <Box px={4} py={2}>
            <Grid item sm={12} xs={12}>
              <Box my={4}>
                <Grid xs={6} sm={6}>
                  <TextField
                    fullWidth={true}
                    id="outlined-password-input"
                    label={t("componentData.passwordComp.OldPassword")}
                    type="password"
                    autoComplete="off"
                    value={oldPassword}
                    name="oldPassword"
                    placeholder={t(
                      "componentData.passwordComp.EnterOldPassword"
                    )}
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
                      validation.oldPassword &&
                      validation.oldPassword.length > 0
                    }
                    helperText={validation.oldPassword}
                  />
                </Grid>
              </Box>

              <Box my={4}>
                <Grid xs={6} sm={6}>
                  <TextField
                    fullWidth={true}
                    id="outlined-password-input"
                    type="password"
                    autoComplete="off"
                    value={password}
                    name="password"
                    label={t("componentData.passwordComp.NewPassword")}
                    placeholder={t(
                      "componentData.passwordComp.EnterNewPassword"
                    )}
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
                      validation.password && validation.password.length > 0
                    }
                    helperText={validation.password}
                  />
                </Grid>
              </Box>

              <Box my={4}>
                <Grid xs={6} sm={6}>
                  <TextField
                    id="outlined-password-input"
                    type="password"
                    fullWidth={true}
                    autoComplete="off"
                    value={confirmNewPassword}
                    name="confirmNewPassword"
                    label={t("componentData.passwordComp.ConfirmNewPassword")}
                    placeholder={t(
                      "componentData.passwordComp.ConfirmNewPassword"
                    )}
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
                      validation.confirmNewPassword &&
                      validation.confirmNewPassword.length > 0
                    }
                    helperText={validation.confirmNewPassword}
                    required
                  >
                  </TextField>
                </Grid>
              </Box>

              <Grid justify="center">
                <Box my={5}>
                  <Grid xs={6} sm={6}>
                    <div
                      style={{
                        justify: "center",
                        margin: "0 auto",
                        display: "table",
                      }}
                    >
                      <Box px={2}>
                        {btnLoader ? (
                          <CircularProgress color="primary" />
                        ) : (
                          <Button
                            variant="contained"
                            style={{
                              display: "inline-block",
                              padding: "6px 10px",
                              width: "140px",
                              margin: "0px 0 0 0",
                            }}
                            color="primary"
                            onClick={this.saveDetails.bind(this)}
                          >
                            {t("componentData.passwordComp.Save")}
                          </Button>
                        )}
                      </Box>
                    </div>
                  </Grid>
                </Box>
              </Grid>
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
  }))(Password)
);
