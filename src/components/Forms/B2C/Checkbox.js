import React from "react";
import {
  withStyles,
  Box,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import GetAppIcon from '@material-ui/icons/GetApp';
import EmailIcon from '@material-ui/icons/Email';

const styles = (theme) => ({
  checkBoxItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0.25rem`,
    flex: 1,
    cursor: "pointer",
    borderRadius: "4px",
    height: "100%",
    color: "#4C4C4C",
    boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
  },
  checked: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: `4px`,
    position: "relative",
    boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
  },
  checkedIcon: {
    width: "24px",
    position: "absolute",
    left: "5px",
  },
  hasIconChecked: {},
  itemContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    padding: theme.spacing(1, 0),
  },
  leftIcon: {
    display: "flex",
    padding: theme.spacing(1, 0),
    flexDirection: "row",
    alignItems: "center",
  },
  hasIcon: {
    padding: theme.spacing(2, 0),
  },
  textWithIcon: {
    fontSize: "14px",
    textTransform: "capitalize",
  },
  remittanceModeIcon: {
    verticalAlign: 'middle',
    right: '3px',
    position: 'relative'
  }
});

const Checkbox = (props) => {
  const {
    classes,
    onChange,
    label,
    checked,
    icon,
    index,
    downloadIcon = false,
    emailIcon = false,
    isLeftIcon = false,
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
          alt="Checked_Icon"
        />
      )}
      {downloadIcon && <GetAppIcon className={classes.remittanceModeIcon} fontSize="small" />}
      {emailIcon && <EmailIcon className={classes.remittanceModeIcon} fontSize="small" />}
      <Box
        className={clsx(classes.itemContainer, {
          [classes.hasIcon]: icon !== undefined && !isLeftIcon,
          [classes.leftIcon]: icon !== undefined && isLeftIcon,
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
