import React from "react";
import { Grid } from "@material-ui/core";
import USbankBank from "~/modules/AddAccounForm/USbank/bank";
import RTP from "~/modules/AddAccounForm/USbank/rtp";
import USbankDepositToDebit from "~/modules/AddAccounForm/USbank/USbankDepositToDebit";
import {paymentMethods} from "~/config/paymentMethods"
import Zelle from "~/modules/AddAccounForm/USbank/Zelle";
import Check from "~/modules/AddAccounForm/USbank/check";
import {fetchCurrencyCodes} from '~/redux/helpers/settings'
import USBankPrepaidCard from './PrepaidCard';

class USbankAddAccountForm extends React.Component {  
  constructor(){
    super()
    this.state={
      currencyCodes:null
    }
  }
  componentDidMount = () => {
    fetchCurrencyCodes().then((res)=>{
      this.setState({ currencyCodes: res.data.rows });
    })
  }
  render() {
    const {
      isAddAccount,
      accountType,
      closeModal,
      onCancel,
      notification,
      canEdit = false,
      canAdd = false,
      canDownload = false,
      accountDetails,
      isRowClick,
    } = this.props;

    return (
        <>          
           <Grid container item xs={12}> 
            {accountType === paymentMethods.USBankACH ? (
              <USbankBank        
                canEdit ={isRowClick ? false : isAddAccount ? true : canEdit}
                canAdd={canAdd}
                canDownload={canDownload}
                notification = {notification}              
                onCancel={onCancel}            
                closeModal={closeModal}            
                isAddAccount={isAddAccount}  
                accountDetails={accountDetails}
                currencyCodes = {this.state.currencyCodes}
              />
            ) : accountType === paymentMethods.USBankDepositToDebitcard ? (
              <USbankDepositToDebit        
                canEdit ={isRowClick ? false : isAddAccount ? true : canEdit}
                canAdd={canAdd}
                canDownload={canDownload}
                notification = {notification}              
                onCancel={onCancel}            
                closeModal={closeModal}            
                isAddAccount={isAddAccount}  
                accountDetails={accountDetails}
             
              />
            ) :
            accountType === paymentMethods.USBankRTP ? ( 
             <RTP            
               onCancel={onCancel}            
               closeModal={closeModal}
               notification = {notification}                
               canEdit ={isRowClick ? false : isAddAccount ? true : canEdit}
               canAdd={canAdd}
               canDownload={canDownload}  
               isAddAccount={isAddAccount}  
               accountDetails={accountDetails}
              
             />
           ): accountType === paymentMethods.USBankZelle ? (
            <Zelle        
              canEdit ={isRowClick ? false : isAddAccount ? true : canEdit}
              canAdd={canAdd}
              canDownload={canDownload}
              notification={notification}
              onCancel={onCancel}
              closeModal={closeModal}
              isAddAccount={isAddAccount}
              accountDetails={accountDetails}
            />
          )  : accountType === paymentMethods.USBankCHK ? (
            <Check        
              canEdit ={isRowClick ? false : isAddAccount ? true : canEdit}
              canAdd={canAdd}
              canDownload={canDownload}
              notification={notification}
              onCancel={onCancel}
              closeModal={closeModal}
              isAddAccount={isAddAccount}
              accountDetails={accountDetails}
            />
          )        
          : accountType === paymentMethods.USBankPrepaidCard ? (
            <USBankPrepaidCard
              canEdit={isRowClick ? false : isAddAccount ? true : canEdit}
              canAdd={canAdd}
              canDownload={canDownload}
              notification={notification}
              onCancel={onCancel}
              closeModal={closeModal}
              isAddAccount={isAddAccount}
              accountDetails={accountDetails}
              currencyCodes = {this.state.currencyCodes}
            />
          ) : null
            }
          </Grid>            
      </>
    );
  }
}

export default USbankAddAccountForm;
