import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button  } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import CurrencyFlag from 'react-currency-flags';
import Autocomplete from '@material-ui/lab/Autocomplete';

import MasterCard_Image from "~/assets/images/cc_mastercard.svg";
import Cancelled_Image from "~/assets/images/cc_cancelled.svg";
import { TextField } from "~/components/Forms";
import { styles } from '../../styles';
import CardSteppers from '~/components/Stepper/Cards/Stepper';
import DetailsInfo from './detailsInfo';
import { emailLimit, CardActivityTrailConst } from '~/config/entityTypes';
import IconButton from "@material-ui/core/IconButton";
import GetAppIcon from '@material-ui/icons/GetApp';
import { accessRights } from '~/config/accessRights';
import { downloadRemittanceFile } from '~/redux/helpers/files';
import * as FileSaver from 'file-saver';
import { SnackbarComponent } from '~/components/Notification/snackbar';

import {
    getCCEnrolledPayees,
    updateCCPayeeName    
} from '~/redux/helpers/clientPaymentTransactions';
import WarningIcon from '@material-ui/icons/Warning';


const ExpireOrCancelCard = [15, 16];

const CardDetails = (props) => {
    const { classes, t, cardData, ccPaymentTrackingDetail, ccActiveTrackingStep,
        selectedPayeeRemitToId, b2bPaymentData, isEditMode, onChange, modifyData, validation, claims,businessType, } = props;

    const [state, setState] = useState({
        openPayeePopup: false,
        payeeList: [],
        selectedPayee: null,
        selectedPayeeObj: null,
        openPayeeConfirmModal: false,
        willPayeeUpdate: false,
        payeeName: '',
        payeeID: ''
    })

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState(null);
    const [snackbarMessageType, setSnackbarMessageType] = React.useState('');

    useEffect(()=>{
        getPayeeListFromAPI()
    }, [b2bPaymentData])


    const getPayeeListFromAPI= async ()=>{
        const APIRes = await getCCEnrolledPayees();         
        const data = APIRes?.data?.rows ?? [];
        const itemIndex = data?.findIndex(item => item?.payeeId === b2bPaymentData?.RemitTo); 

        if(Object.keys(b2bPaymentData).length > 0 && Object.keys(data).length > 0){
            setState({
                ...state,
                payeeList : data,
                payeeName: b2bPaymentData?.PayeeName ?? '',
                payeeID: b2bPaymentData?.RemitTo ?? '',
                willPayeeUpdate: b2bPaymentData?.ReturnStatusID === CardActivityTrailConst?.EXCEPTION
                                ? false
                                : b2bPaymentData?.ReturnStatusID === CardActivityTrailConst?.CREATIONFAILED
                                    ? false
                                    : !Boolean(b2bPaymentData?.RemitTo) 
                                        ?  true
                                        : itemIndex === -1
                                            ? true
                                            : false
            })
        }
        else{
            setState({
                ...state,                
                payeeName: b2bPaymentData?.PayeeName ?? '',
                payeeID: b2bPaymentData?.PayeeID ?? ''                
            })   
        }
    }       
        
       
        
    const downLoadRemittanceFile = async (paymentId, clientId, flag, isRRD) => {
        downloadRemittanceFile(paymentId, clientId, flag, isRRD, businessType).then((response) => {
                if (response && response.status === 200) {
                    const fileName = `${response.headers['x-file-name']}`;
                    const type = response.headers['content-type'];
                    const data = new Blob([response.data], {
                        type: type,
                        encoding: 'UTF-8',
                    });
                    FileSaver.saveAs(data, fileName);
                    setSnackbarMessage(
                    response.message ||
                    t('componentData.paymentTransDetail.downloadSuccess'));
                    setSnackbarMessageType('success');
                    setOpenSnackbar(true);
                } else {
                    setSnackbarMessage(
                    (response && response.message) ||
                    t('componentData.paymentTransDetail.fileNotFound'));
                    setSnackbarMessageType('error');
                    setOpenSnackbar(true);
                }
            })
            .catch((error) => {
                setSnackbarMessage(t('componentData.paymentTransDetail.fileNotFound'));
                setSnackbarMessageType('error');
                setOpenSnackbar(true);
            }
        );
    };

    const formatCardDate = (date) => {
        if (date) {
            const regexpExpiry = /^(?<month>0[1-9]|1[0-2])(?<year>[0-9]+)$/;
            const match = regexpExpiry.exec(date);
            return `${match.groups.month}/${match.groups.year.substring(2)}`;
        }
    }

    const routeToPayee = () => {        
        props.history.push({
            pathname: "/suppliers/mySupplier",
            state: {
                selectedPayeeRemitToId: selectedPayeeRemitToId
            }
        })
    }

    const handlePayeeConfrimPopup = async()=>{        
        const {ClientID, PaymentID} = b2bPaymentData;
        const id = state.selectedPayeeObj?.payeeId ?? null;
        const resp = await updateCCPayeeName(PaymentID, ClientID, id);
        if(resp?.result ?? false){
            setState({
                ...state,
                openPayeeConfirmModal: false,
                payeeName: state.selectedPayeeObj?.payeeName ?? '',
                payeeID: state.selectedPayeeObj?.payeeId ?? '',
                willPayeeUpdate: false
            })
        }
    }   
        
    const handleClose = () => {
        setOpenSnackbar(false);
        setSnackbarMessage(null);
        setSnackbarMessageType('');
    };

    const beneficiaryEmails = modifyData && modifyData.paymentBeneficiaryEmails && modifyData.paymentBeneficiaryEmails.split(';') || '';

    const isCancelOrExpiredCard = b2bPaymentData && ExpireOrCancelCard.includes(b2bPaymentData.ReturnStatusID) || false;

    const isPaymentRemittanceDownloadEnabled = (claims && claims.includes(accessRights['PAYMENTS_REMITTANCES_DOWNLOAD'])) || false;
    
    const isCreationFailedOrExceptionCard = b2bPaymentData && [CardActivityTrailConst.EXCEPTION, CardActivityTrailConst.CREATIONFAILED].includes(b2bPaymentData.ReturnStatusID) || false;

    return (
        <Grid container>
            <Grid item xs={12}>

                <Box
                    ml={3}
                    p={2}                    
                    style={{
                        border: '1px solid #9E9E9E',
                        borderRadius: '10px',
                        width: '59%',
                        float: 'left',
                        height: 100
                    }}
                >
                    {cardData?.length > 0 && cardData[0]?.availableBalance && (
                        <Box 
                            style={{ 
                                justifyContent: "center", 
                                width: b2bPaymentData?.Amount ? '45%' : '100%',
                                float: 'left'                                
                            }}
                        >
                            <Box>
                                <Typography 
                                    variant='h4'
                                    style={{
                                        display: 'inline-block',
                                        fontWeight: '400',
                                        fontSize: '14px',
                                        color: '#4C4C4C',
                                        margin: '0 0 10px'
                                    }}
                                >
                                    {t('componentData.CCPaymentTransaction.AvailableBalance')}
                                </Typography>                                
                            </Box>
                            <Box>
                                <Box 
                                    pr={1} 
                                    style={{float: 'left', margin: '3px 0 0'}}
                                >
                                    <CurrencyFlag
                                        style={{
                                            height: '25px',
                                            width: '25px',
                                            borderRadius: '50%',
                                            verticalAlign: 'middle'
                                        }}
                                        currency={b2bPaymentData?.CurrencyCode ?? 'USD'}
                                    />
                                </Box>
                                <Typography 
                                    className={classes.bigText}
                                    style={{float: 'left', margin: 0}}
                                >
                                    {cardData[0]?.availableBalance ?? '$ 0'}
                                </Typography>
                            </Box>
                        </Box>
                    )}   

                    {cardData?.length > 0 && cardData[0]?.availableBalance && b2bPaymentData?.Amount && (
                        <Box
                            style={{
                                float: 'left',
                                borderLeft: '1px solid #9E9E9E',
                                height: '67px',
                                margin: '0 25px'
                            }}
                        >                        
                        </Box>
                    )}                                 

                    {Boolean(b2bPaymentData?.Amount ?? false) && (
                        <Box 
                            style={{ 
                                justifyContent: "center",                                 
                                width: cardData?.length > 0 && cardData[0]?.availableBalance ? '45%' : '100%',
                                float: 'left'                                  
                            }}
                        >
                            <Box>
                                <Typography 
                                    variant='h4'
                                    style={{
                                        display: 'inline-block',
                                        fontWeight: '400',
                                        fontSize: '14px',
                                        color: '#4C4C4C',
                                        margin: '0 0 10px'
                                    }}
                                >
                                    {t('componentData.CCPaymentTransaction.CardValue')}
                                </Typography>                                
                            </Box>
                            <Box>
                                <Box 
                                    pr={1} 
                                    style={{float: 'left', margin: '3px 0 0'}}
                                >
                                    <CurrencyFlag
                                        style={{
                                            height: '25px',
                                            width: '25px',
                                            borderRadius: '50%',
                                            verticalAlign: 'middle'
                                        }}
                                        currency={b2bPaymentData?.CurrencyCode ?? 'USD'}
                                    />
                                </Box>
                                <Typography 
                                    className={classes.bigText}
                                    style={{float: 'left', margin: 0}}
                                >
                                    $ {b2bPaymentData?.Amount ?? 0}
                                </Typography>
                            </Box>
                        </Box>
                    )}  

                </Box>              

                <Box 
                    mr={3}
                    p={2}                    
                    style={{ 
                        justifyContent: "center",                         
                        float: 'right',
                        border: '1px solid #9E9E9E', 
                        width: '36%',
                        borderRadius: '10px',
                        height: 100,
                        position: 'relative'
                    }}  
                >
                    <Box>
                        <Box pr={2}>
                            <Typography style={{fontSize: 14, color:'#4C4C4C', margin: '0 0 5px'}}>
                                {t('componentData.paymentTransDetail.PayableTo')}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        {Boolean(b2bPaymentData) && b2bPaymentData?.PayeeID 
                            ? <>
                                <Typography 
                                    onClick={() => routeToPayee()} 
                                    style={{ 
                                        cursor: 'pointer', 
                                        textDecoration: 'underline', 
                                        fontSize: 18,
                                        whiteSpace: 'nowrap', 
                                        width: Boolean(state.willPayeeUpdate) ? '250px' : '100%', 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis', 
                                    }} 
                                    className={classes.payeeText}
                                    title={state.payeeName}
                                >
                                    {state.payeeName}
                                </Typography>
                                <span 
                                    style={{
                                        color:'#9E9E9E',
                                        fontSize: 14,
                                        display: 'block'
                                    }}
                                >{state.payeeID}</span>
                            </>                            
                            : <>
                                <Typography 
                                    className={classes.payeeText} 
                                    style={{
                                        fontSize: 18,
                                        whiteSpace: 'nowrap', 
                                        width: Boolean(state.willPayeeUpdate) ? '250px' : '100%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis', 
                                    }}
                                    title={state.payeeName}
                                >
                                    {state.payeeName}
                                </Typography>
                                <span 
                                    style={{
                                        color:'#9E9E9E',
                                        fontSize: 14,
                                        display: 'block'
                                    }}
                                >{state.payeeID}</span>
                            </>
                            
                        }
                    </Box>                    

                    {Boolean(state.willPayeeUpdate) && (
                        <Typography 
                            variant='h3'
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '57%',
                                color: 'rgb(0, 140, 230)',
                                fontSize: '14px',
                                cursor: 'pointer',
                                width: '103px',
                                transform: 'translate(0, -50%)',
                            }}
                            onClick={()=>setState({...state, openPayeePopup: true})}
                        >
                            {t('componentData.CCPaymentTransaction.UPDATEPAYEE')}
                        </Typography>
                    )}                           

                </Box>

            </Grid>
            <Grid item xs={12}>
                {ccPaymentTrackingDetail && ccPaymentTrackingDetail.length ? (
                    <Box>
                        <CardSteppers
                            stepsList={ccPaymentTrackingDetail}
                            activeStep={ccActiveTrackingStep}
                        />
                    </Box>
                ) : null}
            </Grid>

            <Grid item xs={12}>
                <Box my={2} mx={10}>
                    <DetailsInfo infoData={b2bPaymentData} />
                </Box>
                <Box mx={10}>
                    <Divider className={classes.CCdivider} />
                </Box>
            </Grid>

            {cardData && cardData.length ?
                !isCreationFailedOrExceptionCard ? <>
                <Grid item xs={12} sm={6}>
                    <Box position={"relative"} mx={10} py={2}>
                        <img src={isCancelOrExpiredCard ? Cancelled_Image : MasterCard_Image} height={250} />
                        <Box className={classes.imageText}>
                            <Typography className={classes.cardNo}>{cardData && cardData.length ? cardData[0].virtualCardAccountNumber : ''}</Typography>
                            <Box display={"flex"}>
                                <Box mr={2} component="span">
                                    <Typography>{t('componentData.CCPaymentTransaction.expDate')}</Typography>
                                </Box>
                                <Box component="span">
                                    <Typography>
                                        {cardData && cardData.length ? formatCardDate(cardData[0].expiryDate) : ''}
                                    </Typography>
                                </Box>
                            </Box>
                            <Typography>{cardData && cardData.length ? cardData[0].programName : ''}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} className={classes.cardDetailsBox}>
                    <Grid container spacing={1}>
                        {isCancelOrExpiredCard ? <>
                            {cardData[0]?.availableBalance ? <>
                                <Grid item xs={4}>
                                    <Typography className={classes.keyLabel}>
                                        {t('componentData.CCPaymentTransaction.cardBal')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography className={classes.valueLabel}>
                                        {cardData[0]?.availableBalance || ''}
                                    </Typography>
                                </Grid>
                            </> : null}

                            {cardData[0]?.errorDescription ? <>
                                <Grid item xs={4}>
                                    <Typography className={classes.keyLabel}>
                                        {t('componentData.CCPaymentTransaction.cancelReasonTxt')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography className={classes.valueLabel}>
                                        {cardData[0]?.errorDescription || ''}
                                    </Typography>
                                </Grid>
                            </> : null}

                            {cardData[0]?.transactionmade ? <>
                                <Grid item xs={4}>
                                    <Typography className={classes.keyLabel}>
                                        {t('componentData.CCPaymentTransaction.tranxMade')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    {cardData[0]?.transactionmade || ''}
                                </Grid>
                            </> : null}

                        </> : null
                        }

                        {Boolean(cardData) && cardData.length > 0 && cardData[0].hasOwnProperty('multiUse') ? <>
                            <Grid item xs={4}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.cardUsageType')}
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography className={classes.valueLabel}>
                                    {Boolean(cardData) && cardData.length > 0 ? cardData[0]?.multiUse
                                        ? t('componentData.CCPaymentTransaction.multiple')
                                        : t('componentData.CCPaymentTransaction.single') : ''
                                    }
                                </Typography>
                            </Grid>
                        </> : null
                        }

                        {Boolean(cardData) && cardData.length > 0 && cardData[0].securityCode ? <>
                            <Grid item xs={4}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.CVC2')}
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                {cardData[0]?.securityCode || ''}
                            </Grid>
                        </> : null
                        }

                        {Boolean(cardData) && cardData.length > 0 && cardData[0]?.purchaseType ? <>
                            <Grid item xs={4}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.purchaseType')}
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography className={classes.valueLabel}>
                                    {cardData[0]?.purchaseType || ''}
                                </Typography>
                            </Grid>
                        </> : null
                        }

                        {!isEditMode && Boolean(cardData) && cardData.length > 0 && cardData[0]?.paymentBeneficiaryEmails ? <>
                            <Grid item xs={4}>
                                <Typography className={classes.keyLabel}>
                                    {t('componentData.CCPaymentTransaction.supplierEmail')}
                                </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography className={classes.valueLabel}>
                                    {cardData[0].paymentBeneficiaryEmails ? cardData[0].paymentBeneficiaryEmails.split(';').join(', ') : ''}
                                </Typography>
                            </Grid>
                        </> : null
                        }
                    </Grid>

                    {isEditMode &&
                        <Grid container>
                            <Grid item xs={12} sm={10}>
                                <Box my={2}>
                                    <Autocomplete
                                        multiple
                                        value={beneficiaryEmails}
                                        onChange={(e, values) => onChange('paymentBeneficiaryEmails', values)}
                                        clearOnBlur
                                        disableClearable
                                        options={[]}
                                        renderOption={(option) => option.title}
                                        freeSolo
                                        renderInput={(params) => (
                                            <TextField
                                                error={validation.paymentBeneficiaryEmails && validation.paymentBeneficiaryEmails.length > 0}
                                                helperText={validation.paymentBeneficiaryEmails}
                                                {...params}
                                                className={classes.emailChip}
                                                label={t('componentData.CCPaymentTransaction.supplierEmail')}
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                    {emailLimit - beneficiaryEmails.length > 0 ?
                                        <Typography className={classes.btnInfoText}>
                                            {t('componentData.CCPaymentTransaction.addLimit', { limit: emailLimit - beneficiaryEmails.length })}
                                        </Typography>
                                        :
                                        <Typography className={classes.errorText}>
                                            {t('componentData.CCPaymentTransaction.limitReached')}
                                        </Typography>
                                    }
                                </Box>
                            </Grid>
                        </Grid>
                    }
                    {b2bPaymentData?.DownloadRemittance === "Yes" && <Grid container spacing={1}>
                        <>
                        <Grid item xs={12}>
                            <Box py={2}>
                            <Typography variant='h4'className={classes.header}>
                                        {t('componentData.CCPaymentTransaction.RemittanceDetails')}
                            </Typography>
                            </Box>
                        </Grid>
                        </>
                        <>
                        <Grid item xs={4}>
                                    <Typography className={classes.keyLabel}>
                                        {t('componentData.CCPaymentTransaction.deliverDateAndTime')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography className={classes.valueLabel}>
                                    {b2bPaymentData?.RemittanceDeliveredDateTime || ''}
                                    </Typography>
                                </Grid>
                            </><>
                            <Grid item xs={4}>
                                    <Typography className={classes.keyLabel}>
                                        {t('componentData.CCPaymentTransaction.status')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    <Typography className={classes.valueLabel}>
                                        {b2bPaymentData?.RemittanceDeliveryStatus || ''}
                                    </Typography>
                                </Grid>
                        </>
                    {b2bPaymentData?.PaymentID &&
                    isPaymentRemittanceDownloadEnabled && (
                    <>
                    <Grid item xs={12}>
                    <Box py={1.5}>
                    <IconButton
                        color="primary"
                        aria-label="download"
                        component="span"
                        size="small"
                        onClick={() =>
                          downLoadRemittanceFile(
                            b2bPaymentData?.PaymentID,
                            b2bPaymentData?.ClientID,
                            true,
                            b2bPaymentData?.IsHippa
                          )
                        }
                      >
                        <GetAppIcon color="primary" fontSize="small" />
                      </IconButton>
                      <Box py={3} pl={1} style={{display:"inline-block"}}>
                        <Typography variant='h4'className={classes.header}>
                                    {t('componentData.CCPaymentTransaction.Download')}
                        </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <SnackbarComponent
                    openSnackbar={openSnackbar}
                    handleClose={handleClose}
                    snackbarMessage={snackbarMessage}
                    icon={false}
                    messageVariant={snackbarMessageType}
                    />
                    </>
                    )}
                    </Grid>}
                </Grid>
                </> 
                :
                <Grid item xs={12}>
                    <Box mx={10}>
                        <Grid container>
                            <Grid item xs={3}>
                                <Typography className={classes.keyLabel}>
                                    {b2bPaymentData && b2bPaymentData.ReturnStatusID && b2bPaymentData.ReturnStatusID == CardActivityTrailConst.EXCEPTION ?
                                        t('componentData.CCPaymentTransaction.exceptionTxt') : b2bPaymentData.ReturnStatusID == CardActivityTrailConst.CREATIONFAILED ? 
                                        t('componentData.CCPaymentTransaction.creationFailed') : '' }
                                </Typography>
                            </Grid>
                            <Grid item xs={9}>
                                <Typography className={classes.valueLabel}>                                    
                                    {cardData[0].errorCode ? `${cardData[0].errorCode}: ` : ''}
                                    {cardData[0]?.errorDescription || ''}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            : null
            }

            <Dialog
                open={state.openPayeePopup}
                onClose={() => setState({
                    ...state,
                    openPayeePopup: false,
                    selectedPayee: null,
                    selectedPayeeObj: null
                })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={classes.addPayeePopup}
            >
                <DialogTitle id="alert-dialog-title">
                    {t('componentData.CCPaymentTransaction.AddPayee')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('componentData.CCPaymentTransaction.modalMsg1')}
                    </DialogContentText>

                    <Autocomplete
                        value={state?.selectedPayeeObj?.payeeName}
                        onChange={(event, newValue) => {
                            setState({ ...state, selectedPayeeObj: newValue })
                        }}
                        inputValue={state?.selectedPayee}
                        onInputChange={(event, newInputValue) => {
                            setState({ ...state, selectedPayee: newInputValue })
                        }}
                        id="updatePayeePopup"
                        options={state.payeeList}
                        getOptionLabel={(option) => {
                            return `${option.payeeName} - ${option.payeeId}`
                        }}
                        style={{ width: 400, clear: 'both', display: 'inline-block' }}
                        renderInput={(params) => {
                            return (
                                <TextField
                                    {...params}
                                    label={t('componentData.CCPaymentTransaction.filterName')}
                                    variant="outlined"
                                    placeholder={Boolean(state?.selectedPayeeObj) ? '' : t('componentData.CCPaymentTransaction.filterName')}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            )
                        }}
                        renderOption={(props) => {
                            const { payeeName, payeeId } = props;
                            return (
                                <div {...props} style={{ fontSize: 14 }}>
                                    {payeeName} <span style={{ color: '#9E9E9E', fonSize: 12 }}>{payeeId}</span>
                                </div>
                            );
                        }}
                    />

                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        onClick={() => setState({
                            ...state,
                            openPayeePopup: false,
                            selectedPayee: null,
                            selectedPayeeObj: null
                        })}
                        color="primary"
                        variant="outlined"
                    >
                        {t('componentData.CCPaymentTransaction.CANCEL')}
                    </Button>
                    <Button
                        onClick={() => {
                            setState({
                                ...state,
                                openPayeeConfirmModal: true,
                                openPayeePopup: false
                            })
                        }}
                        color="primary"
                        variant="contained"
                        disabled={Boolean(state?.selectedPayeeObj) && Object.keys(state?.selectedPayeeObj).length > 0 ? false : true}
                    >
                        {t('componentData.CCPaymentTransaction.ADD')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={state.openPayeeConfirmModal}
                onClose={() => setState({
                    ...state,
                    openPayeeConfirmModal: false,
                    selectedPayee: null,
                    selectedPayeeObj: null
                })}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={classes.addPayeePopup}
            >
                <DialogTitle id="alert-dialog-title">
                    {t('componentData.CCPaymentTransaction.modalTitle')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('componentData.CCPaymentTransaction.AddTxt')} {state?.selectedPayeeObj?.payeeName ?? "-"} | {state?.selectedPayeeObj?.payeeId ?? "-"} {t('componentData.CCPaymentTransaction.modalMsg2')} {b2bPaymentData?.PaymentRef ?? "-"} {t('componentData.CCPaymentTransaction.modalMsg3')} {state?.selectedPayeeObj?.currency ?? "-"} {b2bPaymentData?.Amount ?? "-"}?
                    </DialogContentText>

                    <DialogContentText id="alert-dialog-description">
                        <Typography variant='h3'>
                            {state?.selectedPayeeObj?.payeeName}
                        </Typography>
                        <Typography variant='h4'>
                            {state?.selectedPayeeObj?.payeeId}
                        </Typography>
                    </DialogContentText>

                    <DialogContentText id="alert-dialog-description">
                        <Typography variant='h5'>
                            <WarningIcon /> {t('componentData.CCPaymentTransaction.undoneMsg')}
                        </Typography>
                    </DialogContentText>

                </DialogContent>
                <DialogActions style={{ justifyContent: 'center' }}>
                    <Button
                        onClick={() => setState({
                            ...state,
                            openPayeeConfirmModal: false,
                            openPayeePopup: true,
                            selectedPayee: null,
                            selectedPayeeObj: null
                        })}
                        color="primary"
                        variant="outlined"
                    >
                        {t('componentData.CCPaymentTransaction.BACK')}
                    </Button>
                    <Button
                        onClick={() => handlePayeeConfrimPopup()}
                        color="primary"
                        variant="contained"
                    >
                        {t('componentData.CCPaymentTransaction.CONFIRM')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}
export default withTranslation()(withStyles(styles)(CardDetails));
