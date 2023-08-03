import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  FormControl,
  Box,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import { AlertDialog } from "~/components/Dialogs";
import { Autocomplete } from "@material-ui/lab";
import { connect } from "react-redux";
import styles from "./styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { withStyles } from "@material-ui/styles";
import {
  getCampaignList,
  getPayeeList,
  downloadPayeeAuditReport,
} from "~/redux/actions/reports";
import config from "~/config";
import moment from "moment";
import _ from "lodash";
import * as FileSaver from "file-saver";
import { withTranslation } from 'react-i18next';

class PayeeAuditReport extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      payeeList: [],
      campaignList: [],
      selectedCampaign: "",
      selectedPayee: [],
      startDate: null,
      endDate: null,
      validation: {},
      downloadProgress: false,
      open: false,
      disabledPayee: true,
      alertMessage: "",
      alertType: "",
      isValidReport: (state && state.isValidReport) || false,
    };
    this.fetchPayeeList = _.debounce(this.fetchPayeeList, 1000);
  }

  componentDidMount = async () => {
    this.fetchCampaignList();
  };

  downloadPayeeAuditReport = () => {
    const { selectedCampaign, selectedPayee, startDate, endDate } = this.state;
    const { userData } = this.props.user;
    const fromDate = startDate ? moment(startDate).format("YYYY-MM-DD") : "";
    const toDate = endDate ? moment(endDate).format("YYYY-MM-DD") : "";
    const todayDate = moment().format("YYYY-MM-DD");
    const selectedPayeeIds = selectedPayee?.map((payee) => payee.payeeId) || [];
    this.setState(
      {
        downloadProgress: true,
        validation: {},
      },
      () => {
        const filename =
          "Campaign_Audit_Report_" +
          todayDate +
          ".csv";
        this.props
          .dispatch(
            downloadPayeeAuditReport({
              clientIds: userData?.portalProfileId,
              campaignIds: selectedCampaign?.campaignId || null,
              payeeId: selectedPayeeIds && selectedPayeeIds.length !== 0 ? selectedPayeeIds : undefined,
              startDate: fromDate,
              endDate: toDate,
            })
          )
          .then((response) => {
            if (!response || (response && response.error)) {
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
    );
  };

  fetchPayeeList = (value) => {
    const { userData } = this.props.user;
    const { selectedCampaign } = this.state;
    this.props
      .dispatch(
        getPayeeList({
          clientIds: userData?.portalProfileId,
          campaignIds: selectedCampaign?.campaignId || "",
          companyName: value,
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertMessage: this.props.report.error,
            alertType: "error",
            alertMessageCallbackType: null,
          });
          return false;
        }
        this.setState({
          payeeList: this.props.report.payeeList,
        });
      });
  };

  fetchCampaignList = () => {
    const { userData } = this.props.user;
    this.setState(
      {
        campaignListProgress: true,
      },
      () => {
        this.props
          .dispatch(
            getCampaignList({
              selectedClient: [userData.portalProfileId],
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.report.error,
                campaignListProgress: false,
              });
              return false;
            }

            this.setState({
              campaignListProgress: false,
              campaignList: this.props.report.campaignList,
            });
          });
      }
    );
  };

  handlePayeeChange = (event) => {
    const { value: payees } = event.target;
    this.setState({ selectedPayee: [payees] });
  };

  handleCancel = () => {
    this.props.history.push(`${config.baseName}/reports`);
  };

  validateForm = () => {
    const {t} = this.props
    const { startDate, endDate, selectedCampaign, campaignList } = this.state;
    const fromDate = startDate ? moment(startDate).format("YYYY-MM-DD") : null;
    const toDate = endDate ? moment(endDate).format("YYYY-MM-DD") : null;
    let valid = true;
    let validation = {};
    
    if (!selectedCampaign) {
      validation["campaign"] = t('componentData.payeeAuditReport.campReq');
      valid = false;
    }

    if (campaignList.length === 0) {
      validation["campaign"] = t('componentData.payeeAuditReport.noCampReq');
      valid = false;
    }

    if (!fromDate && toDate) {
      validation["startDate"] = t('componentData.payeeAuditReport.startingDate');
      valid = false;
    }

    if (fromDate && !toDate) {
      validation["endDate"] = t('componentData.payeeAuditReport.endingDate');
      valid = false;
    }

    if (this.getFormattedDate(fromDate) > this.getFormattedDate(toDate)) {
      validation["dateRange"] = t('componentData.payeeAuditReport.endingDateGreater');
      valid = false;
    }

    this.setState({ validation: { ...validation } });
    return valid;
  };

  handleDownload = () => {
    const isValid = this.validateForm();

    if (isValid) {
      this.downloadPayeeAuditReport();
    }
  };

  handlePayeeDisable() {
    const { selectedCampaign } = this.state;

    if (selectedCampaign) {
      this.setState({ disabledPayee: false });
    } else {
      this.setState({ disabledPayee: true });
    }
  }

  handlePayeeChange = (event) => {
    if (event.target.value.length >= 1) {
      this.fetchPayeeList(event.target.value);
    } else {
      this.setState({ payeeList: [] });
    }
  };

  getFormattedDate = (dateVal) => {
    if (dateVal) {
      return moment(dateVal).format("YYYY-MM-DD");
    }
    return null;
  };

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

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  onCampaignChange = (event, value) => {
    if (value) {
      this.setState(
        {
          selectedCampaign: value,
        },
        () => {
          this.handlePayeeDisable();
        }
      );
    } else {
      this.setState(
        {
          selectedCampaign: "",
          selectedPayee: [],
          payeeList: [],
        },
        () => {
          this.handlePayeeDisable();
        }
      );
    }
  };

  onClientChange = (event, value) => {
    if (value) {
      this.setState(
        {
          selectedCampaign: "",
          payeeList: [],
          selectedPayee: [],
        },
        () => {
          this.fetchCampaignList();
          this.handlePayeeDisable();
        }
      );
    } else {
      this.setState(
        {
          selectedCampaign: "",
          campaignList: [],
          payeeList: [],
          selectedPayee: [],
        },
        () => {
          this.handlePayeeDisable();
        }
      );
    }
  };

  onPayeeChange = (event, value) => {
    if (value) {
      this.setState({ selectedPayee: value });
    }
  };

  render() {
    const {
      alertMessage,
      alertMessageCallbackType,
      selectedCampaign,
      selectedPayee,
      campaignList,
      payeeList,
      startDate,
      endDate,
      validation,
      downloadProgress,
      open,
      disabledPayee,
      isValidReport
    } = this.state;
    const { t } = this.props;
    const { classes } = this.props;
    const { userData } = this.props.user;
    if (!isValidReport) {
      this.props.history.push({
        pathname: `${config.baseName}/reports/`,
      });
      return false;
    }
    return (
      <>
        <Paper className={classes.paperContainer}>
          <Grid container className={classes.gridContainer} direction="column">
            <Grid>
              <Typography variant="h1" className={classes.reportHeading}>
              {t('componentData.payeeAuditReport.reportDetails')}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h4" className={classes.reportHeading}>
              {t('componentData.payeeAuditReport.campaignAuditReport')}
              </Typography>
            </Grid>
          </Grid>
          <hr style={{ margin: "0 -20px" }} />
          <Grid container className={classes.gridContainer} direction="column">
            <Grid>
              <Typography variant="h1" className={classes.parameterHeading}>
              {t('componentData.payeeAuditReport.reportParameters')}
              </Typography>
            </Grid>
            <Grid xs={4} className={classes.gridMargin}>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <Autocomplete
                  id="campaign"
                  value={selectedCampaign || ""}
                  noOptionsText={
                    userData.portalProfileId
                      ? t('componentData.payeeAuditReport.noCampaign')
                      : t('componentData.payeeAuditReport.selectCampaign')
                  }
                  options={campaignList || []}
                  getOptionLabel={(option) => option.campaignName}
                  onChange={(event, value) => {
                    this.onCampaignChange(event, value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={validation && validation.campaign}
                      helperText={validation && validation.campaign}
                      label={t('componentData.payeeAuditReport.campaign')}
                      variant="outlined"
                      value={
                        (selectedCampaign && selectedCampaign?.campaignName) ||
                        ""
                      }
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid xs={4} style={{ marginBottom: "27px" }}>
              <FormControl variant="outlined" style={{ width: "100%" }}>
                <Autocomplete
                  multiple
                  noOptionsText={selectedPayee.length === 0 || ""}
                  id="suppliers-payees"
                  open={open}
                  disabled={disabledPayee}
                  onOpen={() => {
                    this.setState({ open: true });
                  }}
                  onClose={() => {
                    this.setState({ open: false });
                  }}
                  getOptionSelected={(option, value) =>
                    option.companyName === value.companyName
                  }
                  getOptionLabel={(option) => option.companyName}
                  options={payeeList}
                  onChange={(event, value) => {
                    this.onPayeeChange(event, value);
                  }}
                  value={selectedPayee || []}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('componentData.payeeAuditReport.payee')}
                      variant="outlined"
                      onChange={(event) => this.handlePayeeChange(event)}
                      value={selectedPayee || []}
                    />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid
              container
              xs={4}
              className={classes.gridMargin}
              justify="space-between"
              direction="row"
            >
              <Grid xs={6} style={{ flexBasis: "auto" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    autoOk={true}
                    clearable={true}
                    views={["year", "month", "date"]}
                    disableToolbar
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="startDate"
                    name="startDate"
                    label={t('componentData.payeeAuditReport.startDate')}
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
                    KeyboardButtonProps={{
                      "aria-label": "Start Date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
              <Grid xs={6} style={{ flexBasis: "auto" }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                    label={t('componentData.payeeAuditReport.endDate')}
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
                    KeyboardButtonProps={{
                      "aria-label": "Start Date",
                    }}
                  />
                </MuiPickersUtilsProvider>
              </Grid>
            </Grid>
            <Grid xs={4}>
              <Box className={classes.dateCaption}>
                <Typography variant="caption">
                  <em>
                    <strong>
                    {t('componentData.payeeAuditReport.statusDate')}
                    </strong>
                  </em>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Grid
          container
          display="flex"
          justify="center"
          className={classes.buttonGrid}
        >
          <Button
            variant="outlined"
            color="primary"
            className={classes.cancelButton}
            onClick={() => this.handleCancel()}
          >
            {t('componentData.payeeAuditReport.cancel')}
          </Button>
          {downloadProgress ? (
            <CircularProgress color="primary" />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => this.handleDownload()}
            >
              {t('componentData.payeeAuditReport.download')}
            </Button>
          )}
        </Grid>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </>
    );
  }
}

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.report,
  ...state.campaign,
}))(withStyles(styles)(PayeeAuditReport)));
