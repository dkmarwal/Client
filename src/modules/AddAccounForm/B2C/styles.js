const styles = (theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      textAlign: 'left',
      '& .MuiTextField-root': {
        width: '100%',
      },
      padding: '32px 30px',
    },
    paymentListBox: {
      boxShadow:
        '0px 6px 10px rgba(0, 0, 0, 0.14), 0px 1px 18px rgba(0, 0, 0, 0.12), 0px 3px 5px -1px rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
    },
    genralTitleBold: {
      fontSize: 16,
      color: '#0B1941',
    },
    titleContainer: {},
    formControlCheckbox: {
      display: 'flex',
      '& .MuiFormControlLabel-label': {
        display: 'flex',
      },
      '&:hover': {
          background: '#F4F4F4',
          borderRadius: 6,
          padding:'8px',
        },
    },
    checkboxLabel: {
      display: 'flex',
    },
    paymentMethod: {
      padding: '18px 0px',
      display:'inline-block',
      marginLeft: '-5px',
      '& .MuiFormControlLabel-root': {
        marginLeft: '-1px',
        padding: '6px 5px',
      },
    },
    payMethodCheckbox: {
      padding: 0,
      paddingRight: 24,
    },
    addButton: {
      marginLeft: 50,
      textTransform: 'uppercase',
      border: '2px solid #0B1941',
      borderRadius: '6px',
      color: '#0B1941',
      fontSize: 16,
      letterSpacing: '0.5px',
      '&.Mui-disabled': {
        border: '2px solid #CCCCCC',
        color: '#CCCCCC',
      },
      '& .MuiButton-label': {
        lineHeight: '18px',
      },
      display:'flex'
    },
    optionalText: {
      marginLeft: '50px',
      paddingTop: '8px',
      fontSize: '16px',
      color: '#9E9E9E',
      lineHeight: '18px',
      letterSpacing: '0.5px',
    },
    nextButton: {
      lineHeight: '18px',
      background: '#0B1941',
      color: '#fff',
      letterSpacing: '0.5px',
      minWidth: '140px',
      borderRadius: '6px',
      '&.Mui-disabled': {
        background: '#CCCCCC',
        color: '#ffffff',
      },
      '&:hover':{
          background:'#0B1941'
      }
    },
    editAccount: {
      marginLeft: 50,
      border: '1px solid #9E9E9E',
      borderRadius: '6px',
      color: '#4C4C4C',
      fontSize: 16,
      letterSpacing: '0.5px',
      lineHeight: '18px',
      display: 'flex',
      marginBottom: '24px',
      height: 62,
      width: 507,
      justifyContent: 'space-between',
      padding: '5px 19px 5px 29px',
    },
    overlapDiv:{
      position: "fixed",
      left: 0,
      top: 0,
      width: "100%",
      height: "100vh",
      zIndex: "5",
      background: "#000000",
      opacity: "0.45"
    },
    paymentPopup:{
      zIndex: "6",
      position: "fixed",
      background: "#FFFFFF",
      borderRadius: "8px",
      top: "53%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "70%",    
    },
    popupHeading:{
      float: "left",
      width: "100%",
      background: "#CCE4FF",
      borderRadius: "8px 8px 0px 0px",
      padding: "10px 25px",
      margin: "0",
      boxSizing: "border-box",
      "& h2":{
        color: "#0B1941",
        fontSize: "16px",
        float: "left",
        padding: "4px 0 0"
      }    
    },
  
    popupClose:{
      float: "right",
      cursor: "pointer",
      fontSize: "20px",
      margin: "2px 0 0"
    },
  
    popupInner:{
      float: "left",
      width: "100%",
      padding: "0",
      boxSizing: "border-box",  
    },
  
    inputBox:{
      float: "left",
      padding:"0px 8px",
      minHeight: "auto",
      margin:'8px 0px 20px',
      "& .MuiTextField-root":{
        width: "100%"
      },
      "& .MuiFormControl-root":{
        width: "100%", 
        margin: "0",     
      },
      "& input": {
        color: "#2B2D30",
        fontSize: "14px",      
        boxSizing: "border-box",
        borderRadius: "4px",
        height: "56px"
      },
      "& .MuiFormLabel-root":{
        fontSize: "16px"
      },
      "& .MuiSelect-root":{
        fontSize: "14px"
      },
      "& .MuiFormHelperText-root":{
        fontSize: "12px"
      }
    },
  
    multitBox:{
      float: "left",
      padding:"0px 8px",
      // padding: "10px 10px 0",
      margin:'8px 0px',
      // minHeight: "80px",
      "& input": {
        color: "#2B2D30",
        fontSize: "14px",      
        boxSizing: "border-box",
        borderRadius: "4px",
        height: "56px"
      },
      "& .MuiTextField-root":{
        width: "50%!important",
        padding: "0 5px",
        boxSizing: "border-box",
        margin: "0",
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
      },
      "& .MuiSelect-root":{
        fontSize: "14px"
      },
      "& .MuiFormHelperText-root":{
        fontSize: "12px"
      }
    },
  
    nameBox:{
      float: "left",
      padding:"0px 8px",
      // padding: "10px 10px 0",
      margin:'8px 0px',
      minHeight: "80px",
      "& .MuiTextField-root":{
        width: "100%"
      },
      "& input": {
        color: "#2B2D30",
        fontSize: "16px",      
        boxSizing: "border-box",
        borderRadius: "4px",
        height: "56px"
      },
      "& >":{
        width: "40%!important",
        padding: "0 5px",
        boxSizing: "border-box",
        float: "left",
        "&:nth-child(3n+0)":{
          paddingRight: "0",
          width: "40%!important",
          padding: "0 5px",
          boxSizing: "border-box",
          float: "left",
        },
        "&:nth-child(3n+2)":{
          float: "left",
          paddingRight: "0",
          width: "40%!important",
          padding: "0 5px",
          boxSizing: "border-box",
        },
        "&:first-child":{
          float: "left",
          paddingLeft: "0",
          width: "20%!important"
        }
      },
      "& .MuiFormLabel-root":{
        fontSize: "16px"
      },
      "& .MuiSelect-root":{
        fontSize: "14px"
      },
      "& .MuiFormHelperText-root":{
        fontSize: "12px"
      }
    },
  
    paypalNameBox:{
      float: "left",
      padding:"0px 8px",
      // padding: "10px 10px 0",
      margin:'8px 0px',
      minHeight: "80px",
      "& .MuiTextField-root":{
        width: "100%"
      },
      "& input": {
        color: "#2B2D30",
        fontSize: "16px",      
        boxSizing: "border-box",
        borderRadius: "4px",
        height: "56px"
      },
      "& >":{
        width: "40%!important",
        padding: "0 5px",
        boxSizing: "border-box",
        float: "left",
        "&:nth-child(3n+0)":{
          paddingRight: "0",
          width: "80%!important",
          padding: "0 5px",
          boxSizing: "border-box",
          float: "left",
        },
        "&:nth-child(3n+2)":{
          float: "left",
          paddingRight: "0",
          width: "80%!important",
          padding: "0 5px",
          boxSizing: "border-box",
        },
        "&:first-child":{
          float: "left",
          paddingLeft: "0",
          width: "20%!important"
        }
      },
      "& .MuiFormLabel-root":{
        fontSize: "16px"
      },
      "& .MuiSelect-root":{
        fontSize: "14px"
      },
      "& .MuiFormHelperText-root":{
        fontSize: "12px"
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
        "&.MuiButton-outlinedPrimary":{
          border: "1px solid #008CE6",
          color: "#008CE6"
        },
        "&.MuiButton-containedPrimary":{
          background: "#008CE6"
        }
      }
    },
    
    phoneBox:{
      float: "left",
      padding:"0px 8px",
      // padding: "10px 10px 0",
      margin:'8px 0px',
      minHeight: "80px",
      "& input": {
        color: "#2B2D30",
        fontSize: "14px",      
        boxSizing: "border-box",
        borderRadius: "4px",
        height: "56px"
      },
      "& .MuiTextField-root":{      
        padding: "0 5px",
        boxSizing: "border-box",
        width: "100%",
        "&.extinput":{
          float: "right",
          paddingRight: "0",
          width: "25%!important",
        },
        "&.phoneinput":{
          float: "left",
          paddingLeft: "0",
          width: "45%!important",
        },
        "&.countryPhoneCode":{
          float: "left",
          paddingLeft: "0",
          width: "30%!important",
        }
      },
      "& .MuiFormLabel-root":{
        fontSize: "14px"
      },
      "& .MuiSelect-root":{
        fontSize: "14px"
      },
      "& .MuiFormHelperText-root":{
        fontSize: "12px"
      }
    },
    singleCheckBox:{
      padding:'0px 10px 10px',
      alignItems:'center',
      display:'flex'
    },
    tooltipInfoIcon:{
      display: 'flex',
      alignItems: 'center',
      justifyContent:'flex-end',
     paddingRight:'12px'
    }
  });
  export default styles;
  