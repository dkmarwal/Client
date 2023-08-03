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
} from '@material-ui/core';
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledTableFooter,
} from '~/components/StyledTable';
import MaskInput from '~/components/MaskInput';
import { connect } from 'react-redux';
import { accessRights } from '~/config/accessRights';
import { withTranslation } from 'react-i18next';
import trim from 'deep-trim-node';
import { CheckboxGroup } from "~/components/Forms";
import recommended from '../../../assets/images/recommended.png';
import checkCircle from '../../../assets/images/checkCircle.png';

class VCA extends React.Component {
  state = {
    fileProcessing: false,
    savingDetails: false,
    fileProcesssingStatus: '',
    fileErrorFields: null,
    purchaseTypes: [],
    immediateDestination: '',
    immediateOriginName: '',
    isDefault: 0,
    clientId: '',
    currencyCode: '',
    bankCountryIso: '',
    currencyIntCode: '',
    purchaseTypeId: '',
    issuerId: '',
    version: '',
    commonName: '',
    companyIdentification: '',
    companyName: '',
    companyEntryDescription: '',
    cardAlias: '',
    validFor: '',
    bankRoutingCode: '',
    cpex: '',
    eps: '',
    accountNumber: '',
    supplierName: '',
    transactionType: [],
    isHippa: 0,
    isHippaInformation: {
      ediCodeName: '',
      ediCodeValue: '',
    },
    isCardSelected: 2,
  };

  componentDidMount() {
    const { accountDetails, getTransactionTypeIdValue, getPurchaseTypes } =
      this.props;
    getTransactionTypeIdValue().then((res) => {
      if (res.error) {
        this.props.setDialogMessage(true, res.message, 'error');
      }
      getPurchaseTypes().then((response) => {
        if (response.error) {
          this.props.setDialogMessage(true, response.message, 'error');
        }
        this.setState(accountDetails, () => {
          this.setState({
            transactionType: res.data && res.data.rows && res.data.rows[0],
            purchaseTypes: response.data.rows,
          });
        });
      });
    });
  }

  handleInput(e, isNumeric) {
    let obj = {};
    let inputName = e.target.name;
    obj[inputName] = isNumeric
      ? e.target.value && e.target.value.replace(/[^0-9]/g, '')
      : e.target.value;
    this.setState(obj);
  }

