import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '~/components/Forms';
import ImportParentRemittanceDetails from '~/modules/ImportParentRemittanceDetails';
import RemittanceSelector from '~/modules/RemittanceSelector';
import { Box, CircularProgress, Paper } from '@material-ui/core';
import { entityType } from '~/config/entityTypes';
import { getRemittanceSettingShow } from '~/redux/helpers/B2C/remittance';
import {
  fetchB2CRemittanceParams,
  getB2CRemDetails,
  getB2CClientRemConfig,
  saveClientRemScheme,
  updateB2CRemittanceParams,
  updateB2CRemittanceConfig,
  postB2CClientMailCall,
  updateRemittanceSettingShow,
  fetchRemittanceScheme,getClientRemScheme,
} from '~/redux/helpers/B2C/remittance';
import { logout } from '~/redux/actions/user';
import { fetchClientData } from '~/redux/actions/client';
import Notification from '~/components/Notification';
import config from '~/config';
import { accessRights } from '~/config/accessRights';
import downloadIcon from '~/assets/icons/download.svg';
import downloadSelected from '~/assets/icons/download_white.svg';
import emailIcon from '~/assets/icons/email.svg';
import emailSelected from '~/assets/icons/email_white.svg';
import { withTranslation } from 'react-i18next';
import { B2CRemittanceParameters } from '~/utils/const';
import EnableRemittance from './enableRemittance';
import ImportOnboardingDailogue from '~/modules/ImportOnboardingDailogue';

class B2CRemittanceSettings extends Component {
  state = {
    isLoading: true,
    remittanceDeliveryMode: [],
    remittanceScheme:[],
    clientRemittanceDetails: [],
    remittanceDetails: [],
    mapDeliveryFormat: {},
    isBulkRemittance: 0,
    clientId: null,
    clientEmail: null,
    parentId: null,
    showBanner: false,
    openDialogue: false,
    remittanceParameters: [...B2CRemittanceParameters],
    processing: false,
    variant: 'error',
    showRemittance: 0,
    remittanceFormat: [],
  };

