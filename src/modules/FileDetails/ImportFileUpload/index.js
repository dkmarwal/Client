import React, { Component } from 'react';
import { Box, Typography, Paper } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import Dropzone from 'react-dropzone';
import { Button } from '~/components/Forms';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { connect } from 'react-redux';
import { fileName } from '~/config/paymentMethods';
import { styles } from './styles';
import {
  GetIsPaymentFileExist,
  uploadFile,
  fetchPaymentFileStatus,
  fetchPaymentUSbankFileStatus,
} from '~/redux/helpers/files';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import Notification from '~/components/Notification';
import Tooltip from '@material-ui/core/Tooltip';
import { PayerTypes, FileStatusProcessingId } from '~/config/entityTypes';

class ImportFileUpload extends Component {
  state = {
    validationText: '',
    files: [],
    showText: false,
    processing: false,
    uploadStatus: '',
    variant: 'error',
    attempts: 0,
    percentComplete: 0,
  };
  onDrop = (acceptedFiles) => {
    const { t } = this.props;
    if (acceptedFiles.length === 0) {
      this.setState({
        validationText: t('componentData.importFileUpload.fileFormat'),
      });
    } else if (acceptedFiles.length > 1) {
      this.setState({
        validationText: t('componentData.importFileUpload.oneFileAtATime'),
      });
    } else {
      const { userData, isPayeeChoicePortal } = this.props.user;
      const payerId = userData.payerTypeId || PayerTypes.PMTX;
      const num = isPayeeChoicePortal ? 15 : 10;
      GetIsPaymentFileExist(
        userData.portalProfileId,
        acceptedFiles[0].path,
        payerId,
        num
      )
        .then((response) => {
          if (response.error) {
            throw response.error;
          }
          const code = response.data;
          switch (code) {
            case 1:
              this.setState({
                files: acceptedFiles,
                validationText: '',
              });
              this.uploadFileClick();
              break;
            case 2:
              this.setState({
                validationText: t('componentData.importFileUpload.FileExists'),
                files: [],
              });
              break;
            case 3:
              this.setState({
                validationText: t('componentData.importFileUpload.wrongFormat'),
                files: [],
              });
              break;
            default:
              break;
          }
        })
        .catch((error) => {
          ////console.log(error);
          this.setState({
            validationText:
              typeof error === 'string'
                ? error
                : t('componentData.importFileUpload.unknownErr'),
          });
        });
    }
  };

  uploadFileClick = () => {
    const { t,handleFileUploadNotifications } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    const { files } = this.state;
    const clientId = this.props.user.userData.portalProfileId;
    const { userData } = this.props.user;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('fileName', files[0]?.name);
    formData.append('clientId', clientId);
    formData.append('fileFormatId', isPayeeChoicePortal ? 15 : 10);
    formData.append(
      'uploadedBy',
      userData ? userData.firstName + userData.lastName : ''
    );
    const getShortString = files[0]?.name?.replace(/^(?:[^_]*_){2}/g, '');
    let Subfileformat = getShortString.substring(
      getShortString.indexOf('_'),
      -1
    );
    let filevalidFormat = Subfileformat === fileName;
    if (isPayeeChoicePortal) {
      if (filevalidFormat) {
        if (files.length > 0) {
          this.setState(
            {
              processing: true,
            },
            () => {
              const clientId = this.props.user.userData.portalProfileId;
              const { userData } = this.props.user;
              const formData = new FormData();
              formData.append('file', files[0]);
              formData.append('fileName', files[0]?.name);
              formData.append('clientId', clientId);
              formData.append('fileFormatId', isPayeeChoicePortal ? 15 : 10);
              formData.append(
                'uploadedBy',
                userData ? userData.firstName + userData.lastName : ''
              );

              uploadFile(formData)
                .then((response) => {
                  if (response.error) {
                    throw response.error;
                  }
                  if (isPayeeChoicePortal) {
                    this.callUSBankFileStatusFunction(response.data.data);
                  } else {
                    this.callFileStatusFunction(response.data.data);
                  }
                })
                .catch((error) => {
                  handleFileUploadNotifications('error',t(
                    'componentData.importFileUpload.tryAgain'
                  ))
                  setTimeout(
                    function () {
                      this.setState({
                        processing: false,
                      });
                    }.bind(this),
                    2000
                  );
                });
            }
          );
        }
      } else {
        this.setState({
          validationText: t('componentData.importFileUpload.wrongFormat'),
          files: [],
        });
      }
    } else {
      uploadFile(formData)
        .then((response) => {
          if (response.error) {
            throw response.error;
          }
          if (isPayeeChoicePortal) {
            this.callUSBankFileStatusFunction(response.data.data);
          } else {
            this.callFileStatusFunction(response.data.data);
          }
        })
        .catch((error) => {
          this.setState({
            uploadStatus: t('componentData.importFileUpload.tryAgain'),
            variant: 'error',
          });
          setTimeout(
            function () {
              this.setState({
                processing: false,
              });
            }.bind(this),
            2000
          );
        });
    }
  };

