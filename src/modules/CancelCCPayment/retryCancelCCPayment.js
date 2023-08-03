import React, { useState } from 'react';
import {
    Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography,
    Grid, Chip, Link, Divider, IconButton, Tooltip
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';

const customStyle = makeStyles((theme) => ({
    customDailog: {
        '& .MuiDialog-paperScrollPaper': {
            borderRadius: theme.spacing(2),
            width: 400
        }
    },
    reasonHelperTxt: {
        fontSize: 12,
        color: '#9E9E9E',
        display: 'list-item'
    },
    paymentChip: {
        fontSize: 12,
        background: '#F4F4F4',
        margin: '3px 4px',
        padding: '5px'
    },
    successPaymentChip: {
        fontSize: 12,
        background: '#E2F0ED',
        border: '1px solid #9E9E9E',
        margin: '3px 4px',
        padding: '5px'
    },
    checkedIcon: {
        color: '#33C3A4',
        fontSize: theme.spacing(3),
        marginRight: theme.spacing(1)
    },
    warnIcon: {
        color: '#ED8853',
        marginRight: theme.spacing(1)
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    linkIcon: {
        fontSize: "1rem",
        paddingLeft: "5px"
    }
}));

const RetryCancelCCPayment = (props) => {
    const customClasses = customStyle();
    const [showMsg, setShowMsg] = useState(false);
    const { openRetryCancelCCPaymentModal, openCancelCCModalChange, selectedPayment, paymentData,
        successCancelIds, openAgainCancelModal, cancelVCAResponse, bulkCancel, t, isDetailPage } = props;

    const handleClose = () => {
        openCancelCCModalChange();
        setShowMsg(false);
    }

    const retrySubmit = () => {
        openAgainCancelModal();
        setShowMsg(false);
    }

    const onLearnMoreClick = () => {
        setShowMsg(true);
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
    const successPaymentChip = paymentData && !isDetailPage ? paymentData.filter(item => successCancelIds.includes(item.PaymentID)) : [];
    const nonSuccessPaymentChip = paymentData && !isDetailPage ? paymentData.filter(item => selectedPayment.includes(item.PaymentID)) : [];

    return (
        <Dialog maxWidth={"xs"} open={openRetryCancelCCPaymentModal} onClose={handleClose} aria-labelledby="form-dialog-title" className={customClasses.customDailog}>
            <DialogTitle id="form-dialog-title">
                <IconButton aria-label="close" className={customClasses.closeButton} onClick={handleClose}>
                    <CloseIcon fontSize='small' />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {bulkCancel ? <>
                    {successPaymentChip.length ?
                        <Box pt={2}>
                            <Box pb={2}>
                                <Box display={"flex"} pb={1}>
                                    <CheckCircleOutlineIcon className={customClasses.checkedIcon} />
                                    <Typography>
                                        {t('componentData.CCPaymentTransaction.msg8')}
                                    </Typography>
                                </Box>
                                <Box>
                                    {successPaymentChip.map(item => (
                                        <Chip variant="outlined" size="small"
                                            label={renderChipLabel(item)}
                                            className={customClasses.successPaymentChip}
                                            disabled
                                        />
                                    ))}
                                </Box>
                            </Box>

                            <Box my={2}>
                                <Divider />
                            </Box>
                        </Box> : null
                    }
                    <Box pb={2} pt={1}>
                        <Box display={"flex"} pb={1}>
                            <InfoIcon className={customClasses.warnIcon} style={{ fontSize: 24 }} />

                            <Box component="span" display="flex">
                                <Typography component={"span"}>
                                    {t('componentData.CCPaymentTransaction.msg9')}
                                </Typography>
                                {!showMsg &&
                                    <Link
                                        component="button"
                                        variant="body2"
                                        color='secondary'
                                        onClick={onLearnMoreClick}
                                        className={customClasses.linkIcon}
                                        underline="always"
                                    >
                                        {t('componentData.CCPaymentTransaction.learnMoreBtn')}
                                    </Link>
                                }
                            </Box>
                        </Box>
                        <Box>
                            {!showMsg && nonSuccessPaymentChip.length ?
                                nonSuccessPaymentChip.map(item => (
                                    <Chip variant="outlined" size="small"
                                        label={renderChipLabel(item)}
                                        className={customClasses.paymentChip}
                                        disabled
                                    />
                                )) : null
                            }
                        </Box>
                    </Box>

                    <Box>
                        {showMsg ?
                            nonSuccessPaymentChip.length && cancelVCAResponse.length ? cancelVCAResponse.map(item => {
                                const { errors, paymentID } = item;
                                const index = nonSuccessPaymentChip.findIndex(x => x.PaymentID == paymentID);
                                return <Box my={1}>
                                    {`${nonSuccessPaymentChip[index]?.Amount}: ${errors.errorDescription}`}
                                </Box>
                            })
                                : null
                            : null
                        }
                    </Box>
                </>
                    :
                    <>
                        <Box textAlign={"center"} pb={2}>
                            <InfoIcon className={customClasses.warnIcon} />
                        </Box>
                        <Box>
                            {isDetailPage ?
                                cancelVCAResponse && cancelVCAResponse.length && cancelVCAResponse.map(item => {
                                    const { errors } = item;
                                    return (<>
                                        <Typography>
                                            {paymentData?.Amount ? `$ ${paymentData?.Amount}` : ''} {t('componentData.CCPaymentTransaction.msg10')}
                                        </Typography>
                                        <Typography>
                                            {errors?.errorCode ? `${errors.errorCode}: ` : ''}  {errors?.errorDescription || ''}
                                        </Typography>
                                    </>
                                    )
                                })
                                :
                                cancelVCAResponse && cancelVCAResponse.length && cancelVCAResponse.map(item => {
                                    const { errors, paymentID } = item;
                                    const index = paymentData.findIndex(x => x.PaymentID == paymentID);
                                    return (<>
                                        <Typography>
                                            {paymentData[index]?.Amount ? paymentData[index]?.Amount : paymentData[index]?.Amount || ''} {t('componentData.CCPaymentTransaction.msg10')}
                                        </Typography>
                                        <Typography>
                                            {errors.errorDescription}
                                        </Typography>
                                    </>
                                    )
                                })
                            }

                        </Box>
                    </>
                }
            </DialogContent>
            <DialogActions>
                <Grid container>
                    <Grid item xs={6}>
                        <Box textAlign={"center"} m={2}>
                            <Button onClick={handleClose} fullWidth variant="outlined" color="primary" style={{ fontSize: 14 }}>
                                {t('componentData.CCPaymentTransaction.noCancelBtn')}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box textAlign={"center"} m={2}>
                            <Button onClick={retrySubmit} fullWidth variant="contained" color="primary" style={{ fontSize: 14 }}>
                                {t('componentData.CCPaymentTransaction.retryCancel')}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    )
}
export default withTranslation()(RetryCancelCCPayment);
