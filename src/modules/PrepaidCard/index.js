import React, { Component } from 'react';
import { RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { paymentMethodsCode } from '~/config/paymentMethods';
import { withTranslation } from 'react-i18next';
import styles from './styles';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { fetchUSBankPrepaidCardData } from '~/redux/actions/USbank/payments';
import FocusNonPayroll from './focusNonPayroll';
import ReliaCard from './reliaCard';
import CorporateRewardCard from './corporateRewardCard';

class USBankPrepaidCard extends Component {
  state = {
    prepaidCardType: [paymentMethodsCode.PrepaidFocusNonPayroll],
  };

  componentDidMount = () => {
    this.getPrepaidCardAPIData();
  };

  getPrepaidCardAPIData = () => {
    const clientId = this.props.clientId || null;
    let Id = clientId;
    let showParentData = false
    if (this.props.showParentData && this.props.parentId) {
      Id = this.props.parentId;
      showParentData=true
    }
    this.props.dispatch(fetchUSBankPrepaidCardData(Id,showParentData)).then((response) => {
      if (response && response.error) {
        const errorMsg =
          this.props.USBankPayment.storedPrepaidCardData &&
          this.props.USBankPayment.storedPrepaidCardData.error
            ? this.props.USBankPayment.storedPrepaidCardData.error
            : null;
        this.props.setVariant('error');
        this.props.setErrorText(errorMsg);
        return false;
      } else {
        this.setAPIDataInState();
      }
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
    }
  };

  handleRadioButton = ({ target }) => {
    const { value } = target;
    this.setState({
      prepaidCardType: [parseInt(value)],
    });
  };

  renderPrepaidCardForms = () => {
    const {
      showParentData,
      parentId,
      setErrorText,
      setVariant,
      clientId,
      handleCollapse,
      paymentType,
    } = this.props;
    switch (this.state.prepaidCardType[0]) {
      case paymentMethodsCode.PrepaidFocusNonPayroll:
        return (
          <FocusNonPayroll
            showParentInfo={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            clientId={clientId}
            handleCollapse={handleCollapse}
            paymentType={paymentType}
            b2cPaymentTypesList={this.props.payment?.types?.rows}
            parentId={parentId}
            currencyList={this.props.currencyCodes}
          />
        );
      case paymentMethodsCode.PrepaidReliaCard:
        return (
          <ReliaCard
            showParentInfo={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            clientId={clientId}
            handleCollapse={handleCollapse}
            paymentType={paymentType}
            b2cPaymentTypesList={this.props.payment?.types?.rows}
            parentId={parentId}
            currencyList={this.props.currencyCodes}
          />
        );
      case paymentMethodsCode.PrepaidCorporateReward:
        return (
          <CorporateRewardCard
            showParentInfo={showParentData}
            setErrorText={setErrorText}
            setVariant={setVariant}
            clientId={clientId}
            handleCollapse={handleCollapse}
            paymentType={paymentType}
            b2cPaymentTypesList={this.props.payment?.types?.rows}
            parentId={parentId}
          />
        );
      default:
        return (<></>
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
          value={prepaidCardType[0]}
          row
          style={{ marginBottom: '8px' }}
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
        {this.state.prepaidCardType?.length && this.renderPrepaidCardForms()}
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({
    ...state.payment,
    ...state.USBankPayment,
  }))(withStyles(styles)(USBankPrepaidCard))
);
