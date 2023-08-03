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
  outerBox: {
    borderRadius: "8px"
  },
  BoxTitle: {
    color: theme.palette.primary.main,
    display: "flex",
    fontSize: "18px",
    background: " #CEE1F0",
    padding: "8px 16px",
    borderRadius: "8px 8px 0 0",
  },
  TitleText: {
    color: theme.palette.primary.main,
    display: "flex",
    fontSize: "18px",
  },
  paymentDetailTitle: {
    color: "#0B1941",
    display: "flex",
    padding: "8px 16px",
    fontSize: "18px",
    borderBottom: "1px solid #8F9EC4",
    borderRadius: "8px 8px 0 0",
    minHeight: "80px"
  },
  USbankpaymentDetailTitle: {
    color: "#0B1941",
    display: "flex",
    padding: "8px 16px",
    fontSize: "15px",
    borderBottom: "1px solid #8F9EC4",
    borderRadius: "8px 8px 0 0",
    minHeight: "80px"
  },
  titleBg: {
    backgroundColor: theme.palette.background.lightBlue,
    margin: "0 -16px",
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

  paymentTypeList: {
    float: "left",
    width: "100%",
    "& ul": {
      "& li": {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "left",
        padding: "0 0 15px",
        "& span": {
          textDecoration: "underline",
          cursor: "pointer",
          width: "310px",
          "& svg": {
            float: "left",
            width: "25px",
            margin: "-2px 6px 0px 0"
          }
        },
        "& label": {
          textDecoration: "underline",
          cursor: "pointer"
        }
      }
    }
  },

  tablePaginationBox: {
    "& td": {
      border: "none"
    }
  },

  comboFileLebel: {
    float: "right",
    background: "#B2DFFF",
    borderRadius: "50px",
    color: "#2B2D30",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: "bold"
  },

  paymenyTabArea: {
    float: 'left',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0 47px',
    margin: "0 0 -24px",
    "& span": {
      color: "#0B1941"
    },
    "& .Mui-selected span": {
      color: "#008CE6"
    },
    "& .MuiTabs-indicator": {
      color: "#008CE6",
      backgroundColor: "#008CE6"
    },
  },
  repeatedBox: {
    padding: "10px",
    borderBottom: "1px solid #e0e0e0",
    fontSize: "14px",
    background: "#fff",
    "&:nth-last-child(2)": {
      border: "none",
      borderRadius: "0 0 10px 10px"
    }
  },
  repeatedBox2: {
    padding: "10px",
    borderBottom: "1px solid #e0e0e0",
    fontSize: "14px",
    "&:last-child": {
      border: "none",
    }
  },
  tabContentArea: {
    "& > .MuiBox-root": {
      paddingTop: 0
    }
  },
  paymentCountBox: {
    width: "20%",
    padding: "0 8px"
  }
});
