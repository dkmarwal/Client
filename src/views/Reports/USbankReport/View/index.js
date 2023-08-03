import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Paper,
  Button,
  Tooltip,
  IconButton,
  MenuItem,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import Cookies from "universal-cookie";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { AlertDialog } from "~/components/Dialogs";
import { withStyles } from "@material-ui/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import InfoIcon from "@material-ui/icons/Info";
import TextField from "~/components/Forms/TextField";

import {
  getFrequencyList,
  downloadPaymentStatusReport,
  updateReportSubscription,
  downloadDailyEnrollment,
  emailSmsRejectionFile,
  getSmsOptOutReport
} from "~/redux/actions/USbank/reports";
import styles from "./styles";
import moment from "moment";
import config from "~/config";
import { accessRights } from "~/config/accessRights";
import * as FileSaver from "file-saver";
import { withTranslation } from 'react-i18next';
import en from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";
import es from "date-fns/locale/es";
import i18n from "~/i18n";
import { USBankReportTypeAccess } from "~/config/entityTypes";

const cookies = new Cookies();
const language = cookies.get("localeLang") || "en";
const translatedData =
  i18n.logger.options.resources[language].translation.componentData.generalSettings;
const localeMap = {
  en,
  fr:frLocale,
  es,
};

let month = new Date().getMonth();
let year = new Date().getFullYear();
if (month === 0) {
  month = 12;
  year = year - 1;
}

