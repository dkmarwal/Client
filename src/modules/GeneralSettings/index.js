import React from "react";
import {
  Paper,
  TextField,
  Box,
  FormControlLabel,
  Grid,
  Checkbox,
  Button,
  CircularProgress,
  FormHelperText,
  Tooltip,
} from "@material-ui/core";
import {
  fetchGeneralSettingsPermissions,
  fetchLookUpforPermissions,
  fetchFileTypes,
  savePermissionsData,
  getGeneralSettingConfig,
} from "~/redux/helpers/settings";
import "./styles.scss";
import { connect } from "react-redux";

import Notification from "~/components/Notification";
import { withTranslation } from "react-i18next";
import { accessRights } from "~/config/accessRights";
import InfoIcon from '@material-ui/icons/Info';
import { PayerTypes, MaskedCardNumber } from '~/config/entityTypes';

class GeneralSettings extends React.Component {
  state = {
    savingData: false,
    dialogMessage: "",
    isDialogActive: false,
    // reconciliationReportTime: "",
    // reportFileFormat: "",
    isPaymentDecisonEngine: false,
    isSupplierPlatformTnC: false,
    isSupplierProfileAutoApprovals: false,
    isSupplierRemitToIDMapping: false,
    isPayeeUpdateAllowed: false,
    checkedList: [],
    fileTypes: [],
    list: [],
    permissionList: [],
    validation: {},
    isEnableCheckswithCDM: false,
    variant: "",
    isPayeePaymentUpdateAllowed: false,
    canApprovePayeeTaxId: false,
    canApprovePayeePayment: false,
    canApprovePayeeCompanyName: false,
    isDebitAccountNotConfig: false,
    isPayeeIdNotMatching: false,
    overwriteIncomingPaymentType: false,
    debitAccountConfigPermission: null,
    activePayeePermission: null,
    ddDays: 0,
    vcaMaskNumber: "0",
    buyerId: null,
    pickEmailFromPayee: false
  };
  
  componentDidMount() {
    this.getPermissionList();
    this.getGeneralSettingConfig();
  }

  getGeneralSettingConfig() {
    const clientId = this.props.user.userData.portalProfileId;
    getGeneralSettingConfig(clientId).then((res) => {
      if (res.error) {
        this.setDialogMessage(true, res.message, "error");
        return false;
      }
      this.setState({ ...res.data, ddDays:res.data.duplicatePaymentCheckDays, vcaMaskNumber:res?.data?.vcaMaskNumber || "0" });
    });
  }

  validateGeneralSettings() {
    const { isEnableCheckswithCDM, isDebitAccountNotConfig, isPayeeIdNotMatching, ddDays, vcaMaskNumber,
      buyerId } = this.state;
    // //console.log(this.state.reconciliationReportTime.match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/));
    const errorText = {};
    let valid = true;
    const { user } = this.props;
    const payerTypeId = user.userData.payerTypeId;

    // let obj = Object.keys(namingConvention).find((item) => item === key);
    // if (!this.state["reportFileFormat"] || this.state["reportFileFormat"].toString().trim().length === 0) {
    //     valid = false;
    //     errorText["reportFileFormat"] = "You must select report file format.";
    // }
    // if (!this.state["reconciliationReportTime"] || this.state["reconciliationReportTime"].toString().trim().length === 0 || (this.state["reconciliationReportTime"] && this.state["reconciliationReportTime"].toString().trim().match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null)) {
    //     valid = false;
    //     errorText["reconciliationReportTime"] = "Enter a valid time value. (HH:mm:ss)";
    // }
    
    if(ddDays){
      if(ddDays == 0){
        valid = false;
        errorText["ddDays"] = this.props.t('componentData.generalSettings.ddDaysErr');
      }
    }

    if(vcaMaskNumber && parseInt(vcaMaskNumber) > 16){
      valid = false;
      errorText["vcaMaskNumber"] = this.props.t('componentData.generalSettings.vcaMaskNumberErr');
    }

    if (isEnableCheckswithCDM) {
      if (!isDebitAccountNotConfig && !isPayeeIdNotMatching) {
        valid = false;
        errorText["enableCheckWithCDMError"] = "Select at least one option.";
      }
    }

    if (payerTypeId == PayerTypes.CARDS) {
      if(buyerId == null || buyerId == ''){
        valid = false;
        errorText["buyerId"] = this.props.t('componentData.generalSettings.buyerIdErr');
      }
    }

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  }

