import React, { Component, Suspense } from 'react';
import { Grid } from '@material-ui/core';
import SubHeader from '~/components/_SubHeader';
import { withTranslation } from 'react-i18next';
import './styles.scss';
import { connect } from 'react-redux';
import { fetchClientData } from '~/redux/actions/client';
import { accessRights } from '~/config/accessRights';
import { entityType, PayerTypes } from '~/config/entityTypes';
import { getRemittanceSettingShow } from '~/redux/helpers/B2C/remittance';
import { fetchClientConfig } from "~/redux/helpers/remittance";

const CompanyDetailsSettings = React.lazy(() => import("~/modules/CompanyDetailsSettings"));
const SupplierValidation = React.lazy(() => import("~/modules/SupplierValidation"));
const GeneralSettings = React.lazy(() => import("~/modules/GeneralSettings"));
const PaymentMethods = React.lazy(() => import("~/modules/PaymentMethods"));
const FileSettings = React.lazy(() => import("~/modules/FileSettings"));
const RemittanceSettings = React.lazy(() => import("~/modules/RemittanceSettings"));

const B2CCompanyDetailsSettings = React.lazy(() => import("~/modules/CompanyDetailsSettings/B2C"));
const B2CPaymentMethods = React.lazy(() => import("~/modules/PaymentMethods/B2C"));
const B2CSupplierValidation = React.lazy(() => import("~/modules/SupplierValidation/B2C"));
const B2CFileSettings = React.lazy(() => import("~/modules/FileSettings/B2C"));
const USbankFileSettings = React.lazy(() => import("~/modules/FileSettings/USbank"));
const B2CGeneralSettings = React.lazy(() => import("~/modules/GeneralSettings/B2C"));
const B2CRemittanceSettings = React.lazy(() => import('~/modules/RemittanceSettings/B2C'));
const USbankPaymentMethods = React.lazy(() => import("~/modules/PaymentMethods/USbank"));
const USbankpayeevalidations = React.lazy(() => import("~/modules/PayeeAuthentications"));
class Settings extends Component {
  state = {
    isHippa: false,
    isRemittanceEnabled: false,
    isRemNotRequired: 1, // if 1 then hide remittance tab. Added for Kaiser
  };

  getClientConfig = () => {
    fetchClientConfig().then((res) => {
      this.setState({
        isRemNotRequired: res?.data?.isRemittanceNotRequired || 0
      });
    });
  }
  handleTabChange(value) {
    this.setState({ selectedTab: value });
  }

  componentDidMount() {
  
    const clientId =
      this.props.user &&
      this.props.user.userData &&
      this.props.user.userData.portalProfileId;
    this.props.dispatch(fetchClientData(clientId)).then(() => {
      this.setState(
        {
          isHippa:
            this.props.client.clientInfo &&
            this.props.client.clientInfo.rows &&
            this.props.client.clientInfo.rows[0] &&
            this.props.client.clientInfo.rows[0].isHippa
        },
        () => { }
      );
    });
    if (parseInt(this.props.user.userData.appType) === entityType.B2C) {
      getRemittanceSettingShow(clientId).then((response) => {
        this.setState({
          isRemittanceEnabled: response.data,
        });
      })
    }
    //For B2B kaiser
    this.getClientConfig();
  }

