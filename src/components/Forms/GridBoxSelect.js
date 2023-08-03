import React from "react";
import { withStyles } from "@material-ui/core";
const styles = (theme) => ({
  boxWrap: {
    cursor: "pointer",
    position: "relative",
    backgroundColor: "#fff",
    padding: "10px",
    margin: "0px 18px",
    textAlign: "center",
    color: "#7F7F7F",
    fontSize: "16px",
    fontWeight: "bold",
    lineHeight: "22px",
    borderRadius: "4px",
    boxShadow:
      "0px 1px 3px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgb(255 255 255), 0px 1px 3px 0px rgba(0,0,0,0.14)",
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
    backgroundColor: "#6094B1",
    padding: "10px",
    margin: "0px 18px",
    textAlign: "center",
    color: "#fff",
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

const GridBoxSelect = (props) => {
  const { classes, name } = props;

  const handleClick = (e) => {
    props.onChange(name, !e.target.checked, e);
  };

  return (
    <div
      name={name}
      className={props.checked ? classes.boxWrapActive : classes.boxWrap}
      checked={props.checked}
      onClick={handleClick}
    >
      {props.checked ? (
        <span className={classes.checkedIcon}>
          <img
            className={classes.checkClass}
            src={require(`~/assets/icons/checkTick.svg`)}
            alt="" æ
          />
        </span>
      ) : null}
      {props.icon && (
        <img
          className={classes.iconClass}
          src={require(`~/assets/icons/${props.icon}.svg`)}
          alt=""
        />
      )}
      {props.label}
    </div>
  );
};

export default withStyles(styles)(GridBoxSelect);
