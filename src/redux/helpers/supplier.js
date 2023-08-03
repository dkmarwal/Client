import axios from "axios";
import { CurrencyFlag } from "react-currency-flags/dist/components";
import Cookies from "universal-cookie";
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

export const getClientSupplierUpdate = async (payeeId, filters = {}) => {
  const {payeeIdSearch, actionNeeded, formattedStartDate, formattedEndDate, actionTypes, payeeNameSearch} = filters;
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/review-changes`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        clientId: payeeId,
        actionNeeded: actionNeeded ? actionNeeded : undefined,
        payeeIdSearch: payeeIdSearch ? payeeIdSearch : undefined, 
        actionTypes: actionTypes && actionTypes.length > 0 ? actionTypes : undefined, 
        startDate: formattedStartDate ? formattedStartDate : undefined,      
        endDate: formattedEndDate ? formattedEndDate : undefined,
        payeeNameSearch: payeeNameSearch ? payeeNameSearch : undefined,

      }),
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getClientSupplierUpdateBestBuy = async (payeeId, filters = {}) => {
  const {payeeIdSearch, actionNeeded, formattedStartDate, formattedEndDate, actionTypes, payeeNameSearch} = filters;
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payer-review-updates`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        actionNeeded: actionNeeded ? actionNeeded : undefined,
        payeeIdSearch: payeeIdSearch ? payeeIdSearch : undefined, 
        actionTypes: actionTypes && actionTypes.length > 0 ? actionTypes : undefined, 
        startDate: formattedStartDate ? formattedStartDate : undefined,      
        endDate: formattedEndDate ? formattedEndDate : undefined,
        payeeNameSearch: payeeNameSearch ? payeeNameSearch : undefined,

      }),
    });
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierUpdateContact = async ({ payeeId, entityId, flag }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/contacts/${entityId}?prevDetails=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = [], error = false, message = "" } = response.data;

    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousPayeeContact, currentPayeeContact } = data;
        const { contactTypeHistory, ...restProps } = previousPayeeContact;
        const {
          contactType,
          ...restCurrentProps
        } = currentPayeeContact;
        return {
          prevDetails: { ...contactTypeHistory, ...restProps },
          newDetails: { ...contactType, ...restCurrentProps },
        };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const { contactType,
          ...restCurrentProps
        } = data;
        return {
          newDetails: { ...contactType, ...restCurrentProps },
        };
      }
    }
    return false;
  } catch (error) {
    // return error.response;
    return error && error.response ? { ...error.response.data } : {};
  }
};

