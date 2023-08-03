import axios from "axios";
import config from "~/config";
import Cookies from "universal-cookie";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';

const cookies = new Cookies();
const language = cookies.get("localeLang") || "en";
const translatedData = i18n.logger.options.resources[language].translation.componentData.reduxData;

axios.interceptors.request.use(
  request =>{
    request.headers['accept-language'] = i18n.language;
    request.headers['pragma'] = 'no-cache';
    return request;
  },
  error =>{
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    if(response.status==401){
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
   }
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status == 401) {
      let cookies = new Cookies();
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

export const getNotificationOptions = async (portalTypeId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.notificationService}/notification/type?portalTypeId=${portalTypeId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      // data: JSON.stringify(data),
    });

    if (response && response.data) {
      return response.data;
    }
    return {
      error: true,
      message: translatedData.responseFormatException,
    };
  } catch (error) {
    return {
      error: true,
      message: translatedData.ServerException,
    };
  }
};

export const getNotifications = async (userId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.notificationService}/notification/user?userId=${userId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response && response.data) {
      return response.data;
    }
    return {
      error: true,
      message: translatedData.responseFormatException,
    };
  } catch (error) {
    return {
      error: true,
      message: translatedData.ServerException,
    };
  }
};

export const saveNotificationSetting = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.notificationService}/notification/type`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    });

    if (response) {
      return response;
    }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const processNotificationsAction = async (
  userId,
  NotificationId,
  action
) => {
  try {
    const data = {
      userId: userId,
      notificationId: NotificationId,
      action: action,
    };
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.notificationService}/notification/user/action`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    });

    if (response) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const getUserNotifications = async ({ userId, portalTypeId }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.notificationService}/notification/type/user?userId=${userId}&portalTypeId=${portalTypeId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response && response.data) {
      return response.data;
    }
    return {
      error: true,
      message: translatedData.responseFormatException,
    };
  } catch (error) {
    return {
      error: true,
      message: translatedData.ServerException,
    };
  }
};
