const initialState = {
    branding: {
        smsEmailNotification: null,
        error: null
    },
  };
  
  export default function branding(state = initialState, action = {}) {
    switch (action.type) {
        case 'SMS_EMAIL_NOTIFICATION_UPDATE_SUCCESS':
        return {
          ...state,
          branding: {
            ...state.branding,
            smsEmailNotification: action.isSms,
          }
        }
      case 'SMS_EMAIL_NOTIFICATION_UPDATE_FAILURE':
        return {
          ...state,
          branding: {
            ...state.branding,
            error: action.payload
          }
        }
      default:
        return {
          ...state,
        };
    }
  }
  