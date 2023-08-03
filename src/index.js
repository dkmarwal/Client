import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'core-js/stable';
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/number/is-nan';

import '~/lib/polyfills';
import "~/lib/scrollingelement";
import "~/lib/interceptor";

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// import App from '~/App';
import store from '~/redux';
import { Wrapper } from './Wrapper';

/*
import axios from 'axios';

axios.interceptors.request.use(
	request =>{
	  request.headers['page-path']= window.location.pathname;
      return request;
	},
	error =>{
	  return Promise.reject(error);
	}
);
*/

ReactDOM.render((	
	<Provider store={store}>			
		<BrowserRouter>					
			<Wrapper />					
		</BrowserRouter>		
	</Provider>	
), document.getElementById('root'))
