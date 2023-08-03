import React, { useState, useEffect } from "react";
import { Box, Grid, MenuItem, Button } from "@material-ui/core";

import TextField from "~/components/Forms/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import MultiCheckBoxGroup from "~/components/Forms/MultiCheckBoxGroup";
import { getTransactionType } from "~/redux/actions/payments";
import MaskInput from "~/components/MaskInput";
import {
  updateVirtualCardInfo,
  createVirtualCardInfo,
  getVirtualCardInfo,
  getCurrencyList,
  getClientTransactionType,
  savePaymentCardtype,
  getCardSelectionType,
} from "~/redux/actions/payments";
import MasterCardDetail from "~/modules/MasterCardDetail";
import { CardType, PayerTypes } from "~/config/entityTypes";

import { withTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    margin: 0,
  },
  recommendedLabel: {
    background: "#33C3A4",
    color: "#fff",
    padding: "2px 5px",
    borderRadius: "3px",
    fontSize: "12px",
  },
}));

const VirtualCardDetail = ({
  clientId,
  isHIPAA,
  parentId,
  showParentData,
  paymentType,
  dispatch,
  t,
  setErrorText,
  setVariant,
  handleCollapse,
  payerTypeId,
}) => {
  const [AccounttransactionType, setTransactionTypes] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [mcCardType, setmcCardType] = useState(2);
  const [virtualCardInfo, setVirtualCardInfo] = useState({
    data: {
      cardAccountDetailsId: "",
      accountId: "",
      clientId: "",
      currencyCode: null,
      bankCountryIso: null,
      currencyIntCode: null,
      purchaseTypeId: "",
      issuerId: null,
      version: null,
      commonName: null,
      companyIdentification: null,
      companyName: null,
      companyEntryDescription: null,
      cardAlias: null,
      validFor: "",
      bankRoutingCode: null,
      cardTypeId: "",
      accountNumber: null,
      supplierName: null,
      GS02: null,
      GS03: null,
      transactionType: [],
    },
    error: {
      cardAccountDetailsId: "",
      accountId: "",
      clientId: "",
      currencyCode: "",
      bankCountryIso: "",
      currencyIntCode: "",
      purchaseTypeId: "",
      issuerId: "",
      version: "",
      commonName: "",
      companyIdentification: "",
      companyName: "",
      companyEntryDescription: null,
      cardAlias: "",
      validFor: "",
      bankRoutingCode: "",
      cpex: "",
      eps: "",
      cardTypeId: "",
      accountNumber: "",
      supplierName: "",
      GS02: "",
      GS03: "",
      transactionType: [],
    },
  });

  useEffect(() => {
    if (showParentData) {
      initVirtualCardInformation(parentId, true);
    } else {
      initVirtualCardInformation(clientId);
    }
    fetchCurrencyList();
    fetchTransactionType();
    fetchSelectedCardType();
  }, [showParentData]);

  const { data, error } = virtualCardInfo;
  const {
    cardAccountDetailsId,
    accountId,
    currencyCode,
    bankCountryIso,
    currencyIntCode,
    issuerId,
    version,
    commonName,
    companyIdentification,
    companyName,
    companyEntryDescription,
    cardAlias,
    bankRoutingCode,
    accountNumber,
    supplierName,
    GS02,
    GS03,
    transactionType,
  } = data;

  const initVirtualCardInformation = async (clientId, isParent) => {
    const transactionType = await getClientTransactionType(
      clientId,
      paymentType
    );
    const {
      data: transactionTypeArr,
      error: typeError,
      message: errorMessage,
    } = transactionType.data;

    let virtualCardDetail = {};
    const VCDetailInfo = await getVirtualCardInfo({ clientId });
    const { data, error } = VCDetailInfo;
    if (error) {
      setErrorText(t("componentData.virtualCardDetail.errMsg"));
      setVariant("error");
      return false;
    }
    virtualCardDetail = data.rows && data.rows.length > 0 ? data.rows[0] : {};

    let clientVirtualData = virtualCardDetail || {};
    if (isParent) {
      const { cardAccountDetailsId, ...restDetails } = virtualCardDetail;
      clientVirtualData = restDetails;
    }
    setVirtualCardInfo({
      ...virtualCardInfo,
      data: {
        ...virtualCardInfo.data,
        ...clientVirtualData,
        transactionType: transactionTypeArr.rows || [],
      },
    });
  };

  const fetchSelectedCardType = async () => {
    const cardType = await getCardSelectionType(clientId);
    if (cardType.data.length) {
      setmcCardType(cardType.data[0].cardTypeId);
    }
  };

  const fetchCurrencyList = async () => {
    let currencyList = [];
    const resp = await getCurrencyList();
    const { data, error } = resp;
    if (!error) {
      currencyList = data.rows;
    } else {
      // show server error for the client Bank details
    }
    setCurrencyList(currencyList);
  };

  const onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    value = value && value.replace(/\s/g, "") === "" ? null : value;

    if (name === "currencyIntCode") {
      value = value?.toString();
    }
    if (name === "currencyCode") {
      const currencyIntCode = getCurrencyCode(value);
      setVirtualCardInfo({
        ...virtualCardInfo,
        data: {
          ...virtualCardInfo.data,
          [name]: value || null,
          currencyIntCode,
        },
      });
    } else {
      setVirtualCardInfo({
        ...virtualCardInfo,
        data: {
          ...virtualCardInfo.data,
          [name]: value || null,
        },
      });
    }
  };

  const getCurrencyCode = (currencyCode) => {
    const currency = currencyList.find(
      ({ isoCode }) => currencyCode === isoCode
    );
    return currency ? currency.isoNumeric : "";
  };

  const removeArrElement = (ele, arr) => {
    const index = arr.indexOf(ele);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };

  const onChangeTransactionType = (event) => {
    const { checked, value } = event.target;
    const newTransactionType = checked
      ? [...(virtualCardInfo.data.transactionType || []), parseInt(value)]
      : removeArrElement(parseInt(value), transactionType);
    setVirtualCardInfo({
      ...virtualCardInfo,
      data: {
        ...virtualCardInfo.data,
        transactionType: newTransactionType,
        bankCountryIso: null,
        currencyCode: null,
      },
    });
  };

  const onSubmit = () => {
    const valid = validation();

    if (valid) {
      const data = {
        cardAccountDetailsId,
        accountId,
        clientId,
        currencyCode,
        bankCountryIso,
        currencyIntCode,
        issuerId,
        version,
        commonName,
        companyIdentification,
        companyName,
        companyEntryDescription,
        cardAlias,
        bankRoutingCode,
        accountNumber,
        isHippaInformation: { GS02, GS03 },
        supplierName,
        transactionType,
      };

      if (cardAccountDetailsId) {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          updateVirtualCardInfo({
            clientId: clientId,
            virtualCardDetail: restBankDetail,
          })
        ).then((response) => {
          if (!response) {
            setErrorText(t("componentData.virtualCardDetail.errOnSave"));
            setVariant("error");
            return false;
          }
          setErrorText(t("componentData.virtualCardDetail.DataUpdated"));
          setVariant("success");
          handleCollapse(paymentType);
          dispatch(
            savePaymentCardtype({
              clientId: clientId,
              cardTypeId: CardType.MSC1,
            })
          );
        });
      } else {
        const { cardAccountDetailsId, accountId, ...restBankDetail } = data;
        dispatch(
          createVirtualCardInfo({
            clientId: clientId,
            virtualCardDetail: restBankDetail,
          })
        ).then((cardAccountDetailsId) => {
          if (cardAccountDetailsId) {
            setVirtualCardInfo({
              ...virtualCardInfo,
              data: {
                ...virtualCardInfo.data,
                cardAccountDetailsId,
              },
            });
            setErrorText(t("componentData.virtualCardDetail.DataSaved"));
            setVariant("success");
            handleCollapse(paymentType);
            dispatch(
              savePaymentCardtype({
                clientId: clientId,
                cardTypeId: CardType.MSC1,
              })
            );
          } else {
            setErrorText(t("componentData.virtualCardDetail.errOnSave"));
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

  const VCAOptions = Array.isArray(AccounttransactionType)
    ? AccounttransactionType.map(
        ({ currency, transactionTypeId, bankCountryIso, paymentCode }) => ({
          name: currency,
          value: transactionTypeId,
          label: `${bankCountryIso} ${currency}`,
        })
      )
    : [];

  const validation = () => {
    let valid = true;
    const validation = {};
    if (!accountNumber || accountNumber.toString().trim().length === 0) {
      validation["accountNumber"] = t("componentData.virtualCardDetail.accReq");
      valid = false;
    }
    if (accountNumber && accountNumber.trim().length < 6) {
      validation["accountNumber"] = t(
        "componentData.virtualCardDetail.accMinLen"
      );
      valid = false;
    }
    if (accountNumber && accountNumber.trim().length > 17) {
      validation["accountNumber"] = t(
        "componentData.virtualCardDetail.accMaxLen"
      );
      valid = false;
    }

    if (supplierName && supplierName.length > 50) {
      validation["supplierName"] = t(
        "componentData.virtualCardDetail.payeeNameMaxL"
      );
      valid = false;
    }
    if (supplierName !== null && supplierName.toString().trim().length < 2) {
      validation["supplierName"] = t(
        "componentData.virtualCardDetail.payeeNameMinL"
      );
      valid = false;
    }
    if (bankRoutingCode && bankRoutingCode.length !== 9) {
      validation["bankRoutingCode"] = t(
        "componentData.virtualCardDetail.bankRoutingL"
      );
      valid = false;
    }
    if (bankCountryIso && bankCountryIso.length !== 2) {
      validation["bankCountryIso"] = t(
        "componentData.virtualCardDetail.BankCountryIsoLen"
      );
      valid = false;
    }
    if (cardAlias && cardAlias.length < 2) {
      validation["cardAlias"] = t(
        "componentData.virtualCardDetail.cardAliasMinL"
      );
      valid = false;
    }
    if (cardAlias && cardAlias.length > 50) {
      validation["cardAlias"] = t(
        "componentData.virtualCardDetail.cardAliasMAxL"
      );
      valid = false;
    }
    if (currencyCode && currencyCode.length !== 3) {
      validation["currencyCode"] = t(
        "componentData.virtualCardDetail.CurrencyCodeLen"
      );
      valid = false;
    }
    if (currencyIntCode && currencyIntCode.toString().length !== 3) {
      validation["currencyIntCode"] = t(
        "componentData.virtualCardDetail.CurrencyIntCodeLen"
      );
      valid = false;
    }
    if (issuerId && issuerId.length > 1) {
      validation["issuerId"] = t("componentData.virtualCardDetail.IssuerIdLen");
      valid = false;
    }
    if (companyName && companyName.length > 17) {
      validation["companyName"] = t(
        "componentData.virtualCardDetail.CompanyNameMaxL"
      );
      valid = false;
    }
    if (companyName !== null && companyName.toString().trim().length < 2) {
      validation["companyName"] = t(
        "componentData.virtualCardDetail.companyNameMinL"
      );
      valid = false;
    }

    if (companyIdentification && companyIdentification.length !== 10) {
      validation["companyIdentification"] = t(
        "componentData.virtualCardDetail.CompanyIdentification"
      );
      valid = false;
    }

    if (companyEntryDescription && companyEntryDescription.length < 2) {
      validation["companyEntryDescription"] = t(
        "componentData.virtualCardDetail.DescriptionMinL"
      );
      valid = false;
    }
    if (companyEntryDescription && companyEntryDescription.length > 20) {
      validation["companyEntryDescription"] = t(
        "componentData.virtualCardDetail.DescriptionMaxL"
      );
      valid = false;
    }
    if (version && version.length < 2) {
      validation["version"] = t("componentData.virtualCardDetail.VersionMinL");
      valid = false;
    }
    if (version && version.length > 5) {
      validation["version"] = t("componentData.virtualCardDetail.VersionMaxL");
      valid = false;
    }
    if (commonName && commonName.length < 2) {
      validation["commonName"] = t(
        "componentData.virtualCardDetail.commonNameMinL"
      );
      valid = false;
    }

    if (commonName && commonName.length > 50) {
      validation["commonName"] = t(
        "componentData.virtualCardDetail.commonNameMaxL"
      );
      valid = false;
    }

    setVirtualCardInfo({
      ...virtualCardInfo,
      error: { ...validation },
    });
    return valid;
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

      return currencyList.filter(({ isoNumeric, isoCode, name }) =>
        selectedCurrencyList.includes(isoCode)
      );
    }
    return [];
  };

  const classes = useStyles();
  return (
    <Box px={4} py={2} style={{ backgroundColor: "#fff" }}>
      <Grid container>
        {payerTypeId != PayerTypes.PMTX ? (
          <MasterCardDetail clientId={clientId} />
        ) : null}

        {payerTypeId == PayerTypes.PMTX ? (
          <>
            <Grid container item>
              <Grid item xs={12} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <MultiCheckBoxGroup
                    key={"transactionType"}
                    label={t("componentData.virtualCardDetail.TransactionType")}
                    options={VCAOptions}
                    onChangeCheckBox={onChangeTransactionType}
                    selectedCheckbox={transactionType || []}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    label={t("componentData.virtualCardDetail.PayeeName")}
                    error={Boolean(error.supplierName)}
                    helperText={error.supplierName}
                    fullWidth={true}
                    autoComplete="off"
                    variant="outlined"
                    color="secondary"
                    value={supplierName || ""}
                    name="supplierName"
                    onChange={onChange}
                    inputProps={{
                      maxLength: 50,
                      minLength: 2,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <MaskInput
                    label={t(
                      "componentData.virtualCardDetail.BankAccountNumber"
                    )}
                    error={Boolean(error.accountNumber)}
                    helperText={error.accountNumber}
                    fullWidth={true}
                    autoComplete="off"
                    color="secondary"
                    variant="outlined"
                    value={accountNumber || ""}
                    name="accountNumber"
                    inputProps={{
                      maxLength: 17,
                      minLength: 6,
                    }}
                    getValue={(val) => {
                      setVirtualCardInfo({
                        ...virtualCardInfo,
                        data: {
                          ...virtualCardInfo.data,
                          accountNumber: val,
                        },
                      });
                    }}
                    required
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    label={t("componentData.virtualCardDetail.BankRoutingCode")}
                    error={Boolean(error.bankRoutingCode)}
                    helperText={error.bankRoutingCode}
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    variant="outlined"
                    value={bankRoutingCode || ""}
                    name="bankRoutingCode"
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
                  <TextField
                    select
                    label={t("componentData.virtualCardDetail.BankCountryISO")}
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
                      maxLength: 2,
                      minLength: 2,
                    }}
                  >
                    <MenuItem key={""} value={""}>
                      {t("componentData.virtualCardDetail.Select")}
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
                    label={t(
                      "componentData.virtualCardDetail.VirtualCardAlias"
                    )}
                    error={Boolean(error.cardAlias)}
                    helperText={error.cardAlias}
                    fullWidth={true}
                    autoComplete="off"
                    color="secondary"
                    variant="outlined"
                    value={cardAlias || ""}
                    name="cardAlias"
                    inputProps={{
                      maxLength: 50,
                      minLength: 2,
                    }}
                    onChange={onChange}
                  />
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
                    label={t("componentData.virtualCardDetail.Currency")}
                    error={Boolean(error.currencyCode)}
                    helperText={error.currencyCode}
                    value={currencyCode || ""}
                    name="currencyCode"
                    onChange={onChange}
                    inputProps={{
                      maxLength: 3,
                    }}
                  >
                    <MenuItem key={""} value={""}>
                      {t("componentData.virtualCardDetail.Select")}
                    </MenuItem>
                    {currencyListOptions().map(
                      ({ isoNumeric, isoCode, name }) => (
                        <MenuItem key={isoCode} value={isoCode}>
                          {name}
                        </MenuItem>
                      )
                    )}
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
                    label={t("componentData.virtualCardDetail.CurrencyCode")}
                    error={Boolean(error.currencyIntCode)}
                    helperText={error.currencyIntCode}
                    value={currencyIntCode || ""}
                    name="currencyIntCode"
                    onChange={onChange}
                  >
                    <MenuItem key={""} value={""}>
                      {t("componentData.virtualCardDetail.Select")}
                    </MenuItem>
                    {currencyList.map(({ isoNumeric, isoCode, name }) => (
                      <MenuItem key={isoNumeric} value={isoNumeric}>
                        {isoNumeric}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    label={t("componentData.virtualCardDetail.IssuerID")}
                    error={Boolean(error.issuerId)}
                    helperText={error.issuerId}
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    variant="outlined"
                    value={issuerId || ""}
                    name="issuerId"
                    onChange={onChange}
                    inputProps={{
                      maxLength: 1,
                      minLength: 1,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    label={t("componentData.virtualCardDetail.CompanyName")}
                    error={Boolean(error.companyName)}
                    helperText={error.companyName}
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    variant="outlined"
                    value={companyName || ""}
                    name="companyName"
                    onChange={onChange}
                    inputProps={{
                      maxLength: 17,
                      minLength: 2,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    label={t(
                      "componentData.virtualCardDetail.CompanyIdentificationNumber"
                    )}
                    error={Boolean(error.companyIdentification)}
                    helperText={error.companyIdentification}
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
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
                <Box mx={1} my={2}>
                  <TextField
                    label={t(
                      "componentData.virtualCardDetail.CompanyEntryDescription"
                    )}
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
                      maxLength: 20,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    label={t("componentData.virtualCardDetail.VersionNumber")}
                    error={Boolean(error.version)}
                    helperText={error.version}
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    variant="outlined"
                    value={version || ""}
                    name="version"
                    onChange={onChange}
                    inputProps={{
                      maxLength: 5,
                      minLength: 2,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className={classes.gridItem}>
                <Box mx={1} my={2}>
                  <TextField
                    label={t("componentData.virtualCardDetail.CommonName")}
                    error={Boolean(error.commonName)}
                    helperText={error.commonName}
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    variant="outlined"
                    value={commonName || ""}
                    name="commonName"
                    onChange={onChange}
                    inputProps={{
                      maxLength: 50,
                      minLength: 2,
                    }}
                  />
                </Box>
              </Grid>
              {Boolean(isHIPAA) && (
                <Grid container item xs={12}>
                  <Grid item xs={12} sm={6} className={classes.gridItem}>
                    <Box mx={1} my={2}>
                      <TextField
                        label={t("componentData.virtualCardDetail.GS02")}
                        error={Boolean(error.GS02)}
                        helperText={error.GS02}
                        fullWidth={true}
                        autoComplete="off"
                        color="secondary"
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
                        label={t("componentData.virtualCardDetail.GS03")}
                        error={Boolean(error.GS03)}
                        helperText={error.GS03}
                        fullWidth={true}
                        autoComplete="off"
                        color="secondary"
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
                variant="contained"
                color="primary"
                onClick={() => onSubmit()}
              >
                {t("componentData.virtualCardDetail.Save")}
              </Button>
            </Grid>
          </>
        ) : null}
        {/* </RadioAccordion> */}
      </Grid>
    </Box>
  );
};

export default withTranslation()(connect()(VirtualCardDetail));
