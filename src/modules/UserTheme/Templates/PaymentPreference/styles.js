const styles = (theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
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

  subContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "65px",
    background: "#FAFBFC",
  },

  navSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px 25px",
    background: "#FFFFFF",
    borderRadius: "0px",
    boxShadow: "0px 0px 3px rgb(0 0 0 / 14%)",
    width: "100%",
  },

  paymentHeading: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    width: "90%",
    justifyContent: "center",
  },
  headingText: {
    color: "#2B2D30",
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "28px",
  },
  emphasize: {
    fontWeight: "200px",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "25px",
    flexWrap: "wrap",
  },
  payeeImages: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    alignItems: "center",
    margin: "4px",
    width: "27%",
  },
  payeeImage: {
    maxWidth: "60px",
    height: "auto",
  },
  payeeLine: { marginTop: "-8px" },

  payeeImagesLabel: {
    fontSize: "12px",
    color: "#27AE60",
  },

  midContainer: {
    background: "#FFFFFF",
    borderRadius: "20px",
    width: "80%",
  },

  midContainerMobile: {
    width: "90%",
  },

  midContainerImgSecMobile: {
    width: "150% !important",
    marginLeft: "-9px",
  },

  midHeadingText: {
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "28px",
    color: "#000000",
  },

  tagContainer: {
    position: "relative",
  },

  tag: {
    background: "#CCE4FF",
    width: "64%",
  },

  skew: {
    background: "#CCE4FF",
    width: "20%",
    transform: "skewX(30deg)",
    position: "absolute",
    left: "59%",
    top: "0%",
    height: "100%",
  },
  skewSec: {
    left: "22%",
    width: "5%",
  },

  skewSecMobile: {
    left: "70%",
    width: "5%",
  },
  tagText: {
    fontSize: "10px",
    color: "#162D6E",
    padding: "3px",
  },

  paper: {
    background: "#FFFFFF",
    boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.14)",
    borderRadius: "5px",
  },

  midContainerImg: {
    width: "30%",
    height: "auto",
  },

  preferedImg: {
    width: "50%",
    height: "auto",
  },

  midContainerImgText: {
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: "28px",
    color: "#162D6E",
  },

  midPaymetText: {
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "10px",
    color: "#4C4C4C",
    width: "81%",
  },

  midContainerImgSec: {
    width: "75%",
    height: "auto",
  },

  midBoxWrapper: {
    display: "flex",
    padding: "8px",
  },
  midPaymetTextSec: {
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "10px",
    color: "#4C4C4C",
  },

  payeeBoxMobile: {
    width: "360px",
    margin: "0 auto",
    marginTop: "50px",
  },
  payeeHeadingMobile: { fontSize: "13px", padding: "4px 0px" },

  subContainerMobile: {
    boxShadow: "0px 2px 4px rgba(112, 146, 200, 0.25)",
    width: "360px",
    margin: "auto",
  },

  navSectionMobile: {},

  paymentHeadingMobile: {
    textAlign: "center",
  },
  headingTextMobile: {
    fontSize: "12px",
    color: "#2B2D30",
  },
  emphasizeMobile: {
    fontWeight: "100px",
  },

  imageContainerMobile: {},
  payeeImagesMobile: {},
  payeeImageMobile: { maxWidth: "50px", height: "auto" },
  payeeLineMobile: { maxWidth: "20px", marginTop: "-8px" },
  payeeImageLabelMobile: { fontSize: "10px" },
  formContainerMobile: {
    width: "90% !important",
  },

  formHeadingContainerMobile: {
    marginLeft: "-30px",
  },

  formHeadingMobile: {
    fontSize: "20px !important",
  },

  formHeadingTextMobile: {
    fontSize: "12px !important",
  },

  formItemContainerMobile: {
    marginLeft: "-30px",
    width: "125% !important",
  },

  formItemFormFieldContainerMobile: {},

  itemWidthMobile: { width: "48% !important" },
  itemWidthCodeMobile: { width: "33% !important" },
  itemWidthNumMobile: { width: "63% !important" },
  formItemFormFieldMobile: {},

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
  right: {},
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
