import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Button,
    CircularProgress,
    Typography,
    Tooltip,
    Divider,
    Checkbox,
    Paper,
    MenuItem
} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { withTranslation } from 'react-i18next';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from "~/components/Forms/TextField";
import "react-notifications/lib/notifications.css";
import { useDispatch, useSelector } from 'react-redux'
import AddIcon from '@material-ui/icons/Add';
import Notification from "~/components/Notification";
import {
    createMasterCardInfo, updateMasterCardInfo, getMasterCardInfo, savePaymentCardtype, getTemplateList,
    deleteProgramDetails, getTimeZoneList, updateFormValues
} from "~/redux/actions/payments";
import { CardType, GroupLimit, validForOptions, MCDefaultTimeZone } from "~/config/entityTypes";
import DeleteIcon from '@material-ui/icons/Delete';
import { ConfirmDialog } from '~/components/Dialogs';
import AutoCompleteChip from "~/components/AutoComplete";
import Autocomplete from '@material-ui/lab/Autocomplete';
import CountryIso3 from '~/components/CSC/CountryIso3';

const MasterCardDetail = (props) => {
    const dispatch = useDispatch();
    const paymentInfo = useSelector((state) => state.payment);
    const formValues = paymentInfo.payment.formValues;
    const [saveProcessing, setSaveProcessing] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [templateLoader, setTemplateLoader] = useState({
        loaderIndex: null, status: false
    });
    const [deleteProgramModal, setDeleteProgramModal] = useState({
        isOpen: false,
        message: '',
        deleteId: null,
        deleteIndex: null
    });
    const [purchaseTemplateAlert, setPurchaseTemplateAlert] = useState('');
    const [timeZoneList, setTimeZoneList] = useState([]);
    const { clientId, classes, t } = props;

    const { data, error, errorIndex } = formValues;

    const formData = {
        programName: "", 
        companyNumber: "", 
        purchaseDetails: [], 
        cardImage: false, 
        timeZoneId: MCDefaultTimeZone, 
        validFor: validForOptions.length > 0 ? validForOptions[0].title : '',
        country: "USA"
    }

    useEffect(() => {
        dispatch(updateFormValues({ data: [formData] }));
        fetchMasterCardDetail();
        fetchTimeZoneList();
    }, []);

    const fetchTimeZoneList = async () => {
        const options = await getTimeZoneList();
        if (options && options.data) {
            setTimeZoneList(options.data);
        }
    }

    const handleTimeZoneChange = (values, index) => {
        const newFormValues = [...formValues.data];
        if (values) {
            newFormValues[index]["timeZoneId"] = values.timeZoneId;
            dispatch(updateFormValues({ data: newFormValues }));
        }
    }

    const onMccChange = (values, index, ind) => {
        const newFormValues = [...formValues.data];
        const { purchaseDetails } = newFormValues[index];
        purchaseDetails[ind]['mccGroup'] = values;

        dispatch(updateFormValues({ data: newFormValues }));
    }

    const fetchMasterCardDetail = async () => {
        const VCDetailInfo = await getMasterCardInfo(clientId);
        const { data, error } = VCDetailInfo;
        if (error) {
            setAlertMessage(t('componentData.virtualCardDetail.errMsg'));
            setAlertType('error');
            return false;
        }
        if (data && data.length > 0) {
            const { programDetailsId } = data[0];
            dispatch(updateFormValues({ data: data, cardAccountDetailsId: programDetailsId }));
        }
    };

    const fetchTemplateList = async (index, e) => {
        const errors = { ...formValues.errorIndex };
        const validation = {};
        const programValue = e.target.value.trim();
        const copyFormData = [...formValues.data];

        if (programValue) {
            const isExist = data.filter(x => x.programName == programValue);
            if (isExist.length > 1) {
                validation["programName"] = t('componentData.masterCardDetails.programDuplicateErr');
                errors.programName.push(index);
                dispatch(updateFormValues({ error: { ...validation }, errorIndex: { ...errors } }));
            }
            else {
                setTemplateLoader({ status: true, loaderIndex: index });
                const removeProgramInd = errors.programName && errors.programName.indexOf(index);
                if (removeProgramInd > -1) {
                    errors.programName.splice(removeProgramInd, 1);
                }

                const response = await getTemplateList([programValue]); // INCEDO USD TEST COMPANY
                const createData = [];
                setTemplateLoader({ status: false, loaderIndex: null });

                if (response && response.length) {
                    if (response[0]?.errorCode == "ERROR") {
                        setPurchaseTemplateAlert(response[0]?.errorDescription || t('componentData.reduxData.SomethingWentWrong'));
                        errors.templateName.push(index);
                        dispatch(updateFormValues({ data: copyFormData, errorIndex: errors }));
                    }
                }
                else {
                    if (response.result && response.result.length > 0) {
                        response.result.forEach(templateItem => {
                            const { purchaseTemplates, messageId, programId, errorDescription } = templateItem;
                            copyFormData[index].messageId = messageId;
                            copyFormData[index].programId = programId;
                            if (purchaseTemplates && purchaseTemplates.length) {
                                purchaseTemplates.forEach(item => {
                                    createData.push({
                                        purchaseType: 'ALLPURCHASES',
                                        templateId: item.templateId,
                                        templateDescription: item.templateDescription,
                                        templateName: item.templateName,
                                        mccGroup: ["ALL MCCs"]
                                    });
                                });
                                const removeTemplateInd = errors.templateName && errors.templateName.indexOf(index);
                                if (removeTemplateInd > -1) {
                                    errors.templateName.splice(removeTemplateInd, 1);
                                }
                            }
                            else {
                                if (errors.templateName.includes(index) === false) {
                                    errors.templateName.push(index);
                                }
                                setPurchaseTemplateAlert(errorDescription ? errorDescription : t('componentData.masterCardDetails.purchaseTemplateErr'));
                            }
                        })
                    }
                    else {
                        if (errors.templateName.includes(index) === false) {
                            errors.templateName.push(index);
                        }
                        setPurchaseTemplateAlert(t('componentData.masterCardDetails.purchaseTemplateErr'));
                    }
                    copyFormData[index].purchaseDetails = createData;
                    dispatch(updateFormValues({ data: copyFormData, errorIndex: errors }));
                }
            }
        }
        else {
            const removeTemplateInd = errors.templateName && errors.templateName.indexOf(index);
            if (removeTemplateInd > -1) {
                errors.templateName.splice(removeTemplateInd, 1);
            }
            copyFormData[index].purchaseDetails = [];
            dispatch(updateFormValues({
                data: copyFormData,
                errorIndex: { ...errors },
            }));
        }
    }

    const handleChange = (i, e, typeIndex) => {
        const { name, value, checked } = e.target;
        const newFormValues = [...formValues.data];
        const { purchaseDetails } = newFormValues[i];

        switch (name) {
            case 'programName':
                newFormValues[i][name] = value.replace(/[^A-Za-z0-9 ]/g, '');
                break;
            case 'purchaseType':
            case 'templateName':
                purchaseDetails[typeIndex][name] = value.replace(/[^A-Za-z0-9 ]/g, '');
                break;
            case 'cardImage':
                newFormValues[i][name] = checked;
                break;
            case 'companyNumber':
                newFormValues[i][name] = value.replace(/[^0-9]/g, '');
                break;
            case 'validFor':
                newFormValues[i][name] = value;
                break;
            default:
                newFormValues[i][name] = value;
        }
        dispatch(updateFormValues({ data: newFormValues }));
    }

    const validation = () => {
        let valid = true
        const validation = {}, errorInd = {
            programName: [], 
            companyNumber: [], 
            purchaseType: [], 
            templateName: [], 
            mccGroup: [],
            timeZoneId: []
        };

        data.forEach((item, index) => {
            const { programName, companyNumber, timeZoneId, purchaseDetails } = item;
            if (!programName || programName.trim().length === 0) {
                validation["programName"] = t('componentData.masterCardDetails.programRequiredErr');
                errorInd["programName"].push(index);
                valid = false;
            }
            if (!companyNumber || companyNumber.trim().length === 0) {
                validation["companyNumber"] = t('componentData.masterCardDetails.companyRequiredErr');
                errorInd["companyNumber"].push(index);
                valid = false;
            }
            if (!timeZoneId) {
                validation["timeZoneId"] = t('componentData.masterCardDetails.timeZoneRequiredErr');
                errorInd["timeZoneId"].push(index);
                valid = false;
            }
            if (purchaseDetails.length) {
                const typeErrorInd = [], mccErrorIndexes = [];
                purchaseDetails.forEach((typeItem, ind) => {
                    const { purchaseType } = typeItem;

                    if (!purchaseType || purchaseType.trim().length === 0) {
                        validation["purchaseType"] = t('componentData.masterCardDetails.purchaseTypeRequiredErr');
                        typeErrorInd.push(ind);
                        valid = false;
                    }
                });
                errorInd["purchaseType"][index] = typeErrorInd;
                errorInd["mccGroup"][index] = mccErrorIndexes;
            } else {
                errorInd["templateName"].push(index);
                validation["templateName"] = t('componentData.masterCardDetails.purchaseTemplateRequiredErr');
                valid = false;
            }
        })

        dispatch(updateFormValues({ error: { ...validation }, errorIndex: { ...errorInd } }));
        return valid;
    };

    const onSubmit = () => {
        setSaveProcessing(true);
        const valid = validation();

        if (valid) {
            const { data, cardAccountDetailsId } = formValues;
            if (cardAccountDetailsId) {
                dispatch(
                    updateMasterCardInfo({
                        clientId: clientId,
                        masterCardDetail: data
                    })
                ).then((response) => {
                    setSaveProcessing(false);
                    if (response && !response.error) {
                        setAlertMessage(t('componentData.masterCardDetails.updateSuccessMsg'));
                        setAlertType('success');
                        //onPaymentMethodSave(paymentType);
                        dispatch(savePaymentCardtype({
                            clientId: clientId,
                            cardTypeId: CardType.MSC2
                        }))
                        getMasterCardInfo(clientId).then(resp => {
                            dispatch(updateFormValues({ data: resp.data }));
                        });
                    } else {
                        setAlertMessage(t('componentData.masterCardDetails.wentWrongErr'));
                        setAlertType('error');
                        return false;
                    }
                });
            } else {
                dispatch(
                    createMasterCardInfo({
                        clientId: clientId,
                        masterCardDetail: data
                    })
                ).then((response) => {
                    setSaveProcessing(false);
                    if (response && !response.error) {
                        setAlertMessage(t('componentData.masterCardDetails.saveSuccessMsg'));
                        setAlertType('success');
                        //onPaymentMethodSave(paymentType);
                        dispatch(savePaymentCardtype({
                            clientId: clientId,
                            cardTypeId: CardType.MSC2
                        }))
                        getMasterCardInfo(clientId).then(resp => {
                            dispatch(updateFormValues({ data: resp.data }));
                        });
                    } else {
                        setAlertMessage(t('componentData.masterCardDetails.wentWrongErr'));
                        setAlertType('error');
                        return false;
                    }
                });
            }
        }
        else {
            setAlertMessage(t('componentData.commonErr.validationMsg'));
            setAlertType('error');
            setSaveProcessing(false);
        }
    }

    const addNewProgram = () => {
        dispatch(updateFormValues({
            data: [...formValues.data,
            { programName: "", 
            companyNumber: "", 
            purchaseDetails: [], 
            cardImage: false, 
            timeZoneId: MCDefaultTimeZone, 
            validFor: validForOptions.length > 0 ? validForOptions[0].title : '',
            country: "USA" }]
        }));
    }
    const openDeleteProgramModal = (i) => {
        let newFormValues = [...formValues.data];
        const { programName, programDetailsId = null } = newFormValues[i];
        if (programName) {
            setDeleteProgramModal({
                isOpen: true,
                message: `${t('componentData.masterCardDetails.deleteMsg')} ${programName}?`,
                deleteId: programDetailsId,
                deleteIndex: i
            });
        }
        else {
            newFormValues.splice(i, 1);
            dispatch(updateFormValues({
                data: newFormValues
            }));
        }
    }
    const deleteProgram = () => {
        const newFormValues = [...formValues.data];
        if (deleteProgramModal.deleteId) {
            dispatch(deleteProgramDetails({
                clientId: clientId,
                programId: deleteProgramModal.deleteId
            })).then(res => {
                if (res && !res.error) {
                    setAlertMessage(res.message);
                    setAlertType('success');
                    newFormValues.splice(deleteProgramModal.deleteIndex, 1);
                    dispatch(updateFormValues({
                        data: newFormValues
                    }));
                } else {
                    setAlertMessage(res.message ? res.message : t('componentData.masterCardDetails.wentWrongErr'));
                    setAlertType('error');
                }
                closeDeleteProgramModal();
            })
        } else {
            newFormValues.splice(deleteProgramModal.deleteIndex, 1);
            dispatch(updateFormValues({
                data: newFormValues
            }));
            closeDeleteProgramModal();
        }
    }
    const closeDeleteProgramModal = () => {
        setDeleteProgramModal({ isOpen: false, message: '', deleteId: null, deleteIndex: null });
    }

    const hideAlertMessage = () => {
        setAlertMessage(null);
        setAlertType(null);
    }

    const renderSnackbar = (type, message) => {
        return (
            <Notification
                variant={type}
                message={message}
                handleClose={hideAlertMessage}
            />
        );
    };

    return (
        <Grid container item xs={12}>
            {data.map((element, index) => (<>
                <Grid item xs={12} className={classes.gridItem}>
                    <Box className={classes.headItem}>
                        {t('componentData.paymentMethodTable.masterCard')}
                    </Box>
                </Grid>
                <Grid item xs={12} className={classes.gridItem}>
                    <Box my={2} mx={1} display="flex">
                        <Typography>{t('componentData.masterCardDetails.programDetailsHead')}</Typography>
                        {index > 0 ?
                            <Tooltip title={t('componentData.masterCardDetails.deleteTooltip')} placement="top">
                                <DeleteIcon fontSize="small" className={classes.deleteIcon} onClick={() => openDeleteProgramModal(index)} />
                            </Tooltip>
                            : null
                        }
                    </Box>
                </Grid>
                <Grid container className={classes.p1}>
                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                        <Box mx={1} my={1}>
                            <TextField
                                color="secondary"
                                inputProps={{
                                    maxLength: 50,
                                    minLength: 1
                                }}
                                label={t('componentData.masterCardDetails.programName')}
                                placeholder={t('componentData.masterCardDetails.programName')}
                                error={errorIndex.programName.includes(index)}
                                helperText={errorIndex.programName.includes(index) ?
                                    error.programName : ''}
                                fullWidth={true}
                                autoComplete="off"
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                value={element.programName || ""}
                                name="programName"
                                onChange={e => handleChange(index, e)}
                                onBlur={e => fetchTemplateList(index, e)}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                        <Box mx={1} my={1}>
                            <Autocomplete
                                id="timezone-select"
                                options={timeZoneList}
                                disableClearable
                                getOptionLabel={(option) => option.utcTimezone}
                                value={element.timeZoneId && timeZoneList.find(x => x.timeZoneId === element.timeZoneId) || {}}
                                onChange={(e, values) => {
                                    handleTimeZoneChange(values, index)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('componentData.masterCardDetails.timeZone')}
                                        placeholder={t('componentData.masterCardDetails.timeZonePlaceholder')}
                                        InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                        variant="outlined"
                                        inputProps={{
                                            ...params.inputProps
                                        }}
                                        error={errorIndex.timeZoneId.includes(index)}
                                        helperText={errorIndex.timeZoneId.includes(index) ?
                                            error.timeZoneId : ''}
                                    />
                                )}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={3} className={classes.gridItem}>
                        <Box mx={1} my={1}>
                            <TextField
                                color="secondary"
                                inputProps={{
                                    maxLength: 7,
                                    minLength: 1
                                }}
                                label={t('componentData.masterCardDetails.programNumber')}
                                placeholder={t('componentData.masterCardDetails.programNumber')}
                                error={errorIndex.companyNumber.includes(index)}
                                helperText={errorIndex.companyNumber.includes(index) ?
                                    error.companyNumber : ''}
                                fullWidth={true}
                                autoComplete="off"
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                value={element.companyNumber || ''}
                                name="companyNumber"
                                onChange={e => handleChange(index, e)}
                            //onBlur={handleBlur}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={3} className={classes.gridItem}>
                        <Box mx={1} my={1}>
                            <CountryIso3
                                selectedCountry={element.country || ""}
                                // error={errorIndex.country.includes(index)}
                                // helperText={errorIndex.country.includes(index) ?
                                //     error.country : ''}
                                onChange={e => handleChange(index, e)}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={6} sm={2} className={classes.gridItem} style={{ paddingTop: '1rem' }}>
                        <Box my={1} className={classes.cardImageLabel}>
                            <Checkbox
                                name="cardImage"
                                checked={element.cardImage}
                                onChange={e => handleChange(index, e)}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                disabled={true} // don't need in this phase
                            />
                            <CreditCardIcon className={classes.cardImageIcon} />
                            {t('componentData.masterCardDetails.cardImage')}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4} className={classes.gridItem}>
                        <Box mx={1} my={1}>
                            <TextField
                                select
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="validFor"
                                label={t('componentData.masterCardDetails.validFor')}
                                variant="outlined"
                                onChange={e => handleChange(index, e)}
                                value={element.validFor}
                                defaultValue={validForOptions.length > 0 && validForOptions[0].title}
                            >
                                {validForOptions &&
                                    validForOptions.map((option) => (
                                        <MenuItem
                                            id={option.id}
                                            key={option.id}
                                            value={option.title}
                                        >
                                            {option.title}
                                        </MenuItem>
                                    ))}
                            </TextField>
                            <Typography className={classes.btnInfoText}>
                                {t('componentData.masterCardDetails.validForHelperText')}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {templateLoader.status && templateLoader.loaderIndex != null && templateLoader.loaderIndex == index ?
                    <Grid item xs={12} sm={12}>
                        <Box textAlign={"center"}>
                            <CircularProgress color="primary" />
                        </Box>
                    </Grid>
                    :
                    element.purchaseDetails.length ?
                        <Paper elevation={1} className={classes.paper}>
                            <Grid container>
                                {element.purchaseDetails.map((item, ind) => (<>
                                    <Grid item xs={12} sm={12} className={classes.gridItem}>
                                        <Box pl={1} pb={1} display={"flex"}>
                                            <Typography>{t('componentData.masterCardDetails.purchaseTemplate')} {ind + 1}</Typography>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                                        <Box mx={1} my={1}>
                                            <TextField
                                                color="secondary"
                                                inputProps={{
                                                    maxLength: 70,
                                                    minLength: 1
                                                }}
                                                label={t('componentData.masterCardDetails.templateName')}
                                                placeholder={t('componentData.masterCardDetails.templateName')}
                                                fullWidth={true}
                                                autoComplete="off"
                                                InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                                variant="outlined"
                                                value={item.templateName}
                                                name="templateName"
                                                onChange={e => handleChange(index, e, ind)}
                                                disabled
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                                        <Box mx={1} my={1} pt={1}>
                                            <AutoCompleteChip
                                                label={t('componentData.masterCardDetails.merchantCategoryCode')}
                                                name="mccGroup"
                                                value={item.mccGroup}
                                                onHandleChange={onMccChange}
                                                parentIndex={index}
                                                childIndex={ind}
                                                isError={errorIndex.mccGroup[index] && errorIndex.mccGroup[index].includes(ind)}
                                                helperText={errorIndex.mccGroup[index] && errorIndex.mccGroup[index].includes(ind) ?
                                                    error.mccGroup : ''}
                                            />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sm={6} className={classes.gridItem}>
                                        <Box mx={1} my={1}>
                                            <TextField
                                                color="secondary"
                                                inputProps={{
                                                    maxLength: 69,
                                                    minLength: 1
                                                }}
                                                label={t('componentData.masterCardDetails.purchaseType')}
                                                placeholder={t('componentData.masterCardDetails.purchaseType')}
                                                error={errorIndex.purchaseType[index] && errorIndex.purchaseType[index].includes(ind)}
                                                helperText={errorIndex.purchaseType[index] && errorIndex.purchaseType[index].includes(ind) ?
                                                    error.purchaseType : ''}
                                                fullWidth={true}
                                                autoComplete="off"
                                                InputLabelProps={{ shrink: true, style: { fontSize: 14 } }}
                                                variant="outlined"
                                                value={item.purchaseType}
                                                name="purchaseType"
                                                onChange={e => handleChange(index, e, ind)}
                                            />
                                        </Box>
                                    </Grid>
                                    {!(element.purchaseDetails.length == ind + 1) ?
                                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                                            <Box my={2} mx={1}>
                                                <Divider className={classes.divider} />
                                            </Box>
                                        </Grid>
                                        : null}
                                </>
                                ))}
                            </Grid>
                        </Paper> : null
                }
                {
                    purchaseTemplateAlert && errorIndex.templateName.includes(index) ?
                        <Grid item xs={12} sm={12} className={classes.gridItem}>
                            <Box my={2} mx={1}>
                                <MuiAlert severity="error" className={classes.errorAlertText}>
                                    {t('componentData.masterCardDetails.templateError')} {purchaseTemplateAlert}
                                </MuiAlert>
                            </Box>
                        </Grid> : null}

                <Grid item xs={12} sm={12} className={classes.gridItem}>
                    <Box my={2}>
                        <Divider className={classes.divider} />
                    </Box>
                </Grid>
                {data.length == index + 1 &&
                    <Grid item xs={12} sm={12} className={classes.gridItem}>
                        <Box className={classes.addBtnGrid}>
                            <Button variant="outlined"
                                className={classes.addBtn}
                                startIcon={<AddIcon />}
                                onClick={() => addNewProgram('programName')}
                                disabled={data.length >= GroupLimit.PROGRAMLIMIT}
                            >
                                {t('componentData.masterCardDetails.programBtn')}
                            </Button>
                            <Typography className={classes.btnInfoText}>
                                {t('componentData.masterCardDetails.programLimit', { count: (GroupLimit.PROGRAMLIMIT - data.length) })}
                            </Typography>
                        </Box>
                    </Grid>
                }
            </>
            ))}

            <Grid container item xs={12} justify="center" className={classes.saveButton}>
                {saveProcessing ? (
                    <CircularProgress color="primary" />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onSubmit()}
                        style={{ fontSize: 14 }}
                    >
                        {t('componentData.masterCardDetails.saveBtn')}
                    </Button>
                )}
            </Grid>
            {alertMessage && renderSnackbar(alertType, alertMessage)}
            {deleteProgramModal.isOpen && <ConfirmDialog
                dialogClassName={"alert-dialoge-root"}
                title={deleteProgramModal.message}
                message={""}
                onCancel={closeDeleteProgramModal}
                onConfirm={deleteProgram}
            />}
        </Grid>
    )
}
export default withTranslation()(withStyles(styles)(MasterCardDetail));
