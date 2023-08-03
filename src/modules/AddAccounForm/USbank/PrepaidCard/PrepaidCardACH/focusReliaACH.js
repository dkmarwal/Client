import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  FormControl,
  Select,
  MenuItem,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  InputLabel,
} from '@material-ui/core';
import {
  USbankupdateBankInfo,
  USbankcreateBankInfo,
} from '~/redux/helpers/USbank/payments';
import MaskInput from '~/components/MaskInput';
import AddCircleIcon from '~/assets/icons/add_circle_outline.svg';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import styles from './styles.js';
import trim from 'deep-trim-node';

const achAccountConstData = {
  accountName: null,
  accountNumber: null,
  routingCode: null,
  companyName: null,
  companyIdentification: null,
  companyDiscretionaryData: null,
  originatingDFIDiscretionaryData: null,
  originatingDFIIdentification: null,
  companyEntryDescription: null,
  currencyCode: null,
  accountId: null,
};

const FocusNonPayrollACHAccount = (props) => {
  const {
    classes,
    selectedSettlementAccountId,
    achAccountsList,
    reliaFocusParams,
    currencyList,
    handleValidation,
    dispatch,
    notification,
    achUSBankProfileInfo,
    handleSaveProcessing,
    isSubmitClicked,
    handleIsSubmitClicked,
    clientId,
    t,
  } = props;
  const [achAccountData, setAchAccountData] = React.useState({
    accountName: null,
    accountNumber: null,
    routingCode: null,
    companyName: null,
    companyIdentification: null,
    companyEntryDescription: null,
    companyDiscretionaryData: null,
    originatingDFIIdentification: null,
    originatingDFIDiscretionaryData: null,
    currencyCode: null,
    accountId: null,
  });
  const [error, setError] = React.useState({
    accountName: '',
    accountNumber: '',
    routingCode: '',
    companyName: '',
    companyIdentification: '',
    companyEntryDescription: '',
    companyDiscretionaryData: '',
    originatingDFIIdentification: '',
    immediateOrigin: '',
    immediateOriginName: '',
    immediateDestination: '',
    immediateDestinationName: '',
    currencyCode: '',
    achAccountId: '',
  });
  const [achAccountId, setAchAccountId] = React.useState(-1);

  React.useEffect(() => {
    // for triggering submit function of this component when
    // click is triggered from parent component
    if (isSubmitClicked) {
      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitClicked]);

  React.useEffect(() => {
    if (achUSBankProfileInfo?.data) {
      const achProfileData = achUSBankProfileInfo.data;
      setAchAccountData({ ...achAccountData, ...achProfileData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achUSBankProfileInfo]);

  React.useEffect(() => {
    if (selectedSettlementAccountId && selectedSettlementAccountId > 0) {
      setAchAccountId(selectedSettlementAccountId);
      const selectedAccount = achAccountsList?.data?.rows?.find(
        (item) => item.accountId === selectedSettlementAccountId
      );
      if (selectedAccount) {
        setAchAccountData({
          ...achAccountData,
          ...selectedAccount,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSettlementAccountId, achAccountsList, reliaFocusParams]);

  const onACHAccountChange = ({ target }) => {
    const { value } = target;
    setAchAccountId(value);
    if (value !== -1) {
      setError({ ...error, achAccountId: '' });
    }
    if (value && value > 0) {
      const selectedAccount = achAccountsList?.data?.rows.find(
        (item) => item.accountId === value
      );
      if (selectedAccount) {
        setAchAccountData({ ...achAccountData, ...selectedAccount });
      }
    } else {
      setAchAccountData({ ...achAccountData, ...achAccountConstData });
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setAchAccountData({
      ...achAccountData,
      [name]: value.length === 0 ? null : value,
    });
  };

  const handleIntegerValueChange = (event) => {
    const { name, value } = event.target;
    setAchAccountData({
      ...achAccountData,
      [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
    });
  };

  const validation = () => {
    let valid = true;
    let validation = {};
    const {
      routingCode,
      accountNumber,
      companyName,
      companyIdentification,
      companyEntryDescription,
      originatingDFIIdentification,
      accountName,
      currencyCode,
      immediateDestination,
      immediateDestinationName,
      immediateOrigin,
      immediateOriginName,
    } = achAccountData;
    if (achAccountId === -1) {
      validation['achAccountId'] = t(
        'componentData.USBankPrepaidCardError.bankAccountACHReq'
      );
      valid = false;
    } else {
      if (!accountName) {
        validation['accountName'] = t(
          'componentData.USBankPrepaidCardError.accountNameReq'
        );
        valid = false;
      }
      if (!routingCode) {
        validation['routingCode'] = t(
          'componentData.USBankPrepaidCardError.routingCodeReq'
        );
        valid = false;
      } else if (routingCode && routingCode.length !== 9) {
        validation['routingCode'] = t(
          'componentData.USBankPrepaidCardError.routingCodeLength'
        );
        valid = false;
      }
      if (!accountNumber) {
        validation['accountNumber'] = t(
          'componentData.USBankPrepaidCardError.accountNumberReq'
        );
        valid = false;
      } else if (accountNumber && accountNumber.length < 6) {
        validation['accountNumber'] = t(
          'componentData.USBankPrepaidCardError.accountNumberLength'
        );
        valid = false;
      }
      if (!companyName) {
        validation['companyName'] = t(
          'componentData.USBankPrepaidCardError.companyNameReq'
        );
        valid = false;
      } else if (companyName && companyName.length > 16) {
        validation['companyName'] = t(
          'componentData.USBankPrepaidCardError.companyNameLength'
        );
        valid = false;
      }

      if (!companyIdentification) {
        validation['companyIdentification'] = t(
          'componentData.USBankPrepaidCardError.companyIdentificationReq'
        );
        valid = false;
      } else if (companyIdentification && companyIdentification.length < 10) {
        validation['companyIdentification'] = t(
          'componentData.USBankPrepaidCardError.companyIdentificationLength'
        );
        valid = false;
      }

      if (!companyEntryDescription) {
        validation['companyEntryDescription'] = t(
          'componentData.USBankPrepaidCardError.companyEntryDescriptionReq'
        );
        valid = false;
      } else if (
        companyEntryDescription &&
        companyEntryDescription.length < 2
      ) {
        validation['companyEntryDescription'] = t(
          'componentData.USBankPrepaidCardError.companyEntryDescriptionLength'
        );
        valid = false;
      }
      if (!currencyCode) {
        validation['currencyCode'] = t(
          'componentData.USBankPrepaidCardError.currencyCodeReq'
        );
        valid = false;
      }
      if (!originatingDFIIdentification) {
        validation['originatingDFIIdentification'] = t(
          'componentData.USBankPrepaidCardError.originatingDfiIdentificationReq'
        );
        valid = false;
      } else if (
        originatingDFIIdentification &&
        originatingDFIIdentification.length < 8
      ) {
        validation['originatingDFIIdentification'] = t(
          'componentData.USBankPrepaidCardError.originatingDFIIdentificationLength'
        );
        valid = false;
      }
      if (!immediateOrigin) {
        validation['immediateOrigin'] = t(
          'componentData.USBankPrepaidCardError.immediateOriginReq'
        );
        valid = false;
      }
      if (!immediateDestination) {
        validation['immediateDestination'] = t(
          'componentData.USBankPrepaidCardError.immediateDestinationReq'
        );
        valid = false;
      }
      if (!immediateOriginName) {
        validation['immediateOriginName'] = t(
          'componentData.USBankPrepaidCardError.immediateOriginNameReq'
        );
        valid = false;
      }
      if (!immediateDestinationName) {
        validation['immediateDestinationName'] = t(
          'componentData.USBankPrepaidCardError.immediateDestinationNameReq'
        );
        valid = false;
      }
    }

    setError(validation);
    return valid;
  };

  const onSubmit = () => {
    handleIsSubmitClicked(false);
    const valid = validation();
    const paymentMethodData = handleValidation();
    const {
      currencyCode,
      accountName,
      routingCode,
      accountNumber,
      companyName,
      companyIdentification,
      companyEntryDescription,
      originatingDFIIdentification,
      originatingDFIDiscretionaryData,
      companyDiscretionaryData,
      immediateDestination,
      immediateDestinationName,
      immediateOrigin,
      immediateOriginName,
    } = achAccountData;
    if (valid && paymentMethodData) {
      handleSaveProcessing(true);
      const data = {
        accountId: achAccountId,
        accountName,
        accountNumber: Boolean(accountNumber) ? accountNumber : null,
        routingCode,
        companyName,
        companyIdentification,
        companyEntryDescription,
        companyDiscretionaryData,
        originatingDFIIdentification,
        originatingDFIDiscretionaryData,
        currencyCode,
        type: 'ACH',
        immediateDestination,
        immediateDestinationName,
        immediateOrigin,
        immediateOriginName,
      };

      if (achAccountId && achAccountId > 0) {
        dispatch(
          USbankupdateBankInfo({
            clientId: clientId,
            bankDetail: data,
          })
        ).then((response) => {
          if (!response || response.error) {
            const errorMsg =
              response && response.message
                ? response.message
                : t(
                    'componentData.USBankPrepaidCardError.ErrorWhileSavingData'
                  );
            notification('error', errorMsg);
            handleSaveProcessing(false);
            return false;
          } else {
            props.onSubmit(achAccountId);
          }
        });
      } else if (achAccountId !== -1) {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          USbankcreateBankInfo({
            clientId: clientId,
            bankDetail: trim(restBankDetail),
          })
        ).then((response) => {
          if (response && !response.error && response.data) {
            setAchAccountData({
              ...restBankDetail,
              accountId: response.data.accountId,
            });
            setAchAccountId(response.data.accountId);
            props.onSubmit(response.data.accountId);
          } else {
            handleSaveProcessing(false);
            notification(
              'error',
              t('componentData.USBankPrepaidCardError.ErrorWhileSavingData')
            );
            return false;
          }
        });
      } else {
        props.onSubmit(null);
      }
    } else {
      notification(
        'error',
        t('componentData.USBankPrepaidCardError.validationErr')
      );
      handleSaveProcessing(false);
      return false;
    }
  };

  let noNameAccountCount = 1;
  return (
    <>
      <Grid container>
        <Grid item xs={12} className={classes.settlementHeading}>
          <Typography>
            {t('componentData.USBankPrepaidCard.addBankAccount')}
          </Typography>
        </Grid>
        <Grid
          item
          xs={6}
          className={classes.inputBox}
          style={{ paddingTop: '0px' }}
        >
          <FormControl variant='outlined' error={Boolean(error.achAccountId)}>
            <InputLabel id='demo-simple-select-required-label'>
              {t('componentData.USBankPrepaidCard.bankDepositACH')}
            </InputLabel>
            <Select
              labelId='demo-simple-select-required-label'
              id='demo-simple-select-outlined'
              value={achAccountId}
              onChange={(e) => onACHAccountChange(e)}
              required
              label={t('componentData.USBankPrepaidCard.bankDepositACH')}
            >
              <MenuItem value={-1}>
                <em>Select</em>
              </MenuItem>
              {achAccountsList?.data?.rows?.map((item) => {
                let tempAccountName = '';
                if (!item.accountName) {
                  tempAccountName = `${t(
                    'componentData.USBankPrepaidCard.bankDepositACHAccount'
                  )} ${
                    noNameAccountCount < 10 ? '0' : ''
                  }${noNameAccountCount}`;
                  noNameAccountCount++;
                }
                return (
                  <MenuItem
                    value={item.accountId}
                    className={classes.accountsMenuList}
                  >
                    <Grid
                      container
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Grid item>
                        {tempAccountName ? tempAccountName : item.accountName}
                      </Grid>
                      <Grid
                        item
                        style={{ color: '#9E9E9E', paddingRight: '8px' }}
                      >
                        {item.accountNumber}
                      </Grid>
                    </Grid>
                  </MenuItem>
                );
              })}
              <MenuItem value={'-2'} className={classes.newAccountMenu}>
                <img
                  src={AddCircleIcon}
                  alt='ADD'
                  className={classes.plusIcon}
                />
                {t('componentData.USBankPrepaidCard.newBankDepositACH')}
              </MenuItem>
            </Select>
            {error.achAccountId && (
              <FormHelperText>{error.achAccountId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      {achAccountId && achAccountId !== -1 && (
        <Grid container>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.USBankPrepaidCard.accountName')}
              error={Boolean(error.accountName)}
              helperText={error.accountName}
              fullWidth={true}
              autoComplete='off'
              variant='outlined'
              color='secondary'
              value={achAccountData.accountName || ''}
              name='accountName'
              onChange={onChange}
              inputProps={{
                maxLength: 50,
                minLength: 1,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t(
                'componentData.USBankPrepaidCard.originatingDfiIdentification'
              )}
              error={Boolean(error.originatingDFIIdentification)}
              helperText={error.originatingDFIIdentification}
              fullWidth={true}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.originatingDFIIdentification || ''}
              name='originatingDFIIdentification'
              onChange={handleIntegerValueChange}
              inputProps={{
                maxLength: 8,
                minLength: 8,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label={t('componentData.USBankPrepaidCard.routingCode')}
              error={Boolean(error.routingCode)}
              helperText={error.routingCode}
              fullWidth={true}
              autoComplete='off'
              variant='outlined'
              color='secondary'
              value={achAccountData.routingCode || ''}
              name='routingCode'
              inputProps={{
                maxLength: 9,
                minLength: 9,
              }}
              onChange={handleIntegerValueChange}
              required
            />
            <MaskInput
              id='accountNumber'
              color='secondary'
              required
              InputLabelProps={{ className: classes.input }}
              label={t('componentData.USBankPrepaidCard.bankAccountNumber')}
              inputProps={{
                maxLength: 17,
                minLength: 6,
              }}
              helperText={error.accountNumber}
              error={Boolean(error.accountNumber)}
              fullWidth={true}
              autoComplete='off'
              variant='outlined'
              value={achAccountData.accountNumber || ''}
              name='accountNumber'
              getValue={(val) => {
                setAchAccountData({
                  ...achAccountData,
                  accountNumber: val,
                });
              }}
              style={{ paddingLeft: '5px', paddingRight: '0px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t(
                'componentData.USBankPrepaidCard.originatingDFIDiscretionaryData'
              )}
              fullWidth={true}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.originatingDFIDiscretionaryData || ''}
              name='originatingDFIDiscretionaryData'
              onChange={onChange}
              inputProps={{
                maxLength: 2,
                minLength: 1,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label={t('componentData.USBankPrepaidCard.companyName')}
              error={Boolean(error.companyName)}
              helperText={error.companyName}
              fullWidth={true}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.companyName || ''}
              name='companyName'
              onChange={onChange}
              inputProps={{
                minLength: 1,
                maxLength: 16,
              }}
              required
            />
            <TextField
              label={t('componentData.USBankPrepaidCard.companyIdentification')}
              error={Boolean(error.companyIdentification)}
              helperText={error.companyIdentification}
              fullWidth={true}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.companyIdentification || ''}
              name='companyIdentification'
              onChange={handleIntegerValueChange}
              inputProps={{
                maxLength: 10,
                minLength: 10,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.USBankPrepaidCard.immediateOrigin')}
              fullWidth={true}
              error={Boolean(error.immediateOrigin)}
              helperText={error.immediateOrigin}
              autoComplete='off'
              color='secondary'
              variant='outlined'
              value={achAccountData.immediateOrigin || ''}
              name='immediateOrigin'
              inputProps={{
                maxLength: 10,
                minLength: 10,
              }}
              disabled
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t(
                'componentData.USBankPrepaidCard.companyEntryDescription'
              )}
              error={Boolean(error.companyEntryDescription)}
              helperText={error.companyEntryDescription}
              fullWidth={true}
              color='secondary'
              autoComplete='off'
              variant='outlined'
              value={achAccountData.companyEntryDescription || ''}
              name='companyEntryDescription'
              onChange={onChange}
              inputProps={{
                maxLength: 10,
                minLength: 2,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.USBankPrepaidCard.immediateOriginName')}
              fullWidth={true}
              error={Boolean(error.immediateOriginName)}
              helperText={error.immediateOriginName}
              color='secondary'
              autoComplete='off'
              variant='outlined'
              value={achAccountData.immediateOriginName || ''}
              name='immediateOriginName'
              inputProps={{
                maxLength: 23,
                minLength: 1,
              }}
              disabled
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t(
                'componentData.USBankPrepaidCard.companyDiscretionaryData'
              )}
              fullWidth={true}
              color='secondary'
              autoComplete='off'
              variant='outlined'
              value={achAccountData.companyDiscretionaryData || ''}
              name='companyDiscretionaryData'
              onChange={onChange}
              inputProps={{
                maxLength: 20,
                minLength: 1,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.USBankPrepaidCard.immediateDestination')}
              color='secondary'
              fullWidth={true}
              error={Boolean(error.immediateDestination)}
              helperText={error.immediateDestination}
              autoComplete='off'
              variant='outlined'
              value={achAccountData.immediateDestination || ''}
              name='immediateDestination'
              inputProps={{
                maxLength: 9,
                minLength: 9,
              }}
              disabled
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              select
              fullWidth={true}
              variant='outlined'
              autoComplete='off'
              value={achAccountData.currencyCode ?? ''}
              name='currencyCode'
              label={t('componentData.USBankPrepaidCard.currencyCode')}
              onChange={onChange}
              dir='horizontal'
              inputProps={{
                maxLength: 100,
              }}
              required
              error={Boolean(error.currencyCode)}
              helperText={error.currencyCode}
            >
              {currencyList &&
                currencyList
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
              label={t(
                'componentData.USBankPrepaidCard.immediateDestinationName'
              )}
              color='secondary'
              fullWidth={true}
              error={Boolean(error.immediateDestinationName)}
              helperText={error.immediateDestinationName}
              autoComplete='off'
              variant='outlined'
              value={achAccountData.immediateDestinationName || ''}
              name='immediateDestinationName'
              inputProps={{
                maxLength: 23,
                minLength: 1,
              }}
              disabled
              required
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.b2cPayments,
    ...state.USbankpayment,
  }))(withStyles(styles)(FocusNonPayrollACHAccount))
);
