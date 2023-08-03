import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "~/components/Forms";
import Notification from "~/components/Notification";
import ConfirmModal from './ConfirmModal';
import { SimpleCustomDialog } from "~/components/Dialogs";

import ImportParentPaymentDetails from "~/modules/ImportParentPaymentDetails";

import PaymentModeSelector from "~/modules/PaymentModeSelector";
import PaymentDetails from "~/modules/PaymentDetails";
import { Box, CircularProgress } from "@material-ui/core";

import {
  getClientPaymentTypes,
  getPreferredClientPaymentTypes,
  getPreferredParentPaymentTypes,
  updatePreferredPaymentTypes,
  updateFormValues,
  updateMasterCardInfo,
  createMasterCardInfo,
  savePaymentCardtype,
  getMasterCardInfo
} from "~/redux/actions/payments";
import { fetchClientData } from "~/redux/actions/client";

import ACH from "~/assets/icons/ACH_main.svg";
import ACH_selected from "~/assets/icons/ACH_selected.svg";
import VCA from "~/assets/icons/VCA_main.svg";
import VCA_selected from "~/assets/icons/VCA_selected.svg";
import CHK from "~/assets/icons/CHK_main.svg";
import CHK_selected from "~/assets/icons/CHK_selected.svg";
import EFT from "~/assets/icons/EFT_main.svg";
import EFT_selected from "~/assets/icons/EFT_selected.svg";

import config from "~/config";
import { withTranslation } from "react-i18next";
import { CardType, PayerTypes } from "~/config/entityTypes";

class PaymentSettings extends Component {
  state = {
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
    errorVariant: "error",
    validation: {},
    importParentId: null,
    paymentModeIcons: {
      ACH: ACH,
      ACH_selected: ACH_selected,
      EFT: EFT,
      EFT_selected: EFT_selected,
      VCA: VCA,
      VCA_selected: VCA_selected,
      CHK: CHK,
      CHK_selected: CHK_selected,
    },
    showBanner: false,
    showParentData: false,
    payerTypeId: null,
    isOpen: false,
  };

