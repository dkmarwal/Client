import React from "react";
import { withStyles } from "@material-ui/core";
import ACH from "~/assets/icons/ACH_main.svg";
import VCA from "~/assets/icons/VCA_main.svg";
import CHK from "~/assets/icons/CHK_main.svg";

const styles = (theme) => ({
  boxWrap: {
    cursor: "pointer",
    position: "relative",
    backgroundColor: theme.palette.background.active,
    padding: "10px",
    margin: "0px 18px",
    textAlign: "center",
    color: "#7F7F7F",
    fontSize: "16px",
    fontWeight: "bold",
    lineHeight: "22px",
    borderRadius: "4px",
    boxSizing: "border-box",
    border: "1px solid #fff",
    boxShadow:
      "0px 1px 3px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgb(255 255 255), 0px 1px 3px 0px rgba(0,0,0,0.14)",
    "&:hover": {
      boxShadow:
        "0 6px 10px 0 rgba(0,0,0,0.07), 0 1px 18px 0 rgba(0,0,0,0.06), 0 3px 5px -1px rgba(0,0,0,0.1)",
      border: "1px solid #286787",
    },
  },

  checkedIcon: {
    position: "absolute",
    left: "18px",
    bottom: "12px",
    height: "18px",
    width: "18px",
    "& svg": {
      height: "18px",
      width: "18px",
    },
  },
  boxWrapActive: {
    cursor: "pointer",
    position: "relative",
    backgroundColor: theme.palette.secondary.contrastText,
    padding: "10px",
    margin: "0px 18px",
    textAlign: "center",
    color: theme.palette.text.default,
    fontSize: "16px",
    fontWeight: "bold",
    lineHeight: "22px",
    borderRadius: "4px",
  },
  iconClass: {
    backgroundColor: theme.palette.background.active,
    display: "block",
    margin: "0 auto",
    marginBottom: "5px",
  },

  checkClass: {
    height: "18px",
    width: "18px",
  },
});

const GridCheckBox = (props) => {
  const { classes } = props;
  
  const handleClick = (index, e) => {
    e.target.checked = !e.target.checked;
    props.onChange(e, index);
  };

  const returnIcon = () => {
    if (props.icon === "ACH" || props.icon === "EFT") {
      return <img className={classes.iconClass} src={ACH} alt="" />;
    } else if (props.icon === "VCA") {
      return <img className={classes.iconClass} src={VCA} alt="" />;
    } else if (props.icon === "CHK") {
      return <img className={classes.iconClass} src={CHK} alt="" />;
    }
  };

  return (
    <div
      className={props.checked ? classes.boxWrapActive : classes.boxWrap}
      checked={props.checked}
      onClick={(e) => handleClick(props.index, e)}
    >
      {props.checked ? (
        <span className={classes.checkedIcon}>
          <img
            className={classes.checkClass}
            src={require(`~/assets/icons/checkTick.svg`)}
            alt=""
          />
        </span>
      ) : null}
      {props.icon && returnIcon()}
      {props.label}
    </div>
  );
};

export default withStyles(styles)(GridCheckBox);
