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
  getUSbankZelleData,
  priorityTypeList,
  updateUSbankZelle,
  addUSbankZelle,
} from "~/redux/actions/USbank/payments";

import trim from "deep-trim-node";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { withTranslation } from "react-i18next";

class Zelle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasSaveBtnClicked: false,
      saveProcessing: false,
      cardData: {
        clientId: null,
        zellePayerId: "",
        zellePriorityType: 1,
        convertToCheckIfZelleFailed: false,
        convertToCheckIfZelleExp: false,
        zellePayFromAccountNumber: "",
      },
      errorData: {
        zellePayerId: null,
        zellePriorityType: null,
        convertToCheckIfZelleFailed: null,
        convertToCheckIfZelleExp: null,
        zellePayFromAccountNumber: null,
      },
    };
  }

  async componentDidMount() {
    await this.getCardData();
    this.fetchPriorityTypeList();
  }
 

  onRadiobuttonChange = (event, name) => {
    const targetVal =
      event.target.value === "true" || event.target.value === true;
    this.setState({
      ...this.state,
      cardData: {
        ...this.state.cardData,
        [name]: targetVal,
      },
    });
  };
  onChangeselect = (event) => {
    const { name, value } = event.target;

    this.setState({
      cardData: {
        ...this.state.cardData,
        [name]: value,
      },
    });
  };

  onChange = (event) => {
    const numeric = /^[0-9]*\.?[0-9]*$/;
    const { name, value } = event.target;
    if (name === "zellePayFromAccountNumber") {
      if (numeric.test(value)) {
        this.setState({
          cardData: {
            ...this.state.cardData,
            [name]: event.target.value,
          },
        });
      }
    } else {
      this.setState({
        cardData: {
          ...this.state.cardData,
          [name]: event.target.value.trim(),
        },
      });
    }
  };

  handleBlur = (event) => {
    const { name, value } = event.target;
    const { t } = this.props;
    let validation = {};
    switch (name) {
      case "zellePayerId":
        if (!value || value.trim().length === 0) {
          validation["zellePayerId"] = t(
            "componentData.USbankZelle.zellePayerIdreq"
          );
        }
        if (value && value.length > 10) {
          validation["zellePayerId"] = t(
            "componentData.USbankZelle.zellePayerIdreqMaxLen"
          );
        }
        if (value && value.length < 3) {
          validation["zellePayerId"] = t(
            "componentData.USbankZelle.zellePayerIdreqMinLen"
          );
        }
        break;
      case "zellePayFromAccountNumber":
        if (!value || value.length === 0) {
          validation["zellePayFromAccountNumber"] = t(
            "componentData.USbankZelle.accountNumberreq"
          );
        } 
        else if (value && value.length > 17) {
          validation['zellePayFromAccountNumber'] = t('componentData.USbankZelle.acNumMaxLen');
        } else if (value && value.length < 6) {
          validation['zellePayFromAccountNumber'] = t('componentData.USbankZelle.acNumMinLen');
        }
        break;

      default: {
        break;
      }
    }

    this.setState({
      errorData: {
        ...validation,
      },
    });
  };

  saveZelleData = () => {
    let valid = true;
    let validation = {};
    const { t } = this.props;
    const { zellePayerId, zellePayFromAccountNumber } = this.state.cardData;

    if (!zellePayerId || zellePayerId.trim().length === 0) {
      validation["zellePayerId"] = t(
        "componentData.USbankZelle.zellePayerIdreq"
      );
      valid = false;
    }
    if (zellePayerId && zellePayerId.length > 10) {
      validation["zellePayerId"] = t(
        "componentData.USbankZelle.zellePayerIdreqMaxLen"
      );
      valid = false;
    }
    if (zellePayerId && zellePayerId.length < 3) {
      validation["zellePayerId"] = t(
        "componentData.USbankZelle.zellePayerIdreqMinLen"
      );
      valid = false;
    }
    if (!zellePayFromAccountNumber || zellePayFromAccountNumber.length === 0) {
      validation["zellePayFromAccountNumber"] = t(
        "componentData.USbankZelle.accountNumberreq"
      );
      valid = false;
    }
    
    if (zellePayFromAccountNumber && zellePayFromAccountNumber.length > 17) {
      validation['zellePayFromAccountNumber'] = t('componentData.USbankZelle.acNumMaxLen');
      valid = false;
    } else if (zellePayFromAccountNumber && zellePayFromAccountNumber.length < 6) {
      validation['zellePayFromAccountNumber'] = t('componentData.USbankZelle.acNumMinLen');
      valid = false;
    }
    

    this.setState({
      errorData: {
        ...validation,
      },
    });
    return valid;
  };

  onSubmit = () => {
    const { t } = this.props;
    
    const valid = this.saveZelleData();

    if (valid) {
      this.setState(
        {
          ...this.state,
          saveProcessing: true,
        },
        this.storeDataInDB())
    } else {
      const { notification } = this.props;
      notification('error', t('componentData.onboardZelle.ValidationError'));
    }
  };
  storeDataInDB = () => {
    const { t, notification, closeModal } = this.props;
    const clientId = this.props.user.userData.portalProfileId || null;
    const cardStateData = trim(this.state.cardData);
    
    if (cardStateData.id) {
     
      this.props
        .dispatch(
          updateUSbankZelle(cardStateData, clientId)
        )
        .then((response) => {
          if (response && !response.error) {
            
            notification(
              'success',this.props.USBankPayment?.success ??
              t('componentData.onboardZelle.infoUpdated')
            );
            this.setState(
              {
                ...this.state,
                saveProcessing: false,
              },
              () => closeModal(true)
            );
          } else {
            notification('error', this.props.USBankPayment.error);
            this.setState({
              ...this.state,
              saveProcessing: false,
            });
            return false;
          }
        });
    }
    else 
     {
      this.props
        .dispatch(addUSbankZelle(cardStateData, clientId))
        .then((response) => {
          if (response && !response.error) {
           
            notification('success', this.props.USBankPayment?.success ??t('componentData.onboardZelle.infoSaved'));
            this.setState(
              {
                ...this.state,
                saveProcessing: false,
              },
              () => closeModal(true)
            );
          } else {
            notification('error', this.props.USBankPayment.error);
            this.setState({
              ...this.state,
              saveProcessing: false,
            });
            return false;
          }
        });
    } 
    }


  getCardData = () => {
    const { t, notification } = this.props;
    const clientId = this.props.user.userData.portalProfileId || null;
    if (!this.props.isAddAccount) 
    {
    this.props.dispatch(getUSbankZelleData(clientId)).then((response) => {
      if (response && response.error) {
        notification(
          'error',
          (this.props.getZelleData && this.props.getZelleData.error) ||
            t('componentData.onboardZelle.somthingWrong')
        );
        return false;
      } else {
        this.passAPIDataOnTextField();
      }
    });
  };
}

  passAPIDataOnTextField = () => {
    if (
      this.props.USBankPayment?.zelleDetail &&
      this.props.USBankPayment?.zelleDetail.length > 0
    ) {
      const { showParentData } = this.props;
      let finalZelleDetails = this.props.USBankPayment.zelleDetail[0];
      if (showParentData) {
        const { id, ...restDetail } = this.props.USBankPayment.zelleDetail[0];
        finalZelleDetails = restDetail;
      }

      this.setState({
        ...this.state,
        cardData: {
          zellePayerId: finalZelleDetails.zellePayerId,
          zellePriorityType: finalZelleDetails.zellePriorityType,

          convertToCheckIfZelleFailed:
            finalZelleDetails.convertToCheckIfZelleFailed,
          convertToCheckIfZelleExp: finalZelleDetails.convertToCheckIfZelleExp,
          zellePayFromAccountNumber:
            finalZelleDetails.zellePayFromAccountNumber,
          id: finalZelleDetails.id,
        },
      });
    }
  };

  fetchPriorityTypeList = () => {
    const { notification } = this.props;
    this.props.dispatch(priorityTypeList()).then((response) => {
      if (response && response.error) {
        notification(
          'error',
          (this.props.USBankPayment?.priorityTypeList?.error) 
        );
        return false;
      }
      
    });
  };

  onCancel = () => {
    this.props.onCancel(true);
  };

  render() {
    const { classes, t, onCancel} = this.props;
 
    return (
      <>
       <Box className={classes.popupInner}>
          <Grid container>
            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                name="zellePayerId"
                color="primary"
                label={t("componentData.USbankZelle.payerID")}
                placeholder={t("componentData.USbankZelle.payerIDPlaceholder")}
                required
                variant="outlined"
                value={this.state.cardData.zellePayerId}
                onChange={this.onChange}
                onBlur={this.handleBlur}
                disabled={false}
                autoComplete="off"
                inputProps={{ maxLength: 10, minLength: 3 }}
                error={Boolean(this.state.errorData.zellePayerId)}
                helperText={this.state.errorData.zellePayerId}
                // InputLabelProps={{
                //   shrink: true,
                // }}
              />
            </Grid>
            <Grid item xs={6} className={classes.inputBox}>
              <TextField
                name="zellePriorityType"
                color="primary"
                select
                label={t("componentData.USbankZelle.priorityType")}
                required
                value={this.state.cardData.zellePriorityType}
                dir="horizontal"
                // SelectProps={{
                //   native: true,
                // }}
                fullWidth={true}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                autoComplete="off"
                onChange={this.onChangeselect}
                onBlur={this.handleBlur}
              >
                {this.props.USBankPayment?.priorityTypeList?.data &&
                  this.props.USBankPayment.priorityTypeList?.data.map(
                    ({ description, priorityTypeId }) => (
                      <MenuItem key={priorityTypeId} value={priorityTypeId}>
                        {description}
                      </MenuItem>
                    )
                  )}
              </TextField>
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <MaskInput
                id="zellePayFromAccountNumber"
                color="primary"
                label={t("componentData.USbankZelle.accountNumber")}
                placeholder={t("componentData.USbankZelle.accountNumberPlaceholder")}
                required
                error={Boolean(this.state.errorData.zellePayFromAccountNumber)}
                helperText={this.state.errorData.zellePayFromAccountNumber}
                name="zellePayFromAccountNumber"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                inputProps={{ minLength: 1, maxLength: 17 }}
                InputLabelProps={{ className: classes.input }}
                value={this.state.cardData.zellePayFromAccountNumber}
                onBlur={this.handleBlur}
                getValue={(val) => {
                  this.setState({
                    cardData: {
                      ...this.state.cardData,
                      zellePayFromAccountNumber: val,
                    },
                  });
                }}
              />
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <Box display="flex" justifyContent="flex-start">
                <Box width="300px" style={{ margin: "auto" }}>
                  <Typography className={classes.panelHeading}>
                    {t("componentData.USbankZelle.expired")}
                  </Typography>
                </Box>

                <Box width="300px">
                  <RadioGroup
                    row
                    aria-label="position"
                    name="convertToCheckIfZelleExp"
                    value={
                      this.state.cardData.convertToCheckIfZelleExp ?? false
                    }
                    onChange={(e) =>
                      this.onRadiobuttonChange(e, "convertToCheckIfZelleExp")
                    }
                    className={classes.test}
                    
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio classes={{root:classes.radiobuttonicon}} color="primary"  />}
                      label={t("componentData.USbankZelle.yes")}
                      labelPlacement="end"
                      classes={{root:classes.radiobuttonoption,label:classes.radiobuttonlabel}}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio classes={{root:classes.radiobuttonicon}} color="primary" />}
                      label={t("componentData.USbankZelle.no")}
                      labelPlacement="end"
                      classes={{root:classes.radiobuttonoption,label:classes.radiobuttonlabel}}
                    />
                  </RadioGroup>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <Box display="flex" justifyContent="flex-start">
                <Box width="300px" style={{ margin: "auto" }}>
                  <Typography className={classes.panelHeading}>
                    {t("componentData.USbankZelle.failed")}
                  </Typography>
                </Box>
                {/* <Box pl={4}> */}
                <Box width="300px">
                  {/* <Box pl={4}> */}
                  <RadioGroup
                    row
                    aria-label="position"
                    name="convertToCheckIfZelleFailed"
                    value={
                      this.state.cardData.convertToCheckIfZelleFailed ?? false
                    }
                    onChange={(e) =>
                      this.onRadiobuttonChange(e, "convertToCheckIfZelleFailed")
                    }
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio color="primary" classes={{root:classes.radiobuttonicon}}/>}
                      label={t("componentData.USbankZelle.yes")}
                      labelPlacement="end"
                      classes={{root:classes.radiobuttonoption,label:classes.radiobuttonlabel}}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio color="primary" classes={{root:classes.radiobuttonicon}} />}
                      label={t("componentData.USbankZelle.no")}
                      labelPlacement="end"
                      classes={{root:classes.radiobuttonoption,label:classes.radiobuttonlabel}}
                    />
                  </RadioGroup>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container item xs={12} justify="center">
          <Button
              variant="outlined"
              style={{
                display: 'inline-block',
                padding: '6px 6px',
                width: '120px',
                margin: '0px 10px 0 0',
              }}
              onClick={onCancel}
            >
              {t('componentData.addAccountCK.Cancel')}
            </Button>
            {this.state.saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={() => this.onSubmit()}
                style={{ color: "white" }}

                // const valid = this.validateForm("ACH") || true;
              >
                {t("componentData.USbankZelle.saveBtn")}
              </Button>
            )}
          </Grid>
        </Box>
      </>
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
  }))(withStyles(styles)(Zelle))
);
