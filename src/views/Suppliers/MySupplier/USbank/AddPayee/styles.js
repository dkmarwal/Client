export const styles = (theme) => ({
  contentBackground: {
    width: '100%',
    backgroundColor: theme.palette.background.header,
    borderRadius: "4px",
    padding: "16px 32px",
  },
  inputContainer: {
    padding: theme.spacing(1, 4),
  },
  settingHeading: {
    fontWeight: "normal",
    fontSize: "20px",
    color: "#0B1941"
  },
  routingCodeDialog: {
    '& .MuiDialog-paper': {
      maxWidth: '860px !important',
      minWidth: '600px',
      borderRadius: '10px',
      [theme.breakpoints.down('xs')]: {
        minWidth: '90%',
        width: '100%',
        margin: '0px 16px !important',
      },
    },
  },
  searchRoutingText: {
    color: "#008CE6",
    display: "flex",
    fontSize: "0.75rem",
    paddingTop: theme.spacing(0.5),
    textDecoration: "underline",
  },
  materialText: {
    border: "none"
  },
  // root: {
  //     // flexGrow: 1,
  // },
  paper: {
    width: '100%',
    boxShadow:'0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 0px 0px rgba(0,0,0,0.12)',
  },
});
