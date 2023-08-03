import Cookies from "universal-cookie";
import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';

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

export const fetchSuppliersFilterChips = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/filters?clientId=${clientId}&implementationProgram=${data.programList}&remitToId=${encodeURIComponent(data.id)}&state=${data.location}&companyName=${encodeURIComponent(data.name)}&paymentMethod=${data.paymentList}&status=${data.status}&newFilter=true`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchSuppliersFilterList = async (key, clientId, data, limit, page) => {  
  let offset = (page * limit);
  const urlLink = key === "" ? `${config.apiBase.payeeService}/payees?clientId=${clientId}&implementationProgram=${data.programList}&remitToId=${encodeURIComponent(data.id)}&state=${data.location}&companyName=${encodeURIComponent(data.name)}&paymentMethod=${data.paymentList}&status=${data.status}&limit=${limit}&offset=${offset}&sort=${data.sort}&sortType=${data.sortType}` :
    `${config.apiBase.payeeService}/payees?${key}&clientId=${clientId}&implementationProgram=${data.programList}&remitToId=${encodeURIComponent(data.id)}&state=${data.location}&companyName=${encodeURIComponent(data.name)}&paymentMethod=${data.paymentList}&status=${data.status}&limit=${limit}&offset=${offset}&sort=${data.sort}&sortType=${data.sortType}`;
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: urlLink,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};


export const fetchExportSuppliersFilterList = async (key, clientId, data, limit, page) => {
  let offset = (page * limit);
  const urlLink = key === "" ? `${config.apiBase.payeeService}/payees?clientId=${clientId}&implementationProgram=&remitToId=&state=&companyName=&paymentMethod=&status=undefined&offset=${0}&limit=-1` :
    `${config.apiBase.payeeService}/payees?${key}&clientId=${clientId}&implementationProgram=&remitToId=&state=&companyName=&paymentMethod=&status=undefined&offset=${0}&limit=-1`;
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: urlLink,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchSpecificVendorsDetails = async (clientId, payeeId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees?clientPayeeLinkId=${clientId}&clientId=${payeeId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchReadyForApprovalsList = async (clientId, limit, page) => {
  let offset = (page * limit);
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees?isApprovalPending=true&clientId=${clientId}&limit=${limit}&offset=${offset}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const disapprovePayee = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/disapprove?clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const revokePayee = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/revoke?clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchApprovedList = async (clientId, limit, page) => {
  let offset = (page * limit);
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees?isApproved=true&clientId=${clientId}&limit=${limit}&offset=${offset}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchContactInfo = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${id}/contacts`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchSupplierIds = async (payeeId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/remit-to?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchDefaultSupplierIds = async (payeeId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/default-remit-to?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const updateRemitToId = async (payeeId, clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/remit-to?clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const removeRemitToId = async (payeeId, clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/remit-To?clientId=${clientId}`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        remitToId: data.toString().trim(),
      }),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const approveSupplier = async (payeeId, clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/payments/approve?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      ...error.response.data,
    };
  }
};

export const fetchCustomFilter = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/clients/${clientId}/payment-types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const isPayeeEditable = async (payeeId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/general-settings`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchPayeeDetails = async (payeeId, clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

/*
 update b2c user name, email and phone
*/
export const updatePayeeDetails = async (consumerId, campaignDetailId, data) => {
    const url = consumerId ? `${config.apiBase.consumerService}/consumer?consumerId=${consumerId}`: `${config.apiBase.consumerService}/consumer?campaignDetailId=${campaignDetailId}`
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: url,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};
export const updatesppPayeeDetails = async (consumerId, campaignDetailId, data) => {
  const url = `${config.apiBase.consumerService}/payee-info?consumerId=${consumerId}`
  try {
  const accessToken = await getAccessToken();
  const response = await axios({
    url: url,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      'pragma': 'no-cache',
    },
    data: JSON.stringify(data),
  });
  const responseBody = await response.data;
  return responseBody;
} catch (error) {
  return {
    error: true,
    message:
      (error.response && error.response.data.message) ||
      translatedData.ErrorOccurred,
    data: { rows: [] },
  };
}
};
export const updatePayeeContactDetails = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payer-payees/contacts`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchContactTypeList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/contact-types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchLocationsList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/location-types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchPayeeLocationsDetails = async (payeeId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/locations`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};
export const fetchPayeeValidationDetails = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/${id}/clientValidationList`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    })

    let responseBody = await response.data
    return responseBody;
  }
  catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
}

export const updatePayeeLocationDetails = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payer-payees/locations`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const fetchSuppliersCount = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/consumer/onboarding/count`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const updatePayeeBankDetails = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payer-payees/payments/bank-account`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const updateVirtualCardInfo = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payer-payees/payments/virtual-card`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: { rows: [] },
    };
  }
};

export const updateRPUSelectedTab = (tab) => async (dispatch) => {
  try {
    dispatch({
      type: "UPDATE_PAYEE_SELECTED_TAB",
      payload: tab,
    });
  } catch (error) {
    throw translatedData.ErrorOccurred;
  }
};