  callUSBankFileStatusFunction = (id) => {
    this.intervalId = setInterval(() => {
      this.getUSBankFileStatusId(id);
    }, 3000);
  };

  getUSBankFileStatusId = async (id) => {
    const { t,handleFileUploadNotifications } = this.props;
    const clientId = this.props.user.userData.portalProfileId;
    const { attempts } = this.state;
    if (attempts < 10) {
      try {
        const res = await fetchPaymentUSbankFileStatus(id, clientId);
        const processingId = res.data?.data?.[0]?.PaymentFileProcessingID;

        if ((processingId === FileStatusProcessingId.FileRejected) || !processingId) {
          clearInterval(this.intervalId);
          handleFileUploadNotifications('error',t(
            'componentData.importFileUpload.ErrorWhileUploading'
          ))
          this.setState(
            {
              percentComplete: 99,
            },
            () => {
              setTimeout(
                function () {
                  this.props.onCancel();
                }.bind(this),
                2000
              );
            }
          );
        } else {
          const { attempts, percentComplete } = this.state;
          this.setState(
            {
              attempts: attempts + 1,
              percentComplete:
                percentComplete < 90
                  ? percentComplete + 10
                  : percentComplete,
            },
            () => {
              if (
                processingId >= FileStatusProcessingId.FileProcessing
              ) {
                clearInterval(this.intervalId);
                handleFileUploadNotifications('success',t(
                  'componentData.importFileUpload.uploadedSuccessfully'
                ))
                this.setState(
                  {
                    percentComplete: 100,
                  },
                  () => {
                    setTimeout(
                      function () {
                        this.props.onCancel();
                      }.bind(this),
                      2000
                    );
                  }
                );
              } 
              else if (this.state.attempts === 10 && processingId < FileStatusProcessingId.FileProcessing) {
                clearInterval(this.intervalId);
                handleFileUploadNotifications('success',t(
                  'componentData.importFileUpload.fileUploadInProcess'
                ))
                this.setState(
                  {
                    percentComplete: 99,
                  },
                  () => {
                    setTimeout(
                      function () {
                        this.props.onCancel();
                      }.bind(this),
                      2000
                    );
                  }
                );
              }
            }
          );
        }
      } catch (e) {}
    }
  };

