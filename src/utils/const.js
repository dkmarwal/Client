export const IsCancellableConst = {
  Yes: 'Y',
  No: 'N',
};

export const CancelReasonId = 5;

export const ProcessingFailureReasonStatusId = [1021, 200, 1000]; // [ProcessingFailed, ProcessedWithExceptions,Processed]

export const paymentStatusMapping = {
  Cancelled: 27,
  Exception: 22,
};
export const USbankpaymentStatusMapping = {
  Cancelled: 74,
  Exception: 57,
};

export const approveFileStatusList = [1005];
export const rejectFileStatusList = [1005];

export const RemittanceParameters = [
  {
    label: 'Payment ID',
    key: 'isPaymentId',
    selected: true,
  },
  {
    label: 'Payment Type',
    key: 'isPaymentType',
    selected: true,
  },
  {
    label: 'Client ID',
    key: 'isClientId',
    selected: true,
  },
  {
    label: 'Amount',
    key: 'isAmount',
    selected: true,
  },
  {
    label: 'Invoice Date',
    key: 'isInvoiceDate',
    selected: true,
  },
  {
    label: 'Invoice Number',
    key: 'isInvoiceNo',
    selected: true,
  },
  {
    label: 'Payment Reference',
    key: 'isPaymentReference',
    selected: true,
  },
  {
    label: 'Invoice Gross Amount',
    key: 'isInvoiceGrossAmount',
    selected: true,
  },
  {
    label: 'Value Date',
    key: 'isValueDate',
    selected: true,
  },
  {
    label: 'Amount Paid',
    key: 'isAmountPaid',
    selected: true,
  },
  {
    label: 'Discount Amount',
    key: 'isDiscountAmount',
    selected: true,
  },
  {
    label: 'Purchase Order',
    key: 'isPurchaseOrder',
    selected: true,
  },
  {
    label: 'Adjustment Amount',
    key: 'isAdjustmentAmount',
    selected: true,
  },
  {
    label: 'Adjustment Code',
    key: 'isAdjustmentCode',
    selected: true,
  },
  {
    label: 'Client Name',
    key: 'isClientName',
    selected: true,
  },
  {
    label: 'Remit to ID',
    key: 'isRemitToId',
    selected: true,
  },
  {
    label: 'Payee Name',
    key: 'isPayeeName',
    selected: true,
  },
  {
    label: 'ACH Company Name',
    key: 'isAchCompanyName',
    selected: true,
  },
  {
    label: 'Currency Code',
    key: 'isCurrencyCode',
    selected: true,
  },
];
export const CCRemittanceParameters = [
  {
    label: 'Amount',
    key: 'isAmount',
    selected: true,
  },
  {
    label: 'Invoice Date',
    key: 'isInvoiceDate',
    selected: true,
  },
  {
    label: 'Invoice Number',
    key: 'isInvoiceNo',
    selected: true,
  },
  {
    label: 'Purchase Order',
    key: 'isPurchaseOrder',
    selected: true,
  },
  {
    label: 'Currency Code',
    key: 'isCurrencyCode',
    selected: true,
  },
];
export const B2CRemittanceParameters = [
  {
    label: 'Payment ID',
    key: 'isPaymentId',
    selected: true,
  },
  {
    label: 'Payment Type',
    key: 'isPaymentType',
    selected: true,
  },
  {
    label: 'Amount',
    key: 'isAmount',
    selected: true,
  },
  {
    label: 'Payment Date',
    key: 'isPaymentDate',
    selected: true,
  },
  {
    label: 'Payment Reference',
    key: 'isPaymentReference',
    selected: true,
  },
  {
    label: 'Payee Name',
    key: 'isPayeeName',
    selected: true,
  },
  {
    label: 'Client Name',
    key: 'isClientName',
    selected: true,
  },
  {
    label: 'Value Date',
    key: 'isValueDate',
    selected: true,
  },
  {
    label: 'Notes',
    key: 'isNotes',
    selected: true,
  },
  {
    label: 'Client Phone Number',
    key: 'isClientPhoneNumber',
    selected: true,
  },
  {
    label: 'Client Email Address',
    key: 'isClientEmailAddress',
    selected: true,
  },
];

export const PaymentDescriptionToId =
{
  Check: 1,
  ACH: 2,
  PayPal: 16,
  PushToCard: 32,
  Zelle: 64,
  DepositToDebitCard:256,
  RTP:128,
  PrepaidFocusNonPayroll:2048,
  PrepaidReliaCard:4096,
  PlasticCorporateCard:8192,
  DigitalCorporateCard:16384
};