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

axios.interceptors.response.use(function (response) {
  // Do something with response data
  if (response.status == 401) {
      let cookies = new Cookies();
    cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
    cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
    cookies.remove('@clientUserId', { path: `${config.baseName}/` });
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

export const achProfilesInformation = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/bank-account/ach-profile`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    // return {
    //   ...error.response.data,
    // };
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const getClientTransactionType = async (clientId, paymentType) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/transaction-type/client/${clientId}/paymentCode/${paymentType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response;
  } catch (error) {
    // return {
    //   ...error.response.data,
    // };
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const getClientPaymentTypes = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payment-type/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_PAYMENT_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const B2CgetClientPaymentTypes = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/payment-type/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_PAYMENT_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getPreferredClientPaymentTypes = (clientId) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_PREFERRED_PAYMENT_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_PREFERRED_PAYMENT_TYPE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PREFERRED_PAYMENT_TYPE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getPreferredParentPaymentTypes = (clientId) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}?isOnboarding=1`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_PREFERRED_PAYMENT_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_PREFERRED_PAYMENT_TYPE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PREFERRED_PAYMENT_TYPE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const updatePreferredPaymentTypes = ({
  clientId,
  selectedPaymentTypes,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        fileFormatId: selectedPaymentTypes,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "PREFERRED_PAYMENT_TYPE_UPDATE_SUCCESS",
      });
      return true;
    }
    dispatch({
      type: "PREFERRED_PAYMENT_TYPE_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "PREFERRED_PAYMENT_TYPE_UPDATE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const B2CupdatePreferredPaymentTypes = ({
  clientId,
  selectedPaymentTypes,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/payment-type/client/${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        fileFormatId: selectedPaymentTypes,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "PREFERRED_PAYMENT_TYPE_UPDATE_SUCCESS",
      });
      return true;
    }
    dispatch({
      type: "PREFERRED_PAYMENT_TYPE_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "PREFERRED_PAYMENT_TYPE_UPDATE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

//NR
export const getCardTypes = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/client/cardType`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_CARD_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_CARD_TYPE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CARD_TYPE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getClientBankInfo = async ({ clientId, paymentType }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/bank-account/client/${clientId}?type=${paymentType}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    // return { ...error.response.data };
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const createBankInfo = ({ clientId, paymentType, bankDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/bank-account/client/${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(bankDetail),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "BANK_DETAIL_UPDATE_SUCCESS",
        payload: {
          ...bankDetail,
          AccountID: (responseBody.data && responseBody.data.accountId) || null,
        },
      });
      if (responseBody.data && responseBody.data.accountId) {
        return responseBody.data.accountId;
      } else {
        return false;
      }
    }

    dispatch({
      type: "BANK_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CREATE_FILESETTING_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const updateBankInfo = ({ clientId, paymentType, bankDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/bank-account/client/${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(bankDetail),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "BANK_DETAIL_UPDATE_SUCCESS",
        payload: bankDetail,
      });
      return true;
    }
    dispatch({
      type: "BANK_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CREATE_FILESETTING_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};
export const createETFInfo = ({ clientId, paymentType, eftDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/client/bank/account/information?clientId=${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        accountName: (eftDetail && eftDetail.AccountName) || "",
        accountNumber: (eftDetail && eftDetail.AccountNumber) || "",
        routingCode: (eftDetail && eftDetail.RoutingCode) || "",
        bankCountryISO: (eftDetail && eftDetail.BankCountryISO) || "",
        currencyCode: (eftDetail && eftDetail.CurrencyCode) || "",
        companyName: (eftDetail && eftDetail.CompanyName) || "",
        companyIdentification:
          (eftDetail && eftDetail.CompanyIdentification) || "",
        companyEntryDescription:
          (eftDetail && eftDetail.CompanyEntryDescription) || "",
        companyDiscretionaryData:
          (eftDetail && eftDetail.CompanyDiscretionaryData) || "",
        originatingDFIIdentification:
          (eftDetail && eftDetail.OriginatingDFIIdentification) || "",
        originatingDFIDiscretionaryData:
          (eftDetail && eftDetail.OriginatingDFIDiscretionaryData) || "",
        accountType: paymentType,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "ETF_DETAIL_UPDATE_SUCCESS",
        payload: {
          ...eftDetail,
          AccountID: (responseBody.data && responseBody.data.accountId) || null,
        },
      });
      return true;
    }
    dispatch({
      type: "ETF_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "ETF_DETAIL_UPDATE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const updateETFInfo = ({ clientId, paymentType, eftDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/client/bank/account/information?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        accountName: (eftDetail && eftDetail.AccountName) || "",
        accountNumber: (eftDetail && eftDetail.AccountNumber) || "",
        routingCode: (eftDetail && eftDetail.RoutingCode) || "",
        bankCountryISO: (eftDetail && eftDetail.BankCountryISO) || "",
        currencyCode: (eftDetail && eftDetail.CurrencyCode) || "",
        companyName: (eftDetail && eftDetail.CompanyName) || "",
        companyIdentification:
          (eftDetail && eftDetail.CompanyIdentification) || "",
        companyEntryDescription:
          (eftDetail && eftDetail.CompanyEntryDescription) || "",
        companyDiscretionaryData:
          (eftDetail && eftDetail.CompanyDiscretionaryData) || "",
        originatingDFIIdentification:
          (eftDetail && eftDetail.OriginatingDFIIdentification) || "",
        originatingDFIDiscretionaryData:
          (eftDetail && eftDetail.OriginatingDFIDiscretionaryData) || "",
        accountType: paymentType,
        accountId: (eftDetail && eftDetail.AccountID) || null,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "EFT_DETAIL_UPDATE_SUCCESS",
        payload: eftDetail,
      });
      return true;
    }
    dispatch({
      type: "EFT_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "EFT_DETAIL_UPDATE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};
export const getCurrencyList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/currency`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const data = await response.data;

    return data;
  } catch (error) {
    // return { ...error.response.data };
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const getVirtualCardInfo = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/virtual-card/client/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    // return { ...error.response.data };
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const createVirtualCardInfo = ({
  clientId,
  virtualCardDetail,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/virtual-card`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(virtualCardDetail),
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "VIRTUAL_CARD_DETAIL_UPDATE_SUCCESS",
        payload: {
          ...virtualCardDetail,
          cardAccountDetailsId:
            (responseBody.data && responseBody.data.cardAccountDetailsId) ||
            null,
        },
      });
      if (responseBody.data && responseBody.data.cardAccountDetailsId) {
        return responseBody.data.cardAccountDetailsId;
      } else {
        return false;
      }
    }
    dispatch({
      type: "VIRTUAL_CARD_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "VIRTUAL_CARD_DETAIL_UPDATE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const updateVirtualCardInfo = ({
  clientId,
  virtualCardDetail,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/virtual-card`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(virtualCardDetail),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "VIRTUAL_CARD_DETAIL_UPDATE_SUCCESS",
        payload: virtualCardDetail,
      });
      return true;
    }
    dispatch({
      type: "VIRTUAL_CARD_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "VIRTUAL_CARD_DETAIL_UPDATE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getCheckDetailInfo = async ({ clientId }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/check-payment/client/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    // return {
    //   ...error.response.data,
    // };
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const updateCheckDetail = ({ clientId, checkDetail }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/check-payment/client/${clientId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(checkDetail),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_CHECK_DETAIL_UPDATE_SUCCESS",
        payload: checkDetail,
      });
      return true;
    }
    dispatch({
      type: "FETCH_CHECK_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CHECK_DETAIL_UPDATE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getTransactionType = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/transaction-type`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

export const updateCancelPayment = (data) => async(dispatch) => {
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
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "UPDATE_CANCEL_PAYMENT_SUCCESS",
        payload: data,
      });
      return true;
    }
    dispatch({
      type: "UPDATE_CANCEL_PAYMENT_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_CANCEL_PAYMENT_FAILED",
      payload:(error.response && error.response.data.message) ||
      translatedData.ErrorOccurred
    });
    return false;
  }
}

export const getCancelPaymentReasons = async() => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.paymentService}/GetPaymentCancellationReason`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

export const fetchRoutingCodes = ({ routingCode, rowsPerPage, page }) => async (
  dispatch
) => {
  try {
    const offset = rowsPerPage * page;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/banks?${routingCode != "" ? `&routingCode=${routingCode}` : ``
        }&limit=${rowsPerPage}&offset=${offset}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_ROUTING_CODE_SUCCESS",
        payload: responseBody.data && responseBody.data.rows,
        totalCount: (responseBody.data && responseBody.data.count) || 0,
      });
      return true;
    }
    dispatch({
      type: "FETCH_ROUTING_CODE_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_ROUTING_CODE_FAILED",
      payload: error.message || translatedData.errorOccured,
    });
    return false;
  }
};
export const getLocationOptions = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/location-options`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_LOCATION_OPTION_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_LOCATION_OPTION_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_LOCATION_OPTION_FAILED",
      payload: error.message || translatedData.errorOccured,
    });
    return false;
  }
};

