import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import { CheckboxGroup } from "~/components/Forms";
import { withTranslation } from 'react-i18next';

const styles = (theme) => ({
  contentBackground: {
    backgroundColor: theme.palette.background.header,
  },
  primaryDark: {
    color: theme.palette.primary.dark,
  },
});

class BulkRemittances extends Component {
  render() {
    const { t } = this.props;
    const {
      classes,
      title,
      px,
      py,
      handleBulkRemittance,
      selectedOption, isSettingRemmitanceEditEnabled,
    } = this.props;
    return (
      <Box className={classes.contentBackground} px={px || 0} py={py || 0}>
        {/* <ContentHeader title={title} /> */}
        <Typography variant="h4" className={classes.primaryDark}>
          {title}
        </Typography>
        <Box py={1.75}>
          <Box>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <CheckboxGroup
                  options={[
                    {
                      label: t('componentData.bulkRemittances.Yes'),
                      value: 1,
                    },
                    {
                      label: t('componentData.bulkRemittances.No'),
                      value: 0,
                    },
                  ]}
                  disabled={isSettingRemmitanceEditEnabled ? false : true}
                  onChange={isSettingRemmitanceEditEnabled ? handleBulkRemittance : null}
                  selectedOption={selectedOption}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default withTranslation()(withStyles(styles)(BulkRemittances));
