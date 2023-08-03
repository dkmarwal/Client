import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';
const cookies = new Cookies();
axios.interceptors.request.use(
  request => {
    request.headers['accept-language'] = i18n.language;
    return request;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(function (response) {
  // Do something with response data
  if(response.status==401){
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
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

export const getPayeeAuthenticationSettingsData = async (clientId, flag) => {
    const url = flag ? `${config.apiBase.clientConfigService}/b2c/clients/${clientId}/verification-settings?isOnboarding=1` : 
    `${config.apiBase.clientConfigService}/b2c/clients/${clientId}/verification-settings`;
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: url,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};

export const savePayeeAuthenticationSettingsData = async (clientId, data) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/clients/${clientId}/verification-settings`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data),
        });
        return await response.data;
    } catch (error) {
        return {
            ...error.response.data,
        };
    }
};

export const saveNamingConventionData = async (clientId, data) => {
  try {
      const accessToken = await getAccessToken()
      const response = await axios({
          url: `${config.apiBase.clientConfigService}/b2c/file/naming/convention/all?clientId=${clientId}`,
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`,
              'pragma': 'no-cache',
          },
          data: JSON.stringify(data),
      });
      return await response.data;
  } catch (error) {
      return {
          ...error.response.data,
      };
  }
};

export const saveFileTypeId = async (clientId, data) => {
  try {
      const accessToken = await getAccessToken()
      const response = await axios({
          url: `${config.apiBase.clientConfigService}/b2c/file/?clientId=${clientId}`,
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`,
              'pragma': 'no-cache',
          },
          data: JSON.stringify(data),
      });
      return await response.data;
  } catch (error) {
      return {
          ...error.response.data,
      };
  }
};

export const updateFileSettingsData= async (clientId, data) => {
  try {
      const accessToken = await getAccessToken()
      const response = await axios({
          url: `${config.apiBase.clientConfigService}/b2c/file-settings?clientId=${clientId}`,
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${accessToken}`,
              'pragma': 'no-cache',
          },
          data: JSON.stringify(data),
      });
      return await response.data;
  } catch (error) {
      return {
          ...error.response.data,
      };
  }
};
