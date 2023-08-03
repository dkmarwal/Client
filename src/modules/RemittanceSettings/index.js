import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '~/components/Forms';
import ImportParentRemittanceDetails from '~/modules/ImportParentRemittanceDetails';
import ImportOnboardingDailogue from '~/modules/ImportOnboardingDailogue';
import RemittanceSelector from '~/modules/RemittanceSelector';
import BulkRemittances from '~/modules/BulkRemittances';
import { Box, CircularProgress, Typography, Paper } from '@material-ui/core';
import {
  fetchRemittanceParams,
  getRemDetails,
  getClientRemConfig,
  updateRemittanceParams,
  updateCCRemittanceParams,
  updateRemittanceConfig,
  postClientMailCall,
  getRemittanceSettingShow,
  updateRemittanceSettingShow,getCSVSelected
} from '~/redux/helpers/remittance';
import { logout } from '~/redux/actions/user';
import "./styles.scss";
import { fetchClientData } from '~/redux/actions/client';
import Notification from '~/components/Notification';
import config from '~/config';
import { accessRights } from '~/config/accessRights';
import downloadIcon from '~/assets/icons/download.svg';
import downloadSelected from '~/assets/icons/download_white.svg';
import emailIcon from '~/assets/icons/email.svg';
import emailSelected from '~/assets/icons/email_white.svg';
import vanIcon from '~/assets/icons/upload.svg';
import vanSelected from '~/assets/icons/upload_white.svg';
import ctxIcon from '~/assets/icons/ctx.svg';
import ctxSelected from '~/assets/icons/ctx_white.svg';
import { withTranslation } from 'react-i18next';
import { RemittanceParameters, CCRemittanceParameters } from '~/utils/const';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

class RemittanceSettings extends Component {
  state = {
    isLoading: true,
    remittanceDownloadFormat: [],
    remittanceEmailFormat: [],
    remittanceDeliveryMode: [],
    clientRemittanceDetails: [],
    remittanceDetails: [],
    mapDeliveryFormat: {},
    isBulkRemittance: 1,
    clientId: null,
    clientEmail: null,
    parentId: null,
    isHIPAA: 0,
    showBanner: false,
    openDialogue: false,
    remittanceParameters: [],
    isCSVSelected:false,
    processing: false,
    variant: 'error',
    showRemittance: 0
  };

  componentDidMount() {
    if (this.props.isOnboarding) {
      this.props.changeActiveStep(3);
    }

    if (this.props.client.clientInfo.length > 0) {
      this.setState({
        parentId: this.props.client.clientInfo.rows[0].parentId,
        isHIPAA: this.props.client.clientInfo.rows[0].isHippa
          ? this.props.client.clientInfo.rows[0].isHippa
          : 0,
        clientEmail: this.props.clientInfo.rows[0].emailAddress,
        showBanner:
          this.props.client.clientInfo.rows[0].parentId === null ||
            typeof this.props.client.clientInfo.rows[0].parentId === 'undefined'
            ? false
            : true,
      });
      this.getRemittanceSettings(this.props.client.clientInfo.rows[0].clientId);
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const { userData } = this.props.user;
      const { t } = this.props;
      this.setState(
        {
          clientId: this.props.isOnboarding
            ? parseInt(urlParams.get('id'))
            : userData.portalProfileId,
        },
        () => {
          this.props
            .dispatch(fetchClientData(this.state.clientId))
            .then((response) => {
              if (!response) {
                throw this.props.client.error;
              }
              const clientData =
                this.props.client.clientInfo.rows &&
                this.props.client.clientInfo.rows[0];
              this.getRemittanceSettings(clientData.clientId);
              this.setState({
                clientId: clientData.clientId,
                parentId: clientData.parentId,
                isHIPAA: clientData.isHippa ? clientData.isHippa : 0,
                clientEmail: clientData.emailAddress
                  ? clientData.emailAddress
                  : 0,
                showBanner:
                  clientData.parentId === null ||
                    typeof clientData.parentId === 'undefined'
                    ? false
                    : true,
                isLoading: false,
              });
              this.loadData(clientData.clientId, false);
            })
            .catch((error) => {
              this.setState({
                isLoading: false,
                error:
                  typeof error === 'string'
                    ? error
                    : t('componentData.remittanceSettings.unknownErr'),
                variant: 'error',
              });
            });
        }
      );
    }
  }

