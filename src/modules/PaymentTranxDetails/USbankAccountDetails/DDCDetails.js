import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import { styles } from '../styles';
import DDCIcon from '~/assets/icons/USbank/Deposit_to_Card_main.svg';
import DDCDisabledIcon from '~/assets/icons/USbank/Deposit_icon@1x.svg';
import clsx from 'clsx';

const DDCDetails = (props) => {
  const {
    classes,
    t,
    PaymentType,
    SSLMerchantID,
    ConvergeID,
    PTC_CardExpiryDate,
    PTC_CardNumber,
    PTC_NameonCard,
    PTC_CardType,
    isPaymentCancelled = false,
  } = props;

  return (
    <Grid
      container
      item
      alignItems="center"
      className={classes.paymentGridCont}
    >
      <Grid item xs={5} alignItems="center">
        <Paper square className={classes.boxSpace} elevation={2}>
          <Grid container item alignItems="center">
            <Grid item xs={1} className={classes.iconImage}>
              <Tooltip title={'ACH'} arrow placement="right">
                <img
                  src={isPaymentCancelled ? DDCDisabledIcon : DDCIcon}
                  alt={PaymentType}
                />
              </Tooltip>
            </Grid>
            <Grid className={classes.infoText} item xs={5}>
              <Typography
                className={clsx(
                  classes.heading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.SSLMerchantID')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {SSLMerchantID}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item>
            <Grid item xs={1}></Grid>
            <Grid className={classes.infoText} item xs={5}>
              <Typography
                className={clsx(
                  classes.heading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.ConvergeID')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {ConvergeID}
              </Typography>
            </Grid>
          </Grid>
         
        </Paper>
      </Grid>
      <Grid item xs={2}>
        <Box
          display="flex"
          justifyContent="center"
          className={classes.iconImage}
        >
          <ArrowForwardIosRoundedIcon fontSize="small" color={isPaymentCancelled ? 'disabled' : 'inherit'} />
        </Box>
      </Grid>
      <Grid item xs={5} alignItems="center">
        <Paper square className={classes.boxSpace} elevation={2}>
          <Grid container item alignItems="center">
            <Grid item xs={1} className={classes.iconImage}>
              <Tooltip title={PaymentType} arrow placement="right">
                <img
                  src={isPaymentCancelled ? DDCDisabledIcon : DDCIcon}
                  alt={PaymentType}
                />
              </Tooltip>
            </Grid>
            <Grid className={classes.infoText} item xs={5}>
              <Typography
                className={clsx(
                  classes.heading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.NameOnCard')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {PTC_NameonCard}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={1}></Grid>
            <Grid className={classes.infoText} item xs={5}>
              <Typography
                className={clsx(
                  classes.heading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.CardType')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {PTC_CardType}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={1}></Grid>
            <Grid className={classes.infoText} item xs={5}>
              <Typography
                className={clsx(
                  classes.heading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.CardNumber')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {PTC_CardNumber}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item>
            <Grid item xs={1}></Grid>
            <Grid className={classes.infoText} item xs={5}>
              <Typography
                className={clsx(
                  classes.heading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.ExpiryDate')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {PTC_CardExpiryDate}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default withTranslation()(withStyles(styles)(DDCDetails));
