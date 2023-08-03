import bgLogin from "~/assets/images/theme-login-bg-final.png";

const styles = (theme) => ({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    // marginTop: "50px",
  },

  subContainer: {},
  loginBg: {
    background: `url(${bgLogin}) no-repeat top right`,
    backgroundSize: "contain",
    width: "100%",
  },
  loginBgMobile: {
    background: "none !important",
  },

  loginSection: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    background: "#FFFFFF",
    borderRadius: 8,
    flexDirection: "column",
    margin: 16,
  },
  loginSectionMobile: {
    display: "flex",
    alignItems: "center",
    padding: 16,
    background: "#FFFFFF",
    borderRadius: 8,
    width: "100%",
    margin: 16,
  },

  subContainerMobile: {
    boxShadow: "0px 2px 4px rgba(112, 146, 200, 0.25)",
    width: "360px",
    margin: "auto",
  },
});
export default styles;
