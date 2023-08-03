import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { Box, Grid, CircularProgress, Typography, FormControl, InputLabel, Select, option } from '@material-ui/core';
import MoodBadIcon from '@material-ui/icons/MoodBad';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import EditIcon from '@material-ui/icons/Edit';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { useHistory } from "react-router-dom";
import clsx from 'clsx';

import { styles } from '../../styles';
import { getCardActivityTrialData } from '~/redux/helpers/clientPaymentTransactions';
import { SnackbarComponent } from '~/components/Notification/snackbar';
import Modify_Failed from "~/assets/icons/modify_fail.svg";
import config from "~/config";
import { entityType, CardActivityTrailConst } from '~/config/entityTypes';

const PAID_USED_STATUS = [56, 57, 58, 59];
const ID_CONTROL_FIELD = ["GeographySelection", "TimeZoneId", "CustomFieldValue", "SupplierEmail",
    "CumulativeSpendLimit", "RangeControlMaxAmount", "RangeControlMinAmount", "ExpiryDate"];

const CardActivityTrail = (props) => {
    let history = useHistory();
    const { t, classes, clientId, paymentId, vcaId, timeZoneList } = props;
    const [cardActivityTrailData, setCardActivityTrailData] = useState([]);
    const [CardActivityTrailStatus, SetCardActivityTrailStatus] = useState([]);
    const [CardStatus, setCardStatus] = useState("0");
    const [loader, setLoader] = useState(false);
    const [notification, setNotification] = useState({
        message: '', type: '', open: false
    });
    const [matchCount, setMatchCount] = useState(0);
    let totalUnMached = 0;
    let TotalMached = 0;

    useEffect(() => {
        fetchCardActivityData();
    }, []);

    const fetchCardActivityData = async () => {
        let params = {
            clientId: clientId,
            paymentId: paymentId
        }
        if (vcaId) {
            params.vcaid = vcaId;
        }
        setLoader(true);
        const res = await getCardActivityTrialData(params);

        if (res && res.result.length) {
            setLoader(false);
            setCardActivityTrailData(res?.result[0]?.cardActivityDetails ?? []);
            SetCardActivityTrailStatus(res?.result[0]?.cardActivityStatus ?? []);
        } else {
            setLoader(false);
            setNotification({
                message: t('componentData.reduxData.SomethingWentWrong'),
                type: 'error',
                open: true
            })
        }
    };

    const routeToFileDetails = (id) => {
        history.push({
            pathname: `${config.baseName}/payments/paymentFiles/fileDetails`,
            state: {
                id: id,
                appType: entityType.B2B
            }
        })
    }

    const handleClose = () => {
        setNotification({ message: '', type: '', open: false });
    };

    const formatCardDate = (date) => {
        if (date) {
            const regexpExpiry = /^(?<month>0[1-9]|1[0-2])(?<year>[0-9]+)$/;
            const match = regexpExpiry.exec(date);
            return `${match.groups.month}/${match.groups.year.substring(2)}`;
        }
    }

    const renderStatusIcon = (id) => {
        switch (id) {
            case CardActivityTrailConst.REQUESTRECEIVED:
            case CardActivityTrailConst.CREATIONREQUEST:
            case CardActivityTrailConst.ACTIVE:
                return <CheckIcon fontSize="small" color="primary" />
            case CardActivityTrailConst.CREATIONFAILED:
            case CardActivityTrailConst.EXCEPTION:
                return <ErrorOutlineIcon fontSize="small" color="primary" />
            case CardActivityTrailConst.EXPIRED:
            case CardActivityTrailConst.DECLINED:
                return <MoodBadIcon fontSize="small" color="primary" />
            case CardActivityTrailConst.CANCELLED:
            case CardActivityTrailConst.CANCELLEDUNSUCCESSFULLY:
                return <BlockIcon fontSize="small" color="primary" />
            case CardActivityTrailConst.MODIFIED:
                return <EditIcon fontSize="small" color="primary" />
            case CardActivityTrailConst.MODIFIEDUNSUCCESSFULLY:
                return <img src={Modify_Failed} alt="" />
            case CardActivityTrailConst.AUTHORIZED:
            case CardActivityTrailConst.PARTIALLYAUTHORIZED:
            case CardActivityTrailConst.POSTED:
            case CardActivityTrailConst.PARTIALLYPOSTED:
                return <AttachMoneyIcon fontSize="small" color="primary" />
            default:
            // Default code         
        }
    }

    const renderDetials = (data) => {
        switch (data.statusID) {
            case CardActivityTrailConst.REQUESTRECEIVED:
                return (<>
                    {data.requestId ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.requestId')}</Box>
                        <Box className={classes.valueLabel}>{data.requestId}</Box>
                    </Box> : null}

                    {data.fileID ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.fileId')}</Box>
                        <Box className={clsx(classes.valueLabel, classes.linkText)} onClick={() => routeToFileDetails(data.fileID)}>{data.fileID}</Box>
                    </Box> : null}
                </>)
            case CardActivityTrailConst.CREATIONREQUEST:
                return (<>
                    {data.payeeID ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.payeeId')}</Box>
                        <Box className={classes.valueLabel}>{data.payeeID}</Box>
                    </Box> : null}

                    {data.payeeName ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.payeeName')}</Box>
                        <Box className={classes.valueLabel}>{data.payeeName}</Box>
                    </Box> : null}
                    <Box className={classes.valueLabel}>{data.paymentBeneficiaryEmails || ''}</Box>
                </>)
            case CardActivityTrailConst.ACTIVE:
                return (<>
                    {data.purchaseID ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.purchaseId')}</Box>
                        <Box className={classes.valueLabel}>{data.purchaseID}</Box>
                    </Box> : null}

                    {data.availableBalance ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.cardBalance')}</Box>
                        <Box className={classes.valueLabel}>$ {data.availableBalance}</Box>
                    </Box> : null}
                </>)
            case CardActivityTrailConst.CREATIONFAILED:
            case CardActivityTrailConst.EXCEPTION:
            case CardActivityTrailConst.MODIFIEDUNSUCCESSFULLY:
                return (<>
                    {(data.reject_Reason || data.errorCode) ?
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <Box display="flex">
                                    <Box className={classes.valueLabel}>{data.errorCode || ''}:{' '}{data.reject_Reason || ''}</Box>
                                </Box>
                            </Grid>
                            <Grid item xs={4}>
                                {data.modifiedBy ? <Box display="flex">
                                    <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.byText')}</Box>
                                    <Box className={classes.valueLabel}>{data.modifiedBy || ''}</Box>
                                </Box> : null}
                            </Grid>
                        </Grid>
                        : null
                    }
                </>)
            case CardActivityTrailConst.EXPIRED:
                return (<>
                    {data.availableBalance ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.remainingBal')}</Box>
                        <Box className={classes.valueLabel}>$ {data.availableBalance}</Box>
                    </Box> : null}
                    <Typography>
                        {t('componentData.CardActivityTrial.noteText1')} {" "}
                        <label
                            style={{
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                            onClick={() => props.setTabId(2)}
                        >
                            ({t('componentData.CardActivityTrial.noteText2')})
                        </label> {" "}
                        {t('componentData.CardActivityTrial.noteText3')}
                    </Typography>
                </>)
            case CardActivityTrailConst.CANCELLED:
                return (<>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Box display="flex">
                                <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.cancelReason')}</Box>
                                <Box className={classes.valueLabel}>{data.reject_Reason || ''}</Box>
                            </Box>
                            <Typography>{t('componentData.CardActivityTrial.infoText2')}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Box className={classes.valueLabel}>
                                {data?.cancelledBy ?? false
                                    ? `${t('componentData.CardActivityTrial.byText')} ${data.cancelledBy}`
                                    : <>
                                        {data?.fileID ?? false
                                            ? <Box display="flex">
                                                <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.fileId')}</Box>
                                                <Box className={clsx(classes.valueLabel, classes.linkText)} onClick={() => routeToFileDetails(data.fileID)}>{data.fileID}</Box>
                                            </Box>
                                            : null}
                                    </>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </>)

            case CardActivityTrailConst.MODIFIED:
                return (<>
                    {
                        data.summary && JSON.parse(data.summary).length ?
                            JSON.parse(data.summary).map((ele, index) => {
                                return <Grid container spacing={2} className={classes.modifiedBox}>
                                    <Grid item xs={8}>
                                        <Box key={`modify-${index}`}>
                                            {ele.ChangedAttribute ?
                                                <Box className={classes.activitykey}>
                                                    {ele.ChangedAttribute || ''}
                                                </Box> : null
                                            }

                                            {ele.UpdatedFieldName ?
                                                ele.PropertyName && ID_CONTROL_FIELD.includes(ele.PropertyName) ?
                                                    renderCustomizeAttributes(ele)
                                                    :
                                                    <>
                                                        {ele.OldValue !== null || ele.OldValue !== '' ?
                                                            <Box className={classes.crossText}>
                                                                {ele.UpdatedFieldName} : {ele.OldValue}
                                                            </Box> : null
                                                        }
                                                        {ele.NewValue !== null || ele.NewValue !== '' ?
                                                            <Box className={classes.valueLabel}>
                                                                {ele.UpdatedFieldName} : {ele.NewValue}
                                                            </Box> : null
                                                        }
                                                    </>
                                                : null
                                            }
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        {data.modifiedBy && index == 0 ? <Box display="flex">
                                            <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.byText')}</Box>
                                            <Box className={classes.valueLabel}>{data.modifiedBy || ''}</Box>
                                        </Box> : null}
                                    </Grid>
                                </Grid>
                            })
                            :
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <Box className={classes.valueLabel}>
                                        {t('componentData.CardActivityTrial.noModification')}
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    {data.modifiedBy ? <Box display="flex">
                                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.byText')}</Box>
                                        <Box className={classes.valueLabel}>{data.modifiedBy || ''}</Box>
                                    </Box> : null}
                                </Grid>
                            </Grid>
                    }
                </>
                )
            case CardActivityTrailConst.CANCELLEDUNSUCCESSFULLY:
                return (<>
                    <Grid container>
                        <Grid item xs={8}>
                            <Box display="flex">
                                <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.cancelReason')}</Box>
                                <Box className={classes.valueLabel}>{data.errorCode ? `${data.errorCode} - ` : ''}{data.reject_Reason || ''}</Box>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            {data.cancelledBy ? <Box display="flex">
                                <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.byText')}</Box>
                                <Box className={classes.valueLabel}>{data.cancelledBy || ''}</Box>
                            </Box> : null}
                        </Grid>
                    </Grid>

                </>)
            case CardActivityTrailConst.AUTHORIZED:
            case CardActivityTrailConst.PARTIALLYAUTHORIZED:
                return (<>
                    {data.merchantName ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.merchantName')}</Box>
                        <Box className={classes.valueLabel}>{data.merchantName}</Box>
                    </Box> : null}

                    {data.merchantAddress ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.merchantAddress')}</Box>
                        <Box className={classes.valueLabel}>{data.merchantAddress}</Box>
                    </Box> : null}

                    {data.transactionType ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.tranxType')}</Box>
                        <Box className={classes.valueLabel}>{data.transactionType}</Box>
                    </Box> : null}

                    {data.authorizationResponseDetail ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.authResDetail')}</Box>
                        <Box className={classes.valueLabel}>{data.authorizationResponseDetail}</Box>
                    </Box> : null}

                    {data.vcaAuthorizationResponseDetail ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.vcaAuthResDetail')}</Box>
                        <Box className={classes.valueLabel}>{data.vcaAuthorizationResponseDetail}</Box>
                    </Box> : null}
                </>)
            case CardActivityTrailConst.POSTED:
            case CardActivityTrailConst.PARTIALLYPOSTED:
                return (<>
                    {data.availableBalance ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.remainingBal')}</Box>
                        <Box className={classes.valueLabel}>$ {data.availableBalance}</Box>
                    </Box> : null}

                    {data.rcnCardNumber ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.RealCardNo')}:</Box>
                        <Box className={classes.valueLabel}>$ {data.rcnCardNumber}</Box>
                    </Box> : null}

                    {data.financialAlternateAccountNumber ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.BillingAccount')}:</Box>
                        <Box className={classes.valueLabel}>$ {data.financialAlternateAccountNumber}</Box>
                    </Box> : null}

                    {data.processorTransactionId ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.ProcessorTranxId')}</Box>
                        <Box className={classes.valueLabel}>{data.processorTransactionId}</Box>
                    </Box> : null}

                    {data.acquirerReferenceData ? <Box display="flex">
                        <Box className={classes.activitykey}>{t('componentData.CardActivityTrial.acqRefData')}</Box>
                        <Box className={classes.valueLabel}>{data.acquirerReferenceData}</Box>
                    </Box> : null}
                </>)
            default:
            // Default code     
        }
    }

    const renderCustomizeAttributes = (ele) => {
        switch (ele.PropertyName) {

            case 'GeographySelection':
                return <>
                    <Box className={classes.crossText}>
                        {ele.UpdatedFieldName} : {ele.OldValue == "1" ? t('componentData.CCPaymentTransaction.allCountries') : ele.OldValue == "2" ?
                            t('componentData.CCPaymentTransaction.onlyOnVal') : t('componentData.CCPaymentTransaction.exceptVal')}
                    </Box>
                    <Box className={classes.valueLabel}>
                        {ele.UpdatedFieldName} : {ele.NewValue == "1" ? t('componentData.CCPaymentTransaction.allCountries') : ele.NewValue == "2" ?
                            t('componentData.CCPaymentTransaction.onlyOnVal') : t('componentData.CCPaymentTransaction.exceptVal')}
                    </Box>
                </>

            case 'TimeZoneId':
                return <>
                    {ele.OldValue ?
                        <Box className={classes.crossText}>
                            {ele.UpdatedFieldName}: {timeZoneList.length ? timeZoneList.find(x => x.timeZoneId == ele.OldValue).utcTimezone : ''}
                        </Box> : null
                    }
                    {ele.NewValue ?
                        <Box className={classes.valueLabel}>
                            {ele.UpdatedFieldName}: {timeZoneList.length ? timeZoneList.find(x => x.timeZoneId == ele.NewValue).utcTimezone : ''}
                        </Box> : null
                    }
                </>

            case 'CustomFieldValue':
                return <>
                    <Box className={classes.crossText}>
                        {ele.OldValue}
                    </Box>
                    <Box className={classes.valueLabel}>
                        {ele.NewValue}
                    </Box>
                </>

            case 'SupplierEmail':
                return <>
                    {ele.OldValue != null ?
                        <Box className={classes.crossText}>
                            {ele.UpdatedFieldName}: {ele.OldValue && ele.OldValue.split(';').join(', ')}
                        </Box> : null
                    }
                    {ele.NewValue != null ?
                        <Box className={classes.valueLabel}>
                            {ele.UpdatedFieldName}: {ele.NewValue && ele.NewValue.split(';').join(', ')}
                        </Box> : null
                    }
                </>
            case 'CumulativeSpendLimit':
            case 'RangeControlMaxAmount':
            case 'RangeControlMinAmount':
                return <>
                    {ele.OldValue != null ?
                        <Box className={classes.crossText}>
                            {ele.UpdatedFieldName}: $ {ele.OldValue.toFixed(2)}
                        </Box> : null
                    }
                    {ele.NewValue !== null ?
                        <Box className={classes.valueLabel}>
                            {ele.UpdatedFieldName}: $ {ele.NewValue.toFixed(2)}
                        </Box> : null
                    }
                </>
            case 'ExpiryDate':
                return <>
                    {ele.OldValue != null ?
                        <Box className={classes.crossText}>
                            {ele.UpdatedFieldName}: {formatCardDate(ele.OldValue)}
                        </Box> : null
                    }
                    {ele.NewValue !== null ?
                        <Box className={classes.valueLabel}>
                            {ele.UpdatedFieldName}: {formatCardDate(ele.NewValue)}
                        </Box> : null
                    }
                </>
        }
    }

    const removeConnectingLineAfterFilter = (count) => {
        setTimeout(() => {
            const trailList = document.querySelectorAll('[CID="collapsLine"]');
            if (trailList.length === 0) {
                const totalLine = document.querySelectorAll('[lid="VLine"]');
                for (var j = 0; j < totalLine.length; j++) {
                    totalLine[j].style.display = "block"
                }
            }
            else {
                for (var i = 0; i < trailList.length; i++) {
                    trailList[i].previousElementSibling.querySelector('[lid="VLine"]').style.display = "none"
                }
            }
            setMatchCount(count)
        }, 100)
    }


    return (
        <>
            {!loader
                ?
                <>
                    <Box
                        style={{
                            float: 'left',
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: "0 20px 20px",
                            borderBottom: '1px solid #8F9EC3',
                            margin: '0 0 25px'
                        }}
                    >
                        <FormControl
                            variant="outlined"
                            size="small"
                            style={{
                                width: "170px"
                            }}
                        >
                            <InputLabel htmlFor="outlined-Status-native-simple">Status</InputLabel>
                            <Select
                                native={true}
                                value={CardStatus}
                                onChange={(e) => setCardStatus(e?.currentTarget?.value ?? "0")}
                                label="Status"
                                inputProps={{
                                    name: 'Status',
                                    id: 'outlined-Status-native-simple',
                                }}
                            >
                                {Object.keys(CardActivityTrailStatus).length > 0 &&
                                    CardActivityTrailStatus.map((item) => {
                                        if (item?.statusDesc) {
                                            return (
                                                <option value={item.statusIDs}>{item.statusDesc}</option>
                                            )
                                        }
                                    })
                                }
                            </Select>
                        </FormControl>
                        {matchCount > 0
                            ? <Typography
                                variant='h3'
                                style={{
                                    display: 'inline-block',
                                    margin: '10px 0 0 10px',
                                    color: '#9E9E9E',
                                }}
                            >
                                {matchCount} {t('componentData.CardActivityTrial.results')}
                            </Typography>
                            : null
                        }
                    </Box>

                    {cardActivityTrailData && cardActivityTrailData.length ?
                        cardActivityTrailData.map((item, index, arr) => {
                            const getIndex = CardStatus?.split(",")?.indexOf(item?.statusID?.toString());
                            if (CardStatus !== '0' && getIndex === -1) {
                                totalUnMached += 1;
                                if (index === arr.length - 1) {
                                    removeConnectingLineAfterFilter(TotalMached);
                                }
                                if (index === arr.length - 1 && totalUnMached > 0) {
                                    return (
                                        <Box className={classes.collapsBox} CID="collapsLine">
                                            <label></label>
                                            <span>{totalUnMached}</span>
                                        </Box>
                                    )
                                }
                            }
                            else {
                                let showBigCollapsBox = false;
                                if (TotalMached === 0 && totalUnMached > 0) {
                                    showBigCollapsBox = true
                                }
                                const getUnMatchCount = totalUnMached > 0 ? totalUnMached : 0;
                                totalUnMached = 0;
                                TotalMached += 1;

                                if (index === arr.length - 1) {
                                    removeConnectingLineAfterFilter(TotalMached);
                                }

                                return (
                                    <>
                                        {getUnMatchCount > 0
                                            ? <>
                                                <Box
                                                    className={!showBigCollapsBox
                                                        ? classes.collapsBox
                                                        : classes.firstCollapsBox
                                                    }
                                                    CID={!showBigCollapsBox
                                                        ? "collapsLine"
                                                        : null
                                                    }
                                                >
                                                    <label></label>
                                                    <span>
                                                        {!showBigCollapsBox
                                                            ? getUnMatchCount
                                                            : `${getUnMatchCount} ${t('componentData.CardActivityTrial.collapsedStatuses')}`
                                                        }
                                                    </span>
                                                </Box>
                                            </>
                                            : null
                                        }
                                        <Grid item xs={12} className={classes.cardTrailDetailWrap} key={`card_activity-${index}`}>
                                            <Grid container>
                                                <Grid item xs={1}>
                                                    <Box className={classes.VerticalTreeIcon} display="flex" justifyContent='center'>
                                                        <span className={classes.iconStyle}>
                                                            {renderStatusIcon(item.statusID)}
                                                        </span>
                                                        {index != (cardActivityTrailData.length - 1) &&
                                                            <Box className={classes.VerticalTreeIconLine} LID="VLine"></Box>
                                                        }
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Box color="#0B1941">
                                                        {item.description} {PAID_USED_STATUS.includes(item.statusID) ? `$ ${item.transactionCurrencyAmount || ''}` : ''}
                                                    </Box>
                                                    <Box className={classes.activitykey}>{item.statusUpdatedAt}</Box>
                                                </Grid>
                                                <Grid item xs={7}>
                                                    <Box pr={3} className={classes.cardTrailDetailCol}>
                                                        {renderDetials(item)}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </>
                                )
                            }
                        })
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
                </>
                :
                <Box display="flex" justifyContent="center">
                    <CircularProgress color="primary" />
                </Box>
            }
            <SnackbarComponent
                openSnackbar={notification.open}
                handleClose={handleClose}
                snackbarMessage={notification.message}
                icon={false}
                messageVariant={notification.type}
            />
        </>
    )
}
export default withTranslation()(withStyles(styles)(CardActivityTrail));
