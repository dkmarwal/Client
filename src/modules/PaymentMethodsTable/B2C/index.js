import React, { Fragment } from "react";
import {
  Grid,
  Box,
  Button,
  CircularProgress,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Menu,
  MenuItem,
  Chip,
} from "@material-ui/core";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import ExportAsBtn from "~/components/ExportAsBtn";
import * as XLSX from "xlsx";
import generatePDF from "~/modules/GeneratePDF/";
import * as FileSaver from "file-saver";
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
} from "~/components/StyledTable";
import "./styles.scss";
import { withTranslation } from "react-i18next";
import { paymentMethods } from "~/config/paymentMethods";
import Settlement_Account_Chip from '~/assets/icons/Settlement_Account_Chip.svg'

class PaymentMethodsTable extends React.Component {
  state = {
    showDownload: false,
    downloadProgress: false,
    page: 0,
    rowsPerPage: 10,
    sortColumn: "reportName",
    sortOrder: "asc",
    name: "",
  };

  handleDownloadCSV = async (array) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const { selectedChip, t } = this.props;
    const date = new Date().toLocaleString(this.props.i18n.language, 
    {
      day: "numeric", 
      month: "short", 
      year: "numeric", 
      hour: "numeric", 
      minute: "numeric", 
      second: "numeric"
    }).replace(/[^ -~]/g, "").split(' ');    
    let dateStr = date[0] + date[1] + date[2] + date[3];
    var regex = /[.,\s]/g;
    dateStr = dateStr.replace(regex, '');
    const fileName = `${t('componentData.fileName.file')}_${t('componentData.fileName.list')}_${dateStr}.xlsx`;
    let list = array;
    if (selectedChip === "CHK" && Object.keys(list[0]).length === 0) {
      list = undefined;
    }
    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (list && list.length > 0) {
          const tableRows = [];

          list.forEach((field) => {
            const data = {};
            if (selectedChip === "ACH") {
              data[t("componentData.paymentMethods.AccountName")] =
                field.accountName;
              data[t("componentData.paymentMethods.AccountNumber")] =
                field.accountNumber;
              data[t("componentData.paymentMethods.DateAdded")] =
                field.createdAt
                  ? new Date(field.createdAt)
                      .toLocaleDateString(this.props.i18n.language, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      .replace(/[^ -~]/g, "")
                  : "";
            } else {
              if (selectedChip === paymentMethods["PayPal"]) {
                data[t("componentData.paymentMethods.WorldlinkID")] =
                  field.worldlinkId;
                data[t("componentData.paymentMethods.ClientBIC")] =
                  field.clientBIC;
                data[t("componentData.paymentMethods.ClientSenderAccount")] =
                  field.senderAccountNumber;
                data[t("componentData.paymentMethods.SenderName")] =
                  field.senderName;
              } else {
                if (selectedChip === "CHK") {
                  data[
                    t("componentData.paymentMethods.ediInterchangeSenderId")
                  ] = field.ediInterchangeSenderId;
                  data[
                    t("componentData.paymentMethods.ediInterchangeReceiverId")
                  ] = field.ediInterchangeReceiverId;
                  data[t("componentData.paymentMethods.ediGroupSenderId")] =
                    field.ediGroupSenderId;
                  data[t("componentData.paymentMethods.ediGroupReceiverId")] =
                    field.ediGroupReceiverId;
                  data[t("componentData.paymentMethods.originatingCompanyID")] =
                    field.originatingCompanyID;
                } else {
                  if (selectedChip === paymentMethods["PushToCard"]) {
                    data[t("componentData.paymentMethods.PartnerID")] =
                      field.partnerId;
                    data[t("componentData.paymentMethods.senderAccount")] =
                      field.senderAccount;
                    data[
                      t("componentData.paymentMethods.ClientSenderName")
                    ] = `${field.senderFirstName} ${field.senderLastName}`;
                    data[
                      t("componentData.paymentMethods.MerchantCategoryCode")
                    ] = field.masterMerchantCatCode
                      ? field.masterMerchantCatCode
                      : field.visaMerchantCatCode;
                  } else {
                    //For Zelle account
                    data[t("componentData.paymentMethods.SenderType")] = field.senderType;
                    data[t("componentData.paymentMethods.SenderName")] = field.senderName;
                    data[t("componentData.paymentMethods.ProductType")] = field.productType;
                    data[t("componentData.paymentMethods.DateAdded")] = field.createdAt
                                                                        ? new Date(field.createdAt)
                                                                            .toLocaleDateString(this.props.i18n.language, {
                                                                              year: "numeric",
                                                                              month: "long",
                                                                              day: "numeric",
                                                                            })
                                                                            .replace(/[^ -~]/g, "")
                                                                        : "";
                  }
                }
              }
            }
            tableRows.push(data);
          });
          const payementFiles = t(
            "componentData.paymentMethodTable.PaymentFiles"
          );
          const ws = XLSX.utils.json_to_sheet(tableRows);
          const wb = {
            Sheets: {},
            SheetNames: [payementFiles],
          };
          wb.Sheets[payementFiles] = ws;

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

  handleDownloadPDF = async (array) => {
    const { t } = this.props;
    const { selectedChip } = this.props;
    let list = array;
    const tempProp = this.props;
    if (selectedChip === "CHK" && Object.keys(list[0]).length === 0) {
      list = undefined;
    }
    this.setState(
      {
        downloadProgress: true,
      },
      function () {
        if (list && list.length > 0) {
          const tableColumn =
            selectedChip === "ACH"
              ? [
                  t("componentData.paymentMethods.AccountName"),
                  t("componentData.paymentMethods.AccountNumber"),
                  t("componentData.paymentMethods.DateAdded"),
                ]
              : selectedChip === paymentMethods["PayPal"]
              ? [
                  t("componentData.paymentMethods.WorldlinkID"),
                  t("componentData.paymentMethods.ClientBIC"),
                  t("componentData.paymentMethods.ClientSenderAccount"),
                  t("componentData.paymentMethods.SenderName"),
                ]
              : selectedChip === "CHK"
              ? [
                  t("componentData.paymentMethods.ediInterchangeSenderId"),
                  t("componentData.paymentMethods.ediInterchangeReceiverId"),
                  t("componentData.paymentMethods.ediGroupSenderId"),
                  t("componentData.paymentMethods.ediGroupReceiverId"),
                  t("componentData.paymentMethods.originatingCompanyID")
                ]
              : selectedChip === paymentMethods["PushToCard"]
              ? [
                  t("componentData.paymentMethods.PartnerID"),
                  t("componentData.paymentMethods.senderAccount"),
                  t("componentData.paymentMethods.ClientSenderName"),
                  t("componentData.paymentMethods.MerchantCategoryCode"),
                ]
              : [
                  t("componentData.paymentMethods.SenderType"),
                  t("componentData.paymentMethods.SenderName"),                
                  t("componentData.paymentMethods.ProductType"),     
                  t("componentData.paymentMethods.DateAdded"),            
                ]; //For Zelle account

          var tableRows = [];
          list.forEach(function (field) {
            const data =
              selectedChip === "ACH"
                ? [
                    field.accountName,
                    field.accountNumber,
                    field.createdAt
                      ? new Date(field.createdAt)
                          .toLocaleDateString(tempProp.i18n.language, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                          .replace(/[^ -~]/g, "")
                      : "",
                  ]
                : selectedChip === paymentMethods["PayPal"]
                ? [
                    field.worldlinkId,
                    field.clientBIC,
                    field.senderAccountNumber,
                    field.senderName,
                  ]
                : selectedChip === "CHK"
                ? [
                    field.ediInterchangeSenderId,
                    field.ediInterchangeReceiverId,
                    field.ediGroupSenderId,
                    field.ediGroupReceiverId,
                    field.originatingCompanyID
                  ]
                : selectedChip === paymentMethods["PushToCard"]
                ? [
                    field.partnerId,
                    field.senderAccount,
                    `${field.senderFirstName} ${field.senderLastName}`,
                    field.masterMerchantCatCode
                      ? field.masterMerchantCatCode
                      : field.visaMerchantCatCode,
                  ]
                : [
                    field.senderType,
                    field.senderName,
                    field.productType,
                    field.createdAt
                      ? new Date(field.createdAt)
                          .toLocaleDateString(tempProp.i18n.language, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                          .replace(/[^ -~]/g, "")
                      : "",
                  ]; //For Zelle account

            tableRows.push(data);
          });
          var title = t("componentData.paymentMethodTable.MyFiles");
          const date = new Date().toLocaleString(this.props.i18n.language, 
            {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "numeric",
              minute: "numeric", 
              second: "numeric"
            }).replace(/[^ -~]/g, "").split(' ');    
          let dateStr = date[0] + date[1] + date[2] + date[3];
          var regex = /[.,\s]/g;
          dateStr = dateStr.replace(regex, '');
          const fileName = `${t('componentData.fileName.files')}_${dateStr}.pdf`;
          generatePDF(title, fileName, tableColumn, tableRows);
          this.setState({
            downloadProgress: false,
            showDownload: false,
          });
        }
      }
    );
  };
  renderDownloadOptions = (showDownload, array) => {
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
        <MenuItem onClick={() => this.handleDownloadCSV(array)}>.XLSX</MenuItem>
        <MenuItem onClick={() => this.handleDownloadPDF(array)}>.PDF</MenuItem>
      </Menu>
    );
  };

  handlePageChange = (event, page) => {
    const { sortColumn, sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    this.setState({
      page,
      sortColumn: sortColumn,
      sortOrder: newSortOrder,
    });
  };

  handleRowsPerPageChange = (event) => {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    this.setState({
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10),
      sortOrder: newSortOrder,
    });
  };

  render() {
    const {
      theme,
      fetchingList,
      accounts,
      paymentType,
      canEdit = true,
      canAdd = true,
      canDownload = true,
      filterChips,
      selectedChip,
      hanldeFilterChips,
      t,
    } = this.props;
    const { showDownload } = this.state;

    return (
      <div>
        <Box py={1} px={2}>
          <span>
            <Box my={2}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="chipContiner">
                  {filterChips &&
                    filterChips.map((chip, i) => (
                      <span>
                        <Chip
                          label={chip.label}
                          size="small"
                          color={
                            chip["alias"] === selectedChip ? "primary" : ""
                          }
                          className={
                            chip["alias"] === selectedChip
                              ? "chipSelectedColor"
                              : "chipUnselectedColor"
                          }
                          onClick={() => hanldeFilterChips(chip["key"])}
                        />
                      </span>
                    ))}
                </div>

                {canDownload && (
                  <div>
                    <ExportAsBtn
                      onClick={(e) => {
                        this.setState({
                          showDownload: true,
                          anchorEl: e.currentTarget,
                        });
                      }}
                      btnName={t("componentData.paymentMethodTable.ExportAs")}
                    />
                    {showDownload &&
                      this.renderDownloadOptions(showDownload, accounts)}
                  </div>
                )}
              </div>
            </Box>
          </span>
        </Box>
        {selectedChip === "ACH" ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: "rgba(204,228,255,0.75)",
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.AccountName")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.AccountNumber")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.DateAdded")}
                  </StyledTableCell>
                  <StyledTableCell />
                </TableRow>
              </StyledTableHead>
              {!fetchingList && accounts && accounts.length > 0 ? (
                <TableBody>
                  {fetchingList ? (
                    <TableRow>
                      <TableCell colSpan={6}>
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
                    accounts &&
                    accounts.map((item, index) => {
                      return (
                        <Fragment key={index}>
                          <StyledTableRow>
                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.accountName}
                              {item.isSettlementAccount === 1 && <img src={Settlement_Account_Chip} alt="Settlement Account" style={{paddingLeft:'16px'}} />}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.accountNumber}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.createdAt
                                ? new Date(item.createdAt)
                                    .toLocaleDateString(
                                      this.props.i18n.language,
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )
                                    .replace(/[^ -~]/g, "")
                                : ""}
                            </StyledTableCell>

                            <StyledTableCell className="tablePadding">
                              {canEdit && (
                                <img
                                  style={{ float: "right" }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}                                  
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=""                                  
                                />
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        </Fragment>
                      );
                    })
                  )}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        display="flex"
                        p={5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          className="menu-icon"
                          alt=""
                        />
                      </Box>
                      <Box
                        style={{ display: "table", margin: "0 auto" }}
                        p={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <h4>{t("componentData.paymentMethodTable.txtMsg")}</h4>
                        <Box
                          p={2}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {canAdd && (
                            <Button                              
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant="outlined"
                              onClick={() => this.props.addAccount()}
                              color="secondary"                              
                              startIcon={<AddIcon />}
                            >
                              {t("componentData.paymentMethodTable.addAcc")}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </Grid>
        )
        : selectedChip === paymentMethods["Zelle"] ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: "rgba(204,228,255,0.75)",
                }}
              >                      
                <TableRow>
                  <StyledTableCell>{t("componentData.paymentMethods.SenderType")}</StyledTableCell>
                  <StyledTableCell>{t("componentData.paymentMethods.SenderName")}</StyledTableCell>
                  <StyledTableCell>{t("componentData.paymentMethods.ProductType")}</StyledTableCell>
                  <StyledTableCell>{t("componentData.paymentMethods.DateAdded")}</StyledTableCell>                  
                  <StyledTableCell />
                </TableRow>
              </StyledTableHead>
              {!fetchingList && accounts.length > 0 ? (
                <TableBody>
                  {fetchingList ? (
                    <TableRow>
                      <TableCell colSpan={6}>
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
                    accounts &&
                    accounts.map((item, index) => {
                      return (
                        <Fragment key={index}>
                          <StyledTableRow>
                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.senderType}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.senderName}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.productType}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.createdAt
                                ? new Date(item.createdAt)
                                    .toLocaleDateString(
                                      this.props.i18n.language,
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )
                                    .replace(/[^ -~]/g, "")
                                : ""}
                            </StyledTableCell>                            

                            <StyledTableCell className="tablePadding">
                              {canEdit && (
                                <img
                                  style={{ float: "right" }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}                                  
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=""
                                />
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        </Fragment>
                      );
                    })
                  )}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        display="flex"
                        p={5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          className="menu-icon"
                          alt=""
                        />
                      </Box>
                      <Box
                        style={{ display: "table", margin: "0 auto" }}
                        p={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <h4>{t("componentData.paymentMethodTable.txtMsg")}</h4>
                        <Box
                          p={2}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {canAdd && (
                            <Button                              
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant="outlined"
                              onClick={() => this.props.addAccount()}
                              color="secondary"                              
                              startIcon={<AddIcon />}
                            >
                              {t("componentData.paymentMethodTable.addAcc")}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </Grid>
        ) : selectedChip === paymentMethods["PayPal"] ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: "rgba(204,228,255,0.75)",
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.WorldlinkID")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.ClientBIC")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.ClientSenderAccount")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.SenderName")}
                  </StyledTableCell>
                  <StyledTableCell />
                </TableRow>
              </StyledTableHead>
              {!fetchingList && accounts.length > 0 ? (
                <TableBody>
                  {fetchingList ? (
                    <TableRow>
                      <TableCell colSpan={6}>
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
                    accounts &&
                    accounts.map((item, index) => {
                      return (
                        <Fragment key={1}>
                          <StyledTableRow>
                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.worldlinkId}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.clientBIC}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.senderAccountNumber}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              style={{ maxWidth: "200px" }}
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              <Box
                                maxWidth="98%"
                                textOverflow="ellipsis"
                                overflow="hidden"
                                whiteSpace="nowrap"
                                title={item.senderName}
                              >
                                {item.senderName}
                              </Box>
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              style={{ maxWidth: "10%" }}
                            >
                              {canEdit && (
                                <img
                                  style={{ float: "right" }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}                                  
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=""
                                />
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        </Fragment>
                      );
                    })
                  )}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        display="flex"
                        p={5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          className="menu-icon"
                          alt=""
                        />
                      </Box>
                      <Box
                        style={{ display: "table", margin: "0 auto" }}
                        p={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <h4>{t("componentData.paymentMethodTable.txtMsg")}</h4>
                        <Box
                          p={2}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {canAdd && (
                            <Button                              
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant="contained"
                              onClick={() => this.props.addAccount()}
                              color="secondary"                              
                              startIcon={<AddIcon />}
                            >
                              {t("componentData.paymentMethodTable.addAcc")}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </Grid>
        ) : selectedChip === paymentMethods["PushToCard"] ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: "rgba(204,228,255,0.75)",
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.PartnerID")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.senderAccount")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.ClientSenderName")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.MerchantCategoryCode")}
                  </StyledTableCell>
                  <StyledTableCell />
                </TableRow>
              </StyledTableHead>
              {!fetchingList && accounts.length > 0 ? (
                <TableBody>
                  {fetchingList ? (
                    <TableRow>
                      <TableCell colSpan={6}>
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
                    accounts &&
                    accounts.map((item, index) => {
                      return (
                        <Fragment key={index}>
                          <StyledTableRow>
                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.partnerId}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.senderAccount}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {`${item.senderFirstName?item.senderFirstName:''} ${item.senderLastName?item.senderLastName:''}`}
                            </StyledTableCell>

                            <StyledTableCell
                              className="tablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.masterMerchantCatCode
                                ? item.masterMerchantCatCode
                                : item.visaMerchantCatCode}
                            </StyledTableCell>

                            <StyledTableCell className="tablePadding">
                              {canEdit && (
                                <img
                                  style={{ float: "right" }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}                                  
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=""                                  
                                />
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        </Fragment>
                      );
                    })
                  )}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        display="flex"
                        p={5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          className="menu-icon"
                          alt=""
                        />
                      </Box>
                      <Box
                        style={{ display: "table", margin: "0 auto" }}
                        p={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <h4>{t("componentData.paymentMethodTable.txtMsg")}</h4>
                        <Box
                          p={2}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {canAdd && (
                            <Button                              
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant="contained"
                              onClick={() => this.props.addAccount()}
                              color="secondary"                              
                              startIcon={<AddIcon />}
                            >
                              {t("componentData.paymentMethodTable.addAcc")}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </Grid>
        ) : (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: "rgba(204,228,255,0.75)",
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.ediInterchangeSenderId")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.ediInterchangeReceiverId")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.ediGroupSenderId")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.ediGroupReceiverId")}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t("componentData.paymentMethods.originatingCompanyID")}
                  </StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </StyledTableHead>
              {!fetchingList && Object.keys(accounts[0]).length > 0 ? (
                <TableBody>
                  {fetchingList ? (
                    <TableRow>
                      <TableCell colSpan={6}>
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
                    accounts &&
                    paymentType === "check" &&
                    accounts.map((item, index) => {
                      return (
                        <Fragment key={index}>
                          <StyledTableRow>
                            <StyledTableCell
                              className="chipCheckTablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.ediInterchangeSenderId}
                            </StyledTableCell>

                            <StyledTableCell
                              className="chipCheckTablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.ediInterchangeReceiverId}
                            </StyledTableCell>

                            <StyledTableCell
                              className="chipCheckTablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.ediGroupSenderId}
                            </StyledTableCell>

                            <StyledTableCell
                              className="chipCheckTablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.ediGroupReceiverId}
                            </StyledTableCell>

                            <StyledTableCell
                              className="chipCheckTablePadding"
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.originatingCompanyID}
                            </StyledTableCell>

                            <StyledTableCell className="chipCheckTablePadding">
                              {canEdit && (
                                <img
                                  style={{ float: "right" }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}                                  
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=""                                  
                                />
                              )}
                            </StyledTableCell>
                          </StyledTableRow>
                        </Fragment>
                      );
                    })
                  )}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box
                        display="flex"
                        p={5}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          className="menu-icon"
                          alt=""
                        />
                      </Box>
                      <Box
                        style={{ display: "table", margin: "0 auto" }}
                        p={2}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <h4>{t("componentData.paymentMethodTable.txtMsg")}</h4>
                        <Box
                          p={2}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {canAdd && (
                            <Button
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant="contained"
                              onClick={() => this.props.addAccount()}
                              color="secondary"
                              startIcon={<AddIcon />}
                            >
                              {t("componentData.paymentMethodTable.addAcc")}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </Grid>
        )}
      </div>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.role }))(PaymentMethodsTable)
);
