import React, { Component } from 'react';
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import {
    Box, TextField, Select, ListItemSecondaryAction, Tooltip, FormControl,
    InputLabel
} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import { updateCustomPaymentAttributes, setPaymentEditId } from "~/redux/actions/paymentAttribute";
import { updateCustomPayeeAttributes, setPayeeEditId } from "~/redux/actions/payeeAttribute";
import { entityType } from '~/config/entityTypes';

class EditView extends Component {
    state = {
        name: '', dataType: "", preference: "", minLength: '', maxLength: '', validation: {}
    };

    componentDidMount() {
        const { item } = this.props;
        this.setState({
            fieldName: item.fieldName,
            dataTypeId: item.dataTypeId,
            isMandatory: item.isMandatory,
            minLength: item.minLength,
            maxLength: item.maxLength
        });
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        if (name == "minLength" || name == "maxLength") {
            value = Number(value);
        }
        this.setState({ [name]: value });
        if (name == "dataTypeId" && value == 4 || value == 6) {
            this.setState({ maxLength: 0, minLength: 0 })
        }
    }

    handleValidate = () => {
        const errorText = {}
        let isValid = true;
        const { t } = this.props;
        const { fieldName, dataTypeId, isMandatory, minLength, maxLength } = this.state;

        if (fieldName.trim().length === 0) {
            errorText['fieldName'] = t('componentData.FileMappingTool.attributeRequiredError');
            isValid = false;
        }
        if (dataTypeId === "") {
            errorText['dataTypeId'] = t('componentData.FileMappingTool.dataTypeRequiredError');
            isValid = false;
        }
        if (isMandatory === "") {
            errorText['isMandatory'] = t('componentData.FileMappingTool.mandatoryRequiredError');
            isValid = false;
        }
        if (minLength && maxLength) {
            if (minLength > maxLength) {
                errorText['minLength'] = t('componentData.FileMappingTool.minMaxError');
                isValid = false;
            }
        }
        this.setState({ validation: errorText });
        return isValid;
    }

    onSave = () => {
        const { item, dispatch, paymentAttribute, isPayee } = this.props;
        const { dataTypeList } = paymentAttribute;
        const { fieldName, dataTypeId, isMandatory, minLength, maxLength } = this.state;
        const isValid = this.handleValidate();
        const dataTypeDisplayVal = dataTypeList.dataType.filter(x => x.dataTypeId == dataTypeId);
        if (isValid) {
            let p1 = { ...item };
            p1.dataTypeId = Number(dataTypeId);
            p1.dataTypeDisplay = dataTypeDisplayVal.length > 0 ? dataTypeDisplayVal[0].dataTypeDisplay : null;
            p1.isMandatory = Number(isMandatory);
            p1.fieldName = fieldName;
            p1.minLength = Number(minLength);
            p1.maxLength = Number(maxLength);

            p1.isChecked = Number(isMandatory);

            if (isPayee) {
                dispatch(updateCustomPayeeAttributes(p1, entityType.PayeeCustomParameterRecord));
                dispatch(setPayeeEditId(null));
            } else {
                dispatch(updateCustomPaymentAttributes(p1, entityType.PaymentRecordDetail));
                dispatch(setPaymentEditId(null));
            }
        }
    }

    onCancelEdit = () => {
        const { dispatch } = this.props;
        dispatch(setPaymentEditId(null));
        /*if (isPayee) {
            dispatch(setPaymentEditId(null));
        } else {
            dispatch(setPaymentEditId(null));
        }*/
    }

    render() {
        const { t, paymentAttribute } = this.props;
        const { dataTypeList } = paymentAttribute;
        const { dataTypeId, isMandatory, validation, minLength, maxLength } = this.state;

        return (
            <>
                <Box width={165} pl={2} pr={2}>
                    <FormControl variant="outlined" size="small">
                        <InputLabel htmlFor="outlined-dataTypeId">{t('componentData.FileMappingTool.dataTypeLabel')}</InputLabel>
                        <Select
                            native
                            value={dataTypeId}
                            onChange={this.handleChange}
                            label={t('componentData.FileMappingTool.dataTypeLabel')}
                            inputProps={{
                                name: 'dataTypeId',
                                id: 'outlined-dataTypeId'
                            }}
                        >
                            {dataTypeList && dataTypeList.dataType && dataTypeList.dataType.map((s, index) => (
                                <option key={`${s['dataTypeDisplay']}_${index}`} value={s['dataTypeId']}>
                                    {s['dataTypeDisplay']}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box width={160} pl={2} pr={2}>
                    {dataTypeId == 4 || dataTypeId == 6 ? null :
                        <TextField size="small" variant="outlined"
                            name="minLength"
                            label={t('componentData.FileMappingTool.minLengthLabel')}
                            value={minLength}
                            onChange={this.handleChange}
                            error={validation.minLength && validation.minLength.length > 0}
                            helperText={validation && validation.minLength || ''}
                        />}
                </Box>
                <Box width={160} pl={2} pr={2}>
                    {dataTypeId == 4 || dataTypeId == 6 ? null :
                        <TextField size="small" variant="outlined"
                            name="maxLength"
                            label={t('componentData.FileMappingTool.maxLengthLabel')}
                            value={maxLength}
                            onChange={this.handleChange}
                        />}
                </Box>

                <Box width={180} pl={2} pr={2}>
                    <FormControl variant="outlined" size="small">
                        <InputLabel htmlFor="outlined-isMandatory">{t('componentData.FileMappingTool.mandatoryLabel')}</InputLabel>
                        <Select
                            native
                            value={isMandatory}
                            onChange={this.handleChange}
                            label={t('componentData.FileMappingTool.mandatoryLabel')}
                            inputProps={{
                                name: 'isMandatory',
                                id: 'outlined-isMandatory'
                            }}
                        >
                            {dataTypeList && dataTypeList.preference && dataTypeList.preference.map((s, index) => (
                                <option key={`${s['name']}_${index}`} value={s['value']}>
                                    {s['name']}
                                </option>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box>
                    <ListItemSecondaryAction style={{ position: 'inherit', paddingTop: 30 }}>
                        <Tooltip title={t('componentData.FileMappingTool.cancelTooltip')}>
                            <IconButton aria-label="cancel" size="small">
                                <CloseIcon fontSize="inherit" color="primary" onClick={this.onCancelEdit} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('componentData.FileMappingTool.saveTooltip')}>
                            <IconButton aria-label="save" size="small">
                                <DoneIcon fontSize="inherit" color="primary" onClick={this.onSave} />
                            </IconButton>
                        </Tooltip>
                    </ListItemSecondaryAction>
                </Box>
            </>
        )
    }
}
export default withTranslation()(connect((state) => ({ ...state.paymentAttribute }))(EditView));
