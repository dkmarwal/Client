import axios from 'axios';
import Cookies from 'universal-cookie';
import config from '~/config';
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
    if (response.status == 401) {
      let cookies = new Cookies();
		cookies.remove('@clientAccessToken', { path: `${config.baseName}/` });
		cookies.remove('@clientRefreshToken', { path: `${config.baseName}/` });
		cookies.remove('@clientUserId', { path: `${config.baseName}/` });
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

export const fetchModuleData = (moduleId, endpoint) => async dispatch => {
	try {
		const dataUrl = `${endpoint}?t=${(Date.now())}` || `/api/module/${moduleId}`
		const response = await axios({
			url: `${dataUrl}`,
			method: 'GET',
            'pragma': 'no-cache',
		})
		var moduleData = {
			[moduleId]: response.data
		};
		dispatch({
			type: 'FETCH_MODULE_DATA',
			payload: moduleData
		})
	} catch (error) {
		//console.log(error)
		throw typeof error === 'string' ? error : translatedData.configFileUnload
	}
}


export const fetchAndUpdateModuleData = (moduleId, endpoint) => async dispatch => {
	try {
		const dataUrl = `${endpoint}`
		const response = await axios({
			url: `${dataUrl}`,
			method: 'GET'
		})
		var moduleData = {
			[moduleId]: response.data
		};
		dispatch({
			type: 'FETCH_MODULE_DATA',
			payload: moduleData
		})
	} catch (error) {
		//console.log(error)
		throw typeof error === 'string' ? error : translatedData.configFileUnload
	}
}
