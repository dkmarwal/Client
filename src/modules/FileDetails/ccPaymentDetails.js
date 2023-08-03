import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from "@material-ui/core/styles";
import { Grid, Box, Typography } from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { styles } from "./styles";
import config from "~/config";

const CCPaymentDetails = (props) => {
    const { t, classes, paymentFileData, history } = props;

    const totalVCAPayments = paymentFileData ? parseInt(paymentFileData.TotalVCAUSDPayments) +
        parseInt(paymentFileData.TotalVCACADPayments) : 0;

    return (
        <Grid item xs>
            <Box borderRadius={8}
                bgcolor="white"
                display={"flex"}
                flexDirection="column"
                justifyContent="space-between"
                height="100%"
            >
                <Box textAlign="center" py={1} className={classes.TitleHeadTxt}>
                    {t('componentData.paymentFileDetail.PaymentCCVCA')}
                </Box>

                {paymentFileData.TotalAmountUSD == "0.00" && paymentFileData.TotalAmountCAD == "0.00" ?
                    <Box display="block" textAlign="center" width={1} pt={2}>
                        <img
                            src={require('~/assets/icons/bankFile_No_data.svg')}
                            alt=""
                        />
                        <Box py={2} color="#A1A1A1" fontSize={14} display="block">
                            {t('componentData.customTable.NoDatatoShow')}
                        </Box>
                    </Box>
                    :
                    <>
                        {paymentFileData.TotalAmountUSD && paymentFileData.TotalAmountUSD != "0.00" ?
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box textAlign={"right"} className={classes.ccPaymentTitle}>
                                        <img
                                            height={50}
                                            src={require(`~/assets/icons/USAFlag.svg`)}
                                            alt={t('componentData.paymentDetails.USAFlag')}
                                        />{" "}
                                        {/* {t('componentData.paymentDetails.USD')} */}
                                    </Box>
                                </Grid>
                                <Grid item xs>
                                    <Box className={classes.totalPayBox}>
                                        <Box className={classes.ccPaymentTitle}>$ {paymentFileData.TotalAmountUSD}</Box>
                                        <Box fontSize={14} color="#000000">{t('componentData.paymentFileDetail.totalAmount')}</Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            : null
                        }

                        {paymentFileData.TotalAmountCAD && paymentFileData.TotalAmountCAD != "0.00" ?
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box textAlign={"right"} className={classes.ccPaymentTitle}>
                                        <img
                                            height={50}
                                            src={require(`~/assets/icons/CanadianFlag.svg`)}
                                            alt={t('componentData.paymentDetails.CanadianFlag')}
                                        />{" "}
                                        {/* {t('componentData.paymentDetails.CAD')} */}
                                    </Box>
                                </Grid>
                                <Grid item xs>
                                    <Box className={classes.totalPayBox}>
                                        <Box className={classes.ccPaymentTitle}>$ {paymentFileData.TotalAmountCAD}</Box>
                                        <Box fontSize={14} color="#000000">{t('componentData.paymentFileDetail.totalAmount')}</Box>
                                    </Box>
                                </Grid>
                            </Grid>
                            : null
                        }
                    </>
                }

                <Box pb={2}>
                    {totalVCAPayments ?
                        <Box textAlign={"center"}>
                            <Typography className={classes.textLink}
                                onClick={() => history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=4&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}`)}
                            >
                                {totalVCAPayments} {t('componentData.paymentFileDetail.SuccessFulPayText')}
                            </Typography>
                        </Box> : null
                    }
                    {paymentFileData && paymentFileData.UnsuccessfulPaymentCount ?
                        <Box textAlign={"center"}>
                            {paymentFileData && paymentFileData.ActionTypeId != 1 ?
                                <Typography>
                                    {paymentFileData.UnsuccessfulPaymentCount || 0} {t('componentData.paymentFileDetail.UnSuccessFulPayText')}
                                </Typography>
                                :
                                <Typography className={classes.textLink}
                                    onClick={() => history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=4&ProcessedStatusFilter=${paymentFileData.UnProcessedStatusFilter}`)}
                                >
                                    {paymentFileData.UnsuccessfulPaymentCount || 0} {t('componentData.paymentFileDetail.UnSuccessFulPayText')}
                                </Typography>
                            }
                        </Box> : null
                    }
                </Box>
            </Box>
        </Grid>
    )
}
export default withTranslation()(withStyles(styles)(withRouter(CCPaymentDetails)));
