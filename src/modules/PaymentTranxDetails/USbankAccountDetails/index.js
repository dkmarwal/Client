import React from 'react';
import { withTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ReliaFocusDetails from './ReliaFocusDetails';
import DigitalPlasticDetails from './DigitalPlasticDetails';
import DDCDetails from './DDCDetails';
import { paymentMethods } from '~/config/paymentMethods';
import ZelleDetails from './zelleDetails';
import ACHDetails from './achDetails';
import RTPDetails from './RTPDetails';
// import digitalplasticDetails from './virtualCardDetails';
import CheckDetails from './checkDetails';
import clsx from 'clsx';

const USbankAccountDetails = (props) => {
  const { t, classes, paymentDetail, isPaymentCancelled = false } = props;
  const {
    AccountNumber,
    ClientAccountName,
    DebitAccountNumber,
    DebitRoutingNumber,
    PayeeName,
    PaymentType,
    SSLMerchantID,
    ConvergeID,
    FundingCardId,
    FundingCardPasscode,
    RoutingNumber,
    SupplierAccountName,
    ZEL_Bank,
    ZEL_TokenStatus,
    ZEL_TokenType,
    ZEL_TokenValue,
    PTC_CardExpiryDate,
    PTC_CardType,
    PTC_CardNumber,
    PTC_NameonCard,
  } = paymentDetail;
  return (
    <>
      <Grid container item className={classes.paymentGridCont}>
        <Typography
          variant='h5'
          className={clsx(
            classes.labelHeading,
            isPaymentCancelled && 'isPaymentCancelled'
          )}
        >
          {t('componentData.paymentTransDetail.AccountDetails')}
        </Typography>
      </Grid>
      {PaymentType === paymentMethods['USBankACH'] && (
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
      {PaymentType === paymentMethods['USBankDepositToDebitcard'] && (
        <DDCDetails
          SSLMerchantID={SSLMerchantID}
          ConvergeID={ConvergeID}
          PTC_CardExpiryDate={PTC_CardExpiryDate}
          PTC_CardNumber={PTC_CardNumber}
          PTC_NameonCard={PTC_NameonCard}
          PTC_CardType={PTC_CardType}
          PaymentType={PaymentType}
          isPaymentCancelled={isPaymentCancelled}
        />
      )}
      {PaymentType === paymentMethods['USBankRTP'] && (
        <RTPDetails
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
      {PaymentType === paymentMethods['USBankCHK'] && (
        <CheckDetails
          DebitAccountNumber={DebitAccountNumber}
          PayeeName={PayeeName}
          paymentCode={PaymentType}
          isPaymentCancelled={isPaymentCancelled}
        />
      )}

      {(PaymentType === paymentMethods['PrepaidFocusNonPayroll'] ||
        PaymentType === paymentMethods['PrepaidReliaCard']) && (
        <ReliaFocusDetails
          paymentCode={paymentMethods['USBankPrepaidCard']}
          isPaymentCancelled={isPaymentCancelled}
          payerName={ClientAccountName}
          DebitAccountNumber={DebitAccountNumber}
          PayeeName={PayeeName}
        />
      )}
        {(PaymentType === paymentMethods['PlasticCorporateCard'] ||
        PaymentType === paymentMethods['DigitalCorporateCard']) && (
        <DigitalPlasticDetails
          paymentCode={paymentMethods['USBankPrepaidCard']}
          isPaymentCancelled={isPaymentCancelled}
          payerName={ClientAccountName}
          DebitAccountNumber={DebitAccountNumber}
          PayeeName={PayeeName}
        />
      )}
      {PaymentType === paymentMethods['USBankZelle'] && (
        <ZelleDetails
          tokenType={ZEL_TokenType}
          tokenValue={ZEL_TokenValue}
          tokenStatus={ZEL_TokenStatus}
          bankName={ZEL_Bank}
          payeeName={PayeeName}
          payerName={ClientAccountName}
          paymentCode={paymentMethods['USBankZelle']}
          isPaymentCancelled={isPaymentCancelled}
          DebitAccountNumber={DebitAccountNumber}
        />
      )}
      {(PaymentType === paymentMethods['PlasticCorporateCard'] ||
        PaymentType === paymentMethods['DigitalCorporateCard']) && (
        <digitalplasticDetails
          paymentCode={paymentMethods['PrepaidCorporateReward']}
          isPaymentCancelled={isPaymentCancelled}
          payerName={ClientAccountName}
          FundingCardID={FundingCardId}
          FundingCardPasscode={FundingCardPasscode}
          PayeeName={PayeeName}
        />
      )}
    </>
  );
};

export default withTranslation()(USbankAccountDetails);
