import React, { Component } from "react";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import {
  Grid,
  TableSortLabel,
  Box,
  InputAdornment,
  IconButton,
  TextField,
  Paper,
  Link,
  Typography,
  Button,
  TableRow,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  MenuItem,
  Menu,
  CircularProgress,
} from "@material-ui/core";
import { CustomDialog, AlertDialog } from "~/components/Dialogs";
import VendorInformation from "~/modules/vendorInformation";
//import ChipFilter from "~/components/Filter";
import CustomStepper from "~/components/customStepper";
import { withStyles } from "@material-ui/styles";

import SearchIcon from "@material-ui/icons/Search";
import {
  fetchSupplierList,
  fetchEmailDeliveryStatus,
  fetchCampaignMetrics,
  fetchEnrollmentStatus,
  fetchFilterChips,
} from "~/redux/actions/campaign";
import { getDownloadSupplierList } from "~/redux/helpers/campaigns";
import ChipFilter from "~/components/Filter";
import { fetchSpecificVendorsDetails } from "~/redux/helpers/suppliers";
import styles from "./detailStyle";
import config from "~/config";

import * as XLSX from "xlsx";
import generatePDF from "~/modules/GeneratePDF/";
import * as FileSaver from "file-saver";
import ExportAsBtn from "~/components/ExportAsBtn";
import moment from "moment";
import { accessRights } from "~/config/accessRights";
import { Pie, Doughnut } from "react-chartjs-2";
import { round } from "lodash";
import "moment/locale/fr";



// Chart.defaults.global.defaultFontFamily = "Interstate";
// Chart.defaults.global.pointStyles = "circle";

moment.updateLocale("en", {  
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    ss: "%d seconds",
    m: "One minute",
    mm: "%d minutes",
    h: "One hour",
    hh: "%d hours",
    d: "One day",
    dd: "%d days",
    w: "One week",
    ww: "%d weeks",
    M: "One month",
    MM: "%d months",
    y: "One year",
    yy: "%d years",
  },
});

