import React, { useState, useEffect } from 'react';
import { Box, Grid, TextField, Button } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { updateCheckDetail } from '~/redux/actions/payments';
import MultiCheckBoxGroup from '~/components/Forms/MultiCheckBoxGroup';
import {
  getTransactionType,
  getClientTransactionType,
} from '~/redux/actions/payments';
import { getCheckDetailInfo } from '../../redux/actions/payments';
import trim from "deep-trim-node";

const useStyles = makeStyles((theme) => ({
  gridItem: {
    margin: 0,
  },
}));

const CheckDetail = ({
  clientId,
  parentId,
  showParentData,
  checkDetails,
  paymentType,
  dispatch,
  t,
  setErrorText,
  setVariant,
  handleCollapse,
}) => {
  const [AccounttransactionType, setTransactionTypes] = useState([]);
  const [checkDetail, setCheckDetail] = useState({
    data: {
      clientId: '',
      accountNumber: '',
      intSenderId: null,
      GS02: null,
      GS03: null,
      intRecvrId: null,
      transactionType: [],
    },
    error: {
      clientId: '',
      accountNumber: '',
      intSenderId: '',
      GS02: '',
      GS03: '',
      intRecvrId: '',
      transactionType: [],
    },
  });

  useEffect(() => {
    if (showParentData) {
      initCheckInformation(parentId);
    } else {
      initCheckInformation(clientId);
    }
    setCheckDetail({
      ...checkDetail,
      data: { ...checkDetail.data, ...checkDetails },
    });
    fetchTransactionType();
    // fetchCurrencyList();
  }, [showParentData]);

  const initCheckInformation = async (clientId) => {
    const transactionType = await getClientTransactionType(
      clientId,
      paymentType
    );
    const {
      data: transactionTypeArr,
      error: typeError,
      message: errorMessage,
    } = transactionType.data;

    let checkDetails = [];
    const checkDetailinfo = await getCheckDetailInfo({ clientId });
    const { data, error } = checkDetailinfo;
    if (error) {
      setErrorText(t('componentData.checkDetail.ErrorFetchingData'));
      setVariant('error');
      return false;
    }
    checkDetails = Object.keys(data).length > 0 ? data : {};

    setCheckDetail({
      ...checkDetail,
      data: {
        ...checkDetail.data,
        ...checkDetails,
        transactionType: transactionTypeArr.rows || [],
      },
    });
  };

  const { data, error } = checkDetail;
  const { intSenderId, GS02, GS03, intRecvrId, transactionType } = data;

  const removeArrElement = (ele, arr) => {
    const index = arr.indexOf(ele);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };

  const onChangeTransactionType = (event) => {
    const { checked } = event.target;
    let { value } = event.target;
    const newTransactionType = checked
      ? [...(checkDetail.data.transactionType || []), parseInt(value)]
      : removeArrElement(parseInt(value), transactionType);
    setCheckDetail({
      ...checkDetail,
      data: { ...checkDetail.data, transactionType: newTransactionType },
    });
  };

  const onChange = (event) => {
    const { name, type } = event.target;
    let { value } = event.target;
    if (type === 'select') {
      value = value === '' ? null : value;
    }
    setCheckDetail({
      ...checkDetail,
      data: { ...checkDetail.data, [name]: Boolean(value) && value?.length === 0 ? null : value },
    });
  };

  const onSubmit = () => {
    const valid = validation();
    // const valid = true;
    if (valid) {
      // const clientId = sessionStorage.getItem("clientId") ;
      const data = {
        intSenderId,
        intRecvrId,
        checkEdiInfo: { GS02, GS03 },
        transactionType,
      };
      dispatch(
        updateCheckDetail({ clientId: clientId, checkDetail: trim(data) })
      ).then((response) => {
        if (!response) {
          setErrorText(t('componentData.checkDetail.ErrorSavingData'));
          setVariant('error');
          return false;
        }
        setErrorText(t('componentData.checkDetail.CheckDataSavedSuccessfully'));
        setVariant('success');
        handleCollapse(paymentType);
      });
    }
  };

  const fetchTransactionType = async () => {
    const transactionTypeData = await getTransactionType();
    const { data, error, message } = await transactionTypeData;
    const AccountTransactionTypes =
      data &&
      data.rows.filter(({ paymentCode }) => {
        return paymentCode === paymentType;
      });
    if (!error) {
      setTransactionTypes(AccountTransactionTypes);
    } else {
      // report Error Message here for not getting grouplist;
      setTransactionTypes({ ...transactionType, error: message });
    }
  };

  const checkOptions = AccounttransactionType.map(
    ({ currency, transactionTypeId, bankCountryIso, paymentCode }) => ({
      name: currency,
      value: transactionTypeId,
      label: `${bankCountryIso} ${currency}`,
    })
  );

  const validation = () => {
    let valid = true;
    let validation = {};
    if (!intSenderId || !intSenderId.toString().trim().length) {
      validation['intSenderId'] = t('componentData.checkDetail.ISA06Req');
      valid = false;
    } else if (intSenderId.toString().trim().length < 2) {
      validation['intSenderId'] = t('componentData.checkDetail.ErrorISA06');
      valid = false;
    }
    if (!intRecvrId || !intRecvrId.toString().trim().length) {
      validation['intRecvrId'] = t('componentData.checkDetail.ISA08Req');
      valid = false;
    } else if (intRecvrId.toString().trim().length < 2) {
      validation['intRecvrId'] = t('componentData.checkDetail.ErrorISA08');
      valid = false;
    }
    if (!GS02 || !GS02.toString().trim().length) {
      validation['GS02'] = t('componentData.checkDetail.GS02Req');
      valid = false;
    } else if (GS02.toString().trim().length < 2) {
      validation['GS02'] = t('componentData.checkDetail.ErrorGS02');
      valid = false;
    }
    if (!GS03 || !GS03.toString().trim().length) {
      validation['GS03'] = t('componentData.checkDetail.GS03Req');
      valid = false;
    } else if (GS03.toString().trim().length < 2) {
      validation['GS03'] = t('componentData.checkDetail.ErrorGS03');
      valid = false;
    }
    setCheckDetail({
      ...checkDetail,
      error: validation,
    });
    return valid;
  };
  const classes = useStyles();
  return (
    <Box p={2}>
      <Grid container justify="center" spacing={2}>
        <Grid container justify="flex-start">
          <Grid item xs={12} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <MultiCheckBoxGroup
                key={'transactionType'}
                label={t('componentData.checkDetail.TransactionType')}
                options={checkOptions}
                onChangeCheckBox={onChangeTransactionType}
                selectedCheckbox={transactionType || []}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.ISA06')}
                error={Boolean(error.intSenderId)}
                helperText={error.intSenderId}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={intSenderId || ''}
                name="intSenderId"
                onChange={onChange}
                inputProps={{
                  maxLength: 15,
                }}
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.ISA08')}
                error={Boolean(error.intRecvrId)}
                helperText={error.intRecvrId}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={intRecvrId || ''}
                name="intRecvrId"
                onChange={onChange}
                inputProps={{
                  maxLength: 15,
                }}
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.GS02')}
                error={Boolean(error.GS02)}
                helperText={error.GS02}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={GS02 || ''}
                name="GS02"
                onChange={onChange}
                inputProps={{
                  maxLength: 15,
                }}
                required
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.gridItem}>
            <Box mx={1} my={2}>
              <TextField
                label={t('componentData.checkDetail.GS03')}
                error={Boolean(error.GS03)}
                helperText={error.GS03}
                color="secondary"
                fullWidth={true}
                autoComplete="off"
                variant="outlined"
                value={GS03 || ''}
                name="GS03"
                onChange={onChange}
                inputProps={{
                  maxLength: 15,
                }}
                required
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container item xs={11} justify="center">
          <Button
            className={classes.button}
            type="submit"
            fullWidth={false}
            variant="contained"
            color="primary"
            onClick={() => onSubmit()}
          >
            {t('componentData.checkDetail.Save')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default withTranslation()(connect()(CheckDetail));
