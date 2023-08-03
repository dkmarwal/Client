import React, { Component } from "react";
import {
  Grid,
  Box,
  Paper,
  CircularProgress,
  Typography,
  withStyles,
  Menu,
  MenuItem,
  Button,
} from "@material-ui/core";

import Checkbox from "@material-ui/core/Checkbox";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import Notification from "~/components/Notification";
import ChipFilter from "~/components/Filter";
import config from "~/config";
import { connect } from "react-redux";
import { CustomDialog } from "~/components/Dialogs";
import PaymentFileFilters from "~/modules/PaymentFileFilters";
import * as XLSX from "xlsx";
import generatePDF from "~/modules/GeneratePDF/";
import * as FileSaver from "file-saver";
import LightBlueBtn from "~/components/LightBlueBtn";
import ExportAsBtn from "~/components/ExportAsBtn";
import { withTranslation } from "react-i18next";

import {
  getCampaignFileList, getCampaignFileStatusList, updateCampaignFileAction
} from "~/redux/helpers/campaigns";

import { styles } from "./styles";

import { approveFileStatusList, rejectFileStatusList } from '~/utils/const';
import { accessRights } from "~/config/accessRights";
import { CONSUMER_CAMPAIGN_STATUSIDS } from '~/config/entityTypes';

class CampaignFile extends Component {
  state = {
    selectedIds: [],
    selectedData: [],
    filterQuery: {},
    isLoading: true,
    selectedTab: 0,
    rows: [],
    name: "",
    id: "",
    count: "",
    noOfPayees: "",
    startDate: "",
    endDate: "",
    statusList: [],
    page: 0,
    rowsPerPage: 10,
    error: false,
    totalRecords: 0,
    selectedFilterItem: {},
    openFiltersSection: false,
    showDownload: false,
    downloadProgress: false,
    anchorEl: null,
    variant: "error",
  };

  componentDidMount = () => {
    const { page, rowsPerPage, filterQuery } = this.state;
    const data = {
      ...filterQuery,
      pageNumber: page + 1,
      rowCount: rowsPerPage,
    };

    this.setState(
      {
        page: page,
        filterQuery: data,
      },
      () => {
        this.fetchFiles(this.state.filterQuery);
        this.getFileStatusList();
      }
    );
  };

  getFileStatusList = async () => {
    const { selectedFilterItem } = this.state;
    const res = await getCampaignFileStatusList();
    if (res.error) {
      this.setState({ statusList: [] });
    } else {
      const data = res && res.length > 0 ? res.map(detail => {
        return { ...detail, roleName: detail.statusDescription, count: null, id: detail.fileStatusId }
      }) : [];
      const list = data && data.find((s) =>
        Object.keys(selectedFilterItem).length > 0
          ? s.id === selectedFilterItem.id
          : s.id === CONSUMER_CAMPAIGN_STATUSIDS.ALL
      );
      this.setState({ statusList: data, selectedFilterItem: list });
    }
  };

  fetchFiles = async (data) => {
    let list = await getCampaignFileList(data);
    if (list.error) {
      this.setState({
        isLoading: false,
        error: list.message,
        variant: "false"
      });
      return false;
    }
    let arr = list && list.rows && list.rows.length > 0 ?
      list.rows.map((item) => {
        return {
          FileID: item.fileId,
          FileName: item.fileName,
          FileUploaded: item.createdAt,
          TotalPayee: item.noOfRecords,
          FileStatusId: item.fileStatus && item.fileStatus.fileStatusId ? item.fileStatus.fileStatusId : "",
          FileStatus: item.fileStatus && item.fileStatus.statusDescription ? item.fileStatus.statusDescription : "",
          StatusColor: item.fileStatus && item.fileStatus.statusColor ? item.fileStatus.statusColor : "",
          NoOfExceptions: item.noOfExceptions,
          NoOfRecords: item.noOfRecords,
          ProcessedRecords: item.processedRecords,
          FileApprovedAt: item.approvedAt,
          ApprovedBy: item.approvedBy,
          FailureReason: item.failureReason
        }
      }) : [];
    this.setState({
      isLoading: false,
      rows: arr,
      totalRecords: list && list.count,
    });
  };

  handleSelection = (event, row) => {
    event.stopPropagation();
    const { checked, id } = event.target;
    const { selectedIds, selectedData } = this.state;

    if (checked) {
      this.setState({
        selectedIds: [...selectedIds, event.target.id],
        selectedData: [...selectedData, row],
      });
    } else {
      const restIds = selectedIds.filter((item) => item !== id);
      const restData = selectedData.filter(
        (item) => item.FileID !== row.FileID
      );
      this.setState({ selectedIds: restIds, selectedData: restData });
    }
  };

