import React, { Component } from "react";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import {
  Grid,
  Box,
  MenuItem,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { RadioGroup, Radio } from "@material-ui/core";
import MaskInput from "~/components/MaskInput";
import TextField from "~/components/Forms/TextField";
import { connect } from "react-redux";
import {
    priorityTypeList,
    fetchUSBankCheckData,
    updateUSBankCheckData,
    createUSBankCheckData,
    getUSbankZelleData,
} from "~/redux/actions/USbank/payments";
import { paymentMethods } from '~/config/paymentMethods';
import trim from "deep-trim-node";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { withTranslation } from "react-i18next";

class USbankCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
        checkDetail: {
            data: {
              clientId: '',
              zellePayFromAccountNumber: '',
              zellePayerId: '',
              zellePriorityType: 1,
              enableCheckToZelleEnrolledPayees: false,
            },
            error: {
              clientId: '',
              zellePayFromAccountNumber: '',
              zellePayerId: '',
              zellePriorityType: '',
            },
          },
        
          clientCheckId:  props.USBankPayment?.checkDetail?.[0]?.id,
          saveProcessing: false,
    };
  }

  async componentDidMount() {
    this.fetchPriorityTypeList();
    this.getCheckAPIData();
  }
  componentDidUpdate = (prevProps) => {
    
    if (
      (!prevProps.USBankPayment.checkDetail?.length &&
        this.props.USBankPayment.checkDetail?.length) ||
      (prevProps.USBankPayment.checkDetail?.length &&
        this.props.USBankPayment.checkDetail?.length &&
        JSON.stringify(prevProps.USBankPayment.checkDetail[0]) !==
          JSON.stringify(this.props.USBankPayment.checkDetail[0]))
    ) {
      this.setState({
        checkDetail: {
          ...this.state.checkDetail,
          data: this.props.USBankPayment.checkDetail[0],
        },
      });
    }
  };
  getCheckAPIData = () => {
    const { showParentData, clientId, parentId, setErrorText, setVariant } =
    this.props;
    let Id = clientId;
    if (showParentData && parentId) {
      Id = this.props.parentId;
    }
    this.props.dispatch(fetchUSBankCheckData(Id,showParentData)).then((response) => {
      if (response && response.error) {
        const errorMsg =
          this.props.USBankPayment &&
          this.props.USBankPayment.error
            ? this.props.USBankPayment.error
            : null;
            setVariant("error");
            setErrorText(
                errorMsg 
            );
        
        return false;
      } else {
        this.setAPIDataInState();
      }
    });
  };
  setAPIDataInState = () => {
    if (this.props.USBankPayment.checkDetail?.length) {
      let finalCheckDetails = this.props.USBankPayment?.checkDetail[0];
      if (this.props.showParentData) {
        const { id, ...restDetail } =
          this.props.USBankPayment?.checkDetail[0];
        finalCheckDetails = restDetail;
      }
      if (
        Object.keys(this.props.USBankPayment?.checkDetail[0]).length
      ) {
        this.setState({
          checkDetail: {
            ...this.state.checkDetail,
            data: {
              ...finalCheckDetails,
              id: this.state.clientCheckId ?? undefined,
            },
          },
        });
      }
    }
  };
  fetchPriorityTypeList = () => {
    const {
        setErrorText,
        setVariant, 
      } = this.props;
    this.props.dispatch(priorityTypeList()).then((response) => {
      if (response && response.error) {
        setVariant("error");
        setErrorText(
            this.props.USBankPayment?.priorityTypeList.error 
        );
        
        return false;
      }
    });
  };
  onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    if (name === 'zellePriorityType') {
      value = value === '' ? null : value;
    } else if (name === 'zellePayerId') {
    } else {
      value = value === '' ? null : value.replace(/[^0-9]/g);
    }
    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        data: { ...this.state.checkDetail.data, [name]: value },
      },
    });
  };

  handleBlur = (event) => {
    const { name, value } = event.target;
    const { t } = this.props;
    let validation = {};
    switch (name) {
      case 'zellePayerId':
        if (!value || !value?.trim().length) {
          validation['zellePayerId'] =   t(
            "componentData.USbankCheck.zellePayerIdreq"
          );
        } else if (value && value.length > 10) {
          validation['zellePayerId'] =
          t(
            "componentData.USbankCheck.zellePayerIdreqMaxLen"
          );
        } else if (value && value.length < 3) {
          validation['zellePayerId'] =
          t(
            "componentData.USbankCheck.zellePayerIdreqMinLen"
          );
        } else validation['zellePayerId'] = '';
        break;
      case 'zellePayFromAccountNumber':
        if (!value || !value.length) {
          validation['zellePayFromAccountNumber'] =
          t(
            "componentData.USbankCheck.accountNumberreq"
          );;
        } else if (value && value.length > 17) {
          validation['zellePayFromAccountNumber'] = t('componentData.USbankCheck.acNumMaxLen');
        } else if (value && value.length < 6) {
          validation['zellePayFromAccountNumber'] = t('componentData.USbankCheck.acNumMinLen');
        }
        else validation['zellePayFromAccountNumber'] = '';
        break;
      default:
        break;
    }

    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        error: {
          ...this.state.checkDetail.error,
          ...validation,
        },
      },
    });
  };

  handleRadioButton = (event) => {
    const targetVal = event.target.value === 'true' || event.target.value === true
    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        data: {
          ...this.state.checkDetail.data,
          enableCheckToZelleEnrolledPayees: targetVal,
        },
      },
    });
  };

  renderNotification = (type) => {
    const {
        t,
        setErrorText,
        setVariant,
      } = this.props;
    
    if (type) {
        setVariant("error");
        setErrorText(
            this.props.USBankPayment.error
        );
      
    } else {
        setVariant("success");
        setErrorText(
            this.props.USBankPayment?.success ??
            t("componentData.USbankCheck.infoUpdated")
        );
    
    }
  };

  getAddedCheckData = () => {
    const checkId =
      this.props.USBankPayment.checkDetail?.data?.id  || null;
    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        data: {
          ...this.state.checkDetail.data,
          id: checkId ?? null,
        },
      },
      clientCheckId: checkId,
    });
  };

  isZelleSelected = () => {
    const zellePayment = this.props.sortedSelectedMethods.filter(
      (payMethod) => {
        return payMethod.label === paymentMethods.USBankZelle;
      }
    );
    if (zellePayment?.length) {
      return true;
    }
    return false;
  };

  onSubmit = () => {
   
    const valid = this.validation();
    const {
        setErrorText,
        setVariant,
        clientId,
      } = this.props;
    
    const tempProps = this.props;
    if (valid) {
  
      this.setState({
        saveProcessing: true,
      });
      const checkData = trim(this.state.checkDetail?.data);
      if (checkData.id || this.state.clientCheckId||this.props.USBankPayment?.checkDetail?.[0]?.id) {
        this.props
          .dispatch(updateUSBankCheckData(checkData, clientId,this.props.USBankPayment?.checkDetail?.[0]?.id))
          .then((response) => {
            if (response && !response.error) {
               
              this.renderNotification();
              this.setState({
                saveProcessing: false,
              });
           
            tempProps.handleCollapse(tempProps.paymentType);
              const isZellePaymentMethodSelected = this.isZelleSelected();
              
              if (
                isZellePaymentMethodSelected
              ) {
                this.props.dispatch(getUSbankZelleData(clientId));
              }
             
            } else {
              
              this.renderNotification('error');
              this.setState({
                saveProcessing: false,
              });
              return false;
            }
          });
      } else {
        tempProps
          .dispatch(createUSBankCheckData(checkData, clientId))
          .then((response) => {
            if (response && !response.error) {
              this.setState({
                saveProcessing: false,
              });
              const isZellePaymentMethodSelected = this.isZelleSelected();
              if (
                isZellePaymentMethodSelected
              ) {
                this.props.dispatch(getUSbankZelleData(clientId));
              }
              this.getAddedCheckData();
           
              this.renderNotification();
              tempProps.handleCollapse(tempProps.paymentType);
            } else {
              this.renderNotification('error');
              this.setState({
                saveProcessing: false,
              });
              return false;
            }
          });
      }
    } else {
        setVariant("error");
        setErrorText(this.props.checkDetail.error);
    }
  };

  validation = () => {
    let valid = true;
    let validation = {};
    const { t } = this.props;
    const { zellePayerId,  zellePayFromAccountNumber} =
      this.state.checkDetail.data;
    if (!zellePayerId || !zellePayerId.trim()?.length) {
      validation['zellePayerId'] =  t(
        "componentData.USbankCheck.zellePayerIdreq"
      );;
      valid = false;
    } else if (zellePayerId.trim().length < 3) {
      validation['zellePayerId'] = t(
        "componentData.USbankCheck.zellePayerIdreqMinLen"
      );
      valid = false;
    } else if (zellePayerId.trim().length > 10) {
      validation['zellePayerId'] =
      t(
        "componentData.USbankCheck.zellePayerIdreqMaxLen"
      );
      valid = false;
    }
    if (
      !zellePayFromAccountNumber ||
      !zellePayFromAccountNumber.trim()?.length
    ) {
      validation['zellePayFromAccountNumber'] = t(
        "componentData.USbankCheck.accountNumberreq"
      );
      valid = false;
    } else if (zellePayFromAccountNumber && zellePayFromAccountNumber.length > 17) {
      validation['zellePayFromAccountNumber'] = t('componentData.USbankCheck.acNumMaxLen');
      valid = false;
    } else if (zellePayFromAccountNumber && zellePayFromAccountNumber.length < 6) {
      validation['zellePayFromAccountNumber'] = t('componentData.USbankCheck.acNumMinLen');
      valid = false;
    }
    this.setState({
      checkDetail: {
        ...this.state.checkDetail,
        error: { ...validation },
      },
    });
    return valid;
  };
  

  render() {
    const { classes,t } = this.props;
    const { data, error } = this.state.checkDetail;
    const {
      zellePayerId,
      zellePriorityType,
      zellePayFromAccountNumber,
      enableCheckToZelleEnrolledPayees,
    } = data;

    return (
        <Box>
        <Grid container justifyContent='center' spacing={2}>
          <Grid container justifyContent='flex-start'>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label={t("componentData.USbankCheck.payerID")}
                placeholder={t("componentData.USbankCheck.payerIDPlaceholder")}
                  error={Boolean(error.zellePayerId)}
                  helperText={error.zellePayerId}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={zellePayerId}
                  name='zellePayerId'
                  onChange={this.onChange}
                  onBlur={this.handleBlur}
                  required
                  inputProps={{
                    maxLength: 10,
                    minLength: 3,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label={t("componentData.USbankCheck.priorityType")}
                  error={Boolean(error.zellePriorityType)}
                  helperText={error.zellePriorityType}
                  fullWidth={true}
                  variant='outlined'
                  value={zellePriorityType}
                  name='zellePriorityType'
                  onChange={this.onChange}
                  required
                  select
                >
                  {this.props.USBankPayment?.priorityTypeList?.data?.map(
                    ({ description, priorityTypeId }) => (
                      <MenuItem key={priorityTypeId} value={priorityTypeId}>
                        {description}
                      </MenuItem>
                    )
                  )}
                </TextField>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <MaskInput
                  id='zellePayFromAccountNumber'
                  color='primary'
                  label={t("componentData.USbankCheck.accountNumber")}
                placeholder={t("componentData.USbankCheck.accountNumberPlaceholder")}
                  required
                  error={Boolean(error.zellePayFromAccountNumber)}
                  helperText={error.zellePayFromAccountNumber}
                  name='zellePayFromAccountNumber'
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  inputProps={{ minLength: 1, maxLength: 17 }}
                  InputLabelProps={{ className: classes.input }}
                  value={zellePayFromAccountNumber}
                  onBlur={this.handleBlur}
                  getValue={(val) => {
                    this.setState({
                      checkDetail: {
                        ...this.state.checkDetail,
                        data: {
                          ...this.state.checkDetail.data,
                          zellePayFromAccountNumber: val,
                        },
                      },
                    });
                  }}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              className={classes.gridItem}
              style={{ display: 'flex' }}
            >
              <Box
                display={'flex'}
                alignItems='center'
                style={{ margin: 'auto', marginLeft: '10px' }}
              >
                <Typography className={classes.panelHeading}>
                {t("componentData.USbankCheck.enabled")}
                </Typography>
                <RadioGroup
                  name='enableCheckToZelleEnrolledPayees'
                  onChange={this.handleRadioButton}
                  value={enableCheckToZelleEnrolledPayees ?? false}
                  style={{ flexDirection: 'row',paddingLeft: "15px" }}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio color='primary' />}
                    label={t("componentData.USbankCheck.yes")}
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio color='primary' />}
                    label={t("componentData.USbankCheck.no")}
                  />
                </RadioGroup>
              </Box>
            </Grid>
          </Grid>
          <Grid container item xs={11} justify='center'>
            {this.state.saveProcessing ? (
              <CircularProgress color='primary' />
            ) : (
              <Button
                className={classes.button}
                variant='contained'
                color='primary'
                onClick={() => this.onSubmit()}
                style={{ color: 'white' }}
              >
               { t("componentData.USbankCheck.saveBtn")}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.clientConfig,
    ...state.b2cPayments,
    ...state.user,
    ...state.payment,
    ...state.csc,
    ...state.USBankPayment,
  }))(withStyles(styles)(USbankCheck))
);
