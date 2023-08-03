const initialState = {
  payment: {
    types: [],
    preferredTypes: {},
    cardTypes: [],
    currencyList: [],
    bankDetail: null,
    eftDetail: null,
    virtualCardDetails: null,
    checkDetails: null,
    error: null,
    routingCodes: [],
    totalCount: 0,
    locationOptions: [],
    locations: [],
    accountClasses: [],
    clientList: [],
    masterCardDetails: null,
    formValues:{
      data: [{
          programName: "", companyNumber: "", purchaseDetails: [], cardImage: false
      }],
      cardAccountDetailsId: null,
      error: { programName: "", companyNumber: "", purchaseType: '', mccGroup: "", timeZoneId: "" },
      errorIndex: { programName: [], companyNumber: [], purchaseType: [], templateName: [], mccGroup: [], timeZoneId: [] }
    },
  },
};

export default function payment(state = initialState, action = {}) {
  switch (action.type) {
    case "FETCH_PAYMENT_TYPE_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          types: action.payload,
          error: null,
        },
      };
    case "FETCH_PAYMENT_TYPE_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "FETCH_PREFERRED_PAYMENT_TYPE_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          preferredTypes: action.payload,
          error: null,
        },
      };
    case "FETCH_PREFERRED_PAYMENT_TYPE_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "PREFERRED_PAYMENT_TYPE_UPDATE_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          preferredTypes: action.payload,
          error: null,
        },
      };
    case "PREFERRED_PAYMENT_TYPE_UPDATE_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "FETCH_CARD_TYPE_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          cardTypes: action.payload,
          error: null,
        },
      };
    case "FETCH_CARD_TYPE_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "FETCH_CURRENCY_LIST_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          currencyList: action.payload,
          error: null,
        },
      };
    case "FETCH_CURRENCY_LIST_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "FETCH_BANK_DETAIL_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          bankDetail: action.payload,
          error: null,
        },
      };
    case "FETCH_EFT_DETAIL_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          eftDetail: action.payload,
          error: null,
        },
      };
    case "FETCH_BANK_DETAIL_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "BANK_DETAIL_UPDATE_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          bankDetail: action.payload,
          error: null,
        },
      };
    case "BANK_DETAIL_UPDATE_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "EFT_DETAIL_UPDATE_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          eftDetail: action.payload,
          error: null,
        },
      };
    case "EFT_DETAIL_UPDATE_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "FETCH_VIRTUAL_CARD_DETAIL_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          virtualCardDetails: action.payload,
          error: null,
        },
      };
    case "FETCH_VIRTUAL_CARD_DETAIL_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "VIRTUAL_CARD_DETAIL_UPDATE_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          virtualCardDetails: action.payload,
          error: null,
        },
      };
    case "VIRTUAL_CARD_DETAIL_UPDATE_FAILED":
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload,
        },
      };
    case "FETCH_CHECK_DETAIL_SUCCESS":
      return {
        ...state,
        payment: {
          ...state.payment,
          checkDetails: action.payload,
          error: null,
        },
      };      
      case "FETCH_CHECK_DETAIL_UPDATE_SUCCESS":        
      return {
        ...state,
        payment: {
          ...state.payment,
          checkDetails: action.payload,
          error: null,
        },
      };
      case "FETCH_CHECK_DETAIL_UPDATE_FAILED":        
      return {
        ...state,
        payment: {
          ...state.payment,          
          error: action.payload,
        },
      };
      case "FETCH_ROUTING_CODE_SUCCESS":
        return {
          ...state,
          payment: {
            ...state.payment,
            routingCodes: action.payload,
            totalCount: action.totalCount,
            error: null,
          },
        };
      case "FETCH_ROUTING_CODE_FAILED":
        return {
          ...state,
          payment: {
            ...state.payment,
            error: action.payload,
          },
        };
      case "FETCH_LOCATION_OPTION_SUCCESS":
        return {
          ...state,
          payment: {
            ...state.payment,
            locationOptions: action.payload,
            error: null,
          },
        };
      case "FETCH_LOCATION_OPTION_FAILED":
        return {
          ...state,
          payment: {
            ...state.payment,
            error: action.payload,
          },
        };
      case "FETCH_LOCATION_TYPES_SUCCESS":
        return {
          ...state,
          payment: {
            ...state.payment,
            locations: action.payload,
            error: null,
          },
        };
      case "FETCH_LOCATION_TYPES_FAILED":
        return {
          ...state,
          payment: {
            ...state.payment,
            error: action.payload,
          },
        };
      case "FETCH_ACCOUNT_CLASS_SUCCESS":
        return {
          ...state,
          payment: {
            ...state.payment,
            accountClasses: action.payload,
            error: null,
          },
        };
      case "FETCH_ACCOUNT_CLASS_FAILED":
        return {
          ...state,
          payment: {
            ...state.payment,
            error: action.payload,
          },
        };
      case "FETCH_VENDOR_CLIENT_LIST_SUCCESS":
        return {
          ...state,
          payment: {
            ...state.payment,
            clientList: action.payload,
            error: null,
          },
        };
  
      case "FETCH_VENDOR_CLIENT_LIST_FAILED":
        return {
          ...state,
          payment: {
            ...state.payment,
            error: action.payload,
          },
        };
      case "FETCH_CLIENT_REMMITANCE_INFO_FAILED":
        return {
          ...state,
          payment: {
            ...state.payment,
            error: action.payload,
          },
        };
         // for UST1284 (Commercial card master card 2.0)
         case 'MASTER_CARD_DETAIL_UPDATE_SUCCESS':
          return {
              ...state,
              payment: {
                  ...state.payment,
                  masterCardDetails: action.payload,
                  error: null
              }
          }
      case 'MASTER_CARD_DETAIL_UPDATE_FAILED':
          return {
              ...state,
              payment: {
                  ...state.payment,
                  error: action.payload
              }
          }
      case 'FETCH_MASTER_CARD_DETAIL_SUCCESS':
          return {
              ...state,
              payment: {
                  ...state.payment,
                  masterCardDetails: action.payload,
                  error: null
              }
          }
      case 'FETCH_MASTER_CARD_DETAIL_FAILED':
          return {
              ...state,
              payment: {
                  ...state.payment,
                  error: action.payload
              }
          }
      case 'PAYMENT_DETAIL_UPDATE':
        if(action.payload.error){
          return {...state, 
            payment: {
              ...state.payment, 
              formValues : {
                ...state.payment.formValues,
                error: action.payload.error,
                errorIndex: action.payload.errorIndex
              }
          }}
        }
        else{
          return {...state, 
            payment: {
              ...state.payment, 
              formValues : {
                ...state.payment.formValues,
                data: action.payload.data,
              }
          }}
        }
    default:
      return {
        ...state,
      };
  }
}
