import Cookies from "universal-cookie";
import axios from "axios";
import moment from "moment";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import { BankType } from '~/config/bankTypes';
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

export const userInfo = () => async (dispatch) => {
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken();
    const userId = cookies.get("@clientUserId");
    //if (accessToken && userId) {
    if (userId) {
      const response = await axios({
        url: `${config.apiBase.userService}/user/${userId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseBody = await response.data;
    
      if (responseBody.error == false) {
        const {
          accessToken,
          isFirstLogin,
          userData,
          userRoles,
          userAccessIdList,
        } = responseBody.data;
        //const accessRights = {};
        //userRoles.length > 0 && userRoles.forEach(role => accessRights[role.accessName] ? accessRights[role.accessName].push(role.description) : accessRights[role.accessName] = [role.description])
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            isFirstLogin,
            userData,
            accessRights: {},
            userRoles: userAccessIdList || [],
          },
        });
        return true;
      }
      dispatch(logout());
      return false;
    }
  } catch (error) {
    dispatch(logout());
    return {
      error,
    };
  }
};

export const updateUserInfo = (userData) => async (dispatch) => {
  try {
    dispatch({
      type: "UPDATE_USER_INFO",
      payload: userData,
    });
  } catch (error) {
    throw translatedData.ErrorOccurred;
  }
};
/*
export const login = (credentials) => async (dispatch) => {
    try {
        let cookies = new Cookies(window.document.cookie)
        const response = await axios({
            url: `${config.apiBase.userService}/login`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(credentials)
        })
        const responseBody = await response.data
        const { accessToken, isFirstLogin, userData, userRoles } = responseBody.data
        console.log(responseBody.data);
        const accessRights = {}
        userRoles.length > 0 && userRoles.forEach(role => accessRights[role.accessName] ? accessRights[role.accessName].push(role.description) : accessRights[role.accessName] = [role.description])
        cookies.set('@clientAccessToken', accessToken)
        cookies.set('@clientUserId', userData.userId)
        dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
                isFirstLogin,
                userData,
                accessRights
            }
        })
        return true
    } catch (error) {
       
        return {
            error: error.response.data.message
        }
    }
}
*/

/*
Get Loggin user information
*/
/*
export const userInfo = () => async (dispatch) => {
    try {
        let cookies = new Cookies(window.document.cookie);
        const accessToken = await getAccessToken();
        const clientId    = cookies.get('@clientUserId');

        //if (accessToken) {
        if (clientId) {
            const response = await axios({
                url: `${config.apiBase.userService}/user/${clientId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                   'Authorization': `${accessToken}`,
                }
            })
            const responseBody = await response.data;
            if(responseBody.error == false) {
                const { accessToken, isFirstLogin, userData, userRoles } = responseBody.data
                const accessRights = {}
                userRoles.length > 0 && userRoles.forEach(role => accessRights[role.accessName] ? accessRights[role.accessName].push(role.description) : accessRights[role.accessName] = [role.description])
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: {
                        isFirstLogin,
                        userData,
                        accessRights
                    }
                })
                return true
            }
            dispatch({
                type: 'LOGIN_FAILED',
                payload: responseBody.message || translatedData.SomethingWentWrong
            })
            return false;
        }
    } catch (error) {console.log(error)
        dispatch({
            type: 'LOGIN_FAILED',
            payload: error.response && error.response.data.message || translatedData.ErrorOccurred
        })
        return false;
    }
}
*/

