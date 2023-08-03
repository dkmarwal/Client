import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { Grid, Box, Typography } from '@material-ui/core';

import { styles } from '../../styles';
import CustomParameters from '../CustomParameters';
import { VelocityPeriodType } from '~/config/entityTypes';

const PaymentControls = (props) => {
    const { classes, t, spendVelocityData, timeOfControlData, otherData, paymentsCustomdata } = props;

    return (
        <Box>
            {otherData && otherData.length ? <>
                <Box className={classes.oddEvenBox}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.overallSettings')}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography className={classes.keyLabel}>
                                {t('componentData.CCPaymentTransaction.timeZone')}
                            </Typography>
                            <Typography className={classes.valueLabel}>
                                {Boolean(otherData) && otherData.length > 0 && otherData[0]?.timeZone}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography className={classes.keyLabel}>
                                {t('componentData.CCPaymentTransaction.validFor')}
                            </Typography>
                            <Typography className={classes.valueLabel}>
                                {Boolean(otherData) && otherData.length > 0 && otherData[0]?.validFor}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                {Boolean(otherData) && otherData.length > 0 && otherData[0]?.enableAmountRangeControl && (
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.exactAmountRangeControl')}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.minTransactionAmount')}
                                </Typography>

                                <Typography className={classes.valueLabel}>
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0].rangeControlminAmount ? `$ ${otherData[0].rangeControlminAmount}` : ''}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.maxTransactionAmount')}
                                </Typography>

                                <Typography className={classes.valueLabel}>
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0].rangeControlmaxAmount ? `$ ${otherData[0].rangeControlmaxAmount}` : ''}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {Boolean(otherData) && otherData.length > 0 && otherData[0]?.enableTransactionLimitControl && (
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.tranxLimit')}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.maxSingleTranxAmt')}
                                </Typography>

                                <Typography className={classes.valueLabel}>
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0]?.transactionLimitAmountLimit}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {Boolean(otherData) && otherData.length > 0 && otherData[0]?.enableValidityPeriodControl && (
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.validityPeriodControl')}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.valid')}
                                </Typography>

                                <Typography className={classes.valueLabel}>
                                    from{" "}
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0]?.validityStartDate} to{" "}
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0]?.validityEndDate}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {Boolean(spendVelocityData) && spendVelocityData.length > 0 ?
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.velocityControl')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        <Typography className={classes.keyLabel}>
                                            {t('componentData.CCPaymentTransaction.timePeriod')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box pl={5}>
                                            <Typography className={classes.keyLabel}>
                                                {t('componentData.CCPaymentTransaction.maximumTransactions')}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box pl={1}>
                                            <Typography className={classes.keyLabel}>
                                                {t('componentData.CCPaymentTransaction.cumulativeLimit')}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {spendVelocityData.map((item, i) => {
                                    const periodTypeVal = item && item.periodType ? VelocityPeriodType.find(x => x.key == item.periodType) : '';
                                    return (
                                        <Grid container spacing={2} key={`item-${i}`}>
                                            <Grid item xs={2}>
                                                <Typography className={classes.valueLabel}>
                                                    {periodTypeVal && periodTypeVal.value || ''}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Box pl={5}>
                                                    <Typography className={classes.valueLabel}>
                                                        {item?.maxAuth}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Box pl={1}>
                                                    <Typography className={classes.valueLabel}>
                                                        {item.cumulativeSpendLimit ? `$ ${item.cumulativeSpendLimit}` : ''}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Box>
                    : null
                }

                {Boolean(otherData) && otherData.length > 0 && otherData[0]?.enableAgingVelocityControl && (
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.agingVelocityControl')}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.authHoldDays')}
                                </Typography>
                                <Typography className={classes.valueLabel}>
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0]?.agingVelocityAuthorizationHoldDays}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.cumulativeLimitAmt')}
                                </Typography>
                                <Typography className={classes.valueLabel}>
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0]?.agingVelocityCumulativeSpendLimit}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {Boolean(otherData) && otherData.length > 0 && otherData[0]?.enableCurfewControl && (
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.curfewControl')}
                                </Typography>
                            </Grid>

                            <Grid item xs={2}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.fromTime')}
                                </Typography>
                                <Typography className={classes.valueLabel}>
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0]?.curfewStartTime}
                                </Typography>
                            </Grid>

                            <Grid item xs={4}>
                                <Box pl={5}>
                                    <Typography className={classes.keyLabel}>
                                        {t('componentData.CCPaymentTransaction.toTime')}
                                    </Typography>
                                    <Typography className={classes.valueLabel}>
                                        {Boolean(otherData) && otherData.length > 0 && otherData[0]?.curfewEndTime}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.days')}
                                </Typography>
                                <Typography className={classes.valueLabel}>
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0]?.curfewweekdaysEffective}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {Boolean(timeOfControlData) && timeOfControlData.length > 0 ?
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.timeofTheDayControl')}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={2}>
                                        <Typography className={classes.keyLabel}>
                                            {t('componentData.CCPaymentTransaction.daysofTheWeek')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box pl={5}>
                                            <Typography className={classes.keyLabel}>
                                                {t('componentData.CCPaymentTransaction.from')}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Box pl={1}>
                                            <Typography className={classes.keyLabel}>
                                                {t('componentData.CCPaymentTransaction.to')}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                {timeOfControlData.map((item, ind) => {
                                    return (
                                        <Grid container key={`time_of_day-${ind}`}>
                                            <Grid item xs={2}>
                                                <Box py={1}>
                                                    <Typography className={classes.valueLabel}>
                                                        {item && item?.weekdayEffective}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Box pl={5}>
                                                    <Box pt={1}>
                                                        <Typography className={classes.valueLabel}>
                                                            {item && item?.startTime}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={3}>
                                                <Box pl={1}>
                                                    <Box pt={1}>
                                                        <Typography className={classes.valueLabel}>
                                                            {item && item?.endTime}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Box>
                    : null
                }

                {Boolean(otherData) && otherData.length > 0 && otherData[0]?.enableMerchantIdControl && (
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.merchantIDControl')}
                                </Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Grid container>
                                    <Grid item xs={5}>
                                        <Typography className={classes.keyLabel}>
                                            {t('componentData.CCPaymentTransaction.merchantId')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography className={classes.valueLabel}>
                                            {Boolean(otherData) && otherData.length > 0 && otherData[0]?.merchantIdControlMerchantId}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container>
                                    <Grid item xs={5}>
                                        <Typography className={classes.keyLabel}>
                                            {t('componentData.CCPaymentTransaction.acquirerId')}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Typography className={classes.valueLabel}>
                                            {Boolean(otherData) && otherData.length > 0 && otherData[0]?.merchantIdControlAcquirerId}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {Boolean(otherData) && otherData.length > 0 && otherData[0]?.enableGeographyControl && (
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.geographyControl')}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.countryCodes')}
                                </Typography>

                                <Typography className={classes.valueLabel}>
                                    {Boolean(otherData) && otherData.length > 0 && otherData[0]?.geographyControlCountryCodes}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                {paymentsCustomdata && paymentsCustomdata.length ?
                    <Box className={classes.oddEvenBox}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography className={classes.ccheading}>
                                    {t('componentData.CCPaymentTransaction.customParameters')}
                                </Typography>
                            </Grid>
                            <CustomParameters paymentsCustomdata={paymentsCustomdata} />
                        </Grid>
                    </Box> : null}
            </>
                :
                <Box display="block" textAlign="center" width={1} my={6}>
                    <img
                        src={require('~/assets/icons/bankFile_No_data.svg')}
                        alt=""
                    />
                    <Box py={3} color="#A1A1A1" fontSize={14} display="block">
                        {t('componentData.customTable.NoDatatoShow')}
                    </Box>
                </Box>
            }
        </Box>
    )
}
export default withTranslation()(withStyles(styles)(PaymentControls));
