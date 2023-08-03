const initialState = {
  report: {
    filterList:[],
    dataTypeList: [],
    paymentParameterList: [],
    selectedPaymentParameters: [],
    data:{},
    list:[],
    reportData:[],
    reportDataCount:0,
    totalCount:0,
    error: null,
    freuencyList:[],
    clientList:[],
    reportDataTypeList:[],
    reportParametersList:[],
    selectedReportDetails:null,
    selectedReportDetailsById:null,
    deleteDynamicReportStatus:null,
    businessUnitList:[],
    smsOptOutList:[],
  },
};

export default function USbankReport(state = initialState, action = {}) {
  switch (action.type) {
      case 'USBANK_REPORT_FILTER_LIST_FETCH_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          filterList: action.payload,
          error: null,
        }
      }
    case 'USBANK_REPORT_FILTER_LIST_FETCH_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
      case 'USBANK_REPORT_LIST_FETCH_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          list: action.payload,
          totalCount: action.totalCount,
          error: null,
        }
      }
    case 'USBANK_REPORT_LIST_FETCH_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'USBANK_REPORT_DATA_LIST_FETCH_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          reportData: action.payload,
          reportDataCount: action.totalCount,
          error: null,
        }
      }
    case 'USBANK_REPORT_DATA_LIST_FETCH_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case "USBANK_CREATE_REPORT_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          list: [...state.report.list, action.payload],
          totalCount: state.report.totalCount + 1,
          error: null
        }
      };
    case "USBANK_CREATE_REPORT_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      };

    case "USBANK_UPDATE_REPORT_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          list: [...state.report.list.map(item => {
            return parseInt(item.clientReportId) === parseInt(action.payload.clientReportId) ? action.payload : item;
          })],
          error: null
        }
      };

    case "USBANK_UPDATE_REPORT_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      };
    case "USBANK_REMOVE_REPORT_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          list: [...state.report.list.filter((item, i) => action.payload.reportIds.indexOf(item.id) == -1)],
          totalCount: state.report.totalCount - action.payload.reportIds.length,
          error: null
        }
      };
    case "USBANK_REMOVE_REPORT_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      };
    case "USBANK_FETCH_DATA_TYPE_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          dataTypeList: action.payload,
          error: null,
        },
      };
    case "USBANK_FETCH_DATA_TYPE_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload,
        },
      };
    case "USBANK_FETCH_PAYMENT_PARAMETER_LIST_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          paymentParameterList: action.payload,
          error: null,
        },
      };
      case 'USBANK_FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      };
      case 'USBANK_FETCH_REPORT_PAYEE_LIST_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          payeeList: action.payload,
          error: null,
        }
      }
    case 'USBANK_FETCH_REPORT_PAYEE_LIST_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
      case 'USBANK_FETCH_CAMPAIGN_LIST_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          campaignList: action.payload,
          error: null,
        }
      }
    case 'USBANK_FETCH_CAMPAIGN_LIST_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case "USBANK_FETCH_PAYMENT_PARAMETER_LIST_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload,
        },
      };
    case 'USBANK_FETCH_FREQUENCY_LIST_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          frequencyList: action.payload,
          error: null,
        }
      }
    case 'USBANK_FETCH_FREQUENCY_LIST_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'USBANK_FETCH_REPORT_SUBSCRIPTION_SUCCESS':
      return {
        ...state,
        report: {
          ...state.report,
          list: [...state.report.list.map(item => {
            return parseInt(item.clientReportId) === parseInt(action.payload.clientReportId) ? {...item,  subscription:action.payload.subscription, frequency: action.payload.frequency} : item;
          })],
          error: null,
        }
      }
    case 'USBANK_FETCH_REPORT_SUBSCRIPTION_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case 'USBANK_FETCH_REPORT_DOWNLOAD_FAILED':
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload
        }
      }
    case "USBANK_FETCH_CHILD_CLIENT_LIST_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          clientList: action.payload,
          error: null,
        },
      };
    case "USBANK_FETCH_CHILD_CLIENT_LIST_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload,
        },
      };
  case "USBANK_FETCH_REPORT_DATA_TYPE_LIST_SUCCESS":
    return {
      ...state,
      report:{
        ...state.report,
        reportDataTypeList:action.payload,
        error:null
      }
    };
    case "USBANK_FETCH_REPORT_DATA_TYPE_LIST_FAILED":
    return {
      ...state,
      report:{
        ...state.report,
        error:action.payload
      }
    };
    case "USBANK_FETCH_REPORT_PARAMETERS_SUCCESS":
    return {
      ...state,
      report:{
        ...state.report,
        reportParametersList:action.payload,
        error:null
      }
    }
    case "USBANK_FETCH_REPORT_PARAMETERS_FAILED":
    return {
      ...state,
      report:{
        ...state.report,
        error:action.payload
      }
    }
    case "USBANK_FETCH_REPORT_DETAILS_SUCCESS":
    return {
      ...state,
      report:{
        ...state.report,
        selectedReportDetails: action.payload
      }
    }
    case "USBANK_FETCH_REPORT_DETAILS_BY_ID_SUCCESS":
    return {
      ...state,
      report:{
        ...state.report,
        selectedReportDetailsById: action.payload,
        error:null
      }
    }
    case "USBANK_FETCH_REPORT_DETAILS_BY_ID_FAILED":
    return {
      ...state,
      report:{
        ...state.report,
        error:action.payload
      }
    }
    case "USBANK_DELETE_DYNAMIC_REPORT_SUCCESS":
      return {
        ...state,
        report:{
          ...state.report,
          deleteDynamicReportStatus:action.payload
        }
      }
    case "USBANK_DELETE_DYNAMIC_REPORT_FAILED":
      return {
        ...state,
        report:{
          ...state.report,
          deleteDynamicReportStatus: action.payload
        }
      }

    case "USBANK_FETCH_BUSINESS_UNIT_LIST_SUCCESS":
      return {
        ...state,
        report: {
          ...state.report,
          businessUnitList: action.payload,
          error: null,
        },
      };

    case "USBANK_FETCH_BUSINESS_UNIT_LIST_FAILED":
      return {
        ...state,
        report: {
          ...state.report,
          error: action.payload,
        },
      };
      case 'USBANK_FETCH_SMSOPTOUT_LIST_SUCCESS':
        return {
          ...state,
          report: {
            ...state.report,
            smsOptOutList: action.payload,
            error: null,
          }
        }
      case 'USBANK_FETCH_SMSOPTOUT_LIST_FAILED':
        return {
          ...state,
          report: {
            ...state.report,
            error: action.payload
          }
        }

    default:
      return {
        ...state,
      };
  }
}
