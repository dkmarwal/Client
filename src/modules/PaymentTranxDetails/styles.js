export const styles = (theme) => ({
  root: {
    background: '#fff',
    lineHeight: 2,
    padding: '20px 0px 50px 0px',
    '& p': {
      lineHeight: 2,
    },
  },
  labelHeading: {
    padding: '32px 0 8px 0',
    fontSize: 16,
    color: 'rgba(0,0,0,0.87)',
  },
  boxSpace: {
    padding: 15,
  },
  iconImage: {
    alignItems: 'center',
    display: 'flex',
    color: theme.palette.primary.grey,
  },
  bigText: {
    fontSize: 22,
    color: '#4C4C4C',
    marginTop: 14,
  },
  subText: {
    fontSize: 20,
    margin: '20px 0',
  },

  flagText: {
    fontSize: 16,
    textTransform: 'uppercase',
    padding: '0 10px 0 0'
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c4c4c',
    '&.isPaymentCancelled': {
      color: '#CCCCCC'
    },
    //paddingBottom: 16
  },
  subHeading: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#000000',
    wordBreak: 'break-word',
    '&.isPaymentCancelled': { color: '#9E9E9E' }
  },
  infoText: {
    paddingLeft: 8
  },
  paymentGridCont: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  dividerBorder: {
    backgroundColor: '#8F9EC4',
    width: '100%',
    marginTop: '24px'
  },
  dividerRemittance: {
    backgroundColor: '#8F9EC4',
    width: '100%',
    marginTop: '24px',
    marginBottom: '24px'
  },
  keyLabel: {
    fontSize: 14,
    color: '#4C4C4C'
  },
  valueLabel: {
    fontSize: 14,
    color: '#000000'
  },
  cardDetailsBox: {
    paddingTop: theme.spacing(4)
  },
  imageText: {
    position: 'absolute',
    bottom: '10%',
    left: '6%'
  },
  editCancelBtn: {
    background: 'none',
    color: theme.palette.primary.main,
    boxShadow: 'none',
    textTransform: 'capitalize',
    '&:hover': {
      background: 'none',
      boxShadow: 'none'
    }
  },
  ccTabPanel: {
    background: '#FFF',
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  CCdivider: {
    backgroundColor: '#8F9EC4',
    marginTop: '24px',
    marginBottom: '24px',
    height: '1px'
  },
  payeeText: {
    fontSize: 24,
    color: '#4C4C4C'
  },
  oddEvenBox: {
    padding: '16px 40px',
    '&:nth-child(even)': {
      background: "#F4F4F4"
    }
  },
  ccheading: {
    color: '#162D6E'
  },
  ccTabs: {
    color: '#0B1941'
  },
  cardNo: {
    fontSize: 24,
    color: '#0B1941'
  },
  invoiceBox: {
    marginTop: '-24px',
    marginBottom: '-24px'
  },
  table: {
    borderRadius: theme.spacing(1)
  },
  totalAmountRow: {
    background: 'linear-gradient(180deg, #C4C4C4 0%, rgba(196, 196, 196, 0) 100%)'
  },
  searchtextField: {
    background: '#FFF',
    borderRadius: '4px',
    fontSize: 12,
    '& .MuiInputBase-root': {
      height: 30
    }
  },
  paginationRow: {
    borderTop: '1px solid rgba(224, 224, 224, 1)'
  },
  addBtn: {
    border: '2px solid #0B1941',
    borderRadius: 6
  },
  btnInfoText: {
    fontSize: theme.spacing(1.5),
    fontStyle: 'italic',
    color: '#4C4C4C'
  },
  invoiceDateInput: {
    border: 'none',
    height: 30,
    borderRadius: theme.spacing(0.5),
    padding: '0 14px',
    fontSize: 12
  },
  emailChip: {
    '& .MuiAutocomplete-tag': {
      background: '#F4F4F4',
      fontSize: 14,
      color: '#4C4C4C'
    }
  },
  VerticalTree: {
    position: 'relative',
  },
  verticalLineTB: {
    background: '#aaa',
    width: '1px',
    height: '64px',
    position: 'absolute',
    right: '35px',
  },
  verticalLineLR: {
    background: '#aaa',
    width: '27px',
    height: '1px',
    position: 'absolute',
    top: '40px',
    right: '8px',
  },
  VerticalTreeIcon: {
    position: 'relative',
    height: '100%',
    '& span': {
      display: 'flex',
      padding: '3px',
      border: '2px solid',
      borderRadius: "50%",
      width: '32px',
      height: '32px',
    }
  },
  VerticalTreeIconLine: {
    position: 'absolute',
    top: '32px',
    width: '2px',
    height: 'calc(100% - 0px)',
    background: "#0B1941",
  },

  cardTrailDetailWrap: {
    paddingBottom: '32px',
  },

  cardTrailDetailCol: {
    '& p': {
      fontStyle: 'italic',
      textTransform: 'uppercase',
      fontSize: '12px',
      paddingTop: '8px',
    }
  },
  linkText: {
    textDecoration: 'underline',
    cursor: 'pointer'
  },
  activitykey: {
    fontSize: 14,
    color: '#4C4C4C',
    paddingRight: '5px'
  },
  breakWord: {
    wordBreak: 'break-word'
  },
  crossText: {
    color: '#000000',
    fontSize: '14px',
    textDecoration: 'line-through'
  },
  modifiedBox: {
    paddingBottom: theme.spacing(1)
  },
  errorText: {
    fontSize: theme.spacing(1.5),
    fontStyle: 'italic',
    color: 'red'
  },

  collapsBox:{    
    position: 'relative',
    display: 'block',
    clear: 'both',    
    "& span":{
      float: 'right',
      margin: '-15px 20px 0 0',
      background: '#F4F4F4',
      color: '#4C4C4C',
      padding: '4px 17px',
      borderRadius: '20px',
      fontSize: '14px',
      position: 'relative',
      zIndex: 2,
      width: '45px',
      cursor: 'default',
      textAlign: 'right'
    },
    "& label":{
      background: '#8F9EC3',
      position: 'absolute',
      width: "94%",
      left: '3%',
      top: 0,
      height: 1,
    }     
  },
  header:{
    fontSize:16,
    fontWeight:"400",
    color:"#0B1941"
  },
  firstCollapsBox:{    
    clear: 'both',
    display: 'inline-block',
    position: 'relative',    
    textAlign: 'center', 
    margin: '20px 0 10px',
    width: '100%',
    "& span":{
      top: '-20px',
      color: '#4C4C4C',
      float: 'none',
      width: 'auto',
      cursor: 'default',
      margin: '0 20px 0 0',
      display: 'inline-block',
      padding: '10px 90px',
      zIndex: '2',
      position: 'relative',
      fontSize: '16px',
      background: '#D9D9D9',
      borderRadius: '20px',
      lineHeight: '20px',
    },
    "& label":{
      background: '#8F9EC3',
      position: 'absolute',
      width: "94%",
      left: '3%',
      top: 0,
      height: 1,
    }      
  },

  addPayeePopup:{
    textAlign: 'center',
    "& .MuiDialog-paper":{
      padding: '20px',
      borderRadius: '10px'
    },
    "& #alert-dialog-title":{
      paddingBottom: 0,
      "& h2":{
        color: "#0B1941",
        fontSize: 24
      }
    },
    "& #alert-dialog-description":{
      color: '#4C4C4C',
      fontSize: 16,
      lineHeight: '23px',
      padding: '0',
      "& h3":{
        margin: '30px 0 5px',
        textDecoration: 'none'
      },
      "& h4":{
        color: '#9E9E9E'
      },
      "& h5":{
        color: '#EB5757',
        margin: '20px 0',
        clear: 'both',
        "& svg":{
          display: 'inline-block',
          margin: '0 10px -8px 0'
        }
      }
    },
    "& .MuiDialogActions-root button":{
      minWidth: 120
    }
  }

});
