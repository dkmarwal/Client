import React, { useRef } from "react";
import {
  Grid,
  TextField,  
  Box,
  makeStyles,
  Link,
  Typography,
  Button  
} from "@material-ui/core";
import ReCAPTCHA from "react-google-recaptcha";
import { connect } from "react-redux";
import config from "~/config";
import { withTranslation } from "react-i18next";
import {PortalLogo, PortalBankLabel} from '~/components/PortalDetails'

const useStyle = makeStyles({
  paper: {
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  heading: {
    paddingTop: 0,
    color: "#0c2074",
    fontSize: 26,
    fontWeight: 400,
  },
  logoImg: {
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: "20px",
    borderRight: "1px solid #ddd",
    //paddingRight: "20px",

    // borderRight: "1px solid #ddd",
  },
  logoLabel: {
    display: "flex",
    justifyContent: "flex-start",
    paddingLeft: "20px",
    alignItems: "center",
    fontSize: "16px",
  },
  textField: {
    marginTop: "22px",
  },
  blueBtn: {
    textTransform: "uppercase",
    fontWeight: 600,
    fontSize: 14,
    padding: "10px 50px",
    color: "#FFFFFF",
  },
  forgotLink: {
    color: "#008CE6",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: "underline !important",
    cursor: "pointer",
  },
});

const LoginView = (props) => {
  const {
    validation,
    credentials,
    handleChange,
    handleRecaptcha,
    onSubmit,
    handleForgotPassword,    
    error,   
    buttonDisabled,
  } = props;

  const { t } = props;
  const classes = useStyle();
  const capRef = useRef(null);
  const handleSave = (event) => {
    if (event.keyCode === 13) {
      onSubmit();
    }
  };
  let isSSO = sessionStorage.getItem("isSSO");

  return (
    <>
      <Grid item xs md lg={8}>
        <div className={classes.paper}>
          <Box
            display="flex"
            justifyContent="center"
            width={1}
            className={classes.clientLogo}
          >
            <Grid container justify="center">
              <Grid item xs={6} className={classes.logoImg}>
                <PortalLogo t={t}/>
              </Grid>

              {<Grid item xs={6} className={classes.logoLabel}>
                 <Box
                  fontFamily="Roboto"
                  color="rgba(0,0,0,0.74)"
                  fontWeight={600}
                  fontSize={16}
                >
                  <PortalBankLabel t={t}/>
                </Box> 
              </Grid>
              }
            </Grid>
          </Box>

          <Box
            color="primary.main"
            textAlign="center"
            fontSize={24}
            fontWeight={500}
            pt={4}
          >
            {t("componentData.Login.payerLogin")}
          </Box>

          {isSSO === true || isSSO === "true" ? (
            <Box>{t("componentData.Login.logoutMsg")} </Box>
          ) : (
            <Box p={2} width={1}>
              <TextField
                error={validation.Email}
                helperText={validation.Email}
                fullWidth={true}
                autoComplete="off"
                autoFocus={true}
                value={(credentials && credentials.Email) || ""}
                name="Email"
                onChange={(event) => handleChange("Email", event)}
                // onKeyUp={()=>resetRecaptcha()}
                dir="horizontal"
                size="medium"
                variant="outlined"
                inputProps={{
                  maxLength: 100,
                }}
                className={classes.textField}
                label={t("componentData.Login.UsernameLabel")}
              />

              <TextField
                error={validation.Password}
                helperText={validation.Password}
                fullWidth={true}
                autoComplete="off"
                value={(credentials && credentials.Password) || ""}
                name="Password"
                onChange={(event) => handleChange("Password", event)}
                onKeyDown={(event) => handleSave(event)}
                // onKeyUp={()=>resetRecaptcha()}
                dir="horizontal"
                size="medium"
                type="password"
                variant="outlined"
                inputProps={{
                  maxLength: 100,
                }}
                className={classes.textField}
                label={t("componentData.Login.PasswordLabel")}
              />

              <Box p={1}>
                {config.showCaptcha && (
                  <ReCAPTCHA
                    ref={capRef}
                    sitekey="6Ld6MKYZAAAAALnTmc5dxhHMr5FWc4IEVTAGZLa6"
                    // verifyCallback={(value)=>handleRecaptcha(value)}
                    onChange={handleRecaptcha}
                    // style={{ marginTop: "20px", width: "100%" }}
                  />
                )}
              </Box>
              {validation && validation.recaptchaValue && (
                <span
                  style={{
                    color: "red",
                    fontFamily: "inherit",
                    paddingLeft: "16px",
                    fontWeight: "inherit",
                  }}
                >
                  {validation && validation.recaptchaValue}
                </span>
              )}
              <Box
                display="flex"
                justifyContent="flex-start"
                mt={1}
                mb={3}
                fontWeight={500}
                color="secondary.main"
              >
                <Link
                  className={classes.forgotLink}
                  underline="always"
                  onClick={() => handleForgotPassword()}
                >
                  {t("componentData.Login.ForgotPassword")}
                </Link>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="error">
                  {error}
                </Typography>
              </Box>
              <Box
                mt={4}
                display="flex"
                justifyContent="center"
                color="text.primary"
              >
                <Button
                  variant="contained"
                  color="primary"
                  disableElevation
                  className={classes.blueBtn}
                  onClick={() => onSubmit()}
                  size="medium"
                  disabled={buttonDisabled}
                >
                  {t("componentData.Login.SignInBtn")}
                </Button>
              </Box>
            </Box>
          )}
        </div>
      </Grid>
    </>
  );
};

export default withTranslation() (
  connect((state) => ({ ...state.user }))((LoginView))
)
