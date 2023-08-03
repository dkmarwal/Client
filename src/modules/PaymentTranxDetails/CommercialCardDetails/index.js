import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Box, Tabs, Tab, Grid, Button, CircularProgress } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import moment from 'moment';

import { TabPanel } from '~/components/TabPanel/index';
import CardDetails from './CardDetails';
import PaymentControls from './PaymentControls';
import EditPaymentControl from './PaymentControls/editPaymentControl';
import InvoiceDetails from './InvoiceDetails';
import { styles } from '../styles';
import {
    getPaymentDetails,
    getPaymentTrackingDetails,
    cancelCCPayments,
    getCCPaymentDetails,
    modifyVCADetials
} from '~/redux/helpers/clientPaymentTransactions';
import { getTimeZoneList } from "~/redux/actions/payments";
import { connect } from 'react-redux';
import { accessRights } from '~/config/accessRights';
import BlockIcon from '@material-ui/icons/Block';
import CreateIcon from '@material-ui/icons/Create';
import { PaymentDetailPageCancelStatus, emailLimit, PaymentDetailPageModifyStatus } from '~/config/entityTypes'
import CancelCCPayment from '~/modules/CancelCCPayment';
import { SnackbarComponent } from '~/components/Notification/snackbar';
import CardActivityTrail from './CardActivityTrail';
import config from "~/config";
import _ from 'lodash';
import { ErrorDialog } from '~/components/Dialogs';
import RetryCancelCCPayment from '~/modules/CancelCCPayment/retryCancelCCPayment';

