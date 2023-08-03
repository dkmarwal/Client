import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SupplierSubHeader from "~/components/SupplierSubHeader";
import config from "~/config";
import { Box } from "@material-ui/core";
import PaymentDetails from "./PaymentDetails";
import USbankPaymentDetails from "./USbankPaymentDetails";
import PaymentFiles from "./PaymentFiles";
import { withTranslation, useTranslation } from "react-i18next";
import { accessRights } from "~/config/accessRights";
import PaymentDetailView from "~/modules/PaymentDetailView";
import USBankAddPayments  from "./AddPayments/USBank";

function SubHeaderHOC(props) {
  const { component: Component, name, title, claims, alias, ...rest } = props;
  const { t } = useTranslation();
  const listMenu = [
    {
      url: `${config.baseName}/payments/paymentFiles`,
      name: t("componentData.payments.MyFiles"),
      items: [],
      alias: "PAYMENTS_MY_FILES_VIEW",
      isProtected: true,
    },
    {
      url: `${config.baseName}/payments/paymentDetails`,
      name: t("componentData.payments.MyPayments"),
      items: [],
      alias: "PAYMENTS_PAYMENTS_VIEW",
      isProtected: true,
    },
  ];
  return (
    <Fragment>
      <SupplierSubHeader
        {...props}
        title={title}
        alias={alias}
        listMenu={listMenu}
        claims={claims}
      />
      <Component {...props} />
    </Fragment>
  );
}
class Payments extends Component {
  render() {
    const { t } = this.props;
    const { user } = this.props;
    const isMyFileViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["PAYMENTS_MY_FILES_VIEW"])) ||
      false;
    const isPaymentViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["PAYMENTS_PAYMENTS_VIEW"])) ||
      false;
    return (
      <Box>
        <Fragment>
          <Switch>
            <Route
              path={`${config.baseName}/payments/paymentFiles`}
              render={(props) =>
                isMyFileViewEnabled ? (
                  <SubHeaderHOC
                    {...props}
                    component={PaymentFiles}
                    claims={user.userRoles}
                    title={t("componentData.payments.PaymentsTxt")}
                    alias="PAYMENTS_MY_FILES_VIEW"
                  />
                ) : null
              }
            />
            <Route
              exact
              path={`${config.baseName}/payments/paymentDetails`}
              render={(props) =>
                isPaymentViewEnabled ? (
                  <SubHeaderHOC
                    {...props}
                    component={
                      user.isPayeeChoicePortal
                        ? USbankPaymentDetails
                        : PaymentDetails
                    }
                    claims={user.userRoles}
                    title={t("componentData.payments.PaymentsTxt")}
                    alias="PAYMENTS_PAYMENTS_VIEW"
                  />
                ) : null
              }
            />

            <Route
              exact
              path={`${config.baseName}/payments/paymentDetails/viewDetail`}
              render={(props) =>
                isPaymentViewEnabled ? (
                  <SubHeaderHOC
                    {...props}
                    component={PaymentDetailView}
                    claims={user.userRoles}
                    title={t("componentData.payments.PaymentsTxt")}
                    alias="PAYMENTS_PAYMENTS_VIEW"
                  />
                ) : null
              }
            />

            <Route
              exact
              path={`${config.baseName}/payments/paymentDetails/addPayment`}
              render={(props) => (
                <SubHeaderHOC
                  {...props}
                  component={USBankAddPayments}
                  claims={user.userRoles}
                  title={t("componentData.payments.PaymentsTxt")}
                  alias="ADD_PAYMENTS"
                  isAdd={true}
                />
              )}
            />
          </Switch>
        </Fragment>
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(Payments)
);
