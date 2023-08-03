export const styles = (theme) => ({
  largeBtn: {
    width: 300,
    height: 48,
    fontSize: 14,
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
    position: "relative",
    top: "-5px",
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
