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
  USbankupdateBankInfo,
  USbankcreateBankInfo,
  getUSbanklientBankInfo,
  UsbankachProfilesInformation,
} from '~/redux/helpers/USbank/payments';
import { fetchAllUSbankAchList } from '~/redux/actions/USbank/payments';
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

const USbankBankDetail = ({
  clientId,
  parentId,
  paymentType,
  showParentData,
  dispatch,
  setErrorText,
  setVariant,
  handleCollapse,
  currencyCodes,
  t,
  setAchFilled,
}) => {
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [bankDetailInfo, setBankDetailInfo] = useState({
    data: {
      accountId: '',
      accountName: '',
      accountNumber: '',
      routingCode: '',
      companyName: '',
      immediateOrigin: '',
      immediateOriginName: '',
      immediateDestination: '',
      immediateDestinationName: '',
      companyIdentification: '',
      companyEntryDescription: '',
      companyDiscretionaryData: '',
      originatingDFIIdentification: '',
      originatingDFIDiscretionaryData: '',
      type: paymentType,
      currencyCode: '',
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
  }, [showParentData, parentId, clientId]);

  const classes = useStyles();

  const initBankInformation = async (clientId, isParent) => {
    let bankDetail = {};
    const bankDetailinfo = await getUSbanklientBankInfo({
      clientId,
      paymentType,
      isParent,
    });
    let { data, error } = bankDetailinfo;
    if (error) {
      setErrorText(t('componentData.USbankBankDetail.failToLoad'));
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
    const achImmediateInfo = await UsbankachProfilesInformation();
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
    let valid = true;
    let validation = { [name]: '' };
    switch (name) {
      case 'companyIdentification':
        if (!value || value.trim().length === 0) {
          validation['companyIdentification'] = t(
            'componentData.USbankBankDetail.CompanyIdentificationReq'
          );
          valid = false;
        } else if (value && value.length !== 10) {
          validation['companyIdentification'] = t(
            'componentData.USbankBankDetail.CompanyIdentificationLen'
          );
          valid = false;
        }
        break;
      case 'accountName':
        if (!value || value.trim().length === 0) {
          validation['accountName'] = t(
            'componentData.USbankBankDetail.accountNameReq'
          );
          valid = false;
        } else if (value && value.length > 50) {
          validation['accountName'] = t(
            'componentData.USbankBankDetail.AccountNameMaxLen'
          );
          valid = false;
        }
        break;

      case 'companyName':
        if (!value || value.trim().length === 0) {
          validation['companyName'] = t(
            'componentData.USbankBankDetail.companyNameReq'
          );
          valid = false;
        } else if (value && value.length > 16) {
          validation['companyName'] = t(
            'componentData.USbankBankDetail.CompanyNameMaxLen'
          );
          valid = false;
        }
        break;
      case 'companyEntryDescription':
        if (!value || value.length === 0) {
          validation['companyEntryDescription'] = t(
            'componentData.USbankBankDetail.CompanyEntryDescriptionReq'
          );
          valid = false;
        }   else if (value && value.length <2) {
          validation["companyEntryDescription"] =
          t(
            'componentData.USbankBankDetail.CompanyEntryDescriptionMinLen'
          );
          valid = false;
        } 
        else if (value && value.length > 10) {
          validation["companyEntryDescription"] =
          t(
            'componentData.USbankBankDetail.CompanyEntryDescriptionMaxLen'
          );
          valid = false;
        }
        break;
       

      case 'companyDiscretionaryData':
        if (value && value.length > 20) {
          validation['companyDiscretionaryData'] = t(
            'componentData.USbankBankDetail.CompanyDiscretionaryDataMaxLen'
          );
          valid = false;
        }
        break;
      case 'accountNumber':
        if (!value || value.length === 0) {
          validation['accountNumber'] = t(
            'componentData.USbankBankDetail.AccountNumberReq'
          );
          valid = false;
        } else if (value && value.length > 17) {
          validation['accountNumber'] = t(
            'componentData.USbankBankDetail.acNumMaxLen'
          );
          valid = false;
        } else if (value && value.length < 6) {
          validation['accountNumber'] = t(
            'componentData.USbankBankDetail.acNumMinLen'
          );
          valid = false;
        }
        break;

      case 'routingCode':
        if (!value || value.length === 0) {
          validation['routingCode'] = t(
            'componentData.USbankBankDetail.RoutingNumberReq'
          );
          valid = false;
        } else if (value && value.trim().length !== 9) {
          validation['routingCode'] = t(
            'componentData.USbankBankDetail.RoutingCodeLen'
          );
          valid = false;
        }
        break;
      case 'originatingDFIIdentification':
        if (!value || value.length === 0) {
          validation['originatingDFIIdentification'] = t(
            'componentData.USbankBankDetail.originatingDFIIdentificationReq'
          );
          valid = false;
        } else if (value && value.length !== 8) {
          validation['originatingDFIIdentification'] = t(
            'componentData.USbankBankDetail.originatingDFIIdentificationLen'
          );
          valid = false;
        }

        break;
      case 'originatingDFIDiscretionaryData':
        if (value && value.length > 2) {
          validation['originatingDFIDiscretionaryData'] = t(
            'componentData.USbankBankDetail.OriginatingDFIDiscretionaryDataMinLen'
          );
          valid = false;
        }

        break;
      case 'currencyCode':
        if (!value || value.length === 0) {
          validation['currencyCode'] = t(
            'componentData.USbankBankDetail.currencyCodeReq'
          );
          valid = false;
        }
        break;

      default: {
      }
    }
    setBankDetailInfo({
      ...bankDetailInfo,
      error: { ...validation },
    });

    return valid;
  };
  const onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        [name]: value.length === 0 ? null :  value.trim(),
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
      setBankDetailInfo({
        ...bankDetailInfo,
        data: {
          ...bankDetailInfo.data,
          ['accountName']: accountName.trim(),
        },
      });
      const data = {
        immediateDestinationName,
        accountId,
        accountName,
        companyIdentification,
        accountNumber: Boolean(accountNumber) ? accountNumber : null,
        routingCode,
        companyName,
        companyEntryDescription,
        originatingDFIIdentification,
        type,
        immediateOrigin,
        immediateOriginName,
        immediateDestination,
        currencyCode,
        originatingDFIDiscretionaryData,
        companyDiscretionaryData,
      };
      data.accountName = data.accountName.trim();
      if (accountId) {
        dispatch(
          USbankupdateBankInfo({
            clientId: clientId,
            bankDetail: data,
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (!response || response.error) {
            setErrorText(
              response.message ??
                t('componentData.USbankBankDetail.ErrorWhileSavingData')
            );
            setVariant('error');
            return false;
          } else {
            setErrorText(
              response.message ??
                t('componentData.USbankBankDetail.BankAccountDataUpdated')
            );
            setVariant('success');
            dispatch(fetchAllUSbankAchList(clientId, 'ACH'));
            handleCollapse(paymentType);
          }
        });
      } else {
        
        const { accountId, ...restBankDetail } = data;
        dispatch(
          USbankcreateBankInfo({
            clientId: clientId,
            bankDetail: restBankDetail,
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response.data.accountId) {
            setBankDetailInfo({
              ...bankDetailInfo,
              data: {
                ...bankDetailInfo.data,
                accountId: response.data.accountId,
              },
            });
            setErrorText(
              response.message ??
                t('componentData.USbankBankDetail.BankAccountDataSaved')
            );
            setVariant('success');
            setAchFilled(true);
            dispatch(fetchAllUSbankAchList(clientId, 'ACH'));
            handleCollapse(paymentType);
          } else {
            setErrorText(
              t(
                response.message ??
                  'componentData.USbankBankDetail.ErrorWhileSavingData'
              )
            );
            setVariant('error');
            setAchFilled(false);
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
    if (!accountName || accountName.trim()?.length === 0
      ) {
      validation['accountName'] = t(
        'componentData.USbankBankDetail.accountNameReq'
      );
      valid = false;
    } else if (accountName && accountName.length > 50) {
      validation['accountName'] = t(
        'componentData.USbankBankDetail.AccountNameMaxLen'
      );
      valid = false;
    }
    if (!companyName || companyName.trim().length === 0) {
      validation['companyName'] = t(
        'componentData.USbankBankDetail.companyNameReq'
      );
      valid = false;
    } else if (companyName && companyName.length > 16) {
      validation['companyName'] = t(
        'componentData.USbankBankDetail.CompanyNameMaxLen'
      );
      valid = false;
    }
    if (!companyIdentification || companyIdentification.trim().length === 0) {
      validation['companyIdentification'] = t(
        'componentData.USbankBankDetail.CompanyIdentificationReq'
      );
      valid = false;
    } else if (companyIdentification && companyIdentification.length !== 10) {
      validation['companyIdentification'] = t(
        'componentData.USbankBankDetail.CompanyIdentificationLen'
      );

      valid = false;
    }
    if (companyDiscretionaryData && companyDiscretionaryData.length > 20) {
      validation['companyDiscretionaryData'] = t(
        'componentData.USbankBankDetail.CompanyDiscretionaryDataMaxLen'
      );
      valid = false;
    }
    if (
      !originatingDFIIdentification ||
      originatingDFIIdentification.trim().length === 0
    ) {
      validation['originatingDFIIdentification'] = t(
        'componentData.USbankBankDetail.originatingDFIIdentificationReq'
      );
      valid = false;
    } else if (
      originatingDFIIdentification &&
      originatingDFIIdentification.length !== 8
    ) {
      validation['originatingDFIIdentification'] = t(
        'componentData.USbankBankDetail.originatingDFIIdentificationLen'
      );
      valid = false;
    }
    if (
      originatingDFIDiscretionaryData &&
      originatingDFIDiscretionaryData.length > 2
    ) {
      validation['originatingDFIDiscretionaryData'] = t(
        'componentData.USbankBankDetail.OriginatingDFIDiscretionaryDataMinLen'
      );
      valid = false;
    }
    if (!companyEntryDescription || companyEntryDescription.length === 0) {
      validation["companyEntryDescription"] =
      t(
        'componentData.USbankBankDetail.CompanyEntryDescriptionReq'
      );
      valid = false;
    } else if (companyEntryDescription && companyEntryDescription.length <2) {
      validation["companyEntryDescription"] =
      t(
        'componentData.USbankBankDetail.CompanyEntryDescriptionMinLen'
      );
      valid = false;
    }
    else if (companyEntryDescription && companyEntryDescription.length > 10) {
      validation["companyEntryDescription"] =
      t(
        'componentData.USbankBankDetail.CompanyEntryDescriptionMaxLen'
      );
      valid = false;
    }
    if (!routingCode || routingCode.trim().length === 0) {
      validation['routingCode'] = t(
        'componentData.USbankBankDetail.RoutingNumberReq'
      );
      valid = false;
    } else if (routingCode && routingCode.trim().length !== 9) {
      validation['routingCode'] = t(
        'componentData.USbankBankDetail.RoutingCodeLen'
      );
      valid = false;
    }
    if (!currencyCode || currencyCode.length === 0) {
      validation['currencyCode'] = t(
        'componentData.USbankBankDetail.currencyCodeReq'
      );
      valid = false;
    }

    if (!accountNumber || accountNumber.length === 0) {
      validation['accountNumber'] = t(
        'componentData.USbankBankDetail.AccountNumberReq'
      );

      valid = false;
    } else if (accountNumber && accountNumber.length > 17) {
      validation['accountNumber'] = t(
        'componentData.USbankBankDetail.acNumMaxLen'
      );
      valid = false;
    } else if (accountNumber && accountNumber.length < 6) {
      validation['accountNumber'] = t(
        'componentData.USbankBankDetail.acNumMinLen'
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
            label={t('componentData.USbankBankDetail.AccountName')}
            required
            placeholder={t('componentData.USbankBankDetail.AccountName')}
            error={Boolean(error.accountName)}
            helperText={error.accountName}
            fullWidth={true}
            autoComplete='off'
            variant='outlined'
            color='secondary'
            value={accountName || ''}
            name='accountName'
            onChange={(e) => {
              setBankDetailInfo({
                ...bankDetailInfo,
                data: {
                  ...bankDetailInfo.data,
                  ['accountName']: e.target.value.length === 0 ? null :  e.target.value,
                },
              });
            }}  
            inputProps={{
              maxLength: 50,
              minLength: 1,
            }}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t(
              'componentData.USbankBankDetail.OriginatingDFIIdentification'
            )}
            required
            placeholder={t(
              'componentData.USbankBankDetail.OriginatingDFIIdentification'
            )}
            error={Boolean(error.originatingDFIIdentification)}
            helperText={error.originatingDFIIdentification}
            fullWidth={true}
            autoComplete='off'
            color='secondary'
            variant='outlined'
            value={originatingDFIIdentification || ''}
            name='originatingDFIIdentification'
            onChange={handleIntegerValueChange}
            inputProps={{
              maxLength: 8,
              minLength: 1,
            }}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={6} sm={3} className={classes.inputBox}>
          <TextField
            label={t('componentData.USbankBankDetail.BankRoutingCode')}
            placeholder={t('componentData.USbankBankDetail.BankRoutingCode')}
            error={Boolean(error.routingCode)}
            required
            helperText={error.routingCode}
            fullWidth={true}
            autoComplete='off'
            variant='outlined'
            color='secondary'
            value={routingCode || ''}
            name='routingCode'
            onChange={handleIntegerValueChange}
            inputProps={{
              maxLength: 9,
              minLength: 1,
            }}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={6} sm={3} className={classes.inputBox}>
          <MaskInput
            label={t('componentData.USbankBankDetail.BankAccountNumber')}
            placeholder={t('componentData.USbankBankDetail.BankAccountNumber')}
            helperText={error.accountNumber}
            error={Boolean(error.accountNumber)}
            required
            fullWidth={true}
            autoComplete='off'
            variant='outlined'
            color='secondary'
            value={accountNumber || ''}
            name='accountNumber'
            onBlur={handleBlur}
            inputProps={{
              maxLength: 17,
              minLength: 6,
            }}
            getValue={(val) => {
              setBankDetailInfo({
                ...bankDetailInfo,
                data: { ...bankDetailInfo.data, accountNumber: val },
              });
            }}
            style={{ marginTop: '8px' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t(
              'componentData.USbankBankDetail.OriginatingDFIDiscretionaryData'
            )}
            placeholder={t(
              'componentData.USbankBankDetail.OriginatingDFIDiscretionaryData'
            )}
            error={Boolean(error.originatingDFIDiscretionaryData)}
            helperText={error.originatingDFIDiscretionaryData}
            fullWidth={true}
            autoComplete='off'
            color='secondary'
            variant='outlined'
            value={originatingDFIDiscretionaryData || ''}
            name='originatingDFIDiscretionaryData'
            onChange={onChange}
            inputProps={{
              maxLength: 2,
              minLength: 1,
            }}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={6} sm={3} className={classes.inputBox}>
          <TextField
            label={t('componentData.bankDetail.CompanyName')}
            placeholder={t('componentData.USbankBankDetail.CompanyName')}
            required
            error={Boolean(error.companyName)}
            helperText={error.companyName}
            fullWidth={true}
            autoComplete='off'
            color='secondary'
            variant='outlined'
            value={companyName || ''}
            name='companyName'
            onChange={onChange}
            inputProps={{ minLength: 1, maxLength: 16 }}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={6} sm={3} className={classes.inputBox}>
          <TextField
            color='secondary'
            inputProps={{
              maxLength: 10,
              minLength: 1,
            }}
            label={t('componentData.USbankBankDetail.CompanyIdentification')}
            placeholder={t(
              'componentData.USbankBankDetail.CompanyIdentification'
            )}
            required
            error={Boolean(error.companyIdentification)}
            helperText={error.companyIdentification}
            fullWidth={true}
            autoComplete='off'
            variant='outlined'
            value={companyIdentification || ''}
            name='companyIdentification'
            onChange={handleIntegerValueChange}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.USbankBankDetail.ImmediateOrigin')}
            required
            placeholder={t('componentData.USbankBankDetail.ImmediateOrigin')}
            disabled={true}
            fullWidth={true}
            autoComplete='off'
            color='secondary'
            variant='outlined'
            value={immediateOrigin || ''}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.USbankBankDetail.CompanyEntryDescription')}
            required
            placeholder={t(
              'componentData.USbankBankDetail.CompanyEntryDescription'
            )}
            error={Boolean(error.companyEntryDescription)}
            helperText={error.companyEntryDescription}
            fullWidth={true}
            color='secondary'
            autoComplete='off'
            variant='outlined'
            value={companyEntryDescription || ''}
            name='companyEntryDescription'
            onChange={onChange}
            inputProps={{
              maxLength: 10,
              minLength: 1,
            }}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.USbankBankDetail.ImmediateOriginName')}
            required
            placeholder={t(
              'componentData.USbankBankDetail.ImmediateOriginName'
            )}
            disabled={true}
            fullWidth={true}
            color='secondary'
            autoComplete='off'
            variant='outlined'
            value={immediateOriginName || ''}
            inputProps={{
              maxLength: 25,
              minLength: 1,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.USbankBankDetail.CompanyDiscretionaryData')}
            placeholder={t(
              'componentData.USbankBankDetail.CompanyDiscretionaryData'
            )}
            error={Boolean(error.companyDiscretionaryData)}
            helperText={error.companyDiscretionaryData}
            fullWidth={true}
            color='secondary'
            autoComplete='off'
            variant='outlined'
            value={companyDiscretionaryData || ''}
            name='companyDiscretionaryData'
            onChange={onChange}
            inputProps={{
              maxLength: 20,
              minLength: 1,
            }}
            onBlur={handleBlur}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            label={t('componentData.USbankBankDetail.ImmediateDestination')}
            required
            placeholder={t(
              'componentData.USbankBankDetail.ImmediateDestination'
            )}
            disabled={true}
            color='secondary'
            fullWidth={true}
            autoComplete='off'
            variant='outlined'
            value={immediateDestination || ''}
            inputProps={{
              maxLength: 10,
              minLength: 1,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} className={classes.inputBox}>
          <TextField
            select
            fullWidth={true}
            variant='outlined'
            error={Boolean(error.currencyCode)}
            helperText={error.currencyCode}
            autoComplete='off'
            value={currencyCode}
            name='currencyCode'
            label={t('componentData.USbankBankDetail.CurrencyCode')}
            onChange={onChange}
            dir='horizontal'
            inputProps={{
              maxLength: 100,
            }}
            onBlur={handleBlur}
            required
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
            placeholder={t('componentData.bankDetail.ImmediateDestinationName')}
            disabled={true}
            color='secondary'
            fullWidth={true}
            autoComplete='off'
            variant='outlined'
            value={immediateDestinationName || ''}
            inputProps={{
              maxLength: 23,
              minLength: 1,
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          {saveProcessing ? (
            <CircularProgress color='primary' />
          ) : (
            <Button
              type='submit'
              variant='contained'
              color='primary'
              onClick={() => onSubmit()}
              style={{ display: 'block', margin: '15px auto 0' }}
            >
              {t('componentData.USbankBankDetail.Save')}
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
  }))(USbankBankDetail)
);
