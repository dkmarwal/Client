import React, { Component } from 'react';
import { Box, Grid, TextField } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import {
  addPushToCard,
  getPushToCardData,
  updatePushToCardData,
  fetchAllB2CAchList,
  fetchB2CChildBankAccountsList,
} from '~/redux/actions/B2C/payments';
import trim from 'deep-trim-node';
import MaskInput from '~/components/MaskInput';
import MenuItem from '@material-ui/core/MenuItem';
import styles from './styles';
import StateIso from '~/components/CSC/StateIso';
import CityIso from '~/components/CSC/CityIso';
import CountryIso from '~/components/CSC/CountryIso';
import PushToCardSettlementAccount from '~/modules/SettlementAccount/pushToCard';
import { fetchCurrencyCodes } from '~/redux/helpers/settings';

class B2CPushToCardDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: {
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
      errorData: {
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
      },
      currencyCodes: null,
      saveProcessing: false,
      clientSettlementAccountId: null,
      showParentList: false,
    };
  }
  fetchCurrencyCodesData = () => {
    fetchCurrencyCodes().then((res) => {
      this.setState({
        currencyCodes: res?.data?.rows ?? [],
      });
    });
  };

  fetchB2CClientData = async () => {
    const { clientId, setErrorText, setVariant, showParentData, t } =
      this.props;
    const bankDetailinfo = await this.props.dispatch(
      fetchAllB2CAchList(clientId, showParentData)
    );
    const { error } = bankDetailinfo;
    if (error) {
      setErrorText(t('componentData.bankDetail.failToLoad'));
      setVariant('error');
      return false;
    }
  };

  fetchB2CChildClientData = async () => {
    const { clientId, setErrorText, setVariant, t } = this.props;
    const bankDetailinfo = await this.props.dispatch(
      fetchB2CChildBankAccountsList(clientId, 'ACH')
    );
    const { error } = bankDetailinfo;
    if (error) {
      setErrorText(t('componentData.bankDetail.failToLoad'));
      setVariant('error');
      return false;
    }
  };
  async componentDidMount() {
    await this.getCardData();
    // this.fetchB2CClientData();
    this.fetchCurrencyCodesData();
  }

  getCardData = () => {
    const { showParentData, clientId, parentId, setErrorText, setVariant } =
      this.props;
    let Id = clientId;
    if (showParentData && parentId) {
      Id = parentId;
      this.fetchB2CClientData();
      this.setState({
        showParentList: true,
      });
    }
    if (
      this.props.getB2CPushCardData?.data &&
      this.props.getB2CPushCardData.data.length
    ) {
      this.setState({
        cardData: {
          ...this.state.cardData,
          id: this.props.getB2CPushCardData.data[0].id ?? null,
        },
        clientSettlementAccountId:
          this.props.getB2CPushCardData.data[0].settlementAccountId ?? null,
      });
      this.fetchB2CChildClientData();
    }

    this.props
      .dispatch(getPushToCardData(Id, showParentData))
      .then((response) => {
        if (response && response.error) {
          setErrorText(this.props.getB2CPushCardData.error);
          setVariant('error');
          return false;
        } else {
          this.passAPIDataOnTextField();
        }
      });
  };
  passAPIDataOnTextField = () => {
    if (
      Boolean(this.props.getB2CPushCardData.data) &&
      this.props.getB2CPushCardData.data.length > 0
    ) {
      const { showParentData } = this.props;
      let finalPushToCardDetails = this.props.getB2CPushCardData.data[0];
      if (showParentData) {
        const { id, ...restDetail } = this.props.getB2CPushCardData.data[0];
        finalPushToCardDetails = restDetail;
      }
      this.setState({
        ...this.state,
        cardData: {
          ...finalPushToCardDetails,
          id: this.state.cardData.id,
        },
      });
    }
  };

  handleNotification = (type, errorMsg) => {
    this.props.setVariant(type);
    this.props.setErrorText(errorMsg);
  };
  onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    let finalValue = value || null;
    if (name === 'senderPhone' && value) {
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
    }
    this.setState({
      cardData: {
        ...this.state.cardData,
        [name]: finalValue,
      },
    });
  };
  handleIntegerValueChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      cardData: {
        ...this.state.cardData,
        [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
      },
    });
  };

  handleBlur = (event) => {
    const { name, value } = event.target;
    this.setState({
      cardData: {
        ...this.state.cardData,
        [name]: value ? value.trim() : null,
      },
    });
  };

  onSubmit = (settlementAccountId) => {
    const valid = this.validation();
    this.setState({
      saveProcessing: true,
    });
    if (valid) {
      const { id } = this.state.cardData;
      const { dispatch, clientId, setErrorText, setVariant, paymentTypeId, t } =
        this.props;
      if (id) {
        dispatch(
          updatePushToCardData(
            trim(this.state.cardData),
            clientId,
            settlementAccountId
          )
        ).then((response) => {
          this.setState({
            saveProcessing: false,
            clientSettlementAccountId: settlementAccountId
          });
          if (!response || response.error) {
            setErrorText(
              response?.message ??
              t('componentData.pushToCardDetail.ErrorWhileSavingData')
            );
            setVariant('error');
            return false;
          }
          this.fetchB2CChildClientData();
          this.setState({
            cardData: {
              ...this.state.cardData,
              settlementAccountId: settlementAccountId,
            },
          });
          this.props.handleCollapse(paymentTypeId);
          setErrorText(
            response.message ||
            t('componentData.pushToCardDetail.PushToCardDataUpdated')
          );
          setVariant('success');
          this.setState({
            showParentList: false,
          });
        });
      } else {
        const { id, ...restBankDetail } = this.state.cardData;
        dispatch(
          addPushToCard(
            trim({ ...restBankDetail }),
            clientId,
            settlementAccountId
          )
        ).then(async (response) => {
          this.setState({
            saveProcessing: false,
            clientSettlementAccountId: settlementAccountId
          });
          if (response && !response.error) {
            const pushToCardData = await dispatch(getPushToCardData(clientId));
            this.props.handleCollapse(paymentTypeId);
            if (pushToCardData && pushToCardData.length) {
              this.setState({
                cardData: {
                  ...this.state.cardData,
                  id: pushToCardData[0].id,
                  settlementAccountId: settlementAccountId,
                },
              });
            }
            this.fetchB2CChildClientData();
            setErrorText(
              t('componentData.pushToCardDetail.PushToCardDataSaved')
            );
            setVariant('success');
            this.setState({
              showParentList: false,
            });
          } else {
            setErrorText(
              response?.message ??
              t('componentData.pushToCardDetail.ErrorWhileSavingData')
            );
            setVariant('error');
            return false;
          }
        });
      }
    } else {
      this.setState({
        saveProcessing: false,
      });
      this.props.setErrorText(this.props.t('componentData.commonErr.validationMsg'));
      this.props.setVariant('error');
      return false;
    }
  };

  validation = () => {
    let valid = true;
    let validation = {};
    const {
      masterMerchantCatCode,
      visaMerchantCatCode,
      masterCardAcceptorId,
      visaAcceptorId,
      senderZip,
      senderContactEmail,
    } = this.state.cardData;
    const { t } = this.props;
    const reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;

    if (masterMerchantCatCode && masterMerchantCatCode.length < 4) {
      validation.masterMerchantCatCode = t(
        'componentData.pushToCardDetail.masterMerchantCatCodeErr'
      );
      valid = false;
    } else if (
      masterMerchantCatCode &&
      masterMerchantCatCode.length === 4 &&
      masterMerchantCatCode.startsWith('0')
    ) {
      validation.masterMerchantCatCode = t(
        'componentData.pushToCardDetail.invalidMasterMerchantCatCode'
      );
      valid = false;
    }
    if (visaMerchantCatCode && visaMerchantCatCode.length < 4) {
      validation.visaMerchantCatCode = t(
        'componentData.pushToCardDetail.visaMerchantCatCodeErr'
      );
      valid = false;
    } else if (
      visaMerchantCatCode &&
      visaMerchantCatCode.length === 4 &&
      visaMerchantCatCode.startsWith('0')
    ) {
      validation.visaMerchantCatCode = t(
        'componentData.pushToCardDetail.invalidvisaMerchantCatCode'
      );
      valid = false;
    }
    if (masterCardAcceptorId && masterCardAcceptorId.length < 10) {
      validation.masterCardAcceptorId = t(
        'componentData.pushToCardDetail.masterCardAcceptorIdErr'
      );
      valid = false;
    }

    if (visaAcceptorId && visaAcceptorId.length < 10) {
      validation.visaAcceptorId = t(
        'componentData.pushToCardDetail.visaAcceptorIdErr'
      );
      valid = false;
    }
    if (senderZip && senderZip.length < 5) {
      validation.senderZip = t('componentData.pushToCardDetail.senderZipErr');
      valid = false;
    }
    if (senderContactEmail && !reg.test(senderContactEmail)) {
      validation.senderContactEmail = t(
        'componentData.pushToCardDetail.senderContactEmailErr'
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
  render() {
    const { csc, classes, t, clientId } = this.props;
    let selectedCountry = '';
    if (this.state.cardData.senderCountryCode) {
      selectedCountry = csc['countryList']?.find(
        (item) => item.isoCode3 === this.state.cardData.senderCountryCode
      )?.isoCode;
    }
    const {
      partnerId,
      senderAccount,
      senderFirstName,
      senderLastName,
      senderPhone,
      senderAddressLine1,
      senderCity,
      masterMerchantCatCode,
      visaAcceptorId,
      visaMerchantCatCode,
      masterCardAcceptorId,
      senderAddressLine2,
      senderCountryCode,
      senderState,
      senderZip,
      senderContactEmail,
      clientPrefix
    } = this.state.errorData;
    return (
      <Box className={classes.popupInner}>
        <Grid container>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.partnerId')}
              variant="outlined"
              error={Boolean(partnerId)}
              helperText={partnerId}
              name="partnerId"
              onChange={this.onChange}
              inputProps={{ maxLength: 32 }}
              value={this.state.cardData.partnerId}
              onBlur={this.handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <MaskInput
              inputProps={{ maxLength: 35 }}
              label={t('componentData.pushToCardDetail.senderAccount')}
              error={Boolean(senderAccount)}
              helperText={senderAccount}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={this.state.cardData.senderAccount}
              name="senderAccount"
              InputLabelProps={{
                shrink: true,
              }}
              getValue={(val) => {
                this.setState({
                  cardData: {
                    ...this.state.cardData,
                    senderAccount: val,
                  },
                });
              }}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              select
              color="secondary"
              name={'paymentType'}
              id={'paymentType'}
              label={t('componentData.pushToCardDetail.paymentType')}
              type={'select'}
              value={this.state.cardData.paymentType}
              onChange={this.onChange}
              onBlur={this.handleBlur}
              disabled={false}
              inputProps={{ maxLength: 3 }}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            >
              <MenuItem key={'0'} value={'BDB'}>
                {t('componentData.pushToCardDetail.paymentTypeOption')}
              </MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={6} className={classes.nameBox}>
            <TextField
              select
              color="secondary"
              name={'title'}
              id={'title'}
              label={t('componentData.pushToCardDetail.title')}
              type={'select'}
              value={this.state.cardData.title}
              onChange={this.onChange}
              onBlur={this.handleBlur}
              disabled={false}
              inputProps={{ maxLength: 3 }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            >
              <MenuItem key={'0'} value={'Mr.'}>
                {t('componentData.pushToCardDetail.Mr')}
              </MenuItem>
              <MenuItem key={'1'} value={'Ms.'}>
                {t('componentData.pushToCardDetail.Ms')}
              </MenuItem>
            </TextField>

            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.senderFirstName')}
              variant="outlined"
              error={Boolean(senderFirstName)}
              helperText={senderFirstName}
              name="senderFirstName"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              inputProps={{ minLength: 1, maxLength: 40 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.senderFirstName}
            />

            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.senderLastName')}
              variant="outlined"
              error={Boolean(senderLastName)}
              helperText={senderLastName}
              name="senderLastName"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              inputProps={{ minLength: 1, maxLength: 40 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.senderLastName}
            />
          </Grid>

          <Grid item xs={6} className={classes.multitBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.masterMerchantCatCode')}
              variant="outlined"
              error={Boolean(masterMerchantCatCode)}
              helperText={masterMerchantCatCode}
              name="masterMerchantCatCode"
              onChange={this.handleIntegerValueChange}
              onBlur={this.handleBlur}
              inputProps={{ maxLength: 4, minLength: 4 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.masterMerchantCatCode}
            />
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.visaMerchantCatCode')}
              variant="outlined"
              error={Boolean(visaMerchantCatCode)}
              helperText={visaMerchantCatCode}
              name="visaMerchantCatCode"
              onChange={this.handleIntegerValueChange}
              onBlur={this.handleBlur}
              inputProps={{ maxLength: 4, minLength: 4 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.visaMerchantCatCode}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.senderAddressLine1')}
              variant="outlined"
              error={Boolean(senderAddressLine1)}
              helperText={senderAddressLine1}
              name="senderAddressLine1"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              inputProps={{ minLength: 1, maxLength: 50 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.senderAddressLine1}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.masterCardAcceptorId')}
              variant="outlined"
              error={Boolean(masterCardAcceptorId)}
              helperText={masterCardAcceptorId}
              name="masterCardAcceptorId"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              inputProps={{ minLength: 10, maxLength: 15 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.masterCardAcceptorId}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.senderAddressLine2')}
              variant="outlined"
              error={Boolean(senderAddressLine2)}
              helperText={senderAddressLine2}
              name="senderAddressLine2"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              inputProps={{ minLength: 1, maxLength: 50 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.senderAddressLine2}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.visaAcceptorId')}
              variant="outlined"
              error={Boolean(visaAcceptorId)}
              helperText={visaAcceptorId}
              name="visaAcceptorId"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              inputProps={{ minLength: 10, maxLength: 15 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.visaAcceptorId}
            />
          </Grid>

          <Grid item xs={6} className={classes.multitBox}>
            <CountryIso
              isoCode3={true}
              error={Boolean(senderCountryCode)}
              helperText={senderCountryCode}
              name={'senderCountryCode'}
              label={t('componentData.pushToCardDetail.senderCountryCode')}
              onChange={this.onChange}
              onBlur={this.handleBlur}
              value={this.state.cardData.senderCountryCode}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <StateIso
              error={Boolean(senderState)}
              helperText={senderState}
              onChange={this.onChange}
              selectedState={this.state.cardData.senderState || ''}
              selectedCountry={selectedCountry}
              label={t('componentData.pushToCardDetail.senderState')}
              name="senderState"
              value={this.state.cardData.senderState}
              onBlur={this.handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.senderPhone')}
              variant="outlined"
              error={Boolean(senderPhone)}
              helperText={senderPhone}
              name="senderPhone"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              inputProps={{ maxLength: 13 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.senderPhone}
            />
          </Grid>

          <Grid item xs={6} className={classes.multitBox}>
            <CityIso
              name="senderCity"
              label={t('componentData.pushToCardDetail.senderCity')}
              error={Boolean(senderCity)}
              helperText={senderCity}
              selectedState={this.state.cardData.senderState || ''}
              selectedCity={this.state.cardData.senderCity || ''}
              selectedCountry={this.state.cardData.senderCountryCode || ''}
              onChange={this.onChange}
              onBlur={this.handleBlur}
              value={this.state.cardData.senderCity}
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.senderZip')}
              variant="outlined"
              error={Boolean(senderZip)}
              helperText={senderZip}
              name="senderZip"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              inputProps={{ minLength: 5, maxLength: 10 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.senderZip}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.senderContactEmail')}
              variant="outlined"
              error={Boolean(senderContactEmail)}
              helperText={senderContactEmail}
              name="senderContactEmail"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                maxLength: 13,
              }}
              value={this.state.cardData.senderContactEmail}
            />
          </Grid>

          <Grid item xs={6} className={classes.inputBox}>
            <TextField
              id="outlined-basic"
              label={t('componentData.pushToCardDetail.clientPrefix')}
              variant="outlined"
              error={Boolean(clientPrefix)}
              helperText={clientPrefix}
              name="clientPrefix"
              onChange={this.onChange}
              onBlur={this.handleBlur}
              inputProps={{ maxLength: 5 }}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.cardData.clientPrefix}
            />
          </Grid>
        </Grid>
        <PushToCardSettlementAccount
          onSubmit={this.onSubmit}
          currencyCodes={this.state.currencyCodes}
          notification={this.handleNotification}
          handleValidation={this.validation}
          selectedSettlementAccountId={this.state.cardData.settlementAccountId}
          clientId={clientId}
          clientSettlementAccountId={this.state.clientSettlementAccountId}
          achSettlementAccountsList={
            this.props.showParentData && this.state.showParentList
              ? this.props.achAccountList
              : this.props.achB2CClientAccountList
          }
        />
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.csc, ...state.b2cPayments }))(
    withStyles(styles)(B2CPushToCardDetail)
  )
);
