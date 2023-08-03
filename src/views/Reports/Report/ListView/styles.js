const styles = (theme) => ({
  root: {
    margin: "0px",
    width: "100%",
  },
  paper: {
    margin: "20px 30px 5px",
    width: "100%",
  },
  gtidItem: {
    backgroundColor: theme.palette.background.paper,
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
  smallBtn: {
    fontSize: "14px",
    color: "#0B1941",
  },
  mediumBtn: {
    width: "200px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: "#008CE6",
    marginTop: "-40px",
    position: "fixed",
    zIndex: 4,
    right: "42px",
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#008CE6",
      borderRadius: "28px",
    },
  },
  smallIcon: {
    width: "20px",
    height: "26px",
    color: "#0B1941",
  },
  iconText: {
    paddingLeft: "5px",
    fontSize: "14px",
    lineHeight: "18px",
    lineSpacing: "0.25px",
    color: "#0B1941",
    textTransform: "capitalize",
  },
  searchBox: {
    width: "270px",
    paddingTop: "5px",
    fontSize: "16px",
    letterSpacing: "0.44px",
    lineHeight: "24px",
  },
  multiSelect: {
    margin: theme.spacing(1),
    width: "100%",
    display: "flex",
  },
  dropdownStyle: {
    maxHeight: "200px",
  },
  tableFont: {
    fontSize: "12px",
    border: "1px solid red",
    padding: "5px 16px",
  },
  backdrop:{
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  }
});
export default styles;