export const getLocationTypes = ({ payeeId }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/locations`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_LOCATION_TYPES_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_LOCATION_TYPES_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_LOCATION_TYPES_FAILED",
      payload: error.message || translatedData.errorOccured,
    });
    return false;
  }
};

export const getCurrenciesList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/currencies`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_CURRENCY_LIST_SUCCESS",
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: "FETCH_CURRENCY_LIST_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CURRENCY_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const getAccountClasses = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/account-classes`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_ACCOUNT_CLASS_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_ACCOUNT_CLASS_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_ACCOUNT_CLASS_FAILED",
      payload: error.message || translatedData.errorOccured,
    });
    return false;
  }
};

export const getClientPaymentTypesPayee = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/account-types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_PAYMENT_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PAYMENT_TYPE_FAILED",
      payload: error.message || translatedData.errorOccured,
    });
    return false;
  }
};

export const getVendorClientList = ({ payeeId, paymentMethodType, onlyValid=false }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/clients?paymentMethodType=${paymentMethodType}&onlyValid=${onlyValid}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
 
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "FETCH_VENDOR_CLIENT_LIST_SUCCESS",
        payload: responseBody.data.rows,
        
      });
      return true;
    }
    dispatch({
      type: "FETCH_VENDOR_CLIENT_LIST_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_VENDOR_CLIENT_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const unShareAccountInfo = ({
  payeeId,
  clientId,
  accountId,
  paymentType,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/payment/${paymentType}/${accountId}/unshare`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        //"accountId": accountId || "",
        clientId: clientId || "",
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      return true;
    }
    dispatch({
      type: "FETCH_CLIENT_REMMITANCE_INFO_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CLIENT_REMMITANCE_INFO_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.errorOccured,
    });
    return false;
  }
};

export const getCardType = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/credit-card-types`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "FETCH_CARD_TYPE_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_CARD_TYPE_FAILED",
      payload: responseBody.message || translatedData.somethingWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CARD_TYPE_FAILED",
      payload: error.message || translatedData.errorOccured,
    });
    return false;
  }
};

