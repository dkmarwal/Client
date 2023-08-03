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

export const fetchB2CConsumerProfileInfo =
  (consumerId, campaignDetailId) => async (dispatch) => {
    const detailIdUrl = consumerId
      ? `?consumerId=${consumerId}`
      : `?campaignDetailId=${campaignDetailId}`;
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/getConsumerInfo${detailIdUrl}`,
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
          type: 'FETCH_B2C_CONSUMER_INFO_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'FETCH_B2C_CONSUMER_INFO_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'FETCH_B2C_CONSUMER_INFO_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const fetchB2CConsumerPayeeList = (data) => async (dispatch) => {
  let offset = (data.page * data.rowsPerPage);
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/getConsumerList`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        consumerIdentifier: data.id || null,
        consumerName: data.name || null,
        paymentMethodIds: data.paymentList ? [data.paymentList] : [],
        enrollmentStatusIds: data.enrollmentStatusList ? [data.enrollmentStatusList] : [],
        payeeTypeId: data.payeeTypeList ? (data.payeeTypeList).toString() : null,
        enrollmentInitiatedAt: data.enrollmentInitiatedAt || null,
        consumerStatusId: data.status ? [data.status] : [],
        limit: data.rowsPerPage,
        offset: offset,
        consumerActivatedAt: data.payeeActivatedAt || null,
        sort: data.sort,
        sortType: data.sortType,
        campaignFileId: data.fileID || null
      }),
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: 'FETCH_B2C_CONSUMER_LIST_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'FETCH_B2C_CONSUMER_LIST_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'FETCH_B2C_CONSUMER_LIST_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const B2CConsumerRevoke = (id) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/consumer/revoke`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        consumerIdentifiers: id || null,
      }),
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: 'REVOKE_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'REVOKE_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'REVOKE_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const B2CConsumerLock = (id) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/consumer/lock`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        consumerIdentifiers: id || null,
      }),
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: 'lOCK_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'lOCK_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'lOCK_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const B2CConsumerUnlock = (id) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/consumer/unlock`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        consumerIdentifiers: id || null,
      }),
    });
    const responseBody = await response.data;

    if (responseBody.error === false) {
      dispatch({
        type: 'UNlOCK_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'UNlOCK_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'UNlOCK_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const B2CConsumerDeactivate =
  (detailId) => async (dispatch) => {
    try {
      const data = {};
      data.consumerIdentifiers = detailId;
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/consumer/deactivate`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify(data),
      });
      const responseBody = await response.data;
      if (responseBody.error === false) {
        dispatch({
          type: 'DEACTIVATE_SUCCESS',
          payload: responseBody,
        });
        return true;
      }
      dispatch({
        type: 'DEACTIVATE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'DEACTIVATE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const getB2CEnrollmentStatusList = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/getEnrollmentStatusList`,
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
        type: 'ENROLLMENT_STATUS_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'ENROLLMENT_STATUS_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'ENROLLMENT_STATUS_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};



export const getB2CPayeeStatusList = (data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/consumer-status`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        consumerIdentifier: data.id || null,
        consumerName: data.name || null,
        paymentMethodIds: data.paymentList ? [data.paymentList] : [],
        enrollmentStatusIds: data.enrollmentStatusList ? [data.enrollmentStatusList] : [],
        enrollmentInitiatedAt: data.enrollmentInitiatedAt || null,
        consumerStatusId: [],
        campaignFileId: data.fileID || null,
        // limit: data.rowsPerPage,
        // offset: offset,
        consumerActivatedAt: data.payeeActivatedAt || null,
        // sort: data.sort,
        // sortType: data.sortType
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'PAYEE_STATUS_LIST_SUCCESS',
        payload: responseBody.data,
      });
      return responseBody.data;
    }
    dispatch({
      type: 'PAYEE_STATUS_LIST_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'PAYEE_STATUS_LIST_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const resendEnrollmentLink = (campaignDetailId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/resend/enrollment-link`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache'
      },
      data: JSON.stringify({
        campaignDetailId: campaignDetailId || null
      })
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'RESEND_ENROLLMENT_LINK_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'RESEND_ENROLLMENT_LINK_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'RESEND_ENROLLMENT_LINK_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
}

export const unlockB2CEnrollment = (consumerIdentifier) => async(dispatch) => {
  try {
    const data = {};
    data.consumerIdentifiers = consumerIdentifier;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/consumer-enrollment/unlock`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'UNLOCK_B2C_ENROLLMENT_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'UNLOCK_B2C_ENROLLMENT_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'UNLOCK_B2C_ENROLLMENT_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
}

export const lockB2CEnrollment = (consumerIdentifier) => async(dispatch) => {
  try {
    const data = {};
    data.consumerIdentifiers = consumerIdentifier;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.consumerService}/consumer-enrollment/lock`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify(data),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: 'LOCK_B2C_ENROLLMENT_SUCCESS',
        payload: responseBody,
      });
      return true;
    }
    dispatch({
      type: 'LOCK_B2C_ENROLLMENT_FAILED',
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: 'LOCK_B2C_ENROLLMENT_FAILED',
      payload:
        (error.response && error.response.message) ||
        error.message ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
}

