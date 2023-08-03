import React, { useState, useEffect } from "react";
import TextField from "~/components/Forms/TextField";
import {
  Grid,
  Box,
  Paper,
  Button,
  MenuItem,
  CircularProgress,
  Typography,
  Backdrop,
} from "@material-ui/core";
import { defaultReportData } from "../const";
import { withStyles } from "@material-ui/styles";
import styles from "./styles";
import { withTranslation } from "react-i18next";
import {
  fetchReportDataTypeList,
  fetchReportParameters,
  createDynamicReport,
  getFrequencyList,
  downloadDynamicReport,
  downloadPaymentDynamicReport,
} from "~/redux/actions/reports";
import ParameterSelector from "~/modules/Reports/ParameterSelector/";
import CCParameterSelector from "~/modules/Reports/ParameterSelector/CC/";
import ReportOptions from "~/modules/Reports/Options/";
import * as FileSaver from "file-saver";
import { SideDialog } from "~/components/Dialogs";
import CommonDateFilter from "~/modules/CommonDateFilter";
import config from "~/config";
import { getFormattedDate } from "../utils";
import { defaultValidationChecks } from "../const";
import { AlertDialog, ConfirmDialog } from "~/components/Dialogs";
import InfoIcon from "@material-ui/icons/Info";
import { entityType,PayerTypes } from "~/config/entityTypes";

