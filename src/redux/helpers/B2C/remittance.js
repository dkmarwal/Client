import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';

const cookies = new Cookies();
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

export const fetchB2CRemittanceParams = async (clientId, flag) => {
    try {
      const accessToken = await getAccessToken();
      const apiURL = flag ? `${config.apiBase.clientConfigService}/b2c/remittance/information?clientId=${clientId}&isOnboarding=1` :
        `${config.apiBase.clientConfigService}/b2c/remittance/information?clientId=${clientId}`;
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

  export const getB2CRemDetails = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/remittance/details`,
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
  
export const getB2CClientRemConfig = async (clientId, flag) => {
    try {
      const accessToken = await getAccessToken();
      const apiURL = flag ? `${config.apiBase.clientConfigService}/b2c/remittance/configurations?clientId=${clientId}&isOnboarding=1` :
        `${config.apiBase.clientConfigService}/b2c/remittance/configurations?clientId=${clientId}`;
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

  export const updateB2CRemittanceParams = async (id, data) => {
    const postData = { clientId: parseInt(id) };
    data.forEach((item) => {
      postData[item.key] = item.selected ? 1 : 0;
    });
  
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/remittance/parameters`,
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

  export const updateB2CRemittanceConfig = async (clientId, data) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/remittance/configurations?clientId=${clientId}`,
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
  
  export const postB2CClientMailCall = async (data) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/successful/onboardingEmail`,
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

  export const getRemittanceSettingShow = async(clientId,flag) => {
    try {
      const apiURL = flag ? `${config.apiBase.clientConfigService}/b2c/remittance/setting?clientId=${clientId}&isOnboarding=1` :
      `${config.apiBase.clientConfigService}/b2c/remittance/setting?clientId=${clientId}`;
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
        url: `${config.apiBase.clientConfigService}/b2c/remittance/setting`,
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

  
/* Remiitance systems api */

export const fetchRemittanceScheme = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/remittance/scheme`,
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

export const getClientRemScheme = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/clients/remittance/scheme?clientId=${clientId}`,
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

export const saveClientRemScheme = async (clientId,data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/clients/remittance/scheme?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data:{
        remittanceSchemeId :data
      }
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};