  callFileStatusFunction = (id) => {
    setInterval(
      function () {
        this.getFileStatusById(id);
      }.bind(this),
      2000
    );
  };
  getFileStatusById = async (id) => {
    const { t } = this.props;
    const { attempts } = this.state;
    if (attempts < 10) {
      try {
        const res = await fetchPaymentFileStatus(id);

        const processingId = res.data.data[0].PaymentFileProcessingID;
        if (processingId > 70) {
          this.setState(
            {
              uploadStatus: t(
                'componentData.importFileUpload.uploadedSuccessfully'
              ),
              variant: 'success',
              percentComplete: 100,
            },
            () => {
              setTimeout(
                function () {
                  this.props.onCancel();
                }.bind(this),
                2000
              );
            }
          );
        }
        const { attempts, percentComplete } = this.state;
        this.setState(
          {
            attempts: attempts + 1,
            percentComplete:
              percentComplete !== 100 ? percentComplete + 10 : percentComplete,
          },
          () => {
            if (attempts === 9) {
              clearInterval(this.callFileStatusFunction);
              this.setState(
                {
                  uploadStatus: t(
                    'componentData.importFileUpload.ErrorWhileUploading'
                  ),
                  variant: 'error',
                  percentComplete: 99,
                },
                () => {
                  setTimeout(
                    function () {
                      this.props.onCancel();
                    }.bind(this),
                    2000
                  );
                }
              );
            }
          }
        );
      } catch (e) {}
    }
  };
  render() {
    const { t, user, classes, onCancel } = this.props;
    const { userData } = user;
    const {isPayeeChoicePortal} = user
    const {
      files,
      validationText,
      processing,
      uploadStatus,
      variant,
      percentComplete,
    } = this.state;
    const payerId = userData.payerTypeId || PayerTypes.PMTX;
    const style = {
      width: percentComplete + '%',
    };
    return (
      <>
        <Dropzone
          onDrop={this.onDrop}
          accept={
            payerId === PayerTypes.CARDS
              ? '.csv, application/vnd.ms-excel, text/csv, .txt, .dat, .xml'
              : '.csv, application/vnd.ms-excel, text/csv, .txt, .dat'
          }
          minSize={0}
          multiple
          noClick={true}
          noKeyboard={true}
        >
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            open,
            isDragReject,
            rejectedFiles,
          }) => {
            return (
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Box my={4} className={classes.container} p={3}>
                  <IconButton
                    color='primary'
                    aria-label='Close Icon'
                    component='span'
                    className={classes.btnClose}
                    onClick={onCancel}
                  >
                    <CloseIcon fontSize='small' color='primary' />
                  </IconButton>

                  <Typography variant='h2' className={classes.primaryGrey}>
                    {isDragActive
                      ? t('componentData.importFileUpload.DropHere')
                      : t('componentData.importFileUpload.FileUpload')}
                    <IconButton
                      color='primary'
                      aria-label='upload picture'
                      component='span'
                    >
                      <Tooltip
                        title={
                          payerId === PayerTypes.CARDS
                            ? t(
                                'componentData.importFileUpload.fileUploadCCMsg'
                              )
                            : user.isPayeeChoicePortal
                            ? t(
                                'componentData.importFileUpload.fileUploadUSbankMsg'
                              )
                            : t('componentData.importFileUpload.fileUploadMsg')
                        }
                        arrow
                      >
                        <InfoIcon fontSize='small' color='primary' />
                      </Tooltip>
                    </IconButton>
                  </Typography>
                  <Box my={1} textAlign='center'>
                    {' '}
                    <img
                      src={require(`~/assets/icons/icon_uploadfile.svg`)}
                      alt={t('componentData.importFileUpload.imageUpload')}
                    />
                  </Box>
                  <Typography
                    variant='h5'
                    className={classes.smallText}
                    gutterBottom
                  >
                    {isDragActive
                      ? t('componentData.importFileUpload.DropHere')
                      : t('componentData.importFileUpload.dragFile')}
                  </Typography>
                  <Typography variant='span' className={classes.primaryRed}>
                    <Box m={3}>{validationText}</Box>
                  </Typography>
                  <Typography variant='div' className={classes.alignCenter}>
                    <Box>
                      <Button
                        type='submit'
                        variant='contained'
                        fullWidth={false}
                        color='primary'
                        onClick={open}
                      >
                        {t('componentData.importFileUpload.ChooseYourFile')}
                      </Button>
                    </Box>
                  </Typography>
                </Box>
              </div>
            );
          }}
        </Dropzone>
        {processing && (
          <>
            <Paper square className={classes.fileProcessBox}>
              <Typography variant='h2' align='center'>
                {t('componentData.importFileUpload.FileUpload')}
                <IconButton
                  color='primary'
                  aria-label='upload picture'
                  component='span'
                >
                  {!user.isPayeeChoicePortal ? (
                    <Tooltip
                      title={
                        payerId === PayerTypes.CARDS
                          ? t('componentData.importFileUpload.fileUploadCCMsg')
                          : user.isPayeeChoicePortal
                          ? t(
                              'componentData.importFileUpload.fileUploadUSbankMsg'
                            )
                          : t('componentData.importFileUpload.fileUploadMsg')
                      }
                      arrow
                    >
                      <InfoIcon fontSize='small' color='primary' />
                    </Tooltip>
                  ) : (
                    <InfoIcon fontSize='small' color='primary' />
                  )}
                </IconButton>
              </Typography>
              <Box
                my={3}
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Box width='70%' alignItems='center'>
                  <Typography variant='h2' className={classes.textGrey}>
                    <DescriptionOutlinedIcon />{' '}
                    {files.map((file) => {
                      return `${file.path} (${file.size} ${t(
                        'componentData.importFileUpload.bytes'
                      )})`;
                    })}
                  </Typography>
                </Box>
                <Box width='30%'>
                  {percentComplete === 100 ? (
                    <Typography variant='h2' className={classes.textGrey}>
                      {t('componentData.importFileUpload.UploadComplete')}
                    </Typography>
                  ) : (
                    <Typography variant='h2' className={classes.textGrey}>
                      <Box
                        className={classes.fileProgressBar}
                        display='flex'
                        alignItems='center'
                      >
                        {' '}
                        <span style={style}></span>
                      </Box>{' '}
                      {percentComplete}%
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
            {!isPayeeChoicePortal && uploadStatus && (
              <Notification variant={variant} message={uploadStatus} />
            )}
          </>
        )}
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({ ...state.user }))(withStyles(styles)(ImportFileUpload))
);
