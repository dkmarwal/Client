import React, { Component } from "react";
import {
  Grid,
  Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import config from "~/config";
import { connect } from "react-redux";
import { B2CfetchSelectedTabs} from "~/redux/helpers/settings";
import { styles } from "./styles";
import { withTranslation } from 'react-i18next';
import { paymentMethodIds, paymentMethods } from '~/config/paymentMethods';

class PaymentDetails extends Component {
  state = {
    optedPaymentMethod: [],
  };

  componentDidMount=()=>{
    this.getOptedPaymentList();
  }

  getOptedPaymentList=()=>{
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchSelectedTabs(clientId).then((response) => {
      if (response.error) {
        return false;
      }     
      else{        
        if(Boolean(response?.data?.rows2 ?? false)){
          const list = response.data.rows2.map((e)=>{            
            return e.paymentCode
          });  
          this.setState({
            optedPaymentMethod: list
          })        
        }        
      }
    });
  }

  render() {
    const { classes, paymentFileData, PaymentSummary, t } = this.props;
    const {optedPaymentMethod} = this.state;
    let ACHIndex = 0;
    let checkIndex = 0;
    let zelleIndex = 0;
    let depositToDebitcardIndex = 0;
    let prepaidCardIndex = 0;
    let prepaidCardIndexFinal=0;
    let rTPIndex = 0;
    let focusNonPayrollIndex = 0;
    let reliaCardIndex = 0;
    let corporateRewardIndex = 0;
    let plasticCorporateCardIndex = 0;
    let digitalCorporateCardIndex = 0;

    if(Boolean(PaymentSummary) && PaymentSummary.length > 0){      
      ACHIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.USBankACH);
      checkIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.USBankCHK);
      zelleIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.USBankZelle);   
      depositToDebitcardIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.USBankDepositToDebitcard);  
      rTPIndex = PaymentSummary.findIndex(v => v.PaymentTypeID === paymentMethodIds.USBankRTP); 
    
      prepaidCardIndex = PaymentSummary.findIndex(v => {
        return ( ((v.PaymentTypeID === paymentMethodIds.PrepaidFocusNonPayroll) && (v.PaymentTypeID === paymentFileData.PPDTypeID))
          || ((v.PaymentTypeID === paymentMethodIds.PrepaidReliaCard) && (v.PaymentTypeID === paymentFileData.PPDTypeID))
          || ((v.PaymentTypeID === paymentMethodIds.PlasticCorporateCard) && (v.PaymentTypeID === paymentFileData.PPDTypeID))
          || ((v.PaymentTypeID === paymentMethodIds.DigitalCorporateCard) && (v.PaymentTypeID === paymentFileData.PPDTypeID)))
          
          
      }); 
    
      prepaidCardIndexFinal= prepaidCardIndex>0?prepaidCardIndex:PaymentSummary.findIndex(v => {
        return ( ((v.PaymentTypeID === paymentMethodIds.PrepaidFocusNonPayroll)))});
    }     
    let willACHShow = false;
    let willCHKShow = false;
    let willZelleShow = false; 
    let willDepositToDebitcardShow = false;
    let willPrepaidCardShow = false;
    let willRTPShow = false;
    
    if(optedPaymentMethod.length > 0){
      optedPaymentMethod.map((e)=>{        
        if(e === paymentMethods.USBankACH){
          return willACHShow = true
        }
        else if(e === paymentMethods.USBankDepositToDebitcard){
          return willDepositToDebitcardShow = true
        }
        else if(e === paymentMethods.USBankPrepaidCard){
          return willPrepaidCardShow = true
        }
        else if(e === paymentMethods.USBankCHK){
          return willCHKShow = true
        }
        else if(e === paymentMethods.USBankRTP){
          return willRTPShow = true
        }
        else if(e === paymentMethods.USBankZelle){
          return willZelleShow = true
        }
      })
    }
    
    return (
      <>
        <Grid container spacing={2} alignItems="stretch" style={{margin: "0 23px"}}>

 {/********1th ACH Payments********YY*/}

 {Boolean(willACHShow) && (
            <Grid item xs>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.USbankpaymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/USbank/ACH_main.svg`)}
                    alt={t('componentData.paymentDetails.BankAccountPayments')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.BankAccountPayments')}{" "}</Box>
                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        ${" "}
                        {paymentFileData.TotalACHUSDAmount
                          ? paymentFileData.TotalACHUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                {/* <Box> */}
                <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.BankTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? `${PaymentSummary[ACHIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.BLANK')} `
                        : null
                      }

                     </u> 

                      <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.BankTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>  

                      {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? `| ${PaymentSummary[ACHIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.FORCE')}`
                        : null
                      }

                      </u> 
                      </Box> 
                       <div>{t('componentData.paymentFileDetail.processedPayments')}</div> 

                </Box>
              </Box>
            </Grid>
          )} 
 {/********2nd RTP Payments*******/}
 {Boolean(willRTPShow) && (
            <Grid item xs>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.USbankpaymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/USbank/RTP.svg`)}
                    alt={t('componentData.paymentDetails.RTPPayments')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.RTPPayments')}</Box>

                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        ${" "}
                        {paymentFileData.TotalRTPUSDAmount
                          ? paymentFileData.TotalRTPUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
               <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.RTPTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                       {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? `${PaymentSummary[rTPIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.BLANK')} `
                        : null
                      }
</u>
                      

                      <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.RTPTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? ` | ${PaymentSummary[rTPIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.FORCE')}`
                        : null
                      }

                      </u>
</Box>
                      <div>{t('componentData.paymentFileDetail.processedPayments')}</div> 
                  
                </Box>
              </Box>
            </Grid>
          )}
          {/********3st box Zelle Payments*******/}

          {Boolean(willZelleShow) && (
            <Grid item xs>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.USbankpaymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/USbank/Zelle_main.svg`)}
                    alt={t('componentData.paymentDetails.ZellePayments')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.ZellePayments')}</Box>

                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        ${" "}
                        {paymentFileData.TotalZELUSDAmount
                          ? paymentFileData.TotalZELUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                
                  <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.ZELTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>

                       {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? `${PaymentSummary[zelleIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.BLANK')} `
                        : null
                      } 
                     </u> 
                       <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.ZELTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? ` | ${PaymentSummary[zelleIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.FORCE')}`
                        : null
                      }
                      
                      </u> 
                      </Box>
                      <div>{t('componentData.paymentFileDetail.processedPayments')}</div> 

                </Box>
              </Box>
            </Grid>
          )}
 {/********4th box Check Payments********YY*/}

 {Boolean(willCHKShow) && (
            <Grid item xs>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.USbankpaymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/USbank/CHK.svg`)}
                    alt={t('componentData.paymentDetails.CHK')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.CheckPayments')}{" "}</Box>
                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        $ {" "}
                        {paymentFileData.TotalCheckUSDAmount
                          ? paymentFileData.TotalCheckUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.CheckTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                    
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? `${PaymentSummary[checkIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.BLANK')} `
                        : null
                      }

</u>
                      <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.CheckTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? ` | ${PaymentSummary[checkIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.FORCE')}`
                        : null
                      }

                      </u>
                      </Box>
                      <div>{t('componentData.paymentFileDetail.processedPayments')}</div>
                </Box>
              </Box>
            </Grid>
          )} 
          
         

          {/********5rd PrepaidCard Payments*******/}

          {Boolean(willPrepaidCardShow) && (
            <Grid item xs>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.USbankpaymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/USbank/Prepaidcard.svg`)}
                    alt={t('componentData.paymentDetails.PrepaidCardPayments')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.PrepaidCardPayments')}</Box>
                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        ${" "}
                        {paymentFileData.TotalPPDUSDAmount
                          ? paymentFileData.TotalPPDUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                 
                  <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.PPDTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                     {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? `${PaymentSummary[prepaidCardIndexFinal].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.BLANK')}  `
                        : null
                      }
</u>
                      <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.PPDTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? ` | ${PaymentSummary[prepaidCardIndexFinal].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.FORCE')}`
                        : null
                      }
                      </u>
                      </Box>
                      <div>{t('componentData.paymentFileDetail.processedPayments')}</div>
                </Box>
              </Box>
            </Grid>
          )}

      
          
       

          {/********6th Deposit to Dabit Payments********YY*/}

          {Boolean(willDepositToDebitcardShow) && (
            <Grid item xs>
              <Box
                className={classes.outerBox}
                bgcolor="white"
                height={1}
              >
                <Box
                  fontSize={16}
                  textAlign="left"
                  color="primary"
                  pb={2}
                  className={classes.USbankpaymentDetailTitle}
                  height="65px"
                  alignItems="center"
                >
                  {" "}
                  <img
                    src={require(`~/assets/icons/USbank/Deposit_to_Card_main.svg`)}
                    alt={t('componentData.paymentDetails.DepositToDabitPayments')}
                    style={{ paddingRight: 10, height: 24 }}
                  />{" "}
                  <Box display="flex" justifyContent="center" width={1} textAlign="center">
                    {t('componentData.paymentDetails.DepositToDabitPayments')}{" "}</Box>
                </Box>

                <Box p={2} alignItems="center" justifyContent="center" display="flex"
                  flexDirection="column">
                  <Box display="flex" flexDirection="column" width={1}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16}>
                        $ {" "}
                        {paymentFileData.TotalDDCUSDAmount
                          ? paymentFileData.TotalDDCUSDAmount
                          : 0}
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      pb={2}
                      alignItems="center"
                    >
                      <Box fontSize={16} >
                        {" "}
                        {t('componentData.paymentFileDetail.totalAmount')}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="block" justifyContent="center" alignItems="center" fontSize={16} color="#4C4C4C">
                    <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.DDCTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=1`)}>
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? `${PaymentSummary[depositToDebitcardIndex].TotalCDMPaymentCount} ${t('componentData.paymentFileDetail.BLANK')} `
                        : null
                      }
</u>

                      <u style={{ cursor: "pointer", textAlign: "center" }} onClick={() => this.props.history.push(`${config.baseName}/payments/paymentDetails?FileID=${paymentFileData.FileID}&paymentTypeIDs=${paymentFileData.DDCTypeID}&ProcessedStatusFilter=${paymentFileData.ProcessedStatusFilter}&AddFilter=2`)}>
                      
                      {Boolean(PaymentSummary) && PaymentSummary.length > 0 
                        ? ` | ${PaymentSummary[depositToDebitcardIndex].TotalNONCDMPaymentCount} ${t('componentData.paymentFileDetail.FORCE')}`
                        : null
                      }

                      </u>
                      </Box>
                      <div>{t('componentData.paymentFileDetail.processedPayments')}</div> 
                </Box>
              </Box>
            </Grid>
          )}        
          
        </Grid>
      </>
    );
  }
}

export default connect((state) => ({ ...state.user }))(withTranslation()(withStyles(styles)(PaymentDetails)));
