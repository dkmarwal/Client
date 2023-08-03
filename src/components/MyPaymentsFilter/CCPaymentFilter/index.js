import React, { useState } from 'react';
import {
    Grid, Box, Button, RadioGroup, Radio, FormControlLabel, Accordion,
    AccordionSummary, Typography, AccordionDetails, Divider
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../styles';
import { TextField } from '~/components/Forms';
import { withTranslation } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const CCPaymentFilter = (props) => {
    const { t, classes, vCardAliasList, dataFilterParams, updateCCFilter, resetUpdateFilter } = props;

    const [filter, setFilter] = useState({
        PaymentID: dataFilterParams.PaymentID || '',
        FileID: dataFilterParams.FileID || 0,
        VCardAlias: dataFilterParams.VCardAlias || '',
        vCardUsageTypes: dataFilterParams.vCardUsageTypes || null,
        cardExpirationDays: dataFilterParams.cardExpirationDays || 0
    });

    const onChangeFilter = (event) => {
        let { name, value } = event.target;
        // if (['FileID'].includes(name) || ['PaymentID'].includes(name)) {
        //     value = !isNaN(parseInt(value)) ? parseInt(value) : 0;
        // }

        switch (name) {
            case 'PaymentID':
            case 'FileID':
            case 'cardExpirationDays':
                value = value.replace(/[^0-9]/g, '');
                break;
        }
        setFilter({
            ...filter,
            [name]: value
        });
    };

    const onVCardAliasChange = (e, values) => {
        if (values) {
            setFilter({
                ...filter,
                VCardAlias: values.map(x => x.fundingSourceName).join(',')
            });
        }
    }

    const handleBlur = (event) => {
        const { name, value } = event.target;
        setFilter({
            ...filter,
            [name]: value ? value.trim() : null
        });
    };

    const applyFilter = () => {
        const updateFilterObj = Object.keys(filter).reduce((obj, key) => {
            if (Boolean(filter[key])) {
                obj[key] = filter[key];
            }
            return obj;
        }, {});
        updateCCFilter(updateFilterObj);
    };

    const resetFilter = () => {
        setFilter({
            PaymentID: null,
            DebitAccountID: 0,
            FileID: undefined,
            VCardAlias: undefined,
            vCardUsageTypes: null,
            cardExpirationDays: 0
        });
        resetUpdateFilter({
            PaymentID: null,
            DebitAccountID: 0,
            FileID: undefined,
            VCardAlias: undefined,
            vCardUsageTypes: null,
            cardExpirationDays: 0
        });
    };

    const { PaymentID, FileID, VCardAlias, vCardUsageTypes, cardExpirationDays } = filter;
    const vCardAliasValue = vCardAliasList ? vCardAliasList.filter(x => VCardAlias &&
        VCardAlias.split(',').includes(x.fundingSourceName)) : [];

    return (
        <Grid className={classes.filterAccordion}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography className={classes.accHeading}>{t('componentData.CCpaymentFilter.accord1')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container className={classes.bottomPadd} spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="PaymentID"
                                label={t('componentData.CCpaymentFilter.paymentId')}
                                variant="outlined"
                                value={PaymentID || ''}
                                onChange={onChangeFilter}
                                onBlur={handleBlur}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="FileID"
                                label={t('componentData.CCpaymentFilter.fileId')}
                                variant="outlined"
                                value={FileID || ''}
                                onChange={onChangeFilter}
                            />
                        </Grid>

                        {/* <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="Program Name"
                                variant="outlined"
                                //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                                onChange={onChangeFilter}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="Purchase ID"
                                variant="outlined"
                                //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                                onChange={onChangeFilter}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="Real Card Number"
                                variant="outlined"
                                //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                                onChange={onChangeFilter}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="VCN (Last 4 Digits)"
                                variant="outlined"
                                //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                                onChange={onChangeFilter}
                            />
                        </Grid> */}

                        <Grid item xs={12}>
                            <Autocomplete
                                id="VCardAlias"
                                multiple={true}
                                options={vCardAliasList}
                                disableClearable
                                filterSelectedOptions
                                getOptionLabel={(option) => option.fundingSourceName}
                                value={vCardAliasValue || []}
                                onChange={(e, values) => {
                                    onVCardAliasChange(e, values)
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={t('componentData.CCpaymentFilter.VCardAlias')}
                                        placeholder={!vCardAliasValue.length ? t('componentData.CCpaymentFilter.selectVCardAlias') : ''}
                                        InputLabelProps={{ shrink: true }}
                                        variant="outlined"
                                        name="alsk"
                                        inputProps={{
                                            ...params.inputProps
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                >
                    <Typography className={classes.accHeading}>{t('componentData.CCpaymentFilter.accord2')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2} className={classes.bottomPadd}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="Min Balance"
                                variant="outlined"
                            //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                            //onChange={onChangeFilter}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="Max Balance"
                                variant="outlined"
                            //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                            //onChange={onChangeFilter}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion> */}

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3-content"
                    id="panel3-header"
                >
                    <Typography className={classes.accHeading}>{t('componentData.CCpaymentFilter.accord3')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container className={classes.bottomPadd}>
                        {/* <Grid item xs={12}>
                            <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                <FormControlLabel className={classes.accRadio} value="end" control={<Radio color="primary" size='small' />} label="Validity End Date" />
                                <FormControlLabel className={classes.accRadio} value="end" control={<Radio color="primary" size='small' />} label="Days Until Expiration" />
                            </RadioGroup>
                        </Grid> */}
                        <Grid item>
                            <Typography className={classes.accHeading}>{t('componentData.CCpaymentFilter.dayExpiration')}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="cardExpirationDays"
                                label={t('componentData.CCpaymentFilter.noofDay')}
                                variant="outlined"
                                value={cardExpirationDays || ''}
                                onChange={onChangeFilter}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel4-content"
                    id="panel4-header"
                >
                    <Typography className={classes.accHeading}>{t('componentData.CCpaymentFilter.accord4')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container className={classes.bottomPadd}>
                        {/* <Grid item xs={12}>
                            <Box pb={1}>
                                <Typography className={classes.accHeading}>Card Spent Status</Typography>
                                <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                    <FormControlLabel className={classes.accRadio} value="end" control={<Radio color="secondary" size='small' />} label="Paid" />
                                    <FormControlLabel className={classes.accRadio} value="end" control={<Radio color="secondary" size='small' />} label="Partially Paid" />
                                    <FormControlLabel className={classes.accRadio} value="end" control={<Radio color="secondary" size='small' />} label="Both" />
                                </RadioGroup>
                            </Box>
                        </Grid> */}

                        <Grid item xs={12}>
                            <Typography className={classes.accHeading}>{t('componentData.CCpaymentFilter.cardUsage')}</Typography>
                            <RadioGroup row aria-label="vCardUsageTypes" name="vCardUsageTypes" defaultValue="2" onChange={onChangeFilter} value={vCardUsageTypes}>
                                <FormControlLabel className={classes.accRadio} value="0" control={<Radio color="secondary" size='small' />} label={t('componentData.CCpaymentFilter.singleUse')} />
                                <FormControlLabel className={classes.accRadio} value="1" control={<Radio color="secondary" size='small' />} label={t('componentData.CCpaymentFilter.multiUse')} />
                                <FormControlLabel className={classes.accRadio} value="2" control={<Radio color="secondary" size='small' />} label={t('componentData.CCpaymentFilter.both')} />
                            </RadioGroup>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            {/* <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel5-content"
                    id="panel5-header"
                >
                    <Typography className={classes.accHeading}>{t('componentData.CCpaymentFilter.accord5')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2} className={classes.bottomPadd}>
                        <Grid item xs={6}>
                            <TextField
                                select
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="Custom Data Field"
                                variant="outlined"
                            //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                            //onChange={onChangeFilter}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="Search"
                                variant="outlined"
                            //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                            //onChange={onChangeFilter}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion> */}

            {/* <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel6-content"
                    id="panel6-header"
                >
                    <Typography className={classes.accHeading}>{t('componentData.CCpaymentFilter.accord6')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container className={classes.bottomPadd}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="PO Number"
                                variant="outlined"
                            //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                            //onChange={onChangeFilter}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="Invoice Number"
                                variant="outlined"
                            //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                            //onChange={onChangeFilter}
                            />
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="invoiceAmount"
                                    label="From Invoice Date"
                                    variant="outlined"
                                //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                                //onChange={onChangeFilter}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="invoiceAmount"
                                    label="To Invoice Date"
                                    variant="outlined"
                                //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                                //onChange={onChangeFilter}
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="invoiceAmount"
                                label="Invoice Currency"
                                variant="outlined"
                            //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                            //onChange={onChangeFilter}
                            />
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="invoiceAmount"
                                    label="Min Amount"
                                    variant="outlined"
                                //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                                //onChange={onChangeFilter}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth={true}
                                    color="secondary"
                                    autoComplete="off"
                                    name="invoiceAmount"
                                    label="Max Amount"
                                    variant="outlined"
                                //value={(invoiceAmount === 0 ? '' : invoiceAmount) || ''}
                                //onChange={onChangeFilter}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion> */}

            <Grid item xs={12}>
                <Box my={2}>
                    <Typography className={classes.helperText}>
                        {t('componentData.CCpaymentFilter.noteTxt')}
                    </Typography>
                </Box>
                <Divider />
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Box mt={3}>
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.btnScpace}
                            style={{ width: '100%' }}
                            onClick={resetFilter}
                        >
                            {t('componentData.SmallTxt.resetFilter')}
                        </Button>
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Box mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ width: '100%' }}
                            className={classes.btnScpace}
                            onClick={applyFilter}
                        >
                            {t('componentData.SmallTxt.applyFilter')}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    )
}
export default withTranslation()(withStyles(styles)(CCPaymentFilter));
