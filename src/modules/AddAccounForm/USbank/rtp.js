import React, { useState, useEffect } from 'react';
import trim from "deep-trim-node";
import {
  Box,
  Grid,
  Button,
  CircularProgress,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  USBankcreateRtpData,
  USBankupdatedRTPData,
  USBankGetRTPData,
} from "~/redux/helpers/USbank/payments";
import MaskInput from '~/components/MaskInput';
import { withStyles } from '@material-ui/styles';
import styles from './styles';

const RTP = (props) => {
  const {
    classes,
    dispatch,
    t,
    notification,
    canEdit,
    isAddAccount,
    accountDetails,
    achAccountList,
  } = props;
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [willPopupBtnShow, setPopupBtn] = useState(false);
  const [rtpDetailInfo, setRtpDetailInfo] = useState({
    data: {
      id: '',
      rtpAccountNumber: null,
      rtpRoutingCode: null,
    },
    error: {
      id: '',
      rtpAccountNumber: '',
      rtpRoutingCode: '',
    },
  });

  useEffect(() => {    
    initBankInformation();
    isAddAccount
      ? setPopupBtn(true)
      : canEdit
      ? setPopupBtn(true)
      : setPopupBtn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.user.userData.portalProfileId,
    isAddAccount,
    canEdit,
    achAccountList,
  ]);

  const initBankInformation = async () => {
    const clientId = props.user.userData.portalProfileId || null;
    let rtpDetail = {};
    
    if (!isAddAccount) {
      setIsLoading(true);
      const rtpDetailinfo = await USBankGetRTPData(
        clientId,
      );
      setIsLoading(false);
      rtpDetail =
        rtpDetailinfo.data && rtpDetailinfo.data.length > 0
          ? rtpDetailinfo.data[accountDetails - 1]
          : {};
    }

    let clientBankDetail = rtpDetail || {};

    setRtpDetailInfo({
      ...rtpDetailInfo,
      data: {
        ...rtpDetailInfo.data,
        ...clientBankDetail,
      },
    });
  };

  const { data, error } = rtpDetailInfo;
  const {
    id,
    rtpAccountNumber,
    rtpRoutingCode,
  } = data;

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setRtpDetailInfo({
      ...rtpDetailInfo,
      data: {
        ...rtpDetailInfo.data,
        [name]: value === '' ? null : value?.trim(),
      },
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRtpDetailInfo({
      ...rtpDetailInfo,
      data: {
        ...rtpDetailInfo.data,
        [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
      },
    });
  };

  const onSubmit = () => {
    const clientId = props.user.userData.portalProfileId || null;
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        id,
        rtpAccountNumber: Boolean(rtpAccountNumber) ? rtpAccountNumber : null,
        rtpRoutingCode,
      };

      if (id) {
        dispatch(
          USBankupdatedRTPData({
            clientId: clientId,
            rtpDetail: trim(data),
          })
        ).then((response) => {
          setSaveProcessing(false);
          if (!response || response.error) {
            const errorMsg =
              response && response.message
                ? response.message
                : t('componentData.RTPDetail.ErrorWhileSavingData');
            notification('error', errorMsg);
            return false;
          } else {
            notification(
              'success',
              t('componentData.RTPDetail.rtpAccountDataSaved')
            );
            props.closeModal(true);
          }
        });
      } else {
        const { id, ...restBankDetail } = data;
        dispatch(
          USBankcreateRtpData({
            clientId: clientId,
            rtpDetail: restBankDetail,
          })
        ).then((id) => {
          setSaveProcessing(false);
          if (id) {
            setRtpDetailInfo({
              ...rtpDetailInfo,
              data: {
                ...rtpDetailInfo.data,
                id: id,
              },
            });
            notification(
              'success',
              t('componentData.RTPDetail.rtpAccountDataSaved')
            );
            props.closeModal(true);
          } else {
            notification(
              'error',
              t('componentData.RTPDetail.ErrorWhileSavingData')
            );
            return false;
          }
        });
      }
    } else {
      setSaveProcessing(false);
      notification('error', t('componentData.commonErr.validationMsg'));
      return false;
    }
    // props.closeModal(true);
  };

  const validation = () => {
    let valid = true;
    let validation = {};

    if (!rtpRoutingCode || rtpRoutingCode.trim().length === 0) {
      validation['rtpRoutingCode'] = t('componentData.RTPDetail.rtpRoutingCodeReq');
      valid = false;
    }
    if (rtpRoutingCode && rtpRoutingCode.length < 9) {
      validation['rtpRoutingCode'] = t('componentData.RTPDetail.rtpRoutingCodeMaxLen');
      valid = false;
    }

    if (!rtpAccountNumber || rtpAccountNumber.trim().length === 0) {
      validation['rtpAccountNumber'] = t(
        'componentData.RTPDetail.rtpAccountNumberReq'
      );
      valid = false;
    }
    if (rtpAccountNumber && rtpAccountNumber.length < 6) {
      validation['rtpAccountNumber'] = t('componentData.RTPDetail.rtpAccountNumberMaxLen');
      valid = false;
    }

    setRtpDetailInfo({
      ...rtpDetailInfo,
      error: { ...validation },
    });
    return valid;
  };

  const onCancel = () => {
    props.onCancel(true);
  };

  return (
    <Box p={2} className={classes.popupInner}>
     {isLoading ? 
      <Grid container justifyContent="center">
        <CircularProgress color="primary" />
      </Grid> : 
      <Grid container>
        <Grid container item>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <Box>
            <TextField
              label={t('componentData.RTPDetail.rtpRoutingCode')}
              error={error.rtpRoutingCode}
              helperText={error.rtpRoutingCode}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              color="secondary"
              value={rtpRoutingCode || ''}
              name="rtpRoutingCode"
              inputProps={{
                maxLength: 9,
                minLength: 9,
                readOnly: isAddAccount ? false : !canEdit ? true : false,
              }}
              onBlur={handleBlur}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <MaskInput
              label={t('componentData.RTPDetail.rtpAccountNumber')}
              error={error.rtpAccountNumber}
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
                readOnly: isAddAccount ? false : !canEdit ? true : false,
              }}
              getValue={(val) => {
                setRtpDetailInfo({
                  ...rtpDetailInfo,
                  data: { ...rtpDetailInfo.data, rtpAccountNumber: val },
                });
              }}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
        </Grid>
        {willPopupBtnShow && (
          <Grid container item xs={11} justify="center">
            <Button
              variant="outlined"
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                width: '120px',
                margin: '0px 10px 0 0',
              }}
              onClick={onCancel}
            >
              {t('componentData.addAccountCK.Cancel')}
            </Button>

            {saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                className={classes.button}
                type="submit"
                fullWidth={false}
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                {t('componentData.bankDetail.Save')}
              </Button>
            )}
          </Grid>
        )}
       
      </Grid>
      }
    </Box>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.client,
    ...state.clientConfig,
    ...state.b2cPayments,
  }))(withStyles(styles)(RTP))
);
