const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    marginTop: '20px',
    marginBottom: '20px',
    paddingTop: '15px',
    paddingBottom: '15px',
    textAlign: 'left',
    '& .MuiTextField-root': {
      width: '100%',
    },
  },
  inputLabel: {
    margin: ".5rem 0",
    color: "#76777b",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "25px",
    display: "block",
    marginBottom: 0,
  },
  fieldset: {
    border: "1px solid #d8d8d8",
    padding: "0 20px 10px 20px",
    width: "90%",
    display: "block",
    marginBottom: "20px",
  },
  legend: {
    width: "auto",
    padding: "5px",
    fontSize: "14px",
    borderBottom: "0px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  gridItem: {
    margin: 0,
  },
  panelHeading: {
    backgroundColor:"#f9f9f9",
  },
  pageHeader: {
    borderBottom: "0px",
    padding: "0px 0px 15px 0px",
    letterSpacing: "1px",
    fontSize: "24px",
    color: "#243d7d",
  },
  mandatory: {
    color: "#ff0000",
  },
  formHeading:{
    paddingLeft: "28px",
    margin: "10px",
    fontSize: "20px",
    color: "#056dae",
    fontWeight: 700,
    textTransform: "uppercase",
    display: "inline-block",
  },
});

export default styles