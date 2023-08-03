import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import SupplierSubHeader from "~/components/SupplierSubHeader";
import config from "~/config";
import MySupplier from "./MySupplier";
import MySupplierB2C from "./MySupplier/B2C";
import MySupplierUSbank from "./MySupplier/USbank";
import MySupplierCC from "./MySupplier/CC";
import EnrollmentCampaigns from "./EnrollmentCampaigns";
import EnrollmentCampaignsDetails from "./EnrollmentCampaigns/Detail";
import CCEnrollmentCampaignDetails from "./EnrollmentCampaigns/CCDetail";
import CCEnrollmentListing from "./EnrollmentCampaigns/CCEnrollmentListing";
import CampaignFile from "./CampaignFile";
import CampaignFileDetails from "./CampaignFile/Detail/";
import SupplierDetails from '~/modules/SupplierDetails';
import AddPayee from "./MySupplier/USbank/AddPayee";
import { getClientSupplierUpdateAction, getClientSupplierUpdateBestBuyAction, updateBestCount, updateCount, getClientSupplierUpdateActionB2C } from "~/redux/actions/suppliers";

import { connect } from "react-redux";
import { accessRights } from "~/config/accessRights";
import PayeeUpdates from './PayeeUpdates';
import { entityType,PayerTypes } from '~/config/entityTypes';
import { withTranslation } from 'react-i18next';
import { Box, Typography } from '@material-ui/core';
import B2CPayeeUpdates from './PayeeUpdates/B2C';
import { getGeneralSettingConfig } from "~/redux/helpers/settings";


function SubHeaderHOC(props) {
  const {
    tData,
    component: Component,
    title,
    alias,
    claims,
    userInfo,
    count,
    unReadCount
  } = props;

  const { appType ,payerTypeId} = userInfo;
  const renderSuplierUpdate = () => {
    const countCheck = entityType.B2C === parseInt(appType) ? unReadCount : count;
    return (
      <>
        {tData('componentData.suppliersIndex.PayeeUpdates')}
        {countCheck > 0 && (
          <Typography
            variant="span"
            color={"error"}
            style={{
              background: "#E03617",
              color: "#fff",
              height: 15,
              minWidth: 15,
              fontSize: 12,
              borderRadius: 50,
              padding: 3,
              lineHeight: "11px",
              textAlign: "center",
              position: "absolute",
              right: "0px",
              top: "0px",
              marginBottom: 5,
              fontWeight: "normal",
            }}
          >
            {entityType.B2C === parseInt(appType) ? unReadCount : count}
          </Typography>
        )}
      </>
    );
  };
  const payerId = payerTypeId || PayerTypes.PMTX;
  const listMenu = [
    {
      url: `${config.baseName}/suppliers/mySupplier`,
      name: tData('componentData.suppliersIndex.MyPayees'),
      items: [],
      alias: "SUPPLIERS_MY_SUPPLIERS_VIEW",
      isProtected: true,
      showTab: true,
    },
    {
      url: `${config.baseName}/suppliers/supplierUpdates`,
      name: renderSuplierUpdate(),
      items: [],
      alias: "SUPPLIERS_SUPPLIER_UPDATES_VIEW",
      isProtected: true,
      showTab: payerId === parseInt(PayerTypes.CARDS) ? false : true,
    },
    {
      url: `${config.baseName}/suppliers/campaignFiles`,
      name: entityType.B2C === parseInt(appType) ? tData('componentData.suppliersIndex.EnrollmentCampaigns') : tData('componentData.suppliersIndex.Campaign'),
      items: [],
      alias: "SUPPLIERS_CAMPAIGN_FILE_VIEW",
      isProtected: true,
      showTab: true,
    },
    {
      url: `${config.baseName}/suppliers/enrollmentCampaigns`,
      name: tData('componentData.suppliersIndex.EnrollmentCampaigns'),
      items: [],
      alias: "SUPPLIERS_ENROLLMENT_CAMPAIGN_VIEW",
      isProtected: true,
      showTab: entityType.B2C === parseInt(appType) ? false : true,
    },
  ];

  const newTabs = listMenu.filter(item => item.showTab);

  return (
    <Fragment>
      <SupplierSubHeader
        {...props}
        title={title}
        alias={alias}
        listMenu={[...newTabs]}
        claims={claims}
      />
      <Component {...props} />
    </Fragment>
  );
}

