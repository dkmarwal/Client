import _ from "lodash";
import { BankType } from './bankTypes';

const config = {
  all: {
    env: process.env.REACT_APP_STAGE || "USBANK_DEV",
    baseName: process.env.PUBLIC_URL,
    sessionTimeout: 1000 * 5 * 12 * 20, //20 min
    showPopupTime: 1000 * 5 * 12 * 1, //1 min
	bankTypeId: BankType.USBANK,
  },
  uat: {
    showCaptcha: false,
    ssoEnabled: false,
    willTranslate: true,
    showFMT: true,
	  baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService: "https://apib2b.incedopay.com:30010/api/user-service/v1",
      payeeService: "https://apib2b.incedopay.com:30010/api/payee-service/v1",
      clientConfigService:
        "https://apib2b.incedopay.com:30010/api/client-config-service/v1",
      consumerService:
        "https://apib2b.incedopay.com:30010/api/consumer-service/v1",
      clientService: "https://apib2b.incedopay.com:30010/api/client-service/v1",
      notificationService:
        "https://apib2b.incedopay.com:30010/api/notification-service/v1",
      paymentService: "https://apib2b.incedopay.com:30010/api/payment-service",
      notificationSocket: "https://apib2b.incedopay.com:30010",
      identityService:
        "https://apib2b.incedopay.com:30010/api/identity-service/v1",
      reportService: "https://apib2b.incedopay.com:30010/api/report-service",
      masterCardService:"https://apib2b.incedopay.com:30010/api/mastercard-service",
    },
    bankPortalBase: "https://b2badmin.incedopay.com/",
    bankTypeId: BankType.CITIBANK,
  },
  CITI_UAT: {
    showCaptcha: false,
    ssoEnabled: false,
    willTranslate: true,
    showFMT: false,
  	baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService: "https://citib2bapi.incedopay.com/api/user-service/v1",
      payeeService: "https://citib2bapi.incedopay.com/api/payee-service/v1",
      clientConfigService:
        "https://citib2bapi.incedopay.com/api/client-config-service/v1",
      consumerService:
        "https://citib2bapi.incedopay.com/api/consumer-service/v1",
      clientService: "https://citib2bapi.incedopay.com/api/client-service/v1",
      notificationService:
        "https://citib2bapi.incedopay.com/api/notification-service/v1",
      paymentService: "https://citib2bapi.incedopay.com/api/payment-service",
      identityService:
        "https://citib2bapi.incedopay.com/api/identity-service/v1",
      reportService: "https://citib2bapi.incedopay.com/api/report-service",
      masterCardService:"https://citib2bapi.incedopay.com/api/mastercard-service",
    },
    bankPortalBase: "https://citib2badmin.incedopay.com/",
    bankTypeId: BankType.CITIBANK,
  },
  CITI_CTE: {
    showCaptcha: true,
    willTranslate: true,
    ssoEnabled: false,
    showFMT: false,
	  baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/user-service/v1",
      payeeService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/payee-service/v1",
      clientConfigService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/client-config-service/v1",
      consumerService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/consumer-service/v1",
      clientService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/client-service/v1",
      notificationService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/notification-service/v1",
      paymentService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/payment-service",
      identityService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/identity-service/v1",
      reportService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/report-service",
      masterCardService:"https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/mastercard-service",
    },
    bankPortalBase:
      "https://b2badmin.paymentexchange.cte.transactionservices.citi.com/",
      bankTypeId: BankType.CITIBANK,
  },
  prod: {
    showCaptcha: true,
    ssoEnabled: true,
    willTranslate: true,
    showFMT: false,
 	  baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/user-service/v1",
      payeeService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/payee-service/v1",
      clientConfigService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/client-config-service/v1",
      consumerService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/consumer-service/v1",
      clientService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/client-service/v1",
      notificationService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/notification-service/v1",
      paymentService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/payment-service",
      identityService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/identity-service/v1",
      reportService:
        "https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/report-service",
      masterCardService:"https://b2bapi.paymentexchange.cte.transactionservices.citi.com/api/mastercard-service",
    },
    bankPortalBase:
      "https://b2badmin.paymentexchange.cte.transactionservices.citi.com/",
      bankTypeId: BankType.CITIBANK,
  },
  CITI_PROD: {
    showCaptcha: true,
    ssoEnabled: true,
    willTranslate: true,
    showFMT: false,
  	baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService:
        "https://b2bapi.citipaymentexchange.citi.com/api/user-service/v1",
      payeeService:
        "https://b2bapi.citipaymentexchange.citi.com/api/payee-service/v1",
      clientConfigService:
        "https://b2bapi.citipaymentexchange.citi.com/api/client-config-service/v1",
      consumerService:
        "https://b2bapi.citipaymentexchange.citi.com/api/consumer-service/v1",
      clientService:
        "https://b2bapi.citipaymentexchange.citi.com/api/client-service/v1",
      notificationService:
        "https://b2bapi.citipaymentexchange.citi.com/api/notification-service/v1",
      paymentService:
        "https://b2bapi.citipaymentexchange.citi.com/api/payment-service",
      identityService:
        "https://b2bapi.citipaymentexchange.citi.com/api/identity-service/v1",
      reportService:
        "https://b2bapi.citipaymentexchange.citi.com/api/report-service",
      masterCardService:"https://b2bapi.citipaymentexchange.citi.com/api/mastercard-service",
    },
    bankPortalBase: "https://b2badmin.citipaymentexchange.citi.com/",
    bankTypeId: BankType.CITIBANK,
  },
  CITI_DR: {
    showCaptcha: true,
    ssoEnabled: true,
    willTranslate: true,
    showFMT: false,
  	baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService:
        "https://b2bapi.citipaymentexchange.citi.com/api/user-service/v1",
      payeeService:
        "https://b2bapi.citipaymentexchange.citi.com/api/payee-service/v1",
      clientConfigService:
        "https://b2bapi.citipaymentexchange.citi.com/api/client-config-service/v1",
      clientService:
        "https://b2bapi.citipaymentexchange.citi.com/api/client-service/v1",
      consumerService:
        "https://b2bapi.citipaymentexchange.citi.com/api/consumer-service/v1",
      notificationService:
        "https://b2bapi.citipaymentexchange.citi.com/api/notification-service/v1",
      paymentService:
        "https://b2bapi.citipaymentexchange.citi.com/api/payment-service",
      identityService:
        "https://b2bapi.citipaymentexchange.citi.com/api/identity-service/v1",
      reportService:
        "https://b2bapi.citipaymentexchange.citi.com/api/report-service",
      masterCardService:"https://b2bapi.citipaymentexchange.citi.com/api/mastercard-service"
    },
    bankPortalBase: "https://b2badmin.citipaymentexchange.citi.com/",
    bankTypeId: BankType.CITIBANK,
  },
  AWS_CC_DEV: {
    showCaptcha: false,
    ssoEnabled: false,
    willTranslate: true,
    showFMT: false,
	  baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService: "https://b2bapicards.incedopay.com:30010/api/user-service/v1",
      payeeService: "https://b2bapicards.incedopay.com:30010/api/payee-service/v1",
      clientConfigService:"https://b2bapicards.incedopay.com:30010/api/client-config-service/v1",
      consumerService:"https://b2bapicards.incedopay.com:30010/api/consumer-service/v1",
      clientService: "https://b2bapicards.incedopay.com:30010/api/client-service/v1",
      notificationService:"https://b2bapicards.incedopay.com:30010/api/notification-service/v1",
      paymentService: "https://b2bapicards.incedopay.com:30010/api/payment-service",
      notificationSocket: "https://b2bapicards.incedopay.com:30010",
      identityService:"https://b2bapicards.incedopay.com:30010/api/identity-service/v1",
      reportService: "https://b2bapicards.incedopay.com:30010/api/report-service",
      masterCardService:"https://b2bapicards.incedopay.com:30010/api/mastercard-service"
    },
    bankPortalBase: "https://b2badmincards.incedopay.com/",
    bankTypeId: BankType.CITIBANK,
  },
  AWS_CC_UAT: {
    showCaptcha: false,
    ssoEnabled: false,
    willTranslate: true,
    showFMT: false,
	  baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
     apiBase: {
      userService: "https://b2bapicardsdemo.incedopay.com:30010/api/user-service/v1",
      payeeService: "https://b2bapicardsdemo.incedopay.com:30010/api/payee-service/v1",
      clientConfigService:"https://b2bapicardsdemo.incedopay.com:30010/api/client-config-service/v1",
      consumerService:"https://b2bapicardsdemo.incedopay.com:30010/api/consumer-service/v1",
      clientService: "https://b2bapicardsdemo.incedopay.com:30010/api/client-service/v1",
      notificationService:"https://b2bapicardsdemo.incedopay.com:30010/api/notification-service/v1",
      paymentService: "https://b2bapicardsdemo.incedopay.com:30010/api/payment-service",
      notificationSocket: "https://b2bapicardsdemo.incedopay.com:30010",
      identityService:"https://b2bapicardsdemo.incedopay.com:30010/api/identity-service/v1",
      reportService: "https://b2bapicardsdemo.incedopay.com:30010/api/report-service",
    },
    bankPortalBase: "https://b2badmincardsdemo.incedopay.com/",
    bankTypeId: BankType.CITIBANK,
  },
  USBANK_DEV: {
    showCaptcha: false,
    ssoEnabled: false,
    willTranslate: true,
    showFMT: false,
	baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService: "https://b2cusbankapi.incedopay.com:30010/api/user-service/v2",
      payeeService: "https://b2cusbankapi.incedopay.com:30010/api/payee-service/v2",
      clientConfigService: "https://b2cusbankapi.incedopay.com:30010/api/client-config-service/v2",
      consumerService: "https://b2cusbankapi.incedopay.com:30010/api/consumer-service/v2",
      clientService: "https://b2cusbankapi.incedopay.com:30010/api/client-service/v2",
      notificationService: "https://b2cusbankapi.incedopay.com:30010/api/notification-service/v2",
      paymentService: "https://b2cusbankapi.incedopay.com:30010/api/payment-service/v2",
      notificationSocket: "https://b2cusbankapi.incedopay.com:30010",
      identityService: "https://b2cusbankapi.incedopay.com:30010/api/identity-service/v2",
      reportService: "https://b2cusbankapi.incedopay.com:30010/api/report-service/v2",
      SSOService: "https://b2cusbankapi.incedopay.com:30080/api/sso-service/v2",
    },
    bankPortalBase: "https://b2cusbankadmin.incedopay.com/",
    bankTypeId: BankType.USBANK,
   },
   US_UAT: {
    showCaptcha: true,
    ssoEnabled: false,
    willTranslate: true,
    showFMT: false,
	baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService: "https://b2cusbankapiuat.incedopay.com:30010/api/user-service/v2",
      payeeService: "https://b2cusbankapiuat.incedopay.com:30010/api/payee-service/v2",
      clientConfigService: "https://b2cusbankapiuat.incedopay.com:30010/api/client-config-service/v2",
      consumerService: "https://b2cusbankapiuat.incedopay.com:30010/api/consumer-service/v2",
      clientService: "https://b2cusbankapiuat.incedopay.com:30010/api/client-service/v2",
      notificationService: "https://b2cusbankapiuat.incedopay.com:30010/api/notification-service/v2",
      paymentService: "https://b2cusbankapiuat.incedopay.com:30010/api/payment-service/v2",
      notificationSocket: "https://b2cusbankapiuat.incedopay.com:30010",
      identityService: "https://b2cusbankapiuat.incedopay.com:30010/api/identity-service/v2",
      reportService: "https://b2cusbankapiuat.incedopay.com:30010/api/report-service/v2",
      SSOService: "https://b2cusbankapiuat.incedopay.com:30080/api/sso-service/v2",
    },
    bankPortalBase: "https://b2cusbankadminuat.incedopay.com/",
    bankTypeId: BankType.USBANK,
  },
  US_QC: {
    showCaptcha: true,
    ssoEnabled: false,
    willTranslate: true,
    showFMT: false,
	  baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService: "https://b2cusbankapiqc.incedopay.com:30010/api/user-service/v2",
      payeeService: "https://b2cusbankapiqc.incedopay.com:30010/api/payee-service/v2",
      clientConfigService: "https://b2cusbankapiqc.incedopay.com:30010/api/client-config-service/v2",
      consumerService: "https://b2cusbankapiqc.incedopay.com:30010/api/consumer-service/v2",
      clientService: "https://b2cusbankapiqc.incedopay.com:30010/api/client-service/v2",
      notificationService: "https://b2cusbankapiqc.incedopay.com:30010/api/notification-service/v2",
      paymentService: "https://b2cusbankapiqc.incedopay.com:30010/api/payment-service/v2",
      notificationSocket: "https://b2cusbankapiqc.incedopay.com:30010",
      identityService: "https://b2cusbankapiqc.incedopay.com:30010/api/identity-service/v2",
      reportService: "https://b2cusbankapiqc.incedopay.com:30010/api/report-service/v2",
     SSOService: "https://b2cusbankapiqc.incedopay.com:30080/api/sso-service/v2",
    },
    bankPortalBase: "https://b2cusbankadminqc.incedopay.com/",
    bankTypeId: BankType.USBANK,
  },
  US_PROD: {
    showCaptcha: true,
    ssoEnabled: false,
    willTranslate: true,
    showFMT: false,
	  baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService: "https://client-payeechoice2.usbank.com:30010/api/user-service/v2",
      payeeService: "https://client-payeechoice2.usbank.com:30010/api/payee-service/v2",
      clientConfigService: "https://client-payeechoice2.usbank.com:30010/api/client-config-service/v2",
      consumerService: "https://client-payeechoice2.usbank.com:30010/api/consumer-service/v2",
      clientService: "https://client-payeechoice2.usbank.com:30010/api/client-service/v2",
      notificationService: "https://client-payeechoice2.usbank.com:30010/api/notification-service/v2",
      paymentService: "https://client-payeechoice2.usbank.com:30010/api/payment-service/v2",
      notificationSocket: "https://client-payeechoice2.usbank.com:30010",
      identityService: "https://client-payeechoice2.usbank.com:30010/api/identity-service/v2",
      reportService: "https://client-payeechoice2.usbank.com:30010/api/report-service/v2",
     SSOService: "https://client-payeechoice2.usbank.com:30080/api/sso-service/v2",
    },
    bankPortalBase: "https://client-payeechoice2.usbank.com/",
    bankTypeId: BankType.USBANK,
  },
  US_PREPROD: {
    showCaptcha: true,
    ssoEnabled: false,
    willTranslate: true,
    showFMT: false,
	  baseURL: `${window.location.protocol}//${window.location.hostname}:${window.location.port}`,
    apiBase: {
      userService: "https://b2cusbankapipreprod.incedopay.com:30010/api/user-service/v2",
      payeeService: "https://b2cusbankapipreprod.incedopay.com:30010/api/payee-service/v2",
      clientConfigService: "https://b2cusbankapipreprod.incedopay.com:30010/api/client-config-service/v2",
      consumerService: "https://b2cusbankapipreprod.incedopay.com:30010/api/consumer-service/v2",
      clientService: "https://b2cusbankapipreprod.incedopay.com:30010/api/client-service/v2",
      notificationService: "https://b2cusbankapipreprod.incedopay.com:30010/api/notification-service/v2",
      paymentService: "https://b2cusbankapipreprod.incedopay.com:30010/api/payment-service/v2",
      notificationSocket: "https://b2cusbankapipreprod.incedopay.com:30010",
      identityService: "https://b2cusbankapipreprod.incedopay.com:30010/api/identity-service/v2",
      reportService: "https://b2cusbankapipreprod.incedopay.com:30010/api/report-service/v2",
    },
    bankPortalBase: "https://b2cusbankclientpreprod.incedopay.com",
    bankTypeId: BankType.USBANK,
  },
};

export default _.merge(config.all, config[config.all.env]);