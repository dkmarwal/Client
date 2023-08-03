const styles = (theme) => ({
  pmFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    fontSize: "7px",
    borderTop: "1px solid #CCCCCC",
    background: "#EFEFEF",
    padding: 8,
  },
  pmFooterMobile: {
    width: "360px",
    margin: "auto",
  },

  citiLogoContainer: {
    display: "flex",
    alignItems: "end",
  },
  citiLogoContainerMobile: {
    paddingTop: 4,
    display: "flex",
    justifyContent: "center",
    width: "100%",
    margin: "auto",
  },

  footerDataContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerDataContainerMobile: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  phoneNo: {
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "8px",
    lineHeight: "11px",
    alignItems: "center",
    color: "#4C4C4C",
  },
  phoneNoMobile: {
    width: "100%",
    display: "flex",
    margin: "3px 0",
    justifyContent: "center",
  },

  pdf: {
    display: "flex",
  },

  pdfText: {
    fontFamily: "Interstate",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "8px",
    lineHeight: "11px",
    alignItems: "center",
    color: "#2F80ED",
    marginRight: "25px",
  },
});
export default styles;
