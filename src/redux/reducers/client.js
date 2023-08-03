var initialState = {
  client: {
    isVerified: false,
    clientDetails: [],
    parentDetails: [],
    locations: {},
    user: {},
    clientInfo: [],
    locationTypeList:[],
  },
};
export default function client(state = initialState, action = {}) {
  switch (action.type) {
    case "CLIENT_VERIFICATION_SUCCESS":
      return {
        ...state,
        client: {
          ...state.client,
          isVerified: true,
          ...action.payload,
          error: null,
        },
      };
    case "CLIENT_VERIFICATION_FAILED":
      return {
        ...state,
        client: {
          ...state.client,
          error: action.payload,
        },
      };
    case "CLIENT_DETAILS_FETCH_SUCCESS":
      return {
        ...state,
        client: {
          ...state.client,
          clientDetails: action.payload,
          ...action.payload,
          error: null,
        },
      };
    case "CLIENT_DETAILS_FETCH_FAILED":
      return {
        ...state,
        client: {
          ...state.client,
          error: action.payload,
        },
      };
    case "CLIENT_INFO_FETCH_SUCCESS":
      return {
        ...state,
        client: {
          ...state.client,
          clientInfo: action.payload,
          ...action.payload,
          error: null,
        },
      };
    case "CLIENT_INFO_FETCH_FAILED":
      return {
        ...state,
        client: {
          ...state.client,
          error: action.payload,
        },
      };
    case "PARENT_INFO_FETCH_SUCCESS":
      return {
        ...state,
        client: {
          ...state.client,
          parentDetails: action.payload,
          ...action.payload,
          error: null,
        },
      };
    case "PARENT_INFO_FETCH_FAILED":
      return {
        ...state,
        client: {
          ...state.client,
          error: action.payload,
        },
      };
    case "LOCATIONS_FETCH_SUCCESS":
      return {
        ...state,
        client: {
          ...state.client,
          locations: action.payload,
          ...action.payload,
          error: null,
        },
      };
    case "LOCATIONS_FETCH_FAILED":
      return {
        ...state,
        client: {
          ...state.client,
          error: action.payload,
        },
      };
    case "CLIENT_INFO_UPDATE_SUCCESS":
      return {
        ...state,
        client: {
          ...state.client,
          clientDetails: action.payload,
          ...action.payload,
          error: null,
        },
      };
    case "CLIENT_INFO_UPDATE_FAILED":
      return {
        ...state,
        client: {
          ...state.client,
          error: action.payload,
        },
      };
    case "CREATE_USER_SUCCESS":
      return {
        ...state,
        client: {
          ...state.client,
          user: action.payload,
          ...action.payload,
          error: null,
        },
      };
    case "CREATE_USER_FAILED":
      return {
        ...state,
        client: {
          ...state.client,
          error: action.payload,
        },
      };
    case 'LOCATION_TYPE_LIST_FETCH_SUCCESS':
        return {
            ...state,
            client: {
                ...state.client,
                locationTypeList: action.payload,
                error: null,
            }
        }
    case 'LOCATION_TYPE_LIST_FETCH_FAILED':
        return {
            ...client,
            client: {
                ...state.client,
                error: action.payload
            }
        }
        case "USBANK_FILESETTING_FETCH_SUCCESS":
          return {
            ...state,
            client: {
              ...state.usbankclient,
              clientInfo: action.payload,
              // ...action.payload,
              error: null,
            },
          };
        case "USBANK_FILESETTING_FETCH_FAILED":
          return {
            ...state,
            client: {
              ...state.usbankclient,
              error: action.payload,
            },
          };
        
    default:
      return {
        ...state,
      };
  }
}
