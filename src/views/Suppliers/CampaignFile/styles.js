export const styles = (theme) => ({
  primaryDark: {
    color: theme.palette.primary.dark,
    textAlign: "center",
  },
  primaryGrey: {
    color: theme.palette.secondary.grey,
    textAlign: "center",
  },
  container: {
    margin: "4px",
    display: "flex",
    flexDirection: "column",
  },
  tbleRow: {
    cursor: "pointer",
  },
  paper: {
    width: "100%",
  },
  gridItem: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "4px 4px 0 0",
  },
  largeBtn: {
    width: "250px",
    height: "48px",
    fontSize: "14px",
    color: theme.palette.secondary.contrastText,
    borderRadius: "28px",
    backgroundColor: theme.palette.secondary.main,
    marginBottom: 20,
    lineHeight: "20px",
    boxShadow:
      "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.secondary.contrastText,
    },
  },
  supTable: {
    backgroundColor: "rgba(204,228,255,0.75)",
    fontWeight: "bold",
    lineHeight: "0.1em",
  },
  paymentFilterBox: {
    padding: "15px 17px 5px 17px",
    fontSize: 16,
    color: theme.palette.text.blueLight,
    cursor: "pointer",
    borderBottom: "8px solid transparent",
    position: "relative",
    marginBottom: "15px",

    "& h1": {
      fontSize: 42,
      color: theme.palette.text.blackLight,
    },
    "& h5": {
      fontSize: 18,
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
    "&:active": {
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
  },

  iconText: {
    fontWeight: 600,
    marginLeft: 3,
    textTransform: "capitalize",
  },

  root: {
    margin: "0px",
    width: "100%",
  },
});
