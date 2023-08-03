import axios from 'axios';
import Cookies from 'universal-cookie';
import config from '~/config';
import { getAccessToken } from '~/redux/helpers/user';
import i18n from '~/i18n';

const cookies = new Cookies();
const language = cookies.get('localeLang') || 'en';
const translatedData =
  i18n.logger.options.resources[language].translation.componentData.reduxData;

axios.interceptors.request.use(
  (request) => {
    request.headers['accept-language'] = i18n.language;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchSSODetails = async (userId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      url: `${config.apiBase.userService}/sso`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        pragma: 'no-cache',
      },
      data: userId ? JSON.stringify({userId}) : undefined
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