  componentDidMount() {
    const { t } = this.props;
    this.props.changeActiveStep(1);
    const urlParams = new URLSearchParams(window.location.search);
    this.setState({ clientId: parseInt(urlParams.get("id")) });

    if (this.props.client.clientInfo.length > 0) {
      this.setState({
        parentId: this.props.client.clientInfo.rows[0].parentId,
        isHIPAA: this.props.client.clientInfo.rows[0].isHippa
          ? this.props.client.clientInfo.rows[0].isHippa
          : 0,
        payerTypeId: this.props.client.clientInfo.rows[0].payerTypeId,
        showBanner:
          this.props.client.clientInfo.rows[0].parentId === null ||
            typeof this.props.client.clientInfo.rows[0].parentId === "undefined"
            ? false
            : true,
      });
    } else {
      this.props
        .dispatch(fetchClientData(parseInt(urlParams.get("id"))))
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
            payerTypeId: clientData.payerTypeId,
            showBanner:
              clientData.parentId === null ||
                typeof clientData.parentId === "undefined"
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
              typeof error === "string"
                ? error
                : t("componentData.paymentsSettings.unknownErr"),
            errorVariant: "error"
          });
        });
    }
  }

  loadData = (clientId) => {
    this.fetchPaymentTypes(clientId, false);
  };

  fetchPaymentTypes = (id, isParentCall) => {
    const { dispatch } = this.props;
    dispatch(getClientPaymentTypes()).then((response) => {
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
          }) => {
            return {
              label: paymentCode,
              key: fileFormatId,
              icon: fileFormatId,
              description: description,
              customPaymentCode: customPaymentCode,
              selected: false,
              alias: label,
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
    this.props.dispatch(getPreferredParentPaymentTypes(id)).then((response) => {
      if (!response) {
        return false;
      }
      const { rows: selectedTypes } = response;
      const selectedPayTypes =
        typeof selectedTypes !== "undefined" && selectedTypes !== null
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
      .dispatch(getPreferredClientPaymentTypes(clientId))
      .then((response) => {
        if (!response) {
          return false;
        }
        const { rows: selectedTypes } = response;
        const selectedPayTypes =
          typeof selectedTypes !== "undefined" && selectedTypes !== null
            ? selectedTypes
            : [];
        this.setState({
          selectedPaymentTypes: [...new Set(selectedPayTypes)],
        });

        const { paymentTypes, payerTypeId, selectedPaymentTypes } = this.state;

        this.setState({
          ...this.state,
          isLoading: false,
          paymentTypes: paymentTypes.map((paymentType) => ({
            ...paymentType,
            selected: Boolean(selectedPayTypes.includes(paymentType.key)),
          })),
        });

        // for Commercial card we have only master card 2.0
        if (payerTypeId == PayerTypes.CARDS && selectedPaymentTypes.length == 0) {
          this.setState({
            selectedPaymentTypes: [16],
            paymentTypes: paymentTypes.map((paymentMode) =>
              paymentMode.key === 16
                ? {
                  ...paymentMode,
                  selected: true
                }
                : paymentMode
            )
          })
        }
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
      // selectedPaymentTypes:
      //   index &&
      //   isChecked === true &&
      //   !selectedPaymentTypes.includes(paymentTypes[index].key)
      //     ? [...selectedPaymentTypes, paymentTypes[index].key]
      //     : newState || [],
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

  openConfirmModal = () => {
    this.setState({
      isOpen: true
    });
  }

  closeConfirmModal = () => {
    this.setState({
      isOpen: false
    });
  }

  validateNext = () => {
    let show = false;
    const { payment } = this.props;
    const { formValues } = payment;
    formValues.data.forEach((item) => {
      if (!show) {
        const { programName, companyNumber, programDetailsId } = item;
        if (!programDetailsId) {
          if (programName || programName.trim().length !== 0) {
            show = true;
          } else if (companyNumber || companyNumber.trim().length !== 0) {
            show = true;
          }
        }
      }
    })

    return show;
  };

  validation = () => {
    const { payment, t } = this.props;
    const { formValues } = payment;

    let valid = true, validation = {}, errorInd = {
      programName: [], companyNumber: [], purchaseType: [], templateName: [], mccGroup: [],
      timeZoneId: []
    };

    formValues.data.forEach((item, index) => {
      const { programName, companyNumber, timeZoneId, purchaseDetails } = item;
      if (!programName || programName.trim().length === 0) {
        validation["programName"] = t('componentData.masterCardDetails.programRequiredErr');
        errorInd["programName"].push(index);
        valid = false;
      }
      if (!companyNumber || companyNumber.trim().length === 0) {
        validation["companyNumber"] = t('componentData.masterCardDetails.companyRequiredErr');
        errorInd["companyNumber"].push(index);
        valid = false;
      }
      if (!timeZoneId) {
        validation["timeZoneId"] = t('componentData.masterCardDetails.timeZoneRequiredErr');
        errorInd["timeZoneId"].push(index);
        valid = false;
      }
      if (purchaseDetails.length) {
        let typeErrorInd = [], mccErrorIndexes = [];
        purchaseDetails.forEach((typeItem, ind) => {
          const { purchaseType } = typeItem;

          if (!purchaseType || purchaseType.trim().length === 0) {
            validation["purchaseType"] = t('componentData.masterCardDetails.purchaseTypeRequiredErr');
            typeErrorInd.push(ind);
            valid = false;
          }
        });
        errorInd["purchaseType"][index] = typeErrorInd;
        errorInd["mccGroup"][index] = mccErrorIndexes;
      } else {
        errorInd["templateName"].push(index);
        validation["templateName"] = t('componentData.masterCardDetails.purchaseTemplateRequiredErr');
        valid = false;
      }
    })

    this.props.dispatch(updateFormValues({ error: { ...validation }, errorIndex: { ...errorInd } }));
    return valid;
  };

  handleNext = (e) => {
    const showNextModal = this.validateNext();
    if (showNextModal) {
      this.openConfirmModal();
    }
    else {
      this.handlePaymentDetails();
    }
  }

  saveInfo = () => {
    const { clientId } = this.state;
    const { t, payment } = this.props;
    const { formValues } = payment;
    const valid = this.validation();
    if (valid) {
      const { data, cardAccountDetailsId } = formValues;
      if (cardAccountDetailsId) {
        this.props.dispatch(
          updateMasterCardInfo({
            clientId: clientId,
            masterCardDetail: data
          })
        ).then((response) => {
          if (response && !response.error) {
            this.setState({
              error: t('componentData.masterCardDetails.updateSuccessMsg'),
              errorVariant: "success"
            });
            this.props.dispatch(savePaymentCardtype({
              clientId: clientId,
              cardTypeId: CardType.MSC2
            }))
            getMasterCardInfo(clientId).then(resp => {
              this.props.dispatch(updateFormValues({ data: resp.data }));
            });
          } else {
            this.setState({
              error: t('componentData.paymentsSettings.wentWrongErr'),
              errorVariant: "error"
            });
            return false;
          }
        });
      } else {
        this.props.dispatch(
          createMasterCardInfo({
            clientId: clientId,
            masterCardDetail: data
          })
        ).then((response) => {
          if (response && !response.error) {
            this.setState({
              error: t('componentData.masterCardDetails.saveSuccessMsg'),
              errorVariant: "success"
            });
            this.props.dispatch(savePaymentCardtype({
              clientId: clientId,
              cardTypeId: CardType.MSC2
            }))
            getMasterCardInfo(clientId).then(resp => {
              this.props.dispatch(updateFormValues({ data: resp.data }));
            });
          } else {
            this.setState({
              error: t('componentData.paymentsSettings.wentWrongErr'),
              errorVariant: "error"
            });
            return false;
          }
        });
      }
    }
    else {
      this.setState({
        error: t('componentData.commonErr.validationMsg'),
        errorVariant: "error"
      });
    }
    this.closeConfirmModal()
  }

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
              updatePreferredPaymentTypes({
                clientId: clientId,
                selectedPaymentTypes,
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  error: t('componentData.paymentsSettings.unknownErr'),
                  processing: false,
                  errorVariant: "error"
                });
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
            error: t("componentData.paymentsSettings.payMethod"),
            processing: false,
            errorVariant: "error"
          });
        }
      }
    );
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
      payerTypeId,
      errorVariant
    } = this.state;
    const { t } = this.props;

    let selectedPaymentModes = paymentTypes.filter(
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
            {payerTypeId != PayerTypes.CARDS ?
              <Box my={1}>
                <PaymentModeSelector
                  paymentTypes={paymentTypes}
                  onChange={this.handlePaymentModeChange}
                  paymentModeIcons={paymentModeIcons}
                />
              </Box> : null}
            <PaymentDetails
              selectedPaymentModes={selectedPaymentModes}
              clientId={clientId}
              parentId={parentId}
              isHIPAA={isHIPAA}
              showParentData={showParentData}
              payerTypeId={payerTypeId}
            />
            <Box my={4} className={`button-container`}>
              <Box mx={2}>
                {/* <Button
                  type="submit"
                  fullWidth={false}
                  variant="outlined"
                  color="primary"
                  onClick={(e) =>
                    this.props.history.push(`${config.baseName}/onboard/profile?id=${clientId}`)
                  }
                >
                  Back
                </Button> */}
              </Box>
              {processing ? (
                <CircularProgress color="primary" />
              ) : (
                <Box mx={2}>
                  <Button
                    type="submit"
                    fullWidth={false}
                    variant="contained"
                    color="primary"
                    onClick={this.handleNext}
                  >
                    {t("componentData.paymentsSettings.Next")}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {error && (
          <Notification
            variant={errorVariant}
            message={error}
            handleClose={() => {
              this.setState({ error: false });
            }}
          />
        )}
        {this.state.isOpen &&
          <SimpleCustomDialog>
            <ConfirmModal
              closeModal={this.closeConfirmModal}
              goNext={this.handlePaymentDetails}
              saveInfo={this.saveInfo}
              message={t("componentData.paymentsSettings.confirmMessage")}
              confirmText={t("componentData.paymentsSettings.confirmText")}
              declinedText={t("componentData.paymentsSettings.declinedText")}
            />
          </SimpleCustomDialog>
        }
      </>
    );
  }
}
export default withTranslation()(
  connect((state) => ({ ...state.payment, ...state.client }))(PaymentSettings)
);
