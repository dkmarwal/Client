import React, { useState } from 'react';
import {
    Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography,
    Grid, Chip, IconButton, CircularProgress, Tooltip
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import BlockIcon from '@material-ui/icons/Block';
import CloseIcon from '@material-ui/icons/Close';
import { TextField } from "~/components/Forms";

const customStyle = makeStyles((theme) => ({
    customDailog: {
        '& .MuiDialog-paperScrollPaper': {
            borderRadius: theme.spacing(2)
        }
    },
    reasonHelperTxt: {
        fontSize: 12,
        color: '#9E9E9E',
        display: 'list-item',
        fontStyle: 'italic'
    },
    paymentChip: {
        fontSize: 12,
        color: '#9E9E9E',
        background: '#F4F4F4',
        margin: '3px 0'
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
}));

const CancelCCPayment = (props) => {
    const { openCancelCCPaymentModal, singleCardRow, openCancelCCModalChange, onCancelCCPayment, bulkCancel,
        paymentData, selectedPayment, t, loading, removeSelectedPayment } = props;
    const [cancelReason, setCancelReason] = useState(null);
    const [error, setError] = useState(null);
    const customClasses = customStyle();

    const handleClose = () => {
        openCancelCCModalChange();
    }
    const handleSubmit = () => {
        if (cancelReason) {
            onCancelCCPayment(cancelReason);
            setCancelReason(null);
        } else {
            setError(t('componentData.CCPaymentTransaction.cancelReasonErr'));
        }
    }
    const handleChange = (e) => {
        const { value } = e.target;
        setCancelReason(value)
    }

    const renderChipLabel = (item) => {
        const amount = item.Amount ? `${item.Amount}` : '';
        const name = item.PayeeName ? item.PayeeName.length > 10 ? ` | ${item.PayeeName.slice(0, 10)}...` : ` | ${item.PayeeName}` : '';

        return (
            <Tooltip title={`${amount}${item.PayeeName ? ` | ${item.PayeeName}` : ''}`} placement='top' arrow>
                <Box>
                    <span>{amount}</span>
                    <span>{name}</span>
                </Box>
            </Tooltip>
        )
    }

    const showSelectedChip = bulkCancel ? paymentData.filter(item => selectedPayment.includes(item.PaymentID)) : [];

    return (
        <Dialog maxWidth={"xs"} open={openCancelCCPaymentModal} onClose={handleClose} aria-labelledby="form-dialog-title" className={customClasses.customDailog}>
            <DialogTitle id="form-dialog-title">
                <IconButton aria-label="close" className={customClasses.closeButton} onClick={handleClose}>
                    <CloseIcon fontSize='small' />
                </IconButton>
                {bulkCancel ?
                    <Box pt={4} textAlign="center">
                        <Box>
                            <BlockIcon color='primary' />
                        </Box>
                        <Box color='#4C4C4C'>
                            <Typography>
                                {`${t('componentData.CCPaymentTransaction.msg1')} ${selectedPayment.length} 
                                    ${t('componentData.CCPaymentTransaction.msg2')}`}
                            </Typography>
                            <Typography>
                                {t('componentData.CCPaymentTransaction.msg3')}
                            </Typography>
                        </Box>
                    </Box>
                    :
                    <Grid>
                        <Box textAlign={"center"}>
                            <Box my={2}>
                                <BlockIcon color='primary' />
                            </Box>
                            <Box mx={1} color='#4C4C4C'>
                                <Typography>
                                    {`${t('componentData.CCPaymentTransaction.msg4')} ${singleCardRow &&
                                        singleCardRow.Amount ? singleCardRow.Amount.includes('$') ? singleCardRow.Amount : `$ ${singleCardRow.Amount}` : ''}?`}
                                </Typography>
                                <Typography>
                                    {`${singleCardRow && singleCardRow.PayeeName} ${t('componentData.CCPaymentTransaction.msg5')}`}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                }
                <Grid item>
                    {bulkCancel ?
                        <Box pt={2}>
                            {showSelectedChip.length ?
                                showSelectedChip.map((item, index) => (
                                    <Box component={"span"} mx={0.5} key={`payment-${index}`}>
                                        <Chip variant="outlined" size="small"
                                            label={renderChipLabel(item)}
                                            className={customClasses.paymentChip}
                                            //disabled
                                            deleteIcon={<CloseIcon />}
                                            onDelete={() => removeSelectedPayment(item.PaymentID)}
                                        />
                                    </Box>
                                )) : null}
                        </Box>
                        : null
                    }
                </Grid>
            </DialogTitle>
            <DialogContent>
                <Typography style={{ color: '#4C4C4C' }}>
                    {t('componentData.CCPaymentTransaction.cancelReason')}
                </Typography>
                <Grid item xs={12}>
                    <TextField
                        fullWidth={true}
                        variant='outlined'
                        label={t('componentData.CCPaymentTransaction.placeholderCancelReason')}
                        value={cancelReason}
                        onChange={handleChange}
                        inputProps={{ maxLength: 255 }}
                        InputLabelProps={{ shrink: true }}
                        error={Boolean(error)}
                        helperText={error}
                    />
                </Grid>
                {bulkCancel ?
                    <Box pl={2}>
                        <Typography variant='caption' className={customClasses.reasonHelperTxt}>
                            {t('componentData.CCPaymentTransaction.msg6')}
                        </Typography>
                        <Typography variant='caption' className={customClasses.reasonHelperTxt}>
                            {t('componentData.CCPaymentTransaction.msg7')}
                        </Typography>
                    </Box> : null
                }
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item xs={6}>
                        <Box textAlign={"center"} m={2}>
                            <Button onClick={handleClose} fullWidth size="small" variant="outlined" color="primary">
                                {t('componentData.CCPaymentTransaction.no')}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box textAlign={"center"} m={2}>
                            {loading ?
                                <CircularProgress size={"2rem"} color="primary" />
                                :
                                <Button onClick={handleSubmit} fullWidth size="small" variant="contained" color="primary">
                                    {t('componentData.CCPaymentTransaction.yes')}
                                </Button>
                            }
                        </Box>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}
export default withTranslation()(CancelCCPayment);
