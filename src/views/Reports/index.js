import React, { Component, Fragment } from 'react'
import { Route, Switch } from 'react-router-dom';
import SubHeader from '~/components/SubHeader/Reports/';
import ListView from './Report/ListView/';
import USbankReportListView from './USbankReport/ListView/';
import ReportView from './Report/View/';
import USbankReportView from './USbankReport/View/';
import B2CReportView from './Report/View/b2c';
import PayeeAuditReport from './Report/View/PayeeAuditReport'
import { withStyles } from '@material-ui/styles';
import config from '~/config'
import { accessRights } from '~/config/accessRights';
import { withTranslation } from 'react-i18next';
import { ReportsAddContainer, ReportsEditContainer } from '~/redux/containers/reports'
import styles from './styles';
import { entityType } from '~/config/entityTypes';

const reportAccessName = [
    "REPORTS_DAILY_STATUS_REPORT_VIEW",
    "REPORTS_DAILY_ENROLLMENT_REPORT_VIEW",
    "REPORTS_REJECTED_DELIVERY_REPORT_VIEW",
    "REPORTS_SMS_OPT_OUT_REPORT_VIEW"
]

class AuthRoute extends Component {

    isAllowed(claims, name) {
        const permissions = claims;
        const accessId = accessRights[name] || null;
        const isEnabled = accessId && permissions && permissions.includes(accessId);
        if (isEnabled) {
            return true
        }
        return false;
    }

    isAllowedUSBank(claims, name) {
        const permissions = claims;
        if(typeof(name)==="object") {
            const isAllowedNames = name.map((item) => {
                const accessId = accessRights[item] || null;
                const isEnabled = accessId && permissions && permissions.includes(accessId);
                if (isEnabled) {
                    return true
                }
                return false 
            })
            return isAllowedNames.includes(true)
        } else {
            return this.isAllowed(claims, name);
        }
    }


    render() {
        const { component: Component, name, claims, title, alias, isPayeeChoicePortal, ...rest } = this.props;
        const isAccessable = isPayeeChoicePortal ? this.isAllowedUSBank(claims, name) : this.isAllowed(claims, name);
        return (
            <Route exact={true} {...rest} render={(props) => (
                (isAccessable === true) ?
                    <Fragment>
                        <SubHeader {...props} title={title} alias={alias} claims={claims} />
                        <Component {...props} />
                    </Fragment>
                    : null
            )} />
        )
    }
}

class Reports extends Component {
    render() {
        const { user, classes, t } = this.props;
        const claims = user.userRoles;
        const { appType } = this.props.user.userData;
        const { isPayeeChoicePortal } = this.props.user;

        return (
            <div className={classes.root}>
                <Fragment>
                    <Switch>
                        {isPayeeChoicePortal ?
                            <>
                                <AuthRoute exact path={`${config.baseName}/reports`} isPayeeChoicePortal={true} component={USbankReportListView} claims={claims} name={reportAccessName} title={t('componentData.reportsView.Reports')} alias="REPORTS_DAILY_ENROLLMENT_REPORT_VIEW" />
                                <AuthRoute exact path={`${config.baseName}/reports/view`} isPayeeChoicePortal={true} component={USbankReportView} claims={claims} name={reportAccessName} title={t('componentData.reportsView.Reports')} alias="REPORTS_DAILY_ENROLLMENT_REPORT_VIEW" />
                            </> :
                            <>
                                <AuthRoute exact path={`${config.baseName}/reports`} component={ListView} claims={claims} name={"REPORTS_VIEW"} title={t('componentData.reportsView.Reports')} alias="REPORTS_VIEW" />

                                <AuthRoute exact path={`${config.baseName}/reports/add`} component={ReportsAddContainer} claims={claims} name={"DYNAMIC_REPORTS_ADD"} title={t('componentData.reportsView.Reports')} alias="DYNAMIC_REPORTS_ADD" />

                                <AuthRoute exact path={`${config.baseName}/reports/edit`} component={ReportsEditContainer} claims={claims} name={"DYNAMIC_REPORTS_EDIT"} title={t('componentData.reportsView.Reports')} alias="DYNAMIC_REPORTS_EDIT" />

                                <AuthRoute exact path={`${config.baseName}/reports/view`} component={appType === entityType.B2C ? B2CReportView : ReportView} claims={claims} name={"REPORTS_VIEW"} title={t('componentData.reportsView.Reports')} alias="REPORTS_VIEW" />

                                <AuthRoute exact path={`${config.baseName}/reports/view/payeeauditreport`} component={PayeeAuditReport} claims={claims} name={"REPORTS_VIEW"} title={t('componentData.reportsView.Reports')} alias="PAYEE_AUDIT_REPORT" />
                            </>
                        }
                    </Switch>
                </Fragment>
            </div>
        )
    }
}

export default withTranslation()(withStyles(styles)(Reports));
