import React, { Component } from 'react'
import { Grid, Box, Paper,  Typography, withStyles,} from "@material-ui/core";
import AccountBalanceSharpIcon from '@material-ui/icons/AccountBalanceSharp';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import CustomizedSteppers from "~/components/Stepper/Stepper"
import { styles } from "./styles";
import { withTranslation } from 'react-i18next';

class LgDialogs extends Component {
    constructor(props) {
        super(props);
        const { t } = this.props;
        this.state = {
        stepperInfo: [t('componentData.dialogs.PaymentPending'),  t('componentData.dialogs.PaymentSubmitted'),  t('componentData.dialogs.PaymentInitiated'),  t('componentData.dialogs.PaymentDisbursed') ],
        selectedTab:0,
    }
}

    render() {
        const {stepperInfo, selectedTab} = this.state;
        const {classes, t} = this.props;
        return (
            <>
            <Grid container item className={classes.root}>
            <Grid container direction="row" justify="center" alignItems="center">
               <Box mx="auto" display="flex"  alignItems="center">
                    <Box mr={3} className={classes.flagText}>  <img src={require('~/assets/icons/USAFlag.svg')} alt= {t('componentData.dialogs.USAflag')} /> {t('componentData.dialogs.usd')}  </Box>
                    <Box>  <Typography variant="h1" className={classes.bigText}>  $100,000.00</Typography>  </Box>
               </Box>
                </Grid>
             <Grid container direction="row" justify="center" alignItems="center">
               <Box mx="auto" display="flex"  alignItems="center">
                    <Box mr={5}>  <Typography variant="h1" className={classes.subText}>  {t('componentData.dialogs.PayableTo')} </Typography> </Box>
                    <Box>  <Typography variant="h1" className={classes.subText}> {t('componentData.dialogs.Kroger')}</Typography>  </Box>
               </Box>
             </Grid>
             <Grid container direction="row" justify="center" alignItems="center">
            <Box my={4} width="100%" >
                <CustomizedSteppers stepsList={stepperInfo}  activeStep={selectedTab+1} />
            </Box>
            </Grid>
            {/* Start Remit */}
            <Grid container item>
                <Grid item xs={3}>  <Typography variant="body1">  {t('componentData.dialogs.RemitToID')}</Typography></Grid>
                <Grid item xs={3}>  <Typography variant="body1">  123456798</Typography></Grid>
                <Grid item xs={3}>  <Typography variant="body1">  {t('componentData.dialogs.ProcessedOn')}</Typography></Grid>
                <Grid item xs={3}>  <Typography variant="body1">  {t('componentData.dialogs.dateFormate')} HH:MM PM </Typography></Grid>
             </Grid>

             <Grid container item>
                <Grid item xs={3}>  <Typography variant="body1">  {t('componentData.dialogs.PaymentReference')}</Typography></Grid>
                <Grid item xs={3}>  <Typography variant="body1">  ABCDCEF123</Typography></Grid>
                <Grid item xs={3}>  <Typography variant="body1">  {t('componentData.dialogs.ReceivedOn')}</Typography></Grid>
                <Grid item xs={3}>  <Typography variant="body1">  {t('componentData.dialogs.dateFormate')} HH:MM PM </Typography></Grid>
             </Grid>
             
             <Grid container item>
                <Grid item xs={3}>  <Typography variant="body1">  {t('componentData.dialogs.PaymentID')}</Typography></Grid>
                <Grid item xs={3}>  <Typography variant="body1">  123456798</Typography></Grid>
                <Grid item xs={3}>  <Typography variant="body1">  {t('componentData.dialogs.ValueDate')}</Typography></Grid>
                <Grid item xs={3}>  <Typography variant="body1">  {t('componentData.dialogs.dateFormate')} </Typography></Grid>
             </Grid>
                   {/* End Remit */}

                {/* Start Account Details*/}
                <Grid container item>
                <Typography variant="h5" className={classes.labelHeading}>{t('componentData.dialogs.AccountDetails')}</Typography>
                </Grid>
             <Grid container item alignItems="center">
                <Grid item xs={5} alignItems="center">
                <Paper square className={classes.boxSpace} elevation={2}>
                    <Grid container item alignItems="center">
                        <Grid item xs={1} className={classes.iconImage}>  <AccountBalanceSharpIcon fontSize="small" /> </Grid>
                        <Grid item xs={5}>  <Typography variant="body1">{t('componentData.dialogs.BankAccount')}</Typography></Grid>
                        <Grid item xs={6}>  <Typography variant="body1">  123456789</Typography></Grid>
                    </Grid>

                    <Grid container item>
                        <Grid item xs={1}>  </Grid>
                        <Grid item xs={5}>  <Typography variant="body1"> {t('componentData.dialogs.RoutingNumber')}</Typography></Grid>
                        <Grid item xs={6}>  <Typography variant="body1">  123456789</Typography></Grid>
                    </Grid>

                    <Grid container item>
                        <Grid item xs={1}>  </Grid>
                        <Grid item xs={5}>  <Typography variant="body1"> {t('componentData.dialogs.OwnerName')}</Typography></Grid>
                        <Grid item xs={6}>  <Typography variant="body1">  Jeff Springs</Typography></Grid>
                    </Grid>
                </Paper>

                </Grid>
                <Grid item xs={2} >
                    <Box display="flex" justifyContent="center" className={classes.iconImage} >  <ArrowForwardIosRoundedIcon fontSize="small"/> </Box>
                </Grid>
                <Grid item xs={5} alignItems="center">
                <Paper square className={classes.boxSpace} elevation={2}>
                    <Grid container item alignItems="center">
                        <Grid item xs={1} className={classes.iconImage}>  <AccountBalanceSharpIcon fontSize="small" /> </Grid>
                        <Grid item xs={5}>  <Typography variant="body1"> {t('componentData.dialogs.BankAccount')}</Typography></Grid>
                        <Grid item xs={6}>  <Typography variant="body1">  123456789</Typography></Grid>
                    </Grid>

                    <Grid container item>
                        <Grid item xs={1}>  </Grid>
                        <Grid item xs={5}>  <Typography variant="body1"> {t('componentData.dialogs.RoutingNumber')}</Typography></Grid>
                        <Grid item xs={6}>  <Typography variant="body1">  123456789</Typography></Grid>
                    </Grid>

                    <Grid container item>
                        <Grid item xs={1}>  </Grid>
                        <Grid item xs={5}>  <Typography variant="body1"> {t('componentData.dialogs.OwnerName')}</Typography></Grid>
                        <Grid item xs={6}>  <Typography variant="body1">  Jeff Springs</Typography></Grid>
                    </Grid>
                </Paper>
                </Grid>
             </Grid>
               {/* End Account Details*/}

                  {/* Start Transaction Details */}
             <Grid container item>
                <Typography variant="h5" className={classes.labelHeading}> {t('componentData.dialogs.TransactionDetails')}</Typography>
             </Grid>
             <Grid container item xs={6}>
                    <Grid container item>
                    <Grid item xs={6}> <Typography variant="body1">{t('componentData.dialogs.TraceNumber')}</Typography>  </Grid>
                    <Grid item xs={6}> <Typography variant="body1">12358563</Typography>  </Grid>
                </Grid>              
                </Grid> 
                 {/* End Transaction Details*/}

                 {/* Start Remittance Details */}
                <Grid container item>
                <Typography variant="h5" className={classes.labelHeading}>  {t('componentData.dialogs.RemittanceDetails')}</Typography>
                </Grid>
                <Grid container item xs={6}>
                    <Grid container item>
                    <Grid item xs={6}> <Typography variant="body1">{t('componentData.dialogs.DeliveryDateTime')}</Typography>  </Grid>
                    <Grid item xs={6}> <Typography variant="body1">{t('componentData.dialogs.dateFormate')} HH:MM PM</Typography>  </Grid>
                </Grid>
                <Grid container item> 
                    <Grid item xs={6}> <Typography variant="body1">{t('componentData.dialogs.Status')}</Typography> </Grid>
                    <Grid item xs={6}> <Typography variant="body1">{t('componentData.dialogs.EmailDelivered')}</Typography> </Grid>
                </Grid>
                </Grid>
             </Grid>
            </>
        )
    }
}

export default withTranslation()(withStyles(styles)(LgDialogs))
