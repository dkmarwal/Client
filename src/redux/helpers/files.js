import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';
import { PayerTypes } from '~/config/entityTypes';
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

export const fetchFileList = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/GetPaymentFileDetail`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: []
    };
  }
};

export const fetchFileStatus = async (appType) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/GetAllPaymentFileStatus?BusinessType=${appType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchFileFigureStatus = async (id, appType) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/GetPaymentFileFigureStatus?ClientID=${id}&BusinessType=${appType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchFileByFileId = async (fileId, appType) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/GetPaymentFileByFileID?fileID=${fileId}&BusinessType=${appType}`,
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
};

export const fetchFileExceptionsById = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/GetPaymentExceptionsByFileID`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(payload)
    });
    return response.data;
  } catch (error) {
    return { ...error.response.data };
  }
}

export const GetIsPaymentFileExist = async (id, name,payerId,num) => {
  try {
    const accessToken = await getAccessToken();
    const apiURL = payerId===PayerTypes.CARDS ? `${config.apiBase.paymentService}/GetIsPaymentFileExist?clientID=${id}&fileName=${encodeURIComponent(name)}&fileFormatId=0&payerType=2` : 
    `${config.apiBase.paymentService}/GetIsPaymentFileExist?clientID=${id}&fileName=${name}&fileFormatId=${num}`;
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
};

export const updatePaymentFileAction = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/PaymentFileAction`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};
export const downloadBankFile = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/bank-account/file/download/${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const downloadPaymentFile = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payment/file/download/${id}`,
      method: "GET",
      responseType: 'arraybuffer',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const downloadRemittanceFile = async (paymentId, clientId, flag, isRRD, businessType) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: flag === true ?
        `${config.apiBase.clientConfigService}/remittance/file/download?paymentId=${paymentId}&clientId=${clientId}&IsRRD=${isRRD}&BusinessType=${businessType}` :
        `${config.apiBase.clientConfigService}/remittance/file/download?paymentId=${paymentId}&clientId=${clientId}&BusinessType=${businessType}`,
      method: "GET",
      responseType: 'blob',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const uploadFile = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payment/file/upload`,
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: data,
    });
    return response;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const fetchPaymentFileStatus = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/GetPaymentFileStatusByFileID?FileID=${id}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return error && error.response ? { ...error.response.data } : "";
  }
};
export const fetchPaymentUSbankFileStatus = async (id,clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/GetPaymentFileStatusByFileID?FileID=${id}&clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return error && error.response ? { ...error.response.data } : "";
  }
};

export const downloadResponseFile = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payment/response/file/download/${id}`,
      method: "GET",
      responseType: 'arraybuffer',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      }
    });
    return response;
  } catch (error) {
    return { ...error.response.data };
  }
};

export const fetchActionTypeList = async (clientId, payerTypeId, appType) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/GetActionType?BusinessType=${appType}&PayerTypeId=${payerTypeId}&ClientID=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return error && error.response ? { ...error.response.data } : "";
  }
};
