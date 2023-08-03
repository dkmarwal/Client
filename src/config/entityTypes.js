export const entityType = {
    "B2B": 1,
    "B2C": 2,
    "attributeLimit": 30,
    "PaymentRecordDetail": 2,
    "PayeeCustomParameterRecord": 9
};

export const Consumer_Status = {
    ACTIVE: 1,
    ENROLLMENT_PENDING: 2,
    REVOKED: 4,
    DELETED: 8,
    INACTIVE: 16,
    AWAITING_NETWORK_DETAILS: 32,
    AUTHORIZATION_FAILED: 64,
    PAYMENT_PREFERENCE_PENDING: 128,
    DEACTIVATED: 1024,
    PROFILE_CREATION_PENDING: 2048,
    ENROLLED_AS_GUEST: 8192,
    LOCKED: 16384
};

export const CONSUMER_CAMPAIGN_STATUS = {
    EXCEPTION: 1,
    CAMPAIGN_INITIATED: 2,
    CAMPAIGN_COMPLETED: 4,
    CAMPAIGN_NOT_REQUIRED: 8,
    CAMPAIGN_PENDING: 16,
    CAMPAIGN_EXPIRED: 32,
    AUTHORIZATION_FAILED: 64,
    CAMPAIGN_REJECTED: 128,
    CAMPAIGN_APPROVAL_PENDING: 256,
    DEACTIVATED: 1024,
    ENROLLMENT_FAILED: 2048
};

export const csvFileFormat = {
    "DEFAULT": 0,
    "PAYMENT": 1,
    "PAYEE": 2,
    "BOTHPAYEEPAYMENT": 3
};

export const includeFileHeader = {
    "NO": 0,
    "YES": 1
};

export const payeeAttributesGroup = {
    "Vendor ID": "Company Information",
    "Tax ID": "Company Information",
    "DUNS Number": "Company Information",
    "Company Name": "Company Information",
    "Physical Address1": "Company Information",
    "Physical Address2": "Company Information",
    "Physical City": "Company Information",
    "Physical State Region": "Company Information",
    "Physical Zip Postal": "Company Information",
    "Physical Country ISO": "Company Information",
    "Phone": "Company Information",
    "Fax": "Company Information",
    "Website": "Company Information",
    "Currency": "Company Information",
    "Contact First Name": "Contact Information",
    "Contact Last Name": "Contact Information",
    "Contact Full Name": "Contact Information",
    "Contact Title": "Contact Information",
    "Contact Phone": "Contact Information",
    "Contact Email": "Contact Information",
    "Account Owner Name": "Payment Information",
    "Bank Account Number": "Payment Information",
    "ABA Routing Number": "Payment Information",
    "Bank Name": "Payment Information",
    "Virtual Email Address": "Payment Information",
    "Commercial Card Type": "Payment Information",
    "Remittance Email Address": "Payment Information",
    "Supplier Name": "Payment Information",
    "Supplier Email": "Payment Information"
}

export const payeeGroupHeader = ["Company Information", "Contact Information", "Payment Information", "Custom Information"];

export const paymentControlParameter = [
    "Enable Spend Velocity Control",
    "Enable Validity Period Control",
    "Enable Amount Range Control",
    "Enable Transaction Limit Control",
    "Enable Curfew Control",
    "EnableTime Of Day Control",
    "Enable Aging Velocity Control",
    "Enable Geography Control",
    "Enable Merchant ID Control"
];

export const dataTypeToolTipValue = {
    "Numeric": 'N',
    "Boolean": "B",
    "Text": "T",
    "AlphaNumeric": "A",
    "Money": "M",
    "Character": "C",
    "Date": "D"
}

export const statusCode = {
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400
}

export const payeeThemeLength = 9;
export const CONSUMER_CAMPAIGN_STATUSIDS = {
    ALL: 1010,
    WAITINGFORAPPROVAL: 1005,
};
export const USBANK_TRANSACTION_TYPE = "dboctdisbursement";
export const CardType = {
    MSC1: 1,
    MSC2: 2,
    VISA1: 3,
    VISA2: 4
}

export const PayerTypes = {
    PMTX: 1,
    CARDS: 2,
    OTHERS: 3
}

export const GroupLimit = {
    PROGRAMLIMIT: 30,
    MCCGROUPLIMIT: 30
}

