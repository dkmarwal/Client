import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import {
  addB2CCheckDetail,
  updateB2CCheckDetail,
  getB2CCheckDetailInfo,
} from '~/redux/actions/B2C/payments';

const useStyles = makeStyles((theme) => ({
  gridItem: {
    margin: 0,
  },
}));

const B2CCheckDetail = ({
  clientId,
  parentId,
  showParentData,
  dispatch,
  payment,
  t,
  handleCollapse,
  paymentTypeId,
  setVariant,
  setErrorText,
}) => {
  const [saveProcessing, setSaveProcessing] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [checkDetail, setCheckDetail] = useState({
    data: {
      clientId: '',
      accountNumber: '',
      ediInterchangeSenderId: null,
      ediGroupSenderId: null,
      ediGroupReceiverId: null,
      ediInterchangeReceiverId: null,
      originatingCompanyID: null,
      originatingDFIIdentification: null,
    },
    error: {
      clientId: '',
      accountNumber: '',
      ediInterchangeSenderId: '',
      ediGroupSenderId: '',
      ediGroupReceiverId: '',
      ediInterchangeReceiverId: '',
      originatingCompanyID: '',
      originatingDFIIdentification: ''
    },
  });

  useEffect(() => {
    if (showParentData) {
      initCheckInformation(parentId, true);
    } else {
      initCheckInformation(clientId);
    }
  }, [showParentData]);

  const initCheckInformation = async (clientId, isParent) => {
    let checkDetails = [];
    const checkDetailinfo = await getB2CCheckDetailInfo({ clientId, showParentData });

    const { data, error } = checkDetailinfo;
    if (error) {
      setErrorText(t('componentData.checkDetail.ErrorFetchingData'));
      setVariant('error');
      return false;
    }
    checkDetails = Object.keys(data).length > 0 ? data : {};
    let clientCheckDetail = checkDetails || [];
    if (isParent) {
      const { checkId, ...restDetails } = checkDetails;
      clientCheckDetail = restDetails;
    }
    setCheckDetail({
      ...checkDetail,
      data: {
        ...clientCheckDetail,
      },
    });
  };

  const { data, error } = checkDetail;
  const {
    ediInterchangeSenderId,
    ediGroupSenderId,
    ediGroupReceiverId,
    ediInterchangeReceiverId,
    originatingCompanyID,
    originatingDFIIdentification
  } = data;

  const onChange = (event) => {
    const { name } = event.target;
    let { value } = event.target;
    if(name === 'originatingDFIIdentification'){
      setCheckDetail({
        ...checkDetail,
        data: { 
          ...checkDetail.data, [name]: value.length === 0 ? null : value.replace(/[^0-9]/g, "") },
      });
    }
    else{
      setCheckDetail({
        ...checkDetail,
        data: { ...checkDetail.data, [name]: value.length === 0 ? null : value },
      });
    }    
  };

  const onBlur = (event) => {
    const { name, value } = event.target;
    setCheckDetail({
      ...checkDetail,
      data: {
        ...checkDetail.data,
        [name]: value?.trim().length === 0 ? null : value ? value.trim() : null,
      },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    setSaveProcessing(true);
    if (valid) {
      const data = {
        clientId,
        ediInterchangeSenderId,
        ediInterchangeReceiverId,
        ediGroupSenderId,
        ediGroupReceiverId,
        originatingCompanyID,
        originatingDFIIdentification
      };

      const { checkId } = checkDetail.data;
      const { error } = payment;

      if (checkId) {
        dispatch(updateB2CCheckDetail(data)).then((response) => {
          setSaveProcessing(false);
          if (!response || response.error) {
            setErrorText(error);
            setVariant('error');
            return false;
          }
          handleCollapse(paymentTypeId)
          setErrorText(t('componentData.checkDetail.CheckDataUpdatedSuccessfully'));
          setVariant('success');
        });
      }
      else {
        dispatch(addB2CCheckDetail(data)).then((response) => {
          setSaveProcessing(false);
          if (!response || response.error) {
            setErrorText(error);
            setVariant('error');
            return false;
          }
          else {
            handleCollapse(paymentTypeId)
            setErrorText(t('componentData.checkDetail.CheckDataSavedSuccessfully'));
            setVariant('success');
            setIsSave(true);
          }
        });
      }
    } else {
      setSaveProcessing(false);
      setErrorText(t('componentData.commonErr.validationMsg'));
      setVariant('error');
      return false;
    }
  };

  const validation = () => {
    let valid = true;
    let validation = {};

    if(
      ediInterchangeSenderId &&
      ediInterchangeSenderId.toString().trim().length < 2
    ) {
      validation['ediInterchangeSenderId'] = t(
        'componentData.checkDetail.ErrorEDIInterchangeSender'
      );
      valid = false;
    }

    if(
      ediInterchangeReceiverId &&
      ediInterchangeReceiverId.toString().trim().length < 2
    ) {
      validation['ediInterchangeReceiverId'] = t(
        'componentData.checkDetail.ErrorEDIInterchangeReceiver'
      );
      valid = false;
    }

    if(ediGroupSenderId && ediGroupSenderId.toString().trim().length < 2) {
      validation['ediGroupSenderId'] = t(
        'componentData.checkDetail.ErrorMinEDIGroupSender'
      );
      valid = false;
    } else if(
      ediGroupSenderId &&
      ediGroupSenderId.toString().trim().length > 15
    ) {
      validation['ediGroupSenderId'] = t(
        'componentData.checkDetail.ErrorMaxEDIGroupSender'
      );
      valid = false;
    }

    if(ediGroupReceiverId && ediGroupReceiverId.toString().trim().length < 2) {
      validation['ediGroupReceiverId'] = t(
        'componentData.checkDetail.ErrorMinEDIGroupReceiver'
      );
      valid = false;
    } else if(
      ediGroupReceiverId &&
      ediGroupReceiverId.toString().trim().length > 15
    ) {
      validation['ediGroupReceiverId'] = t(
        'componentData.checkDetail.ErrorMaxEDIGroupReceiver'
      );
      valid = false;
    }

    if(originatingCompanyID && originatingCompanyID.toString().trim().length < 10) {
      validation['originatingCompanyID'] = t(
        'componentData.checkDetail.ErrorMinOriginatingCompany'
      );
      valid = false;
    }

    if(originatingDFIIdentification && originatingDFIIdentification.toString().trim().length < 9) {
      validation['originatingDFIIdentification'] = t(
        'componentData.checkDetail.errOriginatingDFIIdentification'
      );
      valid = false;
    }

    setCheckDetail({
      ...checkDetail,
      error: { ...validation }
    });
    return valid;
  };
  const classes = useStyles();
  return (
    <Box p={2}>
      <Grid container justify="center" spacing={2}>
        <Grid container justify="flex-start">
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.EDIInterchangeSender')}
                error={Boolean(error.ediInterchangeSenderId)}
                helperText={error.ediInterchangeSenderId}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={ediInterchangeSenderId || ''}
                name="ediInterchangeSenderId"
                onChange={onChange}
                inputProps={{
                  maxLength: 15,
                  minLength: 2,
                }}
                onBlur={onBlur}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.EDIInterchangeReceiver')}
                error={Boolean(error.ediInterchangeReceiverId)}
                helperText={error.ediInterchangeReceiverId}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={ediInterchangeReceiverId || ''}
                name="ediInterchangeReceiverId"
                onChange={onChange}
                inputProps={{
                  maxLength: 15,
                  minLength: 2
                }}
                onBlur={onBlur}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.EDIGroupSender')}
                error={Boolean(error.ediGroupSenderId)}
                helperText={error.ediGroupSenderId}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={ediGroupSenderId || ''}
                name="ediGroupSenderId"
                onChange={onChange}
                inputProps={{
                  maxLength: 15,
                  minLength: 2,
                }}
                onBlur={onBlur}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.EDIGroupReceiver')}
                error={Boolean(error.ediGroupReceiverId)}
                helperText={error.ediGroupReceiverId}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={ediGroupReceiverId || ''}
                name="ediGroupReceiverId"
                onChange={onChange}
                inputProps={{
                  maxLength: 15,
                  minLength: 2,
                }}
                onBlur={onBlur}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.OriginatingCompany')}
                error={Boolean(error.originatingCompanyID)}
                helperText={error.originatingCompanyID}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={originatingCompanyID || ''}
                name="originatingCompanyID"
                onChange={onChange}
                inputProps={{
                  maxLength: 10,
                  minLength: 10,
                }}
                onBlur={onBlur}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.originatingDFIIdentification')}
                error={Boolean(error.originatingDFIIdentification)}
                helperText={error.originatingDFIIdentification}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={originatingDFIIdentification || ''}
                name="originatingDFIIdentification"
                onChange={onChange}
                inputProps={{
                  maxLength: 9,
                  minLength: 9,
                }}
                onBlur={onBlur}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>

        </Grid>
        <Grid container item xs={11} justify="center">
          {saveProcessing ? (
            <CircularProgress color="primary" />
          ) : (
            <Button
              className={classes.button}
              type="submit"
              fullWidth={false}
              variant="contained"
              color="primary"
              onClick={() => onSubmit()}
              style={{ fontSize: 14 }}
            >
              {t('componentData.checkDetail.Save')}
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.client,
  ...state.clientConfig,
  ...state.payment,
}))(B2CCheckDetail));
