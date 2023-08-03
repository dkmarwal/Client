const initialState = {
    payeeAttribute: {
        attributeList: [],
        fileSelectionType: {},
        dataTypeList: {},
        editId: null,
        error: null
    }
};
export default function payeeAttribute(state = initialState, action = {}) {
    switch (action.type) {
        case 'PAYEE_ATTRIBUTE_FETCH_SUCCESS':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    attributeList: action.payload,
                    fileSelectionType: action.fileSelectionType,
                    error: null
                }
            }

        case 'PAYEE_ATTRIBUTE_FETCH_ERROR':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    error: action.payload
                }
            }

        case 'CUSTOM_ADD_PAYEE_ATTRIBUTE':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    attributeList: state.payeeAttribute.attributeList.length > 0 &&
                        state.payeeAttribute.attributeList.map(item => {
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

        case 'CUSTOM_UPDATE_PAYEE_ATTRIBUTE':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    attributeList: state.payeeAttribute.attributeList.length > 0 &&
                        state.payeeAttribute.attributeList.map(item => {
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

        case 'REORDER_PAYEE_ATTRIBUTE':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    attributeList: state.payeeAttribute.attributeList.length > 0 &&
                        state.payeeAttribute.attributeList.map(item => {
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

        case 'UPDATE_PAYEE_ATTRIBUTE':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    attributeList: state.payeeAttribute.attributeList.length > 0 &&
                        state.payeeAttribute.attributeList.map(item => {
                            const { parentId, obj } = action.payload;
                            if (item.id === parentId) {
                                let childItems = [...item.childRecord];
                                if (obj.length) {
                                    childItems = obj;
                                }
                                else {
                                    let index = null;

                                    if (obj.attributeId == null && obj.clientAttributeId == null) {
                                        index = childItems.findIndex(x => x.attributeId == obj.attributeId &&
                                            x.clientAttributeId == obj.clientAttributeId && x.fieldName == obj.fieldName);
                                    }
                                    else {
                                        // In default case clientAttributeId is not exist we need to find record on the basis of attributeId
                                        const exists = childItems.filter(function (o) {
                                            return o.hasOwnProperty("clientAttributeId");
                                        }).length > 0;

                                        if (exists && obj.clientAttributeId != undefined) {
                                            index = childItems.findIndex(x => x.clientAttributeId == obj.clientAttributeId);
                                        } else {
                                            index = childItems.findIndex(x => x.attributeId == obj.attributeId);
                                        }
                                    }

                                    if (index > -1) {
                                        childItems[index] = obj;
                                        item['childRecord'] = [...childItems];
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

        case 'DELETE_PAYEE_ATTRIBUTE':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    attributeList: state.payeeAttribute.attributeList.length > 0 &&
                        state.payeeAttribute.attributeList.map(item => {
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

        case 'UPDATE_PAYEE_DEFAULT_SELECTION':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    fileSelectionType: { ...state.payeeAttribute.fileSelectionType, defaultSchema: action.payload }
                }
            }

        case 'SAVE_PAYEE_ATTRIBUTE_SUCCESS':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute
                }
            }
        case 'SAVE_PAYEE_ATTRIBUTE_FAILED':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    error: action.payload
                }
            }
        case 'SET_PAYEE_EDIT_ID':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    editId: action.payload
                }
            }
        case 'UPDATE_PAYEE_FILE_HEADER':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    fileSelectionType: { ...state.payeeAttribute.fileSelectionType, [action.payload.type]: action.payload.hasFileHeader }
                }
            }
        case 'UPDATE_PAYEE_TYPE_SELECTION':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    fileSelectionType: { ...state.payeeAttribute.fileSelectionType, fileTypeId: action.payload }
                }
            }
        case 'UPDATE_PAYEE_DEFAULT_USER':
            return {
                ...state,
                payeeAttribute: {
                    ...state.payeeAttribute,
                    fileSelectionType: { ...state.payeeAttribute.fileSelectionType, isDefaultUser: action.payload }
                }
            }
        default:
            return {
                ...state
            }
    }
}
