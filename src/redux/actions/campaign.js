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
    if (error.response.status == 401) {
      let cookies = new Cookies();
      cookies.remove("@accessToken", { path: `${config.baseName}/` });
      cookies.remove("@refreshToken", { path: `${config.baseName}/` });
      cookies.remove("@portalTypeId", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

/*
Get campaign list
*/
export const fetchCampaignList = ({
  userId,
  portalProfileId,
  portalTypeId,
  name,
  page,
  rowsPerPage,
  sortColumn,
  sortOrder,
}) => async (dispatch) => {
  const offset = rowsPerPage * page;

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase.payeeService}/campaign/detail/list?limit=${rowsPerPage}&offset=${offset}&campaignName=${name}&sortColumn=${sortColumn}&sortOrder=${sortOrder}`,
      url: `${config.apiBase.payeeService}/campaign/detail/list?limit=${rowsPerPage}&offset=${offset}&campaignName=${name}`,
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
        type: "CAMPAIGN_LIST_FETCH_SUCCESS",
        payload: {
          campaignList:
            (responseBody.data && responseBody.data.campaigns) || [],
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

/*
Get Offer type list
*/
export const fetchOfferTypes = ({
  userId,
  portalProfileId,
  portalTypeId,
}) => async (dispatch) => {
  const data = [
    {
      id: "ACH",
      name: "ACH",
    },
    {
      id: "VCA",
      name: "VCA",
    },
  ];
  dispatch({
    type: "CAMPAIGN_TYPE_LIST_FETCH_SUCCESS",
    payload: data,
  });
  return true;  
};

/*
Get Supplier list
*/
export const fetchSupplierList = ({
  userId,
  portalProfileId,
  portalTypeId,
  campaignId,
  name,
  linkStatusId,
  isEmailBounced,
  isEmailDelivered,
  page,
  rowsPerPage,
  sortColumn,
  sortOrder,
}) => async (dispatch) => {
  const offset = rowsPerPage * page;
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/campaign/detail?campaignId=${campaignId}&limit=${rowsPerPage}&offset=${offset}&supplierName=${name}&linkStatusId=${linkStatusId}&isEmailBounced=${isEmailBounced}&isEmailDelivered=${isEmailDelivered}`,
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
        type: "PAYER_LIST_FETCH_SUCCESS",
        payerList: (responseBody.data && responseBody.data.rows) || [],
        totalCount: (responseBody.data && responseBody.data.totalCount) || 0,
      });
      return true;
    }
    dispatch({
      type: "PAYER_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "PAYER_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get Email Delivery Status
*/
export const fetchEmailDeliveryStatus = ({
  campaignId,
  userId,
  portalProfileId,
  portalTypeId,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/campaign/email-delivery/count?campaignId=${campaignId}`,
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
        type: "EMAIL_DELIVERY_STATUS_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "EMAIL_DELIVERY_STATUS_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "EMAIL_DELIVERY_STATUS_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get Campaign Success matrices
*/
export const fetchCampaignMetrics = ({
  campaignId,
  userId,
  portalProfileId,
  portalTypeId,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/campaign/success/metrics?campaignId=${campaignId}`,
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
        type: "CAMPAIGN_MATRICS_FETCH_SUCCESS",
        payload: Boolean(responseBody?.data ?? false) && responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CAMPAIGN_MATRICS_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CAMPAIGN_MATRICS_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get Enrollment status
*/
export const fetchEnrollmentStatus = ({
  campaignId,
  userId,
  portalProfileId,
  portalTypeId,
}) => async (dispatch) => {
  /* 
     const data = [
   {
     id: 1,
     emailStatus: "EMAILS SENT",
     emailNumber: 245,
     emailPercent: 12,
     statusColor: "#D3E6FB",
   },
   {
     id: 2,
     emailStatus: "ENROLLMENT INITIATED",
     emailNumber: 7,
     emailPercent: 0,
     statusColor: "#F7B500",
   },
   {
     id: 3,
     emailStatus: "CONFIRMATION PENDING",
     emailNumber: 13,
     emailPercent: 4,
     statusColor: "#F7B500",
   },
   {
     id: 4,
     emailStatus: "PAYMENT INFO PENDING",
     emailNumber: 10,
     emailPercent: 12,
     statusColor: "#F7B500",
   },
   {
     id: 5,
     emailStatus: "UNABLE TO VALIDATE",
     emailNumber: 175,
     emailPercent: 5,
     statusColor: "#FF9B7C",
   },
   {
     id: 6,
     emailStatus: "DISAPPROVED",
     emailNumber: 3,
     emailPercent: 12,
     statusColor: "#FF9B7C",
   },
   {
     id: 7,
     emailStatus: "REVOKED",
     emailNumber: 5,
     emailPercent: 12,
     statusColor: "#FF9B7C",
   },
   {
     id: 8,
     emailStatus: "PENDING VALIDATION",
     emailNumber: 15,
     emailPercent: 12,
     statusColor: "#68BAF0",
   },
   {
     id: 9,
     emailStatus: "PENDING APPROVAL",
     emailNumber: 20,
     emailPercent: 12,
     statusColor: "#68BAF0",
   },
   {
     id: 10,
     emailStatus: "Approved",
     emailNumber: 170,
     emailPercent: null,
     statusColor: "#264D88",
   },
 ]; 
     dispatch({
                 type: 'ENROLLMENT_STATUS_FETCH_SUCCESS',
                 payload: data,
             })
             return true;
     
     */
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/campaign/payees-status/count?campaignId=${campaignId}`,
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
        type: "ENROLLMENT_STATUS_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "ENROLLMENT_STATUS_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "ENROLLMENT_STATUS_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get Filter Chips
*/
export const fetchFilterChips = ({
  campaignId,
  userId,
  portalProfileId,
  portalTypeId,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/campaign/detail/filter-chip?campaignId=${campaignId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CAMPAIGN_FILTER_CHIPS_FETCH_SUCCESS",
        payload: responseBody.data,
        pragma: "no-cache",
      });
      return true;
    }
    dispatch({
      type: "CAMPAIGN_FILTER_CHIPS_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CAMPAIGN_FILTER_CHIPS_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get campaign list by client id
*/
export const fetchCampaignListByClientId = ({
  userId,
  portalProfileId,
  portalTypeId,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/campaign/detail/list`,
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
        type: "CAMPAIGN_LIST_FETCH_SUCCESS",
        payload: {
          campaignList:
            (responseBody.data && responseBody.data.campaigns) || [],
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
