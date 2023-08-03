import React from "react";
import {
  withStyles,
  Box,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  checkBoxItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0.25rem`,
    flex: 1,
    cursor: "pointer",
    border: "1px solid #008CE6",
    borderRadius: "4px",
    height: "100%",
    color: "#008CE6",
    textTransform: "uppercase",
  },
  checked: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: `4px`,
    position: "relative",
    border: `3px solid ${theme.palette.secondary.main}`,
    boxShadow: "none",
  },
  checkedIcon: {
    maxWidth: "15px",
    position: "absolute",
    left: "5px",
    top: "5px",
  },
  hasIconChecked: {},
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    padding: theme.spacing(0.3, 0),
  },
  hasIcon: {
    padding: theme.spacing(2, 0),
  },
  textWithIcon: {
    marginTop: theme.spacing(1),
  },
});

const Checkbox = (props) => {
  const {
    classes,
    onChange,
    label,
    checked,
    icon,
    index,
    ...restProps
  } = props;
  const isChecked = checked;
  
  return (
    <Box
      className={clsx(classes.checkBoxItem, {
        [classes.checked]: isChecked,
      })}
      onClick={(e) => {
        onChange && onChange(e, index, !isChecked);
      }}
      backgroundColor={"#ffffff"}
    >
      {checked && (
        <img
          className={clsx(classes.checkedIcon, {
            [classes.hasIconChecked]: icon !== undefined,
          })}
          src={require(`~/assets/icons/checkTick.svg`)}
          alt=""
        />
      )}
      <Box
        className={clsx(classes.itemContainer, {
          [classes.hasIcon]: icon !== undefined,
        })}
      >
        {Boolean(icon) ? icon : null}
        <Typography
          className={clsx({
            [classes.textWithIcon]: icon !== undefined,
          })}
          variant={isChecked ? "body2" : "caption"}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default withStyles(styles)(Checkbox);