  componentDidMount() {
    if (this.props.isOnboarding) {
      this.props.changeActiveStep(3);
    }
    const { userData } = this.props.user;
    if (this.props.client.clientInfo.length > 0) {
      this.setState({
        parentId: this.props.client.clientInfo.rows[0].parentId,
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
          showRemittance: response?.data ?? 1,
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
  };

  importParentsData = () => {
    const { parentId } = this.state;
    this.setState({ showBanner: false });
    this.getRemittanceSettings(parentId, true);
    this.loadData(parentId, true);
  };

  handleRemittanceParameters = (remParams) => {
    const { t } = this.props;
    const { remittanceParameters } = this.state;
    let newRemParams = [];
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
      getB2CRemDetails(),
      fetchRemittanceScheme(),
      getB2CClientRemConfig(id, flag),
      fetchB2CRemittanceParams(id, flag),
      getClientRemScheme(id),
    ])
      .then(([remDetails, remittanceScheme,clientRemConfig, remParams,clientRemScheme]) => {
        if (remDetails.error) {
          throw remDetails;
        }else if (remittanceScheme.error) {
          throw remittanceScheme;
        }
         else if (clientRemConfig.error) {
          throw clientRemConfig;
        } else if (remParams.error) {
          throw remParams;
        }
        else if (clientRemScheme.error) {
          throw clientRemScheme;
        }
        const newRemittanceParameters =
          this.handleRemittanceParameters(remParams);
        let reDetailsPair = [];
        let clientReDetailsPair = {};
        if (
          !clientRemConfig ||
          !clientRemConfig.data ||
          !Object.keys(clientRemConfig.data).length
        ) {
          const downloadFormatData = remDetails.data.filter((item) => {
            return item.rmtDeliveryOptionId === 1;
          });
          if (downloadFormatData?.length) {
            clientReDetailsPair[downloadFormatData[0].rmtDeliveryOptionId] = [
              downloadFormatData[0].deliveryOptionId[0].formatId,
            ];
          }
          const emailFormatData = remDetails.data.filter((item) => {
            return item.rmtDeliveryOptionId === 2;
          });
          if (emailFormatData?.length) {
            clientReDetailsPair[emailFormatData[0].rmtDeliveryOptionId] = [
              emailFormatData[0].deliveryOptionId[0].formatId,
            ];
          }
        } else {
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
        }
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
                  deliveryOptionId: field.rmtDeliveryOptionId,
                }
                : {
                  id: formatId,
                  selected: false,
                  label: description,
                  deliveryOptionId: field.rmtDeliveryOptionId,
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
                  deliveryOptionId: field.rmtDeliveryOptionId,
                }
                : {
                  id: formatId,
                  selected: false,
                  label: description,
                  deliveryOptionId: field.rmtDeliveryOptionId,
                }
            )
          );
        const allDownloadFormat = [...downloadFormat[0], ...emailFormat[0]];
        const newUniqueFormats = [];
        allDownloadFormat.forEach((item) => {
          const isAlreadyFormatPushed = newUniqueFormats.findIndex(
            (ele) => ele.id === item.id
          );
          if (
            isAlreadyFormatPushed > -1 &&
            !newUniqueFormats[isAlreadyFormatPushed].selected
          ) {
            newUniqueFormats[isAlreadyFormatPushed] = item;
          } else if (isAlreadyFormatPushed === -1) {
            newUniqueFormats.push(item);
          }
        });
        const selectedRemScheme = clientRemScheme?.data?.remittanceSchemeId ?? 1;
        this.setState({
          remittanceFormat: newUniqueFormats,
          remittanceScheme: remittanceScheme?.data?.map((field) =>
            field.schemeId === selectedRemScheme
              ? {
                  id: field.schemeId,
                  selected: true,
                  label: field.description,
                }
              : {
                  id: field.schemeId,
                  selected: false,
                  label: field.description,
                }
          ),
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

  handleFormatChange = (e, index, isChecked) => {
    const { remittanceFormat } = this.state;
    const newRemittanceFormat = [...remittanceFormat];
    newRemittanceFormat[index].selected = isChecked;
    this.setState({
      remittanceFormat: [...newRemittanceFormat],
    });
  };

  handleSelectorChange = (e, index, isChecked) => {
    const {
      clientRemittanceDetails,
      remittanceDeliveryMode,
      mapDeliveryFormat,
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
    });
  };
  handleSchemeChange=(e, index, isChecked) => {
    const { remittanceScheme } = this.state;
    const { t } = this.props;
    this.setState({
      remittanceScheme: remittanceScheme.map((param, i) =>
        index === i
          ? {
            ...param,
            selected: true,
          }
          : {
            ...param,
            selected: false,
          }
      ),
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
          remittanceFormat,remittanceScheme,
          clientId,
        } = this.state;
        const { t } = this.props;
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
        const isAnyFormatSelected = remittanceFormat.filter(
          (item) => item.selected
        );
        if (!isAnyFormatSelected.length) {
          this.setState({
            processing: false,
            error: t(
              'componentData.remittanceSettings.RemittanceDeliveryFormat'
            ),
            variant: 'error',
          });
          return false;
        }
        const isAnySchemeSelected = remittanceScheme.filter(
          (item) => item.selected
        );
        if (!isAnySchemeSelected.length) {
          this.setState({
            processing: false,
            error: t(
              'componentData.remittanceSettings.RemittanceDeliveryScheme'
            ),
            variant: 'error',
          });
          return false;
        }
        // let canRemittanceUpdate = true;
        // if (!this.props.isOnboarding) {
        //   if (
        //     !Object.values(remittanceParameters).some((item) => item.selected)
        //   ) {
        //     canRemittanceUpdate = false;
        //   }
        // }
        // if (canRemittanceUpdate) {
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
          isRemittanceRequired: this.state.showRemittance,
        });
        if (remittanceSettingsUpdate && !remittanceSettingsUpdate.error) {
          if (this.state.showRemittance === 1) {
            Promise.all([
              updateB2CRemittanceConfig(clientId, data),
              updateB2CRemittanceParams(clientId, remittanceParameters),
              saveClientRemScheme(clientId,isAnySchemeSelected[0].id)
            ])
              .then((response) => {
                response.forEach((item) => {
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
        // } else {
        //   this.setState({
        //     processing: false,
        //     error:t('componentData.remittanceSettings.RemittanceParamsError'),
        //     variant: 'error',
        //   });
        // }
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
      portalTypeId: 2,
      portalProfileId: this.state.clientId,
    };
    await postB2CClientMailCall(data);
    this.props.dispatch(logout());
    this.props.history.push(`${config.baseName}/`);
  };
  setShowRemittance = (newValue) => {
    this.setState({
      showRemittance: newValue,
    });
  };
  render() {
    const {
      isLoading,
      remittanceScheme,
      remittanceDeliveryMode,
      remittanceParameters,
      processing,
      showBanner,
      clientId,
      openDialogue,
      error,
      variant,
      showRemittance,
      remittanceFormat,
    } = this.state;
    const { user, t } = this.props;
	const isPayeeChoicePortal = user?.isPayeeChoicePortal ?? false;
	
	const disabledRemittance = isPayeeChoicePortal? true: false;

    const isSettingRemmitanceEditEnabled = this.props.isOnboarding
      ? true
      : (user.userRoles &&
        user.userRoles.includes(accessRights['SETTINGS_REMITTANCE_EDIT'])) ||
      false;
    const showEnableRemittance =
      user.userData.activeBankParentProfileId === 1 || this.props.isOnboarding;
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
                {showEnableRemittance ? (
                  <EnableRemittance
                    setShowRemittance={this.setShowRemittance}
                    showRemittance={showRemittance}
					          disabledRemittance={disabledRemittance}
                  />
                ) : null}
                {showRemittance ? (
                  <>
                   <RemittanceSelector
                      title={t('componentData.remittanceSettings.RemitSystem')}
                      options={remittanceScheme}
                      onChange={
                        isSettingRemmitanceEditEnabled
                          ? this.handleSchemeChange
                          : null
                      }
                      px={4}
                      py={2}
                      isLeftIcon={true}
                    />
                    <RemittanceSelector
                      title={t('componentData.remittanceSettings.RemitDelMode')}
                      options={remittanceDeliveryMode}
                      onChange={
                        isSettingRemmitanceEditEnabled
                          ? this.handleSelectorChange
                          : null
                      }
                      px={4}
                      py={2}
                      isLeftIcon={true}
                    />
                    <RemittanceSelector
                      title={t(
                        'componentData.remittanceSettings.RemittanceFormatB2C'
                      )}
                      options={remittanceFormat}
                      onChange={
                        isSettingRemmitanceEditEnabled
                          ? this.handleFormatChange
                          : null
                      }
                      px={4}
                      py={2}
                    />
                    <RemittanceSelector
                      title={
                        this.props.isOnboarding
                          ? t(
                            'componentData.remittanceSettings.SelectRemittanceParametersOptional'
                          )
                          : t(
                            'componentData.remittanceSettings.SelectRemittanceParameters'
                          )
                      }
                      options={remittanceParameters}
                      onChange={
                        isSettingRemmitanceEditEnabled
                          ? this.handleParamsChange
                          : null
                      }
                      px={4}
                      py={2}
                      isRemittanceParam={true}
                    />
                  </>
                ) : null}
              </Box>
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
                        ? t('componentData.remittanceSettings.Finish')
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
  connect((state) => ({ ...state.client, ...state.user }))(
    B2CRemittanceSettings
  )
);
