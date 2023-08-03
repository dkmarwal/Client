import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import {
  Grid,
  InputAdornment,
  IconButton,
  Box,
  TableSortLabel,
  Paper,
  TableRow,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  makeStyles,
  CircularProgress,
  TextField,
  MenuItem,
  Menu,
} from "@material-ui/core";

import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/styles";

import {
  fetchCampaignList,
} from "~/redux/actions/campaign";
import { getDownloadCampaignList } from "~/redux/helpers/campaigns";
import { AlertDialog } from "~/components/Dialogs";

import * as XLSX from "xlsx";
import generatePDF from "~/modules/GeneratePDF/";
import * as FileSaver from "file-saver";
import ExportAsBtn from "~/components/ExportAsBtn";

import moment from "moment";

import styles from "./styles";
import config from "~/config";
import { accessRights } from "~/config/accessRights";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    width: "100%",
    padding: theme.spacing(2),
  },

  table: {
    width: "100%",

    "& .MuiTableRow-head .MuiTableCell-head": {
      backgroundColor: "rgba(204,228,255,0.75)",
      fontWeight: 600,
      fontSize: 16,
      lineHeight: "0.6em",
    },
  },

  smallBtn: {
    fontSize: "14px",
    color: "#0B1941",
    padding: "5px 10px",
    textTransform: "capitalize",
  },
  imgIcon: {
    marginRight: "5px",
  },
  iconGreyText: {
    fontSize: "14px",
    fontWeight: "600",
    color: theme.palette.text.grey,
  },
  iconText: {
    fontSize: "14px",
    fontWeight: "600",
  },
  fileText: {
    fontSize: 16,
    fontWeight: 600,
    color: theme.palette.text.blackLight,
    "& span": {
      color: theme.palette.secondary.main,
      fontWeight: "normal",
    },
  },
}));

