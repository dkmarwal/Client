import Cookies from 'universal-cookie';
import axios from 'axios';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
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

export const getAllCountries = () => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/countries-list`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error == false) {
            dispatch({
                type: 'COUNTRY_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'COUNTRY_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'COUNTRY_LIST_FETCH_FAILED',
            payload: error.response && error.response.data.message || translatedData.ErrorOccurred
        })
        return false;
    }
}

export const getStatesOfCountry = (isoCode) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/states-list?countryISOCode=${isoCode}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'STATE_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'STATE_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'STATE_LIST_FETCH_FAILED',
            payload: error.response && (error.response.data.message || translatedData.ErrorOccurred)
        })
        return false;
    }
}

export const getCitiesOfState = (stateName) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/cities-list?stateName=${stateName}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'CITY_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: error.response && (error.response.data.message || translatedData.ErrorOccurred)
        })
        return false;
    }
}

export const getCitiesOfStateByISO = (stateCode) => async (dispatch) => {
    try {
        const accessToken = await getAccessToken()
        const response = await axios({
            url: `${config.apiBase.clientService}/cities-list?stateCode=${stateCode}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'pragma': 'no-cache',
            }
        })
        const responseBody = await response.data;
        if (responseBody.error === false) {
            dispatch({
                type: 'CITY_LIST_FETCH_SUCCESS',
                payload: responseBody.data && responseBody.data.rows,
            })
            return true;
        }
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: responseBody.message || translatedData.SomethingWentWrong
        })
        return false;
    } catch (error) {
        dispatch({
            type: 'CITY_LIST_FETCH_FAILED',
            payload: error.response && (error.response.data.message || translatedData.ErrorOccurred)
        })
        return false;
    }
}