  prepareChecks() {
    const {
      permissionList,
      checkedList,
      isPayeeUpdateAllowed,
      isPayeePaymentUpdateAllowed,
      canApprovePayeeCompanyName,
      canApprovePayeePayment,
      canApprovePayeeTaxId,
    } = this.state;
    let debitAccountConfigPermission = null;
    let activePayeePermission = null;
    let newPermissionList =
      permissionList &&
      permissionList.map((permission) => {
        if (permission.id === 262144) {
          debitAccountConfigPermission = permission;
        }
        if (permission.id === 32768) {
          activePayeePermission = permission;
        }
        if (permission.flags && permission.flags.length > 0) {
          permission.flags.map((innerPermission) => {
            if (checkedList && checkedList.indexOf(innerPermission.id) !== -1) {
              innerPermission["isChecked"] = true;
            } else {
              innerPermission["isChecked"] = false;
            }
            if (innerPermission.id === 64) {
              innerPermission["isChecked"] = isPayeeUpdateAllowed
                ? true
                : false;
            }
            if (innerPermission.id === 256) {
              innerPermission["isChecked"] = isPayeePaymentUpdateAllowed
                ? true
                : false;
            }
            if (innerPermission.id === 8192) {
              innerPermission["isChecked"] = canApprovePayeePayment
                ? true
                : false;
            }
            if (innerPermission.id === 2048) {
              innerPermission["isChecked"] = canApprovePayeeTaxId
                ? true
                : false;
            }
            if (innerPermission.id === 512) {
              innerPermission["isChecked"] = canApprovePayeeCompanyName
                ? true
                : false;
            }
          });
          permission["isChecked"] = permission.flags.some(
            (item) => item["isChecked"]
          );
        }

        if (checkedList && checkedList.indexOf(permission.id) !== -1) {
          permission["isChecked"] = true;
        } else {
          permission["isChecked"] = permission.flags
            ? permission.flags.some((item) => item["isChecked"])
            : false;
        }
        return permission;
      });
    const isPayeeIdNotMatching =
      checkedList && checkedList.indexOf(32768) !== -1 ? true : false;
    const isDebitAccountNotConfigured =
      checkedList && checkedList.indexOf(262144) !== -1 ? true : false;
    const overwriteIncomingPaymentType =
      checkedList && checkedList.indexOf(131072) !== -1 ? true : false;
    const isPaymentDecisonEngine =
      isPayeeIdNotMatching ||
      isDebitAccountNotConfigured ||
      overwriteIncomingPaymentType;
    newPermissionList = newPermissionList.map((p) => {
      if (p.id === 131072) {
        if (isPaymentDecisonEngine) {
          p["showCheckBox"] = true;
        } else {
          p["showCheckBox"] = false;
        }
      }
      return p;
    });
    this.setState({
      permissionList: newPermissionList || [],
      isPayeeIdNotMatching: isPayeeIdNotMatching,
      isDebitAccountNotConfig: isDebitAccountNotConfigured,
      debitAccountConfigPermission: debitAccountConfigPermission,
      activePayeePermission: activePayeePermission,
      isPaymentDecisonEngine: isPaymentDecisonEngine,
      isEnableCheckswithCDM:
        isPayeeIdNotMatching || isDebitAccountNotConfigured,
      overwriteIncomingPaymentType: overwriteIncomingPaymentType,
    });
  }

  getPermissionList() {
    const clientId = this.props.user.userData.portalProfileId;
    fetchLookUpforPermissions().then((res) => {
      fetchGeneralSettingsPermissions(clientId).then((response) => {
        this.setState(
          {
            permissionList: res["data"].rows || [],
            checkedList: response["data"] || [],
          },
          () => {
            this.prepareChecks();
          }
        );
      });
    });
  }

  getFileTypes() {
    fetchFileTypes().then((response) => {
      this.setState({ fileTypes: response.data.ediPaymentFile });
    });
  }

  setIdBasedFlags = (id, event) => {
    switch (id) {
      case 64:
        this.setState({
          isPayeeUpdateAllowed: event.target.checked,
        });
        break;
      case 256:
        this.setState({
          isPayeePaymentUpdateAllowed: event.target.checked,
        });
        break;
      case 8192:
        this.setState({
          canApprovePayeePayment: event.target.checked,
        });
        break;
      case 2048:
        this.setState({
          canApprovePayeeTaxId: event.target.checked,
        });
        break;
      case 512:
        this.setState({
          canApprovePayeeCompanyName: event.target.checked,
        });
        break;
      case 131072:
        this.setState({
          overwriteIncomingPaymentType: event.target.checked,
        });
        break;
      default:
        break;
    }
  };

