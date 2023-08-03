import { CenterFocusStrong } from "@material-ui/icons";

const styles = (theme) => ({
  tabClasses: {
    borderBottom: "1px solid",
  },
  paymentsTabContainer: {
    fontSize: "12px",
    fontWeight: "bold",
  },
  searchRoutingText: {
    color: "#008CE6",
    display: "flex",
    fontSize: "0.75rem",
    paddingTop: theme.spacing(0.5),
    textDecoration: "underline",
  },
  indicator: {
    color: theme.palette.secondary.main,
    borderRadius: "5px",
    textTransform: "capitalize",
  },
  cellHeading: {
    fontSize: "16px",
    borderBottom: "none",
    width: "300px",
  },
  cell: {
    borderBottom: "none",
  },
  validationStyle: {
    color: "rgba(127, 127, 127, 0.5) !important",
    borderBottom: "none",
  },
  value: {
    color: theme.palette.text.black,
    fontSize: "14px",
    letterSpacing: "0.44px",
    wordBreak: "break-word",
  },
  key: {
    color: theme.palette.text.black,
    fontSize: "14px",
    fontWeight: "bold",
  },
  validationDone: {
    color: "#008CE6",
    fontSize: "14px",
    letterSpacing: "0.25px",
    marginLeft: "10px",
    verticalAlign: "text-bottom",
  },
  validationPending: {
    color: "#282828",
    fontSize: "14px",
    letterSpacing: "0.25px",
    marginLeft: "10px",
    verticalAlign: "text-bottom",
  },
  smallIcon: {
    width: "20px",
    height: "24px",
  },
  validationStatusIcon: {
    padding: "1px",
    color: "red",
    margin: "-2px",
    width: "20px",
    height: "14px",
  },
  validationLastUpdated: {
    color: "gray",
  },
  details: {
    fontSize: "14px",
    width: "100%",
  },
  b2cProfileCircle: {
    fontSize: "48px",
    textAlign: "center",
    margin: "0 auto",
    borderRadius: "100%",
    color: "rgba(0,0,0,0.87)",
    fontWeight: 500,
    height: 100,
    width: 100,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
  },
  circleContact: {
    padding: "10px",
    fontWeight: "500",
    width: "43px",
    borderRadius: "50%",
    marginRight: "10px",
    verticalAlign: "middle",
  },
  vendorName: {
    fontSize: "24px",
    textAlign: "center",
    fontWeight: "500",
    margin: "14px 0 0 0",
    wordBreak: "break-word",
  },
  contactIcons: {
    fontSize: "10px",
    marginRight: "10px",
  },
  card: {
    borderRadius: 0,
    boxShadow:
      "0 6px 10px 0 rgba(0,0,0,0.07), 0 1px 18px 0 rgba(0,0,0,0.06), 0 3px 5px -1px rgba(0,0,0,0.1)",
  },
  iconBtn: {
    width: "30px",
    height: "40px",
  },
  icon: {
    width: "21px",
    position: "relative",
    top: "14px",
    left: "10px",
  },
  overflowAuto: {
    overflow: "visible",
    height: "28rem",
  },
  gapHorizontal: {
    margin: "0 5px",
  },
  detailsView: {
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  panel: {
    backgroundColor: " #f6f6f6 !important",
    borderBottom: "3px solid #1e4564",
    boxShadow: "none !important",
    color: "#1e4564",
    padding: "5px 10px 5px 0",
    margin: "16px 0 !important",
  },
  payment_icon: {
    verticalAlign: "text-bottom",
    width: 24,
    height: 24,
  },
  remCheckbox: {
    padding: "20px",
  },
  btnContainer: {
    padding: "16px 25px 25px 16px",
    display: "block",
    float: "left",
  },
  btnSave: {
    minWidth: 90,
    border: "2px solid #0B1941 !important",
    fontSize: "14px !important",
    boxSizing: "border-box",
  },
  btnDisabled: {
    padding: "10px 30px",
    height: "35px",
    border: `1px solid #F2F2F2`,
    boxShadow: "none",
    backgroundColor: `${theme.palette.background.active} !important`,
    color: theme.palette.primary.grey,
  },
  icon_btn: {
    marginRight: "15px",
    cursor: "pointer",
  },
  checkIconClass: {
    fontSize: "20px",
    marginRight: "5px",
    position: "relative",
    bottom: "5px",
  },
  toolTipClass: {
    backgroundColor: theme.palette.primary.lightGrey,
    fontWeight: "normal",
    color: theme.palette.text.black,
  },
  showTooltip: {
    backgroundColor: theme.palette.background.header,
    fontWeight: "normal",
    color: theme.palette.text.black,
  },
  paymentTitle: {
    color: "#0B1941",
    fontSize: "16px",
    lineHeight: "20px",
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
  },
  remInfo: {
    color: "rgba(0,0,0,0.87)",
    fontSize: "16px",
    fontWeight: "normal",
    padding: "0 16px",
  },
  showText: {
    color: "#008CE6",
    fontSize: "14px",
    fontWeight: "bold",
    paddingLeft: theme.spacing(1),
  },
  expansionDetails: {
    borderTop: "1px solid #E2E2E2",
    borderBottom: "1px solid #E2E2E2",
    wordBreak: "break-word",
    paddingTop: theme.spacing(2),
  },
  infoKey: {
    paddingRight: "10px",
    color: "#2B2D30",
    fontSize: "14px",
    lineHeight: "19px",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
  },
  infoValue: {
    color: "#2B2D30",
    fontSize: "14px",
    lineHeight: "19px",
    wordBreak: "break-word",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  tokenType: {
    color: "#2B2D30",
    fontSize: "14px",
    lineHeight: "19px",
    wordBreak: "break-word",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
    paddingRight: theme.spacing(2),
    "&:first-letter": {
      textTransform: "uppercase",
    },
  },
  tokenStatus: {
    color: "#2B2D30",
    fontSize: "14px",
    lineHeight: "19px",
    wordBreak: "break-word",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(1),
    "&:first-letter": {
      textTransform: "uppercase",
    },
  },
  gridItem: {
    padding: "10px 12px 0 !important",
  },
  errorMsg: {
    color: "#E03617",
    padding: "3px",
    paddingTop: "2px",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    lineHeight: "19px",
  },
  lnk: {
    textDecoration: "underline !important",
    wordBreak: "break-word",
  },
  ctaIcons: {
    width: "24px",
    height: "24px",
  },
  ctaIconsCont: {
    cursor: "pointer",
    display: "inline-flex",
    marginBottom: theme.spacing(2),
  },
  formControlLabel: {
    backgroundColor: "#ffffff",
  },
  formControl: {
    margin: theme.spacing(1),
    width: "100%",
  },
  paymentPreferenceDiv: {
    height: 30,
    borderRadius: "6px",
    background: "#CBE4FF",
    float: "right",
    width: "230px",
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  paymentPreferenceDetails: {
    borderTop: "1px solid #CBE4FF",
    borderBottom: "1px solid #CBE4FF",
    wordBreak: "break-word",
    borderRadius: "6px",
  },
  paymentPrefText: {
    color: "rgba(0,0,0,0.87)",
    fontSize: "12px",
  },
  paymentPreferenceInnerDiv: {
    display: "inline-flex",
    alignItems: "center",
    margin: "auto",
  },
  paymentTitleOuterGrid: {
    display: "flex",
    justifyContent: "space-between",
  },
  preferenceIconsDiv: {
    float: "right",
    display: "flex",
    alignItems: "center",
  },
  remittanceDeliveryMode: {
    float: "left",
    color: "#2B2D30",
    fontSize: "16px",
    width: "247px",
  },
  paymentTitleOuterCont: {
    display: "flex",
    alignItems:"center"
  },
  ctaText: {
    paddingLeft: theme.spacing(0.4),
  },
  remittanceCheckbox: {
    top: "0px !important",
  },
  remittanceOuterGrid: {
    display: "flex",
  },
  remittanceInfoHeading: {
    color: "#0B1941",
    fontSize: "16px",
    fontWeight: 400,
    paddingBottom: theme.spacing(2.5),
  },
  remittanceInfoOuterGrid: {
    padding: theme.spacing(2, 1),
  },
  preferredAccInfoCont: {
    paddingBottom: theme.spacing(3.5),
  },
  preferredAccInfoHeading: {
    fontSize: "14px",
    color: "#2B2D30",
  },
  preferredAccInfoData: {
    fontSize: "14px",
    color: "#2B2D30",
    paddingLeft: theme.spacing(1),
  },
  emailTextField: {
    paddingLeft: theme.spacing(1),
    "& .MuiFormControl-root": {
      width: "100%",
    },
    "& .MuiInputLabel-outlined.MuiInputLabel-shrink": {
      color: "#000000",
    },
  },
});

export default styles;
