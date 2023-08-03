const initialState = {
  campaign: {
    campaignData:{},
    campaignList:[],
    enrollmentStatusList:[],
    payeesList:[],
    totalCount:0,
    fileText:"",
    error: null,
  },
};

export default function ccCampaign(state = initialState, action = {}) {
  switch (action.type) {
    case 'CAMPAIGN_DATA_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          campaignData:action.payload,
          error: null,
        }
      }
    case 'CAMPAIGN_DATA_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
    case 'CAMPAIGN_LIST_CC_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          campaignList:action.payload.campaignList,
          totalCount: action.payload.totalCount,
          fileText:action.payload.fileText,
          error: null,
        }
      }
    case 'CAMPAIGN_LIST_CC_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
      case 'CAMPAIGN_LIST_CC_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          campaignList:action.payload.campaignList,
          totalCount: action.payload.totalCount,
          fileText:action.payload.fileText,
          error: null,
        }
      }
    case 'CAMPAIGN_LIST_CC_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      }
    case 'CC_ENROLLMENTSTATUS_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          enrollmentStatusList: action.payload,
          error: null,
        }
      }
    case 'CC_ENROLLMENTSTATUS_FETCH_FAILED':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          error: action.payload
        }
      };
      case 'PAYER_LIST_CC_FETCH_SUCCESS':
      return {
        ...state,
        campaign: {
          ...state.campaign,
          payeesList: action.payload.payeeList,
          totalCount: action.payload.totalCount,
          error: null,
        }
      }
    case 'PAYER_LIST_CC_FETCH_FAILED':
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
