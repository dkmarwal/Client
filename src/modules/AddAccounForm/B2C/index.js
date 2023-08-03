import React from "react";
import { Grid } from "@material-ui/core";
import B2CBankDetail from "~/modules/AddAccounForm/B2C/bank";
import B2CPushToCardDetail from "~/modules/AddAccounForm/B2C/pushToCard";
import B2CCheck from "~/modules/AddAccounForm/B2C/check";
import B2CPayPalDetail from "~/modules/AddAccounForm/B2C/paypal";
import ZelleDetail from "~/modules/AddAccounForm/B2C/Zelle";
import {paymentMethods} from "~/config/paymentMethods"
import {fetchCurrencyCodes} from '~/redux/helpers/settings'

class B2CAddAccountForm extends React.Component {  
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
      isRowClick      
    } = this.props;       
    
    return (
        <>          
          <Grid container item xs={12}>
            {accountType === "bankAccount" ? (
              <B2CBankDetail            
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
            ) : accountType === paymentMethods.PushToCard ? (
              <B2CPushToCardDetail            
                onCancel={onCancel}            
                closeModal={closeModal}
                notification = {notification}                
                canEdit ={isRowClick ? false : isAddAccount ? true : canEdit}
                canAdd={canAdd}
                canDownload={canDownload}  
                isAddAccount={isAddAccount}  
                accountDetails={accountDetails}
                currencyCodes = {this.state.currencyCodes}
              />
            ) : accountType === "check" ? (
              <B2CCheck            
                closeModal={closeModal}
                onCancel={onCancel}           
                notification = {notification}                
                canEdit ={isRowClick ? false : isAddAccount ? true : canEdit}
                canAdd={canAdd}
                canDownload={canDownload}  
                isAddAccount={isAddAccount}  
                accountDetails={accountDetails}        
              />
            ) : accountType === paymentMethods.PayPal ? (
              <B2CPayPalDetail            
                onCancel={onCancel}
                notification = {notification}              
                closeModal={closeModal}              
                canEdit ={isRowClick ? false : isAddAccount ? true : canEdit}
                canAdd={canAdd}
                canDownload={canDownload}  
                isAddAccount={isAddAccount}  
                accountDetails={accountDetails}                             
              />
            ) : <ZelleDetail            
                  onCancel={onCancel}
                  notification = {notification}              
                  closeModal={closeModal}              
                  canEdit ={isRowClick ? false : isAddAccount ? true : canEdit}
                  canAdd={canAdd}
                  canDownload={canDownload}  
                  isAddAccount={isAddAccount}  
                  accountDetails={accountDetails}
                  currencyCodes = {this.state.currencyCodes}
                />
            }
          </Grid>            
      </>
    );
  }  
}

export default B2CAddAccountForm;
