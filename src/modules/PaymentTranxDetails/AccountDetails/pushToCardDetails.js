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
import PushToCardIcon from '~/assets/icons/Push_to_Card.svg';
import clsx from 'clsx';
import PushToCardDisabled from '~/assets/icons/PushToCard@1x.svg';

const PushToCardDetails = (props) => {
  const {
    classes,
    t,
    address,
    expiryDate,
    cardType,
    cardNumber,
    nameOnCard,
    paymentCode,
    DebitAccountNumber,
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
              <Tooltip title={paymentCode} arrow placement="right">
                <img
                  src={isPaymentCancelled ? PushToCardDisabled : PushToCardIcon}
                  alt={paymentCode}
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
                {t('componentData.paymentTransDetail.BankAccount')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {DebitAccountNumber}
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
              <Tooltip title={paymentCode} arrow placement="right">
                <img
                  src={isPaymentCancelled ? PushToCardDisabled : PushToCardIcon}
                  alt={paymentCode}
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
                {nameOnCard}
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
                {cardType}
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
                {cardNumber}
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
                {expiryDate}
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
                {t('componentData.paymentTransDetail.Address')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {address}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withTranslation()(withStyles(styles)(PushToCardDetails));