/*
Login
*/
export const login = (credentials) => async (dispatch) => {
  try {
    //const accessToken = await getAccessToken()
    let cookies = new Cookies(window.document.cookie);
    const response = await axios({
      url: `${config.apiBase.userService}/login`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //'Authorization': `Bearer ${accessToken}`,
      },
      data: JSON.stringify(credentials),
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      const {
        accessToken,
        refreshToken,
        isFirstLogin,
        userData,
        userRoles,
        userAccessIdList,
      } = responseBody.data;
      //const accessRights = {}
      //userRoles.length > 0 && userRoles.forEach(role => accessRights[role.accessName] ? accessRights[role.accessName].push(role.description) : accessRights[role.accessName] = [role.description])
      cookies.set("@clientAccessToken", accessToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientRefreshToken", refreshToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientUserId", userData.userId, {
        path: `${config.baseName}/`,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          isFirstLogin,
          userData,
          accessRights: {},
          userRoles: userAccessIdList || [],
        },
      });
      return true;
    }
    dispatch({
      type: "LOGIN_FAILED",
      payload: {
        message:
          (responseBody && responseBody.message) ||
          translatedData.SomethingWentWrong,
        data: responseBody && responseBody["data"],
      },
    });

    return false;
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Logout
*/
export const logout = (isSSO) => async (dispatch) => {
  let cookies = new Cookies(window.document.cookie);

  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/logout`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      sessionStorage.setItem("isSSO", isSSO);
      dispatch({
        type: "LOGOUT_SUCCESS",
        payload: {},
      });
    } else {
      //dispatch({
      //  type: 'LOGOUT_FAILED',
      //payload: responseBody.message || 'Oops! Something went wrong.'
      //})
    }
  } catch (error) {
    //dispatch({
    //  type: 'LOGOUT_FAILED',
    //payload: error.response && error.response.data.message || translatedData.ErrorOccurred
    //})
    cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
    cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
    cookies.remove("@clientUserId", { path: `${config.baseName}/` });
    dispatch({
      type: "LOGOUT_SUCCESS",
      payload: {},
    });
  }
};

/*
export const logout = () => async (dispatch) => {
    let cookies = new Cookies(window.document.cookie);
    cookies.remove('@clientAccessToken');
    cookies.remove('@clientUserId');
    dispatch({
        type: 'LOGOUT_SUCCESS',
        payload: {}
    });
    //return {
    //	type: 'LOGOUT_SUCCESS',
    //	payload: {}
    //}
    return true;            
	
}
*/
/*
first time login user update password with security answer
*/
export const setNewPassword = (credentials) => async (dispatch) => {
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/first-time-login-info`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(credentials),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      const {
        accessToken,
        refreshToken,
        isFirstLogin,
        userData,
        userRoles,
        userAccessIdList,
      } = responseBody.data;

      cookies.set("@clientAccessToken", accessToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientRefreshToken", refreshToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientUserId", userData.userId, {
        path: `${config.baseName}/`,
      });
      // dispatch({
      //   type: "UPDATE_PASSWORD_SUCCESS",
      //   payload: {
      //     isFirstLogin: false,
      //   },
      // });
       dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            isFirstLogin: false,
            userData,
            accessRights: {},
            userRoles: userAccessIdList || [],
          },
        });
      return true;
    }
    dispatch({
      type: "UPDATE_PASSWORD_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_PASSWORD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
reset password
*/
export const resetPassword = ({
  password,
  securityQuestionId,
  securityAnswer,
  token,
}) => async (dispatch) => {
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/reset-password?passwordResetCode=${token}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        updatedPassword: password || null,
        securityQuestionId: securityQuestionId || null,
        securityAnswer: securityAnswer || "",
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      const {
        accessToken,
        refreshToken,
        isFirstLogin,
        userData,
        userAccessIdList,
      } = responseBody.data;
      cookies.set("@clientAccessToken", accessToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientRefreshToken", refreshToken, {
        path: `${config.baseName}/`,
      });
      dispatch({
        type: "LOGIN_FAILED",
        payload: {
          message: responseBody.message,
          data: null,
        },
      });
      return { error: false };
    }
    if (response.status == 403) {
      return { error: true, message: responseBody.message, data: "redirect" };
    }
    dispatch({
      type: "LOGIN_FAILED",
      payload: {
        message: responseBody.message || translatedData.SomethingWentWrong,
        data: null,
      },
    });
    return { error: true, message: responseBody.message, data: "" };
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return {
      error: true,
      message:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
      data: "",
    };
  }
};

