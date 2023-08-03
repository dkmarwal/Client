import React, { useState } from 'react';
import { Grid, Box, Button, MenuItem } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import { TextField } from '~/components/Forms';
import { withTranslation } from 'react-i18next';
import { entityType, PayerTypes } from '~/config/entityTypes';
import Tooltip from '@material-ui/core/Tooltip';

const PaymentFileFilters = ({
  t,
  resetUpdateFilter,
  updateFilter,
  classes,
  paymentTypeList,
  dataFilterParams,
  allPaymentType: allPaymentTypeKeys,
  userData,
  apiPaymentTypesList,
  cardTypeList,
  payerTypeId
}) => {
  const [filter, setFilter] = useState({
    PaymentID: dataFilterParams.PaymentID || '',
    RemitToID: dataFilterParams.RemitToID || '',
    paymentTypeIDs: dataFilterParams.paymentTypeIDs || '',
    currency: dataFilterParams.currency || '',
    FileID: dataFilterParams.FileID || 0,
    invoiceNumber: dataFilterParams.invoiceNumber || '',
    invoiceAmount: dataFilterParams.invoiceAmount || 0,
    CardTypeID: dataFilterParams.CardTypeID || 0,
    paymentsReceivedVia: dataFilterParams ?.ReceiveTypeID || -1
  });
  const [allPaymentType] = useState(allPaymentTypeKeys);
  const isB2C = parseInt(userData.appType) === entityType.B2C;

  const onChangeFilter = (event) => {
    let { name, value } = event.target;
    if (['FileID'].includes(name) || ['PaymentID'].includes(name)) {
      value = !isNaN(parseInt(value)) ? parseInt(value) : 0;
    }
    if (name === 'PaymentID' && !isB2C) {
      value = event.target.value.replace(/[^0-9]/g, '');
    } else if (name === 'PaymentID') {
      //For B2C user alphanumeric allowed
      value = event.target.value.replace(/[^A-Za-z0-9]/g, '');
    }
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setFilter({
      ...filter,
      [name]: value ? value.trim() : null,
    });
  };

  const resetFilter = () => {
    setFilter({
      PaymentID: null,
      DebitAccountID: 0,
      statusIDs: '',
      RemitToID: undefined,
      paymentTypeIDs: undefined,
      currency: undefined,
      FileID: undefined,
      invoiceNumber: undefined,
      invoiceAmount: undefined,
      CardTypeID: undefined,
      ValueDate: undefined,
      PayeeName: undefined,
      amount: undefined,
      paymentRef: undefined,
      AmountFilterBy: undefined,
      paymentsReceivedVia: -1,
    });
    resetUpdateFilter({
      PaymentID: null,
      DebitAccountID: 0,
      statusIDs: '',
      RemitToID: undefined,
      paymentTypeIDs: undefined,
      currency: undefined,
      FileID: undefined,
      invoiceNumber: undefined,
      invoiceAmount: undefined,
      CardTypeID: undefined,
      ValueDate: undefined,
      PayeeName: undefined,
      amount: undefined,
      paymentRef: undefined,
      AmountFilterBy: undefined,
      paymentsReceivedVia: -1,
    });
  };

  const applyFilter = () => {
    let updateFilterObj = Object.keys(filter).reduce((obj, key) => {
      if (Boolean(filter[key])) {
        obj[key] = filter[key];
      }
      return obj;
    }, {});
    if (updateFilterObj ?.paymentsReceivedVia === -1){
      updateFilterObj = {
        ...updateFilterObj,
        paymentsReceivedVia: undefined
      }
    }
    updateFilter(updateFilterObj);
  };

  const {
    PaymentID,
    RemitToID,
    paymentTypeIDs,
    currency,
    FileID,
    invoiceNumber,
    invoiceAmount,
    paymentsReceivedVia
  } = filter;

  return (
    <Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth={true}
          color="secondary"
          autoComplete="off"
          name="PaymentID"
          label={t('componentData.SmallTxt.PaymentID')}
          variant="outlined"
          value={PaymentID || ''}
          onChange={onChangeFilter}
          onBlur={handleBlur}
          />
      </Grid>

      {
        payerTypeId != PayerTypes.CARDS &&
        <>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth={true}
            color="secondary"
            autoComplete="off"
            name="paymentTypeIDs"
            label={t('componentData.SmallTxt.DebitAccount')}
            value={-1}
            variant="outlined"
            >
            <MenuItem value={-1}>{t('componentData.SmallTxt.All')}</MenuItem>
            {[].map((option) => (
              <MenuItem id={1} key={1}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        </>
      }

      <Grid item xs={12}>
        <TextField
          fullWidth={true}
          color="secondary"
          autoComplete="off"
          name="FileID"
          label={t('componentData.SmallTxt.FileId')}
          variant="outlined"
          value={FileID || ''}
          onChange={onChangeFilter}
          />
      </Grid>
      <Grid item xs={12}>
        <TextField
          select
          fullWidth={true}
          color="secondary"
          autoComplete="off"
          name="paymentsReceivedVia"
          label={t('componentData.SmallTxt.PaymentsReceivedVia')}
          value={paymentsReceivedVia || -1}
          variant="outlined"
          onChange={onChangeFilter}
          >
          <MenuItem value={-1}>{t('componentData.SmallTxt.All')}</MenuItem>
          <MenuItem value={2}>{t('componentData.SmallTxt.File')}</MenuItem>
          <MenuItem value={3}>{t('componentData.SmallTxt.Portal')}</MenuItem>
        </TextField>
      </Grid>
      <Grid container item xs={12}>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
          mt={2}
          >
          <Button
            type="submit"
            fullWidth={false}
            variant="outlined"
            color="primary"
            size="large"
            className={classes.btnScpace}
            onClick={resetFilter}
            style={{ marginRight: '10px' }}
            >
            {t('componentData.SmallTxt.resetFilter')}
          </Button>
          <Button
            type="submit"
            fullWidth={false}
            variant="contained"
            size="large"
            color="primary"
            className={classes.btnScpace}
            onClick={applyFilter}
            style={{ marginLeft: '5px' }}
            >
            {t('componentData.SmallTxt.applyFilter')}
          </Button>
        </Box>
      </Grid>
    </Grid >
  );
};

export default withTranslation()(
  withStyles(styles, { index: 1 })(PaymentFileFilters)
);
