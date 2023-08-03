import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import ExpansionBar from '~/components/ExpansionBar/PaymentDetails';
import BankDetail from '~/modules/BankDetail';
import VirtualCardDetail from '~/modules/VirtualCardDetail';
import CheckDetail from '~/modules/CheckDetail';
import { withTranslation } from 'react-i18next';
import Notification from '~/components/Notification';
import { styles } from './styles';
import { PayerTypes } from "~/config/entityTypes";

const PaymentDetails = (props) => {
  const {
    selectedPaymentModes,
    clientId,
    parentId,
    isHIPAA,
    showParentData,
    payerTypeId,
    t,
  } = props;
  const [errorText, setErrorText] = useState(false);
  const [variant, setVariant] = useState('error');
  const [expandedPaymentType, setExpandedPaymentType] = React.useState([]);

  const selectedarr = [];
  selectedPaymentModes.map(function (val, index) {
    if (val.selected === true) {
      selectedarr.push(val.label);
    }
  });

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
  return (
    <Box>
      {selectedarr.includes('ACH') && (
        <ExpansionBar
          label={t('componentData.paymenttDetails.companyBankAcc')}
          paymentType={'ACH'}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes('ACH')}
        >
          <BankDetail
            paymentType="ACH"
            clientId={clientId}
            parentId={parentId}
            isHIPAA={isHIPAA}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
          />
        </ExpansionBar>
      )}
      {selectedarr.includes('EFT') && (
        <ExpansionBar
          label={t('componentData.paymenttDetails.companyEFT')}
          paymentType={'EFT'}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes('EFT')}
        >
          <BankDetail
            paymentType="EFT"
            clientId={clientId}
            parentId={parentId}
            isHIPAA={isHIPAA}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
          />
        </ExpansionBar>
      )}
      {selectedarr.includes('VCA') && (
        payerTypeId != PayerTypes.CARDS ?
          <ExpansionBar
            label={t('componentData.paymenttDetails.CompanyVirtualCard')}
            paymentType={'VCA'}
            handleExpansion={handleExpansion}
            isExpanded={expandedPaymentType.includes('VCA')}
          >
            <VirtualCardDetail
              paymentType="VCA"
              clientId={clientId}
              parentId={parentId}
              isHIPAA={isHIPAA}
              showParentData={showParentData}
              setErrorText={setErrorText}
              setVariant={setVariant}
              handleCollapse={handleExpansion}
              payerTypeId={payerTypeId}
            />
          </ExpansionBar>
          :
          <VirtualCardDetail
            paymentType="VCA"
            clientId={clientId}
            parentId={parentId}
            isHIPAA={isHIPAA}
            showParentData={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            handleCollapse={handleExpansion}
            payerTypeId={payerTypeId}
          />
      )}
      {selectedarr.includes('CHK') && (
        <ExpansionBar
          label={t('componentData.paymenttDetails.CompanyCheck')}
          paymentType={'CHK'}
          handleExpansion={handleExpansion}
          isExpanded={expandedPaymentType.includes('CHK')}
        >
          <CheckDetail
            paymentType="CHK"
            clientId={clientId}
            parentId={parentId}
            isHIPAA={isHIPAA}
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

export default withTranslation()(withStyles(styles)(PaymentDetails));
