import React from "react";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Paper,
  Input,
  FormHelperText,
  Button,
  Tooltip,
  IconButton,
  Select,
  Checkbox,
  MenuItem,
  ListItemText,
  CircularProgress,
  Typography,
  InputLabel,
  FormControl,
} from "@material-ui/core";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { AlertDialog } from "~/components/Dialogs";
import { withStyles } from "@material-ui/styles";
import EventIcon from "@material-ui/icons/Event";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import InfoIcon from "@material-ui/icons/Info";

import ReportsFilter from "~/components/Dialogs/reports/";
import DateFilter from "~/modules/Reports/DateFilter/";


import {
  fetchCampaignList,
  fetchBusinessUnitList,
  fetchReportFilter,
  getFrequencyList,
  updateReportSubscription,
  downloadDailyEnrollment,
  emailRejectionFile,
  SMSRejectionFile,
  B2CPaymentReconciliation
} from "~/redux/actions/reports";

import styles from "./styles";
import moment from "moment";
import config from "~/config";
import { accessRights } from "~/config/accessRights";
import * as FileSaver from "file-saver";
import { withTranslation } from 'react-i18next';
import en from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";
import es from "date-fns/locale/es";


const localeMap = {
  en,
  fr:frLocale,
  es,
};


class B2CReportView extends React.Component {
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
    };
  }

  componentDidMount = async () => {
    //By Default set today date
    //this.setState({startDate: defaultFromDate, endDate: defaultToDate});
    this.getFilterList();
    //this.getCampaignList();
    //this.fetchFrequencyList();      

  };

  hasDataSelected = () => {
    const { startDate } = this.state;
    if (Boolean(startDate)) {
      this.getClientList();
    }
  }



  resetFilter = () => {
    this.setState(
      {
        selectedDateFilter: 1,
        startDate: null,
        endDate: null,
      },
      () => {
        //this.getReportData();
      }
    );
  };

  applyFilter = () => {
    this.setState(
      {
        showFilter: false,
      },
      () => {
        //this.getReportData();
      }
    );
  };

  hideFilter = () => {
    this.setState({
      showFilter: false,
      selectedDateFilter: 1,
      startDate: null,
      endDate: null,
    });
  };

  getFilterList = () => {
    const { reportType } = this.state;

    this.setState(
      {
        filterListProgress: true,
      },
      () => {
        const { userData } = this.props.user;

        this.props
          .dispatch(
            fetchReportFilter({
              reportType,
              userId: userData.userId,
              portalProfileId: userData.portalProfileId,
              portalTypeId: userData.portalTypeId,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.report.error,
                filterListProgress: false,
              });
              return false;
            }

            this.setState({
              filterListProgress: false,
              filterList: this.props.report.filterList,
            });
          });
      }
    );
  };

  getClientList = () => {
    this.setState(
      {
        clientListProgress: true,
      },
      () => {
        const { reportCode } = this.state.data;
        const { startDate } = this.state;

        const fromDate = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
        const payload = {
          'reportStartDate': fromDate || null,
          'reportCode': reportCode || null
        }
        this.props
          .dispatch(fetchBusinessUnitList(payload)).then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.report.error,
                clientListProgress: false,
              });
              return false;
            }

            this.setState({
              campaignListProgress: false,
              clientList: this.props.report.businessUnitList,
            });
          });
      }
    );
  };

  getCampaignList = () => {
    const { selectedClient, selectedCampaign } = this.state;

    this.setState(
      {
        campaignListProgress: true,
      },
      () => {
        this.props
          .dispatch(fetchCampaignList({ selectedClient: selectedClient }))
          .then((response) => {
            if (!response) {
              this.setState({
                //alertType:"error",
                //alertMessageCallbackType: null,
                //alertMessage: this.props.campaign.error,
                campaignListProgress: false,
              });
              return false;
            }
            const listCampaign = this.props.campaign.campaignList;
            let newSelected = [];
            selectedCampaign.map((item) => listCampaign.some(c => c.campaignId === item) ? newSelected.push(item) : newSelected);
            this.setState({
              campaignListProgress: false,
              campaignList: this.props.campaign.campaignList,
              selectedCampaign: newSelected,
            });
          });
      }
    );
  };

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
          if (data && data.reportCode === "enrollmentSummary") {
            this.getCampaignList();
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
        //this.setState({selectedPaymentParameters: [...selectedPaymentParameters, value ]});
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

  handleDownload = (item) => {
    const {
      startDate,
      selectedCampaign,
      selectedClient,
      clientList,
    } = this.state;

    const { t } = this.props;
    const { portalProfileId } = this.props.user.userData;
    const fromDate = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    let valid = {};    

    if (item && item.reportCode === "enrollmentSummary") {
      if (
        !selectedCampaign ||
        (selectedCampaign && selectedCampaign.length === 0)
      ) {
        valid["campaign"] = t('componentData.reportsView.selectCampaign');
      }

      if (clientList.length > 0) {
        if (!selectedClient || (selectedClient && selectedClient.length === 0)) {
          valid["client"] = t('componentData.reportsView.BusinessUnitErr');
        }
      }
      if (
        (selectedCampaign && selectedCampaign.length === 0) ||
        (selectedClient && selectedClient.length === 0)
      ) {
        this.setState({ validation: { ...valid } });
        return false;
      }
    } else {
      if (!startDate) {
        valid["startDate"] = t('componentData.reportsView.selectDate');
      }

      if (item.reportCode === "FailedRemittanceDeliveryReport") {
        if (!startDate) {
          this.setState({ validation: { ...valid } });
          return false;
        }
      } else {        
        if (clientList.length > 0) {
          if (
            !selectedClient ||
            (selectedClient && selectedClient.length === 0)
          ) {
            valid["client"] = t('componentData.reportsView.BusinessUnitErr');
            this.setState({ validation: { ...valid } });
            return false;
          }
        }
        if (!startDate) {
          this.setState({ validation: { ...valid } });
          return false;
        }
      }
    }

    this.setState(
      {
        downloadProgress: true,
        validation: {},
      },
      () => {
        let filename = null;
        
        if (selectedClient.length > 0 && selectedClient.toLocaleLowerCase() === 'none') {
          filename = item.reportCode.charAt(0).toUpperCase() + item.reportCode.slice(1) + "_" + (fromDate ? fromDate : "") + ".csv";
        }
        else {
          if(selectedClient.length > 0){
            filename = item.reportCode.charAt(0).toUpperCase() + item.reportCode.slice(1) + "_" + selectedClient + "_" + (fromDate ? fromDate : "") + ".csv";
          }
          else{
            filename = item.reportCode.charAt(0).toUpperCase() + item.reportCode.slice(1) + "_" + (fromDate ? fromDate : "") + ".csv";
          }          
        }

        let clientName = null; 
        if(clientList.length > 0 && Boolean(selectedClient)){
          clientName = selectedClient
        } 

        if (item.reportCode === "dailyEnrollmentB2C") {  
          this.props.dispatch(downloadDailyEnrollment(fromDate, clientName)).then((response) => {
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
        else if (item.reportCode === 'emailRejectionB2C') {
          this.props.dispatch(emailRejectionFile(fromDate, clientName)).then((response) => {
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
        else if (item.reportCode === 'SMSRejectionB2C') {
          this.props.dispatch(SMSRejectionFile(fromDate, clientName)).then((response) => {
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
        else if (item.reportCode === 'DailyPaymentStatusReport' || item.reportCode === 'DefaultPaymentReport') {
          this.props.dispatch(B2CPaymentReconciliation(fromDate, clientName, portalProfileId, item.reportCode)).then((response) => {
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
      }
    );
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
      selectedClient,
      clientList,
      alertMessage,
      alertMessageCallbackType,
      selectedCampaign,
      campaignList,
      downloadProgress,
      isSubscriber,
      data,
      showFilter,
      filterList,
      selectedDateFilter,
      startDate,
      endDate,
      filterListProgress,
      validation,
    } = this.state;
    const { classes, user, t, i18n } = this.props;

    const bankParentProfileId = user?.userData?.activeBankParentProfileId; //Bank user

    const isReportDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["REPORTS_DOWNLOAD"])) ||
      false;
    const isReportSubscribeEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["REPORTS_SUBSCRIBE"])) ||
      false;

    const canSubscribe =
      data && data.reportCode === "enrollmentSummary" ? false : true;

    const showClientList =
      data &&
        (data.reportCode === "FailedRemittanceDeliveryReport")
        ? false
        : true;

    const reportName = data.reportName && data.reportName.trim();
    const dataType = data.dataType && data.dataType.trim();
    const frequency = data.frequency && data.frequency.trim();    

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
                    {isReportSubscribeEnabled && canSubscribe ? (<Grid item xs={12} sm={12} className={classes.gridItem}>
                      <Box
                        pt={1}
                        display="flex"
                        justifyContent="flex-start"
                        flexDirection="column"
                      >
                        <Box pl={2}>
                          <Typography variant="h2">{t('componentData.reportsView.ReportFrequency')}</Typography>
                        </Box>
                        <Box pl={3}>{data.frequency ? t(`componentData.reportsView.${frequency}`) : ""}</Box>
                      </Box>
                    </Grid>): null}
                    {isReportSubscribeEnabled && (
                      <Grid item xs={12} sm={12} className={classes.gridItem}>
                        <Box display="flex" width="100%" flexDirection="column">
                          {canSubscribe && (
                            <Box
                              p={1}
                              display="flex"
                              justifyContent="flex-start"
                            >
                              <IconButton
                                color="primary"
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
                                disabled={bankParentProfileId==1? true:false}
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
                                  title={t('componentData.reportsView.loggedInUser')}
                                  placement="right"
                                >
                                  <InfoIcon />
                                </Tooltip>
                              </Box>
                            </Box>
                          )}
                          {/* {0 == 1 && (
                            <Box
                              p={1}
                              display="flex"
                              justifyContent="flex-start"
                              width="300px"
                            >
                              <TextField
                                label= {t('componentData.reportsView.EmailSubscriptionFrequency')}
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
                          )} */}
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
                  {canSubscribe && (
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[i18n.language]}>
                      <Box pr={3} display="flex">
                        <Box p={1} style={{ width: "100%" }}>
                          <KeyboardDatePicker
                            autoOk={true}
                            clearable={true}
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="startDate"
                            name="startDate"
                            label={t('componentData.reportsView.SelectReportDate')}
                            value={startDate}
                            maxDate={moment().subtract(1, "days")}
                            error={validation && validation.startDate}
                            helperText={validation && validation.startDate}
                            onChange={(date) => {
                              this.setState({
                                startDate: date
                              }, () => {
                                this.hasDataSelected();
                              });
                            }}
                            KeyboardButtonProps={{
                              "aria-label": "Start Date",
                            }}
                            fullWidth={true}
                            InputProps={{ readOnly: true }}
                          />
                        </Box>
                      </Box>
                    </MuiPickersUtilsProvider>
                  )}
                  {showClientList && (
                    <Box pr={3} display="flex">
                      <FormControl className={classes.formControl}>
                        <InputLabel id="client">{t('componentData.reportsView.BusinessUnit')}</InputLabel>
                        <Select
                          // multiple
                          required
                          id="client"
                          label={t('componentData.reportsView.BusinessUnit')}
                          className={classes.maxwidthInput}
                          input={<Input />}
                          error={(validation && validation.client) || ""}
                          helperText={(validation && validation.client) || ""}
                          fullWidth={true}
                          value={selectedClient || []}
                          autoComplete="off"
                          variant="selectedMenu"
                          name="client"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                overflow: "auto",
                                width: "400px",
                              },
                            },
                          }}
                          onChange={(event) =>
                            this.handleChange("client", event)
                          }

                        // renderValue={(selected) => {
                        //   if (selected.length === 1) {
                        //     const selectedRole =
                        //       clientList &&
                        //       clientList.filter(
                        //         (client) => client.businessUnit == selected[0]
                        //       );

                        //     let clienName = "";
                        //     if (
                        //       clientList.length &&
                        //       selectedRole.length &&
                        //       selectedRole[0].businessUnit
                        //     ) {
                        //       clienName = selectedRole[0].businessUnit;
                        //     }

                        //     return (
                        //       <em className={classes.locations}>
                        //         {clienName}
                        //       </em>
                        //     );
                        //   }

                        //   return `${t('componentData.reportsView.Multiple')} (${selected.length} ${t('componentData.reportsView.Clients')})`;
                        // }}
                        >
                          {clientList ? (
                            clientList.map((option) => (
                              <MenuItem
                                key={option.businessUnit}
                                value={option.businessUnit}
                              >
                                {/* <Checkbox
                                  checked={
                                    selectedClient.indexOf(option.businessUnit) > -1
                                  }
                                /> */}
                                <ListItemText
                                  primary={option.businessUnit}
                                />
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
                        </Select>
                        <FormHelperText style={{ color: "red" }}>
                          {(validation && validation.client) || ""}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}

                  {data && data.reportCode === "enrollmentSummary" && (
                    <Box pr={3} display="flex">
                      <FormControl className={classes.formControl}>
                        <InputLabel id="campaign">{t('componentData.reportsView.SelectCampaign')}</InputLabel>
                        <Select
                          multiple
                          required
                          id="campaign"
                          label={t('componentData.reportsView.SelectCampaign')}
                          className={classes.maxwidthInput}
                          input={<Input />}
                          error={validation && validation.campaign}
                          helperText={validation && validation.campaign}
                          fullWidth={true}
                          value={selectedCampaign || []}
                          autoComplete="off"
                          MenuProps={{
                            PaperProps: {
                              style: {
                                overflow: "auto",
                                width: "400px",
                              },
                            },
                          }}
                          variant="selectedMenu"
                          name="campaign"
                          onChange={(event) =>
                            this.handleChange("campaign", event)
                          }
                          renderValue={(selected) => {
                            if (selected.length === 1) {
                              const selectedRole =
                                campaignList &&
                                campaignList.filter(
                                  (campaigns) =>
                                    campaigns.campaignId == selected[0]
                                );
                              return (
                                <em className={classes.locations}>
                                  {(campaignList.length &&
                                    selectedRole.length &&
                                    selectedRole[0].campaignName) ||
                                    ""}
                                </em>
                              );
                            }

                            return `${t('componentData.reportsView.Multiple')} (${selected.length} ${t('componentData.reportsView.Campaigns')})`;
                          }}
                        >
                          {campaignList ? (
                            campaignList.map((option) => (
                              <MenuItem
                                key={option.campaignId}
                                value={option.campaignId}
                              >
                                <Checkbox
                                  checked={
                                    selectedCampaign.indexOf(
                                      option.campaignId
                                    ) > -1
                                  }
                                />
                                <ListItemText primary={option.campaignName} />
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
                        </Select>
                        <FormHelperText style={{ color: "red" }}>
                          {(validation && validation.campaign) || ""}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                  {/*<Box p={1} display="flex" justifyContent="flex-start" flexDirection="row">
                                    <Box>
                                        <EventIcon size="medium" />
                                    </Box>
                                    <Box p={1}>
                                        <Typography variant='h3' >
                                            {filterName}
                                        </Typography>
                                     </Box>
                                </Box>
                                <Box p={1}>
                                    <Button
                                      color="primary"
                                      aria-label="View"
                                      title="View Filter"
                                      component="span"
                                      className={classes.smallBtn}
                                      onClick={() => {
                                        this.setState({
                                            showFilter: true,
                                        });
                                      }}
                                    >
                                      <img
                                        src={require(`~/assets/icons/icon_filter.svg`)}
                                        alt={"View Filter"}
                                        className={classes.smallIcon}
                                      />
                                      <Typography variant="h6" className={classes.iconText}>
                                        Filters
                                      </Typography>
                                    </Button>
                                </Box>
                             */}
                </Box>
              </Grid>

              <Grid
                item
                container
                xs={12}
                sm={12}
                className={classes.gridItem}
                justify="center"
              >
                {isReportDownloadEnabled && (
                  <Box
                    display="flex"
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
                    {downloadProgress ? (
                      <CircularProgress color="primary" />
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
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <ReportsFilter
          open={showFilter}
          handleClose={() => this.hideFilter()}
          headerText={t('componentData.reportsView.DateFilter')}
          icon={<EventIcon size="medium" />}
        >
          <DateFilter
            filterList={filterList}
            selectedDateFilter={selectedDateFilter}
            startDate={startDate}
            endDate={endDate}
            handleChange={this.handleChange}
            resetFilter={this.resetFilter}
            applyFilter={this.applyFilter}
            handleDateChange={this.handleDateChange}
            validation={validation}
            processing={filterListProgress}
          />
        </ReportsFilter>
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
  ...state.report,
  ...state.campaign,
}))(withStyles(styles)(B2CReportView)));
