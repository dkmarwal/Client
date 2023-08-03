import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@material-ui/core";
import trim from "deep-trim-node";
import TextField from "~/components/Forms/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { USBANK_TRANSACTION_TYPE } from "~/config/entityTypes";
import {
  updateUSbankDeposittodebit,
  addUSbankDeposittodebit,
  getUSbankDeposittodebitData,
} from "~/redux/helpers/USbank/payments";

const useStyles = makeStyles((theme) => ({
  popupInner: {
    float: "left",
    width: "100%",
    padding: "0",
    boxSizing: "border-box",
  },

  inputBox: {
    float: "left",
    padding: "10px 10px 0",
    minHeight: "80px",
    "& .MuiTextField-root": {
      width: "100%",
    },
    "& .MuiFormControl-root": {
      width: "100%",
    },
    "& input": {
      color: "#2B2D30",
      fontSize: "16px",
      boxSizing: "border-box",
      borderRadius: "4px",
      height: "56px",
    },
    "& .MuiFormLabel-root": {
      fontSize: "16px",
    },
  },
}));

const USbankDepositToDebit = ({
  clientId,
  parentId,
  paymentType,
  showParentData,
  dispatch,
  setErrorText,
  setVariant,
  handleCollapse,
  t,
}) => {
  
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [debitcardInfo, setDebitcardInfo] = useState({
    data: {
      id: "",
      ddcSSLMerchantId: "",
      ddcConvergeUserId: "",
      ddcTransactionType: USBANK_TRANSACTION_TYPE,
      usBankpaymentdata1: null,
      ddcMerchantConverge: "",
      ddcTerminalId: ""
    },
    error: {
      id: "",
      ddcSSLMerchantId: "",
      ddcTransactionType: "",
      ddcConvergeUserId: "",
      ddcMerchantConverge: "",
      ddcTerminalId: ""
    },
  });

  useEffect(() => {
    if (showParentData) {
      initDebitcardInformation(parentId, true);
    } else {
      initDebitcardInformation(clientId);
    }
  }, [showParentData, parentId, clientId]);

  const classes = useStyles();

  const initDebitcardInformation = async (clientId, isParent) => {
    let bankDetail = {};
    let ID = clientId;
   
    const bankDetailinfo = await dispatch(
      getUSbankDeposittodebitData(ID, paymentType,isParent)
    );
    let { data, error } = bankDetailinfo;
    if (error) {
      setErrorText(t("componentData.DebitCardDetail.failToLoad"));
      setVariant("error");
      return false;
    }
    bankDetail = data && data.length > 0 ? data[0] : {};
    let finalDebitcardDetails = bankDetail || {};

    if (isParent) {
      const { id, ...restDetails } = bankDetail;
      finalDebitcardDetails = restDetails;
    }

    setDebitcardInfo({
      ...debitcardInfo,
      data: {
        ...debitcardInfo.data,
        id: finalDebitcardDetails.id,
        ddcSSLMerchantId: finalDebitcardDetails.ddcSSLMerchantId,
        ddcConvergeUserId: finalDebitcardDetails.ddcConvergeUserId,
        ddcTerminalId: finalDebitcardDetails.ddcTerminalId,
        ddcMerchantConverge: finalDebitcardDetails.ddcMerchantConverge,
        
      },
    });
  };

  const { data, error } = debitcardInfo;
  const { id, ddcSSLMerchantId, ddcTransactionType, ddcConvergeUserId, ddcMerchantConverge, ddcTerminalId } = data;

  const onChange = (event) => {
    const numeric = /^[0-9]*\.?[0-9]*$/;
    const { name, value } = event.target;

    if (numeric.test(value)) {
      setDebitcardInfo({
        ...debitcardInfo,
        data: {
          ...debitcardInfo.data,
          [name]: event.target.value,
        },
      });
    }
  };

  const onChangeAlphaNum = (event) => {
    const { name, value } = event.target;
    setDebitcardInfo({
      ...debitcardInfo,
      data: {
        ...debitcardInfo.data,
        [name]: value.length === 0 ? null : value.trim(),
      },
    });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setDebitcardInfo({
      ...debitcardInfo,
      data: {
        ...debitcardInfo.data,
        [name]: value === "" ? null : value.trim(),
      },
    });
    let valid = true;
    let validation = { [name]: "" };
    switch (name) {
      case "ddcSSLMerchantId":
        if (!value || value.trim().length === 0) {
          validation["ddcSSLMerchantId"] = t(
            "componentData.DebitCardDetail.ddcSSLMerchantIdReq"
          );
          valid = false;
        } else if (value && value.length > 15) {
          validation["ddcSSLMerchantId"] = t(
            "componentData.DebitCardDetail.ddcSSLMerchantIdMaxLen"
          );
          valid = false;
        }
        break;

      case "ddcMerchantConverge":
        if (value && value.length > 15) {
          validation["ddcMerchantConverge"] = t(
            "componentData.DebitCardDetail.ddcConvergeUserIdLen"
          );
          valid = false;
        }
        break;
        case "ddcTerminalId":
          if (!value || value.trim().length === 0) {
            validation["ddcTerminalId"] = t(
              "componentData.DebitCardDetail.ddcSSLPinReq"
            );
            valid = false;
          } else if (value && value.length > 64) {
            validation["ddcTerminalId"] = t(
              "componentData.DebitCardDetail.ddcSSLPinMaxLen"
            );
            valid = false;
          }
          break;
      case "ddcConvergeUserId":
            if (!value || value.trim().length === 0) {
              validation["ddcConvergeUserId"] = t(
                "componentData.DebitCardDetail.ddcSSLUserIdReq"
              );
              valid = false;
            } else if (value && value.length > 15) {
              validation["ddcConvergeUserId"] = t(
                "componentData.DebitCardDetail.ddcSSLUserIdMaxLen"
              );
              valid = false;
            }
            break;
      default: {
      }
    }
    setDebitcardInfo({
      ...debitcardInfo,
      error: { ...validation },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        id,
        ddcSSLMerchantId,
        ddcTransactionType,
        ddcConvergeUserId,
        ddcTerminalId,
        ddcMerchantConverge
      };
      if (id) {
        dispatch(
          updateUSbankDeposittodebit({
            clientId,
            bankDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);

          if (!response || response.error) {
            setErrorText(
              response.message ??
                t("componentData.DebitCardDetail.ErrorWhileSavingData")
            );
            setVariant("error");
            return false;
          } else {
            setErrorText(
              response.message ??
                t("componentData.DebitCardDetail.debitcardDataUpdated")
            );
            setVariant("success");
            handleCollapse(paymentType);
          }
        });
      } else {
        const { id, ...restBankDetail } = data;
        dispatch(
          addUSbankDeposittodebit({
            clientId,
            bankDetail: trim(restBankDetail),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response.data.id) {
            setDebitcardInfo({
              ...debitcardInfo,
              data: {
                ...debitcardInfo.data,
                id: response.data.id,
              },
            });
            setErrorText(
              response.message ??
                t("componentData.DebitCardDetail.debitcardDataSaved")
            );
            setVariant("success");
            handleCollapse(paymentType);
          } else {
            setErrorText(
              t(
                response.message ??
                  t("componentData.DebitCardDetail.ErrorWhileSavingData")
              )
            );
            setVariant("error");
            return false;
          }
          setSaveProcessing(false);
        });
      }
    } else {
      setSaveProcessing(false);
      setErrorText(t("componentData.commonErr.validationMsg"));
      setVariant("error");
      return false;
    }
  };

  const validation = () => {
    let valid = true;
    let validation = {};

    if (!ddcSSLMerchantId || ddcSSLMerchantId.trim().length === 0) {
      validation["ddcSSLMerchantId"] = t(
        "componentData.DebitCardDetail.ddcSSLMerchantIdReq"
      );
      valid = false;
    } else if (ddcSSLMerchantId && ddcSSLMerchantId.length > 15) {
      validation["ddcSSLMerchantId"] = t(
        "componentData.DebitCardDetail.ddcSSLMerchantIdMaxLen"
      );
      valid = false;
    }

    if (ddcMerchantConverge && ddcMerchantConverge.length > 15) {
      validation["ddcMerchantConverge"] = t(
        "componentData.DebitCardDetail.ddcConvergeUserIdLen"
      );
      valid = false;
    }

    if (!ddcTerminalId || ddcTerminalId.trim().length === 0) {
      validation["ddcTerminalId"] = t(
        "componentData.DebitCardDetail.ddcSSLPinReq"
      );
      valid = false;
    } else if (ddcTerminalId && ddcTerminalId.length > 64) {
      validation["ddcTerminalId"] = t(
        "componentData.DebitCardDetail.ddcSSLPinMaxLen"
      );
      valid = false;
    }

    if (!ddcConvergeUserId || ddcConvergeUserId.trim().length === 0) {
      validation["ddcConvergeUserId"] = t(
        "componentData.DebitCardDetail.ddcSSLUserIdReq"
      );
      valid = false;
    } else if (ddcConvergeUserId && ddcConvergeUserId.length > 15) {
      validation["ddcConvergeUserId"] = t(
        "componentData.DebitCardDetail.ddcSSLUserIdMaxLen"
      );
      valid = false;
    }

    setDebitcardInfo({
      ...debitcardInfo,
      error: { ...validation },
    });

    return valid;
  };

  return (
    <Box>
      <Grid container>
        <>
          <Grid container item>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={1}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 15,
                    minLength: 1,
                  }}
                  label={t(
                    "componentData.DebitCardDetail.ddcSSLMerchantId"
                  )}
                  placeholder={t(
                    "componentData.DebitCardDetail.ddcSSLMerchantIdPlaceholder"
                  )}
                  required
                  error={Boolean(error.ddcSSLMerchantId)}
                  helperText={error.ddcSSLMerchantId}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  value={ddcSSLMerchantId || ''}
                  name="ddcSSLMerchantId"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={1}>
                <TextField
                  label={t(
                    "componentData.DebitCardDetail.ddcSSLUserId"
                  )}
                  placeholder={t(
                    "componentData.DebitCardDetail.ddcSSLUserId"
                  )}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  inputProps={{
                    maxLength: 15,
                    minLength: 1,
                  }}
                  error={Boolean(error.ddcConvergeUserId)}
                  helperText={error.ddcConvergeUserId} 
                  value={ddcConvergeUserId || ''}
                  name="ddcConvergeUserId"
                  onChange={onChangeAlphaNum}
                  onBlur={handleBlur}
                  required
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={1}>
                <TextField
                  label={t(
                    "componentData.DebitCardDetail.ddcSSLPin"
                  )}
                  placeholder={t(
                    "componentData.DebitCardDetail.ddcSSLPin"
                  )}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  inputProps={{
                    maxLength: 64,
                    minLength: 1,
                  }}
                  error={Boolean(error.ddcTerminalId)}
                  helperText={error.ddcTerminalId}
                  value={ddcTerminalId || ''}
                  name="ddcTerminalId"
                  onChange={onChangeAlphaNum}
                  onBlur={handleBlur}
                  required
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={1}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 20,
                    minLength: 1,
                  }}
                  label={t(
                    "componentData.DebitCardDetail.ddcTransactionType"
                  )}
                  required
                  disabled
                  placeholder={t(
                    "componentData.DebitCardDetail.ddcTransactionType"
                  )}
                  error={Boolean(error.ddcTransactionType)}
                  helperText={error.ddcTransactionType}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  value={USBANK_TRANSACTION_TYPE}
                  name="ddcTransactionType"
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={1}>
                <TextField
                  label={t(
                    "componentData.DebitCardDetail.ddcConvergeUserId"
                  )}
                  placeholder={t(
                    "componentData.DebitCardDetail.ddcConvergeUserId"
                  )}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  inputProps={{
                    maxLength: 15,
                    minLength: 0,
                  }}
                  error={Boolean(error.ddcMerchantConverge)}
                  helperText={error.ddcMerchantConverge}
                  value={ddcMerchantConverge || ''}
                  name="ddcMerchantConverge"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>

            <Grid container item xs={12}></Grid>
          </Grid>
          <Grid container item xs={12} justify="center">
            {saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => onSubmit()}
                style={{ display: "block", margin: "15px auto 0" }}
              >
                {t("componentData.DebitCardDetail.Save")}
              </Button>
            )}
          </Grid>
        </>
      </Grid>
    </Box>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.b2cPayments,
  }))(USbankDepositToDebit)
);
