import React, { Component, Fragment } from "react";
import {
  TextField,
  InputAdornment,
  Grid,
  Paper,
  Box,
  Button,
  CircularProgress,
  Table,
  TableRow,
  TableBody,
  TablePagination,
  TableCell,
  TableSortLabel,
  Checkbox,
  MenuItem,
  Menu,
  ListItemIcon,
  IconButton,
  Typography,
  Backdrop,
} from "@material-ui/core";
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledTableFooter,
} from "~/components/StyledTable";
import { withStyles } from "@material-ui/styles";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EventIcon from "@material-ui/icons/Event";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import GetAppIcon from "@material-ui/icons/GetApp";
import SearchIcon from "@material-ui/icons/Search";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  removeReport,
  getReportList,
  fetchReportFilter,
  downloadDynamicReport,
  deleteDynamicReport,
  getReportDetailsFromList,
  downloadPaymentDynamicReport,
} from "~/redux/actions/reports";
import Notification from "~/components/Notification";
import ReportsFilter from "~/components/Dialogs/reports/";
import DateFilter from "~/modules/Reports/DateFilter/";
import { ConfirmDialog, AlertDialog } from "~/components/Dialogs";
import "./styles.scss";
import config from "~/config";
import styles from "./styles";
import { accessRights } from "~/config/accessRights";
import * as FileSaver from "file-saver";
import { getDateRange } from "../utils";
import { entityType } from "~/config/entityTypes";

class ReportListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      fetchingList: true,
      page: 0,
      rowsPerPage: 10,
      sortColumn: "reportName",
      sortOrder: "asc",
      name: "",
      roleList: [], //System Role list
      alertType: "success",
      alertMessage: "",
      alertMessageCallbackType: null,
      showConfirmRemoveDialog: false,
      removeReportId: null,
      showDetail: false,
      list: [],
      selectedReports: [],
      validation: {},
      listOptions: [
        { icon: <GetAppIcon fontSize="small" />, text: "Download" },
        { icon: <EditOutlinedIcon fontSize="small" />, text: "Edit" },
        { icon: <DeleteOutlineIcon fontSize="small" />, text: "Delete" },
      ],
      anchorEls: null,
      selectedReport: null,
      showFilter: false,
      filterList: [],
      dateFilter: null,
      startDate: null,
      endDate: null,
      filterListProgress: false,
      downloadProgress: false,
    };
  }

  componentDidMount = async () => {
    this.fetchReportList();
    this.getFilterList();
  };

  handlePageChange = (event, page) => {
    const { sortColumn, sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    this.setState(
      {
        page,
        sortColumn: sortColumn,
        sortOrder: newSortOrder,
      },
      () => this.fetchReportList()
    );
  };

  handleRowsPerPageChange = (event) => {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    this.setState(
      {
        page: 0,
        rowsPerPage: parseInt(event.target.value, 10),
        sortOrder: newSortOrder,
      },
      () => this.fetchReportList()
    );
  };

  handleSorting(sortColumn) {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    this.setState({ sortColumn: sortColumn, sortOrder: newSortOrder }, () => {
      this.fetchReportList();
    });
  }

  fetchReportList = () => {
    const {
      name,
      dateFilter,
      startDate,
      endDate,
      page,
      rowsPerPage,
      sortColumn,
      sortOrder,
    } = this.state;

    this.setState(
      {
        fetchingList: true,
      },
      () => {
        const { userData } = this.props.user;

        this.props
          .dispatch(
            getReportList({
              portalProfileId: userData.portalProfileId,
              portalTypeId: userData.portalTypeId,
              name,
              dateFilter,
              startDate,
              endDate,
              page,
              rowsPerPage,
              sortColumn,
              sortOrder,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.report.error,
                fetchingList: false,
                isLoading: false,
              });
              return false;
            }

            this.setState({
              isLoading: false,
              fetchingList: false,
              list: this.props.report.list,
            });
          });
      }
    );
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
  };

  resetFilter = () => {
    this.setState(
      {
        dateFilter: null,
        startDate: null,
        endDate: null,
      });
  };

  applyFilter = () => {
    this.setState(
      {
        showFilter: false,
      });
  };

  hideFilter = () => {
    this.setState({
      showFilter: false,
      dateFilter: null,
      startDate: null,
      endDate: null,
    });
  };

  handleFormPageChange = (pageNo) => {
    this.setState({ formPageNo: pageNo });
  };

  handleDelete = (e) => {
    e.stopPropagation();
    const { selectedReports } = this.state;
    const { t } = this.props;
    if (selectedReports.length > 0) {
      this.setState({
        showConfirmRemoveDialog: true,
        removeReportId: selectedReports,
      });
    } else {
      this.setState({
        alertType: "info",
        alertMessage: t("componentData.listView.selectReport"),
      });
    }
  };

  onConfirmDelete = () => {
    const { t } = this.props;
    if (this.state.selectedReport && !this.state.selectedReport.isDynamic) {
      const { removeReportId, selectedReports } = this.state;
      const selectedConfirmReport = removeReportId
        ? [removeReportId]
        : [...selectedReports];
      this.setState(
        {
          showConfirmRemoveDialog: false,
          removeReportId: null,
        },
        () => {
          const { userData } = this.props.user;
          const { t } = this.props;
          this.props
            .dispatch(
              removeReport({
                reportIds: selectedConfirmReport,
                username: userData.userName,
              })
            )
            .then((response) => {
              //set state here on success
              if (!response) {
                this.setState({
                  alertType: "error",
                  alertMessageCallbackType: null,
                  alertMessage: this.props.report.error,
                });
                return false;
              }

              this.setState({
                selectedReports: [],
                removeReportId: null,
                alertType: "success",
                alertMessage: t("componentData.listView.reportDeleted"),
              });
            });
        }
      );
    } else {
      const { removeReportId } = this.state;
      this.setState(
        {
          showConfirmRemoveDialog: false,
        },
        () => {
          this.props
            .dispatch(deleteDynamicReport(removeReportId))
            .then((res) => {
              if (!res) {
                this.setState({
                  alertType: "error",
                  alertMessageCallbackType: null,
                  alertMessage: this.props.report.deleteDynamicReportStatus,
                });
                return false;
              }
              const currentSelectedReports = this.state.selectedReports.filter(
                (item) => removeReportId.indexOf(item) === -1
              );
              this.setState({
                selectedReports: currentSelectedReports ?? [],
                selectedReport: null,
                removeReportId: null,
                anchorEls: null,
                alertType: "success",
                alertMessage: t("componentData.listView.reportDeleted"),
              });
              this.fetchReportList();
            });
        }
      );
    }
  };

  isSuperAdmin = (item) => {
    const { roleList } = this.state;
    const currentRoles = item.roles.map((user) => user.roleId);
    const selectedRoles = roleList
      ? roleList.filter((role) => {
          const flag =
            currentRoles.length > 0 &&
            currentRoles.indexOf(role.roleId) !== -1 &&
            role.roleName === "System Admin";
          if (flag) {
            return true;
          }
        })
      : [];

    return selectedRoles.length > 0 ? true : false;
  };

  onCancelDelete = () => {
    this.setState({
      showConfirmRemoveDialog: false,
      removeReportId: null,
    });
  };

  handleSelectAllClick = (event) => {
    const { list } = this.props.report;
    if (event.target.checked) {
      const newSelecteds = list
        .filter((x) => x.isDynamic)
        .map((n) => n.clientReportId);
      this.setState({ selectedReports: newSelecteds });
    } else {
      this.setState({ selectedReports: [] });
    }
  };

  handleClick = (item) => {
    const { selectedReports } = this.state;
    const currentSelectedReports = [...this.state.selectedReports];
    const selectedIndex = selectedReports.indexOf(item.clientReportId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedReports, item.clientReportId);
    } else {
      currentSelectedReports.splice(selectedIndex, 1);
      newSelected = currentSelectedReports;
    }
    this.setState({ selectedReports: newSelected });
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

  handleChangeDataType = (event) => {
    const reportType = event.target.value;
    this.setState(
      {
        reportType: reportType,
        selectedPaymentParameters: [],
      },
      () => {
        this.fetchPaymentParameterList();
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
    const { selectedPaymentParameters } = this.state;
    switch (field) {
      case "name":
        const reportName = event.target.value;
        this.setState({ name: reportName });
        break;
      case "dateFilter":
        this.setState({ dateFilter: value });
        break;
      case "paymentParameter":
        if (position) {
          this.setState({
            selectedPaymentParameters: [...selectedPaymentParameters, value],
          });
        } else {
          const newSelectedPaymentParameters =
            selectedPaymentParameters &&
            selectedPaymentParameters.filter((item, index) => item !== value);
          this.setState({
            selectedPaymentParameters: [...newSelectedPaymentParameters],
          });
        }
        break;
      default:
        break;
    }
  };

  handleSearch = (event) => {
    if (event.keyCode === 13) {
      this.setState(
        {
          page: 0,
        },
        () => {
          this.fetchReportList();
        }
      );
    }
  };

  handleOption = (event, item) => {
    const selectedEl = {
      [item.clientReportId]: event.target,
    };
    this.props.dispatch(getReportDetailsFromList(item));
    this.setState({ anchorEls: selectedEl });
  };

  handleOptionClose = (event, item) => {
    this.setState({ anchorEls: null });
  };

  handleOptionClick = (event, item, selectedOption) => {
    const { user } = this.props;
    const appType = user.userData.appType
      ? parseInt(user.userData.appType)
      : entityType.B2B;
    if (selectedOption.text === "Download") {
      this.setState({ downloadProgress: true });
      const { t } = this.props;
      const downloadData = {
        clientId: item.clientId,
        clientReportId: item.clientReportId,
        selectedParameters: [],
        dataTypeId: item.dataTypeId,
      };
      if (item.dateFilter === "CUSTOM") {
        downloadData.fromDate = item.fromDate;
        downloadData.toDate = item.toDate;
      } else {
        const dates = getDateRange(item.dateFilter);
        downloadData.fromDate = dates.fromDate;
        downloadData.toDate = dates.toDate;
      }
      item.ClientParameters.forEach((param) => {
        downloadData.selectedParameters.push(param.dataTypeMappingId);
      });
      const fileName = item.reportName + ".xlsx";
      if (item.dataTypeId !== 1) {
        this.props
          .dispatch(downloadDynamicReport(appType, downloadData))
          .then(async (response) => {
            if (!response || (response && response.error)) {
              this.setState({
                alertType: "error",
                downloadProgress: false,
                alertMessageCallbackType: null,
                alertMessage: response?.message || t(`componentData.reduxData.tryAgain`),
              });
              return false;
            }
            if(response.data){
              const type = response.headers["content-type"];
              const data = new Blob([response.data], {
                type: type,
                encoding: "UTF-8",
              });
              FileSaver.saveAs(data, fileName);
              this.handleOptionClose(event, item);
              this.setState({
                alertMessage: null,
                downloadProgress: false,
              });
            } else {
              this.setState({
                alertType: "error",
                downloadProgress: false,
                alertMessageCallbackType: null,
                alertMessage:  t(`componentData.reduxData.tryAgain`),
              });
            }
          })
          .catch((error) => {
            this.setState({
              alertType: "error",
              downloadProgress: false,
              alertMessageCallbackType: null,
              alertMessage: t(`componentData.reduxData.ErrorOccurred`),
            });
          });
      } else {
        const reportDownloadData = {
          fromDate: downloadData.fromDate,
          toDate: downloadData.toDate,
          clientId: item.clientId,
          isBankReport: 0,
          tokenString: downloadData.selectedParameters.join(","),
          datatypeid: 1,
          BusinessType: appType,
        };
        this.props
          .dispatch(downloadPaymentDynamicReport(reportDownloadData))
          .then(async (response) => {
            if (!response || (response && response.error)) {
              this.setState({
                alertType: "error",
                downloadProgress: false,
                alertMessageCallbackType: null,
                alertMessage: response?.message || t(`componentData.reduxData.tryAgain`),
              });
              return false;
            }
            if(response.data){
              const type = response.headers['content-type'];
              const data = new Blob([response.data], {
                type: type,
                encoding: 'UTF-8',
              });
              FileSaver.saveAs(data, fileName);
              this.setState({
                alertMessage: null,
                downloadProgress: false,
              });
            } else {
              this.setState({
                alertType: "error",
                downloadProgress: false,
                alertMessageCallbackType: null,
                alertMessage:  t(`componentData.reduxData.tryAgain`),
              });
              return false;
            }
          })
          .catch((error) => {
            this.setState({
              alertType: "error",
              downloadProgress: false,
              alertMessageCallbackType: null,
              alertMessage: error ?? t(
                `componentData.reduxData.ErrorOccurred`
              ),
            });
            return false;
          });
      }
    } else if (selectedOption.text === "Delete") {
      this.setState({
        showConfirmRemoveDialog: true,
        removeReportId: item.clientReportId ? [item.clientReportId] : [],
        selectedReport: item,
        anchorEls: null,
      });
    } else if (selectedOption.text === "Edit") {
      this.props.history.push({
        pathname: `${config.baseName}/reports/edit`,
        state: {
          ...this.props.location.state,
          selectedReportDetails: this.props.report.selectedReportDetails,
          anchorEls: null,
        },
      });
    }
  };

  showReport = (e, item) => {
    e.preventDefault();
    if (!item.isDynamic) {
      if (item.reportCode === "EnrolmentJourneyReport") {
        this.props.history.push({
            pathname: `${config.baseName}/reports/view/payeeauditreport`,
            state: {isValidReport: true}
        })
    } else {
      this.props.history.push({
        pathname: `${config.baseName}/reports/view`,
        state: {
          ...this.props.location.state,
          report: item,
        },
      })};
    }
  };

  renderOptionsMenu = (item) => {
    const { t, user } = this.props;
    const { listOptions, anchorEls } = this.state;
    const bankParentProfileId = user?.userData?.activeBankParentProfileId;

    return (
      <Menu
        id={item.userId}
        keepMounted
        anchorEl={anchorEls[item.clientReportId]}
        open={Boolean(anchorEls[item.clientReportId])}
        onClose={(e) => this.handleOptionClose(e, item)}
      >
        {listOptions
          .filter((item) => {
            if (item.text === "Delete" && bankParentProfileId == 1) {
              return false;
            }
            return true;
          })
          .map((option) => {
            if (
              user.userRoles &&
              user.userRoles.includes(
                accessRights[`DYNAMIC_REPORTS_${option.text.toUpperCase()}`]
              )
            ) {
              return (
                <MenuItem
                  key={t(`componentData.listView.${option.text}`)}
                  onClick={(e) => this.handleOptionClick(e, item, option)}
                >
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <Typography variant="inherit">
                    {t(`componentData.listView.${option.text}`)}
                  </Typography>
                </MenuItem>
              );
            } else {
              return null;
            }
          })}
      </Menu>
    );
  };

  render() {
    const {
      alertMessage,
      validation,
      filterList,
      selectedReports,
      showDetail,
      dateFilter,
      filterListProgress,
      startDate,
      endDate,
      showFilter,
      showConfirmRemoveDialog,
      alertMessageCallbackType,
      isLoading,
      fetchingList,
      anchorEls,
      page,
      rowsPerPage,
      sortColumn,
      sortOrder,
      downloadProgress,
    } = this.state;
    const { classes } = this.props;
    const { user, report } = this.props;
    const { t } = this.props;
    const isReportEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["DYNAMIC_REPORTS_EDIT"])) ||
      false;
    const isReportDeleteEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["DYNAMIC_REPORTS_DOWNLOAD"])) ||
      false;
    const isReportDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["DYNAMIC_REPORTS_DOWNLOAD"])) ||
      false;
    const isReportBuilderEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["DYNAMIC_REPORTS_ADD"])) ||
      false;

    //Check bank user
    const bankParentProfileId = user?.userData?.activeBankParentProfileId;

    if (isLoading) {
      return (
        <Box display="flex" p={10} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    const dynamicReportsCount = this.props.report.list.filter(
      (x) => x.isDynamic
    ).length;
    return (
      <Fragment>
        <Backdrop className={classes.backdrop} open={downloadProgress || false}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Box mx={2} my={2}>
          <Grid container xs={showDetail ? 8 : 12} className={classes.root}>
            <Grid container item xs={11} md={11} justify="flex-end">
              {bankParentProfileId != 1 && isReportBuilderEnabled ? (
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.mediumBtn}
                    startIcon={<AddOutlinedIcon />}
                    onClick={() =>
                      this.props.history.push(`${config.baseName}/reports/add`)
                    }
                  >
                    {t("componentData.listView.buildNewRepeort")}
                  </Button>
                </Grid>
              ) : null}
            </Grid>
            <Paper className={classes.paper}>
              <Grid container item xs={12} md={12} className={classes.gtidItem}>
                <Box display="flex" width="100%" p={1}>
                  <Box p={1} flexGrow={1}>
                    <TextField
                      className={classes.searchBox}
                      placeholder={t("componentData.listView.SearchReportName")}
                      inputProps={{
                        "aria-label": t(
                          "componentData.listView.SearchReportName"
                        ),
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="search"
                              onClick={() => this.fetchReportList()}
                              onMouseDown={null}
                              edge="end"
                            >
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(event) =>
                        this.setState({ name: event.target.value })
                      }
                      onKeyDown={(event) => this.handleSearch(event)}
                      variant="outlined"
                      size="small"
                      style={{ color: "#000" }}
                    />
                  </Box>
                  {bankParentProfileId != 1 && isReportDeleteEnabled ? (
                    <Box p={1} width="120px" style={{ margin: "auto" }}>
                      <Button
                        color="primary"
                        aria-label="Delete Report"
                        title={t("componentData.listView.DeleteReport")}
                        component="span"
                        className={classes.smallBtn}
                        onClick={(event) => this.handleDelete(event)}
                      >
                        <DeleteOutlineIcon
                          size="small"
                          className={classes.smallIcon}
                        />
                        <Typography variant="h6" className={classes.iconText}>
                          {t("componentData.listView.Delete")}
                        </Typography>
                      </Button>
                    </Box>
                  ) : null}
                  <Box p={1} style={{ display: "none" }}>
                    <Button
                      color="primary"
                      aria-label="View"
                      title={t("componentData.listView.ViewFilter")}
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
                        alt={t("componentData.listView.ViewFilter")}
                        className={classes.smallIcon}
                      />
                      <Typography variant="h6" className={classes.iconText}>
                        {t("componentData.listView.Filters")}
                      </Typography>
                    </Button>
                  </Box>
                  <Box
                    p={1}
                    style={{ display: "none" }}
                    display="flex"
                    alignItems="center"
                  >
                    <EventIcon size="small" className={classes.smallIcon} />
                    <Typography variant="h3" className={classes.iconText}>
                      {t("componentData.listView.PreviousMonth")}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid container item xs={12} md={12}>
                <Table>
                  <StyledTableHead
                    style={{ background: "rgba(204,228,255,0.75)" }}
                  >
                    <TableRow>
                      {bankParentProfileId != 1 && isReportDeleteEnabled ? (
                        <StyledTableCell>
                          <Checkbox
                            checked={
                              dynamicReportsCount &&
                              selectedReports.length === dynamicReportsCount
                            }
                            indeterminate={
                              selectedReports.length > 0 &&
                              selectedReports.length < dynamicReportsCount
                            }
                            onChange={(event) =>
                              this.handleSelectAllClick(event)
                            }
                            icon={
                              <CheckBoxOutlineBlankIcon
                                style={{ color: "rgba(0,0,0,0.6)" }}
                              />
                            }
                            checkedIcon={
                              <CheckBoxIcon
                                style={{ color: "rgba(0,0,0,0.6)" }}
                              />
                            }
                          />
                        </StyledTableCell>
                      ) : null}
                      <StyledTableCell
                        sortDirection={
                          sortColumn === "reportName" ? sortOrder : false
                        }
                      >
                        <TableSortLabel
                          active={sortColumn === "reportName"}
                          direction={
                            sortColumn === "reportName" ? sortOrder : "asc"
                          }
                          onClick={() => this.handleSorting("reportName")}
                        >
                          {t("componentData.listView.NameOfReport")}
                          {sortColumn === "reportName" ? (
                            <span
                              style={{
                                border: 0,
                                clip: "rect(0 0 0 0)",
                                height: 1,
                                margin: -1,
                                overflow: "hidden",
                                padding: 0,
                                position: "absolute",
                                top: 20,
                                width: 1,
                              }}
                            >
                              {sortOrder === "desc"
                                ? "sorted descending"
                                : "sorted ascending"}
                            </span>
                          ) : null}
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell>
                        {t("componentData.listView.DataType")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {t("componentData.listView.Frequency")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {t("componentData.listView.GeneratedBy")}
                      </StyledTableCell>
                      <StyledTableCell>
                        {t("componentData.listView.Subscription")}
                      </StyledTableCell>
                      <StyledTableCell>{null}</StyledTableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {fetchingList ? (
                      <TableRow>
                        <TableCell colSpan={"100%"}>
                          <Box
                            display="flex"
                            p={5}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <CircularProgress color="primary" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      report.list &&
                      report.list.map((item, index) => {
                        const isSelected =
                          selectedReports.indexOf(item.clientReportId) !== -1;
                        return (
                          <Fragment key={index}>
                            <StyledTableRow
                              onClick={(e) => this.showReport(e, item)}
                            >
                              {bankParentProfileId != 1 &&
                              isReportDeleteEnabled ? (
                                <StyledTableCell className="tableCellPadding">
                                  {item.isDynamic ? (
                                    <Checkbox
                                      onClick={() => {
                                        this.handleClick(item);
                                      }}
                                      checked={isSelected}
                                    />
                                  ) : null}
                                </StyledTableCell>
                              ) : null}
                              <StyledTableCell
                                style={{ wordBreak: "break-word" }}
                                className="tableFont"
                              >
                                <Typography
                                  variant="body1"
                                  style={{ fontSize: "14px" }}
                                >
                                  {item.reportName}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell className="tableCellPadding">
                                {item.dataType ? item.dataType : ""}
                              </StyledTableCell>
                              <StyledTableCell className="tableCellPadding">
                                {item.frequency ? item.frequency : "N.A."}
                              </StyledTableCell>
                              <StyledTableCell className="tableCellPadding">
                                {item.generatedBy}
                              </StyledTableCell>
                              <StyledTableCell className="tableCellPadding">
                                {item.subscription
                                  ? t("componentData.listView.Subscribed")
                                  : t("componentData.listView.NotSubscribed")}
                              </StyledTableCell>
                              <StyledTableCell className="tableCellPadding">
                                {item.isDynamic &&
                                (isReportDeleteEnabled ||
                                  isReportDownloadEnabled ||
                                  isReportEditEnabled) ? (
                                  <Box>
                                    <Button
                                      aria-label="more"
                                      aria-controls="long-menu"
                                      aria-haspopup="true"
                                      onClick={(event) =>
                                        this.handleOption(event, item)
                                      }
                                    >
                                      <MoreVertIcon />
                                    </Button>
                                    {anchorEls &&
                                      anchorEls[item.clientReportId] &&
                                      this.renderOptionsMenu(item)}
                                  </Box>
                                ) : null}
                              </StyledTableCell>
                            </StyledTableRow>
                          </Fragment>
                        );
                      })
                    )}

                    {report.list.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={"100%"}>
                          <Box
                            display="block"
                            textAlign="center"
                            width={1}
                            my={6}
                          >
                            <img
                              alt="No Data"
                              src={require("~/assets/icons/bankFile_No_data.svg")}
                            />

                            <Box
                              py={3}
                              color="#A1A1A1"
                              fontSize={14}
                              display="block"
                            >
                              {t("componentData.listView.NoDataToshow")}
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <StyledTableFooter>
                    <TableRow>
                      <TablePagination
                        labelRowsPerPage={t(
                          "componentData.listView.rowsPerPage"
                        )}
                        rowsPerPageOptions={[10, 25, 50]}
                        colSpan={"100%"}
                        count={report.totalCount || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: {
                            "aria-label": t(
                              "componentData.listView.rowsPerPage"
                            ),
                          },
                          native: true,
                        }}
                        onChangePage={this.handlePageChange}
                        onChangeRowsPerPage={this.handleRowsPerPageChange}
                        labelDisplayedRows={({ from, to, count }) =>
                          `${from}-${to} ${t("componentData.fileName.Of")} ${
                            count !== -1
                              ? count
                              : `${t("componentData.fileName.MoreThan")} ${to}`
                          }`
                        }
                      />
                    </TableRow>
                  </StyledTableFooter>
                </Table>
              </Grid>
            </Paper>
            {alertMessage &&
              this.renderAlertMessage(
                "",
                alertMessage,
                alertMessageCallbackType
              )}
            {showConfirmRemoveDialog &&
              this.renderDeleteDialog(
                "",
                t("componentData.listView.deleteReport")
              )}
          </Grid>

          <ReportsFilter
            open={showFilter}
            handleClose={() => this.hideFilter()}
            headerText={t("componentData.listView.DateFilter")}
            icon={<EventIcon size="medium" />}
          >
            <DateFilter
              filterList={filterList}
              dateFilter={dateFilter}
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
        </Box>
      </Fragment>
    );
  }

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
      />
    );
  };

  renderDeleteDialog = (title, message) => {
    return (
      <ConfirmDialog
        title={title}
        message={message}
        onCancel={() => this.onCancelDelete()}
        onConfirm={() => this.onConfirmDelete()}
      />
    );
  };

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          callbackType === "REDIRECT" ? this.goBack() : this.hideAlertMessage();
        }}
      />
    );
  };
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.role,
    ...state.permissions,
    ...state.report,
  }))(withStyles(styles)(ReportListView))
);
