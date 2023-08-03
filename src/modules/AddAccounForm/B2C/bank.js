import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  getB2CClientBankInfo,
  achB2CProfilesInformation,
  settingCreateB2CBankInfo,
  settingUpdateB2CBankInfo,
} from '~/redux/actions/B2C/payments';
import MaskInput from '~/components/MaskInput';
import { withStyles } from '@material-ui/styles';
import styles from './styles';

const B2CBankDetail = (props) => {
  const {
    classes,
    dispatch,
    t,
    notification,
    canEdit,
    isAddAccount,
    accountDetails,
    currencyCodes,
    achAccountList,
  } = props;
  const paymentType = 'ACH';
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [willPopupBtnShow, setPopupBtn] = useState(false);
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
      isDefault: 0,
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
      type: paymentType,
      immediateOrigin: '',
      immediateOriginName: '',
      immediateDestination: '',
      immediateDestinationName: '',
      isDefault: 0,
      currencyCode: '',
    },
  });

  useEffect(() => {    
    initBankInformation();
    isAddAccount
      ? setPopupBtn(true)
      : canEdit
      ? setPopupBtn(true)
      : setPopupBtn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.user.userData.portalProfileId,
    isAddAccount,
    canEdit,
    achAccountList,
  ]);

  const initBankInformation = async () => {
    const clientId = props.user.userData.portalProfileId || null;
    let bankDetail = {};

    if (!isAddAccount) {
      const bankDetailinfo = await getB2CClientBankInfo({
        clientId,
        paymentType: paymentType,
      });
      bankDetail =
        bankDetailinfo.data.rows && bankDetailinfo.data.rows.length > 0
          ? bankDetailinfo.data.rows[accountDetails - 1]
          : {};
    }

    let clientBankDetail = bankDetail || {};

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
    isDefault,
    currencyCode,
  } = data;

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        [name]: value === '' ? null : value?.trim(),
      },
    });
  };
  const onChange = (event) => {
    const { name, value } = event.target;
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
    const clientId = props.user.userData.portalProfileId || null;
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
        isDefault,
        currencyCode,
      };

      if (accountId) {
        dispatch(
          settingUpdateB2CBankInfo({
            clientId: clientId,
            bankDetail: data,
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (!response) {
            const errorMsg =
              response && response.message
                ? response.message
                : t('componentData.bankDetail.ErrorWhileSavingData');
            notification('error', errorMsg);
            return false;
          } else {
            notification(
              'success',
              t('componentData.bankDetail.BankAccountDataUpdated')
            );
            props.closeModal(true);
          }
        });
      } else {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          settingCreateB2CBankInfo({
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
            notification(
              'success',
              t('componentData.bankDetail.BankAccountDataSaved')
            );
            props.closeModal(true);
          } else {
            notification(
              'error',
              t('componentData.bankDetail.ErrorWhileSavingData')
            );
            return false;
          }
        });
      }
    } else {
      setSaveProcessing(false);
      notification('error', t('componentData.commonErr.validationMsg'));
      return false;
    }
    // props.closeModal(true);
  };

  const validation = () => {
    let valid = true;
    let validation = {};

    if (!currencyCode || !currencyCode.trim().length) {
      valid = false;
      validation['currencyCode'] = t(
        'componentData.paymentMethods.currencyCodeReq'
      );
    }

    if (!accountName || accountName.trim().length === 0) {
      validation['accountName'] = t('componentData.paymentMethods.accountName');
      valid = false;
    }

    if (!routingCode || routingCode.trim().length === 0) {
      validation['routingCode'] = t('componentData.paymentMethods.routingCode');
      valid = false;
    }
    if (routingCode && routingCode.length < 9) {
      validation['routingCode'] = t('componentData.bankDetail.RoutingCodeLen');
      valid = false;
    }

    if (!accountNumber || accountNumber.trim().length === 0) {
      validation['accountNumber'] = t(
        'componentData.paymentMethods.accountNumber'
      );
      valid = false;
    }
    if (accountNumber && accountNumber.length < 6) {
      validation['accountNumber'] = t('componentData.bankDetail.acNumMinLen');
      valid = false;
    }

    if (!companyName || companyName.trim().length === 0) {
      validation['companyName'] = t('componentData.paymentMethods.companyName');
      valid = false;
    } else if (companyName && companyName.trim().length > 16) {
      validation['companyName'] = t(
        'componentData.bankDetail.CompanyNameMaxLen'
      );
      valid = false;
    }

    if (!companyIdentification || companyIdentification.trim().length === 0) {
      validation['companyIdentification'] = t(
        'componentData.paymentMethods.companyIdentification'
      );
      valid = false;
    }
    if (companyIdentification && companyIdentification.length < 10) {
      validation['companyIdentification'] = t(
        'componentData.bankDetail.CompanyIdentificationLen'
      );
      valid = false;
    }

    if (
      !companyEntryDescription ||
      companyEntryDescription.trim().length === 0
    ) {
      validation['companyEntryDescription'] = t(
        'componentData.paymentMethods.companyEntryDescription'
      );
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length < 2) {
      validation['companyEntryDescription'] = t(
        'componentData.bankDetail.CompanyEntryMinLen'
      );
      valid = false;
    }

    if (
      !originatingDFIIdentification ||
      originatingDFIIdentification.trim().length === 0
    ) {
      validation['originatingDFIIdentification'] = t(
        'componentData.paymentMethods.originatingDFIIdentification'
      );
      valid = false;
    }
    if (
      originatingDFIIdentification &&
      originatingDFIIdentification.length < 8
    ) {
      validation['originatingDFIIdentification'] = t(
        'componentData.bankDetail.originatingDFIIdentificationLen'
      );
      valid = false;
    }

    setBankDetailInfo({
      ...bankDetailInfo,
      error: { ...validation },
    });
    return valid;
  };

  const onCancel = () => {
    props.onCancel(true);
  };

  const handleCheckBox = (_isDefault) => {
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        isDefault: _isDefault === 0 ? 1 : 0,
      },
    });
  };

  return (
    <Box p={2} className={classes.popupInner}>
      <Grid container>
        <Grid container item>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <Box>
              <TextField
                label={t('componentData.bankDetail.AccountName')}
                error={error.accountName}
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
                  readOnly: isAddAccount ? false : !canEdit ? true : false,
                }}
                onBlur={handleBlur}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <Box>
              <TextField
                label={t(
                  'componentData.bankDetail.OriginatingDFIIdentification'
                )}
                error={error.originatingDFIIdentification}
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
                  readOnly: isAddAccount ? false : !canEdit ? true : false,
                }}
                onBlur={handleBlur}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label={t('componentData.bankDetail.BankRoutingCode')}
              error={error.routingCode}
              helperText={error.routingCode}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              color="secondary"
              value={routingCode || ''}
              name="routingCode"
              inputProps={{
                maxLength: 9,
                minLength: 9,
                readOnly: isAddAccount ? false : !canEdit ? true : false,
              }}
              onBlur={handleBlur}
              onChange={handleIntegerValueChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <MaskInput
              label={t('componentData.bankDetail.BankAccountNumber')}
              error={error.accountNumber}
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
                readOnly: isAddAccount ? false : !canEdit ? true : false,
              }}
              getValue={(val) => {
                setBankDetailInfo({
                  ...bankDetailInfo,
                  data: { ...bankDetailInfo.data, accountNumber: val },
                });
              }}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <Box>
              <TextField
                label={t(
                  'componentData.bankDetail.OriginatingDFIDiscretionaryData'
                )}
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
                  readOnly: isAddAccount ? false : !canEdit ? true : false,
                }}
                onBlur={handleBlur}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label={t('componentData.bankDetail.CompanyName')}
              error={error.companyName}
              helperText={error.companyName}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={companyName || ''}
              name="companyName"
              onChange={onChange}
              inputProps={{
                minLength: 1,
                maxLength: 16,
                readOnly: isAddAccount ? false : !canEdit ? true : false,
              }}
              onBlur={handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <TextField
              label={t('componentData.paymentMethods.CompanyIdentification')}
              error={error.companyIdentification}
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
                readOnly: isAddAccount ? false : !canEdit ? true : false,
              }}
              onBlur={handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.bankDetail.ImmediateOrigin')}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={immediateOrigin || ''}
              name="immediateOrigin"
              error={error.immediateOrigin}
              helperText={error.immediateOrigin}
              inputProps={{
                maxLength: 10,
                minLength: 10,
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={handleBlur}
              onChange={onChange}
              required
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <Box style={{ minWidth: '30%' }}>
              <TextField
                label={t('componentData.bankDetail.CompanyEntryDescription')}
                error={error.companyEntryDescription}
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
                  readOnly: isAddAccount ? false : !canEdit ? true : false,
                }}
                onBlur={handleBlur}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.bankDetail.ImmediateOriginName')}
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              variant="outlined"
              value={immediateOriginName || ''}
              name="immediateOriginName"
              error={error.immediateOriginName}
              helperText={error.immediateOriginName}
              inputProps={{
                maxLength: 23,
                minLength: 1,
                readOnly: true,
              }}
              disabled
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={handleBlur}
              onChange={onChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <Box>
              <TextField
                label={t('componentData.bankDetail.CompanyDiscretionaryData')}
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
                  readOnly: isAddAccount ? false : !canEdit ? true : false,
                }}
                onBlur={handleBlur}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.bankDetail.ImmediateDestination')}
              color="secondary"
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={immediateDestination || ''}
              name="immediateDestination"
              error={error.immediateDestination}
              helperText={error.immediateDestination}
              inputProps={{
                maxLength: 9,
                minLength: 9,
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={handleBlur}
              onChange={onChange}
              required
              disabled
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
              required
              autoComplete="off"
              value={currencyCode}
              name="currencyCode"
              label={t('componentData.bankDetail.CurrencyCode')}
              onBlur={handleBlur}
              onChange={onChange}
              dir="horizontal"
              inputProps={{
                maxLength: 100,
                readOnly: isAddAccount ? false : !canEdit ? true : false,
              }}
              error={error.currencyCode}
              helperText={error.currencyCode}
            >
              {currencyCodes &&
                currencyCodes
                  .filter((item) => item.isoCode === 'USD')
                  .map((code) => (
                    <MenuItem key={code.isoCode} value={code.isoCode}>
                      {code.isoCode}
                    </MenuItem>
                  ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.bankDetail.ImmediateDestinationName')}
              color="secondary"
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={immediateDestinationName || ''}
              name="immediateDestinationName"
              error={error.immediateDestinationName}
              helperText={error.immediateDestinationName}
              inputProps={{
                maxLength: 23,
                minLength: 1,
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onBlur={handleBlur}
              onChange={onChange}
              required
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={12} container>
            <Box mx={1}>
              <FormControlLabel
                disabled={isAddAccount ? false : !canEdit ? true : false}
                control={
                  <Checkbox
                    name={'isDefault'}
                    disabled={isAddAccount ? false : !canEdit ? true : false}
                    checked={isDefault === 1 ? true : false}
                    onChange={(e) => handleCheckBox(isDefault)}
                  />
                }
                label={t('componentData.addAccountForm.defaultAcc')}
                style={{ color: '#0B1941' }}
              />
            </Box>
          </Grid>
        </Grid>

        {willPopupBtnShow && (
          <Grid container item xs={11} justify="center">
            <Button
              variant="outlined"
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                width: '120px',
                margin: '0px 10px 0 0',
              }}
              onClick={onCancel}
            >
              {t('componentData.addAccountCK.Cancel')}
            </Button>

            {saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                className={classes.button}
                type="submit"
                fullWidth={false}
                variant="contained"
                color="primary"
                onClick={onSubmit}
                style={{ background: '#008CE6' }}
              >
                {t('componentData.bankDetail.Save')}
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.client,
    ...state.clientConfig,
    ...state.b2cPayments,
  }))(withStyles(styles)(B2CBankDetail))
);
