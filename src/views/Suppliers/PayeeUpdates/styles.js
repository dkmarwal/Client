const styles = (theme) => ({
  root: {
    margin: 0,
    flexGrow: 1,
    width: "100%",
  },
  paper: {
    margin: "32px 48px",
    width: "100%",
    padding: "16px 24px",
  },
  inputLabel: {
    margin: ".5rem 0",
    color: "#76777b",
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 25,
    display: "block",
    marginBottom: 0,
  },
  fieldset: {
    border: "1px solid #d8d8d8",
    padding: "0 20px 10px 20px",
    width: "90%",
    display: "block",
    marginBottom: 20,
  },
  legend: {
    width: "auto",
    padding: 5,
    fontSize: 14,
    borderBottom: 0,
    fontWeight: 600,
    marginBottom: 10,
  },
  gridItem: {
    // padding: "3px 10px",
    // marginBottom: "10px"
  },
  panelHeading: {
    backgroundColor: "#f9f9f9",
  },
  pageHeader: {
    borderBottom: 0,
    padding: "0 0 15px 0",
    letterSpacing: 1,
    fontSize: 24,
    color: "#243d7d",
  },
  mandatory: {
    color: "#ff0000",
  },
  formHeading: {
    paddingLeft: 28,
    margin: 10,
    fontSize: 20,
    color: "#056dae",
    fontWeight: 700,
    textTransform: "uppercase",
    display: "inline-block",
  },
  input: {
    display: "none",
  },
  uploadBtn: {
    borderRadius: 28,
    justifyContent: "flex-start",
    height: 54,
    width: "100%",
  },
  multiSelect: {
    width: "100%",
  },

  tabClass: {
    height: 35,
    minHeight: 25,
    width: "100%",
  },
  tabItem: {
    root: {
      flexGrow: 1,
      color: theme.palette.secondary.dark,
      borderRadius: 4,
      //            textTransform: "capitalize",
      // backgroundColor: theme.palette.background.active,
      backgroundColor: "#6094B1",
      border: "none",
    },
    flexContainer: {
      margin: 5,
    },
  },
  indicator: {
    backgroundColor: "transparent",
    color: "#fff",
    borderRadius: 0,
  },
  checkedIcon: { width: "100%" },
  checkClass: {
    height: 24,
    width: 24,
  },
  selected: {
    backgroundColor: "#008CE6",
    color: "#fff",
    borderRadius: 4,
    marginRight: 0,
    //textTransform: "capitalize",
  },
  dropdownStyle: {
    maxHeight: "200px",
  },
  MuiButton: {},
});

export default styles;
