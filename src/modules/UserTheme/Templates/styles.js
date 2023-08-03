const styles = (theme) => ({
  templateBox: {
    marginBottom: "25px",
    border: "1px solid #CCCCCC",
    boxSizing: "border-box",
    boxShadow: "inset 0px 0px 4px #98c450",
    borderRadius: "8px",
    padding: "15px",
    paddingBottom: "100px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  urlHeader: {
    color: "#0B1941",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 4px",
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 0px 0px rgba(0,0,0,0.12)",
    backgroundColor: "#FFFFFF",
  },
  heading: {
    fontWeight: "bold",
  },

  icons: {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
    width: "10%",
  },
});
export default styles;
