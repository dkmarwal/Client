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
      lineHeight: '16px',
      color: '#FFFFFF',
    },
    '& .MuiFormControlLabel-root': {
      paddingLeft: '20px'
    }
  },

  genralTitleBold: {
    fontSize: '24px',
    fontWeight: '400',
    lineHeight: '28px',
    marginBottom: '6px'
  },

  mtTypo: {
    marginTop: '25px',
    marginBottom: '15px',
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

  margLeft: {
    marginLeft: '16px'
  },

  bold: {
    fontWeight: 600,
    fontSize: '16px',
    marginTop: '10px'
  },

  fileBtnGroup: {
    border: 'solid 1px #CCCCCC !important',
    '& .MuiToggleButtonGroup-grouped': {
      padding: '8px 24px !important',
      color: 'rgb(25, 118, 210) !important',
      width: '60px !important',
      border: 'none',
      textTransform: 'capitalize',
    },
    '& .Mui-selected': {
      backgroundColor: 'rgb(25, 118, 210) !important',
      color: '#fff !important',
      margin: '2px !important',
      borderRadius: '4px 4px !important',
    },
    '& .MuiToggleButton-root.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.12) !important'
    }
  },

  checkboxStyle: {
    '&.MuiGrid-spacing-xs-4 > .MuiGrid-item': {
      padding: '16px 0 !important',
    },
    '& .MuiSvgIcon-root': {
      color: '#fff',
    }
  },

  checkClass: {
    height: "18px",
    width: "18px",
  },

  kboxStyle: {
    background: 'rgb(25, 118, 210) !important',
    color: '#fff',
    cursor: 'pointer',
    margin: '0px 18px',
    padding: '3px 0',
    textAlign: 'left',
    fontWeight: 'bold',
    lineHeight: '22px',
    borderRadius: '4px',
    '& .MuiFormControlLabel-root':{
      display: 'block',
      padding: '0',
      paddingLeft: '20px',
      width: '100%',
    },
    '& .MuiTypography-root.MuiFormControlLabel-label':{
      marginLeft: '25%'
    }
  }

});

export default styles;
