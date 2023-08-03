import React from 'react';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  FormControl,
  Select,
  MenuItem,
  Grid,
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
  FormHelperText,
} from '@material-ui/core';
import AddCircleIcon from '~/assets/icons/add_circle_outline.svg';
import MaskInput from '~/components/MaskInput';
import {
  achB2CProfilesInformation,
  settingCreateB2CBankInfo,
  settingUpdateB2CBankInfo,
} from '~/redux/actions/B2C/payments';
import ConfirmationDialog from '~/components/Dialogs/confirmationDialog';

const settlementConstData = {
  accountName: null,
  accountNumber: null,
  routingCode: null,
  companyName: null,
  companyIdentification: null,
  companyEntryDescription: null,
  companyDiscretionaryData: null,
  originatingDFIIdentification: null,
  originatingDFIDiscretionaryData: null,
  currencyCode: null,
  accountId: null,
};

const styles = (theme) => ({
  newAccountMenu: {
    borderTop: '1px solid #9E9E9E',
    margin: theme.spacing(0.5, 1),
    display: 'flex',
    justifyContent: 'center',
  },
  plusIcon: {
    marginRight: theme.spacing(0.5),
  },
  accountsMenuList: {
    margin: theme.spacing(0.5, 0),
    minHeight: '40px',
  },
  inputBox: {
    float: 'left',
    padding: '0px 8px',
    minHeight: 'auto',
    margin: '8px 0px 20px',
    '& .MuiTextField-root': {
      width: '100%',
    },
    '& .MuiFormControl-root': {
      width: '100%',
      margin: '0',
    },
    '& input': {
      color: '#2B2D30',
      fontSize: '14px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      height: '56px',
    },
    '& .MuiFormLabel-root': {
      fontSize: '16px',
    },
    '& .MuiSelect-root': {
      fontSize: '14px',
    },
    '& .MuiFormHelperText-root': {
      fontSize: '12px',
    },
  },
  settlementHeading: {
    fontSize: '20px',
    color: '#0B1941',
    margin: theme.spacing(1),
  },

  multitBox: {
    float: 'left',
    padding: '0px 8px',
    // padding: "10px 10px 0",
    margin: '8px 0px',
    '& input': {
      color: '#2B2D30',
      fontSize: '14px',
      boxSizing: 'border-box',
      borderRadius: '4px',
      height: '56px',
    },
    '& .MuiTextField-root': {
      width: '50%!important',
      padding: '0 5px',
      boxSizing: 'border-box',
      margin: '0',
      '&:nth-child(2n+0)': {
        float: 'right',
        paddingRight: '0',
      },
      '&:first-child': {
        float: 'left',
        paddingLeft: '0',
      },
    },
    '& .MuiFormLabel-root': {
      fontSize: '16px',
    },
    '& .MuiSelect-root': {
      fontSize: '14px',
    },
    '& .MuiFormHelperText-root': {
      fontSize: '12px',
    },
  },
  btnHolder: {
    float: 'left',
    textAlign: 'center',
    margin: '10px 0 0',
    '& button': {
      display: 'inline-block',
      margin: '0 10px',
      minWidth: '93px',
      textTransform: 'uppercase',
      fontSize: '14px',
      '&.MuiButton-outlinedPrimary': {
        border: '1px solid #008CE6',
        color: '#008CE6',
      },
      '&.MuiButton-containedPrimary': {
        background: '#008CE6',
      },
    },
  },
});

