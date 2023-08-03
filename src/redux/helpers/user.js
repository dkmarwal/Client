import Cookies from "universal-cookie";
import axios from "axios";
import config from "~/config";
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
  if(error.response.status == 401) {
    let cookies = new Cookies();
      cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
      cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
      cookies.remove('@clientUserId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
  }
  return error.response;
});

export const getAccessToken = async () => {
  const cookies = new Cookies(window.document.cookie);
  const refreshToken = cookies.get("@clientRefreshToken");
  const accessToken = cookies.get("@clientAccessToken");
  if (accessToken) {
    return accessToken;
  }
  if (refreshToken) {
    try {
      const response = await axios({
        url: `${config.apiBase}/oauth/token?refreshToken=${refreshToken}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'pragma': 'no-cache',
        },
      });
      const responseBody = await response.data;
      if (responseBody.success) {
        cookies.set("clientRefreshToken", responseBody.accessToken);
        return responseBody.accessToken;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  return null;
};

export const fetchBankPortalAccessDetails = async (bankId, token) => {
  try {
      const accessToken = await getAccessToken() ;
      const response = await axios({
          url: `${config.apiBase.userService}/bank/portal/access?bankId=${bankId}`,
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
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
          data: {},
          error: true,
      };
  }
}
export const singlePoint = async (token) => {
  try {
      const accessToken = await getAccessToken() ;
      const response = await axios({
          url: `${config.apiBase.SSOService}/SSOLogOut`,
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
          data: {},
          error: true,
      };
  }
}
export const fetchSecurityQuestion = async (userName, portalTypeId) => {
  try {
      const accessToken = await getAccessToken() ;
      const response = await axios({
        url: `${config.apiBase.userService}/user/security-question`,
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              'pragma': 'no-cache',
          },
          data: JSON.stringify({
            userName: userName,
            portalTypeId : portalTypeId
          })
      });
      const responseBody = await response.data;
      return responseBody;
  } catch (error) {
      return {
          message:
              (error.response && error.response.data.message) ||
              translatedData.ErrorOccurred,
          data: {},
          error: true,
      };
  }
}


export const fetchVendorsList = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees?profileStatus=true`,
      method: "GET",
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

export const fetchPendingApprovalsList = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/payees?isApprovalPending=true&clientId=${clientId}`,
      method: "GET",
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



export const approveRejectPayee = async (clientId, data) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.payeeService}/approve-reject?clientId=${clientId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(data),
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

export const fetchUserProfileDetails = async (clientId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user-profile/${clientId}`,
      method: "GET",
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
      data: {},
      error: true,
    };
  }
};

export const updateUserProfileDetails = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user-profile`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify({
        SSOUserId: payload?.SSOUserId || null,
        email: payload?.email || null,
        firstName: payload?.firstName || null,
        isSSO: payload?.isSSO || 0,
        lastName: payload?.lastName || null,
        locale: payload?.locale || null,
        phone: payload?.phone || null,
        phoneCountryCode: payload?.phoneCountryCode || null,
        phoneExt: payload?.phoneExt || null,
        securityAnswer: payload?.securityAnswer || null,
        securityQuestionId: payload?.securityQuestionId || null,
        title: payload?.title || null,
        userId: payload?.userId || null,
        userName: payload?.userName || null
    }),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};


export const updateUserPassword = async (payload) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user-profile/password`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      data: JSON.stringify(payload),
    });
    const responseBody = await response.data;
    return responseBody;
  } catch (error) {
    return {
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: {},
      error: true,
    };
  }
};

export const fetchSecurityQuestions = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/securityQuestions?portalTypeId=2`,
      method: "GET",
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
      data: {},
      error: true,
    };
  }
};

export const checkSessionTimout = async ({portalTypeId}) => {
	const cookies = new Cookies(window.document.cookie);
	const refreshToken = cookies.get('@clientRefreshToken');
    const accessToken = cookies.get('@clientAccessToken');
    const clientId = cookies.get("@clientUserId");

	if(accessToken){
		try{
			const response = await axios({
                url: `${config.apiBase.identityService}/session/validation?portalTypeId=${portalTypeId}`,
                //url: `${config.apiBase}/user-service/v1/user/${clientId}`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'pragma': 'no-cache',
				}
			})
			const responseBody = await response.data;
			if(responseBody.error == false) {
                if(responseBody.data == true){
                    return true;
                }
			}
			return false
		}catch(error){
			return false
		}
	}
    return false
}

//Update token/session time
export const keepSessionLive = async () => {
    const cookies = new Cookies(window.document.cookie);
    const refreshToken = cookies.get('@clientRefreshToken');
    const accessToken = cookies.get('@clientAccessToken');

	if(refreshToken){
		try{
			const response = await axios({
                url: `${config.apiBase.userService}/access/token`,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
                    'refreshToken': `${refreshToken}`,
                    'pragma': 'no-cache',
				}
			})
			const responseBody = await response.data;
			if (responseBody.error == false) {
                const { accessToken, refreshToken } = responseBody.data;
                cookies.set('@clientAccessToken', accessToken, {  path: `${config.baseName}/`, });
                cookies.set('@clientRefreshToken', refreshToken, {  path: `${config.baseName}/`, });
				return true;
			}
			return false;
		}catch(error){
			return false;
		}
	}
    return false;
}

export const checkLoggedIn = async () => {
	let cookies = new Cookies(window.document.cookie);
    const accessKey = cookies.get('@clientAccessToken');

    if(accessKey){
        return true;
    } else{
        return false;
    }
}