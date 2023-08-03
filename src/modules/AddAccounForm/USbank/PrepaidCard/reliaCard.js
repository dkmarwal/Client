import React, { Component } from 'react';
import styles from './styles.js';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  Box,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Divider,
  TableCell,
  TableHead,
  TableRow,
  Table,
  TableBody,
  CircularProgress,
  Button,
  Tooltip,
  Backdrop,
  Checkbox,
  MenuItem,
} from '@material-ui/core';
import FileUploadIcon from '~/assets/icons/file_upload.svg';
import DeleteIcon from '@material-ui/icons/Delete';
import NoDataFound from '~/assets/icons/no_data_found.svg';
import {
  uploadPrepaidCardFiles,
  fetchUSBankPrepaidCardData,
  createUsBankPrepaidCard,
  fetchAllUSbankAchList,
  fetchUSBankAchProfilesInformation,
  updateUSBankPrepaidCard,
} from '~/redux/actions/USbank/payments';
import { downloadPrepaidCardFiles } from '~/redux/helpers/USbank/payments';
import trim from 'deep-trim-node';
import { paymentMethods } from '~/config/paymentMethods';
import { ConfirmDialog } from '~/components/Dialogs';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PreivewModal from '~/components/Modal/PreviewModal.js';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import FocusNonPayrollACHAccount from './PrepaidCardACH/focusReliaACH';

class ReliaCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reliaCardData: {
        transId: null,
        cardType: null,
        certificateCardPasscode: null,
        certificateCardId: null,
        addThankYouNote: null,
        addPredisclosureText: this.props.t('componentData.USBankPrepaidCard.addPredisclosureText'),
        addVerbiageText: null,
        uploadFile: [],
        isName: false,
        isEmail: false,
        isSsn: false,
        isDateOfBirth: false,
        isAddress: false,
        isMobilePhone: false,
        isHomePhone: false,
        isEmployeeState: false,
        isUniqueId: false,
        isGovLocation: false,
        isGovIdType: false,
        cardUploadImageName: null,
        ndaFileNames: null,
        paymentTypeId: null,
        imageFullPath: null,
        clientDebitAccountId: null,
        govIdTypeId: 0,
      },
      error: {
        transId: '',
        cardType: '',
        certificateCardPasscode: '',
        certificateCardId: '',
        addThankYouNote: '',
        addPredisclosureText: '',
        addVerbiageText: '',
      },
      showConfirmRemoveDialog: false,
      deleteFileType: null,
      confirmationText: null,
      disclosureFormIndex: null,
      formsUploading: false,
      cardImageUploading: false,
      openPreviewDialog: false,
      showPreviewDialogLoader: false,
      achAccountsList: [],
      clientACHAccountId: null,
      saveProcessing: false,
      isSubmitClicked: false,
    };
  }

  componentDidMount = async () => {
    if (
      this.props.USBankPayment.storedPrepaidCardData?.data &&
      !this.props.USBankPayment.storedPrepaidCardData.data.nodata
    ) {
      this.props.dispatch(fetchAllUSbankAchList(this.props.clientId, 'ACH'));
    }

    this.props.dispatch(fetchUSBankAchProfilesInformation());
    const paymentTypeList = this.props.b2cPaymentTypesList;
    const reliaCardPayment = paymentTypeList.filter(
      (item) => item.paymentCode === paymentMethods.PrepaidReliaCard
    );
    if (reliaCardPayment?.length) {
      this.setState({
        reliaCardData: {
          ...this.state.reliaCardData,
          transId: reliaCardPayment[0]?.transId,
          paymentTypeId: reliaCardPayment[0]?.paymentTypeId,
        },
      });
    }
    await this.getPrepaidCardAPIData();
  };

  getPrepaidCardAPIData = () => {
    if (!this.props.isAddAccount) {
      const clientId = this.props.clientId || null;
      this.props
        .dispatch(fetchUSBankPrepaidCardData(clientId))
        .then((response) => {
          if (response && response.error) {
            const errorMsg =
              this.props.USBankPayment.storedPrepaidCardData &&
              this.props.USBankPayment.storedPrepaidCardData.error
                ? this.props.USBankPayment.storedPrepaidCardData.error
                : null;
            this.props.notification('error', errorMsg);
            return false;
          } else {
            this.setAPIDataInState();
          }
        });
    }
  };

  setAPIDataInState = () => {
    if (
      this.props.USBankPayment.storedPrepaidCardData?.data &&
      !this.props.USBankPayment.storedPrepaidCardData.data.nodata
    ) {
      const prePaidCardData =
        this.props.USBankPayment.storedPrepaidCardData.data;
      if (
        Object.keys(prePaidCardData.prepaidCardData[0]).length &&
        prePaidCardData.prepaidCardData[0].paymentTypeId ===
          this.state.reliaCardData.paymentTypeId
      ) {
        let finalCardDetails = prePaidCardData.registrationData[0];
        if (this.props.showParentInfo) {
          const { reliaFocusId, ...restDetail } =
            prePaidCardData.registrationData[0];
          finalCardDetails = restDetail;
        }
        this.setState({
          reliaCardData: {
            ...this.state.reliaCardData,
            ...finalCardDetails,
            uploadFile: [
              ...this.props.USBankPayment.storedPrepaidCardData.data
                ?.ndaFilesData,
            ],
          },
          clientACHAccountId: finalCardDetails.clientDebitAccountId,
        });
      }
    }
  };

  setReliaFocusId = () => {
    const prePaidCardData = this.props.USBankPayment.storedPrepaidCardData.data;
    this.setState({
      reliaCardData: {
        ...this.state.reliaCardData,
        ...prePaidCardData.registrationData[0],
        uploadFile: prePaidCardData?.ndaFilesData,
      },
    });
  };

  onChange = ({ target }) => {
    const numericFields = [
      'certificateCardId',
      'cardType',
      'certificateCardPasscode',
    ];
    const { name, value } = target;
    let targetValue = value;
    if (numericFields.includes(name)) {
      targetValue = value.replace(/[^0-9]/g, '');
    }
    this.setState({
      reliaCardData: {
        ...this.state.reliaCardData,
        [name]: targetValue,
      },
    });
  };

  handleRegParamsCheckbox = ({ target }) => {
    const { name, checked } = target;
    this.setState({
      reliaCardData: {
        ...this.state.reliaCardData,
        [name]: checked,
      },
    });
  };

  renderNotification = (type) => {
    if (type) {
      this.props.notification(
        'error',
        this.props.USBankPayment.usBankPrepaidCard?.error ??
          this.props.t('componentData.reduxData.SomethingWentWrong')
      );
    } else {
      this.props.notification(
        'success',
        this.props.USBankPayment.usBankPrepaidCard?.data?.message
      );
    }
  };

  handleSaveProcessing = (val) => {
    this.setState({
      saveProcessing: val,
    });
  };

  handleParentClick = () => {
    this.handleIsSubmitClicked(true);
  };

  handleIsSubmitClicked = (val) => {
    this.setState({
      isSubmitClicked: val,
    });
  };

  onSubmit = (clientDebitAccountId) => {
    const valid = this.validation();
    const tempProps = this.props;
    if (valid) {
      const clientId = tempProps.clientId || null;
      this.setState({
        saveProcessing: true,
      });
      const prepaidCardData = trim(this.state.reliaCardData);
      if (this.state.reliaCardData.uploadFile?.length) {
        if (this.state.reliaCardData.uploadFile.length > 5) {
          tempProps.notification(
            'error',
            tempProps.t('componentData.USBankPrepaidCardError.maxFileUpload')
          );
          this.setState({
            saveProcessing: false,
          });
          return false;
        }
        prepaidCardData.ndaFileNames = this.state.reliaCardData.uploadFile
          .map((obj) => obj.fileActualName)
          .join(':');
      } else {
        prepaidCardData.ndaFileNames = null;
      }

      if (prepaidCardData.reliaFocusId) {
        tempProps
          .dispatch(
            updateUSBankPrepaidCard(
              prepaidCardData,
              clientId,
              clientDebitAccountId
            )
          )
          .then((response) => {
            if (response && !response.error) {
              this.renderNotification();
              tempProps.closeModal(true);
              this.props.dispatch(fetchAllUSbankAchList(clientId, 'ACH'));
              this.setState({
                saveProcessing: false,
                clientACHAccountId: clientDebitAccountId,
              });
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
          .dispatch(
            createUsBankPrepaidCard(
              prepaidCardData,
              clientId,
              clientDebitAccountId
            )
          )
          .then((response) => {
            if (response && !response.error) {
              this.setState({
                saveProcessing: false,
                clientACHAccountId: clientDebitAccountId,
              });
              this.props
                .dispatch(fetchUSBankPrepaidCardData(clientId))
                .then((res) => {
                  this.setReliaFocusId();
                });
              this.props.dispatch(fetchAllUSbankAchList(clientId, 'ACH'));
              this.renderNotification();
              tempProps.closeModal(true);
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
      tempProps.notification(
        'error',
        tempProps.t('componentData.USBankPrepaidCardError.validationErr')
      );
    }
  };

  validation = () => {
    let valid = true;
    let validation = {};
    const { t } = this.props;
    const { transId, certificateCardPasscode, certificateCardId } =
      this.state.reliaCardData;
    if (!transId) {
      validation['transId'] = t(
        'componentData.USBankPrepaidCardError.transIdReq'
      );
      valid = false;
    }
    if (!certificateCardId) {
      validation['certificateCardId'] = t(
        'componentData.USBankPrepaidCardError.certificateCardIdReq'
      );
      valid = false;
    }
    if (!certificateCardPasscode) {
      validation['certificateCardPasscode'] = t(
        'componentData.USBankPrepaidCardError.certificateCardPasscodeReq'
      );
      valid = false;
    }
    this.setState({
      error: { ...validation },
    });
    return valid;
  };

  validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  handleUploadFormClick = (e) => {
    if (e.target.files?.length) {
      if (e.target.files.length > 5) {
        this.props.notification(
          'error',
          this.props.t('componentData.USBankPrepaidCardError.maxFileUpload')
        );
        return false;
      } else if (
        this.state.reliaCardData.uploadFile.length + e.target.files.length >
        5
      ) {
        this.props.notification(
          'error',
          this.props.t('componentData.USBankPrepaidCardError.maxFileUpload')
        );
        return false;
      }
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const isInvalidFile = ['application/pdf'].indexOf(files[i].type) === -1;
        if (isInvalidFile) {
          this.props.notification(
            'error',
            this.props.t(
              'componentData.USBankPrepaidCardError.invalidFileTypeErr'
            )
          );
          return false;
        }
      }
      let formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }
      this.setState({
        formsUploading: true,
      });
      this.props.dispatch(uploadPrepaidCardFiles(formData)).then((res) => {
        if (res?.error) {
          this.props.notification('error', res.message);
          this.setState({
            formsUploading: false,
          });
        } else if (res && res.data) {
          let filesUploaded = [];
          res.data.files.forEach((ele) => {
            let tempFilesObj = {
              fileActualName: ele.fileName,
              fileUploadedAt: res.data.uploadedAt,
            };
            filesUploaded.push(tempFilesObj);
          });
          this.setState({
            reliaCardData: {
              ...this.state.reliaCardData,
              uploadFile: [
                ...this.state.reliaCardData.uploadFile,
                ...filesUploaded,
              ],
            },
            formsUploading: false,
          });
        } else {
          this.props.notification(
            'error',
            this.props.t('componentData.reduxData.SomethingWentWrong')
          );
          this.setState({
            formsUploading: false,
          });
        }
      });
    }
  };

  handleUploadImageClick = (e) => {
    if (e.target.files?.length) {
      const files = e.target.files;
      const isValidFile = this.validateFile(files[0]);
      if (!isValidFile) {
        this.props.notification(
          'error',
          this.props.t('componentData.reduxData.cardUploadImageErr')
        );
        return false;
      }
      this.setState({
        cardImageUploading: true,
      });
      let formData = new FormData();
      formData.append('file', files[0]);
      this.props.dispatch(uploadPrepaidCardFiles(formData)).then((res) => {
        if (res && res.data) {
          this.setState({
            reliaCardData: {
              ...this.state.reliaCardData,
              cardUploadImageName: res.data.files?.[0]?.fileName,
            },
            cardImageUploading: false,
          });
        } else {
          this.props.notification(
            'error',
            this.props.t('componentData.reduxData.SomethingWentWrong')
          );
          this.setState({
            cardImageUploading: false,
          });
        }
      });
      e.target.value = ''
    }
  };

  handleDeleteFile = () => {
    const uploadedFiles = [...this.state.reliaCardData.uploadFile];
    uploadedFiles.splice(this.state.disclosureFormIndex, 1);
    this.setState({
      reliaCardData: {
        ...this.state.reliaCardData,
        uploadFile: uploadedFiles,
        disclosureFormIndex: null,
      },
    });
  };

  handleDeleteImage = () => {
    this.setState({
      reliaCardData: {
        ...this.state.reliaCardData,
        cardUploadImageName: null,
      },
    });
  };

  handleOpenConfirmationDialog = (itemType, confirmationText, fileIndex) => {
    this.setState({
      showConfirmRemoveDialog: true,
      deleteFileType: itemType,
      confirmationText: confirmationText,
      disclosureFormIndex: fileIndex,
    });
  };

  onCancelDelete = () => {
    this.setState({
      showConfirmRemoveDialog: false,
      deleteFileType: null,
      confirmationText: null,
      disclosureFormIndex: null,
    });
  };

  onConfirmDelete = () => {
    if (this.state.deleteFileType === 'cardImage') {
      this.handleDeleteImage();
    } else if (this.state.deleteFileType === 'disclosureForm') {
      this.handleDeleteFile();
    }
    this.onCancelDelete();
  };

  renderDeleteDialog = (title, message) => {
    return (
      <ConfirmDialog
        title={title}
        message={message}
        onCancel={() => this.onCancelDelete()}
        onConfirm={() => this.onConfirmDelete()}
      />
    );
  };

  handleOpenPreviewDialog = () => {
    this.setState({
      showPreviewDialogLoader: true,
    });
    this.props
      .dispatch(
        downloadPrepaidCardFiles(this.state.reliaCardData.cardUploadImageName)
      )
      .then((res) => {
        if (res && res.data) {
          const reader = new FileReader();
          reader.readAsDataURL(res.data);
          reader.onloadend = () => {
            const base64data = reader.result;
            this.setState({
              reliaCardData: {
                ...this.state.reliaCardData,
                imageFullPath: base64data,
              },
              openPreviewDialog: true,
              showPreviewDialogLoader: false,
            });
          };
        } else {
          this.setState({
            showPreviewDialogLoader: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          showPreviewDialogLoader: false,
        });
      });
  };

  handleClosePreviewDialog = () => {
    this.setState({
      openPreviewDialog: false,
    });
  };

  render() {
    const { classes, t } = this.props;
    const { error, showPreviewDialogLoader } = this.state;
    const {
      transId,
      cardType,
      certificateCardPasscode,
      certificateCardId,
      addThankYouNote,
      addPredisclosureText,
      addVerbiageText,
      uploadFile,
      isName,
      isEmail,
      isSsn,
      isDateOfBirth,
      isAddress,
      isMobilePhone,
      isHomePhone,
      isEmployeeState,
      isUniqueId,
      isGovLocation,
      cardUploadImageName,
      imageFullPath,
      govIdTypeId,
    } = this.state.reliaCardData;

    return (
      <Box style={{ paddingLeft: '10px' }}>
        <Grid container justifyContent='center' spacing={2}>
          <Grid container justifyContent='flex-start'>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label={t('componentData.USBankPrepaidCard.transId')}
                  placeholder={t('componentData.USBankPrepaidCard.transId')}
                  error={Boolean(error.transId)}
                  helperText={error.transId}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={transId ?? ''}
                  name='transId'
                  required
                  disabled
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label={t('componentData.USBankPrepaidCard.cardType')}
                  placeholder={t('componentData.USBankPrepaidCard.cardType')}
                  error={Boolean(error.cardType)}
                  helperText={error.cardType}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={cardType ?? ''}
                  name='cardType'
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  inputProps={{
                    maxLength: 2,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label={t(
                    'componentData.USBankPrepaidCard.certificateCardPasscode'
                  )}
                  placeholder={t(
                    'componentData.USBankPrepaidCard.certificateCardPasscode'
                  )}
                  error={Boolean(error.certificateCardPasscode)}
                  helperText={error.certificateCardPasscode}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={certificateCardPasscode ?? ''}
                  name='certificateCardPasscode'
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  required
                  inputProps={{
                    maxLength: 10,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label={t('componentData.USBankPrepaidCard.certificateCardId')}
                  placeholder={t(
                    'componentData.USBankPrepaidCard.certificateCardId'
                  )}
                  error={Boolean(error.certificateCardId)}
                  helperText={error.certificateCardId}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={certificateCardId ?? ''}
                  name='certificateCardId'
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  required
                  inputProps={{
                    maxLength: 10,
                  }}
                />
              </Box>
            </Grid>
            <FocusNonPayrollACHAccount
              onSubmit={this.onSubmit}
              notification={this.props.notification}
              handleValidation={this.validation}
              selectedSettlementAccountId={
                this.state.reliaCardData.clientDebitAccountId
              }
              achAccountsList={
                this.props.USBankPayment.achUSBankClientAccountList
              }
              currencyList={this.props.currencyList}
              reliaFocusParams={this.props.USBankPayment?.reliaFocusCardParams}
              achUSBankProfileInfo={
                this.props.USBankPayment?.achUSBankProfileInfo
              }
              handleSaveProcessing={this.handleSaveProcessing}
              isSubmitClicked={this.state.isSubmitClicked}
              handleIsSubmitClicked={this.handleIsSubmitClicked}
              clientId={this.props.clientId}
            />
            <Grid item xs={12} sm={12}>
              <Typography className={classes.regParams}>
                {t('componentData.USBankPrepaidCard.regParams')}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                paddingLeft: '8px',
              }}
            >
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isName)}
                      name='isName'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isName')}
                />
              </Grid>
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isUniqueId)}
                      name='isUniqueId'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isUniqueId')}
                />
              </Grid>
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isEmail)}
                      name='isEmail'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isEmail')}
                />
              </Grid>
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isMobilePhone)}
                      name='isMobilePhone'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isMobilePhone')}
                />
              </Grid>
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isHomePhone)}
                      name='isHomePhone'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isHomePhone')}
                />
              </Grid>
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isDateOfBirth)}
                      name='isDateOfBirth'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isDateOfBirth')}
                />
              </Grid>
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isAddress)}
                      name='isAddress'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isAddress')}
                />
              </Grid>
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isSsn)}
                      name='isSsn'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isSsn')}
                />
              </Grid>
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isEmployeeState)}
                      name='isEmployeeState'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isEmployeeState')}
                />
              </Grid>
              <Grid item sm={3} xs={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(isGovLocation)}
                      name='isGovLocation'
                      onChange={this.handleRegParamsCheckbox}
                      icon={<CheckBoxOutlineBlankIcon />}
                      checkedIcon={<CheckBoxIcon />}
                    />
                  }
                  className={classes.regParamsCheckbox}
                  label={t('componentData.USBankPrepaidCard.isGovLocation')}
                />
              </Grid>
              <Grid item sm={3} xs={4} style={{marginTop:'4px'}}>
                <TextField
                  size='small'
                  select
                  style={{ width: '85%' }}
                  variant='outlined'
                  autoComplete='off'
                  value={govIdTypeId ?? 0}
                  name='govIdTypeId'
                  label={t('componentData.USBankPrepaidCard.isGovIdType')}
                  onChange={this.onChange}
                  dir='horizontal'
                  required
                >
                  <MenuItem value={0}>
                    {t('componentData.USBankPrepaidCard.select')}
                  </MenuItem>
                  {this.props.USBankPayment.reliaFocusCardParams?.data &&
                    this.props.USBankPayment.reliaFocusCardParams.data.govIdTypes.map(
                      (item) => (
                        <MenuItem key={item.idTypeId} value={item.idTypeId}>
                          {item.description}
                        </MenuItem>
                      )
                    )}
                </TextField>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label={t('componentData.USBankPrepaidCard.addVerbiageText')}
                  placeholder={t(
                    'componentData.USBankPrepaidCard.addVerbiageText'
                  )}
                  error={Boolean(error.addVerbiageText)}
                  helperText={error.addVerbiageText}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={addVerbiageText ?? ''}
                  name='addVerbiageText'
                  multiline
                  minRows={5}
                  maxRows={5}
                  onChange={this.onChange}
                  inputProps={{
                    maxLength: 2000,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label={t('componentData.USBankPrepaidCard.addThankYouNote')}
                  placeholder={t(
                    'componentData.USBankPrepaidCard.addThankYouNote'
                  )}
                  error={Boolean(error.addThankYouNote)}
                  helperText={error.addThankYouNote}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={addThankYouNote ?? ''}
                  name='addThankYouNote'
                  multiline
                  minRows={5}
                  maxRows={5}
                  onChange={this.onChange}
                  inputProps={{
                    maxLength: 2000,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>
                <TextField
                  color='secondary'
                  label='Add Pre-Disclosure text'
                  placeholder='Add Pre-Disclosure text'
                  error={Boolean(error.addPredisclosureText)}
                  helperText={error.addPredisclosureText}
                  fullWidth={true}
                  autoComplete='off'
                  variant='outlined'
                  value={addPredisclosureText ?? ''}
                  name='addPredisclosureText'
                  multiline
                  minRows={5}
                  maxRows={5}
                  onChange={this.onChange}
                  // onBlur={this.handleBlur}
                  inputProps={{
                    maxLength: 2000,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2}>

              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2} style={{ display: 'flex' }}>
                <Grid item sm={6} xs={6}>
                  <Typography>
                    {t('componentData.USBankPrepaidCard.uploadDisclosureForm')}
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={6}>
                  <>
                    <input
                      accept='.pdf'
                      id='upload-disclosure-form'
                      multiple
                      type='file'
                      style={{ display: 'none' }}
                      onChange={this.handleUploadFormClick}
                    />
                    {this.state.formsUploading ? (
                      <CircularProgress
                        style={{ marginLeft: '8px' }}
                        size={20}
                        color='primary'
                      />
                    ) : (
                      <label
                        htmlFor='upload-disclosure-form'
                        style={{ display: 'flex', cursor: 'pointer' }}
                      >
                        <img src={FileUploadIcon} alt='File Upload Icon' />
                        <Typography style={{ color: '#008CE6' }}>
                          {t('componentData.USBankPrepaidCard.chooseFile')}
                        </Typography>
                      </label>
                    )}
                  </>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.gridItem}>
              <Box mx={1} my={2} style={{ display: 'flex' }}>
                <Grid item sm={6} xs={6}>
                  <Typography>
                    {t('componentData.USBankPrepaidCard.uploadCardImage')}
                  </Typography>
                </Grid>
                <Grid item sm={6} xs={6}>
                  <>
                    <input
                      accept='image/png, image/jpg, image/jpeg'
                      id='upload-card-image'
                      type='file'
                      style={{ display: 'none' }}
                      onChange={this.handleUploadImageClick}
                    />
                    {cardUploadImageName && (
                      <Tooltip
                        title={cardUploadImageName}
                        placement={'top'}
                        arrow
                        classes={{ tooltip: classes.customWidth }}
                      >
                        <Typography className={classes.imageUploadedName}>
                          {cardUploadImageName}
                        </Typography>
                      </Tooltip>
                    )}
                    <Grid container>
                      <Grid item sm={10} xs={10}>
                        {this.state.cardImageUploading ? (
                          <CircularProgress size={20} color='primary' />
                        ) : (
                          <label
                            htmlFor='upload-card-image'
                            style={{ display: 'flex', cursor: 'pointer' }}
                          >
                            <img src={FileUploadIcon} alt='File Upload Icon' />
                            <Typography style={{ color: '#008CE6' }}>
                              {t('componentData.USBankPrepaidCard.chooseFile')}
                            </Typography>
                          </label>
                        )}
                      </Grid>
                      <Grid
                        item
                        sm={2}
                        xs={2}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        {cardUploadImageName &&
                           !this.state.cardImageUploading && (
                            <>
                              <VisibilityIcon
                                style={{ cursor: 'pointer' }}
                                fontSize='small'
                                onClick={() => this.handleOpenPreviewDialog()}
                              />
                              <DeleteIcon
                                style={{ cursor: 'pointer', marginLeft: '8px' }}
                                fontSize='small'
                                onClick={() =>
                                  this.handleOpenConfirmationDialog(
                                    'cardImage',
                                    t(
                                      'componentData.USBankPrepaidCard.deleteImageConfirmationText'
                                    )
                                  )
                                }
                              />
                            </>
                          )}
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              </Box>
            </Grid>
            <Divider
              style={{
                margin: '8px 0px',
                background: '#8F9EC4',
                width: '100%',
              }}
            />
            <Table>
              <TableHead
                style={{
                  background: '#E6E9EC',
                  borderRadius: '8px 8px 0px 0px',
                }}
              >
                <TableRow>
                  <TableCell>
                    {t('componentData.USBankPrepaidCard.formName')}
                  </TableCell>
                  <TableCell>
                    {t('componentData.USBankPrepaidCard.formUploadedAt')}
                  </TableCell>
                  <TableCell>
                    {t('componentData.USBankPrepaidCard.action')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploadFile?.length ? (
                  uploadFile.map((fileItem, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>{fileItem.fileActualName}</TableCell>
                        <TableCell>
                          {moment(fileItem.fileUploadedAt).format('MM/DD/YYYY')}
                        </TableCell>
                        <TableCell>
                          <DeleteIcon
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              this.handleOpenConfirmationDialog(
                                'disclosureForm',
                                t(
                                  'componentData.USBankPrepaidCard.deleteFormConfirmationText'
                                ),
                                index
                              )
                            }
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>
                      <>
                        <img
                          src={NoDataFound}
                          alt='No Data Found!'
                          width='auto'
                          height='80px'
                        />
                        <Typography
                          style={{
                            marginTop: '8px',
                            color: '#A1A1A1',
                          }}
                        >
                          {t('componentData.USBankPrepaidCard.noFilesUploaded')}
                        </Typography>
                      </>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Grid
              container
              item
              xs={12}
              justifyContent='center'
              style={{ marginTop: '16px' }}
            >
              {this.state.saveProcessing ||
              this.state.cardImageUploading ||
              this.state.formsUploading ? (
                <CircularProgress color='primary' />
              ) : (
                <>
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={this.props.onCancel}
                    style={{ margin: '0px 10px' }}
                  >
                    {t('componentData.addAccountCK.Cancel')}
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => this.handleParentClick()}
                    style={{ color: 'white' }}
                  >
                    {t('componentData.USBankPrepaidCard.save')}
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
        {this.state.showConfirmRemoveDialog &&
          this.renderDeleteDialog(this.state.confirmationText, '')}
        <Backdrop className={classes.backdrop} open={showPreviewDialogLoader}>
          <CircularProgress color='primary' />
        </Backdrop>
        <PreivewModal
          dialogTitle={t('componentData.USBankPrepaidCard.cardPreview')}
          imageLocation={imageFullPath ?? NoDataFound}
          confirmButton='OK'
          handleClose={this.handleClosePreviewDialog}
          open={this.state.openPreviewDialog}
        />
      </Box>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.USBankPayment,
  }))(withStyles(styles)(ReliaCard))
);
