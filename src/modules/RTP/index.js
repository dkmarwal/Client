import React, { useState, useEffect } from "react";
import { Box, Grid, Button, CircularProgress } from "@material-ui/core";
import trim from "deep-trim-node";
import TextField from "~/components/Forms/TextField";
import { makeStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { AlertDialog } from "~/components/Dialogs";
import {
  USBankcreateRtpData,
  USBankupdatedRTPData,
  USBankGetRTPData,
} from "~/redux/helpers/USbank/payments";
import MaskInput from '~/components/MaskInput';
import { paymentMethods } from '~/config/paymentMethods';

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

const RTP = ({
  clientId,
  parentId,
  paymentType,
  showParentData,
  dispatch,
  setErrorText,
  setVariant,
  handleCollapse,
  selectedPaymentModes,
  showParentInfo,

  t,
  achFilled,
}) => {
  const [rtpDialogFlag, setRtpDialogFlag] = useState(false);
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [titleFlag, settitleFlag] = useState(false);
  const [rtpDetailInfo, setRtpDetailInfo] = useState({
    data: {
      id: '',
      clientId: '',
      rtpRoutingCode: '',
      rtpAccountNumber: '',
    },
    error: {
      id: '',
      clientId: '',
      rtpRoutingCode: '',
      rtpAccountNumber: '',
    },
  });

  useEffect(() => {
    async function initBankInformation() {
      let ID = clientId;
      if (showParentData) {
        ID = parentId;
      }
      setRtpDetailInfo({
        ...rtpDetailInfo,
        data: {
          ...rtpDetailInfo.data,
        },
      });
      
      const getUSBankRtpData = await USBankGetRTPData(ID);
      if (
        getUSBankRtpData &&
        getUSBankRtpData.data.length > 0
      ) {
        let finalBankDetails = getUSBankRtpData?.data[0];
        if (showParentData) {
          const { ID, ...restDetail } = getUSBankRtpData?.data[0];
          finalBankDetails = restDetail;
        }
        setRtpDetailInfo({
          ...rtpDetailInfo,
          data: {
            ...rtpDetailInfo.data,
            ...finalBankDetails,
          },
        });
      }
    }

    initBankInformation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showParentData, parentId, clientId]);

  const classes = useStyles();

  const { data, error } = rtpDetailInfo;
  const { id, rtpRoutingCode, rtpAccountNumber } = data;

  const onChange = (event) => {
    const numeric = /^[0-9]*\.?[0-9]*$/;
    const { name, value } = event.target;

    if (numeric.test(value)) {
      setRtpDetailInfo({
        ...rtpDetailInfo,
        data: {
          ...rtpDetailInfo.data,
          [name]: event.target.value,
        },
      });
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setRtpDetailInfo({
      ...rtpDetailInfo,
      data: {
        ...rtpDetailInfo.data,
        [name]: value === "" ? null : value.trim(),
      },
    });

    let valid = true;
    let validation = { [name]: "" };
    switch (name) {
      case "rtpRoutingCode":
        if (!value || value.trim().length === 0) {
          validation["rtpRoutingCode"] = t(
            "componentData.RTPDetail.rtpRoutingCodeReq"
          );
          valid = false;
        } else if (value && value.length !== 9) {
          validation["rtpRoutingCode"] =
          t(
            'componentData.RTPDetail.rtpRoutingCodeMaxLen'
          );
          valid = false;
        }
        break;

      case "rtpAccountNumber":
        if (!value || value.trim().length === 0) {
          validation["rtpAccountNumber"] = t(
            "componentData.RTPDetail.rtpAccountNumberReq"
          );
          valid = false;
        }
        break;
      default: {
      }
    }
    setRtpDetailInfo({
      ...rtpDetailInfo,
      error: { ...validation },
    });

    return valid;
  };

  const onSubmit = () => {
    
    if(!achFilled) {
      setRtpDialogFlag(true);
      return;
    }

    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        id,
        clientId,
        rtpRoutingCode,
        rtpAccountNumber,
      };
      if (id) {
        dispatch(
          USBankupdatedRTPData({
            id,
            clientId,
            rtpDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (!response || response.error) {
            setErrorText(
              response.message ??
                t("componentData.RTPDetail.errorWhileSavingData")
            );
            setVariant("error");
            return false;
          } else {
            setErrorText(
              response.message ??
                t("componentData.RTPDetail.rtpDataUpdated")
            );
            setVariant("success");
            handleCollapse(paymentType);
          }
        });
      } else {
        const { id, ...restRtpDetail } = data;
        dispatch(
          USBankcreateRtpData({
            id,
            clientId,
            rtpDetail: trim(restRtpDetail),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (response && response.data && response.data.id) {
            setRtpDetailInfo({
              ...rtpDetailInfo,
              data: {
                ...rtpDetailInfo.data,
                id: response?.data?.id,
              },
            });
            setErrorText(
              response.message ??
                t("componentData.RTPDetail.rtpDataSaved")
            );
            setVariant("success");
            handleCollapse(paymentType);
          } else {
            setErrorText(
              t(
                response.message ??
                  t("componentData.RTPDetail.errorWhileSavingData")
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

    if (!rtpRoutingCode || rtpRoutingCode.trim().length === 0) {
      validation["rtpRoutingCode"] = 
      t("componentData.RTPDetail.rtpRoutingCodeReq");
      valid = false;
    } else if (rtpRoutingCode && rtpRoutingCode.length !== 9) {
      validation["rtpRoutingCode"] = t(
        "componentData.RTPDetail.rtpRoutingCodeMaxLen"
      );
      valid = false;
    }

    if (!rtpAccountNumber || rtpAccountNumber.trim().length === 0) {
      validation["rtpAccountNumber"] = t(
        "componentData.RTPDetail.rtpAccountNumberReq"
      );
      valid = false;
    } else if (rtpAccountNumber && rtpAccountNumber.length < 6) {
      validation["rtpAccountNumber"] = t(
        "componentData.RTPDetail.rtpAccountNumberMaxLen"
      );
      valid = false;
    }

    setRtpDetailInfo({
      ...rtpDetailInfo,
      error: { ...validation },
    });
    return valid;
  };

  const rtpDialogMessage = () => {
    setRtpDialogFlag(false);
  }

  return (
    <Box>
      <Grid container>
        <>
          <Grid container item>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color="secondary"
                  inputProps={{
                    maxLength: 9,
                    minLength: 1,
                  }}
                  label={t(
                    "componentData.RTPDetail.rtpRoutingCode"
                  )}
                  placeholder={t(
                    "componentData.RTPDetail.rtpRoutingCodePlaceholder"
                  )}
                  required
                  error={Boolean(error.rtpRoutingCode)}
                  helperText={error.rtpRoutingCode}
                  fullWidth={true}
                  autoComplete="off"
                  variant="outlined"
                  value={rtpRoutingCode || ''}
                  name="rtpRoutingCode"
                  onChange={onChange}
                  onBlur={handleBlur}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <MaskInput
              label={t('componentData.RTPDetail.rtpAccountNumber')}
              placeholder={t(
                "componentData.RTPDetail.rtpAccountNumberPlaceholder"
              )}
              required
              error={Boolean(error.rtpAccountNumber)}
              helperText={error.rtpAccountNumber}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              color="secondary"
              value={rtpAccountNumber || ''}
              name="rtpAccountNumber"
              inputProps={{
                maxLength: 17,
                minLength: 6,
              }}
              getValue={(val) => {
                setRtpDetailInfo({
                  ...rtpDetailInfo,
                  data: { ...rtpDetailInfo.data, rtpAccountNumber: val },
                });
              }}
              //onChange={onChange}
              onBlur={handleBlur}
              style={{marginTop: "8px"}}
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
                {t("componentData.RTPDetail.save")}
              </Button>
            )}
          </Grid>
        </>
      </Grid>
      {rtpDialogFlag && (
          <AlertDialog
            title={t('componentData.RTPDetail.rtpACHExist')}
            open={rtpDialogFlag}
            onConfirm={() => rtpDialogMessage()}
          />
        )}
    </Box>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.b2cPayments,
  }))(RTP)
);
