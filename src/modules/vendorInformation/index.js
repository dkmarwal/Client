import React from "react";
import {
  Tabs,
  Tab,
  Grid,
  Box,
  Typography,
  IconButton,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Button,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { TabPanel } from "~/components/TabPanel/index";
import CheckboxOutline from "~/components/Forms/CheckboxOutline";
import { TextField } from "~/components/Forms";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { connect } from "react-redux";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

import {
  getVendorPayments,
  getBulkRemittances,
} from "~/redux/helpers/payments";
import RemittanceSelector from "~/modules/RemittanceSelector";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import InfoDialogue from "~/components/InfoDialogue";
import VendorCompanyInfo from "./VendorCompanyInfo";
import VendorLocations from "./VendorLocations";
import ValidationStatus from "./ValidationStatus";
import VendorContactInfo from "./VendorContactInfo";
import DefaultRemitToID from "./DefaultRemitToID";
import NpiIdView from "./NpiIdView";

import {
  fetchDefaultSupplierIds,
  fetchSupplierIds,
  updateRemitToId,
  removeRemitToId,
  approveSupplier,
  disapprovePayee,
  isPayeeEditable,
  updateRPUSelectedTab,
} from "~/redux/helpers/suppliers";
import { getClientRemConfig } from "~/redux/helpers/remittance";
import { getGeneralSettingConfig } from "~/redux/helpers/settings";
import { fetchClientConfig } from "~/redux/helpers/remittance";

import { Checkbox } from "~/components/Forms";
import { accessRights } from "~/config/accessRights";
import config from "~/config";
import { withTranslation } from "react-i18next";

import { PayeeConfirmDialog } from "~/components/Dialogs";
import PaymentTooltip from "~/components/PaymentTooltip";
import EditIcon from "@material-ui/icons/Edit";
import EditBankAccountView from "./EditBankAccountView";
import {
  getCurrenciesList,
  getAccountClasses,
  getClientPaymentTypesPayee,
} from "~/redux/actions/payments";
import { fetchUnmaskedAccountNumber } from "~/redux/actions/suppliers";
import EditVirtualCardView from "./EditVirtualCardView";

export class VendorInformation extends React.Component {
  state = {
    selectedTab: 0,
    paymentMethods: {},
    achInfo: {},
    vcaInfo: {},
    chkInfo: {},
    wire: {},
    crossBorder: {},
    noteMessage: "",
    bulkRemInfo: {},
    showBulkRem: false,
    supplierIds: [],
    defaultSupplierIds: [],
    addSupplier: "",
    validation: "",
    validationVariant: false,
    isPayeeEditable: false,
    isPayeeEditableDisabled: true,
    openDisapproveDialog: false,
    isHippa: false,
    frequency: [
      {
        label: "DAILY",
        selected: false,
        code: "D",
      },
      {
        label: "WEEKLY",
        selected: false,
        code: "W",
      },
      {
        label: "MONTHLY",
        selected: false,
        code: "M",
      },
      {
        label: "NONE",
        selected: false,
        code: "N",
      },
    ],
    openDisclaimer: false,
    approveValidation: "",
    approveValidationMessage: "",
    approveValidBtn: false,
    showConfirmDialog: false,
    showConfirmDialogMessage: "",
    selectedBank: null,
    editBankDetails: false,
    editVCADetails: false,
    currencyList: [],
    accountClasses: [],
    accountTypes: [],
    expandedBank: false,
    isPayeePaymentEditable: false,
    showNpiTab: false,
    openUnmaskedAccountNumber: false,
    anchorEl: null,
    isRemNotRequired: 1, // if 1 then hide remittance tab. Added for Kaiser
  };

  onCancel = () => {
    this.setState({
      showConfirmDialog: false,
      showConfirmDialogMessage: "",
    });
  };

  onConfirm = () => {
    this.setState(
      {
        showConfirmDialog: false,
        showConfirmDialogMessage: "",
      },
      () => {
        this.props.dispatch(updateRPUSelectedTab(1));
        this.props.history.push(`${config.baseName}/suppliers/supplierUpdates`);
      }
    );
  };

  getProfileCircleName(name) {
    return (
      name &&
      name
        .match(/(\b\S)?/g)
        .join("")
        .match(/(^\S|\S$)?/g)
        .join("")
        .toUpperCase()
    );
  }

  handleTabChange = (val) => {
    this.setState({ selectedTab: val });
  };

  componentDidMount = async () => {
    const { userData } = this.props.user;
    const { vendorDetail } = this.props;
    if (
      vendorDetail.payeeId !== null &&
      vendorDetail.profileStatus &&
      vendorDetail.profileStatus.actualDescription !== "Disapproved" &&
      vendorDetail.profileStatus &&
      vendorDetail.profileStatus.actualDescription !== "Revoked"
    ) {
      this.fetchVendorPayment(vendorDetail.payeeId);
      this.fetchIsPayeeEditable(vendorDetail.payeeId);
      this.fetchBulkRemittances(vendorDetail.payeeId, userData.portalProfileId);
      this.fetchRemConfig(userData.portalProfileId);
      this.fetchVendorSupplierIds(
        vendorDetail.payeeId,
        userData.portalProfileId
      );
      this.fetchDefaultVendorSupplierIds(
        vendorDetail.payeeId,
        userData.portalProfileId
      );
      this.fetchCurrencyList();
      this.fetchGeneralSettingConfig();
      this.getClientConfig();
      await this.fetchAccountClasses();
      await this.fetchPaymentTypes();
    }
  };

  getClientConfig = () => {
    fetchClientConfig().then((res) => {
      this.setState({
        isRemNotRequired: res?.data?.isRemittanceNotRequired || 0,
      });
    });
  };

  fetchGeneralSettingConfig() {
    const clientId = this.props.user.userData.portalProfileId;
    getGeneralSettingConfig(clientId).then((res) => {
      if (res.error) {
        return false;
      }
      const showNpiTab = res?.data?.isClearingHouseRequiredForSupplier || false;
      this.setState({ showNpiTab: showNpiTab });
    });
  }
  refreshData = async () => {
    const { userData } = this.props.user;
    const { vendorDetail } = this.props;
    if (
      vendorDetail.payeeId !== null &&
      vendorDetail.profileStatus &&
      vendorDetail.profileStatus.actualDescription !== "Disapproved" &&
      vendorDetail.profileStatus &&
      vendorDetail.profileStatus.actualDescription !== "Revoked"
    ) {
      this.fetchVendorPayment(vendorDetail.payeeId);
      this.fetchIsPayeeEditable(vendorDetail.payeeId);
      this.fetchBulkRemittances(vendorDetail.payeeId, userData.portalProfileId);
      this.fetchRemConfig(userData.portalProfileId);
      this.fetchVendorSupplierIds(
        vendorDetail.payeeId,
        userData.portalProfileId
      );
      this.fetchDefaultVendorSupplierIds(
        vendorDetail.payeeId,
        userData.portalProfileId
      );
      this.fetchCurrencyList();
      this.fetchGeneralSettingConfig();
      await this.fetchAccountClasses();
      await this.fetchPaymentTypes();
    }
  };

  fetchPaymentTypes = () => {
    this.props.dispatch(getClientPaymentTypesPayee()).then((response) => {
      if (!response) {
        this.setNotification("danger", this.props.payment.error || "API error");
        return false;
      }
      this.setState({
        isLoading: false,
        accountTypes: this.props.payment.types.rows,
      });
    });
  };

  fetchAccountClasses = () => {
    this.props.dispatch(getAccountClasses()).then((response) => {
      if (!response) {
        return false;
      }
      this.setState({
        accountClasses: this.props.payment.accountClasses?.rows ?? [],
      });
    });
  };

  fetchCurrencyList = () => {
    this.props.dispatch(getCurrenciesList()).then((response) => {
      if (!response) {
        return false;
      }
      this.setState({
        currencyList:
          (this.props.payment.currencyList &&
            this.props.payment.currencyList.data &&
            this.props.payment.currencyList.data.rows) ||
          [],
      });
    });
  };

  fetchRemConfig = (id) => {
    getClientRemConfig(id, false)
      .then((response) => {
        this.setState({
          showBulkRem:
            response.data && response.data.isBulkRemittance === 1
              ? true
              : false,
          isHippa:
            response.data &&
            response.data.remittanceDetails &&
            response.data.remittanceDetails &&
            response.data.remittanceDetails[0] &&
            response.data.remittanceDetails[0].isHippa === 1
              ? true
              : false,
        });
      })
      .catch((error) => {
        this.setState({ showBulkRem: false });
      });
  };
  fetchIsPayeeEditable = (id) => {
    isPayeeEditable(id)
      .then((response) => {
        if (response.data) {
          const {
            canClientEdit,
            isLinkedWithMultipleClient,
            canClientEditPaymentInfo,
          } = response.data;
          this.setState({
            isPayeeEditable: canClientEdit ? true : false,
            isPayeePaymentEditable: canClientEditPaymentInfo ? true : false,
            isPayeeEditableDisabled: isLinkedWithMultipleClient
              ? isLinkedWithMultipleClient
              : false,
          });
        }
      })
      .catch((error) => {
        this.setState({
          isPayeeEditable: false,
          isPayeeEditableDisabled: true,
          isPayeePaymentEditable: false,
        });
      });
  };
  fetchVendorPayment = (id) => {
    const { userData } = this.props.user;

    getVendorPayments(id, userData.portalProfileId)
      .then((response) => {
        this.setState({
          paymentMethods: response.data,
          achInfo:
            response.data && response.data.bankAccount
              ? response.data.bankAccount
              : {},
          vcaInfo:
            response.data && response.data.virtualCard
              ? response.data.virtualCard
              : {},
          chkInfo:
            response.data && response.data.check ? response.data.check : {},
          wire: response.data && response.data.wire ? response.data.wire : {},
          crossBorder:
            response.data && response.data.crossBorder
              ? response.data.crossBorder
              : {},
          noteMessage:
            response.data && response.data.noteMessage
              ? response.data.noteMessage
              : "",
        });
        this.checkApproveValid(
          (response.data && response.data.bankAccount) || "",
          (response.data && response.data.virtualCard) || "",
          (response.data && response.data.check) || ""
        );
      })
      .catch((error) => {
        this.setState({ paymentMethods: {} });
      });
  };
  checkApproveValid = (bankAccount, virtualCard, check) => {
    let approveValid = true;
    if (bankAccount && bankAccount["data"] && bankAccount["data"].length > 0) {
      bankAccount["data"].map(function (detail) {
        if (
          detail.remitToIdDetail &&
          detail.remitToIdDetail.remitToIds &&
          detail.remitToIdDetail.remitToIds.length === 0
        ) {
          approveValid = false;
        }
      });
    }
    if (virtualCard && virtualCard["data"] && virtualCard["data"].length > 0) {
      virtualCard["data"].map(function (detail) {
        if (
          detail.remitToIdDetail &&
          detail.remitToIdDetail.remitToIds.length === 0
        ) {
          approveValid = false;
        }
      });
    }
    if (check && check["data"] && check["data"].length > 0) {
      check["data"].map(function (detail) {
        if (
          detail.remitToIdDetail &&
          detail.remitToIdDetail.remitToIds.length === 0
        ) {
          approveValid = false;
        }
      });
    }

    //FSINPAYB2B-4563 jira ticket changes to non mandate remit to id
    this.setState({
      approveValidBtn: true,
    });
  };
  fetchBulkRemittances = (id, clientId) => {
    const { frequency } = this.state;
    const { t } = this.props;
    getBulkRemittances(id, clientId)
      .then((response) => {
        this.setState({
          bulkRemInfo: response.data ? response.data : {},
          frequency: frequency.map((item) =>
            item.code === response.data.bulkRemittanceFrequency
              ? {
                  ...item,
                  label: t(`componentData.vendorInfo.${item.label}`),
                  selected: true,
                }
              : { ...item, label: t(`componentData.vendorInfo.${item.label}`) }
          ),
        });
      })
      .catch((error) => {
        this.setState({ paymentMethods: {} });
      });
  };
  fetchVendorSupplierIds = (payeeId, clientId) => {
    fetchSupplierIds(payeeId, clientId)
      .then((response) => {
        this.setState({ supplierIds: response.data });
      })
      .catch((error) => {
        this.setState({ supplierIds: [] });
      });
  };
  fetchDefaultVendorSupplierIds = (payeeId, clientId) => {
    fetchDefaultSupplierIds(payeeId, clientId)
      .then((response) => {
        this.setState({
          defaultSupplierIds: response.data.map((item) => ({
            ...item,
            disabled: false,
          })),
        });
      })
      .catch((error) => {
        this.setState({ defaultSupplierIds: [] });
      });
  };
  onDefaultRemitToChange = (e) => {
    const { defaultSupplierIds } = this.state;
    const value = e.target.value;
    this.setState({
      defaultSupplierIds: defaultSupplierIds.map((item) => ({
        ...item,
        disabled: true,
      })),
    });
    const data = {
      remitToId: value.toString().trim(),
    };
    this.handleAddRemitToId(data);
  };
  addRemitToID = () => {
    const { addSupplier } = this.state;
    const { t } = this.props;
    const data = {
      remitToId: addSupplier.toString().trim(),
    };
    if (addSupplier.length === 0) {
      this.setState({
        validation: t("componentData.vendorInfo.empRemit"),
        validationVariant: true,
      });
      return false;
    } else {
      this.handleAddRemitToId(data);
    }
  };
  handleAddRemitToId = (data) => {
    const { addSupplier } = this.state;
    const { vendorDetail, t } = this.props;
    const { userData } = this.props.user;
    updateRemitToId(vendorDetail.payeeId, userData.portalProfileId, data)
      .then((response) => {
        if (response.error) {
          this.setState({
            validation: response.message,
            validationVariant: true,
          });
          return false;
        }
        this.setState({
          addSupplier: "",
          validation: `${t(
            "componentData.vendorInfo.PayeeId"
          )} ${addSupplier} ${t("componentData.vendorInfo.addedSuccessfully")}`,
          validationVariant: false,
        });
        this.fetchVendorSupplierIds(
          vendorDetail.payeeId,
          userData.portalProfileId
        );
      })
      .catch((error) => {
        let errorText = {};
        errorText =
          typeof error === "string"
            ? error
            : t("componentData.vendorInfo.unknownErr");
        this.setState({
          validation: errorText,
        });
      });
  };
  handleRemoveID = (event, item, index) => {
    const { vendorDetail, t } = this.props;
    const { userData } = this.props.user;
    removeRemitToId(
      vendorDetail.payeeId,
      userData.portalProfileId,
      event.entityIdentifier
    )
      .then((response) => {
        if (response.error) {
          this.setState({
            validation: response.message,
            validationVariant: true,
          });
          return false;
        }
        this.setState({
          validation: `${t("componentData.vendorInfo.PayeeId")} ${
            event.entityIdentifier
          } ${t("componentData.vendorInfo.deletedSuccessfully")}`,
          validationVariant: false,
        });
        this.fetchVendorPayment(vendorDetail.payeeId); //refresh payment method details
        this.fetchVendorSupplierIds(
          vendorDetail.payeeId,
          userData.portalProfileId
        );
      })
      .catch((error) => {
        let errorText = {};
        errorText =
          typeof error === "string"
            ? error
            : t("componentData.vendorInfo.unknownErr");
        this.setState({
          validation: errorText,
        });
      });
  };
  handleApproveDetails = (flag) => {
    this.setState(
      {
        // openDisclaimer: true,
      },
      () => {
        const { vendorDetail } = this.props;
        const { userData } = this.props.user;
        const { achInfo, vcaInfo, chkInfo, wire, crossBorder } = this.state;

        let paymentDetails = [];
        if (achInfo["data"] && achInfo["data"].length > 0) {
          achInfo["data"].map(function (detail) {
            const { paymentId, remitToIds } = detail.remitToIdDetail;
            paymentDetails = [
              ...paymentDetails,
              {
                paymentId: paymentId,
                remitToIds: [...new Set(remitToIds)],
                paymentType: "bankAccount",
              },
            ];
          });
        }
        if (vcaInfo["data"] && vcaInfo["data"].length > 0) {
          vcaInfo["data"].map(function (detail) {
            const { paymentId, remitToIds } = detail.remitToIdDetail;
            paymentDetails = [
              ...paymentDetails,
              {
                paymentId: paymentId,
                remitToIds: [...new Set(remitToIds)],
                paymentType: "virtualCard",
              },
            ];
          });
        }
        if (chkInfo["data"] && chkInfo["data"].length > 0) {
          chkInfo["data"].map(function (detail) {
            const { paymentId, remitToIds } = detail.remitToIdDetail;
            paymentDetails = [
              ...paymentDetails,
              {
                paymentId: paymentId,
                remitToIds: [...new Set(remitToIds)],
                paymentType: "check",
              },
            ];
          });
        }
        if (wire["data"] && wire["data"].length > 0) {
          wire["data"].map(function (detail) {
            const { paymentId, remitToIds } = detail.remitToIdDetail;
            paymentDetails = [
              ...paymentDetails,
              {
                paymentId: paymentId,
                remitToIds: [...new Set(remitToIds)],
                paymentType: "WIRE",
              },
            ];
          });
        }
        if (crossBorder["data"] && crossBorder["data"].length > 0) {
          crossBorder["data"].map(function (detail) {
            const { paymentId, remitToIds } = detail.remitToIdDetail;
            paymentDetails = [
              ...paymentDetails,
              {
                paymentId: paymentId,
                remitToIds: [...new Set(remitToIds)],
                paymentType: "CROSS_BORDER",
              },
            ];
          });
        }
        const data = {
          payments: paymentDetails,
        };
        approveSupplier(vendorDetail.payeeId, userData.portalProfileId, data)
          .then((response) => {
            if (response.error) {
              if (response.data.showMessage) {
                this.setState({
                  showConfirmDialog: true,
                  showConfirmDialogMessage: response.message,
                  openDisclaimer: false,
                });
              } else {
                if (flag) {
                  this.setState({
                    approveValidationMessage: response.message,
                    openDisclaimer: false,
                  });
                } else {
                  this.setState({
                    approveValidation: response.message,
                    openDisclaimer: false,
                  });
                }
              }
              return false;
            }
            this.setState({
              openDisclaimer: false,
              approveValidation: "",
              approveValidationMessage: "",
              showConfirmDialog: false,
              showConfirmDialogMessage: "",
            });
            if (flag) {
              this.props.closeApproveVendorDetails();
            } else {
              this.props.closeSaveVendorDetails();
            }
          })
          .catch((error) => {});
      }
    );
  };
  handleCheckBoxChange = (event, type, id, index) => {
    const { achInfo, vcaInfo, chkInfo, wire, crossBorder } = this.state;
    if (!this.props.canEdit) {
      return false;
    }
    switch (type) {
      case "achInfo":
        const newAchInfo = { ...achInfo };
        newAchInfo["data"].map(function (detail) {
          if (detail.remitToIdDetail.paymentId == id) {
            if (event.target.checked) {
              detail.remitToIdDetail.remitToIds = [
                ...new Set([
                  ...detail.remitToIdDetail.remitToIds,
                  event.target.name,
                ]),
              ];
            } else {
              const restObj = detail.remitToIdDetail.remitToIds.filter(
                (item) => item !== event.target.name
              );
              detail.remitToIdDetail.remitToIds = [...new Set(restObj)];
            }
          }
        });
        this.setState({
          achInfo: newAchInfo,
        });
        break;
      case "vcaInfo":
        const newVcaInfo = { ...vcaInfo };
        newVcaInfo["data"].map(function (detail) {
          if (detail.remitToIdDetail.paymentId == id) {
            if (event.target.checked) {
              detail.remitToIdDetail.remitToIds = [
                ...new Set([
                  ...detail.remitToIdDetail.remitToIds,
                  event.target.name,
                ]),
              ];
            } else {
              const restObj = detail.remitToIdDetail.remitToIds.filter(
                (item) => item !== event.target.name
              );
              detail.remitToIdDetail.remitToIds = [...new Set(restObj)];
            }
          }
        });
        this.setState({
          vcaInfo: newVcaInfo,
        });
        break;
      case "chkInfo":
        const newChkInfo = { ...chkInfo };
        newChkInfo["data"].map(function (detail) {
          if (detail.remitToIdDetail.paymentId == id) {
            if (event.target.checked) {
              detail.remitToIdDetail.remitToIds = [
                ...new Set([
                  ...detail.remitToIdDetail.remitToIds,
                  event.target.name,
                ]),
              ];
            } else {
              const restObj = detail.remitToIdDetail.remitToIds.filter(
                (item) => item !== event.target.name
              );
              detail.remitToIdDetail.remitToIds = [...new Set(restObj)];
            }
          }
        });
        this.setState({
          chkInfo: newChkInfo,
        });
        break;
      case "wire":
        const newWireInfo = { ...wire };
        wire["data"].map(function (detail) {
          if (detail.remitToIdDetail.paymentId == id) {
            if (event.target.checked) {
              detail.remitToIdDetail.remitToIds = [
                ...new Set([
                  ...detail.remitToIdDetail.remitToIds,
                  event.target.name,
                ]),
              ];
            } else {
              const restObj = detail.remitToIdDetail.remitToIds.filter(
                (item) => item !== event.target.name
              );
              detail.remitToIdDetail.remitToIds = [...new Set(restObj)];
            }
          }
        });
        this.setState({
          wire: newWireInfo,
        });
        break;
      case "crossBorder":
        const newCrossBorderInfo = { ...crossBorder };
        newCrossBorderInfo["data"].map(function (detail) {
          if (detail.remitToIdDetail.paymentId == id) {
            if (event.target.checked) {
              detail.remitToIdDetail.remitToIds = [
                ...new Set([
                  ...detail.remitToIdDetail.remitToIds,
                  event.target.name,
                ]),
              ];
            } else {
              const restObj = detail.remitToIdDetail.remitToIds.filter(
                (item) => item !== event.target.name
              );
              detail.remitToIdDetail.remitToIds = [...new Set(restObj)];
            }
          }
        });
        this.setState({
          crossBorder: newCrossBorderInfo,
        });
        break;
      default:
        break;
    }
    this.checkApproveValid(achInfo, vcaInfo, chkInfo);
  };
  handleDisapproveProfile = () => {
    const { vendorDetail } = this.props;
    const { userData } = this.props.user;
    disapprovePayee(userData.portalProfileId, {
      payeeIds: [vendorDetail.payeeId],
    })
      .then((response) => {
        if (response.error) {
          this.setState({
            approveValidation: response.message,
            openDisapproveDialog: false,
          });
          return false;
        }
        this.setState({
          approveValidation: "",
          openDisapproveDialog: false,
        });
        this.props.closeDisapproveVendorDetails();
      })
      .catch((error) => {});
  };

  isRemitToIdDisabled = (detail) => {
    const { user } = this.props;
    const { payeeValidationStatus, updatedByWho, updatedByOtherClientUser } =
      detail;
    const isMySupplierEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_EDIT"])) ||
      false;
    return (payeeValidationStatus &&
      payeeValidationStatus.length > 0 &&
      (payeeValidationStatus[0].validationStatus === "FAILED" ||
        payeeValidationStatus[0].validationStatus === "PENDING")) ||
      updatedByWho ||
      updatedByOtherClientUser ||
      !isMySupplierEditEnabled
      ? true
      : false;
  };

  getUnmaskedAccountNumber = (accountDetailId) => {
    this.props
      .dispatch(fetchUnmaskedAccountNumber(accountDetailId))
      .then((response) => {
        if (response) {
          this.setState({
            openUnmaskedAccountNumber: true,
          });
        }
      });
  };

  renderACHInfo = (info, name) => {
    const { classes, canEdit, t, vendorDetail } = this.props;
    const {
      supplierIds,
      isHippa,
      editBankDetails,
      currencyList,
      accountClasses,
      accountTypes,
      expandedBank,
      selectedBank,
      isPayeeEditableDisabled,
      isPayeePaymentEditable,
      isRemNotRequired,
    } = this.state;
    const { user } = this.props;
    const isMySupplierEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_EDIT"])) ||
      false;
    return (
      <Grid item xs={12} md={12}>
        {editBankDetails ? (
          <EditBankAccountView
            bankDetails={selectedBank}
            paymentType="ACH"
            currencyList={currencyList}
            accountClassification={accountClasses}
            accountTypes={accountTypes}
            handleCancel={() => {
              this.setState({ editBankDetails: false });
            }}
            vendorDetail={vendorDetail}
            handleBankEditMode={this.handleBankEditMode}
            refreshData={this.refreshData}
          />
        ) : (
          <ExpansionPanel
            className={classes.panel}
            onClick={() => {
              this.setState({ expandedBank: !expandedBank });
            }}
          >
            <ExpansionPanelSummary
              expandIcon={""}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    variant="h2"
                    className={classes.paymentTitle}
                    style={{ float: "left" }}
                  >
                    <img
                      className={classes.payment_icon}
                      src={
                        name === "achInfo"
                          ? require(`~/assets/icons/ACH_main.svg`)
                          : require(`~/assets/icons/Cross_main.svg`)
                      }
                      alt=""
                    />{" "}
                    {t(`componentData.vendorInfo.${info["name"]}`)}
                  </Typography>
                  <Typography
                    variant="h6"
                    className={classes.showText}
                    style={{ float: "right" }}
                  >
                    {info["data"].length > 1
                      ? `${t("componentData.vendorInfo.SHOW")} ${
                          info["data"].length
                        } ${t("componentData.vendorInfo.ACCOUNTS")}`
                      : t("componentData.vendorInfo.SHOWACCOUNT")}
                  </Typography>
                </Grid>
                {isRemNotRequired === 0 && (
                  <>
                    {name === "achInfo" &&
                      info["data"] &&
                      info["data"].length > 0 &&
                      info["data"][0].remittanceInfo && (
                        <Grid item xs={4}>
                          <Box my={2} pl={3}>
                            <span
                              style={{
                                float: "left",
                                color: "rgba(0,0,0,0.87)",
                              }}
                            >
                              {t(
                                "componentData.vendorInfo.RemittanceDeliveryMode"
                              )}
                              <Box>
                                <span className={classes.gapHorizontal}>
                                  <Checkbox
                                    checked={true}
                                    label={
                                      info["data"][0].remittanceInfo
                                        .remittanceDeliveryOptionDescription ||
                                      ""
                                    }
                                    index={0}
                                    disabled={!canEdit}
                                    className={classes.remCheckbox}
                                  />
                                </span>
                              </Box>
                            </span>
                          </Box>
                        </Grid>
                      )}

                    <Grid item xs={4}></Grid>
                    {name === "achInfo" &&
                      info["data"] &&
                      info["data"].length > 0 &&
                      info["data"][0].remittanceInfo && (
                        <Grid item xs={4}>
                          <Box my={2}>
                            <span
                              style={{
                                float: "right",
                                color: "rgba(0,0,0,0.87)",
                              }}
                            >
                              {t("componentData.vendorInfo.RemittanceFormat")}
                              <Box>
                                <span className={classes.gapHorizontal}>
                                  <Checkbox
                                    checked={true}
                                    label={
                                      isHippa &&
                                      info["data"][0].remittanceInfo
                                        .remittanceFormatDescription == "EDI"
                                        ? "EDI/PDF"
                                        : info["data"][0].remittanceInfo
                                            .remittanceFormatDescription || ""
                                    }
                                    disabled={!canEdit}
                                    index={0}
                                  />
                                </span>
                              </Box>
                            </span>
                          </Box>
                        </Grid>
                      )}
                  </>
                )}
              </Grid>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction="row">
                {info["data"] &&
                  info["data"].map((detail) => {
                    const isDisabled = this.isRemitToIdDisabled(detail);
                    return (
                      <>
                        <Grid container className={classes.expansionDetails}>
                          <Grid
                            item
                            md={12}
                            style={{ padding: "0px", textAlign: "right" }}
                          >
                            {isPayeePaymentEditable &&
                              vendorDetail.profileStatus &&
                              vendorDetail.profileStatus.actualDescription ===
                                "Approved" && (
                                <Tooltip
                                  title={
                                    isPayeeEditableDisabled
                                      ? t(
                                          "componentData.vendorInfo.disabledEditTooltip"
                                        )
                                      : ""
                                  }
                                  arrow
                                  placement="left"
                                >
                                  <span>
                                    <IconButton
                                      color="primary"
                                      aria-label="Edit Contact"
                                      title={t(
                                        "componentData.vendorContactInfo.EditContact"
                                      )}
                                      component="span"
                                      onClick={(event) =>
                                        this.setState({
                                          editBankDetails: true,
                                          selectedBank: detail,
                                        })
                                      }
                                      disabled={isPayeeEditableDisabled}
                                    >
                                      <EditIcon
                                        style={{
                                          width: "20px",
                                          height: "24px",
                                        }}
                                        color={
                                          isPayeeEditableDisabled
                                            ? "disabled"
                                            : "secondary"
                                        }
                                      />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              )}
                          </Grid>
                          <Grid item xs={6}>
                            <Box my={2}>
                              {detail && detail.accountName && (
                                <Box display="flex" width={1}>
                                  <Box display="flex" width={1 / 2}>
                                    <span className={classes.infoKey}>
                                      {t(
                                        "componentData.vendorInfo.AccountOwnerName"
                                      )}
                                    </span>
                                  </Box>
                                  <Box display="flex" width={1 / 2}>
                                    <span className={classes.infoValue}>
                                      {detail["accountName"]}
                                    </span>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                            <Box my={2}>
                              {detail && detail.accountNumber && (
                                <Box display="flex" width={1}>
                                  <Box display="flex" width={1 / 2}>
                                    <span className={classes.infoKey}>
                                      {t(
                                        "componentData.vendorInfo.AccountNumber"
                                      )}
                                    </span>
                                  </Box>
                                  <Box display="flex" width={1 / 2}>
                                    <span
                                      onClick={() =>
                                        this.getUnmaskedAccountNumber(
                                          detail.payeeBankAccountDetailId
                                        )
                                      }
                                      className={classes.infoValue}
                                    >
                                      {detail["accountNumber"].replace(
                                        /.(?=.{4})/g,
                                        "*"
                                      )}
                                    </span>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                            <Box my={2}>
                              {detail && detail.bankName && (
                                <Box display="flex" width={1}>
                                  <Box display="flex" width={1 / 2}>
                                    <span className={classes.infoKey}>
                                      {t("componentData.vendorInfo.BankName")}
                                    </span>
                                  </Box>
                                  <Box display="flex" width={1 / 2}>
                                    <span className={classes.infoValue}>
                                      {detail["bankName"]}
                                    </span>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                            <Box my={2}>
                              {detail && detail.currencyCode && (
                                <Box display="flex" width={1}>
                                  <Box display="flex" width={1 / 2}>
                                    <span className={classes.infoKey}>
                                      {t("componentData.vendorInfo.Currency")}
                                    </span>
                                  </Box>
                                  <Box display="flex" width={1 / 2}>
                                    {" "}
                                    <span className={classes.infoValue}>
                                      {detail["currencyCode"]}
                                    </span>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                            <Box my={2}>
                              {detail && detail.bankCountryIso && (
                                <Box display="flex" width={1}>
                                  <Box display="flex" width={1 / 2}>
                                    <span className={classes.infoKey}>
                                      {t("componentData.vendorInfo.Country")}
                                    </span>
                                  </Box>
                                  <Box display="flex" width={1 / 2}>
                                    {" "}
                                    <span className={classes.infoValue}>
                                      {detail["bankCountryIso"]}
                                    </span>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                            {detail.payeeValidationStatus &&
                              detail.payeeValidationStatus.length > 0 &&
                              detail.payeeValidationStatus[0]
                                .validationStatus === "SUCCESS" && (
                                <Box my={2}>
                                  <img
                                    className={classes.payment_icon}
                                    src={require(`~/assets/icons/checkbox_Blue.svg`)}
                                    alt=""
                                  />
                                  <Typography
                                    variant="span"
                                    className={classes.validationDone}
                                  >
                                    {t(
                                      "componentData.vendorInfo.ValidationDone"
                                    )}
                                  </Typography>
                                </Box>
                              )}
                            {detail.payeeValidationStatus &&
                              detail.payeeValidationStatus.length > 0 &&
                              (detail.payeeValidationStatus[0]
                                .validationStatus === "FAILED" ||
                                detail.payeeValidationStatus[0]
                                  .validationStatus === "PENDING") && (
                                <Box my={2}>
                                  <img
                                    className={classes.payment_icon}
                                    src={require(`~/assets/icons/icon_pending.svg`)}
                                    alt=""
                                  />
                                  <Typography
                                    variant="span"
                                    className={classes.validationPending}
                                  >
                                    {detail.payeeValidationStatus[0]
                                      .validationStatus === "FAILED"
                                      ? t(
                                          "componentData.vendorInfo.ValidationFailed"
                                        )
                                      : t(
                                          "componentData.vendorInfo.ValidationPending"
                                        )}
                                  </Typography>
                                </Box>
                              )}
                            <Box my={2}>
                              <Grid container>
                                <Grid item xs={6}>
                                  <span className={classes.infoKey}>
                                    {t(
                                      "componentData.vendorInfo.SelectRemittoID"
                                    )}
                                  </span>
                                </Grid>
                                <Grid item xs={6}>
                                  <Tooltip
                                    placement="right"
                                    arrow
                                    title={
                                      isDisabled && isMySupplierEditEnabled
                                        ? t(
                                            "componentData.vendorInfo.remitToIdsDisabledTooltip"
                                          )
                                        : ""
                                    }
                                  >
                                    <div className={classes.infoValue}>
                                      <CheckboxOutline
                                        supplierIds={supplierIds}
                                        selectedValues={detail?.remitToIdDetail}
                                        type={name}
                                        disabled={isDisabled}
                                        onChange={this.handleCheckBoxChange}
                                      />
                                    </div>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </Box>
                            {info["data"] &&
                              info["data"].length > 0 &&
                              detail.remittanceInfo &&
                              detail.remittanceInfo.remittanceDeliveryAddress &&
                              detail.remittanceInfo.remittanceDeliveryAddress
                                .length !== 0 &&
                              isRemNotRequired === 0 && (
                                <Box my={2}>
                                  <Grid container>
                                    <Grid item xs={6}>
                                      <span className={classes.infoKey}>
                                        {t(
                                          "componentData.vendorInfo.RemittanceEmailId"
                                        )}
                                      </span>
                                    </Grid>
                                    <Grid item xs={6}>
                                      <Link
                                        color="inherit"
                                        href={`mailto:${detail.remittanceInfo.remittanceDeliveryAddress}`}
                                      >
                                        <span className={classes.infoValue}>
                                          {detail.remittanceInfo
                                            .remittanceDeliveryAddress || ""}
                                        </span>
                                      </Link>
                                    </Grid>
                                  </Grid>
                                </Box>
                              )}
                          </Grid>
                          <Grid item xs={6}>
                            <Box my={2}>
                              {detail && detail.routingCode && (
                                <Box display="flex" width={1}>
                                  <Box display="flex" width={1 / 2}>
                                    <span className={classes.infoKey}>
                                      {t(
                                        "componentData.vendorInfo.RoutingNumber"
                                      )}
                                    </span>
                                  </Box>
                                  <Box display="flex" width={1 / 2}>
                                    <span className={classes.infoValue}>
                                      {detail["routingCode"] || ""}
                                    </span>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                            <Box my={2}>
                              {detail &&
                                detail.accountClass &&
                                detail.accountClass.description && (
                                  <Box display="flex" width={1}>
                                    <Box display="flex" width={1 / 2}>
                                      <span className={classes.infoKey}>
                                        {t(
                                          "componentData.vendorInfo.AccountClassification"
                                        )}
                                      </span>
                                    </Box>
                                    <Box display="flex" width={1 / 2}>
                                      <span className={classes.infoValue}>
                                        {detail.accountClass.description}
                                      </span>
                                    </Box>
                                  </Box>
                                )}
                            </Box>
                            <Box my={2}>
                              {detail &&
                                detail.accountType &&
                                detail.accountType.description && (
                                  <Box display="flex" width={1}>
                                    <Box display="flex" width={1 / 2}>
                                      <span className={classes.infoKey}>
                                        {t(
                                          "componentData.vendorInfo.AccountType"
                                        )}
                                      </span>
                                    </Box>
                                    <Box display="flex" width={1 / 2}>
                                      <span className={classes.infoValue}>
                                        {detail.accountType.description}
                                      </span>
                                    </Box>
                                  </Box>
                                )}
                            </Box>
                            <Box my={2}>
                              <Box display="flex" width={1}>
                                <Box display="flex" width={1 / 2}>
                                  <span className={classes.infoKey}>
                                    {t("componentData.vendorInfo.Location")}
                                  </span>
                                </Box>
                                {name === "achInfo" && (
                                  <Box display="block" width={1 / 2}>
                                    <span className={classes.infoValue}>
                                      {(detail &&
                                        detail.payeeBankAccountLocations &&
                                        detail.payeeBankAccountLocations
                                          .length > 0 &&
                                        detail.payeeBankAccountLocations[0]
                                          .locationName) ||
                                        ""}
                                      {detail &&
                                        detail.payeeBankAccountLocations &&
                                        detail.payeeBankAccountLocations
                                          .length > 0 &&
                                        detail.payeeBankAccountLocations[0]
                                          .locationType &&
                                        detail.payeeBankAccountLocations[0]
                                          .locationType.locationTypeName &&
                                        ` (${detail.payeeBankAccountLocations[0].locationType.locationTypeName})`}
                                    </span>
                                    {detail.payeeBankAccountLocations &&
                                      detail.payeeBankAccountLocations.length >
                                        1 && (
                                        <div>
                                          <PaymentTooltip
                                            payeeBankAccountData={
                                              detail.payeeBankAccountLocations
                                            }
                                          />
                                        </div>
                                      )}
                                  </Box>
                                )}
                                {name === "crossBorder" && (
                                  <Box display="block" width={1 / 2}>
                                    <span className={classes.infoValue}>
                                      {(detail &&
                                        detail.payeeCrossBorderLocations &&
                                        detail.payeeCrossBorderLocations
                                          .length > 0 &&
                                        detail.payeeCrossBorderLocations[0]
                                          .locationName) ||
                                        ""}
                                      {detail &&
                                        detail.payeeCrossBorderLocations &&
                                        detail.payeeCrossBorderLocations
                                          .length > 0 &&
                                        detail.payeeCrossBorderLocations[0]
                                          .locationType &&
                                        detail.payeeCrossBorderLocations[0]
                                          .locationType.locationTypeName &&
                                        ` (${detail.payeeCrossBorderLocations[0].locationType.locationTypeName})`}
                                    </span>
                                    {detail.payeeCrossBorderLocations &&
                                      detail.payeeCrossBorderLocations.length >
                                        1 && (
                                        <div>
                                          <PaymentTooltip
                                            payeeBankAccountData={
                                              detail.payeeCrossBorderLocations
                                            }
                                          />
                                        </div>
                                      )}
                                  </Box>
                                )}
                              </Box>
                              {name === "achInfo" &&
                                info["data"] &&
                                info["data"].length > 0 &&
                                detail?.remittanceInfo?.sharedPaymentNpiInfo
                                  ?.paymentOption?.description && (
                                  <Box my={2}>
                                    <Grid container>
                                      <Grid item xs={6}>
                                        <span className={classes.infoKey}>
                                          {t(
                                            "componentData.vendorInfo.paymentOption"
                                          )}
                                        </span>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <span className={classes.infoValue}>
                                          {detail?.remittanceInfo
                                            ?.sharedPaymentNpiInfo
                                            ?.paymentOption?.description || ""}
                                        </span>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                )}
                              {name === "achInfo" &&
                                info["data"] &&
                                info["data"].length > 0 &&
                                detail?.remittanceInfo?.sharedPaymentNpiInfo
                                  ?.npiId && (
                                  <Box my={2}>
                                    <Grid container>
                                      <Grid item xs={6}>
                                        <span className={classes.infoKey}>
                                          {t("componentData.vendorInfo.npiId")}
                                        </span>
                                      </Grid>
                                      <Grid item xs={6}>
                                        <Box
                                          className={classes.infoValue}
                                          display="flex"
                                          flexWrap="wrap"
                                          flexDirection="column"
                                          alignContent="flex-start"
                                          width={"100%"}
                                        >
                                          {detail?.remittanceInfo?.sharedPaymentNpiInfo?.npiId
                                            ?.split(",")
                                            .map((item, index, arr) => {
                                              if (arr.length - 1 === index) {
                                                return <Box>{item}</Box>;
                                              } else {
                                                return <Box>{`${item},`}</Box>;
                                              }
                                            })}
                                        </Box>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                )}

                              {detail && detail.message && (
                                <Box my={7}>
                                  <Box display="flex" width={1}>
                                    <Box
                                      display="flex"
                                      width={"93%"}
                                      style={{ wordBreak: "break-word" }}
                                    >
                                      <InfoOutlinedIcon
                                        style={{ color: "#E03617" }}
                                      />
                                      <div
                                        className={classes.errorMsg}
                                        style={{ color: "#E03617" }}
                                      >
                                        {detail.message}
                                        {(detail.updatedByOtherClientUser ===
                                          undefined ||
                                          detail.updatedByOtherClientUser) &&
                                          t(
                                            "componentData.vendorInfo.approveChange"
                                          )}
                                        {(detail.updatedByOtherClientUser ===
                                          undefined ||
                                          detail.updatedByOtherClientUser) && (
                                          <Link
                                            style={{
                                              color: "#4C4C4C",
                                              cursor: "pointer",
                                            }}
                                            className={classes.lnk}
                                            onClick={() => {
                                              const selectedTab =
                                                (detail.updatedByWho &&
                                                  detail.updatedByWho ===
                                                    "CLIENT" &&
                                                  detail.updatedByOtherClientUser) ||
                                                detail.inactiveDueToCompanyUpdatedByClient
                                                  ? 0
                                                  : 1;
                                              this.props
                                                .dispatch(
                                                  updateRPUSelectedTab(
                                                    selectedTab
                                                  )
                                                )
                                                .then(() => {
                                                  this.props.history.push(
                                                    `${config.baseName}/suppliers/supplierUpdates`
                                                  );
                                                });
                                            }}
                                          >
                                            {t(
                                              "componentData.vendorInfo.PayeeUpdates"
                                            )}
                                          </Link>
                                        )}{" "}
                                        {(detail.updatedByOtherClientUser ===
                                          undefined ||
                                          detail.updatedByOtherClientUser) &&
                                          t(
                                            "componentData.vendorInfo.tocontinue"
                                          )}
                                      </div>
                                    </Box>
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </>
                    );
                  })}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )}
      </Grid>
    );
  };

  handleBankEditMode = () => {
    this.setState({
      editBankDetails: !this.state.editBankDetails,
    });
  };

  handleVCAEditMode = () => {
    this.setState({
      editVCADetails: !this.state.editVCADetails,
    });
  };

  render() {
    const { theme } = this.props.clientConfig.layout;
    const { classes, user, vendorDetail, t } = this.props;
    const {
      openDisapproveDialog,
      supplierIds,
      defaultSupplierIds,
      addSupplier,
      validation,
      validationVariant,
      achInfo,
      vcaInfo,
      chkInfo,
      wire,
      crossBorder,
      noteMessage,
      bulkRemInfo,
      showBulkRem,
      frequency,
      openDisclaimer,
      approveValidation,
      approveValidationMessage,
      approveValidBtn,
      selectedTab,
      isPayeeEditable,
      isPayeeEditableDisabled,
      isHippa,
      showConfirmDialog,
      showConfirmDialogMessage,
      editVCADetails,
      selectedBank,
      currencyList,
      isPayeePaymentEditable,
      showNpiTab,
      openUnmaskedAccountNumber,
      isRemNotRequired,
    } = this.state;

    const isMySupplierApproveEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_MY_SUPPLIERS_APPROVE"]
        )) ||
      false;
    const isMySupplierRejectEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_MY_SUPPLIERS_REJECT"]
        )) ||
      false;

    const isMySupplierEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_EDIT"])) ||
      false;
    const unmaskedAccountNumber =
      this.props.suppliers?.unmaskedAccountNumber?.data?.accountNumber;
    return (
      <Box flexGrow={1}>
        <Grid>
          {openDisclaimer && (
            <InfoDialogue
              title={t("componentData.vendorInfo.infoMsg")}
              px={12}
              py={2.4}
              onCancel={() => {
                this.setState({
                  openDisclaimer: false,
                });
                this.props.onConfirm();
              }}
              onConfirm={() => this.handleApproveDetails(true)}
              confirmText={t("componentData.vendorInfo.CONTINUE")}
              open={true}
            />
          )}
          {openDisapproveDialog && (
            <InfoDialogue
              title={t("componentData.vendorInfo.confirmTitle")}
              px={12}
              py={2.4}
              onCancel={() => {
                this.setState({
                  openDisapproveDialog: false,
                });
              }}
              onConfirm={() => this.handleDisapproveProfile()}
              confirmText={t("componentData.vendorInfo.CONTINUE")}
              open={true}
            />
          )}
          {openUnmaskedAccountNumber && (
            <Dialog
              onClose={() =>
                this.setState({
                  openUnmaskedAccountNumber: false,
                })
              }
              open={true}
            >
              <DialogContent style={{ display: "flex" }}>
                <Typography
                  style={{
                    paddingRight: "8px",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {t("componentData.vendorInfo.accountNumber")}
                </Typography>
                <Typography style={{ fontWeight: "bold", fontSize: "18px" }}>
                  {unmaskedAccountNumber}
                </Typography>
              </DialogContent>
              <DialogActions style={{ justifyContent: "center" }}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() =>
                    this.setState({
                      openUnmaskedAccountNumber: false,
                    })
                  }
                >
                  {t("componentData.vendorInfo.OK")}
                </Button>
              </DialogActions>
            </Dialog>
          )}
          <Grid item xs={12}>
            <Box mb={4}>
              <span
                style={{
                  background: theme.palette.background.default,
                  color: theme.palette.primary.main,
                }}
                className={classes.profileCircle}
              >
                {this.getProfileCircleName(
                  vendorDetail && vendorDetail.companyName
                )}
              </span>
              <div
                style={{ color: theme.palette.primary.main }}
                className={classes.vendorName}
              >
                {vendorDetail.companyName}
              </div>
              <Typography
                variant="h3"
                color="inherit"
                style={{ textAlign: "center" }}
              >
                {t("componentData.vendorInfo.Status")}{" "}
                {vendorDetail.profileStatus &&
                  vendorDetail.profileStatus.description}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <div className={classes.paymentsTabContainer} id="payeeTab">
              <Grid item xs={12} md={12} lg={12}>
                <Tabs
                  orientation="horizontal"
                  variant="standard"
                  value={selectedTab}
                  aria-label="Payment Type"
                  textColor="#008CE6"
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "#008CE6",
                      color: "#008CE6",
                    },
                  }}
                >
                  <Tab
                    onClick={() => this.handleTabChange(0)}
                    label={t("componentData.vendorInfo.CompanyInformation")}
                    disabled={false}
                    classes={classes.tabClasses}
                  />
                  <Tab
                    onClick={() => this.handleTabChange(1)}
                    label={t("componentData.vendorInfo.ContactInformation")}
                    disabled={
                      vendorDetail.payeeId === null ||
                      (vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Revoked") ||
                      (vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Disapproved")
                        ? true
                        : false
                    }
                  />
                  <Tab
                    onClick={() => this.handleTabChange(2)}
                    label={t("componentData.vendorInfo.PaymentInformation")}
                    disabled={
                      vendorDetail.payeeId === null ||
                      (vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Revoked") ||
                      (vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Disapproved")
                        ? true
                        : false
                    }
                  />
                  <Tab
                    onClick={() => this.handleTabChange(3)}
                    label={t("componentData.vendorInfo.LocationsTxt")}
                    disabled={
                      vendorDetail.payeeId === null ||
                      (vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Revoked") ||
                      (vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Disapproved")
                        ? true
                        : false
                    }
                  />
                  <Tab
                    onClick={() => this.handleTabChange(4)}
                    label={t("componentData.vendorInfo.Validation")}
                    disabled={
                      vendorDetail.payeeId === null ||
                      (vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Revoked") ||
                      (vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Disapproved")
                        ? true
                        : false
                    }
                  />
                  {showNpiTab && (
                    <Tab
                      onClick={() => this.handleTabChange(5)}
                      label={t("componentData.vendorInfo.NpiId")}
                      disabled={
                        vendorDetail.payeeId === null ||
                        (vendorDetail.profileStatus &&
                          vendorDetail.profileStatus.actualDescription ===
                            "Revoked") ||
                        (vendorDetail.profileStatus &&
                          vendorDetail.profileStatus.actualDescription ===
                            "Disapproved")
                          ? true
                          : false
                      }
                    />
                  )}
                </Tabs>
              </Grid>

              <Grid item xs={12} md={12}>
                <TabPanel value={selectedTab} index={0}>
                  <VendorCompanyInfo
                    vendorDetail={vendorDetail}
                    isPayeeEditable={
                      isPayeeEditable &&
                      vendorDetail.profileStatus &&
                      vendorDetail.profileStatus.actualDescription ===
                        "Approved"
                    }
                    isPayeeEditableDisabled={isPayeeEditableDisabled}
                    getAllVendorsList={this.props.getAllVendorsList}
                    setCompanyDetail={this.props.setCompanyDetail}
                    history={this.props.history}
                  />
                </TabPanel>
                <TabPanel value={selectedTab} index={1}>
                  <VendorContactInfo
                    id={vendorDetail.payeeId}
                    getProfileCircleName={this.getProfileCircleName}
                    isPayeeEditable={
                      isPayeeEditable &&
                      vendorDetail.profileStatus &&
                      vendorDetail.profileStatus.actualDescription ===
                        "Approved"
                    }
                    isPayeeEditableDisabled={isPayeeEditableDisabled}
                    getAllVendorsList={this.props.getAllVendorsList}
                    history={this.props.history}
                  />
                </TabPanel>
                <TabPanel value={selectedTab} index={3}>
                  <VendorLocations
                    id={vendorDetail.payeeId}
                    isPayeeEditable={
                      isPayeeEditable &&
                      vendorDetail.profileStatus &&
                      vendorDetail.profileStatus.actualDescription ===
                        "Approved"
                    }
                    isPayeeEditableDisabled={isPayeeEditableDisabled}
                    getAllVendorsList={this.props.getAllVendorsList}
                    history={this.props.history}
                  />
                </TabPanel>
                <TabPanel value={selectedTab} index={4}>
                  <ValidationStatus
                    id={vendorDetail.payeeId}
                    isPayeeEditable={
                      isPayeeEditable &&
                      vendorDetail.profileStatus &&
                      vendorDetail.profileStatus.actualDescription ===
                        "Approved"
                    }
                    getAllVendorsList={this.props.getAllVendorsList}
                  />
                </TabPanel>
                <TabPanel value={selectedTab} index={5}>
                  <NpiIdView
                    payeeId={vendorDetail.payeeId || null}
                    actPayeeId={vendorDetail.actPayeeId || null}
                    isPayeeEditable={
                      isPayeeEditable &&
                      vendorDetail.profileStatus &&
                      vendorDetail.profileStatus.actualDescription ===
                        "Approved"
                    }
                    getAllVendorsList={this.props.getAllVendorsList}
                  />
                </TabPanel>
                <TabPanel value={selectedTab} index={2}>
                  <Grid container spacing={2}>
                    {defaultSupplierIds && defaultSupplierIds.length > 0 && (
                      <DefaultRemitToID
                        defaultSupplierIds={defaultSupplierIds}
                        onChange={this.onDefaultRemitToChange}
                      />
                    )}

                    {supplierIds.length > 0 &&
                      supplierIds.map((item, index) => {
                        return (
                          <>
                            <Grid item xs={6} md={6}>
                              <Box
                                p={1}
                                flexGrow={1}
                                display="flex"
                                alignItems="center"
                              >
                                <TextField
                                  name="supplierId"
                                  id="id"
                                  label={t("componentData.vendorInfo.PayeeID")}
                                  type="text"
                                  variant="outlined"
                                  value={item.entityIdentifier}
                                  disabled
                                  style={{
                                    width: "90%",
                                    display: "flex",
                                  }}
                                />
                                {isMySupplierEditEnabled && (
                                  <IconButton
                                    color="primary"
                                    component="span"
                                    onClick={() => {
                                      if (isMySupplierEditEnabled) {
                                        this.handleRemoveID(item, index);
                                      }
                                    }}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </Grid>
                          </>
                        );
                      })}
                    <Grid container xs={12} spacing={2}>
                      <Grid item xs={6} md={6}>
                        <TextField
                          style={{
                            display: "flex",
                            width: "85%",
                            margin: "16px 0 0 16px",
                          }}
                          id="id"
                          label={t("componentData.vendorInfo.PayeeID")}
                          placeholder={t(
                            "componentData.vendorInfo.EnterPayeeID"
                          )}
                          type="text"
                          variant="outlined"
                          value={addSupplier}
                          disabled={!isMySupplierEditEnabled}
                          name="addSupplier"
                          onChange={(e) => {
                            this.setState({
                              [e.target.name]: e.target.value.replace(
                                /[^A-Za-z0-9-_+@$~%* ]/g,
                                ""
                              ),
                            });
                          }}
                          inputProps={{ maxLength: 50 }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} spacing={2}>
                      {" "}
                      <Typography
                        variant="subtitle1"
                        color={validationVariant ? "error" : "inherit"}
                      >
                        {validation}
                      </Typography>
                    </Grid>
                    <Box p={1} flexGrow={1} className={classes.btnContainer}>
                      {isMySupplierEditEnabled && (
                        <Button
                          type="submit"
                          fullWidth={false}
                          variant="outlined"
                          color="primary"
                          onClick={this.addRemitToID}
                          className={classes.btnSave}
                        >
                          {t("componentData.vendorInfo.Save")}
                        </Button>
                      )}
                    </Box>

                    {achInfo &&
                      achInfo["data"] &&
                      achInfo["data"].length > 0 &&
                      this.renderACHInfo(achInfo, "achInfo")}
                    {chkInfo && chkInfo["data"] && chkInfo["data"].length > 0 && (
                      <Grid item xs={12} md={12}>
                        <ExpansionPanel className={classes.panel}>
                          <ExpansionPanelSummary
                            expandIcon={""}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Grid container>
                              <Grid item xs={12}>
                                <Typography
                                  variant="h2"
                                  className={classes.paymentTitle}
                                  style={{ float: "left" }}
                                >
                                  <img
                                    className={classes.payment_icon}
                                    src={require(`~/assets/icons/CHK_main.svg`)}
                                    alt=""
                                  />{" "}
                                  {t(
                                    `componentData.vendorInfo.${chkInfo["name"]}`
                                  )}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  className={classes.showText}
                                  style={{ float: "right" }}
                                >
                                  {chkInfo["data"].length > 1
                                    ? `${t("componentData.vendorInfo.SHOW")} ${
                                        chkInfo["data"].length
                                      } ${t(
                                        "componentData.vendorInfo.ACCOUNTS"
                                      )}`
                                    : t("componentData.vendorInfo.SHOWACCOUNT")}
                                </Typography>
                              </Grid>
                              {isRemNotRequired === 0 && (
                                <>
                                  {chkInfo["data"] &&
                                    chkInfo["data"].length > 0 &&
                                    chkInfo["data"][0].remittanceInfo && (
                                      <Grid item xs={4}>
                                        <Box my={2} pl={3}>
                                          <span
                                            style={{
                                              float: "left",
                                              color: "rgba(0,0,0,0.87)",
                                            }}
                                          >
                                            {t(
                                              "componentData.vendorInfo.RemittanceDeliveryMode"
                                            )}
                                            <Box>
                                              <span
                                                className={
                                                  classes.gapHorizontal
                                                }
                                              >
                                                <Checkbox
                                                  checked={true}
                                                  label={
                                                    chkInfo["data"][0]
                                                      .remittanceInfo
                                                      .remittanceDeliveryOptionDescription ||
                                                    ""
                                                  }
                                                  index={0}
                                                  className={
                                                    classes.remCheckbox
                                                  }
                                                />
                                              </span>
                                            </Box>
                                          </span>
                                        </Box>
                                      </Grid>
                                    )}

                                  <Grid item xs={4}></Grid>
                                  {chkInfo["data"] &&
                                    chkInfo["data"].length > 0 &&
                                    chkInfo["data"][0].remittanceInfo && (
                                      <Grid item xs={4}>
                                        <Box my={2}>
                                          <span style={{ float: "right" }}>
                                            {t(
                                              "componentData.vendorInfo.RemittanceFormat"
                                            )}
                                            <Box>
                                              <span
                                                className={
                                                  classes.gapHorizontal
                                                }
                                              >
                                                <Checkbox
                                                  checked={true}
                                                  label={
                                                    isHippa &&
                                                    chkInfo["data"][0]
                                                      .remittanceInfo
                                                      .remittanceFormatDescription ==
                                                      "EDI"
                                                      ? "EDI/PDF"
                                                      : chkInfo["data"][0]
                                                          .remittanceInfo
                                                          .remittanceFormatDescription ||
                                                        ""
                                                  }
                                                  index={0}
                                                />
                                              </span>
                                            </Box>
                                          </span>
                                        </Box>
                                      </Grid>
                                    )}
                                </>
                              )}
                            </Grid>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <Grid container direction="row">
                              {chkInfo["data"] &&
                                chkInfo["data"].map((detail) => {
                                  const isDisabled =
                                    this.isRemitToIdDisabled(detail);
                                  return (
                                    <>
                                      <Grid
                                        container
                                        className={classes.expansionDetails}
                                      >
                                        <Grid item xs={6}>
                                          <Box my={2}>
                                            {detail && detail.makePayableTo && (
                                              <>
                                                <span
                                                  className={classes.infoKey}
                                                >
                                                  {t(
                                                    "componentData.vendorInfo.MakePayableTo"
                                                  )}
                                                </span>
                                                <span
                                                  className={classes.infoValue}
                                                >
                                                  {detail["makePayableTo"]}
                                                </span>
                                              </>
                                            )}
                                          </Box>
                                          <Box my={2}>
                                            {detail && detail.attentionTo && (
                                              <>
                                                <span
                                                  className={classes.infoKey}
                                                >
                                                  {t(
                                                    "componentData.vendorInfo.AttentionTo"
                                                  )}
                                                </span>
                                                <span
                                                  className={classes.infoValue}
                                                >
                                                  {detail["attentionTo"]}
                                                </span>
                                              </>
                                            )}
                                          </Box>
                                          <Box my={2}>
                                            <Grid container>
                                              <Grid item xs={6}>
                                                <span
                                                  className={classes.infoKey}
                                                >
                                                  {t(
                                                    "componentData.vendorInfo.SelectRemittoID"
                                                  )}
                                                </span>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Tooltip
                                                  placement="right"
                                                  arrow
                                                  title={
                                                    isDisabled &&
                                                    isMySupplierEditEnabled
                                                      ? t(
                                                          "componentData.vendorInfo.remitToIdsDisabledTooltip"
                                                        )
                                                      : ""
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    <CheckboxOutline
                                                      supplierIds={supplierIds}
                                                      selectedValues={
                                                        detail?.remitToIdDetail
                                                      }
                                                      type={"chkInfo"}
                                                      disabled={isDisabled}
                                                      onChange={
                                                        this
                                                          .handleCheckBoxChange
                                                      }
                                                    />
                                                  </div>
                                                </Tooltip>
                                              </Grid>
                                            </Grid>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                          {detail["city"] && (
                                            <Box my={2}>
                                              <>
                                                <span
                                                  className={classes.infoKey}
                                                >
                                                  {t(
                                                    "componentData.vendorInfo.CityState"
                                                  )}
                                                </span>
                                                <span
                                                  className={classes.infoValue}
                                                >
                                                  {
                                                    (detail && detail["city"],
                                                    detail &&
                                                      detail["stateRegion"])
                                                  }
                                                </span>
                                              </>
                                            </Box>
                                          )}
                                          {detail["locationOption"] && (
                                            <Box my={2}>
                                              <>
                                                <span
                                                  className={classes.infoKey}
                                                >
                                                  {t(
                                                    "componentData.vendorInfo.LocationOptions"
                                                  )}
                                                </span>
                                                <span
                                                  className={classes.infoValue}
                                                >
                                                  {detail &&
                                                    detail.locationOption
                                                      .description}
                                                </span>
                                              </>
                                            </Box>
                                          )}
                                          <Box my={2}>
                                            <>
                                              <span className={classes.infoKey}>
                                                {t(
                                                  "componentData.vendorInfo.UsedFor"
                                                )}
                                              </span>
                                              <span
                                                className={classes.infoValue}
                                              >
                                                {(detail &&
                                                  detail["usedFor"]) ||
                                                  ""}
                                              </span>
                                            </>
                                          </Box>
                                        </Grid>
                                      </Grid>
                                    </>
                                  );
                                })}
                            </Grid>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </Grid>
                    )}
                    {vcaInfo && vcaInfo["data"] && vcaInfo["data"].length > 0 && (
                      <Grid item xs={12} md={12}>
                        {editVCADetails ? (
                          <EditVirtualCardView
                            VCADetails={selectedBank}
                            paymentType="VCA"
                            currencyList={currencyList}
                            handleCancel={() => {
                              this.setState({ editVCADetails: false });
                            }}
                            handleVCAEditMode={this.handleVCAEditMode}
                            refreshData={this.refreshData}
                          />
                        ) : (
                          <ExpansionPanel className={classes.panel}>
                            <ExpansionPanelSummary
                              expandIcon={""}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                            >
                              <Grid container>
                                <Grid item xs={12}>
                                  <Typography
                                    variant="h2"
                                    className={classes.paymentTitle}
                                    style={{ float: "left" }}
                                  >
                                    <img
                                      className={classes.payment_icon}
                                      src={require(`~/assets/icons/VCA_main.svg`)}
                                      alt=""
                                    />{" "}
                                    {t(
                                      `componentData.vendorInfo.${vcaInfo["name"]}`
                                    )}
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    className={classes.showText}
                                    style={{ float: "right" }}
                                  >
                                    {vcaInfo["data"].length > 1
                                      ? `${t(
                                          "componentData.vendorInfo.SHOW"
                                        )} ${vcaInfo["data"].length} ${t(
                                          "componentData.vendorInfo.ACCOUNTS"
                                        )}`
                                      : t(
                                          "componentData.vendorInfo.SHOWACCOUNT"
                                        )}
                                  </Typography>
                                </Grid>
                                {isRemNotRequired === 0 && (
                                  <>
                                    {vcaInfo["data"] &&
                                      vcaInfo["data"].length > 0 &&
                                      vcaInfo["data"][0].remittanceInfo && (
                                        <Grid item xs={4}>
                                          <Box my={2} pl={3}>
                                            <span
                                              style={{
                                                float: "left",
                                                color: "rgba(0,0,0,0.87)",
                                              }}
                                            >
                                              {t(
                                                "componentData.vendorInfo.RemittanceDeliveryMode"
                                              )}
                                              <Box>
                                                <span
                                                  className={
                                                    classes.gapHorizontal
                                                  }
                                                >
                                                  <Checkbox
                                                    checked={true}
                                                    label={
                                                      vcaInfo["data"][0]
                                                        .remittanceInfo
                                                        .remittanceDeliveryOptionDescription ||
                                                      ""
                                                    }
                                                    index={0}
                                                    className={
                                                      classes.remCheckbox
                                                    }
                                                  />
                                                </span>
                                              </Box>
                                            </span>
                                          </Box>
                                        </Grid>
                                      )}

                                    <Grid item xs={4}></Grid>
                                    {vcaInfo["data"] &&
                                      vcaInfo["data"].length > 0 &&
                                      vcaInfo["data"][0].remittanceInfo && (
                                        <Grid item xs={4}>
                                          <Box my={2}>
                                            <span style={{ float: "right" }}>
                                              {t(
                                                "componentData.vendorInfo.RemittanceFormat"
                                              )}
                                              <Box>
                                                <span
                                                  className={
                                                    classes.gapHorizontal
                                                  }
                                                >
                                                  <Checkbox
                                                    checked={true}
                                                    label={
                                                      isHippa &&
                                                      vcaInfo["data"][0]
                                                        .remittanceInfo
                                                        .remittanceFormatDescription ==
                                                        "EDI"
                                                        ? "EDI/PDF"
                                                        : vcaInfo["data"][0]
                                                            .remittanceInfo
                                                            .remittanceFormatDescription ||
                                                          ""
                                                    }
                                                    index={0}
                                                  />
                                                </span>
                                              </Box>
                                            </span>
                                          </Box>
                                        </Grid>
                                      )}
                                  </>
                                )}
                              </Grid>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                              <Grid container direction="row">
                                {vcaInfo["data"] &&
                                  vcaInfo["data"].map((detail) => {
                                    const isDisabled =
                                      this.isRemitToIdDisabled(detail);
                                    return (
                                      <>
                                        <Grid
                                          container
                                          className={classes.expansionDetails}
                                        >
                                          <Grid
                                            item
                                            md={12}
                                            style={{
                                              padding: "0px",
                                              textAlign: "right",
                                            }}
                                          >
                                            {isPayeePaymentEditable &&
                                              vendorDetail.profileStatus &&
                                              vendorDetail.profileStatus
                                                .actualDescription ===
                                                "Approved" && (
                                                <Tooltip
                                                  title={
                                                    isPayeeEditableDisabled
                                                      ? t(
                                                          "componentData.vendorInfo.disabledEditTooltip"
                                                        )
                                                      : ""
                                                  }
                                                  arrow
                                                  placement="left"
                                                >
                                                  <span>
                                                    <IconButton
                                                      color="primary"
                                                      aria-label="Edit Virtual Card"
                                                      title={
                                                        "Edit Virtual Card"
                                                      }
                                                      component="span"
                                                      onClick={(event) =>
                                                        this.setState({
                                                          editVCADetails: true,
                                                          selectedBank: detail,
                                                        })
                                                      }
                                                      disabled={
                                                        isPayeeEditableDisabled
                                                      }
                                                    >
                                                      <EditIcon
                                                        style={{
                                                          width: "20px",
                                                          height: "24px",
                                                        }}
                                                        color={
                                                          isPayeeEditableDisabled
                                                            ? "disabled"
                                                            : "secondary"
                                                        }
                                                      />
                                                    </IconButton>
                                                  </span>
                                                </Tooltip>
                                              )}
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Box my={2}>
                                              {detail &&
                                                detail.commercialCardType && (
                                                  <Grid container>
                                                    <Grid item xs={6}>
                                                      <span
                                                        className={
                                                          classes.infoKey
                                                        }
                                                      >
                                                        {t(
                                                          "componentData.vendorInfo.CardType"
                                                        )}
                                                      </span>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                      <span
                                                        className={
                                                          classes.infoValue
                                                        }
                                                      >
                                                        {detail.commercialCardType &&
                                                          detail
                                                            .commercialCardType
                                                            .description}
                                                      </span>
                                                    </Grid>
                                                  </Grid>
                                                )}
                                            </Box>
                                            <Box my={2}>
                                              {detail && detail.contactEmail && (
                                                <Grid container>
                                                  <Grid item xs={6}>
                                                    <span
                                                      className={
                                                        classes.infoKey
                                                      }
                                                    >
                                                      {t(
                                                        "componentData.vendorInfo.VirtualEmailAddress"
                                                      )}
                                                    </span>
                                                  </Grid>
                                                  <Grid item xs={6}>
                                                    <Box
                                                      textOverflow="ellipsis"
                                                      overflow="hidden"
                                                      title={
                                                        detail[
                                                          "contactEmail"
                                                        ] || ""
                                                      }
                                                      className={
                                                        classes.infoValue
                                                      }
                                                      pr={1}
                                                      style={{
                                                        paddingTop: "4px",
                                                      }}
                                                    >
                                                      <Link
                                                        color="inherit"
                                                        href={`mailto:${detail["contactEmail"]}`}
                                                      >
                                                        {detail["contactEmail"]}
                                                      </Link>
                                                    </Box>
                                                  </Grid>
                                                </Grid>
                                              )}
                                            </Box>
                                            <Box my={2}>
                                              <Grid container>
                                                <Grid item xs={6}>
                                                  <span
                                                    className={classes.infoKey}
                                                  >
                                                    {t(
                                                      "componentData.vendorInfo.Location"
                                                    )}
                                                  </span>
                                                </Grid>
                                                <Grid item xs={6}>
                                                  <span
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    {(detail &&
                                                      detail["usedFor"]) ||
                                                      ""}
                                                  </span>
                                                </Grid>
                                              </Grid>
                                            </Box>
                                            <Box my={2}>
                                              <Grid container>
                                                <Grid item xs={6}>
                                                  <span
                                                    className={classes.infoKey}
                                                  >
                                                    {t(
                                                      "componentData.vendorInfo.SelectRemittoID"
                                                    )}
                                                  </span>
                                                </Grid>
                                                <Grid item xs={6}>
                                                  <Tooltip
                                                    placement="right"
                                                    arrow
                                                    title={
                                                      isDisabled &&
                                                      isMySupplierEditEnabled
                                                        ? t(
                                                            "componentData.vendorInfo.remitToIdsDisabledTooltip"
                                                          )
                                                        : ""
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        classes.infoValue
                                                      }
                                                    >
                                                      <CheckboxOutline
                                                        supplierIds={
                                                          supplierIds
                                                        }
                                                        selectedValues={
                                                          detail?.remitToIdDetail
                                                        }
                                                        disabled={isDisabled}
                                                        type={"vcaInfo"}
                                                        onChange={
                                                          this
                                                            .handleCheckBoxChange
                                                        }
                                                      />
                                                    </div>
                                                  </Tooltip>
                                                </Grid>
                                              </Grid>
                                            </Box>
                                            {vcaInfo["data"] &&
                                              vcaInfo["data"].length &&
                                              vcaInfo["data"].length > 0 &&
                                              detail.remittanceInfo &&
                                              detail.remittanceInfo
                                                .remittanceDeliveryAddress &&
                                              detail.remittanceInfo
                                                .remittanceDeliveryAddress
                                                .length !== 0 &&
                                              isRemNotRequired === 0 && (
                                                <Box my={2}>
                                                  <Grid container>
                                                    <Grid item xs={6}>
                                                      <span
                                                        className={
                                                          classes.infoKey
                                                        }
                                                      >
                                                        {t(
                                                          "componentData.vendorInfo.RemittanceEmailId"
                                                        )}
                                                      </span>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                      <Link
                                                        color="inherit"
                                                        href={`mailto:${detail.remittanceInfo.remittanceDeliveryAddress}`}
                                                      >
                                                        <span
                                                          title={
                                                            detail
                                                              .remittanceInfo
                                                              .remittanceDeliveryAddress ||
                                                            ""
                                                          }
                                                          className={
                                                            classes.infoValue
                                                          }
                                                        >
                                                          {detail.remittanceInfo
                                                            .remittanceDeliveryAddress ||
                                                            ""}
                                                        </span>
                                                      </Link>
                                                    </Grid>
                                                  </Grid>
                                                </Box>
                                              )}
                                          </Grid>
                                          <Grid item xs={6}>
                                            <Box my={2}>
                                              {detail && detail.countryIso && (
                                                <Grid container>
                                                  <Grid item xs={6}>
                                                    <span
                                                      className={
                                                        classes.infoKey
                                                      }
                                                    >
                                                      {t(
                                                        "componentData.vendorInfo.Country"
                                                      )}
                                                    </span>
                                                  </Grid>
                                                  <Grid item xs={6}>
                                                    <span
                                                      className={
                                                        classes.infoValue
                                                      }
                                                    >
                                                      {detail["countryIso"]}
                                                    </span>
                                                  </Grid>
                                                </Grid>
                                              )}
                                            </Box>
                                            <Box my={2}>
                                              {detail && detail.currencyCode && (
                                                <Grid container>
                                                  <Grid item xs={6}>
                                                    <span
                                                      className={
                                                        classes.infoKey
                                                      }
                                                    >
                                                      {t(
                                                        "componentData.vendorInfo.Currency"
                                                      )}
                                                    </span>
                                                  </Grid>
                                                  <Grid item xs={6}>
                                                    <span
                                                      className={
                                                        classes.infoValue
                                                      }
                                                    >
                                                      {detail["currencyCode"]}
                                                    </span>
                                                  </Grid>
                                                </Grid>
                                              )}
                                            </Box>

                                            {detail && detail.message && (
                                              <Box my={7}>
                                                <Box display="flex" width={1}>
                                                  <Box
                                                    display="flex"
                                                    width={"93%"}
                                                    style={{
                                                      wordBreak: "break-word",
                                                    }}
                                                  >
                                                    <InfoOutlinedIcon
                                                      style={{
                                                        color: "#E03617",
                                                      }}
                                                    />
                                                    <div
                                                      className={
                                                        classes.errorMsg
                                                      }
                                                      style={{
                                                        color: "#E03617",
                                                      }}
                                                    >
                                                      {detail.message}
                                                      {(detail.updatedByOtherClientUser ||
                                                        detail.updatedByOtherClientUser ===
                                                          undefined) &&
                                                        t(
                                                          "componentData.vendorInfo.approveChange"
                                                        )}
                                                      {(detail.updatedByOtherClientUser ||
                                                        detail.updatedByOtherClientUser ===
                                                          undefined) && (
                                                        <Link
                                                          style={{
                                                            color: "#4C4C4C",
                                                            cursor: "pointer",
                                                          }}
                                                          className={
                                                            classes.lnk
                                                          }
                                                          onClick={() => {
                                                            const selectedTab =
                                                              (detail.updatedByWho &&
                                                                detail.updatedByWho ===
                                                                  "CLIENT" &&
                                                                detail.updatedByOtherClientUser) ||
                                                              detail.inactiveDueToCompanyUpdatedByClient
                                                                ? 0
                                                                : 1;
                                                            this.props
                                                              .dispatch(
                                                                updateRPUSelectedTab(
                                                                  selectedTab
                                                                )
                                                              )
                                                              .then(() => {
                                                                this.props.history.push(
                                                                  `${config.baseName}/suppliers/supplierUpdates`
                                                                );
                                                              });
                                                          }}
                                                        >
                                                          {t(
                                                            "componentData.vendorInfo.PayeeUpdates"
                                                          )}
                                                        </Link>
                                                      )}{" "}
                                                      {(detail.updatedByOtherClientUser ||
                                                        detail.updatedByOtherClientUser ===
                                                          undefined) &&
                                                        t(
                                                          "componentData.vendorInfo.tocontinue"
                                                        )}
                                                    </div>
                                                  </Box>
                                                </Box>
                                              </Box>
                                            )}
                                          </Grid>
                                        </Grid>
                                      </>
                                    );
                                  })}
                              </Grid>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        )}
                      </Grid>
                    )}
                    {wire && wire["data"] && wire["data"].length > 0 && (
                      <Grid item xs={12} md={12}>
                        <ExpansionPanel className={classes.panel}>
                          <ExpansionPanelSummary
                            expandIcon={""}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Grid container>
                              <Grid item xs={12}>
                                <Typography
                                  variant="h2"
                                  className={classes.paymentTitle}
                                  style={{ float: "left" }}
                                >
                                  <img
                                    className={classes.payment_icon}
                                    src={require(`~/assets/icons/WIRE_main.svg`)}
                                    alt=""
                                  />{" "}
                                  {wire["name"]}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  className={classes.showText}
                                  style={{ float: "right" }}
                                >
                                  {wire["data"].length > 1
                                    ? `${t("componentData.vendorInfo.SHOW")} ${
                                        wire["data"].length
                                      } ${t(
                                        "componentData.vendorInfo.ACCOUNTS"
                                      )}`
                                    : t("componentData.vendorInfo.SHOWACCOUNT")}
                                </Typography>
                              </Grid>
                            </Grid>
                          </ExpansionPanelSummary>
                          <ExpansionPanelDetails>
                            <Grid container direction="row">
                              {wire["data"] &&
                                wire["data"].map((detail) => {
                                  const isDisabled =
                                    this.isRemitToIdDisabled(detail);
                                  return (
                                    <>
                                      <Grid
                                        container
                                        className={classes.expansionDetails}
                                      >
                                        <Grid item xs={6}>
                                          <Box my={2}>
                                            {detail && (
                                              <Box display="flex" width={1}>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={classes.infoKey}
                                                  >
                                                    {t(
                                                      "componentData.vendorInfo.swiftCode"
                                                    )}
                                                  </span>
                                                </Box>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    {detail["bicCode"] || ""}
                                                  </span>
                                                </Box>
                                              </Box>
                                            )}
                                          </Box>
                                          <Box my={2}>
                                            {detail && (
                                              <Box display="flex" width={1}>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={classes.infoKey}
                                                  >
                                                    {t(
                                                      "componentData.vendorInfo.bankCountry"
                                                    )}
                                                  </span>
                                                </Box>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    {detail["bankCountryIso"] ||
                                                      ""}
                                                  </span>
                                                </Box>
                                              </Box>
                                            )}
                                          </Box>
                                          <Box my={2}>
                                            {detail && (
                                              <Box display="flex" width={1}>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={classes.infoKey}
                                                  >
                                                    {t(
                                                      "componentData.vendorInfo.routingCode"
                                                    )}
                                                  </span>
                                                </Box>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    {detail["routingCode"] ||
                                                      ""}
                                                  </span>
                                                </Box>
                                              </Box>
                                            )}
                                          </Box>
                                          <Box my={2}>
                                            {detail["currencyCode"] && (
                                              <Box display="flex" width={1}>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={classes.infoKey}
                                                  >
                                                    {t(
                                                      "componentData.vendorInfo.Curr"
                                                    )}
                                                  </span>
                                                </Box>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    {detail &&
                                                      detail.currencyCode}
                                                  </span>
                                                </Box>
                                              </Box>
                                            )}
                                          </Box>
                                          {detail.payeeValidationStatus &&
                                            detail.payeeValidationStatus
                                              .length > 0 &&
                                            detail.payeeValidationStatus[0]
                                              .validationStatus ===
                                              "SUCCESS" && (
                                              <Box my={2}>
                                                <img
                                                  className={
                                                    classes.payment_icon
                                                  }
                                                  src={require(`~/assets/icons/checkbox_Blue.svg`)}
                                                  alt=""
                                                />
                                                <Typography
                                                  variant="span"
                                                  className={
                                                    classes.validationDone
                                                  }
                                                >
                                                  {t(
                                                    "componentData.vendorInfo.ValidationDone"
                                                  )}
                                                </Typography>
                                              </Box>
                                            )}
                                          {detail.payeeValidationStatus &&
                                            detail.payeeValidationStatus
                                              .length > 0 &&
                                            (detail.payeeValidationStatus[0]
                                              .validationStatus === "FAILED" ||
                                              detail.payeeValidationStatus[0]
                                                .validationStatus ===
                                                "PENDING") && (
                                              <Box my={2}>
                                                <img
                                                  className={
                                                    classes.payment_icon
                                                  }
                                                  src={require(`~/assets/icons/icon_pending.svg`)}
                                                  alt=""
                                                />
                                                <Typography
                                                  variant="span"
                                                  className={
                                                    classes.validationPending
                                                  }
                                                >
                                                  {detail
                                                    .payeeValidationStatus[0]
                                                    .validationStatus ===
                                                  "FAILED"
                                                    ? t(
                                                        "componentData.vendorInfo.ValidationFailed"
                                                      )
                                                    : t(
                                                        "componentData.vendorInfo.ValidationPending"
                                                      )}
                                                </Typography>
                                              </Box>
                                            )}
                                          <Box my={2}>
                                            <Grid container>
                                              <Grid item xs={6}>
                                                <span
                                                  className={classes.infoKey}
                                                >
                                                  {t(
                                                    "componentData.vendorInfo.SelectRemittoID"
                                                  )}
                                                </span>
                                              </Grid>
                                              <Grid item xs={6}>
                                                <Tooltip
                                                  placement="right"
                                                  arrow
                                                  title={
                                                    isDisabled &&
                                                    isMySupplierEditEnabled
                                                      ? t(
                                                          "componentData.vendorInfo.remitToIdsDisabledTooltip"
                                                        )
                                                      : ""
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    <CheckboxOutline
                                                      supplierIds={supplierIds}
                                                      selectedValues={
                                                        detail?.remitToIdDetail
                                                      }
                                                      type={"wire"}
                                                      disabled={isDisabled}
                                                      onChange={
                                                        this
                                                          .handleCheckBoxChange
                                                      }
                                                    />
                                                  </div>
                                                </Tooltip>
                                              </Grid>
                                            </Grid>
                                          </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                          <Box my={2}>
                                            {detail && (
                                              <Box display="flex" width={1}>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={classes.infoKey}
                                                  >
                                                    {t(
                                                      "componentData.vendorInfo.accountName"
                                                    )}
                                                  </span>
                                                </Box>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    {detail["accountName"] ||
                                                      ""}
                                                  </span>
                                                </Box>
                                              </Box>
                                            )}
                                          </Box>
                                          <Box my={2}>
                                            {detail["bankName"] && (
                                              <Box display="flex" width={1}>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={classes.infoKey}
                                                  >
                                                    {t(
                                                      "componentData.vendorInfo.BkName"
                                                    )}
                                                  </span>
                                                </Box>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    {detail &&
                                                      detail["bankName"]}
                                                  </span>
                                                </Box>
                                              </Box>
                                            )}
                                          </Box>
                                          <Box my={2}>
                                            {detail && detail.accountNumber && (
                                              <Box display="flex" width={1}>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={classes.infoKey}
                                                  >
                                                    {t(
                                                      "componentData.vendorInfo.AccNumber"
                                                    )}
                                                  </span>
                                                </Box>
                                                <Box
                                                  display="flex"
                                                  width={1 / 2}
                                                >
                                                  <span
                                                    className={
                                                      classes.infoValue
                                                    }
                                                  >
                                                    {detail[
                                                      "accountNumber"
                                                    ].replace(
                                                      /.(?=.{4})/g,
                                                      "*"
                                                    ) || ""}
                                                  </span>
                                                </Box>
                                              </Box>
                                            )}
                                          </Box>

                                          {detail && detail.message && (
                                            <Box my={7}>
                                              <Box display="flex" width={1}>
                                                <Box
                                                  display="flex"
                                                  width={"93%"}
                                                  style={{
                                                    wordBreak: "break-word",
                                                  }}
                                                >
                                                  <InfoOutlinedIcon
                                                    style={{ color: "#E03617" }}
                                                  />
                                                  <div
                                                    className={classes.errorMsg}
                                                    style={{ color: "#E03617" }}
                                                  >
                                                    {detail &&
                                                      detail.message +
                                                        t(
                                                          "componentData.vendorInfo.approveChange"
                                                        )}
                                                    <Link
                                                      style={{
                                                        color: "#4C4C4C",
                                                        cursor: "pointer",
                                                      }}
                                                      className={classes.lnk}
                                                      onClick={() => {
                                                        const selectedTab =
                                                          (detail.updatedByWho &&
                                                            detail.updatedByWho ===
                                                              "CLIENT" &&
                                                            detail.updatedByOtherClientUser) ||
                                                          detail.inactiveDueToCompanyUpdatedByClient
                                                            ? 0
                                                            : 1;
                                                        this.props.dispatch(
                                                          updateRPUSelectedTab(
                                                            selectedTab
                                                          )
                                                        );
                                                        this.props.history.push(
                                                          `${config.baseName}/suppliers/supplierUpdates`
                                                        );
                                                      }}
                                                    >
                                                      {t(
                                                        "componentData.vendorInfo.PayeeUpdates"
                                                      )}
                                                    </Link>{" "}
                                                    {t(
                                                      "componentData.vendorInfo.tocontinue"
                                                    )}
                                                  </div>
                                                </Box>
                                              </Box>
                                            </Box>
                                          )}
                                        </Grid>
                                      </Grid>
                                    </>
                                  );
                                })}
                            </Grid>
                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </Grid>
                    )}
                    {crossBorder &&
                      crossBorder["data"] &&
                      crossBorder["data"].length > 0 &&
                      this.renderACHInfo(crossBorder, "crossBorder")}
                    {showBulkRem && isRemNotRequired === 0 && (
                      <>
                        {(vendorDetail &&
                          vendorDetail.paymentMethod &&
                          vendorDetail.paymentMethod.length === 1 &&
                          (vendorDetail.paymentMethod.includes("WIRE") ||
                            vendorDetail.paymentMethod.includes(
                              "CROSS_BORDER"
                            ))) ||
                        (vendorDetail &&
                          vendorDetail.paymentMethod &&
                          vendorDetail.paymentMethod.length === 2 &&
                          vendorDetail.paymentMethod.includes("WIRE") &&
                          vendorDetail.paymentMethod.includes(
                            "CROSS_BORDER"
                          )) ? (
                          <></>
                        ) : (
                          <>
                            <Grid item xs={12}>
                              <Typography
                                variant="h2"
                                className={classes.paymentTitle}
                              >
                                {t("componentData.vendorInfo.BulkRemittance")}
                              </Typography>
                              <Box pl={2} pt={3}>
                                <RemittanceSelector
                                  options={frequency}
                                  title={t(
                                    "componentData.vendorInfo.Frequency"
                                  )}
                                  isBulkFrequency={true}
                                />
                              </Box>
                            </Grid>

                            {bulkRemInfo.bulkRemittanceEmail &&
                              bulkRemInfo.bulkRemittanceEmail.length !== 0 &&
                              bulkRemInfo.bulkRemittanceFrequency !== "N" && (
                                <Grid
                                  container
                                  xs={12}
                                  item
                                  justify="space-between"
                                >
                                  <Grid item xs={4}>
                                    <Typography
                                      variant="div"
                                      className={classes.remInfo}
                                    >
                                      {t(
                                        "componentData.vendorInfo.RemittanceEmail"
                                      )}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography
                                      variant="div"
                                      className={classes.remInfo}
                                    >
                                      <Link
                                        color="inherit"
                                        href={`mailto:${bulkRemInfo.bulkRemittanceEmail}`}
                                      >
                                        {bulkRemInfo.bulkRemittanceEmail}
                                      </Link>
                                    </Typography>
                                  </Grid>
                                </Grid>
                              )}
                          </>
                        )}
                      </>
                    )}
                    {noteMessage && noteMessage.length > 0 && (
                      <Grid item xs={12}>
                        <Box p={1} flexGrow={1} style={{ textAlign: "left" }}>
                          <Typography variant="subtitle1" color="error">
                            {noteMessage}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <Box p={1} flexGrow={1} style={{ textAlign: "center" }}>
                        <Typography variant="subtitle1" color="error">
                          {approveValidation}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box p={1} flexGrow={1} style={{ textAlign: "center" }}>
                        {isMySupplierEditEnabled &&
                        vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Approved" ? (
                          <Button
                            type="submit"
                            fullWidth={false}
                            variant="contained"
                            color="primary"
                            /*className={
                              approveValidBtn
                                ? classes.btnSave
                                : classes.btnDisabled
                            }
                            onClick={
                              approveValidBtn
                                ? () => {
                                  this.handleApproveDetails(false);
                                }
                                : ""
                            }*/
                            className={classes.btnSave}
                            onClick={() => {
                              this.handleApproveDetails(false);
                            }}
                          >
                            <Typography variant="h4">
                              {t("componentData.vendorInfo.SAVE")}
                            </Typography>
                          </Button>
                        ) : (
                          ""
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </TabPanel>
                {vendorDetail.profileStatus &&
                  vendorDetail.profileStatus.actualDescription ===
                    "Pending Validation" && (
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignContent="center"
                    >
                      <Grid item xs={10}>
                        {t("componentData.vendorInfo.msgTxt")}
                      </Grid>
                    </Grid>
                  )}
                <Grid item xs={12}>
                  <Box p={1} flexGrow={1} style={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" color="error">
                      {approveValidationMessage}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box my={4} className={`button-container`}>
                    {((vendorDetail.profileStatus &&
                      vendorDetail.profileStatus.actualDescription ===
                        "Pending Validation") ||
                      (vendorDetail.profileStatus &&
                        vendorDetail.profileStatus.actualDescription ===
                          "Pending Approval")) && (
                      <Box mx={2}>
                        {isMySupplierRejectEnabled && (
                          <Button
                            type="submit"
                            fullWidth={false}
                            variant="outlined"
                            color="primary"
                            className={classes.btnSave}
                            onClick={() => {
                              this.setState({
                                openDisapproveDialog: true,
                              });
                            }}
                          >
                            <Typography variant="h4">
                              {" "}
                              {t("componentData.vendorInfo.DISAPPROVE")}
                            </Typography>
                          </Button>
                        )}
                      </Box>
                    )}
                    <Box mx={2}>
                      {isMySupplierApproveEnabled &&
                      vendorDetail.payeeId !== null &&
                      vendorDetail.profileStatus &&
                      vendorDetail.profileStatus.actualDescription ===
                        "Pending Approval" &&
                      vendorDetail.profileStatus &&
                      vendorDetail.profileStatus.actualDescription !==
                        "Approved" ? (
                        <Button
                          type="submit"
                          fullWidth={false}
                          variant="contained"
                          color="primary"
                          className={
                            approveValidBtn
                              ? classes.btnSave
                              : classes.btnDisabled
                          }
                          onClick={
                            approveValidBtn
                              ? () => {
                                  this.setState({
                                    openDisclaimer: true,
                                  });
                                }
                              : ""
                          }
                        >
                          <Tooltip
                            title={
                              <React.Fragment>
                                <Typography variant="h4">
                                  {t("componentData.vendorInfo.msgTxt2")}
                                </Typography>
                              </React.Fragment>
                            }
                            classes={{ tooltip: classes.toolTipClass }}
                            placement="top"
                          >
                            <span
                              style={{
                                height: approveValidBtn ? "15px" : "inherit",
                              }}
                            >
                              {approveValidBtn ? (
                                <span className={classes.checkIconClass}>
                                  <CheckCircleIcon />
                                </span>
                              ) : (
                                <img
                                  className={classes.icon_btn}
                                  src={
                                    approveValidBtn
                                      ? require(`~/assets/icons/check_circle.svg`)
                                      : require(`~/assets/icons/question.svg`)
                                  }
                                  alt=""
                                />
                              )}
                            </span>
                          </Tooltip>{" "}
                          <Typography variant="h4">
                            {t("componentData.vendorInfo.APPROVE")}
                          </Typography>
                        </Button>
                      ) : (
                        ""
                      )}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
        {showConfirmDialog &&
          this.renderPayeeDialog("", showConfirmDialogMessage)}
      </Box>
    );
  }

  renderPayeeDialog = (title, message) => {
    return (
      <PayeeConfirmDialog
        icon={<InfoOutlinedIcon style={{ color: "#E03617" }} />}
        title={title}
        message={message}
        onCancel={() => this.onCancel()}
        onConfirm={() => this.onConfirm()}
      />
    );
  };
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.role,
    ...state.permissions,
    ...state.clientConfig,
    ...state.payment,
    ...state.suppliers,
  }))(withStyles(styles)(VendorInformation))
);
