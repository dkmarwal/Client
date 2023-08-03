const initialState = {
  campaign: {
    data:{},
    validationList:[],
    campaignList:[],
    totalCount:0,
    emailDeliveryStatus:{},
    campaignMatricInfo:{},
    enrollmentStatusList:[],
    payerList:[],
    filterList:[],
    error: null,
  },
};

export default function campaign(state = initialState, action = {}) {
  switch (action.type) {
      case 'PAYER_LIST_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          payerList: action.payerList,
          totalCount: action.totalCount,
          error: null,
        }
      }
    case 'PAYER_LIST_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
      case 'CAMPAIGN_MATRICS_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          campaignMatricInfo: action.payload,
          error: null,
        }
      }
    case 'CAMPAIGN_MATRICS_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
      case 'CAMPAIGN_LIST_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          campaignList: action.payload.campaignList,
          totalCount: action.payload.totalCount,
          error: null,
        }
      }
    case 'CAMPAIGN_LIST_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
      case 'EMAIL_DELIVERY_STATUS_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          emailDeliveryStatus: action.payload,
          error: null,
        }
      }
    case 'EMAIL_DELIVERY_STATUS_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
    case 'ENROLLMENT_STATUS_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          enrollmentStatusList: action.payload,
          error: null,
        }
      }
    case 'ENROLLMENT_STATUS_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      };
      case 'CAMPAIGN_FILTER_CHIPS_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          filterList: action.payload,
          error: null,
        }
      }
    case 'CAMPAIGN_FILTER_CHIPS_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      };
    default:
      return {
        ...state,
      };
  }
}
