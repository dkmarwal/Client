export const styles = (theme) => ({
  primaryDark: {
    color: theme.palette.primary.dark,
    textAlign: "center",
  },
  primaryGrey: {
    color: theme.palette.secondary.grey,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryRed: {
    color: theme.palette.error.dark,
    textAlign: "center",
  },
  container: {
    margin: "4px 0 24px 0",
    padding: 10,
    display: "flex",
    flexDirection: "column",
    border: `1px dashed ${theme.palette.secondary.main}`,
    position: "relative",
  },
  btnClose: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  contentBackground: {
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.15)",
    width: "100%",
  },
  width: {
    width: "600px",
  },
  alignCenter: {
    textAlign: "center",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    flexBasis: "50%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexBasis: "33%",
  },
  checkedIcon: {
    position: "absolute",
    right: "45%",
  },
  outlineIcon: {
    position: "absolute",
    right: "2%",
    top: "2%",
  },
  btnContainer: {
    alignItems: "center",
    margin: "0 auto",
  },
  smallText: {
    fontSize: 16,
    color: theme.palette.text.blueLight,
    marginBottom: 10,
    textAlign: "center",
  },
  fileProcessBox: {
    padding: 30,
    margin: "30px 0",
  },
  textGrey: {
    color: theme.palette.text.greyDark,
    display: "flex",
    alignItems: "center",
  },
  fileProgressBar: {
    backgroundColor: "#D9F3F5",
    height: 15,
    width: "100%",
    marginRight: 15,
    position: "relative",
    "&  span": {
      backgroundColor: theme.palette.secondary.main,
      // width:"75%",
      position: "absolute",
      left: 0,
      top: 0,
      height: 15,
    },
  },
});
