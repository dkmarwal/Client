const initialState = {
    payment: {
        types: [],
        preferredTypes: {},
        cardTypes: [],
        currencyList: [],
        bankDetail: null,
        eftDetail: null,
        virtualCardDetails: null,
        checkDetails: null,
        error: null,
    }
}

export default function payment(state = initialState, action = {}) {
    switch (action.type) {
        case 'FETCH_PAYMENT_TYPE_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    types: action.payload,
                    error: null,
                }
            }
        case 'FETCH_PAYMENT_TYPE_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'FETCH_PREFERRED_PAYMENT_TYPE_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    preferredTypes: action.payload,
                    error: null,
                }
            }
        case 'FETCH_PREFERRED_PAYMENT_TYPE_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'PREFERRED_PAYMENT_TYPE_UPDATE_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    preferredTypes: action.payload,
                    error: null,
                }
            }
        case 'PREFERRED_PAYMENT_TYPE_UPDATE_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'FETCH_CARD_TYPE_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    cardTypes: action.payload,
                    error: null,
                }
            }
        case 'FETCH_CARD_TYPE_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'FETCH_CURRENCY_LIST_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    currencyList: action.payload,
                    error: null,
                }
            }
        case 'FETCH_CURRENCY_LIST_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'FETCH_BANK_DETAIL_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    bankDetail: action.payload,
                    error: null,
                }
            }
        case 'FETCH_EFT_DETAIL_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    eftDetail: action.payload,
                    error: null,
                }
            }
        case 'FETCH_BANK_DETAIL_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'BANK_DETAIL_UPDATE_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    bankDetail: action.payload,
                    error: null,
                }
            }
        case 'BANK_DETAIL_UPDATE_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'EFT_DETAIL_UPDATE_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    eftDetail: action.payload,
                    error: null,
                }
            }
        case 'EFT_DETAIL_UPDATE_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'FETCH_VIRTUAL_CARD_DETAIL_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    virtualCardDetails: action.payload,
                    error: null,
                }
            }
        case 'FETCH_VIRTUAL_CARD_DETAIL_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'VIRTUAL_CARD_DETAIL_UPDATE_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    virtualCardDetails: action.payload,
                    error: null,
                }
            }
        case 'VIRTUAL_CARD_DETAIL_UPDATE_FAILED':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    error: action.payload
                }
            }
        case 'FETCH_CHECK_DETAIL_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    checkDetails: action.payload,
                    error: null,
                }
            }
        case 'FETCH_CHECK_DETAIL_UPDATE_SUCCESS':
            return {
                ...state,
                payment: {
                    ...state.payment,
                    checkDetails: action.payload,
                    error: null,
                }
            }
        default:
            return {
                ...state
            }
    }
}