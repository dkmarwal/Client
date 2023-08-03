const styles = (theme) => ({
  headerContainer: {
    display: "flex",
    padding: "0.438rem 1.2rem",
    height: "2.562rem",
    position: "fixed",
    width: "100vw",
    zIndex: 99,
  },
  userIconBg: {
    background: "#bdbdbd",
    borderRadius: "100%",
    color: "#fff",
    width: 35,
    height: 35,
    padding: "3px !important",
    display: "inline-block",
    textAlign: "center",
    transition: "fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    boxSizing: "border-box",
  },
  large: {
    height: "97px",
    width: "98px",
  },
  profileHeading: {
    color: "#0B1941",
    fontSize: "20px",
    textTransform: "capitalize"
  },
  profileEmail: {
    color: "rgba(0,0,0,0.6)",
    fontSize: "11px"
  },
  profileManage: {
    color: "#008CE6",
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  toggleContainer: {
    width: "4.375rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
  },
  headerSmText: {
    alignItems: "center",
    display: "flex",
    fontSize: "16px",
    paddingLeft: "1.75rem",
    fontWeight: 600,
    color: "rgba(0,0,0,0.74)",
    fontFamily: `'Roboto', sans-serif`,
  },
  citiLogo: {
    display: "flex",
  },
  incedoPayLogo: {
    display: "flex",
    borderLeft: "3px solid #979797",
  },
  rightNavContainer: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight:'40px'
  },
  rightNavIconContainer: {},
  rightNavDropdownContainer: {
    padding: "0",
  },
  headerMenuList: {
    display: "block",
    "& a": {
      lineHeight: "1.42857",
      padding: "0 10px  0 15px ",
      textDecoration: "none",
      cursor: "pointer",
    },
    "& svg": {
      verticalAlign: "middle",
    },
    "& span": {
      verticalAlign: "middle",
      padding: " 0 10px 0 8px",
      fontSize: 13,
    },
  },
  headerMenu: {
    top: "40px !important",
  }
});

export default styles;
