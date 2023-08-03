import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import ExpansionBar from '~/components/ExpansionBar/PaymentDetails';
import B2CBankDetail from '~/modules/BankDetail/B2C';
import B2CPayPalDetail from '~/modules/PayPalDetail';
import B2CCheckDetail from '~/modules/CheckDetail/B2C';
import B2CPushToCardDetail from '~/modules/PushToCardDetail';
import ZelleDetail from '~/modules/ZelleDetail';
import { withTranslation } from 'react-i18next';
import { styles } from '../styles';
import { paymentMethods } from '~/config/paymentMethods';
import Notification from '~/components/Notification';
import { fetchCurrencyCodes } from '~/redux/helpers/settings';

const B2CPaymentDetails = (props) => {
  const { selectedPaymentModes, clientId, parentId, showParentData, t, isErr } =
    props;
  const [errorText, setErrorText] = useState(false);
  const [variant, setVariant] = useState('');
  const [expandedPaymentType, setExpandedPaymentType] = React.useState([]);
  const [currencyCodes, setCurrencyCodes] = React.useState(null);
  let selectedarr = [];
  selectedarr = selectedPaymentModes.map((val, index) => {
    if (val.selected === true) {
      return val.label;
    } else {return '';}
  });

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
      {selectedarr.includes(paymentMethods.Zelle) && (
        <ExpansionBar
          paymentType={paymentMethods.Zelle}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes(paymentMethods.Zelle)}
          label={t('componentData.paymenttDetails.CompanyZelle')}
        >
          <ZelleDetail
            paymentTypeId={paymentMethods.Zelle}
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
          />
        </ExpansionBar>
      )}
      {selectedarr.includes(paymentMethods.PushToCard) && (
        <ExpansionBar
          paymentType={paymentMethods.PushToCard}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes(paymentMethods.PushToCard)}
          label={t('componentData.paymenttDetails.CompanyPushToCard')}
        >
          <B2CPushToCardDetail
            paymentTypeId={paymentMethods.PushToCard}
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
          />
        </ExpansionBar>
      )}
      {selectedarr.includes(paymentMethods.PayPal) && (
        <ExpansionBar
          paymentType={paymentMethods.PayPal}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes(paymentMethods.PayPal)}
          label={t('componentData.paymenttDetails.CompanyPayPal')}
        >
          <B2CPayPalDetail
            paymentTypeId={paymentMethods.PayPal}
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
          />
        </ExpansionBar>
      )}
      {selectedarr.includes('ACH') && (
        <ExpansionBar
          paymentType={'ACH'}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes('ACH')}
          label={t('componentData.paymenttDetails.companyBankDet')}
        >
          <B2CBankDetail
            paymentType="ACH"
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
            currencyCodes={currencyCodes}
          />
        </ExpansionBar>
      )}    
      {selectedarr.includes('CHK') && (
        <ExpansionBar
          paymentType={'CHK'}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes('CHK')}
          label={t('componentData.paymenttDetails.CompanyCheck')}
        >
          <B2CCheckDetail
            paymentTypeId={'CHK'}
            clientId={clientId}
            parentId={parentId}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
          />
        </ExpansionBar>
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

export default withTranslation()(withStyles(styles)(B2CPaymentDetails));
