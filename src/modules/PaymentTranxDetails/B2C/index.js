import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  withStyles,
  Paper,
  InputBase,
} from '@material-ui/core';
import config from '~/config';
import GetAppIcon from '@material-ui/icons/GetApp';
import { useEffect, useRef } from 'react';
import {
  getPaymentDetails,
  getPaymentTrackingDetails,
} from '~/redux/helpers/clientPaymentTransactions';
import {
  updateCancelPayment,
  getCancelPaymentReasons,
} from '~/redux/actions/payments';
import { useState } from 'react';
import 'react-notifications/lib/notifications.css';
import B2CCustomizedSteppers from '~/components/Stepper/B2C/Stepper';
import { styles } from './styles';
import TransactionDetails from '../TransactionDetails';
import { downloadRemittanceFile } from '~/redux/helpers/files';
import CurrencyFlag from 'react-currency-flags';
import * as FileSaver from 'file-saver';
import { accessRights } from '~/config/accessRights';
import { withTranslation } from 'react-i18next';
import { SnackbarComponent } from '~/components/Notification/snackbar';
import AccountDetails from '../AccountDetails';
import { IsCancellableConst, paymentStatusMapping } from '~/utils/const';
import CancelPayment from './cancelPayment';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import PlusIcon from '~/assets/icons/add_box.svg';
import IndeterminateIcon from '~/assets/icons/indeterminate_check_box.svg';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

