import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
} from "@material-ui/core";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { withStyles } from "@material-ui/core/styles";
import config from "~/config";
import styles from "./styles";
import { accessRights } from "~/config/accessRights";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { withTranslation } from "react-i18next";

class Sidebar extends Component {
  constructor() {
    super();
    this.state = { open: "" };
  }
  handleClick = (id) => {
    if (this.state.open === id) {
      this.setState({ open: "" });
    } else {
      this.setState({ open: id });
    }
  };

  renderSidebarItem = (item) => {
    const { classes, t } = this.props;
    const currentUrl = this.props.match.url;
    let active = false;
    const _item = item && item.items && item.items[0];
    if (currentUrl && currentUrl.includes(_item)) {
      active = true;
    }

    return (
      <Link to={`${config.baseName}${item.link}`} key={item.id}>
        <Box
          className={[
            classes.sidebarItem,
            active ? classes.sidebarItemSelected : "",
          ].join(" ")}
        >
          <Box
            className={[
              classes.sidebarItemIcon,
              active ? classes.sidebarItemIconSelected : "",
            ].join(" ")}
          >
            {
              <img
                src={require(`~/assets/icons/${item.icon.file}${
                  active ? "" : "-unselected"
                }.svg`)}
                alt={t(`componentData.sidebar.${item.title}`)}
                title={t(`componentData.sidebar.${item.title}`)}
                className="menu-icon"
              />
            }
          </Box>
          <Box
            className={[
              classes.sidebarItemName,
              active ? classes.sidebarItemNameSelected : "",
            ].join(" ")}
          >
            <Typography variant="caption">
              {t(`componentData.sidebar.${item.title}`)}
            </Typography>
          </Box>
        </Box>
      </Link>
    );
  };