  checkChildItem = (event, chilPermission, parentPermission) => {
    const {
      permissionList,
    } = this.state;

    const currentPermission =
      permissionList &&
      permissionList.map((p) => {
        if (p.flags && p.flags.length) {
          p.flags.map((item) => {
            if (item.id === chilPermission.id) {
              item["isChecked"] = event.target.checked;
            }
          });
        }
        if (p.id === parentPermission.id) {
          p["isChecked"] = p.flags && p.flags.some((item) => item["isChecked"]);
        }
        return p;
      });
    this.setIdBasedFlags(chilPermission.id, event);

    this.setState({
      permissionList: currentPermission || [],
    });
  };

  checkItem(event, permission) {
    const {
      permissionList,
    } = this.state;

    const currentPermission =
      permissionList &&
      permissionList.map((p) => {
        if (p.id === permission.id) {
          p["isChecked"] = event.target.checked;

          if (permission.flags && permission.flags.length > 0) {
            const newFlags = permission.flags.map((innerPermission) => {
              innerPermission["isChecked"] = !innerPermission.isReadOnly
                ? event.target.checked
                : !event.target.checked;
              !innerPermission.isReadOnly &&
                this.setIdBasedFlags(innerPermission.id, event);
              return innerPermission;
            });
            p.flags = newFlags;
          }
        }
        return p;
      });
    this.setIdBasedFlags(permission.id, event);
    this.setState({
      permissionList: currentPermission || [],
    });
  }

  findDeep = (data, value, key) => {
    return data.some((e) => {
      if (e.id == value && e[key]) return e;
      else if (e.flags) return this.findDeep(e.flags, value, key);
    });
  };

  grantAll() {
    const { permissionList} = this.state;
    const { payerTypeId } = this.props.user.userData;

    let newPermissionList = permissionList && permissionList.map((permission) => {
        if (permission.id === 131072) {
          permission["showCheckBox"] = true;
        }
        const { flags } = permission;
        const readyToSetFlags =
          flags && flags.length > 0
            ? flags.map((item) => {
                return {
                  ...item,
                  isChecked: item.isReadOnly ? item.isChecked : true,
                };
              })
            : null;

        const anyChecked =
          readyToSetFlags && readyToSetFlags.some((item) => item.isChecked);

        return {
          ...permission,

          isChecked: permission.isReadOnly
            ? permission.isChecked
            : readyToSetFlags && readyToSetFlags.length > 0
            ? anyChecked
              ? true
              : false
            : true,
          flags: readyToSetFlags,
        };
      });
    if (payerTypeId == PayerTypes.CARDS) {
      this.setState({
        permissionList: newPermissionList,
        isPayeeUpdateAllowed: true,
        isPayeePaymentUpdateAllowed: true,
        canApprovePayeeTaxId: true,
        canApprovePayeePayment: this.findDeep(permissionList, 8192, 'isReadOnly') ? this.state.canApprovePayeePayment : true,
        canApprovePayeeCompanyName: true,
        overwriteIncomingPaymentType: true,
        pickEmailFromPayee: true
      });
    } else {
      this.setState({
        permissionList: newPermissionList,
        isPaymentDecisonEngine: true,
        isSupplierPlatformTnC: true,
        isSupplierProfileAutoApprovals: true,
        isSupplierRemitToIDMapping: true,
        isPayeeIdNotMatching: true,
        isPayeeUpdateAllowed: true,
        isPayeePaymentUpdateAllowed: true,
        canApprovePayeeTaxId: true,
        canApprovePayeePayment: this.findDeep(permissionList, 8192, "isReadOnly")
          ? this.state.canApprovePayeePayment
          : true,
        canApprovePayeeCompanyName: true,
        isDebitAccountNotConfig: true,
        overwriteIncomingPaymentType: true,
        isEnableCheckswithCDM: true,
      });

    }
}

