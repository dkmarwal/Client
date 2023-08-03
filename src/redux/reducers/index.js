import { combineReducers } from 'redux'
import user from './user'
import Payee from './USbank/Payee';
import clientConfig from './clientConfig'
import client from "./client";
import moduleData from './moduleData'
import filter from './filter'
import role from './role'
import payment from "./payments";
import report from "./report";
import USbankReport from "./USbank/report";
import campaign from "./campaign";
import notification from './notification';
import csc from "./csc";
import b2cPayments from './B2C/payments';
import suppliers from './suppliers';
import IPSecurity from './security';
import paymentAttribute from './paymentAttribute';
import b2cConsumers from './B2C/consumers';
import ccCampaign from './CC/campaign';
import payeeAttribute from './payeeAttribute';
import branding from './branding';
import USBankPayment from './USbank/payments'
import USbankpayee from './USbank/Payee'

const reducer = combineReducers({
	user,
	Payee,
	clientConfig,
	client,
	moduleData,
	filter,
	role,
	payment,
    report,
    campaign,
	notification,
	csc,
	b2cPayments,
	USBankPayment,
	suppliers,
	IPSecurity,
	paymentAttribute,
	b2cConsumers,
	ccCampaign,
	payeeAttribute,
	branding,
	USbankpayee,
	USbankReport
})

export default reducer;