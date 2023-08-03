import React, { Component } from "react";
import SupplierUpdateListBestBuy from "~/modules/SupplierUpdateListBestBuy";
import SupplierUpdateDetailsBestBuy from "~/modules/SupplierUpdateDetailsBestBuy";
import { Box } from "@material-ui/core";
import { connect } from "react-redux";
import { accessRights } from "~/config/accessRights";
import _ from "lodash";
import Notification from "~/components/Notification";
import { getClientSupplierUpdateBestBuyAction, updateBestCount } from "~/redux/actions/suppliers";
class SupplierUpdates extends Component {
  state = {
    processing: false,
    count: this.props.suppliers.bestBuyCount || 0,
    clientId: null,
    bestBuySupplierUpdateList: this.props.suppliers.bestBuySupplierUpdateList,
    isLoading: true,
    selectedCard: "",
    canAcceptReject: false,
    showDetails: false,
    payeeId: null,
    payerReviewUpdateId: null,
    subjectType: null,
    action: null,
    filters: {},
    error: false,
    variant: "error",
    bestBuySupplier: null
  };
  componentWillMount() {
    if (this.props.user && this.props.user.userData) {
      this.setState({ clientId: this.props.user.userData.portalProfileId });
    }
    const { bestBuySupplierUpdateList } = this.props.suppliers;
    if (bestBuySupplierUpdateList && bestBuySupplierUpdateList.length > 0) {
      this.setState({
        isLoading: false,
        selectedCard: bestBuySupplierUpdateList[0].payerReviewUpdateId,
      }, () => {
        this.onClickHandler(
          bestBuySupplierUpdateList[0].payeeId,
          bestBuySupplierUpdateList[0].payerReviewUpdateId,
          bestBuySupplierUpdateList[0].subjectType,
          bestBuySupplierUpdateList[0].action,
        );
      });
      
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



  fetchClientSupplierUpdateBestBuy = async (filters, flag) => {
    const { bestBuySupplierUpdateList } = this.props.suppliers;
    const { userData } = this.props.user;
    const prevSelectedCardIndex = _.findIndex(
      bestBuySupplierUpdateList,
      (supplierUpdateListItem) =>
        supplierUpdateListItem.payerReviewUpdateId === this.state.selectedCard
    );

    this.props.dispatch(getClientSupplierUpdateBestBuyAction(userData.portalProfileId, this.state.filters)).then((response) => {
      if (!response) {
        const { bestBuyError } = this.props.suppliers;
        this.setState({ isLoading: false, error: bestBuyError, variant: 'error' });
        return false;
      } else {
        const { bestBuySupplierUpdateList } = this.props.suppliers;
        if (bestBuySupplierUpdateList) {
          const dataIncludeCheck = bestBuySupplierUpdateList.map((obj) => ({
            ...obj,
            checked: false,
          }))
          if (dataIncludeCheck.length > 0) {
            const nextIndex = flag || dataIncludeCheck.length === 1 || prevSelectedCardIndex === -1 ? 0 : prevSelectedCardIndex === dataIncludeCheck.length ? prevSelectedCardIndex - 1 : prevSelectedCardIndex;
            this.onClickHandler(
              dataIncludeCheck[nextIndex].payeeId,
              dataIncludeCheck[nextIndex].payerReviewUpdateId,
              dataIncludeCheck[nextIndex].subjectType,
              dataIncludeCheck[nextIndex].action,
            );
            this.setState({
              selectedCard: dataIncludeCheck[nextIndex].payerReviewUpdateId,
            });
          }
          this.props.dispatch(updateBestCount(bestBuySupplierUpdateList.length)).then(() => {
            this.setState({ isLoading: false });
          });
        } else {
          this.setState({ isLoading: false });
        }
      }
    })
  }

  onClickHandler = (
    payeeId,
    payerReviewUpdateId,
    subjectType,
    action
  ) => {
    const { bestBuySupplierUpdateList } = this.props.suppliers;
    const supplier = bestBuySupplierUpdateList && bestBuySupplierUpdateList.filter((supplier) => supplier.payerReviewUpdateId === payerReviewUpdateId)[0];
    this.setState(
      {
        showDetails: true,
        payeeId: payeeId,
        payerReviewUpdateId: payerReviewUpdateId,
        subjectType: subjectType,
        action: action,
        selectedCard: payerReviewUpdateId,
        bestBuySupplier: supplier
      },
      () => {
        const { bestBuySupplierUpdateList } = this.props.suppliers;
        this.props.dispatch(updateBestCount(bestBuySupplierUpdateList.length));
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
      clientId, showDetails, payeeId, canAcceptReject, payerReviewUpdateId, subjectType, action, isLoading, selectedCard, error, variant,
      bestBuySupplier
    } = this.state;
    const { user } = this.props;
    const { bestBuyCount} = this.props.suppliers;
    const isSupplierUpdateAcceptEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_SUPPLIER_UPDATES_ACCEPT"]
        )) ||
      false;

    return (
      <Box display="flex">
        <SupplierUpdateListBestBuy
          clientId={clientId}
          onClickHandler={this.onClickHandler}
          selectedCard={selectedCard}
          isLoading={isLoading}
          fetchClientSupplierUpdate={this.fetchClientSupplierUpdateBestBuy}
          onFiltersChange={this.onFiltersChange}
        />
        {showDetails && bestBuyCount > 0 && (
          <SupplierUpdateDetailsBestBuy
            {...this.props}
            clientId={clientId}
            payeeId={payeeId}
            canAcceptReject={canAcceptReject}
            entityId={payerReviewUpdateId}
            actionType={subjectType}
            action={action}
            selectedCard={selectedCard}
            isSupplierUpdateAcceptEnabled={isSupplierUpdateAcceptEnabled}
            fetchClientSupplierUpdate={this.fetchClientSupplierUpdateBestBuy}
            bestBuySupplier={bestBuySupplier}
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