const SettlementAccount = (props) => {
  const {
    classes,
    t,
    currencyCodes,
    achAccountList,
    dispatch,
    notification,
    canEdit,
    saveProcessing,
    handleValidation,
    selectedSettlementAccountId,
    alertText
  } = props;
  const [settlementData, setSettlementData] = React.useState({
    accountName: null,
    accountNumber: null,
    routingCode: null,
    companyName: null,
    companyIdentification: null,
    companyEntryDescription: null,
    companyDiscretionaryData: null,
    originatingDFIIdentification: null,
    originatingDFIDiscretionaryData: null,
    currencyCode: null,
    accountId: null,
  });
  const [settlementAccountId, setSettlementAccountId] = React.useState(-1);
  const [openConfirmationDialog, setOpenConfirmationDialog] =
  React.useState(false);
  const [error, setError] = React.useState({
    accountName: '',
    accountNumber: '',
    routingCode: '',
    companyName: '',
    companyIdentification: '',
    companyEntryDescription: '',
    companyDiscretionaryData: '',
    originatingDFIIdentification: '',
    immediateOrigin: '',
    immediateOriginName: '',
    immediateDestination: '',
    immediateDestinationName: '',
    currencyCode: '',
    settlementAccountId: '',
  });
  React.useEffect(() => {
    if (selectedSettlementAccountId && selectedSettlementAccountId > 0) {
      setSettlementAccountId(selectedSettlementAccountId);
      const selectedAccount = achAccountList?.data?.rows?.find(
        (item) => item.accountId === selectedSettlementAccountId
      );
      if (selectedAccount) {
        achB2CProfilesInformation().then((response) => {
          if (response?.data) {
            const { data } = response.data;
            setSettlementData({
              ...settlementData,
              ...data,
              ...selectedAccount,
            });
          }
        });
      } else {
        getAchB2CProfilesInformation();
      }
    } else {
      getAchB2CProfilesInformation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSettlementAccountId, achAccountList?.data?.rows]);

  const getAchB2CProfilesInformation = () => {
    achB2CProfilesInformation().then((response) => {
      if (response?.data) {
        const { data } = response.data;
        setSettlementData({
          ...settlementData,
          ...data,
        });
      }
    });
  };

  const onSettlementAccountChange = ({ target }) => {
    const { value } = target;
    setSettlementAccountId(value);
    if (value !== -1) {
      setError({ ...error, settlementAccountId: '' });
    }
    if (value && value > 0) {
      const selectedAccount = achAccountList?.data?.rows.find(
        (item) => item.accountId === value
      );
      if (selectedAccount) {
        setSettlementData({ ...settlementData, ...selectedAccount });
      }
    } else {
      setSettlementData({ ...settlementData, ...settlementConstData });
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setSettlementData({
      ...settlementData,
      [name]: value.length === 0 ? null : value,
    });
  };

  const handleIntegerValueChange = (event) => {
    const { name, value } = event.target;
    setSettlementData({
      ...settlementData,
      [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
    });
  };

  const validation = () => {
    let valid = true;
    let validation = {};
    const {
      currencyCode,
      accountName,
      routingCode,
      accountNumber,
      companyName,
      companyIdentification,
      companyEntryDescription,
      originatingDFIIdentification,
    } = settlementData;
    if (!settlementAccountId || settlementAccountId === -1) {
      valid = false;
      validation['settlementAccountId'] = t(
        'componentData.paymentMethods.settlementAccountReq'
      );
    } else {
      if (!currencyCode || !currencyCode.trim().length) {
        valid = false;
        validation['currencyCode'] = t(
          'componentData.paymentMethods.currencyCodeReq'
        );
      }

      if (!accountName || accountName.trim().length === 0) {
        validation['accountName'] = t(
          'componentData.paymentMethods.accountName'
        );
        valid = false;
      }

      if (!routingCode || routingCode.trim().length === 0) {
        validation['routingCode'] = t(
          'componentData.paymentMethods.routingCode'
        );
        valid = false;
      }
      if (routingCode && routingCode.length < 9) {
        validation['routingCode'] = t(
          'componentData.bankDetail.RoutingCodeLen'
        );
        valid = false;
      }

      if (!accountNumber || accountNumber.trim().length === 0) {
        validation['accountNumber'] = t(
          'componentData.paymentMethods.accountNumber'
        );
        valid = false;
      }
      if (accountNumber && accountNumber.length < 6) {
        validation['accountNumber'] = t('componentData.bankDetail.acNumMinLen');
        valid = false;
      }

      if (!companyName || companyName.trim().length === 0) {
        validation['companyName'] = t(
          'componentData.paymentMethods.companyName'
        );
        valid = false;
      } else if (companyName && companyName.length > 16) {
        validation['companyName'] = t(
          'componentData.bankDetail.CompanyNameMaxLen'
        );
        valid = false;
      }

      if (!companyIdentification || companyIdentification.trim().length === 0) {
        validation['companyIdentification'] = t(
          'componentData.paymentMethods.companyIdentification'
        );
        valid = false;
      }
      if (companyIdentification && companyIdentification.length < 10) {
        validation['companyIdentification'] = t(
          'componentData.bankDetail.CompanyIdentificationLen'
        );
        valid = false;
      }

      if (
        !companyEntryDescription ||
        companyEntryDescription.trim().length === 0
      ) {
        validation['companyEntryDescription'] = t(
          'componentData.paymentMethods.companyEntryDescription'
        );
        valid = false;
      }
      if (companyEntryDescription && companyEntryDescription.length < 2) {
        validation['companyEntryDescription'] = t(
          'componentData.bankDetail.CompanyEntryMinLen'
        );
        valid = false;
      }

      if (
        !originatingDFIIdentification ||
        originatingDFIIdentification.trim().length === 0
      ) {
        validation['originatingDFIIdentification'] = t(
          'componentData.paymentMethods.originatingDFIIdentification'
        );
        valid = false;
      }
      if (
        originatingDFIIdentification &&
        originatingDFIIdentification.length < 8
      ) {
        validation['originatingDFIIdentification'] = t(
          'componentData.bankDetail.originatingDFIIdentificationLen'
        );
        valid = false;
      }
    }

    setError(validation);
    return valid;
  };

  const onSubmit = () => {
    const clientId = props.user.userData.portalProfileId || null;
    const valid = validation();
    const paymentMethodData = handleValidation();
    const {
      currencyCode,
      accountName,
      routingCode,
      accountNumber,
      companyName,
      companyIdentification,
      companyEntryDescription,
      originatingDFIIdentification,
      originatingDFIDiscretionaryData,
      companyDiscretionaryData,
    } = settlementData;
    if (valid && paymentMethodData) {
      const data = {
        accountId: settlementAccountId,
        accountName,
        accountNumber: Boolean(accountNumber) ? accountNumber : null,
        routingCode,
        companyName,
        companyIdentification,
        companyEntryDescription,
        companyDiscretionaryData,
        originatingDFIIdentification,
        originatingDFIDiscretionaryData,
        currencyCode,
      };

      if (settlementAccountId && settlementAccountId > 0) {
        dispatch(
          settingUpdateB2CBankInfo({
            clientId: clientId,
            bankDetail: data,
          })
        ).then((response) => {
          if (!response) {
            const errorMsg =
              response && response.message
                ? response.message
                : t('componentData.bankDetail.ErrorWhileSavingData');
            notification('error', errorMsg);
            return false;
          } else {
            props.onSubmit(settlementAccountId);
          }
        });
      } else {
        const { accountId, ...restBankDetail } = data;
        dispatch(
          settingCreateB2CBankInfo({
            clientId: clientId,
            bankDetail: restBankDetail,
          })
        ).then((accountId) => {
          if (accountId) {
            setSettlementData({
              ...restBankDetail,
              accountId: accountId,
            });
            setSettlementAccountId(accountId);
            props.onSubmit(accountId);
          } else {
            notification(
              'error',
              t('componentData.bankDetail.ErrorWhileSavingData')
            );
            return false;
          }
        });
      }
    } else {
      notification('error', t('componentData.commonErr.validationMsg'));
      return false;
    }
  };
  const handleSubmit = () => {
    setOpenConfirmationDialog(true);
  };

  const handleClose = () => {
    setOpenConfirmationDialog(false)
  };

  const handleConfirm = () => {
    onSubmit()
    setOpenConfirmationDialog(false)
  }
  let noNameAccountCount = 1;
  return (
    <>
      <Grid container>
        <Grid item xs={12} className={classes.settlementHeading}>
          <Typography>
            {t('componentData.settlementAccount.addSettlementAccountDetails')}
          </Typography>
        </Grid>
        <Grid item xs={6} className={classes.inputBox}>
          <FormControl
            variant="outlined"
            error={Boolean(error.settlementAccountId)}
          >
            <Select
              id="demo-simple-select-outlined"
              value={settlementAccountId}
              onChange={(e) => onSettlementAccountChange(e)}
            >
              <MenuItem value={-1}>
                <em>{t('componentData.settlementAccount.Select')}</em>
              </MenuItem>
              {achAccountList?.data?.rows?.map((item) => {
                let tempAccountName = '';
                if (!item.accountName) {
                  tempAccountName = `Settlement Account ${
                    noNameAccountCount < 10 ? '0' : ''
                  }${noNameAccountCount}`;
                  noNameAccountCount++;
                }
                return (
                  <MenuItem
                    value={item.accountId}
                    className={classes.accountsMenuList}
                  >
                    <Grid
                      container
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Grid item>
                        {tempAccountName ? tempAccountName : item.accountName}
                      </Grid>
                      <Grid
                        item
                        style={{ color: '#9E9E9E', paddingRight: '8px' }}
                      >
                        {item.accountNumber}
                      </Grid>
                    </Grid>
                  </MenuItem>
                );
              })}
              <MenuItem value={'-2'} className={classes.newAccountMenu}>
                <img
                  src={AddCircleIcon}
                  alt="ADD"
                  className={classes.plusIcon}
                />
                {t('componentData.settlementAccount.newAchAccount')}
              </MenuItem>
            </Select>
            {error.settlementAccountId && (
              <FormHelperText>{error.settlementAccountId}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
      {settlementAccountId && settlementAccountId !== -1 && (
        <Grid container>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.bankDetail.AccountName')}
              error={error.accountName}
              helperText={error.accountName}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              color="secondary"
              value={settlementData.accountName || ''}
              name="accountName"
              onChange={onChange}
              inputProps={{
                maxLength: 50,
                minLength: 1,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.bankDetail.OriginatingDFIIdentification')}
              error={error.originatingDFIIdentification}
              helperText={error.originatingDFIIdentification}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.originatingDFIIdentification || ''}
              name="originatingDFIIdentification"
              onChange={handleIntegerValueChange}
              inputProps={{
                maxLength: 8,
                minLength: 8,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label={t('componentData.bankDetail.BankRoutingCode')}
              error={error.routingCode}
              helperText={error.routingCode}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              color="secondary"
              value={settlementData.routingCode || ''}
              name="routingCode"
              inputProps={{
                maxLength: 9,
                minLength: 9,
              }}
              onChange={handleIntegerValueChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <MaskInput
              label={t('componentData.bankDetail.BankAccountNumber')}
              error={error.accountNumber}
              helperText={error.accountNumber}
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              color="secondary"
              value={settlementData.accountNumber || ''}
              name="accountNumber"
              inputProps={{
                maxLength: 17,
                minLength: 6,
              }}
              getValue={(val) => {
                setSettlementData({
                  ...settlementData,
                  accountNumber: val,
                });
              }}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t(
                'componentData.bankDetail.OriginatingDFIDiscretionaryData'
              )}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.originatingDFIDiscretionaryData || ''}
              name="originatingDFIDiscretionaryData"
              onChange={onChange}
              inputProps={{
                maxLength: 2,
                minLength: 1,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label={t('componentData.bankDetail.CompanyName')}
              error={error.companyName}
              helperText={error.companyName}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.companyName || ''}
              name="companyName"
              onChange={onChange}
              inputProps={{
                minLength: 1,
                maxLength: 16,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <TextField
              label={t('componentData.paymentMethods.CompanyIdentification')}
              error={error.companyIdentification}
              helperText={error.companyIdentification}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.companyIdentification || ''}
              name="companyIdentification"
              onChange={handleIntegerValueChange}
              inputProps={{
                maxLength: 10,
                minLength: 10,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.multitBox}>
            <TextField
              label={t('componentData.bankDetail.ImmediateDestination')}
              color="secondary"
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={settlementData.immediateDestination || ''}
              name="immediateDestination"
              error={error.immediateDestination}
              helperText={error.immediateDestination}
              inputProps={{
                maxLength: 9,
                minLength: 9,
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={onChange}
              required
            />

            <TextField
              label={t('componentData.bankDetail.ImmediateOriginName')}
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              variant="outlined"
              value={settlementData.immediateOriginName || ''}
              name="immediateOriginName"
              error={error.immediateOriginName}
              helperText={error.immediateOriginName}
              inputProps={{
                maxLength: 23,
                minLength: 1,
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={onChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <Box style={{ minWidth: '30%' }}>
              <TextField
                label={t('componentData.bankDetail.CompanyEntryDescription')}
                error={error.companyEntryDescription}
                helperText={error.companyEntryDescription}
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                variant="outlined"
                value={settlementData.companyEntryDescription || ''}
                name="companyEntryDescription"
                onChange={onChange}
                inputProps={{
                  maxLength: 10,
                  minLength: 2,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.bankDetail.ImmediateDestinationName')}
              color="secondary"
              fullWidth={true}
              autoComplete="off"
              variant="outlined"
              value={settlementData.immediateDestinationName || ''}
              name="immediateDestinationName"
              error={error.immediateDestinationName}
              helperText={error.immediateDestinationName}
              inputProps={{
                maxLength: 23,
                minLength: 1,
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={onChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <Box>
              <TextField
                label={t('componentData.bankDetail.CompanyDiscretionaryData')}
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                variant="outlined"
                value={settlementData.companyDiscretionaryData || ''}
                name="companyDiscretionaryData"
                onChange={onChange}
                inputProps={{
                  maxLength: 20,
                  minLength: 1,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              label={t('componentData.bankDetail.ImmediateOrigin')}
              fullWidth={true}
              autoComplete="off"
              color="secondary"
              variant="outlined"
              value={settlementData.immediateOrigin || ''}
              name="immediateOrigin"
              error={error.immediateOrigin}
              helperText={error.immediateOrigin}
              inputProps={{
                maxLength: 10,
                minLength: 10,
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={onChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} className={classes.inputBox}>
            <TextField
              select
              fullWidth={true}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              required
              autoComplete="off"
              value={settlementData.currencyCode}
              name="currencyCode"
              label={t('componentData.bankDetail.CurrencyCode')}
              onChange={onChange}
              dir="horizontal"
              inputProps={{
                maxLength: 100,
              }}
              error={error.currencyCode}
              helperText={error.currencyCode}
            >
              {currencyCodes &&
                currencyCodes
                  .filter((item) => item.isoCode === 'USD')
                  .map((code) => (
                    <MenuItem key={code.isoCode} value={code.isoCode}>
                      {code.isoCode}
                    </MenuItem>
                  ))}
            </TextField>
          </Grid>
        </Grid>
      )}
      {canEdit && (
        <Grid container>
          <Grid item xs={12} className={classes.btnHolder}>
            <Button
              variant="outlined"
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                width: '120px',
                margin: '0px 10px 0 0',
              }}
              onClick={() => props.onCancel()}
            >
              {t('componentData.addAccountCK.Cancel')}
            </Button>

            {saveProcessing ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit()}
              >
                {t('componentData.onboardZelle.SAVE')}
              </Button>
            )}
          </Grid>
        </Grid>
      )}
      {openConfirmationDialog && (
        <ConfirmationDialog
          open={openConfirmationDialog}
          dialogContent={alertText}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          cancelButtonLabel={t('componentData.paymentMethods.CANCEL')}
          saveButtonLabel={t('componentData.paymentMethods.SUBMIT')}
        />
      )}
    </>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.b2cPayments,
  }))(withStyles(styles)(SettlementAccount))
);
