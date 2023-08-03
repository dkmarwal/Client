import React, { Component } from 'react';
import {
  Grid,
  Box,
  Paper,
  CircularProgress,
  Typography,
  withStyles,
  Menu,
  MenuItem,
  Button,
} from '@material-ui/core';
import { ThreeDots } from 'react-loader-spinner';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import Checkbox from '@material-ui/core/Checkbox';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import AutorenewIcon from '@material-ui/icons/Autorenew';

import Notification from '~/components/Notification';
import ChipFilter from '~/components/Filter';
import config from '~/config';
import { connect } from 'react-redux';
import { CustomDialog } from '~/components/Dialogs';
import ImportFileUpload from '~/modules/FileDetails/ImportFileUpload';
import PaymentFileFilters from '~/modules/PaymentFileFilters';
import FileProcessStatus from '~/modules/FileProcessStatus';
import * as XLSX from 'xlsx';
import generatePDF from '~/modules/GeneratePDF/';
import * as FileSaver from 'file-saver';
import LightBlueBtn from '~/components/LightBlueBtn';
import ExportAsBtn from '~/components/ExportAsBtn';
import { withTranslation } from 'react-i18next';

import {
  fetchFileList,
  fetchFileStatus,
  updatePaymentFileAction,
  fetchFileFigureStatus,
  fetchActionTypeList,
} from '~/redux/helpers/files';
import { styles } from './styles';
import { accessRights } from '~/config/accessRights';
import {
  entityType,
  PayerTypes,
  FileStatusProcessingId,
} from '~/config/entityTypes';
import RefreshIcon from '@material-ui/icons/Refresh';

const statuses = [
  'Waiting for Approval',
  'Requires Attention',
  'Nécessite une attention',
  'En attente d approbation',
  'A la espera de la aprobación',
  'Requiere atención',
];

class ImportPaymentFiles extends Component {
  state = {
    openDialogue: false,
    selectedIds: [],
    selectedData: [],
    filterQuery: {},
    isLoading: true,
    selectedTab: 0,
    rows: [],
    name: '',
    id: '',
    count: '',
    noOfPayment: '',
    startDate: '',
    endDate: '',
    statusList: [],
    filteredStatusList: [],
    figureList: [],
    page: 0,
    rowsPerPage: 10,
    error: false,
    totalRecords: 0,
    selectedFilterItem: {},
    openFiltersSection: false,
    showDownload: false,
    downloadProgress: false,
    anchorEl: null,
    variant: 'error',
    actionType: 0,
    actionTypeList: [],
    autoHideDuration:null
  };

  componentDidMount = () => {
    const { userData } = this.props.user;
    const { page, rowsPerPage, filterQuery } = this.state;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    const data = {
      ...filterQuery,
      pageNumber: page + 1,
      rowCount: rowsPerPage,
      clientID: userData.portalProfileId,
      BusinessType: appType,
    };

    this.setState(
      {
        page: page,
        filterQuery: data,
      },
      () => {
        this.fetchFiles(this.state.filterQuery);
        this.getFileStatusList();
      }
    );
    if (userData && userData.payerTypeId == PayerTypes.CARDS) {
      this.getActionTypeList();
    }
  };

  getActionTypeList = async () => {
    const { userData } = this.props.user;
    const { portalProfileId, payerTypeId } = userData;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;

    const res = await fetchActionTypeList(
      portalProfileId,
      payerTypeId,
      appType
    );

    if (res && res.data && res.data.data && res.data.data.length) {
      this.setState({ actionTypeList: res.data.data });
    }
  };

  getFileStatusList = async () => {
    const { userData } = this.props.user;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    const res = await fetchFileStatus(appType);
    if (res.error) {
      this.setState({ statusList: [] });
    } else {
      this.getFileFigureStatusList();
      let data = [];
      res.data &&
        res.data.map(function (detail) {
          data = [
            ...data,
            { ...detail, roleName: detail.Description, count: null },
          ];
        });
      this.setState({ statusList: data });
    }
  };

