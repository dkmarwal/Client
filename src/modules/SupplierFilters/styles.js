export const styles = (theme) => ({
  filterText: {
    color: theme.palette.primary.main,
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "0.25px",
  },
  itemSelected: {
    margin: "0px 5px 5px 0px",
    fontSize: "14px",
    fontWeight: "500",
    boxSizing: "border-box",
    padding: "0 10px",
  },
  item: {
    margin: "0px 5px 5px 0px",
    fontSize: "14px",
    background: "#e4e4e4",
    fontWeight: "500",
    padding: "0 10px",
    border: "none",
    color: theme.palette.text.black,
  },
  imgIcon: {
    width: "18px",
    height: "18px",
  },
  paymentsTabContainer: {
    marginTop: 32,
  },
  implementationProgram: {
    marginTop: 24,
  },
  cursorPointer: {
    cursor: "pointer",
  },
  selectBtn: {
    padding: "10px",
    "& span": {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "1rem",
    },
  },
});
