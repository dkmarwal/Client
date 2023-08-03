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
    if (error.response.status === 401) {
      let cookies = new Cookies();
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }

    return error.response;
  }
);

// const urlLink = flag ? `${config.apiBase.clientConfigService}/b2c/file?clientId=${id}&isOnboarding=1` :

export const fetchFileSettingData =async (clientId) => {
  
    try {
      
      const accessToken = await getAccessToken();
      
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/file-settings?clientId=${clientId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          'pragma': 'no-cache',
        },
      });
      return response.data;
    } catch (error) {
        return error.response.data;
    }
};