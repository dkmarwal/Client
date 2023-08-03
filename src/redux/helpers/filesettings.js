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

export const fetchFileType = async (isHippa) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/file/types?isHippa=${isHippa}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchSelectedFileType = async (clientId, flag) => {
  try {
    const accessToken = await getAccessToken();
    const apiURL = flag ? `${config.apiBase.clientConfigService}/file?clientId=${clientId}&isOnboarding=1` : `${config.apiBase.clientConfigService}/file?clientId=${clientId}`;
    const response = await axios({
      url: apiURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchPaymentMethods = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchNamingConvention = async (clientId, flag) => {
  try {
    const accessToken = await getAccessToken();
    const apiURL = flag ? `${config.apiBase.clientConfigService}/file/naming/convention?clientId=${clientId}&isOnboarding=1` : `${config.apiBase.clientConfigService}/file/naming/convention?clientId=${clientId}`;
    const response = await axios({
      url: apiURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchIncomingFileSettings = async (clientId, flag) => {
  try {
    const accessToken = await getAccessToken();
    const apiURL = flag ? `${config.apiBase.clientConfigService}/file/incoming/setting?clientId=${clientId}&isOnboarding=1` :
      `${config.apiBase.clientConfigService}/file/incoming/setting?clientId=${clientId}`;
    const response = await axios({
      url: apiURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchResponseFileSettings = async (clientId, flag) => {
  try {
    const accessToken = await getAccessToken();
    const apiURL = flag ? `${config.apiBase.clientConfigService}/file/response/setting?clientId=${clientId}&isOnboarding=1` :
      `${config.apiBase.clientConfigService}/file/response/setting?clientId=${clientId}`;
    const response = await axios({
      url: apiURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const updateIncomingFileSettings = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/file/incoming/setting?clientId=${clientId}`,
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
export const updateResponseFileSettings = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/file/response/setting?clientId=${clientId}`,
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
export const updatePaymentFileTypes = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/file/?clientId=${clientId}`,
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

/* Different update calls for settings page */

export const updatePostResponseFileSettings = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/file/response/all/setting?clientId=${clientId}`,
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
export const updatePostIncomingFileSettings = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/file/incoming/all/setting?clientId=${clientId}`,
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
/* B2C APis */

export const b2cFetchFileTypes = async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/file/types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const b2cFetchSelectedFileTypes = async (id, flag) => {
  try {
    const accessToken = await getAccessToken();
    const urlLink = flag ? `${config.apiBase.clientConfigService}/b2c/file?clientId=${id}&isOnboarding=1` :
      `${config.apiBase.clientConfigService}/b2c/file?clientId=${id}`;
    const response = await axios({
      url: urlLink,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const b2cFetchNamingConvention = async (id, flag) => {
  try {
    const accessToken = await getAccessToken();
    const urlLink = flag ? `${config.apiBase.clientConfigService}/b2c/file/naming/convention?clientId=${id}&isOnboarding=1` :
      `${config.apiBase.clientConfigService}/b2c/file/naming/convention?clientId=${id}`;
    const response = await axios({
      url: urlLink,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const b2cUpdatePaymentFileTypes = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/file/?clientId=${clientId}`,
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

export const b2cUpdateFileTypes = async (id, data) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/file/naming/convention?clientId=${id}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        fpid: data.fpid || null,
        clientUid: data.clientUid || null,
      }),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const b2cSettingUpdateFileTypes = async (id, data) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/file/naming/convention/all?clientId=${id}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        fpid: data.fpid || null,
        clientUid: data.clientUid || null,
      }),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchCampaignInfo = async (id, flag) => {
  try {
    const accessToken = await getAccessToken();
    const linkURL = flag ? `${config.apiBase.clientConfigService}/b2c/campaign/getFileConfiguration?clientId=${id}&isOnboarding=1` :
      `${config.apiBase.clientConfigService}/b2c/campaign/getFileConfiguration?clientId=${id}`;
    const response = await axios({
      url: linkURL,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const addCampaignFile = async (data) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/campaign/updateFileConfiguration`,
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

export const addSettingCampaignFile = async (data) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/updateCampaignFileInfo/all`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        "fileIdentifier": data.fileIdentifier || null,
        "fileExtension": data.fileExtension || null,
        "fileDelimiter": data.fileDelimiter || null,
        "clientId": data.clientId || null,
        "citiConnectID": data.citiConnectID || null
      }),
    });
    return await response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const b2cClientMailCall = async (data) => {
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