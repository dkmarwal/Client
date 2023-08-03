import React from "react";
import {
  TextField,  
  Grid,  
  Box,
  Button,  
  CircularProgress,  
  MenuItem,
} from "@material-ui/core";
import { connect } from "react-redux";
import { accessRights } from "~/config/accessRights";
import { withTranslation } from 'react-i18next';
import trim from 'deep-trim-node';
class CK extends React.Component {
  state = {
    validation: {},
    fileProcessing: false,
    fileProcesssingStatus: "",    
    fileErrorFields: null,
    savingDetails: false,
    immediateDestination: "",
    immediateOriginName: "",
    intSenderId: "",
    intRecvrId: "",
    GS02: "",
    GS03: "",
    transactionType: [],
  };

  componentDidMount() {
    const {
      accountDetails,      
      getTransactionTypeIdValue,
    } = this.props;
    getTransactionTypeIdValue().then((res) => {
      if (res.error) {
        this.props.setDialogMessage(true, res.message);
      }
      this.setState(accountDetails, () => {
        this.setState({
          transactionType: res.data && res.data.rows && res.data.rows[0],
        });
      });
    });
  }

  validateData = () => {
    let errorText = {};
    const { t } = this.props;
    let valid = true;   

    if (this.state["intSenderId"].toString().trim().length === 0) {
      valid = false;
      errorText["intSenderId"] = t('componentData.addAccountCK.InterchangeSenderID');
    }
    if (this.state["intRecvrId"].toString().trim().length === 0) {
      valid = false;
      errorText["intRecvrId"] = t('componentData.addAccountCK.InterchangereceiverID');
    }
    if (this.state["GS02"].toString().trim().length === 0) {
      valid = false;
      errorText["GS02"] = t('componentData.addAccountCK.GS02Empty');
    }
    if (this.state["GS03"].toString().trim().length === 0) {
      valid = false;
      errorText["GS03"] = t('componentData.addAccountCK.GS03Empty');
    }

    
    if (this.state["transactionType"] === [] || this.state["transactionType"] === undefined || this.state["transactionType"] === 'undefined') {
      valid = false;
      errorText["transactionType"] = t('componentData.addAccountCK.TransactionType');
    }

    if (this.state["intSenderId"] && this.state["intSenderId"].length > 15) {
      errorText["intSenderId"] = t('componentData.addAccountCK.SenderIDMaxLen');
      valid = false;
    }
    if (this.state["intRecvrId"] && this.state["intRecvrId"].length > 15) {
      errorText["intRecvrId"] =
      t('componentData.addAccountCK.ReceiverIDMaxLen');
      valid = false;
    }
    if (this.state["GS03"] && this.state["GS03"].length > 15) {
      errorText["GS03"] = t('componentData.addAccountCK.GS03MaxLen');
      valid = false;
    }
    if (this.state["GS02"] && this.state["GS02"].length > 15) {
      errorText["GS02"] = t('componentData.addAccountCK.GS02MaxLen');
      valid = false;
    }

    if (this.state["intSenderId"] && this.state["intSenderId"].length < 2) {
      errorText["intSenderId"] = t('componentData.addAccountCK.SenderIDMinLen');
      valid = false;
    }
    if (this.state["intRecvrId"] && this.state["intRecvrId"].length < 2) {
      errorText["intRecvrId"] = t('componentData.addAccountCK.ReceiverIdMinLen');
      valid = false;
    }
    if (this.state["GS03"] && this.state["GS03"].length < 2) {
      errorText["GS03"] = t('componentData.addAccountCK.GS03MinLen');
      valid = false;
    }
    if (this.state["GS02"] && this.state["GS02"].length < 2) {
      errorText["GS02"] = t('componentData.addAccountCK.GS02MinLen');
      valid = false;
    }

    this.setState({
      validation: { ...errorText },
    });
    return valid;
  };

  handleInput(e) {
    let obj = {};
    let inputName = e.target.name;
    obj[inputName] = e.target.value;
    this.setState(obj);
  }

  uploadBulkFile = (e) => {
    e.preventDefault();
    e.target.value = "";
    let file = e.target.files[0];
    let clientId = this.props.user.userData.portalProfileId;
    let portalTypeId = this.props.user.userData.portalTypeId;
    let formData = new FormData();
    formData.append(`clientId`, clientId);
    formData.append(`portalTypeId`, portalTypeId);
    formData.append(`portalProfileId`, clientId);
    formData.append(`file`, file);
    this.props.uploadFile(formData).then((response) => {
      if (response.error) {
        this.props.setDialogMessage(true, response.message);
        return false;
      }
      this.setState(
        { fileProcesssingStatus: response.message, fileProcessing: true },
        () => {
          let fileId = response.data.bulkAccountFilesId;
          this.props.getFileProcessingData(clientId, fileId).then((res) => {
            if (res.error) {
              this.props.setDialogMessage(true, res.message);
              return false;
            }           
            this.setState({ fileErrorFields: res.data, fileProcessing: false });
          });
        }
      );
    });
  };

  saveDetails = () => {
    if (this.validateData()) {
      const {
        intSenderId,
        intRecvrId,
        GS02,
        GS03,
        transactionType,
      } = this.state;
      const { setDialogMessage } = this.props;      

      let payload = {
        intSenderId: intSenderId,
        intRecvrId: intRecvrId,
        checkEdiInfo: {
          GS02: GS02,
          GS03: GS03,
        },
        transactionType: transactionType ? [transactionType] : [],
      };
      payload = trim(payload);
      this.setState({ btnLoader: true, savingDetails: true }, () => {
        this.props.saveACHDetails(payload).then((response) => {
          this.setState({ btnLoader: false, savingDetails: false }, () => {
            this.props.refreshData();
            setDialogMessage(true, response.message);
            this.props.closeModal();
          });
        });
      });
    }
  };

