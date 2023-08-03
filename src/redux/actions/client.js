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
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }

    return error.response;
  }
);

export const verifyClient = (data) => async (dispatch) => {
//  dispatch({
//         type: "CLIENT_VERIFICATION_SUCCESS",
//         payload: {
//           accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJwb3J0YWxUeXBlSWQiOjIsInBvcnRhbFByb2ZpbGVJZCI6IjQxMzk3ODUwMCIsInBhcmVudFByb2ZpbGVJZCI6bnVsbCwidXNlck5hbWUiOiJjbGllbnRfNDEzOTc4NTAwIn0sImFjY2Vzc0lkTGlzdCI6WzExMDAwLDEwNywxMDYsNDksNTAsNDUsNDYsNDcsMzQsMzUsNTMsNTRdLCJpYXQiOjE2MjE0MDQwMjAsImV4cCI6MTYyMTQwNzYyMH0.VCkHotTz-qFwuD3IwwUUcMwylkQKmcfMoaEdbmfpbw4",
//           refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJwb3J0YWxUeXBlSWQiOjIsInBvcnRhbFByb2ZpbGVJZCI6IjQxMzk3ODUwMCIsInBhcmVudFByb2ZpbGVJZCI6bnVsbCwidXNlck5hbWUiOiJjbGllbnRfNDEzOTc4NTAwIn0sImFjY2Vzc0lkTGlzdCI6WzExMDAwLDEwNywxMDYsNDksNTAsNDUsNDYsNDcsMzQsMzUsNTMsNTRdLCJpYXQiOjE2MjE0MDQwMjB9.kossvL1shGitgA2_-B6w4DzW_ah8zUwXCuy6T81JqbE",
//             "appType": 2
//         },
//       });
//       return true;
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/verification`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
          activationCode: data.activationCode || null,
          clientId: data.clientId || null,
          taxId: data.taxId || null,
          taxIdIsSSN: parseInt(data.taxIdIsSSN) || 0,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      const cookies = new Cookies(window.document.cookie);
      cookies.set("@clientRefreshToken", responseBody.data.refreshToken, { path: `${config.baseName}/` });
      cookies.set("@clientAccessToken", responseBody.data.accessToken, { path: `${config.baseName}/` });

      dispatch({
        type: "CLIENT_VERIFICATION_SUCCESS",
        payload:responseBody.data
      });
      return true;
    }
    dispatch({
      type: "CLIENT_VERIFICATION_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CLIENT_VERIFICATION_FAILED",
      payload: error.response.data || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const fetchCompanyData = (clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/client-enrollment/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CLIENT_DETAILS_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CLIENT_DETAILS_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CLIENT_DETAILS_FETCH_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const fetchClientData = (clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/client/${clientId}`,
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
        type: "CLIENT_INFO_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CLIENT_INFO_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CLIENT_INFO_FETCH_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const fetchB2CClientData = (clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/b2c/client/${clientId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CLIENT_INFO_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CLIENT_INFO_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CLIENT_INFO_FETCH_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const fetchParentCompanyData = (id) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/client/${id}/details?hasParent=true&isOnboarding=1`,
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
        type: "PARENT_INFO_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "PARENT_INFO_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "PARENT_INFO_FETCH_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const fetchLocations = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/client/location/type`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "LOCATIONS_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "LOCATIONS_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "LOCATIONS_FETCH_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const updateCompanyData = (clientId, data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/client/${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        countryCode: data.countryCode || null,
        phoneNumber: data.phoneNumber || null,
        fax: data.fax || null,
        website: data.website || null,
        duns: data.duns || null,
        locationTypeId: data.locationTypeId || null,
        phoneExt: data.phoneExt || null,
        address1: data.address1 || null,
        address2: null,
        city: data.city || null,
        countryIso: data.countryIso || null,
        stateRegion: data.stateRegion || null,
        zipPostal: data.zipPostal || null
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CLIENT_INFO_UPDATE_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CLIENT_INFO_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CLIENT_INFO_UPDATE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const createUser = (portalTypeId, portalProfileId, data) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/user?portalTypeId=${portalTypeId}&portalProfileId=${portalProfileId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        title: data.title || "Mr",
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        userName: data.userName || null,
        password: data.password || null,
        isSSO: data.isSSO || false,
        SSOUserId: data.SSOUserId || null,
        phoneCountryCode: data.phoneCountryCode || null,
        phone: data.phone || null,
        email: data.email || null,
        isFirstUser: data.isFirstUser || false
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CREATE_USER_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CREATE_USER_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CREATE_USER_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get location type list
*/
export const fetchLocationTypeList = (type) => async (dispatch) => {
    try {
        const filter = type? `?type=${type}`:"";
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.payeeService}/location-types${filter}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        })
        const responseBody = await response.data;
        if(responseBody.error == false) {
            dispatch({
                type: 'LOCATION_TYPE_LIST_FETCH_SUCCESS',
                payload: responseBody.data.rows
            })
            return true;
        }
        dispatch({
            type: 'LOCATION_TYPE_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'LOCATION_TYPE_LIST_FETCH_FAILED',
            payload: (error.response && error.response.data.message) || translatedData.ErrorOccurred
        })
        return false;
    }
}

export const fetchB2CParentCompanyData = (id) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/b2c/client/${id}/details?hasParent=true&isOnboarding=1`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "PARENT_INFO_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "PARENT_INFO_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "PARENT_INFO_FETCH_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const updateB2CCompanyData = (clientId, data) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/b2c/client/${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        countryCode: data.countryCode || null,
        phoneNumber: data.phoneNumber || null,
        fax: data.fax || null,
        website: data.website || null,
        duns: data.duns || null,
        locationTypeId: data.locationTypeId || null,
        phoneExt: data.phoneExt || null,
        address1: data.address1 || null,
        address2: null,
        city: data.city || null,
        countryIso: data.countryIso || null,
        stateRegion: data.stateRegion || null,
        zipPostal: data.zipPostal || null
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error === false) {
      dispatch({
        type: "CLIENT_INFO_UPDATE_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CLIENT_INFO_UPDATE_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CLIENT_INFO_UPDATE_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const createB2CUser = (portalTypeId, portalProfileId, data) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientService}/b2c/user?portalTypeId=${portalTypeId}&portalProfileId=${portalProfileId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        title: data.title || "Mr",
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        userName: data.userName || null,
        password: data.password || null,
        isSSO: data.isSSO || false,
        SSOUserId: data.SSOUserId || null,
        phoneCountryCode: data.phoneCountryCode || null,
        phone: data.phone || null,
        email: data.email || null,
        isFirstUser: data.isFirstUser || false
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CREATE_USER_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CREATE_USER_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CREATE_USER_FAILED",
      payload: error.message || translatedData.ErrorOccurred,
    });
    return false;
  }
};