import {getFormattedDate} from './utils'
export const defaultFromDate = getFormattedDate(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1))
export const defaultToDate = getFormattedDate(
    new Date(new Date().getFullYear(), new Date().getMonth(), 0)
  )
export const defaultReportData = {
    reportName: undefined,
    datatypeId: 1,
    dataTypeMappingId: [],
    parametersCount: 0,
    fromDate: defaultFromDate,
    toDate: defaultToDate,
    dateFilter: 'PM',
    subscription: false,
    dataType: 'Payment',
    frequency: null,
    frequencyId:null
}
export const defaultValidationChecks = {
    reportName:false,
    parametersCount: false,
    fromDate: false,
    toDate:false,
}
export const filters = [
    {
        label: "Previous Year",
        key: 1,
        value: 'PY'
    },
    {
        label: "Previous Quarter",
        key: 2,
        value: 'PQ'
    },
    {
        label: "Previous Month",
        key: 3,
        value: 'PM'
    },
    {
        label: "Last 30 Days",
        key: 4,
        value: 'LM'
    },
    {
        label: "Last 7 days",
        key: 5,
        value: 'LW'
    },
    {
        label: "Custom",
        key: 6,
        value: 'CUSTOM'
    }
]
