import React from "react";

import {
  Divider,
  Grid,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Checkbox } from "~/components/Forms";
import { withStyles } from "@material-ui/styles";
import styles from "./styles";

const CCParameterSelector = (props) => {
  const {
    paymentParameterList,
    selectedPaymentParameters,
    classes,
    title,
    handleChange,
    parameterValidation,
    errorText,
  } = props;

  return (
    <Box
      p={1}
      display="flex"
      justifyContent="flex-start"
      className={classes.root}
    >
      <Accordion className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Box p={1} width="100%" display="flex" justifyContent="flex-start">
            <Box pl={1}>
              <Typography variant="h4" className={classes.heading}>
                {title}
              </Typography>
              {parameterValidation && (
                <span variant="h5" className={classes.errorText}>
                  {errorText}
                </span>
              )}
            </Box>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box alignItems="center" width="100%">
            <Box
              display="flex"
              justifyContent="left"
              width="100%"
              flexWrap="wrap"
            >
              {paymentParameterList &&
                paymentParameterList.map(
                  ({ parameterGroup, parameters }, index) => (
                    <>
                      <Box p={2}>
                        <Typography variant="h4" className={classes.heading}>
                          {parameterGroup}
                        </Typography>
                      </Box>
                      <Grid container direction="row" key={parameterGroup}>
                        <Divider
                          variant="fullWidth"
                          className={classes.divider}
                        />
                        {parameters &&
                          parameters.map((item, index) => {
                            return (
                              <Box p={1} pb={2} width="30%">
                                <Checkbox
                                  onChange={() => {
                                    handleChange(item.parameterId);
                                  }}
                                  label={item.parameterName}
                                  checked={selectedPaymentParameters.includes(
                                    item.parameterId
                                  )}
                                  index={index}
                                />
                              </Box>
                            );
                          })}
                      </Grid>
                    </>
                  )
                )}
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default withStyles(styles)(CCParameterSelector);
