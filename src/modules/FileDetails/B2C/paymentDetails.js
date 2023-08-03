import React, { Component } from "react";
import {
  Grid,
  Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import config from "~/config";
import { connect } from "react-redux";
import { B2CfetchSelectedTabs } from "~/redux/helpers/settings";
import { styles } from "./styles";
import { withTranslation } from 'react-i18next';
import { paymentMethodIds, paymentMethods } from '~/config/paymentMethods';

class PaymentDetails extends Component {
  state = {
    optedPaymentMethod: [],
  };

  componentDidMount = () => {
    this.getOptedPaymentList();
  }

  getOptedPaymentList = () => {
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchSelectedTabs(clientId).then((response) => {
      if (response.error) {
        return false;
      }
      else {
        if (Boolean(response?.data?.rows2 ?? false)) {
          const list = response.data.rows2.map((e) => {
            return e.paymentCode
          });
          this.setState({
            optedPaymentMethod: list
          })
        }
      }
    });
  }

  render() {
    const { classes, paymentFileData, PaymentSummary, t } = this.props;
    const { optedPaymentMethod } = this.state;

    let ACHIndex = 0;
    let paypalIndex = 0;
    let pushToCardIndex = 0;
    let checkIndex = 0;
    let zelleIndex = 0;

    if (Boolean(PaymentSummary) && PaymentSummary.length > 0) {
      ACHIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.ACH);
      paypalIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.PayPal);
      pushToCardIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.PushToCard);
      checkIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.CHK);
      zelleIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.Zelle);
    }

    let willACHShow = false;
    let willPayPalShow = false;
    let willPushToCardShow = false;
    let willCHKShow = false;
    let willZelleShow = false;

    if (optedPaymentMethod.length > 0) {
      optedPaymentMethod.map((e) => {
        if (e === paymentMethods.ACH) {
          return willACHShow = true
        }
        else if (e === paymentMethods.PayPal) {
          return willPayPalShow = true
        }
        else if (e === paymentMethods.PushToCard) {
          return willPushToCardShow = true
        }
        else if (e === paymentMethods.CHK) {
          return willCHKShow = true
        }
        else if (e === paymentMethods.Zelle) {
          return willZelleShow = true
        }
      })
    }

    return (
      <>
        <Grid container spacing={2} alignItems="stretch" style={{ margin: "0 23px" }}>

          {/********1st box Zelle Payments*******/}

          {Boolean(willZelleShow) && (
            (Boolean(PaymentSummary) && PaymentSummary.length > 0) && (PaymentSummary[zelleIndex].TotalCDMPaymentCount != 0 ||
              PaymentSummary[zelleIndex].TotalNONCDMPaymentCount != 0) &&
            <Box className={classes.paymentCountBox}>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.paymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/Zelle.svg`)}
                    alt={t('componentData.paymentDetails.ZellePayments')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.ZellePayments')}</Box>

                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        ${paymentFileData.TotalZELUSDAmount
                          ? paymentFileData.TotalZELUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.ZELTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? `${PaymentSummary[zelleIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.CDM')} `
                        : null
                      }
                    </u>
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.ZELTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? ` | ${PaymentSummary[zelleIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.nonCDM')}`
                        : null
                      }
                    </u>
                    <div>{t('componentData.paymentFileDetail.processedPayments')}</div>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/********2nd Push to Card Payments*******/}

          {Boolean(willPushToCardShow) && (
            (Boolean(PaymentSummary) && PaymentSummary.length > 0) && (PaymentSummary[pushToCardIndex].TotalCDMPaymentCount != 0 ||
              PaymentSummary[pushToCardIndex].TotalNONCDMPaymentCount != 0) &&
            <Box className={classes.paymentCountBox}>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.paymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/Push_to_Card.svg`)}
                    alt={t('componentData.paymentDetails.PushToCardPayments')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.PushToCardPayments')}</Box>

                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        ${paymentFileData.TotalCardUSDAmount
                          ? paymentFileData.TotalCardUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.CardTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? `${PaymentSummary[pushToCardIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.CDM')} `
                        : null
                      }
                    </u>

                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.CardTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? ` | ${PaymentSummary[pushToCardIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.nonCDM')}`
                        : null
                      }
                    </u>
                    <div>{t('componentData.paymentFileDetail.processedPayments')}</div>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/********3rd PayPal Payments*******/}

          {Boolean(willPayPalShow) && (
            (Boolean(PaymentSummary) && PaymentSummary.length > 0) && (PaymentSummary[paypalIndex].TotalCDMPaymentCount != 0 ||
              PaymentSummary[paypalIndex].TotalNONCDMPaymentCount != 0) &&
            <Box className={classes.paymentCountBox}>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.paymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/PayPal.svg`)}
                    alt={t('componentData.paymentDetails.PayPalPayments')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.PayPalPayments')}</Box>
                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        ${paymentFileData.TotalPPLUSDAmount
                          ? paymentFileData.TotalPPLUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.PPLTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? `${PaymentSummary[paypalIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.CDM')}  `
                        : null
                      }
                    </u>

                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.PPLTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? ` | ${PaymentSummary[paypalIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.nonCDM')}`
                        : null
                      }
                    </u>
                    <div>{t('componentData.paymentFileDetail.processedPayments')}</div>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {/********4th ACH Payments*********/}

          {Boolean(willACHShow) && (
            (Boolean(PaymentSummary) && PaymentSummary.length > 0) && (PaymentSummary[ACHIndex].TotalCDMPaymentCount != 0 ||
              PaymentSummary[ACHIndex].TotalNONCDMPaymentCount != 0) &&
            <Box className={classes.paymentCountBox}>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.paymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/ACH_grey.svg`)}
                    alt={t('componentData.paymentDetails.BankAccountPayments')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.BankAccountPayments')}{" "}</Box>
                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        ${paymentFileData.TotalACHUSDAmount
                          ? paymentFileData.TotalACHUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.BankTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? `${PaymentSummary[ACHIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.CDM')} `
                        : null
                      }
                    </u>

                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.BankTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? `| ${PaymentSummary[ACHIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.nonCDM')}`
                        : null
                      }
                    </u>
                    <div>{t('componentData.paymentFileDetail.processedPayments')}</div>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}


          {/********5th box Check Payments*********/}

          {Boolean(willCHKShow) && (
            (Boolean(PaymentSummary) && PaymentSummary.length > 0) && (PaymentSummary[checkIndex].TotalCDMPaymentCount != 0 ||
              PaymentSummary[checkIndex].TotalNONCDMPaymentCount != 0) &&
            <Box className={classes.paymentCountBox}>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.paymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/CHK_grey.svg`)}
                    alt={t('componentData.paymentDetails.CHK')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.CheckPayments')}{" "}</Box>
                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        ${paymentFileData.TotalCheckUSDAmount
                          ? paymentFileData.TotalCheckUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.CheckTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? `${PaymentSummary[checkIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.CDM')} `
                        : null
                      }
                    </u>

                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.CheckTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0
                        ? ` | ${PaymentSummary[checkIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.nonCDM')}`
                        : null
                      }
                    </u>
                    <div>{t('componentData.paymentFileDetail.processedPayments')}</div>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Grid>
      </>
    );
  }
}

export default connect((state) => ({ ...state.user }))(withTranslation()(withStyles(styles)(PaymentDetails)));
