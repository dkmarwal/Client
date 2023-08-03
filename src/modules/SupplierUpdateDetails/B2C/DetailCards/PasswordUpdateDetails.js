import React from "react";
import { Grid, Box, Typography } from "@material-ui/core";

import { withTranslation } from "react-i18next";

const PasswordUpdateDetails = (props) => {
  const { newRecord } = props.passwordData;
  return (
    <Box px={3} py={2}>
      <Box pt={1}>
        <Grid container alignItems="center" style={{ gap: "20px" }}>
          <Grid item xs={12}>
            <Box display="flex" alignItems="center">
              <Typography variant="h2">
                {newRecord.actionType &&
                  newRecord.actionType.toString().toUpperCase()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box my={2} display="flex" alignItems="center">
              <Typography variant="body2">
                {newRecord?.message || ""}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default withTranslation()(PasswordUpdateDetails);
