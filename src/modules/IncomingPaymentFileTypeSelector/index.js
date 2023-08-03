import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import { Checkbox } from "~/components/Forms";
import { withTranslation } from 'react-i18next';

const styles = (theme) => ({
  contentBackground: {
    backgroundColor: theme.palette.background.header,
  },
  primaryDark: {
    color: theme.palette.primary.dark,
  },
});

class IncomingPaymentFileTypeSelector extends Component {
  render() {
    const {
      paymentFileTypes,
      classes,
      px,
      py,
      flag,
      canEdit = true,
    } = this.props;
    const { t } = this.props;
    return (
      <Box className={classes.contentBackground} px={px || 0} py={py || 0}>
        <Box p={1.75}>
          {flag && <Typography variant="h4" className={classes.primaryDark}>
            {t('componentData.incomingPaymentFileTypeSelector.IncomingPaymentFile')}
          </Typography>}
          <Box py={flag ? 3 : 0}>
            <Grid container spacing={4}>
              {paymentFileTypes.map((paymentFileType, index) => (
                <Grid key={`payment-mode-${index}`} item xs={flag ? 3 : 6} sm={flag ? 3 : 6}>
                  <Checkbox
                    checked={paymentFileType.selected}
                    label={paymentFileType.label}
                    disabled={!canEdit}
                    icon={
                      paymentFileType.icon && (
                        <img
                          src={paymentFileType.icon}
                          alt={paymentFileType.label}
                        />
                      )
                    }
                    index={index}
                    onChange={(e, index, isChecked) => {
                      if (!canEdit) {
                        return false;
                      }
                      this.props.onChange &&
                        this.props.onChange(e, index, isChecked)
                    }
                    }
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default withTranslation()(withStyles(styles)(IncomingPaymentFileTypeSelector));
