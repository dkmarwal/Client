import React, { useState } from "react";
import { connect } from "react-redux";
import { styles } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
import { Box, Typography, Grid, Select, FormControl, InputLabel, FormHelperText } from "@material-ui/core";
import { TextField, Button } from "~/components/Forms";
import { addCustomPaymentAttributes } from "~/redux/actions/paymentAttribute";
import { addCustomPayeeAttributes } from "~/redux/actions/payeeAttribute";
import { entityType, csvFileFormat } from '~/config/entityTypes';

const CustomAttribute = (props) => {
    const { classes, paymentAttribute, payeeAttribute, dispatch, parentId, t } = props;
    const { dataTypeList, attributeList: paymentAttributeList, tabValue } = paymentAttribute;
    const { attributeList: payeeAttributeList } = payeeAttribute;
    const [customAttribute, setCustomAttribute] = useState({ attributeName: '', dataType: '', minLength: '', maxLength: '', mandatory: '' });
    const [validation, setValidation] = useState({});

    const fileSelectionType = paymentAttribute.fileSelectionType && paymentAttribute.fileSelectionType?.paymentHeader ?
        paymentAttribute.fileSelectionType : payeeAttribute.fileSelectionType;

    const isPayee = (fileSelectionType.fileTypeId && fileSelectionType.fileTypeId == csvFileFormat.PAYEE) ||
        (fileSelectionType.fileTypeId == csvFileFormat.BOTHPAYEEPAYMENT && tabValue == 0) || false;
    const selectedAttributeList = isPayee ? payeeAttributeList : paymentAttributeList;

    const handleChange = e => {
        let { name, value } = e.target;

        switch (name) {
            case 'attributeName':
                value = value.replace(/[^A-Za-z 0-9_]/g, '');
                break;
            case 'maxLength':
            case 'minLength':
                value = Number(value.replace(/[^0-9]/g, ''));
                break;
            default:
                // code block
        }
        setCustomAttribute({ ...customAttribute, [name]: value });
        if (name == "dataType" && (value == 4 || value == 6)) {
            setCustomAttribute({ ...customAttribute, minLength: 0, maxLength: 0, [name]: value });
        }
    }

    const validateAttribute = () => {
        let errorText = {}, isValid = true;
        if (customAttribute.attributeName.trim().length === 0) {
            errorText['attributeName'] = t('componentData.FileMappingTool.attributeRequiredError');
            isValid = false;
        }
        if (customAttribute.attributeName.trim().length > 0) {
            const paymentRecord = selectedAttributeList.filter(x => x.id == parentId);
            const isExist = paymentRecord.length ? paymentRecord[0].childRecord.filter(x => x.fieldName.toLowerCase() === customAttribute.attributeName.trim().toLowerCase() && x.isDeleted != 1) : [];
            if (isExist.length > 0) {
                errorText['attributeName'] = t('componentData.FileMappingTool.attributeDuplicateError');
                isValid = false;
            }
        }
        if (customAttribute.dataType === "") {
            errorText['dataType'] = t('componentData.FileMappingTool.dataTypeRequiredError');
            isValid = false;
        }
        if (customAttribute.mandatory === "") {
            errorText['mandatory'] = t('componentData.FileMappingTool.mandatoryRequiredError');
            isValid = false;
        }
        if (customAttribute.minLength && customAttribute.maxLength) {
            if (customAttribute.minLength > customAttribute.maxLength) {
                errorText['minLength'] = t('componentData.FileMappingTool.minMaxError');
                isValid = false;
            }
        }
        setValidation(errorText);
        return isValid;
    }

    const onAddAttribute = () => {
        const isValid = validateAttribute();

        const selectedRecordList = selectedAttributeList.filter(x => x.id === parentId) || [];
        const childRecords = selectedRecordList.length > 0 ? selectedRecordList[0]['childRecord'] : [];
        const maxObject = childRecords.length > 0 ? childRecords.reduce(function (prev, current) {
            return (prev.index > current.index) ? prev : current
        }) : null;

        const dataTypeDisplayVal = dataTypeList.dataType.filter(x => x.dataTypeId == customAttribute.dataType);
        if (isValid) {
            const obj = {
                "clientAttributeId": null,
                "attributeId": null,
                "dataTypeId": Number(customAttribute.dataType),
                "dataTypeDisplay": dataTypeDisplayVal.length > 0 ? dataTypeDisplayVal[0].dataTypeDisplay : null,
                "attributeType": isPayee ? "V" : "P",
                "index": maxObject && maxObject.index ? maxObject.index + 1 : 1,
                "isMandatory": Number(customAttribute.mandatory),
                "fieldName": customAttribute.attributeName,
                "minLength": Number(customAttribute.minLength),
                "maxLength": Number(customAttribute.maxLength),
                "isChecked": Number(customAttribute.mandatory),
                "isDeleted": 0
            }
            if (isPayee) {
                dispatch(addCustomPayeeAttributes(obj, parentId));
            } else {
                dispatch(addCustomPaymentAttributes(obj, parentId));
            }
            setCustomAttribute({ attributeName: '', dataType: '', minLength: '', maxLength: '', mandatory: '' });
        }
    }

    let checkLimit = [];
    let objIndex = selectedAttributeList ? selectedAttributeList.findIndex(x => x.id === parentId) : -1;
    if (objIndex > -1) {
        checkLimit = selectedAttributeList[objIndex]['childRecord'].filter(x => x.attributeId == null && x.isDeleted != 1);
    }
    return (
        <Box pt={2} pb={2} pl={5}>
            <Typography className={classes.attributeLabel}>
                {t('componentData.FileMappingTool.limitAttributeText', { count: (entityType.attributeLimit - checkLimit.length), totalCount: entityType.attributeLimit })}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <TextField
                        fullWidth={true}
                        color="secondary"
                        autoComplete="off"
                        name="attributeName"
                        label={t('componentData.FileMappingTool.newAttributeLabel')}
                        variant="outlined"
                        value={customAttribute.attributeName || ''}
                        onChange={handleChange}
                        error={validation.attributeName && validation.attributeName.length > 0}
                        helperText={(validation && validation.attributeName) || ''}
                    />
                </Grid>
                <Grid item xs={2}>
                    <FormControl variant="outlined" className={classes.formControl} error={validation.dataType && validation.dataType.length > 0}>
                        <InputLabel htmlFor="outlined-dataType">{t('componentData.FileMappingTool.dataTypeLabel')}</InputLabel>
                        <Select
                            native
                            label={t('componentData.FileMappingTool.dataTypeLabel')}
                            value={customAttribute.dataType || ''}
                            onChange={handleChange}
                            inputProps={{
                                name: 'dataType',
                                id: 'outlined-dataType'
                            }}
                        >
                            <option aria-label="None" value="" />
                            {dataTypeList && dataTypeList.dataType && dataTypeList.dataType.map((s, index) => (
                                <option key={`${s['dataTypeDisplay']}_${index}`} value={s['dataTypeId']}>
                                    {s['dataTypeDisplay']}
                                </option>
                            ))}
                        </Select>
                        {validation && validation.dataType ? <FormHelperText>{validation.dataType}</FormHelperText> : ''}
                    </FormControl>
                </Grid>
                {(customAttribute.dataType == 4 || customAttribute.dataType == 6) ? null :
                    <>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth={false}
                                color="secondary"
                                autoComplete="off"
                                name="minLength"
                                label={t('componentData.FileMappingTool.minLengthLabel')}
                                variant="outlined"
                                value={customAttribute.minLength || ''}
                                onChange={handleChange}
                                inputProps={{
                                    maxLength: 10
                                }}
                                error={validation.minLength && validation.minLength.length > 0}
                                helperText={(validation && validation.minLength) || ''}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth={false}
                                color="secondary"
                                autoComplete="off"
                                name="maxLength"
                                label={t('componentData.FileMappingTool.maxLengthLabel')}
                                variant="outlined"
                                value={customAttribute.maxLength || ''}
                                onChange={handleChange}
                                inputProps={{
                                    maxLength: 10
                                }}
                            />
                        </Grid>
                    </>
                }
                <Grid item xs={3}>
                    <FormControl variant="outlined" className={classes.formControl} error={validation.mandatory && validation.mandatory.length > 0}>
                        <InputLabel htmlFor="outlined-mandatory">{t('componentData.FileMappingTool.mandatoryLabel')}</InputLabel>
                        <Select
                            native
                            label={t('componentData.FileMappingTool.mandatoryLabel')}
                            value={customAttribute.mandatory || ''}
                            onChange={handleChange}
                            inputProps={{
                                name: 'mandatory',
                                id: 'outlined-mandatory',
                            }}
                        >
                            <option aria-label="None" value="" />
                            {dataTypeList && dataTypeList.preference && dataTypeList.preference.map((s, index) => (
                                <option key={`${s['name']}_${index}`} value={s['value']}>
                                    {s['name']}
                                </option>
                            ))}
                        </Select>
                        {validation && validation.mandatory ? <FormHelperText>{validation.mandatory}</FormHelperText> : ''}
                    </FormControl>
                </Grid>
            </Grid>
            <Button fullWidth={false} variant="contained" color="primary"
                onClick={onAddAttribute}
                disabled={checkLimit.length >= entityType.attributeLimit}
                className={checkLimit.length >= entityType.attributeLimit ? classes.disableBtn : classes.enableBtn}
            >
                {t('componentData.FileMappingTool.addAttributeBtn')}
            </Button>
        </Box>
    )
}
export default withTranslation()(connect((state) => ({ ...state.paymentAttribute, ...state.payeeAttribute }))(
    withStyles(styles)(CustomAttribute)
));
