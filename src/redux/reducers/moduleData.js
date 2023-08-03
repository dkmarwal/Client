
export default function fetchModuleData(state = {}, action = {}) {
	switch (action.type) {
		case 'FETCH_MODULE_DATA':
				var data = action.payload;
				
				return {...state,...data};
		default:
			return state;
	}
}