  handleClickFilter = (event, item, index) => {
    this.setState(
      {
        selectedFilterItem: item,
        page: 0,
      },
      () => {
        const { statusList, filterQuery } = this.state;

        if (item.StatusID === 0) {
          const queryData = { ...filterQuery, statusID: "", pageNumber: 1 };
          this.setState(
            {
              filterQuery: queryData,
            },
            () => {
              this.fetchFiles(queryData);
            }
          );
        } else {
          const id = statusList
            ? statusList.find((i) => i.statusDescription === item.roleName)
            : {};
          const queryData = {
            ...filterQuery,
            statusID: id.id ? id.id : "",
            pageNumber: 1,
          };
          this.setState(
            {
              filterQuery: queryData,
            },
            () => {
              this.fetchFiles(queryData);
            }
          );
        }
      }
    );
  };

  handleBtnClick = async (item) => {
    const { selectedIds } = this.state;
    const { t } = this.props;
    const res = await updateCampaignFileAction(selectedIds, item);
    if (res.error) {
      this.setState({
        error: t("componentData.importPaymentFiles.SomethingWrong"),
        variant: "error",
      });
      return false;
    }
    this.setState({
      error: t("componentData.importPaymentFiles.ActionUpdated"),
      variant: "success",
      selectedIds: [],
      selectedFilterItem: {},
      selectedData: [],
    });
    this.fetchFiles(this.state.filterQuery);
  };

  handleChangePage = (event, newPage) => {
    const { filterQuery } = this.state;
    const data = {
      ...filterQuery,
      pageNumber: newPage + 1
    };
    this.setState(
      {
        filterQuery: data,
        page: newPage,
      },
      () => {
        this.fetchFiles(data);
      }
    );
  };

  handleChangeRowsPerPage = (event) => {
    const { filterQuery } = this.state;
    const data = {
      ...filterQuery,
      rowCount: event.target.value,
      pageNumber: 1,
    };
    this.setState(
      {
        filterQuery: data,
        page: 0,
        rowsPerPage: +event.target.value,
      },
      () => {
        this.fetchFiles(data);
      }
    );
  };

  applySupplierFilter = (e) => {
    const { userData } = this.props.user;
    const {
      name,
      id,
      count,
      noOfPayees,
      startDate,
      endDate,
      filterQuery,
    } = this.state;
    const data = {
      ...filterQuery,
      pageNumber: 1,
      clientID: userData.portalProfileId,
      fileName: name,
      fileID: id === "" ? 0 : id,
      paymentCountFilterBy: count,
      paymentCount: noOfPayees === "" ? 0 : noOfPayees,
      fromDate: startDate,
      toDate: endDate.length === 0 ? null : endDate,
    };
    this.setState(
      {
        filterQuery: data,
        page: 0,
        isLoading: true,
        openFiltersSection: false,
      },
      () => {
        this.fetchFiles(data);
      }
    );
  };

  resetSupplierFilter = (e) => {
    const { userData } = this.props.user;
    const { filterQuery } = this.state;
    const data = {
      ...filterQuery,
      clientID: userData.portalProfileId,
      fileName: "",
      fileID: 0,
      paymentCountFilterBy: "",
      paymentCount: 0,
      fromDate: "",
      toDate: "",
    };
    this.setState(
      {
        filterQuery: data,
        name: "",
        id: "",
        count: "",
        noOfPayees: "",
        startDate: "",
        endDate: "",
      },
      () => {
        this.fetchFiles(data);
      }
    );
  };

  handleDownloadCSV = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const { t } = this.props;

    //const date = Date().split(" ");
    // we use a date string to generate our filename.
    //const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    //const fileName = `file_list_${dateStr}.xlsx`;