export const resetExpiredPassword = ({
  userName,
  oldPassword,
  updatedPassword,
  securityQuestionId,
  securityAnswer,
}) => async (dispatch) => {
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user/update-exp-pwd`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        userName: userName || null,
        portalTypeId: 2,
        oldPassword: oldPassword || null,
        updatedPassword: updatedPassword || null,
        securityQuestionId: securityQuestionId || null,
        securityAnswer: securityAnswer || null,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      const {
        accessToken,
        refreshToken,
        isFirstLogin,
        userData,
        userAccessIdList,
      } = responseBody.data;
      cookies.set("@clientAccessToken", accessToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientRefreshToken", refreshToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientUserId", userData.userId, {
        path: `${config.baseName}/`,
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          userData,
          isFirstLogin: isFirstLogin,
          accessRights: {},
          userRoles: userAccessIdList || [],
        },
      });
      return true;
    }
    dispatch({
      type: "LOGIN_FAILED",
      payload: {
        message:
          (responseBody && responseBody.message) ||
          translatedData.SomethingWentWrong,
      },
    });
    return false;
  } catch (error) {
    dispatch({
      type: "LOGIN_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Forgot password
*/
export const forgotPassword = ({ loginId }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/forgot-password`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        login: loginId && loginId.trim() || "",
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "FORGOT_PASSWORD_SUCCESS",
        payload: {},
      });
      return true;
    }
    dispatch({
      type: "FORGOT_PASSWORD_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FORGOT_PASSWORD_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get user list
*/
export const fetchUserList = ({
  portalProfileId,
  portalTypeId,
  name,
  phone,
  email,
  role,
  pageNo,
  pageSize,
  sortColumn,
  sortOrder,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user-search?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        displayName: name || "",
        //email: email || "",
       //phone: phone || "",
        roleId: role.roleId || null,
        isLocked: (role.roleName == "Locked Users" || role.roleName == "Utilisateurs verrouillés" ||  role.roleName == "Usuarios bloqueados")  ? true : false,
        isNewUsers: (role.roleName == "New Users" || role.roleName == "Nouveaux utilisateurs" || role.roleName == "Nuevos usuarios") ? true : false,
        isActiveUsers: (role.roleName == "Active Users" || role.roleName == "Utilisateurs actifs"|| role.roleName == "Usuarios activos") ? true : false,
        pageNo: pageNo || 1,
        pageSize: pageSize || 10,
        sortColumn: sortColumn || "",
        sortOrder: sortOrder || "",
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "USER_LIST_FETCH_SUCCESS",
        payload: responseBody.data.userInfo,
        totalCount: responseBody.data.TotalCount || 0,
      });
      return true;
    }
    dispatch({
      type: "USER_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "USER_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Create new user
*/
export const createUser = ({ portalProfileId, portalTypeId, user }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        title: user.title || "Mr",
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        userName: user.isSSO == true ? null : user.userName || null,
        password: user.isSSO == true ? null : user.newPassword || null,
        isSSO: user.isSSO || false,
        SSOUserId: user.isSSO == true ? user.SSOUserId || null : null,
        //securityQuestionId: user.isSSO ==true ? null :(user.securityQuestionId || null),
        //securityAnswer: user.isSSO ==true ? null :(user.securityAnswer || ""),
        phoneCountryCode: user.phoneCountryCode || null,
        phone: user.phone || null,
        phoneExt: user.phoneExt || null,
        email: user.email || null,
        //roleId: user.RoleID.split(',').map(Number) || []
        roleId: user.roleId || [],
        isFirstUser: false,
      }),
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CREATE_ADMIN_USER_SUCCESS",
        payload: { ...user, userId: responseBody.data.userId }, //add userID from response
      });
      return { ...user, userId: responseBody.data.userId };
    }
    dispatch({
      type: "CREATE_ADMIN_USER_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CREATE_ADMIN_USER_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Update user details
*/
export const updateUserDetails = ({
  portalProfileId,
  portalTypeId,
  user,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user?portalProfileId=${portalProfileId}&portalTypeId=${portalTypeId}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        userId: user.userId || 0,
        title: user.title || "Mr",
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        userName: user.userName || null,
        password: (user.newPassword && user.newPassword.trim()) || null,
        isSSO: user.isSSO == 1 || user.isSSO == true ? true : false,
        SSOUserId: user.SSOUserId || null,
        //securityQuestionId: user.securityQuestionId || null,
        //securityAnswer: user.securityAnswer || "",
        phoneCountryCode: user.phoneCountryCode || null,
        phone: user.phone || null,
        phoneExt: user.phoneExt || null,
        email: user.email || null,
        //roleId: user.RoleID.split(',').map(Number) || []
        roleId: user.roleId || [],
        isFirstUser: false,
      }),
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "UPDATE_USER_DETAILS_SUCCESS",
        payload: { ...user },
      });
      return true;
    }
    dispatch({
      type: "UPDATE_USER_DETAILS_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_USER_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get security question ID selected by user
*/
export const fetchSecurityQuestion = (resetCode) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
	  url: `${config.apiBase.userService}/user/get-question`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
	  data: JSON.stringify({
        passwordResetCode: resetCode || null,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "SQ_ID_FETCH_SUCCESS",
        payload: responseBody?.data?.securityQuestionId || null,
      });
      return true;
    }
    dispatch({
      type: "SQ_ID_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "SQ_ID_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get security questions list
*/
export const fetchSecurityQuestions = () => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/securityQuestions?portalTypeId=2`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "SQ_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "SQ_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "SQ_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const lockUser = ({ userIds, isLocked }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase}/user-service/v1/user-lock?userId=${userId}&isLocked=${isLocked}`,
      url: `${config.apiBase.userService}/user-lock`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        userId: userIds || null,
        isLocked: isLocked,
      }),
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "LOCK_USER_DETAILS_SUCCESS",
        payload: { userIds: userIds, isLocked: isLocked },
      });
      return true;
    }
    dispatch({
      type: "LOCK_USER_DETAILS_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "LOCK_USER_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

export const removeUser = ({ userIds }) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      //url: `${config.apiBase}/user-service/v1/user?userId=${userId}`,
      url: `${config.apiBase.userService}/user`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify({
        userId: userIds || null,
      }),
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "REMOVE_USER_DETAILS_SUCCESS",
        payload: { userIds: userIds },
      });
      return true;
    }
    dispatch({
      type: "REMOVE_USER_DETAILS_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "REMOVE_USER_DETAILS_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};
/*
Get Chip filter list
*/
export const fetchFilterList = ({ portalProfileId, portalTypeId }) => async (
  dispatch
) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/filters/portalTypeId/${portalTypeId}/portalProfileId/${portalProfileId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CHIPS_FILTER_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CHIPS_FILTER_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "USER_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get Child parent list
*/
export const fetchChildParentList = ({
  portalProfileId,
  portalTypeId,
  userId,
}) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios({
      //url: `${config.apiBase.clientService}/clients/child-parent/32`,
      url: `${config.apiBase.clientService}/clients/child-parent/${portalProfileId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "CHILD_PARENT_LIST_FETCH_SUCCESS",
        payload: responseBody.data,
      });
      return true;
    }
    dispatch({
      type: "CHILD_PARENT_LIST_FETCH_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "CHILD_PARENT_LIST_FETCH_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get Child access roles and tokens
*/
export const fetchChildInfo = ({
  portalProfileId,
  childPortalProfileId,
  portalTypeId,
  userId,
}) => async (dispatch) => {
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/clients/child-portal?childPortalProfileId=${childPortalProfileId}&parentPortalProfileId=${portalProfileId}&userId=${userId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      const {
        accessToken,
        refreshToken,
        activeParentProfileId,
        userData,
        userRoles,
        userAccessIdList,
      } = responseBody.data;
      //const accessRights = {}
      //userRoles.length > 0 && userRoles.forEach(role => accessRights[role.accessName] ? accessRights[role.accessName].push(role.description) : accessRights[role.accessName] = [role.description])
      cookies.set("@clientAccessToken", accessToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientRefreshToken", refreshToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientUserId", userData.userId, {
        path: `${config.baseName}/`,
      });
      dispatch({
        type: "FETCH_CHILD_PARENT_DATA_SUCCESS",
        payload: {
          isFirstLogin: false,
          activeParentProfileId: activeParentProfileId,
          userData: userData,
          accessRights: [],
          userRoles: userAccessIdList || [],
        },
      });
      return true;
    }
    dispatch({
      type: "FETCH_CHILD_PARENT_DATA_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_CHILD_PARENT_DATA_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

/*
Get Parent access roles and tokens
*/
export const fetchParentInfo = ({
  portalProfileId,
  portalTypeId,
  userId,
}) => async (dispatch) => {
  try {
    let cookies = new Cookies(window.document.cookie);
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/clients/parent-portal/${portalProfileId}?userId=${userId}`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const responseBody = await response.data;
    if (responseBody.error == false) {
      const {
        accessToken,
        refreshToken,
        activeParentProfileId,
        userData,
        userRoles,
        userAccessIdList,
      } = responseBody.data;
      //const accessRights = {}
      //userRoles.length > 0 && userRoles.forEach(role => accessRights[role.accessName] ? accessRights[role.accessName].push(role.description) : accessRights[role.accessName] = [role.description])
      cookies.set("@clientAccessToken", accessToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientRefreshToken", refreshToken, {
        path: `${config.baseName}/`,
      });
      cookies.set("@clientUserId", userData.userId, {
        path: `${config.baseName}/`,
      });
      dispatch({
        type: "FETCH_PARENT_DATA_SUCCESS",
        payload: {
          isFirstLogin: false,
          activeParentProfileId: activeParentProfileId,
          userData: userData,
          accessRights: [],
          userRoles: userAccessIdList,
        },
      });
      return true;
    }
    dispatch({
      type: "FETCH_PARENT_DATA_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "FETCH_PARENT_DATA_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};

//Update token/session time
export const keepSessionLive = () => async (dispatch) => {
  let cookies = new Cookies(window.document.cookie);
  const refreshToken = cookies.get("@clientRefreshToken");
  const accessToken = cookies.get("@clientAccessToken");
  //const currentTime = Math.floor(Date.now() / 1000); //convert to seconds
  //console.log("API current time", moment(currentTime * 1000).format("DD-MM-YYYY h:mm:ss") );
  if (refreshToken) {
    try {
      const response = await axios({
        url: `${config.apiBase.userService}/access/token`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          refreshToken: `${refreshToken}`,
        },
      });
      const responseBody = await response.data;
      if (responseBody.error == false) {
        const { accessToken, refreshToken, exp } = responseBody.data;
        cookies.set("@clientAccessToken", accessToken, {
          path: `${config.baseName}/`,
        });
        cookies.set("@clientRefreshToken", refreshToken, {
          path: `${config.baseName}/`,
        });
        //const tokenExpirationTime = Math.floor((Date.now() + config.sessionTimeout) / 1000); //in seconds
        //console.log("ttttokenExpiryTime", moment(tokenExpirationTime * 1000).format("DD-MM-YYYY h:mm:ss"));
        dispatch({
          type: "UPDATE_TOKEN_TIME_SUCCESS",
          payload: { exp: exp },
        });
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
};

/*
Get Language list
*/
export const fetchSupportedLanguageList = ({lang, appType}) => async (dispatch) => {
  /*dispatch({
      type: "SLL_LIST_FETCH_SUCCESS",
      payload: [{description:"English", code:"en"}, {description:"French", code:"fr"}],
    });
    return true;
*/
try {
  const accessToken = await getAccessToken();
  const response = await axios({
    url: `${config.apiBase.userService}/user/locales?appType=${appType}&portalTypeId=2`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      //Authorization: `Bearer ${accessToken}`,
      'pragma': 'no-cache',
      'accept-language': lang
    },
  });
  const responseBody = await response.data;
  if (responseBody.error == false) {
    dispatch({
      type: "SLL_LIST_FETCH_SUCCESS",
      payload: responseBody.data,
    });
    return true;
  }
  dispatch({
    type: "SLL_LIST_FETCH_FAILED",
    payload: responseBody.message || translatedData.SomethingWentWrong,
  });
  return false;
} catch (error) {
  dispatch({
    type: "SLL_LIST_FETCH_FAILED",
    payload:
      (error.response && error.response.data.message) ||
      translatedData.ErrorOccurred,
  });
  return false;
}
};

/*
Update user selected language
*/
export const updateLanguage = ({
  locale,
}) => async (dispatch) => {
    /*dispatch({
        type: "UPDATE_USER_LANG_SUCCESS",
        payload: { locale: locale },
      });
      return true;*/
  try {     
    const newLang = locale || 'en';    
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/user/update-locales?locale=${newLang}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        'pragma': 'no-cache',
      },
      /*data: JSON.stringify({
        locale: locale || "en"
      }),*/
    });

    const responseBody = await response.data;
    if (responseBody.error == false) {
      dispatch({
        type: "UPDATE_USER_LANG_SUCCESS",
        payload: { locale: locale },
      });
      return true;
    }
    dispatch({
      type: "UPDATE_USER_LANG_FAILED",
      payload: responseBody.message || translatedData.SomethingWentWrong,
    });
    return false;
  } catch (error) {
    dispatch({
      type: "UPDATE_USER_LANG_FAILED",
      payload:
        (error.response && error.response.data.message) ||
        translatedData.ErrorOccurred,
    });
    return false;
  }
};
export const fetchIsPayeeChoicePortal = ()=> async(dispatch) =>{
  dispatch({
     type:'IS_PAYEE_CHOICE_PORTAL',
     payload:config.bankTypeId === BankType.USBANK
   })
   return config.bankTypeId === BankType.USBANK
 }
