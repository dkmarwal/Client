import Cookies from "universal-cookie";
import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';
import { csvFileFormat } from '~/config/entityTypes';

const cookies = new Cookies();
const language = cookies.get("localeLang") || "en";
const translatedData = i18n.logger.options.resources[language].translation.componentData.reduxData;

axios.interceptors.request.use(
    request => {
        request.headers['accept-language'] = i18n.language;
        return request;
    },
    error => {
        return Promise.reject(error);
    }
);

export const getPaymentAttributeList = (id) => async dispatch => {
    const accessToken = await getAccessToken();
    try {
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/client/payment/attributes/listDynamic?fileTypeId=${csvFileFormat.PAYMENT}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache'
            }
        });
        // const attributeList = [
        //     {
        //         id: 0,
        //         name: "File Header",
        //         subText: 'The sub title of file header',
        //         children: [
        //             { id: 1, name: "Record Count", dataType: 1, minLength: 0, maxLength: 0, preference: 1 },
        //             { id: 2, name: "Total Amount", dataType: 3, minLength: 2, maxLength: 8, preference: 0 },
        //             { id: 3, name: "Total Amount", dataType: 1, minLength: 0, maxLength: 0, preference: 0 },
        //             { id: 4, name: "Flag", dataType: 2, minLength: 0, maxLength: 0, preference: 1 }
        //         ]
        //     },
        //     {
        //         id: 5,
        //         name: "Payment Record Details",
        //         subText: `The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
        //         children: [
        //             { id: 6, name: "Payment Type", dataType: 1, minLength: 0, maxLength: 0, preference: 1 },
        //             { id: 7, name: "Company ID", dataType: 3, minLength: 0, maxLength: 0, preference: 0 },
        //             { id: 8, name: "Payment Amount", dataType: 1, minLength: 0, maxLength: 0, preference: 1 },
        //             { id: 9, name: "Pay Date", dataType: 2, minLength: 0, maxLength: 0, preference: 1 }
        //         ]
        //     }];
        const responseBody = await response.data;
        if (!responseBody.error) {
            dispatch({
                type: 'PAYMENT_ATTRIBUTE_FETCH_SUCCESS',
                payload: responseBody?.data?.attributeRecords || [],
                fileSelectionType: id ? { ...responseBody?.data?.fileSelectionType, fileTypeId: id } : responseBody?.data?.fileSelectionType || { isDefaultUser: true }
            })
            return true;
        }
        dispatch({
            type: "PAYMENT_ATTRIBUTE_FETCH_ERROR",
            payload: responseBody.message || translatedData.SomethingWentWrong,
        });
        return false;
    } catch (error) {
        dispatch({
            type: "PAYMENT_ATTRIBUTE_FETCH_ERROR",
            payload: error.message || translatedData.ErrorOccurred,
        });
        return false;
    }
}

export const fetchDefaultPaymentAttributeList = (id) => async dispatch => {
    const accessToken = await getAccessToken();
    try {
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/client/attributes/payment/listDefault?fileTypeId=${csvFileFormat.PAYMENT}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache'
            }
        });

        const responseBody = await response.data;
        if (!responseBody.error) {
            dispatch({
                type: 'PAYMENT_ATTRIBUTE_FETCH_SUCCESS',
                payload: responseBody?.data?.attributeRecords || [],
                fileSelectionType: responseBody?.data && responseBody.data.fileSelectionType ?
                    { ...responseBody.data.fileSelectionType, fileTypeId: id } : {}
            })
            return true;
        }
        dispatch({
            type: "PAYMENT_ATTRIBUTE_FETCH_ERROR",
            payload: responseBody.message || translatedData.SomethingWentWrong,
        });
        return false;
    } catch (error) {
        dispatch({
            type: "PAYMENT_ATTRIBUTE_FETCH_ERROR",
            payload: error.message || translatedData.ErrorOccurred,
        });
        return false;
    }
}

export const savePaymentAttributes = ({ clientId, items, fileSelectionType }) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/client/payment/attributes`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                fileSelectionType: fileSelectionType,
                attributeList: items || []
            })
        });
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: "SAVE_PAYMENT_ATTRIBUTE_SUCCESS",
            });
            return true;
        }
        dispatch({
            type: "SAVE_PAYMENT_ATTRIBUTE_FAILED",
            payload: responseBody.message || translatedData.SomethingWentWrong,
        });
        return false;
    } catch (error) {
        dispatch({
            type: "SAVE_PAYMENT_ATTRIBUTE_FAILED",
            payload: error.message || translatedData.ErrorOccurred,
        });
        return false;
    }
}

export const updatePaymentAttribute = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYMENT_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const addCustomPaymentAttributes = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'CUSTOM_ADD_PAYMENT_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const updateCustomPaymentAttributes = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'CUSTOM_UPDATE_PAYMENT_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const deleteCustomPaymentAttributes = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'DELETE_PAYMENT_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const reorderPaymentAttributes = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'REORDER_PAYMENT_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const updatePaymentFileTypeSelection = (fileTypeId) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYMENT_TYPE_SELECTION',
        payload: fileTypeId
    })
}

export const updateFileTypePaymentDefaultSelection = (defaultSchema) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYMENT_DEFAULT_SELECTION',
        payload: defaultSchema
    })
}

export const updatePaymentFileHeader = (hasFileHeader, type) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYMENT_FILE_HEADER',
        payload: { hasFileHeader, type }
    })
}

export const setPaymentEditId = (id) => async dispatch => {
    dispatch({
        type: 'SET_EDIT_ID',
        payload: id
    })
}

export const setTabValue = (value) => async dispatch => {
    dispatch({
        type: 'SET_TAB_VALUE',
        payload: value
    })
}

export const getDataType = () => async dispatch => {
    const accessToken = await getAccessToken();
    try {
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/client/attributes/datatype`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })

        if (response.data && !response.data.error) {
            const optionList = {
                dataType: response.data.data.rows,
                preference: [
                    { name: 'Optional', value: 0 },
                    { name: 'Mandatory', value: 1 }
                ]
            }
            dispatch({
                type: 'DATATYPE_FETCH_SUCCESS',
                payload: optionList
            })
            return true;
        }
    } catch (error) {
        dispatch({
            type: 'DATATYPE_FETCH_ERROR',
            payload: error
        })
    }
}

export const updatePaymentDefaultUser = (value) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYMENT_DEFAULT_USER',
        payload: value
    })
}