const initialState = {
    Payee: {
      list: [],
      error: null,
      payeeTypeList:null,
      contactTypeList:null,
      accountTypeList:null,
      
    }
  }
  
  export default function Payee(state = initialState, action = {}) {
    switch (action.type) {

      case "CREATE_PAYEE_SUCCESS":
        return {
          ...state,
          Payee: {
            ...state.Payee,
            list: [...state.user.list, action.payload],
            error: null
          }
        };
      case "CREATE_PAYEE_FAILED":
        return {
          ...state,
          Payee: {
            ...state.Payee,
            error: action.payload
          }
        };
        case "PAYEE_TYPE_SUCCESS":
          return {
            ...state,
            Payee: {
              ...state.Payee,
              payeeTypeList: { data: action.payload },
              error: null,
            },
          };
        case "PAYEE_TYPE_FAILED":
          return {
            ...state,
            Payee: {
              ...state.Payee,
              error: action.payload,
            },
          };
          case "CONTACT_TYPE_SUCCESS":
            return {
              ...state,
              Payee: {
                ...state.Payee,
                contactTypeList: { data: action.payload },
                error: null,
              },
            };
          case "CONTACT_TYPE_FAILED":
            return {
              ...state,
              Payee: {
                ...state.Payee,
                error: action.payload,
              },
            };
            case "ACCOUNT_TYPE_SUCCESS":
              return {
                ...state,
                Payee: {
                  ...state.Payee,
                  accountTypeList: { data: action.payload },
                  error: null,
                },
              };
            case "ACCOUNT_TYPE_FAILED":
              return {
                ...state,
                Payee: {
                  ...state.Payee,
                  error: action.payload,
                },
              };
    
   
      default:
        return {
          ...state
        }
    }
  }
  