  getRemittanceSettings = async (clientId, flag) => {
    const { t } = this.props;
    getRemittanceSettingShow(clientId, flag)
      .then((response) => {
        this.setState({
          showRemittance: response?.data ?? 0,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          error:
            typeof error === 'string'
              ? error
              : t('componentData.remittanceSettings.unknownErr'),
          variant: 'error',
        });
        return false;
      });
  }

  importParentsData = () => {
    const { parentId } = this.state;
    this.setState({ showBanner: false });
    this.getRemittanceSettings(parentId, true);
    this.loadData(parentId, true);
  };

  handleRemittanceParameters = (remParams, isCSVSelected) => {
    const { t } = this.props;
    let newRemParams = [];
    let remittanceParameters =  isCSVSelected ? CCRemittanceParameters : RemittanceParameters;
    newRemParams = remittanceParameters.map((item) =>
      remParams.data &&
        remParams.data.rows &&
        remParams.data.rows[0] &&
        remParams.data.rows[0][item && item.key] === 1
        ? {
          ...item,
          label: t(`componentData.remittanceSettings.${item.key}`),
          selected: true,
        }
        : {
          ...item,
          label: t(`componentData.remittanceSettings.${item.key}`),
          selected: false,
        }
    );
    const isClientRemitData = remParams?.data?.rows?.[0]?.remittanceParameterId;
    if (!isClientRemitData) {
      newRemParams = [...remittanceParameters];
    }
    return newRemParams;
  };

