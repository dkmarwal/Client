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
import ACHIcon from '~/assets/icons/ACH.svg';
import ACHDisabledIcon from '~/assets/icons/account_balance@1x.svg';
import clsx from 'clsx';

const ACHDetails = (props) => {
  const {
    classes,
    t,
    PaymentType,
    RoutingNumber,
    DebitAccountNumber,
    DebitRoutingNumber,
    ClientAccountName,
    AccountNumber,
    SupplierAccountName,
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
                  src={isPaymentCancelled ? ACHDisabledIcon : ACHIcon}
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

          <Grid container item>
            <Grid item xs={1}></Grid>
            <Grid className={classes.infoText} item xs={5}>
              <Typography
                className={clsx(
                  classes.heading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.RoutingNumber')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {DebitRoutingNumber}
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
                {t('componentData.paymentTransDetail.OwnerName')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {ClientAccountName}
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
                  src={isPaymentCancelled ? ACHDisabledIcon : ACHIcon}
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
                {AccountNumber}
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
                {t('componentData.paymentTransDetail.RoutingNumber')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {RoutingNumber}
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
                {t('componentData.paymentTransDetail.OwnerName')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {SupplierAccountName}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};
export default withTranslation()(withStyles(styles)(ACHDetails));
