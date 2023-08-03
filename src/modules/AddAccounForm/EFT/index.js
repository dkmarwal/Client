import React, { Fragment } from "react";
import {
  TextField,  
  Grid,  
  Box,
  Button,  
  CircularProgress,
  Table,  
  TableRow,
  TableBody,  
  TableSortLabel,  
  Checkbox,
  MenuItem,
  FormControlLabel,  
  withStyles,
} from "@material-ui/core";
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledTableFooter,
} from "~/components/StyledTable";
import { connect } from "react-redux";
import MaskInput from "~/components/MaskInput";
import { accessRights } from "~/config/accessRights";
import { withTranslation } from 'react-i18next';
import trim from 'deep-trim-node';

const styles = (theme) => ({
  cancelButton: {
    border: `1px solid ${theme.provider}`,
    display: "inline-block",
  },
  button: {
    display: "inline-block",
  },
});

class EFT extends React.Component {
  state = {
    savingDetails: false,
    fileProcesssingStatus: "",
    fileProcessing: false,
    fileErrorFields: null,
    immediateDestination: "",
    immediateOriginName: "",
    currencyCode: "",
    accountName: "",
    accountNumber: "",
    routingCode: "",
    companyName: "",
    companyIdentification: "",
    companyEntryDescription: "",
    companyDiscretionaryData: "",
    originatingDFIIdentification: "",
    originatingDFIDiscretionaryData: "",
    bankCountryIso: "",
    type: "EFT",
    isHippa: "",
    transactionType: [],
    GS02: "",
    GS03: "",
    immediateOrigin: "",
    immediateDestinationName: "",
    isDefault: 0,
    validation: {},
  };

