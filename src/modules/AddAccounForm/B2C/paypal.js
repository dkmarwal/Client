import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, CircularProgress } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import {
  settingCreateB2CPaypalInfo,
  getPayPalAccountDetails,
  settimgUpdatePayPalAccountDetails,
} from '~/redux/actions/B2C/payments';
import trim from 'deep-trim-node';
import StringMaskInput from '~/components/MaskInput/stringMaskInput';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './styles';
import StateIso from '~/components/CSC/StateIso';
import CityIso from '~/components/CSC/CityIso';
import CountryIso from '~/components/CSC/CountryIso';
import Button from '@material-ui/core/Button';

const B2CPayPalDetail = (props) => {
  const {dispatch, classes, t, notification, canEdit} = props;  
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
    initCheckInformation(); 
  }, [props.user.userData.portalProfileId]);

  const initCheckInformation = async () => {
    const clientId = props.user.userData.portalProfileId || null;   
    const checkDetailinfo = await dispatch(getPayPalAccountDetails({
      clientId: clientId,
    }));
    
    const { error } = checkDetailinfo;
    if (error) {      
      notification("error", t('componentData.checkDetail.ErrorFetchingData'));
      return false;
    }

    setPaypalDetail({
      ...paypalDetail,
      data: {
        ...paypalDetail.data,
        ...checkDetailinfo,
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
      if(firstOccuranceIndex === 1){
        resultStr =intiVal.substr(0, firstOccuranceIndex) +
        intiVal.slice(firstOccuranceIndex).replace(/\+/g, '');
      } else {
        resultStr =intiVal.slice(0).replace(/\+/g, '');
      }
      finalValue = resultStr;
    }
    setPaypalDetail({
      ...paypalDetail,
      data: { ...paypalDetail.data, [name]: finalValue },
    });
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
    const clientId = props.user.userData.portalProfileId || null;
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
          settimgUpdatePayPalAccountDetails({
            payPalDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (!response || response.error) {   
            const errorMsg = response && response.message ? response.message : t('componentData.bankDetail.ErrorWhileSavingData')
            notification("error", errorMsg);
            return false;
          }          
          notification("success", t('componentData.paypalDetail.paypalDataUpdated'));
          props.closeModal(true)   
        });
      }
      else {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          settingCreateB2CPaypalInfo({
            payPalDetails: trim({ ...restBankDetail }),
          })
        ).then(async(response) => {
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
            notification("success", t('componentData.paypalDetail.paypalDataSaved'));
          } else { 
            const errorMsg = response && response.message ? response.message : t('componentData.bankDetail.ErrorWhileSavingData')
            notification("error", errorMsg);
            return false;
          }
          props.closeModal(true)
        });
      }
    } else {
      setSaveProcessing(false)     
      notification("error", t('componentData.commonErr.validationMsg'));
      return false;
    }
  };

  const validation = () => {
    let valid = true;
    let validation = {};
    
    if (!senderAccountNumber || senderAccountNumber.trim().length === 0) {
      validation['senderAccountNumber'] = t("componentData.paymentMethods.senderAccountNumber")
      valid = false;
    }
    if (senderAccountNumber && senderAccountNumber.length > 16) {
      validation['senderAccountNumber'] = t('componentData.paypalDetail.senderAccountErr')
      valid = false;
    }

    if(!worldlinkId || worldlinkId.trim().length === 0) {
      validation['worldlinkId'] = t("componentData.paymentMethods.worldlinkId")
      valid = false;
    }
    if (worldlinkId && worldlinkId.length !== 9) {
      validation['worldlinkId'] = t('componentData.paypalDetail.worldlinkIdErr')
      valid = false;
    }

    if(!clientBIC || clientBIC.trim().length === 0) {
      validation['clientBIC'] = t("componentData.paymentMethods.clientBIC")
      valid = false;
    }
    if (clientBIC && clientBIC.length !== 11) {
      validation['clientBIC'] = t('componentData.paypalDetail.clientBICErr')
      valid = false;
    }

    if(!senderName || senderName.trim().length === 0) {
      validation['senderName'] = t("componentData.paypalDetail.SenderNameReq")
      valid = false;
    }
    if (senderName && senderName.length > 140) {
      validation['senderName'] =t('componentData.paypalDetail.senderNameErr')
      valid = false;
    }

    if(!senderAddressLine1 || senderAddressLine1.trim().length === 0) {
      validation['senderAddressLine1'] = t("componentData.paymentMethods.senderAddressLine1")
      valid = false;
    }
    if (senderAddressLine1 && senderAddressLine1.length > 35) {
      validation['senderAddressLine1'] =t('componentData.paypalDetail.senderAddressLine1Err')
      valid = false;
    }

    if (!senderAddressLine2 || senderAddressLine2.trim().length === 0) {
      validation['senderAddressLine2'] = t("componentData.paymentMethods.senderAddressLine2")
      valid = false;
    }
    if (senderAddressLine2 && senderAddressLine2.length > 16) {
      validation['senderAddressLine2'] =t('componentData.paypalDetail.senderAddressLine2Err')
      valid = false;
    }

    if (!senderCity || senderCity.trim().length === 0) {
      validation['senderCity'] = t("componentData.paymentMethods.senderCity")
      valid = false;
    }
    if (senderCity && senderCity.length > 35) {
      validation['senderCity'] =t('componentData.paypalDetail.senderCityErr')
      valid = false;
    }

    if (!senderState || senderState.trim().length === 0) {
      validation['senderState'] = t("componentData.paymentMethods.senderState")
      valid = false;
    }
    if (senderState && senderState.length > 35) {
      validation['senderState'] =t('componentData.paypalDetail.senderStateErr')
      valid = false;
    }

    if(!senderZIP || senderZIP.trim().length === 0) {
      validation['senderZIP'] = t("componentData.paymentMethods.senderZIP")
      valid = false;
    }
    if (senderZIP && senderZIP.length > 16) {
      validation['senderZIP'] =t('componentData.paypalDetail.senderZIPErr')
      valid = false;
    }

    if(!senderCountryCode || senderCountryCode.trim().length === 0) {
      validation['senderCountryCode'] = t("componentData.paymentMethods.senderCountryCode")
      valid = false;
    }
    if (senderCountryCode && senderCountryCode.length !== 2) {
      validation['senderCountryCode'] =t('componentData.paypalDetail.senderCountryCodeErr')
      valid = false;
    }
    if (senderContactEmail && senderContactEmail.length) {
      const reg =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (!reg.test(senderContactEmail)) {
        validation['senderContactEmail'] =t('componentData.paypalDetail.senderContactEmailErr')
        valid = false;
      }
    }

    setPaypalDetail({
      ...paypalDetail,
      error: { ...paypalDetail, ...validation },
    });
    return valid;
  };

  const onCancel =()=>{
    props.onCancel(true);
  }

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
                readOnly: !canEdit ? true : false
              }}
              label={t('componentData.paypalDetail.worldlinkId')}
              error={error.worldlinkId}
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
              required              
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <StringMaskInput
              inputProps={{
                maxLength: 16,
                minLength: 6,
                readOnly: !canEdit ? true : false
              }}
              InputLabelProps={{
                shrink: true,
              }}
              label={t('componentData.paypalDetail.senderAccountNumber')}
              error={error.senderAccountNumber}
              helperText={error.senderAccountNumber}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={senderAccountNumber}
              name="senderAccountNumber"
              getValue={(val) => {
                setPaypalDetail({
                  ...paypalDetail,
                  data: {
                    ...paypalDetail.data,
                    senderAccountNumber: val ?? null,
                  },
                });
              }}
              required              
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 11,
                minLength:11,
                readOnly: !canEdit ? true : false
              }}
              label={t('componentData.paypalDetail.clientBIC')}
              error={error.clientBIC}
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
              required              
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
              inputProps={{ maxLength: 3, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              required              
            >
              <MenuItem key={'0'} value={'Mr.'}>
                Mr.
              </MenuItem>
              <MenuItem key={'1'} value={'Ms.'}>
                Ms.
              </MenuItem>
            </TextField>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 140,
                minLength: 1,
                readOnly: !canEdit ? true : false
              }}
              label={t('componentData.paypalDetail.senderName')}
              error={error.senderName}
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
              required              
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 35,
                minLength: 1,
                readOnly: !canEdit ? true : false
              }}
              label={t('componentData.paypalDetail.senderAddressLine1')}
              error={error.senderAddressLine1}
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
              required              
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 16,
                minLength: 1,
                readOnly: !canEdit ? true : false
              }}
              label={t('componentData.paypalDetail.senderAddressLine2')}
              error={error.senderAddressLine2}
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
              required              
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
              required
              inputProps={{                
                readOnly: !canEdit ? true : false
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
              required
              inputProps={{                
                readOnly: !canEdit ? true : false
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
              required
              inputProps={{                
                readOnly: !canEdit ? true : false
              }}
            />
            <TextField
              color="secondary"
              inputProps={{
                maxLength: 16,
                minLength: 1,
                readOnly: !canEdit ? true : false
              }}
              label={t('componentData.paypalDetail.senderZIP')}
              error={error.senderZIP}
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
              required              
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              color="secondary"
              label={t('componentData.paypalDetail.senderContactEmail')}
              error={error.senderContactEmail}
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
                readOnly: !canEdit ? true : false,
                maxLength: 127
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id={'senderPhone'}
              label={t('componentData.paypalDetail.senderPhone')}
              variant="outlined"
              error={Boolean(error.senderPhone)}
              helperText={error.senderPhone}
              name="senderPhone"
              onChange={onChange}
              onBlur={onBlur}
              inputProps={{ maxLength: 13, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={senderPhone}
            />
        </Grid>
          {canEdit && (
            <Grid container item xs={12} justify="center" className={classes.btnHolder}>
              <Button
                variant="outlined"
                style={{
                  display: "inline-block",
                  float: "left",
                  padding: "6px 10px",
                  width: "120px",
                  margin: "0px 10px 0 0",                
                }}              
                onClick={()=>onCancel()}
              >
                {t('componentData.addAccountCK.Cancel')}
              </Button>

              {saveProcessing ? (
                <CircularProgress color="primary" />
              ) : (
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  onClick={onSubmit}
                  style={{ color: 'white' }}
                >
                  {t('componentData.paypalDetail.saveButton')}
                </Button>
              )}
            </Grid>
          )}          
        </>
      </Grid>
      
    </Box>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.client,
    ...state.clientConfig,
  }))(withStyles(styles)(B2CPayPalDetail))
);
