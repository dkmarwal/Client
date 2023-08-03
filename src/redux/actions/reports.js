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
        type: "REPORT_LIST_FETCH_SUCCESS",
        payload: responseBody.data && responseBody.data.rows,
        totalCount: (responseBody.data && responseBody.data.count) || 0,
      });
      return true;
    }
    dispatch({
      type: "REPORT_LIST_FETCH_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "REPORT_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Create new report
*/
export const createReport = ({
  userId,
  portalProfileId,
  portalTypeId,
  report,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        reportName: report.name || "",
        reportType: report.reportType || "",
        paymentParameter: report.selectedPaymentParameters || [],
      }),
    });

    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "CREATE_REPORT_SUCCESS",
        payload: { ...report, reportId: responseBody.data.reportId }, //add reportId from response
      });
      return { ...report, reportId: responseBody.data.reportId };
    }
    dispatch({
      type: "CREATE_REPORT_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CREATE_REPORT_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Update report
*/
export const updateReport = ({
  userId,
  portalProfileId,
  portalTypeId,
  report,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        reportName: report.name || "",
        reportType: report.reportType || "",
        paymentParameter: report.selectedPaymentParameters || [],
      }),
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CREATE_REPORT_SUCCESS",
        payload: { ...report, reportId: responseBody.data.reportId }, //add reportId from response
      });
      return { ...report, reportId: responseBody.data.reportId };
    }
    dispatch({
      type: "CREATE_REPORT_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CREATE_REPORT_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

export const getDataTypes = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/payment-type/list`,
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
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getPaymentParameterList = ({
  portalProfileId,
  portalTypeId,
  userId,
  reportType,
}) => async (dispatch) => {
  const data = [
    { id: 1, key: "PaymentID", format: "int", name: "Payment ID" },
    {
      id: 2,
      key: "PaymentReference",
      format: "text",
      name: "Payment Refrence",
    },
    { id: 3, key: "ClientName", format: "string", name: "Client Name" },
    { id: 4, key: "SupplierName", format: "string", name: "Payee Name" },
    {
      id: 5,
      key: "ClientAccountNo",
      format: "string",
      name: "Client Account No.",
    },
    { id: 6, key: "Currency", format: "currency", name: "Currency" },
    { id: 7, key: "PaymentAmount", format: "string", name: "Payment Amount" },
    {
      id: 8,
      key: "SupplierAccountNo",
      format: "string",
      name: "Payee Account No.",
    },
    { id: 9, key: "ValueDate", format: "date", name: "Value Date" },
    { id: 10, key: "PaymentStatus", format: "string", name: "Payment Status" },
    {
      id: 11,
      key: "DiscountAmount",
      format: "string",
      name: "Discount Amount",
    },
    { id: 12, key: "PurchaseOrder", format: "string", name: "Purchase Order" },
  ];
  dispatch({
    type: "FETCH_PAYMENT_PARAMETER_LIST_SUCCESS",
    payload: data,
  });
  return data;

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}`,
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
        type: "FETCH_PAYMENT_PARAMETER_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_PAYMENT_PARAMETER_LIST_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PAYMENT_PARAMETER_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const fetchReportView = ({
  portalProfileId,
  portalTypeId,
  userId,
  reportType,
  dateFilter,
}) => async (dispatch) => {
  const data = [
    {
      PaymentID: 1,
      PaymentReference: "PaymentID1",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2019-10-12",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 2,
      PaymentReference: "PaymentID2",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2019-10-11",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 3,
      PaymentReference: "PaymentID3",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2019-10-9",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 4,
      PaymentReference: "PaymentID4",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2019-10-8",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 5,
      PaymentReference: "PaymentID5",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2019-10-7",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 6,
      PaymentReference: "PaymentID4",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2019-10-6",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 7,
      PaymentReference: "PaymentID",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2019-10-5",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 7,
      PaymentReference: "PaymentID",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2019-10-5",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 9,
      PaymentReference: "PaymentID",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2020-11-4",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 10,
      PaymentReference: "PaymentID",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2020-12-3",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 11,
      PaymentReference: "PaymentID",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2020-12-2",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
    {
      PaymentID: 12,
      PaymentReference: "PaymentID",
      ClientName: "",
      SupplierName: "",
      ClientAccountNo: "",
      Currency: "",
      PaymentAmount: "",
      SupplierAccountNo: "",
      ValueDate: "2020-12-1",
      PaymentStatus: "",
      DiscountAmount: "",
      PurchaseOrder: "",
    },
  ];
  dispatch({
    type: "REPORT_DATA_LIST_FETCH_SUCCESS",
    payload: data,
    totalCount: 12,
  });
  return true;

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}`,
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
        type: "REPORT_DATA_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
        totalCount: responseBody.data.TotalCount || 0,
      });
      return responseBody.data;
    }
    dispatch({
      type: "REPORT_DATA_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "REPORT_DATA_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const fetchReportFilter = ({
  portalProfileId,
  portalTypeId,
  userId,
  reportType,
}) => async (dispatch) => {
  const data = [
    { id: 1, name: "ALL" },
    { id: 2, name: "TODAY" },
    { id: 3, name: "PREVIOUS MONTH" },
    { id: 4, name: "PREVIOUS QUARTER" },
    { id: 5, name: "PREVIOUS YEAR" },
    { id: 6, name: "LAST 7 DAYS" },
    { id: 7, name: "LAST 30 DAYS" },
    { id: 8, name: "CUSTOM" },
  ];
  dispatch({
    type: "REPORT_FILTER_LIST_FETCH_SUCCESS",
    payload: data,
  });
  return true;

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}`,
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
        type: "REPORT_FILTER_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "REPORT_FILTER_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "REPORT_FILTER_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const removeReport = ({ reportIds }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        reportId: reportIds || null,
      }),
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "REMOVE_REPORT_SUCCESS",
        payload: { reportIds: reportIds },
      });
      return true;
    }
    dispatch({
      type: "REMOVE_REPORT_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "REMOVE_REPORT_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
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
        type: "FETCH_FREQUENCY_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_FREQUENCY_LIST_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_FREQUENCY_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const downloadPayeeAuditReport = ({ clientIds, campaignIds, startDate, endDate, payeeId }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/campaign/payee/report?reportStartDate=${startDate}&reportEndDate=${endDate}`,
      method: "POST",
      responseType: 'blob',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        clientId: clientIds,
        campaignId: campaignIds,
        payeeIds : payeeId
      }),
    });

    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_SUCCESS",
        payload: responseBody.data,
      });
      return response;
    }
    if (response.status == 404) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
        payload: "Report data not found.",
      });
      return false;
    }
    if (response.status === 416 || response.status === 504) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
        payload: "The selected report exceeds the download size limit. Please reduce the filtered timeframe and try again.",
      });
      return false;
    }
    if (response.status >= 500) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
        payload: response.statusText || "An error has occurred",
      });
      return false;
    }
    if (response.status == 400) {
      dispatch({
        type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
        payload: response.statusText || "An error has occurred",
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_PAYEE_AUDIT_REPORT_DOWNLOAD_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const downloadStaticReport = ({
  portalProfileId,
  clientIds,
  startDate,
  endDate,
  reportCode,
  campaignIds,
  format,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    //const campaignFilter = reportCode == "enrollmentSummary"?`&campaignId=${campaignId}`:`&reportStartDate=${startDate}`;
    const campaignFilter =
      reportCode === "enrollmentSummary" ? "" : `&reportStartDate=${startDate}`;
    const response = await axios({
      url: `${config.apiBase.payeeService}/download/static/report?reportCode=${reportCode}&format=${format}${campaignFilter}`,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        //clientId: [portalProfileId] || [],
        clientId: clientIds || [],
        campaignId: reportCode === "enrollmentSummary" ? campaignIds : [],
      }),
    });

    if (response.status === 404) {
      dispatch({
        type: "FETCH_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFound,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DOWNLOAD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const downloadFileProcessingStaticReport = ({
  portalProfileId,
  startDate,
  endDate,
  reportCode,
  format,
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
        reportCode: reportCode || null,
        clientID: portalProfileId || null,
        reportDate: startDate || null,
        format: format,
        //reportCode: "DailyPaymentStatusReport",
        //clientID: 956579174,
        //reportDate: "2020-10-12",
        //format: "xlsx"
      }),
    });

    if (response.status === 404) {
      dispatch({
        type: "FETCH_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFound,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DOWNLOAD_FAILED",
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
        type: "FETCH_REPORT_SUBSCRIPTION_SUCCESS",
        payload: { subscription, clientReportId, frequency, frequencyId },
      });
      return true;
    }
    dispatch({
      type: "FETCH_REPORT_SUBSCRIPTION_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_SUBSCRIPTION_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get Child parent list for reports
*/

export const getCampaignList = ({ selectedClient }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/campaign-list`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        clientId: selectedClient,
      })
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_CAMPAIGN_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: "FETCH_CAMPAIGN_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CAMPAIGN_LIST_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

export const fetchClientList = ({
  portalProfileId,
  portalTypeId,
  userId,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios({
      //url: `${config.apiBase.clientService}/clients/child-parent/32`,
      url: `${config.apiBase.clientService}/clients/child-filters`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "FETCH_CHILD_CLIENT_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_CHILD_CLIENT_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CHILD_CLIENT_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/*
Reports: Get campaign list by client id
*/
export const fetchCampaignList = ({ selectedClient }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/campaign-list`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        clientId: selectedClient || [],
      }),
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "CAMPAIGN_LIST_FETCH_SUCCESS",
        payload: {
          campaignList: responseBody.data || [],
          totalCount: (responseBody.data && responseBody.data.totalcount) || 0,
        },
      });
      return true;
    }
    dispatch({
      type: "CAMPAIGN_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CAMPAIGN_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const getPayeeList = ({clientIds, campaignIds, companyName}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees/companyname`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        clientId: clientIds || null,
        campaignId: campaignIds || "",
        companyName: companyName || ""
      })
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_REPORT_PAYEE_LIST_SUCCESS",
        payload: responseBody?.data?.rows || [],
      });
      return true
    }
    dispatch({
      type: "FETCH_REPORT_PAYEE_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_PAYEE_LIST_FAILED",
      payload: error.response && error.response.data.message || "An error has occurred."
    });
    return false;
  }
};

