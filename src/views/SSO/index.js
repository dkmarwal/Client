import React from "react";
import { useDispatch } from "react-redux";
import { Typography, Grid, Box, makeStyles } from "@material-ui/core";
import WhiteCard from "~/components/WhiteCard";
import ClientHeader from "~/components/Header/ClientHeader";
import Footer from "~/components/Footer";
import { withTranslation } from "react-i18next";
import { fetchSupportedLanguageList } from "~/redux/actions/user";
import i18n from "../../i18n";
import DefaultLogo from "~/assets/images/logoDummy.png";

const useStyles = makeStyles(() => ({
  rootContainer: {
    background: "#e9eef2",
    justifyContent: "center",
    paddingTop: "4.5rem",
    minHeight: "calc(100vh - 56px)",
  },
  profileContainer: {
    minHeight: "510px",
    height: "100%",
  },
  profileHeading: {
    color: "#000000",
    fontSize: "1.5rem",
    marginBottom: "1.5rem",
  },
  clientContainer: {
    border: "1px solid #9E9E9E",
    borderRadius: "4px",
    background: "#ffffff",
    minHeight: "125px",
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    alignItems: "center",
  },
  defaultImgCont: {
    width: "120px",
    height: "40px",
    marginTop: "12px",
  },
  clientsGridContainer: {
    marginTop: "32px",
  },
  clientNameHeading: {
    color: "#0B1941",
    fontSize: "1rem",
    marginTop: "8px",
    textAlign: "center",
    lineHeight: "18px",
  },
  clientLogoImg: {
    height: "25px",
    marginTop: "8px",
    lineHeight: "16px",
  },
  clientIdHeading: {
    color: "#9E9E9E",
    fontSize: "12px",
    marginTop: "10px",
    textAlign: "center",
  },
}));

const SSOComponent = (props) => {
  const { clientResponse, routeToDashboard, user, t } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const userData = user?.userData || null;
  const appType = (userData && userData?.appType) || 1;//Default to 1 in client portal

  React.useEffect(() => {
    dispatch(fetchSupportedLanguageList({lang: i18n.language, appType:appType}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ClientHeader isLoggedIn={false} info={{}} height="56" />

      <Grid container className={classes.rootContainer} justifyContent="center">
        <Grid item lg={10} md={10} xs={10} className={classes.profileContainer}>
          <WhiteCard margin="1rem 0" padding="1.5rem">
            <Typography className={classes.profileHeading} gutterBottom>
              {t("componentData.sso.subsidiaryProfile")}
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {clientResponse?.data?.clientData?.map((item) => {
                return (
                  <Grid item lg={3} xs={6} sm={6}>
                    <Box
                      className={classes.clientContainer}
                      onClick={() => routeToDashboard(item.userId)}
                    >
                      <img
                        src={item.logo ?? DefaultLogo}
                        height="70"
                        className={
                          item.logo
                            ? classes.clientLogoImg
                            : classes.defaultImgCont
                        }
                        alt="Client Logo"
                      />
                      <Typography className={classes.clientNameHeading}>
                        {item?.clientName || ""}
                      </Typography>
                      <Typography className={classes.clientIdHeading}>
                        {item?.clientUID || ""}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </WhiteCard>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default withTranslation()(SSOComponent);