  validateData = () => {
    let errorText = {};
    let valid = true;
    const { t } = this.props;
    let isHippa =
      this.props.client.clientInfo &&
      this.props.client.clientInfo.rows &&
      this.props.client.clientInfo.rows[0] &&
      this.props.client.clientInfo.rows[0].isHippa;
    
    if (this.state["currencyCode"].toString().trim().length === 0) {
      valid = false;
      errorText["currencyCode"] = t('componentData.addAccountEFT.CurrencyCodeEmpty');
    }
    if (this.state["routingCode"].toString().trim().length === 0) {
      valid = false;
      errorText["routingCode"] = t('componentData.addAccountEFT.RoutingcodeEmpty');
    }
    if (
      !this.state["accountName"] ||
      this.state["accountName"].toString().trim().length === 0
    ) {
      valid = false;      
      errorText["accountName"] = t('componentData.addAccountEFT.AccountNameEmpty');
    }
    if (this.state["accountName"] && this.state["accountName"].length > 50) {
      valid = false;      
      errorText["accountName"] =
      t('componentData.addAccountEFT.AccountNameMaxLen');
    }
    if (
      !this.state["accountNumber"] ||
      this.state["accountNumber"].length === 0
    ) {     
      valid = false;
      errorText["accountNumber"] = t('componentData.addAccountEFT.AccountNumberRequired');
    }
    if (
      this.state["accountNumber"] &&
      this.state["accountNumber"].length > 17
    ) {
      errorText["accountNumber"] =
      t('componentData.addAccountEFT.AccountNumberMaxLen');
      valid = false;
    }

    if (this.state["accountNumber"] && this.state["accountNumber"].length < 6) {
      errorText["accountNumber"] =
      t('componentData.addAccountEFT.AccountNumberMinLen');
      valid = false;
    }

    if (this.state["currencyCode"] && this.state["currencyCode"].length > 3) {
      errorText["currencyCode"] =
      t('componentData.addAccountEFT.CurrencyCodeMaxLen');
      valid = false;
    }

    if (this.state["routingCode"] && this.state["routingCode"].length !== 9) {
      errorText["routingCode"] = t('componentData.addAccountEFT.RoutingCodeMinLen');
      valid = false;
    }    

    if (!this.state["companyName"] || this.state["companyName"].length === 0) {
      errorText["companyName"] = t('componentData.addAccountEFT.CompanyNameRequired');
      valid = false;
    }

    if (this.state["companyName"] && this.state["companyName"].length > 16) {
      errorText["companyName"] =
      t('componentData.addAccountEFT.CompanyNameMaxLen');
      valid = false;
    }

    if (
      this.state["companyIdentification"] &&
      this.state["companyIdentification"].length !== 10
    ) {
      errorText["companyIdentification"] =
      t('componentData.addAccountEFT.CompanyIdentificationLen');
      valid = false;
    }
    if (this.state["companyIdentification"].toString().trim().length === 0) {
      valid = false;
      errorText["companyIdentification"] =
      t('componentData.addAccountEFT.CompanyIdentificationEmpty');
    }

    if (
      this.state["companyEntryDescription"] &&
      this.state["companyEntryDescription"].length < 2
    ) {
      errorText["companyEntryDescription"] =
      t('componentData.addAccountEFT.CompanyEntryMinLen');
      valid = false;
    }
    if (this.state["companyEntryDescription"].toString().trim().length === 0) {
      valid = false;
      errorText["companyEntryDescription"] =
      t('componentData.addAccountEFT.CompEntryDescEmpty');
    }
    if (
      this.state["company Entry Description"] &&
      this.state["company Entry Description"].length > 10
    ) {
      errorText["company Entry Description"] =
      t('componentData.addAccountEFT.CompanyEntryMaxLen');
      valid = false;
    }
    if (
      this.state["companyDiscretionaryData"] &&
      this.state["companyDiscretionaryData"].length > 20
    ) {
      errorText["companyDiscretionaryData"] =
      t('componentData.addAccountEFT.CompanyDiscretionaryMinLen');
      valid = false;
    }
    if (this.state["companyDiscretionaryData"].toString().trim().length === 0) {
      valid = false;
      errorText["companyDiscretionaryData"] =
      t('componentData.addAccountEFT.CompanyDiscEmpty');
    }

    if (
      this.state["originatingDFIIdentification"] &&
      this.state["originatingDFIIdentification"].length !== 8
    ) {
      errorText["originatingDFIIdentification"] =
      t('componentData.addAccountEFT.originatingDFILen');
      valid = false;
    }
    if (
      this.state["originatingDFIIdentification"].toString().trim().length === 0
    ) {
      valid = false;
      errorText["originatingDFIIdentification"] =
      t('componentData.addAccountEFT.OriginatingDFIEmp');
    }

    if (
      this.state["originatingDFIDiscretionaryData"] &&
      this.state["originatingDFIDiscretionaryData"].length > 2
    ) {
      errorText["originatingDFIDiscretionaryData"] =
      t('componentData.addAccountEFT.OriginatingDFIMaxLen');
      valid = false;
    }

    if (
      this.state["originatingDFIDiscretionaryData"].toString().trim().length ===
      0
    ) {
      valid = false;
      errorText["originatingDFIDiscretionaryData"] =
      t('componentData.addAccountEFT.OriginatingDFIEmpty');
    }

    if (
      this.state["bankCountryIso"] &&
      this.state["bankCountryIso"].length > 2
    ) {
      errorText["bankCountryIso"] =
      t('componentData.addAccountEFT.BankCountryMinLen');
      valid = false;
    }

    if (
      !this.state["bankCountryIso"] ||
      !this.state["bankCountryIso"].toString() ||
      !this.state["bankCountryIso"].toString().trim() ||
      this.state["bankCountryIso"].toString().trim().length === 0
    ) {
      valid = false;
      errorText["bankCountryIso"] = t('componentData.addAccountEFT.BankCountryISOEmp');
    }

    if (
      this.state["transactionType"] == [] ||
      this.state["transactionType"] == null
    ) {
      valid = false;
      errorText["transactionType"] = t('componentData.addAccountEFT.TransactionTypeEmp');
    }
    if (isHippa === 1 && this.state["GS02"].toString().trim().length === 0) {
      valid = false;
      errorText["GS02"] = t('componentData.addAccountEFT.GS02Emp');
    }
    if (isHippa === 1 && this.state["GS03"].toString().trim().length === 0) {
      valid = false;
      errorText["GS03"] = t('componentData.addAccountEFT.GS03Emp');
    }    

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };

