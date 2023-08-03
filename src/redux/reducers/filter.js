var initialState = (window.initialState && window.initialState.selectedFilter) || {
	
	selectedFilter: {
        startDate : '',
        endDate : ''
	}
}

export default function filters(state = initialState, action = {}) {
	switch (action.type) {
		case 'UPDATE_DATE_FILTER':
			return {
				...state,
				selectedFilter: {
					...state.selectedFilter,
					...action.payload
				}
			}
		
		default:
			return {
				...state
			}
	}
}
