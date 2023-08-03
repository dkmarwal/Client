import React, { useState } from 'react';
import {
  Box,
  Grid,
  Button,
  makeStyles,
  Paper,
  MenuItem,
  Menu,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import PaymentTranxDetails from '~/modules/PaymentTranxDetails';
import { useEffect } from 'react';
import {
  getClientPaymentTransactions,
  getClientPaymentStatus,
  getVCardAliasList,
  cancelCCPayments
} from '~/redux/helpers/clientPaymentTransactions';
import { CustomDialog } from '~/components/Dialogs';
import {
  getPaymentTypelist,
  getStatusTypelist,
} from '~/redux/helpers/clientPaymentTransactions';
import { B2CfetchSelectedTabs } from "~/redux/helpers/settings";
import CustomTable from '~/components/CustomTable';
import Calendar from '~/assets/icons/calendar.svg';
import Filter from '~/assets/icons/filter.svg';
import { connect } from 'react-redux';
import FilterCard from '~/components/FilterCard';
import MyPaymentsFilter from '~/components/MyPaymentsFilter';
import MyPaymentDateFilter from '~/components/MyPaymentDateFilter';
import { SideDialog } from '~/components/Dialogs';
import Notification from '~/components/Notification';
import clsx from 'clsx';
import moment from 'moment';
import ExportAsBtn from '~/components/ExportAsBtn';
import * as XLSX from 'xlsx';
import generatePDF from '~/modules/GeneratePDF/';
import * as FileSaver from 'file-saver';
import { accessRights } from '~/config/accessRights';
import config from '~/config';
import { AlertDialog } from '~/components/Dialogs';
import { withTranslation } from 'react-i18next';
import { entityType, PayerTypes, PaymentCancelStatus } from '~/config/entityTypes';
import B2CPaymentTranxDetails from '~/modules/PaymentTranxDetails/B2C';
import { getFormattedDate } from '~/views/Reports/Report/utils';
import BlockIcon from '@material-ui/icons/Block';
import CancelCCPayment from '~/modules/CancelCCPayment';
import RetryCancelCCPayment from '~/modules/CancelCCPayment/retryCancelCCPayment';
import { CSVLink } from 'react-csv';
import CCPaymentFilter from '~/components/MyPaymentsFilter/CCPaymentFilter';

let _paymentsExportData = [];
const customStyle = makeStyles((theme) => ({
  infoBox: {
    width: '20%',
  },
  toolBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
    borderRadius: '4px 4px 0 0',
  },
  toolLabel: {
    color: '#071B58',
    fontFamily: 'Interstate',
    fontSize: '14px',
    marginLeft: '10px',
  },
  filterCard: {
    display: 'flex',
    flexDirection: 'row',
    padding: '10px 0px',
    flexWrap: 'wrap',
  },
  capitalizeText: {
    textTransform: 'capitalize !important',
  },
  selectedRowBox: {
    boxShadow: 'none',
    borderRadius: '4px 0 0 0',
    color: '#FFF',
    height: '100%',
    padding: '16px 8px'
  },
  rowBox: {
    backgroundColor: '#6094B1',
    borderRadius: 3,
    fontSize: 12
  },
  toolTip: {
    marginLeft: "5px",
    maxWidth: 200,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  }
}));

