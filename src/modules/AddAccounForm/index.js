import React from "react";
import { Grid } from "@material-ui/core";
import ACH from "./ACH";
import EFT from "./EFT";
import CK from "./CK";
import {
  saveBankAccount,
  saveCHK,
  saveVCA,
  updateBankAccount,
  updateVCA,
  uploadBulkFile,
  getFileProcessingStatus,
  fetchPurchaseType,
  fetchACHProfile,
  fetchTransactionTypeValue,  
  updateMasterCard
} from "../../redux/helpers/settings";
import VCA from "./VCA";
import CardOnly from './VCA/cardOnly';
import { PayerTypes } from '~/config/entityTypes';

class AddAccountForm extends React.Component {
  componentDidMount() {
    this.getTransactionTypeIdValue();
  }
  render() {
    const {
      accountDetails,
      isAddAccount,
      accountType,
      transactionTypes,
      currencyCodes,
      closeModal,
      onCancel,
      isCardSelection,
      payerTypeId
    } = this.props;

    return (
      <Grid container item xs={12}>
        {accountType === "bankAccount" ? (
          <ACH
            transactionTypes={transactionTypes}
            onCancel={onCancel}
            refreshData={() => this.props.refreshData()}
            getACHProfile={this.getACHProfile.bind(this)}
            currencyCodes={currencyCodes}
            saveACHDetails={(payload) => this.saveACHDetails(payload)}
            closeModal={closeModal}
            accountDetails={accountDetails}
            uploadFile={(formData) => this.uploadFile(formData)}
            setDialogMessage={(flag, msg, variant) =>
              this.setDialogMessage(flag, msg, variant)
            }
            isAddAccount={isAddAccount}
            getFileProcessingData={(clientId, fileId) =>
              this.getFileProcessingData(clientId, fileId)
            }
            getTransactionTypeIdValue={() => this.getTransactionTypeIdValue()}
          />
        ) : accountType === "eftAccount" ? (
          <EFT
            currencyCodes={currencyCodes}
            uploadFile={(formData) => this.uploadFile(formData)}
            onCancel={onCancel}
            refreshData={() => this.props.refreshData()}
            getACHProfile={this.getACHProfile.bind(this)}
            transactionTypes={transactionTypes}
            saveACHDetails={(payload) => this.saveACHDetails(payload)}
            setDialogMessage={(flag, msg, variant) =>
              this.setDialogMessage(flag, msg, variant)
            }
            closeModal={closeModal}
            accountDetails={accountDetails}
            isAddAccount={isAddAccount}
            getFileProcessingData={(clientId, fileId) =>
              this.getFileProcessingData(clientId, fileId)
            }
            getTransactionTypeIdValue={() => this.getTransactionTypeIdValue()}
          />
        ) : accountType === "check" ? (
          <CK
            currencyCodes={currencyCodes}
            closeModal={closeModal}
            onCancel={onCancel}
            refreshData={() => this.props.refreshData()}
            transactionTypes={transactionTypes}
            accountDetails={accountDetails}
            uploadFile={(formData) => this.uploadFile(formData)}
            saveACHDetails={(payload) => this.saveCHKDetails(payload)}
            setDialogMessage={(flag, msg, variant) =>
              this.setDialogMessage(flag, msg, variant)
            }
            getFileProcessingData={(clientId, fileId) =>
              this.getFileProcessingData(clientId, fileId)
            }
            getTransactionTypeIdValue={() => this.getTransactionTypeIdValue()}
          />
        ) : (

          payerTypeId == PayerTypes.CARDS ?
            <CardOnly              
              isCardSelection={isCardSelection}
              onCancel={onCancel}
              refreshData={() => this.props.refreshData()}
              closeModal={closeModal}
              accountDetails={accountDetails}
              isAddAccount={isAddAccount}              
              saveACHDetails={(payload) => this.saveMasterCardDetails(payload)}              
              setDialogMessage={(flag, msg, variant) =>
                this.setDialogMessage(flag, msg, variant)
              }            
            />

            :

            <VCA
              currencyCodes={currencyCodes}
              isCardSelection={isCardSelection}
              onCancel={onCancel}
              refreshData={() => this.props.refreshData()}
              closeModal={closeModal}
              accountDetails={accountDetails}
              isAddAccount={isAddAccount}
              transactionTypes={transactionTypes}
              saveACHDetails={(payload) => this.saveVCADetails(payload)}
              uploadFile={(formData) => this.uploadFile(formData)}
              setDialogMessage={(flag, msg, variant) =>
                this.setDialogMessage(flag, msg, variant)
              }
              getFileProcessingData={(clientId, fileId) =>
                this.getFileProcessingData(clientId, fileId)
              }
              getTransactionTypeIdValue={() => this.getTransactionTypeIdValue()}
              getPurchaseTypes={this.getPurchaseTypes}
            />
        )}
      </Grid>
    );
  }

  saveMasterCardDetails(payload) {
    const { clientId } = this.props;
    return updateMasterCard(payload, clientId);
  }

  saveACHDetails(payload) {
    const { clientId, isAddAccount } = this.props;
    return isAddAccount
      ? saveBankAccount(payload, clientId)
      : updateBankAccount(payload, clientId);
  }

  saveCHKDetails(payload) {
    const { clientId } = this.props;
    return saveCHK(payload, clientId);
  }

  saveVCADetails(payload) {
    const { clientId, isAddAccount } = this.props;
    return isAddAccount
      ? saveVCA(payload, clientId)
      : updateVCA(payload, clientId);
  }

  uploadFile(formData) {
    return uploadBulkFile(formData);
  }

  setDialogMessage(flag, message, variant) {
    this.props.setDialogMessage(flag, message, variant);
  }

  getFileProcessingData(clientId, fileId) {
    return getFileProcessingStatus(clientId, fileId);
  }

  getACHProfile() {
    return fetchACHProfile();
  }

  getTransactionTypeIdValue() {
    const { clientId } = this.props;
    return fetchTransactionTypeValue({
      clientId: clientId,
      paymentCode: this.returnPaymentCode(),
    });
  }

  getPurchaseTypes() {
    return fetchPurchaseType();
  }

  returnPaymentCode() {
    const { accountType } = this.props;
    let alias = accountType === "bankAccount" ? "ACH" : accountType === "RTP"
        ? "RTP"
        : accountType === "eftAccount"
          ? "EFT"
          : accountType === "check"
            ? "CHK"
            : "VCA";
    return alias;
  }
}

export default AddAccountForm;
