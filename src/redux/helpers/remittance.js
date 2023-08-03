import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';

const cookies = new Cookies();
const language = cookies.get("localeLang") || "en";
const translatedData =
  i18n.logger.options.resources[language].translation.componentData.reduxData;
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

export const fetchRemittanceParams = async (clientId, flag) => {
  try {
    const accessToken = await getAccessToken();
    const apiURL = flag ? `${config.apiBase.clientConfigService}/remittance/information?clientId=${clientId}&isOnboarding=1` :
      `${config.apiBase.clientConfigService}/remittance/information?clientId=${clientId}`;
    const response = await axios({
      url: apiURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getRemDetails = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/remittance/details`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getCSVSelected = async () => {
  try {
      const accessToken = await getAccessToken()
      const response = await axios({
          url: `${config.apiBase.clientConfigService}/csv/cc/client`,
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
              'pragma': 'no-cache',
          },
      })
      if (response && response.data) {
          return response.data;
      }
      return {
          error: true,
          message: response.message || translatedData.SomethingWentWrong
      }
  }catch (error) {
    return error?.response?.data
            ? { ...error.response.data }
            : "";
  }

}

export const getClientRemConfig = async (clientId, flag) => {
  try {
    const accessToken = await getAccessToken();
    const apiURL = flag ? `${config.apiBase.clientConfigService}/remittance/configurations?clientId=${clientId}&isOnboarding=1` :
      `${config.apiBase.clientConfigService}/remittance/configurations?clientId=${clientId}`;
    const response = await axios({
      url: apiURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const updateRemittanceParams = async (id, data) => {
  const postData = { clientId: parseInt(id) };
  data.forEach((item) => {
    postData[item.key] = item.selected ? 1 : 0;
  });

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/remittance/parameters`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: postData,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const updateCCRemittanceParams = async (id, data) => {
  const postData = { clientId: parseInt(id) };
  data.forEach((item) => {
    postData[item.key] = item.selected ? 1 : 0;
  });

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/remittance/parameters/cc/csv`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: postData,
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const updateRemittanceConfig = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/remittance/configurations?clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const postClientMailCall = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/successful/onboarding`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: data,
    });
    return response.data;
  } catch (error) {
    return { ...error.response.data };
  }
};

/* Kaiser hide show remittances API*/
export const fetchClientConfig = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/getClientConfiguration`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getRemittanceSettingShow = async(clientId,flag) => {
  try {
    const apiURL = flag ? `${config.apiBase.clientConfigService}/remittance/setting?clientId=${clientId}&isOnboarding=1` :
    `${config.apiBase.clientConfigService}/remittance/setting?clientId=${clientId}`;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: apiURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return { ...error.response.data };
  }
}

export const updateRemittanceSettingShow = async(data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/remittance/setting`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data
    });
    return response.data;
  } catch (error) {
    return { ...error.response.data };
  }
}