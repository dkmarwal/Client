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
      lineHeight: "1.2em",
      padding: "10px 16px"
    },
  },

  ".MuiTableHead-root": {
    "& .MuiTableCell-head": {
      color: "rgba(15,15,15,0.87) !important",
    },
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
  campaingnHeading:{
    fontSize: 24,
    color: "#162D6E",
  },
  campaingnRedHeading:{
    fontSize: 24,
    color: "#D97934",
  },
  campaingnSubHeading: {
    color: "#4c4c4c",
  },
  successInfo:{
    color:"#33C3A4 !important"
  }
});

export default styles;
