import axios from 'axios';
import Cookies from 'universal-cookie';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    // Do something with response error
    if (error.response.status == 401) {
      let cookies = new Cookies();
      cookies.remove('@accessToken', { path: `${config.baseName}/` });
      cookies.remove('@refreshToken', { path: `${config.baseName}/` });
      cookies.remove('@portalTypeId', { path: `${config.baseName}/` });
      cookies.remove('@userId', { path: `${config.baseName}/` });
      window.location.href = `${config.baseName}/sessionout`;
    }
    return error.response;
  }
);

export const USbankGetBankData = async (
  clientID,
  paymentType,
  showParentData
) => {
  try {
    const queryParamsUrl = showParentData
      ? `type=${paymentType}&isOnboarding=1`
      : `type=${paymentType}`;
    const accessToken = await getAccessToken();
    const accessURL = `${config.apiBase.clientConfigService}/b2c/clients/${clientID}/bank-accounts?${queryParamsUrl}`;
    const response = await axios({
      url: accessURL,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return;
  }
};
export const USbankCSSData = async (
  clientID,
) => {
  try {
    const accessToken = await getAccessToken();
    const accessURL = `${config.apiBase.consumerService}/client/${clientID}/validate-spp-client`;
    const response = await axios({
      url: accessURL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return;
  }
};
export const USbankupdateBankInfo =
  ({ clientId, bankDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL = `${config.apiBase.clientConfigService}/b2c/clients/${clientId}/bank-accounts`;
      const response = await axios({
        url: accessURL,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          accountId: bankDetail?.accountId || null,
          immediateDestinationName:bankDetail?.immediateDestinationName || null,
          accountName: bankDetail?.accountName || null,
          accountNumber: bankDetail?.accountNumber || null,
          routingCode: bankDetail?.routingCode || null,
          companyName: bankDetail?.companyName || null,
          companyIdentification: bankDetail?.companyIdentification || null,
          companyEntryDescription: bankDetail?.companyEntryDescription || null,
          companyDiscretionaryData: bankDetail?.companyDiscretionaryData || null,
          originatingDFIIdentification:
            bankDetail?.originatingDFIIdentification || null,
            originatingDFIDiscretionaryData: bankDetail?.originatingDFIDiscretionaryData || null,
          type: bankDetail?.type || null,
          immediateDestination: bankDetail?.immediateDestination || null,
          immediateOrigin: bankDetail?.immediateOrigin || null,
          immediateOriginName: bankDetail?.immediateOriginName || null,
          currencyCode: bankDetail?.currencyCode || null
        }),
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
export const getUSbanklientBankInfo = async ({
  clientId,
  paymentType,
  isParent,
}) => {
  try {
    const queryParamsUrl = isParent
      ? `type=${paymentType}&isOnboarding=1`
      : `type=${paymentType}`;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/clients/${clientId}/bank-accounts?${queryParamsUrl}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    // return { ...error.response.data };
    return error && error.response ? { ...error.response.data } : [];
  }
};
export const USbankcreateBankInfo =
  ({ clientId, bankDetail }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const accessURL = `${config.apiBase.clientConfigService}/b2c/clients/${clientId}/bank-accounts`;
      const response = await axios({
        url: accessURL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          immediateDestinationName:bankDetail?.immediateDestinationName || null,
          accountName: bankDetail?.accountName || null,
          accountNumber: bankDetail?.accountNumber || null,
          routingCode: bankDetail?.routingCode || null,
          companyName: bankDetail?.companyName || null,
          companyIdentification: bankDetail?.companyIdentification || null,
          companyEntryDescription: bankDetail?.companyEntryDescription || null,
          companyDiscretionaryData: bankDetail?.companyDiscretionaryData || null,
          originatingDFIIdentification:
            bankDetail?.originatingDFIIdentification || null,
            originatingDFIDiscretionaryData: bankDetail?.originatingDFIDiscretionaryData || null,
          type: bankDetail?.type || null,
          immediateDestination: bankDetail?.immediateDestination || null,
          immediateOrigin: bankDetail?.immediateOrigin || null,
          immediateOriginName: bankDetail?.immediateOriginName || null,
          currencyCode: bankDetail?.currencyCode || null
        }),
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
  export const UsbankachProfilesInformation = async () => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/bank-account/ach-profile?bankId=2`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          'pragma': 'no-cache',
        },
      });
      return response;
    } catch (error) {
      // return {
      //   ...error.response.data,
      // };
      return error && error.response ? { ...error.response.data } : [];
    }
  };
 
export const getUSbankDeposittodebitData =
  (clientID, paymentType, showParentData) => async (dispatch) => {
    try {
      const queryParamsUrl = showParentData ? `?isOnboarding=1` : ``;
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/clients/${clientID}/ddc-accounts${queryParamsUrl}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
export const addUSbankDeposittodebit = (data, clientId) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/clients/${data.clientId}/ddc-accounts`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: JSON.stringify({
        ddcSSLMerchantId: data.bankDetail.ddcSSLMerchantId || null,
        ddcTransactionType: data.bankDetail.ddcTransactionType || null,
        ddcConvergeUserId: data.bankDetail.ddcConvergeUserId || null,
        ddcTerminalId: data.bankDetail.ddcTerminalId || null,
        ddcMerchantConverge: data.bankDetail.ddcMerchantConverge || null,
      }),
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateUSbankDeposittodebit =
  (data, clientId) => async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/clients/${data.clientId}/ddc-accounts`,

        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          id: data.bankDetail.id || null,
          ddcSSLMerchantId: data.bankDetail.ddcSSLMerchantId || null,
          ddcTransactionType: data.bankDetail.ddcTransactionType || null,
          ddcConvergeUserId: data.bankDetail.ddcConvergeUserId || null,
          ddcTerminalId: data.bankDetail.ddcTerminalId || null,
          ddcMerchantConverge: data.bankDetail.ddcMerchantConverge || null,

        }),
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export const USBankcreateRtpData =
  ({ rtpDetail, clientId }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/clients/${clientId}/rtp-accounts`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          rtpAccountNumber: rtpDetail.rtpAccountNumber || null,
          rtpRoutingCode: rtpDetail.rtpRoutingCode || null,
        }),
      });

      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };
export const USBankupdatedRTPData =
  ({ rtpDetail, clientId }) =>
  async (dispatch) => {
    try {
      const accessToken = await getAccessToken();
      const response = await axios({
        url: `${config.apiBase.clientConfigService}/b2c/clients/${clientId}/rtp-accounts`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          pragma: 'no-cache',
        },
        data: JSON.stringify({
          id: rtpDetail?.id?.toString() || null,
          rtpAccountNumber: rtpDetail?.rtpAccountNumber || null,
          rtpRoutingCode: rtpDetail?.rtpRoutingCode || null,
        }),
      });
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  };

export const USBankGetRTPData = async (clientId, showParentData) => {
  try {
    const queryParamsUrl = showParentData ? `?isOnboarding=1` : ``;
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/clients/${clientId}/rtp-accounts${queryParamsUrl}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response.data;
  } catch (error) {
    return error && error.response ? { ...error.response.data } : [];
  }
};

export const downloadPrepaidCardFiles = (fileName) => async (dispatch) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.clientConfigService}/b2c/download-prepaid-card-files/${fileName}`,
      method: 'GET',
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
    });
    return response;
  } catch (error) {
    return false;
  }
};
