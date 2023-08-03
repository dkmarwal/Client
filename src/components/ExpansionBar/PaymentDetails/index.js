import React from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  makeStyles,
  FormControlLabel,
  Checkbox,
  Box,
} from "@material-ui/core";

import ArrowDropDown from "@material-ui/icons/ExpandMore";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";

const formControlStyle = makeStyles((theme) => ({
  root: {},
  label: {
    color: "#4C4C4C",
    fontFamily: theme.typography.fontFamily,
    fontSize: "16px",
    fontWeight: "bold",
    letterSpacing: "0",
    lineHeight: "16px",
  },
}));

const ExpansionBar = ({
  label,
  summary,
  icon,
  checkBoxLabel,
  children,
  bColor = "none",
  isExpanded,
  handleExpansion,
  paymentType,
  ...restProps
}) => {
  const formControlClasses = formControlStyle();
  return (
    <Accordion
      key={label}
      {...restProps}
      style={{
        backgroundColor: bColor,
        boxShadow: "none",
        borderBottom: "3px solid #002D72",
      }}
      expanded={isExpanded}
      onChange={()=>handleExpansion(paymentType)}
    >
      <AccordionSummary
        expandIcon={<ArrowDropDown fontSize="small" color="primary" />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {checkBoxLabel ? (
          <FormControlLabel
            classes={formControlClasses}
            aria-label="Acknowledge"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={
              <Checkbox
                icon={
                  <CheckBoxOutlineBlankIcon
                    style={{ color: "rgba(0,0,0,0.6)" }}
                  />
                }
                checkedIcon={
                  <CheckBoxIcon style={{ color: "rgba(0,0,0,0.6)" }} />
                }
              />
            }
            label={label}
          />
        ) : (
          <Box py={1} display="flex" flexDirection="row">
            {icon ? (
              <Box mx={1}>
                {" "}
                <img src={icon} alt="$" />{" "}
              </Box>
            ) : null}
            <Typography variant="h2" color={"primary"}>
              {label}
            </Typography>
          </Box>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={12} sm={12}>
            {children}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default ExpansionBar;
