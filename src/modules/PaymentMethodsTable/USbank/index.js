import React, { Fragment } from 'react';
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
} from '@material-ui/core';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import ExportAsBtn from '~/components/ExportAsBtn';
import * as XLSX from 'xlsx';
import generatePDF from '~/modules/GeneratePDF/';
import * as FileSaver from 'file-saver';
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
} from '~/components/StyledTable';
import './styles.scss';
import { withTranslation } from 'react-i18next';
import { paymentMethods } from '~/config/paymentMethods';

class USbankPaymentMethodsTable extends React.Component {
  state = {
    showDownload: false,
    downloadProgress: false,
    page: 0,
    rowsPerPage: 10,
    sortColumn: 'reportName',
    sortOrder: 'asc',
    name: '',
  };

  handleDownloadCSV = async (array) => {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const { selectedChip, t } = this.props;
    const date = new Date()
      .toLocaleString(this.props.i18n.language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        hourCycle: 'h24',
        minute: 'numeric',
        second: 'numeric',
      })
      .replace(/[^ -~]/g, '')
      .split(' ');
    let dateStr = date[0] + date[1] + date[2] + date[3];
    var regex = /[.,\s]/g;
    dateStr = dateStr.replace(regex, '');
    const fileName = `${t('componentData.fileName.file')}_${t(
      'componentData.fileName.list'
    )}_${dateStr}.xlsx`;
    let list = array;
    const prePaidCardData =
      this.props.USBankPayment?.storedPrepaidCardData?.data ?? {};
    if (selectedChip === 'CHK' && Object.keys(list[0]).length === 0) {
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
            if (selectedChip === paymentMethods['USBankACH']) {
              data[t('componentData.addAccountForm.RoutingCodeLabel')] =
                field.routingCode;
              data[t('componentData.paymentMethods.AccountNumber')] =
                field.accountNumber;
              data[t('componentData.paymentMethods.DateAdded')] =
                field.createdAt
                  ? new Date(field.createdAt)
                      .toLocaleDateString(this.props.i18n.language, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                      .replace(/[^ -~]/g, '')
                  : '';
            } else if (selectedChip === paymentMethods['USBankRTP']) {
              data[t('componentData.paymentMethods.AccountName')] =
                field.rtpRoutingCode;
              data[t('componentData.paymentMethods.AccountNumber')] =
                field.rtpAccountNumber;
              data[t('componentData.paymentMethods.DateAdded')] =
                field.createdAt
                  ? new Date(field.createdAt)
                      .toLocaleDateString(this.props.i18n.language, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                      .replace(/[^ -~]/g, '')
                  : '';
            } else if (
              selectedChip === paymentMethods['USBankDepositToDebitcard']
            ) {
              data[t('componentData.DebitCardDetail.ddcSSLMerchantId')] =
                field.ddcSSLMerchantId;
              data[t('componentData.DebitCardDetail.ddcTransactionType')] =
                field.ddcTransactionType;
              data[t('componentData.DebitCardDetail.ddcConvergeUserId')] =
                field.ddcConvergeUserId;
            } else if (selectedChip === paymentMethods['USBankCHK']) {
              data[t('componentData.USbankCheck.payerID')] = field.zellePayerId;
              data[t('componentData.USbankCheck.accountNumber')] =
                field.zellePayFromAccountNumber;
            } else if (selectedChip === paymentMethods['USBankZelle']) {
              data[t('componentData.USbankZelle.payerID')] = field.zellePayerId;
              data[t('componentData.USbankZelle.accountNumber')] =
                field.zellePayFromAccountNumber;
            } else if (selectedChip === paymentMethods['USBankPrepaidCard']) {
              if (prePaidCardData?.corporateCardData?.length) {
                data[t('componentData.paymentMethods.transId')] = field.transId;
                data[t('componentData.paymentMethods.fundingCardPasscode')] =
                  field.fundingCardPasscode;
                data[t('componentData.paymentMethods.fundingCardId')] =
                  field.fundingCardId;
              } else {
                data[t('componentData.paymentMethods.achRoutingCode')] =
                  field.routingCode;
                data[t('componentData.paymentMethods.achAccountNumber')] =
                  field.accountNumber;
                data[t('componentData.paymentMethods.achCompanyId')] =
                  field.companyIdentification;
              }
            }

            tableRows.push(data);
          });
          const payementFiles = t(
            'componentData.paymentMethodTable.PaymentFiles'
          );
          const ws = XLSX.utils.json_to_sheet(tableRows);
          const wb = {
            Sheets: {},
            SheetNames: [payementFiles],
          };
          wb.Sheets[payementFiles] = ws;

          const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
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
    if (selectedChip === 'CHK' && Object.keys(list[0]).length === 0) {
      list = undefined;
    }
    const prePaidCardData =
      tempProp.USBankPayment?.storedPrepaidCardData?.data ?? null;
    this.setState(
      {
        downloadProgress: true,
      },
      function () {
        if (list && list.length > 0) {
          let tableColumn = [
            t('componentData.paymentMethods.SenderType'),
            t('componentData.paymentMethods.SenderName'),
            t('componentData.paymentMethods.ProductType'),
            t('componentData.paymentMethods.DateAdded'),
          ];//For Zelle account
          switch (selectedChip) {
            case paymentMethods['USBankACH']:
              tableColumn = [
                t('componentData.addAccountForm.RoutingCodeLabel'),
                t('componentData.paymentMethods.AccountNumber'),
                t('componentData.paymentMethods.DateAdded'),
              ];
              break;
            case paymentMethods['USBankDepositToDebitcard']:
              tableColumn = [
                t('componentData.DebitCardDetail.ddcSSLMerchantId'),
                t('componentData.DebitCardDetail.ddcTransactionType'),
                t('componentData.DebitCardDetail.ddcConvergeUserId'),
              ];
              break;
            case paymentMethods['USBankRTP']:
              tableColumn = [
                t('componentData.paymentMethods.RoutingNumber'),
                t('componentData.paymentMethods.AccountNumber'),
                t('componentData.paymentMethods.DateAdded'),
              ];
              break;
            case paymentMethods['USBankZelle']:
              tableColumn = [
                t('componentData.USbankZelle.payerID'),
                t('componentData.USbankZelle.accountNumber'),
              ];
              break;
            case paymentMethods['USBankCHK']:
              tableColumn = [
                t('componentData.USbankCheck.payerID'),
                t('componentData.USbankCheck.accountNumber'),
              ];
              break;
            case paymentMethods['PayPal']:
              tableColumn = [
                t('componentData.paymentMethods.WorldlinkID'),
                t('componentData.paymentMethods.ClientBIC'),
                t('componentData.paymentMethods.ClientSenderAccount'),
                t('componentData.paymentMethods.SenderName'),
              ];
              break;
            case paymentMethods['PushToCard']:
              tableColumn = [
                t('componentData.paymentMethods.PartnerID'),
                t('componentData.paymentMethods.senderAccount'),
                t('componentData.paymentMethods.ClientSenderName'),
                t('componentData.paymentMethods.MerchantCategoryCode'),
              ];
              break;
            case paymentMethods['USBankPrepaidCard']:
              if (prePaidCardData?.corporateCardData?.length) {
                tableColumn = [
                  t('componentData.paymentMethods.transId'),
                  t('componentData.paymentMethods.fundingCardPasscode'),
                  t('componentData.paymentMethods.fundingCardId'),
                ];
              } else if (prePaidCardData?.registrationData?.length) {
                tableColumn = [
                  t('componentData.paymentMethods.achRoutingCode'),
                  t('componentData.paymentMethods.achAccountNumber'),
                  t('componentData.paymentMethods.achCompanyId'),
                ];
              } else {
                tableColumn = [
                  t('componentData.paymentMethods.transId'),
                  t('componentData.paymentMethods.passcode'),
                  t('componentData.paymentMethods.fundingCardId'),
                ];
              }
              break;
            default:
              break;
          }

          var tableRows = [];
          list.forEach(function (field) {
            const data =
              selectedChip === paymentMethods['USBankACH']
                ? [
                    field.routingCode,
                    field.accountNumber,
                    field.createdAt
                      ? new Date(field.createdAt)
                          .toLocaleDateString(tempProp.i18n.language, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          .replace(/[^ -~]/g, '')
                      : '',
                  ]
                : selectedChip === paymentMethods['USBankRTP']
                ? [
                    field.rtpRoutingCode,
                    field.rtpAccountNumber,
                    field.createdAt
                      ? new Date(field.createdAt)
                          .toLocaleDateString(tempProp.i18n.language, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          .replace(/[^ -~]/g, '')
                      : '',
                  ]
                : selectedChip === paymentMethods['USBankDepositToDebitcard']
                ? [
                    field.ddcSSLMerchantId,
                    field.ddcTransactionType,
                    field.ddcConvergeUserId,
                  ]
                : selectedChip === paymentMethods['USBankZelle']
                ? [field.zellePayerId, field.zellePayFromAccountNumber]
                : selectedChip === paymentMethods['USBankCHK']
                ? [field.zellePayerId, field.zellePayFromAccountNumber]
                : selectedChip === paymentMethods['PayPal']
                ? [
                    field.worldlinkId,
                    field.clientBIC,
                    field.senderAccountNumber,
                    field.senderName,
                  ]
                : selectedChip === paymentMethods['PushToCard']
                ? [
                    field.partnerId,
                    field.senderAccount,
                    `${field.senderFirstName} ${field.senderLastName}`,
                    field.masterMerchantCatCode
                      ? field.masterMerchantCatCode
                      : field.visaMerchantCatCode,
                  ]
                : selectedChip === paymentMethods['USBankPrepaidCard']
                ? prePaidCardData?.corporateCardData?.length
                  ? [
                      field.transId,
                      field.fundingCardPasscode,
                      field.fundingCardId,
                    ]
                  : [
                      field.routingCode,
                      field.accountNumber,
                      field.companyIdentification,
                    ]
                : [
                    field.senderType,
                    field.senderName,
                    field.productType,
                    field.createdAt
                      ? new Date(field.createdAt)
                          .toLocaleDateString(tempProp.i18n.language, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          .replace(/[^ -~]/g, '')
                      : '',
                  ]; //For Zelle account

            tableRows.push(data);
          });
          var title = t('componentData.paymentMethodTable.MyFiles');
          const date = new Date()
            .toLocaleString(this.props.i18n.language, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              hourCycle: 'h24',
              minute: 'numeric',
              second: 'numeric',
            })
            .replace(/[^ -~]/g, '')
            .split(' ');

          let dateStr = date[0] + date[1] + date[2] + date[3];
          var regex = /[.,\s]/g;
          dateStr = dateStr.replace(regex, '');
          const fileName = `${t(
            'componentData.fileName.files'
          )}_${dateStr}.pdf`;
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
        // anchorOrigin={{
        //   vertical: 'bottom',
        //   horizontal: 'right',
        // }}
        // transformOrigin={{
        //   vertical: 'top',
        //   horizontal: 'left',
        // }}
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
    const newSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';
    this.setState({
      page,
      sortColumn: sortColumn,
      sortOrder: newSortOrder,
    });
  };

  handleRowsPerPageChange = (event) => {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';
    this.setState({
      page: 0,
      rowsPerPage: event.target.value ? parseInt(event.target.value, 10) : '',
      sortOrder: newSortOrder,
    });
  };

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
    } = this.props;
    const prePaidCardData =
      this.props.USBankPayment?.storedPrepaidCardData?.data ?? null;
    const bankAccountsList =
      this.props.USBankPayment?.achUSBankClientAccountList ?? null;
    let bankAccountData = null;
    const { showDownload } = this.state;
    let isCorporateRewardCardData = false;
    let isFocusReliaData = false;
    if (prePaidCardData?.corporateCardData?.length) {
      isCorporateRewardCardData = true;
    } else if (
      bankAccountsList?.data?.count &&
      prePaidCardData?.registrationData?.length
    ) {
      isFocusReliaData = true;
      bankAccountData = bankAccountsList?.data?.rows?.filter(
        (item) =>
          item.accountId ===
          prePaidCardData.registrationData[0]?.clientDebitAccountId
      );
    }
    const prepaidCardRegData = isCorporateRewardCardData
      ? prePaidCardData?.corporateCardData
      : bankAccountData;

    return (
      <div>
        <Box py={1} px={2}>
          <span>
            <Box my={2}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className='chipContiner'>
                  {filterChips &&
                    filterChips.map((chip, i) => (
                      <span>
                        <Chip
                          label={chip.label}
                          size='small'
                          color={
                            chip['alias'] === selectedChip ? 'primary' : ''
                          }
                          className={
                            chip['alias'] === selectedChip
                              ? 'chipSelectedColor'
                              : 'chipUnselectedColor'
                          }
                          onClick={() => hanldeFilterChips(chip['key'])}
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
                      btnName={t('componentData.paymentMethodTable.ExportAs')}
                    />
                    {showDownload &&
                      this.renderDownloadOptions(
                        showDownload,
                        selectedChip === paymentMethods['USBankPrepaidCard']
                          ? prepaidCardRegData
                          : accounts
                      )}
                  </div>
                )}
              </div>
            </Box>
          </span>
        </Box>
        {selectedChip === paymentMethods['USBankACH'] ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: 'rgba(204,228,255,0.75)',
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {t('componentData.paymentMethods.RoutingNumber')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.paymentMethods.AccountNumber')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.paymentMethods.DateAdded')}
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
                          display='flex'
                          p={5}
                          justifyContent='center'
                          alignItems='center'
                        >
                          <CircularProgress color='primary' />
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
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.routingCode}
                            </StyledTableCell>

                            <StyledTableCell
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.accountNumber}
                            </StyledTableCell>

                            <StyledTableCell
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.createdAt
                                ? new Date(item.createdAt)
                                    .toLocaleDateString(
                                      this.props.i18n.language,
                                      {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      }
                                    )
                                    .replace(/[^ -~]/g, '')
                                : ''}
                            </StyledTableCell>

                            <StyledTableCell className='tablePadding'>
                              {canEdit && (
                                <img
                                  style={{ float: 'right' }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}
                                  // className={classes.checkClass}
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=''
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
                        display='flex'
                        p={5}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          alt={''}
                          className='menu-icon'
                        />
                      </Box>
                      <Box
                        style={{ display: 'table', margin: '0 auto' }}
                        p={2}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <h4>
                          {t('componentData.paymentMethodTable.txtMsgUsbank')}
                        </h4>
                        <Box
                          p={2}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                        >
                          {canAdd && (
                            <Button
                              // className={classes.addAccountButton}
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant='outlined'
                              onClick={() => this.props.addAccount()}
                              color='secondary'
                              // className={classes.button}
                              startIcon={<AddIcon />}
                            >
                              {t(
                                'componentData.paymentMethodTable.addAccUsbank'
                              )}
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
        ) : selectedChip === paymentMethods['USBankRTP'] ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: 'rgba(204,228,255,0.75)',
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {t('componentData.paymentMethods.rtpRoutingNumber')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.paymentMethods.AccountNumber')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.paymentMethods.DateAdded')}
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
                          display='flex'
                          p={5}
                          justifyContent='center'
                          alignItems='center'
                        >
                          <CircularProgress color='primary' />
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
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.rtpRoutingCode}
                            </StyledTableCell>

                            <StyledTableCell
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.rtpAccountNumber}
                            </StyledTableCell>

                            <StyledTableCell
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.createdAt
                                ? new Date(item.createdAt)
                                    .toLocaleDateString(
                                      this.props.i18n.language,
                                      {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                      }
                                    )
                                    .replace(/[^ -~]/g, '')
                                : ''}
                            </StyledTableCell>

                            <StyledTableCell className='tablePadding'>
                              {canEdit && (
                                <img
                                  style={{ float: 'right' }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}
                                  // className={classes.checkClass}
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=''
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
                        display='flex'
                        p={5}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          alt={''}
                          className='menu-icon'
                        />
                      </Box>
                      <Box
                        style={{ display: 'table', margin: '0 auto' }}
                        p={2}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <h4>
                          {t('componentData.paymentMethodTable.txtMsgUsbank')}
                        </h4>
                        <Box
                          p={2}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                        >
                          {canAdd && (
                            <Button
                              // className={classes.addAccountButton}
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant='outlined'
                              onClick={() => this.props.addAccount()}
                              color='secondary'
                              // className={classes.button}
                              startIcon={<AddIcon />}
                            >
                              {t(
                                'componentData.paymentMethodTable.addAccUsbank'
                              )}
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
        ) : selectedChip === paymentMethods['USBankDepositToDebitcard'] ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: 'rgba(204,228,255,0.75)',
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {t('componentData.DebitCardDetail.ddcSSLMerchantId')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.DebitCardDetail.ddcTransactionType')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.DebitCardDetail.ddcConvergeUserId')}
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
                          display='flex'
                          p={5}
                          justifyContent='center'
                          alignItems='center'
                        >
                          <CircularProgress color='primary' />
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
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.ddcSSLMerchantId}
                            </StyledTableCell>

                            <StyledTableCell
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.ddcTransactionType}
                            </StyledTableCell>

                            <StyledTableCell
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.ddcConvergeUserId}
                            </StyledTableCell>

                            <StyledTableCell className='tablePadding'>
                              {canEdit && (
                                <img
                                  style={{ float: 'right' }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}
                                  // className={classes.checkClass}
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=''
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
                        display='flex'
                        p={5}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          alt={''}
                          className='menu-icon'
                        />
                      </Box>
                      <Box
                        style={{ display: 'table', margin: '0 auto' }}
                        p={2}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <h4>
                          {t('componentData.paymentMethodTable.txtMsgUsbank')}
                        </h4>
                        <Box
                          p={2}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                        >
                          {canAdd && (
                            <Button
                              // className={classes.addAccountButton}
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant='outlined'
                              onClick={() => this.props.addAccount()}
                              color='secondary'
                              // className={classes.button}
                              startIcon={<AddIcon />}
                            >
                              {t(
                                'componentData.paymentMethodTable.addAccUsbank'
                              )}
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
        ) : selectedChip === paymentMethods['USBankZelle'] ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: 'rgba(204,228,255,0.75)',
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {t('componentData.USbankZelle.payerID')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.USbankZelle.accountNumber')}
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
                          display='flex'
                          p={5}
                          justifyContent='center'
                          alignItems='center'
                        >
                          <CircularProgress color='primary' />
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
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.zellePayerId}
                            </StyledTableCell>

                            <StyledTableCell
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.zellePayFromAccountNumber}
                            </StyledTableCell>

                            <StyledTableCell className='tablePadding'>
                              {canEdit && (
                                <img
                                  style={{ float: 'right' }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}
                                  // className={classes.checkClass}
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=''
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
                        display='flex'
                        p={5}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          className='menu-icon'
                          alt=''
                        />
                      </Box>
                      <Box
                        style={{ display: 'table', margin: '0 auto' }}
                        p={2}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <h4>
                          {t('componentData.paymentMethodTable.txtMsgUsbank')}
                        </h4>
                        <Box
                          p={2}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                        >
                          {canAdd && (
                            <Button
                              // className={classes.addAccountButton}
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant='outlined'
                              onClick={() => this.props.addAccount()}
                              color='secondary'
                              // className={classes.button}
                              startIcon={<AddIcon />}
                            >
                              {t(
                                'componentData.paymentMethodTable.addAccUsbank'
                              )}
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
        ) : selectedChip === paymentMethods['USBankCHK'] ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: 'rgba(204,228,255,0.75)',
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {t('componentData.USbankCheck.payerID')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {t('componentData.USbankCheck.accountNumber')}
                  </StyledTableCell>
                  <StyledTableCell />
                </TableRow>
              </StyledTableHead>
              {!fetchingList && accounts?.length > 0 ? (
                <TableBody>
                  {fetchingList ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box
                          display='flex'
                          p={5}
                          justifyContent='center'
                          alignItems='center'
                        >
                          <CircularProgress color='primary' />
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
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.zellePayerId}
                            </StyledTableCell>

                            <StyledTableCell
                              className='tablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {item.zellePayFromAccountNumber}
                            </StyledTableCell>

                            <StyledTableCell className='tablePadding'>
                              {canEdit && (
                                <img
                                  style={{ float: 'right' }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}
                                  // className={classes.checkClass}
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=''
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
                        display='flex'
                        p={5}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          className='menu-icon'
                          alt=''
                        />
                      </Box>
                      <Box
                        style={{ display: 'table', margin: '0 auto' }}
                        p={2}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <h4>
                          {t('componentData.paymentMethodTable.txtMsgUsbank')}
                        </h4>
                        <Box
                          p={2}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                        >
                          {canAdd && (
                            <Button
                              // className={classes.addAccountButton}
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant='outlined'
                              onClick={() => this.props.addAccount()}
                              color='secondary'
                              // className={classes.button}
                              startIcon={<AddIcon />}
                            >
                              {t(
                                'componentData.paymentMethodTable.addAccUsbank'
                              )}
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
        ) : selectedChip === paymentMethods['USBankPrepaidCard'] ? (
          <Grid>
            <Table>
              <StyledTableHead
                style={{
                  background: 'rgba(204,228,255,0.75)',
                }}
              >
                <TableRow>
                  <StyledTableCell>
                    {isCorporateRewardCardData
                      ? t('componentData.paymentMethods.transId')
                      : isFocusReliaData
                      ? t('componentData.paymentMethods.achRoutingCode')
                      : t('componentData.paymentMethods.transId')}
                  </StyledTableCell>
                  <StyledTableCell>
                    {isCorporateRewardCardData
                      ? t('componentData.paymentMethods.fundingCardPasscode')
                      : isFocusReliaData
                      ? t('componentData.paymentMethods.achAccountNumber')
                      : t('componentData.paymentMethods.passcode')}
                  </StyledTableCell>

                  <StyledTableCell>
                    {isCorporateRewardCardData
                      ? t('componentData.paymentMethods.fundingCardId')
                      : isFocusReliaData
                      ? t('componentData.paymentMethods.achCompanyId')
                      : t('componentData.paymentMethods.fundingCardId')}
                  </StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </StyledTableHead>
              {fetchingList ||
              Object.keys(prepaidCardRegData?.[0] || {}).length > 0 ? (
                <TableBody>
                  {fetchingList ? (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Box
                          display='flex'
                          p={5}
                          justifyContent='center'
                          alignItems='center'
                        >
                          <CircularProgress color='primary' />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    prepaidCardRegData?.length &&
                    prepaidCardRegData.map((item, index) => {
                      return (
                        <Fragment key={index}>
                          <StyledTableRow>
                            <StyledTableCell
                              className='chipCheckTablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {isCorporateRewardCardData
                                ? item.transId
                                : item.routingCode}
                            </StyledTableCell>

                            <StyledTableCell
                              className='chipCheckTablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {isCorporateRewardCardData
                                ? item.fundingCardPasscode
                                : item.accountNumber}
                            </StyledTableCell>

                            <StyledTableCell
                              className='chipCheckTablePadding'
                              onClick={() =>
                                this.props.editAccount(Number(index + 1), true)
                              }
                            >
                              {isCorporateRewardCardData
                                ? item.fundingCardId
                                : item.companyIdentification}
                            </StyledTableCell>
                            <StyledTableCell className='chipCheckTablePadding'>
                              {canEdit && (
                                <img
                                  style={{ float: 'right' }}
                                  onClick={() => {
                                    this.props.editAccount(
                                      Number(index + 1),
                                      false
                                    );
                                  }}
                                  // className={classes.checkClass}
                                  src={require(`~/assets/icons/edit.svg`)}
                                  alt=''
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
                        display='flex'
                        p={5}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <img
                          src={require(`~/assets/images/noDataImage.svg`)}
                          className='menu-icon'
                          alt=''
                        />
                      </Box>
                      <Box
                        style={{ display: 'table', margin: '0 auto' }}
                        p={2}
                        justifyContent='center'
                        alignItems='center'
                      >
                        <h4>
                          {t('componentData.paymentMethodTable.txtMsgUsbank')}
                        </h4>
                        <Box
                          p={2}
                          display='flex'
                          justifyContent='center'
                          alignItems='center'
                        >
                          {canAdd && (
                            <Button
                              style={{
                                background:
                                  theme.palette.secondary.contrastText,
                                color: theme.palette.primary.light,
                              }}
                              variant='contained'
                              onClick={() => this.props.addAccount()}
                              color='secondary'
                              startIcon={<AddIcon />}
                            >
                              {t(
                                'componentData.paymentMethodTable.addAccUsbank'
                              )}
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
          <TableBody>
            <TableRow>
              <TableCell colSpan={6}>
                <Box
                  display='flex'
                  p={5}
                  justifyContent='center'
                  alignItems='center'
                >
                  <img
                    src={require(`~/assets/images/noDataImage.svg`)}
                    className='menu-icon'
                    alt=''
                  />
                </Box>
                <Box
                  style={{ display: 'table', margin: '0 auto' }}
                  p={2}
                  justifyContent='center'
                  alignItems='center'
                >
                  <h4>{t('componentData.paymentMethodTable.txtMsgUsbank')}</h4>
                  <Box
                    p={2}
                    display='flex'
                    justifyContent='center'
                    alignItems='center'
                  >
                    {canAdd && (
                      <Button
                        style={{
                          background: theme.palette.secondary.contrastText,
                          color: theme.palette.primary.light,
                        }}
                        variant='contained'
                        onClick={() => this.props.addAccount()}
                        color='secondary'
                        startIcon={<AddIcon />}
                      >
                        {t('componentData.paymentMethodTable.addAccUsbank')}
                      </Button>
                    )}
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </div>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.role,
    ...state.USBankPayment,
  }))(USbankPaymentMethodsTable)
);
