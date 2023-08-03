import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Typography, MenuItem, IconButton, FormControl, FormLabel, Radio, RadioGroup, FormControlLabel, Checkbox,
    Tooltip, Chip
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Autocomplete from '@material-ui/lab/Autocomplete';
import clsx from 'clsx';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import { styles } from '../../styles';
import { TextField } from "~/components/Forms";
import { VelocityPeriodType, TimeControlWeekDays } from '~/config/entityTypes';
import EditCustomParameter from '../CustomParameters/editCustomParameter';
import { getCountryCodeList } from "~/redux/actions/payments";
import CurrencyInput from "~/components/CurrencyInput";
import NumberFormat from 'react-number-format';

const useStyles = makeStyles({
    root: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
    icon: {
        borderRadius: 3,
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: '#FFF',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='DodgerBlue'/%3E%3C/svg%3E\")",
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#FFF',
        },
    },
});
const StyledCheckbox = (props) => {
    const classes = useStyles();

    return (
        <Checkbox
            className={classes.root}
            disableRipple
            color="default"
            checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
            icon={<span className={classes.icon} />}
            inputProps={{ 'aria-label': 'decorative checkbox' }}
            {...props}
        />
    );
}

const EditPaymentControl = (props) => {
    const [countryCodeList, setCountryCodeList] = useState([]);

    const { classes, t, modifyData, onChange, handleBlur, onAddVelocityControl, onDeleteVelocityControl, onCustomFieldChange, validation,
        onMultiSelectChange, onRadioChange, timeofDayLinkStatus, changeTimeofDayLink, validForType, onTimeofDayCheckChange, updateValidForType, timeZoneList } = props;

    const { spendVelocity, customReference, timeOfDayControl, multiUse, enableTransactionLimitControl, enableValidityPeriodControl,
        enableAgingVelocityControl, enableCurfewControl, enableMerchantIdControl, enableGeographyControl, enableAmountRangeControl } = modifyData;

    useEffect(() => {
        fetchCountryCodeList();
        setValidForTypeValue();
    }, []);

    const fetchCountryCodeList = async () => {
        const options = await getCountryCodeList();
        if (options && options.data) {
            setCountryCodeList(options.data);
        }
    }

    const setValidForTypeValue = () => {
        if (modifyData && modifyData.validFor && modifyData.validFor.length > 1) {
            const val = modifyData.validFor.charAt(modifyData.validFor.length - 1);
            updateValidForType(val);
        }
    }

    const countryCodeVal = modifyData && modifyData.geographyControlCountryCodes && countryCodeList.filter((el) => {
        return modifyData.geographyControlCountryCodes.split(',').some((f) => {
            return f === el.countryCodes;
        });
    }) || [];


    const validForValue = modifyData && modifyData.validFor && modifyData.validFor.length > 1 ?
        modifyData.validFor.substring(0, modifyData.validFor.length - 1) : modifyData.validFor || '';

    const curfewControlWeekdaysValue = modifyData && modifyData.curfewweekdaysEffective && TimeControlWeekDays.filter((el) => {
        return modifyData.curfewweekdaysEffective.split(',').some((f) => {
            return f === el.key;
        });
    }) || [];

    const spendVelocityArr = spendVelocity && spendVelocity.length ? spendVelocity.filter(x => x.enableSpendVelocityControl) : [];

    return (
        <Box>
            <Box className={classes.oddEvenBox}>
                <Grid item xs={12}>
                    <Box mb={2}>
                        <Typography className={classes.ccheading}>
                            {t('componentData.CCPaymentTransaction.overallSettings')}
                        </Typography>
                    </Box>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Autocomplete
                            id="edit-timezone-select"
                            options={timeZoneList}
                            disableClearable
                            getOptionLabel={(option) => option.utcTimezone}
                            value={modifyData && modifyData.timeZoneId && timeZoneList.find(x => x.timeZoneId === modifyData.timeZoneId) || {}}
                            onChange={(e, values) => onMultiSelectChange('timeZoneId', values)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('componentData.CCPaymentTransaction.timeZone')}
                                    placeholder={t('componentData.CCPaymentTransaction.timeZone')}
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    inputProps={{
                                        ...params.inputProps
                                    }}
                                    error={validation.timeZone && validation.timeZone.length > 0}
                                    helperText={validation.timeZone}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Box pt={3}>
                                    <Typography className={classes.keyLabel}>
                                        {t('componentData.CCPaymentTransaction.validFor')}:
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    select
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="validForType"
                                    label={t('componentData.CCPaymentTransaction.validForType')}
                                    variant="outlined"
                                    value={validForType}
                                    onChange={onChange}
                                >
                                    <MenuItem key="D" value="D">{t('componentData.CCPaymentTransaction.daysKey')}</MenuItem>
                                    <MenuItem key="M" value="M">{t('componentData.CCPaymentTransaction.monthKey')}</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="validFor"
                                    label={t('componentData.CCPaymentTransaction.value')}
                                    variant="outlined"
                                    value={validForValue}
                                    inputProps={{ maxLength: 3 }}
                                    onChange={onChange}
                                    error={validation.validFor && validation.validFor.length > 0}
                                    helperText={validation.validFor}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            {enableAmountRangeControl &&
                <Box className={classes.oddEvenBox}>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.exactAmountRangeControl')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <CurrencyInput
                                fullWidth={true}
                                color="secondary"
                                variant="outlined"
                                value={modifyData && modifyData.rangeControlminAmount || ''}
                                name="rangeControlminAmount"
                                label={t('componentData.CCPaymentTransaction.minTransactionAmount')}
                                onChange={onChange}
                                error={validation.rangeControlminAmount && validation.rangeControlminAmount.length > 0}
                                helperText={validation.rangeControlminAmount}
                                formatterProps={{ maxLength: 20 }} // $ 100,345,353,453.00 (including dollar($), space, comma, dot(.) and decimal)
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CurrencyInput
                                fullWidth={true}
                                color="secondary"
                                variant="outlined"
                                value={modifyData && modifyData.rangeControlmaxAmount || ''}
                                name="rangeControlmaxAmount"
                                label={t('componentData.CCPaymentTransaction.maxTransactionAmount')}
                                onChange={onChange}
                                error={validation.rangeControlmaxAmount && validation.rangeControlmaxAmount.length > 0}
                                helperText={validation.rangeControlmaxAmount}
                                formatterProps={{ maxLength: 20 }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            }

            {enableTransactionLimitControl &&
                <Box className={classes.oddEvenBox}>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.tranxLimit')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <CurrencyInput
                                fullWidth={true}
                                color="secondary"
                                variant="outlined"
                                value={modifyData && modifyData.transactionLimitAmountLimit || ''}
                                name="transactionLimitAmountLimit"
                                label={t('componentData.CCPaymentTransaction.maxSingleTranxAmt')}
                                onChange={onChange}
                                error={validation.transactionLimitAmountLimit && validation.transactionLimitAmountLimit.length > 0}
                                helperText={validation.transactionLimitAmountLimit}
                                formatterProps={{ maxLength: 20 }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            }

            {enableValidityPeriodControl &&
                <Box className={classes.oddEvenBox}>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.validityPeriodControl')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <NumberFormat
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                label={t('componentData.CCPaymentTransaction.fromDate')}
                                variant="outlined"
                                format="##/##/####"
                                id="validityStartDate"
                                name="validityStartDate"
                                placeholder={t('componentData.customTable.dateFormate')}
                                value={modifyData && modifyData.validityStartDate || ''}
                                onChange={(e) => onChange(e)}
                                mask={['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y']}
                                customInput={TextField}
                                onBlur={handleBlur}
                                error={validation.validityStartDate && validation.validityStartDate.length > 0}
                                helperText={validation.validityStartDate}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <NumberFormat
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                label={t('componentData.CCPaymentTransaction.toDate')}
                                variant="outlined"
                                format="##/##/####"
                                id="validityEndDate"
                                name="validityEndDate"
                                placeholder={t('componentData.customTable.dateFormate')}
                                value={modifyData && modifyData.validityEndDate || ''}
                                onChange={(e) => onChange(e)}
                                mask={['M', 'M', 'D', 'D', 'Y', 'Y', 'Y', 'Y']}
                                customInput={TextField}
                                onBlur={handleBlur}
                                error={validation.validityEndDate && validation.validityEndDate.length > 0}
                                helperText={validation.validityEndDate}
                                disabled={true} // FSINPAYB2B-14307
                            />
                        </Grid>
                    </Grid>
                </Box>
            }

            {spendVelocityArr && spendVelocityArr.length ?
                <Box className={classes.oddEvenBox}>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.velocityControl')}
                            </Typography>
                        </Box>
                    </Grid>
                    {spendVelocityArr.map((item, index) => {
                        const drpOptions = VelocityPeriodType.filter((t) => spendVelocityArr.every((item, ind) => item.periodType !== t.key || index === ind));
                        const periodTypeVal = item && item.periodType ? VelocityPeriodType.find(x => x.key == item.periodType) : '';
                        return (
                            <Grid container spacing={3} key={`spendVel-${index}`}>
                                <Grid item xs={3}>
                                    <TextField
                                        select
                                        fullWidth={true}
                                        color="secondary"
                                        autoComplete="off"
                                        name="periodType"
                                        label={t('componentData.CCPaymentTransaction.timePeriod')}
                                        variant="outlined"
                                        value={periodTypeVal && periodTypeVal.key || ''}
                                        onChange={(e) => onChange(e, index)}
                                    >
                                        {(multiUse ? drpOptions : VelocityPeriodType.filter(item => item.singleUse === true)).map((option, ind) =>
                                            <MenuItem key={ind} value={option.key}>
                                                {option.value}
                                            </MenuItem>
                                        )}
                                    </TextField>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth={true}
                                        color="secondary"
                                        autoComplete="off"
                                        name="maxAuth"
                                        label={t('componentData.CCPaymentTransaction.maximumTransactions')}
                                        variant="outlined"
                                        value={item && item.maxAuth || 0}
                                        inputProps={{ minLength: 1, maxLength: 4 }}
                                        onChange={(e) => onChange(e, index)}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <CurrencyInput
                                        fullWidth={true}
                                        color="secondary"
                                        variant="outlined"
                                        value={item && item.cumulativeSpendLimit || 0}
                                        name="cumulativeSpendLimit"
                                        label={t('componentData.CCPaymentTransaction.cumulativeLimit')}
                                        onChange={(e) => onChange(e, index)}
                                        formatterProps={{ maxLength: 20 }}
                                    />
                                </Grid>

                                <Grid item xs={1}>
                                    <Box display="flex">
                                        {index > 0 &&
                                            <Box pt={1}>
                                                <IconButton aria-label="delete" onClick={() => onDeleteVelocityControl(item, index)}>
                                                    <DeleteIcon color="primary" />
                                                </IconButton>
                                            </Box>
                                        }
                                        {index == (spendVelocityArr.length - 1) && multiUse &&
                                            <Box pt={1}>
                                                <Tooltip title={t('componentData.CCPaymentTransaction.addVelocityControlText',
                                                    { count: (5 - spendVelocityArr.length) })} aria-label="add">
                                                    <IconButton aria-label="delete" onClick={onAddVelocityControl} color="primary" disabled={spendVelocityArr.length >= 5}>
                                                        <AddCircleIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        }
                                    </Box>
                                </Grid>
                            </Grid>
                        )
                    })}
                </Box> : null
            }

            {enableAgingVelocityControl &&
                <Box className={classes.oddEvenBox}>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.agingVelocityControl')}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="agingVelocityAuthorizationHoldDays"
                                label={t('componentData.CCPaymentTransaction.authHoldDays')}
                                variant="outlined"
                                value={modifyData && modifyData.agingVelocityAuthorizationHoldDays || ''}
                                inputProps={{ minLength: 1, maxLength: 4 }}
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <CurrencyInput
                                fullWidth={true}
                                color="secondary"
                                variant="outlined"
                                value={modifyData && modifyData.agingVelocityCumulativeSpendLimit || 0}
                                name="agingVelocityCumulativeSpendLimit"
                                label={t('componentData.CCPaymentTransaction.cumulativeLimitAmt')}
                                onChange={onChange}
                                error={validation.agingVelocityCumulativeSpendLimit && validation.agingVelocityCumulativeSpendLimit.length > 0}
                                helperText={validation.agingVelocityCumulativeSpendLimit}
                                formatterProps={{ maxLength: 20 }}
                            />
                        </Grid>
                    </Grid>
                </Box>
            }

            {enableCurfewControl &&
                <Box className={classes.oddEvenBox}>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.curfewControl')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="curfewStartTime"
                                label={t('componentData.CCPaymentTransaction.fromTime')}
                                variant="outlined"
                                value={modifyData && modifyData.curfewStartTime || ''}
                                onChange={(e) => onChange(e)}
                                onBlur={handleBlur}
                                inputProps={{ maxLength: 5 }}
                                error={validation.curfewStartTime && validation.curfewStartTime.length > 0}
                                helperText={validation.curfewStartTime}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="curfewEndTime"
                                label={t('componentData.CCPaymentTransaction.toTime')}
                                variant="outlined"
                                value={modifyData && modifyData.curfewEndTime || ''}
                                onChange={(e) => onChange(e)}
                                onBlur={handleBlur}
                                inputProps={{ maxLength: 5 }}
                                error={validation.curfewEndTime && validation.curfewEndTime.length > 0}
                                helperText={validation.curfewEndTime}
                            />
                        </Grid>

                        <Grid item xs={3}>
                            <Box pt={1}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">{t('componentData.CCPaymentTransaction.daysSelection')}</FormLabel>
                                    <RadioGroup row aria-label="position" name="curfewDaysSelection" value={modifyData && modifyData.curfewDaysSelection} onChange={onRadioChange}>
                                        {/* <FormControlLabel value="allDays" control={<Radio color="secondary" size='small' />} label="All Days" /> */}
                                        <FormControlLabel value="3" control={<Radio color="secondary" size='small' />} label="Except" />
                                        <FormControlLabel value="2" control={<Radio color="secondary" size='small' />} label="Only On" />
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Grid>

                        <Grid item xs={5}>
                            <Autocomplete
                                multiple
                                value={curfewControlWeekdaysValue}
                                id="tags-outlined"
                                options={TimeControlWeekDays}
                                getOptionLabel={(option) => option.value}
                                onChange={(e, values) => onMultiSelectChange('curfewweekdaysEffective', values)}
                                filterSelectedOptions
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            variant="outlined"
                                            label={option.value}
                                            size="small"
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label="All Days"
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>
            }

            {timeOfDayControl && timeOfDayControl.length > 0 ?
                <Box className={classes.oddEvenBox}>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.timeofTheDayControl')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl component="fieldset">
                            <RadioGroup row aria-label="position" name="timeOfDaysSelection" value={modifyData && modifyData.timeOfDaysSelection} onChange={onRadioChange}>
                                <FormControlLabel value="1" control={<Radio color="secondary" size='small' />} label="All Days" />
                                <FormControlLabel value="3" control={<Radio color="secondary" size='small' />} label="Except" />
                                <FormControlLabel value="2" control={<Radio color="secondary" size='small' />} label="Only On" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    {TimeControlWeekDays.map((item, index) => {
                        const selectedVal = timeOfDayControl.find(x => x.weekdayEffective == item.key) || '';

                        return (
                            <Grid container spacing={2} key={`modify-time-${index}`}>
                                <Grid item xs={3} className={classes.VerticalTree}>
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <Box mx={0.5}>
                                                <FormControlLabel
                                                    value={selectedVal && selectedVal.weekdayEffective ? selectedVal.weekdayEffective : item.key}
                                                    control={<StyledCheckbox
                                                        onChange={(e) => onTimeofDayCheckChange(e, index)}
                                                    />}
                                                    label={item.value}
                                                    name={selectedVal.weekdayEffective ? selectedVal.weekdayEffective : item.key}
                                                    checked={selectedVal ? true : false}
                                                    labelPlacement="end"
                                                />
                                            </Box>
                                        </Grid>
                                        {!index > 0 ?
                                            <Grid item xs={2}>
                                                <Box pt={1}>
                                                    <Tooltip title={t('componentData.CCPaymentTransaction.linkTooltipText')} arrow placement="top" aria-label="add">
                                                        <IconButton aria-label="delete" size="small" onClick={changeTimeofDayLink}>
                                                            {timeofDayLinkStatus ?
                                                                <LinkIcon color="primary" />
                                                                :
                                                                <LinkOffIcon color="primary" />
                                                            }
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </Grid> : null
                                        }
                                    </Grid>
                                    {index != 6 && <div className={classes.verticalLineTB}></div>}
                                    {index != 0 && <div className={classes.verticalLineLR}></div>}
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth={true}
                                        size="small"
                                        color="secondary"
                                        autoComplete="off"
                                        name="startTimeControl"
                                        label={t('componentData.CCPaymentTransaction.startTime')}
                                        variant="outlined"
                                        disabled={!selectedVal}
                                        value={selectedVal && selectedVal.startTime || ''}
                                        onChange={(e) => onChange(e, index)}
                                        onBlur={(e) => handleBlur(e, index)}
                                        inputProps={{ maxLength: 5 }}
                                        error={selectedVal && validation.startTimeControl && validation.startTimeControl.length ?
                                            validation.startTimeControl.includes(index) : false}
                                        helperText={selectedVal && validation.startTimeControl && validation.startTimeControl.length && validation.startTimeControl.includes(index) ?
                                            validation.startTimeControlMsg : ''}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        fullWidth={true}
                                        size="small"
                                        color="secondary"
                                        autoComplete="off"
                                        name="endTimeControl"
                                        label={t('componentData.CCPaymentTransaction.endTime')}
                                        variant="outlined"
                                        disabled={!selectedVal}
                                        value={selectedVal && selectedVal.endTime || ''}
                                        onChange={(e) => onChange(e, index)}
                                        onBlur={(e) => handleBlur(e, index)}
                                        inputProps={{ maxLength: 5 }}
                                        error={selectedVal && validation.endTimeControl && validation.endTimeControl.length ? validation.endTimeControl.includes(index) : false}
                                        helperText={selectedVal && validation.endTimeControl && validation.endTimeControl.length && validation.endTimeControl.includes(index) ?
                                            validation.endTimeControlMsg : ''}
                                    />
                                </Grid>
                            </Grid>
                        )
                    })}
                </Box> : null
            }

            {enableMerchantIdControl &&
                <Box className={classes.oddEvenBox}>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.merchantIDControl')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="merchantIdControlMerchantId"
                                label={t('componentData.CCPaymentTransaction.merchantId')}
                                variant="outlined"
                                inputProps={{ maxLength: 15 }}
                                value={modifyData && modifyData.merchantIdControlMerchantId || ''}
                                onChange={onChange}
                                error={validation.merchantIdControlMerchantId && validation.merchantIdControlMerchantId.length > 0}
                                helperText={validation.merchantIdControlMerchantId}
                            //onBlur={handleBlur}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="merchantIdControlAcquirerId"
                                label={t('componentData.CCPaymentTransaction.acquirerId')}
                                variant="outlined"
                                inputProps={{ minLength: 1, maxLength: 6 }}
                                value={modifyData && modifyData.merchantIdControlAcquirerId || ''}
                                onChange={onChange}
                                error={validation.merchantIdControlAcquirerId && validation.merchantIdControlAcquirerId.length > 0}
                                helperText={validation.merchantIdControlAcquirerId}
                            //onBlur={handleBlur}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <Box display="flex">
                                {/* {index > 0 &&
                                <Box pt={1}>
                                    <IconButton aria-label="delete">
                                        <DeleteIcon color="primary" />
                                    </IconButton>
                                </Box>
                            } */}
                                {/* {index == (spendVelocity.length - 1) && */}
                                <Box pt={1}>
                                    {/* <Tooltip title="" aria-label="add">
                                    <IconButton aria-label="delete" color="primary">
                                        <AddCircleIcon />
                                    </IconButton>
                                </Tooltip> */}
                                </Box>
                                {/* } */}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            }

            {enableGeographyControl &&
                <Box className={classes.oddEvenBox}>
                    <Grid item xs={12}>
                        <Box mb={2}>
                            <Typography className={classes.ccheading}>
                                {t('componentData.CCPaymentTransaction.geographyControl')}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <FormControl component="fieldset">
                                <RadioGroup row aria-label="position" name="geographySelection" value={modifyData && modifyData.geographySelection} onChange={onRadioChange}>
                                    <FormControlLabel value="1" control={<Radio color="secondary" size='small' />} label={t('componentData.CCPaymentTransaction.allCountries')} />
                                    <FormControlLabel value="3" control={<Radio color="secondary" size='small' />} label={t('componentData.CCPaymentTransaction.exceptVal')} />
                                    <FormControlLabel value="2" control={<Radio color="secondary" size='small' />} label={t('componentData.CCPaymentTransaction.onlyOnVal')} />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Autocomplete
                                multiple
                                id="geography-tags"
                                value={countryCodeVal}
                                options={countryCodeList}
                                getOptionLabel={(option) => option.countryNames}
                                onChange={(e, values) => onMultiSelectChange('geographyControlCountryCodes', values)}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        label={t('componentData.CCPaymentTransaction.allCountries')}
                                        error={validation.geographyControlCountryCodes && validation.geographyControlCountryCodes.length > 0}
                                        helperText={validation.geographyControlCountryCodes}
                                    />
                                )}
                                disabled={modifyData && modifyData.geographySelection == "1"}
                            />
                        </Grid>
                    </Grid>
                </Box>
            }

            <Box className={classes.oddEvenBox}>
                <Grid item xs={12}>
                    <Box mb={2}>
                        <Typography className={classes.ccheading}>
                            {t('componentData.CCPaymentTransaction.customParameters')}
                        </Typography>
                    </Box>
                </Grid>
                <EditCustomParameter
                    customReference={customReference}
                    onChange={onCustomFieldChange}
                    validation={validation}
                />
            </Box>

        </Box>
    )
}
export default withTranslation()(withStyles(styles)(EditPaymentControl));