const AddView = (props) => {
  const [reportData, setReportData] = useState(defaultReportData);
  const [alertData, setAlertData] = useState({
    alertMessage: null,
    alertType: null,
    alertMessageCallback: null,
  });
  const [validation, setValidation] = useState(defaultValidationChecks);
  const [showConfirmCloseDialog, setShowConfirmCloseDialog] =
    React.useState(false);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(false);
  const { classes, t, report } = props;
  const { pathname } = props.location;
  const isAddUserScreen = pathname.includes("add");
  const title = isAddUserScreen
    ? t("componentData.addView.AddReport")
    : t("componentData.addView.EditReport");

  useEffect(() => {
    props.dispatch(fetchReportDataTypeList());
    props.dispatch(fetchReportParameters(defaultReportData.datatypeId));
    props.dispatch(getFrequencyList());
    setReportData({ ...defaultReportData, dataTypeMappingId: [] });
  }, []);

  const hideAlertMessage = () => {
    setAlertData({
      alertMessage: null,
      alertType: null,
      alertMessageCallback: null,
    });
  };

  const redirectToList = () => {
    setAlertData({
      alertMessage: null,
      alertType: null,
      alertMessageCallback: null,
    });
    props.history.push(`${config.baseName}/reports`);
  };

  const renderAlertMessage = (title, message, callback) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          callback ? redirectToList() : hideAlertMessage();
        }}
      />
    );
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === "datatypeId") {
      const selectedDataType = props.reportDataTypeList.filter(
        (dataTypeItem) => {
          return dataTypeItem.dataTypeId === value;
        }
      )[0].dataTypeName;
      props.dispatch(fetchReportParameters(value));
      setReportData({
        ...reportData,
        [name]: value,
        dataTypeMappingId: [],
        dataType: selectedDataType,
      });
    } else {
      if (name === "reportName" && value) {
        setValidation({ ...validation, [name]: false });
      }
      if (name === "frequency") {
        const selectedFrequency = props.frequencyList.filter(
          (item) => item.subscriptionTypeId === value
        )[0]?.description;
        setReportData({
          ...reportData,
          [name]: selectedFrequency,
          frequencyId: value,
        });
      } else {
        setReportData({ ...reportData, [name]: value });
      }
    }
  };

  const handleCancel = () => {
    setShowConfirmCloseDialog(true);
  };
  const onCancelClose = () => {
    setShowConfirmCloseDialog(false);
  };

  const onConfirmClose = () => {
    setValidation(defaultValidationChecks);
    setReportData(defaultReportData);
    setShowConfirmCloseDialog(false);
    props.history.push(`${config.baseName}/reports`);
  };

  const handleSubscription = ({ target }) => {
    const payerTypeId =  props?.user?.user?.userData?.payerTypeId || PayerTypes.PMTX ;
    const { name, value } = target;
    if (value) {
      const selectedFrequency = props.frequencyList.filter(
        (item) => item.subscriptionTypeId === (payerTypeId !== PayerTypes.CARDS ? 2:1)
      )[0]?.description;
      setReportData({
        ...reportData,
        [name]: value,
        frequency: selectedFrequency,
        frequencyId: (payerTypeId !== PayerTypes.CARDS ? 2:1),
      });
    } else {
      setReportData({
        ...reportData,
        [name]: value,
        frequency: null,
        frequencyId: null,
      });
    }
  };

  const handleSubmit = () => {
    const currentValidation = { ...validation };
    for (const obj in currentValidation) {
      currentValidation[obj] = !Boolean(reportData[obj]);
    }
    const finalReportData = { ...reportData };
    setValidation(currentValidation);
    if (!Object.values(currentValidation).includes(true)) {
      props
        .dispatch(createDynamicReport(report, finalReportData))
        .then((response) => {
          if (response.error) {
            setAlertData({
              alertMessage: response.message,
              alertType: "error",
              alertMessageCallback: null,
            });
          } else {
            setAlertData({
              alertMessage: t("componentData.addView.reportAddSuccess"),
              alertType: "success",
              alertMessageCallback: true,
            });
          }
        });
    }
  };

  const handleDownload = () => {
    setDownloadProgress(true);
    const appType = props.user.user.userData.appType
      ? parseInt(props.user.user.userData.appType)
      : entityType.B2B;
    if (reportData.datatypeId === 1) {
      const downloadData = {
        fromDate: getFormattedDate(reportData.fromDate),
        toDate: getFormattedDate(reportData.toDate),
        clientId: props.user.user.userData.portalProfileId,
        isBankReport: 0,
        tokenString: reportData.dataTypeMappingId.join(","),
        datatypeid: 1,
        BusinessType: appType,
      };
      props
        .dispatch(downloadPaymentDynamicReport(downloadData))
        .then(async (response) => {
          if (!response || (response && response.error)) {
            setAlertData({
              alertMessage: response?.message || t(`componentData.reduxData.tryAgain`),
              alertType: "error",
              alertMessageCallback: null,
            });
            setDownloadProgress(false);
            return false;
          }
          if(response.data){
            const fileName =
              (reportData.reportName
                ? reportData.reportName
                : `Report_${new Date().toISOString()}`) + '.xlsx';
            const type = response.headers['content-type'];
            const data = new Blob([response.data], {
              type: type,
              encoding: 'UTF-8',
            });
            FileSaver.saveAs(data, fileName);
            setDownloadProgress(false);
          } else {
                setAlertData({
                alertMessage: t(`componentData.reduxData.tryAgain`),
                alertType: "error",
                alertMessageCallback: null,
              });
          }
        })
        .catch((error) => {
          setDownloadProgress(false);
          setAlertData({
            alertMessage: error,
            alertType: "error",
            alertMessageCallback: null,
          });
          return false;
        });
    } else {
      const downloadData = {
        fromDate: getFormattedDate(reportData.fromDate),
        toDate: getFormattedDate(reportData.toDate),
        clientId: props.user.user.userData.portalProfileId,
        selectedParameters: reportData.dataTypeMappingId,
        dataTypeId: reportData.datatypeId,
      };
      props
        .dispatch(downloadDynamicReport(appType, downloadData))
        .then(async (response) => {
          if (!response || (response && response.error)) {
            setAlertData({
              alertMessage: response?.message || t(`componentData.reduxData.tryAgain`),
              alertType: "error",
              alertMessageCallback: null,
            });
            setDownloadProgress(false);
            return false;
          }
          if(response.data){
            const fileName =
              (reportData.reportName
                ? reportData.reportName
                : `Report_${new Date().toISOString()}`) + '.xlsx';
            const type = response.headers['content-type'];
            const data = new Blob([response.data], {
              type: type,
              encoding: 'UTF-8',
            });
            FileSaver.saveAs(data, fileName);
            setDownloadProgress(false);
          } else {
            setAlertData({
              alertMessage: t(`componentData.reduxData.tryAgain`),
              alertType: "error",
              alertMessageCallback: null,
            });
          }
        })
        .catch((error) => {
          setDownloadProgress(false);
          setAlertData({
            alertMessage: error,
            alertType: "error",
            alertMessageCallback: null,
          });
          return false;
        });
    }
  };

  const handleDateFilterChange = (selectedDateValues) => {
    setReportData({ ...reportData, ...selectedDateValues });
  };

  const handleCheckbox = (value) => {
    const currentReportData = { ...reportData };
    const currentValIndex = currentReportData.dataTypeMappingId.findIndex(
      (item) => item === value
    );
    if (currentValIndex === -1) {
      currentReportData["dataTypeMappingId"].push(value);
    } else {
      currentReportData.dataTypeMappingId.splice(currentValIndex, 1);
    }
    currentReportData.parametersCount =
      currentReportData.dataTypeMappingId.length;
    if (currentReportData.parametersCount) {
      setValidation({ ...validation, parametersCount: false });
    }
    setReportData(currentReportData);
  };

  const renderCancelDialog = (icon, title, message) => {
    return (
      <ConfirmDialog
        icon={icon}
        title={title}
        message={message}
        onCancel={() => onCancelClose()}
        onConfirm={() => onConfirmClose()}
      />
    );
  };
 const payerTypeId =  props?.user?.user?.userData?.payerTypeId || PayerTypes.PMTX ;
  return (
    <>
      <Backdrop className={classes.backdrop} open={downloadProgress || false}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid container justify="center" className={classes.root}>
        <Grid item container xs={12}>
          <Paper className={classes.paper} square>
            <Grid container justify="center">
              <Grid item xs={12} sm={12} className={classes.gridItem}>
                <Box p={1}>
                  <Typography variant="h1">{title}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={6} className={classes.gridItem}>
                <Box mx={1} pt={1}>
                  <TextField
                    required
                    label={t("componentData.addView.NameOfReport")}
                    error={validation.reportName}
                    helperText={
                      validation.reportName &&
                      t("componentData.addView.EnterReportName")
                    }
                    fullWidth={true}
                    autoComplete="off"
                    autoFocus={false}
                    inputProps={{
                      maxLength: 50,
                    }}
                    variant="outlined"
                    value={reportData.reportName}
                    name="reportName"
                    onChange={handleChange}
                  />
                </Box>
              </Grid>
              <Grid item xs={3} sm={3} className={classes.gridItem}>
                <Box mx={1} pt={1}>
                  <TextField
                    required
                    label={t("componentData.addView.DataType")}
                    fullWidth={true}
                    select
                    value={reportData.datatypeId || ""}
                    autoComplete="off"
                    variant="outlined"
                    name="datatypeId"
                    onChange={handleChange}
                  >
                    {props.reportDataTypeList.length ? (
                      props.reportDataTypeList.map((option) => (
                        <MenuItem
                          key={option.dataTypeId}
                          value={option.dataTypeId}
                        >
                          {option.dataTypeName}
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
              <Grid item xs={3} sm={3} className={classes.gridItem}>
                <Box
                  display="flex"
                  mx={1}
                  pt={1}
                  alignItems="center"
                  className={classes.filterGrid}
                >
                  <Box p={1}>
                    <Button
                      color="primary"
                      aria-label="View"
                      title={t("componentData.addView.ViewFilter")}
                      component="span"
                      className={classes.smallBtn}
                      onClick={() => {
                        setShowDateFilter(true);
                      }}
                    >
                      <img
                        src={require(`~/assets/icons/icon_filter.svg`)}
                        alt={t("componentData.addView.ViewFilter")}
                        className={classes.smallIcon}
                      />
                      <Typography variant="h3" className={classes.iconText}>
                        {t("componentData.addView.Filters")}
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {payerTypeId !== PayerTypes.CARDS ?
        <ParameterSelector
          title={
            reportData.datatypeId === 1
              ? t("componentData.addView.SelectPaymentParameters")
              : t("componentData.addView.SelectPayeeParameters")
          }
          paymentParameterList={props.reportParametersList}
          selectedPaymentParameters={reportData.dataTypeMappingId}
          handleChange={handleCheckbox}
          parameterValidation={validation.parametersCount}
          errorText={t("componentData.addView.SelectParameters")}
        /> : 
        <CCParameterSelector
          title={
            reportData.datatypeId === 1
              ? t("componentData.addView.SelectPaymentParameters")
              : t("componentData.addView.SelectPayeeParameters")
          }
          paymentParameterList={props.reportParametersList}
          selectedPaymentParameters={reportData.dataTypeMappingId}
          handleChange={handleCheckbox}
          parameterValidation={validation.parametersCount}
          errorText={t("componentData.addView.SelectParameters")}
        />
        }

        {reportData.dataTypeMappingId.length > 0 && (
          <ReportOptions
            isSubscriber={reportData.subscription}
            emailSubscriptionFrequency={reportData.frequencyId}
            subscriptionFrequencyList={props.frequencyList}
            handleChange={handleChange}
            handleSubscription={handleSubscription}
            handleDownload={handleDownload}
            userRoles={props.user.user.userRoles}
            downloadProgress={downloadProgress}
          />
        )}

        {showDateFilter && (
          <SideDialog
            showButton={false}
            alignSide={true}
            icon="calendar"
            onConfirm={() => setShowDateFilter(false)}
            title={t("componentData.dashboard.DateFilter")}
          >
            <CommonDateFilter
              selectedFilter={reportData.dateFilter}
              handleChange={handleDateFilterChange}
              fromDate={reportData.fromDate}
              toDate={reportData.toDate}
              setShowDateFilter={setShowDateFilter}
              setValidation={setValidation}
              validation={validation}
            />
          </SideDialog>
        )}

        <Grid container xs={12}>
          <Grid container justify="center">
            <Grid
              item
              container
              xs={12}
              sm={12}
              className={classes.gridItem}
              justify="center"
            >
              <Box display="flex" mb={5} mt={3} justifyContent="space-between">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleCancel()}
                >
                  {t("componentData.addView.CancelBtn")}
                </Button>
                {1 === 0 ? (
                  <CircularProgress color="primary" />
                ) : (
                  <Button
                    variant="contained"
                    style={{ marginLeft: "30px" }}
                    color="primary"
                    onClick={() => handleSubmit()}
                  >
                    {t("componentData.addView.SaveBtn")}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {alertData.alertMessage &&
          renderAlertMessage(
            "",
            alertData.alertMessage,
            alertData.alertMessageCallback
          )}
        {showConfirmCloseDialog &&
          renderCancelDialog(
            <InfoIcon size="small" />,
            "", payerTypeId !== PayerTypes.CARDS ? t("componentData.addView.notSaveMsg") : t("componentData.addView.notSaveCCMsg")
          )}
      </Grid>
    </>
  );
};

export default withTranslation()(withStyles(styles)(AddView));