class EnrollmentCampaignsDetails extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    const { t } = this.props;
    this.state = {
      isLoading: true,
      fetchingList: true,
      fetchingEmailDeliveryStatus: true,
      fetchingCampaignMatrics: true,
      fetchingEnrollmentStatus: true,
      item: (state && state.item) || null,
      page: 0,
      rowsPerPage: 10,
      selectedVendor: {},
      sortColumn: "",
      sortOrder: "",
      alertType: "success",
      alertMessage: "",
      alertMessageCallbackType: null,
      showConfirmRemoveDialog: false,
      filterOpen: false,
      supplierList: [],
      totalCount: 0,
      emailDeliveryStatus: null,
      campaignMatricInfo: {
        labels: [t('componentData.supplierDetail.Both'), t('componentData.supplierDetail.Bank'), t('componentData.supplierDetail.VirtualCard')],
        datasets: [
          {
            data: [],
            label: t('componentData.supplierDetail.Rainfall'),
            backgroundColor: ["#2E7185", "#CCE4FF", "#1AABA3"],

            borderWidth: 0,
          },
        ],
      },
      enrollmentStatusList: [],
      openVendorInformationDialog: false,
      filterList: [],
      selectedFilterItem: {},
      showDownload: false,
      anchorEl: null,
      downloadProgress: false,
      showGraph: false,
      enrollmentOnly: false,
    };
  }

  componentDidMount = async () => {
    //const { accessToken } = this.props.user.userData;
    this.getSupplierList();
    this.getEmailDeliveryStatus();
    this.getCampaignMetrics();
    this.getEnrollmentStatus();
    this.getFilterChips();
  };

  setCompanyDetail=(venderDetail)=>{
      this.setState({selectedVendor: venderDetail});
  }

  filterCliCkFun = () => {
    this.setState({
      filterOpen: !this.state.filterOpen,
      name: "",
    });

    if (this.state.filterOpen) {
      this.getSupplierList();
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
      () => this.getSupplierList()
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
      () => this.getSupplierList()
    );
  };

  handleSorting(sortColumn) {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    this.setState({ sortColumn: sortColumn, sortOrder: newSortOrder }, () => {
      this.getSupplierList();
    });
  }

  handleFormPageChange = (pageNo) => {
    this.setState({ formPageNo: pageNo });
  };

  handleSearch = (event) => {
    if (event.keyCode == 13) {
      this.getSupplierList();
    }
  };

  getSupplierList = () => {
    const {
      name,
      item,
      selectedFilterItem,
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
            fetchSupplierList({
              campaignId: item.campaignId,
              userId: userData.userId,
              portalProfileId: userData.portalProfileId,
              portalTypeId: userData.portalTypeId,
              name: name || "",
              page: page,
              rowsPerPage: rowsPerPage,
              sortColumn: sortColumn || "",
              sortOrder: sortOrder || "",
              linkStatusId: selectedFilterItem.filterKey || null,
              isEmailBounced:
                selectedFilterItem &&
                selectedFilterItem.roleName == "Email Bounced"
                  ? true
                  : false,
              isEmailDelivered:
                selectedFilterItem &&
                selectedFilterItem.roleName == "Email Delivered"
                  ? true
                  : false,
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
              supplierList: this.props.campaign.payerList,
              totalCount: this.props.campaign.totalCount,
            });
          });
      }
    );
  };

  getEmailDeliveryStatus = () => {
    const { item } = this.state;
    this.setState(
      {
        fetchingEmailDeliveryStatus: true,
      },
      () => {
        const { userData } = this.props.user;

        this.props
          .dispatch(
            fetchEmailDeliveryStatus({
              campaignId: item.campaignId,
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
                alertMessage: this.props.campaign.error,
                fetchingEmailDeliveryStatus: false,
              });
              return false;
            }

            this.setState({
              fetchingEmailDeliveryStatus: false,
              emailDeliveryStatus: this.props.campaign.emailDeliveryStatus,
            });
          });
      }
    );
  };

  getCampaignMetrics = () => {
    const { item } = this.state;
    const { t } = this.props;
    this.setState(
      {
        fetchingCampaignMatrics: true,
      },
      () => {
        const { userData } = this.props.user;

        this.props
          .dispatch(
            fetchCampaignMetrics({
              campaignId: item.campaignId,
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
                alertMessage: this.props.campaign.error,
                fetchingCampaignMatrics: false,
              });
              return false;
            }

            const dataInfo = this.props.campaign.campaignMatricInfo;
            if (dataInfo) {
              let totalCountInfo = 0;

              const enrollmentOnly =
                dataInfo.CrossBorderCount === undefined ? false : true;

              if (enrollmentOnly) {
                totalCountInfo =
                  (+dataInfo.WireCount || 0) +
                  (+dataInfo.CrossBorderCount || 0);
                this.setState({
                  enrollmentOnly: true,
                  fetchingCampaignMatrics: false,
                  showGraph: totalCountInfo ? true : false,
                  campaignMatricInfo: {
                    labels: [
                      `${t('componentData.supplierDetail.EFT')} ${
                        totalCountInfo
                          ? round(
                              (dataInfo.CrossBorderCount / totalCountInfo) * 100
                            )
                          : 0
                      }%`,
                      `${t('componentData.supplierDetail.Wire')} ${
                        totalCountInfo
                          ? round((dataInfo.WireCount / totalCountInfo) * 100)
                          : 0
                      }%`,
                    ],
                    datasets: [
                      {
                        data: [dataInfo.CrossBorderCount, dataInfo.WireCount],
                        label: t('componentData.supplierDetail.Rainfall'),
                        backgroundColor: ["#CCE4FF", "#1AABA3"],
                        borderWidth: 0,
                      },
                    ],
                  },
                });
              } else {
                totalCountInfo =
                  (+dataInfo.bothCount || 0) +
                  (+dataInfo.ACHCount || 0) +
                  (+dataInfo.VCACount || 0);
                this.setState({
                  enrollmentOnly: false,
                  fetchingCampaignMatrics: false,
                  showGraph: totalCountInfo ? true : false,
                  campaignMatricInfo: {
                    labels: [
                      `${t('componentData.supplierDetail.Both')} ${
                        totalCountInfo
                          ? round((dataInfo.bothCount / totalCountInfo) * 100)
                          : 0
                      }%`,
                      `${t('componentData.supplierDetail.Bank')} ${
                        totalCountInfo
                          ? round((dataInfo.ACHCount / totalCountInfo) * 100)
                          : 0
                      }%`,
                      `${t('componentData.supplierDetail.VCA')} ${
                        totalCountInfo
                          ? round((dataInfo.VCACount / totalCountInfo) * 100)
                          : 0
                      }%`,
                    ],
                    datasets: [
                      {
                        data: [
                          dataInfo.bothCount,
                          dataInfo.ACHCount,
                          dataInfo.VCACount,
                        ],
                        label: t('componentData.supplierDetail.Rainfall'),
                        backgroundColor: ["#2E7185", "#CCE4FF", "#1AABA3"],
                        borderWidth: 0,
                      },
                    ],
                  },
                });
              }
            }
          });
      }
    );
  };

  getEnrollmentStatus = () => {
    const { item } = this.state;
    this.setState(
      {
        fetchingEnrollmentStatus: true,
      },
      () => {
        const { userData } = this.props.user;

        this.props
          .dispatch(
            fetchEnrollmentStatus({
              campaignId: item.campaignId,
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
                alertMessage: this.props.campaign.error,
                fetchingEnrollmentStatus: false,
              });
              return false;
            }

            const enrollmentStatusList =
              this.props.campaign.enrollmentStatusList &&
              this.props.campaign.enrollmentStatusList.sort(function (a, b) {
                return a.order - b.order;
              });

            this.setState({
              fetchingEnrollmentStatus: false,
              enrollmentStatusList: enrollmentStatusList,
            });
          });
      }
    );
  };

  getFilterChips = () => {
    const { item } = this.state;
    this.setState(
      {
        fetchingList: true,
      },
      () => {
        const { userData } = this.props.user;

        this.props
          .dispatch(
            fetchFilterChips({
              campaignId: item.campaignId,
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
                alertMessage: this.props.campaign.error,
                fetchingList: false,
              });
              return false;
            }

            this.setState({
              fetchingList: false,
              filterList: this.props.campaign.filterList,
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

  handleClickFilter = (event, item, index) => {
    this.setState(
      {
        selectedFilterItem: item,
        page: 0,
        rowsPerPage: 10,
      },
      () => {
        this.getSupplierList();
      }
    );
  };

  handleDownloadCSV = async () => {
    const {t} = this.props;
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    const fileName = `campaign_supplier_list_${dateStr}.xlsx`;
    const campaignId = this.state.item.campaignId;
    const vendorsList = await getDownloadSupplierList({ campaignId });

    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (vendorsList && vendorsList.length > 0) {
          const tableColumn = [t('componentData.supplierDetail.PayeeName'), t('componentData.supplierDetail.Status'), t('componentData.supplierDetail.LastUpdated')];
          // define an empty array of rows
          const tableRows = [];
          // for each account pass all its data into an array
          vendorsList.forEach((field) => {
            const updatedAt = field.updatedAt
              ? moment(field.updatedAt).format("MM/DD/YYYY")                            
              : t('componentData.supplierDetail.NA');

            // const data = {
            //   "Payee Name": field.companyName,
            //   Status: field.status,
            //   "Last Updated": updatedAt,
            // };

            const data = {};
            data[t('componentData.supplierDetail.PayeeName')] = field.companyName;
            data[t('componentData.supplierDetail.Status')] = field.status;
            data[t('componentData.supplierDetail.LastUpdated')] = updatedAt;

            //push each data info into a row
            tableRows.push(data);
          });
          const payeeTitle = t('componentData.supplierDetail.CampaignPayeeList');
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
    const campaignId = this.state.item.campaignId;
    const vendorsList = await getDownloadSupplierList({ campaignId });
    const { t } = this.props;
    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (vendorsList && vendorsList.length > 0) {
          const tableColumn = [`${t('componentData.supplierDetail.PayeeName')}`, `${t('componentData.supplierDetail.Status')}`, `${t('componentData.supplierDetail.LastUpdated')}`];
          // define an empty array of rows
          const tableRows = [];
          // for each account pass all its data into an array
          vendorsList.forEach((field) => {
            const updatedAt = field.updatedAt
              ? moment(field.updatedAt).format("MM/DD/YYYY")
              : t('componentData.supplierDetail.NA');
            const supplierName = field.companyName;
            const status = field.status;
            const data = [supplierName, status, updatedAt];

            //push each data info into a row
            tableRows.push(data);
          });
          //console.log(tableRows);
          const title = t('componentData.supplierDetail.CampaignPayeeList');
          const date = Date().split(" ");
          // we use a date string to generate our filename.
          const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
          const fileName = `campaign_supplier_list_${dateStr}.pdf`;
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
  showDialogue = (item) => {
    const { userData } = this.props.user;
    const { t } = this.props;
    fetchSpecificVendorsDetails(
      item.clientPayeeLinkId,
      userData.portalProfileId
    ).then((response) => {
      if (!response) {
        this.setState({
          alertType: "error",
          alertMessageCallbackType: null,
          alertMessage: t('componentData.supplierDetail.errorMsg'),
          isLoading: false,
          fetchingList: false,
        });
        return false;
      }
      this.setState({
        openVendorInformationDialog: true,
        selectedVendor:
          response.data && response.data.rows && response.data.rows[0]
            ? response.data.rows[0]
            : {},
      });
    });
  };
  closeApproveVendorDetails = () => {
    const { t } = this.props;
    this.setState({
      openVendorInformationDialog: false,
      page: 0,
      alertType: "success",
      alertMessageCallbackType: null,
      alertMessage: t('componentData.supplierDetail.PayeeApprovedSuccessfully'),
    });
  };
  closeSaveVendorDetails = () => {
    const { t } = this.props;
    this.setState({
      openVendorInformationDialog: false,
      page: 0,
      alertType: "success",
      alertMessageCallbackType: null,
      alertMessage: t('componentData.supplierDetail.infoSaved'),
    });
  };
  closeDisapproveVendorDetails = () => {
    const { t } = this.props;
    this.setState({
      openVendorInformationDialog: false,
      page: 0,
      alertType: "success",
      alertMessageCallbackType: null,
      alertMessage: t('componentData.supplierDetail.PayeeDisapprovedSuccessfully'),
    });
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
  render() {
    const {
      item,
      alertMessage,
      supplierList,
      totalCount,
      name,
      alertMessageCallbackType,
      selectedFilterItem,
      fetchingList,
      campaignMatricInfo,
      enrollmentStatusList,
      filterList,
      emailDeliveryStatus,
      showDownload,
      page,
      rowsPerPage,
      sortColumn,
      sortOrder,
      openVendorInformationDialog,
      showGraph,
      enrollmentOnly,
    } = this.state;
    const { t } = this.props;
    const { classes, user, campaign } = this.props;
    const isDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_ENROLLMENT_CAMPAIGN_DOWNLOAD"]
        )) ||
      false;

    const isMySupplierEditEnabled = (user.userRoles && user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_EDIT"])) || false;

    const infoLabel = enrollmentOnly
      ? [`${t('componentData.supplierDetail.EFT')} 0%`, `${t('componentData.supplierDetail.Wire')} 0%`]
      : ["Both 0%", "ACH 0%", "VCA 0%"];
      
    return (
      <Box mx={6} mt={2}>
        <Box my={2}>
          <h4 className={classes.fileText}>
            <span>
              <Link
                style={{ color: "#2996EE" }}
                href="javascript:return void(0)"
                onClick={() =>
                  this.props.history.push(
                    `${config.baseName}/suppliers/enrollmentCampaigns/`
                  )
                }
              >
                {t('componentData.supplierDetail.EnrollmentCampaigns')}
              </Link>
            </span>
            / {t('componentData.supplierDetail.CampaignName')}: {item.campaignName}
          </h4>
        </Box>
        <Grid container className={classes.root} spacing={4}>
          <Grid item xs={6}>
            <Paper elevation={0}>
              <Box display="flex" justifyContent="space-around">
                <Box mx={2} className={classes.mailCampaignsStatus}>
                  <h3>
                    {(campaign.campaignMatricInfo &&
                      campaign.campaignMatricInfo.approved) ||
                      "0"}
                    <span>                      
                      /
                      {(campaign.campaignMatricInfo &&
                        campaign.campaignMatricInfo.totalSuppliers &&
                        campaign.campaignMatricInfo.totalSuppliers
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                        "0"}
                    </span>
                  </h3>
                  <p>{t('componentData.supplierDetail.PayeesApproved')}</p>
                </Box>

                <Box pt={2}>
                  {showGraph ? (
                    <Pie
                      width="280"
                      height="100"
                      data={campaignMatricInfo}
                      options={{
                        title: {
                          display: true,
                          text: t('componentData.supplierDetail.PaymentMethodShared'),
                          fontSize: 14,
                          position: "bottom",
                          fontFamily: "Interstate",
                        },
                        legend: {
                          display: true,
                          position: "right",
                          labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                          },
                        },
                      }}
                    />
                  ) : (
                    <Doughnut
                      id="doughnutChart"
                      width="280"
                      height="100"
                      data={{
                        labels: infoLabel,
                        datasets: [
                          {
                            label: "",
                            data: [
                              0.00000000000000001,
                              0.000000000000001,
                              0.00000000000000001,
                              100000000000000000000,
                            ],
                            backgroundColor: [
                              "#2E7185",
                              "#CCE4FF",
                              "#1AABA3",
                              "#EAECF1",
                            ],
                            //   borderColor: [
                            //     "rgba(255,99,132,1)",
                            //     "rgba(54, 162, 235, 1)",
                            //     "rgba(255, 206, 86, 1)"
                            //   ],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        title: {
                          display: true,
                          text: t('componentData.supplierDetail.PaymentMethodShared'),
                          fontSize: 14,
                          position: "bottom",
                          fontFamily: "Interstate",
                        },
                        showTooltips: false,
                        tooltips: {
                          enabled: false,
                        },
                        aspectRatio: 1,
                        clip: {
                          left: 15,
                          top: false,
                          right: -2,
                          bottom: 0,
                        },
                        height: 100,
                        width: 100,
                        cutoutPercentage: 60,
                        animation: {
                          animateRotate: true,
                        },
                        responsive: false,
                        maintainAspectRatio: true,
                        legend: {
                          display: true,
                          position: "right",
                          labels: {
                            usePointStyle: true,
                            boxWidth: 8,
                          },
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper elevation={0}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mx={5}
              >
                <Box width="auto" className={classes.mailCampaignsStatus}>
                  <h3>
                    {(emailDeliveryStatus &&
                      emailDeliveryStatus.emailDelivered) ||
                      0}{" "}
                    <span>
                      {" "}
                      /{" "}
                      {(emailDeliveryStatus &&
                        emailDeliveryStatus.totalCount) ||
                        0}
                    </span>
                  </h3>
                  <p>{t('componentData.supplierDetail.EmailsDelivered')}</p>
                </Box>
                <Box width="auto" className={classes.mailCampaignsStatus}>
                  <h3>
                    {(emailDeliveryStatus && emailDeliveryStatus.emaiClicked) ||
                      0}{" "}
                    <span>
                      {" "}
                      /{" "}
                      {(emailDeliveryStatus &&
                        emailDeliveryStatus.emailDelivered) ||
                        0}
                    </span>
                  </h3>
                  <p>{t('componentData.supplierDetail.EmailsOpened')}</p>
                </Box>
                <Box width="auto" className={classes.mailCampaignsStatus}>
                  <h3>
                    {(emailDeliveryStatus &&
                      emailDeliveryStatus.emailBounced) ||
                      0}{" "}
                    <span>
                      {" "}
                      /{" "}
                      {(emailDeliveryStatus &&
                        emailDeliveryStatus.totalCount) ||
                        0}
                    </span>
                  </h3>
                  <p>{t('componentData.supplierDetail.EmailsBounced')}</p>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid container item xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <CustomStepper dataprops={enrollmentStatusList} />
            </Paper>
          </Grid>
        </Grid>

        {/*****Start Table Section****/}
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
                      {showDownload && this.renderDownloadOptions(showDownload)}
                    </Box>
                  )}

                  <Box p={1}>
                    <TextField
                      className={classes.searchBox}
                      placeholder= {t('componentData.supplierDetail.SearchPayee')}
                      inputProps={{ "aria-label": `${t('componentData.supplierDetail.SearchPayee')}`}}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="search"
                              onClick={() => this.getSupplierList()}
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
                  {/*<Box p={1}>
                    <Button
                      color="primary"
                      aria-label="View"
                      title="Filter"
                      component="span"
                      className={classes.smallBtn}
                      onClick={() => this.filterCliCkFun()}
                    >
                      <img
                        src={require(`~/assets/icons/icon_filter.svg`)}
                        alt={"View Filter"}
                        className={classes.imgIcon}
                      />
                      <Typography variant="h6" className={classes.iconText}>
                        Filters
                      </Typography>
                    </Button>
                  </Box>*/}
                </Box>
              </Grid>

              <Grid container item xs={12} md={12}>
                <Grid item xs={12}>
                  <Box display="flex" width="100%" justifyContent="flex-start">
                    <ChipFilter
                      list={filterList}
                      handleClickFilter={this.handleClickFilter}
                      selectedFilterItem={selectedFilterItem}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid container item xs={12} md={12}>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            size="small"
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
                              {t('componentData.supplierDetail.PayeeName')}
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
                          <TableCell align="left">{t('componentData.supplierDetail.Status')}</TableCell>
                          <TableCell align="left">{t('componentData.supplierDetail.LastUpdated')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fetchingList ? (
                          <TableRow>
                            <TableCell colSpan={3}>
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
                          supplierList &&
                          supplierList.map((item, index) => {
                            return (
                              <TableRow
                                style={{ cursor: "pointer" }}
                                onClick={() => this.showDialogue(item)}
                              >
                                <TableCell align="left">
                                  {item.companyName}
                                </TableCell>
                                <TableCell align="left">
                                  {item.status}
                                </TableCell>
                                <TableCell align="left">
                                  {item.updatedAt
                                    ? moment(item.updatedAt)
                                    .locale(this.props.i18n.language)
                                    .fromNow().replace(/\b[a-z]/, match => match.toUpperCase())
                                    : t('componentData.supplierDetail.NA')}
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
                    colSpan={3}
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
        {/*****End Table Section****/}
        {/* Open vendor details */}

        {openVendorInformationDialog && (
          <CustomDialog
            showButton={false}
            // alignSide={true}
            onConfirm={() => {
              this.setState({
                openVendorInformationDialog: false,
              });
            }}
            title={this.state.selectedVendor && this.state.selectedVendor.companyName ?
              `${this.state.selectedVendor.companyName} ${t('componentData.supplierDetail.Information')}` : t('componentData.supplierDetail.PayeeNameInformation')}
            width="960px"
          >
            <VendorInformation
              vendorDetail={this.state.selectedVendor}
              getAllVendorsList = { this.getSupplierList }
              canEdit={isMySupplierEditEnabled}
              closeApproveVendorDetails={this.closeApproveVendorDetails}
              closeSaveVendorDetails={this.closeSaveVendorDetails}
              closeDisapproveVendorDetails={this.closeDisapproveVendorDetails}
              onConfirm={() => {
                this.setState({
                  openVendorInformationDialog: false,
                });
              }}
              setCompanyDetail={this.setCompanyDetail}
              {...this.props}
            />
          </CustomDialog>
        )}
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </Box>
    );
  }
}

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.role,
  ...state.permissions,
  ...state.campaign,
}))(withStyles(styles)(EnrollmentCampaignsDetails)));
