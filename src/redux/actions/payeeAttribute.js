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

export const getPayeeAttributeList = (id) => async dispatch => {
    const accessToken = await getAccessToken();
    try {
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/payee/attributes/listCustom?fileTypeId=${csvFileFormat.PAYEE}`,
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
                type: 'PAYEE_ATTRIBUTE_FETCH_SUCCESS',
                payload: responseBody?.data?.attributeRecords || [],
                fileSelectionType: id ? { ...responseBody?.data?.fileSelectionType, fileTypeId: id } : responseBody?.data?.fileSelectionType || { isDefaultUser: true }
            })
            return true;
        }
        dispatch({
            type: "PAYEE_ATTRIBUTE_FETCH_ERROR",
            payload: responseBody.message || translatedData.SomethingWentWrong,
        });
        return false;
    } catch (error) {
        dispatch({
            type: "PAYEE_ATTRIBUTE_FETCH_ERROR",
            payload: error.message || translatedData.ErrorOccurred,
        });
        return false;
    }
};

export const fetchDefaultPayeeAttributeList = (id) => async dispatch => {
    const accessToken = await getAccessToken();
    try {
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/payee/attributes/listDefault?fileTypeId=${csvFileFormat.PAYEE}`,
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
                type: 'PAYEE_ATTRIBUTE_FETCH_SUCCESS',
                payload: responseBody?.data?.attributeRecords || [],
                fileSelectionType: responseBody?.data && responseBody.data.fileSelectionType ?
                    { ...responseBody.data.fileSelectionType, fileTypeId: id } : {}
            })
            return true;
        }
        dispatch({
            type: "PAYEE_ATTRIBUTE_FETCH_ERROR",
            payload: responseBody.message || translatedData.SomethingWentWrong,
        });
        return false;
    } catch (error) {
        dispatch({
            type: "PAYEE_ATTRIBUTE_FETCH_ERROR",
            payload: error.message || translatedData.ErrorOccurred,
        });
        return false;
    }
}

export const reorderPayeeAttributes = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'REORDER_PAYEE_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const deleteCustomPayeeAttributes = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'DELETE_PAYEE_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const updatePayeeAttribute = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYEE_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const addCustomPayeeAttributes = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'CUSTOM_ADD_PAYEE_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const updateCustomPayeeAttributes = (obj, parentId) => async dispatch => {
    dispatch({
        type: 'CUSTOM_UPDATE_PAYEE_ATTRIBUTE',
        payload: { obj, parentId }
    })
}

export const updateFileTypePayeeDefaultSelection = (defaultSchema) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYEE_DEFAULT_SELECTION',
        payload: defaultSchema
    })
}

export const setPayeeEditId = (id) => async dispatch => {
    dispatch({
        type: 'SET_PAYEE_EDIT_ID',
        payload: id
    })
}

export const updatePayeeFileHeader = (hasFileHeader, type) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYEE_FILE_HEADER',
        payload: { hasFileHeader, type }
    })
}

export const savePayeeAttributes = ({ clientId, items, fileSelectionType }) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/payee/attributes/create`,
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
                type: "SAVE_PAYEE_ATTRIBUTE_SUCCESS"
            });
            return true;
        }
        dispatch({
            type: "SAVE_PAYEE_ATTRIBUTE_FAILED",
            payload: responseBody.message || translatedData.SomethingWentWrong,
        });
        return false;
    } catch (error) {
        dispatch({
            type: "SAVE_PAYEE_ATTRIBUTE_FAILED",
            payload: error.message || translatedData.ErrorOccurred,
        });
        return false;
    }
}

export const updatePayeeFileTypeSelection = (fileTypeId) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYEE_TYPE_SELECTION',
        payload: fileTypeId
    })
}

export const updatePayeeDefaultUser = (value) => async dispatch => {
    dispatch({
        type: 'UPDATE_PAYEE_DEFAULT_USER',
        payload: value
    })
}