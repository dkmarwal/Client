const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
  },
  table: {
    width: "100%",
    "& .MuiTableRow-head .MuiTableCell-head": {
      backgroundColor: "rgba(204,228,255,0.75)",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "0.6em",
    },
  },

  heading: {
    fontWeight: "normal",
    color: "#8D8E8D",
  },
  mailCampaignsStatus: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: 120,
    "& h3": {
      fontSize: 34,
      fontWeight: "normal",
      color: "#265481",
    },
    "& span": {
      fontSize: 18,
      fontWeight: "normal",
      color: theme.palette.text.black,
    },
    "& p": {
      fontSize: 14,
      color: "#565656",
    },
  },
  gridItem: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "10px",
  },
  smallBtn: {
    fontSize: "14px",
    color: "#0B1941",
    padding: "5px 10px",
    textTransform: "capitalize",
  },
  imgIcon: {
    marginRight: "5px",
  },
  iconGreyText: {
    fontSize: "14px",
    fontWeight: "600",
    color: theme.palette.text.grey,
  },
  iconText: {
    fontSize: "14px",
    fontWeight: "600",
  },
  fileText: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.text.blackLight,
    "& span": {
      color: theme.palette.secondary.main,
      fontWeight: "normal",
    },
  },
});

export default styles;
