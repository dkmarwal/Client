import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';

const cookies = new Cookies();
const language = cookies.get('localeLang') || 'en';
const translatedData =
  i18n.logger.options.resources[language].translation.componentData.reduxData;

axios.interceptors.request.use(
  (request) => {
    request.headers['accept-language'] = i18n.language;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    if (response.status === 401) {
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
      cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
      cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
      cookies.remove('@clientUserId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

export const getB2CClientPaymentTypes = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/payment-type/list`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_PAYMENT_TYPE_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_PAYMENT_TYPE_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_PAYMENT_TYPE_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getB2CPreferredClientPaymentTypes =
  (clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/payment-type/client/${clientId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_PREFERRED_PAYMENT_TYPE_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_PREFERRED_PAYMENT_TYPE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_PREFERRED_PAYMENT_TYPE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const getB2CPreferredParentPaymentTypes =
  (clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/payment-type/client/${clientId}?isOnboarding=1`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_PREFERRED_PAYMENT_TYPE_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_PREFERRED_PAYMENT_TYPE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_PREFERRED_PAYMENT_TYPE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const updateB2CPreferredPaymentTypes =
  ({ clientId, selectedPaymentTypes }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/payment-type/client/${clientId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          fileFormatId: selectedPaymentTypes,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'PREFERRED_PAYMENT_TYPE_UPDATE_SUCCESS',
        });
        return true;
      }
      dispatch({
        type: 'PREFERRED_PAYMENT_TYPE_UPDATE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'PREFERRED_PAYMENT_TYPE_UPDATE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

  export const updateUSbankPreferredPaymentTypes =
  (clientId, selectedPaymentTypes) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/payment-type/client/${clientId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({ selectedPaymentTypes:selectedPaymentTypes }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'PREFERRED_PAYMENT_TYPE_UPDATE_SUCCESS',
        });
        return true;
      }
      dispatch({
        type: 'PREFERRED_PAYMENT_TYPE_UPDATE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'PREFERRED_PAYMENT_TYPE_UPDATE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };
export const getB2CClientBankInfo = async ({
  clientId,
  paymentType,
  showParentData,
}) => {
  try {
    const queryParamsUrl = showParentData
      ? `type=${paymentType}&isOnboarding=1`
      : `type=${paymentType}`;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/bank-account/client/${clientId}?${queryParamsUrl}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    // return { ...error.response.data };
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const achB2CProfilesInformation = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/bank-account/ach-profile`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const createB2CBankInfo =
  ({ clientId, bankDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/bank-account/client/${clientId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          accountName: bankDetail.accountName || null,
          accountNumber: bankDetail.accountNumber || null,
          companyDiscretionaryData: bankDetail.companyDiscretionaryData || null,
          companyEntryDescription: bankDetail.companyEntryDescription || null,
          companyIdentification: bankDetail.companyIdentification || null,
          companyName: bankDetail.companyName || null,
          originatingDFIDiscretionaryData:
            bankDetail.originatingDFIDiscretionaryData || null,
          originatingDFIIdentification:
            bankDetail.originatingDFIIdentification || null,
          routingCode: bankDetail.routingCode || null,
          type: bankDetail.type || 'ACH',
          currencyCode: bankDetail.currencyCode || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'BANK_DETAIL_UPDATE_SUCCESS',
          payload: {
            ...bankDetail,
            AccountID:
              (responseBody.data && responseBody.data.accountId) || null,
          },
        });
        if (responseBody.data && responseBody.data.accountId) {
          return responseBody.data.accountId;
        } else {
          return false;
        }
      }

      dispatch({
        type: 'BANK_DETAIL_UPDATE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'CREATE_FILESETTING_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const updateB2CBankInfo =
  ({ clientId, bankDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/bank-account/client/${clientId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          accountId: bankDetail.accountId || null,
          accountName: bankDetail.accountName || null,
          accountNumber: bankDetail.accountNumber || null,
          companyDiscretionaryData: bankDetail.companyDiscretionaryData || null,
          companyEntryDescription: bankDetail.companyEntryDescription || null,
          companyIdentification: bankDetail.companyIdentification || null,
          companyName: bankDetail.companyName || null,
          originatingDFIDiscretionaryData:
            bankDetail.originatingDFIDiscretionaryData || null,
          originatingDFIIdentification:
            bankDetail.originatingDFIIdentification || null,
          routingCode: bankDetail.routingCode || null,
          type: bankDetail.type || 'ACH',
          currencyCode: bankDetail.currencyCode || null,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'BANK_DETAIL_UPDATE_SUCCESS',
          payload: bankDetail,
        });
        return true;
      }
      dispatch({
        type: 'BANK_DETAIL_UPDATE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'CREATE_FILESETTING_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const updateB2CCheckDetail = (checkDetail) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/updateCheckInfo`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        ediInterchangeSenderId: checkDetail.ediInterchangeSenderId || null,
        ediInterchangeReceiverId: checkDetail.ediInterchangeReceiverId || null,
        ediGroupSenderId: checkDetail.ediGroupSenderId || null,
        ediGroupReceiverId: checkDetail.ediGroupReceiverId || null,
        clientId: checkDetail.clientId || null,
        originatingCompanyID: checkDetail.originatingCompanyID || null,
        originatingDFIIdentification: checkDetail.originatingDFIIdentification || null
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_CHECK_DETAIL_UPDATE_SUCCESS',
        payload: checkDetail,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_CHECK_DETAIL_UPDATE_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_CHECK_DETAIL_UPDATE_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const addB2CCheckDetail = (checkDetail) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/addCheckInfo`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        ediInterchangeSenderId: checkDetail.ediInterchangeSenderId || null,
        ediInterchangeReceiverId: checkDetail.ediInterchangeReceiverId || null,
        ediGroupSenderId: checkDetail.ediGroupSenderId || null,
        ediGroupReceiverId: checkDetail.ediGroupReceiverId || null,
        clientId: checkDetail.clientId || null,
        originatingCompanyID: checkDetail.originatingCompanyID || null,
        originatingDFIIdentification: checkDetail.originatingDFIIdentification || null
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_CHECK_DETAIL_UPDATE_SUCCESS',
        payload: checkDetail,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_CHECK_DETAIL_UPDATE_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_CHECK_DETAIL_UPDATE_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getB2CCheckDetailInfo = async ({ clientId, showParentData }) => {
  try {
    const queryParamsUrl = showParentData
      ? `clientId=${clientId}&isOnboarding=1`
      : `clientId=${clientId}`;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/getCheckInfo?${queryParamsUrl}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const createB2CPaypalInfo =
  ({ payPalDetails }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/b2c-onboarding/paypal-account`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientBIC: payPalDetails.clientBIC || null,
          clientId: payPalDetails.clientId || null,
          countryPhoneCode: payPalDetails.countryPhoneCode || null,
          senderAccountNumber: payPalDetails.senderAccountNumber || null,
          senderAddressLine1: payPalDetails.senderAddressLine1 || null,
          senderAddressLine2: payPalDetails.senderAddressLine2 || null,
          senderCity: payPalDetails.senderCity || null,
          senderContactEmail: payPalDetails.senderContactEmail || null,
          senderCountryCode: payPalDetails.senderCountryCode || null,
          senderName: payPalDetails.senderName || null,
          senderPhone: payPalDetails.senderPhone || null,
          senderPhoneExt: payPalDetails.senderPhoneExt || null,
          senderState: payPalDetails.senderState || null,
          senderZIP: payPalDetails.senderZIP || null,
          title: payPalDetails.title || null,
          worldlinkId: payPalDetails.worldlinkId || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'ADD_PAYPAL_DETAIL_SUCCESS',
          payload: {
            ...payPalDetails,
            accountId:
              (responseBody.data && responseBody.data.accountId) || null,
          },
        });
      }
      dispatch({
        type: 'ADD_PAYPAL_DETAIL_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return responseBody;
      // return false;
    } catch (error) {
      dispatch({
        type: 'ADD_PAYPAL_DETAIL_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return error;
    }
  };

export const getPayPalAccountDetails =
  ({ clientId, showParentData }) =>
  async (dispatch) => {
    try {
      const queryParamsUrl = showParentData
        ? `clientId=${clientId}&isOnboarding=1`
        : `clientId=${clientId}`;
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/paypal-account?${queryParamsUrl}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const { error, message, data } = await response.data;
      if (!error) {
        dispatch({
          type: 'FETCH_PAYPAL_DETAIL_SUCCESS',
          payload: data || null,
        });
        return data;
      }
      dispatch({
        type: 'FETCH_PAYPAL_DETAIL_FAILED',
        payload: message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_PAYPAL_DETAIL_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const updatePayPalAccountDetails =
  ({ payPalDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/b2c-onboarding/paypal-account`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientBIC: payPalDetail.clientBIC || null,
          clientId: payPalDetail.clientId || null,
          countryPhoneCode: payPalDetail.countryPhoneCode || null,
          senderAccountNumber: payPalDetail.senderAccountNumber || null,
          senderAddressLine1: payPalDetail.senderAddressLine1 || null,
          senderAddressLine2: payPalDetail.senderAddressLine2 || null,
          senderCity: payPalDetail.senderCity || null,
          senderContactEmail: payPalDetail.senderContactEmail || null,
          senderCountryCode: payPalDetail.senderCountryCode || null,
          senderName: payPalDetail.senderName || null,
          senderPhone: payPalDetail.senderPhone || null,
          senderPhoneExt: payPalDetail.senderPhoneExt || null,
          senderState: payPalDetail.senderState || null,
          senderZIP: payPalDetail.senderZIP || null,
          title: payPalDetail.title || null,
          worldlinkId: payPalDetail.worldlinkId || null,
          accountId: payPalDetail.accountId || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'PAYPAL_DETAIL_UPDATE_SUCCESS',
          payload: payPalDetail,
        });
        // return true;
      }
      dispatch({
        type: 'PAYPAL_DETAIL_UPDATE_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      // return false;
      return responseBody;
    } catch (error) {
      dispatch({
        type: 'PAYPAL_DETAIL_UPDATE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return error;
    }
  };

export const addPushToCard =
  (stateData, clientID, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/onboarding/push-card-account`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientId: clientID,
          partnerId: stateData.partnerId || null,
          masterMerchantCatCode: stateData.masterMerchantCatCode || null,
          visaMerchantCatCode: stateData.visaMerchantCatCode || null,
          visaAcceptorId: stateData.visaAcceptorId || null,
          masterCardAcceptorId: stateData.masterCardAcceptorId || null,
          paymentType: stateData.paymentType || null,
          senderAccount: stateData.senderAccount || null,
          senderFirstName: stateData.senderFirstName || null,
          senderLastName: stateData.senderLastName || null,
          senderAddressLine1: stateData.senderAddressLine1 || null,
          senderAddressLine2: stateData.senderAddressLine2 || null,
          senderCity: stateData.senderCity || null,
          senderState: stateData.senderState || null,
          senderZip:
            Boolean(stateData.senderZip) && Boolean(stateData.senderZip.trim())
              ? stateData.senderZip
              : null,
          senderCountryCode: stateData.senderCountryCode || null,
          senderContactEmail: stateData.senderContactEmail || null,
          senderPhone: stateData.senderPhone || null,
          senderPhoneExt: stateData.senderPhoneExt || null,
          clientPrefix: stateData.clientPrefix || null,
          title: stateData.title || null,
          countryPhoneCode: stateData.countryPhoneCode || null,
          settlementAccountId: settlementAccountId,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_B2C_PUSHTOCARD_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }

      dispatch({
        type: 'FETCH_B2C_PUSHTOCARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return responseBody;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_PUSHTOCARD_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const getPushToCardData =
  (clientID, showParentData) => async (dispatch) => {
    try {
      const queryParamsUrl = showParentData
        ? `clientId=${clientID}&isOnboarding=1`
        : `clientId=${clientID}`;
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/push-card-account?${queryParamsUrl}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_B2C_GETPUSHTOCARD_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_B2C_GETPUSHTOCARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_GETPUSHTOCARD_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const updatePushToCardData =
  (stateData, clientID, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/onboarding/push-card-account`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          id: stateData.id,
          clientId: clientID,
          partnerId: stateData.partnerId || null,
          masterMerchantCatCode: stateData.masterMerchantCatCode || null,
          visaMerchantCatCode: stateData.visaMerchantCatCode || null,
          visaAcceptorId: stateData.visaAcceptorId || null,
          masterCardAcceptorId: stateData.masterCardAcceptorId || null,
          paymentType: stateData.paymentType || null,
          senderAccount: stateData.senderAccount || null,
          senderFirstName: stateData.senderFirstName || null,
          senderLastName: stateData.senderLastName || null,
          senderAddressLine1: stateData.senderAddressLine1 || null,
          senderAddressLine2: stateData.senderAddressLine2 || null,
          senderCity: stateData.senderCity || null,
          senderState: stateData.senderState || null,
          senderZip:
            Boolean(stateData.senderZip) && Boolean(stateData.senderZip.trim())
              ? stateData.senderZip
              : null,
          senderCountryCode: stateData.senderCountryCode || null,
          senderContactEmail: stateData.senderContactEmail || null,
          senderPhone: stateData.senderPhone || null,
          senderPhoneExt: stateData.senderPhoneExt || null,
          clientPrefix: stateData.clientPrefix || null,
          title: stateData.title || null,
          countryPhoneCode: stateData.countryPhoneCode || null,
          settlementAccountId: settlementAccountId,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_B2C_UPDATEPUSHTOCARD_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_B2C_UPDATEPUSHTOCARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_UPDATEPUSHTOCARD_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const settingAddPushToCard =
  (stateData, clientID) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/push-card-account`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientId: clientID,
          partnerId: stateData.partnerId || null,
          masterMerchantCatCode: stateData.masterMerchantCatCode || null,
          visaMerchantCatCode: stateData.visaMerchantCatCode || null,
          visaAcceptorId: stateData.visaAcceptorId || null,
          masterCardAcceptorId: stateData.masterCardAcceptorId || null,
          paymentType: stateData.paymentType || null,
          senderAccount: stateData.senderAccount || null,
          senderFirstName: stateData.senderFirstName || null,
          senderLastName: stateData.senderLastName || null,
          senderAddressLine1: stateData.senderAddressLine1 || null,
          senderAddressLine2: stateData.senderAddressLine2 || null,
          senderCity: stateData.senderCity || null,
          senderState: stateData.senderState || null,
          senderZip:
            Boolean(stateData.senderZip) && Boolean(stateData.senderZip.trim())
              ? stateData.senderZip
              : null,
          senderCountryCode: stateData.senderCountryCode || null,
          senderContactEmail: stateData.senderContactEmail || null,
          senderPhone: stateData.senderPhone || null,
          senderPhoneExt: stateData.senderPhoneExt || null,
          clientPrefix: stateData.clientPrefix || null,
          title: stateData.title || null,
          countryPhoneCode: stateData.countryPhoneCode || null,
          settlementAccountId: stateData.settlementAccountId || undefined,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_B2C_PUSHTOCARD_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_B2C_PUSHTOCARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_PUSHTOCARD_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return error;
    }
  };

export const settingUpdatePushToCardData =
  (stateData, clientID) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/push-card-account`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          id: stateData.id,
          clientId: clientID,
          partnerId: stateData.partnerId || null,
          masterMerchantCatCode: stateData.masterMerchantCatCode || null,
          visaMerchantCatCode: stateData.visaMerchantCatCode || null,
          visaAcceptorId: stateData.visaAcceptorId || null,
          masterCardAcceptorId: stateData.masterCardAcceptorId || null,
          paymentType: stateData.paymentType || null,
          senderAccount: stateData.senderAccount || null,
          senderFirstName: stateData.senderFirstName || null,
          senderLastName: stateData.senderLastName || null,
          senderAddressLine1: stateData.senderAddressLine1 || null,
          senderAddressLine2: stateData.senderAddressLine2 || null,
          senderCity: stateData.senderCity || null,
          senderState: stateData.senderState || null,
          senderZip:
            Boolean(stateData.senderZip) && Boolean(stateData.senderZip.trim())
              ? stateData.senderZip
              : null,
          senderCountryCode: stateData.senderCountryCode || null,
          senderContactEmail: stateData.senderContactEmail || null,
          senderPhone: stateData.senderPhone || null,
          senderPhoneExt: stateData.senderPhoneExt || null,
          clientPrefix: stateData.clientPrefix || null,
          title: stateData.title || null,
          countryPhoneCode: stateData.countryPhoneCode || null,
          settlementAccountId: stateData.settlementAccountId || undefined,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_B2C_UPDATEPUSHTOCARD_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_B2C_UPDATEPUSHTOCARD_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return response.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_UPDATEPUSHTOCARD_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return error;
    }
  };

export const settingCreateB2CPaypalInfo =
  ({ payPalDetails }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/paypal-account`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientBIC: payPalDetails.clientBIC || null,
          clientId: payPalDetails.clientId || null,
          countryPhoneCode: payPalDetails.countryPhoneCode || null,
          senderAccountNumber: payPalDetails.senderAccountNumber || null,
          senderAddressLine1: payPalDetails.senderAddressLine1 || null,
          senderAddressLine2: payPalDetails.senderAddressLine2 || null,
          senderCity: payPalDetails.senderCity || null,
          senderContactEmail: payPalDetails.senderContactEmail || null,
          senderCountryCode: payPalDetails.senderCountryCode || null,
          senderName: payPalDetails.senderName || null,
          senderPhone: payPalDetails.senderPhone || null,
          senderPhoneExt: payPalDetails.senderPhoneExt || null,
          senderState: payPalDetails.senderState || null,
          senderZIP: payPalDetails.senderZIP || null,
          title: payPalDetails.title || null,
          worldlinkId: payPalDetails.worldlinkId || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'ADD_PAYPAL_DETAIL_SUCCESS',
          payload: {
            ...payPalDetails,
            accountId:
              (responseBody.data && responseBody.data.accountId) || null,
          },
        });
      }
      dispatch({
        type: 'ADD_PAYPAL_DETAIL_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return responseBody;
      // return false;
    } catch (error) {
      dispatch({
        type: 'ADD_PAYPAL_DETAIL_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return error;
    }
  };

export const settimgUpdatePayPalAccountDetails =
  ({ payPalDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/client/paypal-account`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientBIC: payPalDetail.clientBIC || null,
          clientId: payPalDetail.clientId || null,
          countryPhoneCode: payPalDetail.countryPhoneCode || null,
          senderAccountNumber: payPalDetail.senderAccountNumber || null,
          senderAddressLine1: payPalDetail.senderAddressLine1 || null,
          senderAddressLine2: payPalDetail.senderAddressLine2 || null,
          senderCity: payPalDetail.senderCity || null,
          senderContactEmail: payPalDetail.senderContactEmail || null,
          senderCountryCode: payPalDetail.senderCountryCode || null,
          senderName: payPalDetail.senderName || null,
          senderPhone: payPalDetail.senderPhone || null,
          senderPhoneExt: payPalDetail.senderPhoneExt || null,
          senderState: payPalDetail.senderState || null,
          senderZIP: payPalDetail.senderZIP || null,
          title: payPalDetail.title || null,
          worldlinkId: payPalDetail.worldlinkId || null,
          accountId: payPalDetail.accountId || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'PAYPAL_DETAIL_UPDATE_SUCCESS',
          payload: payPalDetail,
        });
      }
      dispatch({
        type: 'PAYPAL_DETAIL_UPDATE_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return responseBody;
    } catch (error) {
      dispatch({
        type: 'PAYPAL_DETAIL_UPDATE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return error;
    }
  };

export const settingCreateB2CBankInfo =
  ({ clientId, bankDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/setting/bank-account/client/${clientId}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          accountName: bankDetail.accountName || null,
          accountNumber: bankDetail.accountNumber || null,
          companyDiscretionaryData: bankDetail.companyDiscretionaryData || null,
          companyEntryDescription: bankDetail.companyEntryDescription || null,
          companyIdentification: bankDetail.companyIdentification || null,
          companyName: bankDetail.companyName || null,
          originatingDFIDiscretionaryData:
            bankDetail.originatingDFIDiscretionaryData || null,
          originatingDFIIdentification:
            bankDetail.originatingDFIIdentification || null,
          routingCode: bankDetail.routingCode || null,
          type: bankDetail.type || 'ACH',
          isDefault: bankDetail.isDefault || 0,
          currencyCode: bankDetail.currencyCode || null,
        }),
      });
      const responseBody = await response.data;
      if (!responseBody.error) {
        dispatch({
          type: 'BANK_DETAIL_UPDATE_SUCCESS',
          payload: {
            ...bankDetail,
            AccountID:
              (responseBody.data && responseBody.data.accountId) || null,
          },
        });
        if (responseBody.data && responseBody.data.accountId) {
          return responseBody.data.accountId;
        } else {
          return false;
        }
      }

      dispatch({
        type: 'BANK_DETAIL_UPDATE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'CREATE_FILESETTING_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const settingUpdateB2CBankInfo =
  ({ clientId, bankDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/setting/bank-account/client/${clientId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          accountId: bankDetail.accountId || null,
          accountName: bankDetail.accountName || null,
          accountNumber: bankDetail.accountNumber || null,
          companyDiscretionaryData: bankDetail.companyDiscretionaryData || null,
          companyEntryDescription: bankDetail.companyEntryDescription || null,
          companyIdentification: bankDetail.companyIdentification || null,
          companyName: bankDetail.companyName || null,
          originatingDFIDiscretionaryData:
            bankDetail.originatingDFIDiscretionaryData || null,
          originatingDFIIdentification:
            bankDetail.originatingDFIIdentification || null,
          routingCode: bankDetail.routingCode || null,
          type: bankDetail.type || 'ACH',
          isDefault: bankDetail.isDefault || 0,
          currencyCode: bankDetail.currencyCode || null,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'BANK_DETAIL_UPDATE_SUCCESS',
          payload: bankDetail,
        });
        return true;
      }
      dispatch({
        type: 'BANK_DETAIL_UPDATE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'CREATE_FILESETTING_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const settingUpdateB2CCheckDetail =
  (checkDetail) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/updateCheckDetails/all`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          ediInterchangeSenderId: checkDetail.ediInterchangeSenderId || null,
          ediInterchangeReceiverId:
            checkDetail.ediInterchangeReceiverId || null,
          ediGroupSenderId: checkDetail.ediGroupSenderId || null,
          ediGroupReceiverId: checkDetail.ediGroupReceiverId || null,
          clientId: checkDetail.clientId || null,
          originatingCompanyID: checkDetail.originatingCompanyID || null,
          originatingDFIIdentification: checkDetail.originatingDFIIdentification || null,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_CHECK_DETAIL_UPDATE_SUCCESS',
          payload: checkDetail,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_CHECK_DETAIL_UPDATE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_CHECK_DETAIL_UPDATE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
    }
  };

export const settingAddB2CCheckDetail = (checkDetail) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/addCheckDetails/all`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        ediInterchangeSenderId: checkDetail.ediInterchangeSenderId || null,
        ediInterchangeReceiverId: checkDetail.ediInterchangeReceiverId || null,
        ediGroupSenderId: checkDetail.ediGroupSenderId || null,
        ediGroupReceiverId: checkDetail.ediGroupReceiverId || null,
        clientId: checkDetail.clientId || null,
        originatingCompanyID: checkDetail.originatingCompanyID || null,
        originatingDFIIdentification: checkDetail.originatingDFIIdentification || null,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_CHECK_DETAIL_UPDATE_SUCCESS',
        payload: checkDetail,
      });
      return true;
    }
    dispatch({
      type: 'FETCH_CHECK_DETAIL_UPDATE_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_CHECK_DETAIL_UPDATE_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
  }
};

export const getZelleData = (clientID, showParentData) => async (dispatch) => {
  try {
    const queryParamsUrl = showParentData
      ? `clientId=${clientID}&isOnboarding=1`
      : `clientId=${clientID}`;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/zelle/information?${queryParamsUrl}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_B2C_ZELLE_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_B2C_ZELLE_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_ZELLE_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const senderTypeList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/zelle/sender/type`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_ZELLE_SENDER_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_ZELLE_SENDER_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_ZELLE_SENDER_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const senderProductType = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/zelle/product/type`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_ZELLE_PRODUCT_TYPE_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_ZELLE_PRODUCT_TYPE_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_ZELLE_PRODUCT_TYPE_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const addZelle =
  (data, clientId, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/zelle/addZelleInfo`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientId: clientId || null,
          senderType: data.senderType || null,
          senderName: data.senderName || null,
          address_line1: data.address_line1 || null,
          address_line2: data.address_line2 || null,
          city: data.city || null,
          state: data.state || null,
          zipcode: data.zipcode || null,
          countryCode: data.countryCode || null,
          productType: data.productType || null,
          debitNetwork: data.debitNetwork,
          secondaryDDA: data.secondaryDDA,
          visaIdCode: data.visaIdCode || null,
          visaMerchantCategoryCode: data.visaMerchantCategoryCode
            ? data.visaMerchantCategoryCode.toString()
            : null,
          businessIndicator: data.businessIndicator || null,
          merchantCategoryCode: data.merchantCategoryCode
            ? data.merchantCategoryCode.toString()
            : null,
          cardAcceptorId: data.cardAcceptorId || null,
          customerContact: data.customerContact || null,
          paymentType: data.paymentType || null,
          firstNameRiskScore: data.firstNameRiskScore || '00',
          lastNameRiskScore: data.lastNameRiskScore || '00',
          combinedRiskScore: data.combinedRiskScore || '00',
          senderPhone: data.senderPhone || null,
          senderEmail: data.senderEmail || null,
          payeeAcceptanceExpiryDays: data.payeeAcceptanceExpiryDays || null,
          allowRegisterViaZella: data.allowRegisterViaZella || 0,
          noOfDaysBeforeEnrolmentExpire:
            data.noOfDaysBeforeEnrolmentExpire || 0,
          isAuthorizeDebit: data.isAuthorizeDebit || 0,
          zelleTokenFromConsumer: data.zelleTokenFromConsumer || 0,
          settlementAccountId: settlementAccountId
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_ADD_ZELLE_SUCCESS',
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const updateZelle =
  (data, clientId, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/zelle/updateZelleDetails`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientId: clientId || null,
          senderType: data.senderType || null,
          senderName: data.senderName || null,
          address_line1: data.address_line1 || null,
          address_line2: data.address_line2 || null,
          city: data.city || null,
          state: data.state || null,
          zipcode: data.zipcode || null,
          countryCode: data.countryCode || null,
          productType: data.productType || null,
          debitNetwork: data.debitNetwork,
          secondaryDDA: data.secondaryDDA,
          visaIdCode: data.visaIdCode || null,
          visaMerchantCategoryCode: data.visaMerchantCategoryCode
            ? data.visaMerchantCategoryCode.toString()
            : null,
          businessIndicator: data.businessIndicator || null,
          merchantCategoryCode: data.merchantCategoryCode
            ? data.merchantCategoryCode.toString()
            : null,
          cardAcceptorId: data.cardAcceptorId || null,
          customerContact: data.customerContact || null,
          paymentType: data.paymentType || null,
          firstNameRiskScore: data.firstNameRiskScore || '00',
          lastNameRiskScore: data.lastNameRiskScore || '00',
          combinedRiskScore: data.combinedRiskScore || '00',
          senderPhone: data.senderPhone || null,
          senderEmail: data.senderEmail || null,
          payeeAcceptanceExpiryDays: data.payeeAcceptanceExpiryDays || null,
          allowRegisterViaZella: data.allowRegisterViaZella || 0,
          noOfDaysBeforeEnrolmentExpire:
            data.noOfDaysBeforeEnrolmentExpire || 0,
          isAuthorizeDebit: data.isAuthorizeDebit || 0,
          zelleTokenFromConsumer: data.zelleTokenFromConsumer || 0,
          settlementAccountId: settlementAccountId
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_ADD_ZELLE_SUCCESS',
        });
        return true;
      }
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const settingGetZelleData = (clientID) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/zelle/information?clientId=${clientID}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_B2C_ZELLE_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_B2C_ZELLE_FAILED',
      payload: responseBody.message || 'Oops! Something went wrong.',
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_ZELLE_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const settingAddZelle =
  (data, clientId, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/zelle/all`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientId: clientId || null,
          senderType: data.senderType || null,
          senderName: data.senderName || null,
          address_line1: data.address_line1 || null,
          address_line2: data.address_line2 || null,
          city: data.city || null,
          state: data.state || null,
          zipcode: data.zipcode || null,
          countryCode: data.countryCode || null,
          productType: data.productType || null,
          debitNetwork: data.debitNetwork,
          secondaryDDA: data.secondaryDDA,
          visaIdCode: data.visaIdCode || null,
          visaMerchantCategoryCode: data.visaMerchantCategoryCode
            ? data.visaMerchantCategoryCode.toString()
            : null,
          businessIndicator: data.businessIndicator || null,
          merchantCategoryCode: data.merchantCategoryCode
            ? data.merchantCategoryCode.toString()
            : null,
          cardAcceptorId: data.cardAcceptorId || null,
          customerContact: data.customerContact || null,
          paymentType: data.paymentType || null,
          firstNameRiskScore: data.firstNameRiskScore || '00',
          lastNameRiskScore: data.lastNameRiskScore || '00',
          combinedRiskScore: data.combinedRiskScore || '00',
          senderPhone: data.senderPhone || null,
          senderEmail: data.senderEmail || null,
          payeeAcceptanceExpiryDays: data.payeeAcceptanceExpiryDays || null,
          allowRegisterViaZella: data.allowRegisterViaZella || 0,
          noOfDaysBeforeEnrolmentExpire:
            data.noOfDaysBeforeEnrolmentExpire || 0,
          isAuthorizeDebit: data.isAuthorizeDebit || 0,
          zelleTokenFromConsumer: data.zelleTokenFromConsumer || 0,
          settlementAccountId: settlementAccountId || undefined,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_ADD_ZELLE_SUCCESS',
        });
        return true;
      }
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const settingUpdateZelle =
  (data, clientId, settlementAccountId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/saveZelleInfo/all`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          clientId: clientId || null,
          senderType: data.senderType || null,
          senderName: data.senderName || null,
          address_line1: data.address_line1 || null,
          address_line2: data.address_line2 || null,
          city: data.city || null,
          state: data.state || null,
          zipcode: data.zipcode || null,
          countryCode: data.countryCode || null,
          productType: data.productType || null,
          debitNetwork: data.debitNetwork,
          secondaryDDA: data.secondaryDDA,
          visaIdCode: data.visaIdCode || null,
          visaMerchantCategoryCode: data.visaMerchantCategoryCode ? data.visaMerchantCategoryCode.toString(): null,
          businessIndicator: data.businessIndicator || null,
          merchantCategoryCode: data.merchantCategoryCode ? data.merchantCategoryCode.toString(): null,
          cardAcceptorId: data.cardAcceptorId || null,
          customerContact: data.customerContact || null,
          paymentType: data.paymentType || null,
          firstNameRiskScore: data.firstNameRiskScore || '00',
          lastNameRiskScore: data.lastNameRiskScore || '00',
          combinedRiskScore: data.combinedRiskScore || '00',
          senderPhone: data.senderPhone || null,
          senderEmail: data.senderEmail || null,
          payeeAcceptanceExpiryDays: data.payeeAcceptanceExpiryDays || null,
          allowRegisterViaZella: data.allowRegisterViaZella || 0,
          noOfDaysBeforeEnrolmentExpire:
            data.noOfDaysBeforeEnrolmentExpire || 0,
          isAuthorizeDebit: data.isAuthorizeDebit || 0,
          zelleTokenFromConsumer: data.zelleTokenFromConsumer || 0,
          settlementAccountId: settlementAccountId || undefined,
        }),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_ADD_ZELLE_SUCCESS',
        });
        return true;
      }
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_ADD_ZELLE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const fetchAllB2CAchList =
  (clientId, showParentData) => async (dispatch) => {
    try {
      const queryParamsUrl = showParentData
        ? `type=ACH&isOnboarding=1`
        : `type=ACH`;
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/bank-account/client/${clientId}?${queryParamsUrl}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_B2C_ACH_LIST_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_B2C_ACH_LIST_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_ACH_LIST_FAILED',
        payload:
          (error.response && error.response.data.message) ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

  export const fetchB2CChildBankAccountsList =   (clientID, paymentType) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/bank-account/client/${clientID}?type=${paymentType}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_CHILD_ACH_ACCOUNT_LIST_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }

  }

  export const fetchPayeeInfo = (payeeId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/getConsumerInfo?consumerIdentifier=${payeeId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_PAYEE_INFO_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_PAYEE_INFO_FAILED',
        payload: responseBody.message || 'Oops! Something went wrong.',
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_PAYEE_INFO_FAILED',
        payload: error.message || 'An error has occurred.',
      });
      return false;
    }
  }

  export const createPayment = (payload) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.paymentService}/CreatePayment`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify(payload),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'CREATE_PAYMENT_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'CREATE_PAYMENT_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'CREATE_PAYMENT_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

  export const getB2CthresholdLimits = () => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/payment/threshold-limit`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'FETCH_THRESHOLD_LIMITS_SUCCESS',
          payload: responseBody.data,
        });
        return true;
      }
      dispatch({
        type: 'FETCH_THRESHOLD_LIMITS_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_THRESHOLD_LIMITS_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };  