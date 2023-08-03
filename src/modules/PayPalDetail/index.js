import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, CircularProgress } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import {
  createB2CPaypalInfo,
  getPayPalAccountDetails,
  updatePayPalAccountDetails,
} from '~/redux/actions/B2C/payments';
import trim from 'deep-trim-node';
import StringMaskInput from '~/components/MaskInput/stringMaskInput';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './styles';
import StateIso from '~/components/CSC/StateIso';
import CityIso from '~/components/CSC/CityIso';
import CountryIso from '~/components/CSC/CountryIso';
import Button from '@material-ui/core/Button';

const B2CPayPalDetail = ({
  clientId,
  parentId,
  showParentData,
  dispatch,
  classes,
  t,
  handleCollapse,
  paymentTypeId,
  setVariant,
  setErrorText,
}) => {
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [paypalDetail, setPaypalDetail] = useState({
    data: {
      accountId: '',
      worldlinkId: null,
      senderAccountNumber: null,
      clientBIC: null,
      senderName: null,
      senderAddressLine1: null,
      senderAddressLine2: null,
      senderCity: null,
      senderState: null,
      senderZIP: null,
      senderCountryCode: null,
      senderPhone: null,
      senderContactEmail: null,
      title: null,
    },
    error: {
      accountId: '',
      worldlinkId: '',
      senderAccountNumber: '',
      clientBIC: '',
      senderName: '',
      senderAddressLine1: '',
      senderAddressLine2: '',
      senderCity: '',
      senderState: '',
      senderZIP: '',
      senderCountryCode: '',
      senderPhone: '',
      senderContactEmail: '',
      title: null,
    },
  });

  useEffect(() => {
    if (showParentData) {
      initCheckInformation(parentId, true);
    } else {
      initCheckInformation(clientId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showParentData, clientId, parentId]);

  const initCheckInformation = async (paypalId, isParent) => {
    const paypalDetailInfo = await dispatch(getPayPalAccountDetails({
      clientId: paypalId,
      showParentData
    }));

    if (!paypalDetailInfo || paypalDetailInfo.error) {
      setErrorText(t('componentData.checkDetail.ErrorFetchingData'));
      setVariant('error');
      return false;
    }
    let PaypalDetail = paypalDetailInfo || {};
    if (isParent) {
      const { accountId, ...restDetails } = paypalDetailInfo;
      PaypalDetail = restDetails;
    }
    setPaypalDetail({
      ...paypalDetail,
      data: {
        ...paypalDetail.data,
        ...PaypalDetail,
      },
    });
  };

  const { data, error } = paypalDetail;
  const {
    accountId,
    worldlinkId,
    senderAccountNumber,
    clientBIC,
    senderName,
    senderAddressLine1,
    senderAddressLine2,
    senderCity,
    senderState,
    senderZIP,
    senderCountryCode,
    senderPhone,
    senderContactEmail,
    title,
  } = data;

  const onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    let finalValue = value || null
    if (name === 'senderPhone' && value) {
      const intiVal = value.replace(/[^+{1}0-9]/g, '');
      let firstOccuranceIndex = intiVal.search(/\+/) + 1;
      let resultStr = ""
      if (firstOccuranceIndex === 1) {
        resultStr = intiVal.substr(0, firstOccuranceIndex) +
          intiVal.slice(firstOccuranceIndex).replace(/\+/g, '');
      } else {
        resultStr = intiVal.slice(0).replace(/\+/g, '');
      }
      finalValue = resultStr;
    }
    const newData = {
      ...paypalDetail,
      data: { ...paypalDetail.data, [name]: finalValue },
    }
    setPaypalDetail(newData);
  };

  const onBlur = (event) => {
    const { name, value } = event.target;
    setPaypalDetail({
      ...paypalDetail,
      data: {
        ...paypalDetail.data,
        [name]: value ? value.trim() : null,
      },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        accountId,
        worldlinkId,
        senderAccountNumber: Boolean(senderAccountNumber)
          ? senderAccountNumber
          : null,
        clientBIC,
        senderName,
        senderAddressLine1,
        senderAddressLine2,
        senderCity,
        senderState,
        senderZIP,
        senderCountryCode,
        senderPhone,
        senderContactEmail,
        clientId,
        title,
      };

      if (accountId) {
        dispatch(
          updatePayPalAccountDetails({
            payPalDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (!response || response.error) {
            setErrorText(response?.message ?? t('componentData.bankDetail.ErrorWhileSavingData'));
            setVariant('error');
            return false;
          }
          handleCollapse(paymentTypeId)
          setErrorText(t('componentData.paypalDetail.paypalDataUpdated'));
          setVariant('success');
        });
      } else {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          createB2CPaypalInfo({
            payPalDetails: trim({ ...restBankDetail }),
          })
        ).then(async (response) => {
          setSaveProcessing(false);
          if (response && !response.error) {
            const payPalDetails = await dispatch(
              getPayPalAccountDetails({ clientId })
            );
            if (payPalDetails) {
              setPaypalDetail({
                ...paypalDetail,
                data: {
                  ...paypalDetail.data,
                  accountId: payPalDetails.accountId,
                },
              });
            }
            handleCollapse(paymentTypeId)
            setErrorText(t('componentData.paypalDetail.paypalDataSaved'));
            setVariant('success');
          } else {
            setErrorText(response?.message ?? t('componentData.bankDetail.ErrorWhileSavingData'));
            setVariant('error');
            return false;
          }
        });
      }
    } else {
      setSaveProcessing(false)
      setErrorText(t('componentData.commonErr.validationMsg'));
      setVariant('error');
      return false;
    }
  };

  const validation = () => {
    let valid = true;
    let validation = {};

    if (senderAccountNumber && senderAccountNumber.length > 16) {
      validation['senderAccountNumber'] = t('componentData.paypalDetail.senderAccountErr')
      valid = false;
    }
    if (worldlinkId && worldlinkId.length !== 9) {
      validation['worldlinkId'] = t('componentData.paypalDetail.worldlinkIdErr')
      valid = false;
    }
    if (clientBIC && clientBIC.length !== 11) {
      validation['clientBIC'] = t('componentData.paypalDetail.clientBICErr')
      valid = false;
    }
    if (senderName && senderName.length > 140) {
      validation['senderName'] = t('componentData.paypalDetail.senderNameErr')
      valid = false;
    }
    if (senderAddressLine1 && senderAddressLine1.length > 35) {
      validation['senderAddressLine1'] = t('componentData.paypalDetail.senderAddressLine1Err')
      valid = false;
    }
    if (senderAddressLine2 && senderAddressLine2.length > 16) {
      validation['senderAddressLine2'] = t('componentData.paypalDetail.senderAddressLine2Err')
      valid = false;
    }
    if (senderCity && senderCity.length > 35) {
      validation['senderCity'] = t('componentData.paypalDetail.senderCityErr')
      valid = false;
    }
    if (senderState && senderState.length > 35) {
      validation['senderState'] = t('componentData.paypalDetail.senderStateErr')
      valid = false;
    }
    if (senderZIP && senderZIP.length > 16) {
      validation['senderZIP'] = t('componentData.paypalDetail.senderZIPErr')
      valid = false;
    }
    if (senderCountryCode && senderCountryCode.length !== 2) {
      validation['senderCountryCode'] = t('componentData.paypalDetail.senderCountryCodeErr')
      valid = false;
    }
    if (senderContactEmail && senderContactEmail.length) {
      const reg =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (!reg.test(senderContactEmail)) {
        validation['senderContactEmail'] = t('componentData.paypalDetail.senderContactEmailErr')
        valid = false;
      }
    }

    const finalDataErr = {
      ...paypalDetail,
      error: { ...validation }
    }

    setPaypalDetail(finalDataErr);
    return valid;
  };
  return (
    <Box className={classes.popupInner}>
      <Grid container>
        <>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 9,
                minLength: 9,
              }}
              label={t('componentData.paypalDetail.worldlinkId')}
              error={Boolean(error.worldlinkId)}
              helperText={error.worldlinkId}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={worldlinkId}
              name="worldlinkId"
              onChange={onChange}
              onBlur={onBlur}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <StringMaskInput
              inputProps={{
                maxLength: 16,
                minLength: 6,
              }}
              label={t('componentData.paypalDetail.senderAccountNumber')}
              error={Boolean(error.senderAccountNumber)}
              helperText={error.senderAccountNumber}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={senderAccountNumber}
              name="senderAccountNumber"
              InputLabelProps={{
                shrink: true,
              }}
              getValue={(val) => {
                setPaypalDetail({
                  ...paypalDetail,
                  data: {
                    ...paypalDetail.data,
                    senderAccountNumber: val ?? null,
                  },
                });
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 11,
                minLength: 11
              }}
              label={t('componentData.paypalDetail.clientBIC')}
              error={Boolean(error.clientBIC)}
              helperText={error.clientBIC}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={clientBIC}
              name="clientBIC"
              onChange={onChange}
              onBlur={onBlur}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.paypalNameBox}>
            <TextField
              select
              color="secondary"
              name={'title'}
              id={'title'}
              label={t('componentData.paypalDetail.title')}
              value={title}
              onChange={onChange}
              variant="outlined"
              disabled={false}
              inputProps={{ maxLength: 3 }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              <MenuItem key={'0'} value={'Mr.'}>
                {t('componentData.paypalDetail.Mr')}
              </MenuItem>
              <MenuItem key={'1'} value={'Ms.'}>
                {t('componentData.paypalDetail.Ms')}
              </MenuItem>
            </TextField>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 140,
                minLength: 1,
              }}
              label={t('componentData.paypalDetail.senderName')}
              error={Boolean(error.senderName)}
              helperText={error.senderName}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={senderName}
              name="senderName"
              onChange={onChange}
              onBlur={onBlur}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 35,
                minLength: 1,
              }}
              label={t('componentData.paypalDetail.senderAddressLine1')}
              error={Boolean(error.senderAddressLine1)}
              helperText={error.senderAddressLine1}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={senderAddressLine1}
              name="senderAddressLine1"
              onChange={onChange}
              onBlur={onBlur}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 16,
                minLength: 1,
              }}
              label={t('componentData.paypalDetail.senderAddressLine2')}
              error={Boolean(error.senderAddressLine2)}
              helperText={error.senderAddressLine2}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={senderAddressLine2}
              name="senderAddressLine2"
              onChange={onChange}
              onBlur={onBlur}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.multitBox}>
            <CountryIso
              selectedCountry={senderCountryCode || ''}
              error={Boolean(error.senderCountryCode)}
              helperText={error.senderCountryCode}
              name={'senderCountryCode'}
              label={t('componentData.paypalDetail.senderCountryCode')}
              onChange={onChange}
              value={senderCountryCode}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <StateIso
              error={Boolean(error.senderState)}
              helperText={error.senderState}
              onChange={onChange}
              selectedState={senderState || ''}
              selectedCountry={senderCountryCode || ''}
              label={t('componentData.paypalDetail.senderState')}
              name="senderState"
              value={senderState}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.multitBox}>
            <CityIso
              name="senderCity"
              label={t('componentData.paypalDetail.senderCity')}
              error={Boolean(error.senderCity)}
              helperText={error.senderCity}
              selectedState={senderState || ''}
              selectedCity={senderCity || ''}
              selectedCountry={senderCountryCode || ''}
              onChange={onChange}
              value={senderCity}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 16,
                minLength: 1,
              }}
              label={t('componentData.paypalDetail.senderZIP')}
              error={Boolean(error.senderZIP)}
              helperText={error.senderZIP}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={senderZIP}
              name="senderZIP"
              onChange={onChange}
              onBlur={onBlur}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              label={t('componentData.paypalDetail.senderContactEmail')}
              error={Boolean(error.senderContactEmail)}
              helperText={error.senderContactEmail}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={senderContactEmail}
              name="senderContactEmail"
              onChange={onChange}
              onBlur={onBlur}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                maxLength: 127
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.senderPhone')}
              variant="outlined"
              error={Boolean(error.senderPhone)}
              helperText={error.senderPhone}
              name="senderPhone"
              onChange={onChange}
              onBlur={onBlur}
              inputProps={{ maxLength: 13 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={senderPhone}
            />
          </Grid>
          <Grid container item xs={12} justify="center">
            {saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => onSubmit()}
                style={{ color: 'white', fontSize: 14 }}
              >
                {t('componentData.paypalDetail.saveButton')}
              </Button>
            )}
          </Grid>
        </>
      </Grid>
    </Box>
  );
};

export default withTranslation()(
  connect()(withStyles(styles)(B2CPayPalDetail))
);
