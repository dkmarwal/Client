import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import {
  settingAddPushToCard,
  getPushToCardData,
  settingUpdatePushToCardData,
  fetchAllB2CAchList
} from '~/redux/actions/B2C/payments';
import trim from 'deep-trim-node';
import MaskInput from '~/components/MaskInput';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './styles';
import StateIso from '~/components/CSC/StateIso';
import CityIso from '~/components/CSC/CityIso';
import CountryIso from '~/components/CSC/CountryIso';
import SettlementAccount from './settlementAccount';

const B2CPushToCardDetail = (props) => {
  const {dispatch, classes, t, notification, canEdit} = props;  
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [pushToCardDetail, setPushToCardDetail] = useState({
    data: {
      id: null,
      partnerId: null,
      masterMerchantCatCode: null,
      visaMerchantCatCode: null,
      masterCardAcceptorId: null,
      visaAcceptorId: null,
      senderPhone: null,
      paymentType: null,
      senderAccount: null,
      senderFirstName: null,
      senderLastName: null,
      senderAddressLine1: null,
      senderAddressLine2: null,
      senderCity: null,
      senderState: null,
      senderZip: null,
      senderCountryCode: null,
      title: null,
      clientPrefix: null,
      senderContactEmail: null,
    },
    error: {
      partnerId: '',
      masterMerchantCatCode: '',
      visaMerchantCatCode: '',
      masterCardAcceptorId: '',
      visaAcceptorId: '',
      senderPhone: '',
      paymentType: '',
      senderAccount: '',
      senderFirstName: '',
      senderLastName: '',
      senderAddressLine1: '',
      senderAddressLine2: '',
      senderCity: '',
      senderState: '',
      senderZip: '',
      senderCountryCode: '',
      clientPrefix: '',
      senderContactEmail: '',
      title: '',
    },
  });

  useEffect(() => {
    const clientId = props.user.userData.portalProfileId || null;  
    props.dispatch(fetchAllB2CAchList(clientId));
    initPushToCardInformation(clientId);    
  }, [props.user.userData.portalProfileId]);  

  const initPushToCardInformation = async (clientId) => {
    let pushToCardDetails = {};
    const pushToCardinfo = await dispatch(getPushToCardData(clientId));    
    pushToCardDetails = pushToCardinfo.length ? pushToCardinfo[0] : {};

    let finalData = pushToCardDetails || {};   

    setPushToCardDetail({
      ...pushToCardDetail,
      data: {
        ...pushToCardDetail.data,
        ...finalData,
      },
    });
  };

  const { data, error } = pushToCardDetail;
  const {
    id,
    partnerId,
    masterMerchantCatCode,
    visaMerchantCatCode,
    masterCardAcceptorId,
    visaAcceptorId,
    senderPhone,
    paymentType,
    senderAccount,
    senderFirstName,
    senderLastName,
    senderAddressLine1,
    senderAddressLine2,
    senderCity,
    senderState,
    senderZip,
    senderCountryCode,
    title,
    clientPrefix,
    senderContactEmail,
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
    setPushToCardDetail({
      ...pushToCardDetail,
      data: {
        ...pushToCardDetail.data,
        [name]: finalValue
      },
    });
  };

  
  const handleIntegerValueChange = (event) => {
    const { name, value } = event.target;
    setPushToCardDetail({
        ...pushToCardDetail,
        data: { ...pushToCardDetail.data, [name]:value ===''? null:value.replace(/[^0-9]/g, '') },
      });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setPushToCardDetail({
      ...pushToCardDetail,
      data: {
        ...pushToCardDetail.data,
        [name]: value ? value.trim() : null,
      },
    });
  };

  const onSubmit = (settlementAccountId) => {    
    const clientId = props.user.userData.portalProfileId || null;   
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        id,
        partnerId,
        masterMerchantCatCode,
        visaMerchantCatCode,
        masterCardAcceptorId,
        visaAcceptorId,
        senderPhone,
        paymentType,
        senderAccount,
        senderFirstName,
        senderLastName,
        senderAddressLine1,
        senderAddressLine2,
        senderCity,
        senderState,
        senderZip,
        senderCountryCode,
        title,
        clientPrefix,
        senderContactEmail,
        settlementAccountId
      };

      if (id) {
        dispatch(
          settingUpdatePushToCardData(trim(data),clientId)
        ).then((response) => {
          setSaveProcessing(false);
          if (!response || response.error) {            
            const errorMsg = response && response.message ? response.message : t('componentData.bankDetail.ErrorWhileSavingData')
            notification("error", errorMsg);
            return false;
          }
          props.dispatch(fetchAllB2CAchList(clientId))              
          notification("success", t("componentData.paymentMethods.pushToCardUpdateMsg"));
          props.closeModal(true)
        });         
      }
      else {
        const { id, ...restBankDetail } = data;
        dispatch(settingAddPushToCard(trim({ ...restBankDetail }), clientId)).then(
          (response) => {            
            setSaveProcessing(false);
            if (response && !response.error) {   
              props.dispatch(fetchAllB2CAchList(clientId))                      
              notification("success", t("componentData.paymentMethods.pushToCardSaveMsg"));
            } else {              
              const errorMsg = response && response.message ? response.message : t('componentData.bankDetail.ErrorWhileSavingData')
              notification("error", errorMsg);
              return false;
            }
            props.closeModal(true)
          }
        );          
      }
    } else {
      setSaveProcessing(false); 
      notification("error", t('componentData.commonErr.validationMsg'));
      return false;
    }
  };

  const validation = () => {
    let valid = true;
    let validation = {};

    const reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;   
      

    if(!partnerId || partnerId.trim().length === 0) {
      validation.partnerId = t("componentData.paymentMethods.partnerId");
      valid = false;
    }     

    if(!masterMerchantCatCode) {
      validation.masterMerchantCatCode = t("componentData.paymentMethods.masterMerchantCatCode");
      valid = false;
    }
    else if(masterMerchantCatCode && masterMerchantCatCode.length < 4) {
      validation.masterMerchantCatCode = t("componentData.paymentMethods.masterMerchantCatCode2");
      valid = false;
    }
    else if(masterMerchantCatCode && masterMerchantCatCode.length === 4 && masterMerchantCatCode.startsWith('0')){
      validation.masterMerchantCatCode = t(
        'componentData.pushToCardDetail.invalidMasterMerchantCatCode'
      );
      valid = false;
    }
    if(!visaMerchantCatCode) {
      validation.visaMerchantCatCode = t("componentData.paymentMethods.visaMerchantCatCode");
      valid = false;
    }
    else if(visaMerchantCatCode && visaMerchantCatCode.length < 4) {
      validation.visaMerchantCatCode = t("componentData.paymentMethods.visaMerchantCatCode2");
      valid = false;
    }
    else if(visaMerchantCatCode && visaMerchantCatCode.length === 4 && visaMerchantCatCode.startsWith('0')){
      validation.visaMerchantCatCode = t(
        'componentData.pushToCardDetail.invalidvisaMerchantCatCode'
      );
      valid = false;
    }
    if(!masterCardAcceptorId || masterCardAcceptorId.trim().length === 0) {
      validation.masterCardAcceptorId = t("componentData.paymentMethods.masterCardAcceptorId");
      valid = false;
    }
    if(masterCardAcceptorId && masterCardAcceptorId.length < 10) {
      validation.masterCardAcceptorId = t("componentData.paymentMethods.masterCardAcceptorId2");
      valid = false;
    }

    if(!visaAcceptorId || visaAcceptorId.trim().length === 0) {
      validation.visaAcceptorId = t("componentData.paymentMethods.visaAcceptorId");
      valid = false;
    }
    if(visaAcceptorId && visaAcceptorId.length < 10) {
      validation.visaAcceptorId = t("componentData.paymentMethods.visaAcceptorId2");
      valid = false;
    }

    if(!senderZip || senderZip.trim().length === 0) {
      validation.senderZip = t("componentData.paymentMethods.senderZip");
      valid = false;
    }
    if(senderZip && senderZip.length < 5) {
      validation.senderZip = t("componentData.paymentMethods.senderZip2");
      valid = false;
    }
   
    if (senderContactEmail && !reg.test(senderContactEmail)) {
      validation.senderContactEmail = t("componentData.paymentMethods.senderContactEmail");
      valid = false;
    }
    
    if(!paymentType || paymentType.trim().length === 0){
      validation.paymentType = t("componentData.paymentMethods.paymentType");
      valid = false;
    }

    
    if(!senderAccount || senderAccount.trim().length === 0){
      validation.senderAccount = t("componentData.paymentMethods.senderAccount2");
      valid = false;
    }

    if(!senderFirstName || senderFirstName.trim().length === 0){
      validation.senderFirstName = t("componentData.paymentMethods.senderFirstName");
      valid = false;
    }

    if(!senderLastName || senderLastName.trim().length === 0){
      validation.senderLastName = t("componentData.paymentMethods.senderLastName");
      valid = false;
    }

    if(!senderAddressLine1 || senderAddressLine1.trim().length === 0){
      validation.senderAddressLine1 = t("componentData.paymentMethods.senderAddressLine_1");
      valid = false;
    }

    if(!senderAddressLine2 || senderAddressLine2.trim().length === 0){
      validation.senderAddressLine2 = t("componentData.paymentMethods.senderAddressLine_2");
      valid = false;
    }

    if(!senderCountryCode || senderCountryCode.trim().length === 0){
      validation.senderCountryCode = t("componentData.paymentMethods.senderCountryCode2");
      valid = false;
    }

    if(!senderState || senderState.trim().length === 0){
      validation.senderState = t("componentData.paymentMethods.senderState2");
      valid = false;
    }

    if(!senderCity || senderCity.trim().length === 0){
      validation.senderCity = t("componentData.paymentMethods.senderCity2");
      valid = false;
    }

    if(!title || title.trim().length === 0){
      validation.title = t("componentData.paymentMethods.namePrefix");
      valid = false;
    }

    setPushToCardDetail({
      ...pushToCardDetail,
      error: {...validation },
    });
    return valid;
  };

  const onCancel =()=>{
    props.onCancel(true);
  }
  let selectedCountry = ''
  if(senderCountryCode){
    selectedCountry = props.csc['countryList']?.find(item=>item.isoCode3 === senderCountryCode)?.isoCode
  }

  return (
    <>
      <Box className={classes.popupInner}>
        <Grid container>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.PartnerID")}
              variant="outlined"
              error={Boolean(error.partnerId)}
              helperText={error.partnerId}
              name="partnerId"
              onChange={onChange}
              inputProps={{ maxLength: 32, readOnly: !canEdit ? true : false}}
              value={partnerId}
              onBlur={handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
              required              
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <MaskInput
              inputProps={{ maxLength: 35, readOnly: !canEdit ? true : false }}
              label={t("componentData.paymentMethods.senderAccount3")}
              error={Boolean(error.senderAccount)}
              helperText={error.senderAccount}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={senderAccount}
              name="senderAccount"
              InputLabelProps={{
                shrink: true,
              }}              
              getValue={(val) => {
                setPushToCardDetail({
                  ...pushToCardDetail,
                  data:{
                    ...pushToCardDetail.data,
                    senderAccount: val,
                  }
                  
                });
              }}
              required              
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              select
              color="secondary"
              name={'paymentType'}
              id={'paymentType'}
              label={t("componentData.paymentMethods.paymentType2")}
              type={'select'}
              value={paymentType}
              error={Boolean(error.paymentType)}
              helperText={error.paymentType}
              onChange={onChange}
              onBlur={handleBlur}
              disabled={false}
              inputProps={{ maxLength: 3, readOnly: !canEdit ? true : false }}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required              
            >
              <MenuItem key={'0'} value={'BDB'}>
                {t("componentData.paymentMethods.BDB")}
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} className={classes.nameBox}>
            <TextField
              select
              color="secondary"
              name={'title'}
              id={'title'}
              label={t("componentData.paymentMethods.Prefix")}
              type={'select'}
              value={title}
              onChange={onChange}
              onBlur={handleBlur}
              disabled={false}
              inputProps={{ maxLength: 3, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              error={Boolean(error.title)}
              helperText={error.title}
              required              
            >
              <MenuItem key={'0'} value={'Mr.'}>
                {t("componentData.paymentMethods.Mr")}
              </MenuItem>
              <MenuItem key={'1'} value={'Ms.'}>
                {t("componentData.paymentMethods.Ms")}
              </MenuItem>
            </TextField>

            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.senderFirstName2")}
              variant="outlined"
              error={Boolean(error.senderFirstName)}
              helperText={error.senderFirstName}
              name="senderFirstName"
              onChange={onChange}
              onBlur={handleBlur}
              inputProps={{ minLength: 1, maxLength: 40, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={senderFirstName}
              required              
            />

            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.senderLastName2")}
              variant="outlined"
              error={Boolean(error.senderLastName)}
              helperText={error.senderLastName}
              name="senderLastName"
              onChange={onChange}
              onBlur={handleBlur}
              inputProps={{ minLength: 1, maxLength: 40, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={senderLastName}
              required              
            />
          </Grid>

          <Grid item xs={6} className={classes.multitBox}>
            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.masterMerchantCatCode3")}
              variant="outlined"
              error={Boolean(error.masterMerchantCatCode)}
              helperText={error.masterMerchantCatCode}
              name="masterMerchantCatCode"
              onChange={handleIntegerValueChange}
              onBlur={handleBlur}
              inputProps={{ maxLength: 4, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={masterMerchantCatCode}
              required              
            />
            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.visaMerchantCatCode3")}
              variant="outlined"
              error={Boolean(error.visaMerchantCatCode)}
              helperText={error.visaMerchantCatCode}
              name="visaMerchantCatCode"
              onChange={handleIntegerValueChange}
              onBlur={handleBlur}
              inputProps={{ maxLength: 4, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={visaMerchantCatCode}
              required              
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.SenderAddressLine_1")}
              variant="outlined"
              error={Boolean(error.senderAddressLine1)}
              helperText={error.senderAddressLine1}
              name="senderAddressLine1"
              onChange={onChange}
              onBlur={handleBlur}
              inputProps={{ minLength: 1, maxLength: 50, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={senderAddressLine1}
              required              
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.masterCardAcceptorId3")}
              variant="outlined"
              error={Boolean(error.masterCardAcceptorId)}
              helperText={error.masterCardAcceptorId}
              name="masterCardAcceptorId"
              onChange={onChange}
              onBlur={handleBlur}
              inputProps={{ minLength: 10, maxLength: 15, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={masterCardAcceptorId}
              required              
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.SenderAddressLine2")}
              variant="outlined"
              error={Boolean(error.senderAddressLine2)}
              helperText={error.senderAddressLine2}
              name="senderAddressLine2"
              onChange={onChange}
              onBlur={handleBlur}
              inputProps={{ minLength: 1, maxLength: 50, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={senderAddressLine2}
              required              
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.visaAcceptorId3")}
              variant="outlined"
              error={Boolean(error.visaAcceptorId)}
              helperText={error.visaAcceptorId}
              name="visaAcceptorId"
              onChange={onChange}
              onBlur={handleBlur}
              inputProps={{ minLength: 10, maxLength: 15, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={visaAcceptorId}
              required              
            />
          </Grid>

          <Grid item xs={6} className={classes.multitBox}>
            <CountryIso
              isoCode3={true}
              error={Boolean(error.senderCountryCode)}
              helperText={error.senderCountryCode}
              name={'senderCountryCode'}
              label={t("componentData.paymentMethods.senderCountryCode3")}
              onChange={onChange}
              onBlur={handleBlur}
              value={senderCountryCode}
              InputLabelProps={{
                shrink: true,
              }}
              required
              inputProps={{readOnly: !canEdit ? true : false }}
            />

            <StateIso
              error={Boolean(error.senderState)}
              helperText={error.senderState}
              onChange={onChange}
              selectedState={senderState || ''}
              selectedCountry={selectedCountry}
              label={t("componentData.paymentMethods.senderState3")}
              name="senderState"
              value={senderState}
              onBlur={handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
              required
              inputProps={{readOnly: !canEdit ? true : false }}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
          <TextField
            id="outlined-basic"
            label={t('componentData.paymentMethods.senderPhone2')}
            variant="outlined"
            error={Boolean(error.senderPhone)}
            helperText={error.senderPhone}
            name="senderPhone"
            onChange={onChange}
            onBlur={handleBlur}
            inputProps={{ maxLength: 13,readOnly: !canEdit ? true : false }}
            InputLabelProps={{
              shrink: true,
            }}
            value={senderPhone}
          />
        </Grid>

          <Grid item xs={6} className={classes.multitBox}>
            <CityIso
              name="senderCity"
              label={t("componentData.paymentMethods.senderCity3")}
              error={Boolean(error.senderCity)}
              helperText={error.senderCity}
              selectedState={senderState || ''}
              selectedCity={senderCity || ''}
              selectedCountry={senderCountryCode || ''}
              onChange={onChange}
              onBlur={handleBlur}
              value={senderCity}
              InputLabelProps={{
                shrink: true,
              }}
              required
              inputProps={{ maxLength: 10, readOnly: !canEdit ? true : false }}
            />

            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.senderZip3")}
              variant="outlined"
              error={Boolean(error.senderZip)}
              helperText={error.senderZip}
              name="senderZip"
              onChange={onChange}
              onBlur={handleBlur}
              inputProps={{ minLength: 5, maxLength: 10, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={senderZip}
              required              
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.senderContactEmail2")}
              variant="outlined"
              error={Boolean(error.senderContactEmail)}
              helperText={error.senderContactEmail}
              name="senderContactEmail"
              onChange={onChange}
              onBlur={handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
              value={senderContactEmail}
              inputProps={{readOnly: !canEdit ? true : false, maxLength: 13 }}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t("componentData.paymentMethods.clientPrefix")}
              variant="outlined"
              error={Boolean(error.clientPrefix)}
              helperText={error.clientPrefix}
              name="clientPrefix"
              onChange={onChange}
              onBlur={handleBlur}
              inputProps={{ maxLength: 5, readOnly: !canEdit ? true : false }}
              InputLabelProps={{
                shrink: true,
              }}
              value={clientPrefix}              
            />
          </Grid>
          <SettlementAccount
              onCancel={onCancel}
              saveProcessing={saveProcessing}
              canEdit={canEdit}
              onSubmit={onSubmit}
              currencyCodes={props.currencyCodes}
              notification={props.notification}
              handleValidation={validation}
              selectedSettlementAccountId = {pushToCardDetail.data.settlementAccountId}
              alertText={t('componentData.paymentMethods.p2cSettlementAccountAlert')}
            />
          
        </Grid>        
      </Box>
    </>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.client,
    ...state.clientConfig,
    ...state.csc
  }))(withStyles(styles)(B2CPushToCardDetail))
);
