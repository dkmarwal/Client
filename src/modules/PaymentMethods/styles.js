export const styles = (theme) => ({
  largeBtn: {
    width: "180px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "28px",
    backgroundColor: "#008CE6",
    zIndex: 10,
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#008CE6",
      borderRadius: "28px",
    },
    position: "fixed",
    top: 115,
    right: 45,
  },

  smallBtn: {
    width: "48px",
    height: "48px",
    fontSize: "14px",
    color: "#FFFFFF",
    borderRadius: "100%",
    backgroundColor: "#008CE6",
    position: "fixed",
    top: 115,
    right: 45,
    zIndex: 10,
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      color: "#FFFFFF",
      backgroundColor: "#008CE6",
      borderRadius: "100%",
    },
  },
  currencyCode: {
    padding: "5px",
  },
  addAccountButton: {
    borderRadius: "50px",
  },
  settingHeading: {
    fontWeight: "normal",
    fontSize: "20px",
    color: "#0B1941",
  },
});
