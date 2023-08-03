import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import ContentHeader from "~/components/ContentHeader";
import { Checkbox } from "~/components/Forms";
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { entityType } from '~/config/entityTypes';

const styles = (theme) => ({
  contentBackground: {
    backgroundColor: theme.palette.background.header,
    borderRadius: "4px",
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.15)",
  },
  primaryDark: {
    color: theme.palette.primary.dark,
  },
  imgIcon: {
    width: 32,
    height: 32,
   },
   payementBox:{ 
    "& span":{
      textTransform: "inherit"
    }
  }
});

class PaymentModeSelector extends Component {
  render() {
    const {
      paymentTypes,
      classes,
      px,
      py,
      paymentModeIcons,
      t,
    } = this.props;
    const appType = parseInt(sessionStorage.getItem('appType')) || entityType.B2B;
   
    return (
      <Box className={classes.contentBackground} px={px || 0} py={py || 0}>
        <ContentHeader title={t('componentData.paymentMethodSelector.PaymentInformation')} />
        <Box p={1.75}>
          <Typography variant="h4" className={classes.primaryDark}>
            {t('componentData.paymentMethodSelector.modeOfPay')}
          </Typography>
          <Box p={4}>
            <Grid container spacing={4}>
              {paymentTypes.map((paymentMode, index) => (
                <Grid key={`payment-mode-${index}`} item xs={3} sm={3} className={classes.payementBox}>
                  <Checkbox
                    checked={paymentMode.selected}
                    label={appType === entityType.B2C ? paymentMode.b2cDescription : paymentMode.alias}
                    icon={
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <img
                        src={
                          paymentMode.selected
                            ? paymentModeIcons[`${paymentMode.label}_selected`]
                            : paymentModeIcons[paymentMode.label]
                        }
                        alt={paymentMode.label}
                        style={{ height: "32px", padding: "0 0 10px 0" }}
                      />
                      </Box>
                    }
                    index={index}
                    onChange={(e, index, isChecked) =>
                      this.props.onChange &&
                      this.props.onChange(e, index, isChecked)
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

export default connect((state) => ({ ...state.user}))(withTranslation()(withStyles(styles)(PaymentModeSelector)));
