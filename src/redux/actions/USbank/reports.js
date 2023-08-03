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
    // Do something with response error
    if (error?.response?.status === 401) {
      let cookies = new Cookies();
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return Promise.reject(error);

  }
);

/*
Get report list
*/
export const getReportList = ({
  userId,
  portalProfileId,
  portalTypeId,
  name,
  dateFilter,
  startDate,
  endDate,
  rowsPerPage,
  page,
  sortColumn,
  sortOrder,
}) => async (dispatch) => {
  const offset = rowsPerPage * page;
  const newSortColumn = sortColumn || "reportName";
  const newSortOrder = sortOrder || "asc";
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/reporting/list?clientId=${portalProfileId}&limit=${rowsPerPage}&offset=${offset}&sortColumn=${newSortColumn}&sortOrder=${newSortOrder}&reportName=${name}`,
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
        type: "USBANK_REPORT_LIST_FETCH_SUCCESS",
        payload: responseBody.data && responseBody.data.rows,
        totalCount: (responseBody.data && responseBody.data.count) || 0,
      });
      return true;
    }
    dispatch({
      type: "USBANK_REPORT_LIST_FETCH_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "USBANK_REPORT_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/**
 * US Bank API details
 */
export const downloadDailyEnrollment = ({startDate, endDate}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();  
    const response = await axios({
      url: `${config.apiBase.consumerService}/daily-enrollment-report`,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        "reportStartDate": startDate || null,
        "reportEndDate": endDate || null, 
      }),
    });
    
    if (response.status === 404) {
      dispatch({
        type: "USBANK_FETCH_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFound,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "USBANK_FETCH_REPORT_DOWNLOAD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const emailSmsRejectionFile = ({startDate, endDate}) => async (dispatch) => {  
  try {
    const accessToken = await getAccessToken();    
    const response = await axios({
      url: `${config.apiBase.consumerService}/email-sms-rejection-report`,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({ 
        "reportStartDate": startDate || null,
        "reportEndDate": endDate || null, 
      }),
    });

    if (response.status === 404) {
      dispatch({
        type: "USBANK_FETCH_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFound,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "USBANK_FETCH_REPORT_DOWNLOAD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const downloadPaymentStatusReport = ({
    date, unitName, portalProfileId, reportCode, startDate, endDate
  }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.reportService}/downloadpaymentreport`,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        "reportCode": reportCode || null,
        "clientID": portalProfileId || null,
        "reportDate": startDate || null, 
        "format": "csv",
        "fromDate": "",
        "toDate": endDate || null,
        "businessType": 2,
        "businessUnit": unitName === "none" ? "" : unitName || null,
        "clientIDs": null,
      }),
    });
    if (response.status === 404) {
      dispatch({
        type: "USBANK_FETCH_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFound,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "USBANK_FETCH_REPORT_DOWNLOAD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const updateReportSubscription = ({
  subscription,
  clientReportId,
  frequency,
  frequencyId,
  dataType,
  reportCode,
  reportName
}) => async (dispatch) => {
  try {
    const reportData = {
      subscription: subscription || false,
      clientReportId: clientReportId || null,
      frequency: frequency || null,
      frequencyId: frequencyId || null,
      dataType: dataType || null,
    };
    if (reportCode !== false) {
      reportData.reportCode = reportCode || null;
    }
    if(reportName){
      reportData.reportName = reportName
    }
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/reporting/subscription`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(reportData),
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "USBANK_FETCH_REPORT_SUBSCRIPTION_SUCCESS",
        payload: { subscription, clientReportId, frequency, frequencyId },
      });
      return true;
    }
    dispatch({
      type: "USBANK_FETCH_REPORT_SUBSCRIPTION_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "USBANK_FETCH_REPORT_SUBSCRIPTION_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getFrequencyList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.notificationService}/notification/report/subscription`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "USBANK_FETCH_FREQUENCY_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "USBANK_FETCH_FREQUENCY_LIST_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "USBANK_FETCH_FREQUENCY_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getSmsOptOutReport = ({startDate, endDate}) => async (dispatch) => {  
  try {
    const accessToken = await getAccessToken();    
    const response = await axios({
      url: `${config.apiBase.consumerService}/sms-opt-out-report`,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({ 
        "reportStartDate": startDate || null,
        "reportEndDate": endDate || null, 
      }),
    });

    if (response.status === 404) {
      dispatch({
        type: "USBANK_FETCH_SMSOPTOUT_LIST_FAILED",
        payload: translatedData.reportNotFound,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "USBANK_FETCH_SMSOPTOUT_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};