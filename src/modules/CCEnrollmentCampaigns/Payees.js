import React from "react";
import {
  Grid,  
  Box,  
  InputAdornment,  
  TextField,
  Paper,  
  TableRow,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,  
  Menu,
  MenuItem,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { connect } from "react-redux";
import styles from "./styles";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/styles";
import SearchIcon from "@material-ui/icons/Search";
import Notification from "~/components/Notification";
import {  
  fetchCCEnrollmentStatuses,
  fetchCCSupplierList,
} from "~/redux/actions/CC/campaign";
import ExportAsBtn from "~/components/ExportAsBtn";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { accessRights } from "~/config/accessRights";

class Payees extends React.Component {
  state = {
    payeeList: [],
    totalCount: 10,
    page: 0,
    rowsPerPage: 10,
    enrollmentStatus: "5",
    statusList: [],
    searchName: "",
    error: false,
    variant: "error",
    fetchingList: true,
    showDownload: false,
    anchorEl: null,
    downloadProgress: false,
  };

  componentDidMount() {
    this.getPayeesList();
    this.getEnrollmentStatuses();
  }
  getPayeesList = () => {
    const { searchName, page, rowsPerPage, enrollmentStatus } = this.state;
    const { item } = this.props;
    this.props
      .dispatch(
        fetchCCSupplierList({
          campaignId: item.ccCampaignId,
          name: searchName || "",
          id: enrollmentStatus,
          page: page,
          rowsPerPage: rowsPerPage,
          isDownload:false
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            variant: "error",
            error: this.props.campaign.error,
            fetchingList: false,
          });
          return false;
        }

        this.setState({
          fetchingList: false,
          payeeList: this.props.campaign.payeesList,
          totalCount: this.props.campaign.totalCount,
        });
      });
  };

  getEnrollmentStatuses = () => {
    this.props.dispatch(fetchCCEnrollmentStatuses()).then((response) => {
      if (!response) {
        this.setState({
          variant: "error",
          error: this.props.campaign.error,
        });
        return false;
      }

      this.setState({
        statusList: this?.props?.campaign?.enrollmentStatusList || [],
      });
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage,
      },
      () => {
        this.getPayeesList();
      }
    );
  };
  handleChangeRowsPerPage = (event) => {
    this.setState(
      {
        rowsPerPage: +event.target.value,
        page: 0,
      },
      () => {
        this.getPayeesList();
      }
    );
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value,
        rowsPerPage: 10,
        page: 0,
      },
      () => {
        this.getPayeesList();
      }
    );
  };
  handleSearchClick = () => {
    this.setState(
      {
        page: 0,
        rowsPerPage: 10,
      },
      () => {
        this.getPayeesList();
      }
    );
  };
  handleSearch = (event) => {
    if (event.keyCode === 13) {
      this.setState(
        {
          page: 0,
          rowsPerPage: 10,
        },
        () => {
          this.getPayeesList();
        }
      );
    }
  };
  handleNotificationClose = () => {
    this.setState({
      error: null,
    });
  };

  handleDownloadCSV = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    const fileName = `campaign_list_${dateStr}.xlsx`;
    const { t ,item} = this.props;
    const { statusList } = this.state;
    const vendorsList = await this.props.dispatch(
      fetchCCSupplierList({ campaignId: item.ccCampaignId, isDownload: true })
    );
    this.setState(
      {
        downloadProgress: true,
        variant: "success",
        error: t("componentData.mySupplier.downloadFile"),
      },
      () => {
        if (vendorsList && vendorsList.length > 0) { 
          const tableRows = [];          
          vendorsList.forEach((field) => {
            const data = {};
            data[t("componentData.CCEnrollmentCampaign.Payee Name")] =
              field.supplierName;
            data[t("componentData.CCEnrollmentCampaign.Payee ID")] =
              field.supplierId;
            data[t("componentData.CCEnrollmentCampaign.Annual Spend")] =
              field.annualVolume;
            data[t("componentData.CCEnrollmentCampaign.Status")] =
              statusList.find((v) => v.bucketId === field.bucketId)
                ?.bucketType || "-";
            data[t("componentData.CCEnrollmentCampaign.Sub Status")] =
              field.reason;            
            tableRows.push(data);
          });
          const payeeTitle = t("componentData.supplierDetail.CampaignList");
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
        {/* <MenuItem onClick={() => this.handleDownloadPDF()}>.PDF</MenuItem> */}
      </Menu>
    );
  };
  render() {
    const { classes,user, t } = this.props;
    const {
      payeeList,
      totalCount,
      page,
      rowsPerPage,
      enrollmentStatus,
      statusList,
      error,
      variant,
      fetchingList,
      showDownload      
    } = this.state;
    const columns = [
      { id: "name", label: "Payee Name" },
      { id: "id", label: "Payee ID" },
      { id: "spend", label: "Annual Spend" },
      { id: "status", label: "Status" },
      { id: "subStatus", label: "Sub Status" },
    ];
    const isDownloadEnabled =
       (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_ENROLLMENT_CAMPAIGN_PAYEE_DOWNLOAD"]
        )) ||
      false;
      
    return (
      <Grid item xs={12} className={classes.campaignsStatus}>
        <Paper className={classes.table} elevation={0}>
          <Grid container item xs={12} md={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              flexGrow={1}
              alignItems="start"
              p={2}
            >
              <Box display="flex" width="25%">
                <TextField
                  fullWidth={true}
                  select
                  autoComplete="off"
                  variant="outlined"
                  name="enrollmentStatus"
                  label={t(
                    "componentData.CCEnrollmentCampaign.EnrollmentStatus"
                  )}
                  value={enrollmentStatus || ""}
                  onChange={(event) => this.handleChange(event)}
                >
                  {statusList.map((list) => (
                      <MenuItem key={list.bucketId} value={list.bucketId}>
                        {list.bucketType}
                      </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box display="flex">
                {isDownloadEnabled && (
                  <Box px={2}>
                    <ExportAsBtn
                      onClick={(e) => {
                        this.setState({
                          showDownload: true,
                          anchorEl: e.currentTarget,
                        });
                      }}
                      btnName={t("componentData.supplierDetail.ExportAs")}
                    />
                    {showDownload && this.renderDownloadOptions(showDownload)}
                  </Box>
                )}

                <TextField
                  size="small"
                  id="emni"
                  className={classes.searchBox}
                  placeholder={t("componentData.CCEnrollmentCampaign.Search")}
                  inputProps={{
                    "aria-label": t(
                      "componentData.CCEnrollmentCampaign.Search"
                    ),
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          aria-label="search"
                          onClick={() => this.handleSearchClick()}
                          onMouseDown={null}
                          edge="end"
                          style={{ paddingLeft: "62%" }}
                        >
                          <SearchIcon />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event) =>
                    this.setState({ searchName: event.target.value })
                  }
                  onKeyDown={(event) => this.handleSearch(event)}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Grid>

          <Grid container item xs={12} md={12}>
            <Grid item xs={12}>
              <Box
                display="flex"
                width="100%"
                justifyContent="flex-start"
              ></Box>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={12}>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align="left"
                          className={classes.supTable}
                        >
                          <Box
                            fontSize={16}
                            fontWeight="600"
                            color="rgba(18,18,18,0.87)"
                          >
                            {t(
                              `componentData.CCEnrollmentCampaign.${column.label}`
                            )}
                          </Box>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody className={classes.bodyTextColor}>
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
                      <>
                        {payeeList?.length > 0 &&
                          payeeList.map((payee) => (
                            <TableRow>
                              <TableCell
                                align="left"
                                className={classes.textBold}
                                title={payee.supplierName}
                              >
                                {payee?.supplierName || "-"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.textBold}
                                key={payee.supplierId}
                              >
                                {payee?.supplierId || "-"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.textBold}
                              >
                                {payee?.annualVolume || "-"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.textBold}
                              >
                                {" "}
                                {statusList.find(
                                  (v) => v.bucketId === payee?.bucketId
                                )?.bucketType || "-"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.textBold}
                              >
                                {payee?.reason || "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        {payeeList?.length === 0 && (
                          <Grid
                            container
                            style={{
                              padding: "10px 0",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              style={{
                                position: "absolute",
                                left: "48%",
                              }}
                            >
                              {t("componentData.mySupplier.NoResultsFound")}
                            </Grid>
                          </Grid>
                        )}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                labelRowsPerPage={t("componentData.supplierDetail.rowsPerPage")}
                rowsPerPageOptions={[10, 25, 50]}
                colSpan={3}
                component="div"
                count={totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": t("componentData.supplierDetail.rowsPerPage"),
                  },
                  native: true,
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} ${t("componentData.fileName.Of")} ${
                    count !== -1
                      ? count
                      : `${t("componentData.fileName.MoreThan")} ${to}`
                  }`
                }
              />
            </Grid>
          </Grid>
        </Paper>
        {error && (
          <Notification
            variant={variant}
            message={error}
            handleClose={this.handleNotificationClose}
            onClose={this.handleNotificationClose}
          />
        )}
      </Grid>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.ccCampaign,
  }))(withStyles(styles)(Payees))
);
