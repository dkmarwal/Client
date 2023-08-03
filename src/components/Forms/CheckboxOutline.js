import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import {
  withStyles,
  Typography,
} from "@material-ui/core";

const styles = (theme) => ({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
});

const CheckboxOutline = (props) => {
  const {
    classes,
    onChange,
    supplierIds,
    selectedValues,
    type,
    disabled,
    ...restProps
  } = props;

  return (
    <FormGroup className={classes.formLabel}>
      {supplierIds.length > 0 &&
        supplierIds.map((item, index) => {
          return (
            <FormControlLabel
              value="top"
              control={
                <Checkbox
                  className={classes.root}
                  disabled={disabled}
                  disableRipple
                  color="default"
                  checkedIcon={
                    <img src={require(`~/assets/icons/checked.svg`)} alt="" />
                  }
                  icon={
                    <img
                      src={require(`~/assets/icons/checkbox_unchecked.svg`)}
                      alt=""
                    />
                  }
                  checked={Boolean(
                    selectedValues.remitToIds.includes(item.entityIdentifier)
                  )}
                  name={item.entityIdentifier}
                  inputProps={{ "aria-label": "decorative checkbox" }}
                  onChange={(e) => {
                    onChange &&
                      onChange(e, type, selectedValues.paymentId, index);
                  }}
                />
              }
              label={
                <Typography variant="h4" className={classes.label}>
                  {item.entityIdentifier}
                </Typography>
              }
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              labelPlacement="end"
              className={classes.formControl}
            />
          );
        })}
    </FormGroup>
  );
};

export default withStyles(styles)(CheckboxOutline);
