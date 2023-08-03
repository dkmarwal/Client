import tourModalImage from "~/assets/images/tour-modal-main.png";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#fff",
    "& .MuiTextField-root": {
      width: "100%",
    },
    height: "100vh",
    // paddingRight: "15px",
    // paddingLeft: "15px",
    // marginRight: "auto",
    // marginLeft: "auto",
  },
  heading: {
    paddingTop: 0,
    color: "#0c2074",    
    fontWeight: 500,
    fontFamily: "'Open Sans', sans-serif",
    padding: "35px 80px",
    fontSize: "40px",
  },
  title: {
    height: "43px",
    width: "538px",
    color: "#0B1941",
    fontFamily: "Interstate",
    fontSize: "34px",
    letterSpacing: 0,
    lineHeight: "36px",
  },
  h1: {
    fontWeight: 400,
    fontSize: 24,
    color: theme.palette.primary.main,
  },
  headingNew: {
    fontWeight: 400,
    fontSize: 24,
    color: "#202020",
    marginBottom: 12,
  },

  h2: {
    fontWeight: 400,
    fontSize: "22px",
  },
  textAttention: {
    fontWeight: 400,
    fontSize: 20,
    color: "#202020",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: '#333333',
    marginRight: 5,
    display: "inline-block",
  },

  textNum: {
    fontWeight: 400,
    fontSize: 24,
    paddingLeft:theme.spacing(2)
  },
  subHeading: {
    fontWeight: 400,
    fontSize: "14px",
    color: "#4C4C4C",
    margin: "5px 0",
  },
  flagContainer: {
    fontWeight: 600,
    display: "flex",
    position: "relative",
    lineHeight: "42px",
    color: "#7F7F7F",
    cursor: "pointer",
    alignItems: "center",
  },
  tabContainer: {   
    border: "1px solid #e6e6e6",
    borderRadius: "6px",
    padding: 2,
    width: 320,
    display: "flex",
    justifyContent: "space-between",
    boxSizing: "content-box",
  },
  tab: {
    padding: 5,
    borderRadius: 4,
    color: "#282828",
    fontSize: 16,
    width: "50%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer"
  },
  expansionBtn: {
    boxShadow: "0 1px 1px 0 rgba(0,0,0,0.14), 0 0 3px 0 rgba(0,0,0,0.2)",
    borderRadius: "110px",
    margin: "0 0px 11px 0",
    width: "28px",
    height: "28px",
    display: "flex",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
  },
  arrowsColor: {
    width: 24,
    color: "#7F7F7F",
    cursor: "pointer"
  },
  expansionCards: {
    position: "relative",
    paddingBottom: "150px",
    boxShadow:
      "0 6px 10px 0 rgba(0,0,0,0.07), 0 1px 18px 0 rgba(0,0,0,0.06), 0 3px 5px -1px rgba(0,0,0,0.1)",
  },
  bgBlur: {
    position: "absolute",
    bottom: 0,   
    background: `linear-gradient(0deg, rgba(255,255,255,1) 55%, rgba(255,255,255,0.5298494397759104) 100%)`,
    height: "80px",
    width: "100%",
    zIndex: 3,
  },
  btnWrap: {
    position: "absolute",
    background: "#fff",
    bottom: 45,
    width: "94%",
    margin: "1%",
    padding: "1%",
    transform: "translate(10px, 0px)",
    textAlign: "center",
    borderTop: `2px solid #e7e7e7 `,
    borderBottom: `2px solid #e7e7e7 `,
  },

  link: {
    color: "#008CE6",
    marginRight: "2px",
    textDecoration: "underline !important",
    wordBreak: "break-word",
  },
  iconContainer: { width: 21 },
  icon: {
    height: "21px",
    width: "21px",
    backgroundColor: "#E9EEF2",
    borderRadius: "76px",
    padding: "3px",
    color: "#53565A",
    fontSize: 8,
    position: "relative",
    top: "7px",
    margin: "0 10px 0 0",
  },
  circleText: {
    height: "20px",
    width: "20px",
    backgroundColor: "#E9EEF2",
    borderRadius: "76px",
    color: "#0B1941",
    margin: "3px 10px 0 0",
    textAlign: "center",
    display: "table",
    fontSize: 8,
    fontWeight: "bold",
    lineHeight: "20px",
  },
  text16: {
    fontSize: 16,
    margin: "8px 0",
  },
  // #2a9fd8
  tourModalImageContainer: {
    backgroundImage: `url(${tourModalImage})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    paddingBottom: "50%",
  },
  tourModalInfoContainer: {
    color: theme.palette.text.blackLight,
    marginTop: "3rem",
    textAlign: "center",
  },
  tourModalActionContainer: {
    margin: "1rem 0rem",
  },
  Heading2: {
    fontSize: "16px",
    textTransform: "uppercase",
    fontWeight: "400",
  },
  B2CTotalPayments: {
    padding: "30px 0 5px",
    textAlign: "right"
  },
  B2CPaymentsPrefrences: {    
    margin: "0",   
    display: 'block',
    textAlign: 'right',
    "& h1":{
      fontSize: '24px',     
      fontWeight: '400',
      margin: "10px 0 5px"
    },    
    "& h2":{
      fontSize: "15px",
      lineHeight: "21px"
    }
  },
  paddingLeft: {
    paddingLeft: "24px"
  },
  legendList:{
    "& li":{
      cursor: "default",
      "&.strike":{
        textDecoration: "line-through"
      }      
    }
  },
  legendList2:{
    float: "left",
    cursor: "default",
    "& .strike":{
      textDecoration: "line-through"
    }      
  },
  
  lineChartBox:{
    display: "block",
    margin: "0 auto",
    textAlign: "center",
    "& canvas":{
      display: "inline-block !important"
    }
  },

  graphHead:{
    padding:"0 0 10px",
    "& h1":{
      display: "inline-block"
    },
    "& .selectBox":{
      width: 200,
      float: "right"
    }
  },

  payeeGraphTitles:{
    marginBottom: 0,
    marginTop:theme.spacing(2.5),
    padding:"0 0 30px",
    position: "relative",
    "& h3":{
      color: "#121212",
      lineHeight: "20px",
      padding: "0 0 5px"
    },
    "& h6":{
      color: "#828282",
      fontSize: 12
    },
    "& .viewAllStatus":{
      position: "absolute",
      right: 0,
      top: 0,
      "& span.MuiCheckbox-root":{
        margin: "0 -5px 0 0"
      },
      "& span.MuiFormControlLabel-label":{
        color: "#4C4C4C",    
        fontSize: "13px"    
      }      
    }
  },

  mixedGraph:{
    float: "left",
    width: "100%",
    margin: "0 0 30px",   
    padding: "0 0 20px",
    borderBottom: "1px solid #8F9EC3", 
    position: "relative",
    "& h3":{
      top: '37%',
      left: '-47px',
      position: 'absolute',
      transform: 'rotate(270deg) translate(10px, -50%)',
      fontSize: '12px',
      color: "#828282",
      letterSpacing: '1px'
    },
    "& .GraphHolder":{
      width: "96%",
      float: "right"
    }
  },

  PayeeDetailBox:{
    float: "left",
    width: "100%",
    margin: "0 0 30px",   
    padding: "0 0 20px",
    borderBottom: "1px solid #8F9EC3",
    "& .box":{
      width: "100%",
      float: "left",
      padding: "0 0 0 28px"
    },
    "& .bottomTxt":{
      float: "left",
      width: "100%",
      textAlign: "center",
      color: "#828282",
      fontSize: "12px",
      fontWeight: 'normal',
      padding: '20px 0 0',
    }
  },

  dashboardContainer:{
    "& .MuiTab-textColorSecondary":{
        color: '#0b1941',
        "&.Mui-selected":{
          color: '#008CE6'
        }
    }
  }
});

export default styles;
