import React from "react";

import {
  Grid,
  TextField, 
  Box,
  makeStyles, 
  Typography,
  Button  
} from "@material-ui/core";
import { connect } from "react-redux";
import {PortalLogo, PortalBankLabel} from '~/components/PortalDetails'

import { withTranslation } from "react-i18next";

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
    fontWeight: 700,
    fontSize: "14px",
    padding: "10px 50px",
  },
  cancelBtn: {
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "14px",
    padding: "10px 50px",
  },
});

const ForgotPassword = (props) => {
  const {
    credentials,
    handleChange,
    onSubmit,
    onCancel,    
    error,
    validation    
  } = props;
  const classes = useStyle();
  const { t } = props;
  return (
    <>
      <Grid item xs md lg="8">
        <div className={classes.paper}>
          <Box
            display="flex"
            justifyContent="center"
            width={1}
            className={classes.clientLogo}
          >
            <Grid item xs={6} md={6} lg={6} className={classes.logoImg}>
              <PortalLogo t={t}/>
            </Grid>
            <Grid item xs={6} md={6} lg={6} className={classes.logoLabel}>
              { <Box
                fontFamily="Roboto"
                fontWeight={600}
                color="rgba(0,0,0,0.74)"
                fontSize={16}
              >
                <PortalBankLabel t={t}/>
              </Box> }
            </Grid>
          </Box>

          <Box
            color="primary.main"
            textAlign="center"
            fontSize={24}
            fontWeight={500}
            pt={4}
          >
            {t("componentData.Login.ForgotPassword")}
          </Box>
          <Box p={2}>
            <TextField
              fullWidth={true}
              error={validation && validation.Email}
              autoComplete="off"
              value={(credentials && credentials.Email) || ""}
              name="Email"
              placeholder={t("componentData.Login.UsernameLabel")}
              onChange={(event) => handleChange("Email", event)}
              dir="horizontal"
              size="medium"
              variant="outlined"
              inputProps={{
                maxLength: 100,
              }}
              label={t("componentData.Login.UsernameLabel")}
              className={classes.textField}
            />
            <Box width={350}>
              <Typography
                variant="subtitle1"
                color="error"
                style={{ wordBreak: "break-word" }}
              >
                {error}
              </Typography>
            </Box>
            <Box
              mt={4}
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                color="primary"
                onClick={() => onCancel()}
                style={{ fontSize: 14 }}
                variant="outlined"
                disableElevation
              >
                {t("componentData.forgotPassword.cancleBtn")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => onSubmit()}
                disableElevation
                style={{
                  marginLeft: "20px",
                  fontSize: 14,
                  color: "#fff",
                  fontWeight: "normal",
                }}
              >
                {t("componentData.forgotPassword.resetPassBtn")}
              </Button>
            </Box>
          </Box>
        </div>
      </Grid>
    </>
  );
};

export default withTranslation() (
  connect((state) => ({ ...state.user }))((ForgotPassword))
)