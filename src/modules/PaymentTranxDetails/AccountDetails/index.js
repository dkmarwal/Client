import React from 'react';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PayPalDetails from './paypalDetails';
import PushToCardDetails from './pushToCardDetails';
import { paymentMethods } from '~/config/paymentMethods';
import ZelleDetails from './zelleDetails';
import ACHDetails from './achDetails';
import VirtualCardDetails from './virtualCardDetails';
import CheckDetails from './checkDetails';
import clsx from 'clsx';

const AccountDetails = (props) => {
  const { t, classes, paymentDetail, isPaymentCancelled = false } = props;
  const {
    AccountNumber,
    ClientAccountName,
    DebitAccountNumber,
    DebitRoutingNumber,
    EmailID,
    MSC_CardAddress,
    MSC_CardExpiryDate,
    MSC_CardNumber,
    MSC_CardType,
    MSC_NameonCard,
    PayeeName,
    PaymentType,
    PPL_TokenType,
    PPL_TokenValue,
    PPL_Address,
    RoutingNumber,
    SupplierAccountName,
    ValueDate,
    ZEL_Bank,
    ZEL_TokenStatus,
    ZEL_TokenType,
    ZEL_TokenValue,
  } = paymentDetail;
  return (
    <>
      <Grid container item className={classes.paymentGridCont}>
        <Typography
          variant="h5"
          className={clsx(
            classes.labelHeading,
            isPaymentCancelled && 'isPaymentCancelled'
          )}
        >
          {t('componentData.paymentTransDetail.AccountDetails')}
        </Typography>
      </Grid>
      {(PaymentType === 'ACH' || PaymentType === 'EFT') && (
        <ACHDetails
          DebitAccountNumber={DebitAccountNumber}
          DebitRoutingNumber={DebitRoutingNumber}
          ClientAccountName={ClientAccountName}
          SupplierAccountName={SupplierAccountName}
          PaymentType={PaymentType}
          RoutingNumber={RoutingNumber}
          AccountNumber={AccountNumber}
          isPaymentCancelled={isPaymentCancelled}
        />
      )}
      {PaymentType === 'VCA' && (
        <VirtualCardDetails
          DebitAccountNumber={DebitAccountNumber}
          PayeeName={PayeeName}
          EmailID={EmailID}
          PaymentType={PaymentType}
          ValueDate={ValueDate}
          isPaymentCancelled={isPaymentCancelled}
        />
      )}
      {PaymentType === 'CHK' && (
        <CheckDetails
          DebitAccountNumber={DebitAccountNumber}
          PayeeName={PayeeName}
          paymentCode={PaymentType}
          isPaymentCancelled={isPaymentCancelled}
        />
      )}

      {PaymentType === paymentMethods['PayPal'] && (
        <PayPalDetails
          tokenType={PPL_TokenType}
          tokenValue={PPL_TokenValue}
          pplAddress={PPL_Address}
          paymentCode={paymentMethods['PayPal']}
          isPaymentCancelled={isPaymentCancelled}
          payerName={ClientAccountName}
          DebitAccountNumber={DebitAccountNumber}
        />
      )}
      {PaymentType === paymentMethods['PushToCard'] && (
        <PushToCardDetails
          address={MSC_CardAddress}
          expiryDate={MSC_CardExpiryDate}
          cardType={MSC_CardType}
          cardNumber={MSC_CardNumber}
          nameOnCard={MSC_NameonCard}
          paymentCode={paymentMethods['PushToCard']}
          isPaymentCancelled={isPaymentCancelled}
          payerName={ClientAccountName}
          DebitAccountNumber={DebitAccountNumber}
        />
      )}
      {PaymentType === paymentMethods['Zelle'] && (
        <ZelleDetails
          tokenType={ZEL_TokenType}
          tokenValue={ZEL_TokenValue}
          tokenStatus={ZEL_TokenStatus}
          bankName={ZEL_Bank}
          payeeName={PayeeName}
          payerName={ClientAccountName}
          paymentCode={paymentMethods['Zelle']}
          isPaymentCancelled={isPaymentCancelled}
          DebitAccountNumber={DebitAccountNumber}
        />
      )}
    </>
  );
};

export default withTranslation()(AccountDetails);
