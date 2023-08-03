export const styles = (theme) => ({
  filterText: {    
    margin: "10px 0",
    color: "#0B1941",
    fontSize: "14px",
    fontWeight: "bold",
    letterSpacing: "0.25px"
  },
  itemSelected: {
    border: "2px solid ",
    margin: "0px 10px 5px 0px",
    fontSize: "14px",
    fontWeight: "500",
  },
  item: {
    margin: "0px 15px 5px 0px",
    fontSize: "14px",
    background: theme.palette.background.default,
    border: "none",
    fontWeight: "500",
    color: theme.palette.text.black,
  },
  imgIcon: {
    width: "13px",
    height: "12px",
  },
  btnScpace: {
    fontSize: "14px !important",
  },
  
  iconColor: {
    color: theme.palette.text.grey,
  },

  filterBTN: {
    width: "100%",
    display: "flex",
    marginTop: 16,
    boxSizing: "border-box",
  },
  datePicker: {
    margin: 0,
    width: "100%",
    fontFamily: "inherit",
    fontSize: 16,
    "& .MuiOutlinedInput-input": {
      padding: 10,
    },
  },
  checkBox: {
    padding: "0px 10px",
    margin: 0,
  },
  errorMessage : {
    fontSize: "15px",
    position: "relative",
    top: "0",
    color: "red"
  },
  
  filterLabel: {
    marginTop: "24px"
  },
  gridBox: {
    height: "40px",
    marginBottom: "10px",
    width: "100%",
  },
  dateFilter: {
    marginBottom: "16px !important"
  },
});
