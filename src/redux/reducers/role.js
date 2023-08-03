const initialState = {
    role:{
        list: [],
        accessRights: [],
        permissions:[],
        totalCount:0,
        error: null,
    }
}

export default function role(state = initialState, action = {}) {
	switch (action.type) {
		case 'ROLE_LIST_FETCH_SUCCESS':
			return {
                ...state,
                role: {
                    ...state.role,
                    list: action.payload,
                    error: null,
                }
            }
        case 'ROLE_LIST_FETCH_FAILED':
			return {
                ...state,
                role: {
                    ...state.role,
                    error: action.payload
                }
            }
        case 'ACCESS_RIGHTS_FETCH_SUCCESS':
            return {
                ...state,
                role: {
                    ...state.role,
                    accessRights: action.payload,
                    error: null,
                }
            }
        case 'ACCESS_RIGHTS_FETCH_FAILED':
            return {
                ...state,
                role: {
                    ...state.role,
                    error: action.payload
                }
            }
        case 'ACCESS_ROLE_PERMISSIONS_SUCCESS':
            return {
                ...state,
                role: {
                    ...state.role,
                    permissions: action.payload,
                    error: null,
                }
            }
        case 'ACCESS_ROLE_PERMISSIONS_FAILED':
            return {
                ...state,
                role: {
                    ...state.role,
                    error: action.payload
                }
            }
        case 'ROLE_CREATE_SUCCESS':
			return {
                ...state,
                role: {
                    ...state.role,
                    list: [...state.role.list, action.payload],
                    totalCount: state.role.totalCount + 1,
                    error: null,
                }
            }
        case 'ROLE_CREATE_FAILED':
			return {
                ...state,
                role: {
                    ...state.role,
                    error: action.payload
                }
            }
        case 'ROLE_UPDATE_SUCCESS':
			return {
                ...state,
                role: {
                    ...state.role,
                    error: null,
                }
            }
        case 'ROLE_UPDATE_FAILED':
			return {
                ...state,
                role: {
                    ...state.role,
                    error: action.payload
                }
            }
		default:
			return {
				...state
			}
	}
}