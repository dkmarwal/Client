const initial_state = {
  consumerDetail: {
    consumerProfileInfo: null,
    consumerPayeeList: null,
    revoke: null,
    lock: null,
    unlock: null,
    deactivate: null,
    error: null,
    enrollmentStatus: null,
    payeeStatusList: null,
    resendLinkInfo: null,
    enrollmentUnlocked: null,
    enrollmentLocked:null,
    payeeTypeList: null,
  },
};

export default function b2cConsumers(state = initial_state, action = {}) {
  switch (action.type) {
    case "FETCH_B2C_CONSUMER_INFO_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          consumerProfileInfo: { data: action.payload },
          error: null,
        },
      };
    case "FETCH_B2C_CONSUMER_INFO_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };

    case "FETCH_B2C_CONSUMER_LIST_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          consumerPayeeList: { data: action.payload },
          error: null,
        },
      };
    case "FETCH_B2C_CONSUMER_LIST_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };

    case "REVOKE_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          revoke: { data: action.payload },
          error: null,
        },
      };
    case "REVOKE_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };

    case "lOCK_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          lock: { data: action.payload },
          error: null,
        },
      };
    case "lOCK_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };

    case "UNlOCK_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          unlock: { data: action.payload },
          error: null,
        },
      };
    case "UNlOCK_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };

    case "DEACTIVATE_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          deactivate: { data: action.payload },
          error: null,
        },
      };
    case "DEACTIVATE_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };

    case "ENROLLMENT_STATUS_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          enrollmentStatus: { data: action.payload },
          error: null,
        },
      };
    case "ENROLLMENT_STATUS_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };
    
      case "PAYEE_TYPE_SUCCESS":
        return {
          ...state,
          consumerDetail: {
            ...state.consumerDetail,
            payeeTypeList: { data: action.payload },
            error: null,
          },
        };
      case "PAYEE_TYPE_FAILED":
        return {
          ...state,
          consumerDetail: {
            ...state.consumerDetail,
            error: action.payload,
          },
        };
        case "CONTACT_TYPE_SUCCESS":
          return {
            ...state,
            consumerDetail: {
              ...state.consumerDetail,
              contactTypeList: { data: action.payload },
              error: null,
            },
          };
        case "CONTACT_TYPE_FAILED":
          return {
            ...state,
            consumerDetail: {
              ...state.consumerDetail,
              error: action.payload,
            },
          };
          case "ACCOUNT_TYPE_SUCCESS":
            return {
              ...state,
              consumerDetail: {
                ...state.consumerDetail,
                accountTypeList: { data: action.payload },
                error: null,
              },
            };
          case "ACCOUNT_TYPE_FAILED":
            return {
              ...state,
              consumerDetail: {
                ...state.consumerDetail,
                error: action.payload,
              },
            };

    case "PAYEE_STATUS_LIST_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          payeeStatusList: { data: action.payload },
          error: null,
        },
      };
    case "PAYEE_STATUS_LIST_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };

    case "RESEND_ENROLLMENT_LINK_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          resendLinkInfo: { data: action.payload },
          error: null,
        },
      };
    case "RESEND_ENROLLMENT_LINK_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };
    case "UNLOCK_B2C_ENROLLMENT_SUCCESS":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          enrollmentUnlocked: { data: action.payload },
          error: null,
        },
      };
    case "UNLOCK_B2C_ENROLLMENT_FAILED":
      return {
        ...state,
        consumerDetail: {
          ...state.consumerDetail,
          error: action.payload,
        },
      };
      case "LOCK_B2C_ENROLLMENT_SUCCESS":
        return {
          ...state,
          consumerDetail: {
            ...state.consumerDetail,
            enrollmentLocked: { data: action.payload },
            error: null,
          },
        };
      case "LOCK_B2C_ENROLLMENT_FAILED":
        return {
          ...state,
          consumerDetail: {
            ...state.consumerDetail,
            error: action.payload,
          },
        };
    default:
      return { ...state };
  }
}
