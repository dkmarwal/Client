import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  withStyles,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import config from "~/config";
import { useEffect } from 'react';
import {
  getPaymentDetails,
  getPaymentTrackingDetails
} from '~/redux/helpers/clientPaymentTransactions';
import { useState } from 'react';
import 'react-notifications/lib/notifications.css';
import CustomizedSteppers from '~/components/Stepper/Stepper';
import { styles } from './styles';
import TransactionDetails from './TransactionDetails';
import { downloadRemittanceFile } from '~/redux/helpers/files';
import CurrencyFlag from 'react-currency-flags';
import * as FileSaver from 'file-saver';
import { accessRights } from '~/config/accessRights';
import { withTranslation } from 'react-i18next';
import { SnackbarComponent } from '~/components/Notification/snackbar';
import AccountDetails from './AccountDetails'
import Divider from '@material-ui/core/Divider'
import PlusIcon from '~/assets/icons/add_box.svg';
import IndeterminateIcon from '~/assets/icons/indeterminate_check_box.svg';

const PaymentTranxDetails = (props) => {
  const { clientId, paymentId, claims, classes, t, selectedPayeeRemitToId, businessType } = props
  const [paymentDetail, setPaymentDetail] = useState({});
  const [paymentTrackingDetail, setPaymentTrackingDetail] = useState([]);
  const [activeTrackingStep, setActiveTrackingStep] = useState(0);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);
  const [snackbarMessageType, setSnackbarMessageType] = React.useState('');
  const [showReturnDescription, setShowReturnDescription] = React.useState(false);

  const fetchPaymentDetails = React.useCallback(
    async (paymentId) => {
      const response = await getPaymentDetails(clientId, paymentId, businessType);
      const res = await getPaymentTrackingDetails(clientId, paymentId, businessType);

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
      pathname: "/suppliers/mySupplier",
      state: {
        selectedPayeeRemitToId: selectedPayeeRemitToId
      }
    })
  }

  const routeToFileDetails = () => {
    props.history.push({
      pathname: `${config.baseName}/payments/paymentFiles/fileDetails`,
      state: {
        id: paymentDetail.FileID,
        appType: businessType,
      }
    })
  }

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
    PaymentID,
    PaymentRef,
    PaymentStatus,
    PaymentType,
    ProcessedOn,
    RemitTo,
    RemittanceDeliveredDateTime,
    RemittanceDeliveryStatus,
    ValueDate,
    ReturnorCorrectionReasonDesc,
    ReturnorCorrectionReasonCode,
    RejectionorCorrectionSystem,
    SettlementStatus,
    RejectionExplanation
  } = paymentDetail;

  return (
    <>
      <Grid container item className={classes.root}>
        <Grid container direction="row" alignItems="center" className={classes.paymentGridCont}>
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

        <Grid container direction="row" alignItems="center" className={classes.paymentGridCont}>
          <Box mx="auto" display="flex" alignItems="center">
            <Box mr={5}>
              <Typography variant="h1" className={classes.subText}>
                {t('componentData.paymentTransDetail.PayableTo')}
              </Typography>{' '}
            </Box>
            <Box>
              {PayeeID ? <Typography onClick={() => routeToPayee(PayeeID)} variant="h1" style={{ cursor: 'pointer', textDecoration: 'underline' }} className={classes.subText}>
                {PayeeName}
              </Typography> : <Typography variant="h1" className={classes.subText}>
                {PayeeName}
              </Typography>}

            </Box>
          </Box>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center" className={classes.paymentGridCont}>
          <Box my={4} width="100%">
            {paymentTrackingDetail && paymentTrackingDetail.length ? (
              <CustomizedSteppers
                stepsList={paymentTrackingDetail}
                activeStep={activeTrackingStep}
              />
            ) : null}
          </Box>
        </Grid>
        <Divider className={classes.dividerRemittance} />
        {/* Start Remit */}
        <Grid container item className={classes.paymentGridCont}>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.heading}>
              {' '}
              {t('componentData.paymentTransDetail.RemitToID')}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.subHeading}> {RemitTo}</Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.heading}>
              {' '}
              {t('componentData.paymentTransDetail.ProcessedOn')}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.subHeading}>
              {' '}
              {ProcessedOn}{' '}
            </Typography>
          </Grid>
        </Grid>
        <Grid container item className={classes.paymentGridCont}>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.heading}>
              {' '}
              {t('componentData.paymentTransDetail.PaymentReference')}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.subHeading}>
              {' '}
              {PaymentRef}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.heading}>
              {' '}
              {t('componentData.paymentTransDetail.ReceivedOn')}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.subHeading}> {CreatedAt}</Typography>
          </Grid>
        </Grid>

        <Grid container item className={classes.paymentGridCont}>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.heading}>
              {' '}
              {t('componentData.paymentTransDetail.PaymentID')}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.subHeading}> {PaymentID}</Typography>
          </Grid>
          {PaymentType === 'ACH' && (
            <Grid item xs={3}>
              {' '}
              <Typography className={classes.heading}>
                {' '}
                {t('componentData.paymentTransDetail.ValueDate')}
              </Typography>
            </Grid>
          )}
          {PaymentType === 'ACH' && (
            <Grid item xs={3}>
              {' '}
              <Typography className={classes.subHeading}>
                {' '}
                {ValueDate}{' '}
              </Typography>
            </Grid>
          )}
        </Grid>

        <Grid container item className={classes.paymentGridCont}>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.heading}>
              {' '}
              {t('componentData.paymentTransDetail.PaymentMethod')}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.subHeading}>
              {' '}
              {PaymentType}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.heading}>
              {' '}
              {t('componentData.paymentTransDetail.FileId')}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {' '}
            <Typography className={classes.subHeading}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => routeToFileDetails()}>
              {FileID}
            </Typography>
          </Grid>
        </Grid>
        {/* End Remit */}

        <Divider className={classes.dividerBorder} />
        {/* Start Account Details*/}
        <AccountDetails paymentDetail={paymentDetail} classes={classes} />
        {/* End Account Details*/}

        {/* Start Transaction Details */}
        <Grid container item className={classes.paymentGridCont}>
          <Typography variant="h5" className={classes.labelHeading}>
            {t('componentData.paymentTransDetail.TransactionDetails')}
          </Typography>
        </Grid>
        <TransactionDetails {...paymentDetail} />
        {/* End Transaction Details*/}

        {/* Start Remittance Details */}
        {PaymentStatus === 'Exception' ? (
          <>
            <Grid container item className={classes.paymentGridCont}>
              <Typography variant="h5" className={classes.labelHeading}>
                {' '}
                {t('componentData.paymentTransDetail.ExceptionDetails')}
              </Typography>
            </Grid>
            <Grid container item xs={12} className={classes.paymentGridCont}>
              <Grid container item>
                <Typography
                  className={classes.subHeading}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {ExceptionDetails}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : isPaymentRemittanceViewEnabled ? (
          <>
            <Grid container item className={classes.paymentGridCont}>
              <Typography variant="h5" className={classes.labelHeading}>
                {' '}
                {t('componentData.paymentTransDetail.RemittanceDetails')}
              </Typography>
            </Grid>
            <Grid container item xs={6} className={classes.paymentGridCont}>
              <Grid container item>
                <Grid item xs={6}>
                  {' '}
                  <Typography className={classes.heading}>
                    {t('componentData.paymentTransDetail.DeliveryDateTime')}
                  </Typography>{' '}
                </Grid>
                <Grid item xs={6}>
                  {' '}
                  <Typography className={classes.subHeading}>
                    {RemittanceDeliveredDateTime}
                  </Typography>{' '}
                </Grid>
              </Grid>

              <Grid container item>
                <Grid item xs={6}>
                  {' '}
                  <Typography className={classes.heading}>
                    {t('componentData.paymentTransDetail.Status')}
                  </Typography>{' '}
                </Grid>
                <Grid item xs={6}>
                  {' '}
                  <Typography className={classes.subHeading}>
                    {RemittanceDeliveryStatus}
                  </Typography>{' '}
                </Grid>
              </Grid>

              <Grid container item>
                <Grid item xs={6}>
                  {' '}
                  <Typography className={classes.heading}>
                    {IsHippa
                      ? t('componentData.paymentTransDetail.PDFRemittance')
                      : t('componentData.paymentTransDetail.Remittance')}
                  </Typography>{' '}
                </Grid>
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
                {IsHippa === 1 && (
                  <Grid item xs={6}>
                    {' '}
                    <Typography className={classes.heading}>
                      {t('componentData.paymentTransDetail.EDIRemittance')}
                    </Typography>{' '}
                  </Grid>
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
              <SnackbarComponent
                openSnackbar={openSnackbar}
                handleClose={handleClose}
                snackbarMessage={snackbarMessage}
                icon={false}
                messageVariant={snackbarMessageType}
              />
            </Grid>
          </>
        ) : null}

        {/* End Remittance Details */}

        {SettlementStatus && (
          <>
            <Grid container item className={classes.paymentGridCont}>
              <Typography
                variant="h5"
                className={classes.labelHeading}
              >
                {t('componentData.paymentTransDetail.SettlementStatus')}
              </Typography>
            </Grid>
            <Grid container item xs={6} className={classes.paymentGridCont}>
              <Typography
                className={classes.subHeading}
              >
                {/* {ReturnorCorrectionReasonCode ?? "MasterCard"} */}
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
                className={classes.labelHeading}
              >
                {t('componentData.paymentTransDetail.ReturnCorrectionSystem')}
              </Typography>
            </Grid>
            <Grid container item xs={6} className={classes.paymentGridCont}>
              <Typography
                className={classes.subHeading}
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
                className={classes.labelHeading}
              >
                {t(
                  'componentData.paymentTransDetail.ReturnCorrectionReasonCode'
                )}
              </Typography>
            </Grid>
            <Grid container item xs={6} className={classes.paymentGridCont}>
              <Typography
                className={classes.subHeading}
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
                className={classes.labelHeading}
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
                    className={classes.subHeading}
                  >
                    {ReturnorCorrectionReasonDesc}
                  </Typography>
                </Grid>
              </Grid>
              {showReturnDescription && (
                <Grid container>
                  <Grid item style={{ marginLeft: '40px' }}>
                    <Typography
                      className={classes.descText}
                    >
                      {RejectionExplanation}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default withTranslation()(withStyles(styles)(PaymentTranxDetails));
