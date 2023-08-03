import React, { Component } from "react";
import {
  Grid,
  Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import config from "~/config";
import { styles } from "./styles";
import { withTranslation } from 'react-i18next';
import { PayerTypes } from "~/config/entityTypes";

class PaymentDetails extends Component {
  state = {};
  render() {
    const { classes, paymentFileData, t, user } = this.props;

    const totalCheckPayments = paymentFileData
      ? parseInt(paymentFileData.TotalCheckUSDPayments) +
      parseInt(paymentFileData.TotalCheckCADPayments)
      : 0;
    const totalACHPayments = paymentFileData
      ? parseInt(paymentFileData.TotalACHUSDPayments) +
      parseInt(paymentFileData.TotalACHCADPayments)
      : 0;
    const totalVCAPayments = paymentFileData
      ? parseInt(paymentFileData.TotalVCAUSDPayments) +
      parseInt(paymentFileData.TotalVCACADPayments)
      : 0;

    const isCCUser = user && user.userData.payerTypeId && user.userData.payerTypeId == PayerTypes.CARDS || false;
    return (
      <Grid container spacing={1} alignItems="stretch">
        {paymentFileData && (paymentFileData.TotalACHUSDPayments && paymentFileData.TotalACHUSDPayments != 0 ||
          paymentFileData.TotalACHCADPayments && paymentFileData.TotalACHCADPayments != 0) ?
          <Grid item xs={3} className={classes.whiteBox}>
            <Box
              fontSize={16}
              color="primary"
              pb={2}
              className={classes.paymentDetailTitle}
              alignItems="center"
            >
              {" "}
              <img
                src={require(`~/assets/icons/ACH_Blue.svg`)}
                alt={t('componentData.paymentDetails.ACHAccountPayments')}
                style={{ paddingRight: 10 }}
              />{" "}
              <Box display="flex" justifyContent="center" textAlign="center">
                {t('componentData.paymentDetails.ACHAccountPayments')}{" "}</Box>
            </Box>

            <Box p={2} alignItems="center" justifyContent="center" display="flex"
              flexDirection="column">
              <Box display="flex" flexDirection="column" width={1}>
                {paymentFileData.TotalACHUSDPayments != 0 ?
                  <Box
                    display="flex"
                    justifyContent="center"
                    pb={2}
                    alignItems="center"
                  >
                    <Box fontSize={16} width="40%">
                      {" "}
                      <img
                        src={require(`~/assets/icons/USAFlag.svg`)}
                        alt={t('componentData.paymentDetails.USAFlag')}
                      />{" "}
                      {t('componentData.paymentDetails.USD')}
                    </Box>
                    <Box fontSize={16} width="30%">
                      {" "}
                      $
                      {paymentFileData.TotalACHUSDAmount
                        ? paymentFileData.TotalACHUSDAmount
                        : 0}
                    </Box>
                  </Box> : null
                }
                {paymentFileData.TotalACHCADPayments != 0 ?
                  <Box
                    display="flex"
                    justifyContent="center"
                    pb={2}
                    alignItems="center"
                  >
                    <Box fontSize={16} width="40%">
                      {" "}
                      <img
                        src={require(`~/assets/icons/CanadianFlag.svg`)}
                        alt={t('componentData.paymentDetails.CanadianFlag')}
                      />{" "}
                      {t('componentData.paymentDetails.CAD')}
                    </Box>
                    <Box fontSize={16} width="30%">
                      {" "}
                      $
                      {paymentFileData.TotalACHCADAmount
                        ? paymentFileData.TotalACHCADAmount
                        : 0}
                    </Box>
                  </Box>
                  : null
                }
                <Box my={2} className={classes.bottomLink}>
                  {" "}
                  {t('componentData.paymentDetails.from')}
                  <u style={{ cursor: "pointer" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=2&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}`)}>
                    {" "}{totalACHPayments ? totalACHPayments : 0} {t('componentData.paymentDetails.processedPayments')}</u>{" "}
                </Box>
              </Box>
            </Box>
          </Grid>
          : null
        }

        {!isCCUser && paymentFileData && (paymentFileData.TotalVCAUSDPayments && paymentFileData.TotalVCAUSDPayments != 0 ||
          paymentFileData.TotalVCACADPayments && paymentFileData.TotalVCACADPayments != 0) ?
          <Grid item xs={3} className={classes.whiteBox}>
            <Box
              fontSize={16}
              color="primary"
              pb={2}
              className={classes.paymentDetailTitle}
            >
              {" "}
              <img
                src={require(`~/assets/icons/VCA_Blue.svg`)}
                alt={t('componentData.paymentDetails.VirtualCardPayments')}
                style={{ paddingRight: 10 }}
              />{" "}
              <Box display="flex" justifyContent="center" textAlign="center">
                {t('componentData.paymentDetails.VirtualCardPayments')}{" "}</Box>
            </Box>

            <Box p={2} alignItems="center" justifyContent="center" display="flex"
              flexDirection="column">
              <Box display="flex" flexDirection="column" width={1}>
                {paymentFileData.TotalVCAUSDPayments != 0 ?
                  <Box
                    display="flex"
                    justifyContent="center"
                    pb={2}
                    alignItems="center"
                  >
                    <Box fontSize={16} width="40%">
                      {" "}
                      <img
                        src={require(`~/assets/icons/USAFlag.svg`)}
                        alt={t('componentData.paymentDetails.USAFlag')}
                      />{" "}
                      {t('componentData.paymentDetails.USD')}
                    </Box>
                    <Box fontSize={16} width="30%">
                      {" "}
                      $
                      {paymentFileData.TotalVCAUSDAmount
                        ? paymentFileData.TotalVCAUSDAmount
                        : 0}
                    </Box>
                  </Box> : null
                }
                {paymentFileData.TotalVCACADPayments != 0 ?
                  <Box
                    display="flex"
                    justifyContent="center"
                    pb={2}
                    alignItems="center"
                  >
                    <Box fontSize={16} width="40%">
                      {" "}
                      <img
                        src={require(`~/assets/icons/CanadianFlag.svg`)}
                        alt={t('componentData.paymentDetails.CanadianFlag')}
                      />{" "}
                      {t('componentData.paymentDetails.CAD')}
                    </Box>
                    <Box fontSize={16} width="30%">
                      {" "}
                      $
                      {paymentFileData.TotalVCACADAmount
                        ? paymentFileData.TotalVCACADAmount
                        : 0}
                    </Box>
                  </Box> : null
                }
                <Box my={2} className={classes.bottomLink}>
                  {" "}
                  {t('componentData.paymentDetails.from')}
                  <u style={{ cursor: "pointer" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=4&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}`)}>
                    {" "}{totalVCAPayments ? totalVCAPayments : 0} {t('componentData.paymentDetails.processedPayments')}</u>{" "}
                </Box>
              </Box>
            </Box>
          </Grid>
          : null
        }

        {paymentFileData && (paymentFileData.TotalCheckUSDPayments && paymentFileData.TotalCheckUSDPayments != 0 ||
          paymentFileData.TotalCheckCADPayments && paymentFileData.TotalCheckCADPayments != 0) ?
          <Grid item xs={3} className={classes.whiteBox}>
            <Box
              fontSize={16}
              color="primary"
              pb={2}
              className={classes.paymentDetailTitle}
            >
              {" "}
              <img
                src={require(`~/assets/icons/CHK_Blue.svg`)}
                alt={t('componentData.paymentDetails.b2bCheckPayments')}
                style={{ paddingRight: 10 }}
              />{" "}
              <Box display="flex" justifyContent="center" textAlign="center">
                {t('componentData.paymentDetails.b2bCheckPayments')}{" "}</Box>
            </Box>

            <Box p={2} alignItems="center" justifyContent="center" display="flex"
              flexDirection="column">
              <Box display="flex" flexDirection="column" width={1}>
                {paymentFileData.TotalCheckUSDPayments != 0 ?
                  <Box
                    display="flex"
                    justifyContent="center"
                    pb={2}
                    alignItems="center"
                  >
                    <Box fontSize={16} width="40%">
                      {" "}
                      <img
                        src={require(`~/assets/icons/USAFlag.svg`)}
                        alt={t('componentData.paymentDetails.USAFlag')}
                      />{" "}
                      {t('componentData.paymentDetails.USD')}
                    </Box>
                    <Box fontSize={16} width="30%">
                      {" "}
                      $
                      {paymentFileData.TotalCheckUSDAmount
                        ? paymentFileData.TotalCheckUSDAmount
                        : 0}
                    </Box>
                  </Box> : null
                }
                {paymentFileData.TotalCheckCADPayments != 0 ?
                  <Box
                    display="flex"
                    justifyContent="center"
                    pb={2}
                    alignItems="center"
                  >
                    <Box fontSize={16} width="40%">
                      {" "}
                      <img
                        src={require(`~/assets/icons/CanadianFlag.svg`)}
                        alt={t('componentData.paymentDetails.CanadianFlag')}
                      />{" "}
                      {t('componentData.paymentDetails.CAD')}
                    </Box>
                    <Box fontSize={16} width="30%">
                      {" "}
                      $
                      {paymentFileData.TotalCheckCADAmount
                        ? paymentFileData.TotalCheckCADAmount
                        : 0}
                    </Box>
                  </Box> : null
                }
              </Box>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Box fontSize={16} color="#4C4C4C">
                  {" "}
                  {t('componentData.paymentDetails.from')} <u style={{ cursor: "pointer" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=1&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}`)}>
                    {" "}{totalCheckPayments ? totalCheckPayments : 0} {t('componentData.paymentDetails.processedPayments')}</u>{" "}
                </Box>
              </Box>
            </Box>
          </Grid>
          : null
        }
      </Grid>
    );
  }
}

export default withTranslation()(withStyles(styles)(PaymentDetails));
