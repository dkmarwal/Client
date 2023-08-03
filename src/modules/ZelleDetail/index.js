import React, { Component } from "react";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import {
  Grid,
  Box,
  MenuItem,
  Tooltip,
  InputAdornment,
} from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import { connect } from "react-redux";
import {
  getZelleData,
  senderTypeList,
  senderProductType,
  addZelle,
  updateZelle,
  fetchAllB2CAchList,
  fetchB2CChildBankAccountsList,
} from "~/redux/actions/B2C/payments";
import { CountryIso, CityIso, StateIso } from "~/components/CSC";
import trim from "deep-trim-node";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { withTranslation } from "react-i18next";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import ZelleSettlementAccount from "~/modules/SettlementAccount/zelle";
import { fetchCurrencyCodes } from "~/redux/helpers/settings";
import { getB2CGeneralSettingConfig } from "~/redux/helpers/settings";

class ZelleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderList: [],
      productTypeList: [],
      hasSaveBtnClicked: false,
      bankAccounts: [],
      currencyCodes: null,
      cardData: {
        clientId: null,
        senderType: this.props.t("componentData.onboardZelle.BigBusiness"),
        senderName: null,
        address_line1: null,
        address_line2: null,
        city: null,
        state: null,
        zipcode: null,
        countryCode: null,
        productType: "b2c",
        debitNetwork: 1,
        secondaryDDA: 0,
        visaIdCode: null,
        visaMerchantCategoryCode: null,
        businessIndicator: null,
        merchantCategoryCode: null,
        cardAcceptorId: null,
        customerContact: null,
        paymentType: null,
        firstNameRiskScore: "00",
        lastNameRiskScore: "00",
        combinedRiskScore: "00",
        senderPhone: null,
        senderEmail: null,
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
        senderPhone: null,
        senderEmail: null,
        payeeAcceptanceExpiryDays: null,
        noOfDaysBeforeEnrolmentExpire: null,
      },
      clientSettlementAccountId: null,
      showParentList: false,
    };
  }

  fetchCurrencyCodesData = () => {
    fetchCurrencyCodes().then((res) => {
      this.setState({ currencyCodes: res.data.rows });
    });
  };

  fetchB2CClientData = async () => {
    const bankDetailinfo = await this.props.dispatch(
      fetchAllB2CAchList(this.props.clientId, this.props.showParentData)
    );
    const { error } = bankDetailinfo;
    if (error) {
      this.props.setErrorText(
        this.props.t("componentData.bankDetail.failToLoad")
      );
      this.props.setVariant("error");
      return false;
    }
  };

  fetchB2CChildClientData = async () => {
    const bankDetailinfo = await this.props.dispatch(
      fetchB2CChildBankAccountsList(this.props.clientId, "ACH")
    );
    const { error } = bankDetailinfo;
    if (error) {
      this.props.setErrorText(
        this.props.t("componentData.bankDetail.failToLoad")
      );
      this.props.setVariant("error");
      return false;
    }
  };

  async componentDidMount() {
    await this.getCardData();
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
      this.props.getZelleData?.data &&
      Object.keys(this.props.getZelleData.data).length
    ) {
      this.setState({
        cardData: {
          ...this.state.cardData,
          zelle_id: this.props.getZelleData.data?.zelle_id ?? null,
        },
        clientSettlementAccountId:
          this.props.getZelleData.data?.settlementAccountId ?? null,
      });
      this.fetchB2CChildClientData();
    }

    this.props.dispatch(getZelleData(Id, showParentData)).then((response) => {
      if (response && response.error) {
        setErrorText(this.props.getZelleData.error);
        setVariant("error");
        return false;
      } else {
        this.passAPIDataOnTextField();
      }
    });
  };

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
      name === "firstNameRiskScore" ||
      name === "lastNameRiskScore" ||
      name === "combinedRiskScore"
    ) {
      if (numeric.test(event.currentTarget.value)) {
        this.setState({
          cardData: {
            ...this.state.cardData,
            [name]: event.target.value,
          },
        });
      }
    } else if (name === "senderPhone" && event.target.value) {
      const { value } = event.target;
      let finalValue = value || null;
      const intiVal = value.replace(/[^+{1}0-9]/g, "");
      const firstOccuranceIndex = intiVal.search(/\+/) + 1;
      let resultStr = "";
      if (firstOccuranceIndex === 1) {
        resultStr =
          intiVal.substr(0, firstOccuranceIndex) +
          intiVal.slice(firstOccuranceIndex).replace(/\+/g, "");
      } else {
        resultStr = intiVal.slice(0).replace(/\+/g, "");
      }
      finalValue = resultStr;
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: finalValue,
        },
      });
    } else if (name === "countryCode") {
      const { value } = event.target;
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: value,
          zipcode: "",
        },
      });
      this.saveZelleData();
    } else if (
      name === "visaMerchantCategoryCode" ||
      name === "merchantCategoryCode" ||
      name === "payeeAcceptanceExpiryDays"
    ) {
      const { value } = event.target;
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: value.replace(/[^0-9]/g, ""),
        },
      });
    } else {
      const { value } = event.target;
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
    this.setState({
      cardData: {
        ...this.state.cardData,
        [name]: value?.trim() ?? value,
      },
    });
  };

  saveZelleData = () => {
    let valid = true;
    const validation = {};
    const { t } = this.props;
    const {
      visaMerchantCategoryCode,
      businessIndicator,
      merchantCategoryCode,
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

    if (visaMerchantCategoryCode && visaMerchantCategoryCode.length < 4) {
      validation.visaMerchantCategoryCode = t(
        "componentData.onboardZelle.merchantcategoryCode"
      );
      valid = false;
    }
    if (businessIndicator && businessIndicator.length < 2) {
      validation.businessIndicator = t(
        "componentData.onboardZelle.businessApplicationIndicator"
      );
      valid = false;
    }
    if (merchantCategoryCode && merchantCategoryCode.length < 4) {
      validation.merchantCategoryCode = t(
        "componentData.onboardZelle.MCmerchantcategoryCode"
      );
      valid = false;
    }
    if (paymentType && paymentType.length < 3) {
      validation.paymentType = t("componentData.onboardZelle.paymentType");
      valid = false;
    }
    if (firstNameRiskScore && firstNameRiskScore.length < 2) {
      validation.firstNameRiskScore = t("componentData.onboardZelle.FName");
      valid = false;
    }
    if (lastNameRiskScore && lastNameRiskScore.length < 2) {
      validation.lastNameRiskScore = t("componentData.onboardZelle.LName");
      valid = false;
    }
    if (combinedRiskScore && combinedRiskScore.length < 2) {
      validation.combinedRiskScore = t(
        "componentData.onboardZelle.CombinedRisk"
      );
      valid = false;
    }
    if (senderEmail && !reg.test(senderEmail)) {
      validation.senderEmail = t("componentData.onboardZelle.senderEmailError");
      valid = false;
    }
    if (payeeAcceptanceExpiryDays && payeeAcceptanceExpiryDays === 0) {
      validation.payeeAcceptanceExpiryDays = t(
        "componentData.onboardZelle.payeePaymentAcceptanceExpiryDaysError"
      );
      valid = false;
    }
    if (
      allowRegisterViaZella &&
      (!noOfDaysBeforeEnrolmentExpire ||
        noOfDaysBeforeEnrolmentExpire < 1 ||
        noOfDaysBeforeEnrolmentExpire > 14)
    ) {
      validation.noOfDaysBeforeEnrolmentExpire = t(
        "componentData.onboardZelle.noOfDaysBeforeEnrolmentExpireError"
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
    const { t, setErrorText, setVariant } = this.props;
    const valid = this.saveZelleData();
    if (valid) {
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
    } else {
      setErrorText(t("componentData.onboardZelle.ValidationError"));
      setVariant("error");
    }
  };

  storeDataInDB = (settlementAccountId) => {
    const {
      t,
      clientId,
      setErrorText,
      setVariant,
      handleCollapse,
      paymentTypeId,
    } = this.props;
    const cardStateData = trim(this.state.cardData);
    if (cardStateData.zelle_id) {
      this.props
        .dispatch(updateZelle(cardStateData, clientId, settlementAccountId))
        .then((response) => {
          if (response && !response.error) {
            this.fetchB2CChildClientData();
            this.setState({
              cardData: {
                ...cardStateData,
                settlementAccountId: settlementAccountId,
              },
              showParentList: false,
              clientSettlementAccountId: settlementAccountId,
            });
            setVariant("success");
            setErrorText(t("componentData.onboardZelle.infoUpdated"));
            handleCollapse(paymentTypeId);
          } else {
            setVariant("error");
            setErrorText(this.props.storedZelleData.error);
            return false;
          }
        });
    } else {
      this.props
        .dispatch(addZelle(cardStateData, clientId, settlementAccountId))
        .then((response) => {
          if (response && !response.error) {
            this.setState({
              ...this.state,
              hasSaveBtnClicked: true,
              cardData: {
                ...cardStateData,
                zelle_id: response.zelle_id ?? null,
                settlementAccountId: settlementAccountId,
              },
              showParentList: false,
              clientSettlementAccountId: settlementAccountId,
            });
            this.fetchB2CChildClientData();
            setVariant("success");
            setErrorText(t("componentData.onboardZelle.infoSaved"));
            handleCollapse(paymentTypeId);
          } else {
            setVariant("error");
            setErrorText(this.props.storedZelleData.error);
            return false;
          }
        });
    }
  };

  handleNotification = (type, errorMsg) => {
    this.props.setVariant(type);
    this.props.setErrorText(errorMsg);
  };

  passAPIDataOnTextField = () => {
    if (
      Boolean(this.props.getZelleData.data) &&
      Object.keys(this.props.getZelleData.data).length > 0
    ) {
      const { showParentData } = this.props;
      let finalZelleDetails = this.props.getZelleData.data;
      if (showParentData) {
        const { ...restDetail } = this.props.getZelleData.data;
        finalZelleDetails = restDetail;
      }
      this.setState(
        {
          ...this.state,
          cardData: {
            ...finalZelleDetails,
            zelle_id: this.state.cardData.zelle_id,
          },
        },
        () => this.fetchSenderTypeList()
      );
    } else {
      getB2CGeneralSettingConfig(this.props.clientId).then((res) => {
        if (res?.data) {
          this.setState({
            cardData: {
              ...this.state.cardData,
              noOfDaysBeforeEnrolmentExpire:
                res.data.noOfDaysBeforeEnrolmentExpire,
              payeeAcceptanceExpiryDays:
                res.data.payeePaymentAcceptanceExpiryDays,
            },
          });
        }
      });
      this.fetchSenderTypeList();
    }
  };

  fetchSenderTypeList = () => {
    const { setErrorText, setVariant } = this.props;
    this.props.dispatch(senderTypeList()).then((response) => {
      if (response && response.error) {
        setErrorText(this.props.senderTypeList.error);
        setVariant("error");
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
    const { setErrorText, setVariant } = this.props;
    this.props.dispatch(senderProductType()).then((response) => {
      if (response && response.error) {
        setErrorText(this.props.productTypeList.error);
        setVariant("error");
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

  render() {
    const { classes, t, csc } = this.props;
    const {
      senderName,
      address_line1,
      address_line2,
      city,
      state,
      zipcode,
      countryCode,
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
      senderPhone,
      payeeAcceptanceExpiryDays,
      noOfDaysBeforeEnrolmentExpire,
    } = this.state.errorData;

    const { senderList, productTypeList } = this.state;
    let selectedCountry = "";
    if (this.state.cardData && this.state.cardData.countryCode) {
      selectedCountry = csc["countryList"]?.find(
        (item) => item.isoCode3 === this.state.cardData.countryCode
      )?.isoCode;
    }

    return (
      <>
        <Box className={classes.popupInner}>
          <Grid container>
            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                select
                color="secondary"
                name={"senderType"}
                id={"senderType"}
                label={t("componentData.onboardZelle.senderType")}
                type={"select"}
                value={this.state.cardData.senderType}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                disabled={false}
                autoComplete="off"
                inputProps={{ maxLength: 50, minLength: 1 }}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
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
                name={"senderName"}
                id={"senderName"}
                label={t("componentData.onboardZelle.senderName")}
                value={this.state.cardData.senderName}
                error={Boolean(senderName)}
                helperText={senderName}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ maxLength: 100, minLength: 1 }}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t("componentData.onboardZelle.address_line1")}
                variant="outlined"
                error={Boolean(address_line1)}
                helperText={address_line1}
                name="address_line1"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ minLength: 1, maxLength: 50 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.address_line1}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t("componentData.onboardZelle.address_line2")}
                variant="outlined"
                error={Boolean(address_line2)}
                helperText={address_line2}
                name="address_line2"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ maxLength: 50, minLength: 1 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.address_line2}
              />
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <CountryIso
                isoCode3={true}
                error={Boolean(countryCode)}
                helperText={countryCode}
                name={"countryCode"}
                label={t("componentData.onboardZelle.countryCode")}
                onChange={this.onChange}
                onBlur={this.saveZelleData}
                value={this.state.cardData.countryCode}
                autoComplete="off"
                inputProps={{ minLength: 2, maxLength: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <StateIso
                error={Boolean(state)}
                helperText={state}
                onChange={this.onChange}
                onBlur={this.saveZelleData}
                selectedState={this.state.cardData.state || ""}
                selectedCountry={selectedCountry}
                label={t("componentData.onboardZelle.state")}
                name="state"
                value={this.state.cardData.state}
                autoComplete="off"
                inputProps={{ minLength: 1, maxLength: 25 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={6} className={classes.multitBox}>
              <CityIso
                name="city"
                label={t("componentData.onboardZelle.city")}
                error={Boolean(city)}
                helperText={city}
                selectedState={this.state.cardData.state || ""}
                selectedCity={this.state.cardData.city || ""}
                selectedCountry={this.state.cardData.countryCode || ""}
                onChange={this.onChange}
                onBlur={this.saveZelleData}
                value={this.state.cardData.city}
                autoComplete="off"
                inputProps={{ minLength: 1, maxLength: 25 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                id="outlined-basic"
                label={t("componentData.onboardZelle.zipcode")}
                variant="outlined"
                error={Boolean(zipcode)}
                helperText={zipcode}
                name="zipcode"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ minLength: 5, maxLength: 10 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.zipcode}
                className={classes.zipCodeBox}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t("componentData.onboardZelle.senderPhone")}
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
                label={t("componentData.onboardZelle.senderEmail")}
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
                name={"productType"}
                id={"productType"}
                label={t("componentData.onboardZelle.productType")}
                type={"select"}
                value={this.state.cardData.productType?.toLowerCase()}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                disabled={false}
                autoComplete="off"
                inputProps={{ maxLength: 10 }}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              >
                {Boolean(productTypeList) &&
                  productTypeList.map((v, i) =>
                    v.product_description.toLowerCase() === "b2c" ? (
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
                    onChange={(e) => this.onCheckboxChange(e, "debitNetwork")}
                    name="debitNetwork"
                    color="primary"
                  />
                }
                label={t("componentData.onboardZelle.debitNetwork")}
                className={classes.DebitCheck}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.cardData.secondaryDDA}
                    onChange={(e) => this.onCheckboxChange(e, "secondaryDDA")}
                    name="DDA"
                    color="primary"
                    disabled={true}
                  />
                }
                label={t("componentData.onboardZelle.secondaryDDA")}
                className={classes.DDACheck}
              />
            </Grid>

            {this.state.cardData.debitNetwork === 1 && (
              <>
                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t("componentData.onboardZelle.visaIdCode")}
                    variant="outlined"
                    error={Boolean(visaIdCode)}
                    helperText={visaIdCode}
                    name="visaIdCode"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ minLength: 1, maxLength: 15 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.visaIdCode}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t(
                      "componentData.onboardZelle.visaMerchantCategoryCode"
                    )}
                    variant="outlined"
                    error={Boolean(visaMerchantCategoryCode)}
                    helperText={visaMerchantCategoryCode}
                    name="visaMerchantCategoryCode"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ minLength: 4, maxLength: 4 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.visaMerchantCategoryCode}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t("componentData.onboardZelle.businessIndicator")}
                    variant="outlined"
                    error={Boolean(businessIndicator)}
                    helperText={businessIndicator}
                    name="businessIndicator"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ minLength: 2, maxLength: 2 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.businessIndicator}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t("componentData.onboardZelle.merchantCategoryCode")}
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
                    inputProps={{ maxLength: 4, minLength: 4 }}
                    value={this.state.cardData.merchantCategoryCode}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t("componentData.onboardZelle.cardAcceptorId")}
                    variant="outlined"
                    error={Boolean(cardAcceptorId)}
                    helperText={cardAcceptorId}
                    name="cardAcceptorId"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ maxLength: 15, minLength: 1 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.cardAcceptorId}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t("componentData.onboardZelle.customerContact")}
                    variant="outlined"
                    error={Boolean(customerContact)}
                    helperText={customerContact}
                    name="customerContact"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ maxLength: 13, minLength: 1 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.customerContact}
                  />
                </Grid>

                <Grid item xs={6} className={classes.inputBox}>
                  <TextField
                    id="outlined-basic"
                    label={t("componentData.onboardZelle.MCpaymentType")}
                    variant="outlined"
                    error={Boolean(paymentType)}
                    helperText={paymentType}
                    name="paymentType"
                    onChange={this.onChange}
                    onBlur={this.handleBlur}
                    autoComplete="off"
                    inputProps={{ maxLength: 3, minLength: 3 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.cardData.paymentType}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t("componentData.onboardZelle.firstNameRiskScore")}
                variant="outlined"
                error={Boolean(firstNameRiskScore)}
                helperText={firstNameRiskScore}
                name="firstNameRiskScore"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ maxLength: 2, minLength: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.firstNameRiskScore}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t("componentData.onboardZelle.lastNameRiskScore")}
                variant="outlined"
                error={Boolean(lastNameRiskScore)}
                helperText={lastNameRiskScore}
                name="lastNameRiskScore"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                autoComplete="off"
                inputProps={{ maxLength: 2, minLength: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.lastNameRiskScore}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t("componentData.onboardZelle.combinedRiskScore")}
                variant="outlined"
                error={Boolean(combinedRiskScore)}
                helperText={combinedRiskScore}
                name="combinedRiskScore"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ maxLength: 2, minLength: 2 }}
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.combinedRiskScore}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                id="outlined-basic"
                label={t(
                  "componentData.onboardZelle.payeePaymentAcceptanceExpiryDays"
                )}
                variant="outlined"
                error={Boolean(payeeAcceptanceExpiryDays)}
                helperText={payeeAcceptanceExpiryDays}
                name="payeeAcceptanceExpiryDays"
                onChange={this.onChange}
                onBlur={this.handleBlur}
                inputProps={{ maxLength: 2, minLength: 1 }}
                autoComplete="off"
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.cardData.payeeAcceptanceExpiryDays}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        arrow
                        title={t(
                          "componentData.onboardZelle.payeePaymentAcceptanceExpiryDaysInfo"
                        )}
                        placement="right"
                      >
                        <InfoOutlinedIcon fontSize="small" />
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
                          this.onCheckboxChange(e, "isAuthorizeDebit")
                        }
                        name="isAuthorizeDebit"
                        color="primary"
                      />
                    }
                    label={t("componentData.onboardZelle.isAuthorizeDebit")}
                  />
                </Grid>
                <Grid item xs={2} className={classes.tooltipInfoIcon}>
                  <Tooltip
                    arrow
                    title={t("componentData.onboardZelle.isAuthorizeDebitInfo")}
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
                          this.onCheckboxChange(e, "allowRegisterViaZella")
                        }
                      />
                    }
                    label={t(
                      "componentData.onboardZelle.allowRegisterViaZella"
                    )}
                  />
                </Grid>
                <Grid item xs={2} className={classes.tooltipInfoIcon}>
                  <Tooltip
                    arrow
                    title={t(
                      "componentData.onboardZelle.allowRegisterViaZellaInfo"
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
                          this.onCheckboxChange(e, "zelleTokenFromConsumer")
                        }
                        name="zelleTokenFromConsumer"
                        color="primary"
                      />
                    }
                    label={t(
                      "componentData.onboardZelle.zelleTokenFromConsumer"
                    )}
                  />
                </Grid>
                <Grid item xs={2} className={classes.tooltipInfoIcon}>
                  <Tooltip
                    arrow
                    title={t(
                      "componentData.onboardZelle.zelleTokenFromConsumerInfo"
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
                    "componentData.onboardZelle.noOfDaysBeforeEnrolmentExpire"
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
                            "componentData.onboardZelle.noOfDaysBeforeEnrolmentExpireInfo"
                          )}
                          placement="right"
                        >
                          <InfoOutlinedIcon fontSize="small" />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}
          </Grid>
          <ZelleSettlementAccount
            onSubmit={this.onSubmit}
            currencyCodes={this.state.currencyCodes}
            notification={this.handleNotification}
            handleValidation={this.saveZelleData}
            selectedSettlementAccountId={
              this.state.cardData.settlementAccountId
            }
            achSettlementAccountsList={
              this.props.showParentData && this.state.showParentList
                ? this.props.achAccountList
                : this.props.achB2CClientAccountList
            }
            clientId={this.props.clientId}
            clientSettlementAccountId={this.state.clientSettlementAccountId}
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
    ...state.csc,
  }))(withStyles(styles)(ZelleDetail))
);
