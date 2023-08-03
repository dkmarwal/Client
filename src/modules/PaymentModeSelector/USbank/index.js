import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import ContentHeader from "~/components/ContentHeader";
import { Checkbox } from "~/components/Forms";
import Checkbox2 from "@material-ui/core/Checkbox";
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { entityType } from '~/config/entityTypes';
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { paymentMethods, paymentMethodIds } from "~/config/paymentMethods";

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
  },
  formLabel: {
    color: "#0b0c0c",
    padding: "2px",
    paddingTop: "5px",
    fontSize: "12px",
  },
});

class USbankPaymentModeSelector extends Component {
  render() {
    const {
      paymentTypes,
      classes,
      px,
      py,
      paymentModeIcons,
      t,
      selectedPaymentTypes,

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
  
                <Grid key={`payment-mode-${index}`} item xs={2} sm={2} 
                // className={classes.payementBox}
                >
                  <Box display="flex" flexDirection="column">
                  <Checkbox
                    checked={paymentMode.selected}
                   
                    label={appType === entityType.B2C ? paymentMode.b2cDescription : paymentMode.alias}
                    icon={
                      <Box display="flex" justifyContent="center" alignItems="center"  style={{height:"auto"}}>
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
                    onChange={(e, index, isChecked,fileFormatId=paymentMode.label) =>
                      this.props.onChange &&
                      this.props.onChange(e, index, isChecked,fileFormatId=paymentMode.key)
                    }
                  />
                  <Box>
                    {paymentMode.label === paymentMethods.USBankACH ||
                              paymentMode.label === paymentMethods.USBankCHK ||
                              paymentMode.label === paymentMethods.USBankRTP ? (
                                <Box>
                                  <FormControl
                                    component="fieldset"
                                    className={classes.formLabel}
                                  >
                                   { t('componentData.paymentMethodSelector.Applicablefor')}
                                    <FormGroup>
                                      <FormControlLabel
                                        control={
                                          <Checkbox2
                                            name={`${paymentMode.label}B2B`}
                                            checked={
                                              selectedPaymentTypes.includes(
                                                paymentMode.key
                                              )
                                                ? this.props.checkedB2B&&this.props.checkedB2B(paymentMode.label)
                                                : false
                                            }
                                            onChange={this.props.handleChange&&
                                              this.props.handleChange}
                                          />
                                        }
                                        label="B2B"
                                        disabled={
                                          selectedPaymentTypes.includes(
                                            paymentMode.key
                                          )
                                            ? false
                                            : true
                                        }
                                      />
                                      <FormControlLabel
                                        control={
                                          <Checkbox2
                                            name={`${paymentMode.label}B2C`}
                                            checked={
                                              selectedPaymentTypes.includes(
                                                paymentMode.key
                                              )
                                                ? this.props.checkedB2C&&this.props.checkedB2C(paymentMode.label)
                                                : false
                                            }
                                            onChange={this.props.handleChange&&
                                              this.props.handleChange}
                                          />
                                        }
                                        label="B2C"
                                        disabled={
                                          selectedPaymentTypes.includes(
                                            paymentMode.key
                                          )
                                            ? false
                                            : true
                                        }
                                      />
                                    </FormGroup>
                                  </FormControl>
                                </Box>
                              ) : (
                                <FormControl
                                  component="fieldset"
                                  className={classes.formLabel}
                                >
                               { t('componentData.paymentMethodSelector.ApplicableforB2C')}
                                </FormControl>
                              )}  
                              </Box>
                              </Box>
                </Grid>
               
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default connect((state) => ({ ...state.user}))(withTranslation()(withStyles(styles)(USbankPaymentModeSelector)));