  nestedItem = (item) => {
    const nestedMenu = item.items.map((nested, i) => {
      return this.renderSidebarItem(nested, nested.id);
    });
    return (
      <Fragment>
        <ListItem button onClick={this.handleClick(item.id)}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={item.title}></ListItemText>
          {(this.state.open === item.id) === item.id ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </ListItem>
        <Collapse
          in={() => this.state.open === item.id}
          timeout="auto"
          unmountOnExit
        >
          <List component="Box" disablePadding>
            {nestedMenu}
          </List>
        </Collapse>
      </Fragment>
    );
  };

  render() {
    const { user, classes, data } = this.props;
    const isUserViewEnabled =
      (user.userRoles && user.userRoles.includes(accessRights["USER_VIEW"])) ||
      false;
    const isRoleViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["USER_ROLE_VIEW"])) ||
      false;
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
    const isCampignFileEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_CAMPAIGN_FILE_VIEW"]
        )) ||
      false;
    const isSupplierUpdateBestBuyEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_SUPPLIER_UPDATES_BEST_BUY_VIEW"]
        )) ||
      false;
    const isCampaignEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_ENROLLMENT_CAMPAIGN_VIEW"]
        )) ||
      false;
    const isMyFileViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["PAYMENTS_MY_FILES_VIEW"])) ||
      false;
    const isPaymentViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["PAYMENTS_PAYMENTS_VIEW"])) ||
      false;
    const isBrandingEmailViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["BRANDING_EMAIL_TEMPLATE_VIEW"]
        )) ||
      false;
    const isBrandingSMSViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["BRANDING_SMS_TEMPLATE_VIEW"])) ||
      false;
    const isBrandingRemmitanceViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["BRANDING_REMITTANCE_TEMPLATE_VIEW"]
        )) ||
      false;
    const isSettingCompanyViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_COMPANY_DETAILS_VIEW"]
        )) ||
      false;
    const isSettingGeneralViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_GENERAL_SETTINGS_VIEW"]
        )) ||
      false;
    const isSettingPaymentMethodViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_PAYMENT_METHODS_VIEW"]
        )) ||
      false;
    const isSettingFilesViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_FILES_SETTINGS_VIEW"]
        )) ||
      false;
    const isSettingRemmitanceViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SETTINGS_REMITTANCE_VIEW"])) ||
      false;
    const isSettingValidationSupplierViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SETTINGS_VALIDATION_SUPPLIER_VIEW"]
        )) ||
      false;
    const isReportViewEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["REPORTS_VIEW"])) ||
        user.userRoles.includes(accessRights["REPORTS_DAILY_STATUS_REPORT_VIEW"]) ||
        user.userRoles.includes(accessRights["REPORTS_DAILY_ENROLLMENT_REPORT_VIEW"]) ||
        user.userRoles.includes(accessRights["REPORTS_REJECTED_DELIVERY_REPORT_VIEW"]) ||
        user.userRoles.includes(accessRights["REPORTS_SMS_OPT_OUT_REPORT_VIEW"]) ||
      false;
    //USBank Report 
    // const isReportDailyStatusViewEnabled =
    //   (user.userRoles &&
    //     user.userRoles.includes(accessRights["REPORTS_DAILY_STATUS_REPORT_VIEW"])) ||
    //   false;
    // const isReportDailyEnrollmentViewEnabled =
    //   (user.userRoles &&
    //     user.userRoles.includes(accessRights["REPORTS_DAILY_ENROLLMENT_REPORT_VIEW"])) ||
    //   false;
    // const isReportRejectedDeliveryViewEnabled =
    //   (user.userRoles &&
    //     user.userRoles.includes(accessRights["REPORTS_REJECTED_DELIVERY_REPORT_VIEW"])) ||
    //   false;
    // const isReportSMSOptOutViewEnabled =
    //   (user.userRoles &&
    //     user.userRoles.includes(accessRights["REPORTS_SMS_OPT_OUT_REPORT_VIEW"])) ||
    //   false;

    return (
      <Box
        className={classes.sidebarContainer}
        style={this.props.i18n.language !== "en" ? { width: "5.5rem" } : {}}
      >
        <PerfectScrollbar options={{ wheelPropagation: false }}>
          <Box className={classes.sidebarMenu}>
            {user.isLoggedIn &&
              data
                .filter((item) => {
                  if (
                    item.title === "Payments" &&
                    !isPaymentViewEnabled &&
                    !isMyFileViewEnabled
                  ) {
                    return false;
                  }
                  if (
                    item.title === "Users" &&
                    !isUserViewEnabled &&
                    !isRoleViewEnabled
                  ) {
                    return false;
                  }
                  if (
                    item.title === "Payees" &&
                    !isMySupplierEnabled &&
                    (!isSupplierUpdateEnabled ||
                      !isSupplierUpdateBestBuyEnabled) &&
                    !isCampaignEnabled &&
                    !isCampignFileEnabled
                  ) {
                    return false;
                  }
                  if (
                    item.title === "Branding" &&
                    !isBrandingEmailViewEnabled &&
                    !isBrandingRemmitanceViewEnabled &&
                    !isBrandingSMSViewEnabled
                  ) {
                    return false;
                  }
                  if (
                    item.title === "Settings" &&
                    !isSettingCompanyViewEnabled &&
                    !isSettingGeneralViewEnabled &&
                    !isSettingPaymentMethodViewEnabled &&
                    !isSettingFilesViewEnabled &&
                    !isSettingRemmitanceViewEnabled &&
                    !isSettingValidationSupplierViewEnabled
                  ) {
                    return false;
                  }
                  if (item.title === "Reports" && !(isReportViewEnabled)) {
                    return false;
                  }
                  return true;
                })
                .map((sidebarItem) => {
                  let urlLink = sidebarItem.link;
                  if (sidebarItem.title === "Payments") {
                    if (isPaymentViewEnabled) {
                      urlLink = sidebarItem.link + "/paymentDetails";
                    }
                    if (isMyFileViewEnabled) {
                      urlLink = sidebarItem.link + "/paymentFiles";
                    }
                  }
                  if (sidebarItem.title === "Users") {
                    if (isRoleViewEnabled) {
                      urlLink = sidebarItem.link + "/role";
                    }
                    if (isUserViewEnabled) {
                      urlLink = sidebarItem.link;
                    }
                  }
                  if (sidebarItem.title === "Payees") {
                    if (isCampaignEnabled) {
                      urlLink = sidebarItem.link + "/enrollmentCampaigns";
                    }
                    if (isCampignFileEnabled) {
                      urlLink = sidebarItem.link + "/campaignFiles";
                    }
                    if (isSupplierUpdateEnabled) {
                      urlLink = sidebarItem.link + "/supplierUpdates";
                    }
                    if (isMySupplierEnabled) {
                      urlLink = sidebarItem.link + "/mySupplier";
                    }
                  }
                  return this.renderSidebarItem({
                    ...sidebarItem,
                    link: urlLink,
                  });
                })}
          </Box>
        </PerfectScrollbar>
      </Box>
    );
  }
}

export default withTranslation()(withStyles(styles)(Sidebar));