  getFileFigureStatusList = async () => {
    const { userData } = this.props.user;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    const res = await fetchFileFigureStatus(userData.portalProfileId, appType);
    if (res.errors) {
      this.setState({ figureList: [] });
    } else {
      let data = [],
        arr = [];
      let arr1 = [];
      let index = 0;
      this.props.location.state === 'isPaymentFileRequiredAttention'
        ? res.data.map(function (detail, i) {
            if (detail.FileStatusID === 2) {
              data = [...data, { ...detail, selected: true }];
              index = i;
            } else {
              data = [...data, { ...detail, selected: false }];
            }
          })
        : res.data &&
          res.data.map(function (detail, i) {
            i === 0
              ? (data = [...data, { ...detail, selected: true }])
              : (data = [...data, { ...detail, selected: false }]);
          });
      arr = res.data && res.data[0].StatusMapping.split(',').map(Number);
      arr1 = res.data && res.data[index].StatusMapping.split(',').map(Number);
      this.filterStatusMapping(
        this.props.location.state === 'isPaymentFileRequiredAttention'
          ? arr1
          : arr
      );
      const { filterQuery } = this.state;

      const data2 = {
        ...filterQuery,
        statusIDs: res.data && res.data[index].StatusMapping,
        BusinessType: appType,
      };
      const data1 = {
        ...filterQuery,
        statusIDs: res.data && res.data[0].StatusMapping,
        BusinessType: appType,
      };

      this.setState(
        {
          filterQuery:
            this.props.location.state === 'isPaymentFileRequiredAttention'
              ? data2
              : data1,
          figureList: data,
        },
        () => {
          this.fetchFiles(this.state.filterQuery);
        }
      );
    }
  };

  handleParentFileStatusClick = (item) => {
    const { figureList } = this.state;
    const { userData } = this.props.user;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    let arr = [];
    arr = item.StatusMapping && item.StatusMapping.split(',').map(Number);
    this.filterStatusMapping(arr ? arr : []);
    const { filterQuery } = this.state;

    const data1 = {
      ...filterQuery,
      pageNumber: 1,
      rowCount: 10,
      statusIDs: item.StatusMapping,
      BusinessType: appType,
    };
    this.setState(
      {
        figureList: figureList.map((detail) =>
          detail.StatusMapping === item.StatusMapping
            ? { ...detail, selected: true }
            : { ...detail, selected: false }
        ),
        filterQuery: data1,
        page: 0,
        rowsPerPage: 10,
        selectedFilterItem: {},
      },
      () => {
        this.fetchFiles(this.state.filterQuery);
      }
    );
  };

  filterStatusMapping = (arr) => {
    const { statusList } = this.state;
    let newArr = [];
    statusList &&
      statusList.filter((s) => {
        if (arr.length > 0 && arr.includes(s.StatusID)) {
          newArr.push(s);
        }
      });
    this.setState({
      filteredStatusList: newArr,
    });
  };

  goToFilesList = (e) => {
    if (e) {
      e.stopPropagation();
    }
    this.setState({
      openDialogue: false,
    });
    this.fetchFiles(this.state.filterQuery);
    this.getFileFigureStatusList();
  };

  fetchFiles = async (data) => {
    let list = await fetchFileList(data);
    const { error, message } = list;
    if (error) {
      this.setState({
        error: message
          ? message
          : this.props.t('componentData.reduxData.ErrorOccurred'),
        isLoading: false,
        variant: 'false',
      });
      return false;
    }
    let arr = [];
    list.data &&
      list.data.lstPaymentFileByFileId &&
      list.data.lstPaymentFileByFileId.map((item) => {
        {
          arr.push({
            FileID: item.FileID,
            FileName: item.FileName,
            FileUploaded: item.FileUploaded,
            TotalPayments: item.TotalPayments,
            FileStatus: item.FileStatus,
            BusinessType: item.BusinessType,
            FileProcessingStatusID: item.FileProcessingStatusID,
          });
        }
      });
    this.setState({
      isLoading: false,
      rows: arr,
      totalRecords: list.data && list.data.TotalRecords,
    });
  };

  handleSelection = (event, row) => {
    event.stopPropagation();
    const { checked, id } = event.target;
    const { selectedIds, selectedData } = this.state;

    if (checked) {
      this.setState({
        selectedIds: [...selectedIds, event.target.id],
        selectedData: [...selectedData, row],
      });
    } else {
      const restIds = selectedIds.filter((item) => item !== id);
      const restData = selectedData.filter(
        (item) => item.FileID !== row.FileID
      );
      this.setState({ selectedIds: restIds, selectedData: restData });
    }
  };

