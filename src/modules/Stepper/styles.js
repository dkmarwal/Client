const styles = (theme) => ({
  stepperContainer: {
    boxShadow:
      "0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2)",
    padding: ".4rem 0rem",
    paddingTop: "46px",
    background: theme.palette.background.header,
    "& .MuiStepLabel-alternativeLabel": {
      marginTop: "0.05rem",
      textTransform: "uppercase",
      color: theme.palette.border.main,
    },
    "& .MuiStepLabel-active ": {
      color: theme.palette.secondary.main,
    },
  },
  stepLabelContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid",
    borderRadius: "50%",
    width: "2.125rem",
    height: "2.125rem",
    borderColor: theme.palette.border.main,
    color: theme.palette.border.main,
  },
  activeStepLabel: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  },
  activeCompleted: {
    borderColor: theme.palette.border.main,
    color: theme.palette.border.main,
    border: 0,
  },
  stepperLabel: {
    padding: "0.3rem 0rem",
  },
  checkedIcon: {
    width: "2.125rem",
    height: "2.125rem",
  },
});

export default styles;