  clearAll() {
    const { permissionList } = this.state;
    const newPermissionList =
      permissionList &&
      permissionList.map((permission) => {
        if (permission.id === 131072) {
          permission["showCheckBox"] = false;
        }
        const { flags } = permission;
        const readyToSetFlags =
          flags && flags.length > 0
            ? flags.map((item) => {
                return {
                  ...item,
                  isChecked: item.isReadOnly ? item.isChecked : true,
                };
              })
            : null;
        const allUnChecked =
          readyToSetFlags && readyToSetFlags.every((item) => !item.isChecked);

        return {
          ...permission,
          isChecked: permission.isReadOnly
            ? permission.isChecked
            : readyToSetFlags && readyToSetFlags.length > 0
            ? allUnChecked
            : false
            ? true
            : false,
          flags: readyToSetFlags,
        };
      });
    this.setState({
      permissionList: newPermissionList,
      checkedList: [],
      isPaymentDecisonEngine: false,
      isSupplierPlatformTnC: false,
      isSupplierProfileAutoApprovals: false,
      isSupplierRemitToIDMapping: false,
      isPayeeIdNotMatching: false,
      isPayeeUpdateAllowed: false,
      isPayeePaymentUpdateAllowed: false,
      canApprovePayeeCompanyName: false,
      canApprovePayeePayment: this.findDeep(permissionList, 8192, "isReadOnly")
        ? this.state.canApprovePayeePayment
        : false,
      canApprovePayeeTaxId: false,
      isDebitAccountNotConfig: false,
      overwriteIncomingPaymentType: false,
      isEnableCheckswithCDM: false,
      ddDays:0,
      vcaMaskNumber: "0",
      buyerId: null,
      pickEmailFromPayee: false
    });
  }

  savePermissions() {
    if (this.validateGeneralSettings()) {
      const {
        // reportFileFormat,
        // reconciliationReportTime,
        isPaymentDecisonEngine,
        isSupplierPlatformTnC,
        isSupplierProfileAutoApprovals,
        isSupplierRemitToIDMapping,
        permissionList,
        isPayeeIdNotMatching,
        isPayeeUpdateAllowed,
        isPayeePaymentUpdateAllowed,
        canApprovePayeeTaxId,
        canApprovePayeeCompanyName,
        canApprovePayeePayment,
        isDebitAccountNotConfig,
        isEnableCheckswithCDM,
        overwriteIncomingPaymentType,
        ddDays,
        buyerId,
        vcaMaskNumber,
        pickEmailFromPayee
      } = this.state;
      const clientId = this.props.user.userData.portalProfileId;
      const payload = {
        // "reportFileFormat": reportFileFormat,
        // "reconciliationReportTime": reconciliationReportTime,
        isPaymentDecisonEngine: isPaymentDecisonEngine ? 1 : 0,
        isSupplierPlatformTnC: isSupplierPlatformTnC ? 1 : 0,
        isSupplierProfileAutoApprovals: isSupplierProfileAutoApprovals ? 1 : 0,
        isSupplierRemitToIDMapping: isSupplierRemitToIDMapping ? 1 : 0,
        isPayeeUpdateAllowed: isPayeeUpdateAllowed ? 1 : 0,
        isPayeePaymentUpdateAllowed: isPayeePaymentUpdateAllowed ? 1 : 0,
        canApprovePayeePayment: canApprovePayeePayment ? 1 : 0,
        canApprovePayeeCompanyName: canApprovePayeeCompanyName ? 1 : 0,
        canApprovePayeeTaxId: canApprovePayeeTaxId ? 1 : 0,
        duplicatePaymentCheckDays: ddDays || 0,
        buyerId: buyerId || null,
        vcaMaskNumber: vcaMaskNumber || "0",
        pickEmailFromPayee: pickEmailFromPayee ? 1 : 0,
        processingFlags: [
          ...permissionList
            .filter(
              (p) =>
                p["isChecked"] === true &&
                p["id"] !== 32768 &&
                p["id"] !== 262144 &&
                p["id"] !== 131072
            )
            .map((permission) => permission["id"]),
          isPaymentDecisonEngine &&
          isEnableCheckswithCDM &&
          isPayeeIdNotMatching
            ? 32768
            : 0,
          isPaymentDecisonEngine &&
          isEnableCheckswithCDM &&
          isDebitAccountNotConfig
            ? 262144
            : 0,
          isPaymentDecisonEngine && overwriteIncomingPaymentType ? 131072 : 0,
        ],
      };
      this.setState({ btnLoader: true, savingData: true }, () => {
        savePermissionsData(payload, clientId).then((response) => {
          this.setDialogMessage(true, response.message, response.error ? "error" : "success");
          this.setState({ savingData: false });
        });
      });
    }
  }

  setDialogMessage(flag, message, variant) {
    this.setState({
      dialogMessage: message,
      isDialogActive: flag,
      variant,
    });
  }

  handleInput =(e) => {
    const obj = {};
    const fieldName = e.target.name;
    if(fieldName === 'ddDays' || fieldName === 'vcaMaskNumber'){
      obj[fieldName] = e.target.value.replace(/[^0-9]/g, "");
    }
    else if(fieldName === 'buyerId'){
      obj[fieldName] = e.target.value.replace(" ", "");
    }
    else if(fieldName === 'pickEmailFromPayee'){
      obj[fieldName] = e.target.checked;
    }
    else
     obj[fieldName] = e.target.value;
    this.setState(obj);
  }

