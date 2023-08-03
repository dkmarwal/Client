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

/*
Get Payee Notification
*/
export const getNotifications = ({userId, portalTypeId}) => async (dispatch) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.notificationService}/notification/type/user?userId=${userId}&portalTypeId=${portalTypeId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if(responseBody.error == false) {
            dispatch({
                type: 'NOTIFICATION_FETCH_SUCCESS',
                payload: responseBody.data
            })
            return true;
        }
        dispatch({
            type: 'NOTIFICATION_FETCH_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'NOTIFICATION_FETCH_FAILED',
            payload: error.response && error.response.data.message || translatedData.ErrorOccurred
        })
        return false;
    }
}

/*
set payee notification
*/
export const setNotification = ({ userId, portalProfileId, portalTypeId, notificationData }) => async dispatch => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
        url: `${config.apiBase.notificationService}/notification/type`,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`,
            'pragma': 'no-cache',
        },
        data: JSON.stringify({
            userId: userId,
            portalTypeId: portalTypeId,
            portalProfileId: portalProfileId,
            notificationData: notificationData
        })
    });

        const responseBody = await response.data;
        if(responseBody.error == false) {
            return true;
        }
        dispatch({
            type: 'NOTIFICATION_SET_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'NOTIFICATION_SET_FAILED',
            payload: error.response && error.response.data.message || translatedData.ErrorOccurred
        })
        return false;
    }
};