export const getSupplierCompanyUpdate = async ({ payeeId, prevDetails }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}?prevDetails=${prevDetails}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = [], error = false, message = "" } = response.data;
    if (Object.keys(data).length > 0 && prevDetails) {
      const { previousPayee, currentPayee } = data;
      const {
        payeeLocations,
        createdAt,
        updatedAt,
        ...restPrevData
      } = previousPayee;
      const {
        payeeLocations: currentPayeeLoc,
        createdAt: currCreatedAt,
        updatedAt: currUpdatedAt,
        ...restCurrentData
      } = currentPayee;
      return { prevDetails: restPrevData, newDetails: restCurrentData };
    } else if (Object.keys(data).length > 0) {
      return data;
    }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierLocationUpdate = async ({ payeeId, entityId, flag }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/locations/${entityId}?prevDetails=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = [], error = false, message = "" } = response.data;
    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousPayeeLocation, currentPayeeLocation } = data;
        const {
          createdAt,
          updatedAt,
          locationTypeHistory,
          ...restPrevData
        } = previousPayeeLocation;
        const {
          createdAt: currCreatedAt,
          updatedAt: currUpdatedAt,
          locationTypeHistory: currentLocationHistory,
          ...restCurrentData
        } = currentPayeeLocation;
        return { prevDetails: restPrevData, newDetails: restCurrentData };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const {
          // createdAt: currCreatedAt,
          // updatedAt: currUpdatedAt,
          locationType,
          ...restCurrentData
        } = data;
        return { newDetails: restCurrentData };
      }
    }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierBankUpdate = async ({ payeeId, entityId, flag, isUnshare }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: isUnshare ? `${config.apiBase.payeeService}/payees/${payeeId}/payment/bank-accounts/${entityId}?previousDetail=${flag}&remitToIdRequired=true` :
        `${config.apiBase.payeeService}/payees/${payeeId}/payment/bank-accounts/${entityId}?previousDetail=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = {}, error = false, message = "" } = response.data;
    
    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousDetail, currentDetail } = data;
         
        const {
          payeeBankAccountLocations,
          accountType,
          accountClass,
          locationOption,
          validationStatus:pValidationStatus,
          remitToIds:pRemitToIds,
          ...restProps
        } = previousDetail;
        const {
          payeeBankAccountLocations: payeeBank,
          accountType: accnt,
          accountClass: accClas,
          locationOption: locat,
          validationStatus,
          remitToIds,
          ...restCurrProps
        } = currentDetail;
        return { prevDetails: { ...restProps, validationStatus: pValidationStatus || "", remitToIds: pRemitToIds ||"" , payeeBankAccountLocations }, newDetails: { ...restCurrProps, validationStatus, remitToIds, payeeBankAccountLocations: payeeBank } };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const {
          payeeBankAccountLocations,
          accountType,
          accountClass,
          locationOption,
          ...restCurrProps
        } = data;
        return { newDetails: { ...restCurrProps, payeeBankAccountLocations } };
      }
    }

    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierVCAUpdate = async ({ payeeId, entityId, flag, isUnshare }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: isUnshare ? `${config.apiBase.payeeService}/payees/${payeeId}/payment/virtual-cards/${entityId}?previousDetail=${flag}&remitToIdRequired=true` :
        `${config.apiBase.payeeService}/payees/${payeeId}/payment/virtual-cards/${entityId}?previousDetail=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = {}, error = false, message = "" } = response.data;
    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousDetail, currentDetail } = data;
        const { commercialCardType, ...restProps } = previousDetail;
        const { commercialCardType: cardtype, ...restCurrProps } = currentDetail;
        return { prevDetails: restProps, newDetails: restCurrProps };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const { commercialCardType, ...restCurrProps } = data;
        return { newDetails: restCurrProps };
      }
    }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierWireUpdate = async ({ payeeId, entityId, flag }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/payment/wires/${entityId}?previousDetail=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = {}, error = false, message = "" } = response.data;
    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousDetail, currentDetail } = data;
        const { bicCode, accountName, bankCountryIso, bankName, routingCode, accountNumber, currencyCode, validationStatus ,...restProps} = previousDetail;
        const { bicCode: curBicCode, accountName: curAccountName, bankCountryIso: curBankCountryIso, bankName: curBankName, routingCode:curRoutingCode, accountNumber: curAccountNumber, currencyCode: curCurrencyCode, validationStatus:curValidationStatus, ...restCurrProps} = currentDetail;
        return { prevDetails: { bicCode: bicCode, accountName: accountName, bankCountryIso: bankCountryIso, bankName: bankName, routingCode: routingCode, accountNumber: accountNumber, currencyCode: currencyCode, validationStatus: validationStatus, restProps}, newDetails: { bicCode: curBicCode, accountName: curAccountName, bankCountryIso: curBankCountryIso, bankName: curBankName, routingCode:curRoutingCode, accountNumber: curAccountNumber, currencyCode: curCurrencyCode, validationStatus:curValidationStatus, restCurrProps}};
      }
    } else {
      if (Object.keys(data).length > 0) {
        const { bicCode, accountName, bankCountryIso, bankName, routingCode, accountNumber, currencyCode, validationStatus ,...restProps} = data;
        return { newDetails: { bicCode: bicCode, accountName: accountName, bankCountryIso: bankCountryIso, bankName: bankName, routingCode: routingCode, accountNumber: accountNumber, currencyCode: currencyCode, validationStatus: validationStatus, restProps} };
      }
    }
    return false;
  } catch (error) {
    return error.response;
  }
};

