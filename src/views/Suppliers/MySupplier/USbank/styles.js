const styles = (theme) => ({
  firstGrid: {
    marginTop: "12px",
    marginBottom: 0,
  },
  root: {
    margin: "0px",
    width: "100%",
  },
  paper: {
    width: "100%",
    margin: " 20px 0 32px 0",
  },
  gridItem: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "10px",
    margin: "3px 0"
  },
  cardView: {
    backgroundColor: theme.palette.background.default,
    padding: "30px",
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
    padding: "5px 10px",
    textTransform: "capitalize",
  },
  imgIcon: {
    marginRight: "5px",
    width: "16px",
    height: "16px"
  },
  mediumBtn: {
    width: "130px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: "#008CE6",
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#008CE6",
      borderRadius: "28px",
    },
  },
  largeBtn: {
    width: "180px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: "#008CE6",
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
  supTable: {
    backgroundColor: "rgba(204,228,255,0.75)",
    fontWeight: "bold",
    lineHeight: "0.1em",
    whiteSpace: "nowrap",
  },
  bodyTextColor: {
    cursor: "pointer",
    "& .MuiTableCell-body": {
      color: "#202020",
    },
  },
  iconText: {
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  checkBoxHeader: {
    width: "100%",
    display: "flex",
    alignItems: "inherit",
    justifyContent: "inherit",
    height: "20px",
  },
  iconGreyText: {
    fontSize: "14px",
    fontWeight: "600",
    // color: "#0B1941",
  },
  noResultsText: {
    backgroundColor: "#FFFFFF",
  },
  searchBox: {
    height: "0.1876em",
    width: "370px",
    paddingTop: "5px",
    fontSize: "14px",
    letterSpacing: "0.44px",
    lineHeight: "24px",
  },
  multiSelect: {
    margin: theme.spacing(1),
    width: "100%",
    display: "flex",
  },
  cardContent: {
    padding: "10px",
    height: "240px",
    width: "100%",
  },
  floatRight: {
    float: "right",
  },
  floatLeft: {
    float: "left",
  },
  alignCenter: {
    textAlign: "center",
  },
  cardTexts: {
    textAlign: "center",
    margin: "30px auto",
    display: "table",
    position: "relative",
    top: 0,
  },
  profileCircle: {
    borderRadius: "50%",
    padding: "0",
    fontSize: "20px",
    height: "40px",
    width: "40px",
    lineHeight: "40px",
    margin: "0 0 10px",
    display: "inline-block"
  },
  supplierName: {
    margin: "15px 0 0 0",
    fontSize: "18px",
    fontWeight: "600",
    letterSpacing: "1.1px",
  },
  marginHorizontal: {
    margin: "0 5px",
  },
  payeeBtn: {
    width: "150px",
    height: "48px",
    fontSize: "14px",
    color: theme.palette.secondary.contrastText,
    borderRadius: "28px",
    backgroundColor: theme.palette.secondary.main,
    marginBottom: 20,
    position: "fixed",
    right: 45,
    top: 115,
    zIndex: 9,
    lineHeight: "20px",
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.secondary.contrastText,
    },
  },
  smallTitle: {
    fontSize: "14px",
    margin: "10px 0",
    fontWeight: 600,
    minWidth: "max-content",
  },
  approvedText: {
    padding: "3px 10px",
    textAlign: "center",
    letterSpacing: "1px",
    fontWeight: "normal",
    fontSize: 14,
  },
  displayBlock: {
    display: "block",
  },
  pagination: {
    width: "100%",
    padding: "20px 30px",
  },
  checkedIcon: {
    margin: "0px 5px",
  },
  checkClass: {
    height: "18px",
    width: "18px",
  },
  cursorPointer: {
    cursor: "pointer",
  },
  textBold: {
    fontWeight: "bold",
  },
  ".centerDialog button.MuiButtonBase-root": {
    color: "#008CE6 !important",
  },
});

export default styles;
