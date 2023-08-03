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
    fontWeight: "600px !important",
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
  payeeLine: { maxWidth: "90px", marginTop: "-8px" },

  payeeImagesLabel: {
    fontSize: "12px",
    color: "#9E9E9E",
  },

  payeeImageLabelMobile: { fontSize: "10px" },

  formContainer: {
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    background: "#FFFFFF",
    borderRadius: "20px",
    marginTop: "25px",
    padding: "16px 50px",
    width: "80%",
  },
  formHeadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
  },
  formHeading: {
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "22px",
    color: "#0B1941",
  },
  formHeadingText: {
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "10px",
    color: "#4C4C4C",
  },
  formItemContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "90%",
    marginTop: "20px",
  },
  formItemFormFieldContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formItemLabelContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: "10px",
  },
  formItemFormField: {
    border: "1px solid #9E9E9E",
    boxSizing: "border-box",
    borderRadius: "4px",
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "10px",
    color: "#2B2D30",
    padding: "10px 10px",
    marginBottom: "18px",
    width: "100%",
  },
  itemWidth: { width: "48% !important" },
  itemWidthCode: { width: "22% !important" },
  itemWidthNum: { width: "74% !important" },

  formButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  formButton: {
    padding: "6px 36px",
    background: "#8F9EC4",
    borderRadius: "100px",
  },
  formButtonText: {
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    color: "#FFFFFF",
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
    fontWeight: "600px !important",
  },

  imageContainerMobile: {},
  payeeImagesMobile: {},
  payeeImageMobile: { maxWidth: "50px", height: "auto" },
  payeeLineMobile: { maxWidth: "20px", marginTop: "-8px" },

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
    width: "90%",
  },

  formItemContainerMobile: {
    marginLeft: "-30px",
    width: "125% !important",
  },
  iconAlignmentInfo: {
    position: "absolute",
    top: "9px",
    right: "-23px",
  },

  formItemFormFieldContainerMobile: {},

  itemWidthMobile: { width: "48% !important" },
  itemWidthCodeMobile: { width: "33% !important" },
  itemWidthNumMobile: { width: "63% !important", padding: "4px" },
  formItemFormFieldMobile: {},
});
export default styles;
