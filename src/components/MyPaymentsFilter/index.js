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
    CardTypeID: dataFilterParams.CardTypeID || 0
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
      AmountFilterBy: undefined
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
      AmountFilterBy: undefined
    });
  };

  const applyFilter = () => {
    const updateFilterObj = Object.keys(filter).reduce((obj, key) => {
      if (Boolean(filter[key])) {
        obj[key] = filter[key];
      }
      return obj;
    }, {});
    updateFilter(updateFilterObj);
  };

  const {
    PaymentID,
    RemitToID,
    paymentTypeIDs,
    currency,
    FileID,
    invoiceNumber,
    invoiceAmount
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
          {!isB2C && (
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                name="RemitToID"
                label={t('componentData.SmallTxt.PayeeID')}
                variant="outlined"
                value={RemitToID || ''}
                onChange={onChangeFilter}
                onBlur={handleBlur}
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="paymentTypeIDs"
              label={t('componentData.SmallTxt.PaymentMethod')}
              variant="outlined"
              onChange={onChangeFilter}
              value={paymentTypeIDs || ''}
            >
              <MenuItem value={allPaymentType}>
                {t('componentData.SmallTxt.All')}
              </MenuItem>
              {Object.keys(paymentTypeList).map((key, index) => {
                const paymentTypeName = apiPaymentTypesList.filter(
                  (elem) => elem.paymentTypeId === parseInt(key)
                )[0]?.description;
                return (
                  <MenuItem id={key} key={`${key}_${index}`} value={key}>
                    <Tooltip title={paymentTypeName} placement="left-start" arrow>
                      <div>
                        {paymentTypeList[key]}
                      </div>
                    </Tooltip>
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
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

      {!isB2C && (
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            color="secondary"
            autoComplete="off"
            name="invoiceNumber"
            label={t('componentData.SmallTxt.InvoiceNumber')}
            variant="outlined"
            value={(invoiceNumber === 0 ? '' : invoiceNumber) || ''}
            onChange={onChangeFilter}
          />
        </Grid>
      )}
      {!isB2C && (
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            color="secondary"
            autoComplete="off"
            name="invoiceAmount"
            label={t('componentData.SmallTxt.InvoiceAmount')}
            variant="outlined"
            value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
            onChange={onChangeFilter}
          />
        </Grid>
      )}
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
      {!isB2C && (
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            color="secondary"
            autoComplete="off"
            name="currency"
            label={t('componentData.SmallTxt.Currency')}
            variant="outlined"
            value={(currency === 0 ? '' : currency) || ''}
            onChange={onChangeFilter}
          />
        </Grid>
      )}
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
    </Grid>
  );
};

export default withTranslation()(
  withStyles(styles, { index: 1 })(PaymentFileFilters)
);
