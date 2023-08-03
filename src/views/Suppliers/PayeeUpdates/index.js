import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Paper,
  Box,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { TabPanel } from "~/components/TabPanel/index";
import { withStyles } from "@material-ui/styles";
import styles from "./styles";
import { withTranslation } from "react-i18next";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import SupplierUpdate from "../SupplierUpdate";
import SupplierUpdateBestBuy from "../SupplierUpdateBestBuy";
import { getGeneralSettingConfig } from "~/redux/helpers/settings";
import { accessRights } from "~/config/accessRights";


class PayeeUpdates extends Component {
  state = {
    isLoading: true,
    showDetails: false,
    error: false,
    variant: "error",
    value: this.props.suppliers.selectedTab,
    count: this.props.suppliers.count,
    bestBuyCount: this.props.suppliers.bestBuyCount,
    bestBuySupplierUpdateList: this.props.suppliers.bestBuySupplierUpdateList || [],
    supplierUpdateList: this.props.suppliers.supplierUpdateList || [],
    unreadActions: null,
    unreadActionsBestBuy: [],
    generalSettingConfig: {},
    canViewInternalUpdates: false
  };

  componentDidMount = () => {
    const {user} = this.props
    const isGeneralSettingViewEnabled =
    (user.userRoles &&
      user.userRoles.includes(
        accessRights["SETTINGS_GENERAL_SETTINGS_VIEW"]
      )) ||
    false;
    if(isGeneralSettingViewEnabled){
      this.fetchGeneralSettingConfig();
    }  };

  fetchGeneralSettingConfig = () => {
    const clientId = this.props.user.userData.portalProfileId;
    this.setState(
      {
        isLoading: true,
      },
      () => {
        getGeneralSettingConfig(clientId).then((res) => {
          if (res.error) {
            // this.setDialogMessage(true, res.message, "error");
            this.setState({ isLoading: false });
            return false;
          }
          /* Setting Tab internal/payee updates */
          if(res.data) {
            const { isPayeeUpdateAllowed, isPayeePaymentUpdateAllowed } = res.data;

            let isSelected = isPayeeUpdateAllowed || isPayeePaymentUpdateAllowed ? 0 : 1;
            isSelected = !isSelected && !this.props.suppliers.selectedTab ? 0 : 1;
            this.setState({
              generalSettingConfig: res.data,
              isLoading: false,
              value: isSelected,
              canViewInternalUpdates: isPayeeUpdateAllowed || isPayeePaymentUpdateAllowed ? true : false
            });
          }
        });
      }
    );
  };

  handleTabChange = (newValue) => {
    this.setState({ value: newValue }, ()=> {
      if (this.state.canViewInternalUpdates) {
        this.props.fetchClientSupplierUpdateBestBuyAction();
      }
      this.props.fetchClientSupplierUpdateAction();
    });
  };

  renderSuplierUpdate = () => {
    return (
      <>
        {this.props.suppliers.count > 0 && (
          <Typography
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
              right: "4px",
              top: "4px",
              marginBottom: 5,
              fontWeight: "normal",
            }}
          >
            {this.props.suppliers.count}
          </Typography>
        )}
      </>
    );
  };

  renderSuplierUpdateBestBuy = () => {
    return (
      <>
        {this.props.suppliers.pendingCount > 0 && (
          <Typography
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
              right: "4px",
              top: "4px",
              marginBottom: 5,
              fontWeight: "normal",
            }}
          >
            {this.props.suppliers.pendingCount }
          </Typography>
        )}
      </>
    );
  };

  render() {
    const {
      value,
      isLoading,
      canViewInternalUpdates
    } = this.state;
    const { classes, t } = this.props;
    if (isLoading) {
      return (
        <Box justifyContent="center" display="flex" pt={3} alignSelf="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return (
      <>
        <Box mx={6} mt={4}>
          <Box my={4}>
            <Grid container xs={12}>
              <Paper
                elevation={0}
                style={{ width: "100%", background: "transparent" }}
              >
                <Grid container item xs={12} md={12} justify="flex-start">
                  <Grid item xs={12} sm={7} className={classes.gridItem}>
                    <Box
                      border={1}
                      borderRadius={4}
                      p={0.5}
                      borderColor="#cccccc"
                      width={canViewInternalUpdates ? "100%" : "50%"}
                    >
                      <Tabs
                        value={value}
                        variant="fullWidth"
                        className={classes.tabClass}
                        indicatorColor="none"
                      >
                        {canViewInternalUpdates && (
                          <Tab
                            fullWidth={false}
                            value={0}
                            onClick={() => this.handleTabChange(0)}
                            key="tab-0"
                            label={
                              <span className={classes.checkedIcon}>
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  width={1}
                                >
                                  {value === 0 && (
                                    <CheckCircleIcon
                                      fontSize="small"
                                      className={classes.checkClass}
                                    />
                                  )}
                                  <span style={{ width: "100%" }}>
                                    {t(
                                      "componentData.supplierUdateList.internalUpdates"
                                    )}{" "}
                                  </span>
                                  <span style={{ margin: "0 0 0 14px" }}></span>
                                  <span>
                                    {this.renderSuplierUpdateBestBuy()}
                                  </span>
                                </Box>
                              </span>
                            }
                            //   disabled={value}
                            style={{ minHeight: "20px", height: "35px" }}
                            classes={classes}
                          />
                        )}
                        <Tab
                          value={1}
                          onClick={() => this.handleTabChange(1)}
                          key="tab-1"
                          label={
                            <span className={classes.checkedIcon}>
                              <Box
                                display="flex"
                                justifyContent="space-between"
                                width={1}
                              >
                                {value === 1 && (
                                  <CheckCircleIcon
                                    fontSize="small"
                                    className={classes.checkClass}
                                  />
                                )}
                                <span style={{ width: "100%" }}>
                                  {t(
                                    "componentData.supplierUdateList.updatesOfPayees"
                                  )}
                                </span>
                                <span style={{ margin: "0 0 0 14px" }}></span>
                                <span>{this.renderSuplierUpdate()}</span>
                              </Box>
                            </span>
                          }
                          //   disabled={!value}
                          style={{ minHeight: "20px", height: "35px", width: "50%" }}
                          classes={classes}
                        />
                      </Tabs>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    {canViewInternalUpdates && (
                      <TabPanel value={value} index={0}>
                        <SupplierUpdateBestBuy/>
                      </TabPanel>
                    )}
                    <TabPanel value={value} index={1}>
                      <SupplierUpdate/>
                    </TabPanel>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Box>
        </Box>
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.suppliers,
  }))(withStyles(styles)(PayeeUpdates))
);
