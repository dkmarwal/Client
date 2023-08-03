import React, { Component } from "react";
import styles from "./styles";

import Footer from "../Footer";
import Header from "../Header";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/styles";
import logoDummy from "~/assets/images/logoDummy.png";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Grid,
  Button,
} from "@material-ui/core";
import clsx from "clsx";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
class LoginScreen extends Component {
  render() {
    const {
      isMobileView,
      customTheme,
      theme,
      logo,
      classes,
      t,
      isPoweredBy,
      phoneNo,
      ext,
      countryCode,
      isPhoneEnable,
      welcomeMessage,
      isPayeeChoicePortal,
      clientEmail,
      isShowEmail,
      clientName
    } = this.props;
    return (
      <>
        <Box className={classes.mainContainer}>
          <Header isMobileView={isMobileView} logo={logo} isPayeeChoicePortal={isPayeeChoicePortal} clientName={clientName} />

          <Box
            style={{ background: customTheme.accentColor || "" }}
            className={clsx(classes.subContainer, {
              [classes.subContainerMobile]: isMobileView === true,
            })}
          >
            <Box
              className={clsx(classes.loginBg, {
                [classes.loginBgMobile]: isMobileView === true,
              })}
            >
              {isMobileView ? (
                <>
                  {" "}
                  <Grid container>
                    <Grid item xs={12} className={classes.loginSection}>
                      <Box>
                        <img
                          src={logo ? logo : logoDummy}
                          alt="logo"
                          style={{
                            maxWidth: "100%",
                            width: "60px",
                            maxHeight: "60px",
                            height: "auto",
                            marginBottom: 8,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        gutterBottom  
                        style={{color: '#4c4c4c', textAlign: "center", wordBreak: "break-word"}}
                      >
                        {welcomeMessage}
                      </Typography>
                      <Box pt={1.5} pb={1.2}>
                        <Typography
                          variant="h2"
                          style={{
                            color: "#0B1941",
                          }}
                        >
                          {t("componentData.UserLoginScreen.payeeLogin")}
                        </Typography>
                      </Box>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12}>
                          <TextField
                            label={t(
                              "componentData.UserLoginScreen.loginUsername"
                            )}
                            placeholder={t(
                              "componentData.UserLoginScreen.loginUsername"
                            )}
                            variant="outlined"
                            size="small"
                            fullWidth
                            disabled
                          />
                          <Typography color="secondary" variant="h6">
                            {t("componentData.UserLoginScreen.forgotUsername")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label={t(
                              "componentData.UserLoginScreen.loginPassword"
                            )}
                            disabled
                            variant="outlined"
                            placeholder={t(
                              "componentData.UserLoginScreen.loginPassword"
                            )}
                            size="small"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <VisibilityOff fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <Typography color="secondary" variant="h6">
                            {t("componentData.UserLoginScreen.forgotPassword")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" justifyContent="center">
                            <Button
                              variant="contained"
                              size="small"
                              disableElevation
                              disabled
                              style={{
                                borderRadius: "50px",
                                padding: "4px 16px",
                                background: customTheme.primaryColor,
                                color: theme.palette.getContrastText(
                                  customTheme.primaryColor
                                    ? customTheme.primaryColor
                                    : "#FFFFFF"
                                ),
                              }}
                            >
                              {t("componentData.UserLoginScreen.buttonSign")}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid container>
                    <Grid style={{marginLeft:"80px"}} item xs={3} sm="4" md="7" lg="6" xl="3" className={classes.loginSection}>
                      <Box>
                        <img
                          src={logo ? logo : logoDummy}
                          alt="logo"
                          style={{
                            maxWidth: "100%",
                            width: "60px",
                            maxHeight: "60px",
                            height: "auto",
                            marginBottom: 8,
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        gutterBottom
                        style={{color: '#4c4c4c', textAlign: "center", wordBreak: "break-word"}} 
                      >
                        {welcomeMessage}
                      </Typography>
                      <Box pt={1.5} pb={1.2}>
                        <Typography
                          variant="h2"
                          style={{
                            color: "#0B1941",
                          }}
                        >
                          {t("componentData.UserLoginScreen.payeeLogin")}
                        </Typography>
                      </Box>
                      <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12}>
                          <TextField
                            label={t(
                              "componentData.UserLoginScreen.loginUsername"
                            )}
                            placeholder={t(
                              "componentData.UserLoginScreen.loginUsername"
                            )}
                            variant="outlined"
                            size="small"
                            fullWidth
                            disabled
                          />
                          <Typography color="secondary" variant="h6">
                            {t("componentData.UserLoginScreen.forgotUsername")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label={t(
                              "componentData.UserLoginScreen.loginPassword"
                            )}
                            disabled
                            variant="outlined"
                            placeholder={t(
                              "componentData.UserLoginScreen.loginPassword"
                            )}
                            size="small"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <VisibilityOff fontSize="small" />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <Typography color="secondary" variant="h6">
                            {t("componentData.UserLoginScreen.forgotPassword")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" justifyContent="center">
                            <Button
                              variant="contained"
                              size="small"
                              disableElevation
                              disabled
                              style={{
                                borderRadius: "50px",
                                padding: "4px 16px",
                                background: customTheme.primaryColor,
                                color: theme.palette.getContrastText(
                                  customTheme.primaryColor
                                    ? customTheme.primaryColor
                                    : "#FFFFFF"
                                ),
                              }}
                            >
                              {t("componentData.UserLoginScreen.buttonSign")}
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={7}></Grid>
                  </Grid>{" "}
                </>
              )}
            </Box>
          </Box>
          {/* footer section */}
          <Footer
            isMobileView={isMobileView}
            isPoweredBy={isPoweredBy}
            phoneNo={phoneNo}
            ext={ext}
            countryCode={countryCode}
            isPhoneEnable={isPhoneEnable}
            isPayeeChoicePortal={isPayeeChoicePortal}
            clientEmail={clientEmail}
            isShowEmail={isShowEmail}
            logo={logo}
            clientName={clientName}
          />
        </Box>
      </>
    );
  }
}
export default withTranslation()(
  withStyles(styles, { withTheme: true })(LoginScreen)
);
