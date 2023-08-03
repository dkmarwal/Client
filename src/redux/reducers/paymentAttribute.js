const initialState = {
    paymentAttribute: {
        attributeList: [],
        fileSelectionType: {},
        dataTypeList: {},
        editId: null,
        error: null,
        tabValue: 0
    }
};
export default function paymentAttribute(state = initialState, action = {}) {
    switch (action.type) {

        case 'PAYMENT_ATTRIBUTE_FETCH_SUCCESS':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    attributeList: action.payload,
                    fileSelectionType: action.fileSelectionType,
                    error: null
                }
            }
        case 'PAYMENT_ATTRIBUTE_FETCH_ERROR':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    error: action.payload
                }
            }
        case 'CUSTOM_ADD_PAYMENT_ATTRIBUTE':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    attributeList: state.paymentAttribute.attributeList.length > 0 &&
                        state.paymentAttribute.attributeList.map(item => {
                            if (item.id === action.payload.parentId) {
                                item['childRecord'] = item.childRecord ? [...item.childRecord, action.payload.obj] : action.payload.item;
                                return item;
                            }
                            else {
                                return item;
                            }
                        }),
                    error: null
                }
            }
        case 'CUSTOM_UPDATE_PAYMENT_ATTRIBUTE':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    attributeList: state.paymentAttribute.attributeList.length > 0 &&
                        state.paymentAttribute.attributeList.map(item => {
                            const { parentId, obj } = action.payload;
                            if (item.id === parentId) {
                                const childItems = [...item.childRecord];
                                const ind = childItems.findIndex(a => a.index == obj.index)
                                childItems[ind] = obj;
                                item['childRecord'] = [...childItems];
                                return item;
                            }
                            else {
                                return item;
                            }
                        }),
                    error: null
                }
            }
        case 'UPDATE_PAYMENT_ATTRIBUTE':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    attributeList: state.paymentAttribute.attributeList.length > 0 &&
                        state.paymentAttribute.attributeList.map(item => {
                            const { parentId, obj } = action.payload;
                            if (item.id === parentId) {
                                let childItems = [...item.childRecord];
                                if (obj.length) {
                                    childItems = obj;
                                }
                                else {
                                    let index = null;
                                    // In default case clientAttributeId is not exist we need to find record on the basis of attributeId
                                    const exists = childItems.filter(function (o) {
                                        return o.hasOwnProperty("clientAttributeId");
                                    }).length > 0;

                                    if (exists) {
                                        if (obj.attributeId == null) {
                                            index = childItems.findIndex(x => x.index == obj.index);
                                        } else {
                                            index = childItems.findIndex(x => x.clientAttributeId == obj.clientAttributeId);
                                        }
                                    }
                                    else {
                                        if (obj.attributeId == null) {
                                            index = childItems.findIndex(x => x.index == obj.index);
                                        } else {
                                            index = childItems.findIndex(x => x.attributeId == obj.attributeId);
                                        }
                                    }
                                }
                                return item;
                            }
                            else {
                                return item;
                            }
                        }),
                    error: null
                }
            }
        case 'DELETE_PAYMENT_ATTRIBUTE':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    attributeList: state.paymentAttribute.attributeList.length > 0 &&
                        state.paymentAttribute.attributeList.map(item => {
                            const { parentId, obj } = action.payload;
                            if (item.id === parentId) {
                                const childItems = [...item.childRecord];
                                const ind = childItems.findIndex(a => a.index == obj.index);
                                if (obj.attributeId === null && obj.clientAttributeId === null) {
                                    childItems.splice(ind, 1);
                                }
                                else {
                                    childItems[ind] = { ...obj, isDeleted: 1 };
                                }
                                item['childRecord'] = [...childItems];
                                return item;
                            }
                            else {
                                return item;
                            }
                        }),
                    error: null
                }
            }
        case 'REORDER_PAYMENT_ATTRIBUTE':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    attributeList: state.paymentAttribute.attributeList.length > 0 &&
                        state.paymentAttribute.attributeList.map(item => {
                            const { parentId, obj } = action.payload;
                            if (item.id === parentId) {
                                item['childRecord'] = obj;
                                return item;
                            }
                            else {
                                return item;
                            }
                        }),
                    error: null
                }
            }

        case 'SAVE_PAYMENT_ATTRIBUTE_SUCCESS':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute
                }
            }
        case 'SAVE_PAYMENT_ATTRIBUTE_FAILED':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    error: action.payload
                }
            }
        case 'SET_EDIT_ID':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    editId: action.payload
                }
            }
        case 'DATATYPE_FETCH_SUCCESS':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    dataTypeList: action.payload,
                    error: null
                }
            }
        case 'DATATYPE_FETCH_ERROR':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    error: action.payload
                }
            }
        case 'UPDATE_PAYMENT_TYPE_SELECTION':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    fileSelectionType: { ...state.paymentAttribute.fileSelectionType, fileTypeId: action.payload }
                }
            }
        case 'UPDATE_PAYMENT_DEFAULT_SELECTION':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    fileSelectionType: { ...state.paymentAttribute.fileSelectionType, defaultSchema: action.payload }
                }
            }
        case 'UPDATE_PAYMENT_FILE_HEADER':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    fileSelectionType: { ...state.paymentAttribute.fileSelectionType, [action.payload.type]: action.payload.hasFileHeader }
                }
            }
        case 'SET_TAB_VALUE':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    tabValue: action.payload
                }
            }
        case 'UPDATE_PAYMENT_DEFAULT_USER':
            return {
                ...state,
                paymentAttribute: {
                    ...state.paymentAttribute,
                    fileSelectionType: { ...state.paymentAttribute.fileSelectionType, isDefaultUser: action.payload }
                }
            }
        default:
            return {
                ...state
            }
    }
}
