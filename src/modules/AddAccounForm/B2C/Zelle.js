import React, { Component } from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/styles';
import {
  Grid,
  Box,
  MenuItem,
  Tooltip,
  InputAdornment,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { connect } from 'react-redux';
import {
  settingGetZelleData,
  senderTypeList,
  senderProductType,
  settingAddZelle,
  settingUpdateZelle,
  fetchAllB2CAchList,
} from '~/redux/actions/B2C/payments';
import { CountryIso, CityIso, StateIso } from '~/components/CSC';
import trim from 'deep-trim-node';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withTranslation } from 'react-i18next';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import SettlementAccount from './settlementAccount';
import {getB2CGeneralSettingConfig} from '~/redux/helpers/settings'

class ZelleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderList: [],
      productTypeList: [],
      saveProcessing: null,
      cardData: {
        clientId: null,
        senderType: this.props.t('componentData.onboardZelle.BigBusiness'),
        senderName: null,
        address_line1: null,
        address_line2: null,
        city: null,
        state: null,
        zipcode: null,
        countryCode: null,
        productType: 'b2c',
        debitNetwork: 1,
        secondaryDDA: 0,
        visaIdCode: null,
        visaMerchantCategoryCode: null,
        businessIndicator: null,
        merchantCategoryCode: null,
        cardAcceptorId: null,
        customerContact: null,
        paymentType: null,
        firstNameRiskScore: '00',
        lastNameRiskScore: '00',
        combinedRiskScore: '00',
        senderEmail: null,
        senderPhone: null,
        payeeAcceptanceExpiryDays: null,
        allowRegisterViaZella: 0,
        noOfDaysBeforeEnrolmentExpire: 0,
        isAuthorizeDebit: 0,
        zelleTokenFromConsumer: 0,
      },
      errorData: {
        senderType: null,
        senderName: null,
        address_line1: null,
        address_line2: null,
        city: null,
        state: null,
        zipcode: null,
        countryCode: null,
        productType: null,
        debitNetwork: null,
        secondaryDDA: null,
        visaIdCode: null,
        visaMerchantCategoryCode: null,
        businessIndicator: null,
        merchantCategoryCode: null,
        cardAcceptorId: null,
        customerContact: null,
        paymentType: null,
        firstNameRiskScore: null,
        lastNameRiskScore: null,
        combinedRiskScore: null,
        senderEmail: null,
        senderPhone: null,
        payeeAcceptanceExpiryDays: null,
        noOfDaysBeforeEnrolmentExpire: null,
      },
      settlementAccountData: null,
    };
  }

  async componentDidMount() {
    const clientId = this.props.user.userData.portalProfileId || null;
    this.props.dispatch(fetchAllB2CAchList(clientId));
    await this.getCardData();
  }

  onCheckboxChange = (event, name) => {
    event.target.checked
      ? this.setState({
          ...this.state,
          cardData: {
            ...this.state.cardData,
            [name]: 1,
          },
        })
      : this.setState({
          ...this.state,
          cardData: {
            ...this.state.cardData,
            [name]: 0,
          },
        });
  };

  onChange = (event) => {
    const numeric = /^[0-9]*\.?[0-9]*$/;
    const { name } = event.target;
    if (
      name === 'firstNameRiskScore' ||
      name === 'lastNameRiskScore' ||
      name === 'combinedRiskScore'
    ) {
      if (numeric.test(event.currentTarget.value)) {
        //event.currentTarget.value = null;
        this.setState({
          cardData: {
            ...this.state.cardData,
            [name]: event.target.value,
          },
        });
      }
    } else if (name === 'senderPhone' && event.target.value) {
      let { value } = event.target;
      let finalValue = value || null;
      const intiVal = value.replace(/[^+{1}0-9]/g, '');
      let firstOccuranceIndex = intiVal.search(/\+/) + 1;
      let resultStr = '';
      if (firstOccuranceIndex === 1) {
        resultStr =
          intiVal.substr(0, firstOccuranceIndex) +
          intiVal.slice(firstOccuranceIndex).replace(/\+/g, '');
      } else {
        resultStr = intiVal.slice(0).replace(/\+/g, '');
      }
      finalValue = resultStr;
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: finalValue,
        },
      });
    } else if (name === 'countryCode') {
      let { value } = event.target;

      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: value,
          state: '',
          city: '',
          zipcode: '',
        },
      });
    } else if (
      name === 'visaMerchantCategoryCode' ||
      name === 'merchantCategoryCode' ||
      name === 'payeeAcceptanceExpiryDays'
    ) {
      let { value } = event.target;
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: value.replace(/[^0-9]/g, ''),
        },
      });
    } else {
      let { value } = event.target;
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: value,
        },
      });
    }
  };

  handleBlur = (event) => {
    const { name, value } = event.target;
    this.setState(
      {
        cardData: {
          ...this.state.cardData,
          [name]: value?.trim() ?? value,
        },
      },
      () => {
        // this.saveZelleData()
      }
    );
  };

  saveZelleData = () => {
    let valid = true;
    let validation = {};
    const { t } = this.props;
    const {
      senderType,
      senderName,
      address_line1,      
      city,
      state,
      zipcode,
      countryCode,
      productType,
      debitNetwork,
      visaIdCode,
      visaMerchantCategoryCode,
      businessIndicator,
      merchantCategoryCode,
      cardAcceptorId,
      customerContact,
      paymentType,
      firstNameRiskScore,
      lastNameRiskScore,
      combinedRiskScore,
      senderEmail,
      payeeAcceptanceExpiryDays,
      noOfDaysBeforeEnrolmentExpire,
      allowRegisterViaZella,
    } = this.state.cardData;
    const reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;

    if (!senderType || (senderType && senderType.trim().length === 0)) {
      validation.senderType = t('componentData.onboardZelle.senderTypeReq');
      valid = false;
    }
    if (!senderName || (senderName && senderName.trim().length === 0)) {
      validation.senderName = t('componentData.onboardZelle.senderNameReq');
      valid = false;
    }
    if (
      !address_line1 ||
      (address_line1 && address_line1.trim().length === 0)
    ) {
      validation.address_line1 = t(
        'componentData.onboardZelle.address_line1Req'
      );
      valid = false;
    }    

    if (!city || (city && city.trim().length === 0)) {
      validation.city = t('componentData.onboardZelle.cityReq');
      valid = false;
    }
    if (!state || (state && state.trim().length === 0)) {
      validation.state = t('componentData.onboardZelle.stateReq');
      valid = false;
    }
    if (!zipcode || (zipcode && zipcode.trim().length === 0)) {
      validation.zipcode = t('componentData.onboardZelle.zipcodeReq');
      valid = false;
    }
    if (!countryCode || (countryCode && countryCode.trim().length === 0)) {
      validation.countryCode = t('componentData.onboardZelle.countryCodeReq');
      valid = false;
    }

    if (!productType || (productType && productType.trim().length === 0)) {
      validation.productType = t('componentData.onboardZelle.productTypeReq');
      valid = false;
    }

    if (debitNetwork === 1) {
      if (!visaIdCode || (visaIdCode && visaIdCode.trim().length === 0)) {
        validation.visaIdCode = t('componentData.onboardZelle.visaIdCodeReq');
        valid = false;
      }
      if (
        !visaMerchantCategoryCode ||
        (visaMerchantCategoryCode &&
          visaMerchantCategoryCode.toString().trim().length === 0)
      ) {
        validation.visaMerchantCategoryCode = t(
          'componentData.onboardZelle.visaMerchantCategoryCodeReq'
        );
        valid = false;
      }
      if (
        visaMerchantCategoryCode &&
        visaMerchantCategoryCode.toString().length < 4
      ) {
        validation.visaMerchantCategoryCode = t(
          'componentData.onboardZelle.merchantcategoryCode'
        );
        valid = false;
      }

      if (
        !businessIndicator ||
        (businessIndicator && businessIndicator.trim().length === 0)
      ) {
        validation.businessIndicator = t(
          'componentData.onboardZelle.businessIndicatorReq'
        );
        valid = false;
      }
      if (businessIndicator && businessIndicator.length < 2) {
        validation.businessIndicator = t(
          'componentData.onboardZelle.businessApplicationIndicator'
        );
        valid = false;
      }

      if (
        !merchantCategoryCode ||
        (merchantCategoryCode &&
          merchantCategoryCode.toString().trim().length === 0)
      ) {
        validation.merchantCategoryCode = t(
          'componentData.onboardZelle.merchantCategoryCodeReq'
        );
        valid = false;
      }
      if (merchantCategoryCode && merchantCategoryCode.toString().length < 4) {
        validation.merchantCategoryCode = t(
          'componentData.onboardZelle.MCmerchantcategoryCode'
        );
        valid = false;
      }

      if (
        !cardAcceptorId ||
        (cardAcceptorId && cardAcceptorId.trim().length === 0)
      ) {
        validation.cardAcceptorId = t(
          'componentData.onboardZelle.cardAcceptorIdReq'
        );
        valid = false;
      }
      if (
        !customerContact ||
        (customerContact && customerContact.trim().length === 0)
      ) {
        validation.customerContact = t(
          'componentData.onboardZelle.customerContactReq'
        );
        valid = false;
      }

      if (!paymentType || (paymentType && paymentType.trim().length === 0)) {
        validation.paymentType = t('componentData.onboardZelle.paymentTypeReq');
        valid = false;
      }
      if (paymentType && paymentType.length < 3) {
        validation.paymentType = t('componentData.onboardZelle.paymentType');
        valid = false;
      }
    }

    if (
      !firstNameRiskScore ||
      (firstNameRiskScore && firstNameRiskScore.trim().length === 0)
    ) {
      validation.firstNameRiskScore = t(
        'componentData.onboardZelle.firstNameRiskScoreReq'
      );
      valid = false;
    }
    if (firstNameRiskScore && firstNameRiskScore.length < 2) {
      validation.firstNameRiskScore = t('componentData.onboardZelle.FName');
      valid = false;
    }

    if (
      !lastNameRiskScore ||
      (lastNameRiskScore && lastNameRiskScore.trim().length === 0)
    ) {
      validation.lastNameRiskScore = t(
        'componentData.onboardZelle.lastNameRiskScoreReq'
      );
      valid = false;
    }
    if (lastNameRiskScore && lastNameRiskScore.length < 2) {
      validation.lastNameRiskScore = t('componentData.onboardZelle.LName');
      valid = false;
    }

    if (
      !combinedRiskScore ||
      (combinedRiskScore && combinedRiskScore.trim().length === 0)
    ) {
      validation.combinedRiskScore = t(
        'componentData.onboardZelle.combinedRiskScoreReq'
      );
      valid = false;
    }
    if (combinedRiskScore && combinedRiskScore.length < 2) {
      validation.combinedRiskScore = t(
        'componentData.onboardZelle.CombinedRisk'
      );
      valid = false;
    }
    if (senderEmail && !reg.test(senderEmail)) {
      validation.senderEmail = t('componentData.onboardZelle.senderEmailError');
      valid = false;
    }
    if (
      !payeeAcceptanceExpiryDays ||
      (payeeAcceptanceExpiryDays &&
        payeeAcceptanceExpiryDays.toString().trim().length === 0)
    ) {
      validation.payeeAcceptanceExpiryDays = t(
        'componentData.onboardZelle.payeePaymentAcceptanceExpiryDaysReq'
      );
      valid = false;
    }
    if (payeeAcceptanceExpiryDays && payeeAcceptanceExpiryDays === 0) {
      validation.payeeAcceptanceExpiryDays = t(
        'componentData.onboardZelle.payeePaymentAcceptanceExpiryDaysError'
      );
      valid = false;
    }
    if (
      allowRegisterViaZella &&
      (!noOfDaysBeforeEnrolmentExpire || noOfDaysBeforeEnrolmentExpire < 1 || noOfDaysBeforeEnrolmentExpire > 14)
    ) {
      validation.noOfDaysBeforeEnrolmentExpire = t(
        'componentData.onboardZelle.noOfDaysBeforeEnrolmentExpireError'
      );
      valid = false;
    }

    this.setState({
      errorData: {
        ...validation,
      },
    });
    return valid;
  };

  onSubmit = (settlementAccountId) => {
    const { t } = this.props;
    const valid = this.saveZelleData();

    if (valid) {
      this.setState(
        {
          ...this.state,
          saveProcessing: true,
        },
        () => {
          const { debitNetwork } = this.state.cardData;
          if (debitNetwork !== 1) {
            this.setState(
              {
                ...this.state,
                cardData: {
                  ...this.state.cardData,
                  visaIdCode: null,
                  visaMerchantCategoryCode: null,
                  businessIndicator: null,
                  merchantCategoryCode: null,
                  cardAcceptorId: null,
                  customerContact: null,
                  paymentType: null,
                },
              },
              () => this.storeDataInDB(settlementAccountId)
            );
          } else {
            this.storeDataInDB(settlementAccountId);
          }
        }
      );
    } else {
      const { notification } = this.props;
      notification('error', t('componentData.onboardZelle.ValidationError'));
    }
  };

  storeDataInDB = (settlementAccountId) => {
    const { t, notification, closeModal } = this.props;
    const clientId = this.props.user.userData.portalProfileId || null;
    const cardStateData = trim(this.state.cardData);
    if (
      Boolean(this.props.getZelleData.data) &&
      Object.keys(this.props.getZelleData.data).length === 0
    ) {
      this.props
        .dispatch(settingAddZelle(cardStateData, clientId, settlementAccountId))
        .then((response) => {
          if (response && !response.error) {
            this.props.dispatch(fetchAllB2CAchList(clientId));
            notification('success', t('componentData.onboardZelle.infoSaved'));
            this.setState(
              {
                ...this.state,
                saveProcessing: false,
              },
              () => closeModal(true)
            );
          } else {
            notification('error', this.props.storedZelleData.error);
            this.setState({
              ...this.state,
              saveProcessing: false,
            });
            return false;
          }
        });
    } else {
      this.props
        .dispatch(
          settingUpdateZelle(cardStateData, clientId, settlementAccountId)
        )
        .then((response) => {
          if (response && !response.error) {
            this.props.dispatch(fetchAllB2CAchList(clientId));
            notification(
              'success',
              t('componentData.onboardZelle.infoUpdated')
            );
            this.setState(
              {
                ...this.state,
                saveProcessing: false,
              },
              () => closeModal(true)
            );
          } else {
            notification('error', this.props.storedZelleData.error);
            this.setState({
              ...this.state,
              saveProcessing: false,
            });
            return false;
          }
        });
    }
  };

  getCardData = () => {
    const { t, notification } = this.props;
    const clientId = this.props.user.userData.portalProfileId || null;

    this.props.dispatch(settingGetZelleData(clientId)).then((response) => {
      if (response && response.error) {
        notification(
          'error',
          (this.props.getZelleData && this.props.getZelleData.error) ||
            t('componentData.onboardZelle.somthingWrong')
        );
        return false;
      } else {
        this.passAPIDataOnTextField();
      }
    });
  };

  passAPIDataOnTextField = () => {
    if (
      Boolean(this.props.getZelleData.data) &&
      Object.keys(this.props.getZelleData.data).length > 0
    ) {
      this.setState(
        {
          ...this.state,
          cardData: {
            ...this.props.getZelleData.data,
          },
        },
        () => this.fetchSenderTypeList()
      );
    } else {
      const clientId = this.props.user.userData.portalProfileId || null
      getB2CGeneralSettingConfig(clientId).then((res)=>{
        this.setState({
          cardData:{
            ...this.state.cardData,
            noOfDaysBeforeEnrolmentExpire:res.data.noOfDaysBeforeEnrolmentExpire,
            payeeAcceptanceExpiryDays:res.data.payeePaymentAcceptanceExpiryDays
          }
        })
      })
      this.fetchSenderTypeList();
    }
  };

  fetchSenderTypeList = () => {
    const { t, notification } = this.props;
    this.props.dispatch(senderTypeList()).then((response) => {
      if (response && response.error) {
        notification(
          'error',
          (Boolean(this.props.senderTypeList) &&
            this.props.senderTypeList.error) ||
            t('componentData.onboardZelle.somthingWrong')
        );
        return false;
      } else {
        this.storeSenderList();
      }
    });
  };

  storeSenderList = () => {
    if (Boolean(this.props.senderTypeList)) {
      this.setState(
        {
          ...this.state,
          senderList: this.props.senderTypeList.data,
        },
        () => this.getProductTypeList()
      );
    }
  };

  getProductTypeList = () => {
    const { t, notification } = this.props;
    this.props.dispatch(senderProductType()).then((response) => {
      if (response && response.error) {
        notification(
          'error',
          (Boolean(this.props.productTypeList) &&
            this.props.productTypeList.error) ||
            t('componentData.onboardZelle.somthingWrong')
        );
        return false;
      } else {
        if (Boolean(this.props.productTypeList)) {
          this.setState({
            ...this.state,
            productTypeList: this.props.productTypeList.data,
          });
        }
      }
    });
  };

  onCancel = () => {
    this.props.onCancel(true);
  };

  render() {
    const { classes, t, canEdit,csc } = this.props;
    const {
      senderType,
      senderName,
      address_line1,
      address_line2,
      city,
      state,
      zipcode,
      countryCode,
      productType,
      visaIdCode,
      visaMerchantCategoryCode,
      businessIndicator,
      merchantCategoryCode,
      cardAcceptorId,
      customerContact,
      paymentType,
      firstNameRiskScore,
      lastNameRiskScore,
      combinedRiskScore,
      senderPhone,
      senderEmail,
      payeeAcceptanceExpiryDays,
      noOfDaysBeforeEnrolmentExpire,
    } = this.state.errorData;

    const { senderList, productTypeList, saveProcessing } = this.state;
    let selectedCountry = ''
    if(this.state.cardData && this.state.cardData.countryCode){
      selectedCountry = csc['countryList']?.find(item=>item.isoCode3 === this.state.cardData.countryCode)?.isoCode
    }
    return (
      <>
        <Box className={classes.popupInner}>
          <Grid container>
            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                select
                error={Boolean(senderType)}
                helperText={senderType}
                color="secondary"
                name={'senderType'}
                id={'senderType'}
                label={t('componentData.onboardZelle.senderType')}
                type={'select'}
                value={this.state.cardData.senderType}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                disabled={false}
                autoComplete="off"
                inputProps={{
                  maxLength: 50,
                  minLength: 1,
                  readOnly: !canEdit ? true : false,
                }}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              >
                {Boolean(senderList) &&
                  senderList.map((v, i) =>
                    v.sender_id === 4 || v.sender_id === 9 ? (
                      <MenuItem key={i} value={v.sender_description}>
                        {v.sender_description}
                      </MenuItem>
                    ) : (
                      <MenuItem disabled key={i} value={v.sender_description}>
                        {v.sender_description}
                      </MenuItem>
                    )
                  )}
              </TextField>
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                color="secondary"
                name={'senderName'}
                id={'senderName'}
                label={t('componentData.onboardZelle.senderName')}
                value={this.state.cardData.senderName}
                error={Boolean(senderName)}
                helperText={senderName}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  maxLength: 100,
                  minLength: 1,
                  readOnly: !canEdit ? true : false,
                }}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t('componentData.onboardZelle.address_line1')}
                variant="outlined"
                error={Boolean(address_line1)}
                helperText={address_line1}
                name="address_line1"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  minLength: 1,
                  maxLength: 50,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.address_line1}
                required
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t('componentData.onboardZelle.address_line2')}
                variant="outlined"
                error={Boolean(address_line2)}
                helperText={address_line2}
                name="address_line2"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  maxLength: 50,
                  minLength: 1,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.address_line2}
                required={false}
              />
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <CountryIso
                isoCode3={true}
                error={Boolean(countryCode)}
                helperText={countryCode}
                name={'countryCode'}
                label={t('componentData.onboardZelle.countryCode')}
                onChange={this.onChange}
                onBlur={this.saveZelleData}
                value={this.state.cardData.countryCode}
                autoComplete="off"
                inputProps={{
                  minLength: 2,
                  maxLength: 2,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />

              <StateIso
                error={Boolean(state)}
                helperText={state}
                onChange={this.onChange}
                onBlur={this.saveZelleData}
                selectedState={this.state.cardData.state || ''}
                selectedCountry={selectedCountry}
                label={t('componentData.onboardZelle.state')}
                name="state"
                value={this.state.cardData.state}
                autoComplete="off"
                inputProps={{
                  minLength: 1,
                  maxLength: 25,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <CityIso
                name="city"
                label={t('componentData.onboardZelle.city')}
                error={Boolean(city)}
                helperText={city}
                selectedState={this.state.cardData.state || ''}
                selectedCity={this.state.cardData.city || ''}
                selectedCountry={this.state.cardData.countryCode || ''}
                onChange={this.onChange}
                onBlur={this.saveZelleData}
                value={this.state.cardData.city}
                autoComplete="off"
                inputProps={{
                  minLength: 1,
                  maxLength: 25,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />

              <TextField
                id="outlined-basic"
                label={t('componentData.onboardZelle.zipcode')}
                variant="outlined"
                error={Boolean(zipcode)}
                helperText={zipcode}
                name="zipcode"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  minLength: 5,
                  maxLength: 10,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.zipcode}
                className={classes.zipCodeBox}
                required
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t('componentData.onboardZelle.senderPhone')}
                variant="outlined"
                error={Boolean(senderPhone)}
                helperText={senderPhone}
                name="senderPhone"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  minLength: 1,
                  maxLength: 13,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.senderPhone}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t('componentData.onboardZelle.senderEmail')}
                variant="outlined"
                error={Boolean(senderEmail)}
                helperText={senderEmail}
                name="senderEmail"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  minLength: 1,
                  maxLength: 255,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.senderEmail}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                select
                color="secondary"
                name={'productType'}
                id={'productType'}
                label={t('componentData.onboardZelle.productType')}
                type={'select'}
                error={Boolean(productType)}
                helperText={productType}
                value={this.state.cardData.productType?.toLowerCase()}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                disabled={false}
                autoComplete="off"
                inputProps={{
                  maxLength: 10,
                  readOnly: !canEdit ? true : false,
                }}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                required
              >
                {Boolean(productTypeList) &&
                  productTypeList.map((v, i) =>
                    v.product_description.toLowerCase() === 'b2c' ? (
                      <MenuItem key={i} value={v.product_description}>
                        {v.product_description}
                      </MenuItem>
                    ) : (
                      <MenuItem key={i} disabled value={v.product_description}>
                        {v.product_description}
                      </MenuItem>
                    )
                  )}
              </TextField>
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.cardData.debitNetwork}
                    onChange={(e) => this.onCheckboxChange(e, 'debitNetwork')}
                    name="debitNetwork"
                    color="primary"
                    disabled={!canEdit ? true : false}
                  />
                }
                label={t('componentData.onboardZelle.debitNetwork')}
                className={classes.DebitCheck}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.cardData.secondaryDDA}
                    onChange={(e) => this.onCheckboxChange(e, 'secondaryDDA')}
                    name="DDA"
                    color="primary"
                    disabled={true}
                  />
                }
                label={t('componentData.onboardZelle.secondaryDDA')}
                className={classes.DDACheck}
              />
            </Grid>

            {this.state.cardData.debitNetwork === 1 && (
              <>
                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t('componentData.onboardZelle.visaIdCode')}
                    variant="outlined"
                    error={Boolean(visaIdCode)}
                    helperText={visaIdCode}
                    name="visaIdCode"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{
                      minLength: 1,
                      maxLength: 15,
                      readOnly: !canEdit ? true : false,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.visaIdCode}
                    required
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t(
                      'componentData.onboardZelle.visaMerchantCategoryCode'
                    )}
                    variant="outlined"
                    error={Boolean(visaMerchantCategoryCode)}
                    helperText={visaMerchantCategoryCode}
                    name="visaMerchantCategoryCode"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{
                      minLength: 4,
                      maxLength: 4,
                      readOnly: !canEdit ? true : false,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.visaMerchantCategoryCode}
                    required
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t('componentData.onboardZelle.businessIndicator')}
                    variant="outlined"
                    error={Boolean(businessIndicator)}
                    helperText={businessIndicator}
                    name="businessIndicator"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{
                      minLength: 2,
                      maxLength: 2,
                      readOnly: !canEdit ? true : false,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.businessIndicator}
                    required
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t('componentData.onboardZelle.merchantCategoryCode')}
                    variant="outlined"
                    error={Boolean(merchantCategoryCode)}
                    helperText={merchantCategoryCode}
                    name="merchantCategoryCode"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    autoComplete="off"
                    inputProps={{
                      maxLength: 4,
                      minLength: 4,
                      readOnly: !canEdit ? true : false,
                    }}
                    value={this.state.cardData.merchantCategoryCode}
                    required
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t('componentData.onboardZelle.cardAcceptorId')}
                    variant="outlined"
                    error={Boolean(cardAcceptorId)}
                    helperText={cardAcceptorId}
                    name="cardAcceptorId"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{
                      maxLength: 15,
                      minLength: 1,
                      readOnly: !canEdit ? true : false,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.cardAcceptorId}
                    required
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t('componentData.onboardZelle.customerContact')}
                    variant="outlined"
                    error={Boolean(customerContact)}
                    helperText={customerContact}
                    name="customerContact"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{
                      maxLength: 13,
                      minLength: 1,
                      readOnly: !canEdit ? true : false,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.customerContact}
                    required
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t('componentData.onboardZelle.MCpaymentType')}
                    variant="outlined"
                    error={Boolean(paymentType)}
                    helperText={paymentType}
                    name="paymentType"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{
                      maxLength: 3,
                      minLength: 3,
                      readOnly: !canEdit ? true : false,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.paymentType}
                    required
                  />
                </Grid>
              </>
            )}

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t('componentData.onboardZelle.firstNameRiskScore')}
                variant="outlined"
                error={Boolean(firstNameRiskScore)}
                helperText={firstNameRiskScore}
                name="firstNameRiskScore"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  maxLength: 2,
                  minLength: 2,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.firstNameRiskScore}
                required
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t('componentData.onboardZelle.lastNameRiskScore')}
                variant="outlined"
                error={Boolean(lastNameRiskScore)}
                helperText={lastNameRiskScore}
                name="lastNameRiskScore"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{
                  maxLength: 2,
                  minLength: 2,
                  readOnly: !canEdit ? true : false,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.lastNameRiskScore}
                required
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t('componentData.onboardZelle.combinedRiskScore')}
                variant="outlined"
                error={Boolean(combinedRiskScore)}
                helperText={combinedRiskScore}
                name="combinedRiskScore"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{
                  maxLength: 2,
                  minLength: 2,
                  readOnly: !canEdit ? true : false,
                }}
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.combinedRiskScore}
                required
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t(
                  'componentData.onboardZelle.payeePaymentAcceptanceExpiryDays'
                )}
                variant="outlined"
                error={Boolean(payeeAcceptanceExpiryDays)}
                helperText={payeeAcceptanceExpiryDays}
                name="payeeAcceptanceExpiryDays"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{
                  maxLength: 2,
                  minLength: 1,
                  readOnly: !canEdit ? true : false,
                }}
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.payeeAcceptanceExpiryDays}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        arrow
                        title={t(
                          'componentData.onboardZelle.payeePaymentAcceptanceExpiryDaysInfo'
                        )}
                        placement="right"
                      >
                        <InfoOutlinedIcon fontSize={"small"} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6} className={classes.singleCheckBox}>
              <Grid container>
                <Grid item xs={10}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.cardData.isAuthorizeDebit}
                        onChange={(e) =>
                          this.onCheckboxChange(e, 'isAuthorizeDebit')
                        }
                        name="isAuthorizeDebit"
                        color="primary"
                      />
                    }
                    label={t('componentData.onboardZelle.isAuthorizeDebit')}
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  className={classes.tooltipInfoIcon}
                >
                  <Tooltip
                    arrow
                    title={t('componentData.onboardZelle.isAuthorizeDebitInfo')}
                    placement="right"
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6} className={classes.singleCheckBox}>
              <Grid container>
                <Grid item xs={10}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.cardData.allowRegisterViaZella}
                        name="allowRegisterViaZella"
                        color="primary"
                        onChange={(e) =>
                          this.onCheckboxChange(e, 'allowRegisterViaZella')
                        }
                      />
                    }
                    label={t(
                      'componentData.onboardZelle.allowRegisterViaZella'
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  className={classes.tooltipInfoIcon}
                >
                  <Tooltip
                    arrow
                    title={t(
                      'componentData.onboardZelle.allowRegisterViaZellaInfo'
                    )}
                    placement="right"
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6} className={classes.singleCheckBox}>
              <Grid container>
                <Grid item xs={10}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.cardData.zelleTokenFromConsumer}
                        onChange={(e) =>
                          this.onCheckboxChange(e, 'zelleTokenFromConsumer')
                        }
                        name="zelleTokenFromConsumer"
                        color="primary"
                      />
                    }
                    label={t(
                      'componentData.onboardZelle.zelleTokenFromConsumer'
                    )}
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  className={classes.tooltipInfoIcon}
                >
                  <Tooltip
                    arrow
                    title={t(
                      'componentData.onboardZelle.zelleTokenFromConsumerInfo'
                    )}
                    placement="right"
                  >
                    <InfoOutlinedIcon fontSize="small" />
                  </Tooltip>
                </Grid>
              </Grid>
            </Grid>
            {this.state.cardData.allowRegisterViaZella === 1 && (
              <Grid item xs={6} className={classes.inputBox}>
                <TextField
                  id="outlined-basic"
                  label={t(
                    'componentData.onboardZelle.noOfDaysBeforeEnrolmentExpire'
                  )}
                  variant="outlined"
                  error={Boolean(noOfDaysBeforeEnrolmentExpire)}
                  helperText={noOfDaysBeforeEnrolmentExpire}
                  name="noOfDaysBeforeEnrolmentExpire"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  autoComplete="off"
                  inputProps={{ maxLength: 2, minLength: 1 }}
                  value={this.state.cardData.noOfDaysBeforeEnrolmentExpire}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip
                          arrow
                          title={t(
                            'componentData.onboardZelle.noOfDaysBeforeEnrolmentExpireInfo'
                          )}
                          placement="right"
                        >
                          <InfoOutlinedIcon fontSize={"small"} />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
          </Grid>
            <SettlementAccount
              onCancel={this.onCancel}
              saveProcessing={saveProcessing}
              canEdit={canEdit}
              onSubmit={this.onSubmit}
              currencyCodes={this.props.currencyCodes}
              notification={this.props.notification}
              handleValidation={this.saveZelleData}
              selectedSettlementAccountId={
                this.state.cardData.settlementAccountId
              }
              alertText={t('componentData.paymentMethods.zelleSettlementAccountAlert')}
            />
        </Box>
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.clientConfig,
    ...state.b2cPayments,
    ...state.user,
    ...state.payment,
    ...state.csc
  }))(withStyles(styles)(ZelleDetail))
);