class EnrollmentCampaigns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      fetchingList: true,
      page: 0,
      rowsPerPage: 10,
      sortColumn: "",
      sortOrder: "",
      alertType: "success",
      alertMessage: "",
      alertMessageCallbackType: null,
      showConfirmRemoveDialog: false,
      filterOpen: false,
      campaignList: [],
      totalCount: 0,
      showDownload: false,
      anchorEl: null,
      downloadProgress: false,
    };
  }

  componentDidMount = async () => {
    this.getCampaignList();
  };

  filterCliCkFun = () => {
    this.setState({
      filterOpen: !this.state.filterOpen,
      name: "",
    });
    if (this.state.filterOpen) {
      this.getCampaignList();
    }
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
      () => this.getCampaignList()
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
      () => this.getCampaignList()
    );
  };

  handleSorting(sortColumn) {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    this.setState({ sortColumn: sortColumn, sortOrder: newSortOrder }, () => {
      this.getCampaignList();
    });
  }

  handleFormPageChange = (pageNo) => {
    this.setState({ formPageNo: pageNo });
  };

  handleSearch = (event) => {
    if (event.keyCode == 13) {
      this.getCampaignList();
    }
  };

  getCampaignList = () => {
    const { name, page, rowsPerPage, sortColumn, sortOrder } = this.state;

    this.setState(
      {
        fetchingList: true,
      },
      () => {
        const { userData } = this.props.user;

        this.props
          .dispatch(
            fetchCampaignList({
              userId: userData.userId,
              portalProfileId: userData.portalProfileId,
              portalTypeId: userData.portalTypeId,
              name: name || "",
              page: page,
              rowsPerPage: rowsPerPage,
              sortColumn: sortColumn || "",
              sortOrder: sortOrder || "",
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.campaign.error,
                isLoading: false,
                fetchingList: false,
              });
              return false;
            }

            this.setState({
              isLoading: false,
              fetchingList: false,
              campaignList: this.props.campaign.campaignList,
              totalCount: this.props.campaign.totalCount,
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

  handleDownloadCSV = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    const fileName = `campaign_list_${dateStr}.xlsx`;
    const vendorsList = await getDownloadCampaignList();
    const {t} = this.props;

    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (vendorsList && vendorsList.length > 0) {          
          // define an empty array of rows
          const tableRows = [];
          // for each account pass all its data into an array
          vendorsList.forEach((field) => {
            const startDate = moment(field.startDate).format("MM/DD/YYYY");
            const endDate = moment(field.endDate).format("MM/DD/YYYY");
            let totalSupplierEnrolled = 0;
            if (field.totalSuppliers > 0) {
              totalSupplierEnrolled =
                (field.totalEnrolled * 100) / field.totalSuppliers;
            }
            // const data = {
            //   "Campaign Name": field.campaignName,
            //   "No. of Payees": field.totalSuppliers,
            //   Duration: `${startDate} - ${endDate}`,
            //   "Campaign Status":
            //     field.isActive == 1 ? "In Progress" : "Complete",
            //   "Payees Enrolled": `${totalSupplierEnrolled.toFixed(0)} %`,
            // };

            const data = {};
            data[t('componentData.supplierDetail.CampaignName')] = field.campaignName;
            data[t('componentData.supplierDetail.totalPayee')] = field.totalSuppliers;
            data[t('componentData.supplierDetail.Duration')] = `${startDate} - ${endDate}`;
            data[t('componentData.supplierDetail.CampaignStatus')] = field.isActive == 1 ? t('componentData.supplierDetail.InProgress') : t('componentData.supplierDetail.Complete');
            data[t('componentData.supplierDetail.PayeesEnrolled')] = `${totalSupplierEnrolled.toFixed(0)} %`;

            //push each data info into a row
            tableRows.push(data);
          });
          const payeeTitle = t('componentData.supplierDetail.CampaignList');
          const ws = XLSX.utils.json_to_sheet(tableRows);
          const wb = {
            Sheets: {},
            SheetNames: [payeeTitle],
          };
          wb.Sheets[payeeTitle] = ws;

          const excelBuffer = XLSX.write(wb, {
            bookType: "xlsx",
            type: "array",
          });
          const data = new Blob([excelBuffer], { type: fileType });
          FileSaver.saveAs(data, fileName);

          this.setState({
            downloadProgress: false,
            showDownload: false,
          });
        }
      }
    );
  };

  handleDownloadPDF = async () => {
    const vendorsList = await getDownloadCampaignList();
    const { t } = this.props;
    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (vendorsList && vendorsList.length > 0) {
          const tableColumn = [
            t('componentData.supplierDetail.CampaignNameTxt'),
            t('componentData.supplierDetail.totalPayee'),
            t('componentData.supplierDetail.Duration'),
            t('componentData.supplierDetail.CampaignStatus'),
            t('componentData.supplierDetail.PayeesEnrolled'),
          ];
          // define an empty array of rows
          const tableRows = [];
          // for each account pass all its data into an array
          vendorsList.forEach((field) => {
            const startDate = moment(field.startDate).format("MM/DD/YYYY");
            const endDate = moment(field.endDate).format("MM/DD/YYYY");
            let totalSupplierEnrolled = 0;
            if (field.totalSuppliers > 0) {
              totalSupplierEnrolled =
                (field.totalEnrolled * 100) / field.totalSuppliers;
            }
            const duration = `${startDate} - ${endDate}`;
            const active = field.isActive == 1 ? t('componentData.supplierDetail.InProgress') : t('componentData.supplierDetail.Complete');
            const totalEnrolled = `${totalSupplierEnrolled.toFixed(0)}%`;
            const campaignName = field.campaignName;
            const totalNoSuppliers = field.totalSuppliers;

            const data = [
              campaignName,
              totalNoSuppliers,
              duration,
              active,
              totalEnrolled,
            ];

            //push each data info into a row
            tableRows.push(data);
          });
          //console.log(tableRows);
          const title = t('componentData.supplierDetail.CampaignList');
          const date = Date().split(" ");
          // we use a date string to generate our filename.
          const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
          const fileName = `campaign_list_${dateStr}.pdf`;
          generatePDF(title, fileName, tableColumn, tableRows);

          this.setState({
            downloadProgress: false,
            showDownload: false,
          });
        }
      }
    );
  };

  renderDownloadOptions = (showDownload) => {
    return (
      <Menu
        anchorEl={this.state.anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={showDownload}
        onClose={() => this.setState({ showDownload: false, anchorEl: null })}
      >
        <MenuItem onClick={() => this.handleDownloadCSV()}>.XLSX</MenuItem>
        <MenuItem onClick={() => this.handleDownloadPDF()}>.PDF</MenuItem>
      </Menu>
    );
  };

  render() {
    const { t } = this.props;
    const {
      alertMessage,
      campaignList,
      totalCount,
      alertMessageCallbackType,
      isLoading,
      fetchingList,
      page,
      rowsPerPage,
      sortColumn,
      sortOrder,
      showDownload,
    } = this.state;
    const { classes } = this.props;

    const { user } = this.props;
    const isDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_ENROLLMENT_CAMPAIGN_DOWNLOAD"]
        )) ||
      false;

    if (isLoading) {
      return (
        <Box display="flex" p={10} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return (
      <>
        <Box mx={6} mt={4}>
          <Box my={4}>
            <Grid container xs={12}>
              <Paper className={classes.table} elevation={0}>
                <Grid container item xs={12} md={12} justify="flex-end">
                  <Box display="flex" justifyContent="flex-end">
                    {isDownloadEnabled && (
                      <Box p={1}>
                        <ExportAsBtn
                          onClick={(e) => {
                            this.setState({
                              showDownload: true,
                              anchorEl: e.currentTarget,
                            });
                          }}
                          btnName= {t('componentData.supplierDetail.ExportAs')}
                        />
                        {showDownload &&
                          this.renderDownloadOptions(showDownload)}
                      </Box>
                    )}

                    <Box p={1}>
                      <TextField
                        className={classes.searchBox}
                        placeholder= {t('componentData.supplierDetail.SearchCampaignName')}
                        inputProps={{ "aria-label": t('componentData.supplierDetail.SearchCampaignName')}}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="search"
                                onClick={() => this.getCampaignList()}
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
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid container item xs={12} md={12}>
                  <Grid item xs={12}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              size="small"
                              padding={0}
                              align="left"
                              sortDirection={
                                sortColumn === "name" ? sortOrder : false
                              }
                            >
                              <TableSortLabel
                                active={sortColumn === "name"}
                                direction={
                                  sortColumn === "name" ? sortOrder : "asc"
                                }
                                onClick={() => this.handleSorting("name")}
                              >
                                {t('componentData.supplierDetail.CampaignName')}
                                {sortColumn === "name" ? (
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
                                      ? t('componentData.supplierDetail.sortedDescending')
                                      : t('componentData.supplierDetail.sortedAscending')}
                                  </span>
                                ) : null}
                              </TableSortLabel>
                            </TableCell>

                            <TableCell align="left">{t('componentData.supplierDetail.Duration')}</TableCell>
                            <TableCell align="left">{t('componentData.supplierDetail.CampaignStatus')}</TableCell>
                            <TableCell align="right">{t('componentData.supplierDetail.totalPayee')}</TableCell>
                            <TableCell align="right">{t('componentData.supplierDetail.PayeesEnrolled')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fetchingList ? (
                            <TableRow>
                              <TableCell colSpan={5}>
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
                            campaignList.length > 0 &&
                            campaignList.map((item, index) => {
                              const startDate = moment(item.startDate).format(
                                "MM/DD/YYYY"
                              );
                              const endDate = item.endDate? moment(item.endDate).format(
                                "MM/DD/YYYY"
                              ): "NA";
                              let totalSupplierEnrolled = 0;
                              if (item.totalSuppliers > 0) {
                                totalSupplierEnrolled =
                                  (item.totalEnrolled * 100) /
                                  item.totalSuppliers;
                              }
                              return (
                                <TableRow
                                  onClick={() =>
                                    this.props.history.push({
                                      pathname: `${config.baseName}/suppliers/campaigns/detail`,
                                      state: {
                                        item: item,
                                      },
                                    })
                                  }
                                >
                                  <TableCell
                                    align="left"
                                    style={{ cursor: "pointer", width: "25%" }}
                                  >
                                    <Box
                                      textOverflow="ellipsis"
                                      overflow="hidden"
                                      title={item.campaignName}
                                    >
                                      {item.campaignName}
                                    </Box>
                                  </TableCell>

                                  <TableCell
                                    align="left"
                                    style={{ cursor: "pointer", width: "20%" }}
                                  >{`${startDate} - ${endDate}`}</TableCell>
                                  <TableCell
                                    align="left"
                                    style={{ cursor: "pointer", width: "15%" }}
                                  >
                                    {item.isActive == 1
                                      ? t('componentData.supplierDetail.InProgress')
                                      : t('componentData.supplierDetail.Complete')}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    style={{ cursor: "pointer", width: "15%" }}
                                  >
                                    <Box
                                      textOverflow="ellipsis"
                                      overflow="hidden"
                                      title={
                                        (item.totalSuppliers &&
                                          item.totalSuppliers
                                            .toString()
                                            .replace(
                                              /\B(?=(\d{3})+(?!\d))/g,
                                              ","
                                            )) ||
                                        0
                                      }
                                    >
                                      {(item.totalSuppliers &&
                                        item.totalSuppliers
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )) ||
                                        0}
                                    </Box>
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    style={{ cursor: "pointer", width: "15%" }}
                                  >
                                    <Box color="#329F9D" fontWeight="bold">
                                      {" "}
                                      {`${totalSupplierEnrolled.toFixed(0)} %`}
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          )}
                          {totalCount == 0 && (
                            <TableRow>
                              <TableCell colSpan={5}>
                                <Box
                                  display="flex"
                                  p={1}
                                  justifyContent="center"
                                  alignItems="center"
                                >
                                  {t('componentData.supplierDetail.NoResultFound')}
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <TablePagination
                      labelRowsPerPage= {t('componentData.supplierDetail.rowsPerPage')}
                      rowsPerPageOptions={[10, 25, 50]}
                      colSpan={5}
                      component="div"
                      count={totalCount || 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      SelectProps={{
                        inputProps: { "aria-label": t('componentData.supplierDetail.rowsPerPage') },
                        native: true,
                      }}
                      onChangePage={this.handlePageChange}
                      onChangeRowsPerPage={this.handleRowsPerPageChange}
                      labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('componentData.fileName.Of')} ${count !== -1 ? count : `${t('componentData.fileName.MoreThan')} ${to}`}`}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Box>
        </Box>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </>
    );
  }

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

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.role,
  ...state.permissions,
  ...state.campaign,
}))(withStyles(styles)(EnrollmentCampaigns)));
