export const styles = (theme) => ({
  contentBackground: {
    backgroundColor: theme.palette.background.header,
    padding: theme.spacing(4, 4),
    borderRadius: "4px",
  },
  inputContainer: {
    padding: theme.spacing(1, 4),
  },
  details: {
    fontSize: "14px",
  },
  key: {
    margin: "0 10px 0 0",
  },
  cardContent: {
    padding: "10px",
    height: "120px",
    width: "100%",
  },
  headingTop: {
    padding: "10px 0",
    display: "block",
  },
  pointer: {
    cursor: "pointer",
  },
  outerBox: {
    borderRadius: "8px"
  },
  BoxTitle: {
    color: theme.palette.text.title,
    display: "flex",
    fontSize: "18px",
    background: " #CEE1F0",
    padding: "8px 16px",
    borderRadius: "8px 8px 0 0",
  },
  TitleText: {
    color: theme.palette.primary.main,
    // display: "flex",
    fontSize: "18px",
  },
  paymentDetailTitle: {
    color: "#0B1941",
    display: "flex",
    padding: "16px",
    fontSize: "16px",
    justifyContent: "center"
    // borderBottom: "1px solid #8F9EC4",
    // borderRadius: "8px 8px 0 0",
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

  buttonAlign: {
    marginBottom: 0,
    "& button": {
      margin: "0 5px",
      fontSize: 14,
      fontWeight: 600,
      textTransform: "capitalize",
      "& .MuiSvgIcon-root": {
        fontSize: 20,
        marginRight: 3,
      },
    },
  },

  titleBg: {
    backgroundColor: theme.palette.background.lightBlue,
    //margin: "0 -16px",
    padding: "5px 16px",
    fontWeight: 600,
  },

  btnLighGreen: {
    backgroundColor: theme.palette.background.lightGreen,
    textTransform: "capitalize",
    fontSize: 14,
    padding: "4px 10px",
    borderRadius: 35,
    color: theme.palette.text.black,
    boxShadow: "none",
    cursor: "none",
  },
  ccPaymentTitle: {
    fontSize: 24,
    color: "#000000"
  },
  paymentIcon: {
    verticalAlign: 'bottom',
    marginLeft: theme.spacing(1),
    color: '#4C4C4C',
    cursor: 'pointer'
  },
  totalPayBox: {
    display: 'inline-block',
    textAlign: 'right'
  },
  bottomLink: {
    color: '#4C4C4C',
    fontSize: 16
  },
  TitleHeadTxt: {
    fontSize: 24,
    color: '#4C4C4C',
    background: '#CEE1F0',
    textAlign: 'center',
    borderRadius: ' 8px 8px 0px 0px'
  },
  textLink: {
    textDecoration: 'underline',
    cursor: 'pointer',
    display: 'initial'
  },
  whiteBox: {
    background: 'white',
    borderRadius: 8,
    marginRight: theme.spacing(2)
  },
  ccExceptionBox: {
    backgroundColor: 'white',
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2)",
    padding: theme.spacing(2)
  }
});