  render() {
    const { isRemNotRequired } = this.state;
    const { t } = this.props;
    const { user } = this.props;
    const payerTypeId = user.userData.payerTypeId;
    
    const isSettingCompanyViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_COMPANY_DETAILS_VIEW']
        )) ||
      false;
    const isSettingGeneralViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_GENERAL_SETTINGS_VIEW']
        )) ||
      false;
    const isSettingPaymentMethodViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_PAYMENT_METHODS_VIEW']
        )) ||
      false;
    const isSettingFilesViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_FILES_SETTINGS_VIEW']
        )) ||
      false;
      const isSettingPayeeauthticationViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_PAYEE_AUTHENTICATION_VIEW']
        )) ||
      false;
    const isSettingRemmitanceViewEnabled = isRemNotRequired === 1 ? false :
      (user.userRoles &&
        user.userRoles.includes(accessRights["SETTINGS_REMITTANCE_VIEW"])) ||
      false;
    const isSettingValidationSupplierViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SETTINGS_VALIDATION_SUPPLIER_VIEW']
        )) ||
      false;

    const appType = user.userData.appType
      ? parseInt(user.userData.appType)
      : entityType.B2B;
    const isRemittanceSettingsTabEnabled =
      appType === entityType.B2C
        ? user.userData.activeBankParentProfileId === 1 ||
        this.state.isRemittanceEnabled
        : true;

    return (
      <div>
        <Grid item xs={12}>
          <div className={'paymentsTabContainer'}>
            <SubHeader
              {...this.props}
              title={t('componentData.Settings.SettingsTxt')}
              alias={'settings'}
              tabs={[
                {
                  url: '/settings',
                  name: t('componentData.Settings.CompanyDetails'),
                  items: [],
                  component: (
                    <Suspense
                      fallback={
                        <div>{t('componentData.Settings.loading')}</div>
                      }
                    >
                      {appType === entityType.B2C ? (
                        <B2CCompanyDetailsSettings />
                      ) : (
                        <CompanyDetailsSettings />
                      )}
                    </Suspense>
                  ),
                  alias: 'SETTINGS_COMPANY_DETAILS_VIEW',
                  isProtected: true,
                  showTab: isSettingCompanyViewEnabled,
                },
                {
                  url: '/settings',
                  name: t('componentData.Settings.GeneralSettings'),
                  items: [],
                  component: (
                    <Suspense
                      fallback={
                        <div>{t('componentData.Settings.loading')}</div>
                      }
                    >
                      {appType === entityType.B2C ? <B2CGeneralSettings /> : <GeneralSettings />}
                    </Suspense>
                  ),
                  alias: 'SETTINGS_GENERAL_SETTINGS_VIEW',
                  isProtected: true,
                  showTab: isSettingGeneralViewEnabled,
                },
                {
                  url: '/settings',
                  name: payerTypeId === PayerTypes.CARDS ? t('componentData.Settings.VirtualCards') : t('componentData.Settings.PaymentMethods'),
                  items: [],

                  component: (
                    <Suspense
                      fallback={
                        <div>{t('componentData.Settings.loading')}</div>
                      }
                    >
                      {appType === entityType.B2C ?
                       (this.props.user.isPayeeChoicePortal?
                        (<USbankPaymentMethods/>
                        )
                        : (
                          <B2CPaymentMethods />)
                        )
                      : (
                        <PaymentMethods payerTypeId={payerTypeId}/>
                      )}
                    </Suspense>
                  ),
                  alias: 'SETTINGS_PAYMENT_METHODS_VIEW',
                  isProtected: true,
                  showTab: isSettingPaymentMethodViewEnabled,
                },
                {
                  url: '/settings',
                  name: t('componentData.Settings.FileSettings'),
                  items: [],
                  component: (
                    <Suspense
                      fallback={
                        <div>{t('componentData.Settings.loading')}</div>
                      }
                    >
                      {appType === entityType.B2C ? (this.props.user.isPayeeChoicePortal ? <USbankFileSettings {...this.props} isOnboarding={false}/> : (
                        <B2CFileSettings {...this.props} isOnboarding={false} />
                      )) : (
                        <FileSettings {...this.props} isOnboarding={false} />
                      )}
                    </Suspense>
                  ),
                  alias: 'SETTINGS_FILES_SETTINGS_VIEW',
                  isProtected: true,
                  showTab: isSettingFilesViewEnabled,
                },
                {
                  url: '/settings',
                  name: t('componentData.Settings.RemittanceSettings'),
                  items: [],
                  component: (
                    <Suspense
                      fallback={
                        <div>{t('componentData.Settings.loading')}</div>
                      }
                    >
                      {appType === entityType.B2C ? (
                        <B2CRemittanceSettings isOnboarding={false} />
                      ) : (
                        <RemittanceSettings isOnboarding={false} />
                      )}
                    </Suspense>
                  ),
                  alias: 'user',
                  isProtected: true,
                  showTab:
                    isSettingRemmitanceViewEnabled &&
                    isRemittanceSettingsTabEnabled,
                },
                {
                  url: '/settings',
                  name: t('componentData.Settings.PayeeValidations'),
                  items: [],
                  component: (
                    <Suspense
                      fallback={
                        <div>{t('componentData.Settings.loading')}</div>
                      }
                    >
                      {appType === entityType.B2C ? (
                        <B2CSupplierValidation />
                      ) : (
                        <SupplierValidation />
                      )}
                    </Suspense>
                  ),
                  alias: 'user',
                  isProtected: true,
                  showTab: appType === entityType.B2C || payerTypeId === PayerTypes.CARDS ? false:isSettingValidationSupplierViewEnabled,
                },
                {
                  url: '/settings',
                  name: t('componentData.Settings.PayeeValidations'),
                  items: [],

                  component: (
                    <Suspense
                      fallback={
                        <div>{t('componentData.Settings.loading')}</div>
                      }
                    >
                      { <USbankpayeevalidations {...this.props} isOnboarding={false}/> 
                      
                       }
                    </Suspense>
                  ),
                  alias: 'SETTINGS_PAYMENT_METHODS_VIEW',
                  isProtected: true,
                  showTab: this.props.user.isPayeeChoicePortal &&isSettingPayeeauthticationViewEnabled,
                },
                {/*
                  url: "/settings",
                  name: "ERP integration",
                  items: [],
                  component: (
                    <Suspense fallback={<div>loading...</div>}>
                      <ERPintegration />
                    </Suspense>
                  ),
                  alias: "user",
                  isProtected: true,
                  showTab: isSettingValidationSupplierViewEnabled,
                */},
              ]}
            />
          </div>
        </Grid>
      </div>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.client }))(Settings)
);
