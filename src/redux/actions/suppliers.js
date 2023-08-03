import Cookies from "universal-cookie";
import axios from "axios";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from "~/i18n";

const cookies = new Cookies();
const language = cookies.get("localeLang") || "en";
const translatedData =
  i18n.logger.options.resources[language].translation.componentData.reduxData;

axios.interceptors.request.use(
  (request) => {
    request.headers["accept-language"] = i18n.language;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    if (response.status == 401) {
      let cookies = new Cookies();
      cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
      cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
      cookies.remove('@clientUserId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return response;
  },
  function (error) {
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

export const getClientSupplierUpdateAction =
  (payeeId, filters = {}) =>
    async (dispatch) => {
      const {
        payeeIdSearch,
        actionNeeded,
        formattedStartDate,
        formattedEndDate,
        actionTypes,
        payeeNameSearch,
      } = filters;
      try {
        const accessToken = await getAccessToken();
        const response = await axios({
          url: `${config.apiBase.payeeService}/payees/review-changes`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            pragma: "no-cache",
          },
          data: JSON.stringify({
            clientId: payeeId,
            actionNeeded: actionNeeded ? actionNeeded : undefined,
            payeeIdSearch: payeeIdSearch ? payeeIdSearch : undefined,
            actionTypes:
              actionTypes && actionTypes.length > 0 ? actionTypes : undefined,
            startDate: formattedStartDate ? formattedStartDate : undefined,
            endDate: formattedEndDate ? formattedEndDate : undefined,
            payeeNameSearch: payeeNameSearch ? payeeNameSearch : undefined,
          }),
        });

        const responseBody = await response.data;
        if (!responseBody.error) {
          dispatch({
            type: "UPDATE_SUPPLIER_UPDATE_LIST",
            payload: responseBody.data && responseBody.data.payeeReviewChange ? responseBody.data.payeeReviewChange : [],
          });
          return true;
        }
        dispatch({
          type: "UPDATE_SUPPLIER_UPDATE_LIST_FAILED",
          payload: responseBody.message || translatedData.SomethingWentWrong,
        });
        return false;
      } catch (error) {
        dispatch({
          type: "UPDATE_SUPPLIER_UPDATE_LIST_FAILED",
          payload:
            (error.response && error.response.data.message) ||
            translatedData.ErrorOccurred,
        });
        return false;
      }
    };

export const getClientSupplierUpdateActionB2C =
  (payeeId, filters, offset, limit = {}, flag) =>
    async (dispatch) => {
      const {
        payeeIdSearch,
        formattedStartDate,
        formattedEndDate,
        actionTypes,
        payeeNameSearch,
      } = filters;
      try {
        const accessToken = await getAccessToken();
        const response = await axios({
          url: `${config.apiBase.consumerService}/consumer/updates`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            pragma: "no-cache",
          },
          data: JSON.stringify({
            clientId: payeeId,
            consumerIdentifier: payeeIdSearch ? payeeIdSearch : undefined,
            actionTypeId:
              actionTypes && actionTypes.length > 0 ? actionTypes : undefined,
            startDate: formattedStartDate ? formattedStartDate : undefined,
            endDate: formattedEndDate ? formattedEndDate : undefined,
            consumerName: payeeNameSearch ? payeeNameSearch : undefined,
            offset: offset,
            limit: limit,
            unreadFlag: flag
          }),
        });

        const responseBody = await response.data;
        if (!responseBody.error) {
          dispatch({
            type: "UPDATE_SUPPLIER_UPDATE_LIST_B2C",
            payload: responseBody.data ? responseBody.data : [],
          });
          return true;
        }
        dispatch({
          type: "UPDATE_SUPPLIER_UPDATE_LIST_FAILED_B2C",
          payload: responseBody.message || translatedData.SomethingWentWrong,
        });
        return false;
      } catch (error) {
        dispatch({
          type: "UPDATE_SUPPLIER_UPDATE_LIST_FAILED_B2C",
          payload:
            (error.response && error.response.data.message) ||
            translatedData.ErrorOccurred,
        });
        return false;
      }
    };

export const getClientSupplierUpdateBestBuyAction =
  (payeeId, filters = {}) =>
    async (dispatch) => {
      const {
        payeeIdSearch,
        actionNeeded,
        formattedStartDate,
        formattedEndDate,
        actionTypes,
        payeeNameSearch, status
      } = filters;
      try {
        const accessToken = await getAccessToken();
        const response = await axios({
          url: `${config.apiBase.payeeService}/payer-review-updates`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            pragma: "no-cache",
          },
          data:
            JSON.stringify({
              actionNeeded: actionNeeded ? actionNeeded : undefined,
              payeeIdSearch: payeeIdSearch ? payeeIdSearch : undefined,
              actionTypes:
                actionTypes && actionTypes.length > 0 ? actionTypes : undefined,
              startDate: formattedStartDate ? formattedStartDate : undefined,
              endDate: formattedEndDate ? formattedEndDate : undefined,
              payeeNameSearch: payeeNameSearch ? payeeNameSearch : undefined,
              isPending: status ? status.find((i) => i.label === "Pending").selected : false,
              isAccepted: status ? status.find((i) => i.label === "Accepted").selected : false,
              isRejected: status ? status.find((i) => i.label === "Rejected").selected : false,
            }),
        });

        const responseBody = await response.data;
        if (!responseBody.error) {
          dispatch({
            type: "UPDATE_SUPPLIER_UPDATE_LIST_BEST_BUY",
            payload: responseBody.data && responseBody.data.rows ? { list: responseBody.data.rows, pendingCount: responseBody.data.pendingCount } : { list: [], pendingCount: 0 },
          });
          return true;
        }
        dispatch({
          type: "UPDATE_SUPPLIER_UPDATE_LIST_FAILED_BEST_BUY",
          payload: responseBody.message || translatedData.SomethingWentWrong,
        });
        return false;
      } catch (error) {
        dispatch({
          type: "UPDATE_SUPPLIER_UPDATE_LIST_FAILED_BEST_BUY",
          payload:
            (error.response && error.response.data.message) ||
            translatedData.ErrorOccurred,
        });
        return false;
      }
    };

export const updateUnreadCount = (supplierUpdateList, unReadCount) => async (dispatch) => {
  try {
    dispatch({
      type: "UPDATE_PAYEE_UNREAD_COUNTS_B2C",
      payload: { supplierUpdateList, unReadCount },
    });
  } catch (error) {
    throw translatedData.ErrorOccurred;
  }
};

export const updateCount = (counts) => async (dispatch) => {
  try {
    dispatch({
      type: "UPDATE_PAYEE_COUNTS",
      payload: counts,
    });
  } catch (error) {
    throw translatedData.ErrorOccurred;
  }
};

export const updateBestCount = (counts) => async (dispatch) => {
  try {
    dispatch({
      type: "UPDATE_PAYEE_BEST_BUY_COUNTS",
      payload: counts,
    });
    return true;
  } catch (error) {
    throw translatedData.ErrorOccurred;
  }
};

export const fetchUnmaskedAccountNumber = (accountId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/getunmaskeddata`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        category: 'BANK_ACCOUNT_NUMBER',
        id: accountId?.toString(),
      }),
    });
    const responseBody = response.data
    if (!responseBody.error && responseBody.data) {
      dispatch({
        type: "FETCH_UNMASKED_ACCOUNT_NUMBER_SUCCESS",
        payload:responseBody
      });
      return true;
    }
    dispatch({
      type: "FETCH_UNMASKED_ACCOUNT_NUMBER_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_UNMASKED_ACCOUNT_NUMBER_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};
