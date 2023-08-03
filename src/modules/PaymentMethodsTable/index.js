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
  Tooltip
} from "@material-ui/core";
import { connect } from "react-redux";
import CurrencyFlag from "react-currency-flags";
import AddIcon from "@material-ui/icons/Add";
import ExportAsBtn from "~/components/ExportAsBtn";
import * as XLSX from "xlsx";
import generatePDF from "~/modules/GeneratePDF/";
import * as FileSaver from "file-saver";
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledTableFooter,
} from "~/components/StyledTable";
import "./styles.scss";
import { withTranslation } from 'react-i18next';
import { PayerTypes } from "~/config/entityTypes";

class PaymentMethodsTable extends React.Component {
  state = {
    showDownload: false,
    downloadProgress: false
  };

  handleDownloadCSV = async (array) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const { selectedChip, t, timeZoneList } = this.props;
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

    const list = array;

    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (list && list.length > 0) {
          // define an empty array of rows
          const tableRows = [];
          // for each account pass all its data into an array
          list.forEach((field) => {
            const purchaseTypes = () => field.purchaseDetails.reduce((acc, item, counter)=> 
                  (counter === field.purchaseDetails.length-1) ? `${acc} ${item.purchaseType}`
                  :`${acc} ${item.purchaseType}, `,
                '');

            const timeZone = field.timeZoneId && timeZoneList.find(x => x.timeZoneId == field.timeZoneId);
            const data = {}
            if (selectedChip === "ACH" || selectedChip === "EFT") {
              data[t('componentData.paymentMethodTable.Accounts')] = field.accountName;
              data[t('componentData.paymentMethodTable.DateAdded')] = new Date(field.createdAt).toLocaleDateString(this.props.i18n.language, { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).replace(/[^ -~]/g, '');
              data[t('componentData.paymentMethodTable.BankCountryISO')] = field.bankCountryIso;
              data[t('componentData.paymentMethodTable.Currency')] = field.currencyCode;
            }
            else {
              if (selectedChip === "VCA") {
                data[t('componentData.paymentMethodTable.CompanyName')] = field.programName;
                data[t('componentData.paymentMethodTable.PurchaseTypes')] = purchaseTypes();
                data[t('componentData.paymentMethodTable.TimeZone')] = timeZone && timeZone.utcTimezone;
                data[t('componentData.paymentMethodTable.LastUpdated')] = new Date(field.updatedAt).toLocaleDateString(this.props.i18n.language, 
                  {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }).replace(/[^ -~]/g, '');
              }
              else {
                data[t('componentData.paymentMethodTable.SenderId')] = field.intSenderId;
                data[t('componentData.paymentMethodTable.ReceiverId')] = field.intRecvrId;
                data.GS02 = field.GS02;
                data.GS03 = field.GS03
              }
            }
            //push each data info into a row
            tableRows.push(data);
          });
          const payementFiles = t('componentData.paymentMethodTable.PaymentFiles');
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
    const { selectedChip, timeZoneList } = this.props;
    const list = array;

    const tempProp = this.props;
    
    this.setState(
      {
        downloadProgress: true,
      },
      function () {
        if (list && list.length > 0) {
          const tableColumn =
            selectedChip === "ACH" || selectedChip === "EFT"
              ? [t('componentData.paymentMethodTable.Accounts'), t('componentData.paymentMethodTable.DateAdded'), t('componentData.paymentMethodTable.BankCountryISO'), t('componentData.paymentMethodTable.Currency')]
              : selectedChip === "VCA"
                ? [
                  t('componentData.paymentMethodTable.CompanyName'),
                  t('componentData.paymentMethodTable.PurchaseTypes'),
                  t('componentData.paymentMethodTable.TimeZone'),
                  t('componentData.paymentMethodTable.LastUpdated'),
                ]
                : [t('componentData.paymentMethodTable.SenderId'), t('componentData.paymentMethodTable.ReceiverId'), t('componentData.paymentMethodTable.GS02'), t('componentData.paymentMethodTable.GS03')];
          // define an empty array of rows
          var tableRows = [];
          // for each account pass all its data into an array
          list.forEach(function (field) {
            const purchaseTypes = () => field.purchaseDetails.reduce((acc, item, counter)=> 
                  (counter === field.purchaseDetails.length-1) ? `${acc} ${item.purchaseType}`
                  :`${acc} ${item.purchaseType}, `,
                '');
            const timeZone = field.timeZoneId && timeZoneList.find(x => x.timeZoneId == field.timeZoneId);
            const data =
              selectedChip === "ACH" || selectedChip === "EFT"
                ? [
                  field.accountName,
                  field.createdAt ? new Date(field.createdAt).toLocaleDateString(tempProp.i18n.language, 
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }).replace(/[^ -~]/g, '') : "",
                  field.bankCountryIso,
                  field.currencyCode,
                ]
                : selectedChip === "VCA"
                  ? [
                    field.programName,
                    purchaseTypes(),
                    timeZone && timeZone.utcTimezone,
                    field.updatedAt ? new Date(field.updatedAt).toLocaleDateString(tempProp.i18n.language, 
                      { 
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }).replace(/[^ -~]/g, '') : "",
                  ]
                  : [
                    field.intSenderId,
                    field.intRecvrId,
                    field.GS02,
                    field.GS03,
                  ];
            //push each data info into a row
            tableRows.push(data);
          });
          var title = tempProp.payerTypeId && tempProp.payerTypeId == PayerTypes.CARDS ? 
            t('componentData.paymentMethodTable.CCPdfHeading') : t('componentData.paymentMethodTable.MyFiles');
          const date = new Date().toLocaleString(this.props.i18n.language, 
            { day: "numeric",
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

  renderPurchaseType = (item) => {
    const typeObj = { value: '', msg: '' };
    if (item && item.purchaseDetails.length) {
      const itemArr = item.purchaseDetails;
      if (itemArr.length > 2) {
        typeObj.value = itemArr.slice(0, 2).map(a => a.purchaseType).join(', ') || '';
        typeObj.value = `${typeObj.value}...(${itemArr.length - 2})`;
        typeObj.msg = itemArr.map(a => a.purchaseType).join(', ') || '';
      } else {
        typeObj.value = itemArr.map(a => a.purchaseType).join(', ') || '';
      }
    }
    return typeObj;
  }

  renderTimeZone = (item) => {
    const { timeZoneList } = this.props;
    let timeZoneValue = '';
    if (item && item.timeZoneId) {
      timeZoneValue = timeZoneList.find(x => x.timeZoneId == item.timeZoneId);
    }
    return timeZoneValue ? timeZoneValue.utcTimezone : '';
  }

  render() {
    const {
      theme,
      fetchingList,
      accounts,
      canEdit = true,
      canAdd = true,
      canDownload = true,
      filterChips,
      selectedChip,
      hanldeFilterChips,
      t,
      payerTypeId
    } = this.props;
    const { showDownload } = this.state;

    return (
      <div>
        <Box py={1} px={2}>
          <span>
            <Box my={2}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {payerTypeId != PayerTypes.CARDS ?
                  <div>
                    {filterChips &&
                      filterChips.map((chip, i) => (
                        <span style={{ margin: "0 10px" }}>
                          <Chip
                            label={chip.label}
                            size="small"
                            color={chip["alias"] == selectedChip ? "primary" : ""}
                            className={
                              chip["alias"] == selectedChip
                                ? "chipSelectedColor"
                                : "chipUnselectedColor"
                            }
                            onClick={() => hanldeFilterChips(chip["key"])}
                          />
                        </span>
                      ))}
                  </div> :
                  <Box p={0.5}>
                    {t('componentData.paymentMethodTable.masterCard')}
                  </Box>
                }

                {canDownload && <div>
                  <ExportAsBtn
                    onClick={(e) => {
                      this.setState({
                        showDownload: true,
                        anchorEl: e.currentTarget,
                      });
                    }}
                    btnName={t('componentData.paymentMethodTable.ExportAs')}
                  />
                  {showDownload &&
                    this.renderDownloadOptions(showDownload, accounts)}
                </div>}
              </div>
            </Box>
          </span>
        </Box>
        {selectedChip === "ACH" || selectedChip === "EFT" ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: "rgba(204,228,255,0.75)",
                }}
              >
                <TableRow>
                  <StyledTableCell>{t('componentData.paymentMethodTable.Accounts')}</StyledTableCell>
                  <StyledTableCell />
                  <StyledTableCell>{t('componentData.paymentMethodTable.DateAdded')}</StyledTableCell>
                  <StyledTableCell>{t('componentData.paymentMethodTable.BankCountryISO')}</StyledTableCell>
                  <StyledTableCell>{t('componentData.paymentMethodTable.Currency')}</StyledTableCell>
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
                          <StyledTableRow onClick={() => this.props.editAccount(item)}>
                            {/* <StyledTableCell>
                            <Checkbox/>
                          </StyledTableCell> */}
                            <StyledTableCell className="tablePadding">
                              {item.accountName}
                            </StyledTableCell>
                            <StyledTableCell className="tablePadding">
                              {item.isDefault ? t('componentData.paymentMethodTable.Default') : ""}
                            </StyledTableCell>
                            <StyledTableCell className="tablePadding">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString(this.props.i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }).replace(/[^ -~]/g, '') : ""}
                            </StyledTableCell>
                            <StyledTableCell className="tablePadding">
                              {item.bankCountryIso}
                            </StyledTableCell>
                            <StyledTableCell className="tablePadding">
                              {item.currencyCode && (
                                <span className="flagContainer">
                                  <CurrencyFlag
                                    currency={item.currencyCode}
                                    size="lg"
                                  />
                                  <span
                                    style={{ padding: "1px 7px" }}
                                  >{` ${item.currencyCode}`}</span>
                                </span>
                              )}
                            </StyledTableCell>
                            <StyledTableCell className="tablePadding">
                              {canEdit && (
                                <img
                                  style={{ float: "right" }}
                                  onClick={() => this.props.editAccount(item)}                    
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=""
                                  æ
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
                        <h4>
                          {t('componentData.paymentMethodTable.txtMsg')}
                        </h4>
                        <Box
                          p={2}
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          {canAdd && (
                            <Button
                              // className={classes.addAccountButton}
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
                              {t('componentData.paymentMethodTable.addAcc')}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
              <StyledTableFooter>
                <TableRow>
                </TableRow>
              </StyledTableFooter>
            </Table>
          </Grid>
        ) : selectedChip === "VCA" && payerTypeId == PayerTypes.CARDS ?
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: "rgba(204,228,255,0.75)",
                }}
              >
                <TableRow>
                  <StyledTableCell>{t('componentData.paymentMethodTable.CompanyName')}</StyledTableCell>
                  <StyledTableCell>{t('componentData.paymentMethodTable.PurchaseTypes')}</StyledTableCell>
                  <StyledTableCell>{t('componentData.paymentMethodTable.TimeZone')}</StyledTableCell>
                  <StyledTableCell>{t('componentData.paymentMethodTable.LastUpdated')}</StyledTableCell>
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
                      const purTypeValue = this.renderPurchaseType(item);

                      return (
                        <Fragment key={index}>
                          <StyledTableRow onClick={() => this.props.editAccount(item)}>
                            <StyledTableCell className="tablePadding">
                              {item.programName}
                            </StyledTableCell>
                            <StyledTableCell className="tablePadding" width={370}>
                              <Tooltip title={purTypeValue.msg || ''} placement="top">
                                <span>{purTypeValue.value}</span>
                              </Tooltip>
                            </StyledTableCell>
                            <StyledTableCell className="tablePadding">
                              {this.renderTimeZone(item)}
                            </StyledTableCell>
                            <StyledTableCell className="tablePadding">
                              {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString(this.props.i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }).replace(/[^ -~]/g, '') : ""}
                            </StyledTableCell>
                            <StyledTableCell className="tablePadding">
                              {canEdit && (
                                <img
                                  style={{ float: "right" }}
                                  onClick={() => this.props.editAccount(item)}
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=""
                                  æ
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
                        <h4>
                          {t('componentData.paymentMethodTable.txtMsg')}
                        </h4>
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
                              {t('componentData.paymentMethodTable.addAcc')}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
              <StyledTableFooter>
                <TableRow>
                </TableRow>
              </StyledTableFooter>
            </Table>
          </Grid>
          : selectedChip === "VCA" ? (
            <Grid>
              <Table>
                <StyledTableHead
                  style={{
                    background: "rgba(204,228,255,0.75)",
                  }}
                >
                  <TableRow>
                    <StyledTableCell>{t('componentData.paymentMethodTable.CompanyName')}</StyledTableCell>
                    <StyledTableCell>{t('componentData.paymentMethodTable.DateAdded')}</StyledTableCell>
                    <StyledTableCell>{t('componentData.paymentMethodTable.CurrencyCode')}</StyledTableCell>
                    <StyledTableCell>{t('componentData.paymentMethodTable.BankCountryISO')}</StyledTableCell>
                    <StyledTableCell>{t('componentData.paymentMethodTable.BankRoutingCode')}</StyledTableCell>
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
                            <StyledTableRow onClick={() => this.props.editAccount(item)}>
                              <StyledTableCell className="tablePadding">
                                {item.companyName}
                              </StyledTableCell>
                              <StyledTableCell className="tablePadding">
                                {" "}
                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString(this.props.i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }).replace(/[^ -~]/g, '') : ""}
                              </StyledTableCell>
                              <StyledTableCell className="tablePadding">
                                {item.currencyCode && (
                                  <span className="flagContainer">
                                    <CurrencyFlag
                                      currency={item.currencyCode}
                                      size="lg"
                                    />
                                    <span
                                      style={{ padding: "1px 7px" }}
                                    >{` ${item.currencyCode}`}</span>
                                  </span>
                                )}
                              </StyledTableCell>
                              <StyledTableCell className="tablePadding">
                                {item.bankCountryIso}
                              </StyledTableCell>
                              <StyledTableCell className="tablePadding">
                                {item.bankRoutingCode}
                              </StyledTableCell>
                              <StyledTableCell className="tablePadding">
                                {canEdit && (
                                  <img
                                    style={{ float: "right" }}
                                    onClick={() => this.props.editAccount(item)}
                                    src={require(`~/assets/icons/edit.svg`)}
                                    alt=""
                                    æ
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
                          <h4>
                            {t('componentData.paymentMethodTable.txtMsg')}
                          </h4>
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
                                {t('componentData.paymentMethodTable.addAcc')}
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                <StyledTableFooter>
                  <TableRow>
                  </TableRow>
                </StyledTableFooter>
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
                    <StyledTableCell>{t('componentData.paymentMethodTable.SenderId')}</StyledTableCell>
                    <StyledTableCell>{t('componentData.paymentMethodTable.ReceiverId')}</StyledTableCell>
                    <StyledTableCell>{t('componentData.paymentMethodTable.GS02')}</StyledTableCell>
                    <StyledTableCell>{t('componentData.paymentMethodTable.GS03')}</StyledTableCell>
                    <StyledTableCell></StyledTableCell>
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
                      Object.keys(accounts[0]).length > 0 &&
                      accounts.map((item, index) => {
                        return (
                          <Fragment key={index}>
                            <StyledTableRow onClick={() => this.props.editAccount(item)}>
                              <StyledTableCell className="chipCheckTablePadding">
                                {item.intSenderId}
                              </StyledTableCell>
                              <StyledTableCell className="chipCheckTablePadding">
                                {item.intRecvrId}
                              </StyledTableCell>
                              {/* <StyledTableCell>{item.ISA06}</StyledTableCell> */}
                              <StyledTableCell className="chipCheckTablePadding">
                                {item.GS02}
                              </StyledTableCell>
                              <StyledTableCell className="chipCheckTablePadding">
                                {item.GS03}
                              </StyledTableCell>
                              {/* <StyledTableCell>{item.ISA08}</StyledTableCell> */}
                              <StyledTableCell className="chipCheckTablePadding">
                                {canEdit && (
                                  <img
                                    style={{ float: "right" }}
                                    onClick={() => this.props.editAccount(item)}
                                    src={require(`~/assets/icons/edit.svg`)}
                                    alt=""
                                    æ
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
                          <h4>
                            {t('componentData.paymentMethodTable.txtMsg')}
                          </h4>
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
                                // className={classes.button}
                                startIcon={<AddIcon />}
                              >
                                {t('componentData.paymentMethodTable.addAcc')}
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                <StyledTableFooter>
                  <TableRow>
                    {/* <TablePagination
                                    rowsPerPageOptions={[10, 25, 50, { label: 'All', value: 10 || 10 }]}
                                    colSpan={6}
                                    count={3}
                                    rowsPerPage={10}
                                    page={0}
                                // SelectProps={{
                                //     inputProps: { 'aria-label': 'rows per page' },
                                //     native: true,
                                // }}
                                // onChangePage={this.handlePageChange}
                                // onChangeRowsPerPage={this.handleRowsPerPageChange}
                                /> */}
                  </TableRow>
                </StyledTableFooter>
              </Table>
            </Grid>
          )}
      </div>
    );
  }
}

export default withTranslation()(connect((state) => ({ ...state.user, ...state.role }))(
  PaymentMethodsTable
));