export const validForOptions = [
    { id: 1, title: "1M" },
    { id: 2, title: "2M" },
    { id: 3, title: "3M" },
    { id: 4, title: "4M" },
    { id: 5, title: "5M" },
    { id: 6, title: "6M" },
    { id: 7, title: "7M" },
    { id: 8, title: "8M" },
    { id: 9, title: "9M" },
    { id: 10, title: "10M" },
    { id: 11, title: "11M" },
    { id: 12, title: "12M" },
    { id: 13, title: "13M" },
    { id: 14, title: "14M" },
    { id: 15, title: "15M" },
    { id: 16, title: "16M" },
    { id: 17, title: "17M" },
    { id: 18, title: "18M" },
    { id: 19, title: "19M" },
    { id: 20, title: "20M" },
    { id: 21, title: "21M" },
    { id: 22, title: "22M" },
    { id: 23, title: "23M" },
    { id: 24, title: "24M" },
];
export const PaymentCancelStatus = [4];
export const PaymentPendingApproval = [14];
export const USBankPaymentPendingApprovalDetail = [112];
export const USBankPaymentDetailPagePendingApprovalStatus = [5]
export const PaymentDetailPageCancelStatus = [5];
export const PaymentDetailPageModifyStatus = [5, 15]
export const PaymentDisableStatus = [1, 2, 3];
export const MCDefaultTimeZone = 508;
export const VelocityPeriodType = [
    { key: "C", value: "Continous", singleUse: true },
    { key: "D", value: "Daily" },
    { key: "W", value: "Weekly" },
    { key: "M", value: "Monthly" },
    { key: "Q", value: "Quaterly" }
];
export const WeekDays = [
    { key: "monday", value: "Monday" },
    { key: "tuesday", value: "Tuesday" },
    { key: "wednesday", value: "Wednesday" },
    { key: "thursday", value: "Thursday" },
    { key: "friday", value: "Friday" },
    { key: "saturday", value: "Saturday" },
    { key: "sunday", value: "Sunday" }
];
export const TimeControlWeekDays = [
    { key: "MON", value: "Monday" },
    { key: "TUE", value: "Tuesday" },
    { key: "WED", value: "Wednesday" },
    { key: "THU", value: "Thursday" },
    { key: "FRI", value: "Friday" },
    { key: "SAT", value: "Saturday" },
    { key: "SUN", value: "Sunday" }
];
export const emailLimit = 6;
export const MaskedCardNumber = 1213910156781234;
export const payeeLabels = [
    {
        "label": "Enrolled",
        "color": "#B0D2D2"
    },
    {
        "label": "Pending",
        "color": "#BBDEFC"
    },
    {
        "label": "Declined",
        "color": "#F2B9C3"
    }
];

export const PAYEE_AUTHENTICATION_CUSTOM_FIELD_LIMIT = 5;

export const PAYEE_AUTHENTICATION_MIN_ITEM_LIMIT = 3;

export const PAYEE_AUTHENTICATION_PAYEE_ID_FIELD_ID = 1;
export const CardActivityTrailConst = {
    REQUESTRECEIVED: 1,
    EXCEPTION: 2,
    CREATIONREQUEST: 4,
    ACTIVE: 5,
    CREATIONFAILED: 12,
    EXPIRED: 15,
    CANCELLED: 16,
    MODIFIED: 21,
    MODIFIEDUNSUCCESSFULLY: 22,
    CANCELLEDUNSUCCESSFULLY: 23,
    AUTHORIZED: 55,
    PARTIALLYAUTHORIZED: 56,
    POSTED: 57,
    PARTIALLYPOSTED: 58,
    DECLINED: 59
}

export const CCStepperConst = {
    CANCELLED: 'Cancelled',
    EXPIRED: 'Expired',
    CREATIONFAILED: 'Creation Failed',
    EXCEPTION: 'Exception',
    DISAPPROVED: 'Disapproved'
}

export const CCFileType = {
    CREATE: 1,
    MODIFY: 2,
    CANCEL: 3
}

export const FileStatusProcessingId = {
    FileProcessing: 60,
    FileProcessed: 62,
    FileRejected: 33
}

export const USBankReportTypeAccess = {
    DailyEnrollmentReport: 2335,
    DailyStatusReport: 2332,
    RejectedDeliveryReport: 2338,
    SMSOptOutReport: 2341
}

export const PayeeType = {
    Consumer: 1,
    Business: 2
}
export const PayeeTypeName = {
    Consumer: "Consumer",
    Business: "Business"
}

export const USBankDynamicReport = "Dynamic Reports";
