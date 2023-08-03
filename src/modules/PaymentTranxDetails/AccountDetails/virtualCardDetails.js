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
import VCAIcon from '~/assets/icons/vca_card.svg';
import VCADisabled from '~/assets/icons/VCA@1x.svg';
import clsx from 'clsx';

const VirtualCardDetails = (props) => {
  const {
    DebitAccountNumber,
    PayeeName,
    EmailID,
    PaymentType,
    ValueDate,
    t,
    classes,
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
              <Tooltip title={PaymentType} arrow placement="right">
                <img
                  src={isPaymentCancelled ? VCADisabled : VCAIcon}
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
            <Grid item xs={5}>
              <Typography variant="body1" style={{ visibility: 'hidden' }}>
                --
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
                  src={isPaymentCancelled ? VCADisabled : VCAIcon}
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
                {t('componentData.paymentTransDetail.PayeeName')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {PayeeName}
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
                {t('componentData.paymentTransDetail.EmailAddress')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
                title={EmailID || ''}
              >
                <Box component="div" overflow="hidden" textOverflow="ellipsis">
                  {EmailID}
                </Box>
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
                {t('componentData.paymentTransDetail.ValidFrom')}
              </Typography>
            </Grid>
            <Grid className={classes.infoText} item xs={6}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                <Box component="div" overflow="hidden" textOverflow="ellipsis">
                  {ValueDate}
                </Box>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default withTranslation()(withStyles(styles)(VirtualCardDetails));
