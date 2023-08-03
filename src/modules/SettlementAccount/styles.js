const styles = (theme) => ({
  inputBox:{
    float: "left",
    padding: "10px 10px 0",
    minHeight: "80px",
    "& .MuiTextField-root":{
      width: "100%"
    },
    "& .MuiFormControl-root":{
      width: "100%",      
    },
    "& input": {
      color: "#2B2D30",
      fontSize: "16px",      
      boxSizing: "border-box",
      borderRadius: "4px",
      height: "56px"
    },
    "& .MuiFormLabel-root":{
      fontSize: "16px"
    }
  },

  multitBox:{
    float: "left",
    padding: "10px 10px 0",
    "& input": {
      color: "#2B2D30",
      fontSize: "16px",      
      boxSizing: "border-box",
      borderRadius: "4px",
      height: "56px"
    },
    "& .MuiTextField-root":{
      width: "50%!important",
      padding: "0 5px",
      // width: "100%",
      boxSizing: "border-box",
      "&:nth-child(2n+0)":{
        float: "right",
        paddingRight: "0"
      },
      "&:first-child":{
        float: "left",
        paddingLeft: "0"
      }
    },
    "& .MuiFormLabel-root":{
      fontSize: "16px"
    }
  },

  btnHolder:{
    float: "left",
    textAlign: "center",
    margin: "10px 0 0",
    "& button":{
      display: "inline-block",
      margin: "0 10px",
      minWidth: "93px",
      textTransform: "uppercase",
      fontSize: "14px",
      "&.MuiButton-containedPrimary:hover":{
        background: "#0B1941"
      }
    }
  },

  newAccountMenu: {
    borderTop: '1px solid #9E9E9E',
    margin: theme.spacing(0.5, 1),
    display: 'flex',
    justifyContent: 'center',
  },
  plusIcon: {
    marginRight: theme.spacing(0.5),
  },
  accountsMenuList: {
    margin: theme.spacing(0.5, 0),
    minHeight:'40px'
  },
  settlementHeading: {
    fontSize: '20px',
    color: '#0B1941',
    margin: theme.spacing(1),
    padding:'10px'
  },
});
export default styles;
