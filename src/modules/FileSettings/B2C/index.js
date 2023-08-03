import React, { Component } from "react";

import { Button } from "~/components/Forms";
import {
  Paper,
  Grid,
  Box,
  CircularProgress,
  FormGroup,
  FormControl,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox, FormHelperText
} from "@material-ui/core";
import { TextField, CheckboxGroup } from "~/components/Forms";
import { withStyles } from "@material-ui/styles";
import IncomingPaymentFileTypeSelector from "~/modules/IncomingPaymentFileTypeSelector";
import ImportParentPaymentFileDetails from "~/modules/ImportParentPaymentFileDetails";
import Notification from "~/components/Notification";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  b2cFetchFileTypes,
  b2cFetchNamingConvention,
  b2cFetchSelectedFileTypes,
  b2cUpdatePaymentFileTypes,
  b2cUpdateFileTypes,
  b2cSettingUpdateFileTypes,
  addSettingCampaignFile,
  fetchCampaignInfo,
  addCampaignFile,
} from "~/redux/helpers/filesettings";
import {
  saveB2CPermissionsData,
  getB2CGeneralSettingConfig,
} from "~/redux/helpers/settings";
import styles from "./styles";
import config from "~/config";
import trim from "deep-trim-node";
import InfoIcon from "@material-ui/icons/Info";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { fetchB2CClientData } from "~/redux/actions/client";
import { accessRights } from "~/config/accessRights";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

class FileSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clientId: null,
      parentId: null,
      isHippa: null,
      isLoading: true,
      isISOselected: false,
      clientEmail: null,
      delimiters: [
        { label: "|", value: "|" },
        { label: ",", value: "," },
      ],
      fileFormat: [
        { label: ".dat", value: ".dat" },
        { label: ".txt", value: ".txt" },
        { label: ".csv", value: ".csv" },
      ],
      validation: {},
      incomingPaymentFileType: [],
      selectedFileTypes: [],
      selectedPaymentMethod: [],
      namingConvention: {},
      citiConnectId: null,
      fileIdentifier: null,
      campaignDelimiter: null,
      reportDelimiter: null,
      selectedFormat: null,
      reportFormat: null,
      bessId: "",
      clientBillingBranch: "",
      clientBillingAccount: "",
      showResponseFile: 1,
      fileLevel: true,
      transactionLevel: true,
      paymentStatus: true,
      processing: false,
      error: null,
      variant: "error",
      OmniBusAccountNumber: "",
      EFTAccountNumber: "",
      isCampaignFileShow: 0
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
        clientEmail: this.props.clientInfo.rows[0].emailAddress,
        isHIPAA: this.props.client.clientInfo.rows[0].isHippa
          ? this.props.client.clientInfo.rows[0].isHippa
          : 0,
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
                clientEmail: clientData.emailAddress
                  ? clientData.emailAddress
                  : "",
                parentId: clientData.parentId,
                isHIPAA: clientData.isHippa ? clientData.isHippa : 0,
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
    Promise.all([
      b2cFetchFileTypes(),
      b2cFetchSelectedFileTypes(id, flag),
      b2cFetchNamingConvention(id, flag),
      fetchCampaignInfo(id, flag),
      getB2CGeneralSettingConfig(id),
    ])
      .then(
        ([
          fileTypesInfo,
          selectedFileTypesInfo,
          namingConventionInfo,
          campaignInfo,
          settingsData,
        ]) => {
          const selectedFileTypes =
            selectedFileTypesInfo.data.length === 0
              ? [11]
              : selectedFileTypesInfo.data;
          const {
            isPaymentResponse,
            isFileLevelAck,
            isTransactionLevelAck,
            isFinalPaymentStatusAck,
            sdr_accountnumber,
            sdr_eft_accountnumber,
            isCampaignFileOpted
          } = settingsData.data;

          this.setState({
            incomingPaymentFileType: fileTypesInfo.data.map((item) =>
              selectedFileTypes.includes(item.id)
                ? {
                  ...item,
                  checked: true,
                  label: item.fileName,
                  selected: true,
                }
                : {
                  ...item,
                  checked: false,
                  label: item.fileName,
                  selected: false,
                }
            ),
            selectedFileTypes: selectedFileTypes,
            citiConnectId:
              campaignInfo.data && campaignInfo.data.citiConnectID
                ? campaignInfo.data.citiConnectID
                : "",
            fileIdentifier:
              campaignInfo.data && campaignInfo.data.fileIdentifier
                ? campaignInfo.data.fileIdentifier
                : "",
            campaignDelimiter:
              campaignInfo.data && campaignInfo.data.fileDelimiter
                ? campaignInfo.data.fileDelimiter
                : "",
            selectedFormat:
              campaignInfo.data && campaignInfo.data.fileExtension
                ? campaignInfo.data.fileExtension
                : "",
            namingConvention:
              namingConventionInfo.data !== null
                ? namingConventionInfo.data
                : {},
            bessId:
              settingsData.data && settingsData.data.bessId
                ? settingsData.data.bessId
                : "",
            clientBillingBranch:
              settingsData.data && settingsData.data.clientBillingBranch
                ? settingsData.data.clientBillingBranch
                : "",
            clientBillingAccount:
              settingsData.data && settingsData.data.clientBillingAccount
                ? settingsData.data.clientBillingAccount
                : "",
            reportDelimiter: settingsData?.data?.staticReportH2hDelimiter
              ? settingsData.data.staticReportH2hDelimiter
              : null,
            reportFormat: settingsData?.data?.staticReportH2hExtension
              ? settingsData.data.staticReportH2hExtension
              : null,
              showResponseFile: isPaymentResponse === 0 ? isPaymentResponse : 1,
              isCampaignFileShow: isCampaignFileOpted === 0 ? isCampaignFileOpted : 1,
              fileLevel: isFileLevelAck === 0 ? Boolean(isFileLevelAck) : true,
            transactionLevel:
              isTransactionLevelAck === 0
                ? Boolean(isTransactionLevelAck)
                : true,
            paymentStatus:
              isFinalPaymentStatusAck === 0
                ? Boolean(isFinalPaymentStatusAck)
                : true,
            isLoading: false,
            OmniBusAccountNumber: sdr_accountnumber || "",
            EFTAccountNumber: sdr_eft_accountnumber || "",
    
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

  handlePaymentFileTypeChange = (e, index, isChecked) => {
    const { incomingPaymentFileType } = this.state;
    this.setState({
      incomingPaymentFileType: incomingPaymentFileType.map(
        (paymentFileType, i) =>
          index === i
            ? {
              ...paymentFileType,
              selected: isChecked,
            }
            : paymentFileType
      ),
    });
  };
  validateForm = () => {
    const {
      namingConvention,
      citiConnectId,
      fileIdentifier,
      campaignDelimiter, reportDelimiter,
      selectedFormat, reportFormat, showResponseFile, fileLevel, transactionLevel, isCampaignFileShow
    } = this.state;

    const { t } = this.props;

    let valid = true;
    let validation = {};
    const convention = {
      clientUid: "Client ID",
      fpid: "File Profile ID",
    };
    for (const [key, value] of Object.entries(convention)) {
      let obj = Object.keys(namingConvention).find((item) => item === key);
      if (
        typeof obj === "undefined" ||
        namingConvention[obj] === null ||
        namingConvention[obj].toString().trim().length == 0
      ) {
        valid = false;
        validation[key] = t("componentData.fileSettings.mandatoryField", {
          fieldName: value,
        });
      } else if (
        namingConvention[obj].toString().trim().replace(/^0+/, "").length === 0
      ) {
        valid = false;
        validation[key] = t("componentData.clientVarification.validField");
      }
    }
    if (isCampaignFileShow == 1 && (citiConnectId === null || citiConnectId.toString().trim().length == 0)) {
      valid = false;
      validation["citiConnectId"] = t(
        "componentData.fileSettings.mandatoryField",
        { fieldName: "Client Identifier" }
      );
    }
    if (
      isCampaignFileShow == 1 && (
      fileIdentifier === null ||
      fileIdentifier.toString().trim().length == 0
    )) {
      valid = false;
      validation["fileIdentifier"] = t(
        "componentData.fileSettings.mandatoryField",
        { fieldName: "File Identifier" }
      );
    }
    if (
      isCampaignFileShow == 1 && (
      campaignDelimiter === null ||
      campaignDelimiter.toString().trim().length == 0
    )) {
      valid = false;
      validation["campaignDelimiter"] = t(
        "componentData.fileSettings.mandatoryField",
        { fieldName: "Delimiter" }
      );
    }
    if (
      isCampaignFileShow == 1 && (
      selectedFormat === null ||
      selectedFormat.toString().trim().length == 0
    )) {
      valid = false;
      validation["selectedFormat"] = t(
        "componentData.fileSettings.mandatoryField",
        { fieldName: "File Format" }
      );
    }
    if (
      reportDelimiter === null ||
      reportDelimiter.toString().trim().length == 0
    ) {
      valid = false;
      validation["reportDelimiter"] = t(
        "componentData.fileSettings.mandatoryField",
        { fieldName: "Delimiter" }
      );
    }
    if (
      reportFormat === null ||
      reportFormat.toString().trim().length == 0
    ) {
      valid = false;
      validation["reportFormat"] = t(
        "componentData.fileSettings.mandatoryField",
        { fieldName: "File Format" }
      );
    }
    if (showResponseFile && !fileLevel && !transactionLevel) {
      valid = false;
      validation["fileAckReq"] = t("componentData.fileSettings.errorIsFileAckRequired");
    }
    this.setState({ validation: { ...validation } });
    return valid;
  };
  validateNamingConvention = () => {
    const { namingConvention } = this.state;

    const { t } = this.props;

    let valid = true;
    let validation = {};
    const convention = {
      clientUid: "",
      fpid: "",
    };
    for (const [key] of Object.entries(convention)) {
      let obj = Object.keys(namingConvention).find((item) => item === key);
      if (
        typeof obj !== "undefined" &&
        namingConvention[obj] !== null &&
        namingConvention[obj].toString().trim().length !== 0 &&
        namingConvention[obj].toString().trim().replace(/^0+/, "").length === 0
      ) {
        valid = false;
        validation[key] = t("componentData.clientVarification.validField");
      }
    }
    this.setState({ validation: { ...validation } });
    return valid;
  };
  handleSubmit = (event) => {
    event.preventDefault();
    const { incomingPaymentFileType } = this.state;
    const { t } = this.props;
    let selectedMethods = [];
    incomingPaymentFileType &&
      incomingPaymentFileType.filter((s) => {
        if (s.selected === true) {
          selectedMethods.push(s.id);
        }
      });
    if (selectedMethods.length === 0) {
      this.setState({
        error: t("componentData.fileSettings.incomingFile"),
        variant: "error",
      });
    } else {
      const isValid = this.props.isOnboarding
        ? this.validateNamingConvention()
        : this.validateForm();
      if (isValid) {
        if (this.props.isOnboarding) {
          //Call in onboarding page
          this.handlePaymentFileDetails();
        } else {
          //call in setting page
          this.handleSettingPaymentFileDetails();
        }
      } else {
        this.setState({
          processingUpdate: false,
          error: null,
          variant: null,
        });
      }
    }
  };
  handlePaymentFileDetails = (e) => {
    this.setState(
      {
        processing: true,
      },
      () => {
        const {
          namingConvention,
          citiConnectId,
          fileIdentifier,
          campaignDelimiter,
          selectedFormat,
          reportDelimiter,
          reportFormat,
          clientId,
          selectedFileTypes,
          bessId,
          clientBillingBranch,
          clientBillingAccount,
          showResponseFile,
          fileLevel,
          transactionLevel,
          paymentStatus,
          OmniBusAccountNumber,
          EFTAccountNumber,
          isCampaignFileShow
        } = this.state;
        const { t } = this.props;
        const data = trim({
          fileIdentifier:
            fileIdentifier !== null &&
              fileIdentifier.toString().trim().length === 0
              ? null
              : fileIdentifier,
          fileExtension:
            selectedFormat !== null &&
              selectedFormat.toString().trim().length === 0
              ? null
              : selectedFormat,
          fileDelimiter:
            campaignDelimiter !== null &&
              campaignDelimiter.toString().trim().length === 0
              ? null
              : campaignDelimiter,
          clientId: clientId,
          citiConnectID:
            citiConnectId !== null &&
              citiConnectId.toString().trim().length === 0
              ? null
              : citiConnectId,
        });
        const settingsData = trim({
          bessId:
            bessId !== null && bessId.toString().trim().length === 0
              ? null
              : bessId,
          clientBillingBranch:
            clientBillingBranch !== null &&
              clientBillingBranch.toString().trim().length === 0
              ? null
              : clientBillingBranch,
            staticReportH2hDelimiter:
            reportDelimiter !== null &&
              reportDelimiter.toString().trim().length === 0
              ? null
              : reportDelimiter,
          staticReportH2hExtension:
            reportFormat !== null &&
              reportFormat.toString().trim().length === 0
              ? null
              : reportFormat,
          clientBillingAccount:
            clientBillingAccount !== null &&
              clientBillingAccount.toString().trim().length === 0
              ? null
              : clientBillingAccount,
          isFileSettingCall: 1,
          isPaymentResponse:
            showResponseFile !== null &&
              showResponseFile.toString().trim().length === 0
              ? null
              : showResponseFile,
              isCampaignFileOpted:
            isCampaignFileShow !== null &&
              isCampaignFileShow.toString().trim().length === 0
              ? null
              : isCampaignFileShow,
          isFileLevelAck:
            fileLevel !== null && fileLevel.toString().trim().length === 0
              ? null
              : Number(fileLevel),
          isTransactionLevelAck:
            transactionLevel !== null &&
              transactionLevel.toString().trim().length === 0
              ? null
              : Number(transactionLevel),
          isFinalPaymentStatusAck:
            paymentStatus !== null &&
              paymentStatus.toString().trim().length === 0
              ? null
              : Number(paymentStatus),
          sdr_accountnumber: OmniBusAccountNumber || null,
          sdr_eft_accountnumber: EFTAccountNumber || null,
        });
        Promise.all([
          isCampaignFileShow && addCampaignFile(data),
          b2cUpdatePaymentFileTypes(clientId, {
            fileTypeIds: selectedFileTypes,
          }),
          b2cUpdateFileTypes(clientId, trim(namingConvention)),
          saveB2CPermissionsData(settingsData, clientId),
        ])
          .then((response) => {
            response.find(function (item) {
              if (item.error === true) {
                throw item;
              }
            });
            this.setState({
              processing: false,
            });
            if (this.props.isOnboarding) {
              this.props.history.push(
                `${config.baseName}/onboard/remittance?id=${clientId}`
              );
            } else {
              this.setState({
                // openDialogue: true, //Set true in onboarding
                error: t("componentData.fileSettings.DataSaved"),
                variant: "success",
              });
            }
          })
          .catch((error) => {
            this.setState({
              processing: false,
              error:
                typeof error.message === "string"
                  ? error.message
                  : t("componentData.fileSettings.unknownErr"),
              variant: "error",
            });
          });
      }
    );
  };

  handleSettingPaymentFileDetails = (e) => {
    this.setState(
      {
        processing: true,
      },
      () => {
        const {
          namingConvention,
          citiConnectId,
          fileIdentifier,
          campaignDelimiter,
          selectedFormat,
          clientId,
          selectedFileTypes,
          bessId,
          reportDelimiter,
          reportFormat,
          clientBillingBranch,
          clientBillingAccount,
          showResponseFile,
          fileLevel,
          transactionLevel,
          paymentStatus,
          OmniBusAccountNumber,
          EFTAccountNumber,
          isCampaignFileShow
        } = this.state;
        const { t } = this.props;
        const data = trim({
          fileIdentifier:
            fileIdentifier !== null &&
              fileIdentifier.toString().trim().length === 0
              ? null
              : fileIdentifier,
          fileExtension:
            selectedFormat !== null &&
              selectedFormat.toString().trim().length === 0
              ? null
              : selectedFormat,
          fileDelimiter:
            campaignDelimiter !== null &&
              campaignDelimiter.toString().trim().length === 0
              ? null
              : campaignDelimiter,
          clientId: clientId,
          citiConnectID:
            citiConnectId !== null &&
              citiConnectId.toString().trim().length === 0
              ? null
              : citiConnectId,
        });
        const settingsData = trim({
          bessId:
            bessId !== null && bessId.toString().trim().length === 0
              ? null
              : bessId,
            staticReportH2hDelimiter:
            reportDelimiter !== null &&
              reportDelimiter.toString().trim().length === 0
              ? null
              : reportDelimiter,
          staticReportH2hExtension:
            reportFormat !== null &&
              reportFormat.toString().trim().length === 0
              ? null
              : reportFormat,
          clientBillingBranch:
            clientBillingBranch !== null &&
              clientBillingBranch.toString().trim().length === 0
              ? null
              : clientBillingBranch,
          clientBillingAccount:
            clientBillingAccount !== null &&
              clientBillingAccount.toString().trim().length === 0
              ? null
              : clientBillingAccount,
          isFileSettingCall: 1,
          isPaymentResponse:
            showResponseFile !== null &&
              showResponseFile.toString().trim().length === 0
              ? null
              : showResponseFile,
              isCampaignFileOpted:
              isCampaignFileShow !== null &&
                isCampaignFileShow.toString().trim().length === 0
                ? null
                : isCampaignFileShow,
          isFileLevelAck:
            fileLevel !== null && fileLevel.toString().trim().length === 0
              ? null
              : Number(fileLevel),
          isTransactionLevelAck:
            transactionLevel !== null &&
              transactionLevel.toString().trim().length === 0
              ? null
              : Number(transactionLevel),
          isFinalPaymentStatusAck:
            paymentStatus !== null &&
              paymentStatus.toString().trim().length === 0
              ? null
              : Number(paymentStatus),
          sdr_accountnumber: OmniBusAccountNumber || null,
          sdr_eft_accountnumber: EFTAccountNumber || null,
        });
        Promise.all([
          isCampaignFileShow && addSettingCampaignFile(data),
          b2cUpdatePaymentFileTypes(clientId, {
            fileTypeIds: selectedFileTypes,
          }),
          b2cSettingUpdateFileTypes(clientId, trim(namingConvention)),
          saveB2CPermissionsData(settingsData, clientId),
        ])
          .then((response) => {
            response.find(function (item) {
              if (item.error === true) {
                throw item;
              }
            });
            this.setState({
              processing: false,
              error: t("componentData.fileSettings.DataSaved"),
              variant: "success",
            });
          })
          .catch((error) => {
            this.setState({
              processing: false,
              error:
                typeof error.message === "string"
                  ? error.message
                  : t("componentData.fileSettings.unknownErr"),
              variant: "error",
            });
          });
      }
    );
  };

  handleNamingChange = (e) => {
    const { namingConvention } = this.state;
    this.setState({
      namingConvention: {
        ...namingConvention,
        [e.target.name]:
          e.target.value === "" ? null : e.target.value.replace(/[^0-9A-Za-z_#-]/g, ""),
      },
    });
  };
  onBlurNamingChange = (e) => {
    const { validation } = this.state;
    delete validation[e.target.name];
    if (e.target.value.toString().trim().length === 0) {
      validation[e.target.name] = true;
    }
    this.setState({ validation: { ...validation } });
  };
  handleFieldChange = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;
    let finalValue = "";

    switch (fieldName) {
      case "bessId":
        finalValue = fieldValue.replace(/[^0-9A-Za-z_#-]/g, "");
        break;
      case "OmniBusAccountNumber":
        finalValue = fieldValue.replace(/[^0-9]/g, "");
        break;
      case "EFTAccountNumber":
        finalValue = fieldValue.replace(/[^a-z0-9]/gi, "");
        break;
      default:
        finalValue = event.target.value;
        break;
    }

    this.setState({ [fieldName]: finalValue });
  };
  render() {
    const { t } = this.props;
    const {
      isLoading,
      incomingPaymentFileType,
      processing,
      namingConvention,
      validation,
      showBanner,
      fileIdentifier,
      fileFormat,
      campaignDelimiter,
      reportDelimiter,
      bessId,
      clientBillingBranch,
      clientBillingAccount,
      error,
      delimiters,
      selectedFormat,
      reportFormat,
      showResponseFile,
      citiConnectId,
      variant,
      fileLevel,
      transactionLevel,
      paymentStatus,
      OmniBusAccountNumber,
      EFTAccountNumber,
      isCampaignFileShow
    } = this.state;
    const { classes, user } = this.props;

    if (isLoading) {
      return (
        <Box className="loader-container">
          <CircularProgress color="primary" />
        </Box>
      );
    }

    const isSettingFilesEditEnabled = this.props.isOnboarding
      ? true
      : (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_FILES_SETTINGS_EDIT"]
        )) ||
      false;
    const fieldRequired = this.props.isOnboarding ? false : true;

    return (
      <>
        <Box my={2}>
          {this.props.isOnboarding && isSettingFilesEditEnabled && showBanner && (
            <ImportParentPaymentFileDetails
              onConfirm={this.importParentsData}
              onCancel={() => {
                this.setState({
                  showBanner: false,
                });
              }}
            />
          )}
          <Box mx={6} my={2}>
            <Paper>
              <Box style={{padding: "16px 0px 16px 60px"}}>
                <Grid
                  container
                  item
                  alignItems="flex-start"
                  id="filesettings-list-view"
                  justifyContent="space-between"
                >
                  <Grid container direction="column" xs={6}>
                    <Grid
                      item
                      xs={11}
                      container
                      className={classes.gridContainers}
                    >
                      <Grid item xs={12} className={classes.gridMArgin}>
                        <Typography variant="h1">
                          {t("componentData.fileSettings.PaymentFileSettings")}:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className={classes.gridMArgin}>
                        <Typography variant="caption" className={classes.legend}>
                          {t("componentData.fileSettings.IncomingFileFormat")}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <IncomingPaymentFileTypeSelector
                          paymentFileTypes={incomingPaymentFileType}
                          onChange={this.handlePaymentFileTypeChange}
                          canEdit={isSettingFilesEditEnabled}
                          px={0}
                          flag={false}
                        />
                      </Grid>
                      <Grid
                        container
                        justify="flex-start"
                        direction="row"
                        alignItems="flex-start"
                        className={classes.gridContainers}
                      >
                        <FormControl
                          component="fieldset"
                          className={classes.fieldset}
                        >
                          <Grid item xs={12} className={classes.gridMArgin}>
                            <Typography
                              variant="caption"
                              className={classes.legend}
                            >
                              {t(
                                "componentData.fileSettings.FileNamingConvention"
                              )}
                            </Typography>
                          </Grid>
                          <FormGroup
                            aria-label="position"
                            row={true}
                            justify="space-between"
                          >
                            <Grid container justify="flex-start">
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <Box>
                                  <TextField
                                    color="secondary"
                                    label={t(
                                      "componentData.fileSettings.ClientUID"
                                    )}
                                    value={
                                      namingConvention.clientUid
                                        ? namingConvention.clientUid
                                        : ""
                                    }
                                    fullWidth={true}
                                    autoComplete="off"
                                    variant="outlined"
                                    name="clientUid"
                                    error={
                                      validation.clientUid &&
                                      validation.clientUid.length > 0
                                    }
                                    helperText={validation.clientUid}
                                    inputProps={{
                                      ref: (el) => (this.clientUid = el),
                                      maxLength: 10,
                                    }}
                                    required={fieldRequired}
                                    onChange={(event) =>
                                      this.handleNamingChange(event)
                                    }
                                    disabled={!isSettingFilesEditEnabled}
                                  />
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <Box>
                                  <TextField
                                    color="secondary"
                                    label={t("componentData.fileSettings.fpid")}
                                    error={
                                      validation.fpid &&
                                      validation.fpid.length > 0
                                    }
                                    helperText={validation.fpid}
                                    value={
                                      namingConvention.fpid
                                        ? namingConvention.fpid
                                        : ""
                                    }
                                    name="fpid"
                                    inputProps={{
                                      ref: (el) => (this.fpid = el),
                                      maxLength: 10,
                                    }}
                                    fullWidth={true}
                                    autoComplete="off"
                                    variant="outlined"
                                    required={fieldRequired}
                                    onChange={(event) =>
                                      this.handleNamingChange(event)
                                    }
                                    disabled={!isSettingFilesEditEnabled}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} className={classes.gridMArgin}>
                                <Box className={classes.contentBackground} py={1}>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                      <Typography
                                        variant="caption"
                                        className={classes.legend}
                                      >
                                        {t(
                                          "componentData.fileSettings.PaymentResponseSettings"
                                        )}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={3} spacing={2}>
                                      <CheckboxGroup
                                        options={[
                                          {
                                            label: t(
                                              "componentData.responseFileSett.Yes"
                                            ),
                                            value: 1,
                                          },
                                          {
                                            label: t(
                                              "componentData.responseFileSett.No"
                                            ),
                                            value: 0,
                                          },
                                        ]}
                                        disabled={!isSettingFilesEditEnabled}
                                        onChange={(selectedValue) => {
                                          if (selectedValue.value === 0) {
                                            this.setState({
                                              showResponseFile:
                                                selectedValue.value,
                                              fileLevel: false,
                                              transactionLevel: false,
                                              paymentStatus: false,
                                            });
                                          } else {
                                            this.setState({
                                              showResponseFile:
                                                selectedValue.value,
                                            });
                                          }
                                        }}
                                        selectedOption={showResponseFile}
                                      />
                                    </Grid>
                                  </Grid>
                                </Box>
                                {showResponseFile === 1 && (
                                  <Box py={1.75}>
                                    <Box pt={2}>
                                      {" "}
                                      {t(
                                        "componentData.fileSettings.PaymentFileText"
                                      )}
                                    </Box>
                                    <Box my={1} ml={4}>
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={fileLevel}
                                            onChange={() => {
                                              this.setState({
                                                fileLevel: !fileLevel,
                                              });
                                            }}
                                            disabled={!isSettingFilesEditEnabled}
                                            name="fileLevel"
                                            color="primary"
                                          />
                                        }
                                        label={t(
                                          "componentData.fileSettings.FileLevel"
                                        )}
                                      />
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            checked={transactionLevel}
                                            onChange={() => {
                                              this.setState({
                                                transactionLevel:
                                                  !transactionLevel,
                                              });
                                            }}
                                            disabled={!isSettingFilesEditEnabled}
                                            name="transactionLevel"
                                            color="primary"
                                          />
                                        }
                                        label={t(
                                          "componentData.fileSettings.TransactionLevel"
                                        )}
                                      />
                                    </Box>
                                    {transactionLevel && (
                                      <Box my={1}>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              checked={paymentStatus}
                                              onChange={() => {
                                                this.setState({
                                                  paymentStatus: !paymentStatus,
                                                });
                                              }}
                                              disabled={
                                                !isSettingFilesEditEnabled
                                              }
                                              name="paymentStatus"
                                              color="primary"
                                            />
                                          }
                                          label={t(
                                            "componentData.fileSettings.PaymentStatus"
                                          )}
                                          className={classes.marginRight}
                                        />
                                        <IconButton
                                          color="primary"
                                          component="span"
                                        >
                                          <Tooltip
                                            title={t(
                                              "componentData.fileSettings.nonCDMTooltip"
                                            )}
                                          >
                                            <InfoIcon
                                              fontSize="small"
                                              color="primary"
                                            />
                                          </Tooltip>
                                        </IconButton>
                                        <Box
                                          mx={4}
                                          mb={2}
                                          className={classes.description}
                                        >
                                          {t(
                                            "componentData.fileSettings.PaymentStatusDescription"
                                          )}
                                        </Box>
                                      </Box>
                                    )}
                                    <FormHelperText className={classes.errorText2}>{validation.fileAckReq}</FormHelperText>
                                  </Box>
                                )}
                              </Grid>
                            </Grid>
                          </FormGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={11}
                      container
                      className={classes.gridContainers}
                    >
                      <Grid item xs={12}>
                        <Typography variant="h1">
                          {t("componentData.fileSettings.ReportSettings")}:
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        justify="flex-start"
                        direction="row"
                        alignItems="flex-start"
                        className={classes.gridContainers}
                      >
                        <FormControl
                          component="fieldset"
                          className={classes.fieldset}
                        >
                          <FormGroup
                            aria-label="position"
                            row={true}
                            justify="space-between"
                          >
                            <Grid container justify="flex-start">
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <Box>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="bessId"
                                    label={t(
                                      "componentData.generalSettings.bessId"
                                    )}
                                    variant="outlined"
                                    value={bessId}
                                    onChange={this.handleFieldChange}
                                    inputProps={{ maxLength: 10 }}
                                    error={
                                      validation.bessId &&
                                      validation.bessId.length > 0
                                    }
                                    helperText={validation.bessId || ""}
                                    disabled={!isSettingFilesEditEnabled}
                                  />
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <Box>
                                  <TextField
                                    color="secondary"
                                    fullWidth={true}
                                    select
                                    label={t(
                                      "componentData.fileSettings.Delimiter"
                                    )}
                                    error={
                                      validation.reportDelimiter &&
                                      validation.reportDelimiter.length > 0
                                    }
                                    helperText={validation.reportDelimiter}
                                    value={reportDelimiter || ""}
                                    name="reportDelimiter"
                                    autoComplete="off"
                                    variant="outlined"
                                    required={fieldRequired}
                                    onChange={(event) =>
                                      this.setState({
                                        reportDelimiter: event.target.value,
                                      })
                                    }
                                    disabled={!isSettingFilesEditEnabled}
                                  >
                                    <MenuItem value=" ">
                                      <em>
                                        {t("componentData.fileSettings.Select")}
                                      </em>
                                    </MenuItem>
                                    {delimiters ? (
                                      delimiters.map((option) => (
                                        <MenuItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </MenuItem>
                                      ))
                                    ) : (
                                      <Box
                                        width="100px"
                                        display="flex"
                                        mt={1.875}
                                        justifyContent="center"
                                        alignItems="center"
                                      >
                                        <CircularProgress color="primary" />
                                      </Box>
                                    )}
                                  </TextField>
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <Box>
                                  <TextField
                                    color="secondary"
                                    fullWidth={true}
                                    select
                                    label={t(
                                      "componentData.fileSettings.FileFormat"
                                    )}
                                    error={
                                      validation.reportFormat &&
                                      validation.reportFormat.length > 0
                                    }
                                    helperText={validation.reportFormat}
                                    value={reportFormat || ""}
                                    name="reportFormat"
                                    autoComplete="off"
                                    variant="outlined"
                                    size="medium"
                                    required={fieldRequired}
                                    onChange={(event) =>
                                      this.setState({
                                        reportFormat: event.target.value,
                                      })
                                    }
                                    disabled={!isSettingFilesEditEnabled}
                                  >
                                    <MenuItem value=" ">
                                      <em>
                                        {t("componentData.fileSettings.Select")}
                                      </em>
                                    </MenuItem>
                                    {fileFormat ? (
                                      fileFormat.map((option) => (
                                        option.value === ".txt" ? null :
                                          <MenuItem
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </MenuItem>
                                      ))
                                    ) : (
                                      <Box
                                        width="100px"
                                        display="flex"
                                        mt={1.875}
                                        justifyContent="center"
                                        alignItems="center"
                                      >
                                        <CircularProgress color="primary" />
                                      </Box>
                                    )}
                                  </TextField>
                                </Box>
                              </Grid>
                            </Grid>
                          </FormGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={11}
                      container
                      className={classes.gridContainers}
                    >
                      <Grid item xs={12}>
                        <Typography variant="h1" className={classes.SDRHeading}>
                          {t("componentData.fileSettings.SDRHeading")}
                          <Tooltip
                            title={t("componentData.fileSettings.SDRTooltip")}
                            placement="right-start"
                            arrow
                          >
                            <InfoOutlinedIcon fontSize="small" color="primary" />
                          </Tooltip>
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        justify="flex-start"
                        direction="row"
                        alignItems="flex-start"
                        className={classes.gridContainers}
                      >
                        <FormControl
                          component="fieldset"
                          className={classes.fieldset}
                        >
                          <FormGroup
                            aria-label="position"
                            row={true}
                            justify="space-between"
                          >
                            <Grid container justify="flex-start">
                              <Grid item xs={12} sm={12}>
                                <Box mb={1}>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="OmniBusAccountNumber"
                                    label={t(
                                      "componentData.fileSettings.OmniBusAccountNumber"
                                    )}
                                    variant="outlined"
                                    value={OmniBusAccountNumber}
                                    onChange={this.handleFieldChange}
                                    inputProps={{ maxLength: 10 }}
                                    disabled={!isSettingFilesEditEnabled}
                                  />
                                </Box>
                              </Grid>
                              <Grid item xs={12} sm={12}>
                                <Box>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="EFTAccountNumber"
                                    label={t(
                                      "componentData.fileSettings.EFTAccountNumber"
                                    )}
                                    variant="outlined"
                                    value={EFTAccountNumber}
                                    onChange={this.handleFieldChange}
                                    inputProps={{ maxLength: 10 }}
                                    disabled={!isSettingFilesEditEnabled}
                                  />
                                </Box>
                              </Grid>
                            </Grid>
                          </FormGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container direction="column" xs={6}>
                  <Grid
                      item
                      xs={11}
                      container
                      className={classes.gridContainers}
                    >
                      <Grid item xs={12} className={classes.gridMArgin}>
                        <Typography variant="h1">
                          {t("componentData.fileSettings.CampaignFileSettings")}:
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className={classes.gridMArgin} style={{marginBottom: "10px"}}>
                        <Typography variant="caption" className={classes.legend}>
                          {t("componentData.fileSettings.SendCampaignFile")}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} className={classes.gridMArgin} style={{marginBottom: "20px", padding: "5px"}}>
                        <Typography variant="caption" className={classes.description}>
                          {t("componentData.fileSettings.FileSettingDescription")}
                        </Typography>
                      </Grid>
                      <Grid item xs={3} spacing={2}>
                                      <CheckboxGroup
                                        options={[
                                          {
                                            label: t(
                                              "componentData.responseFileSett.Yes"
                                            ),
                                            value: 1,
                                          },
                                          {
                                            label: t(
                                              "componentData.responseFileSett.No"
                                            ),
                                            value: 0,
                                          },
                                        ]}
                                        
                                        onChange={(selectedValue) => {
                                          this.setState({
                                            isCampaignFileShow: selectedValue.value
                                          });
                                        }}
                                        
                                        selectedOption={isCampaignFileShow}
                                      />
                                    </Grid>
                      {isCampaignFileShow === 1 && (<Grid item xs={12} className={classes.gridMArgin} style={{marginTop: "30px"}}>
                        <Typography variant="caption" className={classes.legend}>
                          {t("componentData.fileSettings.CampaignFileFormat")}
                        </Typography>
                      </Grid>)}

                      {isCampaignFileShow === 1 && (<Grid
                        container
                        justify="flex-start"
                        direction="row"
                        alignItems="flex-start"
                      >
                        <FormControl
                          component="fieldset"
                          className={classes.fieldset}
                        >
                          <FormGroup
                            aria-label="position"
                            row={true}
                            justify="space-between"
                          >
                            <Grid container justify="flex-start">
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                style={{ marginBottom: 16 }}
                              >
                                <TextField
                                  color="secondary"
                                  fullWidth={true}
                                  select
                                  label={t(
                                    "componentData.fileSettings.FileFormat"
                                  )}
                                  error={
                                    validation.selectedFormat &&
                                    validation.selectedFormat.length > 0
                                  }
                                  helperText={validation.selectedFormat}
                                  value={selectedFormat || ""}
                                  name="selectedFormat"
                                  autoComplete="off"
                                  variant="outlined"
                                  size="medium"
                                  required={fieldRequired}
                                  onChange={(event) =>
                                    this.setState({
                                      selectedFormat: event.target.value,
                                    })
                                  }
                                  disabled={!isSettingFilesEditEnabled}
                                >
                                  <MenuItem value=" ">
                                    <em>
                                      {t("componentData.fileSettings.Select")}
                                    </em>
                                  </MenuItem>
                                  {fileFormat ? (
                                    fileFormat.map((option) => (
                                      <MenuItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <Box
                                      width="100px"
                                      display="flex"
                                      mt={1.875}
                                      justifyContent="center"
                                      alignItems="center"
                                    >
                                      <CircularProgress color="primary" />
                                    </Box>
                                  )}
                                </TextField>
                              </Grid>
                            </Grid>
                          </FormGroup>
                          <Grid item xs={12} className={classes.gridMArgin}>
                            <Typography
                              variant="caption"
                              className={classes.legend}
                            >
                              {t(
                                "componentData.fileSettings.FileNamingConvention"
                              )}
                            </Typography>
                          </Grid>
                          <FormGroup
                            aria-label="position"
                            row={true}
                            justify="space-between"
                          >
                            <Grid container justify="flex-start">
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <Box>
                                  <TextField
                                    color="secondary"
                                    label={t(
                                      "componentData.fileSettings.ClientIdentifier"
                                    )}
                                    value={citiConnectId || ""}
                                    name="citiConnectId"
                                    fullWidth={true}
                                    autoComplete="off"
                                    variant="outlined"
                                    error={
                                      validation.citiConnectId &&
                                      validation.citiConnectId.length > 0
                                    }
                                    helperText={validation.citiConnectId}
                                    inputProps={{
                                      ref: (el) => (this.citiConnectId = el),
                                      maxLength: 10,
                                    }}
                                    required={fieldRequired}
                                    onChange={(event) =>
                                      this.setState({
                                        citiConnectId: event.target.value,
                                      })
                                    }
                                    disabled={!isSettingFilesEditEnabled}
                                  />
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <Box>
                                  <TextField
                                    color="secondary"
                                    label={t(
                                      "componentData.fileSettings.FileIdentifier"
                                    )}
                                    error={
                                      validation.fileIdentifier &&
                                      validation.fileIdentifier.length > 0
                                    }
                                    helperText={validation.fileIdentifier}
                                    value={fileIdentifier || ""}
                                    name="fileIdentifier"
                                    fullWidth={true}
                                    autoComplete="off"
                                    variant="outlined"
                                    inputProps={{
                                      maxLength: 40,
                                    }}
                                    required={fieldRequired}
                                    onChange={(event) =>
                                      this.setState({
                                        fileIdentifier: event.target.value,
                                      })
                                    }
                                    disabled={!isSettingFilesEditEnabled}
                                  />
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={12}
                                className={classes.gridItem}
                              >
                                <Box>
                                  <TextField
                                    color="secondary"
                                    fullWidth={true}
                                    select
                                    label={t(
                                      "componentData.fileSettings.Delimiter"
                                    )}
                                    error={
                                      validation.campaignDelimiter &&
                                      validation.campaignDelimiter.length > 0
                                    }
                                    helperText={validation.campaignDelimiter}
                                    value={campaignDelimiter || ""}
                                    name="campaignDelimiter"
                                    autoComplete="off"
                                    variant="outlined"
                                    required={fieldRequired}
                                    onChange={(event) =>
                                      this.setState({
                                        campaignDelimiter: event.target.value,
                                      })
                                    }
                                    disabled={!isSettingFilesEditEnabled}
                                  >
                                    <MenuItem value=" ">
                                      <em>
                                        {t("componentData.fileSettings.Select")}
                                      </em>
                                    </MenuItem>
                                    {delimiters ? (
                                      delimiters.map((option) => (
                                        <MenuItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </MenuItem>
                                      ))
                                    ) : (
                                      <Box
                                        width="100px"
                                        display="flex"
                                        mt={1.875}
                                        justifyContent="center"
                                        alignItems="center"
                                      >
                                        <CircularProgress color="primary" />
                                      </Box>
                                    )}
                                  </TextField>
                                </Box>
                              </Grid>
                            </Grid>
                          </FormGroup>
                        </FormControl>
                      </Grid>)}
                    </Grid>
                    <Grid
                      xs={11}
                      container
                      className={classes.gridContainers}
                    >
                      <Grid item xs={12}>
                        <Typography variant="h1">
                          {t("componentData.generalSettings.BillingFeedSettings")}
                          :
                        </Typography>
                      </Grid>
                      <Grid
                        container
                        justify="flex-start"
                        direction="row"
                        alignItems="flex-start"
                        className={classes.gridContainers}
                      >
                        <FormControl
                          component="fieldset"
                          className={classes.fieldset}
                        >
                          <FormGroup
                            aria-label="position"
                            row={true}
                            justify="space-between"
                          >
                            <Grid container justify="flex-start">
                              <Grid
                                item
                                xs={6}
                                sm={6}
                                className={classes.gridItem}
                                style={{ paddingRight: "10px" }}
                              >
                                <Box>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="clientBillingBranch"
                                    label={t(
                                      "componentData.fileSettings.BranchCode"
                                    )}
                                    variant="outlined"
                                    value={clientBillingBranch}
                                    onChange={this.handleFieldChange}
                                    inputProps={{ maxLength: 50 }}
                                    error={
                                      validation.clientBillingBranch &&
                                      validation.clientBillingBranch.length > 0
                                    }
                                    helperText={
                                      validation.clientBillingBranch || ""
                                    }
                                    disabled={!isSettingFilesEditEnabled}
                                  />
                                </Box>
                              </Grid>
                              <Grid
                                item
                                xs={6}
                                sm={6}
                                className={classes.gridItem}
                              >
                                <Box>
                                  <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="clientBillingAccount"
                                    label={t(
                                      "componentData.fileSettings.AccountNumber"
                                    )}
                                    variant="outlined"
                                    value={clientBillingAccount}
                                    onChange={this.handleFieldChange}
                                    inputProps={{ maxLength: 50 }}
                                    error={
                                      validation.clientBillingAccount &&
                                      validation.clientBillingAccount.length > 0
                                    }
                                    helperText={
                                      validation.clientBillingAccount || ""
                                    }
                                    disabled={!isSettingFilesEditEnabled}
                                  />
                                </Box>
                              </Grid>
                            </Grid>
                          </FormGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Box my={4} className={`button-container`}>
              {processing ? (
                <CircularProgress color="primary" />
              ) : (
                <Box mx={2}>
                  {isSettingFilesEditEnabled && (
                    <Button
                      type="submit"
                      fullWidth={false}
                      variant="contained"
                      color="primary"
                      onClick={this.handleSubmit}
                    >
                      {this.props.isOnboarding
                        ? t("componentData.fileSettings.Next")
                        : t("componentData.fileSettings.Save")}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {error && (
          <Notification
            variant={variant}
            message={error}
            handleClose={() => {
              this.setState({ error: false });
            }}
          />
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.client, ...state.user }))(
    withStyles(styles)(FileSettings)
  )
);
