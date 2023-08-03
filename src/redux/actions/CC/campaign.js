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
Get campaign Data
*/
export const fetchCCCampaignData = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/getSupplierCampaignInfo`,
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
        type: "CAMPAIGN_DATA_FETCH_SUCCESS",
        payload: responseBody?.data || {},
      });
      return true;
    }
    dispatch({
      type: "CAMPAIGN_DATA_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CAMPAIGN_DATA_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};
/*
Get campaign list
*/
export const fetchCCCampaignList = ({
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
      url: `${config.apiBase.payeeService}/cc-campaign-list?limit=${rowsPerPage}&offset=${offset}&campaignName=${name}`,
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
        type: "CAMPAIGN_LIST_CC_FETCH_SUCCESS",
        payload: {
          campaignList: responseBody?.data?.rows ?? [],
          totalCount: responseBody?.data?.count ?? 0,
          fileText:responseBody?.data?.fileReceivedAt?.fileReceivedAt ?? "",
        },
      });
      return true;
    }
    dispatch({
      type: "CAMPAIGN_LIST_CC_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CAMPAIGN_LIST_CC_FETCH_FAILED",
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
// export const fetchCCPayeeStatuses = ({
//   campaignId,
//   userId,
//   portalProfileId,
//   portalTypeId,
// }) => async (dispatch) => {
//   try {
//     const accessToken = await getAccessToken();
//     const response = await axios({
//       url: `${config.apiBase.payeeService}/campaign/success/metrics?campaignId=${campaignId}`,
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//         pragma: "no-cache",
//       },
//     });
//     const responseBody = await response.data;
//     if (responseBody.error == false) {
//       dispatch({
//         type: "CC_PAYEESTATUSES_FETCH_SUCCESS",
//         payload: responseBody.data && responseBody.data,
//       });
//       return true;
//     }
//     dispatch({
//       type: "CC_PAYEESTATUSES_FETCH_FAILED",
//       payload: responseBody.message || translatedData.SomethingWentWrong,
//     });
//     return false;
//   } catch (error) {
//     dispatch({
//       type: "CC_PAYEESTATUSES_FETCH_FAILED",
//       payload:
//         (error.response && error.response.data.message) ||
//         translatedData.ErrorOccurred,
//     });
//     return false;
//   }
// };

/*
Get Enrollment Statuses
*/
export const fetchCCEnrollmentStatuses = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/cc-enrollment-status`,
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
        type: "CC_ENROLLMENTSTATUS_FETCH_SUCCESS",
        payload: responseBody?.data || [],
      });
      return true;
    }
    dispatch({
      type: "CC_ENROLLMENTSTATUS_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CC_ENROLLMENTSTATUS_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};


/*
Get Supplier list
*/
export const fetchCCSupplierList = ({
  campaignId,
  name,
  id,
  page,
  rowsPerPage,
  isDownload,
}) => async (dispatch) => {
  const offset = rowsPerPage * page;
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: isDownload  ? `${config.apiBase.payeeService}/cc-getSupplierInfoByID?campaignId=${campaignId}&type=all` :
      `${config.apiBase.payeeService}/cc-getSupplierInfoByID?campaignId=${campaignId}&payeeName=${name}&bucketId=${id}&limit=${rowsPerPage}&offset=${offset}`,
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
        type: "PAYER_LIST_CC_FETCH_SUCCESS",
        payload: {
          payeeList: responseBody?.data?.rows || [],
          totalCount: (responseBody?.data?.count) || 0,
        },
      });
      return isDownload ? responseBody?.data?.rows || [] : true;
    }
    dispatch({
      type: "PAYER_LIST_CC_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "PAYER_LIST_CC_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};


/*
Get files list by campaign Id
*/
// export const fetchCampaignFiles = ({
//   userId,
//   portalProfileId,
//   portalTypeId,
// }) => async (dispatch) => {
//   try {
//     const accessToken = await getAccessToken();
//     const response = await axios({
//       url: `${config.apiBase.payeeService}/campaign/detail/list`,
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//         pragma: "no-cache",
//       },
//     });
//     const responseBody = await response.data;
//     if (responseBody.error == false) {
//       dispatch({
//         type: "CCFILES_FETCH_SUCCESS",
//         payload: {
//           campaignList:
//             (responseBody.data && responseBody.data.campaigns) || [],
//           totalCount: (responseBody.data && responseBody.data.totalcount) || 0,
//         },
//       });
//       return true;
//     }
//     dispatch({
//       type: "CCFILES_FETCH_FAILED",
//       payload: responseBody.message || translatedData.SomethingWentWrong,
//     });
//     return false;
//   } catch (error) {
//     dispatch({
//       type: "CCFILES_FETCH_FAILED",
//       payload:
//         (error.response && error.response.data.message) ||
//         translatedData.ErrorOccurred,
//     });
//     return false;
//   }
// };
