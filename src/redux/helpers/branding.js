import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';
let cookies = new Cookies();
let token = cookies.get("@clientAccessToken");
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

export const fetchFAQData = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/branding/faq?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const fetchEmailTokens = async (appType) => {
  // try {
  //   const accessToken = await getAccessToken();
  //   const response = await axios({
  //     url: `${config.apiBase.clientService}/clients/tokens/list?templateId=1`,
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   });
  //   const responseBody = await response.data;
  //   return responseBody;
  // } catch (error) {
  //   return {
  //     message:
  //       (error.response && error.response.data.message) ||
  //       translatedData.ErrorOccurred,
  //     data: {},
  //     error: true,
  //   };
  // }

  const b2bTokens = [
    [
      {
        tokenId: 1,
        tokenCode: "clientName",
        templateId: 1,
        clientId: 413976669,
      },
      /*{
        tokenId: 2,
        tokenCode: "OTP",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 3,
        tokenCode: "ConsumerName",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 4,
        tokenCode: "LoginURL",
        templateId: 1,
        clientId: 413976669,
      },*/
    ],
    [
      {
        tokenId: 1,
        tokenCode: "clientName",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 2,
        tokenCode: "OTP",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 3,
        tokenCode: "ConsumerName",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 4,
        tokenCode: "LoginURL",
        templateId: 1,
        clientId: 413976669,
      },
    ],
  ];

  const b2cTokens = [
    [
      {
        tokenId: 1,
        tokenCode: "clientName",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 2,
        tokenCode: "ClientContactEmail",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 3,
        tokenCode: "ClientContactPhone",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 4,
        tokenCode: "ConsumerFirstName",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 5,
        tokenCode: "ConsumerLastName",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 6,
        tokenCode: "ConsumerIdentifier",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 7,
        tokenCode: "ConsumerName",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 8,
        tokenCode: "DefaultPaymentType",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 9,
        tokenCode: "EnrollmentDays",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 10,
        tokenCode: "PaymentAmount",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 11,
        tokenCode: "PaymentNotes",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 12,
        tokenCode: "WelcomeAuthURL",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 13,
        tokenCode: "PaymentMethod",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 14,
        tokenCode: "PaymentReference",
        templateId: 1,
        clientId: 413976669,
      }

    ],
    [
      {
        tokenId: 1,
        tokenCode: "clientName",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 2,
        tokenCode: "OTP",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 3,
        tokenCode: "ConsumerName",
        templateId: 1,
        clientId: 413976669,
      },
      {
        tokenId: 4,
        tokenCode: "LoginURL",
        templateId: 1,
        clientId: 413976669,
      },
    ],
  ];
  const responseBody = await {
    error: false,
    message: translatedData.TokenList,
    data: appType===2? b2cTokens:b2bTokens,
  };
  return responseBody;
};

export const fetchEmailTemplateData = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/branding/email/template`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const fetchClientLogoData = async (clientId, appType) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/branding/enrollment/site?clientId=${clientId}&appType=${appType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const saveClientLogoData = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/branding/logo`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(payload),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const fetchPrivacyPolicyData = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/branding/privacy/policy?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const fetchRemittanceTemplateData = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/branding/remmitance/template`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const saveRemittanceTemplateData = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/branding/remmitance/template`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(payload),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const fetchTokens = async (clientId, keyName) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/${keyName}/information?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const fetchEmailTemplates = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/branding/email/template`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const saveEmailTemplates = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/branding/email/template`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        "clientTemplateId": payload?.clientTemplateId || null,
        "clientId": payload?.clientId || null,
        "templateId": payload?.templateId || null,
        //"crmTemplateCode": payload?.crmTemplateCode || null,
        "title": payload?.title || null,
        "description": payload?.description || null,
        "source": payload?.source || null,
        "subject": payload?.subject || null,
        "body": payload?.body || null,
        //"isActive": payload?.isActive || null,
        //"isForClientUser": payload?.isForClientUser || null,
      }),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};
