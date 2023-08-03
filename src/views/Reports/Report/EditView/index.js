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
import { withStyles } from "@material-ui/styles";
import styles from "./styles";
import { withTranslation } from "react-i18next";
import {
  fetchReportDataTypeList,
  fetchReportParameters,
  getFrequencyList,
  downloadDynamicReport,
  updateDynamicReportDetails,
  updateReportSubscription,
  downloadPaymentDynamicReport,
} from "~/redux/actions/reports";
import ParameterSelector from "~/modules/Reports/ParameterSelector/";
import CCParameterSelector from "~/modules/Reports/ParameterSelector/CC/";
import ReportOptions from "~/modules/Reports/Options/";
import * as FileSaver from "file-saver";
import { SideDialog } from "~/components/Dialogs";
import CommonDateFilter from "~/modules/CommonDateFilter";
import { getFormattedDate } from "../utils";
import { defaultValidationChecks } from "../const";
import { AlertDialog, ConfirmDialog } from "~/components/Dialogs";
import InfoIcon from "@material-ui/icons/Info";
import config from "~/config";
import { entityType,PayerTypes } from "~/config/entityTypes";

const EditView = (props) => {
  const { classes, t } = props;
  const dataTypeMappingId = [];
  if (!props.location.state.selectedReportDetails.dataTypeMappingId) {
    props.location.state.selectedReportDetails.ClientParameters.forEach(
      (param) => {
        dataTypeMappingId.push(param.dataTypeMappingId);
      }
    );
    props.history.push({
      state: {
        ...props.location.state,
        selectedReportDetails: {
          ...props.report.selectedReportDetails,
          dataTypeMappingId: dataTypeMappingId,
        },
      },
    });
  }
  const [reportData, setReportData] = useState({
    ...props.location.state.selectedReportDetails,
  });
  const [alertData, setAlertData] = useState({
    alertMessage: null,
    alertType: null,
  });
  const [validation, setValidation] = useState(defaultValidationChecks);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showConfirmCloseDialog, setShowConfirmCloseDialog] =
    React.useState(false);
  const [downloadProgress, setDownloadProgress] = useState(false);
  const [subscriptionProgress, setSubscriptionProgress] = useState(false);
  useEffect(() => {
    props.dispatch(fetchReportDataTypeList());
    props.dispatch(fetchReportParameters(reportData.dataTypeId));
    props.dispatch(getFrequencyList());
    const dataTypeMappingId = [];
    props.location.state.selectedReportDetails.ClientParameters.forEach(
      (param) => {
        dataTypeMappingId.push(param.dataTypeMappingId);
      }
    );
    setReportData({ ...reportData, dataTypeMappingId: dataTypeMappingId });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location.state]);

  const hideAlertMessage = () => {
    setAlertData({ alertMessage: null, alertType: null });
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

  const onCancelClose = () => {
    setShowConfirmCloseDialog(false);
  };

  const onConfirmClose = () => {
    const dataTypeMappingId = [];
    props.location.state.selectedReportDetails.ClientParameters.forEach(
      (param) => {
        dataTypeMappingId.push(param.dataTypeMappingId);
      }
    );
    setReportData({
      ...props.location.state.selectedReportDetails,
      dataTypeMappingId: dataTypeMappingId,
    });
    setValidation(defaultValidationChecks);
    setShowConfirmCloseDialog(false);
    redirectToList();
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    if (name === "dataTypeId") {
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
      const finalData = { ...reportData, [name]: value };
      if (name === "frequency") {
        const selectedFrequency = props.frequencyList.filter(
          (freq) => freq.subscriptionTypeId === value
        )[0].description;
        finalData.frequencyId = value;
        finalData.frequency = selectedFrequency;
        updateSubscription(finalData);
      }
      setReportData(finalData);
    }
  };

  const handleSubscription = ({ target }) => {
    const { name, value } = target;
    if (value) {
      const payerTypeId =  props?.user?.user?.userData?.payerTypeId || PayerTypes.PMTX ;
      const selectedFrequency = props.frequencyList.filter(
        (freq) => freq.subscriptionTypeId === (payerTypeId !== PayerTypes.CARDS ? 2:1)
      )[0].description;
      setReportData({
        ...reportData,
        [name]: value,
        frequency: selectedFrequency,
        frequencyId: (payerTypeId !== PayerTypes.CARDS ? 2:1),
      });
      updateSubscription({
        ...reportData,
        [name]: value,
        frequency: selectedFrequency,
        frequencyId:(payerTypeId !== PayerTypes.CARDS ? 2:1),
      });
    } else {
      setReportData({
        ...reportData,
        [name]: value,
        frequency: null,
        frequencyId: null,
      });
      updateSubscription({
        ...reportData,
        [name]: value,
        frequency: null,
        frequencyId: null,
      });
    }
  };

  const updateSubscription = (finalData) => {
    const payerTypeId =  props?.user?.user?.userData?.payerTypeId || PayerTypes.PMTX ;
    setSubscriptionProgress(true);
    const selectedFrequency = props.frequencyList.filter(
      (freq) => freq?.subscriptionTypeId === (payerTypeId !== PayerTypes.CARDS ? 2:1)
    )[0].description;
    const previousFrequency =
      props.location.state.selectedReportDetails.frequencyId;
    const isFrequencyChanged =
      props.location.state.selectedReportDetails.subscription &&
      previousFrequency !== finalData.frequencyId;
    const subscriptionData = {
      subscription: finalData.subscription,
      clientReportId: props.location.state.selectedReportDetails.clientReportId,
      frequency: finalData.frequency || selectedFrequency,
      frequencyId: finalData.frequencyId || (payerTypeId !== PayerTypes.CARDS ? 2:1),
      dataType: finalData.dataType || null,
      reportCode: false,
      reportName:
        props.location.state.selectedReportDetails.reportName ||
        finalData.reportName,
    };
    props
      .dispatch(updateReportSubscription(subscriptionData))
      .then((response) => {
        setSubscriptionProgress(false);
        if (response) {
          props.history.push({
            state: {
              ...props.location.state,
              selectedReportDetails: {
                ...props.report.selectedReportDetails,
                ...finalData,
              },
            },
          });
          setAlertData({
            ...alertData,
            alertMessage: finalData.subscription
              ? isFrequencyChanged
                ? t(`componentData.addView.reportFreqUpdated`)
                : t(`componentData.addView.reportSubscribed`)
              : t(`componentData.addView.reportUnsubscribed`),
            alertType: "success",
          });
        }
      })
      .catch((error) => {
        setSubscriptionProgress(false);
        setAlertData({
          ...alertData,
          alertMessage: t(`componentData.reduxData.ErrorOccurred`),
          alertType: "error",
        });
      });
  };

  const handleSubmit = () => {
    const currentValidation = { ...validation };
    for (const obj in currentValidation) {
      currentValidation[obj] = !Boolean(reportData[obj]);
    }
    const finalReportData = { ...reportData };
    delete finalReportData["frequencyId"];
    delete finalReportData["subscription"];
    delete finalReportData["frequency"];
    setValidation(currentValidation);
    if (!Object.values(currentValidation).includes(true)) {
      props
        .dispatch(
          updateDynamicReportDetails(finalReportData, reportData.clientReportId)
        )
        .then((response) => {
          if (response && !response.error) {
            props.history.push({
              state: {
                ...props.location.state,
                selectedReportDetails: {
                  ...props.report.selectedReportDetails,
                  ...reportData,
                },
              },
            });
            setAlertData({
              ...alertData,
              alertMessage: t(`componentData.addView.reportUpdated`),
              alertType: "success",
              alertMessageCallback: true,
            });
          } else {
            setAlertData({
              ...alertData,
              alertMessage: response.message,
              alertType: "error",
              alertMessageCallback: null,
            });
          }
        })
        .catch((error) => {
          setAlertData({
            ...alertData,
            alertMessage: error.message,
            alertType: "error",
          });
        });
    }
  };

  const handleDownload = () => {
    setDownloadProgress(true);
    const appType = props.user.user.userData.appType
      ? parseInt(props.user.user.userData.appType)
      : entityType.B2B;
    if (reportData.dataTypeId === 1) {
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
        dataTypeId: reportData.dataTypeId,
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
                  <Typography variant="h1">
                    {t("componentData.addView.EditReport")}
                  </Typography>
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
                    value={reportData.dataTypeId || ""}
                    autoComplete="off"
                    variant="outlined"
                    name="dataTypeId"
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
            reportData.dataTypeId === 1
              ? t("componentData.addView.SelectPaymentParameters")
              : t("componentData.addView.SelectPayeeParameters")
          }
          paymentParameterList={props.reportParametersList}
          selectedPaymentParameters={reportData.dataTypeMappingId ?? []}
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
        selectedPaymentParameters={reportData.dataTypeMappingId ?? []}
        handleChange={handleCheckbox}
        parameterValidation={validation.parametersCount}
        errorText={t("componentData.addView.SelectParameters")}
      />
        }
        {reportData.dataTypeMappingId &&
          reportData.dataTypeMappingId.length > 0 && (
            <ReportOptions
              isSubscriber={reportData.subscription}
              emailSubscriptionFrequency={reportData.frequencyId}
              subscriptionFrequencyList={props.frequencyList}
              handleChange={handleChange}
              handleSubscription={handleSubscription}
              handleDownload={handleDownload}
              userRoles={props.user.user.userRoles}
              downloadProgress={downloadProgress}
              subscriptionProgress={subscriptionProgress}
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
        {alertData.alertMessage &&
          renderAlertMessage(
            "",
            alertData.alertMessage,
            alertData.alertMessageCallback
          )}

        {showConfirmCloseDialog &&
          renderCancelDialog(
            <InfoIcon size="small" />,
            "",payerTypeId !== PayerTypes.CARDS ? t("componentData.addView.notSaveMsg") : t("componentData.addView.notSaveCCMsg"))}

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
                  onClick={() => redirectToList()}
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
      </Grid>
    </>
  );
};

export default withTranslation()(withStyles(styles)(EditView));
