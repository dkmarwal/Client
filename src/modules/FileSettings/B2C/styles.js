const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    margin: "32px 48px",
    padding: "18px",
    textAlign: "left",
    "& .MuiTextField-root": {
      width: "100%",
    },
  },
  inputLabel: {
    margin: ".5rem 0",
    color: "#76777b",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "25px",
    display: "block",
    marginBottom: 0,
  },
  fieldset: {
    width: "100%",
  },
  gridContainers: {
    margin: "15px 0",
  },
  gridPadding: {
    padding: "20px 0 40px",
  },
  legend: {
    width: "auto",
    padding: "5px",
    fontSize: "16px",
    lineHeight: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  gridMArgin: {
    marginBottom: "20px",
  },
  gridItem: {
    padding: "16px 0",
  },
  panelHeading: {
    padding: "5px 0px",
    marginTop: "10px",
    fontSize: "12px",
    fontWeight: 400,
  },
  pageHeader: {
    borderBottom: "0px",
    padding: "0px 0px 15px 0px",
    letterSpacing: "1px",
    fontSize: "24px",
    color: "#243d7d",
  },
  mandatory: {
    color: "#ff0000",
  },
  importText: {
    margin: "40px 0px 5px 0px",
  },
  marginRight: {
    marginRight: 0
  },
  description: {
    fontSize: "14px"
  },
  SDRHeading: {
    padding: "0 0 8px 0px",
    "& svg": {
      display: "inline-block",
      margin: "0 0 -4px 8px",
      fontSize: 20
    }
  },
  errorText2: {
    color: " #f44336",
    marginLeft: "40px",
    marginRight: "14px"
  }
});

export default styles;