  render() {
    const { t } = this.props;
    const {
      validation,
      savingDetails,
      intSenderId,
      intRecvrId,
      GS02,
      GS03,
      transactionType      
    } = this.state;
    const {
      transactionTypes,      
      onCancel,
    } = this.props;    

    const { theme } = this.props.clientConfig.layout;
    const { user } = this.props;
    const isSettingPaymentMethodAddEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_ADD"]
        )) ||
      false;
    const isSettingPaymentMethodEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_EDIT"]
        )) ||
      false;
    const canEdit =
      isSettingPaymentMethodAddEnabled || isSettingPaymentMethodEditEnabled
        ? true
        : false;
    return (
      <Grid container>        
        <Grid item xs={12} sm={12}>
          <Box my={5}>
            <TextField
              select
              fullWidth={true}
              disabled={!canEdit}
              error={
                validation.transactionType &&
                validation.transactionType.length > 0
              }
              helperText={validation.transactionType}
              autoComplete="off"
              value={transactionType}
              name="transactionType"
              label= {t('componentData.addAccountCK.SelectTransactionType')}
              onChange={(e) => this.handleInput(e)}
              dir="horizontal"
              size="small"
              variant="outlined"
              inputProps={{
                maxLength: 100,
              }}
              className={""}
            >
              {transactionTypes &&
                transactionTypes
                  .filter((element) => element.paymentCode === "CHK")
                  .map((type) => (
                    <MenuItem
                      value={type.transactionTypeId}
                      key={type.transactionTypeId}
                    >
                      {`${type.paymentCode} ${type.bankCountryIso} ${type.currency}`}
                    </MenuItem>
                  ))}
            </TextField>
          </Box>
          <Box my={5}>
            <TextField
              fullWidth={true}
              disabled={!canEdit}
              autoComplete="off"
              value={intSenderId}
              name="intSenderId"
              onBlur={() => this.validateData()}
              label= {t('componentData.addAccountCK.InterchSenderID')}
              onChange={(e) => this.handleInput(e)}
              dir="horizontal"
              variant="outlined"
              size="small"
              error={
                validation.intSenderId && validation.intSenderId.length > 0
              }
              helperText={validation.intSenderId}
              inputProps={{
                maxLength: 15,
                minLength: 2,
              }}
              className={""}
            ></TextField>
          </Box>
          <Box my={5}>
            <TextField
              disabled={!canEdit}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={intRecvrId}
              onBlur={() => this.validateData()}
              error={validation.intRecvrId && validation.intRecvrId.length > 0}
              helperText={validation.intRecvrId}
              name="intRecvrId"
              label= {t('componentData.addAccountCK.InterchangeReceiverID')}
              onChange={(e) => this.handleInput(e)}
              dir="horizontal"
              size="small"
              inputProps={{
                maxLength: 15,
                minLength: 2,
              }}
              className={""}
            ></TextField>
          </Box>

          <Box my={5}>
            <TextField
              fullWidth={true}
              disabled={!canEdit}
              autoComplete="off"
              variant="outlined"
              value={GS02}
              onBlur={() => this.validateData()}
              error={validation.GS02 && validation.GS02.length > 0}
              helperText={validation.GS02}
              name="GS02"
              label= {t('componentData.addAccountCK.GS02Label')}
              onChange={(e) => this.handleInput(e)}
              dir="horizontal"
              size="small"
              inputProps={{
                maxLength: 15,
                minLength: 2,
              }}
              className={""}
            ></TextField>
          </Box>
          <Box my={5}>
            <TextField
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              disabled={!canEdit}
              error={validation.GS03 && validation.GS03.length > 0}
              helperText={validation.GS03}
              value={GS03}
              name="GS03"
              onBlur={() => this.validateData()}
              label= {t('componentData.addAccountCK.GS03Label')}
              onChange={(e) => this.handleInput(e)}
              dir="horizontal"
              size="small"
              inputProps={{
                maxLength: 15,
                minLength: 2,
              }}
              className={""}
            ></TextField>
          </Box>
        </Grid>

        {canEdit && (
          <Grid justify="center">
            <Box mt={5}>              
              <div
                style={{
                  justify: "center",
                  margin: "0 auto",
                  display: "table",
                  width: "340px",
                }}
              >
                <Box px={5}>
                  <Button
                    variant="outlined"
                    style={{
                      display: "inline-block",
                      float: "left",
                      padding: "6px 10px",
                      width: "120px",
                      margin: "0px 10px 0 0",
                      background: theme.palette.secondary.contrastText,
                      color: theme.palette.button.primary,
                    }}
                    color=""
                    onClick={onCancel}
                  >
                    {t('componentData.addAccountCK.Cancel')}
                  </Button>
                </Box>

                <Box px={2}>
                  {savingDetails ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <Button
                      variant="contained"
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        width: "120px",
                        margin: "0px 10px 0 0",
                      }}
                      color="primary"
                      onClick={this.saveDetails.bind(this)}
                    >
                      {t('componentData.addAccountCK.Save')}
                    </Button>
                  )}
                </Box>
              </div>
              {/* )} */}
            </Box>
          </Grid>
        )}
      </Grid>
    );
  }
}

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.client,
  ...state.clientConfig,
}))(CK));