  validateData = () => {
    let errorText = {};
    let valid = true;
    const { t } = this.props;
    // let obj = Object.keys(namingConvention).find((item) => item === key);
    if (
      !this.state['accountNumber'] ||
      this.state['accountNumber'].trim().length === 0
    ) {
      errorText['accountNumber'] = t(
        'componentData.addAccountVCA.AccountNumberRequired'
      );
      valid = false;
    }
    if (
      this.state['accountNumber'] &&
      this.state['accountNumber'].trim().length < 6
    ) {
      errorText['accountNumber'] = t('componentData.addAccountVCA.acNumMinLen');
      valid = false;
    }
    if (!this.state['issuerId'] || this.state['issuerId'].trim().length === 0) {
      errorText['issuerId'] = t('componentData.addAccountVCA.IssuerIDRequired');
      valid = false;
    }
    if (
      !this.state['supplierName'] ||
      this.state['supplierName'].trim().length === 0
    ) {
      errorText['supplierName'] = t(
        'componentData.addAccountVCA.PayeeNameRequired'
      );
      valid = false;
    }
    if (!this.state['version'] || this.state['version'].trim().length === 0) {
      errorText['version'] = t('componentData.addAccountVCA.VersionRequired');
      valid = false;
    }
    if (
      !this.state['commonName'] ||
      this.state['commonName'].trim().length === 0
    ) {
      errorText['commonName'] = t(
        'componentData.addAccountVCA.CommonNameRequired'
      );
      valid = false;
    }
    if (
      !this.state['bankCountryIso'] ||
      this.state['bankCountryIso'].trim().length === 0
    ) {
      errorText['bankCountryIso'] = t(
        'componentData.addAccountVCA.BankCountryISORequired'
      );
      valid = false;
    }
    if (
      !this.state['currencyIntCode'] ||
      this.state['currencyIntCode'] === 0 ||
      this.state['currencyIntCode'].toString().trim().length === 0
    ) {
      errorText['currencyIntCode'] = t(
        'componentData.addAccountVCA.CurrencyCodeRequired'
      );
      valid = false;
    }
    if (
      !this.state['currencyCode'] ||
      this.state['currencyCode'] === 0 ||
      this.state['currencyCode'].toString().trim().length === 0
    ) {
      errorText['currencyCode'] = t(
        'componentData.addAccountVCA.CurrencyCodeRequired'
      );
      valid = false;
    }
    if (
      !this.state['cardAlias'] ||
      this.state['cardAlias'].trim().length === 0
    ) {
      errorText['cardAlias'] = t(
        'componentData.addAccountVCA.CardAliasRequired'
      );
      valid = false;
    }
    if (this.state['purchaseTypeId'] === '') {
      errorText['purchaseTypeId'] = t(
        'componentData.addAccountVCA.PurchaseTypeIDRequired'
      );
      valid = false;
    }
    // if (
    //   !this.state["companyEntryDescription"] ||
    //   this.state["companyEntryDescription"].trim().length == 0
    // ) {
    //   errorText["companyEntryDescription"] =
    //     "Company Entry Description is required.";
    //   valid = false;
    // }
    if (this.state['supplierName'] && this.state['supplierName'].length < 2) {
      errorText['supplierName'] = t(
        'componentData.addAccountVCA.PayeeNameMinLen'
      );
      valid = false;
    }
    if (this.state['supplierName'] && this.state['supplierName'].length > 50) {
      errorText['supplierName'] = t(
        'componentData.addAccountVCA.PayeeNameMaxLen'
      );
      valid = false;
    }
    if (
      this.state['bankRoutingCode'] &&
      this.state['bankRoutingCode'].length !== 9
    ) {
      errorText['bankRoutingCode'] = t(
        'componentData.addAccountVCA.BankRoutingLen'
      );
      valid = false;
    }
    if (
      this.state['bankCountryIso'] &&
      this.state['bankCountryIso'].length !== 2
    ) {
      errorText['bankCountryIso'] = t(
        'componentData.addAccountVCA.BankCountryISOLen'
      );
      valid = false;
    }
    if (this.state['cardAlias'] && this.state['cardAlias'].length < 2) {
      errorText['cardAlias'] = t('componentData.addAccountVCA.CardAliasMinLen');
      valid = false;
    }
    if (this.state['cardAlias'] && this.state['cardAlias'].length > 50) {
      errorText['cardAlias'] = t('componentData.addAccountVCA.CardAliasMaxLen');
      valid = false;
    }

    if (this.state['currencyCode'] && this.state['currencyCode'].length !== 3) {
      errorText['currencyCode'] = t(
        'componentData.addAccountVCA.CurrencyCodeLen'
      );
      valid = false;
    }
    if (
      this.state['currencyIntCode'] &&
      this.state['currencyIntCode'].toString().length !== 3
    ) {
      errorText['currencyIntCode'] = t(
        'componentData.addAccountVCA.CurrencyInternationalLen'
      );
      valid = false;
    }
    if (this.state['issuerId'] && this.state['issuerId'].length > 1) {
      errorText['issuerId'] = t('componentData.addAccountVCA.IssuerIDLen');
      valid = false;
    }
    if (this.state['companyName'] && this.state['companyName'].length < 2) {
      errorText['companyName'] = t(
        'componentData.addAccountVCA.CompanyNameMinLen'
      );
      valid = false;
    }
    if (this.state['companyName'] && this.state['companyName'].length > 17) {
      errorText['companyName'] = t(
        'componentData.addAccountVCA.CompanyNameMaxLen'
      );
      valid = false;
    }
    if (
      this.state['companyIdentification'] &&
      this.state['companyIdentification'].length > 10
    ) {
      errorText['companyIdentification'] = t(
        'componentData.addAccountVCA.CompanyIdentificationLen'
      );
      valid = false;
    }
    if (
      this.state['companyEntryDescription'] &&
      this.state['companyEntryDescription'].length > 20
    ) {
      errorText['companyEntryDescription'] = t(
        'componentData.addAccountVCA.CompanyEntryDesMaxLen'
      );
      valid = false;
    }
    if (this.state['version'] && this.state['version'].length < 2) {
      errorText['version'] = t('componentData.addAccountVCA.VersionMinLen');
      valid = false;
    }
    if (this.state['version'] && this.state['version'].length > 5) {
      errorText['version'] = t('componentData.addAccountVCA.VersionMaxLen');
      valid = false;
    }
    if (this.state['commonName'] && this.state['commonName'].length < 2) {
      errorText['commonName'] = t(
        'componentData.addAccountVCA.CommonNameMinLen'
      );
      valid = false;
    }

    if (this.state['commonName'] && this.state['commonName'].length > 50) {
      errorText['commonName'] = t(
        'componentData.addAccountVCA.CommonNameMaxLen'
      );
      valid = false;
    }

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };

