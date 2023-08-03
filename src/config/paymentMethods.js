export const paymentMethods = {
    "Zelle":"CXC",
    "PushToCard":"MSC",
    "PayPal":"PPL",
    "ACH":"ACH",
    "VCA":"VCA",
    "CHK":"CHK",
    "USBankZelle":"ZEL", // Zelle Code for US Bank
    "USBankACH": "ACH",
    "USBankCHK": "CHK",
    "USBankRTP":"RTP",
    "USBankDepositToDebitcard":"DDC",
    "USBankPrepaidCard":"PPD",
    "PrepaidFocusNonPayroll":"PFB",
    "PrepaidReliaCard":"PRC",
    "PrepaidCorporateReward":"PCR",
    "PlasticCorporateCard":"CRP",
    "DigitalCorporateCard":"CRD"
}

export const paymentMethodIds = {
    "CHK": 1,
    "ACH": 2,
    "PayPal": 16,
    "PushToCard": 32,
    "Zelle":64,
    "CROSS_BORDER": 128,
    "WIRE": 256,
    "USBankZelle": 64, // Zelle Code for US Bank
    "USBankACH": 2,
    "USBankCHK": 1,
     "USBankRTP": 128,
   // "USBankRTP": 512,
    "USBankDepositToDebitcard": 256,
    "USBankPrepaidCard": 512,
    "PrepaidFocusNonPayroll": 2048,
    "PrepaidReliaCard": 4096,
    "PrepaidCorporateReward": 1024,
    "PlasticCorporateCard": 8192,
    "DigitalCorporateCard": 16384
}

//Only need in general setting page
export const paymentMethodFileFormatIds = {
    "ACH": 1,
    "CHK": 2,
    "VCA": 2,
    "PayPal": 64,
    "PushToCard": 128,
    "Zelle": 256,
    "USBankZelle": 256, // Zelle Code for US Bank
    "USBankACH": 1,
    "USBankCHK": 2,
    "USBankRTP": 512,
    "USBankDepositToDebitcard": 1024,
    "USBankPrepaidCard": 2048,
    "PrepaidFocusNonPayroll": 8192,
    "PrepaidReliaCard": 16384,
    "PrepaidCorporateReward": 4096,
    "PlasticCorporateCard": 32768,
    "DigitalCorporateCard": 65536
}

export const EmailDeliveryModeId = 2;
export const DownloadDeliveryModeId = 1;
export const fileName ="PYMT";
export const paymentMethodsCode = {
    USBankPrepaidCard:512,
    PrepaidCorporateReward:1024,
    PlasticCorporateCard:8192,
    DigitalCorporateCard:16384,
    PrepaidFocusNonPayroll:2048,
    PrepaidReliaCard:4096
}