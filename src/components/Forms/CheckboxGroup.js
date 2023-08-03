import React, { useState,useEffect } from "react";
import {
  withStyles,
  Box,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  checkBoxGroupContainer: {
    border: `1px solid ${theme.palette.border.main}`,
    borderRadius: `4px`,
    padding: theme.spacing(0.5, 1),
    display: "flex",
  },
  checkBoxItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: `0.25rem`,
    flex: 1,
    cursor: "pointer",
  },
  checked: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    borderRadius: `4px`,
    position: "relative",
  },
  disabled:{
    backgroundColor:'rgba(0, 0, 0, 0.26)',
    cursor:'default'
  },
  checkedIcon: {
    maxWidth: "15px",
    position: "absolute",
    left: "10px",
  },
  uncheckedDisabled: {
    cursor:'default',
    color:'rgba(0, 0, 0, 0.26)',
  }
});

const CheckboxGroup = (props) => {
  const {
    classes,
    options,
    selectedOption,
    onChange,
    disabled,
    ...restProps
  } = props;
  
  const [checkedIndex, setCheckedIndex] = useState(
    selectedOption ? selectedOption : 0
  );

  useEffect(() => {
      setCheckedIndex(selectedOption);    
  }, [selectedOption]);

  const readOnly = disabled || false;

  return (
    <Box className={classes.checkBoxGroupContainer}>
      {options.map((option, index) => (
        <Box
          key={`checkbox-group-item-${index}`}
          className={clsx(classes.checkBoxItem, {
            [classes.checked]: option.value === checkedIndex,
            [classes.disabled]:option.value === checkedIndex && disabled,
            [classes.uncheckedDisabled] : option.value !== checkedIndex && disabled,
          })}
          onClick={(e) => {
            !readOnly && setCheckedIndex(option.value);
            !readOnly && onChange && onChange(option);
          }}
        >
          <Typography variant={option.value === checkedIndex ? "body2" : "caption"}>
            {option.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default withStyles(styles)(CheckboxGroup);
