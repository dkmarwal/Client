const initialState = {
  USBankPayment: {
    error: null,
    zelleDetail: [],
    priorityTypeList: [],
    preferredTypes:null,
    checkDetail: null,
    usBankPrepaidCard: null,
    storedPrepaidCardData: null,
    reliaFocusCardParams: null,
    usBankCorporateCard: null,
    achUSBankClientAccountList: null,
    achUSBankAccountList: null,
    achUSBankProfileInfo: null,
  },
};

export default function USBankPayment(state = initialState, action = {}) {
  switch (action.type) {
    case 'FETCH_USBANK_ZELLE_SUCCESS':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          zelleDetail: action.payload,
          error: null,
          success: null,
        },
      };
    case 'FETCH_USBANK_ZELLE_FAILED':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          error: action.payload,
          success: null,
        },
      };
    case 'FETCH_USBANK_ZELLE_PRIORITY_SUCCESS':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          priorityTypeList: { data: action.payload, error: null },
          success: null,
        },
      };

    case 'FETCH_USBANK_ZELLE_PRIORITY_FAILED':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          error: action.payload,
          success: null,
        },
      };
    case 'USBANK_ADD_ZELLE_SUCCESS':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          zelleDetail: action.payload,
          success: action.success,
          error: null,
        },
      };
    case 'USBANK_ADD_ZELLE_FAILED':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          error: action.payload,
          success: null,
        },
      };
    case 'FETCH_USBANK_CHECK_DATA_SUCCESS':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          checkDetail: action.payload,
          error: null,
          success: null,
        },
      };
    case 'FETCH_USBANK_CHECK_DATA_FAILED':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          error: action.payload,
          success: null,
        },
      };
    case 'USBANK_ADD_CHECK_SUCCESS': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          checkDetail: action.payload,
          success: action.success,
          error: null,
        },
      };
    }
    case 'USBANK_ADD_CHECK_FAILED': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          error: action.payload,
          success: null,
        },
      };
    }
    case 'FETCH_USBANK_PREPAID_CARD_DATA_SUCCESS': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          storedPrepaidCardData: {
            data: action.payload,
            error: null,
          },
        },
      };
    }
    case 'FETCH_USBANK_PREPAID_CARD_DATA_FAILED': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          storedPrepaidCardData: {
            ...state.USBankPayment.storedPrepaidCardData,
            error: action.payload,
          },
        },
      };
    }

    case 'USBANK_ADD_PREPAID_CARD_SUCCESS': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          usBankPrepaidCard: {
            data: action.payload,
            error: null,
          },
        },
      };
    }
    case 'USBANK_ADD_PREPAID_CARD_FAILED': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          usBankPrepaidCard: {
            ...state.USBankPayment.usBankPrepaidCard,
            error: action.payload,
          },
        },
      };
    }
    case 'FETCH_RELIA_FOCUS_CARD_PARAMS_SUCCESS': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          reliaFocusCardParams: {
            data: action.payload,
            error: null,
          },
        },
      };
    }
    case 'FETCH_RELIA_FOCUS_CARD_PARAMS_FAILED': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          reliaFocusCardParams: {
            ...state.USBankPayment.reliaFocusCardParams,
            error: action.payload,
          },
        },
      };
    }
    case 'USBANK_ADD_CORPORATE_CARD_SUCCESS': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          usBankCorporateCard: {
            data: action.payload,
            error: null,
          },
        },
      };
    }
    case 'USBANK_ADD_CORPORATE_CARD_FAILED': {
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          usBankCorporateCard: {
            ...state.USBankPayment.usBankCorporateCard,
            error: action.payload,
          },
        },
      };
    }
    case 'FETCH_B2C_ACH_LIST_SUCCESS':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          achUSBankClientAccountList: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_B2C_ACH_LIST_FAILED':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          achUSBankClientAccountList: {
            ...state.USBankPayment.achUSBankClientAccountList,
            error: action.payload,
          },
        },
      };
    case 'FETCH_US_BANK_ACH_ACCOUNT_LIST_SUCCESS':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          achUSBankAccountList: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_US_BANK_ACH_ACCOUNT_LIST_FAILED':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          achUSBankAccountList: {
            ...state.USBankPayment.achUSBankAccountList,
            error: action.payload,
          },
        },
      };
    case 'FETCH_US_BANK_ACH_PROFILE_INFO_SUCCESS':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          achUSBankProfileInfo: {
            data: action.payload,
            error: null,
          },
        },
      };
    case 'FETCH_US_BANK_ACH_PROFILE_INFO_FAILED':
      return {
        ...state,
        USBankPayment: {
          ...state.USBankPayment,
          achUSBankProfileInfo: {
            ...state.USBankPayment.achUSBankProfileInfo,
            error: action.payload,
          },
        },
      };
      case 'FETCH_USBANK_CLIENT_PAYMENT_TYPE_SUCCESS':
        return {
            ...state,
            USBankPayment: {
                ...state.USBankPayment,
                preferredTypes: action.payload,
                error: null,
            }
        }
    case 'FETCH_USBANK_CLIENT_PAYMENT_TYPE_FAILED':
        return {
            ...state,
            USBankPayment: {
                ...state.USBankPayment,
                error: action.payload
            }
        }

    default:
      return {
        ...state,
      };
  }
}
