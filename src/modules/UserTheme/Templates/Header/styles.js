const styles = (theme) => ({
  payeeBox: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 4px",
    //boxShadow: "0px 0px 20px -15px rgba(0, 0, 0, 0.25)",
    boxShadow:
      "0px 1px 1px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12), 0px 1px 3px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  payeeBoxMobile: {
    width: "360px",
    margin: "0 auto",
    marginTop: "50px",
  },

  LogoBox: {
    display: "flex",
    height: "auto",
    alignItems: "center",
  },
  LogoBoxMobile: {
    justifyContent: "flex-end",
    width: "30%",
    marginLeft: "20px",
    padding: "2px",
    "& img": {
      maxHeight: 25,
    },
  },
  logo: {
    maxWidth: "100%",
    height: "auto",
    maxHeight: 35,
    [theme.breakpoints.down("sm")]: { maxHeight: 20 },
  },
  midBorder: {
    border: "1px solid #CCCCCC",
    background: "#cccccc",
    margin: "0 5px",
    marginLeft: "10px",
    height: 25,
  },

  payeeHeadingMobile: {
    fontSize: "13px",
    padding: "4px 0px",
    marginLeft: "5px",
  },
});
export default styles;
