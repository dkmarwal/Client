import React from "react";
import {
  TextField, 
  Grid,  
  Box,
  Button,  
  CircularProgress  
} from "@material-ui/core";

import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';
import trim from 'deep-trim-node';
import {
  getB2CCheckDetailInfo, 
  settingUpdateB2CCheckDetail, 
  settingAddB2CCheckDetail} from '~/redux/actions/B2C/payments';

class B2CCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {           
          savingDetails: null,
          data: {
            clientId: null,
            ediInterchangeSenderId: null,
            ediGroupSenderId: null,
            ediGroupReceiverId: null,
            ediInterchangeReceiverId: null,
            originatingCompanyID: null,
            originatingDFIIdentification: null
          },
          error: {
            clientId: '',
            ediInterchangeSenderId: '',
            ediGroupSenderId: '',
            ediGroupReceiverId: '',
            ediInterchangeReceiverId: '',
            originatingCompanyID: '',
            originatingDFIIdentification: ''
          },
        };
      }

    async componentDidMount() {
      await this.getCheckAPIData();        
    }     

    onChange = (event) => {
      const field = event.target.name;
      const { data } = this.state;
      const newDetail = {...data};
      switch (field) {      
        case "originatingCompanyID":
             const originatingCompanyIdentifier = event.target.value.replace(/[^a-zA-Z0-9]/g, "");
             newDetail[field] = originatingCompanyIdentifier;
         break;
        case "originatingDFIIdentification":
            const originatingDFIIdentification = event.target.value.replace(/[^0-9]/g, "");
            newDetail[field] = originatingDFIIdentification;
         break;
        default:
          newDetail[field] = event.target.value || null;
          break;
      }
      this.setState({ data: { ...newDetail } });
    };  

    handleBlur = (event) => {
        const { name, value } = event.target;
        this.setState({
            data: {
            ...this.state.data,
            [name]: value?.trim() ?? value,
            },
        });
    };

    onSubmit = () => {   
      const {t} = this.props;             
        this.setState({            
            savingDetails: true
        });
        const valid = this.validation();
        
        if (valid) {
          const clientId = this.props.user.userData.portalProfileId || null;          
          this.setState({
            data:{
                ...this.state.data,  
                clientId: clientId
            }            
        },()=>{
            const checkData = trim(this.state.data);
            const {checkId} = this.state.data;               
            const {error} = this.props.payment;           

            if(!Boolean(checkId)){
              this.props.dispatch(settingAddB2CCheckDetail(checkData))
              .then((response) => {                
                if(response) {
                    this.setState({                                           
                      savingDetails: null
                    })    
                    this.props.notification("success", t("componentData.paymentMethods.InformationSaved"));   
                    this.props.closeModal(true)            
                } else {                
                  this.setState({   
                      savingDetails: null
                  });
                  //const errorMsg = Boolean(error) && error;
                  this.props.notification("error", error); 
                  this.props.closeModal(true)   
                  return false;
                }                           
              });
            }
            else{
              this.props.dispatch(settingUpdateB2CCheckDetail(checkData))
              .then((response) => {                 
                if (response) {
                    this.setState({                                    
                      savingDetails: null
                    })    
                    this.props.notification("success", t("componentData.paymentMethods.InformationUpdated"));   
                    this.props.closeModal(true)            
                } else {                
                  this.setState({
                      savingDetails: null
                  })  
                  //const errorMsg = Boolean(error) && error;
                  this.props.notification("error", error); 
                  this.props.closeModal(true)   
                  return false;
                }                           
              });
            }  
        }); 
        } else {
            this.setState({                           
                savingDetails: null
            })                 
            this.props.notification("error", t("componentData.paymentMethods.requiredInformation"));     
        }
      };

    validation = () => {
        const {t} = this.props;
        let valid = true;
        let validation = {};
        const {
          ediInterchangeSenderId,
          ediGroupSenderId,
          ediGroupReceiverId,
          ediInterchangeReceiverId,
          originatingCompanyID,
          originatingDFIIdentification
        } = this.state.data;

        if(!ediInterchangeSenderId || ediInterchangeSenderId.trim().length === 0){
            validation['ediInterchangeSenderId'] = t("componentData.paymentMethods.ediInterchangeSenderId2");
          valid = false;
        }        
        if(ediInterchangeSenderId && ediInterchangeSenderId.length < 2) {
          validation['ediInterchangeSenderId'] = t("componentData.paymentMethods.ediInterchangeSenderId3");
          valid = false;
        }

        if(!ediInterchangeReceiverId || ediInterchangeReceiverId.trim().length === 0){
            validation['ediInterchangeReceiverId'] = t("componentData.paymentMethods.ediInterchangeReceiverId2");
          valid = false;
        }
        if(ediInterchangeReceiverId && ediInterchangeReceiverId.length < 2) {
          validation['ediInterchangeReceiverId'] = t("componentData.paymentMethods.ediInterchangeReceiverId3");
          valid = false;
        }

        if(!ediGroupReceiverId || ediGroupReceiverId.trim().length === 0){
            validation['ediGroupReceiverId'] = t("componentData.paymentMethods.ediGroupReceiverId2");
          valid = false;
        }
        if(ediGroupReceiverId && ediGroupReceiverId.length < 2) {
          validation['ediGroupReceiverId'] = t("componentData.paymentMethods.ediGroupReceiverId3");
          valid = false;
        }

        if(!ediGroupSenderId || ediGroupSenderId.trim().length === 0){
            validation['ediGroupSenderId'] = t("componentData.paymentMethods.ediGroupSenderId2");
          valid = false;
        }
        if(ediGroupSenderId && ediGroupSenderId.length < 2) {
          validation['ediGroupSenderId'] = t("componentData.paymentMethods.ediGroupSenderId3");
          valid = false;
        }

        if(!originatingCompanyID || originatingCompanyID.trim().length === 0){
          validation['originatingCompanyID'] = t("componentData.paymentMethods.originatingCompanyID2");
          valid = false;
        }
        if(originatingCompanyID && originatingCompanyID.length < 10){
          validation['originatingCompanyID'] = t("componentData.paymentMethods.originatingCompanyID3");
          valid = false;
        }

        if(!originatingDFIIdentification || originatingDFIIdentification.trim().length === 0){
          validation['originatingDFIIdentification'] = t("componentData.paymentMethods.OriginatingDFIIdentificationReq");
          valid = false;
        }

        if(originatingDFIIdentification && originatingDFIIdentification.length < 9){
          validation['originatingDFIIdentification'] = t("componentData.paymentMethods.errOriginatingDFIIdentification");
          valid = false;
        }

        this.setState({
          error: {
            ...validation,
          },
        });
        return valid;
    };

    getCheckAPIData = async () => {        
        const clientId = this.props.user.userData.portalProfileId || null;
        const APIData = await getB2CCheckDetailInfo({clientId});                
        this.setState({
            data: {
              ...APIData.data,
            },
          });
      };     
      

    onCancel =()=>{
        this.props.onCancel(true)
    }

  render() {
    const { t, canEdit} = this.props;    
    const { error, savingDetails } = this.state;
    const {
      ediInterchangeSenderId,
      ediGroupSenderId,
      ediGroupReceiverId,
      ediInterchangeReceiverId,
      originatingCompanyID,
      originatingDFIIdentification
    } = this.state.data;      

    const { theme } = this.props.clientConfig.layout; 
                   
    return (
    <Grid container>        
        <Grid container justify="flex-start">
            <Grid item xs={12} sm={6}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 2,
                    readOnly: !canEdit ? true : false
                  }}
                  label= {t("componentData.paymentMethods.ediInterchangeSenderId")}
                  error={error.ediInterchangeSenderId}
                  helperText={error.ediInterchangeSenderId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={ediInterchangeSenderId}
                  name="ediInterchangeSenderId"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  required                  
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 2,
                    readOnly: !canEdit ? true : false
                  }}
                  label= {t("componentData.paymentMethods.ediInterchangeReceiverId")}
                  error={error.ediInterchangeReceiverId}
                  helperText={error.ediInterchangeReceiverId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={ediInterchangeReceiverId}
                  name="ediInterchangeReceiverId"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  required                  
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 2,
                    readOnly: !canEdit ? true : false
                  }}
                  label= {t("componentData.paymentMethods.ediGroupSenderId")}
                  error={error.ediGroupSenderId}
                  helperText={error.ediGroupSenderId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={ediGroupSenderId}
                  name="ediGroupSenderId"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  required                  
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 2,
                    readOnly: !canEdit ? true : false
                  }}
                  label={t("componentData.paymentMethods.ediGroupReceiverId")}
                  error={error.ediGroupReceiverId}
                  helperText={error.ediGroupReceiverId}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={ediGroupReceiverId}
                  name="ediGroupReceiverId"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  required                  
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 10,
                    minLength: 10,
                    readOnly: !canEdit ? true : false
                  }}
                  label={t("componentData.paymentMethods.originatingCompanyID")}
                  error={error.originatingCompanyID}
                  helperText={error.originatingCompanyID}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={originatingCompanyID}
                  name="originatingCompanyID"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  required                  
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 9,
                    minLength: 9,
                    readOnly: !canEdit ? true : false
                  }}
                  label={t("componentData.paymentMethods.originatingDFIIdentificationLable")}
                  error={error.originatingDFIIdentification}
                  helperText={error.originatingDFIIdentification}
                  fullWidth={true}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  value={originatingDFIIdentification}
                  name="originatingDFIIdentification"
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  required                  
                />
              </Box>
            </Grid>


          </Grid> 

        {canEdit && (
          <Grid justify="center" style={{width: "100%"}}>
            <Box mt={2}>              
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
                      width: "130px",
                      margin: "0px 10px 0 0",
                      background: theme.palette.secondary.contrastText,
                      color: theme.palette.button.primary,
                    }}                   
                    onClick={this.onCancel}
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
                        width: "130px",
                        margin: "0px 10px 0 0",
                        background: "#008CE6"
                      }}
                      color="primary"
                      onClick={this.onSubmit}
                    >
                      {t('componentData.addAccountCK.Save')}
                    </Button>
                  )}
                </Box>
              </div>
              
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
  ...state.payment,
}))(B2CCheck));
