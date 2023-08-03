import React, { Fragment } from 'react';
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
} from '@material-ui/core';
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledTableFooter,
} from '~/components/StyledTable';
import { connect } from 'react-redux';
import MaskInput from '~/components/MaskInput';
import { accessRights } from '~/config/accessRights';
import { withTranslation } from 'react-i18next';
import trim from 'deep-trim-node';

const styles = (theme) => ({
  cancelButton: {
    border: `1px solid ${theme.provider}`,
    display: 'inline-block',
  },
  button: {
    display: 'inline-block',
  },
});

class ACH extends React.Component {
  state = {
    savingDetails: false,
    fileProcesssingStatus: '',
    fileProcessing: false,
    fileErrorFields: null,
    immediateDestination: '',
    immediateOriginName: '',
    currencyCode: '',
    accountName: '',
    accountNumber: '',
    routingCode: '',
    companyName: '',
    companyIdentification: '',
    companyEntryDescription: '',
    companyDiscretionaryData: '',
    originatingDFIIdentification: '',
    originatingDFIDiscretionaryData: '',
    bankCountryIso: '',
    type: 'ACH',
    isHippa: '',
    transactionType: [],
    GS02: '',
    GS03: '',
    immediateOrigin: '',
    immediateDestinationName: '',
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
    // let obj = Object.keys(namingConvention).find((item) => item === key);
    if (!this.state['currencyCode'] || this.state['currencyCode'].toString().trim().length === 0) {
      valid = false;
      errorText['currencyCode'] = t(
        'componentData.addAccountForm.currenceyCode'
      );
    }
    if (!this.state['routingCode'] || this.state['routingCode'].toString().trim().length === 0) {
      valid = false;
      errorText['routingCode'] = t('componentData.addAccountForm.RoutingCode');
    }
    if (
      !this.state['accountName'] ||
      this.state['accountName']?.toString().trim().length === 0
    ) {
      valid = false;
      //console.log("++++++++++ accountName ++++++ ", this.state["accountName"]);
      errorText['accountName'] = t('componentData.addAccountForm.AccountName');
    }
    if (this.state['accountName'] && this.state['accountName'].length > 50) {
      valid = false;
      //console.log("++++++++++ accountName ++++++ ", this.state["accountName"]);
      errorText['accountName'] = t(
        'componentData.addAccountForm.accountNameLen'
      );
    }
    if (
      !this.state['accountNumber'] ||
      this.state['accountNumber'].length === 0
    ) {
      // console.log(
      //   "++++++++++ accountNumber ++++++ ",
      //   this.state["accountNumber"]
      // );
      valid = false;
      errorText['accountNumber'] = t(
        'componentData.addAccountForm.AccountNumberRequired'
      );
    }
    if (
      this.state['accountNumber'] &&
      this.state['accountNumber'].length > 17
    ) {
      errorText['accountNumber'] = t(
        'componentData.addAccountForm.accountNumLen'
      );
      valid = false;
    }

    if (this.state['accountNumber'] && this.state['accountNumber'].length < 6) {
      errorText['accountNumber'] = t(
        'componentData.addAccountForm.accountNumMinLen'
      );
      valid = false;
    }

    if (this.state['currencyCode'] && this.state['currencyCode'].length > 3) {
      errorText['currencyCode'] = t(
        'componentData.addAccountForm.CurrencyCodeLen'
      );
      valid = false;
    }

    if (this.state['routingCode'] && this.state['routingCode'].length !== 9) {
      errorText['routingCode'] = t(
        'componentData.addAccountForm.RoutingCodeLen'
      );
      valid = false;
    }
    // if (
    //   this.state["routingCode"].toString().trim().length == 9
    //   // && isNaN(this.state["routingCode"].trim())
    // ) {
    //   valid = false;
    //   errorText["routingCode"] = "Routing Code must be a number.";
    // }    

    if (!this.state['companyName'] || this.state['companyName'].toString().trim().length === 0) {
      errorText['companyName'] = t('componentData.addAccountForm.companyName');
      valid = false;
    }

    if (this.state['companyName'] && this.state['companyName'].toString().trim().length > 16) {
      errorText['companyName'] = t(
        'componentData.addAccountForm.CompanyNameLen'
      );
      valid = false;
    }

    if (
      this.state['companyIdentification'] &&
      this.state['companyIdentification'].length !== 10
    ) {
      errorText['companyIdentification'] = t(
        'componentData.addAccountForm.CompanyIdentificationLen'
      );
      valid = false;
    }
    if (this.state['companyIdentification']?.toString().trim().length === 0) {
      valid = false;
      errorText['companyIdentification'] = t(
        'componentData.addAccountForm.CompanyIdentification'
      );
    }

    if (
      this.state['companyEntryDescription'] &&
      this.state['companyEntryDescription'].length < 2
    ) {
      errorText['companyEntryDescription'] = t(
        'componentData.addAccountForm.CompanyEntryDesMinLen'
      );
      valid = false;
    }
    if (this.state['companyEntryDescription']?.toString().trim().length === 0) {
      valid = false;
      errorText['companyEntryDescription'] = t(
        'componentData.addAccountForm.CompanyEntryDescription'
      );
    }
    if (
      this.state['company Entry Description'] &&
      this.state['company Entry Description'].length > 10
    ) {
      errorText['company Entry Description'] = t(
        'componentData.addAccountForm.CompanyEntryDescriptionMaxLen'
      );
      valid = false;
    }
    if (
      this.state['companyDiscretionaryData'] &&
      this.state['companyDiscretionaryData'].length > 20
    ) {
      errorText['companyDiscretionaryData'] = t(
        'componentData.addAccountForm.CompanyDiscretionaryMaxLen'
      );
      valid = false;
    }
    if (this.state['companyDiscretionaryData']?.toString().trim().length === 0) {
      valid = false;
      errorText['companyDiscretionaryData'] = t(
        'componentData.addAccountForm.CompanyDiscretionary'
      );
    }

    if (
      this.state['originatingDFIIdentification'] &&
      this.state['originatingDFIIdentification'].length !== 8
    ) {
      errorText['originatingDFIIdentification'] = t(
        'componentData.addAccountForm.originatingDFILen'
      );
      valid = false;
    }
    if (!this.state['originatingDFIIdentification'] ||
      this.state['originatingDFIIdentification'].toString().trim().length === 0
    ) {
      valid = false;
      errorText['originatingDFIIdentification'] = t(
        'componentData.addAccountForm.OriginatingDFI'
      );
    }

    if (
      this.state['originatingDFIDiscretionaryData'] &&
      this.state['originatingDFIDiscretionaryData'].length > 2
    ) {
      errorText['originatingDFIDiscretionaryData'] = t(
        'componentData.addAccountForm.OriginatingDFIMaxLen'
      );
      valid = false;
    }

    if (!this.state['originatingDFIDiscretionaryData'] ||
      this.state['originatingDFIDiscretionaryData'].toString().trim().length ===
      0
    ) {
      valid = false;
      errorText['originatingDFIDiscretionaryData'] = t(
        'componentData.addAccountForm.OriginatingDFIEmp'
      );
    }

    if (
      this.state['bankCountryIso'] &&
      this.state['bankCountryIso'].length > 2
    ) {
      errorText['bankCountryIso'] = t(
        'componentData.addAccountForm.BankCountry'
      );
      valid = false;
    }

    if (
      !this.state['bankCountryIso'] ||
      !this.state['bankCountryIso'].toString() ||
      !this.state['bankCountryIso'].toString().trim() ||
      this.state['bankCountryIso'].toString().trim().length === 0
    ) {
      valid = false;
      errorText['bankCountryIso'] = t(
        'componentData.addAccountForm.BankCountryEmp'
      );
    }

    if (
      this.state['transactionType'] === [] ||
      this.state['transactionType'] == null
    ) {
      valid = false;
      errorText['transactionType'] = t(
        'componentData.addAccountForm.TransactionType'
      );
    }
    if (isHippa === 1 && this.state['GS02']?.toString().trim().length === 0) {
      valid = false;
      errorText['GS02'] = t('componentData.addAccountForm.GS02');
    }
    if (isHippa === 1 && this.state['GS03']?.toString().trim().length === 0) {
      valid = false;
      errorText['GS03'] = t('componentData.addAccountForm.GS03');
    }

    // if (immediateDestination && immediateDestination.length !== 9) {
    //     validation["immediateDestination"] =
    //         "Immediate Destination must be of 9 digits.";
    //     valid = false;
    // }

    // if (immediateOrigin && immediateOrigin.length !== 10) {
    //     validation["immediateOrigin"] =
    //         "Immediate Origin must be of 10 digits.";
    //     valid = false;
    // }

    // if (immediateDestinationName && immediateDestinationName.length > 23) {
    //     validation["immediateDestinationName"] =
    //         "Immediate Destination Name must not be greater than 23 digits.";
    //     valid = false;
    // }

    // if (immediateOriginName && immediateOriginName.length > 23) {
    //     validation["immediateOriginName"] =
    //         "Immediate Origin Name must not be greater than 23 digits.";
    //     valid = false;
    // }

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };

