import React, { Component } from 'react';
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Box,
} from '@material-ui/core';
import { paymentMethodsCode } from '~/config/paymentMethods';
import { withTranslation } from 'react-i18next';
import styles from './styles';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { fetchUSBankPrepaidCardData, fetchReliaFocusCardParams } from '~/redux/actions/USbank/payments';
import FocusNonPayroll from './focusNonPayroll';
import ReliaCard from './reliaCard';
import CorporateRewardCard from './corporateRewardCard';

class USBankPrepaidCard extends Component {
  state = {
    prepaidCardType: [],
    isLoading: false,
  };

  componentDidMount = () => {
    this.getPrepaidCardAPIData();
    this.props.dispatch(fetchReliaFocusCardParams());
  };

  getPrepaidCardAPIData = () => {
    const clientId = this.props.user.userData.portalProfileId || null;
    this.setState({
      isLoading: true,
    });
    this.props
      .dispatch(fetchUSBankPrepaidCardData(clientId))
      .then((response) => {
        if (response && response.error) {
          const errorMsg =
            this.props.USBankPayment.storedPrepaidCardData &&
            this.props.USBankPayment.storedPrepaidCardData.error
              ? this.props.USBankPayment.storedPrepaidCardData.error
              : null;
          this.props.setVariant('error');
          this.props.setErrorText(errorMsg);
          this.setState({
            isLoading: false,
          });
          return false;
        } else {
          this.setAPIDataInState();
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  setAPIDataInState = () => {
    if (
      this.props.USBankPayment.storedPrepaidCardData?.data &&
      !this.props.USBankPayment.storedPrepaidCardData.data.nodata
    ) {
      const prePaidCardData =
        this.props.USBankPayment.storedPrepaidCardData.data;
      if (prePaidCardData?.prepaidCardData?.length) {
        const selectedPrepaidCardType = prePaidCardData.prepaidCardData.map(
          (elem) => elem.paymentTypeId
        );
        if (
          selectedPrepaidCardType?.includes(
            paymentMethodsCode.PlasticCorporateCard
          ) ||
          selectedPrepaidCardType?.includes(
            paymentMethodsCode.DigitalCorporateCard
          )
        ) {
          this.setState({
            prepaidCardType: [paymentMethodsCode.PrepaidCorporateReward],
          });
        } else {
          this.setState({
            prepaidCardType: selectedPrepaidCardType,
          });
        }
      }
    } else {
      this.setState({
        prepaidCardType: [paymentMethodsCode.PrepaidFocusNonPayroll],
      });
    }
  };

  handleRadioButton = ({ target }) => {
    const { value } = target;
    this.setState({
      prepaidCardType: [parseInt(value)],
    });
  };

  renderPrepaidCardForms = () => {
    const { paymentType, notification, closeModal, onCancel, isAddAccount,currencyCodes } =
      this.props;
    switch (this.state.prepaidCardType[0]) {
      case paymentMethodsCode.PrepaidFocusNonPayroll:
        return (
          <FocusNonPayroll
            notification={notification}
            clientId={this.props.user.userData.portalProfileId}
            paymentType={paymentType}
            b2cPaymentTypesList={this.props.payment?.types?.rows}
            closeModal={closeModal}
            onCancel={onCancel}
            isAddAccount={isAddAccount}
            currencyList={currencyCodes}
          />
        );
      case paymentMethodsCode.PrepaidReliaCard:
        return (
          <ReliaCard
            notification={notification}
            clientId={this.props.user.userData.portalProfileId}
            paymentType={paymentType}
            b2cPaymentTypesList={this.props.payment?.types?.rows}
            closeModal={closeModal}
            onCancel={onCancel}
            isAddAccount={isAddAccount}
            currencyList={currencyCodes}
          />
        );
      case paymentMethodsCode.PrepaidCorporateReward:
        return (
          <CorporateRewardCard
            notification={notification}
            clientId={this.props.user.userData.portalProfileId}
            paymentType={paymentType}
            b2cPaymentTypesList={this.props.payment?.types?.rows}
            closeModal={closeModal}
            onCancel={onCancel}
            isAddAccount={isAddAccount}
          />
        );
      default:
        return (
          <></>
        );
    }
  };

  render() {
    const { prepaidCardType } = this.state;
    const { payment } = this.props;
    return (
      <>
        <RadioGroup
          name='prepaidCardTypes'
          value={prepaidCardType?.length ? prepaidCardType[0] : ''}
          row
          style={{ marginBottom: '8px', paddingLeft: '10px' }}
          onChange={(e) => this.handleRadioButton(e)}
        >
          {payment?.types?.rows?.map((elem) => {
            if (elem.parentId === paymentMethodsCode.USBankPrepaidCard)
              return (
                <FormControlLabel
                  key={elem.paymentTypeId}
                  value={elem.paymentTypeId}
                  control={<Radio color='primary' />}
                  label={elem.description}
                />
              );
            else return null;
          })}
        </RadioGroup>
        {this.state.prepaidCardType?.length ? (
          this.renderPrepaidCardForms()
        ) : this.state.isLoading ? (
          <Box
            display={'flex'}
            style={{ width: '100%' }}
            justifyContent='center'
          >
            <CircularProgress color='primary' />
          </Box>
        ) : null}
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.payment,
    ...state.USBankPayment,
    ...state.user,
  }))(withStyles(styles)(USBankPrepaidCard))
);
