import React, { Component } from "react";

import { Button } from "~/components/Forms";

import IncomingPaymentFileTypeSelector from "~/modules/IncomingPaymentFileTypeSelector";
import ImportParentPaymentFileDetails from "~/modules/ImportParentPaymentFileDetails";
import IncomingFileSettings from "~/modules/IncomingFileSettings";
import ResponseFileSettings from "~/modules/ResponseFileSettings";
import ImportOnboardingDailogue from "~/modules/ImportOnboardingDailogue";
import { Box, CircularProgress, Paper, Link, Grid, Typography } from "@material-ui/core";
import Notification from "~/components/Notification";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {
  fetchFileType,
  fetchSelectedFileType,
  fetchNamingConvention,
  fetchIncomingFileSettings,
  fetchResponseFileSettings,
  updateIncomingFileSettings,
  updateResponseFileSettings,
  updatePaymentFileTypes,
  updatePostResponseFileSettings,
  updatePostIncomingFileSettings,
} from "~/redux/helpers/filesettings";
import {
  getPaymentAttributeList, savePaymentAttributes, getDataType, updateFileTypePaymentDefaultSelection,
  updatePaymentDefaultUser
} from "~/redux/actions/paymentAttribute";
import {
  getPayeeAttributeList, savePayeeAttributes, updateFileTypePayeeDefaultSelection, updatePayeeDefaultUser
} from "~/redux/actions/payeeAttribute";

import { logout } from "~/redux/actions/user";

import config from "~/config";
import { fetchClientData } from "~/redux/actions/client";
import { accessRights } from "~/config/accessRights";
import { csvFileFormat, includeFileHeader, statusCode } from '~/config/entityTypes';
import { downloadPaymentFileFormat, downloadPayeeFileFormat } from "~/redux/helpers/payments";
import * as FileSaver from "file-saver";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

class FileSettings extends Component {
  state = {
    isLoading: true,
    isHIPAA: 0,
    clientId: 2,
    parentId: null,
    processing: false,
    error: false,
    paymentFileTypes: [],
    openDialogue: false,
    isEDIselected: false,
    ediFileTypeId: null,
    isISOselected: false,
    isCSVselected: false,
    isXMLMSCSelected: false,
    isISOXMLMSCSelected: false,
    isCSVMSCSelected: false,
    showResponseFile: 0,
    showXMLMSCResponse: 1,
    showISOXMLMSCResponse: 1,
    showCSVMSCResponse: 1,
    showBanner: false,
    delimiters: [
      { label: "~", value: "~" },
      { label: ",", value: "," },
      { label: "*", value: "*" },
      { label: ":", value: ":" },
    ],
    subElementDelimiters: [
      { label: "~", value: "~" },
      { label: ",", value: "," },
      { label: "*", value: "*" },
      { label: ":", value: ":" },
      { label: "\\", value: "\\" },
      { label: ">", value: ">" },
    ],
    segmentDelimiters: [
      { label: "~", value: "~" },
      { label: ",", value: "," },
      { label: "*", value: "*" },
      { label: ":", value: ":" },
      { label: "\\", value: "\\" },
      { label: "Space", value: " " },
    ],
    validation: {},
    responseValidation: {},
    ediResponsePaymentFile: {},
    namingConvention: {},
    returnFileSettings: {},
    incomingDelimeterSetting: {},
    returnEDI: {
      intSenderId: { label: "ISA06", value: "", length: 15 },
      intRecvrId: { label: "ISA08", value: "", length: 15 },
      authInfoQualifier: { label: "ISA01", value: "", length: 2 },
      secInfoQualifier: { label: "ISA03", value: "", length: 2 },
      intSenderIDQualifier: { label: "ISA05", value: "", length: 2 },
      intRecvrIDQualifier: { label: "ISA07", value: "", length: 2 },
      interchangeControlVersionNumber: { label: "ISA12", value: "", length: 5 },
      subElementDelimiter: { label: "ISA16", value: "", length: 1 },
      contactName: { label: "PER02", value: "", length: 80 },
      contactNumber: { label: "PER04", value: "", length: 60 },
      isPaymentMethodEnabled: { label: "BGN07", value: "1" },
    },
    scheduleSetting: [],
    ackSetting: [], // for master card 2.0
    variant: "error",
    clearChangeLoader: false
  };

