const initialState = {
  suppliers: {
    count: 0,
    bestBuyCount: 0,
    selectedTab: 0,
    supplierUpdateList: [],
    bestBuySupplierUpdateList: [],
    supplierUpdateError: null,
    bestBuyError: null,
    pendingCount: 0,
    unReadCount: 0,
    unmaskedAccountNumber: null,
  },
};

export default function suppliers(state = initialState, action = {}) {
  switch (action.type) {
    case 'UPDATE_PAYEE_COUNTS':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          count: action.payload,
        },
      };
    case 'UPDATE_PAYEE_BEST_BUY_COUNTS':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          bestBuyCount: action.payload,
        },
      };
    case 'UPDATE_PAYEE_UNREAD_COUNTS_B2C': {
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          supplierUpdateList: action.payload.supplierUpdateList,
          unReadCount: action.payload.unReadCount,
        },
      };
    }
    case 'UPDATE_SUPPLIER_UPDATE_LIST_B2C':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          supplierUpdateList: action.payload.consumerUpdatesRecords,
          count: action.payload.count,
          unReadCount: action.payload.unreadCount,
          supplierUpdateError: null,
        },
      };
    case 'UPDATE_SUPPLIER_UPDATE_LIST_FAILED_B2C':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          supplierUpdateError: action.payload,
        },
      };
    case 'UPDATE_SUPPLIER_UPDATE_LIST':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          supplierUpdateList: action.payload,
          supplierUpdateError: null,
        },
      };
    case 'UPDATE_SUPPLIER_UPDATE_LIST_FAILED':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          supplierUpdateError: action.payload,
        },
      };
    case 'UPDATE_SUPPLIER_UPDATE_LIST_BEST_BUY':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          bestBuySupplierUpdateList: action.payload.list,
          pendingCount: action.payload.pendingCount,
          bestBuyError: null,
        },
      };
    case 'UPDATE_SUPPLIER_UPDATE_LIST_FAILED_BEST_BUY':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          bestBuyError: action.payload,
        },
      };
    case 'UPDATE_PAYEE_SELECTED_TAB':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          selectedTab: action.payload,
        },
      };
    case 'FETCH_UNMASKED_ACCOUNT_NUMBER_SUCCESS':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          unmaskedAccountNumber: action.payload,
        },
      };
    case 'FETCH_UNMASKED_ACCOUNT_NUMBER_FAILED':
      return {
        ...state,
        suppliers: {
          ...state.suppliers,
          unmaskedAccountNumber: null,
        },
      };
    default:
      return {
        ...state,
      };
  }
}
