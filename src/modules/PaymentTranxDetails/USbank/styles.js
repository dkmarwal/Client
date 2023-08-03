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
    color: '#4c4c4c',
    '&.isPaymentCancelled':{
      color: '#CCCCCC',
    }
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
    fontSize: 36,
  },
  subText: {
    fontSize: 20,
    margin: '20px 0',
  },

  flagText: {
    fontSize: 16,
    textTransform: 'uppercase',
    padding: '0 10px 0 0',
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4c4c4c',
    '&.isPaymentCancelled': {
      color: '#CCCCCC',
    },
  },
  subHeading: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#000000',
    wordBreak: 'break-word',
    '&.isPaymentCancelled': { color: '#9E9E9E' },
  },
  descText:{
    fontSize: '12px',
    color: '#9E9E9E',
    width: '151%'
  },
  infoText: {
    paddingLeft: 8,
  },
  dividerBorder: {
    backgroundColor: '#8F9EC4',
    width: '100%',
    marginTop: '24px',
  },
  dividerRemittance: {
    backgroundColor: '#8F9EC4',
    width: '100%',
    marginTop: '24px',
    marginBottom: '24px',
  },
  cancelIcon: {
    width: '24px',
    height: '24px',
    right:0,
    float:'right',
    cursor:'pointer'
  },
  cancelText: {
    fontSize: '16px',
    color: '#0B1941',
    letterSpacing: '0.5px',
    marginLeft: '8px',
  },
  cancelItem: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    paddingLeft: theme.spacing(1.5),
  },
  cancelDiv: {
    justifyContent: 'space-between',
    marginTop: theme.spacing(4),
  },
  addBoxIcon: {
    width: '24px',
    height: '24px',
    cursor: 'pointer',
  },
  cancelContainer: {
    width: '100%',
  },
  cancelAlertText: {
    color: '#E02020',
    fontSize: '15px',
    lineHeight: '18px !important',
    fontWeight: 'normal',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '8px'
  },
  cancelAlertItem: {
    display: 'flex',
  },
  cancelAlertContainer: {
    justifyContent: 'space-between',
    width: '100%',
    background: '#F4F4F4',
    border: '1px solid #E02020',
    borderRadius: '4px',
    paddingLeft: '12px',
    paddingRight: '12px',
    minHeight: '42px',
    alignItems: 'center',
    marginTop: '35px',
    display:'flex'
  },
  cancelReasonTitle: {
    color: '#2B2D30',
    lineHeight: '20px',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(4),
  },
  cancelReasonContainer: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
  },
  plusMinusIcon: {
    paddingRight: '12px',
  },
  radioLabels: {
    '& .MuiIconButton-label': {
      '& .MuiSvgIcon-root': {
        width: 24,
        height: 24,
      },
    },
    '& .MuiFormControlLabel-label': {
      color: '#2B2D30',
      lineHeight: '18px',
      fontSize: '16px',
    },
    '& .MuiRadio-colorSecondary.Mui-checked': {
      color: '#008CE6',
    },
  },
  radioLegend: {
    lineHeight: '20px',
    color: '#2B2D30',
  },
  cancelPaymentButtons: {
    margin: theme.spacing(2),
    borderRadius: '6px',
  },
  otherReasonInput: {
    width: '328px',
    maxWidth: '100%',
    marginLeft: '48px',
    marginBottom: '16px',
    borderRadius: '4px',
    color: '#9E9E9E',
    fontStyle: 'italic',
  },
  iconColor: {
    color: '#0B1941',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
  },
  infoIcon: {
    width: '24px',
    height: '24px',
  },
  paymentCancelledMsg: {
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(2),
    wordBreak:'break-all',
  },
  cancelledReasonMsg: {
    color: '#E02020',
    marginLeft:theme.spacing(-1.5),
    '&.MuiTypography-root':{
      lineHeight:1.5,
    },
    textAlign:'justify'
  },
  paymentGridCont: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  infoIconGridItem:{
    justifyContent:'center',
    alignItems:'center',
    display:'flex'
  }
});
