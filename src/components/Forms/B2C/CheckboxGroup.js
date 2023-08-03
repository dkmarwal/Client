import React, { useState, useEffect } from "react";
import {
  withStyles,
  Box,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";

const styles = (theme) => ({
  checkBoxGroupContainer: {
    border: `1px solid #CCCCCC`,
    borderRadius: `6px`,
    padding: theme.spacing(0.5),
    display: "flex",
    marginLeft:theme.spacing(4),
    minWidth:264,
    height:44,
    fontSize:16,
    marginBottom:theme.spacing(2)
  },
  checkBoxItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    cursor: "pointer",
    padding: "5px 25px",
  },
  checked: {
    backgroundColor: "#0B1941",
    color: "#FFFFFF",
    borderRadius: `6px`,
    position: "relative",
  },
  checkedIcon: {
    width: "24px",
    height: "24px",
    position: "absolute",
    left: "10px",
  },
});

const B2CCheckboxGroup = (props) => {
  const {
    classes,
    options,
    selectedOption,
    onChange,
    disabled,
    isChecked,
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
          pl={2}
          pr={2}
          width="100%"
          key={`checkbox-group-item-${index}`}
          className={clsx(classes.checkBoxItem, {
            [classes.checked]: option.value === checkedIndex,
          })}
          onClick={(e) => {            
            !readOnly && setCheckedIndex(option.value);
            !readOnly && onChange && onChange(option, index, e);
          }}
        >
          {option.value === selectedOption && isChecked && (
                        <img
                            className={classes.checkedIcon}
                            src={require(`~/assets/icons/check_circle.svg`)}
                            alt=""
                        />
          )}
          <Typography >
            {option.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default withStyles(styles)(B2CCheckboxGroup);
