const initialState = {
  user: {
    isLoggedIn: null,
    isFirstLogin: null,
    activeParentProfileId:null,
    userData: {},
    accessRights: [],
    userRoles:[],
    list: [],
    isPayeeChoicePortal:false,
    securityQuestionList: [],
    totalCount: 0,
    error: null,
    chipFilterList:[],
    childParentList:[],
    slList:[],
	  securityQuestionId: null,
  }
}

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          userData: {
            ...state.user.userData,
            ...action.payload.userData
          },
          accessRights:{
            ...action.payload.accessRights
          },
          userRoles:[
            ...action.payload.userRoles
          ],
          isFirstLogin: action.payload.isFirstLogin,
          error: null,
          isLoggedIn: true,
        }
      }
    case 'UPDATE_USER_INFO': 
    return {
      ...state,
      user: {
        ...state.user,
        userData: {
            ...state.user.userData,
            ...action.payload
        },
        error: null,
      }
    }
    case 'LOGIN_FAILED':
      return {
        ...state,
        user: {
          error: action.payload && action.payload.message,
          data: action.payload && action.payload.data,
          userData: {},
          accessRights: {},
          userRoles:[],
          isLoggedIn: false,
          isFirstLogin: null,
          isPayeeChoicePortal:state.user.isPayeeChoicePortal ?? false,
        }
      }
    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        user: {
          isLoggedIn: false,
          isPayeeChoicePortal:state.user.isPayeeChoicePortal ?? false,
          isFirstLogin: null,
          userData: {},
          accessRights: {},
          userRoles:[],
          error: action.payload,
        }
      }
    case 'LOGOUT_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        }
      }
    case 'UPDATE_PASSWORD_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          isFirstLogin: action.payload.isFirstLogin,
          error: null,
        }
      }
    case 'UPDATE_PASSWORD_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
        }
      }
    case 'FORGOT_PASSWORD_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
        }
      }
    case 'FORGOT_PASSWORD_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload,
          isPayeeChoicePortal:state.user.isPayeeChoicePortal ?? false,
        }
      }
    case 'USER_LIST_FETCH_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          list: action.payload,
          totalCount: action.totalCount,
          error: null,
        }
      }
    case 'USER_LIST_FETCH_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      }
    case "CREATE_ADMIN_USER_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          list: [...state.user.list, action.payload],
          totalCount: state.user.totalCount + 1,
          error: null
        }
      };
    case "CREATE_ADMIN_USER_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      };

    case "UPDATE_USER_DETAILS_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          list: [...state.user.list.map(item => {
            return parseInt(item.userId) === parseInt(action.payload.userId) ? action.payload : item;
          })],
          error: null
        }
      };

    case "UPDATE_USER_DETAILS_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      };
    case "LOCK_USER_DETAILS_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          list: [...state.user.list.map(item => {
            return action.payload.userIds.indexOf(item.userId) == -1 ? item : { ...item, isLocked: action.payload.isLocked };
          })],
          error: null
        }
      };
    case "LOCK_USER_DETAILS_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      };
    case "REMOVE_USER_DETAILS_SUCCESS":
      return {
        ...state,
        user: {
          ...state.user,
          list: [...state.user.list.filter((item, i) => action.payload.userIds.indexOf(item.userId) == -1)],
          totalCount: state.user.totalCount - action.payload.userIds.length,
          error: null
        }
      };
    case "REMOVE_USER_DETAILS_FAILED":
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      };
    case 'SQ_LIST_FETCH_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          securityQuestionList: action.payload,
          error: null,
        }
      }
    case 'SQ_LIST_FETCH_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      }
	case 'SQ_ID_FETCH_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          securityQuestionId: action.payload,
          error: null,
        }
      }
    case 'SQ_ID_FETCH_FAILED':
      return {
        ...state,
        user: {
          ...state.user,
          error: action.payload
        }
      }
     case 'CHIPS_FILTER_LIST_FETCH_SUCCESS':
        return {
            ...state,
            user: {
                ...state.user,
                chipFilterList: action.payload,
                error: null,
            }
        }
    case 'CHIPS_FILTER_LIST_FETCH_FAILED':
        return {
            ...state,
            user: {
                ...state.user,
                error: action.payload
            }
        }
    case 'CHILD_PARENT_LIST_FETCH_SUCCESS':
        return {
            ...state,
            user: {
                ...state.user,
                childParentList: action.payload,
                error: null,
            }
        }
    case 'CHILD_PARENT_LIST_FETCH_FAILED':
        return {
            ...state,
            user: {
                ...state.user,
                error: action.payload
            }
        }
    case 'FETCH_CHILD_PARENT_DATA_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          isFirstLogin: action.payload.isFirstLogin,
          activeParentProfileId: action.payload.activeParentProfileId,
          userData: {
            ...state.user.userData,
            ...action.payload.userData
          },
          accessRights:[
            ...action.payload.accessRights
          ],
          userRoles:[
            ...action.payload.userRoles
          ],
          error: null,
        }
      }
    case 'FETCH_CHILD_PARENT_DATA_FAILED':
      return {
            ...state,
            user: {
                ...state.user,
                error: action.payload
            }
        }
    case 'FETCH_PARENT_DATA_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          isFirstLogin: action.payload.isFirstLogin,
          activeParentProfileId: null,
          userData: {
            ...state.user.userData,
            ...action.payload.userData
          },
          accessRights:[
            ...action.payload.accessRights
          ],
          userRoles:[
            ...action.payload.userRoles
          ],
          error: null,
        }
      }
    case 'FETCH_PARENT_DATA_FAILED':
      return {
            ...state,
            user: {
                ...state.user,
                error: action.payload
            }
        }
    case 'UPDATE_TOKEN_TIME_SUCCESS':
        return {
          ...state,
          user: {
            ...state.user,
            userData: {
                ...state.user.userData,
                ...action.payload
              },
           }
        }
        case 'IS_PAYEE_CHOICE_PORTAL':
          return {
            ...state,
            user:{
              ...state.user,
              isPayeeChoicePortal:action.payload
            }
          }

    case 'SLL_LIST_FETCH_SUCCESS':
      return {
        ...state,
        user: {
          ...state.user,
          slList: action.payload,
          error: null,
        }
      }
    default:
      return {
        ...state
      }
  }
}
