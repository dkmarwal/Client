const styles = (theme) => ({
  root: {
    margin: "0px",
    // width: 'calc(100% - 4.375rem)'
  },
  paper: {
    margin: "0 auto",

    // width: "calc(100% - 48px)",
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
    width: "50px",
    fontSize: "14px",
    color: "#0B1941",
  },
  mediumBtn: {
    width: "130px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: "#008CE6",
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
    height: "24px",
    color: "#0B1941",
  },
  iconText: {
    width: "50px",
    fontSize: "14px",
    lineHeight: "18px",
    lineSpacing: "0.25px",
    color: "#0B1941",
  },
  searchBox: {
    // height: 22,
    // width: 300,
    // fontSize: 14,
    // padding:0 px !important,
    minWidth: "308px",
    paddingTop: "2px",
    fontSize: "14px",
    letterSpacing: "-1.14px",
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
  textTtransform: {
    textTransform: "capitalize",
    fontWeight: 600,
    fontSize: 14,
  },
});
export default styles;