class Suppliers extends Component {
  state = {
    unreadActions: null,
    unreadActionsBestBuy: [],
    showingRouting: false,
  };
  componentDidMount = () => {
    const { user } = this.props;
    const isGeneralSettingViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_GENERAL_SETTINGS_VIEW"]
        )) ||
      false;
    if (isGeneralSettingViewEnabled) {
      this.fetchGeneralSettingConfig();
    }
    const { appType } = user.userData;
    if (entityType.B2C === parseInt(appType)) {
      this.fetchClientSupplierUpdateActionB2C();
    } else {
      this.fetchClientSupplierUpdateAction();
    }
  }

  fetchGeneralSettingConfig = () => {
    const clientId = this.props.user.userData.portalProfileId;
    getGeneralSettingConfig(clientId).then((res) => {
      if (res.error) {
        return false;
      }
      /* conditionally calling API for best buy if best buy */
      if (res.data) {
        const { isPayeeUpdateAllowed, isPayeePaymentUpdateAllowed } = res.data;
        if (isPayeeUpdateAllowed || isPayeePaymentUpdateAllowed) {
          this.fetchClientSupplierUpdateBestBuyAction();
        }
      }
    });
  };

  fetchClientSupplierUpdateAction = async () => {
    const { userData } = this.props.user;
    this.props.dispatch(getClientSupplierUpdateAction(userData.portalProfileId)).then((response) => {
      if (!response) {
        this.setState({
          unreadActions: [],
          showingRouting: false,
        }, () => {
          this.props.dispatch(updateCount(this.state.unreadActions.length));
        });
        return false;
      }
      else {
        const { supplierUpdateList } = this.props.suppliers
        if (supplierUpdateList) {
          this.props.dispatch(updateCount(supplierUpdateList.length)).then(() => {
            this.setState({
              unreadActions: supplierUpdateList && supplierUpdateList.length ? supplierUpdateList.map(
                (item) => item.payeeActionTypeId
              ) : [],
              showingRouting: true,
            });
          });

        }
      }
      const { supplierUpdateList } = this.props.suppliers;
      this.props.dispatch(updateCount(supplierUpdateList.length)).then(() => {
        this.setState({
          unreadActions: supplierUpdateList && supplierUpdateList.length ? supplierUpdateList.map(
            (item) => item.payeeActionTypeId
          )
            : [],
          showingRouting: true,
        });
      })
    });
  };

  fetchClientSupplierUpdateActionB2C = async () => {
    let offset = 0;
    let limit = 3;
    const { userData } = this.props.user;
    this.props.dispatch(getClientSupplierUpdateActionB2C(userData.portalProfileId, {}, offset, limit, false)).then((response) => {
      if (!response) {
        this.setState({
          unreadActions: [],
          showingRouting: false,
        }, () => {
          this.props.dispatch(updateCount(this.state.unreadActions.length));
        });
        return false;
      }
      else {
        const { supplierUpdateList, count } = this.props.suppliers
        if (supplierUpdateList) {
          this.props.dispatch(updateCount(count)).then(() => {
            this.setState({
              unreadActions: supplierUpdateList && supplierUpdateList.length ? supplierUpdateList.filter(
                (item) => item.consumerUpdatesId && (!item.isRead)
              ) : [],
              showingRouting: true,
            });
          });

        }
      }
      const { supplierUpdateList, count } = this.props.suppliers;
      this.props.dispatch(updateCount(count)).then(() => {
        this.setState({
          unreadActions: supplierUpdateList && supplierUpdateList.length ? supplierUpdateList.filter(
            (item) => item.consumerUpdatesId && (!item.isRead)
          )
            : [],
          showingRouting: true,
        });
      })
    });
  };

  fetchClientSupplierUpdateBestBuyAction = async () => {
    const { userData } = this.props.user;
    this.props.dispatch(getClientSupplierUpdateBestBuyAction(userData.portalProfileId)).then((response) => {
      if (!response) {
        this.setState({
          unreadActionsBestBuy: [],
          showingRouting: false,
        }, () => {
          this.props.dispatch(updateBestCount(this.state.unreadActionsBestBuy.length));
        });
        return false;
      }
      else {
        const { bestBuySupplierUpdateList } = this.props.suppliers;
        if (bestBuySupplierUpdateList) {
          this.props.dispatch(updateBestCount(bestBuySupplierUpdateList.length)).then(() => {
            this.setState({
              unreadActionsBestBuy: bestBuySupplierUpdateList.map(
                (item) => item.payeeActionTypeId
              ),
              showingRouting: true,
            });
          })
        }
      }
      const { bestBuySupplierUpdateList } = this.props.suppliers;
      this.props.dispatch(updateBestCount(bestBuySupplierUpdateList.length)).then(() => {
        this.setState({
          unreadActionsBestBuy: bestBuySupplierUpdateList ? bestBuySupplierUpdateList.map(
            (item) => item.payeeActionTypeId
          )
            : [],
          showingRouting: true,
        });
      })
    });
  };

  render() {
    const { user } = this.props;
    const { t } = this.props;
    const payerTypeId = user?.userData?.payerTypeId || PayerTypes.PMTX;
    const isMySupplierEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_VIEW"])) ||
      false;
    const isSupplierUpdateEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_SUPPLIER_UPDATES_VIEW"]
        )) ||
      false;
    const isCampaignEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_ENROLLMENT_CAMPAIGN_VIEW"]
        )) ||
      false;
    const isCampaignFileEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_CAMPAIGN_FILE_VIEW"]
        )) ||
      false;
    const { unreadActions } = this.state;
    const { appType } = user.userData;
    return (
      <Box>
        {this.state.showingRouting &&
          unreadActions !== null &&
          typeof unreadActions !== "undefined" && (
            <Fragment>
              <Switch>
                <Route
                  exact
                  path={`${config.baseName}/suppliers/mySupplier`}
                  render={(props) =>
                    isMySupplierEnabled ? (
                      <SubHeaderHOC
                        {...props}
                        tData={t}
                        component={this.props.user.isPayeeChoicePortal ? (MySupplierUSbank) : (payerTypeId === PayerTypes.CARDS ? MySupplierCC : entityType.B2C === parseInt(appType) ? MySupplierB2C : MySupplier)}
                        title={t('componentData.suppliersIndex.Payees')}
                        alias="SUPPLIERS_MY_SUPPLIERS_VIEW"
                        claims={user.userRoles}
                        count={this.props.suppliers.count + this.props.suppliers.pendingCount}
                        unReadCount={this.props.suppliers.unReadCount}
                        userInfo={user.userData}
                      />
                    ) : null
                  }
                />
                <Route
                  exact
                  path={`${config.baseName}/suppliers/supplierUpdates`}
                  render={(props) =>
                    isSupplierUpdateEnabled ? (
                      <SubHeaderHOC
                        {...props}
                        tData={t}
                        component={entityType.B2C === parseInt(appType) ? B2CPayeeUpdates : PayeeUpdates}
                        title={t('componentData.suppliersIndex.PayeeUpdates')}
                        alias="SUPPLIERS_SUPPLIER_UPDATES_VIEW"
                        claims={user.userRoles}
                        userInfo={user.userData}
                        count={this.props.suppliers.count + this.props.suppliers.pendingCount}
                        unReadCount={this.props.suppliers.unReadCount}
                        fetchClientSupplierUpdateAction={this.fetchClientSupplierUpdateAction}
                        fetchClientSupplierUpdateBestBuyAction={this.fetchClientSupplierUpdateBestBuyAction}
                        fetchClientSupplierUpdateActionB2C={this.fetchClientSupplierUpdateActionB2C}
                      />
                    ) : null
                  }
                />
                <Route
                  path={`${config.baseName}/suppliers/enrollmentCampaigns`}
                  render={(props) =>
                    isCampaignEnabled && entityType.B2B === parseInt(appType) ? (
                      <SubHeaderHOC
                        {...props}
                        tData={t}
                        component={payerTypeId == PayerTypes.CARDS ? CCEnrollmentListing : EnrollmentCampaigns}
                        title={t('componentData.suppliersIndex.Payees')}
                        alias="SUPPLIERS_ENROLLMENT_CAMPAIGN_VIEW"
                        count={this.props.suppliers.count + this.props.suppliers.pendingCount}
                        unReadCount={this.props.suppliers.unReadCount}
                        claims={user.userRoles}
                        userInfo={user.userData}
                      />
                    ) : null
                  }
                />
                    <Route
                  path={`${config.baseName}/suppliers/mySupplier/payee/add`}
                  render={(props) =>
                    (
                      <SubHeaderHOC
                        {...props}
                        tData={t}
                        component={AddPayee}
                        title={t('componentData.suppliersIndex.Payees')}
                        alias="SUPPLIERS_MY_SUPPLIERS_VIEW"
                        claims={user.userRoles}
                        count={this.props.suppliers.count + this.props.suppliers.pendingCount}
                        unReadCount={this.props.suppliers.unReadCount}
                        userInfo={user.userData}
                      />
                    ) 
                  }
                />
                <Route
                  path={`${config.baseName}/suppliers/campaigns/detail`}
                  render={(props) =>
                    isCampaignEnabled ? (
                      <SubHeaderHOC
                        {...props}
                        tData={t}
                        component={payerTypeId == PayerTypes.CARDS ? CCEnrollmentCampaignDetails : EnrollmentCampaignsDetails}
                        title={t('componentData.suppliersIndex.Payees')}
                        alias="SUPPLIERS_ENROLLMENT_CAMPAIGN_VIEW"
                        count={this.state.unreadActions.length}
                        unReadCount={this.props.suppliers.unReadCount}
                        claims={user.userRoles}
                        userInfo={user.userData}
                      />
                    ) : null
                  }
                />
                <Route
                  exact
                  path={`${config.baseName}/suppliers/campaignFiles`}
                  render={(props) =>
                    isCampaignFileEnabled ? (
                      <SubHeaderHOC
                        {...props}
                        tData={t}
                        component={CampaignFile}
                        title={t('componentData.suppliersIndex.Payees')}
                        alias="SUPPLIERS_CAMPAIGN_FILE_VIEW"
                        count={this.state.unreadActions.length}
                        unReadCount={this.props.suppliers.unReadCount}
                        claims={user.userRoles}
                        userInfo={user.userData}
                      />
                    ) : null
                  }
                />

                <Route
                  path={`${config.baseName}/suppliers/campaignFiles/fileDetails`}
                  render={(props) =>
                    isCampaignFileEnabled ? (
                      <SubHeaderHOC
                        {...props}
                        tData={t}
                        component={CampaignFileDetails}
                        title={t('componentData.suppliersIndex.Payees')}
                        alias="SUPPLIERS_CAMPAIGN_FILE_VIEW"
                        count={this.state.unreadActions.length}
                        unReadCount={this.props.suppliers.unReadCount}
                        claims={user.userRoles}
                        userInfo={user.userData}
                      />
                    ) : null
                  }
                />


                {/* For CC supplier details */}
                <Route
                  exact
                  path={`${config.baseName}/suppliers/mySupplier/details`}
                  render={(props) =>
                    isMySupplierEnabled ? (
                      <SubHeaderHOC
                        {...props}
                        tData={t}
                        component={SupplierDetails}
                        title={t('componentData.suppliersIndex.Payees')}
                        alias="SUPPLIERS_MY_SUPPLIERS_VIEW"
                        claims={user.userRoles}
                        count={this.props.suppliers.count + this.props.suppliers.pendingCount}
                        unReadCount={this.props.suppliers.unReadCount}
                        userInfo={user.userData}
                      />
                    ) : null
                  }
                />
              </Switch>
            </Fragment>
          )}
      </Box>
    );
  }
}

// export default Suppliers;
export default withTranslation()(connect((state) => {
  return ({
    ...state.user,
    ...state.suppliers
  })
})(Suppliers));
