import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Typography, Grid, withStyles } from '@material-ui/core';
import { styles } from '../styles';
import clsx from 'clsx';
import { withTranslation } from 'react-i18next';

import { paymentMethods } from '~/config/paymentMethods';

const VCATransactionDetails = ({
  PurchaseID,
  CardNumber,
  ExpiryDate,
  SecurityCodeAVV,
  Notes,
  classes,
  t,
  renderEachValue,
}) => {
  const showNotes = Notes && Notes.trim().length > 0 ? true : false;

  return (
    <Grid container item xs={6} className={classes.paymentGridCont}>
      {showNotes &&
        renderEachValue(t('componentData.paymentTransDetail.Notes'), Notes)}
      {renderEachValue(
        t('componentData.paymentTransDetail.PurchaseId'),
        PurchaseID
      )}
      {renderEachValue(
        t('componentData.paymentTransDetail.CardNumber'),
        CardNumber
      )}
      {renderEachValue(
        t('componentData.paymentTransDetail.ValidTo'),
        ExpiryDate
      )}
      {renderEachValue(
        t('componentData.paymentTransDetail.SecurityCode'),
        SecurityCodeAVV
      )}
    </Grid>
  );
};

const CHKTransactionDetails = ({
  CheckNumber,
  CheckAddress,
  Notes,
  classes,
  t,
  renderEachValue,
}) => {
  const showNotes = Notes && Notes.trim().length > 0 ? true : false;
  return (
    <Grid container item xs={6} className={classes.paymentGridCont}>
      {showNotes &&
        renderEachValue(t('componentData.paymentTransDetail.Notes'), Notes)}
      {renderEachValue(
        t('componentData.paymentTransDetail.CheckNo'),
        CheckNumber
      )}
      {renderEachValue(
        t('componentData.paymentTransDetail.CheckAddress'),
        CheckAddress
      )}
    </Grid>
  );
};

const ACHTransactionDetails = ({
  TraceNumber,
  Notes,
  classes,
  t,
  renderEachValue,
}) => {
  const showNotes = Notes && Notes.trim().length > 0 ? true : false;
  return (
    <Grid container item xs={6} className={classes.paymentGridCont}>
      {showNotes &&
        renderEachValue(t('componentData.paymentTransDetail.Notes'), Notes)}
      {renderEachValue(
        t('componentData.paymentTransDetail.TraceNumber'),
        TraceNumber
      )}
    </Grid>
  );
};

const PPLTransactionDetails = ({
  PPL_PayPalUniqueRefID,
  Notes,
  classes,
  t,
  renderEachValue,
}) => {
  const showNotes = Notes && Notes.trim().length > 0 ? true : false;
  return (
    <Grid container item xs={6} className={classes.paymentGridCont}>
      {showNotes &&
        renderEachValue(t('componentData.paymentTransDetail.Notes'), Notes)}
      {renderEachValue(
        t('componentData.paymentTransDetail.MessageId'),
        PPL_PayPalUniqueRefID
      )}
    </Grid>
  );
};

const PTCTransactionDetails = ({
  PaymentRef,
  Notes,
  classes,
  t,
  renderEachValue,
}) => {
  const showNotes = Notes && Notes.trim().length > 0 ? true : false;

  return (
    <Grid container item xs={6} className={classes.paymentGridCont}>
      {showNotes &&
        renderEachValue(t('componentData.paymentTransDetail.Notes'), Notes)}
      {renderEachValue(
        t('componentData.paymentTransDetail.DisbursementRef'),
        PaymentRef
      )}
    </Grid>
  );
};

const ZelTransactionDetails = ({
  ZEL_UniqueRefID,
  Notes,
  classes,
  t,
  renderEachValue,
}) => {
  const showNotes = Notes && Notes.trim().length > 0 ? true : false;
  return (
    <Grid container item xs={6} className={classes.paymentGridCont}>
      {showNotes &&
        renderEachValue(t('componentData.paymentTransDetail.Notes'), Notes)}
      {renderEachValue(
        //t('componentData.paymentTransDetail.PaymentID'),
        t('componentData.paymentTransDetail.ZelDisbursementRef'),
        ZEL_UniqueRefID
      )}
    </Grid>
  );
};

class TransactionDetails extends Component {
  renderEachValue = (label, value) => {
    const { classes, isPaymentCancelled } = this.props;
    return (
      <Grid container item>
        <Grid item xs={6}>
          <Typography
            className={clsx(
              classes.heading,
              isPaymentCancelled && 'isPaymentCancelled'
            )}
          >
            {label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            className={clsx(
              classes.subHeading,
              isPaymentCancelled && 'isPaymentCancelled'
            )}
          >
            {value}
          </Typography>
        </Grid>
      </Grid>
    );
  };
  render() {
    switch (this.props.PaymentType) {
      case paymentMethods.CHK:
        return (
          <CHKTransactionDetails
            renderEachValue={this.renderEachValue}
            {...this.props}
          />
        );
      case paymentMethods.VCA:
        return (
          <VCATransactionDetails
            renderEachValue={this.renderEachValue}
            {...this.props}
          />
        );
      case paymentMethods.PushToCard:
        return (
          <PTCTransactionDetails
            renderEachValue={this.renderEachValue}
            {...this.props}
          />
        );
      case paymentMethods.PayPal:
        return (
          <PPLTransactionDetails
            renderEachValue={this.renderEachValue}
            {...this.props}
          />
        );
      case paymentMethods.Zelle:
        return (
          <ZelTransactionDetails
            renderEachValue={this.renderEachValue}
            {...this.props}
          />
        );
      default:
        return (
          <ACHTransactionDetails
            renderEachValue={this.renderEachValue}
            {...this.props}
          />
        );
    }
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user }))(
    withStyles(styles)(TransactionDetails)
  )
);
