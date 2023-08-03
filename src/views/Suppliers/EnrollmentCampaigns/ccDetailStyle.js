const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
  },
  campaignsStatus: {
    "& h3": {},
    "& span": {
      color:"#4c4c4c"
    },
    "& p": {},
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
  legendList:{
    height: "75px",
    display: "table-cell",
    verticalAlign: "middle",
  }
  
});

export default styles;
