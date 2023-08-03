import React, { Component } from 'react';
import {
  Grid,
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Card,
  TableRow,
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  MenuItem,
  Menu,
  CircularProgress,
} from '@material-ui/core';
import Tile from '~/components/Tile';
import StackBar from '~/components/StackBar/B2C';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import styles from './styles';
import InfoDialogue from '~/components/InfoDialogue';
import * as XLSX from 'xlsx';
import generatePDF from '~/modules/GeneratePDF/';
import * as FileSaver from 'file-saver';

import { B2CfetchSelectedTabs } from '~/redux/helpers/settings';
import EditIcon from '@material-ui/icons/Edit';
import ACH from '~/assets/icons/ACH.svg';
import PayPal from '~/assets/icons/PayPal.svg';
import Push_to_Card from '~/assets/icons/Push_to_Card.svg';
import check_icon from '~/assets/icons/check_icon.svg';
import Zelle from '~/assets/icons/Zelle.svg';
import ACH_selected from '~/assets/icons/ACH_selected.svg';
import Paypal_selected from '~/assets/icons/Paypal_selected.svg';
import PushToCard_selected from '~/assets/icons/PushToCard_selected.svg';
import check_icon_selected from '~/assets/icons/check_icon_selected.svg';
import Zelle_selected from '~/assets/icons/Zelle_selected.svg';
import Checkbox from '@material-ui/core/Checkbox';
import ExportAsBtn from '~/components/ExportAsBtn';
import { StyledTableFooter } from '~/components/StyledTable';
import ChipFilter from '~/components/Filter';
import { getB2CClientPaymentTypes } from '~/redux/actions/B2C/payments';

import { CustomDialog } from '~/components/Dialogs';
import B2CVendorInformation from '~/modules/vendorInformation/B2C';
import SupplierFiltersB2C from '~/modules/SupplierFilters/B2C';
import Notification from '~/components/Notification';
import { accessRights } from '~/config/accessRights';
import { paymentMethods } from '~/config/paymentMethods';
import { fetchExportSuppliersFilterList } from '~/redux/helpers/suppliers';
import {
  fetchB2CConsumerPayeeList,
  getB2CEnrollmentStatusList,
  getB2CPayeeStatusList,
  B2CConsumerDeactivate,
  B2CConsumerUnlock,
  B2CConsumerLock,
  B2CConsumerRevoke,
} from '~/redux/actions/B2C/consumers';
import { fetchSuppliersCount } from '~/redux/helpers/B2C/suppliers';
import { PaymentDescriptionToId } from '~/utils/const';
import config from '~/config';
import { entityType, CONSUMER_CAMPAIGN_STATUS,Consumer_Status } from '~/config/entityTypes';

