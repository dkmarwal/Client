import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import styles from "./styles";
import { withTranslation } from "react-i18next";
import B2CSupplierUpdates from "../../SupplierUpdate/B2C";
import { getGeneralSettingConfig } from "~/redux/helpers/settings";
import { accessRights } from "~/config/accessRights";


class B2CPayeeUpdates extends Component {
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
    }
  };

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
        {this.props.suppliers.unReadCount > 0 && (
          <Typography
            color={"error"}
            style={{
              background: "#B60000",
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
            {this.props.suppliers.unReadCount}
          </Typography>
        )}
      </>
    );
  };

  renderSuplierUpdateBestBuy = () => {
    return (
      <>
        {this.props.suppliers.bestBuyCount > 0 && (
          <Typography
            color={"error"}
            style={{
              background: "#B60000",
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
            {this.props.suppliers.bestBuyCount}
          </Typography>
        )}
      </>
    );
  };

  render() {
    const {
      isLoading,
    } = this.state;
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
                <B2CSupplierUpdates/>
                {/* <Grid container item xs={12} md={12} justify="flex-start">
                  <Grid item xs={12} sm={7} className={classes.gridItem}>
                    
                  </Grid>
                </Grid> */}
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
  }))(withStyles(styles)(B2CPayeeUpdates))
);
