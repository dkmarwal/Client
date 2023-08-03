import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';
import { csvFileFormat } from '~/config/entityTypes';

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

export const getVendorPayments = async (payeeId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/payments?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getBulkRemittances = async (payeeId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/bulk-remittance-info?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const downloadPaymentFileFormat = async (isDefaultSchema) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/client/payment/format/download?isDefaultSchema=${isDefaultSchema ? 1 : 0}&fileTypeId=${csvFileFormat.PAYMENT}`,
      method: "GET",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      // data: JSON.stringify({
      //   //clientId: [portalProfileId] || [],
      //   //clientId: clientIds || []
      // }),
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
export const updateusbankCancelPayment = async (data) =>  {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/CancelPayment`,
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
    return error.response;
  }
}
export const downloadPayeeFileFormat = async (isDefaultSchema) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payee/attribute/format/download?isDefaultSchema=${isDefaultSchema ? 1 : 0}&fileTypeId=${csvFileFormat.PAYEE}`,
      method: "GET",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      // data: JSON.stringify({
      //   //clientId: [portalProfileId] || [],
      //   //clientId: clientIds || []
      // }),
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const approvePayment = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/ActionOnPaymentApproval`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(payload),
    });
    const responseBody = await response?.data;
    return responseBody;
  } catch (error) {
    return {
      message: error?.response && error?.response?.data?.message,
      data: {},
      error: true,
    };
  }
};

export const rejectPayment = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/ActionOnPaymentRejection`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(payload),
    });
    const responseBody = await response?.data;
    return responseBody;
  } catch (error) {
    return {
      message: error?.response && error?.response?.data?.message,
      data: {},
      error: true,
    };
  }
};
