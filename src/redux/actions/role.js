import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';

const cookies = new Cookies();
const language = cookies.get("localeLang") || "en";
const translatedData = i18n.logger.options.resources[language].translation.componentData.reduxData;

axios.interceptors.request.use(
  request =>{
    request.headers['accept-language'] = i18n.language;  
    return request;  
  },
  error =>{
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(function (response) {
    // Do something with response data
    if (response.status == 401) {
      let cookies = new Cookies();
        cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
        cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
        cookies.remove('@clientUserId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return response;
  }, function (error) {
    // Do something with response error
    if (error.response.status == 401) {
        let cookies = new Cookies();
        cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
        cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
        cookies.remove('@clientUserId', { path: `${config.baseName}/` });
        window.location.href = `${config.baseName}/sessionout`;
      }
      return error.response;
});

export const fetchRoles = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.userService}/roles`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'ROLE_LIST_FETCH_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'ROLE_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'ROLE_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.ErrorOccurred
        })
        return false;
    }
}

export const fetchAccessRights = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.userService}/access-rights?portalTypeId=2`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'ACCESS_RIGHTS_FETCH_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'ACCESS_RIGHTS_FETCH_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'ACCESS_RIGHTS_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.ErrorOccurred
        })
        return false;
    }
}

export const fetchPermissions = (portalProfileId, roleId) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.userService}/permission?portalProfileId=${portalProfileId}&roleId=${roleId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'ACCESS_ROLE_PERMISSIONS_SUCCESS',
                payload: responseBody.data,
            })
            return true;
        }
        dispatch({
            type: 'ACCESS_ROLE_PERMISSIONS_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'ACCESS_ROLE_PERMISSIONS_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.ErrorOccurred
        })
        return false;
    }
}

export const createRole = (roleDetail) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.userService}/role`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                "roleName": roleDetail.roleName,
                "permission": roleDetail.permissions,
                "description": roleDetail.description
            })
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'ROLE_CREATE_SUCCESS',
                payload: { ...roleDetail, roldId: (responseBody.data && responseBody.data.roleId) || null }
            })
            return true;
        }
        dispatch({
            type: 'ROLE_CREATE_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'ROLE_CREATE_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.ErrorOccurred
        })
        return false;
    }
}

export const updateRole = (roleDetail) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.userService}/role?roleId=${roleDetail.roleId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                "roleName": roleDetail.roleName,
                "permission": roleDetail.permissions,
                "description": roleDetail.description
            })

        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'ROLE_UPDATE_SUCCESS',
                payload: roleDetail,
            })
            return true;
        }
        dispatch({
            type: 'ROLE_UPDATE_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;

    } catch (error) {
        dispatch({
            type: 'ROLE_UPDATE_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.ErrorOccurred
        })
        return false;
    }
}