  handleClickFilter = (event, item, index) => {
    const { userData } = this.props.user;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    this.setState(
      {
        selectedFilterItem: item,
        page: 0,
      },
      () => {
        const { statusList, filterQuery } = this.state;

        if (item.StatusID === 0) {
          const queryData = {
            ...filterQuery,
            statusIDs: '',
            pageNumber: 1,
            BusinessType: appType,
          };
          this.setState(
            {
              filterQuery: queryData,
            },
            () => {
              this.fetchFiles(queryData);
            }
          );
        } else {
          const id = statusList
            ? statusList.find((i) => i.Description === item.roleName)
            : {};
          const queryData = {
            ...filterQuery,
            statusIDs: id.StatusID ? id.StatusID : '',
            pageNumber: 1,
            BusinessType: appType,
          };
          this.setState(
            {
              filterQuery: queryData,
            },
            () => {
              this.fetchFiles(queryData);
            }
          );
        }
      }
    );
  };

  handleBtnClick = async (item) => {
    const { userData } = this.props.user;
    const { selectedIds } = this.state;
    const { t } = this.props;
    const data = [];
    selectedIds.map((i) => {
      data.push({
        fileID: i,
        actions: item === 'approve' ? 2 : item === 'reject' ? 4 : 1,
        userName: userData.displayName,
      });
    });

    const res = await updatePaymentFileAction(data);
    if (res.error) {
      this.setState({
        error: t('componentData.importPaymentFiles.SomethingWrong'),
        variant: 'error',
      });
    }
    this.setState({
      error:
        item === 'approve'
          ? t('componentData.fileDetails.ActionApproved')
          : item === 'reject'
          ? t('componentData.fileDetails.ActionRejected')
          : t('componentData.fileDetails.ActionUpdated'),
      variant: 'success',
      selectedIds: [],
      selectedFilterItem: {},
      selectedData: [],
    });
    this.fetchFiles(this.state.filterQuery);
    this.getFileFigureStatusList();
  };

  handleChangePage = (event, newPage) => {
    const { filterQuery } = this.state;
    const { userData } = this.props.user;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    const data = {
      ...filterQuery,
      pageNumber: newPage + 1,
      BusinessType: appType,
    };
    this.setState(
      {
        filterQuery: data,
        page: newPage,
      },
      () => {
        this.fetchFiles(data);
      }
    );
  };

  handleChangeRowsPerPage = (event) => {
    const { filterQuery } = this.state;
    const { userData } = this.props.user;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    const data = {
      ...filterQuery,
      rowCount: event.target.value,
      BusinessType: appType,
    };
    this.setState(
      {
        filterQuery: data,
        page: 0,
        rowsPerPage: +event.target.value,
      },
      () => {
        this.fetchFiles(data);
      }
    );
  };

  applySupplierFilter = (e) => {
    const { userData } = this.props.user;
    const appType = userData.appType
      ? parseInt(userData.appType)
      : entityType.B2B;
    const {
      name,
      id,
      count,
      noOfPayment,
      startDate,
      endDate,
      filterQuery,
      actionType,
    } = this.state;
    const data = {
      ...filterQuery,
      BusinessType: appType,
      pageNumber: 1,
      clientID: userData.portalProfileId,
      fileName: name,
      fileID: id === '' ? 0 : id,
      paymentCountFilterBy: count,
      paymentCount: noOfPayment === '' ? 0 : noOfPayment,
      fromDate: startDate,
      toDate:
        endDate.length === 0
          ? (new Date().getMonth() > 8
              ? new Date().getMonth() + 1
              : '0' + (new Date().getMonth() + 1)) +
            '/' +
            (new Date().getDate() > 9
              ? new Date().getDate()
              : '0' + new Date().getDate()) +
            '/' +
            new Date().getFullYear()
          : endDate,
      ActionTypeId: actionType,
    };
    this.setState(
      {
        filterQuery: data,
        page: 0,
        isLoading: true,
        openFiltersSection: false,
      },
      () => {
        this.fetchFiles(data);
      }
    );
  };

