import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  Paper,
  Grid,
  Box,
  CircularProgress,
  Typography, FormControlLabel, MenuItem, Checkbox
} from "@material-ui/core";
import { accessRights } from "~/config/accessRights";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import Button from "~/components/Forms/Button";
import TextField from "~/components/Forms/TextField";
import { withStyles } from "@material-ui/styles";
import { fetchB2CClientData } from "~/redux/actions/client";
import styles from "./styles";

import ImportParentPaymentDetails from "~/modules/ImportParentPaymentDetails";
import Notification from "~/components/Notification";
import "react-notifications/lib/notifications.css";
import config from "~/config";
import trim from "deep-trim-node";

import { updateFileSettingsData } from '~/redux/helpers/USbank/filesettings';
import { fetchFileSettingData } from "~/redux/actions/USbank/client";

class FileSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: null,
      parentId: null,
      clientEmail: null,
      isLoading: false,
      isBtnClicked: false,
      errorMsg: null,
      variant: null,
      errors: {},
      isCsv: 1,
      isDat: 1,
      isText: 1,
      clientuid: "",
      filecode: "",
      delimeter: ',',
      delimeter1: ',',
      fileformat: '.csv',
      billingAccountNumber: null,
      billingAccountCompanyNumber: null,
      paymentResFile: 'Y'
    };
  }
  componentDidMount() {
    const { t } = this.props;
    if (this.props.isOnboarding) {
      this.props.changeActiveStep(2);
    }
    if (this.props.client.clientInfo.length > 0) {
      this.setState({
        parentId: this.props.client.clientInfo.rows[0].parentId,
       
      });
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const { userData } = this.props.user;
      this.setState(
        {
          clientId: this.props.isOnboarding
            ? parseInt(urlParams.get("id"))
            : userData.portalProfileId,
        },
        () => {
          this.props
            .dispatch(fetchB2CClientData(this.state.clientId))
            .then((response) => {
              if (!response) {
                throw this.props.client.error;
              }
              const clientData =
                this.props.client.clientInfo.rows &&
                this.props.client.clientInfo.rows[0];
              this.setState({
                clientId: clientData.clientId,
             
                parentId: clientData.parentId,
               
                showBanner:
                  clientData.parentId === null ||
                    typeof clientData.parentId === "undefined"
                    ? false
                    : true,
                isLoading: false,
              });
              this.loadData(clientData.clientId, false);
            })
            .catch((error) => {
              this.setState({
                isLoading: false,
                error:
                  typeof error === "string"
                    ? error
                    : t("componentData.fileSettings.unknownErr"),
              });
            });
        }
      );
    }
  }
  
  importParentsData = () => {
    const { parentId } = this.state;
    this.setState({ showBanner: false });
    this.loadData(parentId, true);
  };
  loadData = async (id, flag) => {
    const { t } = this.props;
    const { clientId } = this.state;
   
Promise.all([
  fetchFileSettingData(id)
])
  .then(
    
    ([
      fileSettingsData
    ]) => {
      const {billingFeedSettings,paymentFileSettings} = fileSettingsData?.data ?? {};
      this.setState({
        billingAccountNumber:   billingFeedSettings?.clientBillingAccount,
        billingAccountCompanyNumber:  billingFeedSettings?.clientBillingBranch,
        paymentResFile:paymentFileSettings.isPaymentResponseFileOpted===1?'Y':'N',
        clientuid: paymentFileSettings.clientUid||clientId,
        filecode:paymentFileSettings?.fpid,
        
        delimeter1:paymentFileSettings?.delimiter||',',
       
        errors: {},
        isLoading: false,
        errorMsg: ''
      });
    }
  )
    .catch((error) => {
      this.setState({
        isLoading: false,
        error:
          typeof error === "string"
            ? error
            : t("componentData.fileSettings.unknownErr"),
      });
    });
  };

  handlePaymentFile = (event, res) => {
    this.setState({ paymentResFile: res });
  };

  onChangeHandler = (field, event) => {
    let fieldValue = null;

    switch (field) {
      case "billingAccountNumber":
        const bilingNumber = event.target.value;
        fieldValue = bilingNumber.replace(/[^0-9]/g, "");
        break;
      case "billingAccountCompanyNumber":
        const bilingComNumber = event.target.value;
        fieldValue = bilingComNumber.replace(/[^0-9]/g, "");
        break;
      case "clientuid":
        const clientuidNumber = event.target.value;
        fieldValue = clientuidNumber.replace(/[^0-9]/g, "");
        break;
      case "filecode":
        const filecode = event.target.value;
        const fileCodeRegex = /^((?!(0))[0-9]{0,20})$/g // bugfix 17832
        if(fileCodeRegex.test(filecode)){
          fieldValue = filecode
        } else {
          fieldValue = this.state.filecode
        }
        // fieldValue = filecode.replace(/[^1-9][^0-9]/g, "");
        break;
      case "fileformat":
        fieldValue = event.target.value;
        break;
      case "delimeter":
        fieldValue = event.target.value;
        break;
      default:
        fieldValue = event.target.value;
        break;
    }
    this.setState({ [field]: fieldValue });
  }

  onBlurHandler = (e) => {
    const { t } = this.props;
    const { errors } = this.state;
    delete errors[e.target.name];
    const { name, value } = e.target;
    // if (e.target.value.toString().trim().length === 0) {
      let errorMsgs = null;
      switch (name) {
        case "billingAccountNumber":
          if (value.toString().trim().length === 0) {
          errorMsgs = t("componentData.USbankfileSettings.billingAccNumberRequired");
        }
          else if (value && value.length > 50) {
            errorMsgs = t('componentData.USbankfileSettings.billingAccNumberMaxLen');
          }
          
          break;
        case "billingAccountCompanyNumber":
          if (value.toString().trim().length === 0) {
          errorMsgs = t("componentData.USbankfileSettings.billingAccCompanyNumberRequired");}
          else if (value && value.length > 500) {
            errorMsgs = t('componentData.USbankfileSettings.billingAccCompanyNumberMaxLen');
          } 
          break;
        case "clientuid":
          if (value.toString().trim().length === 0) {
          errorMsgs = t("componentData.USbankfileSettings.clientUIDRequired");}
          else if (value && value.length > 10) {
            errorMsgs = t('componentData.USbankfileSettings.clientUIDMaxLen');
          } 
          break;
        case "filecode":
          if (value.toString().trim().length === 0) {
         
          errorMsgs = t("componentData.USbankfileSettings.filecodeUIDRequired");}
          else if (value && value.length > 20) {
            errorMsgs = t('componentData.USbankfileSettings.filecodeUIDMaxLen');
          } 
          break;
          case "delimeter":
          if (value.toString().trim().length === 0) {
         
          errorMsgs = t("componentData.USbankfileSettings.delimeterRequired");}
          else if (value && value.length > 10) {
            errorMsgs = t('componentData.USbankfileSettings.delimeterMaxLen');
          } 
          break;
        default:
          errorMsgs = "Field is required";
          errorMsgs = t("componentData.USbankfileSettings.fieldRequired");
          break;
      }

      errors[e.target.name] = errorMsgs;

    // } 
    // else {
    //   errors[e.target.name] = false;
    // }

    this.setState({ errors: { ...errors } });
  }

  validateForm = () => {
    const { t } = this.props;
    const { clientuid, filecode, billingAccountNumber, billingAccountCompanyNumber, errors } = this.state;
    let valid = true;
    if (clientuid === null || clientuid === '') {
      errors['clientuid'] = t("componentData.USbankfileSettings.clientUIDRequired");
      valid = false;
    } 
      else if (clientuid && clientuid.length > 10) {
        errors['clientuid'] = t('componentData.USbankfileSettings.clientUIDMaxLen');
        valid = false;
      } 
    
    if (filecode === null || filecode === '') {
      errors['filecode'] = t("componentData.USbankfileSettings.filecodeUIDRequired");
      valid = false;
    }  else if (filecode && filecode.length > 20) {
      errors['filecode'] = t('componentData.USbankfileSettings.filecodeUIDMaxLen');
      valid = false;
    } 
    if (billingAccountNumber === null || billingAccountNumber === '') {
      errors['billingAccountNumber'] = t("componentData.USbankfileSettings.billingAccNumberRequired");
      valid = false;
    } 
      else if (billingAccountNumber && billingAccountNumber.length > 50) {
        errors['billingAccountNumber'] = t('componentData.USbankfileSettings.billingAccNumberMaxLen');
        valid = false;
      }
      
     
    if (billingAccountCompanyNumber === null || billingAccountCompanyNumber === '') {
      errors['billingAccountCompanyNumber'] = t("componentData.USbankfileSettings.billingAccCompanyNumberRequired");
      valid = false;
    } else if (billingAccountCompanyNumber && billingAccountCompanyNumber.length > 500) {
      errors['billingAccountNumber'] = t('componentData.USbankfileSettings.billingAccNumberMaxLen');
      valid = false;
    }
    this.setState({ errors: { ...errors } });

    return valid;
  }

  saveAllFileSettingsData = async () => {
    const { t } = this.props;

    const { isCsv, isDat, isText, clientuid, filecode,
      delimeter, delimeter1, fileformat,
      billingAccountNumber, billingAccountCompanyNumber, paymentResFile,clientId } = this.state;
    if (this.validateForm()) {
      this.setState({ isBtnClicked: true, errorMsg: null });
      const fileTypeIdArr = [15];
      

      const payloadFileObj = {
        fileTypeIds: fileTypeIdArr||null,
        clientUid: clientuid||null,
        fpid: filecode||null,
        segmentDelimiter: delimeter1||null,
        isPaymentResponse: paymentResFile === 'Y' ? 1 : 0,
        isFileSettingCall: 1,
        clientBillingAccount: billingAccountNumber||null,
        clientBillingBranch: billingAccountCompanyNumber||null,
        staticReportH2hExtension: fileformat||null,
        staticReportH2hDelimiter: delimeter||null
      };

      const payloadGeneralProfile = await trim(payloadFileObj);

      Promise.all([
        updateFileSettingsData(clientId, payloadGeneralProfile)
      ]).then((response) => {
        this.setState({ isBtnClicked: false });
        if (response[0].error) {
          this.setState({
            errorMsg: typeof response[0].message === "string" ? response[0].message : t("componentData.USbankfileSettings.unknownErr"),
            variant: "error"
          });
        } else {
          if (this.props.isOnboarding) {
            this.props.history.push(
              `${config.baseName}/onboard/remittance?id=${clientId}`
            );
          } else {
            this.setState({
              errorMsg: response[0].message,
              variant: "success",
            });
          }
        }
      })
        .catch((error) => {
          this.setState({
            isBtnClicked: false,
            errorMsg: typeof error === "string" ? error : t("componentData.USbankfileSettings.unknownErr"),
            variant: "error"
          });
        });
    }
  };

  onChangeCheckboxHandler = (event, checked) => {
    const newValue = checked ? 1 : 0;
    const { name } = event.target;
    this.setState({ [name]: parseInt(newValue) });
  };

  render() {
    const { t } = this.props;
    const { clientId,
      isLoading,
      showBanner,
      isBtnClicked,
      errorMsg,
      variant,
      isCsv,
      isDat,
      isText,
      filecode,
      clientuid,
      fileformat,
      delimeter,
      delimeter1,
      billingAccountNumber,
      billingAccountCompanyNumber,
      paymentResFile,
      errors } = this.state;
    const { classes, isOnboarding,user } = this.props;
    if (isLoading) {
      return (
        <Paper display="flex" className={classes.root1} elevation={1} style={{ marginTop: !isOnboarding && 0 }}>
          <Box display="flex" p={3} justifyContent="center" alignItems="center">
            <CircularProgress color="primary" />
          </Box>
        </Paper>
      );
    }
    const isSettingFilesEditEnabled = this.props.isOnboarding
    ? true
    : (user.userRoles &&
      user.userRoles.includes(
        accessRights["SETTINGS_FILES_SETTINGS_EDIT"]
      )) ||
    false;
    return (
      <>
        {isOnboarding && isSettingFilesEditEnabled && showBanner && (
          <Grid item xs={12} className={classes.importText}>
            <ImportParentPaymentDetails
              onConfirm={this.importParentsData}
              onCancel={() => {
                this.setState({
                  showBanner: false,
                });
              }}
            />
          </Grid>
        )}

        <>
          <Paper display="flex" className={classes.root1} elevation={1} style={{ marginTop: !isOnboarding && 0 }}>
            <Grid item xs={12} spacing={5}>
              <Typography className={`${classes.genralTitleBold} ${classes.mtTypo}`} style={{ marginTop: '0' }}>
                {t("componentData.USbankfileSettings.PaymentFileSetting")}:
              </Typography>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h5" component="h5" className={classes.bold}>
                  {t("componentData.USbankfileSettings.PaymentFileFormat")}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={4} className={classes.checkboxStyle}>
              <Grid item xs={3} sm={3}>
                <Box className={classes.kboxStyle}>
                  <FormControlLabel
                    aria-label="Payment file format"
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    control={
                      <Checkbox
                        name={'isCsv'}
                        checked={isCsv === 1 ? true : false}
                        onChange={this.onChangeCheckboxHandler}
                        disabled={true}
                        icon={
                          <RadioButtonUncheckedIcon
                            style={{
                              color: "#fff", height: "18px",
                              width: "18px",
                            }}
                          />
                        }
                        checkedIcon={
                          <img
                            className={classes.checkClass}
                            src={require(`~/assets/icons/checkTick.svg`)}
                            alt=""
                          />
                        }
                        label={t("componentData.USbankfileSettings.csv")}
                      />
                    }
                    label={t("componentData.USbankfileSettings.csv")}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} sm={3}>
                <Box className={classes.kboxStyle}>
                  <FormControlLabel
                    aria-label="Acknowledge"
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    control={
                      <Checkbox
                        name={'isDat'}
                        checked={isDat === 1 ? true : false}
                        onChange={this.onChangeCheckboxHandler}
                        disabled={true}
                        icon={
                          <RadioButtonUncheckedIcon
                            style={{
                              color: "#fff", height: "18px",
                              width: "18px",
                            }}
                          />
                        }
                        checkedIcon={
                          <img
                            className={classes.checkClass}
                            src={require(`~/assets/icons/checkTick.svg`)}
                            alt=""
                          />
                        }
                      />
                    }
                    label={t("componentData.USbankfileSettings.dat")}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} sm={3}>
                <Box className={classes.kboxStyle}>
                  <FormControlLabel
                    aria-label="Acknowledge"
                    onClick={(event) => event.stopPropagation()}
                    onFocus={(event) => event.stopPropagation()}
                    control={
                      <Checkbox
                        name={'isText'}
                        checked={(isText === 1 || isText === true) ? true : false}
                        onChange={this.onChangeCheckboxHandler}
                        disabled={true}
                        icon={
                          <RadioButtonUncheckedIcon
                            style={{
                              color: "#fff", height: "18px",
                              width: "18px",
                            }}
                          />
                        }
                        checkedIcon={
                          <img
                            className={classes.checkClass}
                            src={require(`~/assets/icons/checkTick.svg`)}
                            alt=""
                          />
                        }
                      />
                    }
                    label={t("componentData.USbankfileSettings.text")}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h5" component="h5" className={classes.bold}>
                  {t("componentData.USbankfileSettings.FileNaming")}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={6} sm={6}>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      name="clientuid"
                      label={t("componentData.USbankfileSettings.clientUIDLabel")}
                      variant="outlined"
                      value={clientuid}
                      onChange={(e) => this.onChangeHandler('clientuid', e)}
                      inputProps={{
                        maxLength: 10,
                      }}
                      required
                      onBlur={this.onBlurHandler}
                      error={errors?.clientuid || false}
                      helperText={errors?.clientuid || ''}
                      disabled={!isSettingFilesEditEnabled}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      select
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      name="delimeter1"
                      label={t("componentData.USbankfileSettings.delimeterLabel")}
                      variant="outlined"
                      onChange={(e) => this.onChangeHandler('delimeter1', e)}
                      value={delimeter1}
                      disabled={!isSettingFilesEditEnabled}
                    >
                      <MenuItem value={','}>{t("componentData.USbankfileSettings.comma")}</MenuItem>
                      <MenuItem value={'|'}>{t("componentData.USbankfileSettings.pipe")}</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6} sm={6}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="filecode"
                  label={t("componentData.USbankfileSettings.fileCodeLabel")}
                  variant="outlined"
                  value={filecode || ""}
                  onChange={(e) => this.onChangeHandler('filecode', e)}
                  inputProps={{ maxLength: 20 }}
                  required
                  onBlur={this.onBlurHandler}
                  error={errors?.filecode || false}
                  helperText={errors?.filecode || ''}
                  disabled={!isSettingFilesEditEnabled}
                />
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <Typography variant="h5" component="h5" className={classes.bold}>
                  {t("componentData.USbankfileSettings.paymentResFile")}
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <ToggleButtonGroup
                  className={classes.fileBtnGroup}
                  size="small"
                  value={paymentResFile}
                  exclusive
                  onChange={this.handlePaymentFile}
                  aria-label="File payment response"
                  disabled={!isSettingFilesEditEnabled}
                >
                  <ToggleButton value="Y" aria-label="left aligned">
                    {t("componentData.USbankfileSettings.yes")}
                  </ToggleButton>
                  <ToggleButton value="N" aria-label="centered">
                    {t("componentData.USbankfileSettings.no")}
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>

            <Grid container item direction="row"  >
              <Grid item xs={12} spacing={5}>
                <Typography className={`${classes.genralTitleBold} ${classes.mtTypo}`}>
                  {t("componentData.USbankfileSettings.reportSetting")}:
                </Typography>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={6}>
                  <TextField
                    select
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="file format"
                    label={t("componentData.USbankfileSettings.fileFormatLabel")}
                    variant="outlined"
                    onChange={(e) => this.onChangeHandler('fileformat', e)}
                    value={fileformat}
                    required
                  >
                    <MenuItem value={'.csv'}>{t("componentData.USbankfileSettings.csv")}</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <TextField
                    select
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    name="delimeter"
                    label={t("componentData.USbankfileSettings.delimeterLabel")}
                    variant="outlined"
                    onChange={(e) => this.onChangeHandler('delimeter', e)}
                    value={delimeter}
                    required
                    disabled={!isSettingFilesEditEnabled}
                  >
                    <MenuItem value={','}>{t("componentData.USbankfileSettings.comma")}</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            <Grid container item direction="row"  >
              <Grid item xs={12} spacing={5}>
                <Typography className={`${classes.genralTitleBold} ${classes.mtTypo}`}>
                  {t("componentData.USbankfileSettings.billingFeed")}:
                </Typography>
              </Grid>
              <Grid container spacing={4}>
                <Grid item xs={6} >
                  <Box>
                    <TextField
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      name="billingAccountNumber"
                      label={t("componentData.USbankfileSettings.billingAccountNumberLabel")}
                      variant="outlined"
                      value={billingAccountNumber || ''}
                      required
                      inputProps={{ maxLength: 50 }}
                      onPaste={(e) => e.preventDefault()}
                      onChange={(event) => this.onChangeHandler("billingAccountNumber", event)}
                      onBlur={this.onBlurHandler}
                      error={errors?.billingAccountNumber || false}
                      helperText={errors?.billingAccountNumber || ''}
                      disabled={!isSettingFilesEditEnabled}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} >
                  <Box>
                    <TextField
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      name="billingAccountCompanyNumber"
                      label={t("componentData.USbankfileSettings.billingAccountCompanyNumberLabel")}
                      variant="outlined"
                      value={billingAccountCompanyNumber || ''}
                      required
                      inputProps={{ maxLength: 500 }}
                      onChange={(event) => this.onChangeHandler("billingAccountCompanyNumber", event)}
                      onBlur={this.onBlurHandler}
                      error={errors?.billingAccountCompanyNumber || false}
                      helperText={errors?.billingAccountCompanyNumber || ''}
                      disabled={!isSettingFilesEditEnabled}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <Grid container item direction="row" >
            {isBtnClicked ?
              <Grid container direction="row" alignItems="center" justifyContent="center" >
                <Box display="flex" p={3} justifyContent="center" alignItems="center">
                  <CircularProgress color="primary" />
                </Box>
              </Grid> :
              <Grid container direction="row" alignItems="center" >
                {isOnboarding && <Grid container item xs={6} justifyContent="flex-end">
                  <Box m={2} mb={5}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={(e) =>
                        this.props.history.push(
                          `${config.baseName}/onboard/payment?id=${clientId}`
                        )}
                      className={`${classes.nextBtn}`}
                    >
                      {t("componentData.USbankfileSettings.Back")}
                    </Button>
                  </Box>
                </Grid>}
                <Grid container item xs={isOnboarding ? 6 : 12} justifyContent={!isOnboarding ? "center" : "flex-start"}>
                  <Box m={2} mb={5}>
                  {isSettingFilesEditEnabled && (
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={this.saveAllFileSettingsData}
                      className={`${classes.nextBtn}`}
                    >
                      {isOnboarding
                        ? t("componentData.fileSettings.Next")
                        : t("componentData.fileSettings.Save")}
                    </Button>)}
                  </Box>
                </Grid>
              </Grid>
            }
          </Grid>
        </>
        {errorMsg &&
          <Notification
            variant={variant}
            message={errorMsg}
            handleClose={() => { this.setState({ errorMsg: null }) }}
          />}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.client, ...state.user }))(
    withStyles(styles)(FileSettings)
  )
);
