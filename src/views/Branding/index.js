import React from "react";
import SubHeader from "~/components/_SubHeader";
import { connect } from "react-redux";
import { AlertDialog } from "~/components/Dialogs";
import EmailTemplate from "./EmailTemplate";
import RemittanceTemplate from "./RemittanceTemplate";
import B2CRemittanceTemplate from "./RemittanceTemplate/B2C";
import ClientLogo from "./ClientLogo";
import { accessRights } from '~/config/accessRights';
import { entityType, PayerTypes } from '~/config/entityTypes';
import { withTranslation } from 'react-i18next';
import SMSTemplate from './SMSTemplate'
import UserTheme from '~/modules/UserTheme';
import UploadBrandingDocument from '~/modules/UploadBrandingDocument';
import { getRemittanceSettingShow } from '~/redux/helpers/B2C/remittance';
import { fetchClientConfig } from "~/redux/helpers/remittance";
import { getRemittanceSettingShow as getB2BRemittanceSettingShow } from '~/redux/helpers/remittance';

class Branding extends React.Component {
    state = {
        isRemittanceEnabled: false,
        isRemNotRequired: 1 // if 1 then hide remittance tab. Added for Kaiser
    };
    
    componentDidMount() {
        let clientId = this.props?.user?.userData?.portalProfileId;

        if (parseInt(this.props?.user?.userData?.appType) === entityType.B2C) {
          getRemittanceSettingShow(clientId).then((response)=>{
            this.setState({
              isRemittanceEnabled: response.data,
            });
          })
        }
        else {
            getB2BRemittanceSettingShow(clientId).then((response) => {
              this.setState({
                isRemittanceEnabled: response.data,
              });
            })
        }          
        this.getClientConfig();
    }
    
     getClientConfig = () => {
        fetchClientConfig().then((res) => {
            this.setState({
                isRemNotRequired: res?.data?.isRemittanceNotRequired || 0
            });
        });
    }

    render() {
        const { t } = this.props;
        const { isRemittanceEnabled, isRemNotRequired } = this.state;
        const { flag, message } = this.props.clientConfig.layout;
        const { user } = this.props;
        const appType = user.userData.appType? parseInt(user.userData.appType): entityType.B2B;
        const payerTypeId = user?.userData?.payerTypeId || PayerTypes.PMTX;


        const isBrandingEmailViewEnabled = (user.userRoles && user.userRoles.includes(accessRights['BRANDING_EMAIL_TEMPLATE_VIEW'])) || false;
        const isBrandingRemmitanceViewEnabled = isRemNotRequired === 1 ? false : (user.userRoles && user.userRoles.includes(accessRights['BRANDING_REMITTANCE_TEMPLATE_VIEW'])) || false;
        const isBrandingSupplierSiteViewEnabled = (user.userRoles && user.userRoles.includes(accessRights['BRANDING_SUPPLIER_SITE_VIEW'])) || false;
        const isBrandingSMSViewEnabled = (user.userRoles && user.userRoles.includes(accessRights['BRANDING_SMS_TEMPLATE_VIEW'])) || false; 

        const isBrandingUploadDocumentViewEnabled = ((user.userRoles && user.userRoles.includes(accessRights['BRANDING_FAQS_VIEW'])) || user.userRoles.includes(accessRights['BRANDING_TERM_AND_CONDITION_VIEW']) || user.userRoles.includes(accessRights['BRANDING_PRIVACY_POLICY_VIEW'])) || false;
        
        return (
            <div className={"paymentsTabContainer"}>
                <SubHeader
                    {...this.props}
                    title={t('componentData.brandingIndex.brandingTxt')}
                    alias={"Branding"}
                    tabs={[
                        {
                            url: "/user/notification",
                            name: t('componentData.brandingIndex.emailTemplate'),
                            items: [
                            ],
                            component: (
                                <EmailTemplate />
                            ),
                            alias: "BRANDING_EMAIL_TEMPLATE_VIEW",
                            isProtected: true,
                            showTab: isBrandingEmailViewEnabled
                        },
                        {
                            url: "/user/notification",
                            name: t('componentData.brandingIndex.smsTemplate'),
                            items: [],
                            component: (
                                <SMSTemplate />
                            ),
                            alias: "BRANDING_SMS_TEMPLATE_VIEW",
                            isProtected: true,
                            showTab: appType === entityType.B2C && isBrandingSMSViewEnabled,
                        },
                        {
                            url: "/user/notification",
                            name: t('componentData.brandingIndex.remittanceTemplate'),
                            items: [],
                            component: (
                                 appType === entityType.B2C ? <B2CRemittanceTemplate /> : <RemittanceTemplate />
                            ),
                            alias: "BRANDING_REMITTANCE_TEMPLATE_VIEW",
                            isProtected: true,
                            showTab: Boolean(isBrandingRemmitanceViewEnabled) && isRemittanceEnabled
                        },
                        {
                            url: "/user/notification",
                            name: t('componentData.brandingIndex.enrollmentSite'),
                            items: [],
                            component: (
                                appType === entityType.B2C ? <UserTheme /> : <ClientLogo />
                            ),
                            alias: "BRANDING_SUPPLIER_SITE_VIEW",
                            isProtected: true,
                            showTab:  payerTypeId == PayerTypes.CARDS ? false :  isBrandingSupplierSiteViewEnabled
                        },                                                
                        {
                            url: "/user/notification",
                            name: t('componentData.brandingIndex.UploadDocuments'),
                            items: [],
                            component: (
                                <UploadBrandingDocument />
                            ),
                            alias: "BRANDING_SUPPLIER_SITE_VIEW",
                            isProtected: true,
                            showTab: appType === entityType.B2C && isBrandingUploadDocumentViewEnabled,
                        },
                    ]}
                />

                {flag &&
                    <AlertDialog
                        title={message}
                        open={flag}
                        onConfirm={() => this.hideAlertMessage()}
                    />}
            </div>
        )
    }
}

export default withTranslation()(connect((state) => ({
    ...state.user,
    ...state.clientConfig
}))(Branding));
