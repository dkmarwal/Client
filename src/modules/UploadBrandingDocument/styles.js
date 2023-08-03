const styles = (theme) => ({
  themeBox: {
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    color: "#222",
    background: "#fff",
    margin: "16px 48px",
    padding: "30px 25px 30px 0",
  },

  tabs: {
    textAlign: "left",
    "& .MuiTabs-flexContainerVertical": {
      justifyContent: "flex-start !important",
      alignItems: "flex-start !important",
    },
    "& .MuiTab-root": {
      maxWidth: "100%",
      boxSizing: "border-box",
      minHeight: "auto",
      "& .MuiTab-wrapper": {
        textAlign: "left",
        alignItems: "baseline !important",
        color: "#4C4C4C !important",
        fontSize: 16,
        padding: "8px 10px",
      },
      "&.Mui-selected": {
        "& .MuiTab-wrapper": {
          color: "#008CE6 !important",
        },
      },
    },
    "& .MuiTabs-indicator": {
      left: 0,
      right: "inherit",
    },
  },

  saveBtn: {
    clear: "both",
    margin: "25px auto 0",
    display: "block",
    padding: "5px 40px",
  },
  borderRight: {
    borderRight: "1px solid rgba(224, 224, 224, 1)",
  },
});
export default styles;