  componentDidMount() {
    const {
      accountDetails,
      getACHProfile,
      getTransactionTypeIdValue,
    } = this.props;
    getACHProfile().then((response) => {
      if (response.error) {
        this.props.setDialogMessage(true, response.message);
      }
      getTransactionTypeIdValue().then((res) => {
        if (res.error) {
          this.props.setDialogMessage(true, res.message);
        }
        this.setState({ ...accountDetails, ...response.data }, () => {
          this.setState({
            transactionType: res.data && res.data.rows && res.data.rows[0],
          });
        });
      });
    });
  }

  handleInput(e, isNumeric) {
    let obj = {};
    let inputName = e.target.name;
    obj[inputName] = isNumeric
    ? e.target.value && e.target.value.replace(/[^0-9]/g, "")
      : e.target.value;
    this.setState(obj);
  }

  handleCheckBox(_isDefault) {
    this.setState({ isDefault: _isDefault == 0 ? 1 : 0 });
  }

  uploadBulkFile = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let clientId = this.props.user.userData.portalProfileId;
    let portalTypeId = this.props.user.userData.portalTypeId;
    let formData = new FormData();
    formData.append(`clientId`, clientId);
    formData.append(`portalTypeId`, portalTypeId);
    formData.append(`portalProfileId`, clientId);
    formData.append(`paymentType`, "EFT");
    formData.append(`file`, file);
    this.props.uploadFile(formData).then((response) => {
      if (response.error) {
        this.props.setDialogMessage(true, response.message);
        return false;
      }
      this.setState(
        { fileProcesssingStatus: response.message, fileProcessing: true },
        () => {
          let fileId = response.data.bulkAccountFilesId;
          this.props.getFileProcessingData(clientId, fileId).then((res) => {
            if (res.error) {
              this.props.setDialogMessage(true, res.message);
              return false;
            }
            if (res.data.status == 1) {
              this.props.onCancel();
              this.props.refreshData();
            }
            this.props.setDialogMessage(true, res.message);
            this.setState({ fileErrorFields: res.data, fileProcessing: false });
          });
        }
      );
    });
  };

  saveDetails = () => {    
    if (this.validateData()) {
      const {
        accountName,
        accountNumber,
        routingCode,
        companyName,
        companyIdentification,
        companyEntryDescription,
        companyDiscretionaryData,
        originatingDFIIdentification,
        originatingDFIDiscretionaryData,
        bankCountryIso,        
        currencyCode,        
        transactionType,
        accountId,        
        GS02,
        GS03,
        isDefault        
      } = this.state;
      let isHippa =
        this.props.client.clientInfo &&
        this.props.client.clientInfo.rows &&
        this.props.client.clientInfo.rows[0] &&
        this.props.client.clientInfo.rows[0].isHippa;
      const { setDialogMessage, isAddAccount } = this.props;
      let payload = {
        accountId: accountId,
        accountName: accountName,
        accountNumber: accountNumber,
        routingCode: routingCode,
        companyName: companyName,
        currencyCode: currencyCode,
        companyIdentification: companyIdentification,
        companyEntryDescription: companyEntryDescription,
        companyDiscretionaryData: companyDiscretionaryData,
        originatingDFIIdentification: originatingDFIIdentification,
        originatingDFIDiscretionaryData: originatingDFIDiscretionaryData,
        bankCountryIso: bankCountryIso,
        type: "EFT",
        isHippa: isAddAccount ? isHippa : undefined,
        transactionType: transactionType ? [transactionType] : [],
        isHippaInformation: isHippa
          ? {
              GS02: GS02,
              GS03: GS03,
            }
          : undefined,
        isDefault: isDefault ? 1 : 0,
      };

      payload = trim(payload);
      this.setState({ btnLoader: true, savingDetails: true }, () => {
        this.props.saveACHDetails(payload).then((response) => {
          this.setState({ btnLoader: false, savingDetails: false }, () => {
            this.props.refreshData();
            setDialogMessage(true, response.message);
            this.props.closeModal();
          });
        });
      });
    }
  };

  returnErrorFileData(fileErrorField) {
    const { t } = this.props;
    return (
      <Grid>
        <Box my={1}>
          Error: <h3>{fileErrorField && fileErrorField["errorCategory"]}</h3>
        </Box>
        {fileErrorField["errorRowData"] &&
          fileErrorField["errorRowData"].length > 0 && (
            <Table>
              <StyledTableHead>
                <TableRow>
                  <StyledTableCell>
                    <TableSortLabel>{t('componentData.addAccountEFT.AccountName')}</TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>{t('componentData.addAccountEFT.AccountNumber')}</StyledTableCell>
                  <StyledTableCell>{t('componentData.addAccountEFT.CurrencyCode')}</StyledTableCell>
                  <StyledTableCell>{t('componentData.addAccountEFT.CompanyName')}</StyledTableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {fileErrorField &&
                  fileErrorField["errorRowData"] &&
                  fileErrorField["errorRowData"].length > 0 &&
                  fileErrorField["errorRowData"].map((item, index) => {
                    return (
                      <Fragment key={index}>
                        {item && (
                          <StyledTableRow>
                            <StyledTableCell>
                              {item.accountName}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.accountNumber}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.currencyCode}
                            </StyledTableCell>
                            <StyledTableCell>
                              {item.companyName}
                            </StyledTableCell>
                          </StyledTableRow>
                        )}
                      </Fragment>
                    );
                  })}
              </TableBody>
              <StyledTableFooter></StyledTableFooter>
            </Table>
          )}
      </Grid>
    );
  }

  render() {
    const { t } = this.props;
    const {
      savingDetails,
      accountName,
      accountNumber,
      routingCode,
      companyName,
      companyIdentification,
      companyEntryDescription,
      companyDiscretionaryData,
      originatingDFIIdentification,
      originatingDFIDiscretionaryData,
      bankCountryIso,      
      transactionType,      
      currencyCode,
      fileProcessing,
      fileErrorFields,      
      GS02,
      GS03,
      immediateOrigin,
      immediateOriginName,
      immediateDestination,
      immediateDestinationName,
      isDefault,
      validation,
    } = this.state;
    const {
      transactionTypes,      
      currencyCodes,
      onCancel,      
    } = this.props;

    const { theme } = this.props.clientConfig.layout;
    const { user } = this.props;
    const isSettingPaymentMethodAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_ADD"]
        )) ||
      false;
    const isSettingPaymentMethodEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_EDIT"]
        )) ||
      false;
    const canEdit =
      isSettingPaymentMethodAddEnabled || isSettingPaymentMethodEditEnabled
        ? true
        : false;
    
    let isHippa =
      this.props.client.clientInfo &&
      this.props.client.clientInfo.rows &&
      this.props.client.clientInfo.rows[0] &&
      this.props.client.clientInfo.rows[0].isHippa;

    return (
      <Grid container xs={12} style={{ width: "100%" }}>
        {fileProcessing ? (
          <Box>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid style={{ display: "block", width: "100%" }}>
            {true && (
              <Box mb={1} display="block" width="100%">
                <label htmlFor="filePicker">
                  <span
                    style={{
                      color: theme.palette.primary.light,
                      border: `1px solid ${theme.palette.background.default}`,
                      padding: "5px 8px",
                      fontSize: "15px",
                      fontWeight: 400,
                    }}
                  >
                    <span className={""}>
                      <img
                        className={""}
                        src={require(`~/assets/icons/addIcon.svg`)}
                        alt=""
                      />
                    </span>

                    {t('componentData.addAccountEFT.uploadFile')}
                  </span>
                </label>
                <input
                  id="filePicker"
                  disabled={!canEdit}
                  style={{ visibility: "hidden" }}
                  type={"file"}
                  onClick={(e) => (e.currentTarget.value = null)}
                  onChange={(e) => this.uploadBulkFile(e)}
                ></input>                
              </Box>
            )}

            {fileErrorFields ? (
              <Box py={2}>
                {fileErrorFields &&
                  fileErrorFields.length > 0 &&
                  fileErrorFields.map((fileErrorField) =>
                    this.returnErrorFileData(fileErrorField)
                  )}                

                <Grid justify="center">
                  <Box mt={5}>                    
                    <div
                      style={{
                        justify: "center",
                        margin: "0 auto",
                        display: "table",
                        width: "340px",
                      }}
                    >
                      <Box px={5}>
                        <Button
                          variant="contained"
                          style={{
                            display: "inline-block",
                            float: "left",
                            padding: "6px 10px",
                            width: "120px",
                            margin: "0px 10px 0 0",
                            background: theme.palette.secondary.contrastText,
                            color: theme.palette.button.primary,
                          }}
                          color=""
                          onClick={onCancel}
                        >
                          {t('componentData.addAccountEFT.Cancel')}
                        </Button>
                      </Box>
                      <Box px={2}>
                        {savingDetails ? (
                          <CircularProgress color="primary" />
                        ) : (
                          <span>
                            <label htmlFor="filePicker">
                              <span
                                style={{
                                  color: theme.palette.primary.light,
                                  border: `1px solid ${theme.palette.background.default}`,
                                  padding: "7px 26px",
                                  fontSize: "15px",
                                  fontWeight: 400,
                                  lineHeight: "32px",
                                  boxShadow:
                                    "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
                                }}
                              >
                                {t('componentData.addAccountEFT.ReSubmit')}
                              </span>
                            </label>
                            <input
                              id="filePicker"
                              style={{ visibility: "hidden" }}
                              type={"file"}
                              onChange={(e) => this.uploadBulkFile(e)}
                              onClick={(e) => (e.currentTarget.value = null)}
                            ></input>
                          </span>
                        )}
                      </Box>
                    </div>                    
                  </Box>
                </Grid>
              </Box>
            ) : (
              <Grid>
                <Grid>
                  <Grid xs={12} sm={12}>
                    <Box my={3} mx={0}>
                      <Box mb={1}>
                        {" "}
                        <h4>{t('componentData.addAccountEFT.SelectTransactionType')}</h4>{" "}
                      </Box>
                      <TextField
                        fullWidth={true}
                        disabled={!canEdit}
                        error={
                          validation.transactionType &&
                          validation.transactionType.length > 0
                        }
                        helperText={validation.transactionType}
                        onBlur={() => this.validateData()}
                        select
                        autoComplete="off"
                        value={transactionType}
                        name="transactionType"
                        label={t('componentData.addAccountEFT.SelectTransactionType')}
                        variant="outlined"
                        onChange={(e) => {
                          this.handleInput(e);
                          let selectedObj = transactionTypes.filter(
                            (type) =>
                              type["transactionTypeId"] == e.target.value
                          )[0];
                          this.setState({
                            bankCountryIso: selectedObj["bankCountryIso"],
                            currencyCode: selectedObj["currency"],
                          });
                        }}
                        dir="horizontal"
                        size="small"
                        inputProps={{
                          maxLength: 100,
                        }}
                        className={""}
                      >
                        {transactionTypes &&
                          transactionTypes
                            .filter((_type) => _type.paymentCode === "EFT")
                            .map((type) => (
                              <MenuItem
                                value={type.transactionTypeId}
                                key={type.transactionTypeId}
                              >
                                {`${type.paymentCode} ${type.bankCountryIso} ${type.currency}`}
                              </MenuItem>
                            ))}
                      </TextField>
                    </Box>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid xs={12}>
                      <Box pl="12px" pt={1}>
                        <h4>{t('componentData.addAccountEFT.EnterBankDetails')}</h4>
                      </Box>
                    </Grid>
                    <Grid container spacing={3} xs={12}>
                      <Grid item xs={12} container>
                        <Grid xs item>
                          <Box my={1} mr={3}>
                            <TextField
                              fullWidth={true}
                              autoComplete="off"
                              value={immediateOrigin}
                              disabled={true}
                              name="immediateOrigin"
                              label= {t('componentData.addAccountEFT.ImmediateOrigin')}
                              variant="outlined"
                              // onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 10,
                                minLength: 10,
                              }}
                              className={""}
                            />
                          </Box>
                        </Grid>
                        <Grid xs item>
                          {" "}
                          <Box my={1}>
                            {" "}
                            <TextField
                              fullWidth={true}
                              disabled={!canEdit}
                              variant="outlined"
                              autoComplete="off"
                              value={originatingDFIDiscretionaryData}
                              name="originatingDFIDiscretionaryData"
                              onBlur={() => this.validateData()}
                              label= {t('componentData.addAccountEFT.OriginatingDFIDiscretionaryData')}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 2,
                                minLength: 1,
                              }}
                              className={""}
                              error={
                                validation.originatingDFIDiscretionaryData &&
                                validation.originatingDFIDiscretionaryData
                                  .length > 0
                              }
                              helperText={
                                validation.originatingDFIDiscretionaryData
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} container>
                        <Grid xs item>
                          {" "}
                          <Box my={1} mr={3}>
                            <TextField
                              fullWidth={true}
                              autoComplete="off"
                              value={immediateOriginName}
                              disabled={true}
                              name="immediateOriginName"
                              label= {t('componentData.addAccountEFT.ImmediateOriginName')}
                              variant="outlined"
                              // onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 23,
                                minLength: 1,
                              }}
                              className={""}
                            />
                          </Box>
                        </Grid>
                        <Grid xs item>
                          {" "}
                          <Box my={1}>
                            {" "}
                            <TextField
                              fullWidth={true}
                              disabled={!canEdit}
                              variant="outlined"
                              autoComplete="off"
                              value={routingCode}
                              name="routingCode"
                              onBlur={() => this.validateData()}
                              label= {t('componentData.addAccountEFT.BankRoutingCode')}
                              onChange={(e) => this.handleInput(e, true)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 9,
                                minLength: 9,
                              }}
                              className={""}
                              error={
                                validation.routingCode &&
                                validation.routingCode.length > 0
                              }
                              helperText={validation.routingCode}
                            />
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} container>
                        <Grid xs item>
                          {" "}
                          <Box my={1} mr={3}>
                            <TextField
                              fullWidth={true}
                              disabled={!canEdit}
                              autoComplete="off"
                              value={accountName}
                              name="accountName"
                              label= {t('componentData.addAccountEFT.AccountNameReq')}
                              variant="outlined"
                              onChange={(e) => this.handleInput(e)}
                              onBlur={() => this.validateData()}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 50,
                                minLength: 1,
                              }}
                              className={""}
                              error={
                                validation.accountName &&
                                validation.accountName.length > 0
                              }
                              helperText={validation.accountName}
                            />
                          </Box>
                        </Grid>
                        <Grid xs item>
                          {" "}
                          <Box my={1}>
                            {" "}
                            <TextField
                              fullWidth={true}
                              disabled={!canEdit}
                              variant="outlined"
                              autoComplete="off"
                              value={bankCountryIso}
                              onBlur={() => this.validateData()}
                              name="bankCountryIso"
                              label= {t('componentData.addAccountEFT.BankCountryISO')}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 2,
                              }}
                              className={""}
                              error={
                                validation.bankCountryIso &&
                                validation.bankCountryIso.length > 0
                              }
                              helperText={validation.bankCountryIso}
                            />
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} container>
                        <Grid xs item>
                          {" "}
                          <Box my={1} mr={3}>
                            <TextField
                              fullWidth={true}
                              autoComplete="off"
                              disabled={!canEdit}
                              variant="outlined"
                              value={companyName}
                              onBlur={() => this.validateData()}
                              name="companyName"
                              label= {t('componentData.addAccountEFT.CompanyName')}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 16,
                                minLength: 1,
                              }}
                              className={""}
                              error={
                                validation.companyName &&
                                validation.companyName.length > 0
                              }
                              helperText={validation.companyName}
                            />
                          </Box>
                        </Grid>
                        <Grid xs item>
                          {" "}
                          <Box my={1}>
                            {" "}
                            <TextField
                              select
                              fullWidth={true}
                              disabled={!canEdit}
                              variant="outlined"
                              autoComplete="off"
                              value={currencyCode}
                              name="currencyCode"
                              onBlur={() => this.validateData()}
                              label= {t('componentData.addAccountEFT.CurrencyCodeReq')}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 100,
                              }}
                              className={""}
                              error={
                                validation.currencyCode &&
                                validation.currencyCode.length > 0
                              }
                              helperText={validation.currencyCode}
                            >
                              {currencyCodes &&
                                currencyCodes.map((code) => (
                                  <MenuItem
                                    key={code.isoCode}
                                    value={code.isoCode}
                                  >
                                    {code.isoCode}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} container>
                        <Grid xs item>
                          {" "}
                          <Box my={1} mr={3}>
                            <MaskInput
                              fullWidth={true}
                              disabled={!canEdit}
                              autoComplete="off"
                              value={accountNumber}
                              variant="outlined"
                              name="accountNumber"
                              label= {t('componentData.addAccountEFT.BankAccountNumberReq')}
                              getValue={(val) => {
                                this.setState({
                                  accountNumber: val,
                                });
                              }}
                              onBlur={() => this.validateData()}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 17,
                                minLength: 6,
                              }}
                              className={""}
                              error={
                                validation.accountNumber &&
                                validation.accountNumber.length > 0
                              }
                              helperText={validation.accountNumber}
                            />
                          </Box>
                        </Grid>
                        <Grid xs item>
                          {" "}
                          <Box my={1}>
                            {" "}
                            <TextField
                              disabled
                              fullWidth={true}
                              variant="outlined"
                              autoComplete="off"
                              value={immediateDestination}
                              name="immediateDestination"
                              onBlur={() => this.validateData()}
                              label= {t('componentData.addAccountEFT.ImmediateDestination')}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 9,
                                minLength: 9,
                              }}
                              className={""}
                              error={
                                validation.immediateDestination &&
                                validation.immediateDestination.length > 0
                              }
                              helperText={validation.immediateDestination}
                            />{" "}
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} container>
                        <Grid xs item>
                          {" "}
                          <Box my={1} mr={3}>
                            <TextField
                              fullWidth={true}
                              autoComplete="off"
                              disabled={!canEdit}
                              variant="outlined"
                              value={originatingDFIIdentification}
                              name="originatingDFIIdentification"
                              label= {t('componentData.addAccountEFT.OriginatingDFIIdentification')}
                              onBlur={() => this.validateData()}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 8,
                                minLength: 8,
                              }}
                              className={""}
                              error={
                                validation.originatingDFIIdentification &&
                                validation.originatingDFIIdentification.length >
                                  0
                              }
                              helperText={
                                validation.originatingDFIIdentification
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid xs item>
                          {" "}
                          <Box my={1}>
                            {" "}
                            <TextField
                              disabled
                              fullWidth={true}
                              variant="outlined"
                              autoComplete="off"
                              onBlur={() => this.validateData()}
                              value={immediateDestinationName}
                              name="immediateDestinationName"
                              label= {t('componentData.addAccountEFT.ImmediateDestinationReq')}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 23,
                                minLength: 1,
                              }}
                              className={""}
                              error={
                                validation.immediateDestinationName &&
                                validation.immediateDestinationName.length > 0
                              }
                              helperText={validation.immediateDestinationName}
                            />{" "}
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} container>
                        <Grid xs item>
                          {" "}
                          <Box my={1} mr={3}>
                            <TextField
                              fullWidth={true}
                              disabled={!canEdit}
                              autoComplete="off"
                              variant="outlined"
                              value={companyIdentification}
                              name="companyIdentification"
                              onBlur={() => this.validateData()}
                              label= {t('componentData.addAccountEFT.CompanyIdentificationNumber')}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 10,
                                minLength: 10,
                              }}
                              className={""}
                              error={
                                validation.companyIdentification &&
                                validation.companyIdentification.length > 0
                              }
                              helperText={validation.companyIdentification}
                            />
                          </Box>
                        </Grid>
                        <Grid xs item>
                          {" "}
                          <Box my={1}>
                            {" "}
                            <TextField
                              fullWidth={true}
                              variant="outlined"
                              disabled={!canEdit}
                              autoComplete="off"
                              value={companyEntryDescription}
                              name="companyEntryDescription"
                              label= {t('componentData.addAccountEFT.CompanyEntryDescription')}
                              onBlur={() => this.validateData()}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 10,
                                minLength: 2,
                              }}
                              className={""}
                              error={
                                validation.companyEntryDescription &&
                                validation.companyEntryDescription.length > 0
                              }
                              helperText={validation.companyEntryDescription}
                            />
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} container>
                        <Grid xs item>
                          <Box my={1} mr={3}>
                            {" "}
                            {isHippa ? (
                              <TextField
                                fullWidth={true}
                                autoComplete="off"
                                variant="outlined"
                                value={GS02}
                                disabled={!canEdit}
                                name="GS02"
                                onBlur={() => this.validateData()}
                                label= {t('componentData.addAccountEFT.ApplicationSenderGS02')}
                                onChange={(e) => this.handleInput(e)}
                                dir="horizontal"
                                size="small"
                                inputProps={{
                                  maxLength: 100,
                                }}
                                className={""}
                                error={
                                  validation.GS02 && validation.GS02.length > 0
                                }
                                helperText={validation.GS02}
                              ></TextField>
                            ) : undefined}
                          </Box>
                        </Grid>
                        <Grid xs item>
                          <Box my={1}>
                            {isHippa == 1 ? (
                              <TextField
                                fullWidth={true}
                                autoComplete="off"
                                disabled={!canEdit}
                                variant="outlined"
                                value={GS03}
                                name="GS03"
                                label= {t('componentData.addAccountEFT.ApplicationReceiverGS03')}
                                onBlur={() => this.validateData()}
                                onChange={(e) => this.handleInput(e)}
                                dir="horizontal"
                                size="small"
                                inputProps={{
                                  maxLength: 100,
                                }}
                                className={""}
                                error={
                                  validation.GS03 && validation.GS03.length > 0
                                }
                                helperText={validation.GS03}
                              ></TextField>
                            ) : undefined}
                          </Box>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} container>
                        <Grid xs item>
                          {" "}
                          <Box my={1} mr={3}>
                            {" "}
                            <FormControlLabel
                              key={""}
                              disabled={!canEdit}
                              control={
                                <Checkbox
                                  name={"isDefault"}
                                  disabled={!canEdit}
                                  checked={isDefault == 1 ? true : false}
                                  value={isDefault}
                                  onChange={(e) =>
                                    this.handleCheckBox(isDefault)
                                  }                                  
                                />
                              }
                              label= {t('componentData.addAccountEFT.defaultAcc')}
                            />
                          </Box>
                        </Grid>
                        <Grid xs item>
                          {" "}
                          <Box my={1}>
                            <TextField
                              fullWidth={true}
                              disabled={!canEdit}
                              variant="outlined"
                              autoComplete="off"
                              value={companyDiscretionaryData}
                              name="companyDiscretionaryData"
                              label= {t('componentData.addAccountEFT.CompanyDiscretionaryData')}
                              onBlur={() => this.validateData()}
                              onChange={(e) => this.handleInput(e)}
                              dir="horizontal"
                              size="small"
                              inputProps={{
                                maxLength: 20,
                                minLength: 1,
                              }}
                              className={""}
                              error={
                                validation.companyDiscretionaryData &&
                                validation.companyDiscretionaryData.length > 0
                              }
                              helperText={validation.companyDiscretionaryData}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid justify="center">
                  <Box mt={5}>                    
                    {canEdit && (
                      <div
                        style={{
                          justify: "center",
                          margin: "0 auto",
                          display: "table",
                          width: "340px",
                        }}
                      >
                        <Box px={5}>
                          <Button
                            variant="outlined"
                            style={{
                              display: "inline-block",
                              float: "left",
                              padding: "6px 10px",
                              width: "120px",
                              margin: "0px 10px 0 0",
                              background: theme.palette.secondary.contrastText,
                              color: theme.palette.button.primary,
                            }}
                            color=""
                            onClick={onCancel}
                          >
                            {t('componentData.addAccountEFT.Cancel')}
                        </Button>
                        </Box>

                        <Box px={2}>
                          {savingDetails ? (
                            <CircularProgress color="primary" />
                          ) : (
                            <Button
                              variant="contained"
                              style={{
                                display: "inline-block",
                                padding: "6px 10px",
                                width: "120px",
                                margin: "0px 10px 0 0",
                              }}
                              color="primary"
                              onClick={this.saveDetails.bind(this)}
                            >
                              {t('componentData.addAccountEFT.Save')}
                            </Button>
                          )}
                        </Box>
                      </div>
                    )}                    
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.clientConfig,
  ...state.client,
}))(withStyles(styles)(EFT)));