  loadData = (id, flag) => {
    Promise.all([
      getRemDetails(),
      getClientRemConfig(id, flag),
      fetchRemittanceParams(id, flag),
      getCSVSelected()
    ])
      .then(([remDetails, clientRemConfig, remParams, csvClient]) => {
        if (remDetails.error) {
          throw remDetails;
        } else if (clientRemConfig.error) {
          throw clientRemConfig;
        } else if (remParams.error) {
          throw remParams;
        }else if (csvClient.error) {
          throw csvClient;
        }
        const newRemittanceParameters =
          this.handleRemittanceParameters(remParams, csvClient.data);
        let reDetailsPair = [];
        let clientReDetailsPair = {};
        // If else condition added from taking the refernce from B2C
        // if (
        //   !clientRemConfig ||
        //   !clientRemConfig.data ||
        //   !Object.keys(clientRemConfig.data).length
        // ) {
        //   const downloadFormatData = remDetails.data.filter((item) => {
        //     return item.rmtDeliveryOptionId === 1;
        //   });
        //   if (downloadFormatData?.length) {
        //     clientReDetailsPair[downloadFormatData[0].rmtDeliveryOptionId] = [
        //       downloadFormatData[0].deliveryOptionId[0].formatId,
        //     ];
        //   }
        //   const emailFormatData = remDetails.data.filter((item) => {
        //     return item.rmtDeliveryOptionId === 2;
        //   });
        //   if (emailFormatData?.length) {
        //     clientReDetailsPair[emailFormatData[0].rmtDeliveryOptionId] = [
        //       emailFormatData[0].deliveryOptionId[0].formatId,
        //     ];
        //   }
        // } else{
        clientReDetailsPair =
          clientRemConfig &&
          Array.isArray(clientRemConfig.data.remittanceDetails) &&
          clientRemConfig.data.remittanceDetails.reduce(
            (obj, { rmtDeliveryOptionId, remittanceFormats }) => {
              obj[rmtDeliveryOptionId] =
                Array.isArray(remittanceFormats) &&
                remittanceFormats.map(({ formatId }) => formatId);
              return obj;
            },
            {}
          );
        // }
        reDetailsPair = remDetails.data.reduce(
          (obj, { rmtDeliveryOptionId, deliveryOptionId }) => {
            const formatArr = deliveryOptionId.map(({ formatId }) => formatId);
            obj[rmtDeliveryOptionId] = formatArr;
            return obj;
          },
          {}
        );
        const emailFormat = remDetails.data
          .filter((item) => [2].includes(item.rmtDeliveryOptionId))
          .map((field) =>
            field.deliveryOptionId.map(({ formatId, description }) =>
              clientReDetailsPair[field.rmtDeliveryOptionId] &&
                clientReDetailsPair[field.rmtDeliveryOptionId].includes(formatId)
                ? {
                  id: formatId,
                  selected: true,
                  label: description,
                  deliveryOptionId: field.rmtDeliveryOptionId
                }
                : {
                  id: formatId,
                  selected: false,
                  label: description,
                  deliveryOptionId: field.rmtDeliveryOptionId
                }
            )
          );
        const downloadFormat = remDetails.data
          .filter((item) => [1].includes(item.rmtDeliveryOptionId))
          .map((field) =>
            field.deliveryOptionId.map(({ formatId, description }) =>
              clientReDetailsPair[field.rmtDeliveryOptionId] &&
                clientReDetailsPair[field.rmtDeliveryOptionId].includes(formatId)
                ? {
                  id: formatId,
                  selected: true,
                  label: description,
                  deliveryOptionId: field.rmtDeliveryOptionId
                }
                : {
                  id: formatId,
                  selected: false,
                  label: description,
                  deliveryOptionId: field.rmtDeliveryOptionId
                }
            )
          );
        this.setState({
          remittanceEmailFormat: emailFormat[0],
          remittanceDownloadFormat: downloadFormat[0],
          remittanceDetails: remDetails.data,
          mapDeliveryFormat: reDetailsPair,
          clientRemittanceDetails: Object.keys(clientReDetailsPair)?.length
            ? clientReDetailsPair
            : false,
          remittanceDeliveryMode: remDetails.data.map(
            ({ rmtDeliveryOptionId, description }) => {
              let iconType = null;
              let iconTypeSelected = null;

              switch (rmtDeliveryOptionId) {
                case 1:
                  iconType = downloadIcon;
                  iconTypeSelected = downloadSelected;
                  break;
                case 2:
                  iconType = emailIcon;
                  iconTypeSelected = emailSelected;
                  break;
                case 4:
                  iconType = ctxIcon;
                  iconTypeSelected = ctxSelected;
                  break;
                case 16:
                  iconType = vanIcon;
                  iconTypeSelected = vanSelected;
                  break;
                default:
                  break;
              }
              return Array.isArray(clientReDetailsPair[rmtDeliveryOptionId])
                ? {
                  id: rmtDeliveryOptionId,
                  selected: true,
                  label: description,
                  icon: iconType,
                  iconTypeSelected: iconTypeSelected,
                }
                : {
                  id: rmtDeliveryOptionId,
                  selected: false,
                  label: description,
                  icon: iconType,
                  iconTypeSelected: iconTypeSelected,
                };
            }
          ),
          remittanceParameters: newRemittanceParameters,
          isBulkRemittance:
            clientRemConfig.data && clientRemConfig.data.isBulkRemittance === 0
              ? 0
              : 1,
          isCSVSelected: csvClient.data || false,
          isLoading: false,
        });
      })
      .catch((error) => {
        const { t } = this.props;
        this.setState({
          isLoading: false,
          error: error.message
            ? error.message
            : t('componentData.remittanceSettings.unknownErr'),
          variant: 'error',
        });
      });
  };
  handleDownloadFormatChange = (e, index, isChecked) => {
    const {
      remittanceDownloadFormat,
      remittanceDeliveryMode,
      clientRemittanceDetails,
    } = this.state;
    let id = remittanceDownloadFormat.find((field, i) => index === i);
    const newFormats = [
      ...new Set([...(clientRemittanceDetails[1] || []), id.id]),
    ];
    if (isChecked) {
      this.setState({
        remittanceDownloadFormat: remittanceDownloadFormat.map((format, i) =>
          index === i
            ? {
              ...format,
              selected: isChecked,
            }
            : format
        ),
        clientRemittanceDetails: {
          ...clientRemittanceDetails,
          1: newFormats,
        },
        remittanceDeliveryMode: remittanceDeliveryMode.map((mode, i) =>
          mode.id === 1
            ? {
              ...mode,
              selected: true,
            }
            : mode
        ),
      });
    } else {
      const restArr = clientRemittanceDetails[1].filter(
        (formatId) => formatId !== parseInt(id.id)
      );
      this.setState({
        remittanceDownloadFormat: remittanceDownloadFormat.map((format, i) =>
          index === i
            ? {
              ...format,
              selected: isChecked,
            }
            : format
        ),
        clientRemittanceDetails: {
          ...clientRemittanceDetails,
          1: restArr,
        },
        remittanceDeliveryMode:
          restArr.length === 0
            ? remittanceDeliveryMode.map((mode, i) =>
              mode.id === 1
                ? {
                  ...mode,
                  selected: false,
                }
                : mode
            )
            : remittanceDeliveryMode,
      });
    }
  };
  handleEmailFormatChange = (e, index, isChecked) => {
    const {
      remittanceEmailFormat,
      remittanceDeliveryMode,
      clientRemittanceDetails,
    } = this.state;
    let id = remittanceEmailFormat.find((field, i) => index === i);
    const newFormats = [
      ...new Set([...(clientRemittanceDetails[2] || []), id.id]),
    ];
    if (isChecked) {
      this.setState({
        remittanceEmailFormat: remittanceEmailFormat.map((format, i) =>
          index === i
            ? {
              ...format,
              selected: isChecked,
            }
            : format
        ),
        clientRemittanceDetails: {
          ...clientRemittanceDetails,
          2: newFormats,
        },
        remittanceDeliveryMode: remittanceDeliveryMode.map((mode, i) =>
          mode.id === 2
            ? {
              ...mode,
              selected: true,
            }
            : mode
        ),
      });
    } else {
      const restArr = clientRemittanceDetails[2].filter(
        (formatId) => formatId !== parseInt(id.id)
      );
      this.setState({
        remittanceEmailFormat: remittanceEmailFormat.map((format, i) =>
          index === i
            ? {
              ...format,
              selected: isChecked,
            }
            : format
        ),
        clientRemittanceDetails: {
          ...clientRemittanceDetails,
          2: restArr,
        },
        remittanceDeliveryMode:
          restArr.length === 0
            ? remittanceDeliveryMode.map((mode, i) =>
              mode.id === 2
                ? {
                  ...mode,
                  selected: false,
                }
                : mode
            )
            : remittanceDeliveryMode,
      });
    }
  };
  handleSelectorChange = (e, index, isChecked) => {
    const {
      clientRemittanceDetails,
      remittanceDeliveryMode,
      mapDeliveryFormat,
      remittanceDownloadFormat,
      remittanceEmailFormat,
    } = this.state;
    let id = remittanceDeliveryMode.find((field, i) => index === i);
    let selectedId = Object.keys(mapDeliveryFormat).find(
      (obj) => parseInt(obj) === id.id
    );
    let selectedFormat = [];
    if (isChecked) {
      selectedFormat = [
        ...new Set([
          ...(clientRemittanceDetails[selectedId] || []),
          ...mapDeliveryFormat[selectedId],
        ]),
      ];
    }
    let newClientRemittanceDetails = clientRemittanceDetails
      ? { ...clientRemittanceDetails }
      : false;
    if (selectedFormat?.length) {
      newClientRemittanceDetails = {
        ...clientRemittanceDetails,
        [selectedId]: selectedFormat,
      };
    } else if (newClientRemittanceDetails) {
      delete newClientRemittanceDetails[selectedId];
    }
    this.setState({
      remittanceDeliveryMode: remittanceDeliveryMode.map((mode, i) =>
        index === i
          ? {
            ...mode,
            selected: isChecked,
          }
          : mode
      ),
      clientRemittanceDetails: newClientRemittanceDetails,
      remittanceDownloadFormat:
        parseInt(selectedId) === 1
          ? remittanceDownloadFormat.map((mode, i) =>
            isChecked
              ? {
                ...mode,
                selected: true,
              }
              : {
                ...mode,
                selected: false,
              }
          )
          : remittanceDownloadFormat,
      remittanceEmailFormat:
        parseInt(selectedId) === 2
          ? remittanceEmailFormat.map((mode, i) =>
            isChecked
              ? {
                ...mode,
                selected: true,
              }
              : {
                ...mode,
                selected: false,
              }
          )
          : remittanceEmailFormat,
    });
  };
  handleParamsChange = (e, index, isChecked) => {
    const { remittanceParameters } = this.state;
    const { t } = this.props;
    this.setState({
      remittanceParameters: remittanceParameters.map((param, i) =>
        index === i
          ? {
            ...param,
            label: t(`componentData.remittanceSettings.${param.key}`),
            selected: isChecked,
          }
          : param
      ),
    });
  };
  handleRemittanceDetailsUpdate = () => {
    this.setState(
      {
        processing: true,
      },
      async () => {
        const {
          clientRemittanceDetails,
          remittanceParameters,
          isBulkRemittance,
          clientId,
          showRemittance,isCSVSelected
        } = this.state;
        const { t } = this.props;
        if (showRemittance == 1) {
          if (
            !clientRemittanceDetails ||
            !Object.keys(clientRemittanceDetails).length
          ) {
            this.setState({
              processing: false,
              error: t('componentData.remittanceSettings.RemittanceDeliveryMode'),
              variant: 'error',
            });
            return false;
          }
        }
        const remittanceDetails = Object.keys(clientRemittanceDetails)
          .filter(
            (key) =>
              clientRemittanceDetails[key] &&
              clientRemittanceDetails[key].length > 0
          )
          .reduce((arr, key) => {
            arr.push({
              deliveryModeId: key,
              formatIds: clientRemittanceDetails[key],
            });
            return arr;
          }, []);

        const data = {
          remittanceDetails: remittanceDetails,
          isBulkRemittance: isBulkRemittance,
        };
        const remittanceSettingsUpdate = await updateRemittanceSettingShow({
          clientId,
          isRemittanceRequired: this.state.showRemittance
        });

        if (remittanceSettingsUpdate && !remittanceSettingsUpdate.error) {
          if (this.state.showRemittance == 1) {
            let finalArr = isCSVSelected ? [
              updateRemittanceConfig(clientId, data),
              updateCCRemittanceParams(clientId, remittanceParameters),
            ] : [
              updateRemittanceConfig(clientId, data),
              updateRemittanceParams(clientId, remittanceParameters),
            ];
            Promise.all(finalArr)
              .then((response) => {
                response.find(function (item) {
                  if (item.error === true) {
                    throw item;
                  }
                });
                this.setState({
                  processing: false,
                  openDialogue: this.props.isOnboarding ? true : false,
                  error: this.props.isOnboarding
                    ? false
                    : t(
                      'componentData.remittanceSettings.RemittanceConfigurations'
                    ),
                  variant: 'success',
                });
              })
              .catch((error) => {
                this.setState({
                  processing: false,
                  error:
                    typeof error.message === 'string'
                      ? error.message
                      : t('componentData.remittanceSettings.unknownErr'),
                  variant: 'error',
                });
              });
          } else {
            this.setState({
              processing: false,
              openDialogue: this.props.isOnboarding ? true : false,
              error: this.props.isOnboarding
                ? false
                : t(
                  'componentData.remittanceSettings.RemittanceConfigurations'
                ),
              variant: 'success',
            });
          }
        } else {
          this.setState({
            processing: false,
            error:
              remittanceSettingsUpdate &&
                typeof remittanceSettingsUpdate.message === 'string'
                ? remittanceSettingsUpdate.message
                : t('componentData.remittanceSettings.unknownErr'),
            variant: 'error',
          });
        }
      }
    );
  };
  handleNotificationClose = () => {
    this.setState({
      error: null,
    });
  };