class MySupplierB2C extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      viewGrid: false,
      selectedVendor: {},
      selectedConsumerIds: [],
      selectedVendors: [],
      optedPaymentMethod: [],
      isGuest: false,
      totalVendors: 0,
      fetchingList: true,
      isListLoading: false,
      page: 0,
      rowsPerPage: props.history.location?.state?.selectedPayeeRemitToId
        ? 25
        : 10,
      filterOpen: false,
      error: false,
      variant: 'error',
      vendorsList: [],
      vendorsExportList: [],
      selectedFilterItem: {},
      processing: false,
      filterList: [],
      showExportDownload: false,
      openVendorInformationDialog: false,
      openFiltersSection: false,
      openRevokeDialog: false,
      openDisapproveDialog: false,
      openLockDialog: false,
      openUnlockDialog: false,
      name: '',
      id: '',
      payeeActivatedAt: '',
      enrollmentInitiatedAt: '',
      count: 0,
      canRevoke: true,
      canDeactivate: true,
      canLock: true,
      canUnlock: true,
      selectAllCheck: false,
      selectedVendorStatus: [],
      paymentList: [],
      enrollmentStatusList: [],
      sortList: [
        { key: 'updated_at', label: 'Last Update Date', selected: true },
        { key: 'asc', label: 'Alphabetically: A to Z', selected: false },
        { key: 'desc', label: 'Alphabetically: Z to A', selected: false },
        { key: 'created_at', label: 'Enrollment Date', selected: false },
      ],
      sort: 'lastUpdatedAt',
      sortType: 'desc',
      // status: "",
      showDownload: false,
      anchorEl: null,
      downloadProgress: false,
      supplierCounts: [],
      enrollmentOnly: false,
      isImplementationProgSelected: false,
      fileID: props?.history?.location?.state?.fileID ?? null
    };
  }

  componentDidMount() {
    this.prepareStackBarData();
    this.getEnrollmentStatusList();
    this.getOptedPaymentList();
    if (!this.props.history.location?.state?.selectedPayeeRemitToId) {
      this.getAllVendorsList();
      this.fetchChipsFilterList();
    }
  }

  componentDidUpdate() {
    if (
      this.props.history.location?.state?.selectedPayeeRemitToId &&
      !this.state.openVendorInformationDialog &&
      !this.state.id
    ) {
      this.setState(
        {
          name: '',
          id:
            this.props.history.location.state.selectedPayeeRemitToId ??
            'A45321',
          location: '',
        },
        () => {
          this.applySupplierFilter();
        }
      );
    }
  }

  resetFilterData = () => {
    const { fileID } = this.state;
    if (Boolean(fileID)) {
      this.setState(
        {
          fileID: null,
        },
        () => {
          this.getAllVendorsList();
          this.fetchChipsFilterList();
        }
      );
    }
  };

  setCompanyDetail = (venderDetail) => {
    this.setState({ selectedVendor: venderDetail });
  };

  getOptedPaymentList = () => {
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchSelectedTabs(clientId).then((response) => {
      if (response.error) {
        return false;
      } else {
        if (Boolean(response?.data?.rows2 ?? false)) {
          let list = response.data.rows2.map((e) => {
            return e.b2cDescription;
          });
          this.setState(
            {
              optedPaymentMethod: list,
            },
            () => {
              this.getCustomPaymentFilter();
            }
          );
        }
      }
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
      selectAllCheck: false,
    });
    this.fetchChipsFilterList();
    this.getAllVendorsList();
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0,
      selectAllCheck: false,
    });
    this.fetchChipsFilterList();
    this.getAllVendorsList();
  };

  prepareStackBarData() {
    const { count } = this.state;
    fetchSuppliersCount().then((response) => {
      if (!response) {
        this.setState({
          supplierCounts: [],
        });
        return false;
      }
      this.setState({
        supplierCounts: response.data,
      });
    });

    this.setState({ totalVendors: count });
  }

  fetchChipsFilterList = () => {
    const {
      name,
      id,
      paymentList,
      enrollmentStatusList,
      payeeActivatedAt,
      enrollmentInitiatedAt,
      selectedFilterItem,
      sort,
      sortType,
      fileID
    } = this.state;

    let obj = paymentList.find((s) => s.selected === true);
    let obj1 = enrollmentStatusList.find((s) => s.selected === true);

    const data = {
      name: name,
      id: id,
      paymentList: typeof obj === 'undefined' ? '' : obj.paymentTypeId,
      enrollmentStatusList:
        typeof obj1 === 'undefined' ? '' : obj1.campaignStatusId,
      payeeActivatedAt: payeeActivatedAt,
      enrollmentInitiatedAt: enrollmentInitiatedAt,
      status: selectedFilterItem.id,
      sort: sort,
      sortType: sortType,
      fileID: fileID
    };

    this.props.dispatch(getB2CPayeeStatusList(data)).then((response) => {
      if (!response || response.error) {
        this.setState({
          error: response.message,
          variant: 'error',
        });
        return false;
      }
      const list =
        response &&
        response.find((s) =>
          Object.keys(selectedFilterItem).length > 0
            ? s.id === selectedFilterItem.id
            : s.id === 0
        );
      this.setState({
        filterList:
          response &&
          response.map((item) => ({ ...item, roleName: item.label })),
        selectedFilterItem: { ...list, roleName: list.label },
      });
    });
  };

  getCustomPaymentFilter = () => {
    const { optedPaymentMethod } = this.state;
    this.props.dispatch(getB2CClientPaymentTypes()).then((response) => {
      if (!response) {
        this.setState({
          error: response.message,
          variant: 'error',
        });
        return false;
      }
      let data = [];

      response.rows &&
        response.rows.map((item) => {
          let takenPayment = optedPaymentMethod.indexOf(item.b2cDescription);

          if (item.paymentCode === paymentMethods.ACH && takenPayment != -1) {
            data.push({
              ...item,
              selected: false,
              icon: ACH,
              iconSelected: ACH_selected,
            });
          } else if (
            item.paymentCode === paymentMethods.PayPal &&
            takenPayment != -1
          ) {
            data.push({
              ...item,
              selected: false,
              icon: PayPal,
              iconSelected: Paypal_selected,
            });
          } else if (
            item.paymentCode === paymentMethods.PushToCard &&
            takenPayment != -1
          ) {
            data.push({
              ...item,
              selected: false,
              icon: Push_to_Card,
              iconSelected: PushToCard_selected,
            });
          } else if (
            item.paymentCode === paymentMethods.CHK &&
            takenPayment != -1
          ) {
            data.push({
              ...item,
              selected: false,
              icon: check_icon,
              iconSelected: check_icon_selected,
            });
          } else if (
            item.paymentCode === paymentMethods.Zelle &&
            takenPayment != -1
          ) {
            data.push({
              ...item,
              selected: false,
              icon: Zelle,
              iconSelected: Zelle_selected,
            });
          }
          return data;
        });

      this.setState({
        paymentList: data,
      });
    });
  };

  getEnrollmentStatusList = () => {
    this.props.dispatch(getB2CEnrollmentStatusList()).then((response) => {
      if (!response) {
        this.setState({
          error: response.message,
          variant: 'error',
        });
        return false;
      }
      this.setState({
        enrollmentStatusList: response.rows || [],
      });
    });
  };

  getExportVendorsList = () => {
    const {
      id,
      location,
      // status,
      paymentList,
      enrollmentStatusList,
      selectedFilterItem,
    } = this.state;
    let obj = paymentList.find((s) => s.selected === true);
    let obj1 = enrollmentStatusList.find((s) => s.selected === true);

    const data = {
      id: id,
      location: location,
      paymentList: typeof obj === 'undefined' ? '' : obj.paymentTypeId,
      enrollmentStatusList:
        typeof obj1 === 'undefined' ? '' : obj1.campaignStatusId,
      status: selectedFilterItem.id,
    };
    const { userData } = this.props.user;
    //const { page, rowsPerPage } = this.state;
    return fetchExportSuppliersFilterList(
      '',
      userData.portalProfileId,
      data
      //rowsPerPage,
      //page
    );
    // }
  };

  getAllVendorsList = () => {
    this.setState(
      {
        // fetchingList: true,
        isListLoading: true,
        vendorsList: [],
        // page: 0
      },
      () => {
        const {
          name,
          payeeActivatedAt,
          id,
          enrollmentInitiatedAt,
          paymentList,
          enrollmentStatusList,
          selectedFilterItem,
          page,
          rowsPerPage,
          sort,
          sortType,
          fileID
        } = this.state;
        let obj = paymentList.find((s) => s.selected === true);
        let obj1 = enrollmentStatusList.find((s) => s.selected === true);

        const data = {
          name: name,
          id: id,
          paymentList: typeof obj === 'undefined' ? '' : obj.paymentTypeId,
          enrollmentStatusList:
            typeof obj1 === 'undefined' ? '' : obj1.campaignStatusId,
          payeeActivatedAt: payeeActivatedAt,
          enrollmentInitiatedAt: enrollmentInitiatedAt,
          status: selectedFilterItem.id,
          sort: sort,
          sortType: sortType,
          page: page,
          rowsPerPage: rowsPerPage,
          fileID: fileID
        };

        this.props
          .dispatch(fetchB2CConsumerPayeeList(data))
          .then((response) => {
            if (!response) {
              this.setState({
                error: response.message,
                variant: 'error',
                fetchingList: false,
                isListLoading: false,
              });
              return false;
            } else {
              this.showVendorsList(response);
            }
          });
      }
    );
  };

  showVendorsList = (response) => {
    if (!response.error) {
      this.setState(
	    {
          vendorsList:
            response.rows && response.rows.length > 0
              ? response.rows.map((item, i) => ({
                ...item,
                isChecked: false,
              }))
              : [],
          fetchingList: false,
          isListLoading: false,
          count: response.count ? response.count : 0,
	    },
        () => {
          if (
            this.props.history.location?.state?.selectedPayeeRemitToId &&
            !this.state.openVendorInformationDialog
          ) {
            let selectedVendorData = response.rows[0];
            if (response.rows.length > 1) {
              selectedVendorData =
                response.rows.find((item) => {
                  return (
                    item.consumerId ===
                    this.props.history.location?.state?.payeeId
                  );
                }) ?? response.rows[0];
            }
            this.setState({
              openVendorInformationDialog: true,
              selectedVendor: selectedVendorData,
            });
          } else if (this.state.openVendorInformationDialog) {
            if (response?.rows?.length && this.state.selectedVendor) {
              const selectedData = response.rows.filter((item) => {
                if (this.state.selectedVendor.consumerId) {
                  return (
                    item.consumerId === this.state.selectedVendor.consumerId
                  );
                } else {
                  return (
                    item.campaignDetailId ===
                    this.state.selectedVendor.campaignDetailId
                  );
                }
              });
              if (selectedData?.length) {
                this.setState({
                  selectedVendor: selectedData[0],
                });
              }
            }
          }
          this.prepareStackBarData();
        }
      );
      //return false;
    }

    this.setState({
      isLoading: false,
      fetchingList: false,
    });
  };

  handleClickFilter = (event, item, index) => {
    this.setState(
      {
        selectedFilterItem: item,
        selectAllCheck: false,
        page: 0,
        selectedVendors: [],
        canRevoke: true,
        canLock: true,
        canUnlock: true,
        canDeactivate: true,
		//fetchingList: true,
        isListLoading: true,
      },
      () => {
        this.fetchChipsFilterList();
        this.getAllVendorsList();
      }
    );
  };

  handleVendorCheck(e, vendor) {
    let {
      selectedConsumerIds,
      vendorsList,
      selectedVendors,
      selectedVendorStatus,
    } = this.state;

    if (e.target.checked) {
      selectedConsumerIds = [...selectedConsumerIds, vendor.consumerIdentifier];
      selectedVendors = [...selectedVendors, vendor];
    } else {
      let arr = selectedConsumerIds.filter(
        (item) => item !== vendor.consumerIdentifier
      );
      selectedConsumerIds = arr;
      let vendors = selectedVendors.filter((item) =>
        vendor.consumerId
          ? item.consumerId !== vendor.consumerId
          : item.campaignDetailId !== vendor.campaignDetailId
      );
      selectedVendors = vendors;
    }

    let isrevoked = selectedVendors.find((o) => o.canRevoke === 0);
    let isDeactivate = selectedVendors.find((o) => o.canDeactivate === 0);
    let isLock = selectedVendors.find((o) => o.canLock === 0);
    let isUnlock = selectedVendors.find((o) => o.canUnlock === 0);

    this.setState({
      openVendorInformationDialog: false,
      selectedVendor: vendor,
      selectedVendors: selectedVendors,
      selectAllCheck:selectedVendors?.length && vendorsList.length === selectedVendors.length,
      selectedConsumerIds: selectedConsumerIds,
      selectedVendorStatus: selectedVendorStatus,
      canRevoke:
        typeof isrevoked !== 'undefined' || selectedVendors.length === 0
          ? true
          : false,
      canDeactivate:
        typeof isDeactivate !== 'undefined' || selectedVendors.length === 0
          ? true
          : false,
      canLock:
        typeof isLock !== 'undefined' || selectedVendors.length === 0
          ? true
          : false,
      canUnlock:
        typeof isUnlock !== 'undefined' || selectedVendors.length === 0
          ? true
          : false,
      vendorsList: vendorsList.map((item, i) =>
        item.campaignDetailId === vendor.campaignDetailId
          ? {
            ...item,
            isChecked: e.target.checked,
          }
          : item
      ),
    });
  }
  handleSelectAll = (e) => {
    const { vendorsList, selectedFilterItem, flag } = this.state;
    let payeesIds = [],selectedVendorList=[];
    if (e.target.checked) {
      vendorsList.map(function (item, index) {
        if (item.consumerIdentifier !== null) {
          payeesIds.push(item.consumerIdentifier);
          selectedVendorList.push(item)
        }
      });
    } else {
      selectedVendorList = []
    }
    this.setState({
      vendorsList: e.target.checked
        ? vendorsList.map((item, i) => ({ ...item, isChecked: true }))
        : vendorsList.map((item, i) => ({ ...item, isChecked: false })),
      selectAllCheck: e.target.checked,
      selectedVendors:selectedVendorList,
      selectedVendor: e.target.checked
        ? vendorsList.map((item, i) => ({ ...item, isChecked: true }))
        : vendorsList.map((item, i) => ({ ...item, isChecked: false })),
      selectedConsumerIds: payeesIds,
      flag: selectedFilterItem.id === 0 ? 0 : flag,
      canRevoke:e.target.checked ? ![
        Consumer_Status.INACTIVE,
        Consumer_Status.ACTIVE,
        Consumer_Status.LOCKED,
      ].includes(selectedFilterItem.id):true,
      canLock:e.target.checked ? ![
        Consumer_Status.INACTIVE,
        Consumer_Status.ACTIVE,
        Consumer_Status.PAYMENT_PREFERENCE_PENDING,
        Consumer_Status.PROFILE_CREATION_PENDING
      ].includes(selectedFilterItem.id):true,
      canUnlock:e.target.checked ? ![
        Consumer_Status.LOCKED,
      ].includes(selectedFilterItem.id):true,
      canDeactivate:e.target.checked ? ![
        Consumer_Status.INACTIVE,
        Consumer_Status.ACTIVE,
        Consumer_Status.REVOKED,
        Consumer_Status.LOCKED,
        Consumer_Status.PAYMENT_PREFERENCE_PENDING,
        Consumer_Status.PROFILE_CREATION_PENDING
      ].includes(selectedFilterItem.id):true,
    });
  };
  handleDeactivate = () => {
    const { t, dispatch } = this.props;
    const { selectedConsumerIds } = this.state;
    if (selectedConsumerIds.length > 0) {
      this.setState(
        {
          fetchingList: true,
          page: 0,
          flag: 0,
          openDisapproveDialog: false,
          selectedConsumerIds: [],
        },
        () => {
          dispatch(B2CConsumerDeactivate(selectedConsumerIds)).then(
            (response) => {
              if (!response) {
                this.setState({
                  error: response.error || 'Something went worng',
                  variant: 'error',
                  fetchingList: false,
                });
              } else {
                this.setState({
                  error:
                    selectedConsumerIds.length > 1
                      ? t(
                          'componentData.mySupplier.PayeesDeactivatedSuccessfully'
                        )
                      : t(
                          'componentData.mySupplier.PayeeDeactivatedSuccessfully'
                        ),
                  variant: 'success',
                  fetchingList: false,
                  selectedVendors: [],
                  canRevoke: true,
                  canLock: true,
                  canUnlock: true,
                  canDeactivate: true,
                  selectAllCheck:false
                });
              }
              this.prepareStackBarData();
              this.fetchChipsFilterList();
              this.getAllVendorsList();
            }
          );
        }
      );
    }
  };
  handleRevoke = () => {
    const { t, dispatch } = this.props;
    const { selectedConsumerIds } = this.state;
    if (selectedConsumerIds.length > 0) {
      this.setState(
        {
          fetchingList: true,
          page: 0,
          // selectedFilterItem: {},
          selectedConsumerIds: [],
          openRevokeDialog: false,

          flag: 0,
        },
        () => {
          dispatch(B2CConsumerRevoke(selectedConsumerIds)).then((response) => {
            if (!response) {
              this.setState({
                error: response.error || 'Something went worng',
                variant: 'error',
                fetchingList: false,
              });
            } else {
              this.setState({
                error:
                  selectedConsumerIds.length > 1
                    ? t('componentData.mySupplier.PayeesRevokedSuccessfully')
                    : t('componentData.mySupplier.PayeeRevokedSuccessfully'),
                variant: 'success',
                fetchingList: false,
                selectedVendors: [],
                canRevoke: true,
                canLock: true,
                canUnlock: true,
                canDeactivate: true,
                selectAllCheck:false
              });
            }
            this.prepareStackBarData();
            this.fetchChipsFilterList();
            this.getAllVendorsList();
          });
        }
      );
    }
  };
  hanldeLock = () => {
    const { t, dispatch } = this.props;
    const { selectedConsumerIds } = this.state;
    if (selectedConsumerIds.length > 0) {
      this.setState(
        {
          fetchingList: true,
          page: 0,
          // selectedFilterItem: {},
          selectedConsumerIds: [],
          openLockDialog: false,

          flag: 0,
        },
        () => {
          dispatch(B2CConsumerLock(selectedConsumerIds)).then((response) => {
            if (!response) {
              this.setState({
                error: response.error || 'Something went worng',
                variant: 'error',
                fetchingList: false,
              });
            } else {
              this.setState({
                error:
                  selectedConsumerIds.length > 1
                    ? t('componentData.mySupplier.PayeesLockedSuccessfully')
                    : t('componentData.mySupplier.PayeeLockedSuccessfully'),
                variant: 'success',
                fetchingList: false,
                selectedVendors: [],
                canRevoke: true,
                canLock: true,
                canUnlock: true,
                canDeactivate: true,
                selectAllCheck:false
              });
            }
            this.prepareStackBarData();
            this.fetchChipsFilterList();
            this.getAllVendorsList();
          });
        }
      );
    }
  };
  handleUnlock = () => {
    const { t, dispatch } = this.props;
    const { selectedConsumerIds } = this.state;
    if (selectedConsumerIds.length > 0) {
      this.setState(
        {
          fetchingList: true,
          page: 0,
          // selectedFilterItem: {},
          selectedConsumerIds: [],
          openUnlockDialog: false,

          flag: 0,
        },
        () => {
          dispatch(B2CConsumerUnlock(selectedConsumerIds)).then((response) => {
            if (!response) {
              this.setState({
                error: response.error || 'Something went worng',
                variant: 'error',
                fetchingList: false,
              });
            } else {
              this.setState({
                error:
                  selectedConsumerIds.length > 1
                    ? t('componentData.mySupplier.PayeesUnLockedSuccessfully')
                    : t('componentData.mySupplier.PayeeUnLockedSuccessfully'),
                variant: 'success',
                fetchingList: false,
                selectedVendors: [],
                canRevoke: true,
                canLock: true,
                canUnlock: true,
                canDeactivate: true,
                selectAllCheck:false
              });
            }
            this.prepareStackBarData();
            this.fetchChipsFilterList();
            this.getAllVendorsList();
          });
        }
      );
    }
  };
  handlePaymentClickFilter = (e, item, index) => {
    const { paymentList, enrollmentOnly } = this.state;
    index = enrollmentOnly ? index + 3 : index;
    this.setState({
      paymentList: paymentList.map((list, i) =>
        index === i
          ? {
            ...list,
            selected: !item.selected,
          }
          : {
            ...list,
            selected: false,
          }
      ),
    });
  };
  handleProgramClickFilter = (e, item, index) => {
    const { enrollmentStatusList } = this.state;

    this.setState(
      {
        enrollmentOnly: item.id === 'ENROLL_ONLY' ? !item.selected : false,
        enrollmentStatusList: enrollmentStatusList.map((list, i) =>
          index === i
            ? {
              ...list,
              selected: !item.selected,
            }
            : {
              ...list,
              selected: false,
            }
        ),
      },
      () => {
        this.setState({
          isImplementationProgSelected: this.state.enrollmentStatusList
            .map((list) => list.selected)
            .some((value) => value),
        });
      }
    );
  };
  handleSorting = (e) => {
    const { sortList } = this.state;
    let sortValue = '',
      sortTypeValue = '';
    switch (e.target.value) {
      case 'updated_at':
        sortValue = 'lastUpdatedAt';
        sortTypeValue = 'desc';
        break;
      case 'asc':
        sortValue = 'consumerName';
        sortTypeValue = 'asc';
        break;
      case 'desc':
        sortValue = 'consumerName';
        sortTypeValue = 'desc';
        break;
      case 'created_at':
        sortValue = 'enrollmentDate';
        sortTypeValue = 'desc';
        break;
      default:
        sortValue = 'lastUpdatedAt';
        sortTypeValue = 'desc';
        break;
    }

    this.setState(
      {
        sort: sortValue,
        sortType: sortTypeValue,
        sortList: sortList.map((list, i) =>
          list.key === e.target.value
            ? {
              ...list,
              selected: true,
            }
            : {
              ...list,
              selected: false,
            }
        ),
      },
      () => {
        this.getAllVendorsList();
      }
    );
  };
  applySupplierFilter = () => {
    this.setState(
      {
        fetchingList: true,
        openFiltersSection: false,
        // selectedFilterItem: {},
        vendorsList: [],
        page: 0,
      },
      () => {
        this.fetchChipsFilterList();
        this.getAllVendorsList();
      }
    );
  };
  resetSupplierFilter = (e) => {
    const { paymentList, enrollmentStatusList, filterList } = this.state;
    this.setState(
      {
        //fetchingList: true,
        // openFiltersSection: false,
        name: '',
        id: '',
        page: 0,
        payeeActivatedAt: '',
        enrollmentInitiatedAt: '',
        paymentList: paymentList.map((list) => {
          return {
            ...list,
            selected: false,
          };
        }),
        enrollmentStatusList: enrollmentStatusList.map((list) => {
          return {
            ...list,
            selected: false,
          };
        }),
        selectedFilterItem: filterList.find((s) =>
          this.props.location && this.props.location.selectedChip === undefined
            ? s.id === 0
            : (s.id = this.props.location && this.props.location.selectedChip)
        ),
      },
      () => {
        this.fetchChipsFilterList();
        this.getAllVendorsList();
      }
    );
  };

  getProfileCircleName(name) {
    const newName =
      name &&
      name
        .match(/(\b\S)?/g)
        .join('')
        .match(/(^\S|\S$)?/g)
        .join('')
        .toUpperCase();
    return newName;
  }

  /**
   * added function for refreshing list data
   * after performing CTA in dialog for B2C consumer
   */
  refreshListData = () => {
    this.prepareStackBarData();
    this.fetchChipsFilterList();
    this.getAllVendorsList();
  };
  displayPaymentMethod = (id) => {
    switch (id) {
      case PaymentDescriptionToId['Check']:
        return (
          <span>
            <img
              src={require(`~/assets/icons/CHK_main.svg`)}
              alt='Check'
              title='Check'
            />
          </span>
        );
      case PaymentDescriptionToId['ACH']:
        return (
          <span>
            <img
              src={require(`~/assets/icons/ACH_main.svg`)}
              alt='ACH'
              title='Bank Deposit (ACH)'
            />
          </span>
        );
      case PaymentDescriptionToId['PushToCard']:
        return (
          <span>
            <img
              src={require(`~/assets/icons/Push_to_Card.svg`)}
              alt='Push to Card'
              title='Instant Pay (P2C)'
            />
          </span>
        );
      case PaymentDescriptionToId['PayPal']:
        return (
          <span>
            <img
              src={require(`~/assets/icons/PayPal.svg`)}
              alt='PayPal'
              title='PayPal'
            />
          </span>
        );
      case PaymentDescriptionToId['Zelle']:
        return (
          <span>
            <img
              src={require(`~/assets/icons/Zelle.svg`)}
              alt='Zelle'
              title='Zelle'
            />
          </span>
        );
      default:
        return null;
    }
  };

  displayPaymentMethodCode = (id) => {
    switch (id) {
      case PaymentDescriptionToId['Check']:
        return 'Check';
      case PaymentDescriptionToId['ACH']:
        return 'Bank Deposit(ACH)';
      case PaymentDescriptionToId['PushToCard']:
        return 'Instant Pay (P2C)';
      case PaymentDescriptionToId['PayPal']:
        return 'PayPal';
      case PaymentDescriptionToId['Zelle']:
        return 'Zelle';
      default:
        return '';
    }
  };
  handleDownloadCSV = async () => {
    const { t } = this.props;
    this.setState(
      {
        variant: 'success',
        error: t('componentData.mySupplier.downloadFile'),
        showExportDownload: false,
      },
      () => {
        const {
          name,
          payeeActivatedAt,
          id,
          enrollmentInitiatedAt,
          paymentList,
          enrollmentStatusList,
          selectedFilterItem,
          sort,
          sortType,
          fileID
        } = this.state;
        let obj = paymentList.find((s) => s.selected === true);
        let obj1 = enrollmentStatusList.find((s) => s.selected === true);

        const data = {
          name: name,
          id: id,
          paymentList: typeof obj === 'undefined' ? '' : obj.paymentTypeId,
          enrollmentStatusList:
            typeof obj1 === 'undefined' ? '' : obj1.campaignStatusId,
          payeeActivatedAt: payeeActivatedAt,
          enrollmentInitiatedAt: enrollmentInitiatedAt,
          status: selectedFilterItem.id,
          sort: sort,
          sortType: sortType,
          page: 0,
          rowsPerPage: -1,
          fileID: fileID
        };

        this.props
          .dispatch(fetchB2CConsumerPayeeList(data))
          .then((response) => {
            // this.showVendorsList(response);
            const fileType =
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const date = Date().split(' ');
            // we use a date string to generate our filename.
            const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
            const fileName = `consumer_list_${dateStr}.xlsx`;
            const vendorsExportList = response && response['rows'];
            this.setState(
              {
                downloadProgress: true,
              },
              () => {
                if (vendorsExportList && vendorsExportList.length > 0) {
                  // define an empty array of rows
                  const tableRows = [];
                  // for each account pass all its data into an array
                  vendorsExportList.forEach((field) => {
                    // if (
                    //   field.profileStatus.description === roleName ||
                    //   roleName.replace(/ /g, "").toLowerCase() === "allpayees"
                    // ) {
                    const data = {};
                    data[t('componentData.mySupplier.PayeeID')] =
                      field.consumerIdentifier;
                    data[t('componentData.mySupplier.PayeeName')] =
                      field.displayName;
                    data[t('componentData.mySupplier.Enrollment Status')] =
                      field.enrollmentStatus;
                    data[
                      t('componentData.mySupplier.Enrollment Initiated At')
                    ] = field.enrollmentInitiatedAt;
                    data[t('componentData.mySupplier.Payee Status')] =
                      field.consumerStatus;
                    data[t('componentData.mySupplier.Payee Activated At')] =
                      field.activatedAt;
                    data[t('componentData.mySupplier.PaymentMethods')] =
                      field.secondaryPaymentMethodId
                        ? this.displayPaymentMethodCode(
                            field.primaryPaymentMethodId
                          ) +
                          ',' +
                          this.displayPaymentMethodCode(
                            field.secondaryPaymentMethodId
                          )
                        : this.displayPaymentMethodCode(
                            field.primaryPaymentMethodId
                          );

                    //push each data info into a row
                    tableRows.push(data);
                    // }
                  });

                  const payeeTitle = t('componentData.mySupplier.PayeeList');
                  const ws = XLSX.utils.json_to_sheet(tableRows);
                  const wb = {
                    Sheets: {},
                    SheetNames: [payeeTitle],
                  };
                  wb.Sheets[payeeTitle] = ws;

                  const excelBuffer = XLSX.write(wb, {
                    bookType: 'xlsx',
                    type: 'array',
                  });
                  const data = new Blob([excelBuffer], { type: fileType });
                  FileSaver.saveAs(data, fileName);

                  this.setState({
                    downloadProgress: false,
                    showDownload: false,
                    exportDownload: false,
                  });
                }
              }
            );
          });
      }
    );
  };

  handleDownloadPDF = async () => {
    const { t } = this.props;
    this.setState(
      {
        variant: 'success',
        error: t('componentData.mySupplier.downloadFile'),
        showExportDownload: false,
      },
      () => {
        const {
          name,
          payeeActivatedAt,
          id,
          enrollmentInitiatedAt,
          paymentList,
          enrollmentStatusList,
          selectedFilterItem,
          sort,
          sortType,
          fileID,
        } = this.state;
        let obj = paymentList.find((s) => s.selected === true);
        let obj1 = enrollmentStatusList.find((s) => s.selected === true);

        const data = {
          name: name,
          id: id,
          paymentList: typeof obj === 'undefined' ? '' : obj.paymentTypeId,
          enrollmentStatusList:
            typeof obj1 === 'undefined' ? '' : obj1.campaignStatusId,
          payeeActivatedAt: payeeActivatedAt,
          enrollmentInitiatedAt: enrollmentInitiatedAt,
          status: selectedFilterItem.id,
          sort: sort,
          sortType: sortType,
          page: 0,
          rowsPerPage: -1,
          fileID: fileID,
        };
        this.props
          .dispatch(fetchB2CConsumerPayeeList(data))
          .then((response) => {
            // this.showVendorsList(response);
            const vendorsExportList = response && response['rows'];
            this.setState(
              {
                downloadProgress: true,
              },
              () => {
                if (vendorsExportList && vendorsExportList.length > 0) {
                  const tableColumn = [
                    t('componentData.mySupplier.PayeeID'),
                    t('componentData.mySupplier.PayeeName'),
                    t('componentData.mySupplier.Enrollment Status'),
                    t('componentData.mySupplier.Enrollment Initiated At'),
                    t('componentData.mySupplier.Payee Status'),
                    t('componentData.mySupplier.Payee Activated At'),
                    t('componentData.mySupplier.PaymentMethods'),
                  ];
                  // define an empty array of rows
                  const tableRows = [];
                  // for each account pass all its data into an array
                  vendorsExportList.forEach((field) => {
                    // if (
                    //   field.profileStatus.description == roleName ||
                    //   roleName.replace(/ /g, "").toLowerCase() == "allpayees"
                    // ) {
                    const data = [
                      field.consumerIdentifier,
                      field.displayName,
                      field.enrollmentStatus,
                      field.enrollmentInitiatedAt,
                      field.consumerStatus,
                      field.activatedAt,
                      field.secondaryPaymentMethodId
                        ? this.displayPaymentMethodCode(
                            field.primaryPaymentMethodId
                          ) +
                          ',' +
                          this.displayPaymentMethodCode(
                            field.secondaryPaymentMethodId
                          )
                        : this.displayPaymentMethodCode(
                            field.primaryPaymentMethodId
                          ),
                    ];

                    //push each data info into a row
                    tableRows.push(data);
                    // }
                  });
                  const title = t('componentData.mySupplier.PayeeList');
                  const date = Date().split(' ');
                  // we use a date string to generate our filename.
                  const dateStr =
                    date[0] + date[1] + date[2] + date[3] + date[4];
                  const fileName = `consumer_${dateStr}.pdf`;
                  generatePDF(title, fileName, tableColumn, tableRows);

                  this.setState({
                    // downloadProgress: false,
                    // showDownload: false,
                    // variant: "",
                    // error: "",
                    downloadProgress: false,
                    showDownload: false,
                    exportDownload: false,
                  });
                }
              }
            );
          });
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
  handleNotificationClose = () => {
    this.setState({
      error: null,
    });
  };
  render() {
    const { theme } = this.props.clientConfig.layout;
    const { classes, user, t, consumerDetail } = this.props;
    const { consumerProfileInfo } = consumerDetail;
    const { showExportDownload } = this.state;
    const {
      filterList,
      selectedFilterItem,
      openVendorInformationDialog,
      openFiltersSection,
      vendorsList,
      viewGrid,
      rowsPerPage,
      page,
      name,
      id,
      payeeActivatedAt,
      enrollmentInitiatedAt,
      paymentList,
      enrollmentStatusList,
      error,
      variant,
      fetchingList,
      showDownload,
      supplierCounts,
      count,
      canUnlock,
      canLock,
      canDeactivate,
      canRevoke,
      selectedConsumerIds,
      selectAllCheck,
      openRevokeDialog,
      openDisapproveDialog,
      openUnlockDialog,
      openLockDialog,
      sortList,
      enrollmentOnly,
      isImplementationProgSelected,
      isListLoading,
    } = this.state;
	
    const columns = [
      { id: 'name', label: 'Payee ID' },
      { id: 'id', label: 'Payee Name' },
      { id: 'EnrollmentStatus', label: 'Enrollment Status' },
      { id: 'EnrollmentInitiatedAt', label: 'Enrollment Initiated At' },
      { id: 'payeeStatus', label: 'Payee Status' },
      { id: 'PayeeActivatedAt', label: 'Payee Activated At' },
      { id: 'payment', label: 'Payment Methods' },
      { id: 'edit_icon', label: '' },
    ];
    if (fetchingList) {
      return (
        <Box className='loader-container'>
          <CircularProgress color='primary' />
        </Box>
      );
    }

    const isMySupplierEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights['SUPPLIERS_MY_SUPPLIERS_EDIT'])) ||
      false;

    const isMySupplierRevokeEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SUPPLIERS_MY_SUPPLIERS_REVOKE']
        )) ||
      false;

    const isMySupplierDeactivateEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SUPPLIERS_MY_SUPPLIERS_DEACTIVATE']
        )) ||
      false;

    const isMySupplierLockEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights['SUPPLIERS_MY_SUPPLIERS_LOCK'])) ||
      false;

    const isMySupplierUnlockEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SUPPLIERS_MY_SUPPLIERS_UNLOCK']
        )) ||
      false;

    const isMySupplierDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights['SUPPLIERS_MY_SUPPLIERS_DOWNLOAD']
        )) ||
      false;
    const payeeName = consumerProfileInfo?.data
      ? `${consumerProfileInfo.data.firstName ?? ''} ${
          consumerProfileInfo.data.lastName ?? ''
        }`
      : '';

    return (
      <Box px={6}>
        <Grid container spacing={2} className={classes.firstGrid}>
          <Grid item xs>
            <Tile
              heading={t('componentData.mySupplier.Payees')}
              highlight={
                (supplierCounts &&
                  supplierCounts.totalConsumers &&
                  supplierCounts.totalConsumers
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')) ||
                0
              }
              entity={entityType.B2C}
              onClick={() => {
                this.resetFilterData();
              }}
              notClickable={true}
            />
          </Grid>
          {Object.keys(supplierCounts).length > 0 && (
            <Grid item xs={8} sm={8}>
              <Box>
                <StackBar
                  heading={t('componentData.mySupplier.PayeeOnboarding')}
                  weight={supplierCounts}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs>
            <Tile
              heading={t('componentData.mySupplier.PayeeUpdates')}
              highlight={
                supplierCounts && supplierCounts.consumerUpdates
                  ? supplierCounts.consumerUpdates
                  : '0'
              }
              onClick={() => {
                this.props.history.push(
                  `${config.baseName}/suppliers/supplierUpdates`
                );
              }}
              entity={entityType.B2C}
            />
          </Grid>
        </Grid>
        <Grid container xs={12} className={classes.root}>
          <Paper className={classes.paper}>
            <Grid
              container
              item
              xs={12}
              md={12}
              justify='flex-end'
              className={classes.gridItem}
            >
              <Box display='flex' justifyContent='flex-end' alignItems='center'>
                {isMySupplierDownloadEnabled && (
                  <Box pt={1}>
                    <ExportAsBtn
                      disabled={count <= 0}
                      onClick={(e) => {
                        this.setState({
                          showDownload: true,
                          showExportDownload: true,
                          anchorEl: e.currentTarget,
                        });
                      }}
                      btnName={t('componentData.mySupplier.ExportAs')}
                    />
                    {showExportDownload &&
                      this.renderDownloadOptions(showDownload)}
                  </Box>
                )}
                <Box pt={1}>
                  {isMySupplierRevokeEnabled && (
                    <Button
                      color='primary'
                      aria-label='Revoke'
                      title={t('componentData.mySupplier.Revoke')}
                      component='span'
                      className={classes.smallBtn}
                      onClick={() =>
                        selectedConsumerIds.length > 0
                          ? this.setState({
                              openRevokeDialog: true,
                            })
                          : null
                      }
                      disabled={canRevoke}
                    >
                      <img
                        src={require(`~/assets/icons/icon_undo.svg`)}
                        alt={t('componentData.mySupplier.undo')}
                        className={classes.imgIcon}
                      />
                      <Typography variant='h6' className={classes.iconGreyText}>
                        {t('componentData.mySupplier.Revoke')}
                      </Typography>
                    </Button>
                  )}
                </Box>

                <Box pt={1}>
                  {isMySupplierDeactivateEnabled && (
                    <Button
                      color='primary'
                      aria-label='Deactivate'
                      title={t('componentData.mySupplier.Deactivate')}
                      component='span'
                      className={classes.smallBtn}
                      onClick={() =>
                        selectedConsumerIds.length > 0
                          ? this.setState({
                              openDisapproveDialog: true,
                            })
                          : null
                      }
                      disabled={canDeactivate}
                    >
                      <img
                        src={require(`~/assets/icons/icon_close.svg`)}
                        alt={t('componentData.mySupplier.Deactivate')}
                        className={classes.imgIcon}
                      />
                      <Typography variant='h6' className={classes.iconGreyText}>
                        {t('componentData.mySupplier.Deactivate')}
                      </Typography>
                    </Button>
                  )}
                </Box>

                <Box pt={1}>
                  {isMySupplierLockEnabled && (
                    <Button
                      color='primary'
                      aria-label={t('componentData.mySupplier.Lock')}
                      title={t('componentData.mySupplier.Lock')}
                      component='span'
                      className={classes.smallBtn}
                      onClick={() =>
                        selectedConsumerIds.length > 0
                          ? this.setState({
                              openLockDialog: true,
                            })
                          : null
                      }
                      disabled={canLock}
                    >
                      <img
                        src={require(`~/assets/icons/icon_lock.svg`)}
                        alt={t('componentData.mySupplier.Lock')}
                        className={classes.imgIcon}
                      />
                      <Typography variant='h6' className={classes.iconGreyText}>
                        {t('componentData.mySupplier.Lock')}
                      </Typography>
                    </Button>
                  )}
                </Box>

                <Box pt={1}>
                  {isMySupplierUnlockEnabled && (
                    <Button
                      color='primary'
                      aria-label={t('componentData.mySupplier.Unlock')}
                      title={t('componentData.mySupplier.Unlock')}
                      component='span'
                      className={classes.smallBtn}
                      onClick={() =>
                        selectedConsumerIds.length > 0
                          ? this.setState({
                              openUnlockDialog: true,
                            })
                          : null
                      }
                      disabled={canUnlock}
                    >
                      <img
                        src={require(`~/assets/icons/icon_unlock.svg`)}
                        alt={t('componentData.mySupplier.Unlock')}
                        className={classes.imgIcon}
                      />
                      <Typography variant='h6' className={classes.iconGreyText}>
                        {t('componentData.mySupplier.Unlock')}
                      </Typography>
                    </Button>
                  )}
                </Box>

                <Box pt={1}>
                  <Button
                    color='primary'
                    aria-label='View'
                    title={t('componentData.mySupplier.ViewGridOrTable')}
                    component='span'
                    className={classes.smallBtn}
                    onClick={() => this.setState({ viewGrid: !viewGrid })}
                  >
                    <img
                      src={
                        viewGrid
                          ? require(`~/assets/icons/icon_grid.svg`)
                          : require(`~/assets/icons/icon_table.svg`)
                      }
                      alt={
                        viewGrid
                          ? t('componentData.mySupplier.ViewGrid')
                          : t('componentData.mySupplier.ViewTable')
                      }
                      className={classes.imgIcon}
                    />
                    <Typography variant='h6' className={classes.iconText}>
                      {viewGrid
                        ? t('componentData.mySupplier.ViewGrid')
                        : t('componentData.mySupplier.ViewTable')}
                    </Typography>
                  </Button>
                </Box>

                <Box pt={0.6} display='flex' alignItems='center'>
                  <label className={classes.smallBtn} color='primary'>
                    <Typography variant='h6' className={classes.iconText}>
                      {t(`componentData.supplierFilters.sortByPayee`)}
                    </Typography>
                  </label>
                  <TextField
                    select
                    variant='outlined'
                    size='small'
                    value={sortList.find((s) => s.selected === true).key}
                    onChange={(e) => this.handleSorting(e)}
                  >
                    {sortList &&
                      sortList.map((item) => (
                        <MenuItem
                          key={item.key}
                          selected={item.selected}
                          value={item.key}
                          style={{
                            transformOrigin: 'center bottom',
                            color: 'rgba(0, 0, 0, 0.6)',
                          }}
                        >
                          {t(`componentData.supplierFilters.${item.key}`)}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>

                <Box pt={1} pr={1}>
                  <Button
                    color='primary'
                    aria-label='View'
                    title={t('componentData.mySupplier.Filter')}
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
                      alt={t('componentData.mySupplier.ViewFilter')}
                      className={classes.imgIcon}
                    />
                    <Typography variant='h6' className={classes.iconText}>
                      {t('componentData.mySupplier.Filters')}
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid
              container
              item
              xs={12}
              md={12}
              justify='flex-start'
              className={classes.gridItem}
            >
              <Box display='flex' width='100%' justifyContent='flex-start'>
                <ChipFilter
                  list={filterList}
                  handleClickFilter={this.handleClickFilter}
                  selectedFilterItem={selectedFilterItem}
				  isListLoading={isListLoading || false}
                />
              </Box>
            </Grid>

            {isListLoading && viewGrid && (
              <CircularProgress
                color='primary'
                style={{ margin: '20px auto 0', display: 'block' }}
              />
            )}

            {!isListLoading &&
              viewGrid &&
              vendorsList &&
              vendorsList.length === 0 && (
                <Grid
                  container
                  style={{
                    padding: '10px 0',
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    style={{
                      position: 'absolute',
                      left: '48%',
                    }}
                  >
                    {t('componentData.mySupplier.NoResultsFound')}
                  </Grid>
                </Grid>
              )}

            {!isListLoading &&
              viewGrid &&
              vendorsList &&
              vendorsList.length > 0 && (
                <Grid
                  container
                  item
                  xs={12}
                  md={12}
                  className={classes.cardView}
                >
                  {vendorsList &&
                    vendorsList.map((vendor, index) => (
                      <Grid
                        key={`key-${index}`}
                        item
                        xs={12}
                        md={4}
                        style={{
                          padding: '10px 0',
                        }}
                      >
                        <Box mx={2}>
                          <Card
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              //if (isMySupplierEditEnabled) {
                              this.setState({
                                openVendorInformationDialog: true,
                                selectedVendor: vendor,
                              });
                              //}
                            }}
                          >
                            <div className={classes.cardContent}>
                              <span>
                                <input
                                  type='checkbox'
                                  name='vendor'
                                  style={{
                                    width: 18,
                                    height: 18,
                                  }}
                                  onChange={(e) =>
                                    this.handleVendorCheck(e, vendor)
                                  }
                                />
                              </span>
                              {vendor.enrollmentStatus && (
                                <span className={classes.floatRight}>
                                  <span
                                    className={`${classes.approvedText} ${classes.displayBlock}`}
                                    style={{
                                      background: theme.palette.primary.dark,
                                      color: '#fff',
                                      fontSize: 14,
                                      borderRadius: 2,
                                      letterSpacing: 'normal',
                                    }}
                                  >
                                    {vendor.enrollmentStatus}
                                  </span>
                                  <div
                                    style={{
                                      color: theme.palette.text.secondary,
                                      fontSize: 12,
                                    }}
                                    className={classes.alignCenter}
                                  >
                                    {vendor.enrollmentInitiatedAt}
                                    {/* {Boolean(vendor?.activatedAt)
                                    ? new Date(vendor.activatedAt)
                                      .toLocaleDateString(
                                        this.props.i18n.language,
                                        {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        }
                                      )
                                      .replace(/[^ -~]/g, "")
                                    : ""} */}
                                  </div>
                                </span>
                              )}
                              <div
                                style={{ color: theme.palette.primary.main }}
                                className={classes.cardTexts}
                              >
                                <span
                                  style={{
                                    background:
                                      theme.palette.background.default,
                                    color: theme.palette.primary.main,
                                  }}
                                  className={[classes.profileCircle]}
                                >
                                  {this.getProfileCircleName(
                                    vendor.displayName
                                  )}
                                </span>

                                <div
                                  className={classes.firstName}
                                  title={vendor.firstName}
                                >
                                  {vendor.displayName &&
                                  vendor.displayName.length > 20
                                    ? vendor.displayName.substring(0, 20) +
                                      '...'
                                    : vendor.displayName}
                                </div>

                                <div className={classes.alignCenter}>
                                  <span title={vendor.consumerIdentifier}>
                                    {vendor.consumerIdentifier &&
                                    vendor.consumerIdentifier.length > 10
                                      ? vendor.consumerIdentifier.substring(
                                          0,
                                          10
                                        ) + '...'
                                      : vendor.consumerIdentifier &&
                                        vendor.consumerIdentifier.length !== '0'
                                      ? vendor.consumerIdentifier
                                      : '-'}
                                  </span>
                                </div>

                                <div className={classes.smallTitle}>
                                  {' '}
                                  {t(
                                    'componentData.mySupplier.PaymentMethods'
                                  )}{' '}
                                </div>

                                <div>
                                  {Boolean(vendor.primaryPaymentMethodId)
                                    ? this.displayPaymentMethod(
                                        vendor.primaryPaymentMethodId
                                      )
                                    : null}
                                  {Boolean(vendor.secondaryPaymentMethodId)
                                    ? this.displayPaymentMethod(
                                        vendor.secondaryPaymentMethodId
                                      )
                                    : null}
                                </div>
                              </div>
                            </div>
                          </Card>
                        </Box>
                      </Grid>
                    ))}
                </Grid>
              )}
            {!viewGrid && (
              <Grid container item xs={12} md={12} className={classes.gridItem}>
                <Paper className={classes.root}>
                  <TableContainer className={classes.container}>
                    <Table style={{ minHeight: '75px' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            padding='checkbox'
                            align='left'
                            className={classes.supTable}
                          >
                            <input
                              type='checkbox'
                              name='vendor'
                              className={classes.checkBoxHeader}
                              onClick={this.handleSelectAll}
                              checked={selectAllCheck}
                            />
                          </TableCell>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align='left'
                              className={classes.supTable}
                            >
                              <Box
                                fontSize={16}
                                fontWeight='600'
                                color='rgba(18,18,18,0.87)'
                              >
                                {column.label !== '' &&
                                  (column.label !== 'Payment Methods'
                                    ? t(
                                        `componentData.mySupplier.${column.label}`
                                      )
                                    : t(
                                        `componentData.mySupplier.PaymentMethods`
                                      ))}
                              </Box>
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>

                      

                      {!isListLoading &&
                        vendorsList &&
                        vendorsList.length === 0 && (
                          <Grid
                            container
                            style={{
                              padding: '10px 0',
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              style={{
                                position: 'absolute',
                                left: '48%',
                              }}
                            >
                              {t('componentData.mySupplier.NoResultsFound')}
                            </Grid>
                          </Grid>
                        )}
                      <TableBody className={classes.bodyTextColor} key={'table-1'}>
                      {isListLoading ? (
                        <Box height={100}>
                          <CircularProgress
                            color='primary'
                            style={{
                              margin: '30px auto 0',
                              position: 'absolute',
                              left: '49%',
                            }}
                          />
                        </Box>
                      ):
                          vendorsList &&
                          vendorsList.map((vendor, index) => (
                            <TableRow
                              key={`list-${vendor.consumerIdentifier}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                //if (isMySupplierEditEnabled) {
                                this.setState({
                                  openVendorInformationDialog: true,
                                  selectedVendor: vendor,
                                });
                                //}
                              }}
                            >
                              <TableCell padding='checkbox'>
                                <Checkbox
                                  name='vendor'
                                  onChange={(e) =>
                                    this.handleVendorCheck(e, vendor)
                                  }
                                  checked={vendor.isChecked}
                                />
                              </TableCell>
                              <TableCell
                                align='left'
                                className={classes.textBold}
                                title={vendor.consumerIdentifier}
                              >
                                {vendor.consumerIdentifier &&
                                vendor.consumerIdentifier.length > 10
                                  ? vendor.consumerIdentifier.substring(0, 10) +
                                    '...'
                                  : vendor.consumerIdentifier &&
                                    vendor.consumerIdentifier.length !== '0'
                                  ? vendor.consumerIdentifier
                                  : '-'}
                              </TableCell>

                              <TableCell
                                align='left'
                                className={classes.textBold}
                                title={`${vendor.displayName}`}
                              >
                                {vendor.displayName &&
                                vendor.displayName.length > 20
                                  ? vendor.displayName.substring(0, 20) + '...'
                                  : vendor.displayName &&
                                    vendor.displayName.length !== '0'
                                  ? vendor.displayName
                                  : '-'}
                              </TableCell>

                              <TableCell
                                align='left'
                                className={classes.textBold}
                              >
                                {vendor.enrollmentStatus}
                              </TableCell>
                              <TableCell
                                align='left'
                                className={classes.textBold}
                              >
                                {vendor.enrollmentInitiatedAt}
                                {/* {Boolean(vendor.enrollmentInitiatedAt)
                                  ? new Date(vendor.enrollmentInitiatedAt)
                                    .toLocaleDateString(
                                      this.props.i18n.language,
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )
                                    .replace(/[^ -~]/g, "")
                                  : ""} */}
                              </TableCell>

                              <TableCell
                                align='left'
                                className={classes.textBold}
                              >
                                {vendor.consumerStatus}
                              </TableCell>

                              <TableCell
                                align='left'
                                className={classes.textBold}
                              >
                                {vendor.activatedAt}
                                {/* {vendor.consumerDetails?.activatedAt
                                  ? new Date(vendor.consumerDetails.activatedAt)
                                    .toLocaleDateString(
                                      this.props.i18n.language,
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )
                                    .replace(/[^ -~]/g, "")
                                  : ""} */}
                              </TableCell>

                              <TableCell
                                align='left'
                                className={classes.textBold}
                              >
                                <div>
                                  {Boolean(vendor.primaryPaymentMethodId)
                                    ? this.displayPaymentMethod(
                                        vendor.primaryPaymentMethodId
                                      )
                                    : null}
                                  {Boolean(vendor.secondaryPaymentMethodId)
                                    ? this.displayPaymentMethod(
                                        vendor.secondaryPaymentMethodId
                                      )
                                    : null}
                                </div>
                              </TableCell>
                              <TableCell
                                align='left'
                                className={classes.textBold}
                              >
                                {(vendor.isGuest === 0 &&
                                  isMySupplierEditEnabled &&
                                  [
                                    CONSUMER_CAMPAIGN_STATUS.CAMPAIGN_INITIATED,
                                    CONSUMER_CAMPAIGN_STATUS.CAMPAIGN_PENDING,
                                    CONSUMER_CAMPAIGN_STATUS.CAMPAIGN_COMPLETED,
                                  ].includes(vendor?.campaignStatusId) &&
                                  ![
                                    Consumer_Status.DELETED,
                                    Consumer_Status.REVOKED,
                                    Consumer_Status.DEACTIVATED,
                                  ].includes(vendor?.consumerStatusId) && (
                                    <EditIcon
                                      fontSize='small'
                                      className={classes.cursorPointer}
                                    />
                                  )) ||
                                  null}
                              </TableCell>
                            </TableRow>
                          )) }
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}

            <Grid container xs={12}>
              <Table>
                <StyledTableFooter>
                  <TableRow>
                    <TablePagination
                      labelRowsPerPage={
                        viewGrid
                          ? t('componentData.mySupplier.CardsPerPage')
                          : t('componentData.mySupplier.RowsPerPage')
                      }
                      rowsPerPageOptions={[10, 25, 50]}
                      component='div'
                      count={count}
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
                  </TableRow>
                </StyledTableFooter>
              </Table>
            </Grid>
          </Paper>
        </Grid>

        {openVendorInformationDialog && (
          <CustomDialog
            showButton={false}
            onConfirm={() => {
              this.setState({
                openVendorInformationDialog: false,
              });
              this.props.history.push({
                state: {
                  ...this.props.location.state,
                  selectedPayeeRemitToId: null,
                  payeeId: null,
                },
              });
            }}
            title={
              payeeName
                ? `${payeeName} ${t('componentData.mySupplier.Information')}`
                : t('componentData.mySupplier.PayeeNameInformation')
            }
            width='960px'
          >
            <B2CVendorInformation
              vendorDetail={this.state.selectedVendor}
              getAllVendorsList={this.getAllVendorsList}
              canEdit={isMySupplierEditEnabled}
              refreshListData={this.refreshListData}
              onConfirm={() => {
                this.setState({
                  openVendorInformationDialog: false,
                });
              }}
              setCompanyDetail={this.setCompanyDetail}
              {...this.props}
            />
          </CustomDialog>
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
            title={t('componentData.mySupplier.Filters')}
            icon={true}
            width='400px'
          >
            <SupplierFiltersB2C
              name={name}
              id={id}
              paymentList={paymentList}
              enrollmentOnly={enrollmentOnly}
              isImplementationProgSelected={isImplementationProgSelected}
              enrollmentStatusList={enrollmentStatusList}
              // status={status}
              payeeActivatedAt={payeeActivatedAt}
              enrollmentInitiatedAt={enrollmentInitiatedAt}
              selectedFilterItem={selectedFilterItem}
              filterList={filterList}
              onConfirm={() => {
                this.setState({
                  openFiltersSection: false,
                });
              }}
              handleChangeInput={(e) => {
                const { filterList } = this.state;

                e.target.name === 'status'
                  ? this.setState({
                      selectedFilterItem: filterList.find(
                        (s) => s.key === e.target.value
                      ),
                    })
                  : e.target.name === 'id'
                  ? this.setState({
                      [e.target.name]: e.target.value.replace(
                        /[^A-Za-z0-9-_+!@$~%* #';{}^.]/g,
                        ''
                      ),
                    })
                  : this.setState({
                      [e.target.name]: e.target.value,
                    });
              }}
              handlePayeeActivatedAt={(date) => {
                this.setState({
                  payeeActivatedAt: date.toLocaleDateString(),
                });
              }}
              handleEnrollmentInitiatedAt={(date) => {
                this.setState({
                  enrollmentInitiatedAt: date.toLocaleDateString(),
                });
              }}
              handlePaymentClickFilter={this.handlePaymentClickFilter}
              handleProgramClickFilter={this.handleProgramClickFilter}
              applySupplierFilter={this.applySupplierFilter}
              resetSupplierFilter={this.resetSupplierFilter}
            />
          </CustomDialog>
        )}
        {openRevokeDialog && (
          <InfoDialogue
            title={t('componentData.mySupplier.revokeConfirmation')}
            px={12}
            py={2.4}
            onCancel={() => {
              this.setState({
                openRevokeDialog: false,
              });
            }}
            onConfirm={() => this.handleRevoke()}
            confirmText={t('componentData.mySupplier.CONTINUE')}
            open={true}
          />
        )}
        {openDisapproveDialog && (
          <InfoDialogue
            title={t('componentData.mySupplier.deactiveConfirmation')}
            px={12}
            py={2.4}
            onCancel={() => {
              this.setState({
                openDisapproveDialog: false,
              });
            }}
            onConfirm={() => this.handleDeactivate()}
            confirmText={t('componentData.mySupplier.CONTINUE')}
            open={true}
          />
        )}
        {openLockDialog && (
          <InfoDialogue
            title={t('componentData.mySupplier.lockConfirmation')}
            px={12}
            py={2.4}
            onCancel={() => {
              this.setState({
                openLockDialog: false,
              });
            }}
            onConfirm={() => this.hanldeLock()}
            confirmText={t('componentData.mySupplier.CONTINUE')}
            open={true}
          />
        )}
        {openUnlockDialog && (
          <InfoDialogue
            title={t('componentData.mySupplier.unlockConfirmation')}
            px={12}
            py={2.4}
            onCancel={() => {
              this.setState({
                openUnlockDialog: false,
              });
            }}
            onConfirm={() => this.handleUnlock()}
            confirmText={t('componentData.mySupplier.CONTINUE')}
            open={true}
          />
        )}
        {error && (
          <Notification
            variant={variant}
            message={error}
            handleClose={this.handleNotificationClose}
            onClose={this.handleNotificationClose}
          />
        )}
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.role,
    ...state.permissions,
    ...state.clientConfig,
    ...state.consumerDetail,
    ...state.b2cConsumers,
    ...state.suppliers,
  }))(withStyles(styles)(MySupplierB2C))
);
