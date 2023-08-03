import React, { Component } from "react";
import { connect } from "react-redux";
import { Typography, Grid, withStyles } from "@material-ui/core";
import { styles } from "../styles";
import clsx from "clsx";
import { withTranslation } from "react-i18next";

import { paymentMethods } from "~/config/paymentMethods";

const CHKTransactionDetails = ({
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
        renderEachValue(t("componentData.paymentTransDetail.Notes"), Notes)}
      {renderEachValue(
        t("componentData.paymentTransDetail.CheckAddress"),
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
        renderEachValue(t("componentData.paymentTransDetail.Notes"), Notes)}
      {TraceNumber &&
        renderEachValue(
          t("componentData.paymentTransDetail.TraceNumber"),
          TraceNumber
        )}
    </Grid>
  );
};
const RTPTransactionDetails = ({
  TraceNumber,
  Notes,
  classes,
  t,
  PaymentRef,
  renderEachValue,
}) => {
  const showNotes = Notes && Notes.trim().length > 0 ? true : false;
  return (
    <Grid container item xs={6} className={classes.paymentGridCont}>
      {showNotes &&
        renderEachValue(t("componentData.paymentTransDetail.Notes"), Notes)}
      {renderEachValue(
        t("componentData.paymentTransDetail.PaymentRefno"),
        PaymentRef
      )}
    </Grid>
  );
};

const DDCTransactionDetails = ({
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
        renderEachValue(t("componentData.paymentTransDetail.Notes"), Notes)}
      {renderEachValue(
        t("componentData.paymentTransDetail.DisbursementRef"),
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
  return ZEL_UniqueRefID ? (
    <Grid container item xs={6} className={classes.paymentGridCont}>
      {showNotes &&
        renderEachValue(t("componentData.paymentTransDetail.Notes"), Notes)}
      {renderEachValue(
        //t('componentData.paymentTransDetail.PaymentID'),
        t("componentData.paymentTransDetail.ZelDisbursementId"),
        ZEL_UniqueRefID
      )}
    </Grid>
  ) : (
    <></>
  );
};

class USbankTransactionDetails extends Component {
  renderEachValue = (label, value) => {
    const { classes, isPaymentCancelled } = this.props;
    return (
      <Grid container item>
        <Grid item xs={6}>
          <Typography
            className={clsx(
              classes.heading,
              isPaymentCancelled && "isPaymentCancelled"
            )}
          >
            {label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            className={clsx(
              classes.subHeading,
              isPaymentCancelled && "isPaymentCancelled"
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

      case paymentMethods.USBankDepositToDebitcard:
        return (
          <DDCTransactionDetails
            renderEachValue={this.renderEachValue}
            {...this.props}
          />
        );
      case paymentMethods.USBankPrepaidCard:
      case paymentMethods.PrepaidFocusNonPayroll:
      case paymentMethods.PrepaidReliaCard:
      case paymentMethods.PlasticCorporateCard:
      case paymentMethods.DigitalCorporateCard:
        return (
          <DDCTransactionDetails
            renderEachValue={this.renderEachValue}
            {...this.props}
          />
        );
      case paymentMethods.USBankZelle:
        return (
          <ZelTransactionDetails
            renderEachValue={this.renderEachValue}
            {...this.props}
          />
        );
      case paymentMethods.USBankRTP:
        return (
          <RTPTransactionDetails
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
    withStyles(styles)(USbankTransactionDetails)
  )
);