  saveDetails = () => {
    if (this.validateData()) {
      const {
        cardAccountDetailsId,
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
        transactionType,
        purchaseTypeId,
        isHippa,
        isHippaInformation,
        isDefault,
      } = this.state;
      const { setDialogMessage } = this.props;
      let clientId = this.props.user.userData.portalProfileId;
      let payload = {
        cardAccountDetailsId: cardAccountDetailsId,
        clientId: clientId,
        currencyCode: currencyCode,
        bankCountryIso: bankCountryIso,
        currencyIntCode: currencyIntCode,
        purchaseTypeId: purchaseTypeId,
        issuerId: issuerId,
        version: version,
        commonName: commonName,
        companyIdentification:
          companyIdentification?.trim() === '' ? null : companyIdentification,
        companyName: companyName?.trim() === '' ? null : companyName,
        companyEntryDescription:
          companyEntryDescription?.trim() === ''
            ? null
            : companyEntryDescription,
        cardAlias: cardAlias,
        bankRoutingCode: bankRoutingCode === '' ? null : bankRoutingCode,
        accountNumber: accountNumber,
        supplierName: supplierName,
        transactionType: [transactionType],
        isHippaInformation: isHippa === 1 ? isHippaInformation : undefined,
        isDefault: isDefault ? 1 : 0,
      };

      payload = trim(payload);
      this.setState({ btnLoader: true, savingDetails: true }, () => {
        this.props.saveACHDetails(payload).then((response) => {
          this.setState({ btnLoader: false, savingDetails: false }, () => {
            this.props.refreshData();
            setDialogMessage(true, response.message, 'success');
            this.props.closeModal();
          });
        });
      });
    }
  };

