const styles = (theme) => ({
    root1: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      margin: "31px 48px 22px 48px",
      padding: "26px 30px",
      textAlign: "left",
      "& .MuiTextField-root": {
        width: "100%",
      },
      '& .MuiFormControlLabel-root .MuiFormControlLabel-label': {
        fontSize: "14px",
        fontWeight: '400',
        lineHeight: '16px'
      },
      '& .MuiFormControlLabel-root': {
        paddingLeft: '32px'
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
      width: "100%",
    },
  
    gridContainers: {
      margin: "15px 0",
      padding: "0px 10px",
    },
  
    gridPadding: {
      padding: "20px 0 40px",
    },
  
    b2bSectionHead: {
      marginTop: "20px",
    },
  
    b2bSectionSubHead: {
      marginBottom: "5px",
      marginTop: "7px",
    },
  
    importText: {
      margin: "8px 0px 0px 0px",
    },
  
    errorText2: {
      color: " #f44336",
      marginLeft: "40px",
      marginRight: "14px"
    },
  
    genralTitleBold: {
      fontSize: '20px',
      fontWeight: '400',
      lineHeight: '28px',
      marginBottom: '6px'
    },
    extraSpace:{
      marginTop: "16px"
    },
  
    panelHeading: {
      padding: '2px 0px',
      fontSize: '16px',
      marginTop: '5px',
      fontWeight: 400
    },
  
    mtTypo: {
      marginTop: '25px',
      marginBottom: '15px',
    },
  
    mediumBtn: {
      width: "130px",
      fontSize: "14px",
      borderRadius: "28px",
      backgroundColor: "#008ce6 !important",
      color: "#FFFFFF",
      minWidth: '115px !important',
      boxShadow:
        "0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2)",
      "&:hover": {
        backgroundColor: "#008ce6 !important",
      },
    },
  
    editIcon: {
      cursor: 'pointer',
    },
  
    controlLabel: {
      paddingLeft: "20px",
      '& .MuiFormControlLabel-label': {
        fontSize: "14px",
        fontWeight: '400',
        lineHeight: '16'
      }
    },
  
    nextBtn: {
      padding: "10px 48px",
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '18px',
      letterSpacing: '0.5px',
      height: '37px'
    },
  
    deleteIcon: {
      color: "#cb0d0d", cursor: 'pointer'
    },
  
    checkboxContainer: {
      '& .MuiOutlinedInput-input': {
        padding: '18px 18px',
      }
    },
  
    width60: {
      width: '80%'
    },
    width80: {
      width: '80%',
      marginBottom: '18px',
      paddingLeft: '38px',
    },
  
    margLeft: {
      marginLeft: '16px'
    },
  
    addFIeldButton:{
      // fontSize: '16px',
      // fontWeight: 400,
      // letterSpacing: '0.5px',
      // color: '#0b1941',
      // padding: '10px 20px',
      // // background: '#FFFFFF',
      // borderRadius: '5px',
      border: `2px solid ${theme.palette.button.primary} !important`,
      // border:'#FF0000',
      // margin: '-8px 4% 0 0 ',
      // '& .MuiButton-startIcon':{
      //   marginRight: '12px'
      // }
  },
  disabledLabel:{
    '& .MuiFormControlLabel-label.Mui-disabled':{
      color:'#222222'
    }
  }
  
  });
  
  export default styles;
  