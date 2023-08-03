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

axios.interceptors.response.use(
  function (response) {
    // Do something with response data 
   if(response.status==401){
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
   }
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status == 401) {
      cookies.remove("@clientAccessToken", { path: `${config.baseName}/` });
      cookies.remove("@clientRefreshToken", { path: `${config.baseName}/` });
      cookies.remove("@clientUserId", { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

export const fetchSMSTemplates = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/branding/sms/template`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
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

  export const saveSMSTemplates = async (payload) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/branding/sms/template`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
        data: JSON.stringify({
            "clientTemplateId": payload?.clientTemplateId || null,
            "clientId": payload?.clientId || null,
            "templateId": payload?.templateId || null,
            //"crmTemplateCode": payload?.crmTemplateCode || null,
            "title": payload?.title || null,
            "description": payload?.description || null,
            "source": payload?.source || null,
            "subject": payload?.subject || null,
            "body": payload?.body || null,
            //"isActive": payload?.isActive || null,
            //"isForClientUser": payload?.isForClientUser || null,
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

  export const defaultUserTheme = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/consumer-theme`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
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

  export const saveUserThemeData = async (payload) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/branding/logo`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
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

  export const uploadFaq = async (file) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/upload-faq`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
        data: file        
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

  export const uploadPrivacyPolicy = async (file) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/upload-privacy-policy`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
        data: file        
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

  export const fetchBrandingData = async (clientId, appType) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/branding/enrollment/site?clientId=${clientId}&appType=${appType}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
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

  export const fetchFAQData = async (slugURL) => {    
    let req = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      req.open("GET", `${config.apiBase.clientConfigService}/b2c/faq?consumerSlugUrl=${slugURL}`, true);    
      req.send();          
      req.onload=()=>{              
        if(req.status === 200){                      
          let fileExt = req.getResponseHeader('content-type');          
          var contentDisposition = null

          if(fileExt != 'application/json; charset=utf-8'){
            fileExt = fileExt.split("application/")[1].toLowerCase();
            fileExt = fileExt === "pdf" ? ".pdf" : ".docx";
            contentDisposition = Boolean(req.getResponseHeader('content-disposition')) && req.getResponseHeader('content-disposition') || `attachment; filename=413981503_FAQ_1639484141391${fileExt}`; 
          } 

          var contentLength = req.getResponseHeader('content-length') || null; 
          var contentType = req.getResponseHeader('content-type') || null;          
          const responseBody = {
            "data": req.response || null,
            "content-disposition": contentDisposition,
            "content-length": contentLength,
            "content-type": contentType,
            "error" : false
          }    
          resolve(responseBody);            
        }
        else{
          const apiRes = JSON.parse(req.response);
          resolve(apiRes)
        }             
      }
    }); 
  };

  export const fetchPrivacyPolicyData = async (slugURL) => {
    let req = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      req.open("GET", `${config.apiBase.clientConfigService}/b2c/privacy-policy?consumerSlugUrl=${slugURL}`, true);    
      req.send();          
      req.onload=()=>{      
        if(req.status === 200){
          let fileExt = req.getResponseHeader('content-type');          
          var contentDisposition = null

          if(fileExt != 'application/json; charset=utf-8'){
            fileExt = fileExt.split("application/")[1].toLowerCase();
            fileExt = fileExt === "pdf" ? ".pdf" : ".docx";
            contentDisposition = Boolean(req.getResponseHeader('content-disposition')) && req.getResponseHeader('content-disposition') || `attachment; filename=413981503_Privacy_Policy_1639484141391${fileExt}`; 
          }   

          var contentLength = req.getResponseHeader('content-length') || null; 
          var contentType = req.getResponseHeader('content-type') || null;          
          const responseBody = {
            "data": req.response || null,
            "content-disposition": contentDisposition,
            "content-length": contentLength,
            "content-type": contentType,
            "error" : false
          }    
          resolve(responseBody);            
        } 
        else{
          const apiRes = JSON.parse(req.response);
          resolve(apiRes)
        }             
      }
    });     
  };

  export const fetchTermsAndConditionData = async (slugURL) => {
    let req = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      req.open("GET", `${config.apiBase.clientConfigService}/b2c/terms-and-conditions?consumerSlugUrl=${slugURL}`, true);    
      req.send();          
      req.onload=()=>{      
        if(req.status === 200){
          let fileExt = req.getResponseHeader('content-type');          
          var contentDisposition = null

          if(fileExt != 'application/json; charset=utf-8'){
            fileExt = fileExt.split("application/")[1].toLowerCase();
            fileExt = fileExt === "pdf" ? ".pdf" : ".docx";
            contentDisposition = Boolean(req.getResponseHeader('content-disposition')) && req.getResponseHeader('content-disposition') || `attachment; filename=413981503_Terms_And_Conditions_1639484141391${fileExt}`; 
          } 

          var contentLength = req.getResponseHeader('content-length') || null; 
          var contentType = req.getResponseHeader('content-type') || null;          
          const responseBody = {
            "data": req.response || null,
            "content-disposition": contentDisposition,
            "content-length": contentLength,
            "content-type": contentType,
            "error" : false
          }    
          resolve(responseBody);            
        }  
        else{
          const apiRes = JSON.parse(req.response);
          resolve(apiRes)
        }            
      }
    });    
  };

  export const uploadTermsAndCondition = async (file) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/upload-terms-and-conditions`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          pragma: "no-cache",
        },
        data: file        
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