  componentDidMount() {
    const { accountDetails, getACHProfile, getTransactionTypeIdValue } =
      this.props;
    getACHProfile().then((response) => {
      if (response.error) {
        this.props.setDialogMessage(true, response.message, 'error');
      }
      getTransactionTypeIdValue().then((res) => {
        if (res.error) {
          this.props.setDialogMessage(true, res.message, 'error');
        }
        this.setState({ ...accountDetails, ...response.data }, () => {
          this.setState({
            transactionType: res.data && res.data.rows && res.data.rows[0],
          });
        });
      });
    });
  }

  handleInput(e) {
    let obj = {};
    let inputName = e.target.name;
    obj[inputName] = e.target.value;
    this.setState(obj);
  }

  handleCheckBox(_isDefault) {
    this.setState({ isDefault: _isDefault === 0 ? 1 : 0 });
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
    formData.append(`paymentType`, 'ACH');
    formData.append(`file`, file);
    this.props.uploadFile(formData).then((response) => {
      if (response.error) {
        this.props.setDialogMessage(true, response.message, 'error');
        return false;
      }
      this.setState(
        { fileProcesssingStatus: response.message, fileProcessing: true },
        () => {
          let fileId = response.data.bulkAccountFilesId;
          this.props.getFileProcessingData(clientId, fileId).then((res) => {
            if (res.error) {
              return false;
            }
            if (res.data.status === 1) {
              this.props.onCancel();
              this.props.refreshData();
            }
            this.props.setDialogMessage(true, res.message, 'success');
            this.setState({
              fileErrorFields: res.data && res.data.errorList,
              fileProcessing: false,
            });
          });
        }
      );
    });
  };