  uploadBulkFile = (e) => {
    e.preventDefault();
    let file = e.target.files[0];
    let clientId = this.props.user.userData.portalProfileId;
    let portalTypeId = this.props.user.userData.portalTypeId;
    let formData = new FormData();
    formData.append(`clientId`, clientId);
    formData.append(`portalTypeId`, portalTypeId);
    formData.append(`portalProfileId`, clientId);
    formData.append(`paymentType`, 'VCA');
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
              this.props.setDialogMessage(true, res.message, 'error');
              return false;
            }
            if (res.data.status === 1) {
              this.props.onCancel();
              this.props.refreshData();
            }
            this.props.setDialogMessage(true, res.message, 'success');
            this.setState({ fileErrorFields: res.data, fileProcessing: false });
          });
        }
      );
    });
  };

  handleCheckBox(_isDefault) {
    this.setState({ isDefault: _isDefault === 0 ? 1 : 0 });
  }

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
                      {t('componentData.addAccountVCA.PayeeName')}
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.addAccountVCA.AccountNumber')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.addAccountVCA.CurrencyCode')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.addAccountVCA.CompanyName')}
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
                              {item.supplierName}
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

  handleCardSelection = (selectedValue) => {
    this.setState({isCardSelected:selectedValue.value})
  }

  render() {
    const { t } = this.props;
    const {
      fileProcessing,
      savingDetails,
      purchaseTypes,
      currencyCode,
      bankCountryIso,
      currencyIntCode,
      purchaseTypeId,
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
      transactionType,
      fileErrorFields,
      isDefault,
      validation,
      isCardSelected,
    } = this.state;
    const { transactionTypes, currencyCodes, onCancel,isCardSelection } = this.props;

    const { theme } = this.props.clientConfig.layout;
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
      <Grid style={{ display: 'block', width: '100%' }}>
        <Box style={{color: '#0B1941'}}>Update the Virtual Cards selection here:</Box>
        {isCardSelection &&
        (<Box style={{width:'614px'}} ml={0}  m={1}>
          <Box className="toggleButton">
                <CheckboxGroup
                  options={[
                    {
                      label: <span>
                                   <img src={checkCircle} alt="checkCircle" width="20" height="20px" style={{marginRight:"40px"}}/>
                                      {"Mastercard 2.0"}
                                   <img src={recommended} alt="checkCircle" width="100px" style={{marginLeft:"25px"}} /> 
                             </span>,
                      value: 2,
                    },
                    {
                      label: <Box component="span">
                                  {isCardSelected == 1 && <img src={checkCircle} alt="checkCircle" width="20" height="20px" style={{marginRight:"40px"}}/>}
                                  {"Mastercard 1.0"}
                             </Box>,
                      value: 1,
                    },
                  ]}
                  onChange={this.handleCardSelection}
                  selectedOption={isCardSelected}
                />
            </Box>
        </Box> )
      }

        {fileProcessing ? (
          <Box>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Grid style={{ display: 'block', width: '100%' }}>
            {true && (
              <Box mb={1}>
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
                        æ
                      />
                    </span>

                    {t('componentData.addAccountVCA.uploadFile')}
                  </span>
                </label>
                <input
                  id="filePicker"
                  style={{ visibility: 'hidden' }}
                  type={'file'}
                  disabled={!canEdit}
                  onClick={(e) => (e.currentTarget.value = null)}
                  onChange={(e) => this.uploadBulkFile(e)}
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
                          {t('componentData.addAccountVCA.Cancel')}
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
                                {t('componentData.addAccountVCA.ReSubmit')}
                              </span>
                            </label>
                            <input
                              id="filePicker"
                              style={{ visibility: 'hidden' }}
                              type={'file'}
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
              <Grid style={{ display: 'block', width: '100%' }}>
                <Grid xs={12} sm={12} container item>
                  <Box my={3} mx={0}>
                    <Box mb={1}>
                      {' '}
                      <h4>
                        {t('componentData.addAccountVCA.SelectTransactionReq')}
                      </h4>{' '}
                    </Box>
                    <TextField
                      disabled={!canEdit}
                      fullWidth={true}
                      select
                      autoComplete="off"
                      variant="outlined"
                      value={transactionType}
                      error={
                        validation &&
                        validation.transactionType &&
                        validation.transactionType.length > 0
                      }
                      helperText={validation && validation.transactionType}
                      name="transactionType"
                      label={t(
                        'componentData.addAccountVCA.SelectTransactionReq'
                      )}
                      onChange={(e) => {
                        this.handleInput(e);
                        let selectedObj = transactionTypes.filter(
                          (type) => type['transactionTypeId'] === e.target.value
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
                      onBlur={() => this.validateData()}
                    >
                      {transactionTypes &&
                        transactionTypes
                          .filter((_type) => _type.paymentCode === 'VCA')
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
                    <Box pt={1}>
                      <h4>{t('componentData.addAccountVCA.BankDetailsReq')}</h4>
                    </Box>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      {' '}
                      <Box my={2} mr={3}>
                        <TextField
                          disabled={!canEdit}
                          fullWidth={true}
                          autoComplete="off"
                          variant="outlined"
                          value={issuerId}
                          name="issuerId"
                          label={t('componentData.addAccountVCA.IssuerIDReq')}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 1,
                            minLength: 1,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.issuerId &&
                            validation.issuerId.length > 0
                          }
                          helperText={validation && validation.issuerId}
                          onBlur={() => this.validateData()}
                        ></TextField>
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      {' '}
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          disabled={!canEdit}
                          autoComplete="off"
                          variant="outlined"
                          value={supplierName}
                          name="supplierName"
                          label={t('componentData.addAccountVCA.PayeeNameReq')}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 50,
                            minLength: 2,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.supplierName &&
                            validation.supplierName.length > 0
                          }
                          helperText={validation && validation.supplierName}
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      {' '}
                      <Box my={2} mr={3}>
                        <TextField
                          disabled={!canEdit}
                          fullWidth={true}
                          autoComplete="off"
                          variant="outlined"
                          value={version}
                          name="version"
                          label={t('componentData.addAccountVCA.VersionReq')}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 5,
                            minLength: 2,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.version &&
                            validation.version.length > 0
                          }
                          helperText={validation && validation.version}
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      {' '}
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          disabled={!canEdit}
                          autoComplete="off"
                          variant="outlined"
                          value={commonName}
                          name="commonName"
                          label={t('componentData.addAccountVCA.CommonNameReq')}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 50,
                            minLength: 2,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.commonName &&
                            validation.commonName.length > 0
                          }
                          helperText={validation && validation.commonName}
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      {' '}
                      <Box my={2} mr={3}>
                        <MaskInput
                          fullWidth={true}
                          disabled={!canEdit}
                          autoComplete="off"
                          variant="outlined"
                          value={accountNumber}
                          name="accountNumber"
                          label={t(
                            'componentData.addAccountVCA.AccountNumberReq'
                          )}
                          getValue={(val) => {
                            this.setState({
                              accountNumber: val,
                            });
                          }}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 17,
                            minLength: 6,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.accountNumber &&
                            validation.accountNumber.length > 0
                          }
                          helperText={validation && validation.accountNumber}
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      {' '}
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          disabled={!canEdit}
                          autoComplete="off"
                          variant="outlined"
                          value={bankRoutingCode}
                          name="bankRoutingCode"
                          label={t(
                            'componentData.addAccountVCA.BankRoutingCodeReq'
                          )}
                          onChange={(e) => this.handleInput(e, true)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 9,
                            minLength: 9,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.bankRoutingCode &&
                            validation.bankRoutingCode.length > 0
                          }
                          helperText={validation && validation.bankRoutingCode}
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      {' '}
                      <Box my={2} mr={3}>
                        <TextField
                          fullWidth={true}
                          disabled={!canEdit}
                          onBlur={() => this.validateData()}
                          autoComplete="off"
                          variant="outlined"
                          value={bankCountryIso}
                          name="bankCountryIso"
                          label={t(
                            'componentData.addAccountVCA.BankCountryISOReq'
                          )}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 2,
                            minLength: 2,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.bankCountryIso &&
                            validation.bankCountryIso.length > 0
                          }
                          helperText={validation && validation.bankCountryIso}
                        >
                          {/* {bankCountryISOs && bankCountryISOs.map(iso => (
                                <MenuItem value={} key={locationTypeId}>
                                     {}
                                </MenuItem>
                            ))} */}
                        </TextField>
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      {' '}
                      <Box my={2}>
                        <TextField
                          select
                          fullWidth={true}
                          disabled={!canEdit}
                          autoComplete="off"
                          variant="outlined"
                          value={currencyCode}
                          name="currencyCode"
                          label={t('componentData.addAccountVCA.CurrencyReq')}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          error={
                            validation &&
                            validation.currencyCode &&
                            validation.currencyCode.length > 0
                          }
                          helperText={validation && validation.currencyCode}
                          inputProps={{
                            maxLength: 100,
                          }}
                          onBlur={() => this.validateData()}
                          className={''}
                        >
                          {currencyCodes &&
                            currencyCodes.map((code) => (
                              <MenuItem key={code.isoCode} value={code.isoCode}>
                                {code.isoCode}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      {' '}
                      <Box my={2} mr={3}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          disabled={!canEdit}
                          variant="outlined"
                          value={currencyIntCode}
                          name="currencyIntCode"
                          label={t(
                            'componentData.addAccountVCA.CurrencyCodeReq'
                          )}
                          onChange={(e) => this.handleInput(e, true)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 3,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.currencyIntCode &&
                            validation.currencyIntCode.length > 0
                          }
                          helperText={validation && validation.currencyIntCode}
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      {' '}
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          disabled={!canEdit}
                          variant="outlined"
                          value={companyIdentification}
                          name="companyIdentification"
                          label={t(
                            'componentData.addAccountVCA.CompanyIdentificationReq'
                          )}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          error={
                            validation &&
                            validation.companyIdentification &&
                            validation.companyIdentification.length > 0
                          }
                          helperText={
                            validation && validation.companyIdentification
                          }
                          inputProps={{
                            maxLength: 10,
                            minLength: 10,
                          }}
                          className={''}
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      {' '}
                      <Box my={2} mr={3}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          disabled={!canEdit}
                          variant="outlined"
                          value={cardAlias}
                          name="cardAlias"
                          label={t(
                            'componentData.addAccountVCA.VirtualCardAliasReq'
                          )}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 50,
                            minLength: 2,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.cardAlias &&
                            validation.cardAlias.length > 0
                          }
                          helperText={validation && validation.cardAlias}
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      {' '}
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          variant="outlined"
                          value={companyName}
                          disabled={!canEdit}
                          name="companyName"
                          label={t(
                            'componentData.addAccountVCA.CompanyNameReq'
                          )}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 17,
                            minLength: 2,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.companyName &&
                            validation.companyName.length > 0
                          }
                          helperText={validation && validation.companyName}
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Grid item xs sm>
                      {' '}
                      <Box my={2} mr={3}>
                        <TextField
                          select
                          fullWidth={true}
                          autoComplete="off"
                          variant="outlined"
                          disabled={!canEdit}
                          value={purchaseTypeId}
                          name="purchaseTypeId"
                          label={t(
                            'componentData.addAccountVCA.PurchaseTypeIdReq'
                          )}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          error={
                            validation &&
                            validation.purchaseTypeId &&
                            validation.purchaseTypeId.length > 0
                          }
                          helperText={validation && validation.purchaseTypeId}
                          inputProps={{
                            maxLength: 100,
                          }}
                          onBlur={() => this.validateData()}
                          className={''}
                        >
                          {purchaseTypes &&
                            purchaseTypes.map((code) => (
                              <MenuItem
                                key={code.purchaseTypeId}
                                value={code.purchaseTypeId}
                              >
                                {code.purchaseTypeName}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Box>
                    </Grid>
                    <Grid item xs sm>
                      {' '}
                      <Box my={2}>
                        <TextField
                          fullWidth={true}
                          autoComplete="off"
                          variant="outlined"
                          disabled={!canEdit}
                          value={companyEntryDescription}
                          name="companyEntryDescription"
                          label={t(
                            'componentData.addAccountVCA.CompanyEntryDesReq'
                          )}
                          onChange={(e) => this.handleInput(e)}
                          dir="horizontal"
                          size="small"
                          inputProps={{
                            maxLength: 20,
                          }}
                          className={''}
                          error={
                            validation &&
                            validation.companyEntryDescription &&
                            validation.companyEntryDescription.length > 0
                          }
                          helperText={
                            validation && validation.companyEntryDescription
                          }
                          onBlur={() => this.validateData()}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container item xs={12} alignItems="flex-start">
                    <Box my={2}>
                      <FormControlLabel
                        disabled={!canEdit}
                        key={''}
                        control={
                          <Checkbox
                            disabled={!canEdit}
                            name={'isDefault'}
                            checked={isDefault === 1 ? true : false}
                            value={isDefault}
                            onChange={(e) => this.handleCheckBox(isDefault)}
                          />
                        }
                        label={t('componentData.addAccountVCA.defaultAcc')}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    {/* <Box my={5}>
                            <TextField
                                fullWidth={true}
                                autoComplete="off"
                                value={currencyCode}
                                name='currencyCode'
                                label="Currency Code"
                                onChange={(e) => this.handleInput(e)}
                                dir='horizontal'
                                size="small"
                                inputProps={{
                                    maxLength: 100
                                }}
                                className={""}
                            />
                        </Box> */}
                  </Grid>

                  <Grid item xs={6} sm={6}>
                    {/* <Box my={5}>
                                <TextField
                                    fullWidth={true}
                                    autoComplete="off"
                                    value={validFor}
                                    name='validFor'
                                    label="Expiry Days"
                                    onChange={(e) => this.handleInput(e)}
                                    dir='horizontal'
                                    size="small"
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                    className={""}
                                />
                            </Box> */}
                    {/* <Box my={5}>
                        <TextField
                            fullWidth={true}
                            autoComplete="off"
                            value={""}
                            name='immediateDestination'
                            label="Immediate Destination (Name)"
                            onChange={(e) => this.handleInput(e)}
                            dir='horizontal'
                            size="small"
                            inputProps={{
                                maxLength: 100
                            }}
                            className={""}
                        />
                    </Box> */}

                    {/* <Box my={5}>
                                <TextField
                                    fullWidth={true}
                                    autoComplete="off"
                                    value={purchaseTypeId}
                                    name='purchaseTypeId'
                                    label="Purchase Type"
                                    onChange={(e) => this.handleInput(e)}
                                    dir='horizontal'
                                    size="small"
                                    inputProps={{
                                        maxLength: 100
                                    }}
                                    className={""}
                                />
                            </Box> */}
                  </Grid>
                </Grid>

                <Grid justify="center">
                  <Box mt={5}>
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
                              width: '120px',
                              margin: '0px 10px 0 0',
                              background: theme.palette.secondary.contrastText,
                              color: theme.palette.button.primary,
                            }}
                            color=""
                            onClick={onCancel}
                          >
                            {t('componentData.addAccountVCA.Cancel')}
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
                                width: '120px',
                                margin: '0px 10px 0 0',
                              }}
                              color="primary"
                              onClick={this.saveDetails.bind(this)}
                            >
                              {t('componentData.addAccountVCA.Save')}
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
    ...state.client,
    ...state.clientConfig,
  }))(VCA)
);
