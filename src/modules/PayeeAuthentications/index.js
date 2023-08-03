import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  Paper,
  Grid,
  Box,
  CircularProgress,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core';
import Button from '~/components/Forms/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import TextField from '~/components/Forms/TextField';
import { withStyles } from '@material-ui/styles';
import styles from './styles';
import { accessRights } from '~/config/accessRights';
import { fetchB2CClientData } from '~/redux/actions/client';
import ImportParentPaymentDetails from '~/modules/ImportParentPaymentDetails';

import Notification from '~/components/Notification';
import 'react-notifications/lib/notifications.css';
import config from '~/config';
import trim from 'deep-trim-node';

import { PAYEE_AUTHENTICATION_MIN_ITEM_LIMIT } from '~/config/entityTypes';

import {
  getPayeeAuthenticationSettingsData,
  savePayeeAuthenticationSettingsData,
} from '~/redux/helpers/USbank/filesettings';

class PayeeValidation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: null,
      parentId: null,
      clientEmail: null,
      isLoading: false,
      isBtnClicked: false,
      errorMsg: null,
      variant: null,
      payeeId1Edit: false,
      payeeId2Edit: false,
      payeeId3Edit: false,
      payeeId4Edit: false,
      fileSettingsData: [],
      B2bSettingsData: [],
      B2bSettingsDataadd: [],
      B2cSettingsData: [],
      B2cSettingsDataadd: [],
      B2bSettingsDatasel: [],
      B2cSettingsDatasel: [],
      filterCustomB2bArr: [],
      filterCustomB2cArr: [],
      filterCustomhideB2bArr: [],
      filterCustomhideB2cArr: [],
      customB2bArr: [],
      customB2cArr: [],
      customB2bArrcopy: [],
      customB2cArrcopy: [],
      errors: {},
      checkboxesb2bState: {},
      checkboxesb2cState: {},
      custumb2bState: {},
      custumb2cState: {},
      addingLoader: false,
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const { userData } = this.props.user;
    this.setState({
      clientId: this.props.isOnboarding
        ? parseInt(urlParams.get('id'))
        : userData.portalProfileId,
    });

    const { t } = this.props;
    if (this.props.isOnboarding) {
      this.props.changeActiveStep(2);
    }
    if (this.props.client.clientInfo.length > 0) {
      this.setState({
        parentId: this.props.client.clientInfo?.rows[0]?.parentId,
        clientEmail: this.props.clientInfo?.rows[0]?.emailAddress,
      });
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const { userData } = this.props.user;
      this.setState(
        {
          clientId: this.props.isOnboarding
            ? parseInt(urlParams.get('id'))
            : userData.portalProfileId,
          isLoading: true,
        },
        () => {
          this.props
            .dispatch(fetchB2CClientData(this.state.clientId))
            .then((response) => {
              if (!response) {
                throw this.props.client.error;
              }
              const clientData =
                this.props.client.clientInfo.rows &&
                this.props.client.clientInfo.rows.length &&
                this.props.client.clientInfo.rows[0];

              this.setState({
                clientId: clientData.clientId,
                clientEmail: clientData.emailAddress
                  ? clientData.emailAddress
                  : '',
                parentId: clientData.parentId,
                showBanner:
                  clientData.parentId === null ||
                  typeof clientData.parentId === 'undefined'
                    ? false
                    : true,
              });

              this.loadData(clientData.clientId, false);
            })
            .catch((error) => {
              this.setState({
                isLoading: false,
                errorMsg:
                  typeof error === 'string'
                    ? error
                    : t('componentData.fileSettings.unknownErr'),
              });
            });
        }
      );
    }
  }

  loadData = async (clientId, flag) => {
    const { t } = this.props;
    this.setState({ isLoading: true });
    const fileSettingsData = await getPayeeAuthenticationSettingsData(
      clientId,
      flag
    );
    let { error } = fileSettingsData;
    if (!error) {
      const B2bSettingsData = fileSettingsData?.data?.B2bSettingsData ?? [];
      const B2cSettingsData = fileSettingsData?.data?.B2cSettingsData ?? [];
      const B2bSettingsDatasel = this.showFieldIsSelected(B2bSettingsData);
      const B2cSettingsDatasel = this.showFieldIsSelected(B2cSettingsData);
      const filterCustomB2bArr = fileSettingsData?.data?.B2bSettingsData ?? [];
      const filterCustomB2cArr = fileSettingsData?.data?.B2cSettingsData ?? [];
      const customB2bArr = this.showCustomFieldIsSelected(B2bSettingsData);
      const customB2cArr = this.showCustomFieldIsSelected(B2cSettingsData);
      this.setState({
        customB2bArrcopy: filterCustomB2bArr,
        customB2cArrcopy: filterCustomB2cArr,
      });
      this.setState({
        B2bSettingsData,
        B2cSettingsData,
        B2bSettingsDatasel,
        B2cSettingsDatasel,
        filterCustomB2bArr,
        filterCustomB2cArr,
        customB2bArr,
        customB2cArr,
        isLoading: false,
        errorMsg: '',
      });
    } else {
      this.setState({
        isLoading: false,
        errorMsg:
          typeof error === 'string'
            ? error
            : t('componentData.USbankfileSettings.unknownErr'),
      });
    }
  };

  importParentsData = () => {
    const { parentId } = this.state;
    this.setState({ showBanner: false });
    this.loadData(parentId, true);
  };

  addCustumFieldFunction = () => {
    const customFieldArray = [...this.state.filterCustomB2cArr];
    const indexOfHiddenCF = customFieldArray.findIndex(
      (item) => item.isHide === 1 && item.isCustomField === 1
    );
    if (indexOfHiddenCF > -1) {
      customFieldArray[indexOfHiddenCF].isHide = 0;
      customFieldArray[indexOfHiddenCF].isSelect = 1;
      customFieldArray.push(customFieldArray.splice(indexOfHiddenCF, 1)[0]);
      this.setState({
        filterCustomB2cArr: customFieldArray,
      });
    } else {
      this.handleClickMaxFieldError();
    }
  };

  addCustumFieldb2bFunction = () => {
    const customFieldArray = [...this.state.filterCustomB2bArr];
    const indexOfHiddenCF = customFieldArray.findIndex(
      (item) => item.isHide === 1 && item.isCustomField === 1
    );
    if (indexOfHiddenCF > -1) {
      customFieldArray[indexOfHiddenCF].isHide = 0;
      customFieldArray[indexOfHiddenCF].isSelect = 1;
      customFieldArray.push(customFieldArray.splice(indexOfHiddenCF, 1)[0]);
      this.setState({
        filterCustomB2bArr: customFieldArray,
      });
    } else {
      this.handleClickMaxFieldError();
    }
  };
  handleSelectCustomField = (fieldIndex) => {
    const customFieldArray = [...this.state.filterCustomB2cArr];
    const isSelectVal = customFieldArray[fieldIndex].isSelect;
    customFieldArray[fieldIndex].isSelect = isSelectVal === 0 ? 1 : 0;
    this.setState({
      filterCustomB2cArr: customFieldArray,
    });
  };
  handleSelectb2bCustomField = (fieldIndex) => {
    const customFieldArray = [...this.state.filterCustomB2bArr];
    const isSelectVal = customFieldArray[fieldIndex].isSelect;
    customFieldArray[fieldIndex].isSelect = isSelectVal === 0 ? 1 : 0;
    this.setState({
      filterCustomB2bArr: customFieldArray,
    });
  };
  handleDeleteCustomField = (deletedFieldId) => {
    const customFieldArray = [...this.state.filterCustomB2cArr];
    const indexOfDeleltedCF = customFieldArray.findIndex(
      (item) => item.fieldId === deletedFieldId
    );
    customFieldArray[indexOfDeleltedCF].displayName = 'Custom Field';
    customFieldArray[indexOfDeleltedCF].isSelect = 0;
    customFieldArray[indexOfDeleltedCF].isHide = 1;
    customFieldArray.push(customFieldArray.splice(indexOfDeleltedCF, 1)[0]);
    this.setState({
      filterCustomB2cArr: customFieldArray,
    });
  };
  handleDeleteb2bCustomField = (deletedFieldId) => {
    const customFieldArray = [...this.state.filterCustomB2bArr];
    const indexOfDeleltedCF = customFieldArray.findIndex(
      (item) => item.fieldId === deletedFieldId
    );
    customFieldArray[indexOfDeleltedCF].displayName = 'Custom Field';
    customFieldArray[indexOfDeleltedCF].isSelect = 0;
    customFieldArray[indexOfDeleltedCF].isHide = 1;
    customFieldArray.push(customFieldArray.splice(indexOfDeleltedCF, 1)[0]);
    this.setState({
      filterCustomB2bArr: customFieldArray,
    });
  };

  handleEditCustomField = ({ target }, fieldIndex) => {
    const customFieldArray = [...this.state.filterCustomB2cArr];
    customFieldArray[fieldIndex].displayName = target.value;
    customFieldArray[fieldIndex].isSelect = 1;
    this.setState({
      filterCustomB2cArr: customFieldArray,
    });
  };
  handleEditb2bCustomField = ({ target }, fieldIndex) => {
    const customFieldArray = [...this.state.filterCustomB2bArr];
    customFieldArray[fieldIndex].displayName = target.value;
    customFieldArray[fieldIndex].isSelect = 1;
    this.setState({
      filterCustomB2bArr: customFieldArray,
    });
  };
  handleClickMaxFieldError = () => {
    const { t } = this.props;
    this.setState({
      errorMsg: t('componentData.USbankfileSettings.maxCustomFieldLen'),
      variant: 'error',
    });
  };

  showCustomFieldIsSelected = (arr) => {
    const sampleArr = [...arr];
    return sampleArr.filter((item) => {
      return item.isCustomField === 1 && item.isHide === 0 ? item : false;
      // return item.isCustomField === 1 ? item : false;
    });
  };
  showFieldIsSelected = (arr) => {
    const sampleArr = [...arr];
    const result = sampleArr.filter((item) => {
      return item.isSelect === 0;
    });
    return result.map((data) => {
      return data.displayName;
    });
  };

  oneditcustumb2bChange = (id) => {
    const { custumb2bState } = this.state;
    this.setState({
      custumb2bState: {
        ...this.state.custumb2bState,
        [id]: custumb2bState[id] ? false : true,
      },
    });
  };
  oneditcustumb2cChange = (id) => {
    const { custumb2cState } = this.state;
    this.setState({
      custumb2cState: {
        ...this.state.custumb2cState,
        [id]: custumb2cState[id] ? false : true,
      },
    });
  };
  oneditb2bChange = (id) => {
    const { checkboxesb2bState } = this.state;
    this.setState({
      checkboxesb2bState: {
        ...this.state.checkboxesb2bState,
        [id]: checkboxesb2bState[id] ? false : true,
      },
    });
  };

  oneditb2cChange = (id) => {
    const { checkboxesb2cState } = this.state;
    this.setState({
      checkboxesb2cState: {
        ...this.state.checkboxesb2cState,
        [id]: checkboxesb2cState[id] ? false : true,
      },
    });
  };
  onBlurb2bChange = (id) => {
    this.setState({
      checkboxesb2bState: { ...this.state.checkboxesb2bState, [id]: false },
    });
  };
  onBlurb2cChange = (id) => {
    this.setState({
      checkboxesb2cState: { ...this.state.checkboxesb2cState, [id]: false },
    });
  };
  onBlurcustumb2bChange = (id) => {
    this.setState({
      custumb2bState: { ...this.state.custumb2bState, [id]: false },
    });
  };
  onBlurcusumb2cChange = (id) => {
    this.setState({
      custumb2cState: { ...this.state.custumb2cState, [id]: false },
    });
  };

  validateForm = () => {
    const { t } = this.props;
    const { B2bSettingsData, B2cSettingsData,filterCustomB2bArr,filterCustomB2cArr } = this.state;
    let valid = true;

    const B2bCloneLength = [...B2bSettingsData].filter(
      (obj) => obj.isSelect === 1||(obj.isCustomField===1&&obj.isHide === 0)
    ).length;
   
   
    const B2cCloneLength = [...B2cSettingsData].filter(
      (obj) => obj.isSelect === 1||(obj.isCustomField===1&&obj.isHide === 0)
    ).length;
    if (
      B2bCloneLength < PAYEE_AUTHENTICATION_MIN_ITEM_LIMIT ||
      B2cCloneLength < PAYEE_AUTHENTICATION_MIN_ITEM_LIMIT
    ) {
      this.setState({
        errorMsg: t('componentData.USbankfileSettings.minCheckBoxLen'),
        variant: 'error',
      });
      valid = false;
    }

    return valid;
  };

  setObjectRespose = (obj) => {
    const { fieldId, displayName } = obj;
    const newObj = {};
    newObj.fieldId = fieldId;
    newObj.displayName = displayName;
    newObj.isB2b = obj.isB2b === 1 ? 1 : 0;
    newObj.isB2c = obj.isB2c === 1 ? 1 : 0;
    newObj.isSelect = obj.isSelect === 1 ? 1 : 0;
    return newObj;
  };

  filterSelectedObjct = async (arr) => {
    const newArr = [];
    for (let index = 0; index < arr.length; index++) {
      newArr.push(this.setObjectRespose(arr[index]));
    }
    return newArr;
  };
  saveAllFileSettingsData = async () => {
    const { t } = this.props;
    if (this.validateForm()) {
      this.setState({ isBtnClicked: true });
      const {
        clientId,
        B2bSettingsDatasel,
        B2cSettingsDatasel,
        filterCustomB2cArr,
        filterCustomB2bArr,
      } = this.state;
      const filterCustomB2cArrPayload = filterCustomB2cArr.filter((data) => {
        if (data.isSelect === 1) {
          return data;
        } else {
          if (data.isCustomField) {
            if (data.displayName !== 'Custom Field') {
              return data;
            }
          } else if (!B2cSettingsDatasel.includes(data.displayName)) {
            return data;
          }
          return null;
        }
      });
      const filterCustomB2bArrPayload = filterCustomB2bArr.filter((data) => {
        if (data.isSelect === 1) {
          return data;
        } else {
          if (data.isCustomField) {
            if (data.displayName !== 'Custom Field') {
              return data;
            }
          } else if (!B2bSettingsDatasel.includes(data.displayName)) {
            return data;
          }
          return null;
        }
      });

      this.setState({ errorMsg: null });
      const payloadfileSettingsData = [
        ...filterCustomB2cArrPayload,
        ...filterCustomB2bArrPayload,
      ];
      const payloadArr = this.filterSelectedObjct(payloadfileSettingsData);
      const payload = await trim(payloadArr.then((data) => data));
      const ressp = await savePayeeAuthenticationSettingsData(
        clientId,
        payload
      );

      this.setState({ isBtnClicked: false });
      if (ressp.error) {
        this.setState({
          errorMsg:
            typeof ressp.message === 'string'
              ? ressp.message
              : t('componentData.USbankfileSettings.unknownErr'),
          variant: 'error',
        });
      } else {
        if (this.props.isOnboarding) {
          this.props.history.push(
            `${config.baseName}/onboard/remittance?id=${clientId}`
          );
        } else {
          this.setState({
            errorMsg: t(
              'componentData.USbankfileSettings.AuthParameterSuccess'
            ),
            variant: 'success',
          });
        }
      }
    }
  };

  handleClosekMaxFieldError = () => {
    this.setState({ errorMsg: null });
  };

  render() {
    const { t } = this.props;
    const {
      clientId,
      isLoading,
      showBanner,
      isBtnClicked,
      errorMsg,
      variant,
      checkboxesb2bState,
      checkboxesb2cState,
      custumb2cState,
      custumb2bState,
      filterCustomB2cArr,
      filterCustomB2bArr,
    } = this.state;
    const { classes, isOnboarding, user } = this.props;

    if (isLoading) {
      return (
        <Paper
          display='flex'
          className={classes.root1}
          elevation={1}
          style={{ marginTop: !isOnboarding && 0 }}
        >
          <Box display='flex' p={3} justifyContent='center' alignItems='center'>
            <CircularProgress color='primary' />
          </Box>
        </Paper>
      );
    }
    const ispayeeFilesEditEnabled = this.props.isOnboarding
      ? true
      : (user.userRoles &&
          user.userRoles.includes(
            accessRights['SETTINGS_PAYEE_AUTHENTICATION_EDIT']
          )) ||
        false;

    return (
      <>
        {isOnboarding && ispayeeFilesEditEnabled && showBanner && (
          <Grid item xs={12} className={classes.importText}>
            <ImportParentPaymentDetails
              onConfirm={this.importParentsData}
              onCancel={() => {
                this.setState({
                  showBanner: false,
                });
              }}
            />
          </Grid>
        )}

        <>
          <Paper
            display='flex'
            className={classes.root1}
            elevation={1}
            style={{ marginTop: !isOnboarding && 0 }}
          >
            <Grid
              container
              item
              alignItems='flex-start'
              id='filesettings-list-view'
            >
              {/* <Grid container item direction="row" spacing={2}>
              <Grid item xs={12}>
                <Typography className={classes.genralTitleBold}>
                  {t("componentData.USbankfileSettings.authenticationSettings")}:
                </Typography>
              </Grid>
            </Grid> */}

              <Grid container item direction='row'>
                <Grid container item direction='row' spacing={2}>
                  <Grid item xs={7}>
                    <Typography className={classes.genralTitleBold}>
                      {t('componentData.USbankfileSettings.parameterForB2C')}
                    </Typography>
                    <Typography
                      className={`${classes.panelHeading} ${classes.b2bSectionSubHead}`}
                    >
                      {t('componentData.USbankfileSettings.minCheckBoxLen')}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={5}
                    justify='flex-end'
                    alignItems='flex-end'
                  >
                    {ispayeeFilesEditEnabled && (
                      <Button
                        variant='outlined'
                        className={classes.addFIeldButton}
                        onClick={() => this.addCustumFieldFunction()}
                        startIcon={<AddIcon />}
                      >
                        {t('componentData.USbankfileSettings.addFieldBtn')}
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  direction='row'
                  spacing={4}
                  className={classes.checkboxContainer}
                >
                  <Grid
                    container
                    item
                    direction='column'
                    xs={5}
                    style={{ paddingLeft: '20px' }}
                  >
                    {filterCustomB2cArr.length
                      ? filterCustomB2cArr.map((item, index) => {
                          if (item.isCustomField === 0) {
                            return (
                              <Box
                                display='flex'
                                alignItems='center'
                                justifyContent='space-between'
                                key={item.fieldId}
                                order={item.displayOrder}
                                sx={{ width: '60%', minWidth: '400px' }}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        item.isSelect === (1 || true)
                                          ? true
                                          : false
                                      }
                                      onChange={() =>
                                        this.handleSelectCustomField(index)
                                      }
                                      disabled={
                                        !ispayeeFilesEditEnabled ||
                                        item.fieldId === 1
                                      }
                                    />
                                  }
                                  className={
                                    item.fieldId === 1 &&
                                    ispayeeFilesEditEnabled &&
                                    classes.disabledLabel
                                  }
                                  label={
                                    !checkboxesb2cState[item.fieldId] ? (
                                      item.displayName
                                    ) : (
                                      <TextField
                                        fullWidth={true}
                                        color='secondary'
                                        autoComplete='off'
                                        name={item.fieldName}
                                        label={item.displayName}
                                        variant='outlined'
                                        value={item.displayName}
                                        onChange={(event) =>
                                          this.handleEditCustomField(
                                            event,
                                            index
                                          )
                                        }
                                        onBlur={() =>
                                          this.onBlurb2cChange(item.fieldId)
                                        }
                                        inputProps={{ maxLength: 30 }}
                                        autoFocus={true}
                                      />
                                    )
                                  }
                                />
                                {!checkboxesb2cState[item.fieldId] &&
                                  ispayeeFilesEditEnabled && (
                                    <EditIcon
                                      fontSize='small'
                                      onClick={(e) =>
                                        this.oneditb2cChange(item.fieldId)
                                      }
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                      }}
                                      className={classes.editIcon}
                                    />
                                  )}
                              </Box>
                            );
                          }
                          return null;
                        })
                      : null}
                  </Grid>
                  {filterCustomB2cArr.length > 0 ? (
                    <Grid
                      container
                      item
                      xs={7}
                      justify='flex-start'
                      alignItems='flex-start'
                      style={{ flexFlow: 'column' }}
                    >
                      {this.state.filterCustomB2cArr.map((item, index) => {
                        if (!item.isHide && item.isCustomField === 1) {
                          return (
                            <Box
                              key={item.fieldId}
                              display='flex'
                              alignItems='center'
                              justifyContent='space-between'
                              className={classes.width60}
                              sx={{ width: '60%', minWidth: '400px' }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    // checked={
                                    //   item.isSelect === (1 || true)
                                    //     ? true
                                    //     : false
                                    // }
                                    checked={
                                      true
                                    }
                                    onChange={() =>
                                      this.handleSelectCustomField(index)
                                    }
                                    // disabled={!ispayeeFilesEditEnabled}
                                    disabled={true}
                                   
                                  />
                                }
                                className={
                                  classes.disabledLabel
                                }
                                label={
                                  !custumb2cState[item.fieldId] ? (
                                    item.displayName
                                  ) : (
                                    <TextField
                                      fullWidth={true}
                                      color='secondary'
                                      autoComplete='off'
                                      name={item.fieldName}
                                      label={item.displayName}
                                      variant='outlined'
                                      value={item.displayName}
                                      onChange={(event) =>
                                        this.handleEditCustomField(event, index)
                                      }
                                      onBlur={() =>
                                        this.onBlurcusumb2cChange(item.fieldId)
                                      }
                                      autoFocus={true}
                                      inputProps={{ maxLength: 30 }}
                                      disabled={!ispayeeFilesEditEnabled}
                                    />
                                  )
                                }
                              />
                              {ispayeeFilesEditEnabled && (
                                <grid>
                                  {!custumb2cState[item.fieldId] && (
                                    <EditIcon
                                      fontSize='small'
                                      onClick={() =>
                                        this.oneditcustumb2cChange(item.fieldId)
                                      }
                                      className={classes.editIcon}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                      }}
                                    />
                                  )}
                                  <DeleteIcon
                                    onClick={() =>
                                      this.handleDeleteCustomField(item.fieldId)
                                    }
                                    className={classes.deleteIcon}
                                    fontSize='small'
                                  />
                                </grid>
                              )}
                            </Box>
                          );
                        }
                        return null;
                      })}
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
              <Grid
                container
                item
                direction='row'
                className={classes.extraSpace}
              >
                <Grid container item direction='row' spacing={2}>
                  <Grid item xs={7}>
                    <Typography className={classes.genralTitleBold}>
                      {t('componentData.USbankfileSettings.parameterForB2B')}
                    </Typography>
                    <Typography
                      className={`${classes.panelHeading} ${classes.b2bSectionSubHead}`}
                    >
                      {t('componentData.USbankfileSettings.minCheckBoxLen')}
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    item
                    xs={5}
                    justify='flex-end'
                    alignItems='flex-end'
                  >
                    {ispayeeFilesEditEnabled && (
                      <Button
                        variant='outlined'
                        className={classes.addFIeldButton}
                        onClick={() => this.addCustumFieldb2bFunction()}
                        startIcon={<AddIcon />}
                      >
                        {t('componentData.USbankfileSettings.addFieldBtn')}
                      </Button>
                    )}
                  </Grid>
                </Grid>

                <Grid
                  container
                  item
                  direction='row'
                  spacing={4}
                  className={classes.checkboxContainer}
                >
                  <Grid
                    container
                    item
                    direction='column'
                    xs={5}
                    className={classes.controlLabel}
                  >
                    {filterCustomB2bArr.length
                      ? filterCustomB2bArr.map((item, index) => {
                          if (item.isCustomField === 0) {
                            return (
                              <Box
                                display='flex'
                                alignItems='center'
                                justifyContent='space-between'
                                key={item.fieldId}
                                order={item.displayOrder}
                                sx={{ width: '60%', minWidth: '400px' }}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        item.isSelect === (1 || true)
                                          ? true
                                          : false
                                      }
                                      onChange={() =>
                                        this.handleSelectb2bCustomField(index)
                                      }
                                      disabled={
                                        !ispayeeFilesEditEnabled ||
                                        item.fieldId === 1
                                      }
                                    />
                                  }
                                  className={
                                    item.fieldId === 1 &&
                                    ispayeeFilesEditEnabled &&
                                    classes.disabledLabel
                                  }
                                  label={
                                    !checkboxesb2bState[item.fieldId] ? (
                                      item.displayName
                                    ) : (
                                      <TextField
                                        fullWidth={true}
                                        color='secondary'
                                        autoComplete='off'
                                        name={item.fieldName}
                                        label={item.displayName}
                                        variant='outlined'
                                        value={item.displayName}
                                        onChange={(event) =>
                                          this.handleEditb2bCustomField(
                                            event,
                                            index
                                          )
                                        }
                                        onBlur={() =>
                                          this.onBlurb2bChange(item.fieldId)
                                        }
                                        inputProps={{ maxLength: 30 }}
                                        autoFocus={true}
                                      />
                                    )
                                  }
                                />
                                <grid>
                                  {!checkboxesb2bState[item.fieldId] &&
                                    ispayeeFilesEditEnabled && (
                                      <EditIcon
                                        fontSize='small'
                                        onClick={() =>
                                          this.oneditb2bChange(item.fieldId)
                                        }
                                        onMouseDown={(e) => {
                                          e.preventDefault();
                                        }}
                                        className={classes.editIcon}
                                      />
                                    )}
                                </grid>
                              </Box>
                            );
                          }
                          return null;
                        })
                      : null}
                  </Grid>

                  {filterCustomB2bArr.length > 0 ? (
                    <Grid
                      container
                      item
                      xs={7}
                      justify='flex-start'
                      alignItems='flex-start'
                      style={{ flexFlow: 'column' }}
                    >
                      {filterCustomB2bArr.map((item, index) => {
                        if (!item.isHide && item.isCustomField === 1) {
                          return (
                            <Box
                              key={item.fieldId}
                              display='flex'
                              alignItems='center'
                              justifyContent='space-between'
                              className={classes.width60}
                              sx={{ width: '60%', minWidth: '400px' }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      true
                                      // item.isSelect === (1 || true)
                                      //   ? true
                                      //   : false
                                    }
                                    onChange={() =>
                                      this.handleSelectb2bCustomField(index)
                                    }
                                    // disabled={!ispayeeFilesEditEnabled}
                                    disabled={true}
                                    
                                  />
                                  
                                }
                                className={
                                  classes.disabledLabel
                                }
                                label={
                                  !custumb2bState[item.fieldId] ? (
                                    item.displayName
                                  ) : (
                                    <TextField
                                      fullWidth={true}
                                      color='secondary'
                                      autoComplete='off'
                                      name={item.fieldName}
                                      label={item.displayName}
                                      variant='outlined'
                                      value={item.displayName}
                                      onChange={(event) =>
                                        this.handleEditb2bCustomField(
                                          event,
                                          index
                                        )
                                      }
                                      onBlur={() =>
                                        this.onBlurcustumb2bChange(item.fieldId)
                                      }
                                      autoFocus={true}
                                      inputProps={{ maxLength: 30 }}
                                      disabled={!ispayeeFilesEditEnabled}
                                    />
                                  )
                                }
                                key={item.fieldId}
                              />
                              {ispayeeFilesEditEnabled && (
                                <grid>
                                  {!custumb2bState[item.fieldId] && (
                                    <EditIcon
                                      fontSize='small'
                                      onClick={() =>
                                        this.oneditcustumb2bChange(item.fieldId)
                                      }
                                      className={classes.editIcon}
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                      }}
                                    />
                                  )}
                                  <DeleteIcon
                                    onClick={() =>
                                      this.handleDeleteb2bCustomField(
                                        item.fieldId,
                                        item
                                      )
                                    }
                                    className={classes.deleteIcon}
                                    fontSize='small'
                                  />
                                </grid>
                              )}
                            </Box>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
          <Grid container item direction='row'>
            {isBtnClicked ? (
              <Grid
                container
                direction='row'
                alignItems='center'
                justifyContent='center'
              >
                <Box
                  display='flex'
                  p={3}
                  justifyContent='center'
                  alignItems='center'
                >
                  <CircularProgress color='primary' />
                </Box>
              </Grid>
            ) : (
              <Grid container direction='row' alignItems='center'>
                {isOnboarding && (
                  <Grid container item xs={6} justifyContent='flex-end'>
                    <Box m={2} mb={5}>
                      <Button
                        variant='outlined'
                        color='primary'
                        onClick={(e) =>
                          this.props.history.push(
                            `${config.baseName}/onboard/payment?id=${clientId}`
                          )
                        }
                        className={`${classes.nextBtn}`}
                      >
                        {t('componentData.USbankfileSettings.Back')}
                      </Button>
                    </Box>
                  </Grid>
                )}
                <Grid
                  container
                  item
                  xs={isOnboarding ? 6 : 12}
                  justifyContent={!isOnboarding ? 'center' : 'flex-start'}
                >
                  <Box m={2} mb={5}>
                    {ispayeeFilesEditEnabled && (
                      <Button
                        color='primary'
                        variant='contained'
                        onClick={this.saveAllFileSettingsData}
                        className={`${classes.nextBtn}`}
                      >
                        {isOnboarding
                          ? t('componentData.fileSettings.Next')
                          : t('componentData.fileSettings.Save')}
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        </>
        {errorMsg && (
          <Notification
            variant={variant}
            message={errorMsg}
            handleClose={() => {
              this.setState({ errorMsg: null });
            }}
          />
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.client, ...state.user }))(
    withStyles(styles)(PayeeValidation)
  )
);