    const date = new Date().toLocaleString(this.props.i18n.language, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace(/[^ -~]/g, "").split(' ');
    let dateStr = date[0] + date[1] + date[2] + date[3];
    var regex = /[.,\s]/g;
    dateStr = dateStr.replace(regex, '');
    const fileName = `${t('componentData.fileName.file')}_${t('componentData.fileName.list')}_${dateStr}.xlsx`;


    const { filterQuery } = this.state;
    const list = await getCampaignFileList(filterQuery);

    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (list && list.rows && list.rows.length > 0) {
          // define an empty array of rows
          const tableRows = [];
          // for each account pass all its data into an array
          list.rows.forEach((field) => {
            const data = {};
            data[t("componentData.importPaymentFiles.FileID")] = field.fileId;
            data[t("componentData.importPaymentFiles.FileName")] =
              field.fileName;
            data[t("componentData.importPaymentFiles.FileStatus")] =
              field.fileStatus && field.fileStatus.statusDescription;
            data[t("componentData.importPaymentFiles.FileUploaded")] =
              field.createdAt;
            data[t("componentData.supplierCampaignFile.NoOfPayees")] =
              field.noOfRecords;

            //push each data info into a row
            tableRows.push(data);
          });
          const paymentFiles = t(
            "componentData.importPaymentFiles.CampaignFiles"
          );
          const ws = XLSX.utils.json_to_sheet(tableRows);
          const wb = {
            Sheets: {},
            SheetNames: [paymentFiles],
          };
          wb.Sheets[paymentFiles] = ws;

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
        } else {
          this.setState({
            downloadProgress: false,
            showDownload: false,
            variant: "error",
            error: `${t('componentData.paymentDetailss.noDataToDownload')}`
          });
        }
      }
    );
  };

  handleDownloadPDF = async () => {
    const { t } = this.props;
    const { filterQuery } = this.state;
    const list = await getCampaignFileList(filterQuery);

    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (list && list.rows && list.rows.length > 0) {
          const tableColumn = [
            t("componentData.importPaymentFiles.FileID"),
            t("componentData.importPaymentFiles.FileName"),
            t("componentData.importPaymentFiles.FileStatus"),
            t("componentData.importPaymentFiles.FileUploaded"),
            t("componentData.supplierCampaignFile.NoOfPayees"),
          ];
          // define an empty array of rows
          const tableRows = [];
          // for each account pass all its data into an array
          list.rows.forEach((field) => {
            const data = [
              field.fileId,
              field.fileName,
              field.fileStatus && field.fileStatus.statusDescription,
              field.createdAt,
              field.noOfRecords,
            ];
            //push each data info into a row
            tableRows.push(data);
          });
          const title = t("componentData.importPaymentFiles.CampaignFiles");

          //const date = Date().split(" ");
          // we use a date string to generate our filename.
          //const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
          //const fileName = `files_${dateStr}.pdf`;

          const date = new Date().toLocaleString(this.props.i18n.language, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace(/[^ -~]/g, "").split(' ');
          let dateStr = date[0] + date[1] + date[2] + date[3];
          var regex = /[.,\s]/g;
          dateStr = dateStr.replace(regex, '');
          const fileName = `${t('componentData.fileName.files')}_${dateStr}.pdf`;

          generatePDF(title, fileName, tableColumn, tableRows);

          this.setState({
            downloadProgress: false,
            showDownload: false,
          });
        } else {
          this.setState({
            downloadProgress: false,
            showDownload: false,
            variant: "error",
            error: `${t('componentData.paymentDetailss.noDataToDownload')}`
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

  shouldActionButtonEnable = (type) => {
    const approveStatuses = approveFileStatusList;
    const rejectStatuses = rejectFileStatusList;

    const { selectedData } = this.state;
    let shouldEnable = false;
    if (type === "approve") {
      if (selectedData &&
        selectedData.length > 0 &&
        selectedData.every((item) =>
          approveStatuses.includes(item.FileStatusId))
      ) {
        shouldEnable = true;
      }
    } else if (type === "reject") {
      if (selectedData &&
        selectedData.length > 0 &&
        selectedData.every((item) =>
          rejectStatuses.includes(item.FileStatusId))
      ) {
        shouldEnable = true;
      }
    }

    return shouldEnable;
  };
  hideAlertMessage = () => {
    this.setState({
      error: null,
      variant: null
    })
  }
  render() {
    const {
      selectedFilterItem,
      isLoading,
      error,
      statusList,
      openFiltersSection,
    } = this.state;
    const { classes, user, t } = this.props;
    const columns = [
      { id: "FileName", label: "FileName" },
      { id: "FileID", label: "FileID" },
      { id: "FileUploaded", label: "UploadedAt" },
      { id: "NoOfPayees", label: "NoOfPayees" },
      { id: "FileStatus", label: "Status" },
    ];
    const {
      page,
      rows,
      rowsPerPage,
      totalRecords,
      name,
      id,
      count,
      noOfPayees,
      startDate,
      endDate,
      showDownload,
      selectedIds,
      variant,
    } = this.state;
    if (isLoading) {
      return (
        <Box className="loader-container">
          <CircularProgress color="primary" />
        </Box>
      );
    }

    const isCampaignFileApproveEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_CAMPAIGN_FILE_APPROVE"])) ||
      false;
    const isCampaignFileRejectEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_CAMPAIGN_FILE_REJECT"])) ||
      false;

    const isCampaignDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_CAMPAIGN_FILE_DOWNLOAD"])) ||
      false;

    return (
      <Box mx={6} my={2}>


        <Grid container xs={12} className={classes.root}>
          <Paper className={classes.paper} elevation={0}>
            <Grid
              container
              item
              xs={12}
              md={12}
              justify="flex-end"
              className={classes.gridItem}
            >
              <Box display="flex" justifyContent="flex-end">
                <Box mt={1} mr={1} className="button-container">
                  <Box>
                    {isCampaignDownloadEnabled && (
                      <ExportAsBtn
                        onClick={(e) => {
                          this.setState({
                            showDownload: true,
                            anchorEl: e.currentTarget,
                          });
                        }}
                        btnName={t("componentData.importPaymentFiles.ExportAs")}
                      />
                    )}
                    {showDownload && this.renderDownloadOptions(showDownload)}
                  </Box>

                  <Box>
                    {isCampaignFileApproveEnabled && (
                      <Button
                        color={
                          this.shouldActionButtonEnable("approve")
                            ? "primary"
                            : ""
                        }
                        onClick={() => this.handleBtnClick("APPROVED")}
                        disabled={
                          this.shouldActionButtonEnable("approve")
                            ? false
                            : true
                        }
                      >
                        <CheckCircleIcon fontSize="small" />
                        <Typography variant="h6" className={classes.iconText}>
                          {t("componentData.importPaymentFiles.Approve")}
                        </Typography>
                      </Button>
                    )}
                  </Box>

                  <Box>
                    {isCampaignFileRejectEnabled && (
                      <Button
                        color={
                          this.shouldActionButtonEnable("reject")
                            ? "primary"
                            : ""
                        }
                        onClick={() => this.handleBtnClick("REJECTED")}
                        disabled={
                          this.shouldActionButtonEnable("reject") ? false : true
                        }
                      >
                        <CancelIcon fontSize="small" />
                        <Typography variant="h6" className={classes.iconText}>
                          {t("componentData.importPaymentFiles.Reject")}
                        </Typography>
                      </Button>
                    )}
                  </Box>

                  <Box>
                    <Button
                      color="primary"
                      aria-label="View"
                      title={t("componentData.importPaymentFiles.ViewFilter")}
                      component="span"
                      className={classes.smallBtn}
                      onClick={() => {
                        this.setState({
                          openFiltersSection: true,
                        });
                      }}
                    >
                      <img
                        src={require(`~/assets/icons/icon_filter.svg`)}
                        alt={t("componentData.importPaymentFiles.ViewFilter")}
                        className={classes.imgIcon}
                      />
                      <Typography variant="h6" className={classes.iconText}>
                        {t("componentData.importPaymentFiles.Filters")}
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={12}
              justify="flex-start"
              className={classes.gridItem}
            >
              <Box display="flex" width="100%" justifyContent="flex-start">
                <ChipFilter
                  list={statusList}
                  handleClickFilter={this.handleClickFilter.bind(this)}
                  selectedFilterItem={selectedFilterItem}
                />
              </Box>
            </Grid>
          </Paper>
        </Grid>
        <Box pb={2}>
          <TableContainer
            component={Paper}
            elevation={0}
            style={{ overflowX: "visible" }}
          >
            <Table aria-label="file process table">
              <TableHead>
                <TableRow>
                  {rows && rows.length > 0 && <TableCell
                    padding="checkbox"
                    className={classes.supTable}
                  ></TableCell>}
                  {columns.map((column) => (
                    <TableCell
                      style={{
                        wordBreak: "normal",
                        width: "15%",
                        whiteSpace: "nowrap",
                      }}
                      align="center"
                      key={column.id}
                      className={classes.supTable}
                    >
                      <Box fontSize={16} fontWeight="600" whiteSpace="nowrap">
                        {t(
                          `componentData.supplierCampaignFile.${column.label}`
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {!isLoading ? (
                <TableBody>
                  {rows && rows.length > 0 ? (
                    rows.map((row) => (
                      <TableRow
                        key={row.FileID}
                        className={classes.tbleRow}
                        onClick={() =>
                          this.props.history.push({
                            pathname: `${config.baseName}/suppliers/campaignFiles/fileDetails`,
                            state: {
                              data: row,
                            }
                          })
                        }
                      >
                        {row.FileStatusId === CONSUMER_CAMPAIGN_STATUSIDS.WAITINGFORAPPROVAL ? <TableCell padding="checkbox">
                          <Checkbox
                            onClick={(e) => this.handleSelection(e, row)}
                            id={row.FileID}
                            checked={
                              selectedIds.includes(row.FileID.toString())
                                ? true
                                : false
                            }
                          />
                        </TableCell> : <TableCell padding="checkbox"></TableCell>}
                        <TableCell
                          align="center"
                          style={{
                            width: "25%",
                            wordBreak: "break-word",
                            cursor: "pointer",
                          }}
                        >
                          <Box fontWeight="700" title={row.FileName}>
                            {row.FileName && row.FileName.length > 37
                              ? row.FileName.substring(0, 37) + "..."
                              : row.FileName}
                          </Box>
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            width: "10%",
                            wordBreak: "break-word",
                            cursor: "pointer",
                          }}>
                          <Box fontWeight="700" title={row.FileID}>
                            {row.FileID}
                          </Box>
                        </TableCell>
                        <TableCell align="center" style={{ width: "16%" }}>
                          {row.FileUploaded}
                        </TableCell>
                        <TableCell align="center" style={{ width: "25%" }}>
                          {row.TotalPayee}
                        </TableCell>
                        <TableCell align="center" style={{ width: "30%" }}>
                          {" "}
                          <LightBlueBtn color={row.StatusColor}> {row.FileStatus} </LightBlueBtn>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow >
                      <TableCell align="center" colSpan={6}>
                        <Box display="flex" justifyContent="center" my={6} flexDirection="column">
                          <Box >
                            <img
                              alt="No Data"
                              src={require("~/assets/icons/bankFile_No_data.svg")}
                            />
                          </Box>
                          <Box py={3} color="#A1A1A1" fontSize={14} >
                            {" "}
                            {t(
                              "componentData.importPaymentFiles.NoDataToShow"
                            )}{" "}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              ) : (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage={t("componentData.importPaymentFiles.Rowsperpage")}
            rowsPerPageOptions={[10, 25, 50]}
            component={Paper}
            elevation={0}
            style={{ width: "100%" }}
            count={totalRecords || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('componentData.fileName.Of')} ${count !== -1 ? count : `${t('componentData.fileName.MoreThan')} ${to}`}`}
          />
        </Box>
        {error && <Notification variant={variant} message={error} handleClose={this.hideAlertMessage} />}
        {
          openFiltersSection && (
            <CustomDialog
              showButton={false}
              alignSide={true}
              onConfirm={() => {
                this.setState({
                  openFiltersSection: false,
                });
              }}
              title={t("componentData.importPaymentFiles.Filters")}
              icon={true}
              width="400px"
            >
              <PaymentFileFilters
                name={name}
                id={id}
                count={count}
                noOfPayees={noOfPayees}
                startDate={startDate}
                endDate={endDate}
                handleChangeInput={(e) => {
                  const name = e.target.name, value = e.target.value;
                  this.setState({
                    [name]: (name === "id" || name === "noOfPayees") ? value.replace(/[^0-9]/g, "") : value,
                  });
                }}
                isCampaignFlag={true}
                updateDateFilter={(name, value) => {
                  let date = new Date(value);
                  const { endDate } = this.state;
                  const newVal =
                    (date.getMonth() > 8
                      ? date.getMonth() + 1
                      : "0" + (date.getMonth() + 1)) +
                    "/" +
                    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
                    "/" +
                    date.getFullYear();
                  if (name === "startDate" && endDate.length === 0) {
                    this.setState({
                      [name]: newVal,
                      endDate:
                        (new Date().getMonth() > 8
                          ? new Date().getMonth() + 1
                          : "0" + (new Date().getMonth() + 1)) +
                        "/" +
                        (new Date().getDate() > 9
                          ? new Date().getDate()
                          : "0" + new Date().getDate()) +
                        "/" +
                        new Date().getFullYear(),
                    });
                  } else {
                    this.setState({
                      [name]: newVal,
                    });
                  }
                }}
                applySupplierFilter={this.applySupplierFilter}
                resetSupplierFilter={this.resetSupplierFilter}
              />
            </CustomDialog>
          )
        }
        {showDownload && this.renderDownloadOptions(showDownload)}
      </Box >
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  withTranslation()(withStyles(styles)(CampaignFile))
);
