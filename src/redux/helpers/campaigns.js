import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
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

export const getDownloadCampaignList = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.payeeService}/campaign/detail/list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data
        return responseBody.data.campaigns;
    } catch (error) {
        return null
    }
}

export const getDashboardCampaignList = async (childClientId) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.payeeService}/client-dashboard/campaign/detail/list?childClientId=${childClientId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data
        return responseBody.data.campaigns;
    } catch (error) {
        return null
    }
}

export const getCampaignfileRequiresAttentionList = async (id) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.consumerService}/getDashboardInfo?clientId=${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data
        return responseBody.data;
    } catch (error) {
        return null
    }
}

export const getDownloadSupplierList = async ({ campaignId }) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.payeeService}/campaign/detail?campaignId=${campaignId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            return responseBody.data && responseBody.data.rows || [];
        }
        return response;

    } catch (error) {
        return false;
    }
}

/**Supplier Campaigns API */

export const getCampaignFileList = async (data) => {
    let offset = ((data.pageNumber - 1) * data.rowCount);
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.consumerService}/getFileList`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            params: {
                fileName: data.fileName || undefined,
                fileId: data.fileID || undefined,
                payeeOperator: data.paymentCountFilterBy || undefined,
                noOfRecords: data.paymentCount || undefined,
                fromDate: data.fromDate || undefined,
                toDate: data.toDate || undefined,
                fileStatusId: data.statusID || undefined,
                limit: data.rowCount,
                offset: offset
            }
        })
        const responseBody = await response.data;
        if (responseBody.data) {
            return responseBody.data;
        }
        return {
            error: true,
            message: translatedData.ErrorOccurred,
        };
    } catch (error) {
        return {
            error: true,
            message: (error.response && error.response.data.message) || translatedData.ErrorOccurred,
            data: { rows: [] },
        };
    }
}

export const getCampaignFileStatusList = async () => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.consumerService}/getFileStatusList`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.data) {
            return responseBody.data;
        }
        return {
            error: true,
            message: translatedData.ErrorOccurred,
        };
    } catch (error) {
        return {
            error: true,
            message: (error.response && error.response.data.message) || translatedData.ErrorOccurred,
            data: { rows: [] },
        };
    }
}

export const getCampaignFileExceptionById = async (id) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.consumerService}/getCampainFileExceptionInfo?campaignFileId=${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data
        return responseBody.data;
    } catch (error) {
        return null
    }
}

export const updateCampaignFileAction = async (payload, flag) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.consumerService}/updateCampaignFileStatus?status=${flag}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data:
            {
                "fileId": payload
            }
        })
        const responseBody = await response.data
        return responseBody;
    } catch (error) {
        return null
    }
}

export const downloadCampaignFile = async (id) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.consumerService}/downloadCampaignFile?fileId=${id}`,
            method: "GET",
            responseType: 'arraybuffer',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
        });
        if (response.status === 404 || response.status === 400) {
            return false
        }
        return response;
    } catch (error) {
        return { ...error.response.data };
    }
};

export const getSMSEmailCount = async (id, type) => {
    let apiURL = null;
    if (type === 'campaignFile') {
        apiURL = `${config.apiBase.consumerService}/getSMSEmailCount?campaignFileId=${id}`
    }
    else {
        apiURL = `${config.apiBase.consumerService}/getSMSEmailCount?paymentFileId=${id}`
    }
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: apiURL,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data
        return responseBody.data;
    } catch (error) {
        return null
    }
}

export const getTotalPayeeGraphData = async (id) => {
    try {
        const accessToken = await getAccessToken();
        const response = await axios({
            url: `${config.apiBase.consumerService}/getCountInfo?campaignFileId=${id}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data
        return responseBody.data;
    } catch (error) {
        return null
    }
}

export const getProfileStatusGraphData = async (id, type) => {    
    try {
        const accessToken = await getAccessToken();
        if(type === 'campaignFile'){
            const response = await axios({
                url: `${config.apiBase.consumerService}/consumer-status-count-info`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'pragma': 'no-cache',
                },
                data:{
                    campaignFileId: id || null
                }
            })
            const responseBody = await response.data
            return responseBody.data;
        }
        else{
            const response = await axios({
                url: `${config.apiBase.consumerService}/consumer-status-count-info`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    'pragma': 'no-cache',
                },
                data:{
                    paymentFileId: id || null
                }
            })
            const responseBody = await response.data
            return responseBody.data;
        }
        
    } catch (error) {
        return null
    }
}

export const getPaymentGraphData = async (id, type) => {   
    let APIURL = null;
    if(type === 'campaignFile'){
        APIURL = `${config.apiBase.consumerService}/getPaymentGraphInfo?campaignFileId=${id}`
    }
    else{
        APIURL = `${config.apiBase.consumerService}/getPaymentGraphInfo?paymentFileId=${id}`
    }
    try {
        const accessToken = await getAccessToken();        
        const response = await axios({
            url: APIURL,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data
        return responseBody.data; 
    } catch (error) {
        return null
    }
}