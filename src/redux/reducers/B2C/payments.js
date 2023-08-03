const initial_state = {
  b2cPushToCard: null,
  payPalDetails: null,
  addPayPalDetail: null,
  getB2CPushCardData: null,
  updatedB2CPushCardData: null,
  getZelleData: null,
  senderTypeList: null,
  productTypeList: null,
  storedZelleData: null,
  achAccountList: null,
  achB2CClientAccountList: null,
  consumerPayeeInfo: null,
  createPaymentInfo: null,
  thresholdLimit: null,
  paymentMethodList: null,
};

export default function b2cPayments(state = initial_state, action = {}) {
  switch (action.type) {
    case 'FETCH_B2C_PUSHTOCARD_SUCCESS':
      return {
        ...state,
        b2cPushToCard: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_PUSHTOCARD_FAILED':
      return {
        ...state,
        b2cPushToCard: {
          data: state.b2cPushToCard?.data ?? [],
          error: action.payload,
        },
      };
    case 'FETCH_PAYPAL_DETAIL_SUCCESS':
      return {
        ...state,
        payPalDetails: action.payload,
        error: null,
      };
    case 'FETCH_PAYPAL_DETAIL_FAILED':
      return {
        ...state,
        error: action.payload,
      };
    case 'ADD_PAYPAL_DETAIL_SUCCESS':
      return {
        ...state,
        addPayPalDetail: action.payload,
        error: null,
      };
    case 'ADD_PAYPAL_DETAIL_FAILED':
      return {
        ...state,
        error: action.payload,
      };
    case 'PAYPAL_DETAIL_UPDATE_SUCCESS':
      return {
        ...state,
        addPayPalDetail: action.payload,
        error: null,
      };
    case 'PAYPAL_DETAIL_UPDATE_FAILED':
      return {
        ...state,
        error: action.payload,
      };
    case 'FETCH_B2C_GETPUSHTOCARD_SUCCESS':
      return {
        ...state,
        getB2CPushCardData: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_GETPUSHTOCARD_FAILED':
      return {
        ...state,
        getB2CPushCardData: {
          data: state.getB2CPushCardData?.data ?? [],
          error: action.payload,
        },
      };
    case 'FETCH_B2C_UPDATEPUSHTOCARD_SUCCESS':
      return {
        ...state,
        updatedB2CPushCardData: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_UPDATEPUSHTOCARD_FAILED':
      return {
        ...state,
        updatedB2CPushCardData: {
          data: state.updatedB2CPushCardData?.data ?? [],
          error: action.payload,
        },
      };
    case 'FETCH_B2C_ZELLE_SUCCESS':
      return {
        ...state,
        getZelleData: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_ZELLE_FAILED':
      return {
        ...state,
        getZelleData: { error: action.payload },
      };
    case 'FETCH_ZELLE_SENDER_SUCCESS':
      return {
        ...state,
        senderTypeList: { data: action.payload, error: null },
      };
    case 'FETCH_ZELLE_SENDER_FAILED':
      return {
        ...state,
        senderTypeList: { error: action.payload },
      };
    case 'FETCH_ZELLE_PRODUCT_TYPE_SUCCESS':
      return {
        ...state,
        productTypeList: { data: action.payload, error: null },
      };
    case 'FETCH_ZELLE_PRODUCT_TYPE_FAILED':
      return {
        ...state,
        productTypeList: { error: action.payload },
      };
    case 'FETCH_ADD_ZELLE_SUCCESS':
      return {
        ...state,
        storedZelleData: { data: action.payload, error: null },
      };
    case 'FETCH_ADD_ZELLE_FAILED':
      return {
        ...state,
        storedZelleData: { error: action.payload },
      };
    case 'FETCH_B2C_ACH_LIST_SUCCESS':
      return {
        ...state,
        achAccountList: { data: action.payload, error: null },
      };
    case 'FETCH_B2C_ACH_LIST_FAILED':
      return {
        ...state,
        achAccountList: { ...state.achAccountList, error: action.payload },
      };
    case 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_SUCCESS':
      return {
        ...state,
        achB2CClientAccountList: {
          data: action.payload,
          error: null,
        },
      };
    case 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_FAILED':
      return {
        ...state,
        achB2CClientAccountList: {
          ...state.achB2CClientAccountList,
          error: action.payload,
        },
      };
      case 'FETCH_PAYEE_INFO_SUCCESS':
        return {
          ...state,
          consumerPayeeInfo: {
            ...action.payload
          },
        };
      case 'FETCH_PAYEE_INFO_FAILED':
        return {
          ...state,
          consumerPayeeInfo: {
            ...state.consumerPayeeInfo,
            error: action.payload,
          },
        };
        case 'CREATE_PAYMENT_SUCCESS':
        return {
          ...state,
          createPaymentInfo: {
            data: action.payload,
            error: null,
          },
        };
      case 'CREATE_PAYMENT_FAILED':
        return {
          ...state,
          createPaymentInfo: {
            ...state.createPaymentInfo,
            error: action.payload,
          },
        };
        case 'FETCH_THRESHOLD_LIMITS_SUCCESS':
          return {
            ...state,
            thresholdLimit: {
              data: action.payload,
              error: null,
            },
          };
      case 'FETCH_THRESHOLD_LIMITS_FAILED':
        return {
          ...state,
          thresholdLimit: {
            ...state.thresholdLimit,
            error: action.payload,
          },
        };
        case 'FETCH_PAYMENT_TYPE_SUCCESS':
          return {
            ...state,
            paymentMethodList: {
              data: action.payload,
              error: null,
            },
          };
      case 'FETCH_PAYMENT_TYPE_FAILED':
        return {
          ...state,
          paymentMethodList: {
            ...state.paymentMethodList,
            error: action.payload,
          },
        };
    default:
      return { ...state };
  }
}