/**
 * Reports: Get report type list
 */
export const fetchReportDataTypeList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/reporting/data-types`,
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
        type: "FETCH_REPORT_DATA_TYPE_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_REPORT_DATA_TYPE_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DATA_TYPE_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/**
 * Get report parameters on the basis of report data-type
 */
export const fetchReportParameters = (dataTypeId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/reporting/parameters?dataTypeId=${dataTypeId}`,
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
        type: "FETCH_REPORT_PARAMETERS_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_REPORT_PARAMETERS_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DATA_TYPE_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/**
 * Create dynamic report
 */
export const createDynamicReport = (report, reportData) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/report`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: reportData,
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "CREATE_DYNAMIC_REPORT_SUCCESS",
        payload: {
          ...report,
          clientReportId: responseBody.data.clientReportId,
        }, //add clientReportId from response
      });
      return responseBody;
    }
    dispatch({
      type: "CREATE_DYNAMIC_REPORT_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return {
      error: true,
      message: responseBody.message || "Oops! Something went wrong.",
    };
  } catch (error) {
    dispatch({
      type: "CREATE_DYNAMIC_REPORT_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return {
      error: true,
      message:(error.response && error.response.data.message) ||
      "An error has occurred.",
    };
  }
};

/**
 * download dynamic report
 */
export const downloadDynamicReport = (appType, downloadData) => async (dispatch) => {
  const url = appType === 2 ? `${config.apiBase.consumerService}/download-consumer-enrollment-report` : `${config.apiBase.payeeService}/download-report`;
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: url,
      method: "POST",
      responseType: "blob",
	  timeout: 360000,//6 min waiting time in milliseconds
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(downloadData),
    });
    if (response.status === 404) {
      dispatch({
        type: "FETCH_DYNAMIC_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFoundInDateRange,
      });
      return {error:true, message:translatedData.reportNotFoundInDateRange};
    } 
    if(response.status === 400) {
      dispatch({
        type: "FETCH_DYNAMIC_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.tryAgain,
      });
      return {error:true, message:translatedData.tryAgain};
    }
    if (response.status === 416 || response.status === 504 || response.status === 502) {
      dispatch({
        type: "FETCH_DYNAMIC_REPORT_DOWNLOAD_FAILED",
        payload:translatedData.reportLateResponse,
      });
      return {error:true, message:translatedData.reportLateResponse};
    }
    if (response.status >= 500) {
      dispatch({
        type: "FETCH_DYNAMIC_REPORT_DOWNLOAD_FAILED",
        payload:translatedData.tryAgain,
      });
      return {error:true, message: translatedData.tryAgain};
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_DYNAMIC_REPORT_DOWNLOAD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.tryAgain,
      error: true,
    });
    return {error:true, message: (error.response && error.response.data.message) ||
      translatedData.tryAgain};
  }
};

/**
 * delete dynamic report
 */
export const deleteDynamicReport = (reportIds) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/report`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data:JSON.stringify({
        clientReportIds:reportIds
      })
    });

    const responseBody = await response.data;
    if (!responseBody.error) {
      dispatch({
        type: "DELETE_DYNAMIC_REPORT_SUCCESS",
        payload: responseBody.message,
      });
      return true;
    }
    dispatch({
      type: "DELETE_DYNAMIC_REPORT_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "DELETE_DYNAMIC_REPORT_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

/**
 * get selected report details from List
 */
export const getReportDetailsFromList = (selectedReportData) => async (
  dispatch
) => {
  dispatch({
    type: "FETCH_REPORT_DETAILS_SUCCESS",
    payload: selectedReportData,
  });
  return true;
};

/**
 * get selected report selected parameters using clientReportId
 */
export const fetchReportSelectedParameters = (clientReportId) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/reporting/client-reportbyid?clientReportId=${clientReportId}`,
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
        type: "FETCH_REPORT_DETAILS_BY_ID_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_REPORT_DETAILS_BY_ID_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DETAILS_BY_ID_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return;
  }
};

/**
 * update dynamic report details
 */
export const updateDynamicReportDetails = (
  reportData,
  clientReportId
) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/report?clientReportId=${clientReportId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        reportName: reportData.reportName,
        datatypeId: reportData.dataTypeId,
        dataTypeMappingId: reportData.dataTypeMappingId,
        parametersCount: reportData.parametersCount,
        subscription: reportData.subscription,
        frequency: reportData.frequency,
        fromDate: reportData.fromDate,
        toDate: reportData.toDate,
        dateFilter: reportData.dateFilter,
      }),
    });

    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "UPDATE_DYNAMIC_REPORT_DETAILS_SUCCESS",
        payload: { ...reportData },
      });
      return true;
    }
    dispatch({
      type: "UPDATE_DYNAMIC_REPORT_DETAILS_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return responseBody;
  } catch (error) {
    dispatch({
      type: "UPDATE_DYNAMIC_REPORT_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return error.response.data;
  }
};

/**
 * download payment type dynamic report
 * @param {*} reportData 
 * @returns 
 */
export const downloadPaymentDynamicReport = (reportData) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.reportService}/getdynamicpaymentreport`,
      method: "POST",
      responseType: "blob",
      timeout: 360000,//6 min waiting time in milliseconds
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify(reportData),
    });
    if (response.status === 404) {
      dispatch({
        type: "DOWNLOAD_DYNAMIC_PAYMENT_REPORT_FAILED",
        payload: translatedData.reportNotFoundInDateRange,
      });
      return {error:true, message:translatedData.reportNotFoundInDateRange};
    } 
    if(response.status === 400) {
      dispatch({
        type: "DOWNLOAD_DYNAMIC_PAYMENT_REPORT_FAILED",
        payload: translatedData.tryAgain,
      });
      return {error:true, message: translatedData.tryAgain};
    }
    if (response.status === 416 || response.status === 504 || response.status === 502) {
      dispatch({
        type: "DOWNLOAD_DYNAMIC_PAYMENT_REPORT_FAILED",
        payload:translatedData.reportLateResponse,
      });
      return {error:true, message:translatedData.reportLateResponse};
    }
    if (response.status >= 500) {
      dispatch({
        type: "DOWNLOAD_DYNAMIC_PAYMENT_REPORT_FAILED",
        payload:translatedData.tryAgain,
      });
      return {error:true, message: translatedData.tryAgain};
    }
    /*if (response.status === 416) {
      dispatch({
        type: "DOWNLOAD_DYNAMIC_PAYMENT_REPORT_FAILED",
        payload: translatedData.reportLateResponse,
      });
      return false;
    }*/
    return response;
  } catch (error) {
    dispatch({
      type: "DOWNLOAD_DYNAMIC_PAYMENT_REPORT_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.tryAgain,
    });
    return {error:true, message: (error.response && error.response.data.message) ||
      translatedData.tryAgain,};
  }
};