  handleDecisionEngineChild = (permission) => {
    if (permission.id === 32768) {
      const { isPayeeIdNotMatching } = this.state;
      this.setState({ isPayeeIdNotMatching: !isPayeeIdNotMatching });
    }
    if (permission.id === 262144) {
      const { isDebitAccountNotConfig } = this.state;
      this.setState(
        { isDebitAccountNotConfig: !isDebitAccountNotConfig });
    }
  };

  render() {
    const {
      permissionList,
      isPaymentDecisonEngine,
      isSupplierPlatformTnC,
      isSupplierProfileAutoApprovals,
      isSupplierRemitToIDMapping,
      dialogMessage,
      isDialogActive,
      validation,
      savingData,
      isEnableCheckswithCDM,
      variant,
      isDebitAccountNotConfig,
      isPayeeIdNotMatching,
      debitAccountConfigPermission,
      activePayeePermission,
      overwriteIncomingPaymentType,
      ddDays,
      vcaMaskNumber,
      buyerId,
      pickEmailFromPayee
    } = this.state;
    const { theme } = this.props.clientConfig.layout;
    const { user, t } = this.props;
    const isSettingGeneralEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_GENERAL_SETTINGS_EDIT"]
        )) ||
      false;
      const disableEdit = !isSettingGeneralEditEnabled;
    const payerTypeId = user.userData.payerTypeId;

    return (
      <Box mx={6} mb={2}>
        <Paper className={"generalSettingsWrapper"}>
          <Box p={4}>
            <Grid container>
              <Grid item lg={6} md={5} xs={12}>
                 {/* Heading removed from b2b also - bug 12572 */}

                {/* <h3 className="settingHeading">
                  {t("componentData.generalSettings.GeneralSettingsTxt")}
                </h3> */}
              </Grid>
              {isSettingGeneralEditEnabled && (
                <Grid
                  item
                  lg={6}
                  md={7}
                  xs={12}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    className="displayInlineBLock floatRight horizontalMargin button"
                    style={{
                      textTransform: "uppercase",
                      background: theme.palette.button.primary,
                      color: theme.palette.secondary.contrastText,
                      marginRight: "0",
                    }}
                    disabled={disableEdit}
                    onClick={this.grantAll.bind(this)}
                  >
                    {t("componentData.generalSettings.SelectAll")}
                  </Button>

                  <Button
                    variant="outlined"
                    className="displayInlineBLock floatRight horizontalMargin button"
                    style={{
                      textTransform: "uppercase",
                      border: "none"
                    }}
                    disabled={disableEdit}
                    onClick={this.clearAll.bind(this)}
                  >
                    {t("componentData.generalSettings.ClearAll")}
                  </Button>
                  
                </Grid>
              )}
            </Grid>
            <Box my={3} width="65%" textAlign="justify">
              {permissionList &&
                permissionList
                  .filter(
                    (p) =>
                      p.id !== 32768 && p.id !== 262144 && p.displayOnUi === 1
                  )
                  .map((permission) => (
                    <Box my={1} key={permission.id}>
                      {permission &&
                      permission.showCheckBox == false ? undefined : (
                        <>
                          <Box>
                            {permission && permission.displayOnUi == true ? (
                              <Grid>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      key={`${permission.id}_check`}
                                      checked={
                                        permission.id === 131072
                                          ? overwriteIncomingPaymentType
                                          : permission["isChecked"] || false
                                      }
                                      onChange={(event) =>
                                        this.checkItem(event, permission)
                                      }
                                      name="checkedB"
                                      color="primary"
                                      disabled={
                                        disableEdit ||
                                        permission.isReadOnly ||
                                        (permission.flags &&
                                          permission.flags.every(
                                            (item) => item.isReadOnly === 1
                                          ))
                                      }
                                    />
                                  }
                                  label={permission.nameOnUi}
                                  className="boldText colorblue"
                                />
                                <Box className={"description"} mx={4} ml={4}>
                                  {permission.descriptionOnUi}
                                </Box>
                              </Grid>
                            ) : undefined}
                          </Box>

                          {permission["isChecked"] &&
                            permission.flags &&
                            permission.flags.length > 0 &&
                            permission.flags.map((innerPermission) => (
                              <Box my={1} key={innerPermission.id} ml={4}>
                                {innerPermission &&
                                innerPermission.showCheckBox ==
                                  false ? undefined : (
                                  <Box>
                                    {innerPermission &&
                                    innerPermission.displayOnUi == true ? (
                                      <Grid>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              key={`${innerPermission.id}_check`}
                                              checked={
                                                innerPermission["isChecked"] ||
                                                false
                                              }
                                              onChange={(event) =>
                                                this.checkChildItem(
                                                  event,
                                                  innerPermission,
                                                  permission
                                                )
                                              }
                                              name="checkedB"
                                              color="primary"
                                              disabled={
                                                disableEdit ||
                                                innerPermission.isReadOnly
                                              }
                                            />
                                          }
                                          label={innerPermission.nameOnUi}
                                          className="boldText colorblue"
                                        />
                                        <Box
                                          className={"description"}
                                          mx={4}
                                          ml={4}
                                        >
                                          {innerPermission.descriptionOnUi}
                                        </Box>
                                      </Grid>
                                    ) : undefined}
                                  </Box>
                                )}
                              </Box>
                            ))}
                        </>
                      )}
                    </Box>
                  ))}
                  
                  {payerTypeId === PayerTypes.CARDS ?
                  <>
                    <Box my={1} ml={4}>
                      <Box className="headingLabel">
                        {t("componentData.generalSettings.ddDays")}
                      </Box>
                      <Box my={1} pt={1} width="60%">
                        <TextField
                          fullWidth={true}
                          color="secondary"
                          autoComplete="off"
                          name="ddDays"
                          label={t("componentData.generalSettings.noOfDays")}
                          placeholder={t("componentData.generalSettings.ddDaysErr")}
                          variant="outlined"
                          value={ddDays || ""}
                          onChange={this.handleInput}
                          inputProps={{ maxLength: 4, style: { fontSize: 14 } }}
                          error={validation.ddDays && validation.ddDays.length > 0}
                          helperText={validation.ddDays || ""}
                          disabled={disableEdit}
                        />
                      </Box>
                      <Box className={"description"} my={1}>
                        {t("componentData.generalSettings.msg15")}
                      </Box>
                    </Box>

                    <Box my={1} ml={4}>
                      <Box className="headingLabel">
                        {t("componentData.generalSettings.buyerIdHeading")}
                      </Box>
                      <Box my={1} pt={1} width="60%">
                        <TextField
                          fullWidth={true}
                          color="secondary"
                          autoComplete="off"
                          name="buyerId"
                          label={t("componentData.generalSettings.buyerIdInput")}
                          variant="outlined"
                          value={buyerId || ""}
                          onChange={this.handleInput}
                          inputProps={{ maxLength: 100 }}
                          disabled={disableEdit}
                          error={validation.buyerId && validation.buyerId.length > 0}
                          helperText={validation.buyerId || ""}
                        />
                      </Box>
                    </Box>

                    <Box ml={4}>
                      <Box className="headingLabel">
                        {t("componentData.generalSettings.vcMaskingLabel")}
                      </Box>

                      <Box className={"description"} pt={1}>
                        {t("componentData.generalSettings.vcMaskingDescription")}
                      </Box>
                      <Box my={3}>
                        <Grid container spacing={3}>
                          <Grid item xs={5}>
                            <TextField
                              fullWidth={true}
                              color="secondary"
                              autoComplete="off"
                              name="vcaMaskNumber"
                              label={t("componentData.generalSettings.vcInputLabel")}
                              placeholder={t("componentData.generalSettings.vcInputLabel")}
                              variant="outlined"
                              onChange={this.handleInput}
                              inputProps={{ maxLength: 2, style: { fontSize: 14 } }}
                              //InputLabelProps={{ shrink: true }}
                              error={validation.vcaMaskNumber && validation.vcaMaskNumber.length > 0}
                              helperText={validation.vcaMaskNumber || ""}
                              value={vcaMaskNumber || ""}
                            />
                          </Grid>
                          <Grid item xs={7}>
                            <Box className="textBold">
                              {t("componentData.generalSettings.vcMaskedPreview")}:
                            </Box>
                            {vcaMaskNumber!=null &&
                              <Box>
                                {MaskedCardNumber.toString()
                                  .replace(new RegExp(`.(?=.{${vcaMaskNumber || "0"}})`, 'g'), "X")
                                  .replace(/(\w{4})(\w{4})(\w{4})(\w{4})/, "$1 - $2 - $3 - $4")}
                              </Box>
                            }
                          </Grid>
                        </Grid>

                      </Box>
                    </Box>

                    <Box>                     
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="primary"
                              checked={pickEmailFromPayee}
                              onChange={this.handleInput}
                              name="pickEmailFromPayee"
                              disabled={disableEdit}
                            />
                          }
                          label={t("componentData.generalSettings.pickPayeeEmail")}
                          className="boldText colorblue"
                        />                                          
                      <Box className={"description"} ml={4}>
                        {t("componentData.generalSettings.msg39")}
                      </Box>
                    </Box>
                  </> : null
              }

              {payerTypeId != PayerTypes.CARDS &&
              (
              <>  
              <Box my={1}>
                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isPaymentDecisonEngine}
                        onChange={() =>
                          this.setState(
                            { isPaymentDecisonEngine: !isPaymentDecisonEngine },
                            () => {
                              if (!isPaymentDecisonEngine) {
                                permissionList.forEach((p) => {
                                  if (
                                    p.id === 32768 ||
                                    p.id === 131072 ||
                                    p.id === 262144
                                  ) {
                                    p["showCheckBox"] = true;
                                  }
                                });
                              } else {
                                permissionList.forEach((p) => {
                                  if (
                                    p.id === 32768 ||
                                    p.id === 131072 ||
                                    p.id === 262144
                                  ) {
                                    p["showCheckBox"] = false;
                                  }
                                });
                              }
                              this.setState({
                                ...this.state,
                                isEnableCheckswithCDM: false,
                                isPayeeIdNotMatching: false,
                                isDebitAccountNotConfig: false,
                                overwriteIncomingPaymentType: false,
                              });
                            }
                          )
                        }
                        disabled={disableEdit}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={t(
                      "componentData.generalSettings.ApplyDecisionEngine"
                    )}
                    className="boldText colorblue"
                  />
                  <Box className={"description"} mx={4} my={-1}>
                    {t("componentData.generalSettings.msg1")}
                  </Box>
                </Grid>
              </Box>
              {isPaymentDecisonEngine ? (
                <Box mt={1} ml={4}>
                  <Grid style={{ display: "flex" }}>
                    <Box>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isEnableCheckswithCDM}
                            onChange={() => {
                              this.setState(
                                {
                                  isEnableCheckswithCDM: !isEnableCheckswithCDM,
                                },
                                () => {
                                  if (!this.state.isEnableCheckswithCDM) {
                                    this.setState({
                                      isDebitAccountNotConfig: false,
                                      isPayeeIdNotMatching: false,
                                    });
                                  }
                                }
                              );
                            }}
                            disabled={disableEdit}
                            name="checkedB"
                            color="primary"
                          />
                        }
                        label={t(
                          "componentData.generalSettings.EnableChecksWithCDM"
                        )}
                        className="boldText colorblue"
                      />
                    </Box>
                    <Box py={1}>
                      <Tooltip
                        title={t(
                          "componentData.generalSettings.EnableChecksWithCDMTooltip"
                        )}
                        placement="right"
                      >
                        <InfoIcon />
                      </Tooltip>
                    </Box>
                  </Grid>
                </Box>
              ) : undefined}
              {isEnableCheckswithCDM ? (
                <Box mb={1} ml={8}>
                  <Grid>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isDebitAccountNotConfig}
                          onChange={() =>
                            this.handleDecisionEngineChild(
                              debitAccountConfigPermission
                            )
                          }
                          disabled={disableEdit}
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label={
                        debitAccountConfigPermission &&
                        debitAccountConfigPermission.nameOnUi
                      }
                      className="boldText colorblue"
                    />
                    {/* <Box className={"description"} mx={4} ml={4}>
                      {debitAccountConfigPermission && debitAccountConfigPermission.descriptionOnUi}
                    </Box> */}
                  </Grid>
                </Box>
              ) : undefined}

              {isEnableCheckswithCDM ? (
                <Box my={1} ml={8}>
                  <Grid>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isPayeeIdNotMatching}
                          onChange={() =>
                            this.handleDecisionEngineChild(
                              activePayeePermission
                            )
                          }
                          disabled={disableEdit}
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label={
                        activePayeePermission && activePayeePermission.nameOnUi
                      }
                      className="boldText colorblue"
                    />
                    {/* <Box className={"description"} mx={4} ml={4}>
                      {activePayeePermission && activePayeePermission.descriptionOnUi}
                    </Box> */}
                    <FormHelperText className="errorText">
                      {validation.enableCheckWithCDMError}
                    </FormHelperText>
                  </Grid>
                </Box>
              ) : undefined}

              <Box my={1}>
                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSupplierPlatformTnC}
                        onChange={() =>
                          this.setState({
                            isSupplierPlatformTnC: !isSupplierPlatformTnC,
                          })
                        }
                        disabled={disableEdit}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={t("componentData.generalSettings.termsAndCond")}
                    className="boldText colorblue"
                  />
                  <Box className={"description"} mx={4} ml={4}>
                    {t("componentData.generalSettings.msg3")}
                  </Box>
                </Grid>
              </Box>

              <Box my={1}>
                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSupplierProfileAutoApprovals}
                        onChange={() =>
                          this.setState({
                            isSupplierProfileAutoApprovals:
                              !isSupplierProfileAutoApprovals,
                          })
                        }
                        disabled={disableEdit}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={t(
                      "componentData.generalSettings.PayeeProfileAutoApprovals"
                    )}
                    className="boldText colorblue"
                  />
                  <Box className={"description"} mx={4} ml={4}>
                    {t("componentData.generalSettings.msg4")}
                  </Box>
                </Grid>
              </Box>

              <Box my={1}>
                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isSupplierRemitToIDMapping}
                        onChange={() =>
                          this.setState({
                            isSupplierRemitToIDMapping:
                              !isSupplierRemitToIDMapping,
                          })
                        }
                        disabled={disableEdit}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={t("componentData.generalSettings.PayeeIDMapping")}
                    className="boldText colorblue"
                  />
                  <Box className={"description"} mx={4} ml={4}>
                    {t("componentData.generalSettings.msg5")}
                  </Box>
                </Grid>
              </Box>
              </>
                )}
            </Box>

            {/* <Box my={7} style={{ borderTop: `1px solid  ${theme.palette.background.default}` }}>
                            <Box my={5}>
                                <Grid xs={4} sm={4}>
                                    <TextField
                                        fullWidth={true}
                                        select
                                        color="secondary"
                                        autoComplete="off"
                                        name="reportFileFormat"
                                        label="Report File Format"
                                        variant="outlined"
                                        value={reportFileFormat}
                                        onChange={(e) => this.handleInput(e)}
                                        onBlur={() => this.validateGeneralSettings()}
                                        // inputProps={{ maxLength: 5 }}
                                        error={validation.reportFileFormat && validation.reportFileFormat.length > 0}
                                        helperText={validation.reportFileFormat}
                                    >
                                        {fileTypes && fileTypes.map(type =>
                                            <MenuItem key={type.id} value={type.fileName}>
                                                {type.fileName}
                                            </MenuItem>)}
                                    </TextField>
                                </Grid>
                            </Box>
                            <Box my={5}>
                                <Grid xs={4} sm={4}>
                                    <TextField
                                        fullWidth={true}
                                        color="secondary"
                                        autoComplete="off"
                                        name="reconciliationReportTime"
                                        label="Reconciliation Report Time"
                                        variant="outlined"
                                        value={reconciliationReportTime}
                                        onChange={(e) => this.handleInput(e)}
                                        onBlur={() => this.validateGeneralSettings()}
                                        inputProps={{ maxLength: 8 }}
                                        error={validation.reconciliationReportTime && validation.reconciliationReportTime.length > 0}
                                        helperText={validation.reconciliationReportTime}
                                    />
                                </Grid>
                            </Box>
                        </Box> */}
          </Box>
        </Paper>

        <Grid container item xs={12} justify="center">
          <Box mt={1.875}>
            {isSettingGeneralEditEnabled && (
              <div
                style={{
                  justify: "center",
                  margin: "0 auto",
                  display: "table",
                }}
              >
                {/* <Box px={5}>
                                <Button variant="contained" style={{ display: "inline-block", float: "left", padding: "6px 10px", width: "120px", margin: "0px 10px 0 0", background: theme.palette.secondary.contrastText, color: theme.palette.button.primary }} color="" >
                                    Cancel
                                        </Button>
                            </Box> */}

                {savingData ? (
                  <CircularProgress color="primary" />
                ) : (
                  <Box px={0}>
                    <Button
                      variant="contained"
                      disableElevation
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        width: "120px",
                        margin: "0px",
                      }}
                      color="primary"
                      onClick={() => this.savePermissions()}
                      disabled={disableEdit}
                    >
                      {t("componentData.generalSettings.Update")}
                    </Button>
                  </Box>
                )}
              </div>
            )}
          </Box>
        </Grid>

        {dialogMessage && isDialogActive && (
          // <AlertDialog
          //   title={dialogMessage}
          //   open={true}
          //   onConfirm={() =>
          //     this.setState({ dialogMessage: "", isDialogActive: false })
          //   }
          // />
          <Notification
            variant={variant}
            message={dialogMessage}
            handleClose={() => {
              this.setState({ dialogMessage: "", isDialogActive: false });
            }}
          />
        )}
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.clientConfig }))(
    GeneralSettings
  )
);
