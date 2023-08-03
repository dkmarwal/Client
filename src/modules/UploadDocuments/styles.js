const styles = (theme) => ({
  documentArea: {
    padding: "0 20px",
  },
  documenHeadingTxt: {
    padding: "0 0 20px",
    fontSize: 24,
    color: "#2B2D30",
    fontWeight: "400",
  },
  documenParaTxt: {
    padding: "0 0 20px 0",
    fontSize: 15,
  },
  uploadInput: {
    display: "none",
  },
  docUploadBox: {
    float: "left",
    width: "100%",
    "&[disabled]": {
      opacity: "0.4",
      pointerEvents: "none",
    },
  },

  uploadBtn: {
    padding: "5px 16px",
  },

  fileName: {
    float: "left",
    width: "100%",
    margin: "8px 20px 20px 0",
    fontSize: "14px",
    fontStyle: "italic",
    color: "#4C4C4C",
    padding: "0",
    "& span": {
      float: "left",
    },
  },

  removeFile: {
    float: "left",
    cursor: "pointer",
    margin: "0 0 0 10px",
    fontSize: "21px",
    color: "#000",
  },

  ORBox: {
    float: "left",
    width: "100%",
    textAlign: "center",
    margin: "30px 0 15px",
    position: "relative",
    "& h1": {
      width: "50px",
      border: "1px solid #8F9EC3",
      height: "50px",
      margin: 0,
      display: "inline-block",
      padding: 0,
      zIndex: "1",
      position: "relative",
      fontSize: "14px",
      background: "#fff",
      textAlign: "center",
      fontWeight: "400",
      lineHeight: "51px",
      borderRadius: "50%",
    },
    "& span": {
      position: "absolute",
      top: "50%",
      left: "0",
      width: "100%",
      height: "1px",
      background: "#8F9EC3",
    },
  },

  editorCheckBox: {
    float: "left",
    width: "100%",
    margin: "0 0 10px",
    "& span": {
      color: "#4C4C4C",
    },
  },

  editorBoxArea: {
    float: "left",
    width: "100%",
    position: "relative",
    "&[disabled]": {
      opacity: "0.4",
      pointerEvents: "none",
    },
    "& #htmlEditor": {
      position: "relative",
    },
    "& .jodit-editor__resize": {
      width: "10px",
      position: "absolute !important",
      bottom: "-4px",
      right: "3px",
      display: "none",
    },
  },

  dialogBox: {
    color: "#000000",
    textAlign: "center",
    "& .MuiDialog-paper": {
      padding: "30px",
      maxWidth: "410px",
      position: "relative",
    },
    "& .infoIcon": {
      display: "block",
      margin: "0 auto 15px",
      fontSize: "30px",
    },
    "& p": {
      color: "#000",
      fontSize: "16px",
      lineHeight: "24px",
      textAlign: "left",
    },
    "& .closeBtn": {
      top: "10px",
      right: "10px",
      position: "absolute",
      padding: "5px",
      width: "auto",
      minWidth: "auto",
    },
    "& .OKBtn": {
      float: "none",
      display: "block",
      margin: "0 auto",
      color: "#008CE6",
    },
    "& .MuiDialogContent-root": {
      paddingBottom: "0",
    },
    "& .MuiDialogActions-root": {
      padding: 0,
    },
  },
});
export default styles;
