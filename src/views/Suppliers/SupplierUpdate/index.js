import React, { Component } from "react";
import SupplierUpdateList from "~/modules/SupplierUpdateList";
import SupplierUpdateDetails from "~/modules/SupplierUpdateDetails";
import { Box } from "@material-ui/core";
import { connect } from "react-redux";
import { accessRights } from "~/config/accessRights";
import _ from "lodash";
import Notification from "~/components/Notification";
import { getClientSupplierUpdateAction, updateCount } from "~/redux/actions/suppliers";
class SupplierUpdates extends Component {
  state = {   
    processing: false,
    count: this.props.suppliers.count || 0,
    clientId: null,
    supplierUpdateList: this.props.suppliers.supplierUpdateList,
    isLoading: true,
    selectedCard: "",
    showDetails: false,
    payeeId: null,
    entityId: null,
    actionType: null,
    action: null,
    filters: {},
    error: false,
    variant: "error",
    needApproval: 0
  };
  componentWillMount() {
    if (this.props.user && this.props.user.userData) {
      this.setState({ clientId: this.props.user.userData.portalProfileId });
    }
    const { supplierUpdateList } = this.props.suppliers;
    if (supplierUpdateList && supplierUpdateList.length > 0) {
      this.setState({
        isLoading: false,
        selectedCard: supplierUpdateList[0].payeeActionTypeId,
      });
      this.onClickHandler(
        supplierUpdateList[0].payeeId,
        supplierUpdateList[0].actionId,
        supplierUpdateList[0].actionType,
        supplierUpdateList[0].action,
        supplierUpdateList[0].payeeActionTypeId,
        supplierUpdateList[0].needApproval
      );
    } else {
      this.setState({ isLoading: false });
    }
  }

  onFiltersChange = async (filters) => {
    await this.setState({
      ...this.state,
      filters: filters
    })
  }

  fetchClientSupplierUpdate = async (filters,flag) => {
    const {userData} = this.props.user;
    const {supplierUpdateList} = this.props.suppliers;
    const prevSelectedCardIndex = _.findIndex(
      supplierUpdateList,
      (supplierUpdateListItem) =>
        supplierUpdateListItem.payeeActionTypeId === this.state.selectedCard
    );
    this.props.dispatch(getClientSupplierUpdateAction(userData.portalProfileId, this.state.filters)).then((response) => {
      if(!response) {
        const {supplierUpdateError} = this.props.suppliers;
        this.setState({ isLoading: false, error: supplierUpdateError, variant: 'error'});
        return false;
      } else {
        const {supplierUpdateList} = this.props.suppliers;
        if(supplierUpdateList){
          const dataIncludeCheck = supplierUpdateList.map((obj) => ({
            ...obj,
            checked: false,
          }))
          if (dataIncludeCheck.length > 0) {
            const nextIndex = flag || dataIncludeCheck.length === 1 || prevSelectedCardIndex === -1 ? 0 : prevSelectedCardIndex === dataIncludeCheck.length ? prevSelectedCardIndex-1: prevSelectedCardIndex;
            this.onClickHandler(
              dataIncludeCheck[nextIndex].payeeId,
              dataIncludeCheck[nextIndex].actionId,
              dataIncludeCheck[nextIndex].actionType,
              dataIncludeCheck[nextIndex].action,
              dataIncludeCheck[nextIndex].payeeActionTypeId,
              dataIncludeCheck[nextIndex].needApproval

            );
            this.setState({
              selectedCard: dataIncludeCheck[nextIndex].payeeActionTypeId,
            });
          }
          this.props.dispatch(updateCount(supplierUpdateList.length)).then(() => {
            this.setState({ isLoading: false});
          });
        }else {
          this.setState({ isLoading: false });
        }
      }
    })
  };

  onClickHandler = (
    payeeId,
    entityId,
    actionType,
    action,
    payeeActionTypeId,
    needApproval
  ) => {
    this.setState(
      {
        showDetails: true,
        payeeId: payeeId,
        entityId: entityId,
        actionType: actionType,
        action: action,
        selectedCard: payeeActionTypeId,
        needApproval: needApproval
      },
      () => {
          const {supplierUpdateList} = this.props.suppliers
          this.props.dispatch(updateCount(supplierUpdateList.length));
      }
    );
  };

  handleNotificationClose = () => {
    this.setState({
      error: null,
    });
  };

  render() {
    const {
      clientId,
      showDetails,
      payeeId,
      entityId,
      actionType,
      action,
      isLoading,
      selectedCard,
      error,
      variant,
      needApproval
    } = this.state;
    const { user } = this.props;
    const { count } = this.props.suppliers;

    const isSupplierUpdateAcceptEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_SUPPLIER_UPDATES_ACCEPT"]
        )) ||
      false;

    return (
      <Box display="flex">
        <SupplierUpdateList
          clientId={clientId}
          onClickHandler={this.onClickHandler}
          selectedCard={selectedCard}
          isLoading={isLoading}
          fetchClientSupplierUpdate={this.fetchClientSupplierUpdate}
          onFiltersChange={this.onFiltersChange}
        />
        {showDetails && count > 0 && (
          <SupplierUpdateDetails
          {...this.props}
          clientId={clientId}
          payeeId={payeeId}
          entityId={entityId}
          actionType={actionType}
          action={action}
          selectedCard={selectedCard}
          isSupplierUpdateAcceptEnabled={isSupplierUpdateAcceptEnabled}
          fetchClientSupplierUpdate={this.fetchClientSupplierUpdate}
          needApproval={needApproval}
        />
        )}
        {error && (
          <Notification
            variant={variant}
            message={error}
            handleClose={this.handleNotificationClose}
            onClose={this.handleNotificationClose}
          />
        )}
      </Box>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.suppliers
}))(SupplierUpdates);