class USbankReportView extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      data: state && state.report,
      isLoading: true,
      showFilter: false,
      filterList: [],
      selectedDateFilter: 1,
      startDate: null,
      endDate: null,
      filterListProgress: false,
      validation: {},
      isSubscriber:
        (state && state.report && state.report.subscription) || false,
      subscriptionFrequencyList: [],
      emailSubscriptionFrequency:
        (state && state.report && state.report.frequencyId) || false,
      downloadProgress: false,
      frequencyListProgress: false,
      clientListProgress: false,
      clientList: [],
      campaignList: [],
      selectedClient: [],
      selectedCampaign: [],
      enableDateFilter: false,
      selectedCurrentDateFilter: 2,
      selectedFilter: 2,
      selectedView: 'Amount',
      filters: [
        {
          label: 'All time',
          key: 0,
        },
        {
          label: 'Previous Month',
          key: 1,
        },
        {
          label: 'Previous Quarter',
          key: 2,
        },
        {
          label: 'Previous Year',
          key: 3,
        },
        {
          label: 'Last 7 days',
          key: 4,
        },
        {
          label: 'Last 30 Days',
          key: 5,
        },
        {
          label: 'Custom',
          key: 6,
        },
      ],
      filter: {
        clientID: 0,
        payeeID: 0,
        year: year,
        month: month,
        quarter: '',
        lastDays: undefined,
        resultType: '',
        currency: '',
        fromDate: undefined,
        toDate: undefined,
      },
    };
  }


  fetchFrequencyList = () => {
    this.setState(
      {
        frequencyListProgress: true,
      },
      () => {
        this.props.dispatch(getFrequencyList()).then((response) => {
          if (!response) {
            this.setState({
              alertType: "error",
              alertMessageCallbackType: null,
              alertMessage: this.props.report.error,
              frequencyListProgress: false,
            });
            return false;
          }

          this.setState({
            frequencyListProgress: false,
            subscriptionFrequencyList: this.props.report.frequencyList,
          });
        });
      }
    );
  };

  handleDateChange = (fieldName, date) => {
    switch (fieldName) {
      case "startDate":
        this.setState({ startDate: date });
        break;
      case "endDate":
        this.setState({ endDate: date });
        break;
      default:
        break;
    }
  };

  handleChange = (field, event, value, position) => {
    const {
      selectedPaymentParameters,
      data,
    } = this.state;
    switch (field) {
      case "name":
        const reportName = event.target.value;
        this.setState({ name: reportName });
        break;
      case "client":
        const { value: clients } = event.target;
        this.setState({ selectedClient: clients }, () => {
          //get campaign list base on selected clients
          if (data && data.reportCode === "DailyEnrollmentReport") {
            //this.getCampaignList();
          }
        });
        break;
      case "campaign":
        const { value: campaigns } = event.target;
        this.setState({ selectedCampaign: campaigns });
        break;
      case "selectedDateFilter":
        let FromDate = new Date();
        let ToDate = new Date();
        switch (value) {
          case 1:
            FromDate = null;
            ToDate = null;
            break;
          case 3:
            FromDate.setMonth(FromDate.getMonth() - 1);
            ToDate.setMonth(ToDate.getMonth() - 1);
            FromDate.setDate(1);
            ToDate.setFullYear(ToDate.getFullYear(), ToDate.getMonth() + 1, 0);
            break;
          case 4:
            FromDate.setMonth(FromDate.getMonth() - 4);
            ToDate.setMonth(ToDate.getMonth() - 1);
            FromDate.setDate(1);
            ToDate.setFullYear(ToDate.getFullYear(), ToDate.getMonth() + 1, 0);
            break;
          case 5:
            FromDate.setFullYear(new Date().getFullYear() - 1, 0, 1);
            ToDate.setFullYear(new Date().getFullYear(), 0, 0);
            break;
          case 6:
            FromDate.setDate(new Date().getDate() - 7);
            break;
          case 7:
            FromDate.setDate(new Date().getDate() - 30);
            break;
          default:
            break;
        }
        this.setState({
          selectedDateFilter: value,
          startDate: FromDate,
          endDate: ToDate,
        });
        break;
      case "paymentParameter":
        if (position) {
          this.setState({
            selectedPaymentParameters: [...selectedPaymentParameters, value],
          });
        } else {
          const newSelectedPaymentParameters =
            selectedPaymentParameters &&
            selectedPaymentParameters.filter((item, index) => item != value);
          this.setState({
            selectedPaymentParameters: [...newSelectedPaymentParameters],
          });
        }
        break;
      case "emailSubscriptionFrequency":
        const emailSubscriptionFrequency = event.target.value;
        this.setState({
          emailSubscriptionFrequency: emailSubscriptionFrequency,
        });
        break;
      default:
        break;
    }
  };

  validateForm = () => {
    const {t} = this.props
    const { startDate, endDate } = this.state;
    const fromDate = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const toDate = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
    let valid = true;
    let validation = {};

    const dateStart = moment(fromDate);
    const dateEnd = moment(toDate);
    const nintyDaysDate = dateEnd.diff(dateStart, 'days')

    if (!fromDate && !toDate) {
      validation["startDate"] = t('componentData.reportsView.startingDate');
      validation["endDate"] = t('componentData.reportsView.endingDate');
      valid = false;
    }

    if (!fromDate && toDate) {
      validation["startDate"] = t('componentData.reportsView.startingDate');
      valid = false;
    }

    if (fromDate && !toDate) {
      validation["endDate"] = t('componentData.reportsView.endingDate');
      valid = false;
    }

    if (nintyDaysDate > 90) {
      //validation["startDate"] = t('componentData.reportsView.startingDate');
      validation["endDate"] = t('componentData.reportsView.toFromDateNintyError');
      valid = false;
    }

    if (this.getFormattedDate(fromDate) > this.getFormattedDate(toDate)) {
      validation["dateRange"] = t('componentData.reportsView.endingDateGreater');
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
  };

  getFormattedDate = (dateVal) => {
    if (dateVal) {
      return moment(dateVal).format("YYYY-MM-DD");
    }
    return null;
  };

  handleDownload = (item) => {
      const {
      startDate,
      endDate,
      selectedClient
    } = this.state;
    const isValid = this.validateForm();
    const fromDate = startDate ? moment(startDate).utc().format("YYYY-MM-DD") : null;
    const toDate = endDate ? moment(endDate).utc().format("YYYY-MM-DD") : null;
    if (isValid) {
      this.setState(
        {
          downloadProgress: true,
          validation: {},
        },
        () => {
          const { userData } = this.props.user;
          const filename = item.reportName.split(' ').join('_') + '_' + moment().format("MMDDYYHHmmss") + ".csv";
          if (
            //item.reportCode === "FailedRemittanceDeliveryReport" ||
            //item.reportCode === "DailyPaymentStatusReport" ||
            item.reportCode === "DailyStatusReport"
          ) {
            this.props
              .dispatch(
                downloadPaymentStatusReport({
                  reportCode: item.reportCode,
                  portalProfileId: userData.portalProfileId,
                  clientIds: selectedClient,
                  startDate: fromDate,
                  endDate: toDate,
                  //format: "xlsx",
                })
              )
              .then((response) => {
                if (!response) {
                  this.setState({
                    alertType: "error",
                    alertMessageCallbackType: null,
                    alertMessage: this.props.report.error,
                    downloadProgress: false,
                  });
                  return false;
                }
  
                this.setState({
                  downloadProgress: false,
                });
  
                const type = response.headers["content-type"];
                const data = new Blob([response.data], {
                  type: type,
                  encoding: "UTF-8",
                });
                FileSaver.saveAs(data, filename);
              });
          } 
          else if (item.reportCode === "DailyEnrollmentReport") {
            this.props.dispatch(downloadDailyEnrollment({
              startDate: fromDate,
              endDate: toDate,
            })).then((response) => {
              if (!response) {
                this.setState({
                  alertType: "error",
                  alertMessageCallbackType: null,
                  alertMessage: this.props.report.error,
                  downloadProgress: false,
                });
                return false;
              }
  
              this.setState({
                downloadProgress: false,
              });
  
              const type = response.headers["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });
  
              FileSaver.saveAs(data, filename);
            })
          } 
          else if (item.reportCode === 'RejectedDeliveryReport') {
            this.props.dispatch(emailSmsRejectionFile({
              startDate: fromDate,
              endDate: toDate,
            })).then((response) => {
              if (!response) {
                this.setState({
                  alertType: "error",
                  alertMessageCallbackType: null,
                  alertMessage: this.props.report.error,
                  downloadProgress: false,
                });
                return false;
              }
  
              this.setState({
                downloadProgress: false,
              });
  
              const type = response.headers["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });
  
              FileSaver.saveAs(data, translatedData.rejectionDailyReport + '_' + moment().format("MMDDYYHHmmss") + ".csv");
            })
          } else {
            this.props.dispatch(getSmsOptOutReport({
              startDate: fromDate,
              endDate: toDate,
            })).then((response) => {
              if (!response) {
                this.setState({
                  alertType: "error",
                  alertMessageCallbackType: null,
                  alertMessage: this.props.report.error,
                  downloadProgress: false,
                });
                return false;
              }
  
              this.setState({
                downloadProgress: false,
              });
  
              const type = response.headers["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });
  
              FileSaver.saveAs(data, translatedData.dailysmsOptOutReport + '_' + moment().format("MMDDYYHHmmss") + ".csv");
            })
          }
        }
      );
    }
  };

  handleSubscription = (item) => {
    const { isSubscriber } = this.state;
    const { t } = this.props;
    this.setState(
      {
        subscriptionProgress: true,
      },
      () => {
        this.props
          .dispatch(
            updateReportSubscription({
              subscription: !isSubscriber,
              clientReportId: item.clientReportId,
              frequency: "Daily",
              frequencyId: 1,
              reportCode: item.reportCode,
              dataType: item.dataType,
              reportName: item.reportName || ""
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.report.error,
                subscriptionProgress: false,
              });
              return false;
            }

            this.setState({
              subscriptionProgress: false,
              isSubscriber: !isSubscriber,
              alertMessageCallbackType: null,
              alertMessage: !isSubscriber
                ? t('componentData.reportsView.ReportSubscribedSuccessfully')
                : t('componentData.reportsView.ReportUnsubscribedSuccessfully'),
            });
          });
      }
    );
  };

  handleCancel = () => {
    this.props.history.push(`${config.baseName}/reports`);
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  render() {
    const {
      alertMessage,
      alertMessageCallbackType,
      downloadProgress,
      subscriptionFrequencyList,
      emailSubscriptionFrequency,
      isSubscriber,
      data,
      startDate,
      endDate,
      validation,
    } = this.state;
    const { classes, user, t, i18n } = this.props;
    
    const bankParentProfileId = user?.userData?.activeBankParentProfileId; //Bank user

    const isReportDownloadEnabled =
      (user.userRoles && 
        (
          data.reportCode === 'DailyStatusReport' && user.userRoles.includes(accessRights["REPORTS_DAILY_STATUS_REPORT_DOWNLOAD"]) ||
          data.reportCode === 'DailyEnrollmentReport' && user.userRoles.includes(accessRights["REPORTS_DAILY_ENROLLMENT_REPORT_DOWNLOAD"]) ||
          data.reportCode === 'RejectedDeliveryReport' && user.userRoles.includes(accessRights["REPORTS_REJECTED_DELIVERY_REPORT_DOWNLOAD"]) ||
          data.reportCode === 'SMSOptOutReport' && user.userRoles.includes(accessRights["REPORTS_SMS_OPT_OUT_REPORT_DOWNLOAD"])
        )
      ) 
      || false;
    const isReportSubscribeEnabled =
      (user.userRoles &&
        (
          data.reportCode === 'DailyStatusReport' && user.userRoles.includes(accessRights["REPORTS_DAILY_STATUS_REPORT_SUBSCRIBE"]) ||
          data.reportCode === 'DailyEnrollmentReport' && user.userRoles.includes(accessRights["REPORTS_DAILY_ENROLLMENT_REPORT_SUBSCRIBE"]) ||
          data.reportCode === 'RejectedDeliveryReport' && user.userRoles.includes(accessRights["REPORTS_REJECTED_DELIVERY_REPORT_SUBSCRIBE"]) ||
          data.reportCode === 'SMSOptOutReport' && user.userRoles.includes(accessRights["REPORTS_SMS_OPT_OUT_REPORT_SUBSCRIBE"])
        )
      ) ||
      false;

    // const canSubscribe =
    //   (data && 
    //     (
    //     data.reportCode === "DailyEnrollmentReport" ||
    //     data.reportCode === "DailyStatusReport" ||
    //     data.reportCode === "RejectedDeliveryReport" ||
    //     data.reportCode === "SMSOptOutReport"
    //   ) 
    //   ) ? false : true;

    const reportName = data?.reportName && data?.reportName.trim();
    const dataType = data?.dataType && data?.dataType.trim();
    const frequency = data?.frequency && data?.frequency.trim();

    return (
      <Grid container justify="center" className={classes.root}>
        <Grid item container xs={12}>
          <Paper className={classes.paper} square>
            <Grid container justify="center">
              <Grid item xs={12} sm={12} className={classes.gridItem}>
                <Box p={1}>
                  <Typography variant="h1">{t(`componentData.reportsView.${reportName}`)}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Grid item xs={8} sm={8} className={classes.gridItem}>
                <Box display="flex" justifyContent="flex-start">
                  <Box pl={2}>
                    <Grid item xs={12} sm={12} className={classes.gridItem}>
                      <Box
                        pt={1}
                        display="flex"
                        justifyContent="flex-start"
                        flexDirection="column"
                      >
                        <Box pl={2}>
                          <Typography variant="h2">{t('componentData.reportsView.DataType')}</Typography>
                        </Box>
                        <Box pl={3}>{t(`componentData.reportsView.${dataType}`)}</Box>
                      </Box>
                    </Grid>
                    {isReportSubscribeEnabled ? (<Grid item xs={12} sm={12} className={classes.gridItem}>
                      <Box
                        pt={1}
                        display="flex"
                        justifyContent="flex-start"
                        flexDirection="column"
                      >
                        <Box pl={2}>
                          <Typography variant="h2">{t('componentData.reportsView.ReportFrequency')}</Typography>
                        </Box>
                        <Box pl={3}>{data?.frequency ? t(`componentData.reportsView.${frequency}`) : ""}</Box>
                      </Box>
                    </Grid>): null}
                    {isReportSubscribeEnabled && (
                      <Grid item xs={12} sm={12} className={classes.gridItem}>
                        <Box display="flex" width="100%" flexDirection="column">
                            <Box
                              p={1}
                              display="flex"
                              justifyContent="flex-start"
                            >
                              <IconButton
                                color="primary"
                                disabled={bankParentProfileId==1? true:false}
                                aria-label={
                                  isSubscriber === true
                                    ? t('componentData.reportsView.UNSUBSCRIBE')
                                    : t('componentData.reportsView.SUBSCRIBE')
                                }
                                title={
                                  isSubscriber === true
                                    ? t('componentData.reportsView.UNSUBSCRIBE')
                                    : t('componentData.reportsView.SUBSCRIBE')
                                }
                                component="span"
                                className={classes.smallBtn}
                                onClick={(event) => {
                                    if(bankParentProfileId==1){
                                        return false;
                                    } else {
                                        this.handleSubscription(data)
                                    }
                                }
                                }
                              >
                                {isSubscriber === true ? (
                                  <RemoveCircleOutlineIcon
                                    size="small"
                                    className={classes.smallIcon}
                                  />
                                ) : (
                                  <AddCircleOutlineIcon
                                    size="small"
                                    className={classes.smallIcon}
                                  />
                                )}
                                <Typography
                                  variant="h6"
                                  className={classes.iconText}
                                >
                                  {isSubscriber === true
                                    ? t('componentData.reportsView.UNSUBSCRIBE')
                                    : t('componentData.reportsView.SUBSCRIBE')}
                                </Typography>
                              </IconButton>
                              <Box p={1}>
                                <Tooltip
                                  title={isSubscriber === true
                                  ? t('componentData.reportsView.loggedInUser')
                                  : t('componentData.reportsView.loggedInUserNotSubcribe')}
                                  placement="right"
                                >
                                  <InfoIcon />
                                </Tooltip>
                              </Box>
                            </Box>
                          {0 == 1 && (
                            <Box
                              p={1}
                              display="flex"
                              justifyContent="flex-start"
                              width="300px"
                            >
                              <TextField
                                label={t('componentData.reportsView.EmailSubscriptionFrequency')}
                                fullWidth={true}
                                select
                                value={emailSubscriptionFrequency || ""}
                                autoComplete="off"
                                variant="outlined"
                                name="emailSubscriptionFrequency"
                                onChange={(event) =>
                                  this.handleChange(
                                    "emailSubscriptionFrequency",
                                    event
                                  )
                                }
                              >
                                {subscriptionFrequencyList ? (
                                  subscriptionFrequencyList.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.name}
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
                          )}
                        </Box>
                      </Grid>
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={4} sm={4} className={classes.gridItem}>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  flexDirection="column"
                >
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[i18n.language]}>
                      <Box pr={3} display="flex"> 
                        <Box p={1} style={{ width: "100%" }}>
                        <KeyboardDatePicker
                          autoOk={true}
                          clearable={true}
                          views={["year", "month", "date"]}
                          disableToolbar
                          format="MM/dd/yyyy"
                          margin="normal"
                          id="startDate"
                          name="startDate"
                          label={t('componentData.reportsView.startDate')}
                          variant="inline"
                          inputVariant="outlined"
                          value={startDate}
                          maxDate={moment().subtract(1, "days")}
                          error={validation && validation.startDate}
                          helperText={validation && validation.startDate}
                          className={classes.helperText}
                          onChange={(date) => {
                            this.setState({ startDate: date });
                          }}
                          onKeyDown={(e)=>{e.preventDefault();}}
                          KeyboardButtonProps={{
                            "aria-label": "Start Date",
                          }}
                        />
                        </Box>
                      </Box>
                    </MuiPickersUtilsProvider>

                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[i18n.language]}>
                      <Box pr={3} display="flex">
                        <Box p={1} style={{ width: "100%" }}>
                        <KeyboardDatePicker
                          autoOk={true}
                          clearable={true}
                          views={["year", "month", "date"]}
                          disableToolbar
                          variant="inline"
                          format="MM/dd/yyyy"
                          margin="normal"
                          id="startDate"
                          name="startDate"
                          label={t('componentData.reportsView.endDate')}
                          inputVariant="outlined"
                          value={endDate}
                          maxDate={moment().subtract(1, "days")}
                          error={
                            (validation && validation.endDate) ||
                            (validation && validation.dateRange)
                          }
                          helperText={
                            (validation && validation.endDate) ||
                            (validation && validation.dateRange)
                          }
                          className={classes.helperText}
                          onChange={(date) => {
                            this.setState({ endDate: date });
                          }}
                          onKeyDown={(e)=>{e.preventDefault();}}
                          KeyboardButtonProps={{
                            "aria-label": "Start Date",
                          }}
                        />
                        </Box>
                      </Box>
                    </MuiPickersUtilsProvider>      
                </Box>
              </Grid>

              <Grid
                container
                xs={12}
                sm={12}
                className={classes.gridItem}
                justify="center"
              >
                {isReportDownloadEnabled && (
                  <>
                  <Box
                    item
                    mb={5}
                    mt={3}
                    justifyContent="space-between"
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => this.handleCancel()}
                    >
                      {t('componentData.reportsView.CancelBtn')}
                    </Button>
                    </Box>
                    <Box
                      width="100px"
                      item
                      mb={3}
                      mt={3}
                      justifyContent="space-between"
                    >
                    {downloadProgress ? (
                      <CircularProgress color="primary" style={{ marginLeft: "30px" }} />
                    ) : (
                      <Button
                        variant="contained"
                        style={{ marginLeft: "30px" }}
                        color="primary"
                        onClick={() => this.handleDownload(data)}
                      >
                        {t('componentData.reportsView.DownloadBtn')}
                      </Button>
                    )}
                  </Box>
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}

      </Grid>
    );
  }

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          this.hideAlertMessage();
        }}
      />
    );
  };
}
export default withTranslation()(connect((state) => ({
  ...state.user,
  //...state.report,
  ...state.campaign,
  ...state.USbankReport,
}))(withStyles(styles)(USbankReportView)));
