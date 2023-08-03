import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  MenuItem,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  getB2CClientBankInfo,
  achB2CProfilesInformation,
  createB2CBankInfo,
  updateB2CBankInfo,
  fetchAllB2CAchList,
} from '~/redux/actions/B2C/payments';
import MaskInput from '~/components/MaskInput';

const useStyles = makeStyles((theme) => ({
  popupInner: {
    float: 'left',
    width: '100%',
    padding: '0',
    boxSizing: 'border-box',
  },

  inputBox: {
    float: 'left',
    padding: '10px 10px 0',
    minHeight: '80px',
    '& .MuiTextField-root': {
      width: '100%',
    },
    '& .MuiFormControl-root': {
      width: '100%',
    },
    '& input': {
      color: '#2B2D30',
      fontSize: '16px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      height: '56px',
    },
    '& .MuiFormLabel-root': {
      fontSize: '16px',
    },
  },
}));

const B2CBankDetail = ({
  clientId,
  parentId,
  paymentType,
  showParentData,
  dispatch,
  setErrorText,
  setVariant,
  handleCollapse,
  currencyCodes,
  achAccountList,
  t,
}) => {
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [bankDetailInfo, setBankDetailInfo] = useState({
    data: {
      accountId: '',
      accountName: null,
      accountNumber: null,
      routingCode: null,
      companyName: null,
      immediateOrigin: '',
      immediateOriginName: '',
      immediateDestination: '',
      immediateDestinationName: '',
      companyIdentification: null,
      companyEntryDescription: null,
      companyDiscretionaryData: null,
      originatingDFIIdentification: null,
      originatingDFIDiscretionaryData: null,
      type: paymentType,
      currencyCode: null,
    },
    error: {
      accountId: '',
      accountName: '',
      accountNumber: '',
      routingCode: '',
      companyName: '',
      companyIdentification: '',
      companyEntryDescription: '',
      companyDiscretionaryData: '',
      originatingDFIIdentification: '',
      originatingDFIDiscretionaryData: '',
      type: paymentType,
      currencyCode: '',
    },
  });

  useEffect(() => {
    if (showParentData) {
      initBankInformation(parentId, true);
    } else {
      initBankInformation(clientId);
    }
   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showParentData, parentId, clientId, achAccountList]);

  const classes = useStyles();

  const initBankInformation = async (clientId, isParent) => {
    let bankDetail = {};
    const bankDetailinfo = await getB2CClientBankInfo({
      clientId,
      paymentType: paymentType,
      showParentData,
    });
    let { data, error } = bankDetailinfo;
    if (error) {
      setErrorText(t('componentData.bankDetail.failToLoad'));
      setVariant('error');
      return false;
    }
    bankDetail = data.rows && data.rows.length > 0 ? data.rows[0] : {};
    const isDefaultAccount = data.rows?.find((account) => {
      return account.isDefault === 1;
    });
    let clientBankDetail = isDefaultAccount
      ? isDefaultAccount
      : bankDetail || {};
    if (isParent) {
      const { accountId, ...restDetails } = isDefaultAccount
        ? isDefaultAccount
        : bankDetail;
      clientBankDetail = restDetails;
    }

    let achImmediateInfoArr = [];
    const achImmediateInfo = await achB2CProfilesInformation();
    if (achImmediateInfo && achImmediateInfo.data) {
      let { data = [] } = achImmediateInfo.data;
      achImmediateInfoArr = data || [];
    }

    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        ...clientBankDetail,
        ...achImmediateInfoArr,
      },
    });
  };

  const { data, error } = bankDetailInfo;
  const {
    accountId,
    accountName,
    accountNumber,
    routingCode,
    companyName,
    immediateOrigin,
    immediateOriginName,
    immediateDestination,
    immediateDestinationName,
    companyIdentification,
    companyEntryDescription,
    companyDiscretionaryData,
    originatingDFIIdentification,
    originatingDFIDiscretionaryData,
    type,
    currencyCode,
  } = data;

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        [name]: value ? value.trim() : null,
      },
    });
  };
  const onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;

    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        [name]: value.length === 0 ? null : value,
      },
    });
  };

  const handleIntegerValueChange = (event) => {
    const { name, value } = event.target;
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
      },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        accountId,
        accountName,
        accountNumber: Boolean(accountNumber) ? accountNumber : null,
        routingCode,
        companyName,
        companyIdentification,
        companyEntryDescription,
        companyDiscretionaryData,
        originatingDFIIdentification,
        originatingDFIDiscretionaryData,
        type,
        currencyCode,
      };

      if (accountId) {
        dispatch(
          updateB2CBankInfo({
            clientId: clientId,
            bankDetail: data,
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (!response || response.error) {
            setErrorText(
              response.message ??
                t('componentData.bankDetail.ErrorWhileSavingData')
            );
            setVariant('error');
            return false;
          } else {
            dispatch(fetchAllB2CAchList(clientId, showParentData));
            setErrorText(t('componentData.bankDetail.BankAccountDataUpdated'));
            setVariant('success');
            handleCollapse(paymentType);
          }
        });
      } else {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          createB2CBankInfo({
            clientId: clientId,
            bankDetail: restBankDetail,
          })
        ).then((accountId) => {
          setSaveProcessing(false);
          if (accountId) {
            setBankDetailInfo({
              ...bankDetailInfo,
              data: {
                ...bankDetailInfo.data,
                accountId: accountId,
              },
            });
            dispatch(fetchAllB2CAchList(clientId, showParentData));
            setErrorText(t('componentData.bankDetail.BankAccountDataSaved'));
            setVariant('success');
            handleCollapse(paymentType);
          } else {
            setErrorText(t('componentData.bankDetail.ErrorWhileSavingData'));
            setVariant('error');
            return false;
          }
        });
      }
    } else {
      setSaveProcessing(false);
      setErrorText(t('componentData.commonErr.validationMsg'));
      setVariant('error');
      return false;
    }
  };

  const validation = () => {
    let valid = true;
    let validation = {};

    if (accountNumber && accountNumber.length > 17) {
      validation['accountNumber'] = t('componentData.bankDetail.acNumMaxLen');
      valid = false;
    } else if (accountNumber && accountNumber.length < 6) {
      validation['accountNumber'] = t('componentData.bankDetail.acNumMinLen');
      valid = false;
    }
    if (accountName && accountName.length > 50) {
      validation['accountName'] = t(
        'componentData.bankDetail.AccountNameMaxLen'
      );
      valid = false;
    }
    if (routingCode && routingCode.length !== 9) {
      validation['routingCode'] = t('componentData.bankDetail.RoutingCodeLen');
      valid = false;
    }
    if (companyName && companyName.length > 16) {
      validation['companyName'] = t(
        'componentData.bankDetail.CompanyNameMaxLen'
      );
      valid = false;
    }
    if (companyIdentification && companyIdentification.length !== 10) {
      validation['companyIdentification'] = t(
        'componentData.bankDetail.CompanyIdentificationLen'
      );
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length < 2) {
      validation['companyEntryDescription'] = t(
        'componentData.bankDetail.CompanyEntryMinLen'
      );
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length > 10) {
      validation['companyEntryDescription'] = t(
        'componentData.bankDetail.CompanyEntryMaxLen'
      );
      valid = false;
    }
    if (companyDiscretionaryData && companyDiscretionaryData.length > 20) {
      validation['companyDiscretionaryData'] = t(
        'componentData.bankDetail.CompanyDiscretionaryDataMaxLen'
      );
      valid = false;
    }
    if (
      originatingDFIIdentification &&
      originatingDFIIdentification.length !== 8
    ) {
      validation['originatingDFIIdentification'] = t(
        'componentData.bankDetail.originatingDFIIdentificationLen'
      );
      valid = false;
    }
    if (
      originatingDFIDiscretionaryData &&
      originatingDFIDiscretionaryData.length > 2
    ) {
      validation['originatingDFIDiscretionaryData'] = t(
        'componentData.bankDetail.OriginatingDFIDiscretionaryDataMinLen'
      );
      valid = false;
    }
    setBankDetailInfo({
      ...bankDetailInfo,
      error: { ...validation },
    });
    return valid;
  };
  return (
    <Box className={classes.popupInner}>
      <Grid container>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.AccountName')}
            error={Boolean(error.accountName)}
            helperText={error.accountName}
            fullWidth={true}
            autoComplete="off"
            variant="outlined"
            color="secondary"
            value={accountName || ''}
            name="accountName"
            onChange={onChange}
            inputProps={{
              maxLength: 50,
              minLength: 1,
            }}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.BankRoutingCode')}
            error={Boolean(error.routingCode)}
            helperText={error.routingCode}
            fullWidth={true}
            autoComplete="off"
            variant="outlined"
            color="secondary"
            value={routingCode || ''}
            name="routingCode"
            onChange={handleIntegerValueChange}
            inputProps={{
              maxLength: 9,
              minLength: 9,
            }}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <MaskInput
            label={t('componentData.bankDetail.BankAccountNumber')}
            error={Boolean(error.accountNumber)}
            helperText={error.accountNumber}
            fullWidth={true}
            autoComplete="off"
            variant="outlined"
            color="secondary"
            value={accountNumber || ''}
            name="accountNumber"
            inputProps={{
              maxLength: 17,
              minLength: 6,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            getValue={(val) => {
              setBankDetailInfo({
                ...bankDetailInfo,
                data: { ...bankDetailInfo.data, accountNumber: val },
              });
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.CompanyName')}
            error={Boolean(error.companyName)}
            helperText={error.companyName}
            fullWidth={true}
            autoComplete="off"
            color="secondary"
            variant="outlined"
            value={companyName || ''}
            name="companyName"
            onChange={onChange}
            inputProps={{ minLength: 1, maxLength: 16 }}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.CompanyIdentificationNumber')}
            error={Boolean(error.companyIdentification)}
            helperText={error.companyIdentification}
            fullWidth={true}
            autoComplete="off"
            color="secondary"
            variant="outlined"
            value={companyIdentification || ''}
            name="companyIdentification"
            onChange={handleIntegerValueChange}
            inputProps={{
              maxLength: 10,
              minLength: 10,
            }}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.CompanyEntryDescription')}
            error={Boolean(error.companyEntryDescription)}
            helperText={error.companyEntryDescription}
            fullWidth={true}
            color="secondary"
            autoComplete="off"
            variant="outlined"
            value={companyEntryDescription || ''}
            name="companyEntryDescription"
            onChange={onChange}
            inputProps={{
              maxLength: 10,
              minLength: 2,
            }}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            select
            fullWidth={true}
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            autoComplete="off"
            value={currencyCode}
            name="currencyCode"
            label={t('componentData.bankDetail.CurrencyCode')}
            onChange={onChange}
            dir="horizontal"
            inputProps={{
              maxLength: 100,
            }}
            onBlur={handleBlur}
          >
            {currencyCodes &&
              currencyCodes
                .filter((item) => item.isoCode === 'USD')
                .map((code) => (
                  <MenuItem key={code.isoCode} value={code.isoCode}>
                    {code.name}
                  </MenuItem>
                ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.CompanyDiscretionaryData')}
            error={Boolean(error.companyDiscretionaryData)}
            helperText={error.companyDiscretionaryData}
            fullWidth={true}
            color="secondary"
            autoComplete="off"
            variant="outlined"
            value={companyDiscretionaryData || ''}
            name="companyDiscretionaryData"
            onChange={onChange}
            inputProps={{
              maxLength: 20,
              minLength: 1,
            }}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.OriginatingDFIIdentification')}
            error={Boolean(error.originatingDFIIdentification)}
            helperText={error.originatingDFIIdentification}
            fullWidth={true}
            autoComplete="off"
            color="secondary"
            variant="outlined"
            value={originatingDFIIdentification || ''}
            name="originatingDFIIdentification"
            onChange={handleIntegerValueChange}
            inputProps={{
              maxLength: 8,
              minLength: 8,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t(
              'componentData.bankDetail.OriginatingDFIDiscretionaryData'
            )}
            error={Boolean(error.originatingDFIDiscretionaryData)}
            helperText={error.originatingDFIDiscretionaryData}
            fullWidth={true}
            autoComplete="off"
            color="secondary"
            variant="outlined"
            value={originatingDFIDiscretionaryData || ''}
            name="originatingDFIDiscretionaryData"
            onChange={onChange}
            inputProps={{
              maxLength: 2,
              minLength: 1,
            }}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.ImmediateOrigin')}
            disabled={true}
            fullWidth={true}
            autoComplete="off"
            color="secondary"
            variant="outlined"
            value={immediateOrigin || ''}
            inputProps={{
              maxLength: 10,
              minLength: 10,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.ImmediateOriginName')}
            disabled={true}
            fullWidth={true}
            color="secondary"
            autoComplete="off"
            variant="outlined"
            value={immediateOriginName || ''}
            inputProps={{
              maxLength: 23,
              minLength: 1,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.ImmediateDestination')}
            disabled={true}
            color="secondary"
            fullWidth={true}
            autoComplete="off"
            variant="outlined"
            value={immediateDestination || ''}
            inputProps={{
              maxLength: 9,
              minLength: 9,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.ImmediateDestinationName')}
            disabled={true}
            color="secondary"
            fullWidth={true}
            autoComplete="off"
            variant="outlined"
            value={immediateDestinationName || ''}
            inputProps={{
              maxLength: 23,
              minLength: 1,
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {saveProcessing ? (
            <CircularProgress color="primary" />
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => onSubmit()}
              style={{ display: 'block', margin: '15px auto 0', fontSize: 14 }}
            >
              {t('componentData.bankDetail.Save')}
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.b2cPayments,
  }))(B2CBankDetail)
);
