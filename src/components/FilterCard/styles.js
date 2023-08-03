export const styles = (theme) => ({
  paymentFilterBox: {
    padding: "15px 17px 5px 17px",
    fontSize: 16,
    color: theme.palette.text.blueLight,
    cursor: "pointer",
    borderBottom: "8px solid transparent",
    position: "relative",
    marginBottom: "25px",
    height:100,
    "& h1": {
      fontSize: 30,
      color: theme.palette.text.blackLight,
    },
    "& h5": {
      fontSize: 15,
      padding: "5px 0",
    },
    "& span": {
      color: theme.palette.primary.persianGreen,
      fontSize: 16,
      fontWeight: "bold",
      padding: "0 15px 0 0",
      display: "flex",
      alignItems: "center",
    },
  },
  selected: {
    borderBottom: `8px solid ${theme.palette.primary.light}`,
    "&::after": {
      content: "''",
      position: "absolute",
      width: "5px",
      bottom: "-20px",
      borderLeft: "20px solid transparent",
      borderRight: "20px solid transparent",
      borderTop: `20px solid ${theme.palette.primary.light}`,
      transform: "translateX(-50%)",
      left: "50%",
    },
  },
  iconText: {
    fontWeight: 600,
    marginLeft: 3,
  },
  errorColor:{ color:theme.palette.error.main},

  root: {
    margin: "0px",
    width: "100%",
  },
});
