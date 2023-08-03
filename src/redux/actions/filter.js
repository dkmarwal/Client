export const updateDateFilter = (filterName, filterData) => {
	return {
		type: 'UPDATE_DATE_FILTER',
		payload: {
			[filterName]: filterData
		}
	}
}

