const styles = (theme) => ({
    mainContainer: {
      display: "flex",
      flexDirection: "column",
      // marginTop: "50px",
    },
    payeeBox: {
      display: "grid",
      gridTemplateColumns: "auto 1fr auto auto",
      gridColumnGap: "10px",
      padding: "6px 4px",
      boxShadow: "0px 0px 20px -15px rgba(0, 0, 0, 0.25)",
      backgroundColor: "#FFFFFF",
    },
  
    LogoBox: {
      display: "flex",
    },
    LogoBoxMobile: {
      justifyContent: "space-Between",
      padding: "2px",
      width: "45px",
    },
    logo: {
      objectFit: "cover",
    },
    midBorder: { border: "1px solid #CCCCCC", margin: "0 5px" },
  
    payeeBoxMobile: {
      width: "360px",
      margin: "0 auto",
      marginTop: "50px",
    },
    payeeHeadingMobile: { fontSize: "13px", padding: "4px 0px" },
  
    subContainerD: {
      background: " #F2F4F7",
    },
  
    subContainerMobileD: {
      width: "360px",
      margin: "0 auto",
    },
  
    notificationBar: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      padding: "12px 70px 12px 68.5px",
      background: "#162D6E",
      justifyContent: "space-between",
    },
  
    notificationBarMobile: {
      width: "360px",
      margin: "0 auto",
      padding: "15px !important",
    },
  
    notificationBarText: {
      fontFamily: "Interstate",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "14px",
      lineHeight: "20px",
      color: "#FFFFFF",
    },
  
    notificationBarButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "75px",
      height: "32px",
      background: "#FFFFFF",
      border: "1px solid #162D6E",
      boxSizing: "border-box",
      borderRadius: "20px",
      fontSize: "10px",
      textAlign: "center",
      color: "#162D6E",
    },
    mobileAccordianCont: {
      marginTop: "20px",
      marginBottom: "20px",
    },
  
    mobileAccordian: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#FFFFFF",
      borderRadius: "2px",
      width: "90%",
      margin: "auto",
      marginTop: "15px",
    },
  
    mobileAccordianText: {
      fontFamily: "Interstate",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "16px",
      lineHeight: "20px",
      color: "#162D6E",
    },
  
    arc: {
      width: "100%",
      height: "100px",
      zIndex: -1,
      borderRadius: "0px 0px 70% 70%",
      background: "#8F9EC4",
    },
  
    boxContainer: {
      position: "relative",
      top: "-70px",
      marginLeft: "-2px",
      justifyContent: "center",
    },
  
    firstBox: {
      background: "#FFFFFF",
      boxSizing: "border-box",
      boxShadow: "inset 0px 0px 20px -8px #FFFFFF",
      borderRadius: "6px",
      boxShadow: "0px 0px 8px rgb(0 0 0 / 14%)",
    },
  
    secondBox: {
      background: "#FFFFFF",
      boxSizing: "border-box",
      boxShadow: "inset 0px 0px 20px -8px #FFFFFF",
      borderRadius: "6px",
      height: "100%",
    },
  
    boxHeading: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
    },
  
    payPalimageBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
    },
  
    payPalimage: {
      width: "20%",
      height: "auto",
    },
    starimage: {
      width: "10%",
      height: "45%",
      objectFit: "contain",
    },
  
    headingTextBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      // width:"100%"
    },
  
    headingText: {
      fontFamily: "Interstate",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "0.810rem",
      color: "#2B2D30",
    },
  
    editimage: {
      width: "80%",
      height: "55%",
      objectFit: "contain",
    },
  
    boxData: {},
  
    boxDataHeadingText: {
      fontFamily: "Interstate",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "0.55rem",
      lineHeight: "16px",
      color: "#828282",
    },
  
    boxDataText: {
      fontFamily: "Interstate",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "0.85rem",
      lineHeight: "16px",
      color: "#2B2D30",
    },
  
    paymentHistoryContainer: {
      width: "82%",
      margin: "auto",
      boxShadow: "0px 0px 8px rgb(0 0 0 / 14%)",
      borderRadius: "10px",
      background: "#FFFFFF",
      marginBottom: "50px",
    },
  
    paymentHistoryHeader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginLeft: "-14px",
    },
  
    dataMargin: {
      marginLeft: "12px",
    },
  
    paymentHistoryText: {
      fontFamily: "Interstate",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "12px",
      lineHeight: "28px",
      color: "#2B2D30",
    },
  
    imageGroup: {
      fontFamily: "Interstate",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "8px",
      lineHeight: "16px",
      textAlign: "right",
      color: "#0B1941",
    },
  
    tableContainer: {
      background: "#FFFFFF",
      border: "1px solid #FFFFFF",
      boxSizing: "border-box",
      borderRadius: "10px",
    },
  
    tableHeaderText: {
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: "10px",
      lineHeight: "16px",
      color: "#000000",
    },
  
    tableDataText: {
      display: "flex",
  
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "11px",
      lineHeight: "16px",
      alignItems: "center",
      color: "#4C4C4C",
    },
  
    payImg: {
      marginRight: "5px",
      width:'14px'
    },
  
    tableRow: {
      background: "#FFFFFF",
      borderTop: "0.5px solid #BDBDBD",
    },
    detailsTextContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
  
    detailsTextContainerMobile: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    detailsTextFlexMob: {
      width: "100%",
      justifyContent: "space-between",
    },
    detailsTextFlexMobLast: {
      width: "92%",
      marginTop: "12px",
      marginBottom: "5px",
      justifyContent: "end",
    },
  
    detailsText: {
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "9px",
      lineHeight: "11px",
      color: "#4C4C4C",
      display: "flex",
      alignItems: "center",
    },
  
    detailsTextFlex: {
      display: "flex",
      alignItems: "center",
    },
    pmFooter: {
      padding: "4px 8px 15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      fontSize: "7px",
      borderTop: "1px solid #CCCCCC",
      background: "#EFEFEF",
    },
    pmFooterMobile: {
      width: "360px",
      margin: "auto",
    },
    left: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
    },
    cityText: { fontSize: "8px", fontWeight: "bold", marginLeft: "10px" },
    firstMobile: {
      margin: "auto",
      paddingLeft: "20px",
    },
    copyrightMobile: {
      fontSize: "8px",
      fontWeight: "bold",
      margin: "20px 40px",
      paddingRight: "30px",
    },
    first: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px 20px",
    },
    pmFooterIcons: {
      marginRight: "25px",
      fontSize: "8px",
      fontWeight: "bold",
    },
    copyRight: { fontSize: "8px", fontWeight: "bold", marginTop: "10px" },
  });
  export default styles;
  