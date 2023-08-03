import React, { Component } from "react";
import B2CSupplierUpdateList from "~/modules/SupplierUpdateList/B2C";
import B2CSupplierUpdateDetails from "~/modules/SupplierUpdateDetails/B2C";
import { Box, CircularProgress } from "@material-ui/core";
import { connect } from "react-redux";
import { accessRights } from "~/config/accessRights";
import _ from "lodash";
import { getClientSupplierUpdateActionB2C, updateCount, updateUnreadCount } from "~/redux/actions/suppliers";

class B2CSupplierUpdates extends Component {
  state = {
    processing: false,
    count: this.props.suppliers.count || 0,
    clientId: null,
    supplierUpdateList: this.props.suppliers.supplierUpdateList,
    isLoading: true,
    selectedCard: "",
    showDetails: false,
    consumerIdentifier: null,
    payeeType: null,
    entityId: null,
    actionType: null,
    action: null,
    filters: {},
    error: false,
    variant: "error",
    needApproval: 0,
    selectedCardUserName: null,
    selectedUserCreatedAt: null,
    offset: 0,
    limit: 3
  };
  componentWillMount() {
    if (this.props.user && this.props.user.userData) {
      this.setState({ clientId: this.props.user.userData.portalProfileId });
    }
    const { supplierUpdateList } = this.props.suppliers;
    if (supplierUpdateList && supplierUpdateList.length > 0) {
      this.setState({
        isLoading: false,
        selectedCard: supplierUpdateList[0].consumerUpdatesId,
      });
      this.onClickHandler(
        supplierUpdateList[0].consumerIdentifier,
        supplierUpdateList[0].actionTypeId,
        supplierUpdateList[0].consumerUpdatesId,
        supplierUpdateList[0].userName,
        supplierUpdateList[0].createdAt,
        supplierUpdateList[0].payeeType,
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

  setLimitAndOffset = (offset, limit) => {
    this.setState({
      offset: offset,
      limit: limit
    }, () => {
      this.fetchClientSupplierUpdate()
    })
  }

  fetchClientSupplierUpdate = async (filters, flag) => {
    const { offset, limit } = this.state;
    const { userData } = this.props.user;
    const { supplierUpdateList } = this.props.suppliers;
    // const prevSelectedCardIndex = _.findIndex(
    //   supplierUpdateList,
    //   (supplierUpdateListItem) =>
    //     supplierUpdateListItem.consumerUpdatesId === this.state.selectedCard
    // );
    this.props.dispatch(getClientSupplierUpdateActionB2C(userData.portalProfileId, this.state.filters, offset, limit, false)).then((response) => {
      if (!response) {
        const { supplierUpdateError } = this.props.suppliers;
        this.setState({ isLoading: false, error: supplierUpdateError, variant: 'error' });
        return false;
      } else {
        const { supplierUpdateList, count } = this.props.suppliers;
        if (supplierUpdateList) {
          const dataIncludeCheck = supplierUpdateList.map((obj) => ({
            ...obj,
            checked: false,
          }))
          if (dataIncludeCheck.length > 0) {
            // const nextIndex = flag || dataIncludeCheck.length === 1 || prevSelectedCardIndex === -1 ? 0 : prevSelectedCardIndex === dataIncludeCheck.length ? prevSelectedCardIndex-1: prevSelectedCardIndex;
            this.onClickHandler(
              dataIncludeCheck[0].consumerIdentifier,
              dataIncludeCheck[0].actionTypeId,
              dataIncludeCheck[0].consumerUpdatesId,
              dataIncludeCheck[0].userName,
              dataIncludeCheck[0].createdAt,
              dataIncludeCheck[0].payeeType,
            );
            this.setState({
              selectedCard: dataIncludeCheck[0].consumerUpdatesId,
            });
          }
          this.props.dispatch(updateCount(count)).then(() => {
            this.setState({ isLoading: false });
          });
        } else {
          this.setState({ isLoading: false });
        }
      }
    })
  };

  onClickHandler = (
    consumerIdentifier,
    actionTypeId,
    consumerUpdatesId,
    userName,
    createdAt,
    payeeType,
  ) => {
    const previousSelectedCard = this.state.selectedCard;
    this.setState(
      {
        showDetails: true,
        consumerIdentifier: consumerIdentifier,
        actionTypeId: actionTypeId,
        selectedCard: consumerUpdatesId,
        selectedCardUserName: userName,
        selectedUserCreatedAt: createdAt,
        payeeType: payeeType,
      },
      () => {
        const { supplierUpdateList, count, unReadCount } = this.props.suppliers
        this.props.dispatch(updateCount(count));
        if (previousSelectedCard && (previousSelectedCard !== this.state.selectedCard)) {
          let newUnReadCount = unReadCount;
          const newSupplierUpdateList = supplierUpdateList.map((item) => {
            if (item.consumerUpdatesId === previousSelectedCard && !item.isRead) {
              item.isRead = 1;
              newUnReadCount = newUnReadCount - 1;
            }
            return item;
          })

          this.props.dispatch(updateUnreadCount(newSupplierUpdateList, newUnReadCount));
        }
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
      consumerIdentifier,
      payeeType,
      actionTypeId,
      isLoading,
      selectedCard,
      selectedCardUserName,
      selectedUserCreatedAt
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
        <B2CSupplierUpdateList
          clientId={clientId}
          onClickHandler={this.onClickHandler}
          selectedCard={selectedCard}
          isLoading={isLoading}
          fetchClientSupplierUpdate={this.fetchClientSupplierUpdate}
          onFiltersChange={this.onFiltersChange}
          setLimitAndOffset={this.setLimitAndOffset}
        />
        {showDetails && count > 0 && (
          <B2CSupplierUpdateDetails
            {...this.props}
            clientId={clientId}
            consumerIdentifier={consumerIdentifier}
            payeeType={payeeType}
            actionTypeId={actionTypeId}
            selectedCard={selectedCard}
            userName={selectedCardUserName}
            createdAt={selectedUserCreatedAt}
            isSupplierUpdateAcceptEnabled={isSupplierUpdateAcceptEnabled}
            fetchClientSupplierUpdate={this.fetchClientSupplierUpdate}
          />
        )}
        {isLoading && <Box className="loader-container">
          <CircularProgress color="primary" />
        </Box>}
      </Box>
    );
  }
}

export default connect((state) => ({
  ...state.user,
  ...state.suppliers
}))(B2CSupplierUpdates);
