import React, { useState, useEffect } from "react";
import { Box, Grid, MenuItem, Button } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
import {
  updateBankInfo,
  createBankInfo,
  achProfilesInformation,
} from "~/redux/actions/payments";
import { connect } from "react-redux";
import { getTransactionType } from "~/redux/actions/payments";
import MultiCheckBoxGroup from "~/components/Forms/MultiCheckBoxGroup";
import {
  getClientBankInfo,
  getCurrencyList,
  getClientTransactionType,
} from "~/redux/actions/payments";
import MaskInput from "~/components/MaskInput";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    margin: 0,
  },
}));

const BankDetail = ({
  clientId,
  parentId,
  isHIPAA,
  paymentType,
  showParentData,
  dispatch, t,
  setErrorText,
  setVariant,
  handleCollapse
}) => {

  const [AccounttransactionType, setTransactionTypes] = useState([]);  
  const [currencyList, setCurrencyList] = useState([]);
  const [bankDetailInfo, setBankDetailInfo] = useState({
    data: {
      accountId: "",
      accountName: null,
      accountNumber: null,
      accountTypeId: "",
      routingCode: null,
      AchProfileId: "",
      companyName: null,
      immediateOrigin: "",
      immediateOriginName: "",
      immediateDestination: "",
      immediateDestinationName: "",
      companyIdentification: null,
      companyEntryDescription: null,
      companyDiscretionaryData: null,
      originatingDFIIdentification: null,
      originatingDFIDiscretionaryData: null,
      cardAccountId: "",
      bankName: "",
      bankAddress1: "",
      bankAddress2: "",
      bankCity: "",
      bankStateRegion: "",
      bankZipPostal: "",
      bankCountryIso: null,
      BankContact: "",
      bankContactEmail: "",
      bankPhone: "",
      bankPhoneExt: "",
      accountClassification: "",
      currencyCode: null,
      currency: "",
      paymentMethodId: "",
      acctClassId: "",
      transactionType: [],
      formatingFlags: "",
      originatorShortName: "",
      GS02: null,
      GS03: null,
      type: paymentType,
    },
    error: {
      accountId: "",
      accountName: "",
      accountNumber: "",
      accountTypeId: "",
      routingCode: "",
      AchProfileId: "",
      companyName: "",
      companyIdentification: "",
      companyEntryDescription: "",
      companyDiscretionaryData: "",
      originatingDFIIdentification: "",
      originatingDFIDiscretionaryData: "",
      cardAccountId: "",
      bankName: "",
      bankAddress1: "",
      bankAddress2: "",
      bankCity: "",
      bankStateRegion: "",
      bankZipPostal: "",
      bankCountryIso: "",
      BankContact: "",
      bankContactEmail: "",
      bankPhone: "",
      bankPhoneExt: "",
      accountClassification: "",
      currencyCode: "",
      currency: "",
      paymentMethodId: "",
      acctClassId: "",
      formatingFlags: "",
      transactionType: [],
      originatorShortName: "",
      GS02: "",
      GS03: "",
      type: paymentType,
    },
  });

  useEffect(() => {
    if (showParentData) {
      initBankInformation(parentId, true);
    } else {
      initBankInformation(clientId);
    }
    fetchTransactionType();
    fetchCurrencyList();
  }, [showParentData]);

  const classes = useStyles();
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
    transactionType,
    bankCountryIso,
    currencyCode,    
    GS02,
    GS03,
    type,
  } = data;

  const initBankInformation = async (clientId, isParent) => {
    let bankDetail = {};
    const bankDetailinfo = await getClientBankInfo({
      clientId,
      paymentType: paymentType,
    });
    let { data, error } = bankDetailinfo;
    if (error) {
      setErrorText(t('componentData.bankDetail.failToLoad'));
      setVariant("error");
      return false;
    }
    bankDetail = data.rows && data.rows.length > 0 ? data.rows[0] : {};

    let clientBankDetail = bankDetail || {};
    if (isParent) {
      const { accountId, ...restDetails } = bankDetail;
      clientBankDetail = restDetails;
    }

    let transactionTypeArr = [];
    let achImmediateInfoArr = [];
    const transactionType = await getClientTransactionType(
      clientId,
      paymentType
    );
    const achImmediateInfo = await achProfilesInformation();
    if (achImmediateInfo && achImmediateInfo.data) {
      let { data = [] } = achImmediateInfo.data;
      achImmediateInfoArr = data || [];      
    }
    if (transactionType && transactionType.data) {
      let { data } = transactionType.data;
      transactionTypeArr = data.rows || [];
    }

    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        ...clientBankDetail,
        ...achImmediateInfoArr,
        transactionType: transactionTypeArr,
      },
    });
  };

  const fetchCurrencyList = async () => {
    let currencyList = [];
    let resp = await getCurrencyList();
    const { data, error } = resp;
    if (!error) {
      currencyList = data.rows ? data.rows : [];
    } else {
      // show server error for the client Bank details
    }
    setCurrencyList(currencyList);
  };

  const removeArrElement = (ele, arr) => {
    const index = arr.indexOf(ele);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };

  const onChangeTransactionType = (event) => {
    const {checked } = event.target;
    let { value } = event.target;
    const newTransactionType = checked
      ? [...(bankDetailInfo.data.transactionType || []), parseInt(value)]
      : removeArrElement(parseInt(value), transactionType);
    setBankDetailInfo({
      ...bankDetailInfo,
      data: {
        ...bankDetailInfo.data,
        transactionType: newTransactionType,
        bankCountryIso: null,
        currencyCode: null,
      },
    });
  };

  const onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;

    if (name === "currencyCode" || name === "currency") {
      value = value.toString().length === 0 ? null : value.toString();
    }
    setBankDetailInfo({
      ...bankDetailInfo,
      data: { ...bankDetailInfo.data, [name]: Boolean(value) && value?.length === 0 ? null : value },
    });
  };

  const onSubmit = () => {
    const valid = validation();

    if (valid) {
      const data = {
        accountId,
        accountName,
        accountNumber,
        routingCode,
        currencyCode,
        companyName,
        companyIdentification,
        companyEntryDescription,
        companyDiscretionaryData,
        originatingDFIIdentification,
        originatingDFIDiscretionaryData,
        bankCountryIso,
        transactionType,
        isHippaInformation: { GS02, GS03 },
        type,
      };

      if (accountId) {
        dispatch(
          updateBankInfo({
            clientId: clientId,
            paymentType: data.type,
            bankDetail: data,
          })
        ).then((response) => {
          if (!response) {
            setErrorText(t('componentData.bankDetail.ErrorWhileSavingData'));
            setVariant("error");
            return false;
          }
          setErrorText(t('componentData.bankDetail.BankAccountDataSaved'));
          setVariant("success");
          handleCollapse(paymentType)
        });
      } else {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          createBankInfo({
            clientId: clientId,
            paymentType: data.type,
            bankDetail: restBankDetail,
          })
        ).then((accountId) => {
          if (accountId) {
            setBankDetailInfo({
              ...bankDetailInfo,
              data: {
                ...bankDetailInfo.data,
                accountId: accountId,
              },
            });
            setErrorText(t('componentData.bankDetail.BankAccountDataSaved'));
            setVariant("success");
            handleCollapse(paymentType)
          } else {
            setErrorText(t('componentData.bankDetail.ErrorWhileSavingData'));
            setVariant("error");
            return false;
          }
        });
      }
    }
  };

  const fetchTransactionType = async () => {
    const transactionTypeData = await getTransactionType();
    const { data, error, message } = await transactionTypeData;
    const AccountTransactionTypes =
      data &&
      data.rows.filter(({ paymentCode }) => {
        return paymentCode === paymentType;
      });
    if (!error) {
      setTransactionTypes(AccountTransactionTypes);
    } else {
      // report Error Message here for not getting grouplist;
      setTransactionTypes({ ...transactionType, error: message });
    }
  };
  const ACHOptions = AccounttransactionType.map(
    ({ currency, transactionTypeId, bankCountryIso, paymentCode }) => ({
      name: currency,
      value: transactionTypeId,
      label: `${bankCountryIso} ${currency}`,
    })
  );

  const currencyListOptions = () => {
    if (
      Array.isArray(transactionType) &&
      Array.isArray(AccounttransactionType)
    ) {
      const selectedCurrencyList = AccounttransactionType.filter(
        ({ transactionTypeId, bankCountryIso: bankIso }) =>
          transactionType.includes(transactionTypeId) &&
          bankCountryIso === bankIso
      ).map(({ currency }) => currency);

      const newCurrencyList = currencyList.filter(
        ({ isoNumeric, isoCode, name }) =>
          selectedCurrencyList.includes(isoCode)
      );
      return newCurrencyList;
    }
    return [];
  };

  const bankCountryISOptions = () => {
    if (
      Array.isArray(transactionType) &&
      Array.isArray(AccounttransactionType)
    ) {
      const selectedCountryISOList = AccounttransactionType.filter(
        ({ transactionTypeId }) => transactionType.includes(transactionTypeId)
      ).map(({ bankCountryIso }) => bankCountryIso);

      return [...new Set(selectedCountryISOList)];
    }
    return [];
  };

  const validation = () => {
    let valid = true;
    let validation = {};
    if (!accountNumber || accountNumber.length === 0) {
      validation["accountNumber"] =
        t('componentData.bankDetail.AccountNumberRequired');
      valid = false;
    }
    if (accountNumber && accountNumber.length > 17) {
      validation["accountNumber"] =
        t('componentData.bankDetail.acNumMaxLen');
      valid = false;
    }
    if (accountNumber && accountNumber.length < 6) {
      validation["accountNumber"] =
        t('componentData.bankDetail.acNumMinLen');
      valid = false;
    }
    if (accountName && accountName.length > 50) {
      validation["accountName"] =
        t('componentData.bankDetail.AccountNameMaxLen');
      valid = false;
    }
    if (routingCode && routingCode.length !== 9) {
      validation["routingCode"] =
        t('componentData.bankDetail.RoutingCodeLen');
      valid = false;
    }
    if (companyName && companyName.length > 16) {
      validation["companyName"] =
        t('componentData.bankDetail.CompanyNameMaxLen');
      valid = false;
    }
    if (companyIdentification && companyIdentification.length !== 10) {
      validation["companyIdentification"] =
        t('componentData.bankDetail.CompanyIdentificationLen');
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length < 2) {
      validation["company Entry Description"] =
        t('componentData.bankDetail.CompanyEntryMinLen');
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length > 10) {
      validation["company EntryDescription"] =
        t('componentData.bankDetail.CompanyEntryMaxLen');
      valid = false;
    }
    if (companyDiscretionaryData && companyDiscretionaryData.length > 20) {
      validation["companyDiscretionaryData"] =
        t('componentData.bankDetail.CompanyDiscretionaryDataMaxLen');
      valid = false;
    }
    if (
      originatingDFIIdentification &&
      originatingDFIIdentification.length !== 8
    ) {
      validation["originatingDFIIdentification"] =
        t('componentData.bankDetail.originatingDFIIdentificationLen');
      valid = false;
    }
    if (
      originatingDFIDiscretionaryData &&
      originatingDFIDiscretionaryData.length > 2
    ) {
      validation["originatingDFIDiscretionaryData"] =
        t('componentData.bankDetail.OriginatingDFIDiscretionaryDataMinLen');
      valid = false;
    }
    if (bankCountryIso && bankCountryIso.length > 20) {
      validation["bankCountryIso"] =
        t('componentData.bankDetail.RoutingMaxLen');
      valid = false;
    }
    if (currencyCode && currencyCode.length > 3) {
      validation["currencyCode"] =
        t('componentData.bankDetail.BankCountryIsoMaxLen');
      valid = false;
    }
    if (isHIPAA && GS03 !== null && GS03.toString().trim().length !== 2) {
      validation["GS03"] = true;
      valid = false;
    }

    if (isHIPAA && GS02 !== null && GS02.toString().trim().length !== 2) {
      validation["GS02"] = true;
      valid = false;
    }
    setBankDetailInfo({
      ...bankDetailInfo,
      error: {...validation }
    });
    return valid;
  };

  return (
    <Box p={2}>
      <Grid container>
        <Grid container item>
          <Grid item xs={12} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <MultiCheckBoxGroup
                key={"transactionType"}
                label={t('componentData.bankDetail.TransactionType')}
                options={ACHOptions}
                onChangeCheckBox={onChangeTransactionType}
                selectedCheckbox={transactionType || []}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.AccountName')}
                error={Boolean(error.accountName)}
                helperText={error.accountName}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                color="secondary"
                value={accountName || ""}
                name="accountName"
                onChange={onChange}
                inputProps={{
                  maxLength: 50,
                  minLength: 1,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.BankRoutingCode')}
                error={Boolean(error.routingCode)}
                helperText={error.routingCode}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                color="secondary"
                value={routingCode || ""}
                name="routingCode"
                onChange={onChange}
                inputProps={{
                  maxLength: 9,
                  minLength: 9,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <MaskInput
                label={t('componentData.bankDetail.BankAccountNumber')}
                error={Boolean(error.accountNumber)}
                helperText={error.accountNumber}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                color="secondary"
                value={accountNumber || ""}
                name="accountNumber"
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
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                select
                label={t('componentData.bankDetail.BankCountryISO')}
                error={Boolean(error.bankCountryIso)}
                helperText={error.bankCountryIso}
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                color="secondary"
                value={bankCountryIso || ""}
                name="bankCountryIso"
                onChange={onChange}
                inputProps={{
                  maxLength: 3,
                }}
              >
                <MenuItem key={""} value={""}>
                  {t('componentData.bankDetail.Select')}
                </MenuItem>
                {bankCountryISOptions().map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                select
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                variant="outlined"
                label={t('componentData.bankDetail.Currency')}
                error={Boolean(error.currencyCode)}
                helperText={error.currencyCode}
                value={currencyCode || ""}
                name="currencyCode"
                onChange={onChange}
                inputProps={{ maxLength: 3 }}
              >
                <MenuItem key={""} value={""}>
                  {t('componentData.bankDetail.Select')}
                </MenuItem>
                {currencyListOptions().map(({ isoNumeric, isoCode, name }) => (
                  <MenuItem key={isoCode} value={isoCode}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.ImmediateOrigin')}
                disabled={true}
                fullWidth={true}
                autoComplete="off"
                color="secondary"
                variant="outlined"
                value={immediateOrigin || ""}
                inputProps={{
                  maxLength: 10,
                  minLength: 10,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.ImmediateOriginName')}
                disabled={true}
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                variant="outlined"
                value={immediateOriginName || ""}
                inputProps={{
                  maxLength: 23,
                  minLength: 1,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.ImmediateDestination')}
                disabled={true}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={immediateDestination || ""}
                inputProps={{
                  maxLength: 9,
                  minLength: 9,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.ImmediateDestinationName')}
                disabled={true}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={immediateDestinationName || ""}
                inputProps={{
                  maxLength: 23,
                  minLength: 1,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.CompanyName')}
                error={Boolean(error.companyName)}
                helperText={error.companyName}
                fullWidth={true}
                autoComplete="off"
                color="secondary"
                variant="outlined"
                value={companyName || ""}
                name="companyName"
                onChange={onChange}
                inputProps={{
                  maxLength: 16,
                  minLength: 1,
                }}                
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.CompanyIdentificationNumber')}
                error={Boolean(error.companyIdentification)}
                helperText={error.companyIdentification}
                fullWidth={true}
                autoComplete="off"
                color="secondary"
                variant="outlined"
                value={companyIdentification || ""}
                name="companyIdentification"
                onChange={onChange}
                inputProps={{
                  maxLength: 10,
                  minLength: 10,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2} style={{ minWidth: "30%" }}>
              <TextField
                label={t('componentData.bankDetail.CompanyEntryDescription')}
                error={Boolean(error.companyEntryDescription)}
                helperText={error.companyEntryDescription}
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                variant="outlined"
                value={companyEntryDescription || ""}
                name="companyEntryDescription"
                onChange={onChange}
                inputProps={{
                  maxLength: 10,
                  minLength: 2,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.CompanyDiscretionaryData')}
                error={Boolean(error.companyDiscretionaryData)}
                helperText={error.companyDiscretionaryData}
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                variant="outlined"
                value={companyDiscretionaryData || ""}
                name="companyDiscretionaryData"
                onChange={onChange}
                inputProps={{
                  maxLength: 20,
                  minLength: 1,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.OriginatingDFIIdentification')}
                error={Boolean(error.originatingDFIIdentification)}
                helperText={error.originatingDFIIdentification}
                fullWidth={true}
                autoComplete="off"
                color="secondary"
                variant="outlined"
                value={originatingDFIIdentification || ""}
                name="originatingDFIIdentification"
                onChange={onChange}
                inputProps={{
                  maxLength: 8,
                  minLength: 8,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.bankDetail.OriginatingDFIDiscretionaryData')}
                error={Boolean(error.originatingDFIDiscretionaryData)}
                helperText={error.originatingDFIDiscretionaryData}
                fullWidth={true}
                autoComplete="off"
                color="secondary"
                variant="outlined"
                value={originatingDFIDiscretionaryData || ""}
                name="originatingDFIDiscretionaryData"
                onChange={onChange}
                inputProps={{
                  maxLength: 2,
                  minLength: 1,
                }}
              />
            </Box>
          </Grid>
          {Boolean(isHIPAA) && (
            <Grid container item xs={12}>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    label={t('componentData.bankDetail.GS02')}
                    error={Boolean(error.GS02)}
                    helperText={error.GS02}
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    variant="outlined"
                    value={GS02 || ""}
                    name="GS02"
                    onChange={onChange}
                    inputProps={{
                      maxLength: 15,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    label={t('componentData.bankDetail.GS03')}
                    error={Boolean(error.GS03)}
                    helperText={error.GS03}
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    variant="outlined"
                    value={GS03 || ""}
                    name="GS03"
                    onChange={onChange}
                    inputProps={{
                      maxLength: 15,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid container item xs={11} justify="center">
          <Button
            className={classes.button}
            type="submit"
            fullWidth={false}
            variant="contained"
            color="primary"
            onClick={()=>onSubmit()}
          >
            {t('componentData.bankDetail.Save')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withTranslation()(connect()(BankDetail));
