import bgImage from "~/assets/images/vendor-client.png";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#fff",
    "& .MuiTextField-root": {
      width: "100%",
    },
    height: "100vh",
    // paddingRight: "15px",
    // paddingLeft: "15px",
    // marginRight: "auto",
    // marginLeft: "auto",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  startupContainer: {},
  leftWrap: {
    background: `url(${bgImage}) no-repeat 0px 0px`,
    backgroundSize: "cover",
    paddingRight: "15px",
    paddingLeft: "15px",
    marginRight: "auto",
    marginLeft: "auto",
  },
  startupHeading: {
    marginLeft: "2em",
    "& h3": {
      color: "#fff",
      marginTop: "2em",
      fontSize: "26px",
      fontFamily: "'Open Sans', sans-serif",
      lineHeight: "1.2",
      fontWeight: 600,
    },
    "& p": {
      color: "#fff",
      fontSize: "1.4em",
      marginTop: "1.1em",
      textAlign: "left",
      margin: "0 0 10px",
    },
  },
  updatePasswordModal: {
    position: "absolute",
    width: "40%",
    left: "30%",
    top: "20%",
    outline: "none",
    padding: "3.125rem 0rem",
    borderRadius: "0 !important",
    overflowY: "auto",
    maxHeight: "350px",
  },
  textField: {
    height: "1.75rem",
  },
  heading: {
    paddingTop: 0,
    color: "#0c2074",
    fontSize: 26,
    fontWeight: 500,
  },
  clientLogo: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
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
    fontSize: 16,
    color: "rgba(0,0,0,0.74)",
    fontWeight: 600,
    fontFamily: "'Roboto', Arial, Helvetica, sans-serif",
  },
});

export default styles;
