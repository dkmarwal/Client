import Cookies from "universal-cookie";
import axios from "axios";
import moment from "moment";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import { BankType } from "~/config/bankTypes";
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
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
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
export const createachPayee =
  ({ clientId, payee }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/payee-info`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: JSON.stringify({
          consumerIdentifier: payee.payeeID || null,
          payeeTypeId: payee.payeeType || null,
          firstName: payee.payeeFirstName || null,
          lastName: payee.payeeLastName || null,
          emailId: payee.email || null,
          phoneNumber: payee.phone || null,
          companyName: payee.payeeCompanyName || null,
          paymentMethodId: 2,
          address1: payee.payeeaddress_line1 || null,
          address2: payee.payeeaddress_line2 || null,
          country: payee.payeecountry || null,
          city: payee.payeecity || null,
          state: payee.payeestate || null,
          postalCode: payee.pyeezipcode || null,
          phoneCountryCode:payee.countryCode ||"+1",
          remittanceEmail: payee.remEmail || null,
          locationId: payee.locationID || null,
          contactMethod: payee.contactMethod.toString() || null,
          communicationEmail:payee.comEmail || null,
          // paymentMethodId: 2,
          paymentMethodInfo: {
            accountNumber: payee.accountNumber || null,
            accountTypeId: payee.accountType || null,
            routingCode: payee.routingCode || null,
          },
        }),
      });

      const responseBody = await response.data;
      if (responseBody.error === false) {
        // dispatch({
        //   type: "CREATE_PAYEE_SUCCESS",
        //   payload: responseBody.data,
        // });
        return true;
      }
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: error.message || translatedData.ErrorOccurred,
      });
      return false;
    }
  };

export const createzellePayee =
  ({ clientId, payee }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/payee-info`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: JSON.stringify({
          consumerIdentifier: payee.payeeID || null,
          payeeTypeId: payee.payeeType || null,
          firstName: payee.payeeFirstName || null,
          lastName: payee.payeeLastName || null,
          emailId: payee.email || null,
          phoneNumber: payee.phone || null,
          phoneCountryCode:payee.countryCode ||"+1",
          companyName: payee.payeeCompanyName || null,
          communicationEmail:payee.comEmail || null,
          // paymentMethodId: payee.paymentMethodId||null,
          paymentMethodId: payee.paymentMethodId || null,
          paymentMethodInfo: {
            tokenType:
              payee.tokenType && payee.tokenType === 1
                ? "email"
                : "phone" || null,
            tokenValue: payee.tokenValue || null,
          },
        }),
      });

      const responseBody = await response.data;
      if (responseBody.error === false) {
        // dispatch({
        //   type: "CREATE_PAYEE_SUCCESS",
        //   payload: responseBody.data,
        // });
        return true;
      }
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: error.message || translatedData.ErrorOccurred,
      });
      return false;
    }
  };
export const createcheckPayee =
  ({ clientId, payee }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/payee-info`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: JSON.stringify({
          consumerIdentifier: payee.payeeID || null,
          payeeTypeId: payee.payeeType || null,
          firstName: payee.payeeFirstName || null,
          lastName: payee.payeeLastName || null,
          emailId: payee.email || null,
          phoneNumber: payee.phone || null,
          phoneCountryCode:payee.countryCode ||"+1",
          companyName: payee.payeeCompanyName || null,
          communicationEmail:payee.comEmail || null,
          // paymentMethodId: payee.paymentMethodId||null,
          paymentMethodId: payee.paymentMethodId || null,
          paymentMethodInfo: {
            addressLine1: payee.address_line1 || null,
            addressLine2: payee.address_line2 || null,
            country: payee.country || null,
            city: payee.city || null,
            state: payee.state || null,
            postalCode: payee.zipcode || null,
          },
        }),
      });

      const responseBody = await response.data;
      if (responseBody.error === false) {
        // dispatch({
        //   type: "CREATE_PAYEE_SUCCESS",
        //   payload: responseBody.data,
        // });
        return true;
      }
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: error.message || translatedData.ErrorOccurred,
      });
      return false;
    }
  };
  export const updatecheckPayee =
  ({ clientId, payee }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/payee-info`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: JSON.stringify({
          consumerIdentifier: payee.payeeID || null,
          payeeTypeId: payee.payeeType || null,
          firstName: payee.payeeFirstName || null,
          lastName: payee.payeeLastName || null,
          emailId: payee.email || null,
          phoneNumber: payee.phone || null,
          companyName: payee.payeeCompanyName || null,
          communicationEmail:payee.comEmail || null,
          // paymentMethodId: payee.paymentMethodId||null,
          paymentMethodId: payee.paymentMethodId || null,
          paymentMethodInfo: {
            addressLine1: payee.address_line1 || null,
            addressLine2: payee.address_line2 || null,
            country: payee.country || null,
            city: payee.city || null,
            state: payee.state || null,
            postalCode: payee.zipcode || null,
          },
        }),
      });

      const responseBody = await response.data;
      if (responseBody.error === false) {
        // dispatch({
        //   type: "CREATE_PAYEE_SUCCESS",
        //   payload: responseBody.data,
        // });
        return true;
      }
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: error.message || translatedData.ErrorOccurred,
      });
      return false;
    }
  };
