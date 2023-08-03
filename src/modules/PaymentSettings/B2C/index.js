import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '~/components/Forms';
import Notification from '~/components/Notification';
import ImportParentPaymentDetails from '~/modules/ImportParentPaymentDetails';
import PaymentModeSelector from '~/modules/PaymentModeSelector';
import B2CPaymentDetails from '~/modules/PaymentDetails/B2C';
import { Box, CircularProgress } from '@material-ui/core';
import {
  getB2CClientPaymentTypes,
  getB2CPreferredClientPaymentTypes,
  getB2CPreferredParentPaymentTypes,
  updateB2CPreferredPaymentTypes,
  getZelleData,
  getPushToCardData
} from '~/redux/actions/B2C/payments';
import { fetchB2CClientData } from '~/redux/actions/B2C/client';
import ACHIcon from '~/assets/icons/ACH.svg';
import PushToCardIcon from '~/assets/icons/Push_to_Card.svg';
import PushToCard_selected from '~/assets/icons/PushToCard_selected.svg';
import ZelleIcon from '~/assets/icons/Zelle.svg';
import Zelle_selected from '~/assets/icons/Zelle_selected.svg';
import PaypalIcon from '~/assets/icons/PayPal.svg';
import ACH_selected from '~/assets/icons/ACH_selected.svg';
import CheckIcon from '~/assets/icons/check_icon.svg';
import Check_selected from '~/assets/icons/check_icon_selected.svg';
import Paypal_selected from '~/assets/icons/Paypal_selected.svg';
import config from '~/config';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';

const styles = () => ({
  submitBtn: {
    '&.Mui-disabled': {
      backgroundColor: 'rgba(0, 0, 0, 0.12) !important',
    },
  },
});

class B2CPaymentSettings extends Component {
  state = {
    isErrFound: false,
    isLoading: true,
    isHIPAA: false,
    paymentTypes: [],
    selectedPaymentTypes: [],
    processing: false,
    clientId: null,
    parentId: null,
    selectedTab: 0,
    currencyList: [],
    bankDetail: null,
    preBankDetail: {},
    eftDetail: null,
    preEFTDetail: {},
    virtualCardDetail: null,
    checkDetail: null,
    error: false,
    validation: {},
    importParentId: null,
    paymentModeIcons: {
      ACH: ACHIcon,
      ACH_selected: ACH_selected,
      CXC: ZelleIcon,
      CXC_selected: Zelle_selected,
      PPL: PaypalIcon,
      PPL_selected: Paypal_selected,
      CHK: CheckIcon,
      CHK_selected: Check_selected,
      MSC: PushToCardIcon,
      MSC_selected: PushToCard_selected,
    },
    showBanner: false,
    showParentData: false,
  };