export const getSupplierCrossBorderUpdate = async ({ payeeId, entityId, flag }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/payment/cross-borders/${entityId}?previousDetail=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = {}, error = false, message = "" } = response.data;
    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousDetail, currentDetail } = data;
        const {
          payeeCrossBorderLocations,
          accountType,
          accountClass,
          locationOption,
          ...restProps
        } = previousDetail;
        const {
          payeeCrossBorderLocations: payeeBank,
          accountType: accnt,
          accountClass: accClas,
          locationOption: locat,
          ...restCurrProps
        } = currentDetail;
        return { prevDetails: { ...restProps, payeeCrossBorderLocations }, newDetails: { ...restCurrProps, payeeCrossBorderLocations: payeeBank } };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const {
          payeeCrossBorderLocations,
          accountType,
          accountClass,
          locationOption,
          ...restCurrProps
        } = data;
        return { newDetails: { ...restCurrProps, payeeCrossBorderLocations } };
      }
    }

    return false;
  } catch (error) {
    return error.response;
  }
};

export const approveSupplierUpdate = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/payments/approve`,
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
    return { ...error.response.data };
  }
};

export const approveSupplierCompanyUpdate = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payee/information/approve`,
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
    return { ...error.response.data };
  }
};

export const unshareSupplier = async (payeeId, clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/unshare-accept?payeeId=${payeeId}&clientId=${clientId}`,
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
    return { ...error.response.data };
  }
};
export const rejectSupplierUpdate = async (data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/payments/reject`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: data,
    });
 
    const { data = {}, error = false, message = "" } = response;

    return true;
  } catch (error) {
    return error.response;
  }
};

export const updateNotificationRead = async (id) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payee/notification-read?payeeActionTypeId=${id}`,
      method: "POST",
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

export const getSupplierBestBuyUpdate = async (payerReviewUpdateId) => {
  try {
    const flag= false;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payer-review-updates/${payerReviewUpdateId}/details`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const {status} = response;
    const { data = {}, error = false, message = "" } = response.data;
    const { subjectType } = data;
    if (Object.keys(data).length > 0 && !error) {
        switch (subjectType) {
          case "CONTACT":
            const { payeeContact, newPayeeContact } = data;
            return { prevDetails: payeeContact, newDetails: newPayeeContact, error, message, status };
          case "COMPANY":
            const { payee, newPayee } = data;
            return { prevDetails: payee, newDetails: newPayee, error, message, status };
          case "BANK_ACCOUNT":
            const { bankAccount, newBankAccount } = data;
            return { prevDetails: bankAccount, newDetails: newBankAccount, error, message,status };
          case "VIRTUAL_CARD":
            const { virtualCard, newVirtualCard } = data;
            return { prevDetails: virtualCard, newDetails: newVirtualCard, error, message, status };
          case "LOCATION":
            const { payeeLocation, newPayeeLocation } = data;
            return { prevDetails: payeeLocation, newDetails: newPayeeLocation, error, message, status };
          default: {
            return { prevDetails: {}, newDetails: {}, error, message, status };
          }
        }
    }else{
      return {
        error,
        message,
        status
      }
    }
  } catch (error) {
    const {status, data} = error.response;
    return {...data, status};
  }
};

export const rejectSupplierUpdateBestBuy = async (payloadData) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payer-review-updates/reject`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(payloadData),
    });
    const {data, status} = response
    let newResponse = {...data, status};
    return newResponse;
  } catch (error) {
    const {data, status} = error.response;
    return { ...data, status };
  }
};

export const approveSupplierUpdateBestBuy = async (payloadData) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payer-review-updates/accept`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(payloadData),
    });
    const {data, status} = response
    let newResponse = {...data, status};
    return newResponse;
  } catch (error) {
    const {data, status} = error.response;
    return { data, status };
  }
};

export const getConsumerUpdateDetails = async ({consumerUpdatesId}) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/consumer/updates/info?consumerUpdatesId=${consumerUpdatesId}`,
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
}

export const getSupplierUpdateClearingHouse = async ({ payeeId, entityId, flag }) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/${payeeId}/clearingHousename?prevDetails=${flag}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const { data = [], error = false, message = "" } = response.data;

    if (flag === true) {
      if (Object.keys(data).length > 0) {
        const { previousData, currentData } = data;

        return {
          prevDetails: { clearingHouseName:previousData?.value || ""},
          newDetails: { clearingHouseName:currentData?.value || ""},
        };
      }
    } else {
      if (Object.keys(data).length > 0) {
        const { previousData, currentData } = data;
        return {
          newDetails: { clearingHouseName:currentData?.value || ""},
        };
      }
    }
    return false;
  } catch (error) {
    // return error.response;
    return error && error.response ? { ...error.response.data } : {};
  }
};