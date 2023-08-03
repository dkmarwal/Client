import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';

const cookies = new Cookies();
const language = cookies.get("localeLang") || "en";
const translatedData = i18n.logger.options.resources[language].translation.componentData.reduxData;

axios.interceptors.request.use(
    request => {
        request.headers['accept-language'] = i18n.language;
        return request;
    },
    error => {
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
    if (error.response.status == 401) {
        let cookies = new Cookies();
        cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
        cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
        cookies.remove('@clientUserId', { path: `${config.baseName}/` });
        window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
});

export const getClientPaymentTransactions = async (data) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.paymentService}/GetClientPayments`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        return {
            data: {
                error: true,
                message: (error.response && error.response.data.message) ||
                    translatedData.ErrorOccurred,
                data: []
            }
        };
    }
};

export const getClientPaymentStatus = async (clientID, dateParams = {}) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.paymentService}/GetPaymentFigureStatus`,
            method: "GET",
            params: {
                clientID,
                ...dateParams
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            // data: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        return error;
    }
};

export const getPaymentDetails = async (clientId, paymentId, businessType) => {
    try {
        let urlParams = `paymentID=${paymentId}&clientID=${clientId}&BusinessType=${businessType}`
        /*if(isB2C){
            urlParams+=`&BusinessType=${isB2C}`
        }*/
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.paymentService}/GetTransactionDetailsByPaymentID?${urlParams}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getPaymentTrackingDetails = async (clientId, paymentId, businessType) => {
    try {
        const reqData = {
            clientId, paymentId, portalFlag: 1, BusinessType: businessType
        }
        /*if(isB2C){
            reqData.BusinessType = isB2C
        }*/
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.paymentService}/GetPaymentTracking`,
            method: "POST",
            data: JSON.stringify(reqData),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getStatusTypelist = async (BusinessType, clientId, payerTypeId) => {
    try {
        let urlParams = `portalFlag=1`
        if (BusinessType) {
            urlParams += `&BusinessType=${BusinessType}`
        }
        if(!BusinessType && payerTypeId === 2){
            urlParams += `&clientID=${clientId}&payerTypeId=2`
        }
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.paymentService}/GetPaymentStatusForPortal?${urlParams}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        if (response && response.data) {
            return response.data;
        }
        return {
            data: [],
            error: true,
            message: translatedData.ResponseFormat,
        };
    } catch (error) {
        return {
            data: [],
            error: true,
            message: translatedData.ExceptionOccur,
        };
    }
};

export const getPaymentTypelist = async (businessType) => {
    try {
        let urlToBeHit = ''
        if (businessType) {
            urlToBeHit = `${config.apiBase.clientConfigService}/b2c/payment-type/list`
        } else {
            urlToBeHit = `${config.apiBase.clientConfigService}/payment-type/list`
        }
        const accessToken = await getAccessToken();
        const response = await axios({
            url: urlToBeHit,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        if (response && response.data) {
            return response.data;
        }
        return {
            data: [],
            error: true,
            message: translatedData.ResponseFormat,
        };
    } catch (error) {
        return {
            data: [],
            error: true,
            message: translatedData.ExceptionOccur,
        };
    }
};

export const downloadRemittanceAdvice = async (clientId, paymentId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/remittance/file/download?paymentId=${paymentId}&clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        return response;
    } catch (error) {
        return error && error.response && error.response.data
            ? { ...error.response.data }
            : "";
    }
};

export const getVCardAliasList = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/funding/source/name/list`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        return response && response.data;
    } catch (error) {
        return error && error.response && error.response.data
            ? { ...error.response.data }
            : "";
    }
}

export const cancelCCPayments = async (payload) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/cancelvca`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache'
            },
            data: JSON.stringify(payload)
        });
        return response && response.data;
    } catch (error) {
        return error && error.response && error.response.data
            ? { ...error.response.data }
            : "";
    }
}

export const getCCPaymentDetails = async (paymentId, clientId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/getvcadetails?paymentId=${paymentId}&clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        });
        return response && response.data;
    } catch (error) {
        return error && error.response && error.response.data
            ? { ...error.response.data }
            : "";
    }
}

export const getInvoiceList = async (params) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/invoiceDetails`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache'
            },
            data: JSON.stringify(params)
        });
        return response && response.data;
    }
    catch (error) {
        return error && error.response && error.response.data
            ? { ...error.response.data }
            : "";
    }
}

export const modifyVCADetials = async (data) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/modifyvca`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache'
            },
            data: JSON.stringify(data)
        });
        return response && response.data && response.data.result;
    }
    catch (error) {
        return error && error.response && error.response.data
            ? { ...error.response.data }
            : "";
    }
}

export const getCardActivityTrialData = async (params) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/cardactivitydetails`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache'
            },
            data: JSON.stringify(params)
        });
        return response && response.data;
    }
    catch (error) {
        return error && error.response && error.response.data
            ? { ...error.response.data }
            : "";
    }
} 

export const getCCEnrolledPayees = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.payeeService}/cc-payees?payeeType=enrolled`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        });
        return response && response.data;
    } catch (error) {
        return error && error.response && error.response.data
            ? { ...error.response.data }
            : "";
    }
}

export const updateCCPayeeName = async (paymentID, clientID, remitToID) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/supplierfappingfromUI?paymentid=${paymentID}&clientid=${clientID}&remittoid=${remitToID}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache'
            }            
        });
        return response && response.data;
    }
    catch (error) {
        return error && error.response && error.response.data
            ? { ...error.response.data }
            : "";
    }
}

