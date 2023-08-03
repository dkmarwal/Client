import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import USbankExpansionBar from '~/components/ExpansionBar/USbankPaymentDetails';
import USbankBankDetail from '~/modules/BankDetail/USbank';
import RTP from '~/modules/RTP';
import USbankCheck from '~/modules/CheckDetail/USbank';
import USbankDepositToDebit from '~/modules/DepositToDebitCard/USbank';
import USbankDepositToDebitcard from '~/modules/DepositToDebitCard';
import USbankZelleDetail from '~/modules/ZelleDetail/USbank';
import USBankPrepaidCard from '~/modules/PrepaidCard'
import { withTranslation } from 'react-i18next';
import { styles } from '../styles';
import { paymentMethods } from '~/config/paymentMethods';
import Notification from '~/components/Notification';
import { fetchCurrencyCodes } from '~/redux/helpers/settings';
import { fetchUSBankCheckData } from '~/redux/actions/USbank/payments';
import { connect } from 'react-redux';
import config from '~/config';
import { BankType } from '~/config/bankTypes';

const USbankPaymentDetails = (props) => {
  const {
    selectedPaymentModes,
    clientId,
    parentId,
    showParentData,
    t,
    isErr,
    paymentTypes,
    classes,
    dispatch,
  } = props;
  const [errorText, setErrorText] = useState(false);
  const [achFilled, setAchFilled] = React.useState(false);
  const [variant, setVariant] = useState('');
  const [expandedPaymentType, setExpandedPaymentType] = React.useState([]);
  const [currencyCodes, setCurrencyCodes] = React.useState(null);
  const [sortedSelectedMethods, setSortedSelectedMethods] = React.useState([]);
  let selectedarr = [];
  selectedarr = selectedPaymentModes.map((val, index) => {
    if (val.selected === true) {
      return val.label;
    } else return '';
  });
  let selectedarrids = [];
  selectedarrids = selectedPaymentModes.map((val, index) => {
    if (val.selected === true) {
      return val.key;
    } else return '';
  });
  React.useEffect(() => {
    if (selectedarrids && selectedPaymentModes) {
      const sortedArr = selectedPaymentModes.filter((payType) =>
        selectedarrids.includes(payType.key)
      );
      //.sort((a, b) => a.displayOrder - b.displayOrder);
      setSortedSelectedMethods(sortedArr);
      if (!props.USBankPayment?.checkDetail) {
        dispatch(fetchUSBankCheckData(clientId));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, showParentData, selectedPaymentModes]);
  React.useEffect(() => {
    fetchCurrencyCodes().then((res) => {
      setCurrencyCodes(res.data.rows);
    });
  }, []);

  const handleExpansion = (payType) => {
    const currentPayTypes = [...expandedPaymentType];
    const indexOfPaymentType = expandedPaymentType.findIndex(
      (item) => item === payType
    );
    if (indexOfPaymentType > -1) {
      currentPayTypes.splice(indexOfPaymentType, 1);
      setExpandedPaymentType(currentPayTypes);
    } else {
      currentPayTypes.push(payType);
      setExpandedPaymentType(currentPayTypes);
    }
  };

  isErr(variant);
  
  return (
    <Box>
      {selectedarr.includes(paymentMethods.USBankACH) && (
        <USbankExpansionBar
          paymentType={paymentMethods.USBankACH}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes(paymentMethods.USBankACH)}
          label={t('componentData.USbankpaymenttDetails.companyBankACH')}
        >
          <USbankBankDetail
            paymentType={paymentMethods.USBankACH}
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
            currencyCodes={currencyCodes}
            setAchFilled={setAchFilled}
          />
        </USbankExpansionBar>
      )}

      {selectedarr.includes(paymentMethods.USBankRTP) && (
        <USbankExpansionBar
          paymentType={paymentMethods.USBankRTP}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes(paymentMethods.USBankRTP)}
          label={t('componentData.USbankpaymenttDetails.companyBankRTP')}
          summary={
            <Typography className={classes.noteTxt}>
              <b>{t('componentData.USbanknoteDetails.note')}</b>
              {t('componentData.USbanknoteDetails.companynote')}
            </Typography>
          }
        >
          <RTP
            paymentType={paymentMethods.USBankRTP}
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
            currencyCodes={currencyCodes}
            selectedPaymentModes={selectedPaymentModes}
            achFilled={achFilled}
          />
        </USbankExpansionBar>
      )}

      {selectedarr.includes(paymentMethods.USBankZelle) && (
        <USbankExpansionBar
          paymentType={paymentMethods.USBankZelle}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes(paymentMethods.USBankZelle)}
          label={t('componentData.paymenttDetails.CompanyZelle')}
        >
          <USbankZelleDetail
            paymentTypeId={paymentMethods.USBankZelle}
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
            sortedSelectedMethods={sortedSelectedMethods}
          />
        </USbankExpansionBar>
      )}
      {selectedarr.includes(paymentMethods.USBankCHK) && (
        <USbankExpansionBar
          paymentType={paymentMethods.USBankCHK}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes(paymentMethods.USBankCHK)}
          label={t('componentData.USbankpaymenttDetails.companyBankCheck')}
          summary={
            <Typography className={classes.noteTxt}>
              <b>{t('componentData.USbanknoteDetails.note')}</b>
              {t('componentData.USbanknoteDetails.companynote')}
            </Typography>
          }
        >
          <USbankCheck
            paymentType={paymentMethods.USBankCHK}
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
            currencyCodes={currencyCodes}
            selectedPaymentModes={selectedPaymentModes}
            paymentTypes={paymentTypes}
            sortedSelectedMethods={sortedSelectedMethods}
          />
        </USbankExpansionBar>
      )}
      {selectedarr.includes(paymentMethods.USBankPrepaidCard) && (
        <USbankExpansionBar
          paymentType={paymentMethods.USBankPrepaidCard}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes(
            paymentMethods.USBankPrepaidCard
          )}
          label={t('componentData.USbankpaymenttDetails.companyPrepaidcard')}
        >
          <USBankPrepaidCard
            paymentType={paymentMethods.USBankPrepaidCard}
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
            currencyCodes={currencyCodes}
          />
        </USbankExpansionBar>
      )}
      {selectedarr.includes(paymentMethods.USBankDepositToDebitcard) && (
        <USbankExpansionBar
          paymentType={paymentMethods.USBankDepositToDebitcard}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes(
            paymentMethods.USBankDepositToDebitcard
          )}
          label={t('componentData.USbankpaymenttDetails.companyDeposit')}
        > 
          {config.bankTypeId === BankType.USBANK ? (
            <USbankDepositToDebit
              paymentType={paymentMethods.USBankDepositToDebitcard}
              clientId={clientId}
              parentId={parentId}
              showParentData={showParentData}
              setErrorText={setErrorText}
              setVariant={setVariant}
              handleCollapse={handleExpansion}
              currencyCodes={currencyCodes}
            />
          ) : (
            <USbankDepositToDebitcard
              paymentType={paymentMethods.USBankDepositToDebitcard}
              clientId={clientId}
              parentId={parentId}
              showParentData={showParentData}
              setErrorText={setErrorText}
              setVariant={setVariant}
              handleCollapse={handleExpansion}
              currencyCodes={currencyCodes}
            />
          )}
        </USbankExpansionBar>
      )}
      {errorText && (
        <Notification
          variant={variant}
          message={errorText}
          handleClose={() => setErrorText(false)}
        />
      )}
    </Box>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.USBankPayment,
  }))(withStyles(styles)(USbankPaymentDetails))
);