  componentDidMount() {
    const { t } = this.props;
    this.props.changeActiveStep(1);
    const urlParams = new URLSearchParams(window.location.search);
    this.setState({ clientId: parseInt(urlParams.get('id')) });

    if (this.props.client.clientInfo.length > 0) {
      this.setState({
        parentId: this.props.client.clientInfo.rows[0].parentId,
        isHIPAA: this.props.client.clientInfo.rows[0].isHippa
          ? this.props.client.clientInfo.rows[0].isHippa
          : 0,
        showBanner:
          this.props.client.clientInfo.rows[0].parentId === null ||
            typeof this.props.client.clientInfo.rows[0].parentId === 'undefined'
            ? false
            : true,
      });
    } else {
      this.props
        .dispatch(fetchB2CClientData(parseInt(urlParams.get('id'))))
        .then((response) => {
          if (!response) {
            throw this.props.client.error;
          }
          const clientData =
            this.props.client.clientInfo.rows &&
            this.props.client.clientInfo.rows[0];
          this.setState({
            clientId: clientData.clientId,
            parentId: clientData.parentId,
            isHIPAA: clientData.isHippa ? clientData.isHippa : 0,
            showBanner:
              clientData.parentId === null ||
                typeof clientData.parentId === 'undefined'
                ? false
                : true,
            isLoading: false,
          });
          this.loadData(clientData.clientId);
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
            error:
              typeof error === 'string'
                ? error
                : t('componentData.paymentsSettings.unknownErr'),
          });
        });
    }
  }

  loadData = (clientId) => {
    this.fetchPaymentTypes(clientId, false);
    if (!this.props.getZelleData) {
      this.props.dispatch(getZelleData(clientId, false));
    }
    if (!this.props.getB2CPushCardData) {
      this.props.dispatch(getPushToCardData(clientId, false));
    }
  };

  fetchPaymentTypes = (id, isParentCall) => {
    const { dispatch } = this.props;
    dispatch(getB2CClientPaymentTypes()).then((response) => {
      if (!response) {
        return false;
      }

      const paymentTypes =
        response.rows &&
        response.rows.map(
          ({
            label,
            fileFormatId,
            paymentCode,
            description,
            customPaymentCode,
            b2cDescription
          }) => {
            return {
              label: paymentCode,
              key: fileFormatId,
              icon: fileFormatId,
              description: description,
              customPaymentCode: customPaymentCode,
              selected: false,
              alias: label,
              b2cDescription: b2cDescription
            };
          }
        );
      if (isParentCall) {
        this.fetchParentPaymentTypes(id);
      } else {
        this.fetchPreferredPaymentTypes(id);
      }
      this.setState({
        isLoading: false,
        paymentTypes,
      });
    });
  };

  fetchParentPaymentTypes = (id) => {
    this.props
      .dispatch(getB2CPreferredParentPaymentTypes(id))
      .then((response) => {
        if (!response) {
          return false;
        }
        const { rows: selectedTypes } = response;
        const selectedPayTypes =
          typeof selectedTypes !== 'undefined' && selectedTypes !== null
            ? selectedTypes
            : [];
        this.setState({
          selectedPaymentTypes: [...new Set(selectedPayTypes)],
        });
        const { paymentTypes } = this.state;
        this.setState({
          ...this.state,
          isLoading: false,
          paymentTypes: paymentTypes.map((paymentType) => ({
            ...paymentType,
            selected: Boolean(selectedPayTypes.includes(paymentType.key)),
          })),
        });
      });
  };

  fetchPreferredPaymentTypes = (clientId) => {
    this.props
      .dispatch(getB2CPreferredClientPaymentTypes(clientId))
      .then((response) => {
        if (!response) {
          return false;
        }
        const { rows: selectedTypes } = response;
        const selectedPayTypes =
          typeof selectedTypes !== 'undefined' && selectedTypes !== null
            ? selectedTypes
            : [];
        this.setState({
          selectedPaymentTypes: [...new Set(selectedPayTypes)],
        });
        const { paymentTypes } = this.state;
        this.setState({
          ...this.state,
          isLoading: false,
          paymentTypes: paymentTypes.map((paymentType) => ({
            ...paymentType,
            selected: Boolean(selectedPayTypes.includes(paymentType.key)),
          })),
        });
      });
  };

  handlePaymentModeChange = (e, index, isChecked) => {
    const { paymentTypes, selectedPaymentTypes } = this.state;
    this.setState({
      paymentTypes: paymentTypes.map((paymentMode, i) =>
        index === i
          ? {
            ...paymentMode,
            selected: isChecked,
          }
          : paymentMode
      ),
    });
    if (isChecked) {
      this.setState({
        selectedPaymentTypes: [
          ...selectedPaymentTypes,
          paymentTypes[index].key,
        ],
      });
    } else {
      const newState = selectedPaymentTypes.filter(
        (id) => id !== paymentTypes[index].key
      );
      this.setState({
        selectedPaymentTypes: newState || [],
      });
    }
  };
  isPaymentTypeSelected = (paymentTypeCode) => {
    const { paymentTypes, selectedPaymentTypes } = this.state;
    if (paymentTypes.length > 0) {
      const paymentTypeDetail = paymentTypes.filter(
        ({ label }) => label === paymentTypeCode
      );
      const currentPaymentTypeID =
        paymentTypeDetail.length && paymentTypeDetail[0].key;
      return selectedPaymentTypes.includes(currentPaymentTypeID);
    }
    return false;
  };
  importParentInformation = () => {
    const { parentId } = this.state;
    this.fetchPaymentTypes(parentId, true);
    this.setState({ showBanner: false, showParentData: true });
  };

  handlePaymentDetails = (e) => {
    this.setState(
      {
        processing: true,
      },
      () => {
        const { selectedPaymentTypes, clientId } = this.state;
        const { t } = this.props;
        if (selectedPaymentTypes.length > 0) {
          this.props
            .dispatch(
              updateB2CPreferredPaymentTypes({
                clientId: clientId,
                selectedPaymentTypes,
              })
            )
            .then((response) => {
              if (!response) {
                return false;
              }
              this.props.history.push(
                `${config.baseName}/onboard/files?id=${this.state.clientId}`
              );
              this.setState({
                processing: false,
              });
            });
        } else {
          this.setState({
            error: t('componentData.paymentsSettings.payMethod'),
            processing: false,
          });
        }
      }
    );
  };

  errFound = (val) => {
    const { isErrFound } = this.state;
    if (isErrFound != val) {
      this.setState({
        isErrFound: val,
      });
    }
  };

  render() {
    const {
      isLoading,
      error,
      paymentTypes,
      processing,
      paymentModeIcons,
      showBanner,
      clientId,
      parentId,
      isHIPAA,
      showParentData,
      isErrFound,
    } = this.state;
    const { t, classes } = this.props;
    const selectedPaymentModes = paymentTypes.filter(
      (paymentMode) => paymentMode.selected
    );
    if (isLoading) {
      return (
        <Box className="loader-container">
          <CircularProgress color="primary" />
        </Box>
      );
    }

    return (
      <>
        <Box my={2}>
          {showBanner && (
            <ImportParentPaymentDetails
              onConfirm={this.importParentInformation}
              onCancel={() => {
                this.setState({
                  showBanner: false,
                });
              }}
            />
          )}
          <Box mx={6} my={2}>
            <Box my={1}>
              <PaymentModeSelector
                paymentTypes={paymentTypes}
                onChange={this.handlePaymentModeChange}
                paymentModeIcons={paymentModeIcons}
              />
            </Box>
            <B2CPaymentDetails
              selectedPaymentModes={selectedPaymentModes}
              clientId={clientId}
              parentId={parentId}
              isHIPAA={isHIPAA}
              showParentData={showParentData}
              isErr={this.errFound}
            />
            <Box my={4} className={`button-container`}>
              {processing ? (
                <CircularProgress color="primary" />
              ) : (
                <Box mx={2}>
                  <Button
                    type="submit"
                    fullWidth={false}
                    variant="contained"
                    color="primary"
                    onClick={this.handlePaymentDetails}
                    disabled={isErrFound === 'error' ? true : false}
                    className={classes.submitBtn}
                  >
                    {t('componentData.paymentsSettings.Next')}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {error && (
          <Notification
            variant="error"
            message={error}
            handleClose={() => {
              this.setState({ error: false });
            }}
          />
        )}
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({ ...state.payment, ...state.client }))(
    withStyles(styles)(B2CPaymentSettings)
  )
);
