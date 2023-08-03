import React, { Component } from 'react';
import styles from './styles.js';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import {
  Box,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  CircularProgress,
} from '@material-ui/core';
import TextField from '~/components/Forms/TextField';
import 'react-notifications/lib/notifications.css';
import { paymentMethodsCode } from '~/config/paymentMethods';
import {
  createUsBankCorporateCard,
  updateUsBankCorporateCard,
  fetchUSBankPrepaidCardData,
} from '~/redux/actions/USbank/payments';

class CorporateRewardCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveProcessing: false,
      selectedCardTypes: [],
      corporateRewardTypes: [],
      corporateRewardTypesIds: [],
      plasticCorporateCard: {
        paymentTypeId: '',
        plasticFundingCardID: '',
        plasticFundingCardPassCode: '',
        id: '',
      },
      digitalCorporateCard: {
        paymentTypeId: '',
        digitalFundingCardID: '',
        digitalFundingCardPassCode: '',
        id: '',
      },
      transId: '',
      error: {
        transId: '',
        plasticFundingCardID: '',
        plasticFundingCardPassCode: '',
        digitalFundingCardID: '',
        digitalFundingCardPassCode: '',
      },
    };
  }

  componentDidMount = () => {
    this.getCorporateRewardCardData();
    const { b2cPaymentTypesList } = this.props;
    if (b2cPaymentTypesList) {
      const corporateRewardCardItem = b2cPaymentTypesList.filter(
        (item) => item.parentId === paymentMethodsCode.PrepaidCorporateReward
      );
      if (corporateRewardCardItem?.length) {
        const subTypes = [],
          subTypeIds = [];
        corporateRewardCardItem.forEach((item) => {
          subTypes.push(item.paymentTypeId);
          subTypeIds.push(item.paymentTypeId);
        });
        this.setState({
          corporateRewardTypes: corporateRewardCardItem,
          selectedCardTypes: subTypes,
          corporateRewardTypesIds: subTypeIds,
          transId: corporateRewardCardItem[0].transId,
        });
      }
    }
  };

  getCorporateRewardCardData = () => {
    const clientId = this.props.clientId || null;
    let Id = clientId;
    if (this.props.showParentInfo && this.props.parentId) {
      Id = this.props.parentId;
    }
    this.props.dispatch(fetchUSBankPrepaidCardData(Id)).then((response) => {
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
      this.props.USBankPayment.storedPrepaidCardData.data?.corporateCardData
        ?.length
    ) {
      const prePaidCardData =
        this.props.USBankPayment.storedPrepaidCardData.data;
      if (prePaidCardData.prepaidCardData?.length) {
        let selectedSubTypes = [];
        prePaidCardData.prepaidCardData.forEach((item) => {
          selectedSubTypes.push(item.paymentTypeId);
        });
        this.setState({
          selectedCardTypes: selectedSubTypes,
        });
        const selectedIDs = this.state.corporateRewardTypesIds.map((item) => {
          return prePaidCardData.prepaidCardData.find((elem) => {
            return elem.paymentTypeId === item;
          })?.paymentTypeId;
        });
        if (selectedIDs?.length) {
          let finalCardDetails = prePaidCardData.corporateCardData;
          const plasticCorporateCardData = finalCardDetails.filter(
            (data) =>
              data.paymentTypeId === paymentMethodsCode.PlasticCorporateCard
          );
          if (plasticCorporateCardData?.length) {
            this.setState({
              plasticCorporateCard: {
                id: this.props.showParentInfo
                  ? ''
                  : plasticCorporateCardData[0].id,
                plasticFundingCardID: plasticCorporateCardData[0].fundingCardId,
                plasticFundingCardPassCode:
                  plasticCorporateCardData[0].fundingCardPasscode,
              },
            });
          }
          const digitalCorporateCardData = finalCardDetails.filter(
            (data) =>
              data.paymentTypeId === paymentMethodsCode.DigitalCorporateCard
          );
          if (digitalCorporateCardData?.length) {
            this.setState({
              digitalCorporateCard: {
                id: this.props.showParentInfo
                  ? ''
                  : digitalCorporateCardData[0].id,
                digitalFundingCardID: digitalCorporateCardData[0].fundingCardId,
                digitalFundingCardPassCode:
                  digitalCorporateCardData[0].fundingCardPasscode,
              },
            });
          }
        }
      }
    }
  };

  handleIntegerValueChange = (event, type) => {
    const { name, value } = event.target;
    if (type === 'plastic') {
      this.setState({
        plasticCorporateCard: {
          ...this.state.plasticCorporateCard,
          [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
        },
      });
    } else if (type === 'digital') {
      this.setState({
        digitalCorporateCard: {
          ...this.state.digitalCorporateCard,
          [name]: value === '' ? null : value.replace(/[^0-9]/g, ''),
        },
      });
    }
  };

  handleBlur = (event, type) => {
    const { name, value } = event.target;
    if (type === 'plastic') {
      this.setState({
        plasticCorporateCard: {
          ...this.state.plasticCorporateCard,
          [name]: value === '' ? null : value.trim(),
        },
      });
    } else if (type === 'digital') {
      this.setState({
        digitalCorporateCard: {
          ...this.state.digitalCorporateCard,
          [name]: value === '' ? null : value.trim(),
        },
      });
    }
  };

  handleCheckbox = ({ target }) => {
    const { value } = target;
    const tempSelectedCardTypes = [...this.state.selectedCardTypes];
    const valueIndex = this.state.selectedCardTypes.indexOf(
      value ? parseInt(value) : value
    );
    if (valueIndex > -1) {
      tempSelectedCardTypes.splice(valueIndex, 1);
    } else {
      tempSelectedCardTypes.push(value ? parseInt(value) : value);
    }
    this.setState({
      selectedCardTypes: tempSelectedCardTypes,
    });
  };

  validation = () => {
    let valid = true;
    const { t } = this.props;
    let validation = {};
    const {
      transId,
      plasticCorporateCard,
      digitalCorporateCard,
      selectedCardTypes,
    } = this.state;
    const isPlasticSelected = selectedCardTypes.includes(
      paymentMethodsCode.PlasticCorporateCard
    );
    const isDigitalSelected = selectedCardTypes.includes(
      paymentMethodsCode.DigitalCorporateCard
    );
    const { plasticFundingCardID, plasticFundingCardPassCode } =
      plasticCorporateCard;
    const { digitalFundingCardID, digitalFundingCardPassCode } =
      digitalCorporateCard;
    if (!transId || (transId && transId.length === 0)) {
      validation['transId'] = t(
        'componentData.USBankPrepaidCardError.transIdReq'
      );
      valid = false;
    }
    if (isPlasticSelected) {
      if (
        !plasticFundingCardID ||
        (plasticFundingCardID && plasticFundingCardID.length === 0)
      ) {
        validation['plasticFundingCardID'] = t(
          'componentData.USBankPrepaidCardError.plasticFundingCardIDReq'
        );
        valid = false;
      } else if (plasticFundingCardID && plasticFundingCardID.length !== 10) {
        validation['plasticFundingCardID'] = t(
          'componentData.USBankPrepaidCardError.plasticFundingCardIDLength'
        );
        valid = false;
      }

      if (
        !plasticFundingCardPassCode ||
        (plasticFundingCardPassCode && plasticFundingCardPassCode.length === 0)
      ) {
        validation['plasticFundingCardPassCode'] = t(
          'componentData.USBankPrepaidCardError.plasticFundingCardPassCodeReq'
        );
        valid = false;
      } else if (
        plasticFundingCardPassCode &&
        plasticFundingCardPassCode.length !== 4
      ) {
        validation['plasticFundingCardPassCode'] = t(
          'componentData.USBankPrepaidCardError.plasticFundingCardPassCodeLength'
        );
        valid = false;
      }
    }

    if (isDigitalSelected) {
      if (
        !digitalFundingCardID ||
        (digitalFundingCardID && digitalFundingCardID.length === 0)
      ) {
        validation['digitalFundingCardID'] = t(
          'componentData.USBankPrepaidCardError.digitalFundingCardIDReq'
        );
        valid = false;
      } else if (digitalFundingCardID && digitalFundingCardID.length !== 10) {
        validation['digitalFundingCardID'] = t(
          'componentData.USBankPrepaidCardError.digitalFundingCardIDLength'
        );
        valid = false;
      }

      if (
        !digitalFundingCardPassCode ||
        (digitalFundingCardPassCode && digitalFundingCardPassCode.length === 0)
      ) {
        validation['digitalFundingCardPassCode'] = t(
          'componentData.USBankPrepaidCardError.digitalFundingCardPassCodeReq'
        );
        valid = false;
      } else if (
        digitalFundingCardPassCode &&
        digitalFundingCardPassCode.length !== 4
      ) {
        validation['digitalFundingCardPassCode'] = t(
          'componentData.USBankPrepaidCardError.digitalFundingCardPassCodeLength'
        );
        valid = false;
      }
    }

    this.setState({
      error: { ...validation },
    });
    return valid;
  };

  renderNotification = (type) => {
    if (type) {
      this.props.setVariant('error');
      this.props.setErrorText(
        this.props.USBankPayment.usBankCorporateCard?.error ??
          this.props.t('componentData.reduxData.SomethingWentWrong')
      );
    } else {
      this.props.setVariant('success');
      this.props.setErrorText(
        this.props.USBankPayment.usBankCorporateCard?.data?.message
      );
    }
  };

  onSubmit = () => {
    const valid = this.validation();
    const tempProps = this.props;
    this.setState({
      saveProcessing: false,
    });
    if (valid) {
      const clientId = this.props.clientId || null;
      const {
        selectedCardTypes,
        transId,
        corporateRewardTypes,
        plasticCorporateCard,
        digitalCorporateCard,
      } = this.state;
      if (
        !tempProps.USBankPayment.storedPrepaidCardData?.data?.corporateCardData
          ?.length
      ) {
        let finalData = [];
        selectedCardTypes.forEach((selectedCard) => {
          const cardTypeId = corporateRewardTypes.filter(
            (item) => item.paymentTypeId === selectedCard
          )?.[0]?.paymentTypeId;
          let tempObj = {
            paymentTypeId: cardTypeId,
            transId: transId,
            fundingCardId:
              selectedCard === paymentMethodsCode.PlasticCorporateCard
                ? plasticCorporateCard.plasticFundingCardID
                : digitalCorporateCard.digitalFundingCardID,
            fundingCardPasscode:
              selectedCard === paymentMethodsCode.PlasticCorporateCard
                ? plasticCorporateCard.plasticFundingCardPassCode
                : digitalCorporateCard.digitalFundingCardPassCode,
          };
          finalData.push(tempObj);
        });
        tempProps
          .dispatch(
            createUsBankCorporateCard(
              { corporateRewardCardData: finalData },
              clientId
            )
          )
          .then((response) => {
            if (response && !response.error) {
              this.setState({
                saveProcessing: false,
              });
              this.getCorporateRewardCardData();
              this.renderNotification();
              tempProps.handleCollapse(tempProps.paymentType);
            } else {
              this.renderNotification('error');
              this.setState({
                saveProcessing: false,
              });
              return false;
            }
          });
      } else {
        let finalData = [];
        selectedCardTypes.forEach((selectedCard) => {
          const cardTypeId = corporateRewardTypes.filter(
            (item) => item.paymentTypeId === selectedCard
          )?.[0]?.paymentTypeId;
          if (cardTypeId === paymentMethodsCode.PlasticCorporateCard) {
            let obj = {
              paymentTypeId: cardTypeId,
              transId: transId,
              fundingCardId: plasticCorporateCard.plasticFundingCardID,
              fundingCardPasscode:
                plasticCorporateCard.plasticFundingCardPassCode,
            };
            finalData.push(obj);
          } else if (cardTypeId === paymentMethodsCode.DigitalCorporateCard) {
            let obj = {
              paymentTypeId: cardTypeId,
              transId: transId,
              fundingCardId: digitalCorporateCard.digitalFundingCardID,
              fundingCardPasscode:
                digitalCorporateCard.digitalFundingCardPassCode,
            };
            finalData.push(obj);
          }
        });
        tempProps
          .dispatch(
            updateUsBankCorporateCard(
              { corporateRewardCardData: finalData },
              clientId
            )
          )
          .then((response) => {
            if (response && !response.error) {
              this.setState({
                saveProcessing: false,
              });
              this.renderNotification();
              tempProps.handleCollapse(tempProps.paymentType);
            } else {
              this.renderNotification('error');
              this.setState({
                saveProcessing: false,
              });
              return false;
            }
          });
      }
    }
  };

  render() {
    const { classes, t } = this.props;
    const {
      corporateRewardTypes,
      selectedCardTypes,
      saveProcessing,
      error,
      plasticCorporateCard,
      digitalCorporateCard,
      transId,
    } = this.state;
    return (
      <Box>
        <Grid container>
          <>
            <Grid container item>
              {corporateRewardTypes?.map((elem) => {
                return (
                  <Grid item xs={4} sm={4}>
                    <Box my={2}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedCardTypes.includes(
                              elem.paymentTypeId
                            )}
                            color='primary'
                            onChange={this.handleCheckbox}
                            name={elem.b2cDescription}
                            value={elem.paymentTypeId}
                          />
                        }
                        label={elem.b2cDescription}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            <Grid container item>
              {selectedCardTypes?.length ? (
                <Grid item xs={12} sm={12}>
                  <Grid container item>
                    <Grid item xs={12} sm={6}>
                      <Box mx={1} my={2}>
                        <TextField
                          color='primary'
                          inputProps={{
                            maxLength: 10,
                            minLength: 1,
                          }}
                          label={t('componentData.USBankPrepaidCard.transId')}
                          required
                          placeholder={t(
                            'componentData.USBankPrepaidCard.transId'
                          )}
                          error={Boolean(error.transId)}
                          helperText={error.transId}
                          fullWidth={true}
                          autoComplete='off'
                          variant='outlined'
                          value={transId}
                          name='transId'
                          disabled
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
              {selectedCardTypes.includes(
                paymentMethodsCode.PlasticCorporateCard
              ) && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Box mx={1} my={2}>
                      <TextField
                        color='primary'
                        inputProps={{
                          maxLength: 10,
                          minLength: 1,
                        }}
                        required
                        label={t(
                          'componentData.USBankPrepaidCard.plasticFundingCardID'
                        )}
                        placeholder={t(
                          'componentData.USBankPrepaidCard.plasticFundingCardID'
                        )}
                        error={Boolean(error.plasticFundingCardID)}
                        helperText={error.plasticFundingCardID}
                        fullWidth={true}
                        autoComplete='off'
                        variant='outlined'
                        value={plasticCorporateCard.plasticFundingCardID}
                        name='plasticFundingCardID'
                        onChange={(e) =>
                          this.handleIntegerValueChange(e, 'plastic')
                        }
                        onBlur={(e) => this.handleBlur(e, 'plastic')}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box mx={1} my={2}>
                      <TextField
                        color='primary'
                        inputProps={{
                          maxLength: 4,
                          minLength: 1,
                        }}
                        required
                        label={t(
                          'componentData.USBankPrepaidCard.plasticFundingCardPassCode'
                        )}
                        placeholder={t(
                          'componentData.USBankPrepaidCard.plasticFundingCardPassCode'
                        )}
                        error={Boolean(error.plasticFundingCardPassCode)}
                        helperText={error.plasticFundingCardPassCode}
                        fullWidth={true}
                        autoComplete='off'
                        variant='outlined'
                        value={plasticCorporateCard.plasticFundingCardPassCode}
                        name='plasticFundingCardPassCode'
                        onChange={(e) =>
                          this.handleIntegerValueChange(e, 'plastic')
                        }
                        onBlur={(e) => this.handleBlur(e, 'plastic')}
                      />
                    </Box>
                  </Grid>
                </>
              )}
              {selectedCardTypes.includes(
                paymentMethodsCode.DigitalCorporateCard
              ) && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Box mx={1} my={2}>
                      <TextField
                        color='primary'
                        inputProps={{
                          maxLength: 10,
                          minLength: 1,
                        }}
                        required
                        label={t(
                          'componentData.USBankPrepaidCard.digitalFundingCardID'
                        )}
                        placeholder={t(
                          'componentData.USBankPrepaidCard.digitalFundingCardID'
                        )}
                        error={Boolean(error.digitalFundingCardID)}
                        helperText={error.digitalFundingCardID}
                        fullWidth={true}
                        autoComplete='off'
                        variant='outlined'
                        value={digitalCorporateCard.digitalFundingCardID}
                        name='digitalFundingCardID'
                        onChange={(e) =>
                          this.handleIntegerValueChange(e, 'digital')
                        }
                        onBlur={(e) => this.handleBlur(e, 'digital')}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box mx={1} my={2}>
                      <TextField
                        color='primary'
                        inputProps={{
                          maxLength: 4,
                          minLength: 1,
                        }}
                        required
                        label={t(
                          'componentData.USBankPrepaidCard.digitalFundingCardPassCode'
                        )}
                        placeholder={t(
                          'componentData.USBankPrepaidCard.digitalFundingCardPassCode'
                        )}
                        error={Boolean(error.digitalFundingCardPassCode)}
                        helperText={error.digitalFundingCardPassCode}
                        fullWidth={true}
                        autoComplete='off'
                        variant='outlined'
                        value={digitalCorporateCard.digitalFundingCardPassCode}
                        name='digitalFundingCardPassCode'
                        onChange={(e) =>
                          this.handleIntegerValueChange(e, 'digital')
                        }
                        onBlur={(e) => this.handleBlur(e, 'digital')}
                      />
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
            {selectedCardTypes?.length ? (
              <Grid container item xs={12} justifyContent='center'>
                {saveProcessing ? (
                  <CircularProgress color='primary' />
                ) : (
                  <Button
                    className={classes.button}
                    variant='contained'
                    color='primary'
                    onClick={() => this.onSubmit()}
                    style={{ color: 'white' }}
                  >
                    {t('componentData.USBankPrepaidCard.save')}
                  </Button>
                )}
              </Grid>
            ) : null}
          </>
        </Grid>
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.USBankPayment,
  }))(withStyles(styles)(CorporateRewardCard))
);
