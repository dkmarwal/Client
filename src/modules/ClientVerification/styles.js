import mainImageBg from "~/assets/images/varify-client-bg.png";

export const styles = (theme) => ({
  verificationBoxContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${mainImageBg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100vh",
  },
  verificationBox: {
    width: "25.5rem",
    marginTop: "56px",
  },
  verificationBoxHeader: {
    backgroundColor: theme.palette.primary.main,
    padding: "1rem",
    textAlign: "center",
    borderRadius: "4px 4px 0 0",
    color: theme.palette.background.header,
  },
  verificationBoxContent: {
    padding: "0.874rem 1.563rem",
  },
  recaptchaContainer: {
    display: "flex",
    margin: "0.5rem 0rem",
    // justifyContent: 'flex-end'
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "1rem 0rem",
  },
});
