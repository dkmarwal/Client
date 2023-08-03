import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography, MenuItem } from "@material-ui/core";
import { TextField, CheckboxGroup } from "~/components/Forms";
import CountryPhoneCode from "~/components/Forms/CountryPhoneCode";
import { styles } from "./styles";
import { withTranslation } from "react-i18next";

class UserDetails extends Component {
  render() {
    const {
      classes,
      signOnType,
      onSignOnChange,
      checkUserInput,
      userInfoObj,
      userValidation,
      onUserBlurValidate,
      t,
    } = this.props;

    const tooltipObj = {
      title: t("componentData.firstLogin.passTypeTxt"),
      arrow: true,
      placement: "top-end",
    };

    return (
      <Box className={classes.contentBackground}>
        <Grid container spacing={4}>
          <Grid item xs={6} sm={6}>
            <Grid container spacing={3}>
              <Grid item xs={2} sm={2}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="prefix"
                  select
                  label={t("componentData.userDetails.Prefix")}
                  value={userInfoObj.prefix.value}
                  onChange={checkUserInput}
                >
                  <MenuItem key="Male" value="Mr">
                    Mr
                  </MenuItem>
                  <MenuItem key="Female" value="Ms">
                    Ms
                  </MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={5} sm={5}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="f_name"
                  label={t("componentData.userDetails.fName")}
                  value={userInfoObj.f_name.value}
                  error={
                    userValidation.f_name && userValidation.f_name.length > 0
                  }
                  helperText={userValidation.f_name}
                  inputProps={{ maxLength: 50 }}
                  onChange={checkUserInput}
                  onBlur={onUserBlurValidate}
                  required
                />
              </Grid>
              <Grid item xs={5} sm={5}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="l_name"
                  label={t("componentData.userDetails.lName")}
                  value={userInfoObj.l_name.value}
                  error={
                    userValidation.l_name && userValidation.l_name.length > 0
                  }
                  helperText={userValidation.l_name}
                  inputProps={{ maxLength: 50 }}
                  onChange={checkUserInput}
                  onBlur={onUserBlurValidate}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={3} sm={3}>
                <CountryPhoneCode
                  select
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="phoneCountryCode"
                  id="country_code"
                  label={t("componentData.userDetails.Country")}
                  value={userInfoObj.phoneCountryCode.value}
                  error={
                    userValidation.phoneCountryCode &&
                    userValidation.phoneCountryCode.length > 0
                  }
                  helperText={userValidation.phoneCountryCode}
                  onChange={checkUserInput}
                  onBlur={onUserBlurValidate}
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
                  name="user_phone"
                  id="user_phone"
                  label={t("componentData.userDetails.PhoneNumber")}
                  value={userInfoObj.user_phone.value}
                  error={
                    userValidation.user_phone &&
                    userValidation.user_phone.length > 0
                  }
                  helperText={userValidation.user_phone}
                  onChange={checkUserInput}
                  onBlur={onUserBlurValidate}
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
                  name="user_ext"
                  id="user_ext"
                  label={t("componentData.userDetails.Extension")}
                  value={userInfoObj.user_ext.value}
                  error={
                    userValidation.user_ext &&
                    userValidation.user_ext.length > 0
                  }
                  helperText={userValidation.user_ext}
                  onChange={checkUserInput}
                  onBlur={onUserBlurValidate}
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={6}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="user_email"
                  label={t("componentData.userDetails.Email")}
                  value={userInfoObj.user_email.value}
                  error={
                    userValidation.user_email &&
                    userValidation.user_email.length > 0
                  }
                  helperText={userValidation.user_email}
                  onChange={checkUserInput}
                  onBlur={onUserBlurValidate}
                  required
                  inputProps={{
                    maxLength: 50,
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Typography variant="h4" className={classes.primaryDark}>
              {t("componentData.userDetails.SignupAs")}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6}>
            <CheckboxGroup
              options={[
                {
                  label: t("componentData.userDetails.SSOID"),
                  value: "SSO",
                },
                {
                  label: t("componentData.userDetails.StandAloneUser"),
                  value: "StandAlone",
                },
              ]}
              onChange={onSignOnChange}
              selectedOption={"SSO"}
            />
          </Grid>
          <Grid item xs={6} sm={6}></Grid>

          {signOnType === "StandAlone" && (
            <>
              <Grid item xs={6} sm={6}>
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
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="user_name"
                  label={t("componentData.userDetails.UserName")}
                  type="text"
                  value={userInfoObj.user_name.value}
                  error={
                    userValidation.user_name &&
                    userValidation.user_name.length > 0
                  }
                  helperText={userValidation.user_name}
                  inputProps={{ maxLength: 50 }}
                  onChange={checkUserInput}
                  onBlur={onUserBlurValidate}
                  required
                />
              </Grid>
              <Grid item xs={6} sm={6}>
                <Grid container spacing={4}>
                  <Grid item xs={6} sm={6}>
                    <TextField
                      fullWidth={true}
                      type="password"
                      color="secondary"
                      autoComplete="off"
                      variant="outlined"
                      name="user_pass"
                      label={t("componentData.userDetails.Password")}
                      value={userInfoObj.user_pass.value || ""}
                      error={
                        userValidation.user_pass &&
                        userValidation.user_pass.length > 0
                      }
                      tooltipProps={tooltipObj}
                      helperText={userValidation.user_pass}
                      onChange={checkUserInput}
                      onBlur={onUserBlurValidate}
                      inputProps={{ maxLength: 100 }}
                      required
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <TextField
                      fullWidth={true}
                      type="password"
                      color="secondary"
                      autoComplete="off"
                      variant="outlined"
                      name="confirm_pass"
                      label={t("componentData.userDetails.ConfirmPassword")}
                      value={userInfoObj.confirm_pass.value}
                      onChange={checkUserInput}
                      onBlur={onUserBlurValidate}
                      inputProps={{ maxLength: 100 }}
                      error={
                        userValidation.confirm_pass &&
                        userValidation.confirm_pass.length > 0
                      }
                      helperText={userValidation.confirm_pass}
                      required
                    />
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

          {signOnType === "SSO" && (
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                variant="outlined"
                name="standaloneOrSSONumber"
                id="standaloneOrSSO_number"
                label={t("componentData.userDetails.SSO_ID")}
                value={userInfoObj.standaloneOrSSONumber.value}
                error={
                  userValidation.standaloneOrSSONumber &&
                  userValidation.standaloneOrSSONumber.length > 0
                }
                helperText={userValidation.standaloneOrSSONumber}
                onChange={checkUserInput}
                onBlur={onUserBlurValidate}
                inputProps={{ maxLength: 20 }}
                required
              />
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }
}

export default withTranslation()(withStyles(styles)(UserDetails));