  saveDetails = () => {
    // console.log(this.validateData());
    // console.log(this.state.validation);
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
        //isHippa,
        transactionType,
        accountId,
        GS02,
        GS03,
        isDefault,
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
        routingCode: routingCode || "",
        companyName: companyName,
        currencyCode: currencyCode,
        companyIdentification: companyIdentification,
        companyEntryDescription: companyEntryDescription,
        companyDiscretionaryData: companyDiscretionaryData,
        originatingDFIIdentification: originatingDFIIdentification,
        originatingDFIDiscretionaryData: originatingDFIDiscretionaryData,
        bankCountryIso: bankCountryIso,
        type: 'ACH',
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
          if (response?.error) {
            this.setState({ btnLoader: false, savingDetails: false });
            setDialogMessage(true, response.message, 'error');
          } else {
            this.setState({ btnLoader: false, savingDetails: false }, () => {
              this.props.refreshData();
              setDialogMessage(true, response.message, 'success');
              this.props.closeModal();
            });
          }
        });
      });
    }
  };

  returnErrorFileData(fileErrorField) {
    const { t } = this.props;
    return (
      <Grid>
        <Box my={1}>
          Error: <h3>{fileErrorField && fileErrorField['errorCategory']}</h3>
        </Box>
        {fileErrorField['errorRowData'] &&
          fileErrorField['errorRowData'].length > 0 && (
            <Table>
              <StyledTableHead>
                <TableRow>
                  <StyledTableCell>
                    <TableSortLabel>
                      {t('componentData.addAccountForm.AcName')}
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.addAccountForm.AcNumber')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.addAccountForm.CurrencyCode')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.addAccountForm.CompanyName')}
                  </StyledTableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {fileErrorField &&
                  fileErrorField['errorRowData'] &&
                  fileErrorField['errorRowData'].length > 0 &&
                  fileErrorField['errorRowData'].map((item, index) => {
                    // const roleIds = item.RoleID.split(',').map(Number);
                    // const roleIds = item.roles.map(userItem => userItem.roleId);
                    // const isSelected = selectedUsers.indexOf(item.userId) !== -1;
                    // const currentDate = moment();
                    // const lastActiveDate = item.successfullLoginAt ? moment(item.successfullLoginAt) : null;
                    // const activeDays = currentDate.diff(lastActiveDate, 'days');

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
    // console.log(theme);
    let isHippa =
      this.props.client.clientInfo &&
      this.props.client.clientInfo.rows &&
      this.props.client.clientInfo.rows[0] &&
      this.props.client.clientInfo.rows[0].isHippa;
    const { user } = this.props;
    const isSettingPaymentMethodAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_PAYMENT_METHODS_ADD']
        )) ||
      false;
    const isSettingPaymentMethodEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_PAYMENT_METHODS_EDIT']
        )) ||
      false;
    const canEdit =
      isSettingPaymentMethodAddEnabled || isSettingPaymentMethodEditEnabled
        ? true
        : false;
    return (
      <Grid container xs={12} style={{ width: '100%' }}>
        {fileProcessing ? (
          <Box>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid style={{ display: 'block', width: '100%' }}>
            {true && (
              <Box mb={1} width={1}>
                <label htmlFor="filePicker">
                  <span
                    style={{
                      color: theme.palette.primary.light,
                      border: `1px solid ${theme.palette.background.default}`,
                      padding: '5px 8px',
                      fontSize: '15px',
                      fontWeight: 400,
                    }}
                  >
                    <span className={''}>
                      <img
                        className={''}
                        src={require(`~/assets/icons/addIcon.svg`)}
                        alt=""
                      />
                    </span>

                    {t('componentData.addAccountForm.uploadFile')}
                  </span>
                </label>
                <input
                  id="filePicker"
                  disabled={!canEdit}
                  style={{ visibility: 'hidden' }}
                  type={'file'}
                  onChange={(e) => this.uploadBulkFile(e)}
                  onClick={(e) => (e.currentTarget.value = null)}
                ></input>
                {/* </span> */}
              </Box>
            )}

            {fileErrorFields ? (
              <Box py={2}>
                {fileErrorFields &&
                  fileErrorFields.length > 0 &&
                  fileErrorFields.map((fileErrorField) =>
                    this.returnErrorFileData(fileErrorField)
                  )}
                {/* {fileErrorFields && fileErrorFields["duplicateEntries"] && this.returnErrorFileData(fileErrorFields, "duplicateEntries", theme, onCancel, savingDetails)}
                  {fileErrorFields && fileErrorFields["emptyFields"] && this.returnErrorFileData(fileErrorFields, "emptyFields", theme, onCancel, savingDetails)} */}
                <Grid justify="center">
                  <Box mt={5}>
                    {/* {savingDetails ? (
                              <CircularProgress color="primary" />
                          ) : ( */}
                    <div
                      style={{
                        justify: 'center',
                        margin: '0 auto',
                        display: 'table',
                        width: '340px',
                      }}
                    >
                      <Box px={5}>
                        <Button
                          variant="contained"
                          style={{
                            display: 'inline-block',
                            float: 'left',
                            padding: '6px 10px',
                            width: '120px',
                            margin: '0px 10px 0 0',
                            background: theme.palette.secondary.contrastText,
                            color: theme.palette.button.primary,
                          }}
                          color=""
                          onClick={onCancel}
                        >
                          {t('componentData.addAccountForm.Cancel')}
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
                                  background: '#0B1941',
                                  color: '#fff',
                                  padding: '11px 26px',
                                  fontSize: '15px',
                                  fontWeight: 400,
                                  lineHeight: '40px',
                                  textTransform: 'uppercase',
                                  borderRadius: '4px',
                                }}
                              >
                                {t('componentData.addAccountForm.ReSubmit')}
                              </span>
                            </label>
                            <input
                              id="filePicker"
                              style={{ visibility: 'hidden' }}
                              type={'file'}
                              disabled={!canEdit}
                              onChange={(e) => this.uploadBulkFile(e)}
                              onClick={(e) => (e.currentTarget.value = null)}
                            ></input>
                          </span>
                        )}
                      </Box>
                    </div>
                    {/* )} */}
                  </Box>
                </Grid>
              </Box>
            ) : (
              <Grid>
                <Grid container xs={12}>
                  <Grid xs={12} sm={12}>
                    <Box my={3} mx={0}>
                      <Box mb={1}>
                        <h4>
                          {t(
                            'componentData.addAccountForm.SelectTransactionType'
                          )}
                        </h4>
                      </Box>
                      <TextField
                        fullWidth={true}
                        disabled={!canEdit}
                        error={
                          validation.transactionType &&
                          validation.transactionType.length > 0
                        }
                        helperText={validation.transactionType}
                        //onBlur={() => this.validateData()}
                        select
                        variant="outlined"
                        autoComplete="off"
                        value={transactionType}
                        name="transactionType"
                        label={t(
                          'componentData.addAccountForm.SelectTransactionType'
                        )}
                        onChange={(e) => {
                          this.handleInput(e);
                          let selectedObj = transactionTypes.filter(
                            (type) =>
                              type['transactionTypeId'] === e.target.value
                          )[0];
                          this.setState({
                            bankCountryIso: selectedObj['bankCountryIso'],
                            currencyCode: selectedObj['currency'],
                          });
                        }}
                        dir="horizontal"
                        size="small"
                        inputProps={{
                          maxLength: 100,
                        }}
                        className={''}
                      >
                        {transactionTypes &&
                          transactionTypes
                            .filter((_type) => _type.paymentCode === 'ACH')
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
                </Grid>

                <Grid container item xs={12} alignItems="flex-start">
                  <Grid xs={12}>
                    <Box pt={1}>
                      <h4>
                        {t('componentData.addAccountForm.EnterBankDetails')}
                      </h4>
                    </Box>
                  </Grid>

                  {/* <Grid item xs={12} sm={12}>
                      </Grid> */}
                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      <Box my={2} mr={2}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          value={immediateOrigin}
                          disabled={true}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          name="immediateOrigin"
                          label={t(
                            'componentData.addAccountForm.ImmediateOrigin'
                          )}
                          // onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 10,
                            minLength: 10,
                          }}
                          className={''}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          disabled={!canEdit}
                          autoComplete="off"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={originatingDFIDiscretionaryData}
                          name="originatingDFIDiscretionaryData"
                          //onBlur={() => this.validateData()}
                          label={t(
                            'componentData.addAccountForm.OriginatingDFIData'
                          )}
                          onChange={(e) => {
                            this.setState({
                              originatingDFIDiscretionaryData: e.target.value,
                            });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 2,
                            minLength: 1,
                          }}
                          className={''}
                          error={
                            validation.originatingDFIDiscretionaryData &&
                            validation.originatingDFIDiscretionaryData.length >
                            0
                          }
                          helperText={
                            validation.originatingDFIDiscretionaryData
                          }
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      <Box my={2} mr={2}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          value={immediateOriginName}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled={true}
                          name="immediateOriginName"
                          label={t(
                            'componentData.addAccountForm.ImmediateOriginName'
                          )}
                          // onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 23,
                            minLength: 1,
                          }}
                          className={''}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          disabled={!canEdit}
                          autoComplete="off"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={routingCode}
                          name="routingCode"
                          //onBlur={() => this.validateData()}
                          label={t(
                            'componentData.addAccountForm.BankRoutingCode'
                          )}
                          onChange={(e) => {
                            const newValue = e.target.value.replace(
                              /[^0-9]/g,
                              ''
                            );
                            this.setState({ routingCode: newValue });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 9,
                            minLength: 9,
                          }}
                          className={''}
                          error={
                            validation.routingCode &&
                            validation.routingCode.length > 0
                          }
                          helperText={validation.routingCode}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      <Box my={2} mr={2}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          value={accountName}
                          disabled={!canEdit}
                          name="accountName"
                          label={t('componentData.addAccountForm.AccName')}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => {
                            this.setState({ accountName: e.target.value });
                          }}
                          //onBlur={() => this.validateData()}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 50,
                            minLength: 1,
                          }}
                          className={''}
                          error={
                            validation.accountName &&
                            validation.accountName.length > 0
                          }
                          helperText={validation.accountName}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          variant="outlined"
                          disabled={!canEdit}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          autoComplete="off"
                          value={bankCountryIso}
                          //onBlur={() => this.validateData()}
                          name="bankCountryIso"
                          label={t(
                            'componentData.addAccountForm.BankCountryISO'
                          )}
                          onChange={(e) => {
                            this.setState({ bankCountryIso: e.target.value });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 2,
                          }}
                          className={''}
                          error={
                            validation.bankCountryIso &&
                            validation.bankCountryIso.length > 0
                          }
                          helperText={validation.bankCountryIso}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      <Box my={2} mr={2}>
                        <MaskInput
                          fullWidth={true}
                          autoComplete="off"
                          value={accountNumber}
                          disabled={!canEdit}
                          name="accountNumber"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          label={t(
                            'componentData.addAccountForm.BankAccountNumber'
                          )}
                          getValue={(val) => {
                            this.setState({
                              accountNumber: val,
                            });
                          }}
                          //onBlur={() => this.validateData()}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 17,
                            minLength: 6,
                          }}
                          className={''}
                          error={
                            validation.accountNumber &&
                            validation.accountNumber.length > 0
                          }
                          helperText={validation.accountNumber}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs sm>
                      <Box my={2}>
                        <TextField
                          select
                          fullWidth={true}
                          disabled={!canEdit}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          autoComplete="off"
                          value={currencyCode}
                          name="currencyCode"
                          //onBlur={() => this.validateData()}
                          label={t('componentData.addAccountForm.CurrCode')}
                          onChange={(e) => {
                            this.setState({ currencyCode: e.target.value });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 100,
                          }}
                          className={''}
                          error={
                            validation.currencyCode &&
                            validation.currencyCode.length > 0
                          }
                          helperText={validation.currencyCode}
                        >
                          {currencyCodes &&
                            currencyCodes
                              .filter((item) => item.isoCode === 'USD')
                              .map((code) => (
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
                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      <Box my={2} mr={2}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          value={companyName}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          //onBlur={() => this.validateData()}
                          name="companyName"
                          label={t('componentData.addAccountForm.CompName')}
                          onChange={(e) => {
                            this.setState({ companyName: e.target.value });
                          }}
                          dir="horizontal"
                          disabled={!canEdit}
                          size="small"
                          inputProps={{
                            maxLength: 16,
                            minLength: 1,
                          }}
                          className={''}
                          error={
                            validation.companyName &&
                            validation.companyName.length > 0
                          }
                          helperText={validation.companyName}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      <Box my={2}>
                        <TextField
                          disabled
                          fullWidth={true}
                          autoComplete="off"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={immediateDestination}
                          name="immediateDestination"
                          //onBlur={() => this.validateData()}
                          label={t(
                            'componentData.addAccountForm.ImmediateDestination'
                          )}
                          onChange={(e) => {
                            this.setState({
                              immediateDestination: e.target.value,
                            });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 9,
                            minLength: 9,
                          }}
                          className={''}
                          error={
                            validation.immediateDestination &&
                            validation.immediateDestination.length > 0
                          }
                          helperText={validation.immediateDestination}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      <Box my={2} mr={2}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          disabled={!canEdit}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={companyIdentification}
                          name="companyIdentification"
                          //onBlur={() => this.validateData()}
                          label={t('componentData.addAccountForm.CompIdentNum')}
                          onChange={(e) => {
                            this.setState({
                              companyIdentification: e.target.value,
                            });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 10,
                            minLength: 10,
                          }}
                          className={''}
                          error={
                            validation.companyIdentification &&
                            validation.companyIdentification.length > 0
                          }
                          helperText={validation.companyIdentification}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      <Box my={2}>
                        <TextField
                          disabled
                          fullWidth={true}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          autoComplete="off"
                          // //onBlur={() => this.validateData()}
                          value={immediateDestinationName}
                          name="immediateDestinationName"
                          label={t(
                            'componentData.addAccountForm.ImmedDestination'
                          )}
                          onChange={(e) => {
                            this.setState({
                              immediateDestinationName: e.target.value,
                            });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 23,
                            minLength: 1,
                          }}
                          className={''}
                          error={
                            validation.immediateDestinationName &&
                            validation.immediateDestinationName.length > 0
                          }
                          helperText={validation.immediateDestinationName}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      <Box my={2} mr={2}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={originatingDFIIdentification}
                          name="originatingDFIIdentification"
                          label={t(
                            'componentData.addAccountForm.OriginatingDFIIdentification'
                          )}
                          //onBlur={() => this.validateData()}
                          onChange={(e) => {
                            this.setState({
                              originatingDFIIdentification: e.target.value,
                            });
                          }}
                          dir="horizontal"
                          disabled={!canEdit}
                          size="small"
                          inputProps={{
                            maxLength: 8,
                            minLength: 8,
                          }}
                          className={''}
                          error={
                            validation.originatingDFIIdentification &&
                            validation.originatingDFIIdentification.length > 0
                          }
                          helperText={validation.originatingDFIIdentification}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs sm>
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          variant="outlined"
                          disabled={!canEdit}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          autoComplete="off"
                          value={companyEntryDescription}
                          name="companyEntryDescription"
                          label={t(
                            'componentData.addAccountForm.CompanyEntryDes'
                          )}
                          // //onBlur={() => this.validateData()}
                          onChange={(e) => {
                            this.setState({
                              companyEntryDescription: e.target.value,
                            });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 10,
                            minLength: 2,
                          }}
                          className={''}
                          error={
                            validation.companyEntryDescription &&
                            validation.companyEntryDescription.length > 0
                          }
                          helperText={validation.companyEntryDescription}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      {isHippa ? (
                        <Box my={2} mr={2}>
                          <TextField
                            fullWidth={true}
                            disabled={!canEdit}
                            autoComplete="off"
                            variant="outlined"
                            value={GS02}
                            name="GS02"
                            //onBlur={() => this.validateData()}
                            label={t(
                              'componentData.addAccountForm.ApplicationGS02'
                            )}
                            onChange={(e) => {
                              this.setState({ GS02: e.target.value });
                            }}
                            dir="horizontal"
                            size="small"
                            inputProps={{
                              maxLength: 15,
                            }}
                            className={''}
                            error={
                              validation.GS02 && validation.GS02.length > 0
                            }
                            helperText={validation.GS02}
                          ></TextField>
                        </Box>
                      ) : undefined}
                    </Grid>

                    <Grid item xs sm>
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          disabled={!canEdit}
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          autoComplete="off"
                          value={companyDiscretionaryData}
                          name="companyDiscretionaryData"
                          label={t(
                            'componentData.addAccountForm.CompanyDiscretionaryData'
                          )}
                          // //onBlur={() => this.validateData()}
                          onChange={(e) => {
                            this.setState({
                              companyDiscretionaryData: e.target.value,
                            });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 20,
                            minLength: 1,
                          }}
                          className={''}
                          error={
                            validation.companyDiscretionaryData &&
                            validation.companyDiscretionaryData.length > 0
                          }
                          helperText={validation.companyDiscretionaryData}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm md>
                      {isHippa ? (
                        <Box my={2}>
                          <TextField
                            fullWidth={true}
                            autoComplete="off"
                            variant="outlined"
                            disabled={!canEdit}
                            value={GS03}
                            name="GS03"
                            label={t(
                              'componentData.addAccountForm.ApplicationGS03'
                            )}
                            //onBlur={() => this.validateData()}
                            onChange={(e) => {
                              this.setState({ GS03: e.target.value });
                            }}
                            dir="horizontal"
                            size="small"
                            inputProps={{
                              maxLength: 15,
                            }}
                            className={''}
                            error={
                              validation.GS03 && validation.GS03.length > 0
                            }
                            helperText={validation.GS03}
                          ></TextField>
                        </Box>
                      ) : undefined}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} container>
                    <Box my={2}>
                      <FormControlLabel
                        key={''}
                        disabled={!canEdit}
                        control={
                          <Checkbox
                            name={'isDefault'}
                            disabled={!canEdit}
                            // value={isDefault}
                            checked={isDefault === 1 ? true : false}
                            onChange={(e) => this.handleCheckBox(isDefault)}
                          // icon={<CheckBoxOutlineBlankIcon fontSize="small" style={{ color: 'rgba(0,0,0,0.6)' }} />}
                          // checkedIcon={<CheckBoxIcon fontSize="small" style={{ color: 'rgba(0,0,0,0.6)' }} />}
                          />
                        }
                        label={t('componentData.addAccountForm.defaultAcc')}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Grid justify="center">
                  <Box mt={1}>
                    {canEdit && (
                      <div
                        style={{
                          justify: 'center',
                          margin: '0 auto',
                          display: 'table',
                          width: '340px',
                        }}
                      >
                        <Box px={5}>
                          <Button
                            variant="outlined"
                            style={{
                              display: 'inline-block',
                              float: 'left',
                              padding: '6px 10px',
                              width: 'auto',
                              margin: '0px 20px 0 0',
                              background: theme.palette.secondary.contrastText,
                              color: theme.palette.button.primary,
                            }}
                            color=""
                            onClick={onCancel}
                          >
                            {t('componentData.addAccountForm.Cancel')}
                          </Button>
                        </Box>

                        <Box px={2}>
                          {savingDetails ? (
                            <CircularProgress color="primary" />
                          ) : (
                            <Button
                              variant="contained"
                              style={{
                                display: 'inline-block',
                                padding: '6px 10px',
                                width: 'auto',
                                margin: '0px 0px 0 0',
                              }}
                              color="primary"
                              onClick={this.saveDetails.bind(this)}
                            >
                              {t('componentData.addAccountForm.Save')}
                            </Button>
                          )}
                        </Box>
                      </div>
                    )}
                    {/* )} */}
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

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
    ...state.client,
  }))(withStyles(styles)(ACH))
);
