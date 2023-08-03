import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';
import Cookies from 'universal-cookie';
let cookies = new Cookies(window.document.cookie);

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
        cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
        cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });


        cookies.remove('@clientUserId', { path: `${config.baseName}/` });
        window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
});

export const fetchSelectedTabs = async (clientId) => {
    try {
        const accessToken = await getAccessToken()
         const response = await axios({
             url: `${config.apiBase.clientConfigService}/payment-type/client/${clientId}`,
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
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
             data: { rows: [] },
             error: true
         };
     }
}

export const B2CfetchSelectedTabs = async (clientId) => {    
    try {
        const accessToken = await getAccessToken()
         const response = await axios({
             url: `${config.apiBase.clientConfigService}/b2c/payment-type/client/${clientId}`,
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
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
             data: { rows: [] },
             error: true
         };
     }
}
export const USbankfetchSelectedTabs = async (clientId) => {    
    try {
        const accessToken = await getAccessToken()
         const response = await axios({
             url: `${config.apiBase.clientConfigService}/b2c/default-payment-type/client/${clientId}`,
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
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
             data: { rows: [] },
             error: true
         };
     }
}
export const saveCompanyDetails = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/company/information?clientId=${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
};

export const fetchCompanyDetails = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/company/information?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
};


export const fetchContactTypes = async () => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/contact/types`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
};

export const getRelatedCompanyInfos = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/legal/entity?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const addRelatedCompanyInfo = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/legal/entity?clientId=${clientId}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
};

export const deleteRelatedCompanyInfo = async (id, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/legal/entity/${id}?clientId=${clientId}`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
};

export const updateRelatedCompanyInfo = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/legal/entity?clientId=${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
};

export const getKeyContactInfos = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/contact/information?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const addKeyContactInfo = async (obj, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/contact/information?clientId=${clientId}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
            data: JSON.stringify(obj)
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                translatedData.ErrorOccurred,
            data: { rows: [] },
            error: true
        };
    }
};


export const updateKeyContactInfo = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/contact/information?clientId=${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
};

export const fetchGeneralSettingsPermissions = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/file/processing/flags?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const fetchLookUpforPermissions = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/file/processing/flags/list`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const fetchFileTypes = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/file/types?isHippa=0`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const savePermissionsData = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/general/profile/configuration?clientId=${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const getGeneralSettingConfig = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/general/profile/configuration?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}


export const fetchAllBankAccounts = async () => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/file/processing/flags`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const B2CfetchAllBankAccounts = async () => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/file/processing/flags`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const deleteBankAccount = async () => {
    // try {
    //    const accessToken = await getAccessToken()
    //     const response = await axios({
    //         url: `${config.apiBase.clientConfigService}/file/processing/flags`,
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //            'Authorization': `Bearer ${accessToken}`,
    //         }
    //     });
    //     const responseBody = await response.data;
    //     return responseBody;
    // } catch (error) {
    //     return {
    //         message:
    //             (error.response && error.response.data.message) ||
    //             translatedData.ErrorOccurred,
    //         data: { rows: [] },
    //         error: true
    //     };
    // }
}


export const fetchAllEFT = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/bank-account/client/${clientId}?type=EFT`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const fetchAllACH = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/bank-account/client/${clientId}?type=ACH`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const B2CfetchAllACH = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/bank-account/client/${clientId}?type=ACH`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const fetchAllCheck = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/check-payment/client/${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const B2CfetchAllCheck = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/getCheckInfo?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const fetchAllVCA = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/virtual-card/client/${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const B2CfetchAllZelle = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/zelle/information?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const B2CfetchAllPayPal = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/client/paypal-account?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const B2CfetchAllPushToCard = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/client/push-card-account?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const saveBankAccount = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/setting/bank-account/client/${clientId}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const saveVCA = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/setting/virtual-card`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const saveCHK = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/setting/check-payment/client/${clientId}`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}


export const updateBankAccount = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/setting/bank-account/client/${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const updateVCA = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/setting/virtual-card`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const updateCHK = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/setting/check-payment/client/${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const fetchTransactionTypes = async () => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/transaction-type`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const fetchCurrencyCodes = async () => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/currency`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const updateSupplierValidations = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/payee/configuration?clientId=${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}
export const b2CUpdateSupplierValidations = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/payee/configuration?clientId=${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const getSupplierValidations = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/payee/configuration?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const uploadBulkFile = async (payload) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/bulk/account`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
            data: payload
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                translatedData.ErrorOccurred,
            data: { rows: [] },
            error: true
        };
    }
}

export const getFileProcessingStatus = async (clientId, fileId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/bulk/account/client/${clientId}/file/${fileId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            error: true
        };
    }
}

export const fetchACHProfile = async () => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/bank-account/ach-profile`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            error: true
        };
    }
}

export const fetchTransactionTypeValue = async ({ clientId, paymentCode }) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/transaction-type/client/${clientId}/paymentCode/${paymentCode}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            error: true
        };
    }
}

export const fetchPurchaseType = async () => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/purchase-type/list`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
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
            error: true
        };
    }
}

/**
 * delete key contact info using contactId
 */
export const deleteKeyContact = async(contactId) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/contact/information`,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
            data:JSON.stringify({
                contactId:contactId
            })
        });
        const responseBody = await response.data;
        return responseBody;
    } catch(error){
        return {
            message:
                (error.response && error.response.data.message) ||
                translatedData.ErrorOccurred,
            data: { rows: [] },
            error: true
        };
    }
}

export const saveB2CCompanyDetails = async (payload, clientId) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/b2c/company/information?clientId=${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
};

export const fetchB2CCompanyDetails = async (clientId) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/b2c/company/information?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
};


export const fetchB2CGeneralSettingsPermissions = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/file/processing/flags?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const fetchB2CLookUpforPermissions = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/file/processing/flags/list`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

export const saveB2CPermissionsData = async (payload, clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/general/profile/configuration?clientId=${clientId}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
               'pragma': 'no-cache',
            },
            data: JSON.stringify(payload)
        });
        if (response?.status >= 500) {
          return {
            error: true,
            message: response.data,
          };
        }
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                translatedData.ErrorOccurred,
            data: { rows: [] },
            error: true
        };
    }
}

export const getB2CGeneralSettingConfig = async (clientId) => {
    try {
       const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/b2c/general/profile/configuration?clientId=${clientId}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
               'Authorization': `Bearer ${accessToken}`,
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
            data: { rows: [] },
            error: true
        };
    }
}

// export const saveMasterCard = async (payload, clientId) => {
//     try {
//         const accessToken = await getAccessToken()
//         const response = await axios({
//             url: `${config.apiBase.clientConfigService}/client/master/card/create`,
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 'Authorization': `Bearer ${accessToken}`,
//                 'pragma': 'no-cache',
//             },
//             data: JSON.stringify(payload)
//         });
//         const responseBody = await response.data;
//         return responseBody;
//     } catch (error) {
//         return {
//             message:
//                 (error.response && error.response.data.message) ||
//                 translatedData.ErrorOccurred,
//             data: { rows: [] },
//             error: true
//         };
//     }
// }

export const updateMasterCard = async (payload, clientId) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientConfigService}/update/client/master/card/details`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            },
            data: JSON.stringify({ data: payload })
        });
        const responseBody = await response.data;
        return responseBody;
    } catch (error) {
        return {
            message:
                (error.response && error.response.data.message) ||
                translatedData.ErrorOccurred,
            data: { rows: [] },
            error: true
        };
    }
}