const PaymentDetails = (props) => {
  const { user, t, location } = props;
  const querySearch = props.location.search;
  let params = new URLSearchParams(querySearch);
  let paramsObj = null;

  params.forEach((value, key) => {
    paramsObj = { ...paramsObj, [key]: value };
  });

  // FSINPAYB2B-13946 - Payment Details page back button functionality
  let pageBackFilters = null, dateBackFilters = null;
  if (location.state && location.state.backFilter && location.state.backFilter.pageFilter) {
    const { pageFilter, dateFilter } = location.state.backFilter;
    if(pageFilter) {
      for (const key in pageFilter) {
        if (pageFilter[key] != null || pageFilter[key] != undefined)
          pageBackFilters = { ...pageBackFilters, [key]: pageFilter[key] };
      }
    }
    if(dateFilter) {
      for (const key in dateFilter) {
        if (dateFilter[key] != null || dateFilter[key] != undefined)
        dateBackFilters = { ...dateBackFilters, [key]: dateFilter[key] };
      }
    } 
  }

  const payerTypeId = user.userData.payerTypeId;
  const defaultDateListOption = 7;
  const dateFilterList = [
    "ALL", "TODAY", "PREVIOUS MONTH", "PREVIOUS QUARTER", "PREVIOUS YEAR", "LAST 7 DAYS", "LAST 30 DAYS", "CUSTOM"
  ];
  const defaultFromDate = moment(
    new Date().setDate(new Date().getDate() - 30)
  ).format('MM/DD/YYYY');
  const defaultToDate = moment(new Date()).format('MM/DD/YYYY');

  const customClasses = customStyle();
  const [clientId, setClientId] = useState();
  const [paymentTypeList, setPaymentTypeList] = useState({});
  const [allPaymentTypeList, setAllPaymentTypeList] = useState('');
  const [statusTypeList, setStatusTypeList] = useState({});
  const [paymentIdDetail, setPaymentIdDetail] = useState([]);
  const [selectedPayeeRemitToId, setSelectedPayeeRemitToId] = useState('');
  const [optedPaymentMethod, setOptedPaymentMethod] = useState();
  const [dataFilterParams, setDataFilterParams] = useState({
    ...paramsObj,
    clientID: user.userData.portalProfileId,
    FromDate: paramsObj ? '' : defaultFromDate,
    ToDate: paramsObj ? '' : defaultToDate,    
    PaymentID: paramsObj && paramsObj.PaymentID ? paramsObj.PaymentID : null,
    DebitAccountID: paramsObj && paramsObj.DebitAccountID ? +paramsObj.DebitAccountID : 0,
    PayeeID: payerTypeId === PayerTypes?.CARDS ? location?.state?.payeeId : undefined,
    vCardUsageTypes: payerTypeId === PayerTypes?.CARDS ? location?.state?.vCardUsageTypes : undefined,
    cardExpirationDays: payerTypeId === PayerTypes?.CARDS ? location?.state?.cardExpirationDays : undefined,
    ...pageBackFilters
  });
  
  const [paymentData, setPaymentData] = useState([]);
  const [selectableData, setSelectableData] = useState([]);
  const [paymentRecordDetail, setPaymentRecordDetail] = useState([]);
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(0);

  const [totalRecords, setTotalRecords] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showMonthFilter, setMonthFilter] = useState(false);
  const [viewCalender, setViewCalender] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Date Filter List
  const [fromDate, setFromDate] = useState(paramsObj ? '' : defaultFromDate);
  const [toDate, setToDate] = useState(paramsObj ? '' : defaultToDate);
  const [dateFilterText, setDateFilterText] = useState(
    dateBackFilters ? dateBackFilters.dateFilterText : paramsObj ? dateFilterList[0] : dateFilterList[defaultDateListOption - 1]
  );
  const [selectedDateFilter, setSelectedDateFilter] = useState(
    dateBackFilters ? dateBackFilters.selectedDateFilter : paramsObj ? 1 : defaultDateListOption
  );
  const [showDownload, setShowDownload] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);
  const [exportDownload, setExportDownload] = useState(false);
  const [fileDownloadMessage, setFileDownloadMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [errorMessage, setErrorMessage] = React.useState('')
  const [selectedBusinessType, setSelectedBusinessType] = React.useState(null);
  const [apiPaymentTypesList, setApiPaymentTypesList] = React.useState([]);
  const [cardType, setCardType] = React.useState({ "MasterCard 2.0": 2, "MasterCard 1.0": 1 });
  const [vCardAliasList, setVCardAliasList] = useState([]);

  const [statusList, setStatusList] = useState({});//To display in info icon
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [successCancelIds, setSuccessCancelIds] = useState([]);
  const [cancelVCARespose, setCancelVCARespose] = useState([]);
  const [isBlukCancel, setIsBulkCancel] = useState(false);
  const [singleCardRow, setSingleCardRow] = useState({});
  const [checkedAll, setCheckedAll] = useState(false);
  const [openCancelCCPaymentModal, setOpenCancelCCPaymentModal] = useState(false);
  const [openRetryCancelCCPaymentModal, setRetryOpenCancelCCPaymentModal] = useState(false);

  const [isDownloading, setDownloading] = useState(false);
  const [valueStartDate, setValueStartDate] = useState(null);
  const [valueEndDate, setValueEndDate] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [applyedFilter, setApplyedFilter] = useState({
    fromDate: dateBackFilters != null ? dateBackFilters.fromDate : paramsObj ? '' : defaultFromDate,
    toDate: dateBackFilters != null ? dateBackFilters.toDate : paramsObj ? '' : defaultToDate,
    selectedDateFilter: dateBackFilters && dateBackFilters.selectedDateFilter ? dateBackFilters.selectedDateFilter : paramsObj ? 1 : defaultDateListOption,
    dateFilterText: dateBackFilters && dateBackFilters.dateFilterText ? dateBackFilters.dateFilterText : 
      paramsObj ? dateFilterList[0] : dateFilterList[defaultDateListOption - 1]
  });

  const csvLink = React.useRef()

  useEffect(() => {
    if (selectedPayment.length > 10) {
      const newSelected = [...selectedPayment];
      setErrorMessage(t('componentData.fileDetails.MaxRecords'));
      setVariant('error');
      setCheckedAll(false);
      newSelected.pop();
      setSelectedPayment(newSelected);
    }
  }, [selectedPayment]);

  useEffect(() => {
    setClientId(user.userData.portalProfileId);
    const isB2C =
      parseInt(user.userData.appType) === entityType.B2C
        ? entityType.B2C
        : null;

    if (isB2C === 2 && !Boolean(optedPaymentMethod)) {
      B2CfetchSelectedTabs(user.userData.portalProfileId).then((response) => {
        if (response.error) {
          return false;
        }
        else {
          if (Boolean(response?.data?.rows2 ?? false)) {
            const list = response.data.rows2.map((e) => {
              return e.b2cDescription
            });
            setOptedPaymentMethod(list || []);
          }
        }
      });
    }

    if (payerTypeId === PayerTypes.CARDS) {
      if (location && location?.state) {     
        if (location?.state?.FromDate && location?.state?.ToDate) {        
          setSelectedDateFilter(8);
          setDateFilterText(dateFilterList[7]);
        }      
      }
    }

    getPaymentTypelist(isB2C).then((response) => {
      if (response && !response.error && response.data) {
        setApiPaymentTypesList(response.data?.rows ?? [])
        const paymentTypeList =
          (response.data &&
            response.data.rows
              .filter(({ paymentCode }) => paymentCode !== 'EFT')
              .reduce((obj, { paymentTypeId, b2cDescription, description, paymentCode }) => {
                if (isB2C) {
                  obj[paymentTypeId] = b2cDescription;
                } else {
                  obj[paymentTypeId] = paymentCode;
                }
                return obj;
              }, {})) ||
          [];
        const allPaymentTypeList = Object.keys(paymentTypeList).reduce(
          (str, key) => {
            if (Boolean(str)) {
              return `${str},${key}`;
            } else {
              return `${key}`;
            }
          },
          ''
        );
        if (
          dataFilterParams &&
          dataFilterParams.PaymentType &&
          dataFilterParams.PaymentType.length
        ) {
          let index = -1;
          Object.keys(paymentTypeList).every((x) => {
            if (paymentTypeList[x] === dataFilterParams.PaymentType) {
              index = x;
              return false;
            }
            return true;
          });
          if (index > 0) {
            const { ...data } = dataFilterParams;
            setDataFilterParams({ ...data, paymentTypeIDs: index });
          }
        }

        if (parseInt(user.userData.appType) === entityType.B2C && Boolean(optedPaymentMethod)) {
          const obj = {};
          Object.keys(paymentTypeList).forEach(function (key) {
            const index = optedPaymentMethod.indexOf(paymentTypeList[key])
            if (index != -1) {
              obj[key] = paymentTypeList[key]
            }
          });
          setPaymentTypeList(obj || []);
        }
        else {
          setPaymentTypeList(paymentTypeList || []);
        }

        setAllPaymentTypeList(allPaymentTypeList);
      }
    });
    getStatusTypelist(isB2C, user.userData.portalProfileId, payerTypeId).then((response) => {
      if (response && !response.error && response.data) {
        const getTileStatusDetails = paymentRecordDetail.find(
          (x) => x.PaymentStatusID === selectedPaymentStatus
        );
        const statusTypeList =
          getTileStatusDetails && getTileStatusDetails.StatusMapping
            ? (
              response.data &&
              response.data.filter((obj) =>
                getTileStatusDetails.StatusMapping.split(',').includes(
                  '' + obj.StatusID
                )
              )
            ).reduce((obj, { StatusID, Description }) => {
              obj[StatusID] = Description;
              return obj;
            }, {}) || []
            : response.data.reduce((obj, { StatusID, Description }) => {
              obj[StatusID] = Description;
              // }
              return obj;
            }, {}) || [];
        setStatusTypeList(statusTypeList || []);
        setStatusList(response.data || []);
      }
    });

    if (payerTypeId === PayerTypes.CARDS) {
      getVCardAliasList().then((response) => {
        if (!response.error) {
          setVCardAliasList(response.data);
        }
      });
    }

    fetchClientPaymentList();
    fetchClientPaymentStatusList(user.userData.portalProfileId);

    //setViewCalender(false);
    //setMonthFilter(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, dataFilterParams, optedPaymentMethod]);

  const changeFilter = (obj) => {
    setPage(1);
    setDataFilterParams({
      ...dataFilterParams,
      ...obj,
    });
    if(payerTypeId === PayerTypes.CARDS) {
      setSelectedPayment([]);
    }
  };

  const fetchClientPaymentList = async () => {
    const {FromDate, ToDate, ...rest} = dataFilterParams;
    const params = {      
      ...rest,
      rowCount: rowsPerPage,
      pageNumber: page,       
      FromDate: applyedFilter?.fromDate ? moment(applyedFilter?.fromDate).format('MM/DD/YYYY') : '',
      ToDate: applyedFilter?.toDate ? moment(applyedFilter?.toDate).format('MM/DD/YYYY') : ''
    };
    if (parseInt(user.userData.appType) === entityType.B2C) {
      params.BusinessType = entityType.B2C;
      params.Client_PaymentID = dataFilterParams.PaymentID || null; //FSINPAYB2B-8841: Change request parameter to Client_PaymentID from PaymentID
      delete params.PaymentID;//Remove PaymentID from request parameter
    }
    setIsLoading(true);
    if (paramsObj && paramsObj.ProcessedStatusFilter && !params.statusIDs) {
      params.statusIDs = paramsObj.ProcessedStatusFilter;
    }
    const response = await getClientPaymentTransactions(params);

    if (response && response.data) {
      setIsLoading(false);
      const { data, error, message } = response.data;
      if (error) {
        setExportDownload(true)
        setVariant("error");
        setFileDownloadMessage(message ? message : t('componentData.reduxData.ErrorOccurred'));
        return false
      }
      if (data && data.lstPaymentDetailsByClientId) {
        const newPaymentRecord = data.lstPaymentDetailsByClientId.map(
          (data) => {
            const {
              PaymentID,
              ReturnStatusID,
              PaymentStatus,
              PaymentStatusInfo,
              PaymentTypeID,
              PaymentType,
              PayeeId,
              RemitToID,
              PayeeName,
              PaymentsRef,
              CurrencyCode,
              Amount,
              ValueDate,
              BusinessType,
              PaymentTypeDesc
            } = data;
            return {
              PaymentID,
              ReturnStatusID,
              PaymentStatus,
              PaymentStatusInfo,
              PaymentTypeID,
              PaymentType,
              PayeeId,
              RemitToID,
              PayeeName,
              PaymentsRef,
              CurrencyCode,
              Amount,
              ValueDate,
              BusinessType,
              PaymentTypeDesc
            };
          }
        );
        setPaymentData(newPaymentRecord);
        setSelectableData(newPaymentRecord.filter((item) => PaymentCancelStatus.includes(item.ReturnStatusID)));
        //Set dates base on min and max value dates 
        setValueStartDate(data?.ValueStartDate || null);
        setValueEndDate(data?.ValueEndDate || null);
        setTotalRecords(data.TotalRecords);
      } else if (error) {
        setErrorMessage(message ?? t('componentData.fileDetails.SomethingWrong'));
        setVariant('error');
      }
    }
  };

  const fetchClientPaymentStatusList = async (clientID) => { 
    const response = await getClientPaymentStatus(clientID, {
      ...(applyedFilter?.fromDate
        ? { FromDate: moment(applyedFilter.fromDate).format('MM/DD/YYYY') }
        : {}),
      ...(applyedFilter?.toDate
        ? { ToDate: moment(applyedFilter.toDate).format('MM/DD/YYYY') }
        : {}),
      ...(parseInt(user.userData.appType) === entityType.B2C
        ? { BusinessType: 2 }
        : {}),
    });
    
    if (response && response.data && response.data.data) {
      setPaymentRecordDetail(response.data.data);
    }
  };

  const onClickPaymentTrxs = (paymentId, payeeRemitToId, businessType) => {
    setSelectedPayeeRemitToId(payeeRemitToId);
    setPaymentIdDetail(paymentId);
    setSelectedBusinessType(businessType);
    props.history.push({
      pathname: `${config.baseName}/payments/paymentDetails/viewDetail`,
      state: {
        paymentId: paymentId,
        appType: businessType,
        clientId: clientId,
        payeeRemitToId: payeeRemitToId,
        filters: {pageFilter : dataFilterParams, dateFilter: applyedFilter},
        queryParams: location.search ? location.search: ''
      },
    })
  };

  const handleChangePage = (e, page) => {
    setSelectedPayment([]);
    setCheckedAll(false);
    setPaymentData([]);
    setPage(page + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setPaymentData([]);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const updateFilter = (obj) => {
    const newObj = dataFilterParams;
    newObj['FromDate'] = obj['FromDate'];
    newObj['ToDate'] = obj['ToDate'];
    newObj['statusIDs'] = obj['statusIDs'];
    setDataFilterParams({
      ...newObj,
    });
  };

  const updateCCFilter = (obj) => {
    setPage(1);
    setSelectedPayment([]); // clear selected payment for cancel - FSINPAYB2B-13921
    setDataFilterParams({
      ...dataFilterParams,
      ...obj,
      FileID: obj['FileID'] || 0,
      PaymentID: obj['PaymentID'] || '',
      VCardAlias: obj['VCardAlias'] || '',
      vCardUsageTypes: obj['vCardUsageTypes'] || null,
      cardExpirationDays: obj['cardExpirationDays'] || 0
    });
    setMonthFilter(false);
  }

  const updateMonthFilter = (obj) => {
    setPage(1);
    setDataFilterParams({
      ...dataFilterParams,
      ...obj,
      RemitToID: obj['RemitToID'] || '',
      FileID: obj['FileID'] || 0,
      invoiceNumber: obj['invoiceNumber'] || '',
      invoiceAmount: obj['invoiceAmount'] || '',
      PaymentID: obj['PaymentID'] || '',
      CardTypeID: obj['CardTypeID'] || 0
    });

    setMonthFilter(false);
  };

  const onUpdateDateFilter = () => {
    const _fromDate = fromDate ? moment(fromDate).format('MM/DD/YYYY') : '';
    const _toDate = toDate ? moment(toDate).format('MM/DD/YYYY') : '';
    if (selectedDateFilter === 8) {
      if (isValidDate(_fromDate) && isValidDate(_toDate) && (getFormattedDate(_fromDate) <= getFormattedDate(_toDate))) {
        setPage(1);
        updateFilter({
          FromDate: fromDate ? moment(fromDate).format('MM/DD/YYYY') : '',
          ToDate: toDate ? moment(toDate).format('MM/DD/YYYY') : '',
          statusIDs: dataFilterParams['statusIDs'],
        });
        setApplyedFilter({
          ...applyedFilter,
          fromDate,
          toDate,
          selectedDateFilter,
          dateFilterText
        })
        setViewCalender(false);
      }
    } else {
      setPage(1);
      updateFilter({
        FromDate: fromDate ? moment(fromDate).format('MM/DD/YYYY') : '',
        ToDate: toDate ? moment(toDate).format('MM/DD/YYYY') : '',
        statusIDs: dataFilterParams['statusIDs'],
      });
      setApplyedFilter({
        ...applyedFilter,
        fromDate,
        toDate,
        selectedDateFilter,
        dateFilterText
      })
      setViewCalender(false);
    }
  };

  const onDateFilterChange = (index, fromDate, toDate) => {
    if (!index) {
      index = defaultDateListOption;
      fromDate = defaultFromDate;
      toDate = defaultToDate;
      updateFilter({
        FromDate: fromDate ? moment(fromDate).format('MM/DD/YYYY') : '',
        ToDate: toDate ? moment(toDate).format('MM/DD/YYYY') : '',
        statusIDs: dataFilterParams['statusIDs']
      });
      // FSINPAYB2B-13946 - Delete date filter from location
      if(location.state && location.state.backFilter && location.state.backFilter.dateFilter) {
        let stateCopy = { ...location.state };
        delete stateCopy.backFilter.dateFilter;
        setApplyedFilter({
          fromDate: paramsObj ? '' : defaultFromDate,
          toDate: paramsObj ? '' : defaultToDate,
          selectedDateFilter: paramsObj ? 1 : defaultDateListOption,
          dateFilterText: paramsObj ? dateFilterList[0] : dateFilterList[defaultDateListOption - 1]
        })
        props.history.replace({ state: stateCopy });
      }
    }
    setDateFilterText(dateFilterList[index - 1]);
    setSelectedDateFilter(index);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const resetUpdateFilter = (obj) => {    
    setSelectedPaymentStatus(0);
    setSelectedPayment([]);    
    setDataFilterParams({
      ...dataFilterParams,
      ...obj      
    });
    resetFileFilters(props);
  };

  const onResetDateFilter = (index = defaultDateListOption, fromDate = defaultFromDate, toDate = defaultToDate) => {
    updateFilter({
      FromDate: fromDate ? moment(fromDate).format('MM/DD/YYYY') : '',
      ToDate: toDate ? moment(toDate).format('MM/DD/YYYY') : '',
    });
    setDateFilterText(dateFilterList[index - 1]);
    setSelectedDateFilter(index);
    setFromDate(fromDate);
    setToDate(toDate);
  };

  const onSelectPaymentGroup = (paymentStatusId, statusMapping) => {
    updateFilter({
      statusIDs: '',
      FromDate: fromDate ? moment(fromDate).format('MM/DD/YYYY') : '',
      ToDate: toDate ? moment(toDate).format('MM/DD/YYYY') : '',
    });
    setSelectedPaymentStatus(paymentStatusId);
    setDataFilterParams({
      ...dataFilterParams,
      statusIDs: statusMapping,
    });
    setRowsPerPage(10);
    setPage(1);
  };

  const isValidDate = (dateString) => {
    let valid = true;
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      valid = false;
    }
    return valid;
  };

  const getExportData = (count) => {
    const params = {
      ...dataFilterParams,
      rowCount: count,
      pageNumber: 1,
    };
    if (paramsObj && paramsObj.ProcessedStatusFilter && !params.statusIDs) {
      params.statusIDs = paramsObj.ProcessedStatusFilter;
    }
    if (parseInt(user.userData.appType) === entityType.B2C) {
      params.BusinessType = entityType.B2C;
      params.Client_PaymentID = dataFilterParams.PaymentID || null; //FSINPAYB2B-8841: Change request parameter to Client_PaymentID from PaymentID
      delete params.PaymentID;//Remove PaymentID from request parameter
    }
    return getClientPaymentTransactions({ ...params, IsDownload: 1 });
  };
  const formatColumn = (worksheet, col, fmt) => {
    const range = XLSX.utils.decode_range(worksheet['!ref'])
    // note: range.s.r + 1 skips the header row
    for (let row = range.s.r + 1; row <= range.e.r; ++row) {
      const ref = XLSX.utils.encode_cell({ r: row, c: col })
      if (worksheet[ref] && worksheet[ref].t === 'n') {
        worksheet[ref].z = fmt;
      }
    }
    return worksheet;
  }
  const handleDownloadCSV = async () => {
    _paymentsExportData = [];
    setShowDownload(false);

    if (totalRecords < 1) {
      setVariant('error');
      setDownloading(false);
      setErrorMessage(t('componentData.paymentDetailss.noDataToDownload'));
      return false;
    }

    if (totalRecords > 100000) {
      setExportDialog(true);
      return false;
    }
    setVariant('success');
    setExportDownload(true);
    setDownloading(true);
    setFileDownloadMessage(t('componentData.paymentDetailss.downloadMsg'));
    getExportData(totalRecords).then((response) => {
      if (response && response.data) {
        const { data, error } = response.data;
        if (data) {
          setVariant('success');
          _paymentsExportData = data;
          const fileType =
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

          const date = new Date().toLocaleString(props.i18n.language, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace(/[^ -~]/g, "").split(' ');
          let dateStr = date[0] + date[1] + date[2] + date[3];
          var regex = /[.,\s]/g;
          dateStr = dateStr.replace(regex, '');
          const fileName = `${t('componentData.fileName.payment')}_${t('componentData.fileName.list')}_${dateStr}.xlsx`;

          setShowDownload(false);
          if (_paymentsExportData.length > 0) {
            const tableRows = [];
            // for each account pass all its data into an array
            _paymentsExportData.forEach((field) => {
              const data = {};
              data[t('componentData.paymentDetailss.PaymentReference')] =
                field.PaymentReference;
              data[t('componentData.paymentDetailss.PayeeID')] =
                field.PayeeId;
              data[t('componentData.paymentDetailss.PayeeName')] =
                field.PayeeName;
              data[t('componentData.paymentDetailss.ValueDate')] =
                field.ValueDate;
              data.Status = field.PaymentStatus;
              data[t('componentData.paymentDetailss.PaymentAmount')] =
                Number(field.Amount.replace(/[$,]+/g, ""));
              data[t('componentData.paymentDetailss.Currency')] =
                field.CurrencyCode;
              data[t('componentData.paymentDetailss.PaymentType')] =
                field.PaymentType;

              //push each data info into a row
              tableRows.push(data);
            });
            const payeeTitle = t('componentData.paymentDetailss.PaymentList');
            const ws = XLSX.utils.json_to_sheet(tableRows);
            //Converting amount column
            const currency = '$#,##0.00';
            const newWs = formatColumn(ws, 5, currency);
            const wb = {
              Sheets: {},
              SheetNames: [payeeTitle],
            };
            wb.Sheets[payeeTitle] = newWs;

            const excelBuffer = XLSX.write(wb, {
              bookType: 'xlsx',
              type: 'array',
            });
            const data = new Blob([excelBuffer], { type: fileType });
            FileSaver.saveAs(data, fileName);
            setAnchorEl(null);
            setDownloading(false);
          } else {
            setVariant('error');
            setDownloading(false);
            setFileDownloadMessage(
              t('componentData.paymentDetailss.noDataToDownload')
            );
          }
        } else if (error) {
          setVariant('error');
          setDownloading(false);
          setFileDownloadMessage(t('componentData.paymentDetailss.noDataToDownload')
          );
          setAnchorEl(null)
        }
      }
    });
  };

  const handleDownloadPDF = async () => {
    _paymentsExportData = [];
    setShowDownload(false);

    if (totalRecords < 1) {
      setVariant('error');
      setDownloading(false);
      setErrorMessage(t('componentData.paymentDetailss.noDataToDownload'));
      return false;
    }

    if (totalRecords > 100000) {
      setExportDialog(true);
      return false;
    }
    //}
    setVariant('success');
    setExportDownload(true);
    setDownloading(true);
    setFileDownloadMessage(t('componentData.paymentDetailss.downloadMsg'));
    getExportData(totalRecords).then((response) => {
      if (response && response.data) {
        const { data, error } = response.data;
        if (data) {
          setVariant('success');
          _paymentsExportData = data;

          setShowDownload(false);
          if (_paymentsExportData.length > 0) {

            const tableColumn = [
              t('componentData.paymentDetailss.PaymentReference'),
              t('componentData.paymentDetailss.PayeeID'),
              t('componentData.paymentDetailss.PayeeName'),
              t('componentData.paymentDetailss.ValueDate'),
              t('componentData.paymentDetailss.Status'),
              t('componentData.paymentDetailss.PaymentAmount'),
              t('componentData.paymentDetailss.Currency'),
              t('componentData.paymentDetailss.PaymentType'),
            ];
            // define an empty array of rows
            const tableRows = [];
            // for each account pass all its data into an array
            _paymentsExportData.forEach((field) => {
              const data = [
                field.PaymentReference,
                field.PayeeId,
                field.PayeeName,
                field.ValueDate,
                field.PaymentStatus,
                field.Amount,
                field.CurrencyCode,
                field.PaymentType,
              ];
              //push each data info into a row
              tableRows.push(data);
            });
            const title = t('componentData.paymentDetailss.PaymentList')

            const date = new Date().toLocaleString(props.i18n.language, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace(/[^ -~]/g, "").split(' ');
            let dateStr = date[0] + date[1] + date[2] + date[3];
            var regex = /[.,\s]/g;
            dateStr = dateStr.replace(regex, '');
            const fileName = `${t('componentData.fileName.payment')}_${t('componentData.fileName.list')}_${dateStr}.pdf`;

            generatePDF(title, fileName, tableColumn, tableRows);
          } else {
            setVariant('error');
            setDownloading(false);
            setFileDownloadMessage(
              t('componentData.paymentDetailss.noDataToDownload')
            );
          }
          setAnchorEl(null);
          setDownloading(false);
        } else if (error) {
          setVariant('error');
          setDownloading(false);
          setFileDownloadMessage(t('componentData.paymentDetailss.noDataToDownload'))
          setAnchorEl(null)
        }
      }
    });
  };
  const getCSVData = async () => {
    _paymentsExportData = [];
    setShowDownload(false);
    setCsvData("")

    if (totalRecords < 1) {
      setVariant('error');
      setDownloading(false);
      setErrorMessage(t('componentData.paymentDetailss.noDataToDownload'));
      return false;
    }

    if (totalRecords > 100000) {
      setExportDialog(true);
      return false;
    }
    setVariant('success');
    setExportDownload(true);
    setDownloading(true);
    setFileDownloadMessage(t('componentData.paymentDetailss.downloadMsg'));
    getExportData(totalRecords).then((response) => {
      if (response && response.data) {
        const { data, error } = response.data;
        if (data) {
          setVariant('success');
          setDownloading(false);
          setCsvData(data)
          csvLink.current.link.click()
        } else if (error) {
          setVariant('error');
          setDownloading(false);
          setFileDownloadMessage(t('componentData.paymentDetailss.noDataToDownload')
          );
          setAnchorEl(null)
        }
      }
    });
  };
  const renderDownloadOptions = (showDownload) => {
    const isB2B = parseInt(user.userData.appType) === entityType.B2B
      ? entityType.B2B
      : null;
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={showDownload}
        onClose={() => {
          setAnchorEl(null);
          setShowDownload(false);
        }}
      >
        <MenuItem onClick={() => getCSVData()} >
          .CSV
        </MenuItem>
        <MenuItem onClick={() => handleDownloadCSV()}>.XLSX</MenuItem>
        {isB2B === 1 && < MenuItem onClick={() => handleDownloadPDF()}>.PDF</MenuItem>}
      </Menu >
    );
  };

  const resetFileFilters = (props) => {    
    setDataFilterParams({
      clientID: user.userData.portalProfileId,
      FromDate: paramsObj ? '' : defaultFromDate,
      ToDate: paramsObj ? '' : defaultToDate,
      PaymentID: null,
      DebitAccountID: paramsObj && paramsObj.DebitAccountID ? +paramsObj.DebitAccountID : 0,
      FileID: undefined,
      ProcessedStatusFilter: undefined,
      paymentTypeIDs: undefined,
      statusIDs: undefined,
    });
    setSelectedPaymentStatus(0);
    props.history.push(`${config.baseName}/payments/paymentDetails`);
  };

  const isFileResetDisabled = (props) => {
    const search = window.location.search;
    return String(search).trim().length === 0;
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = paymentData.length ?
        paymentData.filter(a => PaymentCancelStatus.includes(a.ReturnStatusID)).map(x => x.PaymentID) : [];
      setSelectedPayment(newSelecteds);
      setCheckedAll(true);
    } else {
      setSelectedPayment([]);
      setCheckedAll(false);
    }
  }

  const handleRowItemClick = (e, row) => {
    let newSelected = [...selectedPayment];

    if (e.target.checked) {
      newSelected = [...newSelected, row.PaymentID];
    } else {
      newSelected = newSelected.filter(item => item !== row.PaymentID);
    }
    setSelectedPayment(newSelected);
    setCheckedAll(newSelected && newSelected.length < paymentData.length ? false : true);
  }

  const handleCancelCCPayments = async (reason) => {
    const payload = {
      clientID: clientId,
      paymentIDs: singleCardRow.PaymentID ? [singleCardRow.PaymentID] : [...selectedPayment],
      // paymentIDs: [12, 4],
      cancelledReason: reason,
      cancelledBy: user && user.userData && user.userData.userName || ''
    }

    setCancelLoading(true);
    const res = await cancelCCPayments(payload);

    if (res?.result?.vcaResponse && res?.result?.vcaResponse.length && res?.result?.vcaResponse[0]?.errors?.errorCode != "500") {
      const successIds = [], errorVCARespose = [];
      let newSelected = [...selectedPayment];

      if (isBlukCancel) {
        res.result.vcaResponse.forEach(item => {
          if (item.status == 'COMPLETED') {
            successIds.push(item.paymentID);
            newSelected = newSelected.filter(x => x !== item.paymentID);
          }
          else {
            errorVCARespose.push(item);
          }
        })
        setSelectedPayment(newSelected);
        if (newSelected.length == 0) {
          setErrorMessage(t('componentData.CCPaymentTransaction.msg12'));
          setVariant('success');
          toggleModal();
        } else {
          setSuccessCancelIds(successIds);
          setCancelVCARespose(errorVCARespose);
          toggleModal();
          openRetryModal();
        }
      }
      else {
        res.result.vcaResponse.forEach(item => {
          if (item.status == 'COMPLETED') {
            setErrorMessage(t('componentData.CCPaymentTransaction.msg11'));
            setVariant('success');
            setSelectedPayment([]);
            toggleModal();
          }
          else {
            errorVCARespose.push(item);
            setCancelVCARespose(errorVCARespose);
            toggleModal(singleCardRow);
            openRetryModal();
          }
        })
      }
      fetchClientPaymentList();
    }
    else {
      setErrorMessage(t('componentData.CCPaymentControlValidation.customMsg'));
      setVariant('error');
      toggleModal();
    }
    setCancelLoading(false);
  }

  const toggleModal = (row) => {
    const isSingleCard = row ? row : singleCardRow ? singleCardRow : '';
    if (isSingleCard.PaymentID) {
      setIsBulkCancel(false);
      setSingleCardRow(isSingleCard);
    }
    else {
      setIsBulkCancel(true);
      setSingleCardRow({});
    }
    setRetryOpenCancelCCPaymentModal(false);
    setOpenCancelCCPaymentModal(!openCancelCCPaymentModal);
  }

  const openRetryModal = () => {
    setRetryOpenCancelCCPaymentModal(!openRetryCancelCCPaymentModal);
  }

  const removeSelectedPayment = (id) => {
    const arr = selectedPayment.length ? selectedPayment.filter(item => item !== id) : [];
    setSelectedPayment(arr);
  }

  const closeFilterBox=()=>{
    setDateFilterText(applyedFilter.dateFilterText);
    setSelectedDateFilter(applyedFilter.selectedDateFilter);
    setFromDate(applyedFilter.fromDate);
    setToDate(applyedFilter.toDate);
    setViewCalender(false);
  }

  const isPaymentRemmitanceDownloadEnabled =
    (user.userRoles &&
      user.userRoles.includes(accessRights['PAYMENTS_REMITTANCES_DOWNLOAD'])) ||
    false;

  const isPaymentRemmitanceCancelEnabled =
    (user.userRoles &&
      user.userRoles.includes(accessRights['PAYMENTS_REMITTANCES_CANCEL'])) ||
    false;

  const date = new Date().toLocaleString(props.i18n.language, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace(/[^ -~]/g, "").split(' ');
  let dateStr = date[0] + date[1] + date[2] + date[3];
  var regex = /[.,\s]/g;
  dateStr = dateStr.replace(regex, '');
  const csvHeaders = [{ label: t('componentData.paymentDetailss.PaymentReference'), key: "PaymentReference" }, { label: t('componentData.paymentDetailss.PayeeID'), key: "PayeeId" }, { label: t('componentData.paymentDetailss.PayeeName'), key: "PayeeName" },
  { label: t('componentData.paymentDetailss.ValueDate'), key: "ValueDate" }, { label: t('componentData.paymentDetailss.Status'), key: "PaymentStatus" }, { label: t('componentData.paymentDetailss.PaymentAmount'), key: "Amount" }, { label: t('componentData.paymentDetailss.Currency'), key: "CurrencyCode" },
  { label: t('componentData.paymentDetailss.PaymentType'), key: "PaymentType" }];
  return (
    <>
      <CSVLink
        data={csvData}
        headers={csvHeaders}
        filename={`${t('componentData.fileName.payment')}_${t('componentData.fileName.list')}_${dateStr}.csv`}
        className='hidden'
        ref={csvLink}
        target='_blank'
      />
      <Backdrop className={customClasses.backdrop} open={isDownloading || false} >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box mx={6} my={3}>
        <Grid container direction="column">
          <Grid item className={customClasses.toolBox}>
            <Box mb={2}>
              <Button onClick={() => setViewCalender(true)}>
                <img
                  src={Calendar}
                  alt={t('componentData.paymentDetailss.Setting')}
                />
                <span
                  className={clsx(
                    customClasses.toolLabel,
                    customClasses.capitalizeText
                  )}
                >
                  {t('componentData.paymentDetailss.Viewing')}&nbsp;
                  {t(`componentData.paymentDetailss.${dateFilterText}`).toLowerCase()}
                </span>
              </Button>
            </Box>
          </Grid>
          <Grid
            item
            container
            className={customClasses.filterCard}
            direction="row"
            spacing={3}
          >
            {Array.isArray(paymentRecordDetail) &&
              paymentRecordDetail.map((record) => (
                <Grid item className={customClasses.infoBox}>
                  <FilterCard
                    record={record}
                    selected={record.PaymentStatusID === selectedPaymentStatus}
                    onSelectPaymentGroup={onSelectPaymentGroup}
                  />
                </Grid>
              ))}
          </Grid>
          <Grid container>
            <Grid item xs={3}>
              <Paper className={customClasses.selectedRowBox}>
                {selectedPayment.length > 0 ?
                  <Box component={"span"} p={0.8} m={1} className={customClasses.rowBox}>
                    {selectedPayment.length} {t('componentData.CCPaymentTransaction.rowSelected')}
                  </Box> : null}
              </Paper>
            </Grid>
            <Grid item xs={9}>
              <Paper className={customClasses.toolBox} elevation={0}>
                {isPaymentRemmitanceDownloadEnabled && (
                  <Box p={1}>
                    <ExportAsBtn
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                        setShowDownload(true);
                      }}
                      btnName={t('componentData.paymentDetailss.ExportAs')}
                    />
                    {showDownload && renderDownloadOptions(showDownload)}
                  </Box>
                )}
                <Box m={1}>
                  <Button
                    color="primary"
                    style={{ fontSize: 14 }}
                    disabled={isFileResetDisabled(props) ? true : false}
                    onClick={() => resetFileFilters(props)}
                  >
                    <span className={clsx(customClasses.capitalizeText)}>
                      {t('componentData.paymentDetailss.ResetFileFilters')}
                    </span>
                  </Button>
                </Box>
                <Box m={1}>
                  <Button onClick={() => setMonthFilter(true)}>
                    <span
                      className={clsx(
                        customClasses.toolLabel,
                        customClasses.capitalizeText
                      )}
                    >
                      <img
                        src={Filter}
                        alt={t('componentData.paymentDetailss.Setting')}
                      />
                      <span
                        className={clsx(
                          customClasses.toolLabel,
                          customClasses.capitalizeText
                        )}
                      >
                        {t('componentData.paymentDetailss.MoreFilters')}
                      </span>
                    </span>
                  </Button>
                </Box>
                {payerTypeId == PayerTypes.CARDS && isPaymentRemmitanceCancelEnabled ?
                  <Box m={1}>
                    <Button onClick={toggleModal} style={{ fontSize: 14 }}
                      disabled={selectedPayment.length === 0}
                    >
                      <BlockIcon style={{ marginRight: 5 }} fontSize='small' />
                      <span className={customClasses.capitalizeText}>
                        {t('componentData.CCPaymentTransaction.cancelCard')}
                      </span>
                    </Button>
                  </Box> : null
                }
              </Paper>
            </Grid>
          </Grid>
          <Grid style={{ cursor: 'pointer', width: "100%" }}>
            <CustomTable
              isLoading={isLoading}
              elevation={0}
              rows={paymentData}
              selectableData={selectableData}
              rowsPerPage={rowsPerPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              page={page - 1}
              onClickRow={onClickPaymentTrxs}
              handleChangePage={handleChangePage}
              changeFilter={changeFilter}
              statusTypeList={statusTypeList}
              paymentTypeList={paymentTypeList}
              allPaymentType={allPaymentTypeList}
              totalRecords={totalRecords}
              dataFilterParams={dataFilterParams}
              apiPaymentTypesList={apiPaymentTypesList}
              statusList={statusList}
              businessType={user?.userData?.appType ? parseInt(user.userData.appType) : entityType.B2B}
              handleSelectAllClick={handleSelectAllClick}
              handleRowItemClick={handleRowItemClick}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              checkedAll={checkedAll}
              payerTypeId={payerTypeId}
              onMenuCancelClick={toggleModal}
              isPaymentRemmitanceCancelEnabled={isPaymentRemmitanceCancelEnabled}
            />
          </Grid>
          {showPaymentDetails && (
            <CustomDialog
              showButton={false}
              alignSide={false}
              width="80%"
              onConfirm={() => {
                setSelectedBusinessType(null)
                setShowPaymentDetails(false);
              }}
              title={t('componentData.paymentDetailss.PaymentDetailsTxt')}
            >
              <Box>
                {!selectedBusinessType || (entityType.B2B === parseInt(selectedBusinessType)) ? (
                  <PaymentTranxDetails
                    clientId={clientId}
                    paymentId={paymentIdDetail}
                    claims={user.userRoles}
                    selectedPayeeRemitToId={selectedPayeeRemitToId}
                    {...props}
                    userData={user.userData}
                    businessType={selectedBusinessType || entityType.B2B}
                  />
                ) : (
                  <B2CPaymentTranxDetails
                    clientId={clientId}
                    paymentId={paymentIdDetail}
                    claims={user.userRoles}
                    selectedPayeeRemitToId={selectedPayeeRemitToId}
                    {...props}
                    userData={user.userData}
                    businessType={selectedBusinessType || entityType.B2C}
                  />
                )}
              </Box>
            </CustomDialog>
          )}
          {showMonthFilter && (
            <SideDialog
              showButton={false}
              alignSide={true}
              icon="filter"
              onConfirm={() => {
                setMonthFilter(false);
              }}
              title={t('componentData.paymentDetailss.MoreFilters')}
            >
              {
                payerTypeId != PayerTypes.CARDS ?
                  <MyPaymentsFilter
                    updateFilter={updateMonthFilter}
                    paymentTypeList={paymentTypeList}
                    cardTypeList={cardType}
                    allPaymentType={allPaymentTypeList}
                    dataFilterParams={dataFilterParams}
                    resetUpdateFilter={resetUpdateFilter}
                    userData={user.userData}
                    apiPaymentTypesList={apiPaymentTypesList}
                    payerTypeId={payerTypeId}
                  />
                  :
                  <CCPaymentFilter
                    vCardAliasList={vCardAliasList}
                    dataFilterParams={dataFilterParams}
                    updateCCFilter={updateCCFilter}
                    resetUpdateFilter={resetUpdateFilter}
                  />
              }
            </SideDialog>
          )}
          {viewCalender && (
            <SideDialog
              showButton={false}
              alignSide={true}
              icon="calendar"
              onConfirm={() => closeFilterBox()}
              title={t('componentData.paymentDetailss.DateFilter')}
            // className={classes.notifySidePanel}
            >
              <Box>
                <MyPaymentDateFilter
                  updateFilter={onUpdateDateFilter}
                  fromDate={viewCalender ? fromDate : applyedFilter.fromDate}
                  toDate={viewCalender ? toDate : applyedFilter.toDate}
                  selectedDateFilter={viewCalender ? selectedDateFilter : applyedFilter.selectedDateFilter}
                  dateFilterList={dateFilterList}
                  onDateFilterChange={onDateFilterChange}
                  onResetDateFilter={onResetDateFilter}
                />
              </Box>
            </SideDialog>
          )}
        </Grid>
        {exportDialog && (
          <AlertDialog
            title=""
            message={t('componentData.paymentDetailss.dataLimit')}
            onConfirm={() => setExportDialog(false)}
          />
        )}
        {exportDownload && (
          <Notification
            variant={variant}
            message={fileDownloadMessage || ""}
            handleClose={() => setExportDownload(false)}
          />
        )}
        {errorMessage && (
          <Notification
            variant={variant}
            message={errorMessage || ""}
            handleClose={() => setErrorMessage('')}
          />
        )}
        <CancelCCPayment
          openCancelCCPaymentModal={openCancelCCPaymentModal}
          selectedPayment={selectedPayment}
          bulkCancel={isBlukCancel}
          paymentData={paymentData}
          openCancelCCModalChange={toggleModal}
          onCancelCCPayment={handleCancelCCPayments}
          singleCardRow={singleCardRow}
          loading={cancelLoading}
          removeSelectedPayment={removeSelectedPayment}
        />

        <RetryCancelCCPayment
          openRetryCancelCCPaymentModal={openRetryCancelCCPaymentModal}
          selectedPayment={selectedPayment}
          paymentData={paymentData}
          openCancelCCModalChange={openRetryModal}
          onCancelCCPayment={handleCancelCCPayments}
          successCancelIds={successCancelIds}
          openAgainCancelModal={toggleModal}
          cancelVCAResponse={cancelVCARespose}
          bulkCancel={isBlukCancel}
          isDetailPage={false}
        />
      </Box>
    </>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(PaymentDetails)
);