export const fetchBusinessUnitList = (payloadData) => async (dispatch) => {  
  try {
    const accessToken = await getAccessToken();
    const response = await axios({      
      url: `${config.apiBase.clientConfigService}/business-unit-list-date?reportStartDate=${payloadData.reportStartDate}&reportCode=${payloadData.reportCode}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },      
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "FETCH_BUSINESS_UNIT_LIST_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "FETCH_BUSINESS_UNIT_LIST_FAILED",
      payload: responseBody.message || "Oops! Something went wrong.",
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_BUSINESS_UNIT_LIST_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        "An error has occurred.",
    });
    return false;
  }
};

export const downloadDailyEnrollment = (date, unitName) => async (dispatch) => {    
  try {
    const accessToken = await getAccessToken();    
    const response = await axios({
      url: `${config.apiBase.consumerService}/daily-enrollment-download-b2c`,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        "reportStartDate": date || null, 
        "businessUnit": unitName || null
      }),
    });

    if (response.status === 404) {
      dispatch({
        type: "FETCH_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFoundInDateRange,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DOWNLOAD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const emailRejectionFile = (date, unitName) => async (dispatch) => {  
  try {
    const accessToken = await getAccessToken();    
    const response = await axios({
      url: `${config.apiBase.consumerService}/email-rejection-report`,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        "reportStartDate": date || null, 
        "businessUnit": unitName || null
      }),
    });

    if (response.status === 404) {
      dispatch({
        type: "FETCH_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFoundInDateRange,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DOWNLOAD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const SMSRejectionFile = (date, unitName) => async (dispatch) => {  
  try {
    const accessToken = await getAccessToken();    
    const response = await axios({
      url: `${config.apiBase.consumerService}/sms-rejection-report`,
      method: "POST",
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        pragma: "no-cache",
      },
      data: JSON.stringify({
        "reportStartDate": date || null, 
        "businessUnit": unitName || null
      }),
    });

    if (response.status === 404) {
      dispatch({
        type: "FETCH_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFoundInDateRange,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DOWNLOAD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const B2CPaymentReconciliation = (date, unitName, portalProfileId, reportCodeVal) => async (dispatch) => {
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
        "reportCode": reportCodeVal || null,
        "clientID": portalProfileId || null,
        "reportDate": date || null, 
        "format": "csv",
        "fromDate": "",
        "toDate": "",
        "businessType": 2,
        "businessUnit": unitName === "none" ? "" : unitName || null
      }),
    });

    if (response.status === 404) {
      dispatch({
        type: "FETCH_REPORT_DOWNLOAD_FAILED",
        payload: translatedData.reportNotFoundInDateRange,
      });
      return false;
    }
    return response;
  } catch (error) {
    dispatch({
      type: "FETCH_REPORT_DOWNLOAD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};