  moveToDashboard = async () => {
    this.setState({
      openDialogue: false,
    });
    const data = {
      email: this.state.clientEmail,
      dynamicData: {
        user_name: 'System Action',
      },
      portalTypeId: 2,
      portalProfileId: this.state.clientId,
    };
    await postClientMailCall(data);
    this.props.dispatch(logout());
    this.props.history.push(`${config.baseName}/`);
  };
  changeRemittance = (e, value) => {
    if (value !== null) {
      this.setState({ showRemittance: value });
    }
  }
  render() {
    const {
      isLoading,
      remittanceDownloadFormat,
      remittanceEmailFormat,
      remittanceDeliveryMode,
      remittanceParameters,
      processing,
      showBanner,
      clientId,
      openDialogue,
      error,
      variant,
      isBulkRemittance,
      showRemittance,isCSVSelected
    } = this.state;
    const { user, t } = this.props;
    const isSettingRemmitanceEditEnabled = this.props.isOnboarding
      ? true
      : (user.userRoles &&
        user.userRoles.includes(accessRights['SETTINGS_REMITTANCE_EDIT'])) ||
      false;
    if (isLoading) {
      return (
        <Box className="loader-container">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return (
      <>
        <Box my={2}>
          {openDialogue && (
            <ImportOnboardingDailogue
              onConfirm={this.moveToDashboard}
              onCancel={() => {
                this.setState({
                  openDialogue: false,
                });
              }}
              open={openDialogue}
            />
          )}
          {this.props.isOnboarding &&
            isSettingRemmitanceEditEnabled &&
            showBanner && (
              <ImportParentRemittanceDetails
                onConfirm={this.importParentsData}
                onCancel={() => {
                  this.setState({
                    showBanner: false,
                  });
                }}
              />
            )}
          <Box mx={2} my={2} px={4}>
            <Paper>
              <Box>
                <Box pt={4} pl={4}>
                  <Typography>
                    {t('componentData.remittanceSettings.RemittanceSettingEnable')}
                  </Typography>
                </Box>

                <Box my={2} px={4} pb={2}>
                  <ToggleButtonGroup
                    className="remittanceBtnGroup"
                    value={showRemittance}
                    exclusive
                    onChange={this.changeRemittance}
                  >
                    <ToggleButton
                      value={1}
                    >
                      {showRemittance == 1 &&
                        <CheckCircleIcon fontSize="small" className="checkedIcon" />
                      }
                      {t('componentData.bulkRemittances.Yes')}
                    </ToggleButton>
                    <ToggleButton
                      value={0}
                    >
                      {showRemittance == 0 &&
                        <CheckCircleIcon fontSize="small" className="checkedIcon" />
                      }
                      {t('componentData.bulkRemittances.No')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
              {showRemittance ?
                <Box>
                  <Box
                    p={4}
                    style={{ backgroundColor: '#fff', borderRadius: '4px' }}
                  >
                    <Typography variant="h3">
                      {t('componentData.remittanceSettings.reqFiles')}
                    </Typography>
                  </Box>

                  <RemittanceSelector
                    title={t('componentData.remittanceSettings.RemitDelMode')}
                    options={remittanceDeliveryMode}
                    onChange={isSettingRemmitanceEditEnabled ? this.handleSelectorChange : null}
                    px={4}
                    py={2}
                    isLeftIcon={true}
                  />
                  {!isCSVSelected && <RemittanceSelector
                    title={t(
                      'componentData.remittanceSettings.RemittanceDownloadFormat'
                    )}
                    options={remittanceDownloadFormat}
                    onChange={isSettingRemmitanceEditEnabled ? this.handleDownloadFormatChange : null}
                    px={4}
                    py={2}
                  />}
                  <RemittanceSelector
                    title={t(
                      'componentData.remittanceSettings.RemittanceEmailFormat'
                    )}
                    options={remittanceEmailFormat}
                    onChange={isSettingRemmitanceEditEnabled ? this.handleEmailFormatChange : null}
                    px={4}
                    py={2}
                  />
                  {!isCSVSelected && <Box px={4} py={2} style={{ backgroundColor: '#fff ' }}>
                    <Typography variant="h3">
                      {t('componentData.remittanceSettings.RemittanceNote')}
                    </Typography>
                  </Box>}
                 {!isCSVSelected && <BulkRemittances
                    title={t('componentData.remittanceSettings.BulkRemittances')}
                    handleBulkRemittance={(selectedValue) => {
                      this.setState({
                        isBulkRemittance: selectedValue.value,
                      });
                    }}
                    selectedOption={
                      typeof isBulkRemittance === 'undefined'
                        ? 1
                        : isBulkRemittance
                    }
                    px={4} py={2}
                    isSettingRemmitanceEditEnabled={isSettingRemmitanceEditEnabled}
                  />}
                  <RemittanceSelector
                    title={t(
                      'componentData.remittanceSettings.SelectRemittanceParameters'
                    )}
                    options={remittanceParameters}
                    onChange={isSettingRemmitanceEditEnabled ? this.handleParamsChange : null}
                    px={4}
                    py={2}
                    isRemittanceParam={true}
                  />
                </Box>
                : null}
            </Paper>
            <Box my={4} className={`button-container`}>
              {this.props.isOnboarding && (
                <Box mx={2}>
                  <Button
                    type="submit"
                    fullWidth={false}
                    variant="outlined"
                    color="primary"
                    onClick={(e) =>
                      this.props.history.push(
                        `${config.baseName}/onboard/files?id=${clientId}`
                      )
                    }
                  >
                    {t('componentData.remittanceSettings.Back')}
                  </Button>
                </Box>
              )}
              {processing ? (
                <CircularProgress color="primary" />
              ) : (
                <Box mx={2}>
                  {isSettingRemmitanceEditEnabled && (
                    <Button
                      type="submit"
                      fullWidth={false}
                      variant="contained"
                      color="primary"
                      onClick={this.handleRemittanceDetailsUpdate}
                    >
                      {this.props.isOnboarding
                        ? t('componentData.remittanceSettings.Next')
                        : t('componentData.remittanceSettings.Save')}
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {error && (
          <Notification
            variant={variant}
            message={error}
            handleClose={this.handleNotificationClose}
            onClose={this.handleNotificationClose}
          />
        )}
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({ ...state.client, ...state.user }))(RemittanceSettings)
);