const B2CPaymentTranxDetails = (props) => {
  const {
    clientId,
    paymentId,
    claims,
    classes,
    t,
    selectedPayeeRemitToId,
    businessType,
    dispatch,
    userData,
  } = props;
  const [paymentDetail, setPaymentDetail] = useState({});
  const [paymentTrackingDetail, setPaymentTrackingDetail] = useState([]);
  const [activeTrackingStep, setActiveTrackingStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [snackbarMessageType, setSnackbarMessageType] = React.useState('');
  const [openCancelPaymentDialog, setOpenCancelPaymentDialog] =
    React.useState(false);
  const [cancelReasonsList, setCancelReasonsList] = React.useState([]);
  const [showReturnDescription, setShowReturnDescription] =
    React.useState(false);
  const textRef = useRef();

  React.useEffect(() => {
    if (Object.keys(paymentDetail).length && !cancelReasonsList.length) {
      getCancelPaymentReasons().then((response) => {
        if (response.data) {
          setCancelReasonsList(response.data);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentDetail, cancelReasonsList]);

  const fetchPaymentDetails = React.useCallback(
    async (paymentId) => {
      const response = await getPaymentDetails(
        clientId,
        paymentId,
        businessType
      );
      const res = await getPaymentTrackingDetails(
        clientId,
        paymentId,
        businessType
      );

      if (response && response.data) {
        const { data } = response;
        setPaymentDetail(data);
      }
      if (res && res.data) {
        let stepIndex = [...res.data];
        stepIndex = stepIndex
          .sort((a, b) => {
            if (a.StatusID > b.StatusID) {
              return -1;
            }
            if (b.StatusID > a.StatusID) {
              return 1;
            }
            return 0;
          })
          .find((el) => el.IsStatusUpdated === 1)?.StatusID;
        stepIndex = res.data.findIndex((el) => el.StatusID === stepIndex);

        setPaymentTrackingDetail(res.data);
        setActiveTrackingStep(stepIndex);
      }
    },
    [clientId, businessType]
  );

  useEffect(() => {
    fetchPaymentDetails(paymentId);
  }, [fetchPaymentDetails, paymentId]);

  const isPaymentRemittanceViewEnabled =
    (claims && claims.includes(accessRights['PAYMENTS_REMITTANCES_VIEW'])) ||
    false;
  const isPaymentRemittanceDownloadEnabled =
    (claims &&
      claims.includes(accessRights['PAYMENTS_REMITTANCES_DOWNLOAD'])) ||
    false;

  const handleClose = () => {
    setOpenSnackbar(false);
    setSnackbarMessage(null);
    setSnackbarMessageType('');
  };

  const downLoadRemittanceFile = async (paymentId, clientId, flag, isRRD) => {
    downloadRemittanceFile(paymentId, clientId, flag, isRRD, businessType)
      .then((response) => {
        if (response && response.status === 200) {
          const fileName = `${response.headers['x-file-name']}`;
          const type = response.headers['content-type'];
          const data = new Blob([response.data], {
            type: type,
            encoding: 'UTF-8',
          });
          FileSaver.saveAs(data, fileName);
          setSnackbarMessage(
            response.message ||
            t('componentData.paymentTransDetail.downloadSuccess')
          );
          setSnackbarMessageType('success');
          setOpenSnackbar(true);
        } else {
          setSnackbarMessage(
            (response && response.message) ||
            t('componentData.paymentTransDetail.fileNotFound')
          );
          setSnackbarMessageType('error');
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        setSnackbarMessage(t('componentData.paymentTransDetail.fileNotFound'));
        setSnackbarMessageType('error');
        setOpenSnackbar(true);
      });
  };

  const routeToPayee = (payeeId) => {
    props.history.push({
      pathname: '/suppliers/mySupplier',
      state: {
        selectedPayeeRemitToId: selectedPayeeRemitToId,
        payeeId
      },
    });
  };

  const routeToFileDetails = () => {
    props.history.push({
      pathname: `${config.baseName}/payments/paymentFiles/fileDetails`,
      state: {
        id: paymentDetail.FileID,
        appType: businessType,
      },
    });
  };

  const handleCancelPaymentDialog = () => {
    setOpenCancelPaymentDialog(!openCancelPaymentDialog);
  };

  const handleSubmitCancelPayment = (finalValue) => {
    const finalData = {
      clientID: clientId,
      paymentID: paymentId,
      userName: userData?.displayName,
      reason: finalValue,
    };
    dispatch(updateCancelPayment(finalData)).then((response) => {
      if (response) {
        setSnackbarMessage(t('componentData.cancelPaymentTexts.cancelSuccessMsg'));
        setSnackbarMessageType('success');
        setOpenSnackbar(true);
        fetchPaymentDetails(paymentId);
        handleCancelPaymentDialog();
      } else {
        setSnackbarMessage(t('componentData.reduxData.SomethingWentWrong'));
        setSnackbarMessageType('error');
        setOpenSnackbar(true);
      }
    });
  };

  const {
    Amount,
    ClientID,
    CreatedAt,
    CurrencyCode,
    DownloadRemittance,
    ExceptionDetails,
    FileID,
    IsHippa,
    PayeeID,
    PayeeName,
    Client_PaymentID,
    PaymentRef,
    PaymentType,
    ProcessedOn,
    RemitTo,
    RemittanceDeliveredDateTime,
    RemittanceDeliveryStatus,
    ValueDate,
    SIMMSPlanID,
    IsCancellable,
    ReturnorCorrectionReasonDesc,
    ReturnStatusID,
    ReturnorCorrectionReasonCode,
    RejectionorCorrectionSystem,
    SettlementStatus,
    RejectionExplanation,
    PayAuthLink, PaymentID, PaymentTypeDesc
  } = paymentDetail;

  const isPaymentCancelled = ReturnStatusID === paymentStatusMapping.Cancelled;

  const renderHeadings = (label) => {
    return (
      <Grid item xs={3}>
        <Typography
          className={clsx(
            classes.heading,
            isPaymentCancelled && 'isPaymentCancelled'
          )}
        >
          {label}
        </Typography>
      </Grid>
    );
  };

  const renderSubHeading = (value) => {
    return (
      <Grid item xs={3}>
        <Typography
          className={clsx(
            classes.subHeading,
            isPaymentCancelled && 'isPaymentCancelled'
          )}
        >
          {value}
        </Typography>
      </Grid>
    );
  };

  const onCopyClick = () => {
    textRef.current.select();
    document.execCommand('copy');
  };

  return (
    <>
      <Grid container item className={classes.root}>
        <Grid
          container
          className={classes.paymentGridCont}
          direction="row"
          alignItems="center"
        >
          <Box mx="auto" display="flex" alignItems="center">
            <Box mr={3} className={classes.flagText}>
              <CurrencyFlag
                style={{
                  height: '2em',
                  width: '2em',
                  borderRadius: '50%',
                  verticalAlign: 'middle',
                }}
                currency={CurrencyCode || 'USD'}
                size="lg"
              />
              {CurrencyCode || 'USD'}
            </Box>
            <Box>
              <Typography variant="h1" className={classes.bigText}>
                ${Amount}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid
          container
          className={classes.paymentGridCont}
          direction="row"
          alignItems="center"
        >
          <Box mx="auto" display="flex" alignItems="center">
            <Box mr={5}>
              <Typography variant="h1" className={classes.subText}>
                {t('componentData.paymentTransDetail.PayableTo')}
              </Typography>{' '}
            </Box>
            <Box>
              {PayeeID ? (
                <Typography
                  onClick={() => routeToPayee(PayeeID)}
                  variant="h1"
                  style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  className={classes.subText}
                >
                  {PayeeName}
                </Typography>
              ) : (
                <Typography variant="h1" className={classes.subText}>
                  {PayeeName}
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
        <Grid
          container
          className={classes.paymentGridCont}
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Box my={4} width="100%">
            {paymentTrackingDetail && paymentTrackingDetail.length ? (
              <B2CCustomizedSteppers
                stepsList={paymentTrackingDetail}
                activeStep={activeTrackingStep}
                isPaymentCancelled={isPaymentCancelled}
              />
            ) : null}
          </Box>
        </Grid>
        {isPaymentCancelled && (
          <Grid container className={classes.paymentCancelledMsg}>
            <Grid item xs={1} className={classes.infoIconGridItem}>
              <img
                src={require('~/assets/icons/info.svg')}
                alt="Info"
                className={classes.infoIcon}
              />
            </Grid>
            <Grid item xs={11}>
              <Typography className={classes.cancelledReasonMsg}>
                {ReturnorCorrectionReasonDesc}
              </Typography>
            </Grid>
          </Grid>
        )}
        <Divider className={classes.dividerRemittance} />
        {/* Start Remit */}
        <Grid container item className={classes.paymentGridCont}>
          {renderHeadings(t('componentData.paymentTransDetail.PayeeID'))}
          {renderSubHeading(RemitTo)}
          {renderHeadings(t('componentData.paymentTransDetail.ProcessedOn'))}
          {renderSubHeading(ProcessedOn)}
        </Grid>
        <Grid container item className={classes.paymentGridCont}>
          {renderHeadings(
            t('componentData.paymentTransDetail.PaymentReference')
          )}
          {renderSubHeading(PaymentRef)}
          {renderHeadings(t('componentData.paymentTransDetail.ReceivedOn'))}
          {renderSubHeading(CreatedAt)}
        </Grid>

        <Grid container item className={classes.paymentGridCont}>
          {renderHeadings(t('componentData.paymentTransDetail.PaymentID'))}
          {renderSubHeading(Client_PaymentID)}
          {PaymentType === 'ACH' &&
            renderHeadings(t('componentData.paymentTransDetail.ValueDate'))}
          {PaymentType === 'ACH' && renderSubHeading(ValueDate)}
        </Grid>

        <Grid container item className={classes.paymentGridCont}>
          {renderHeadings(t('componentData.paymentTransDetail.PaymentMethod'))}
          {renderSubHeading(Boolean(PaymentType) ? PaymentTypeDesc : null)}
          {renderHeadings(t('componentData.paymentTransDetail.FileId'))}
          <Grid item xs={3}>
            <Typography
              className={clsx(
                classes.subHeading,
                isPaymentCancelled && 'isPaymentCancelled'
              )}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => routeToFileDetails()}
            >
              {FileID}
            </Typography>
          </Grid>
          {SIMMSPlanID && (
            <>
              {renderHeadings(
                t('componentData.paymentTransDetail.SIMMSPlanID')
              )}
              {renderSubHeading(SIMMSPlanID)}
            </>
          )}
        </Grid>
        {/* End Remit */}
        <Divider className={classes.dividerBorder} />
        {/* Start Account Details*/}
        <AccountDetails
          paymentDetail={paymentDetail}
          classes={classes}
          isPaymentCancelled={isPaymentCancelled}
        />
        {/* End Account Details*/}

        {/* Start Transaction Details */}
        <Grid container item className={classes.paymentGridCont}>
          <Typography
            variant="h5"
            className={clsx(
              classes.labelHeading,
              isPaymentCancelled && 'isPaymentCancelled'
            )}
          >
            {t('componentData.paymentTransDetail.TransactionDetails')}
          </Typography>
        </Grid>
        <TransactionDetails
          {...paymentDetail}
          isPaymentCancelled={isPaymentCancelled}
        />
        {/* End Transaction Details*/}

        {/* Start Remittance Details */}
        {paymentStatusMapping.Exception === ReturnStatusID && ExceptionDetails ? (
          <>
            <Grid container item className={classes.paymentGridCont}>
              <Typography
                variant="h5"
                className={clsx(
                  classes.labelHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.ExceptionDetails')}
              </Typography>
            </Grid>
            <Grid container item xs={12} className={classes.paymentGridCont}>
              <Grid container item>
                <Typography
                  className={clsx(
                    classes.subHeading,
                    isPaymentCancelled && 'isPaymentCancelled'
                  )}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {ExceptionDetails}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : isPaymentRemittanceViewEnabled &&
          Client_PaymentID &&
          isPaymentRemittanceDownloadEnabled &&
          DownloadRemittance !== 'No' ? (
          <>
            <Grid container item className={classes.paymentGridCont}>
              <Typography
                variant="h5"
                className={clsx(
                  classes.labelHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.RemittanceDetails')}
              </Typography>
            </Grid>
            <Grid container item xs={12} className={classes.paymentGridCont}>
              <Grid container item>
                {renderHeadings(
                  t('componentData.paymentTransDetail.DeliveryDateTime')
                )}
                {renderSubHeading(RemittanceDeliveredDateTime)}
              </Grid>

              <Grid container item>
                {renderHeadings(t('componentData.paymentTransDetail.Status'))}
                {renderSubHeading(RemittanceDeliveryStatus)}
              </Grid>

              <Grid container item>
                {renderHeadings(
                  IsHippa
                    ? t('componentData.paymentTransDetail.PDFRemittance')
                    : t('componentData.paymentTransDetail.Remittance')
                )}
                <Grid item xs={6}>
                  {PaymentID &&
                    isPaymentRemittanceDownloadEnabled &&
                    DownloadRemittance !== 'No' && (
                      <IconButton
                        color="primary"
                        aria-label="download"
                        component="span"
                        size="small"
                        onClick={() =>
                          downLoadRemittanceFile(
                            PaymentID,
                            ClientID,
                            true,
                            IsHippa
                          )
                        }
                      >
                        <GetAppIcon color="primary" fontSize="small" />
                      </IconButton>
                    )}
                </Grid>
              </Grid>
              <Grid container item>
                {IsHippa === 1 &&
                  renderHeadings(
                    t('componentData.paymentTransDetail.EDIRemittance')
                  )}
                {IsHippa === 1 && (
                  <Grid item xs={6}>
                    {PaymentID &&
                      isPaymentRemittanceDownloadEnabled &&
                      DownloadRemittance !== 'No' && (
                        <IconButton
                          color="primary"
                          aria-label="download"
                          component="span"
                          size="small"
                          onClick={() =>
                            downLoadRemittanceFile(PaymentID, ClientID, true, 0)
                          }
                        >
                          <GetAppIcon color="primary" fontSize="small" />
                        </IconButton>
                      )}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </>
        ) : null}

        {/* End Remittance Details */}

        {SettlementStatus && (
          <>
            <Grid container item className={classes.paymentGridCont}>
              <Typography
                variant="h5"
                className={clsx(
                  classes.labelHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.SettlementStatus')}
              </Typography>
            </Grid>
            <Grid container item xs={6} className={classes.paymentGridCont}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {SettlementStatus}
              </Typography>
            </Grid>
          </>
        )}

        {RejectionorCorrectionSystem && (
          <>
            <Grid container item className={classes.paymentGridCont}>
              <Typography
                variant="h5"
                className={clsx(
                  classes.labelHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t('componentData.paymentTransDetail.ReturnCorrectionSystem')}
              </Typography>
            </Grid>
            <Grid container item xs={6} className={classes.paymentGridCont}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {RejectionorCorrectionSystem}
              </Typography>
            </Grid>
          </>
        )}

        {ReturnorCorrectionReasonCode && (
          <>
            <Grid container item className={classes.paymentGridCont}>
              <Typography
                variant="h5"
                className={clsx(
                  classes.labelHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t(
                  'componentData.paymentTransDetail.ReturnCorrectionReasonCode'
                )}
              </Typography>
            </Grid>
            <Grid container item xs={6} className={classes.paymentGridCont}>
              <Typography
                className={clsx(
                  classes.subHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {ReturnorCorrectionReasonCode}
              </Typography>
            </Grid>
          </>
        )}
        {ReturnorCorrectionReasonDesc && (
          <>
            <Grid container item className={classes.paymentGridCont}>
              <Typography
                variant="h5"
                className={clsx(
                  classes.labelHeading,
                  isPaymentCancelled && 'isPaymentCancelled'
                )}
              >
                {t(
                  'componentData.paymentTransDetail.ReturnCorrectionReasonDescription'
                )}
              </Typography>
            </Grid>
            <Grid container item xs={6} className={classes.paymentGridCont}>
              <Grid container style={{ flexWrap: 'nowrap' }}>
                {RejectionExplanation && (
                  <Grid item>
                    <img
                      src={showReturnDescription ? IndeterminateIcon : PlusIcon}
                      style={{
                        marginTop: '-7px',
                        cursor: 'pointer',
                        marginRight: '16px',
                      }}
                      alt="plusIcon"
                      onClick={() =>
                        setShowReturnDescription(!showReturnDescription)
                      }
                    />
                  </Grid>
                )}
                <Grid item>
                  <Typography
                    className={clsx(
                      classes.subHeading,
                      isPaymentCancelled && 'isPaymentCancelled'
                    )}
                  >
                    {ReturnorCorrectionReasonDesc}
                  </Typography>
                </Grid>
              </Grid>
              {showReturnDescription && (
                <Grid container>
                  <Grid item style={{ marginLeft: '40px' }}>
                    <Typography
                      className={clsx(
                        classes.descText,
                        isPaymentCancelled && 'isPaymentCancelled'
                      )}
                    >
                      {RejectionExplanation}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </>
        )}

        <SnackbarComponent
          openSnackbar={openSnackbar}
          handleClose={handleClose}
          snackbarMessage={snackbarMessage}
          icon={false}
          messageVariant={snackbarMessageType}
        />
        {/*Start Cancel Payment*/}
        {IsCancellable === IsCancellableConst['Yes'] && (
          <CancelPayment
            cancelReasonsList={cancelReasonsList}
            handleCancelPaymentDialog={handleCancelPaymentDialog}
            openCancelPaymentDialog={openCancelPaymentDialog}
            handleSubmitCancelPayment={handleSubmitCancelPayment}
          />
        )}
        {/*End Cancel Payment*/}
      </Grid>

      {PayAuthLink ? (
        <>
          <Box className={classes.paymentGridCont} pt={1} pb={2}>
            <Typography style={{ color: '#2B2D30' }}>
              {t('componentData.paymentTransDetail.PaymentAuthUrl')}
            </Typography>
          </Box>
          <Grid container xs={12} className={classes.paymentGridCont}>
            <Grid item xs={6}>
              <Paper
                component="form"
                style={{ display: 'flex', height: '40px' }}
              >
                <InputBase
                  inputRef={textRef}
                  style={{ width: '80%', padding: '0 8px' }}
                  value={PayAuthLink}
                  inputProps={{ 'aria-label': 'resend link' }}
                />
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 5px',
                  }}
                >
                  <IconButton
                    style={{ color: '#008CE6', padding: '5px' }}
                    aria-label="search"
                    onClick={onCopyClick}
                  >
                    <FileCopyOutlinedIcon fontSize="small" />
                  </IconButton>
                  <Typography style={{ color: '#008CE6' }}>
                    {t('componentData.paymentTransDetail.CopyButton')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default withTranslation()(withStyles(styles)(B2CPaymentTranxDetails));
