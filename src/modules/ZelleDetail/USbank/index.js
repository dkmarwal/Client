import React, { Component } from "react";
import styles from "../styles";
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
  fetchUSBankCheckData
} from "~/redux/actions/USbank/payments";

import trim from "deep-trim-node";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { withTranslation } from "react-i18next";
import { paymentMethods } from '~/config/paymentMethods.js';
class USbankZelle extends Component {
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
  }
  componentDidUpdate = (prevProps) => {
    
    if (
      (!prevProps.USBankPayment?.zelleDetail?.length &&
        this.props.USBankPayment?.zelleDetail?.length) ||
      (prevProps.USBankPayment?.zelleDetail?.length &&
        this.props.USBankPayment?.zelleDetail?.length &&
        JSON.stringify(prevProps.USBankPayment?.zelleDetail[0]) !==
          JSON.stringify(this.props.USBankPayment?.zelleDetail[0]))
    ) {
      this.setState({
        cardData: {
          ...this.state.cardData,
          ...this.props.USBankPayment.zelleDetail[0],
        },
      });
    }
  };
  getCardData = () => {
    const { showParentData, clientId, parentId, setErrorText, setVariant } =
      this.props;

    let Id = clientId;
    if (showParentData && parentId) {
      Id = parentId;

      this.setState({
        showParentList: true,
      });
    }

    if (
      this.props.USBankPayment?.zelleDetail &&
      this.props.USBankPayment.zelleDetail.length
    ) {
      this.setState({
        cardData: {
          ...this.state.cardData,
          id: this.props.USBankPayment.zelleDetail[0]?.id ?? null,
        },
      });
    }
    this.props
      .dispatch(getUSbankZelleData(Id, showParentData))
      .then((response) => {
        if (response && response.error) {
          setErrorText(this.props.USBankPayment.error);
          setVariant("error");

          return false;
        } else {
          this.passAPIDataOnTextField();
        }
      });
  };

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
        } else if (value && value.length > 17) {
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
    else if (zellePayFromAccountNumber && zellePayFromAccountNumber.length > 17) {
      validation['zellePayFromAccountNumber'] = t('componentData.USbankZelle.acNumMaxLen');
      valid = false;
    } else if (zellePayFromAccountNumber && zellePayFromAccountNumber.length < 6) {
      validation['zellePayFromAccountNumber'] = t('componentData.USbankZelle.acNumMinLen');
      valid = false;}

    this.setState({
      errorData: {
        ...validation,
      },
    });
    return valid;
  };
 

  onSubmit = () => {
    const { t, setErrorText, setVariant } = this.props;
    const valid = this.saveZelleData();
    if (valid) {
      this.storeDataInDB();
    } else {
      setErrorText(t("componentData.USbankZelle.validationError"));
      setVariant("error");
    }
  };
  isCheckSelected = () => {
    const checkPayment = this.props.sortedSelectedMethods.filter(
      (payMethod) => {
        return payMethod.label === paymentMethods.USBankCHK;
      }
    );
    if (checkPayment?.length) {
      return true;
    }
    return false;
  };
  storeDataInDB = () => {
    const {
      t,
      clientId,
      setErrorText,
      setVariant,
      handleCollapse,
      paymentTypeId,

    } = this.props;
    const cardStateData = trim(this.state.cardData);
    if (cardStateData.id||this.props.USBankPayment.zelleDetail?.data?.id) {
      this.props
        .dispatch(updateUSbankZelle(cardStateData, clientId,this.props.USBankPayment?.checkDetail?.[0]?.id))
        .then((response) => {
          if (response && !response.error) {
            this.setState({
              showParentList: false,
            });
            this.setState({
              saveProcessing: false,
            });
            setVariant("success");
            setErrorText(
              this.props.USBankPayment?.success ??
                t("componentData.USbankZelle.infoUpdated")
            );

            handleCollapse(paymentTypeId);
            const isCheckPaymentMethodSelected = this.isCheckSelected();
            if (
              isCheckPaymentMethodSelected
            ) {
              this.props.dispatch(fetchUSBankCheckData(clientId));
            }
          } else {
            setVariant("error");
            setErrorText(this.props.USBankPayment.error);

            return false;
          }
        });
    } else {
      this.props
        .dispatch(addUSbankZelle(cardStateData, clientId))
        .then((response) => {
          if (response && !response.error) {
            const isCheckPaymentMethodSelected = this.isCheckSelected();
            if (
              isCheckPaymentMethodSelected
            ) {
              this.props.dispatch(fetchUSBankCheckData(clientId));
            }
            this.setState({
              ...this.state,
              hasSaveBtnClicked: true,
              cardData: {
                ...cardStateData,   
                id:  this.props.USBankPayment.zelleDetail?.data?.id ?? null,
              },
              showParentList: false,
            });

            setVariant("success");
            setErrorText(
              this.props.USBankPayment?.success ??
                t("componentData.USbankZelle.infoSaved")
            );
            handleCollapse(paymentTypeId);
          } else {
            setVariant("error");
            setErrorText(this.props.USBankPayment.error);

            return false;
          }
        });
    }
  };

  handleNotification = (type, errorMsg) => {
    this.props.setVariant(type);
    this.props.setErrorText(errorMsg);
  };

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
    this.fetchPriorityTypeList();
  };

  fetchPriorityTypeList = () => {
    const { setErrorText, setVariant } = this.props;
    this.props.dispatch(priorityTypeList()).then((response) => {
      if (response && response.error) {
        setErrorText(this.props.USBankPayment?.priorityTypeList?.error);
        setVariant("error");
   
        return false;
      }
      
    });
  };

  render() {
    const { classes, t} = this.props;

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
                <Box width="500px" style={{ margin: "auto" }}>
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
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio color="primary" />}
                      label={t("componentData.USbankZelle.yes")}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio color="primary" />}
                      label={t("componentData.USbankZelle.no")}
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} className={classes.inputBox}>
              <Box display="flex" justifyContent="flex-start">
                <Box width="500px" style={{ margin: "auto" }}>
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
                      control={<Radio color="primary" />}
                      label={t("componentData.USbankZelle.yes")}
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio color="primary" />}
                      label={t("componentData.USbankZelle.no")}
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Grid container item xs={12} justify="center">
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
  }))(withStyles(styles)(USbankZelle))
);
