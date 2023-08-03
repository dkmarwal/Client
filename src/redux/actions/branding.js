import Cookies from "universal-cookie";
import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
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

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    if (response.status == 401) {
      let cookies = new Cookies();
      cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
      cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
      cookies.remove('@clientUserId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return response;
  },
   function (error) {
    // Do something with response error
    if (error.response.status == 401) {
      let cookies = new Cookies();
      cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
      cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
      cookies.remove('@clientUserId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    } else {
        return error.response;
    }
  }
);

/*
UPDATE SMS NOTIFICATION
*/

export const updateSmsNotification = (payload) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/branding/sms/template`,
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(payload)

    })
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "SMS_EMAIL_NOTIFICATION_UPDATE_SUCCESS",
        payload: {
          branding:{
            isActive: responseBody.data.isActive || 1,
          }
        },
      });
      return true;
    }
    dispatch({
      type: "SMS_EMAIL_NOTIFICATION_UPDATE_FAILURE",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "SMS_EMAIL_NOTIFICATION_UPDATE_FAILURE",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
UPDATE EMAIL NOTIFICATION
*/

export const updateEmailNotification = (payload) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/branding/email/template`,
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(payload)

    })
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "SMS_EMAIL_NOTIFICATION_UPDATE_SUCCESS",
        payload: {
          branding:{
            isActive: responseBody.data.isActive || 1,
          }
        },
      });
      return true;
    }
    dispatch({
      type: "SMS_EMAIL_NOTIFICATION_UPDATE_FAILURE",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "SMS_EMAIL_NOTIFICATION_UPDATE_FAILURE",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};