  resetSupplierFilter = (e) => {
    const { userData } = this.props.user;
    const appType = parseInt(userData.appType)
    const { filterQuery } = this.state;
    const data = {
      ...filterQuery,
      clientID: userData.portalProfileId,
      fileName: '',
      fileID: 0,
      paymentCountFilterBy: '',
      paymentCount: 0,
      fromDate: '',
      toDate: '',
      BusinessType: appType,
      ActionTypeId: 0,
    };
    this.setState(
      {
        filterQuery: data,
        //isLoading: true,
        //openFiltersSection: false,
        name: '',
        id: '',
        count: '',
        noOfPayment: '',
        startDate: '',
        endDate: '',
        actionType: 0,
      },
      () => {
        this.fetchFiles(data);
      }
    );
  };

  handleDownloadCSV = async () => {
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const { t } = this.props;

    const date = new Date()
      .toLocaleString(this.props.i18n.language, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
      .replace(/[^ -~]/g, '')
      .split(' ');

    let dateStr = date[0] + date[1] + date[2] + date[3];
    var regex = /[.,\s]/g;
    dateStr = dateStr.replace(regex, '');

    const fileName = `${t('componentData.fileName.file')}_${t(
      'componentData.fileName.list'
    )}_${dateStr}.xlsx`;

    const list = await fetchFileList(this.state.filterQuery);

    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (
          list &&
          list.data &&
          list.data.lstPaymentFileByFileId &&
          list.data.lstPaymentFileByFileId.length > 0
        ) {
          // define an empty array of rows
          const tableRows = [];
          // for each account pass all its data into an array
          list.data.lstPaymentFileByFileId.forEach((field) => {
            const data = {};
            data[t('componentData.importPaymentFiles.FileID')] = field.FileID;
            data[t('componentData.importPaymentFiles.FileName')] =
              field.FileName;
            data[t('componentData.importPaymentFiles.FileStatus')] =
              field.FileStatus;
            data[t('componentData.importPaymentFiles.FileUploaded')] =
              field.FileUploaded;
            data[t('componentData.importPaymentFiles.TotalPayments')] =
              field.TotalPayments;

            //push each data info into a row
            tableRows.push(data);
          });
          const paymentFiles = t(
            'componentData.importPaymentFiles.PaymentFiles'
          );
          const ws = XLSX.utils.json_to_sheet(tableRows);
          const wb = {
            Sheets: {},
            SheetNames: [paymentFiles],
          };
          wb.Sheets[paymentFiles] = ws;

          const excelBuffer = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
          });
          const data = new Blob([excelBuffer], { type: fileType });
          FileSaver.saveAs(data, fileName);

          this.setState({
            downloadProgress: false,
            showDownload: false,
          });
        }
      }
    );
  };

  handleDownloadPDF = async () => {
    const { t } = this.props;
    const list = await fetchFileList(this.state.filterQuery);

    this.setState(
      {
        downloadProgress: true,
      },
      () => {
        if (
          list &&
          list.data &&
          list.data.lstPaymentFileByFileId &&
          list.data.lstPaymentFileByFileId.length > 0
        ) {
          const tableColumn = [
            t('componentData.importPaymentFiles.FileID'),
            t('componentData.importPaymentFiles.FileName'),
            t('componentData.importPaymentFiles.FileStatus'),
            t('componentData.importPaymentFiles.FileUploaded'),
            t('componentData.importPaymentFiles.TotalPayments'),
          ];
          // define an empty array of rows
          const tableRows = [];
          // for each account pass all its data into an array
          list.data.lstPaymentFileByFileId.forEach((field) => {
            const data = [
              field.FileID,
              field.FileName,
              field.FileStatus,
              field.FileUploaded,
              field.TotalPayments,
            ];
            //push each data info into a row
            tableRows.push(data);
          });
          const title = t('componentData.importPaymentFiles.MyFiles');

          const date = new Date()
            .toLocaleString(this.props.i18n.language, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
            })
            .replace(/[^ -~]/g, '')
            .split(' ');
          let dateStr = date[0] + date[1] + date[2] + date[3];
          var regex = /[.,\s]/g;
          dateStr = dateStr.replace(regex, '');
          // const fileName = `${t(
          //   'componentData.fileName.files'
          // )}_${dateStr}.pdf`;
          const fileName = `${t('componentData.fileName.file')}_${t(
            'componentData.fileName.list'
          )}_${dateStr}.pdf`;

          //const date = Date().split(' ');
          // we use a date string to generate our filename.
          //const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
          //const fileName = `files_${dateStr}.pdf`;

          generatePDF(title, fileName, tableColumn, tableRows);

          this.setState({
            downloadProgress: false,
            showDownload: false,
          });
        }
      }
    );
  };

  renderDownloadOptions = (showDownload) => {
    return (
      <Menu
        anchorEl={this.state.anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={showDownload}
        onClose={() => this.setState({ showDownload: false, anchorEl: null })}
      >
        <MenuItem onClick={() => this.handleDownloadCSV()}>.XLSX</MenuItem>
        <MenuItem onClick={() => this.handleDownloadPDF()}>.PDF</MenuItem>
      </Menu>
    );
  };

  shouldActionButtonEnable = (type) => {
    let shouldEnable = false;
    if (['approve', 'reject'].includes(type)) {
      if (
        this.state.selectedData &&
        this.state.selectedData.length &&
        this.state.selectedData.every((item) =>
          statuses.includes(item.FileStatus)
        )
      ) {
        shouldEnable = true;
      }
    } else {
      if (
        this.state.selectedData &&
        this.state.selectedData.length &&
        this.state.selectedData.every(
          (item) => 'Requires Attention' === item.FileStatus
        )
      ) {
        shouldEnable = true;
      }
    }
    return shouldEnable;
  };
  hideAlertMessage = () => {
    this.setState({
      error: null,
      variant: null,
      autoHideDuration:null
    });
  };

  handleNotificationClose = () => {
    this.setState({
      error: false,
    });
  };

  resetFilterQuery = () => {
    const { userData } = this.props.user;
    const appType = parseInt(userData.appType)
    const { filterQuery } = this.state;
    const data = {
      ...filterQuery,
      clientID: userData.portalProfileId,
      fileName: '',
      fileID: 0,
      paymentCountFilterBy: '',
      paymentCount: 0,
      fromDate: '',
      toDate: '',
      BusinessType: appType,
      ActionTypeId: 0,
    };
    this.setState(
      {
        filterQuery: data,
        //isLoading: true,
        //openFiltersSection: false,
        name: '',
        id: '',
        count: '',
        noOfPayment: '',
        startDate: '',
        endDate: '',
        actionType: 0,
      },
      () => {
        this.getFileFigureStatusList(data);
      }
    );
  };

  handleRefresh = () => {
    this.setState({
      isLoading:true
    })
    this.resetFilterQuery()
  }

  handleFileUploadNotifications = (type,msg) => {
    this.setState({
      variant:type,
      error:msg,
      autoHideDuration:6000
    })
  }

  render() {
    const {
      selectedFilterItem,
      isLoading,
      error,
      filteredStatusList,
      figureList,
      openFiltersSection,
    } = this.state;
    const { classes, user, t } = this.props;
    const appType = user.userData.appType
      ? parseInt(user.userData.appType)
      : entityType.B2B;
    const payerTypeId =
      user.userData && user.userData.payerTypeId
        ? user.userData.payerTypeId
        : PayerTypes.PMTX;
    const columns = [
      { id: 'FileName', label: 'FileName' },
      { id: 'FileID', label: 'FileID' },
      { id: 'TotalPayments', label: 'No. of Payments' },
      { id: 'FileUploaded', label: 'ReceivedOn' },
      { id: 'FileStatus', label: 'Status' },
    ];
    const {
      openDialogue,
      page,
      rows,
      rowsPerPage,
      totalRecords,
      name,
      id,
      count,
      noOfPayment,
      startDate,
      endDate,
      showDownload,
      selectedIds,
      variant,
      actionType,
      actionTypeList,
    } = this.state;
    if (isLoading) {
      return (
        <Box className='loader-container'>
          <CircularProgress color='primary' />
        </Box>
      );
    }
    const isMyFileUploadEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights['PAYMENTS_MY_FILES_UPLOAD'])) ||
      false;
    const isMyFileApproveEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights['PAYMENTS_MY_FILES_APPROVE'])) ||
      false;
    const isMyFileRejectEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights['PAYMENTS_MY_FILES_REJECT'])) ||
      false;
    const isMyFileRecalcEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['PAYMENTS_MY_FILES_RECALCULATION']
        )) ||
      false;
    const isPaymentDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights['PAYMENTS_MY_FILES_DOWNLOAD'])) ||
      false;

    return (
      <Box mx={6} my={2}>
        <Grid container item xs={12} md={12} justify='flex-end'>
          <Box mt={'-42px'}>
            {isMyFileUploadEnabled &&
              (appType !== 2 || user?.isPayeeChoicePortal) &&
              !user.userData.activeBankParentProfileId && (
                <Button
                  style={
                    this.props.i18n.language === 'fr' ? { width: 330 } : {}
                  }
                  variant='contained'
                  className={classes.largeBtn}
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => {
                    window.scroll(0, 0);
                    this.setState({
                      openDialogue: true,
                    });
                  }}
                >
                  {t('componentData.importPaymentFiles.UploadPaymentFile')}
                </Button>
              )}
          </Box>
        </Grid>
        {openDialogue && (
          <ImportFileUpload
            open={true}
            onCancel={this.goToFilesList}
            handleFileUploadNotifications={this.handleFileUploadNotifications}
          />
        )}

        {figureList && figureList.length > 0 && (
          <FileProcessStatus
            paymentFilesData={figureList}
            handleParentFileStatusClick={this.handleParentFileStatusClick}
          />
        )}

        <Grid container xs={12} className={classes.root}>
          <Paper className={classes.paper} elevation={0}>
            <Grid
              container
              item
              xs={12}
              md={12}
              justify='flex-end'
              className={classes.gridItem}
            >
              <Box display='flex' justifyContent='flex-end'>
                <Box mt={1} mr={1} className='button-container'>
                  <Box>
                    {isPaymentDownloadEnabled && (
                      <ExportAsBtn
                        onClick={(e) => {
                          this.setState({
                            showDownload: true,
                            anchorEl: e.currentTarget,
                          });
                        }}
                        btnName={t('componentData.importPaymentFiles.ExportAs')}
                      />
                    )}
                    {showDownload && this.renderDownloadOptions(showDownload)}
                  </Box>

                  <Box>
                    {isMyFileApproveEnabled &&
                      this.shouldActionButtonEnable('approve') && (
                        <Button
                          color={
                            this.shouldActionButtonEnable('approve')
                              ? 'primary'
                              : ''
                          }
                          onClick={() => this.handleBtnClick('approve')}
                          disabled={
                            this.shouldActionButtonEnable('approve')
                              ? false
                              : true
                          }
                        >
                          <CheckCircleIcon fontSize='small' />
                          <Typography variant='h6' className={classes.iconText}>
                            {t('componentData.importPaymentFiles.Approve')}
                          </Typography>
                        </Button>
                      )}
                  </Box>

                  <Box>
                    {isMyFileRejectEnabled &&
                      this.shouldActionButtonEnable('reject') && (
                        <Button
                          color={
                            this.shouldActionButtonEnable('reject')
                              ? 'primary'
                              : ''
                          }
                          onClick={() => this.handleBtnClick('reject')}
                          disabled={
                            this.shouldActionButtonEnable('reject')
                              ? false
                              : true
                          }
                        >
                          <CancelIcon fontSize='small' />
                          <Typography variant='h6' className={classes.iconText}>
                            {t('componentData.importPaymentFiles.Reject')}
                          </Typography>
                        </Button>
                      )}
                  </Box>
                  <Box>
                    <Button
                      color={'primary'}
                      onClick={() => this.handleRefresh()}
                    >
                      <RefreshIcon fontSize='small' />
                      <Typography variant='h6' className={classes.iconText}>
                        {t('componentData.importPaymentFiles.Refresh')}
                      </Typography>
                    </Button>
                  </Box>

                  <Box>
                    {isMyFileRecalcEnabled &&
                      appType !== 2 &&
                      this.shouldActionButtonEnable('recalc') && (
                        <Button
                          color={
                            this.shouldActionButtonEnable('recalc')
                              ? 'primary'
                              : ''
                          }
                          aria-label='View'
                          title={t('componentData.importPaymentFiles.Recalc')}
                          component='span'
                          className={classes.smallBtn}
                          onClick={() => this.handleBtnClick('recalc')}
                          disabled={
                            this.shouldActionButtonEnable('recalc')
                              ? false
                              : true
                          }
                        >
                          <AutorenewIcon fontSize='small' />
                          <Typography variant='h6' className={classes.iconText}>
                            {t('componentData.importPaymentFiles.Recalc')}
                          </Typography>
                        </Button>
                      )}
                  </Box>

                  <Box>
                    <Button
                      color='primary'
                      aria-label='View'
                      title={t('componentData.importPaymentFiles.ViewFilter')}
                      component='span'
                      className={classes.smallBtn}
                      onClick={() => {
                        this.setState({
                          openFiltersSection: true,
                        });
                      }}
                    >
                      <img
                        src={require(`~/assets/icons/icon_filter.svg`)}
                        alt={t('componentData.importPaymentFiles.ViewFilter')}
                        className={classes.imgIcon}
                      />
                      <Typography variant='h6' className={classes.iconText}>
                        {t('componentData.importPaymentFiles.Filters')}
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={12}
              justifyContent='flex-start'
              className={classes.gridItem}
            >
              <Box display='flex' width='100%' justifyContent='flex-start'>
                <ChipFilter
                  list={filteredStatusList}
                  handleClickFilter={this.handleClickFilter.bind(this)}
                  selectedFilterItem={selectedFilterItem}
                />
              </Box>
            </Grid>
          </Paper>
        </Grid>
        <Box pb={2}>
          <TableContainer
            component={Paper}
            elevation={0}
            style={{ overflowX: 'visible' }}
          >
            <Table aria-label='file process table'>
              <TableHead>
                <TableRow>
                  {rows && rows.length > 0 && (
                    <TableCell className={classes.supTable}></TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      style={{
                        wordBreak: 'normal',
                        width: '15%',
                        whiteSpace: 'nowrap',
                      }}
                      align='left'
                      key={column.id}
                      className={classes.supTable}
                    >
                      <Box fontSize={16} fontWeight='600' whiteSpace='nowrap'>
                        {column.label === 'No. of Payments'
                          ? t('componentData.importPaymentFiles.NoOfPayments')
                          : t(
                              `componentData.importPaymentFiles.${column.label}`
                            )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {!isLoading ? (
                <TableBody>
                  {rows && rows.length > 0 ? (
                    rows.map((row) => {
                      return (
                        <TableRow
                          key={row.FileID}
                          className={classes.tbleRow}
                          onClick={() =>
                            this.props.history.push({
                              pathname: `${config.baseName}/payments/paymentFiles/fileDetails`,
                              state: {
                                id: row.FileID,
                                appType: row.BusinessType,
                              },
                            })
                          }
                        >
                          <TableCell padding='checkbox'>
                            {statuses.includes(row.FileStatus) && (
                              <Checkbox
                                onClick={(e) => this.handleSelection(e, row)}
                                id={row.FileID}
                                checked={
                                  selectedIds.includes(row.FileID.toString())
                                    ? true
                                    : false
                                }
                              />
                            )}
                          </TableCell>

                          <>
                            <TableCell
                              align='left'
                              style={{
                                width: '25%',
                                wordBreak: 'break-word',
                                cursor: 'pointer',
                              }}
                            >
                              <Box fontWeight='700' title={row.FileName}>
                                {row.FileName && row.FileName.length > 37
                                  ? row.FileName.substring(0, 37) + '...'
                                  : row.FileName}
                              </Box>
                            </TableCell>
                            <TableCell
                              align='left'
                              style={{
                                width: '10%',
                                wordBreak: 'break-word',
                                cursor: 'pointer',
                              }}
                            >
                              <Box fontWeight='700' title={row.FileID}>
                                {row.FileID}
                              </Box>
                            </TableCell>
                          </>

                          <TableCell align='left' style={{ width: '16%' }}>
                            {row.FileProcessingStatusID >
                              FileStatusProcessingId.FileProcessed ||
                            row.FileProcessingStatusID ===
                              FileStatusProcessingId.FileRejected ? (
                              row.TotalPayments
                            ) : (
                              <ThreeDots
                                height={20}
                                color={'#000'}
                                radius={3}
                                width={20}
                              />
                            )}
                          </TableCell>
                          <TableCell align='left' style={{ width: '21%' }}>
                            {row.FileUploaded}
                          </TableCell>
                          <TableCell align='left' style={{ width: '34%' }}>
                            {' '}
                            <LightBlueBtn> {row.FileStatus} </LightBlueBtn>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell align='center' colSpan={6}>
                        <Box
                          display='flex'
                          justifyContent='center'
                          my={6}
                          flexDirection='column'
                        >
                          <Box>
                            <img
                              alt='No Data'
                              src={require('~/assets/icons/bankFile_No_data.svg')}
                            />
                          </Box>
                          <Box py={3} color='#A1A1A1' fontSize={14}>
                            {' '}
                            {t(
                              'componentData.importPaymentFiles.NoDataToShow'
                            )}{' '}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              ) : (
                <Box display='flex' justifyContent='center'>
                  <CircularProgress />
                </Box>
              )}
            </Table>
          </TableContainer>
          <TablePagination
            labelRowsPerPage={t('componentData.importPaymentFiles.Rowsperpage')}
            rowsPerPageOptions={[10, 25, 50]}
            component={Paper}
            elevation={0}
            style={{ width: '100%' }}
            count={totalRecords || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} ${t('componentData.fileName.Of')} ${
                count !== -1
                  ? count
                  : `${t('componentData.fileName.MoreThan')} ${to}`
              }`
            }
          />
        </Box>
        {error && (
          <Notification
            variant={variant}
            message={error}
            handleClose={this.hideAlertMessage}
            autoHideDuration={this.state.autoHideDuration}
          />
        )}
        {openFiltersSection && (
          <CustomDialog
            showButton={false}
            alignSide={true}
            onConfirm={() => {
              this.setState({
                openFiltersSection: false,
              });
            }}
            title={t('componentData.importPaymentFiles.Filters')}
            icon={true}
            width='400px'
          >
            <PaymentFileFilters
              name={name}
              id={id}
              count={count}
              noOfPayment={noOfPayment}
              startDate={startDate}
              endDate={endDate}
              actionType={actionType}
              actionTypeList={actionTypeList}
              payerTypeId={payerTypeId}
              handleChangeInput={(e) => {
                const name = e.target.name,
                  value = e.target.value;
                this.setState({
                  [name]:
                    name === 'id' || name === 'noOfPayment'
                      ? value.replace(/[^0-9]/g, '')
                      : value,
                });
              }}
              isCampaignFlag={false}
              appType={appType}
              updateDateFilter={(name, value) => {
                let date = new Date(value);
                const { endDate } = this.state;
                const newVal =
                  (date.getMonth() > 8
                    ? date.getMonth() + 1
                    : '0' + (date.getMonth() + 1)) +
                  '/' +
                  (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
                  '/' +
                  date.getFullYear();
                if (name === 'startDate' && endDate.length === 0) {
                  this.setState({
                    [name]: newVal,
                    endDate:
                      (new Date().getMonth() > 8
                        ? new Date().getMonth() + 1
                        : '0' + (new Date().getMonth() + 1)) +
                      '/' +
                      (new Date().getDate() > 9
                        ? new Date().getDate()
                        : '0' + new Date().getDate()) +
                      '/' +
                      new Date().getFullYear(),
                  });
                } else {
                  this.setState({
                    [name]: newVal,
                  });
                }
              }}
              applySupplierFilter={this.applySupplierFilter}
              resetSupplierFilter={this.resetSupplierFilter}
            />
          </CustomDialog>
        )}
        {showDownload && this.renderDownloadOptions(showDownload)}
      </Box>
    );
  }
}

export default connect((state) => ({ ...state.user }))(
  withTranslation()(withStyles(styles)(ImportPaymentFiles))
);
