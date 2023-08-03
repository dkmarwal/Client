import React, { Component } from 'react';
import Notification from '~/components/Notification';
import {
  Grid,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Typography,
  TablePagination,
  TableFooter,
  Button,
} from '@material-ui/core';
import { TabPanel } from '~/components/TabPanel/index';
import config from '~/config';
import PaymentFilesDetails from './paymentFilesDetails';
import USbankPaymentFilesDetails from './USbankpaymentFilesDetails';
import PaymentDetails from './paymentDetails';
import USbankPaymentDetails from './USbankpaymentDetails';
import { withStyles } from '@material-ui/core/styles';
import GetAppIcon from '@material-ui/icons/GetApp';
import IconButton from '@material-ui/core/IconButton';
import {
  fetchFileByFileId,
  updatePaymentFileAction,
  downloadPaymentFile,
  fetchFileExceptionsById,
} from '~/redux/helpers/files';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { paymentMethodIds } from '~/config/paymentMethods';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { styles } from './styles';
import { accessRights } from '~/config/accessRights';
import * as FileSaver from 'file-saver';
import { entityType } from '~/config/entityTypes';
import PayeeEnrollmentDetails from '~/modules/PayeeEnrollmentDetails';

class FileDetails extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      appType: state && state.appType ? state.appType : entityType.B2B,
      error: false,
      variant: 'error',
      isLoading: false,
      fileId: state && state.id ? state.id : null,
      paymentFileData: [],
      paymentData: [],
      paymentException: {},
      selectedTab: 0,
      totalExceptions: 0,
      pageNumber: 1,
      count: 2,
      COMBOFile: 'N',
      PaymentSummary: [],
      selectedPaymentTab: 0,
    };
  }

  downLoadPaymentsFile = (id) => {
    const { t } = this.props;
    downloadPaymentFile(id)
      .then((response) => {
        const fileName = `${response.headers['x-file-name']}`;
        if (!response) {
          this.setState({
            error: t('componentData.fileDetails.FileNotExists'),
          });
          return false;
        }
        const type = response.headers['content-type'];
        const data = new Blob([response.data], {
          type: type,
          encoding: 'UTF-8',
        });
        FileSaver.saveAs(data, fileName);
        this.setState({ error: false });
      })
      .catch((error) => {
        this.setState({ error: t('componentData.fileDetails.FileNotExists') });
      });
  };
  componentDidMount() {
    this.setState({
      isLoading:true
    },()=>{
      this.loadData();
    })
  }
  fetchExceptions = () => {
    const { fileId, pageNumber, count } = this.state;
    const { portalProfileId } = this.props.user.userData;
    const { userData, isPayeeChoicePortal } = this.props.user;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    let payload = {
      clientID: portalProfileId,
      fileID: fileId,
      pageNumber: pageNumber,
      rowCount: count,
      BusinessType: appType,
    };
    fetchFileExceptionsById(payload).then((res) => {
      if (res.error) {
        this.setState({
          error: res.message,
          variant: 'error',
        });
        return;
      }
      this.setState({
        totalExceptions: res.data && res.data['TotalRecords'],
        paymentException: isPayeeChoicePortal
          ? this.multipleGroupBy(
              res.data ? res.data && res.data.ExceptionDetails : {},
              ['Client_PaymentID', 'PayeeIdentifier']
            )
          : this.groupBy(
              res.data ? res.data && res.data.ExceptionDetails : {},
              'Client_PaymentID'
            ),
      });
    });
  };
  loadData = () => {
    const { fileId, pageNumber, count } = this.state;
    const { t } = this.props;
    const { userData, isPayeeChoicePortal } = this.props.user;
    const { portalProfileId } = this.props.user.userData;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    const payload = {
      clientID: portalProfileId,
      fileID: fileId,
      pageNumber: pageNumber,
      rowCount: count,
      BusinessType: appType,
    };
    fetchFileByFileId(fileId, appType)
      .then((response) => {
        if (response.error) {
          this.setState({
            isLoading:false
          })
          throw response.error;
        }

        fetchFileExceptionsById(payload).then((res) => {
          this.fetchExceptions();
          this.setState({
            isLoading:false,
            paymentFileData:
              response.data[0] && response.data[0].PaymentFileDetails[0]
                ? response.data[0].PaymentFileDetails[0]
                : [],
            paymentData: response.data[0]
              ? response.data[0].PaymentDetails
              : [],
            COMBOFile:
              response?.data[0]?.PaymentFileDetails[0]?.COMBOFile ?? 'N',
            totalExceptions: res.data && res.data['TotalRecords'],
            paymentException: isPayeeChoicePortal
              ? this.multipleGroupBy(
                  res.data ? res.data && res.data.ExceptionDetails : {},
                  ['Client_PaymentID', 'PayeeIdentifier']
                )
              : this.groupBy(
                  res.data ? res.data && res.data.ExceptionDetails : {},
                  'Client_PaymentID'
                ),
            PaymentSummary: response.data[0].PaymentSummary || [],
          });
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          error:
            typeof error === 'string'
              ? error
              : t('componentData.fileDetails.unknownErr'),
          variant: 'error',
        });
      });
  };
  multipleGroupBy = (objectArray, groupProperty) => {
    let groupedData = {};
    objectArray.forEach(function (a) {
      groupProperty
        .reduce(function (o, g, i) {
          // take existing object,
          o[a[g]] = o[a[g]] || (i + 1 === groupProperty.length ? [] : {}); // or generate new obj, or
          return o[a[g]]; // at last, then an array
        }, groupedData)
        .push(a);
    });
    return groupedData;
  };
  groupBy = (objectArray, property) => {
    return (
      objectArray &&
      objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
      }, {})
    );
  };
  handleBtnClick = async (item) => {
    const { t } = this.props;
    const { userData } = this.props.user;
    const { fileId } = this.state;
    const data = [
      {
        fileID: fileId,
        actions: item === 'approve' ? 2 : item === 'reject' ? 4 : 1,
        userName: userData.displayName,
      },
    ];

    const res = await updatePaymentFileAction(data);
    if (res.error) {
      this.setState({
        error: t('componentData.fileDetails.SomethingWrong'),
        variant: 'error',
      });
    }
    this.props.history.push(`${config.baseName}/payments/paymentFiles`);
    this.setState({
      error: t('componentData.fileDetails.ActionUpdated'),
      variant: 'success',
    });
  };
  handleTabChange = (val) => {
    this.setState({ selectedTab: val });
  };

  handleSecTabChange = (event, index) => {
    this.setState({
      selectedPaymentTab: index,
    });
  };

  render() {
    const { classes, user, t } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    const {
      error,
      variant,
      isLoading,
      paymentFileData,
      paymentData,
      paymentException,
      fileId,
      selectedTab,
      totalExceptions,
      pageNumber,
      count,
      appType,
      PaymentSummary,
      selectedPaymentTab,
    } = this.state;
    const isPaymentApproveEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights['PAYMENTS_MY_FILES_APPROVE'])) ||
      false;
    const isPaymentRejectEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights['PAYMENTS_MY_FILES_REJECT'])) ||
      false;
    const isPaymentRecalEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['PAYMENTS_MY_FILES_RECALCULATION']
        )) ||
      false;
    const isPaymentDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights['PAYMENTS_MY_FILES_DOWNLOAD'])) ||
      false;
    if (isLoading) {
      return (
        <Box className='loader-container'>
          <CircularProgress color='primary' />
        </Box>
      );
    }
    return (
      <>
        <Box
          mx={6}
          mt={1}
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Box>
            <h4 className={classes.fileText}>
              {' '}
              <span> {t('componentData.fileDetails.MyFiles')} </span> /{' '}
              <span
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  this.props.history.push(
                    `${config.baseName}/payments/paymentFiles`
                  )
                }
              >
                {t('componentData.fileDetails.FileID')} {fileId}{' '}
              </span>
            </h4>
          </Box>
          <Box className={classes.buttonAlign}>
            {isPaymentRecalEnabled && appType !== 2 && (
              <Button
                color='primary'
                size='small'
                onClick={() => this.handleBtnClick('recalc')}
                disabled={
                  paymentFileData &&
                  paymentFileData.FileStatus === 'Requires Attention'
                    ? false
                    : true
                }
              >
                {' '}
                <AutorenewIcon size='small' />{' '}
                {t('componentData.fileDetails.Recalculation')}
              </Button>
            )}
            {isPaymentRejectEnabled && (
              <Button
                color='primary'
                size='small'
                onClick={() => this.handleBtnClick('reject')}
                disabled={
                  (paymentFileData &&
                    paymentFileData.FileStatus === 'Waiting for Approval') ||
                  (paymentFileData &&
                    paymentFileData.FileStatus === 'Requires Attention')
                    ? false
                    : true
                }
              >
                {' '}
                <CancelIcon size='small' />{' '}
                {t('componentData.fileDetails.Reject')}{' '}
              </Button>
            )}
            {isPaymentApproveEnabled && (
              <Button
                color='primary'
                size='small'
                onClick={() => this.handleBtnClick('approve')}
                disabled={
                  (paymentFileData &&
                    paymentFileData.FileStatus === 'Waiting for Approval') ||
                  (paymentFileData &&
                    paymentFileData.FileStatus === 'Requires Attention')
                    ? false
                    : true
                }
              >
                {' '}
                <CheckCircleIcon size='small' />
                {t('componentData.fileDetails.Approve')}{' '}
              </Button>
            )}
          </Box>
        </Box>

        <Box mx={6} my={2} display='flex' alignItems='stretch'>
          <Box
            bgcolor='white'
            p={1}
            width='100%'
            boxShadow={
              '0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2)'
            }
          >
            <Box
              fontSize={16}
              color='primary'
              textAlign='left'
              display='flex'
              alignItems='center'
              style={{
                wordBreak: 'break-word',
                float: 'left',
                maxWidth: '90%',
              }}
            >
              <span style={{ color: '#0098e9', paddingRight: '10px' }}>
                {' '}
                {t('componentData.fileDetails.PaymentFileName')}{' '}
              </span>{' '}
              {paymentFileData && paymentFileData.FileName
                ? paymentFileData.FileName
                : '--'}
              {isPaymentDownloadEnabled && (
                <IconButton
                  color='primary'
                  aria-label='download'
                  component='span'
                  size='small'
                  style={{ marginLeft: '10px' }}
                  onClick={() =>
                    this.downLoadPaymentsFile(paymentFileData.FileID)
                  }
                >
                  <GetAppIcon color='primary' fontSize='small' />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>

        <Box className={classes.paymenyTabArea}>
          <Tabs
            value={selectedPaymentTab}
            indicatorColor='primary'
            textColor='primary'
            onChange={this.handleSecTabChange}
            aria-label='disabled tabs example'
          >
            <Tab label={t('componentData.fileDetails.PaymentDetails')} />
            <Tab label={t('componentData.fileDetails.EnrollmentDetails')} />
          </Tabs>
        </Box>

        {selectedPaymentTab === 0 && (
          <>
            <Box
              p={2}
              display='flex'
              justifyContent='space-between'
              alignItems='stretch'
            >
              {isPayeeChoicePortal ? (
                <USbankPaymentFilesDetails
                  paymentFileData={paymentFileData}
                  {...this.props}
                />
              ) : (
                <PaymentFilesDetails
                  paymentFileData={paymentFileData}
                  {...this.props}
                />
              )}
            </Box>

            {/********2nd Row *********/}
            <Box
              p={2}
              display='flex'
              justifyContent='space-between'
              alignItems='stretch'
            >
              {isPayeeChoicePortal ? (
                <USbankPaymentDetails
                  paymentFileData={paymentFileData}
                  PaymentSummary={PaymentSummary}
                  {...this.props}
                />
              ) : (
                <PaymentDetails
                  paymentFileData={paymentFileData}
                  PaymentSummary={PaymentSummary}
                  {...this.props}
                />
              )}
            </Box>
          </>
        )}

        {selectedPaymentTab === 1 && (
          <>
            <PayeeEnrollmentDetails
              parentFileData={paymentFileData}
              fileId={fileId}
              type='paymentFile'
              {...this.props}
            />
          </>
        )}

        <Box
          mx={6}
          mt={3}
          justifyContent='space-between'
          alignItems='center'
          style={{ float: 'left', width: '92%', clear: 'both' }}
        >
          <Grid item xs={12}>
            <div className={classes.paymentsTabContainer}>
              <Grid item xs={12} md={12} lg={12}>
                <Tabs
                  orientation='horizontal'
                  variant='standard'
                  value={selectedTab}
                  TabIndicatorProps={{ className: classes.indicator }}
                  style={{
                    color: '#008CE6',
                    padding: '0 20px',
                    boxSizing: 'border-box',
                  }}
                >
                  <Tab
                    onClick={() => this.handleTabChange(0)}
                    label={`${t('componentData.fileDetails.Exceptions')} (${
                      (paymentFileData && paymentFileData['ExceptionCount']) ||
                      0
                    })`}
                    disabled={false}
                    classes={classes.tabClasses}
                  />
                  <Tab
                    onClick={() => this.handleTabChange(1)}
                    label={t('componentData.fileDetails.DebitAccounts')}
                    disabled={false}
                  />
                </Tabs>
              </Grid>

              <Grid item xs={12} md={12}>
                <TabPanel
                  value={selectedTab}
                  index={0}
                  className={classes.tabContentArea}
                >
                  <Grid container style={{ borderRadius: '10px' }}>
                    {paymentException &&
                      Object.keys(paymentException).length > 0 && (
                        <>
                          <Grid
                            container
                            style={{
                              background: '#CEE1F0',
                              display: 'flex',
                              padding: '8px',
                              borderRadius: '10px 10px 0 0',
                              fontSize: '18px',
                            }}
                          >
                            {isPayeeChoicePortal ? (
                              <>
                                <Grid item xs={4}>
                                  {t('componentData.fileDetails.PayeeID')}
                                </Grid>
                                <Grid item xs={4}>
                                  {t('componentData.fileDetails.PreferenceID')}
                                </Grid>
                                <Grid item xs={4}>
                                  {t(
                                    'componentData.fileDetails.ReasonForException'
                                  )}
                                </Grid>
                              </>
                            ) : (
                              <>
                                <Grid item xs={3}>
                                  {t('componentData.fileDetails.PaymentIDTxt')}
                                </Grid>
                                <Grid item xs={9}>
                                  {t(
                                    'componentData.fileDetails.ReasonForException'
                                  )}
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </>
                      )}

                    {!isPayeeChoicePortal
                      ? paymentException &&
                        Object.keys(paymentException).length > 0 &&
                        Object.keys(paymentException).map((item, index) => {
                          return (
                            <>
                              <Grid
                                item
                                xs={12}
                                className={classes.repeatedBox}
                              >
                                <Box>
                                  <Box>
                                    <Grid container>
                                      <Grid item xs={3}>
                                        <span
                                          style={{
                                            wordBreak: 'break-all',
                                            textDecoration: 'underline',
                                          }}
                                          onClick={() =>
                                            this.props.history.push(
                                              `${config.baseName}/payments/paymentDetails?PaymentID=${item}`
                                            )
                                          }
                                        >
                                          <span className={classes.pointer}>
                                            {item}
                                          </span>
                                        </span>
                                      </Grid>
                                      <Grid item xs={9}>
                                        {paymentException[item].map(
                                          (value, index) => (
                                            <div>
                                              {index + 1}
                                              {'. '}
                                              {value.Exception}
                                            </div>
                                          )
                                        )}
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Box>
                              </Grid>
                            </>
                          );
                        })
                      : paymentException &&
                        Object.keys(paymentException)?.map((item, index) => {
                          const payeeID = Object.keys(paymentException[item])?.[0] ?? "";
                          const PaymentID = Object.values(paymentException[item])?.[0][0].PaymentID
                          ?? "";
                         
                          return (
                            <>
                              <Grid
                                item
                                xs={12}
                                className={classes.repeatedBox}
                              >
                                <Box>
                                  <Box>
                                    <Grid container>
                                      <Grid item xs={4} style={{paddingRight:"8px"}}>
                                        <span
                                          style={{
                                            wordBreak: 'break-all',
                                            textDecoration: 'underline',
                                          }}
                                          onClick={() =>
                                            this.props.history.push(
                                              `${config.baseName}/payments/paymentDetails?PayeeID=${payeeID}&PaymentID=${PaymentID}`
                                            )
                                          }
                                        >
                                          <span className={classes.pointer}>
                                            {payeeID}
                                          </span>
                                        </span>
                                      </Grid>
                                      {Object.values(
                                        paymentException[item]
                                      )?.map((payeeDataItem, payeeDataIndex) => {
                                        return (
                                          <>
                                            <Grid item xs={4} style={{paddingRight:"8px"}}>
                                              <span
                                                style={{
                                                  wordBreak: 'break-all',
                                                  textDecoration: 'underline',
                                                }}
                                                onClick={() =>
                                                  this.props.history.push(
                                                    `${config.baseName}/payments/paymentDetails?PreferenceID=${payeeDataItem[payeeDataIndex].PaymentRef}&PaymentID=${payeeDataItem[payeeDataIndex].PaymentID}`
                                                  )
                                                }
                                              >
                                                <span
                                                  className={classes.pointer}
                                                >
                                                  {
                                                    payeeDataItem[
                                                      payeeDataIndex
                                                    ]?.PaymentRef
                                                  }
                                                </span>
                                              </span>
                                            </Grid>
                                            <Grid item xs={4} >
                                              {payeeDataItem?.map(
                                                (
                                                  payeeExceptionItem,
                                                  payeeExceptionIndex
                                                ) => {
                                                  return (
                                                    <div>
                                                      {payeeExceptionIndex + 1}
                                                      {'. '}
                                                      {
                                                        payeeExceptionItem.Exception
                                                      }
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </Grid>
                                          </>
                                        );
                                      })}
                                    </Grid>
                                  </Box>
                                </Box>
                              </Grid>
                            </>
                          );
                        })}

                    <TableFooter
                      style={{ width: '100%', float: 'right' }}
                      className={classes.tablePaginationBox}
                    >
                      <Box display='flex' justifyContent='flex-end'>
                        {paymentException &&
                          Object.keys(paymentException).length > 0 && (
                            <TablePagination
                              labelRowsPerPage={t(
                                'componentData.fileDetails.rowsPerPage'
                              )}
                              rowsPerPageOptions={[2, 5, 10]} // { label: 'All', value: -1 }
                              colSpan={7}
                              count={totalExceptions}
                              rowsPerPage={count}
                              page={pageNumber - 1}
                              SelectProps={{
                                inputProps: {
                                  'aria-label': t(
                                    'componentData.fileDetails.rowsPerPage'
                                  ),
                                },
                                native: true,
                              }}
                              onChangePage={(e, page) => {
                                this.setState({ pageNumber: page + 1 }, () =>
                                  this.fetchExceptions()
                                );
                              }}
                              onChangeRowsPerPage={(e) => {
                                this.setState(
                                  { count: parseInt(e.target.value),
                                    pageNumber: 1, },
                                  () => this.fetchExceptions()
                                );
                              }}
                              labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} ${t(
                                  'componentData.fileName.Of'
                                )} ${
                                  count !== -1
                                    ? count
                                    : `${t(
                                        'componentData.fileName.MoreThan'
                                      )} ${to}`
                                }`
                              }
                              //  ActionsComponent={TablePaginationActions}
                            />
                          )}
                      </Box>
                    </TableFooter>
                  </Grid>
                </TabPanel>

                <TabPanel
                  value={selectedTab}
                  index={1}
                  className={classes.tabContentArea}
                >
                  <Grid
                    container
                    className={classes.details}
                    style={{ borderRadius: '10px', background: '#fff' }}
                  >
                    {paymentData &&
                      paymentData.map((data, index) =>
                      
                        isPayeeChoicePortal ? (
                          !(data.PaymentTypeID ===paymentMethodIds['USBankDepositToDebitcard']) ? 
                          (
                            <>
                              <Grid
                                item
                                xs={12}
                                md={12}
                                className={classes.repeatedBox2}
                              >
                                <Box>
                                  <Grid container>
                                    <Grid item xs={5} sm={5}>
                                      <Box my={1}>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                        >
                                          <b>
                                            {t(
                                              'componentData.fileDetails.DebitAccount'
                                            )}
                                          </b>
                                        </Typography>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                        >
                                          {(data && data.MaskedDebitAccount) ||
                                            '--'}
                                        </Typography>
                                      </Box>
                                      <Box my={1}>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                        >
                                          <b>
                                            {t(
                                              'componentData.fileDetails.TotalDebitAmount'
                                            )}
                                          </b>
                                        </Typography>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                        >
                                          {(data && data.TotalDebitAmount) ||
                                            '--'}
                                        </Typography>
                                      </Box>

                                      {/* <Box my={1}>
                                    <Typography
                                      variant="span"
                                      className={classes.key}
                                    >
                                      <b>{t('componentData.fileDetails.ValueDate')}</b>
                                    </Typography>
                                    <Typography
                                      variant="span"
                                      className={classes.key}
                                    >
                                      {(data && data.ValueDate) || "--"}
                                    </Typography>
                                  </Box> */}

                                      <Box my={1}>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                        >
                                          <b>
                                            {t(
                                              'componentData.fileDetails.PaymentTypes'
                                            )}{' '}
                                          </b>
                                        </Typography>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                        >
                                          {(data && data.PaymentType) || '--'}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                    <Grid item xs={5} sm={5}>
                                      <Box my={1}>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                        >
                                          <b>
                                            {t(
                                              'componentData.fileDetails.Currency'
                                            )}{' '}
                                          </b>
                                        </Typography>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                        >
                                          {(data && data.Currency) || '--'}
                                        </Typography>
                                      </Box>
                                      <Box my={1}>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                        >
                                          <b>
                                            {t(
                                              'componentData.fileDetails.NumberOfPayments'
                                            )}
                                          </b>
                                        </Typography>
                                        <Typography
                                          variant='span'
                                          className={classes.key}
                                          id={data.DebitAccountID}
                                          onClick={() =>
                                            this.props.history.push(
                                              `${config.baseName}/payments/paymentDetails?DebitAccountID=${data.DebitAccountID}&FileID=${paymentFileData.FileID}&paymentTypeIDs=${data.PaymentTypeID}&AddFilter=4`
                                            )
                                          }
                                        >
                                          <u className={classes.pointer}>
                                            {' '}
                                            {(data && data.NoofPayments) ||
                                              '--'}
                                          </u>
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  </Grid>
                                </Box>
                              </Grid>
                            </>
                          ) 
                          : (
                            <></>
                          )
                        ) : (
                          <>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              className={classes.repeatedBox2}
                            >
                              <Box>
                                <Grid container>
                                  <Grid item xs={5} sm={5}>
                                    <Box my={1}>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                      >
                                        <b>
                                          {t(
                                            'componentData.fileDetails.DebitAccount'
                                          )}
                                        </b>
                                      </Typography>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                      >
                                        {(data && data.MaskedDebitAccount) ||
                                          '--'}
                                      </Typography>
                                    </Box>
                                    <Box my={1}>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                      >
                                        <b>
                                          {t(
                                            'componentData.fileDetails.TotalDebitAmount'
                                          )}
                                        </b>
                                      </Typography>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                      >
                                        {(data && data.TotalDebitAmount) ||
                                          '--'}
                                      </Typography>
                                    </Box>

                                    {/* <Box my={1}>
                                  <Typography
                                    variant="span"
                                    className={classes.key}
                                  >
                                    <b>{t('componentData.fileDetails.ValueDate')}</b>
                                  </Typography>
                                  <Typography
                                    variant="span"
                                    className={classes.key}
                                  >
                                    {(data && data.ValueDate) || "--"}
                                  </Typography>
                                </Box> */}

                                    <Box my={1}>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                      >
                                        <b>
                                          {t(
                                            'componentData.fileDetails.PaymentTypes'
                                          )}{' '}
                                        </b>
                                      </Typography>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                      >
                                        {(data && data.PaymentType) || '--'}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={5} sm={5}>
                                    <Box my={1}>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                      >
                                        <b>
                                          {t(
                                            'componentData.fileDetails.Currency'
                                          )}{' '}
                                        </b>
                                      </Typography>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                      >
                                        {(data && data.Currency) || '--'}
                                      </Typography>
                                    </Box>
                                    <Box my={1}>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                      >
                                        <b>
                                          {t(
                                            'componentData.fileDetails.NumberOfPayments'
                                          )}
                                        </b>
                                      </Typography>
                                      <Typography
                                        variant='span'
                                        className={classes.key}
                                        id={data.DebitAccountID}
                                        onClick={() =>
                                          this.props.history.push(
                                            `${config.baseName}/payments/paymentDetails?DebitAccountID=${data.DebitAccountID}&FileID=${paymentFileData.FileID}&paymentTypeIDs=${data.PaymentTypeID}&AddFilter=4`
                                          )
                                        }
                                      >
                                        <u className={classes.pointer}>
                                          {' '}
                                          {(data && data.NoofPayments) || '--'}
                                        </u>
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </Box>
                            </Grid>
                          </>
                        )
                      )}
                  </Grid>
                </TabPanel>
              </Grid>
            </div>
          </Grid>
        </Box>
        {error && <Notification variant={variant} message={error} />}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user }))(withStyles(styles)(FileDetails))
);
