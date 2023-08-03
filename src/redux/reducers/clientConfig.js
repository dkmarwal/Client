var initialState =  {
	clientConfig: (window.initialState && window.initialState.clientConfig) || {}
}
export default function clientConfig(state = initialState, action = {}) {
	switch (action.type) {
		case 'CLIENT_CONFIG_FETCH_SUCCESS':
			return {
				...state,
				clientConfig: {
					...action.payload,
					error: null
				}
			}
		case 'CLIENT_CONFIG_FETCH_ERROR':
			return {
				...state,
				clientConfig: {
					error: action.payload
				}
			}
		default:
			return {
				...state
			}
	}
}