  componentDidMount() {
    const { t } = this.props;
    if (this.props.isOnboarding) {
      this.props.changeActiveStep(2);
    }
    if (this.props.client.clientInfo.length > 0) {
      this.setState({
        parentId: this.props.client.clientInfo.rows[0].parentId,
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
            .dispatch(fetchClientData(this.state.clientId))
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
    if (config.showFMT) {
      this.fetchPaymentAttributeList();
      this.fetchPayeeAttributeList();
    }
  }

  fetchPaymentAttributeList = (id = null) => {
    const { dispatch, paymentAttribute } = this.props;

    this.setState({ clearChangeLoader: true });
    dispatch(getPaymentAttributeList(id)).then((response) => {
      if (!response) {
        this.setState({
          error: paymentAttribute.error,
          variant: "error",
          clearChangeLoader: false
        });
        return false;
      } else {
        dispatch(getDataType())
      }
      this.setState({ clearChangeLoader: false });
    })
  };

  fetchPayeeAttributeList = (id = null) => {
    const { dispatch, payeeAttribute } = this.props;
    this.setState({ clearChangeLoader: true });
    dispatch(getPayeeAttributeList(id)).then((response) => {
      if (!response) {
        this.setState({
          error: payeeAttribute.error,
          variant: "error",
          clearChangeLoader: false
        });
        return false;
      }
      this.setState({ clearChangeLoader: false });
    });
  }

  importParentsData = () => {
    const { parentId } = this.state;
    this.setState({ showBanner: false });
    this.loadData(parentId, true);
  };
  loadData = async (id, flag) => {
    const { isHIPAA } = this.state;
    const { t } = this.props;
    Promise.all([
      fetchFileType(isHIPAA),
      fetchSelectedFileType(id, flag),
      fetchNamingConvention(id, flag),
      fetchIncomingFileSettings(id, flag),
      fetchResponseFileSettings(id, flag),
    ])
      .then(
        ([
          fileTypes,
          selectedFileTypes,
          namingConvention,
          incomingFileSettings,
          responseFileSettings,
        ]) => {
          if (fileTypes.error) {
            throw fileTypes;
          } else if (selectedFileTypes.error) {
            throw selectedFileTypes;
          } else if (namingConvention.error) {
            throw namingConvention;
          } else if (incomingFileSettings.error) {
            throw incomingFileSettings;
          } else if (responseFileSettings.error) {
            throw responseFileSettings;
          }

          for (const [key, value] of Object.entries(
            fileTypes.data.ediPaymentFile
          )) {
            if (
              selectedFileTypes.data.includes(value.id) &&
              (value.fileName === "EDI835" || value.fileName === "EDI820")
            ) {
              this.setState({
                isEDIselected: true,
                ediFileTypeId: value.id,
              });
            } else if (
              selectedFileTypes.data.includes(value.id) &&
              value.fileName === "ISO XML"
            ) {
              this.setState({
                isISOselected: true,
              });
            }
            else if (
              selectedFileTypes.data.includes(value.id) &&
              value.fileName === "CSV"
            ) {
              this.setState({
                isCSVselected: true
              });
            }
            else if (selectedFileTypes.data.includes(value.id) && value.fileName === "MC XML") {
              this.setState({
                isXMLMSCSelected: true
              });
              if (responseFileSettings.data.ackSetting && responseFileSettings.data.ackSetting.length) {
                const exist = responseFileSettings.data.ackSetting.find(x => x.fileTypeId == value.id);
                if (exist) {
                  this.setState({ showXMLMSCResponse: exist.isAckRequired });
                }
              }
            }
            else if (selectedFileTypes.data.includes(value.id) && value.fileName === "Card ISO XML") {
              this.setState({
                isISOXMLMSCSelected: true
              });
              if (responseFileSettings.data.ackSetting && responseFileSettings.data.ackSetting.length) {
                const exist = responseFileSettings.data.ackSetting.find(x => x.fileTypeId == value.id);
                if (exist) {
                  this.setState({ showISOXMLMSCResponse: exist.isAckRequired });
                }
              }
            }
            else if (selectedFileTypes.data.includes(value.id) && value.fileName === "MC CSV") {
              this.setState({
                isCSVMSCSelected: true
              });
              if (responseFileSettings.data.ackSetting && responseFileSettings.data.ackSetting.length) {
                const exist = responseFileSettings.data.ackSetting.find(x => x.fileTypeId == value.id);
                if (exist) {
                  this.setState({ showCSVMSCResponse: exist.isAckRequired });
                }
              }
            }
          }
          const obj = {};
          fileTypes.data.ediResponsePaymentFile.map(function (val, index) {
            obj[val.description] = val.id;
          });
          const obj1 =
            responseFileSettings.data.ediFileSetting &&
              responseFileSettings.data.ediFileSetting.hasOwnProperty(
                "isPaymentMethodEnabled"
              )
              ? responseFileSettings.data.ediFileSetting
              : {
                ...responseFileSettings.data.ediFileSetting,
                isPaymentMethodEnabled: "1",
              };

          this.setState({
            paymentFileTypes: fileTypes.data.ediPaymentFile.map((item) =>
              selectedFileTypes.data.includes(item.id)
                ? { ...item, selected: true, label: item.fileName }
                : { ...item, selected: false, label: item.fileName }
            ),
            ediResponsePaymentFile: obj,
            namingConvention:
              namingConvention.data !== null ? namingConvention.data : {},
            incomingDelimeterSetting: incomingFileSettings.data
              ? incomingFileSettings.data
              : {},
            returnFileSettings: responseFileSettings.data.ediFileSetting
              ? obj1
              : { isPaymentMethodEnabled: "1" },
            scheduleSetting: responseFileSettings.data.scheduleSetting
              ? responseFileSettings.data.scheduleSetting
              : [],
            ackSetting: responseFileSettings.data.ackSetting
              ? responseFileSettings.data.ackSetting
              : [],
            isLoading: false,
            showResponseFile: responseFileSettings.data.isResponseActive
              ? responseFileSettings.data.isResponseActive
              : 0,
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
    const { paymentFileTypes } = this.state;
    const obj = paymentFileTypes.find((paymentFileType, i) => index === i);
    if (typeof obj !== "undefined" && obj.fileName === "ISO XML") {
      this.setState({
        isISOselected: isChecked,
      });
    } else if (
      (typeof obj !== "undefined" && obj.fileName === "EDI820") ||
      (typeof obj !== "undefined" && obj.fileName === "EDI835")
    ) {
      this.setState({
        isEDIselected: isChecked,
        ediFileTypeId: obj.id,
      });
    }
    else if (typeof obj !== "undefined" && obj.fileName === "CSV") {
      this.setState({ isCSVselected: isChecked });
    }
    else if (typeof obj !== "undefined" && obj.fileName === "MC XML") {
      this.setState({ isXMLMSCSelected: isChecked });
    }
    else if (typeof obj !== "undefined" && obj.fileName === "Card ISO XML") {
      this.setState({ isISOXMLMSCSelected: isChecked });
    }
    else if (typeof obj !== "undefined" && obj.fileName === "MC CSV") {
      this.setState({ isCSVMSCSelected: isChecked });
    }
    this.setState({
      paymentFileTypes: paymentFileTypes.map((paymentFileType, i) =>
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
      isEDIselected,
      isISOselected,
      returnEDI,
      showResponseFile,
      returnFileSettings,
      incomingDelimeterSetting,
      ediResponsePaymentFile,
    } = this.state;

    const { t } = this.props;

    let valid = true;
    const validation = {},
      responseValidation = {};
    const convention = {
      clientUid: "",
      outBesId: "",
      fpid: "",
    };
    for (const [key, value] of Object.entries(convention)) {
      const obj = Object.keys(namingConvention).find((item) => item === key);
      if (
        typeof obj === "undefined" ||
        namingConvention[obj] === null ||
        namingConvention[obj].toString().trim().length == 0
      ) {
        valid = false;
        validation[key] = true;
        this.setState({ validation: { ...validation } });
      } else if (
        namingConvention[obj].toString().replace(/^0+/, "").length === 0
      ) {
        valid = false;
        validation[key] = true;
        this.setState({ validation: { ...validation } });
      }
    }
    if (isEDIselected && showResponseFile === 1) {
      for (const [key] of Object.entries(returnEDI)) {
        const obj = Object.keys(returnFileSettings).find((item) => item === key);
        if (
          returnEDI[key].label === "ISA01" ||
          returnEDI[key].label === "ISA03" ||
          returnEDI[key].label === "ISA05" ||
          returnEDI[key].label === "ISA06" ||
          returnEDI[key].label === "ISA07" ||
          returnEDI[key].label === "ISA08"
        ) {
          if (
            typeof obj === "undefined" ||
            returnFileSettings[obj] === null ||
            returnFileSettings[obj].toString().trim().length < 2
          ) {
            valid = false;
            responseValidation[key] = t("componentData.fileSettings.minLen2");
            this.setState({ responseValidation: { ...responseValidation } });
          }
        }
        if (returnEDI[key].label === "ISA12") {
          if (
            typeof obj === "undefined" ||
            returnFileSettings[obj] === null ||
            returnFileSettings[obj].toString().trim().length < 5
          ) {
            valid = false;
            responseValidation[key] = t("componentData.fileSettings.minLen5");
            this.setState({ responseValidation: { ...responseValidation } });
          }
        }
        if (
          returnEDI[key].label === "PER02" ||
          returnEDI[key].label === "PER04" ||
          returnEDI[key].label === "ISA16"
        ) {
          if (
            typeof obj === "undefined" ||
            returnFileSettings[obj] === null ||
            returnFileSettings[obj].toString().trim().length < 1
          ) {
            valid = false;
            responseValidation[key] = t("componentData.fileSettings.minLen1");
            this.setState({ responseValidation: { ...responseValidation } });
          }
        }
        if (returnEDI[key].label === "BGN07") {
          if (
            typeof obj === "undefined" ||
            returnFileSettings[obj] === null ||
            returnFileSettings[obj].toString().trim().length == 0
          ) {
            valid = false;
            responseValidation[key] = t(
              "componentData.fileSettings.mandatoryField"
            );
            this.setState({ responseValidation: { ...responseValidation } });
          }
        }
      }

      if (
        typeof returnFileSettings["segmentDelimiter"] === "undefined" ||
        returnFileSettings["segmentDelimiter"] === null ||
        returnFileSettings["segmentDelimiter"].toString().length == 0
      ) {
        valid = false;
        responseValidation["segmentDelimiter"] = true;
        this.setState({ responseValidation: { ...responseValidation } });
      }
      if (
        typeof returnFileSettings["elementDelimiter"] === "undefined" ||
        returnFileSettings["elementDelimiter"] === null ||
        returnFileSettings["elementDelimiter"].toString().trim().length == 0
      ) {
        valid = false;
        responseValidation["elementDelimiter"] = true;
        this.setState({ responseValidation: { ...responseValidation } });
      }
      if (
        typeof this.getScheduledTime("824/997 File") === "undefined" ||
        this.getScheduledTime("824/997 File") === null ||
        this.getScheduledTime("824/997 File").toString().trim().length == 0 ||
        this.getScheduledTime("824/997 File")
          .toString()
          .trim()
          .match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null
      ) {
        valid = false;
        responseValidation[
          `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
        ] = t("componentData.fileSettings.timeFormt");
        this.setState({ responseValidation: { ...responseValidation } });
      }
      if (
        typeof this.getScheduledTime("DeltaFile") === "undefined" ||
        this.getScheduledTime("DeltaFile") === null ||
        this.getScheduledTime("DeltaFile").toString().trim().length == 0 ||
        this.getScheduledTime("DeltaFile")
          .toString()
          .trim()
          .match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null
      ) {
        valid = false;
        responseValidation[
          `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
        ] = t("componentData.fileSettings.timeFormt");
        this.setState({ responseValidation: { ...responseValidation } });
      }
    }
    if (isEDIselected) {
      if (
        typeof incomingDelimeterSetting["elementDelimiter"] === "undefined" ||
        incomingDelimeterSetting["elementDelimiter"] === null ||
        incomingDelimeterSetting["elementDelimiter"].toString().trim().length ==
        0
      ) {
        valid = false;
        validation["elementDelimiter"] = true;
        this.setState({ validation: { ...validation } });
      }
      if (
        typeof incomingDelimeterSetting["segmentDelimiter"] === "undefined" ||
        incomingDelimeterSetting["segmentDelimiter"] === null ||
        incomingDelimeterSetting["segmentDelimiter"].toString().length == 0
      ) {
        valid = false;
        validation["segmentDelimiter"] = true;
        this.setState({ validation: { ...validation } });
      }
      if (
        typeof incomingDelimeterSetting["subElementDelimiter"] ===
        "undefined" ||
        incomingDelimeterSetting["subElementDelimiter"] === null ||
        incomingDelimeterSetting["subElementDelimiter"].toString().trim()
          .length == 0
      ) {
        valid = false;
        validation["subElementDelimiter"] = true;
        this.setState({ validation: { ...validation } });
      }
    }
    if (isISOselected) {
      if (
        typeof this.getScheduledTime("ISOTransactional XML") === "undefined" ||
        this.getScheduledTime("ISOTransactional XML") === null ||
        this.getScheduledTime("ISOTransactional XML").toString().trim()
          .length == 0 ||
        this.getScheduledTime("ISOTransactional XML")
          .toString()
          .trim()
          .match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null
      ) {
        valid = false;
        responseValidation[
          `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
        ] = t("componentData.fileSettings.timeFormt");
        this.setState({ responseValidation: { ...responseValidation } });
      }
    }

    ////console.log("validation", validation);
    return valid;
  };
  handleSubmit = (event, isCSVDownload = false) => {
    event.preventDefault();
    const {
      showResponseFile,
      validation,
      responseValidation,
      paymentFileTypes,
      namingConvention,
    } = this.state;
    const { t } = this.props;
    let selectedMethods = [];

    if(responseValidation && Object.entries(responseValidation).length > 0){
      return false;
    }

    paymentFileTypes &&
      paymentFileTypes.filter((s) => {
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
        this.handlePaymentFileDetails(isCSVDownload);
      } else {
        this.setState({
          processingUpdate: false,
          error: null,
          variant: null,
        });
      }
    }
  };

  handleSaveCSVFields = (isCSVDownload) => {
    const { paymentAttribute, payeeAttribute, dispatch, user, t } = this.props;
    const paymentAttributeList = [], payeeAttributeList = [];
    let paymentFileSelectionType = {}, payeeFileSelectionType = {};

    const fileSelectionType = paymentAttribute.fileSelectionType && paymentAttribute.fileSelectionType?.fileTypeId ?
      paymentAttribute.fileSelectionType : payeeAttribute.fileSelectionType;

    if (fileSelectionType?.fileTypeId == csvFileFormat.PAYMENT ||
      fileSelectionType?.fileTypeId == csvFileFormat.BOTHPAYEEPAYMENT && paymentAttribute.tabValue == 1) {
      paymentFileSelectionType = {
        "fileTypeId": fileSelectionType?.fileTypeId || csvFileFormat.DEFAULT,
        "paymentHeader": fileSelectionType?.paymentHeader || includeFileHeader.NO,
        "fmtId": paymentAttribute?.fileSelectionType?.fmtId || null,
        "defaultSchema": paymentAttribute?.fileSelectionType?.defaultSchema || 0,
        "includeHeader": 0
      };

      paymentAttribute.attributeList.length && paymentAttribute.attributeList.forEach(item => {
        item.childRecord.length && item.childRecord.forEach(childItem => {
          paymentAttributeList.push({
            "attributeId": childItem.attributeId || null,
            "clientAttributeId": childItem.clientAttributeId,
            "dataTypeId": childItem.dataTypeId,
            "attributeType": childItem.attributeType,
            "index": childItem.index,
            "isMandatory": childItem.isMandatory,
            "fieldName": childItem.fieldName,
            "minLength": childItem.minLength,
            "maxLength": childItem.maxLength,
            "isChecked": childItem.isChecked,
            "isDeleted": childItem.isDeleted ? childItem.isDeleted : 0,
            "sampleValue": childItem.sampleValue,
            "control_group": childItem.control_group
          })
        })
      })

      dispatch(savePaymentAttributes({
        clientId: user.userData.portalProfileId,
        items: fileSelectionType?.fileTypeId == csvFileFormat.PAYMENT ||
          fileSelectionType?.fileTypeId == csvFileFormat.BOTHPAYEEPAYMENT ? paymentAttributeList : [],
        fileSelectionType: paymentFileSelectionType
      })).then(response => {
        if (!response) {
          this.setState({
            error: paymentAttribute.error,
            variant: "error"
          });
          return false;
        }
        dispatch(updateFileTypePaymentDefaultSelection(0));
        if (isCSVDownload) {
          downloadPaymentFileFormat(false).then(response => {
            if (response && response.status !== statusCode.UNAUTHORIZED) {
              if (response && response.data && response.data.error || response.status === statusCode.INTERNAL_SERVER_ERROR || response.status === statusCode.NOT_FOUND) {
                this.setState({
                  error: response.status === statusCode.NOT_FOUND ? t('componentData.FileMappingTool.downloadDataNotAvailable') : t('componentData.bankFileDetail.FileNotExists'),
                  variant: "error"
                });
                return false;
              }
              const fileName = `${response.headers["x-file-name"]}`;
              const type = response.headers["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8"
              });
              FileSaver.saveAs(data, fileName);
            } else {
              this.setState({
                error: t('componentData.bankFileDetail.FileNotExists'),
                variant: "error"
              });
            }
          }).catch(error => {
            this.setState({
              error: t('componentData.bankFileDetail.FileNotExists'),
              variant: "error"
            });
          })
        }
        if (paymentAttribute?.fileSelectionType?.isDefaultUser) {
          dispatch(updatePaymentDefaultUser(false));
        }
        this.fetchPaymentAttributeList();
      });
    }

    if (fileSelectionType?.fileTypeId == csvFileFormat.PAYEE ||
      fileSelectionType?.fileTypeId == csvFileFormat.BOTHPAYEEPAYMENT && paymentAttribute.tabValue == 0) {
      payeeFileSelectionType = {
        "fileTypeId": fileSelectionType?.fileTypeId || csvFileFormat.DEFAULT,
        "payeeHeader": fileSelectionType?.payeeHeader || includeFileHeader.NO,
        "fmtId": payeeAttribute?.fileSelectionType?.fmtId || null,
        "defaultSchema": payeeAttribute?.fileSelectionType?.defaultSchema || 0,
        "includeHeader": 0
      };

      payeeAttribute.attributeList.length && payeeAttribute.attributeList.forEach(item => {
        item.childRecord.length && item.childRecord.forEach(childItem => {
          payeeAttributeList.push({
            "attributeId": childItem.attributeId || null,
            "clientAttributeId": childItem.clientAttributeId || null,
            "dataTypeId": childItem.dataTypeId,
            "attributeType": childItem.attributeType,
            "index": childItem.index,
            "isMandatory": childItem.isMandatory,
            "fieldName": childItem.fieldName,
            "minLength": childItem.minLength,
            "maxLength": childItem.maxLength,
            "isChecked": childItem.isChecked,
            "isDeleted": childItem.isDeleted ? childItem.isDeleted : 0,
            "sampleValue": childItem.sampleValue,
            "control_group": childItem.control_group
          })
        })
      });

      dispatch(savePayeeAttributes({
        clientId: user.userData.portalProfileId,
        items: fileSelectionType?.fileTypeId == csvFileFormat.PAYEE ||
          fileSelectionType?.fileTypeId == csvFileFormat.BOTHPAYEEPAYMENT ? payeeAttributeList : [],
        fileSelectionType: payeeFileSelectionType
      })).then(response => {
        if (!response) {
          this.setState({
            error: payeeAttribute.error,
            variant: "error"
          });
          return false;
        }
        dispatch(updateFileTypePayeeDefaultSelection(0));
        if (isCSVDownload) {
          downloadPayeeFileFormat(false).then(response => {
            if (response && response.status !== statusCode.UNAUTHORIZED) {
              if (response && response.data && response.data.error || response.status === statusCode.INTERNAL_SERVER_ERROR || response.status === statusCode.NOT_FOUND) {
                this.setState({
                  error: response.status === statusCode.NOT_FOUND ? t('componentData.FileMappingTool.downloadDataNotAvailable') : t('componentData.bankFileDetail.FileNotExists'),
                  variant: "error"
                });
                return false;
              }
              const fileName = `${response.headers["x-file-name"]}`;
              const type = response.headers["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8"
              });
              FileSaver.saveAs(data, fileName);
            } else {
              this.setState({
                error: t('componentData.bankFileDetail.FileNotExists'),
                variant: "error"
              });
            }
          }).catch(error => {
            this.setState({
              error: t('componentData.bankFileDetail.FileNotExists'),
              variant: "error"
            });
          })
        }
        if (payeeAttribute?.fileSelectionType?.isDefaultUser) {
          dispatch(updatePayeeDefaultUser(false));
        }
        this.fetchPayeeAttributeList();
      });
    }

    if (paymentAttribute?.fileSelectionType?.fileTypeId == csvFileFormat.DEFAULT) {
      paymentFileSelectionType = {
        "fileTypeId": paymentAttribute?.fileSelectionType?.fileTypeId || csvFileFormat.DEFAULT,
        "includeHeader": paymentAttribute?.fileSelectionType?.includeHeader || includeFileHeader.NO,
        "fmtId": paymentAttribute?.fileSelectionType?.fmtId || null
      };

      dispatch(savePaymentAttributes({
        clientId: user.userData.portalProfileId,
        items: [],
        fileSelectionType: paymentFileSelectionType
      })).then(response => {
        if (!response) {
          this.setState({
            error: paymentAttribute.error,
            variant: "error"
          });
          return false;
        }
      });
    }
  }

  validateNamingConvention = () => {
    const { namingConvention } = this.state;

    const { t } = this.props;

    let valid = true;
    const validation = {};
    const convention = {
      clientUid: "",
      fpid: "",
    };
    for (const [key] of Object.entries(convention)) {
      const obj = Object.keys(namingConvention).find((item) => item === key);
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

  handlePaymentFileDetails = (isCSVDownload) => {
    this.setState(
      {
        processing: true,
      },
      () => {
        const {
          paymentFileTypes,
          incomingDelimeterSetting,
          returnFileSettings,
          namingConvention,
          scheduleSetting,
          ackSetting,
          ediResponsePaymentFile,
          isEDIselected,
          ediFileTypeId,
          isISOselected,
          showResponseFile,
          clientId,
          isCSVselected
        } = this.state;
        const { t } = this.props;
        const selectedMethods = [];
        paymentFileTypes.filter((s) => {
          if (s.selected === true) {
            selectedMethods.push(s.id);
          }
        });
        let restObj = [],
          incomingSettings = {};
        if (isEDIselected && !isISOselected) {
          if (showResponseFile === 1) {
            restObj = scheduleSetting.filter(
              (item) =>
                item.fileTypeId !==
                ediResponsePaymentFile["ISOTransactional XML"]
            );
          }
        } else if (!isEDIselected && isISOselected) {
          restObj = scheduleSetting.filter(
            (item) =>
              item.fileTypeId === ediResponsePaymentFile["ISOTransactional XML"]
          );
        } else {
          showResponseFile === 1
            ? (restObj = scheduleSetting)
            : (restObj = scheduleSetting.filter(
              (item) =>
                item.fileTypeId ===
                ediResponsePaymentFile["ISOTransactional XML"]
            ));
        }

        incomingSettings = {
          ...incomingDelimeterSetting,
          fileTypeId: ediFileTypeId,
        };
        let data = {
          scheduleSetting: restObj,
          namingConvention: namingConvention,
          ediFileSetting: null,
          isResponseActive: showResponseFile,
          ackSetting: ackSetting
        };
        data =
          isEDIselected && showResponseFile === 1
            ? { ...data, ediFileSetting: returnFileSettings }
            : data;
        updatePaymentFileTypes(clientId, {
          fileTypeIds: selectedMethods,
        }).then((response) => {
          if (!response) {
            this.setState({
              processing: false,
              error:
                typeof response.error.message === "string"
                  ? response.error.message
                  : t("componentData.fileSettings.unknownErr"),
              variant: "error",
            });
            return false;
          }
          const promiseArray = this.props.isOnboarding
            ? isEDIselected
              ? [
                updateResponseFileSettings(clientId, data),
                updateIncomingFileSettings(clientId, incomingSettings),
              ]
              : [updateResponseFileSettings(clientId, data)]
            : isEDIselected
              ? [
                updatePostResponseFileSettings(clientId, data),

                updatePostIncomingFileSettings(clientId, incomingSettings),
              ]
              : [updatePostResponseFileSettings(clientId, data)];

          if (isCSVselected && config.showFMT) {
            this.handleSaveCSVFields(isCSVDownload);
          }
          Promise.all(promiseArray)
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
                // }
              } else {
                this.setState({
                  error: t("componentData.fileSettings.successFileMsg"),
                  variant: "success",
                });
                this.loadData(clientId, false);
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
        });
      }
    );
  };

  moveToDashboard = () => {
    this.setState({
      openDialogue: false,
    });
    this.props.dispatch(logout());
    this.props.history.push(`${config.baseName}/`);
  };
  handleNamingChange = (e) => {
    const { namingConvention } = this.state;
    this.setState({
      namingConvention: {
        ...namingConvention,
        [e.target.name]:
          e.target.value === "" ? null : e.target.value.replace(/[^0-9A-Za-z_#-]/g, ""), // new regex added for (12697)
      },
    });
  };
  onBlurNamingChange = (e) => {
    const { validation } = this.state;
    delete validation[e.target.name];
    if (e.target.value.toString().trim().length === 0) {
      validation[e.target.name] = true;
    } else if (
      (e.target.name == "clientUid" || e.target.name == "fpid") &&
      e.target.value.toString().trim().replace(/^0+/, "").length === 0
    ) {
      validation[e.target.name] = true;
    }
    this.setState({ validation: { ...validation } });
  };
  handleIncomingDelimeterSetting = (e) => {
    const { incomingDelimeterSetting } = this.state;
    this.setState({
      incomingDelimeterSetting: {
        ...incomingDelimeterSetting,
        [e.target.name]: e.target.value,
      },
    });
  };
  onBlurDelimiterChange = (e) => {
    const { validation } = this.state;
    delete validation[e.target.name];
    if (e.target.value.toString().trim().length === 0) {
      validation[e.target.name] = true;
    }
    this.setState({ validation: { ...validation } });
  };
  handleResponseFieldsChange = (event, item) => {
    const { returnFileSettings } = this.state;
    this.setState({
      returnFileSettings: {
        ...returnFileSettings,
        [item]: event.target.value === "" ? null : event.target.value,
      },
    });
  };

  validateMinLength = (value, item) => {
    const { t } = this.props;
    const { returnEDI, responseValidation } = this.state;
    switch (returnEDI[item] && returnEDI[item].label) {
      case "ISA01":
      case "ISA03":
      case "ISA05":
      case "ISA06":
      case "ISA07":
      case "ISA08":
        if (this.props.isOnboarding) {
          if (
            value.toString().trim().length !== 0 &&
            value.toString().trim().length < 2
          ) {
            responseValidation[item] = t("componentData.fileSettings.minLen2");
          }
        } else {
          if (value.toString().trim().length < 2) {
            responseValidation[item] = t("componentData.fileSettings.minLen2");
          }
        }
        break;
      case "ISA12":
        if (this.props.isOnboarding) {
          if (
            value.toString().trim().length !== 0 &&
            value.toString().trim().length < 5
          ) {
            responseValidation[item] = t("componentData.fileSettings.minLen5");
          }
        } else {
          if (value.toString().trim().length < 5) {
            responseValidation[item] = t("componentData.fileSettings.minLen5");
          }
        }
        break;
      case "PER02":
      case "PER04":
      case "ISA16":
        if (this.props.isOnboarding) {
          if (
            value.toString().trim().length !== 0 &&
            value.toString().trim().length < 1
          ) {
            responseValidation[item] = t("componentData.fileSettings.minLen1");
          }
        } else {
          if (value.toString().trim().length < 1) {
            responseValidation[item] = t("componentData.fileSettings.minLen1");
          }
        }
        break;
      default:
        break;
    }
  };

  onBlurResponseChange = (e, item) => {
    const { t } = this.props;
    const { responseValidation, ediResponsePaymentFile } = this.state;
    const {  value } = e.target;
    delete responseValidation[item];
    this.validateMinLength(value, item);
    if (this.props.isOnboarding) {
      if (
        value.toString().trim().length !== 0 &&
        (item === `scheduleSetting${ediResponsePaymentFile["824/997 File"]}` ||
          item === `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}` ||
          item ===
          `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}` ||
          item === 'MC XML' || item === 'Card ISO XML' || item === 'MC CSV') &&
          value!=="" && value
          .toString()
          .trim()
          .match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null
      ) {
        responseValidation[item] = t("componentData.fileSettings.timeFormt");
      }
    } else {
      if (
        (item === `scheduleSetting${ediResponsePaymentFile["824/997 File"]}` ||
          item === `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}` ||
          item ===
          `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}` ||
          item === 'MC XML' || item === 'Card ISO XML' || item === 'MC CSV') &&
          value!=="" && value
          .toString()
          .trim()
          .match(/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/) == null
      ) {
        responseValidation[item] = t("componentData.fileSettings.timeFormt");
      }
    }
    this.setState({ responseValidation: { ...responseValidation } });
  };
  getScheduledTime = (filetype) => {
    const value =
      this.state.scheduleSetting.length > 0 &&
      this.state.scheduleSetting.find((settings) =>
        settings.fileTypeId === this.state.ediResponsePaymentFile[filetype]
          ? settings.scheduleTime
          : ""
      );
    return value ? value.scheduleTime : "";
  };

  handleScheduleSettingsChange = (e) => {
    const { scheduleSetting } = this.state;
    const { value, id } = e.target;
    const restObj = scheduleSetting.filter(
      (item) => item.fileTypeId !== parseInt(id)
    );
    const obj = {
      scheduleTime: value.toString().length === 0 ? null : value,
      fileTypeId: parseInt(id),
    };
    this.setState({
      scheduleSetting: [...restObj, obj],
    });
  };

  handleAckSettingChange = (e) => {
    const { ackSetting, paymentFileTypes } = this.state;
    const { name, value } = e.target;
    let filterObj = paymentFileTypes.filter(x => x.fileName == name);
    let obj = {};
    if (filterObj.length) {
      let restObj = ackSetting.filter(
        (item) => item.fileTypeId !== parseInt(filterObj[0].id)
      );
      const exist = ackSetting && ackSetting.find(x => x.fileTypeId == filterObj[0].id);
      if (exist) {
        obj = {
          ...exist,
          ackTime: value.toString().length === 0 ? null : value,
          isAckRequired: filterObj[0].selected?1:0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      }
      else {
        obj = {
          ackTime: value.toString().length === 0 ? null : value,
          fileTypeId: filterObj[0].id,
          isAckRequired: filterObj[0].selected?1:0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      }
    }
  }

  handleAckToggleChange = (e, name) => {
    const { ackSetting, paymentFileTypes, responseValidation } = this.state;
    const toggleValue = Number(e.target.value);

    const filterObj = paymentFileTypes.find(x => x.fileName == name);
    let obj = {};
    if (filterObj) {
      const restObj = ackSetting.filter(
        (item) => item.fileTypeId !== parseInt(filterObj.id)
      );
      const exist = ackSetting && ackSetting.find(x => x.fileTypeId == filterObj.id);
      if (exist) {
        obj = {
          ...exist,
          isAckRequired: toggleValue || 0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      } else {
        obj = {
          ackTime: null,
          fileTypeId: filterObj.id,
          isAckRequired: toggleValue || 0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      }
      if(!toggleValue && exist){
        delete responseValidation[name];
        this.setState({ responseValidation: { ...responseValidation } });
        obj = {
          ...exist,
          ackTime: null,
          isAckRequired: toggleValue || 0
        };
        this.setState({
          ackSetting: [...restObj, obj]
        });
      }
    }
    if (name === "MC XML") {
      this.setState({ showXMLMSCResponse: toggleValue })
    } else if (name === "Card ISO XML") {
      this.setState({ showISOXMLMSCResponse: toggleValue })
    } else if (name === "MC CSV") {
      this.setState({ showCSVMSCResponse: toggleValue })
    }
  }

  getAckTime = (fileName) => {
    const { ackSetting, paymentFileTypes } = this.state;
    let value = '';
    const filterObj = paymentFileTypes && paymentFileTypes.filter(x => x.fileName == fileName);
    if (filterObj && filterObj.length) {
      value = ackSetting.length > 0 && ackSetting.find((item) =>
        item.fileTypeId === filterObj[0].id ? item : ''
      )
    }
    return value ? value.ackTime : '';
  };

  handleClearChanges = () => {
    const { paymentAttribute, payeeAttribute } = this.props;
    const { tabValue } = paymentAttribute;

    const fileSelectionType = paymentAttribute.fileSelectionType && paymentAttribute.fileSelectionType?.paymentHeader ?
      paymentAttribute.fileSelectionType : payeeAttribute.fileSelectionType;

    const isPayee = fileSelectionType.fileTypeId && fileSelectionType.fileTypeId == csvFileFormat.PAYEE ||
      (fileSelectionType.fileTypeId == csvFileFormat.BOTHPAYEEPAYMENT && tabValue == 0) || false;

    if (isPayee){
      this.fetchPayeeAttributeList(fileSelectionType?.fileTypeId);
    }
    else{
      this.fetchPaymentAttributeList(fileSelectionType?.fileTypeId);
    }
  }
  render() {
    const { t, user, paymentAttribute, payeeAttribute } = this.props;
    const fileSelectionType = paymentAttribute.fileSelectionType && paymentAttribute.fileSelectionType?.paymentHeader ?
      paymentAttribute.fileSelectionType : payeeAttribute.fileSelectionType;

    const {
      isLoading,
      paymentFileTypes,
      processing,
      isEDIselected,
      isISOselected,
      isCSVselected,
      isXMLMSCSelected,
      isISOXMLMSCSelected,
      isCSVMSCSelected,
      delimiters,
      subElementDelimiters,
      segmentDelimiters,
      namingConvention,
      incomingDelimeterSetting,
      returnEDI,
      returnFileSettings,
      ediResponsePaymentFile,
      scheduleSetting,
      showResponseFile,
      showXMLMSCResponse,
      showISOXMLMSCResponse,
      showCSVMSCResponse,
      error,
      validation,
      responseValidation,
      showBanner,
      clientId,
      openDialogue,
      variant,
      clearChangeLoader
    } = this.state;

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

    return (
      <>
        <Box my={2}>
          {openDialogue && (
            <ImportOnboardingDailogue
              onConfirm={this.moveToDashboard}
              onCancel={() => {
                this.setState({
                  openDialogue: false,
                });
              }}
              open={openDialogue}
            />
          )}
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
              <Box pt={2} px={4}>
                <h3
                  style={{
                    fontWeight: "normal",
                    fontSize: "20px",
                    color: "#0B1941",
                  }}
                >
                  {t("componentData.fileSettings.FileSettings")}
                </h3>
              </Box>
              <Box my={0} px={2.2} pt={2}>
                <IncomingFileSettings
                  canEdit={isSettingFilesEditEnabled}
                  isEDIselected={isEDIselected}
                  delimiters={delimiters}
                  subElementDelimiters={subElementDelimiters}
                  segmentDelimiters={segmentDelimiters}
                  validation={validation}
                  namingConvention={namingConvention}
                  selectedPaymentFileTypes={paymentFileTypes}
                  incomingDelimeterSetting={incomingDelimeterSetting}
                  handleNamingChange={this.handleNamingChange}
                  handleIncomingDelimeterSetting={
                    this.handleIncomingDelimeterSetting
                  }
                  onBlurNamingChange={this.onBlurNamingChange}
                  isOnboarding={this.props.isOnboarding}
                  onBlurDelimiterChange={this.onBlurDelimiterChange}
                />
              </Box>
              <Box>
                {/* <ContentHeader title="File Settings"/> */}
                <IncomingPaymentFileTypeSelector
                  paymentFileTypes={paymentFileTypes}
                  onChange={this.handlePaymentFileTypeChange}
                  canEdit={isSettingFilesEditEnabled}
                  px={2.2}
                  flag={true}
                />
              </Box>

              <Box my={0}>
                <ResponseFileSettings
                  canEdit={isSettingFilesEditEnabled}
                  isEDIselected={isEDIselected}
                  isISOselected={isISOselected}
                  isCSVselected={isCSVselected}
                  isXMLMSCSelected={isXMLMSCSelected}
                  isISOXMLMSCSelected={isISOXMLMSCSelected}
                  isCSVMSCSelected={isCSVMSCSelected}
                  delimiters={delimiters}
                  subElementDelimiters={subElementDelimiters}
                  segmentDelimiters={segmentDelimiters}
                  returnFileSettings={returnFileSettings}
                  ediResponsePaymentFile={ediResponsePaymentFile}
                  getScheduledTime={this.getScheduledTime}
                  scheduleSetting={scheduleSetting}
                  returnEDI={returnEDI}
                  responseValidation={responseValidation}
                  showResponseFile={showResponseFile}
                  onChange={this.handleResponseFieldsChange}
                  handleScheduleSettingsChange={
                    this.handleScheduleSettingsChange
                  }
                  onBlurResponseChange={this.onBlurResponseChange}
                  isOnboarding={this.props.isOnboarding}
                  handleShowResponseFile={(selectedValue) => {
                    this.setState({
                      showResponseFile: selectedValue.value,
                    });
                  }}
                  handleAckToggleChange={this.handleAckToggleChange}
                  handleAckSettingChange={this.handleAckSettingChange}
                  getAckTime={this.getAckTime}
                  showXMLMSCResponse={showXMLMSCResponse}
                  showISOXMLMSCResponse={showISOXMLMSCResponse}
                  showCSVMSCResponse={showCSVMSCResponse}
                />
              </Box>

              {(isXMLMSCSelected && showXMLMSCResponse) || (isISOXMLMSCSelected && showISOXMLMSCResponse) ||
                (isCSVMSCSelected && showCSVMSCResponse) ?
                <Grid item xs={12}>
                  <Box display={"flex"} pl={4} pb={1}>
                    <Box pr={1}>
                      <InfoOutlinedIcon fontSize="small" color="primary" />
                    </Box>
                    <Typography style={{ fontSize: '0.75rem', fontStyle: 'italic', paddingTop: 4 }}>
                      {t("componentData.masterCardFileSetting.mcTooltipMsg")}
                    </Typography>
                  </Box>
                </Grid> : null
              }
            </Paper>

            <Grid container style={{ paddingTop: '30px' }}>
              <Grid item xs={3}>
                {config.showFMT && !this.props.isOnboarding && isCSVselected && (fileSelectionType?.fileTypeId && fileSelectionType.fileTypeId != csvFileFormat.DEFAULT ||
                  !fileSelectionType.isDefaultUser) ?

                  !clearChangeLoader ?
                    <Box mx={2} pt={4} component="span">
                      <Link
                        component="button"
                        style={{ fontFamily: 'Interstate' }}
                        underline='none'
                        onClick={() => this.handleClearChanges()}
                      >
                        {t("componentData.FileMappingTool.clearChangesBtn")}
                      </Link>
                    </Box>
                    :
                    <CircularProgress color="primary" />
                  : null
                }
              </Grid>
              <Grid item xs={5} container direction="row" justifyContent="center" alignItems="center">
                {this.props.isOnboarding && (
                  <Grid item style={{ paddingRight: '16px' }}>
                    <Button
                      type="submit"
                      fullWidth={false}
                      variant="outlined"
                      color="primary"
                      onClick={(e) =>
                        this.props.history.push(
                          `${config.baseName}/onboard/payment?id=${clientId}`
                        )}
                    >
                      {t("componentData.fileSettings.Back")}
                    </Button>
                  </Grid>
                )}
                {processing ? (
                  <CircularProgress color="primary" />
                ) : (
                  <>
                    {config.showFMT && !this.props.isOnboarding && isCSVselected && (fileSelectionType.fileTypeId && fileSelectionType.fileTypeId != csvFileFormat.DEFAULT ||
                      !fileSelectionType.isDefaultUser) && isSettingFilesEditEnabled ?
                      <Grid item style={{ paddingRight: '16px' }}>
                        <Button
                          style={{ background: '#FFFFFF', color: '#0B1941', border: '1px solid #0B1941' }}
                          type="submit"
                          fullWidth={false}
                          variant="outlined"
                          color="primary"
                          onClick={(e) => this.handleSubmit(e, true)}
                        >
                          {t("componentData.FileMappingTool.saveAndDownloadBtn")}
                        </Button>
                      </Grid> : null
                    }

                    <Grid item style={{ paddingRight: '16px' }}>
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
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>

            <Box my={4} className={`button-container`}>
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
  connect((state) => ({ ...state.client, ...state.user, ...state.paymentAttribute, ...state.payeeAttribute }))(FileSettings)
);