const CommercialCardDetails = (props) => {
    let history = useHistory();
    const [selectedTab, setSelectedTab] = useState(0);
    const [paymentDetail, setPaymentDetail] = useState({});
    const [ccPaymentDetail, setCCPaymentDetail] = useState({});
    const [modifyData, setModifyData] = useState({});
    const [compareModifyObj, setCompareModifyObj] = useState({});
    const [ccPaymentEditMode, setCCPaymentEditMode] = useState(false);
    const [ccPaymentTrackingDetail, setCCPaymentTrackingDetail] = useState([]);
    const [ccActiveTrackingStep, setCCActiveTrackingStep] = useState(0);
    const [openCancelCCModal, setOpenCancelCCModal] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [validation, setValidation] = useState({});
    const [saveLoader, setSaveLoader] = useState(false);
    const [timeofDayLinkStatus, setTimeofDayLinkStatus] = useState(true);
    const [validForType, setValidForType] = useState('D');
    const [timeZoneList, setTimeZoneList] = useState([]);
    const [notification, setNotification] = useState({
        message: '',
        type: '',
        open: false
    });
    const [errorDialog, setErrorDialog] = useState({
        message: '',
        open: false
    });
    const [loading, setLoading] = useState(false);
    const [openRetryCancelCCPaymentModal, setRetryOpenCancelCCPaymentModal] = useState(false);
    const [cancelVCARespose, setCancelVCARespose] = useState([]);
    const { classes, t, paymentId, clientId, businessType, selectedPayeeRemitToId, userName, user } = props;

    useEffect(() => {
        fetchAllPaymentData();
        fetchTimeZoneList();
    }, [paymentId, selectedTab]);

    const fetchTimeZoneList = async () => {
        const options = await getTimeZoneList();
        if (options && options.data) {
            setTimeZoneList(options.data);
        }
    }

    const fetchAllPaymentData = () => {
        fetchPaymentDetails(paymentId);
        fetchCCPaymentDetails();
    }

    const fetchCCPaymentDetails = async () => {
        setLoading(true);
        const ccRes = await getCCPaymentDetails(paymentId, clientId);
        const res = await getPaymentTrackingDetails(clientId, paymentId, businessType);

        if (ccRes.result) {
            setCCPaymentDetail(ccRes.result);
            setLoading(false);
        }
        if (res && res.data) {
            let stepIndex = [...res.data];
            stepIndex = stepIndex.sort((a, b) => {
                if (a.StatusID > b.StatusID) {
                    return -1;
                }
                if (b.StatusID > a.StatusID) {
                    return 1;
                }
                return 0;
            }).find((el) => el.IsStatusUpdated === 1)?.StatusID;
            stepIndex = res.data.findIndex((el) => el.StatusID === stepIndex);

            setCCPaymentTrackingDetail(res.data);
            setCCActiveTrackingStep(stepIndex);
        }
    }

    const fetchPaymentDetails = React.useCallback(
        async (paymentId) => {
            const response = await getPaymentDetails(clientId, paymentId, businessType);

            if (response && response.data) {
                const { data } = response;
                setPaymentDetail(data);
            }
        },
        [clientId, businessType]
    );

    const handleEditMode = () => {
        if (!ccPaymentEditMode) {
            const { virtualCardCreatePaymentDTO, spendvelocitycontroldata, timeofdaycontroldata, paymentsCustomdata } = ccPaymentDetail;

            const obj = {
                ...virtualCardCreatePaymentDTO[0],
                spendVelocity: spendvelocitycontroldata,
                timeOfDayControl: timeofdaycontroldata,
                customReference: paymentsCustomdata,
                modifiedBy: userName
            };
            setModifyData(JSON.parse(JSON.stringify(obj)));
            setCompareModifyObj(JSON.parse(JSON.stringify(obj)));
        } else {
            setValidation({});
        }

        setCCPaymentEditMode(!ccPaymentEditMode);
    }

    const isValidDate = (dateString) => {
        // First check for the pattern
        if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;

        // Parse the date parts to integers
        var parts = dateString.split('/');
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if (year < 1000 || year > 3000 || month === 0 || month > 12) return false;

        var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        // Adjust for leap years
        if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    };

    const isPaymentRemmitanceModifyEnabled = (user.userRoles &&
        user.userRoles.includes(accessRights['PAYMENTS_REMITTANCES_MODIFY'])) || false;

    const isPaymentRemmitanceCancelEnabled = (user.userRoles &&
        user.userRoles.includes(accessRights['PAYMENTS_REMITTANCES_CANCEL'])) || false;

    const handleBlur = (event, index) => {
        const { name, value } = event.target;
        let modifyObj = { ...modifyData };
        let errorValidation = { ...validation };
        delete errorValidation[name];

        switch (name) {
            case 'validityStartDate':
                if (value && !isValidDate(value)) {
                    errorValidation[name] = t('componentData.CCPaymentControlValidation.dataFormatError');
                }
                break;

            case 'validityEndDate':
                if (value && !isValidDate(value)) {
                    errorValidation[name] = t('componentData.CCPaymentControlValidation.dataFormatError');
                }
                break;

            case 'curfewStartTime':
                if (value && !value.toString().trim().match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g)) {
                    errorValidation[name] = t('componentData.CCPaymentControlValidation.timeFormatError');
                }
                if (modifyObj.curfewEndTime && modifyObj.curfewEndTime < value) {
                    errorValidation[name] = t('componentData.CCPaymentControlValidation.timeShouldBeLess');
                }
                break;
            case 'curfewEndTime':
                if (value && !value.toString().trim().match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g)) {
                    errorValidation[name] = t('componentData.CCPaymentControlValidation.timeFormatError');
                }
                if (modifyObj.curfewStartTime && modifyObj.curfewStartTime > value) {
                    errorValidation[name] = t('componentData.CCPaymentControlValidation.timeShouldBeLess');
                }
                break;

            case 'startTimeControl':
                if (timeofDayLinkStatus) {
                    if (value && !value.toString().trim().match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g)) {
                        errorValidation.startTimeControl = [];
                        const indexes = modifyObj.timeOfDayControl.map(x => x.trackingIndex - 1);
                        errorValidation.startTimeControl = indexes;
                    }
                } else {
                    errorValidation.startTimeControl = [];
                    for (let i = 0; i < modifyObj.timeOfDayControl.length; i++) {
                        if (!modifyObj.timeOfDayControl[i].startTime.trim().match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g)) {
                            errorValidation.startTimeControl.push(i)
                        }
                    }
                }
                if (errorValidation.startTimeControl && errorValidation.startTimeControl.length > 0) {
                    errorValidation["startTimeControlMsg"] = t('componentData.CCPaymentControlValidation.timeFormatError');
                }
                break;

            case 'endTimeControl':
                if (timeofDayLinkStatus) {
                    if (value && !value.toString().trim().match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g)) {
                        errorValidation.endTimeControl = [];
                        const indexes = modifyObj.timeOfDayControl.map(x => x.trackingIndex - 1);
                        errorValidation.endTimeControl = indexes;
                    }
                } else {
                    errorValidation.endTimeControl = [];
                    for (let i = 0; i < modifyObj.timeOfDayControl.length; i++) {
                        if (!modifyObj.timeOfDayControl[i].endTime.trim().match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g)) {
                            errorValidation.endTimeControl.push(i)
                        }
                    }
                }
                if (errorValidation.endTimeControl && errorValidation.endTimeControl.length > 0) {
                    errorValidation["endTimeControlMsg"] = t('componentData.CCPaymentControlValidation.timeFormatError');
                }
                break;

            default:
                errorValidation[name] = value;
                break;
        }
        setValidation(errorValidation);
    };

    const onPaymentDTOChange = (e, i) => {
        const { name, value } = e.target;
        let modifyObj = { ...modifyData };

        switch (name) {
            case 'merchantIdControlMerchantId':
                modifyObj[name] = value.replace(/[^0-9a-zA-Z]/g, '');
                break;
            case 'merchantIdControlAcquirerId':
            case 'agingVelocityAuthorizationHoldDays':
                modifyObj[name] = parseInt(value.replace(/[^0-9]/g, ''));
                break;

            case 'periodType':
            case 'cumulativeSpendLimit':
                modifyObj.spendVelocity[i][name] = value;
                break;

            case 'maxAuth':
                modifyObj.spendVelocity[i][name] = Number(value);
                break;

            case 'curfewStartTime':
                modifyObj[name] = value.replace(/[^0-9:]/g, '');
                break;
            case 'curfewEndTime':
                modifyObj[name] = value.replace(/[^0-9:]/g, '');
                break;

            case 'validityStartDate':
                modifyObj[name] = value;
                break;

            case 'startTimeControl':
                const startVal = value.replace(/[^0-9:]/g, '');
                if (timeofDayLinkStatus) {
                    modifyObj.timeOfDayControl.map(x =>
                        name == 'startTimeControl' ? x.startTime = startVal : x.endTime = startVal);
                } else {
                    modifyObj.timeOfDayControl[i]['startTime'] = startVal;
                }
                break;
            case 'endTimeControl':
                const endVal = value.replace(/[^0-9:]/g, '');
                if (timeofDayLinkStatus) {
                    modifyObj.timeOfDayControl.map(x =>
                        name == 'startTimeControl' ? x.startTime = endVal : x.endTime = endVal);
                } else {
                    modifyObj.timeOfDayControl[i]['endTime'] = endVal;
                }
                break;

            case 'validForType':
                setValidForType(value);
                const validValue = modifyObj.validFor.substring(0, modifyObj.validFor.length - 1);
                modifyObj['validFor'] = validValue + value;
                break;

            case 'validFor':
                modifyObj[name] = value && value.replace(/[^0-9:]/g, '') + validForType || '';
                break;

            default:
                modifyObj[name] = value;
                break;
        }
        setModifyData(modifyObj);
    }

    const updateValidForType = (value) => {
        if (value)
            setValidForType(value);
    }

    const onCustomFieldChange = (e, i) => {
        let ref = [...modifyData.customReference];
        ref[i].customFieldValue = e.target.value;

        setModifyData({
            ...modifyData,
            customReference: ref
        })
    }

    const onMultiSelectChange = (name, values) => {
        let modifyObj = { ...modifyData };
        let errorValidation = { ...validation };
        delete errorValidation[name];

        switch (name) {
            case 'paymentBeneficiaryEmails':
                if (values.length <= emailLimit) {
                    modifyObj[name] = values.length > 0 ? values.join(';') : null;
                }
                break;

            case 'geographyControlCountryCodes':
                modifyObj[name] = values.length && values.map(x => x.countryCodes).join(',') || '';
                break;

            case 'timeZoneId':
                modifyObj[name] = values && values.timeZoneId || 0;
                break;

            case 'curfewweekdaysEffective':
                modifyObj[name] = values.length && values.map(x => x.key).join(',') || '';
                break;
            default:
            //return default case    
        }
        setModifyData(modifyObj);
    }

    const onRadioChange = (event) => {
        const { name, value } = event.target;
        let modifyObj = { ...modifyData };

        if (value) {
            if (name == "geographySelection" && value == "1") {
                modifyObj["geographyControlCountryCodes"] = "";
            }
            modifyObj[name] = value;
        }
        setModifyData(modifyObj);
    }

    const onAddVelocityControl = () => {
        setModifyData({
            ...modifyData,
            spendVelocity: [...modifyData.spendVelocity,
            { periodType: '', maxAuth: 0, cumulativeSpendLimit: 0, enableSpendVelocityControl: true }]
        })
    }

    const onDeleteVelocityControl = (item, index) => {
        let modifyObj = { ...modifyData };

        if (item && item.clientId) {
            modifyObj.spendVelocity[index].enableSpendVelocityControl = false;
        } else {
            modifyObj.spendVelocity.splice(index, 1);
        }
        setModifyData({
            ...modifyData,
            spendVelocity: [...modifyObj.spendVelocity]
        })
    }

    const validateModifyData = () => {
        let errorValidation = {}, isValid = true;
        const { merchantIdControlMerchantId, merchantIdControlAcquirerId, paymentBeneficiaryEmails, rangeControlminAmount,
            rangeControlmaxAmount, transactionLimitAmountLimit, enableTransactionLimitControl, timeOfDayControl,
            geographyControlCountryCodes, curfewStartTime, curfewEndTime, validFor, timeZoneId, enableMerchantIdControl, enableAmountRangeControl,
            enableCurfewControl, enableGeographyControl, customReference } = modifyData;

        // TimeZone
        if (timeZoneId == 0) {
            errorValidation["timeZone"] = t('componentData.CCPaymentControlValidation.timeZoneRequired');
            isValid = false;
        }
        // Valid for
        if (!validFor) {
            errorValidation["validFor"] = t('componentData.CCPaymentControlValidation.validForRequired');
            isValid = false;
        }
        // Merchant ID control
        if (enableMerchantIdControl) {
            if (!merchantIdControlAcquirerId) {
                errorValidation["merchantIdControlAcquirerId"] = t('componentData.CCPaymentControlValidation.acquirerRequired');
                isValid = false;
            }
            if (!merchantIdControlMerchantId) {
                errorValidation["merchantIdControlMerchantId"] = t('componentData.CCPaymentControlValidation.merchantRequired');
                isValid = false;
            }
        }

        // Supplier Emails
        // if (!paymentBeneficiaryEmails) {
        //     errorValidation['paymentBeneficiaryEmails'] = t('componentData.CCPaymentControlValidation.emailRequired');
        //     isValid = false;
        // }
        if (paymentBeneficiaryEmails) {
            const emails = paymentBeneficiaryEmails.split(';');
            const isInvalid = emails.filter(item => !item.toString().match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/));
            if (isInvalid.length > 0) {
                errorValidation['paymentBeneficiaryEmails'] = t('componentData.CCPaymentControlValidation.invalidEmail');
                isValid = false;
            }
        }

        // Exact amount range control
        if (enableAmountRangeControl) {
            if (!rangeControlminAmount) {
                errorValidation["rangeControlminAmount"] = t('componentData.CCPaymentControlValidation.minTranxAmtRequired');
                isValid = false;
            }
            if (!rangeControlmaxAmount) {
                errorValidation["rangeControlmaxAmount"] = t('componentData.CCPaymentControlValidation.maxTranxAmtRequired');
                isValid = false;
            }

            if (rangeControlminAmount && rangeControlmaxAmount) {
                if (parseFloat(rangeControlminAmount.replace(/,/g, '')) > parseFloat(rangeControlmaxAmount.replace(/,/g, ''))) {
                    errorValidation["rangeControlminAmount"] = t('componentData.CCPaymentControlValidation.minGreaterValidation');
                    isValid = false;
                }
            }
            // if (!multiUse) {
            //     if (rangeControlminAmount != rangeControlmaxAmount) {
            //         errorValidation["rangeControlminAmount"] = t('componentData.CCPaymentControlValidation.minMaxEqualValid');
            //         errorValidation["rangeControlmaxAmount"] = t('componentData.CCPaymentControlValidation.minMaxEqualValid');
            //         isValid = false;
            //     }
            // }            
        }

        // Transaction Limit
        if (enableTransactionLimitControl) {
            if (!transactionLimitAmountLimit) {
                errorValidation["transactionLimitAmountLimit"] = t('componentData.CCPaymentControlValidation.maxSingleTranxAmtRequired');
                isValid = false;
            }
        }

        // Time of the Day Control
        if (timeOfDayControl.length) {
            const startTimeInd = timeOfDayControl.findIndex(x => x.startTime == "");
            const endTimeInd = timeOfDayControl.findIndex(x => x.endTime == "");
            if (startTimeInd > -1) {
                errorValidation.startTimeControl = [];
                errorValidation.startTimeControl.push(startTimeInd);
                errorValidation["startTimeControlMsg"] = t('componentData.CCPaymentControlValidation.startTimeRequired');
                isValid = false;
            }
            if (endTimeInd > -1) {
                errorValidation.endTimeControl = [];
                errorValidation.endTimeControl.push(endTimeInd);
                errorValidation["endTimeControlMsg"] = t('componentData.CCPaymentControlValidation.endTimeRequired');
                isValid = false;
            }
        }

        // Curfew Control
        if (enableCurfewControl) {
            if (!curfewStartTime) {
                errorValidation["curfewStartTime"] = t('componentData.CCPaymentControlValidation.startTimeRequired');
                isValid = false;
            }
            if (!curfewEndTime) {
                errorValidation["curfewEndTime"] = t('componentData.CCPaymentControlValidation.endTimeRequired');
                isValid = false;
            }
        }

        // Geography Control
        if (enableGeographyControl) {
            if (!geographyControlCountryCodes) {
                errorValidation["geographyControlCountryCodes"] = t('componentData.CCPaymentControlValidation.countryCodeRequired');
                isValid = false;
            }
        }

        // Custom Fields
        if (customReference.length) {
            errorValidation.customReference = [];
            customReference.forEach((x, i) => {
                if (x.customFieldValue == "") {
                    errorValidation.customReference.push(i);
                    errorValidation["customReferenceMsg"] = t('componentData.CCPaymentControlValidation.customFieldRequired');
                    isValid = false;
                }
            });
        }

        setValidation(errorValidation);
        return isValid;
    }

    const modifyPayload = () => {
        let modifyObj = { ...modifyData };
        if (modifyObj && modifyObj.rangeControlmaxAmount) {
            modifyObj['rangeControlmaxAmount'] = parseFloat(modifyObj.rangeControlmaxAmount.replace(/,/g, ''));
        }
        if (modifyObj && modifyObj.rangeControlminAmount) {
            modifyObj['rangeControlminAmount'] = parseFloat(modifyObj.rangeControlminAmount.replace(/,/g, ''));
        }
        if (modifyObj && modifyObj.validityEndDate) {
            modifyObj['validityEndDate'] = moment(modifyObj.validityEndDate).format('YYYY-MM-DD') || '';
        }
        if (modifyObj && modifyObj.validityStartDate) {
            modifyObj['validityStartDate'] = moment(modifyObj.validityStartDate).format('YYYY-MM-DD') || '';
        }

        if (modifyObj.spendVelocity.length) {
            modifyObj.spendVelocity.map((item, i) => {
                if (item.cumulativeSpendLimit) {
                    return modifyObj.spendVelocity[i]["cumulativeSpendLimit"] = parseFloat(item.cumulativeSpendLimit.toString().replace(/,/g, ''));
                }
            })
        }
        return modifyObj;
    }

    const onSaveModifyData = async () => {
        const isValid = validateModifyData();

        if (isValid) {
            setSaveLoader(true);
            const payload = await modifyPayload();
            const response = await modifyVCADetials(payload);

            if (response.status === "ERROR" || response.status == null) {
                setErrorDialog({
                    message: response.errors && response.errors.errorCode && response.errors.errorCode == "500" ?
                        t('componentData.CCPaymentControlValidation.customMsg') : response.errors?.errorDescription ?
                            response.errors.errorDescription : t('componentData.reduxData.SomethingWentWrong'),
                    open: true
                });

                setSaveLoader(false);
            } else {
                setNotification({
                    message: t('componentData.CCPaymentControlValidation.modifySuccess'),
                    type: 'success',
                    open: true
                });
                setSaveLoader(false);
                setCCPaymentEditMode(false);
                fetchAllPaymentData();
            }
        }
        else {
            setNotification({
                message: t('componentData.commonErr.validationMsg'),
                type: 'error',
                open: true
            })
        }
    }

    const onCCModalChange = () => {
        setOpenCancelCCModal(!openCancelCCModal);
        setRetryOpenCancelCCPaymentModal(false);
    }

    const onCancelCCPayment = async (reason) => {
        const { ClientID, PaymentID } = paymentDetail;

        const payload = {
            clientID: ClientID,
            paymentIDs: [PaymentID],
            cancelledReason: reason,
            cancelledBy: userName
        }
        setCancelLoading(true);
        const res = await cancelCCPayments(payload);
        if (res?.result?.vcaResponse && res?.result?.vcaResponse.length && res?.result?.vcaResponse[0]?.errors?.errorCode != "500") {
            if (res.result.vcaResponse[0].status == "COMPLETED") {
                setNotification({
                    message: t('componentData.CCPaymentTransaction.msg11'),
                    type: 'success',
                    open: true
                })
                onCCModalChange();
                setTimeout(() => history.push(`${config.baseName}/payments/paymentDetails`), 1000);
            } else {
                setCancelVCARespose(res?.result?.vcaResponse);
                onCCModalChange();
                openRetryModal();
            }
        }
        else {
            setNotification({
                message: t('componentData.CCPaymentControlValidation.customMsg'),
                type: 'error',
                open: true
            })
            onCCModalChange();
        }
        setCancelLoading(false);
    }

    const openRetryModal = () => {
        setRetryOpenCancelCCPaymentModal(!openRetryCancelCCPaymentModal);
    }

    const handleClose = () => {
        setNotification({ message: '', type: '', open: false });
    };
    const handleDialogClose = () => {
        setErrorDialog({ message: '', open: false });
    };

    const changeTimeofDayLink = () => {
        setTimeofDayLinkStatus(!timeofDayLinkStatus);
    }

    const onTimeofDayCheckChange = (event, index) => {
        const { name, checked } = event.target;
        const modifyObj = { ...modifyData };

        if (checked) {
            modifyObj.timeOfDayControl.splice(index, 0, { endTime: "", startTime: "", weekdayEffective: name, trackingIndex: index + 1 });
            if (modifyObj.timeOfDayControl.length == 7) {
                modifyObj.timeOfDaysSelection = "1"; // All days selection for Time of the day control
            }
        } else {
            let errorValidation = { ...validation };
            let { startTimeControl, endTimeControl } = errorValidation;
            if (startTimeControl && startTimeControl.includes(index)) {
                startTimeControl.splice(startTimeControl.indexOf(index), 1);
            }
            if (endTimeControl && endTimeControl.includes(index)) {
                endTimeControl.splice(endTimeControl.indexOf(index), 1);
            }
            const filterArr = modifyObj.timeOfDayControl.filter(x => x.weekdayEffective != name);
            modifyObj.timeOfDayControl = filterArr;
            modifyObj.timeOfDaysSelection = "2"; // Only on selection for Time of the day control
        }
        setModifyData(modifyObj);
    }

    const { virtualCardCreatePaymentDTO, paymentsCustomdata, timeofdaycontroldata,
        spendvelocitycontroldata } = ccPaymentDetail;

    const isDataModified = _.isEqual(compareModifyObj, modifyData);
    return (
        <Grid container>
            <Grid item xs>
                <Tabs
                    orientation="horizontal"
                    variant="standard"
                    value={selectedTab}
                    indicatorColor="secondary"
                    textColor="secondary"
                >
                    <Tab
                        className={classes.ccTabs}
                        onClick={() => setSelectedTab(0)}
                        label={t('componentData.CCPaymentTransactionTabs.cardDetails')}
                        disabled={false}
                    />
                    <Tab
                        className={classes.ccTabs}
                        onClick={() => setSelectedTab(1)}
                        label={t('componentData.CCPaymentTransactionTabs.activityTrail')}
                        disabled={false}
                    />
                    <Tab
                        className={classes.ccTabs}
                        onClick={() => setSelectedTab(2)}
                        label={t('componentData.CCPaymentTransactionTabs.cardControls')}
                        disabled={false}
                    />
                    <Tab
                        className={classes.ccTabs}
                        onClick={() => setSelectedTab(3)}
                        label={t('componentData.CCPaymentTransactionTabs.invoice')}
                        disabled={false}
                    />
                </Tabs>
                <TabPanel value={selectedTab} index={0} className={classes.ccTabPanel}>
                    <CardDetails
                        cardData={virtualCardCreatePaymentDTO}
                        b2bPaymentData={paymentDetail}
                        ccPaymentTrackingDetail={ccPaymentTrackingDetail}
                        ccActiveTrackingStep={ccActiveTrackingStep}
                        selectedPayeeRemitToId={selectedPayeeRemitToId}
                        isEditMode={ccPaymentEditMode}
                        onChange={onMultiSelectChange}
                        modifyData={modifyData}
                        validation={validation}
                        businessType={businessType}
                        {...props}
                    />
                </TabPanel>

                <TabPanel value={selectedTab} index={1} className={classes.ccTabPanel}>
                    <CardActivityTrail
                        clientId={clientId}
                        paymentId={paymentId}
                        vcaId={Boolean(virtualCardCreatePaymentDTO) && virtualCardCreatePaymentDTO[0]?.vcaid}
                        timeZoneList={timeZoneList}
                        setTabId={(tab) => setSelectedTab(tab)}
                    />
                </TabPanel>

                <TabPanel value={selectedTab} index={2} className={classes.ccTabPanel}>
                    {!ccPaymentEditMode ?
                        <PaymentControls
                            spendVelocityData={spendvelocitycontroldata}
                            timeOfControlData={timeofdaycontroldata}
                            otherData={virtualCardCreatePaymentDTO}
                            paymentsCustomdata={paymentsCustomdata}
                        />
                        :
                        <EditPaymentControl
                            modifyData={modifyData}
                            onChange={onPaymentDTOChange}
                            onMultiSelectChange={onMultiSelectChange}
                            handleBlur={handleBlur}
                            onAddVelocityControl={onAddVelocityControl}
                            onDeleteVelocityControl={onDeleteVelocityControl}
                            onCustomFieldChange={onCustomFieldChange}
                            onRadioChange={onRadioChange}
                            validation={validation}
                            timeofDayLinkStatus={timeofDayLinkStatus}
                            changeTimeofDayLink={changeTimeofDayLink}
                            validForType={validForType}
                            onTimeofDayCheckChange={onTimeofDayCheckChange}
                            updateValidForType={updateValidForType}
                            timeZoneList={timeZoneList}
                        />
                    }
                </TabPanel>
                <TabPanel value={selectedTab} index={3} className={classes.ccTabPanel}>
                    <Box className={classes.invoiceBox}>
                        <InvoiceDetails
                            clientId={clientId}
                            paymentId={paymentId}
                        />
                    </Box>
                </TabPanel>
            </Grid>
            <Grid container>
                {isPaymentRemmitanceCancelEnabled && PaymentDetailPageCancelStatus.includes(Boolean(paymentDetail) && paymentDetail?.ReturnStatusID) &&
                    <Grid item>
                        <Box mx={3} pb={4}>
                            <Button
                                variant="contained"
                                className={classes.editCancelBtn}
                                startIcon={<BlockIcon />}
                                onClick={onCCModalChange}
                            >
                                {t('componentData.CCPaymentTransaction.cancelCard')}
                            </Button>
                        </Box>
                    </Grid>
                }
                {isPaymentRemmitanceModifyEnabled && PaymentDetailPageModifyStatus.includes(Boolean(paymentDetail) &&
                    paymentDetail?.ReturnStatusID) && (!ccPaymentEditMode ?
                        <Grid item xs={4}>
                            <Box mx={1} pb={4}>
                                <Button
                                    variant="contained"
                                    className={classes.editCancelBtn}
                                    startIcon={<CreateIcon />}
                                    onClick={handleEditMode}
                                    disabled={loading}
                                >
                                    {t('componentData.CCPaymentTransactionTabs.modifyBtn')}
                                </Button>
                            </Box>
                        </Grid>
                        :
                        <Grid item xs={7}>
                            <Grid container direction="row" justifyContent="center" alignItems="center">
                                <Grid>
                                    <Box mx={2} pb={4}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={handleEditMode}
                                        >
                                            {t('componentData.CCPaymentTransactionTabs.cancelBtn')}
                                        </Button>
                                    </Box>
                                </Grid>
                                <Grid>
                                    <Box mx={2} pb={4}>
                                        {!saveLoader ?
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={onSaveModifyData}
                                                disabled={isDataModified}
                                            >
                                                {t('componentData.CCPaymentTransactionTabs.saveBtn')}
                                            </Button>
                                            :
                                            <CircularProgress color='primary' />
                                        }
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>)
                }
            </Grid>

            <CancelCCPayment
                openCancelCCPaymentModal={openCancelCCModal}
                singleCardRow={paymentDetail}
                bulkCancel={false}
                openCancelCCModalChange={onCCModalChange}
                onCancelCCPayment={onCancelCCPayment}
                loading={cancelLoading}
            />
            <RetryCancelCCPayment
                openRetryCancelCCPaymentModal={openRetryCancelCCPaymentModal}
                // selectedPayment={selectedPayment}
                paymentData={paymentDetail}
                openCancelCCModalChange={openRetryModal}
                onCancelCCPayment={onCancelCCPayment}
                // successCancelIds={successCancelIds}
                openAgainCancelModal={onCCModalChange}
                cancelVCAResponse={cancelVCARespose}
                bulkCancel={false}
                isDetailPage={true}
            />
            <SnackbarComponent
                openSnackbar={notification.open}
                handleClose={handleClose}
                snackbarMessage={notification.message}
                icon={false}
                messageVariant={notification.type}
            />
            <ErrorDialog
                open={errorDialog.open}
                dialogClassName={"alert-dialoge-root"}
                dialogContent={errorDialog.message}
                onConfirm={handleDialogClose}
            />
        </Grid>
    )
}
export default withTranslation()(connect((state) => ({
    ...state.user,
}))(withStyles(styles)(CommercialCardDetails)));