export const createppdPayee =
  ({ clientId, payee,finalCardDetails }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/payee-info`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: JSON.stringify({
          consumerIdentifier: payee.payeeID || null,
          payeeTypeId: payee.payeeType || null,
          firstName: payee.payeeFirstName || null,
          lastName: payee.payeeLastName || null,
          emailId: payee.email || null,
          phoneNumber: payee.phone || null,
          companyName: payee.payeeCompanyName || null,
          phoneCountryCode:payee.countryCode ||"+1",
          communicationEmail:payee.comEmail || null,
          // paymentMethodId: payee.paymentMethodId||null,
          paymentMethodId: payee.paymentMethodId || null,
          paymentMethodInfo: {
            address1: finalCardDetails.address ? payee.ppdaddress_line1 : null,
            address2: finalCardDetails.address ?payee.ppdaddress_line2 : null,
            country: finalCardDetails.address ?payee.ppdcountry : null,
            city: finalCardDetails.address ?payee.ppdcity : null,
            state: finalCardDetails.address ?payee.ppdstate : null,
            postalCode: finalCardDetails.address ? payee.ppdzipcode : null,
            employerState: finalCardDetails.isEmployeeState ? payee.employerState : null,
            uniqueId: finalCardDetails.isUniqueId ? payee.uniqueId : null,
            dateOfBirth: finalCardDetails.isDateOfBirth ? moment(payee.startDate).format('MM/DD/YYYY') : null,
            ssn: finalCardDetails.isSsn ? payee.SSN : null,
            govIdValue: finalCardDetails.govIdTypeId ? payee.govIdValue : null,
            govExpiredDate: finalCardDetails.govIdTypeId? moment(payee.govExpiredDate).format('MM/DD/YYYY') : null,
            govLocation: finalCardDetails.isGovLocation ? payee.govLocation : null,
            govIdType: finalCardDetails.govIdTypeId ? payee.govIdType : null,
            homePhone: finalCardDetails.isHomePhone ? payee.homePhone : null,
            mobilePhone: finalCardDetails.isMobilePhone? payee.mobilePhone : null,
            firstName:  finalCardDetails.isName?payee.firstName : null,
            emailId:  finalCardDetails.isEmail ? payee.email : null,
            lastName:  finalCardDetails.isName? payee.lastName : null,
          },
        }),
      });

      const responseBody = await response.data;
      if (responseBody.error === false) {
        // dispatch({
        //   type: "CREATE_PAYEE_SUCCESS",
        //   payload: responseBody.data,
        // });
        return true;
      }
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: error.message || translatedData.ErrorOccurred,
      });
      return false;
    }
  };
  export const createppdcrporatePayee =
  ({ clientId, payee }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/payee-info`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        data: JSON.stringify({
          consumerIdentifier: payee.payeeID || null,
          payeeTypeId: payee.payeeType || null,
          firstName: payee.payeeFirstName || null,
          lastName: payee.payeeLastName || null,
          emailId: payee.email || null,
          phoneNumber: payee.phone || null,
          companyName: payee.payeeCompanyName || null,
          phoneCountryCode:payee.countryCode ||"+1",
          communicationEmail:payee.comEmail || null,
          // paymentMethodId: payee.paymentMethodId||null,
          paymentMethodId: payee.paymentMethodId || null,
          paymentMethodInfo: {
            address1: payee.ppdaddress_line1 || null,
            address2: payee.ppdaddress_line2 || null,
            country: payee.ppdcountry || null,
            city: payee.ppdcity || null,
            state: payee.ppdstate || null,
            postalCode: payee.ppdzipcode || null,
            firstName: payee.firstName || null,
            emailId: payee.email || null,
            lastName: payee.lastName || null,
          },
        }),
      });

      const responseBody = await response.data;
      if (responseBody.error === false) {
        // dispatch({
        //   type: "CREATE_PAYEE_SUCCESS",
        //   payload: responseBody.data,
        // });
        return true;
      }
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: "CREATE_PAYEE_FAILED",
        payload: error.message || translatedData.ErrorOccurred,
      });
      return false;
    }
  };

  export const getUSbankPayeeType = () => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/payee-types`,
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
          type: 'PAYEE_TYPE_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'PAYEE_TYPE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'PAYEE_TYPE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
    
  };
  export const getUSbankContactMethod = () => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/contact-methods`,
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
          type: 'CONTACT_TYPE_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'CONTACT_TYPE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'CONTACT_TYPE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
    
  };
  export const getUSbankAccountMethod = () => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.consumerService}/account-types`,
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
          type: 'ACCOUNT_TYPE_SUCCESS',
          payload: responseBody.data,
        });
        return responseBody.data;
      }
      dispatch({
        type: 'ACCOUNT_TYPE_FAILED',
        payload: responseBody.message || translatedData.SomethingWentWrong,
      });
      return false;
    } catch (error) {
      dispatch({
        type: 'ACCOUNT_TYPE_FAILED',
        payload:
          (error.response && error.response.message) ||
          error.message ||
          translatedData.ErrorOccurred,
      });
      return false;
    }
    
  };