// for master card 2.0 (UST1284)

export const createMasterCardInfo = ({ clientId, masterCardDetail }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/client/master/card/create`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      },
      data: JSON.stringify({
        data: masterCardDetail,
        clientId: clientId || null
      })
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "MASTER_CARD_DETAIL_UPDATE_SUCCESS",
        payload: {
          ...masterCardDetail,
          cardAccountDetailsId: (responseBody.data && responseBody.data.Id) || null
        }
      });
    }
    dispatch({
      type: "MASTER_CARD_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong."
    });
    // return false;
    return responseBody;
  } catch (error) {
    dispatch({
      type: "MASTER_CARD_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred."
    });
    // return false;
    return error;
  }
};

export const updateMasterCardInfo = ({ clientId, masterCardDetail }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/update/client/master/card/details`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      },
      data: JSON.stringify({
        data: masterCardDetail,
        clientId: clientId || null
      })
    });
    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "MASTER_CARD_DETAIL_UPDATE_SUCCESS",
        payload: masterCardDetail
      });
    }
    dispatch({
      type: "MASTER_CARD_DETAIL_UPDATE_FAILED",
      payload: responseBody.message || "Oops! Something went wrong."
    });
    return responseBody;
  } catch (error) {
    dispatch({
      type: "MASTER_CARD_DETAIL_UPDATE_FAILED",
      payload: error.message || "An error has occurred."
    });
    return error;
  }
};

export const getMasterCardInfo = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/client/master/card/list?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    // return { ...error.response.data };
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const getCardSelectionType = async (clientId) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/client/virtual/card/type/list?clientId=${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      }
    });
    return response.data;
  } catch (error) {
    return {
      error: true,
      message: "Server Expection Error",
      data: null
    }
  }
}

export const savePaymentCardtype = ({ clientId, cardTypeId }) => async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/add/client/virtual/card/type`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      },
      data: JSON.stringify({
        clientId: clientId,
        cardTypeId: cardTypeId
      })
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        "An error has occured",
      data: {},
      error: true
    };
  }
}

export const deleteProgramDetails = ({ clientId, programId }) => async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/delete/master/card/details?clientId=${clientId}&programDetailsId=${programId}`,
      method: "DELETE",
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
      ...error.response.data,
    };
  }
}

export const getTemplateList = async (values) => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.masterCardService}/1/gettemplatedetail`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      },
      data: JSON.stringify(values)
    });
    const responseBody = await response.data && response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message: "Server Expection Error",
      data: null
    }
  }
}

export const getTimeZoneList = async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/timezone/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      }
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message: "Server Expection Error",
      data: null
    }
  }
}

export const getCountryCodeList = async () => {
  try {
    const accessToken = await getAccessToken()
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/country/code/list`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
        'pragma': 'no-cache'
      }
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      error: true,
      message: "Server Expection Error",
      data: null
    }
  }
}

export const updateFormValues = (values) =>  {
  return {
    type: "PAYMENT_DETAIL_UPDATE",
    payload: values
  };
}
