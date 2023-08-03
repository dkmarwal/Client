const styles = (theme) => ({
  SideBarBox: {
    "& h3": {
      color: "#000000",
      fontSize: "14px",
      lineHeight: "20px",
      paddingBottom: "15px",
      borderBottom: "1px solid #d9d9d9",
      marginBottom: "15px",
    },
    "& h1": {
      color: "#000000",
      fontSize: "20px",
      lineHeight: "22px",
      paddingBottom: "15px",
    },
    "& .MuiFormHelperText-root.Mui-error": {
      fontSize: "12px",
    },
  },
  logoBox: {
    position: "relative",
    borderBottom: "1px solid #d9d9d9",
    paddingBottom: "25px",
    "& #icon-button-file": {
      display: "none",
    },
    "& h1": {
      "& svg": {
        fontSize: "18px",
        display: "inline-block",
        margin: "0 0 -4px 8px",
        cursor: "pointer",
      },
    },
    "& h2": {
      color: "#f44336",
      fontSize: "12px",
      fontWeight: "normal",
    },

    "& .logoHolder": {
      width: "101px",
      margin: "0 auto",
      position: "relative",
    },
  },

  logoBoxCircle: {
    border: "1px solid #d9e7f3",
    height: "101px",
    width: "101px",
    borderRadius: "50%",
    boxSizing: "border-box",
    textAlign: "center",
    position: "relative",
    margin: "0 auto",
    display: "block",
    cursor: "pointer",
    "& p": {
      paddingTop: "40%",
      fontSize: "14px",
    },
    "& img": {
      display: "block",
      margin: "40px auto 0",
      maxWidth: "90%",
      height: "auto",
      maxHeight: "20px",
      width: "auto",
    },
  },

  cameraBtn: {
    position: "absolute",
    right: "-7px",
    bottom: "2px",
    "& > span": {
      border: "1px solid #d9e7f3",
      borderRadius: "50%",
      padding: "6px",
    },
    "& svg": {
      fontSize: "15px",
    },
  },

  logoCloseBtn: {
    position: "absolute",
    right: "0",
    top: "0",
    cursor: "pointer",
    "& svg": {
      fontSize: "26px",
      border: "1px solid #d9e7f3",
      borderRadius: "50%",
      padding: "6px",
    },
  },

  welcomeTxtBox: {
    float: "left",
    width: "100%",
    margin: "30px 0 0",
    "& h1": {
      color: "#000",
      fontSize: "20px",
      padding: "0",
      margin: "0 0 6px",
    },
    "& .MuiTextField-root": {
      width: "100%",
      marginBottom: "2px",
    },
  },

  welcomeTxtWordCount: {
    float: "left",
    width: "100%",
    color: "#ccc",
    fontSize: "12px",
  },

  colorThemeBox: {
    float: "left",
    width: "100%",
    margin: "20px 0 15px",
    paddingBottom: "15px",
    borderBottom: "1px solid #d9d9d9",
    "& h1": {
      color: "#000",
      fontSize: "18px",
      padding: "0",
      margin: "0 0 10px",
      "& svg": {
        float: "right",
        fontSize: "22px",
        margin: "2px 5px 0",
      },
      "& label": {
        color: "#999",
        fontStyle: "italic",
        float: "right",
        fontSize: "12px",
        margin: "1px 7px 0 0",
      },
      "& span": {
        color: "#008CE6",
        fontSize: "12px",
        float: "right",
        textDecoration: "underline",
        margin: "1px 7px 0 0",
        cursor: "pointer",
      },
    },
  },

  themeBoxContainer: {
    float: "left",
    width: "100%",
  },

  themeBox: {
    float: "left",
    width: "46%",
    margin: "2%",
    borderRadius: 2,
    cursor: "pointer",
    border: "1px solid #9E9E9E",
    padding: "8px",
    textAlign: "center",
    height: "40px",
    position: "relative",
    "& span": {
      float: "none",
      width: "21px",
      height: "21px",
      borderRadius: "50%",
      border: "1px solid #6a6a6a",
      margin: "0 -5px 0 0",
      position: "relative",
      zIndex: "3",
      display: "inline-block",
      "&+span": {
        zIndex: "2",
        "&+span": {
          zIndex: "1",
        },
      },
    },
    "& p": {
      padding: "3px",
      fontSize: "14px",
      clear: "both",
      display: "block",
    },
    "& img": {
      maxWidth: "100%",
      borderRadius: 4,
    },
    "&#addThemeBtn": {
      cursor: "pointer",
      "&[disabled]": {
        pointerEvents: "none",
        opacity: "0.2",
      },
    },
    "& .lockIconHolder": {
      overflow: "hidden",
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: 1,
      width: 30,
      height: 30,
    },
    "& .lockIcon": {
      top: "-3px",
      color: "#fff",
      right: "-13px",
      zIndex: 1,
      position: "absolute",
      background: "#999",
      width: "40px",
      height: "20px",
      transform: "rotate(45deg)",
      "& svg": {
        fontSize: "12px",
        transform: "rotate(-45deg)",
      },
    },
    "& .checkIcon": {
      top: "-8px",
      color: "#008CE6",
      left: "-8px",
      zIndex: 1,
      position: "absolute",
      display: "none",
      height: "17px",
      width: "17px",
      background: "#fff",
      borderRadius: "50%",
      "& svg": {
        fontSize: "18px",
      },
    },
    "&[isselected='true']": {
      border: "1px solid #008CE6",
      boxShadow: "0px 0px 0px 1px rgba(0,140,230,0.75)",
      "& .lockIcon": {
        background: "#008CE6",
      },
      "& .checkIcon": {
        display: "block",
      },
    },
  },

  denimBox: {
    float: "left",
    width: "100%",
    margin: "40px 0 15px",
    "& p": {
      float: "left",
      color: "#9E9E9E",
      fontSize: "16px",
    },
  },

  btnHolder: {
    float: "right",
  },

  undoBtn: {
    float: "left",
    cursor: "pointer",
    margin: "5px 20px 0 0",
    color: "#9E9E9E",
    fontSize: "16px",
  },

  redoBtn: {
    float: "left",
    cursor: "pointer",
    color: "#9E9E9E",
    fontSize: "16px",
    margin: "5px 0 0 0",
  },

  colorSelectionBox: {
    float: "left",
    width: "100%",
    margin: "20px 0 0",
    "& .leftBox": {
      float: "left",
      margin: "2px 0 0",
      "& h4": {
        float: "left",
        fontWeight: "normal",
      },
      "& svg": {
        float: "left",
        fontSize: "18px",
        margin: "0 0 0 5px",
        cursor: "pointer",
      },
    },
  },

  colorPickerBox: {
    position: "relative",
    border: "1px solid #9E9E9E",
    padding: 0,
    borderRadius: 4,
    height: 32,
    cursor: "pointer",
    width: "90%",
    fontSize: "12px",
    fontWeight: "normal",
    float: "right",
    boxSizing: "border-box",
    "& label": {
      float: "left",
      width: "30px",
      height: "30.5px",
      borderRadius: "4px 0 0 4px",
      margin: "0 5px 0 0",
      cursor: "pointer",
      padding: "0",
      boxShadow: "none",
      border: "none",
      textShadow: "none",
    },
    "& span": {
      color: "#0B1941",
      float: "left",
      padding: "6px 0 0",
    },
  },

  PhotoshopPickerBox: {
    position: "absolute",
    left: "10px",
    zIndex: 9,
    top: "35px",
  },

  closePicker: {
    top: "-9px",
    right: "-10px",
    cursor: "pointer",
    position: "absolute",
    fontSize: 20,
    zIndex: 99,
    background: "#fff",
    borderRadius: "50%",
    border: "1px solid #000",
  },

  phoneBox: {
    float: "left",
    width: "100%",
    margin: "10px 0",
    position: "relative",
    "& .MuiTextField-root": {
      width: "100%",
      marginBottom: 0,
      "& input": {
        paddingRight: 35,
        fontSize: "15px",
      },
    },
    "& .tooltip": {
      top: 18,
      color: "#9E9E9E",
      right: 9,
      position: "absolute",
      fontSize: 22,
    },
    "& .MuiGrid-grid-md-2": {
      width: "35%",
      flexBasis: "35%",
      maxWidth: "35%",
    },
    "& .MuiGrid-grid-md-7": {
      width: "65%",
      flexBasis: "65%",
      maxWidth: "65%",
      float: "right",
      "& input": {
        padding: "18.5px 14px !important",
        fontSize: "15px",
      },
    },
    "& .MuiGrid-grid-md-3": {
      width: "100%",
      flexBasis: "100%",
      maxWidth: "100%",
      float: "left",
      "& input": {
        padding: "18.5px 14px !important",
        fontSize: "15px",
      },
      "& > .MuiBox-root": {
        margin: "15px 0 0",
      },
    },
    "& .longTxt #outlined-basic-label": {
      fontSize: "13px",
    },

    "& #fromEmail": {
      paddingRight: "140px",
      textAlign: "right",
    },
  },

  uploadDocBox: {
    float: "left",
    width: "100%",
    margin: "30px 0 0",
    "& input": {
      display: "none",
    },
    "& label": {
      float: "left",
      cursor: "pointer",
      borderBottom: "1px solid #000",
      lineHeight: "20px",
    },
    "& .viewIcon": {
      float: "right",
      margin: "2px 5px 0",
      "& svg": {
        fontSize: 22,
        cursor: "pointer",
      },
    },
    "& .uploadedFileName": {
      float: "left",
      width: "100%",
      fontStyle: "italic",
      color: "#4C4C4C",
      fontSize: 14,
      wordBreak: "break-all",
      "& svg": {
        float: "left",
        color: "#0B1941",
        fontSize: 20,
        margin: "0 2px  0 0",
      },
    },
  },

  colorIcockIcon: {
    top: "6px",
    right: "-15px",
    position: "absolute",
    color: "#a3a3a3",
    "& svg": {
      fontSize: "12px",
    },
  },

  poweredByBox: {
    float: "left",
    width: "100%",
    margin: "0",
    "& span": {
      lineHeight: "18px",
    },
  },

  confirmationDialog: {
    "& .MuiDialogContent-root": {
      padding: "30px 30px 10px",
      "& p": {
        color: "#000",
        margin: "0",
        fontSize: "17px",
        width: "90%",
      },
    },
    "& .MuiDialogActions-root": {
      margin: "0 20px 0 0",
      "& button": {
        color: "#008CE6",
      },
    },
  },

  fromDomainName: {
    position: "absolute",
    right: "29px",
    top: "17px",
    color: "#999",
    whiteSpace: "nowrap",
    width: "110px",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  OnOffPhone: {
    float: "left",
    width: "100%",
    margin: "0 0 10px",
  },
});
export default styles;
