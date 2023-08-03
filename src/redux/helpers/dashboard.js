import axios from "axios";
import Cookies from "universal-cookie";
import config from "~/config";
import { getAccessToken } from "~/redux/helpers/user";
import i18n from '~/i18n';
let cookies = new Cookies();
let token = cookies.get("@clientAccessToken");
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

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
    if (error.response.status == 401) {
        cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
        cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
        cookies.remove('@clientUserId', { path: `${config.baseName}/` });
        window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
});


export const fetchDashboardPayments = async (payload) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.reportService}/GetDashboardPaymentData`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(payload)
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


export const fetchDashboardPaymentSummary = async (payload) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.reportService}/GetDashboardPaymentSummary`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify(payload)
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

export const fetchSupplierEnrollmentData = async (campaignId, reportType) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.payeeService}/dashboard/payee/enroll?campaignId=${campaignId}&reportType=${reportType}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
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

export const fetchDashboardChildEntities = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.clientService}/clients/dashboard/child-list`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
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


export const fetchDashboardSupplierEnrollmentData = async (clientId, campaignId, reportType) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.payeeService}/client-dashboard/payee/enroll`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                clientId: clientId,
                campaignId: `${campaignId}`,
                reportType: reportType
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
};

export const fetchDashboardSankeyData = async (clientId, campaignId, reportType) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.payeeService}/client-dashboard/campaign`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({
                clientId: clientId,
                campaignId: `${campaignId}`,
                reportType: reportType
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
};

export const fetchCCYearList = async () => {    
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/yearList`,
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
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCGraphData = async (payload) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/cumulativeSpendGraph`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache'                
            }, 
            data: JSON.stringify(payload)           
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCEnrollVendorsList = async () => {    
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/venders`,
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
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCEnrollPayersList = async (Id) => {    
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/payers?CampaignVendorId=${Id}`,
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
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCEnrollCampaignsList = async (vendorId, payerId) => {    
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/Campaigns?CampaignVendorId=${vendorId}&ClientId=${payerId}`,
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
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCEnrollGraphs = async ({vendorId, payerId, campaignsId, period, currency, fromDate, toDate, gType}) => { 
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/EnrollmentOverTimeReport?VendorId=${vendorId}&PayerId=${payerId}&CampaignId=${campaignsId}&ModeOfPeriod=${period}&CurrencyType=${currency}&FromDate=${fromDate}&EndDate=${toDate}&GraphType=${gType}`,
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
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};

export const fetchCCRiskAnalysisGraph = async ({ClientID, PayeeRegInfoId, LineOfRisk, AboveThreshhold, UserID}) => { 
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.masterCardService}/1/RiskAnalysisGraph?ClientID=${ClientID}&PayeeRegInfoId=${PayeeRegInfoId}&LineOfRisk=${LineOfRisk}&AboveThreshhold=${AboveThreshhold}&UserID=${UserID}`,
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
                "An error has occured.",
            data: {},
            error: true,
        };
    }
};



