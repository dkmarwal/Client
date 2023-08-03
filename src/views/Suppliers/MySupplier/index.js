import React, { Component } from "react";
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
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/styles";
import Tile from "~/components/Tile";
import StackBar from "~/components/StackBar";
import { connect } from "react-redux";
import styles from "./styles";
import InfoDialogue from "~/components/InfoDialogue";
import * as XLSX from "xlsx";
import generatePDF from "~/modules/GeneratePDF/";
import * as FileSaver from "file-saver";
import EditIcon from "@material-ui/icons/Edit";
import ACH from "~/assets/icons/ACH_main.svg";
import VCA from "~/assets/icons/VCA_main.svg";
import CHK from "~/assets/icons/CHK_main.svg";
import EFT from "~/assets/icons/EFT_main.svg";
import WIRE from "~/assets/icons/WIRE_main.svg";
import CROSS from "~/assets/icons/Cross_main.svg";
import ACH_selected from "~/assets/icons/ACH_selected.svg";
import VCA_selected from "~/assets/icons/VCA_selected.svg";
import CHK_selected from "~/assets/icons/CHK_selected.svg";
import EFT_selected from "~/assets/icons/EFT_selected.svg";
import Cross_selected from "~/assets/icons/Cross_selected.svg";
import WIRE_selected from "~/assets/icons/WIRE_selected.svg";
// import CROSS_selected from '~/assets/icons/CROSS_selected.svg';
import Checkbox from "@material-ui/core/Checkbox";
import ExportAsBtn from "~/components/ExportAsBtn";
import { StyledTableFooter } from "~/components/StyledTable";
import ChipFilter from "~/components/Filter";
import {
  fetchSuppliersFilterChips,
  disapprovePayee,
  revokePayee,
  fetchSuppliersFilterList,
  fetchCustomFilter,
  fetchSuppliersCount,
  fetchExportSuppliersFilterList
} from "~/redux/helpers/suppliers";
import { CustomDialog } from "~/components/Dialogs";
import VendorInformation from "~/modules/vendorInformation";
import config from "~/config";
import SupplierFilters from "~/modules/SupplierFilters";
import Notification from "~/components/Notification";
import { accessRights } from "~/config/accessRights";
import { entityType } from '~/config/entityTypes'

class MySupplier extends Component {
  state = {
    isLoading: true,
    viewGrid: false,
    selectedVendor: {},
    selectedPayeeIds: [],
    selectedLinkIds: [],
    totalVendors: 0,
    fetchingList: true,
    page: 0,
    rowsPerPage: 10,
    filterOpen: false,
    error: false,
    variant: "error",
    vendorsList: [],
    vendorsExportList: [],
    selectedFilterItem: {},
    processing: false,
    filterList: [],
    customList: [],
    showExportDownload: false,
    openVendorInformationDialog: false,
    openFiltersSection: false,
    openRevokeDialog: false,
    openDisapproveDialog: false,
    name: "",
    id: "",
    location: "",
    count: 0,
    flag: 0,
    selectAllCheck: false,
    selectedVendorStatus: [],
    paymentList: [
      {
        id: "BANK_ACCOUNT",
        icon: ACH,
        iconSelected: ACH_selected,
        label: "Bank Account",
        selected: false,
      },
      {
        id: "EFT",
        icon: EFT,
        iconSelected: EFT_selected,
        label: "EFT",
        selected: false,
      },
      {
        id: "VIRTUAL_CARD",
        icon: VCA,
        iconSelected: VCA_selected,
        label: "Virtual Card",
        selected: false,
      },
      {
        id: "CHECK",
        icon: CHK,
        iconSelected: CHK_selected,
        label: "Check",
        selected: false,
      },
      {
        id: "WIRE",
        icon: WIRE,
        iconSelected: WIRE_selected,
        label: "Wire",
        selected: false,
      },
      {
        id: "CROSS_BORDER",
        icon: CROSS,
        iconSelected: Cross_selected,
        label: "Cross Border",
        selected: false,
      },
    ],
    programList: [
      { id: "FULL_PMTX", label: "Full PMTX", selected: false },
      { id: "ENROLL_ONLY", label: "Enrollment Only", selected: false },
    ],
    sortList: [
      { key: "updated_at", label: "Last Update Date", selected: true },
      { key: "asc", label: "Alphabetically: A to Z", selected: false },
      { key: "desc", label: "Alphabetically: Z to A", selected: false },
      { key: "created_at", label: "Enrollment Date", selected: false },
    ],
    sort: "updated_at",
    sortType: "asc",
    // status: "",
    showDownload: false,
    anchorEl: null,
    downloadProgress: false,
    supplierCounts: [],
    enrollmentOnly: false,
    isImplementationProgSelected: false,
  };

  componentDidMount() {
    this.prepareStackBarData();
    this.getCustomFilter();
    if (!this.props.history.location?.state?.selectedPayeeRemitToId) {
      this.fetchChipsFilterList();
      // this.getAllVendorsList();
      // In case the user coming from dashboard tile New Payee Approval.
      this.props.location.state === "isPayeeApprovedByClient"
        ? this.routeFromDashboard()
        : this.getAllVendorsList();
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
          name: "",
          id:
            this.props.history.location.state.selectedPayeeRemitToId ??
            "A45321",
          location: "",
          // paymentList: [],
          // programList: [],
          selectedFilterItem: { filterKey: "all" },
        },
        () => {
          this.applySupplierFilter();
        }
      );
    }
    // if(!this.state.openVendorInformationDialog && this.state.vendorsList.length){
    //   console.log('this.state.vendorsList.length',this.state.vendorsList.length)
    //    this.setState({
    //     openVendorInformationDialog: true,
    //     selectedVendor: {},
    //   });
    // }
  }

  setCompanyDetail = (venderDetail) => {
    this.setState({ selectedVendor: venderDetail });
  };

  routeFromDashboard() {
    this.callFilteredData("isPayeeApprovedByClient");
    if (this.props.location.vendor) {
      this.setState({
        openVendorInformationDialog: true,
        selectedVendor: this.props.location.vendor,
      });
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
      selectAllCheck: false,
    });
    const { selectedFilterItem } = this.state;
    this.callFilteredData(
      Object.keys(selectedFilterItem).length === 0
        ? "all"
        : selectedFilterItem.filterKey
    );
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: +event.target.value,
      page: 0,
      selectAllCheck: false,
    });
    const { selectedFilterItem } = this.state;
    this.callFilteredData(
      Object.keys(selectedFilterItem).length === 0
        ? "all"
        : selectedFilterItem.filterKey
    );
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
      location,
      paymentList,
      programList,
      selectedFilterItem,
      sort,
      sortType,
    } = this.state;
    let obj = paymentList.find((s) => s.selected === true);
    let obj1 = programList.find((s) => s.selected === true);

    const data = {
      name: name,
      id: id,
      location: location,
      paymentList: typeof obj === "undefined" ? "" : obj.id,
      programList: typeof obj1 === "undefined" ? "" : obj1.id,
      status: selectedFilterItem.filterKey,
      sort: sort,
      sortType: sortType,
    };
    const { userData } = this.props.user;
    fetchSuppliersFilterChips(userData.portalProfileId, data).then(
      (response) => {
        if (!response || response.error) {
          this.setState({
            error: response.message,
            variant: "error",
          });
          return false;
        }
        this.setState({
          filterList: response.data,
          selectedFilterItem:
            this.props.location.state === "isPayeeApprovedByClient"
              ? {
                  roleName: "Pending Approval",
                  count: 1,
                  filterKey: "isPayeeApprovedByClient",
                }
              : response.data &&
                response.data.find((s) =>
                  Object.keys(selectedFilterItem).length > 0
                    ? s.filterKey === selectedFilterItem.filterKey
                    : s.filterKey === "all"
                ),
        });
      }
    );
  };
  getCustomFilter = () => {
    const { userData } = this.props.user;
    fetchCustomFilter(userData.portalProfileId).then((response) => {
      if (!response) {
        this.setState({
          error: response.message,
          variant: "error",
        });
        return false;
      }
      const { paymentList, programList } = this.state;
      let payList = [],
        progList = [];
      response.data &&
        response.data.paymentTypes &&
        response.data.paymentTypes.map(function (list) {
          paymentList.map(function (item) {
            if (item.id == list.id) {
              payList = [...payList, item];
            }
          });
        });
      response.data &&
        response.data.implementationProgram &&
        response.data.implementationProgram.map(function (list) {
          programList.map(function (item) {
            if (item.id === list.id) {
              progList = [...progList, item];
            }
          });
        });

      this.setState({
        customList: response.data,
        paymentList: payList,
        programList: progList,
      });
    });
  };

  getExportVendorsList = () => {
    const {
      id,
      location,
      // status,
      paymentList,
      programList,
      selectedFilterItem,
    } = this.state;
    let obj = paymentList.find((s) => s.selected === true);
    let obj1 = programList.find((s) => s.selected === true);

    const data = {
      id: id,
      location: location,
      paymentList: typeof obj === "undefined" ? "" : obj.id,
      programList: typeof obj1 === "undefined" ? "" : obj1.id,
      status: selectedFilterItem.filterKey,
    };
    const { userData } = this.props.user;
    // const { page, rowsPerPage } = this.state;
    return fetchExportSuppliersFilterList(
      "",
      userData.portalProfileId,
      data
    );
    // }
  };

  getAllVendorsList = () => {
    this.setState(
      {
        vendorsList: [],
      },
      () => {
        const {
          name,
          id,
          location,
          paymentList,
          programList,
          page,
          rowsPerPage,
          selectedFilterItem,
          sort,
          sortType,
        } = this.state;
        let obj = paymentList.find((s) => s.selected === true);
        let obj1 = programList.find((s) => s.selected === true);

        const data = {
          name: name,
          id: id,
          location: location,
          paymentList: typeof obj === "undefined" ? "" : obj.id,
          programList: typeof obj1 === "undefined" ? "" : obj1.id,
          status: selectedFilterItem.filterKey,
          sort: sort,
          sortType: sortType,
        };
        const { userData } = this.props.user;
        // const { page, rowsPerPage } = this.state;
        fetchSuppliersFilterList(
          "",
          userData.portalProfileId,
          data,
          rowsPerPage,
          page
        ).then((response) => {
          this.showVendorsList(response);
        });
      }
    );
  };
  getFilteredList = (item) => {
    this.setState(
      {
        // fetchingList: true,
        vendorsList: [],
        // page: 0
      },
      () => {
        const {
          name,
          id,
          location,
          selectedFilterItem,
          paymentList,
          programList,
          page,
          rowsPerPage,
          sort,
          sortType,
        } = this.state;
        let obj = paymentList.find((s) => s.selected === true);
        let obj1 = programList.find((s) => s.selected === true);

        const data = {
          name: name,
          id: id,
          location: location,
          paymentList: typeof obj === "undefined" ? "" : obj.id,
          programList: typeof obj1 === "undefined" ? "" : obj1.id,
          status: selectedFilterItem.filterKey,
          sort: sort,
          sortType: sortType,
        };
        const { userData } = this.props.user;
        // const { page, rowsPerPage } = this.state;
        let key = "";
        switch (item) {
          case "isPayeeApprovedByClient":
            key = "isApprovalPending=true";
            break;
          case "approved":
            key = "isApproved=true";
            break;
          case "inProgress":
            key = "isProfileInprogress=true";
            break;
          case "pending":
            key = "isValidationPending=true";
            break;
          case "revoked":
            key = "isProfileRevoked=true";
            break;
          case "disapproved":
            key = "isProfileDisapproved=true";
            break;
          case "isUnableToValidate":
            key = "isUnableToValidate=true";
            break;
          case "isPendingProfileCompletion":
            key = "isPendingProfileCompletion=true";
            break;
          case "isPendingProfileCreation":
            key = "isPendingProfileCreation=true";
            break;
          case "isPendingProfileConfirmation":
            key = "isPendingProfileConfirmation=true";
            break;
          default:
            key = "";
            break;
        }
        fetchSuppliersFilterList(
          key,
          userData.portalProfileId,
          data,
          rowsPerPage,
          page
        ).then((response) => {
          this.showVendorsList(response);
        });
      }
    );
  };

  showVendorsList = (response) => {
    if (!response.error) {
      this.setState(
        {
          // error: response.message,
          // variant: "success",
          vendorsList:
            response.data && response.data.rows && response.data.rows.length > 0
              ? response.data.rows.map((item, i) => ({
                  ...item,
                  isChecked: false,
                }))
              : [],
          fetchingList: false,
          count: response.data && response.data.count ? response.data.count : 0,
          // page: 0,
        },
        () => {
          if (
            this.props.history.location?.state?.selectedPayeeRemitToId &&
            !this.state.openVendorInformationDialog
          ) {
            let selectedVendorData = response.data?.rows[0]
            if(response.data?.rows?.length > 1){
              selectedVendorData = response.rows.find((item)=>{
                return item.consumerId === this.props.history.location?.state?.payeeId
              })??response.rows[0]
            }
            this.setState({
              openVendorInformationDialog: true,
              selectedVendor: selectedVendorData,
            });
          }
          this.prepareStackBarData();
        }
      );
      return false;
    } else if (!response || response.error) {
              this.setState({
                error: response.message,
                variant: "error",
                fetchingList: false,
              })
              return false;
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
        // status: Object.keys(selectedFilterItem).length > 0 ? selectedFilterItem.filterKey : ""
      },
      () => {
        this.callFilteredData(item.filterKey);
      }
    );
  };
  callFilteredData = (item) => {
    switch (item) {
      case "isPayeeApprovedByClient":
      case "approved":
      case "inProgress":
      case "pending":
      case "revoked":
      case "disapproved":
      case "isUnableToValidate":
      case "isPendingProfileCompletion":
      case "isPendingProfileCreation":
      case "isPendingProfileConfirmation":
        this.getFilteredList(item);
        break;
      case "all":
        this.fetchChipsFilterList();
        this.getAllVendorsList();
        break;
      default:
        this.fetchChipsFilterList();
        this.getAllVendorsList();
        break;
    }
  };
  handleVendorCheck(e, vendor) {
    let {
      selectedPayeeIds,
      selectedLinkIds,
      vendorsList,
      selectedFilterItem,
      flag,
      selectedVendorStatus,
    } = this.state;

    let revokedArr = [
        "Pending Profile Confirmation",
        "Pending Profile Completion",
        "Approved",
        "Unable To Validate",
        "Confirmation du profil en attente",
        "En attente de fin du profil",
        "Approuvé",
        "Impossible de valider",
      ],
      disapprovedArr = [
        "Pending",
        "Pending Approval",
        "Validation en attente",
        "En attente de validation",
      ];
    let flagStatus = flag;
    if (e.target.checked) {
      selectedPayeeIds = [...selectedPayeeIds, vendor.payeeId];
      selectedLinkIds = [...selectedLinkIds, vendor.clientPayeeLinkId];
      selectedVendorStatus = [
        ...selectedVendorStatus,
        vendor.profileStatus && vendor.profileStatus.description,
      ];
    } else {
      let arr = selectedPayeeIds.filter((item) => item !== vendor.payeeId);
      selectedPayeeIds = arr;

      let linkIdArr = selectedLinkIds.filter(
        (item) => item !== vendor.clientPayeeLinkId
      );
      selectedLinkIds = linkIdArr;

      // let statusArr = selectedVendorStatus.splice(
      //   selectedVendorStatus.indexOf(
      //     vendor.profileStatus && vendor.profileStatus.description
      //   ),
      //   1
      // );
      // selectedVendorStatus = statusArr;
    }

    if (selectedFilterItem.filterKey === "all") {
      if (selectedPayeeIds.length === 0 || e.target.checked === false) {
        flagStatus = 0;
        this.setState({ flag: 0 });
      }
      for (let i = 0; i < selectedVendorStatus.length; i++) {
        if (revokedArr.includes(selectedVendorStatus[i])) {
          if (flagStatus === 0) {
            this.setState({ flag: 1 });
          }
        } else if (disapprovedArr.includes(selectedVendorStatus[i])) {
          if (flagStatus === 0) {
            this.setState({ flag: 2 });
          }
        } else {
          this.setState({ flag: 3 });
        }
      }
    }

    this.setState({
      openVendorInformationDialog: false,
      selectedVendor: vendor,
      selectedPayeeIds: selectedPayeeIds,
      selectedLinkIds: selectedLinkIds,
      selectedVendorStatus: selectedVendorStatus,
      vendorsList: vendorsList.map((item, i) =>
        item.payeeId === vendor.payeeId
          ? {
              ...item,
              isChecked: e.target.checked,
            }
          : item
      ),
    });
  }
  handleSelectAll = (e) => {
    const {
      vendorsList,
      selectedFilterItem,
      flag,
    } = this.state;
    let payeesIds = [],
      linkIds = [];
    if (e.target.checked) {
      vendorsList.map(function (item, index) {
        if (item.payeeId !== null) {
          payeesIds.push(item.payeeId);
          linkIds.push(item.clientPayeeLinkId);
        }
      });
    }
    this.setState({
      vendorsList: e.target.checked
        ? vendorsList.map((item, i) =>
            item.payeeId !== null
              ? {
                  ...item,
                  isChecked: true,
                }
              : {
                  ...item,
                  isChecked: false,
                }
          )
        : vendorsList.map((item, i) => ({
            ...item,
            isChecked: false,
          })),
      selectAllCheck: e.target.checked,
      selectedVendor: e.target.checked
        ? vendorsList.map((item, i) =>
            item.payeeId !== null
              ? {
                  ...item,
                  isChecked: true,
                }
              : {
                  ...item,
                  isChecked: false,
                }
          )
        : vendorsList.map((item, i) => ({
            ...item,
            isChecked: false,
          })),
      selectedPayeeIds: payeesIds,
      selectedLinkIds: linkIds,
      flag: selectedFilterItem.filterKey === "all" ? 0 : flag,
    });
  };
  handleDisapprove = () => {
    const { userData } = this.props.user;
    const { t } = this.props;
    const { selectedPayeeIds, selectedLinkIds, selectedFilterItem } =
      this.state;
    if (selectedPayeeIds.length > 0) {
      this.setState(
        {
          fetchingList: true,
          page: 0,
          // selectedFilterItem: {},
          flag: 0,
          openDisapproveDialog: false,
          selectedPayeeIds: [],
          error:
            selectedPayeeIds.length > 1
              ? `${t("componentData.mySupplier.PayeesDisapprovedSuccessfully")}`
              : t("componentData.mySupplier.PayeeDisapprovedSuccessfully"),
          variant: "success",
        },
        () => {
          disapprovePayee(userData.portalProfileId, {
            payeeIds: selectedPayeeIds,
            linkIds: selectedLinkIds,
          }).then((response) => {
            this.setState({ processing: false });
            this.fetchChipsFilterList();
            if (Object.keys(selectedFilterItem).length > 0) {
              this.getFilteredList(selectedFilterItem.filterKey);
            } else {
              this.fetchChipsFilterList();
              this.getAllVendorsList();
            }
          });
        }
      );
    }
  };
  handleRevoke = () => {
    const { userData } = this.props.user;
    const { t } = this.props;
    const { selectedPayeeIds, selectedLinkIds, selectedFilterItem } =
      this.state;
    if (selectedPayeeIds.length > 0) {
      this.setState(
        {
          fetchingList: true,
          page: 0,
          // selectedFilterItem: {},
          selectedPayeeIds: [],
          openRevokeDialog: false,
          error:
            selectedPayeeIds.length > 1
              ? t("componentData.mySupplier.PayeesRevokedSuccessfully")
              : t("componentData.mySupplier.PayeeRevokedSuccessfully"),
          variant: "success",
          flag: 0,
        },
        () => {
          revokePayee(userData.portalProfileId, {
            payeeIds: selectedPayeeIds,
            linkIds: selectedLinkIds,
          }).then((response) => {
            this.setState({ processing: false });
            this.fetchChipsFilterList();
            if (Object.keys(selectedFilterItem).length > 0) {
              this.getFilteredList(selectedFilterItem.filterKey);
            } else {
              this.fetchChipsFilterList();
              this.getAllVendorsList();
            }
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
    const { programList, paymentList } = this.state;

    this.setState(
      {
        enrollmentOnly: item.id === "ENROLL_ONLY" ? !item.selected : false,
        programList: programList.map((list, i) =>
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
        paymentList: paymentList.map((list) => {
          return {
            ...list,
            selected: false,
          };
        }),
      },
      () => {
        this.setState({
          isImplementationProgSelected: this.state.programList
            .map((list) => list.selected)
            .some((value) => value),
        });
      }
    );
  };
  handleSorting = (e) => {
    const { sortList } = this.state;
    let sortValue = "",
      sortTypeValue = "";
    switch (e.target.value) {
      case "updated_at":
        sortValue = "updated_at";
        sortTypeValue = "asc";
        break;
      case "asc":
        sortValue = "payee_name";
        sortTypeValue = "asc";
        break;
      case "desc":
        sortValue = "payee_name";
        sortTypeValue = "desc";
        break;
      case "created_at":
        sortValue = "created_at";
        sortTypeValue = "desc";
        break;
      default:
        sortValue = "updated_at";
        sortTypeValue = "asc";
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
        // vendorsList: [],
        page: 0,
      },
      () => {
        const {
          name,
          id,
          location,
          // status,
          paymentList,
          programList,
          page,
          rowsPerPage,
          selectedFilterItem,
          sort,
          sortType,
        } = this.state;
        let obj = paymentList.find((s) => s.selected === true);
        let obj1 = programList.find((s) => s.selected === true);

        const data = {
          name: name,
          id: id,
          location: location,
          paymentList: typeof obj === "undefined" ? "" : obj.id,
          programList: typeof obj1 === "undefined" ? "" : obj1.id,
          status: selectedFilterItem.filterKey,
          sort: sort,
          sortType: sortType,
        };
        const { userData } = this.props.user;
        fetchSuppliersFilterList(
          "",
          userData.portalProfileId,
          data,
          rowsPerPage,
          page
        ).then((response) => {
          this.fetchChipsFilterList();
          this.showVendorsList(response);
        });
      }
    );
  };
  resetSupplierFilter = (e) => {
    const { paymentList, programList, filterList } = this.state;
    this.setState(
      {
        //fetchingList: true,
        // openFiltersSection: false,
        name: "",
        id: "",
        location: "",
        page: 0,
        paymentList: paymentList.map((list) => {
          return {
            ...list,
            selected: false,
          };
        }),
        programList: programList.map((list) => {
          return {
            ...list,
            selected: false,
          };
        }),
        selectedFilterItem: filterList.find((s) =>
          this.props.location && this.props.location.selectedChip === undefined
            ? s.filterKey === "all"
            : (s.filterKey =
                this.props.location && this.props.location.selectedChip)
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
        .join("")
        .match(/(^\S|\S$)?/g)
        .join("")
        .toUpperCase();
    return newName;
  }
  closeApproveVendorDetails = () => {
    const { selectedVendor } = this.state;
    const { t } = this.props;
    this.setState({
      openVendorInformationDialog: false,
      page: 0,
      error: `${(selectedVendor && selectedVendor.companyName) || ""} ${t(
        "componentData.mySupplier.ApprovedSuccessfully"
      )}`,
      variant: "success",
    });
    this.fetchChipsFilterList();
    this.getAllVendorsList();
    this.prepareStackBarData();
  };
  closeSaveVendorDetails = () => {
    const { selectedVendor } = this.state;
    const { t } = this.props;
    this.setState({
      openVendorInformationDialog: false,
      page: 0,
      error: `${(selectedVendor && selectedVendor.companyName) || ""} ${t(
        "componentData.mySupplier.informationSavedSuccessfully"
      )}`,
      variant: "success",
    });
    this.fetchChipsFilterList();
    this.getAllVendorsList();
    this.prepareStackBarData();
  };
  closeDisapproveVendorDetails = () => {
    const { selectedVendor } = this.state;
    const { t } = this.props;
    this.setState({
      openVendorInformationDialog: false,
      page: 0,
      error: `${(selectedVendor && selectedVendor.companyName) || ""} ${t(
        "componentData.mySupplier.disapprovedSuccessfully"
      )}`,
      variant: "success",
    });
    this.fetchChipsFilterList();
    this.getAllVendorsList();
    this.prepareStackBarData();
  };
  handleDownloadCSV = async () => {
    const { t } = this.props;
    this.setState(
      {
        variant: "success",
        error: t("componentData.mySupplier.downloadFile"),
        showExportDownload: false,
      },
      () => {
        this.getExportVendorsList().then((response) => {
          // this.showVendorsList(response);
          const fileType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
          const date = Date().split(" ");
          // we use a date string to generate our filename.
          const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
          const fileName = `supplier_list_${dateStr}.xlsx`;
          const { roleName } = this.state.selectedFilterItem;
          const vendorsExportList =
            response && response["data"] && response["data"]["rows"];
          this.setState(
            {
              downloadProgress: true,
            },
            () => {
              if (vendorsExportList && vendorsExportList.length > 0) {
                const tableColumn = [
                  t("componentData.mySupplier.PayeeName"),
                  t("componentData.mySupplier.PayeeID"),
                  t("componentData.mySupplier.LocationTxt"),
                  t("componentData.mySupplier.PaymentMethods"),
                  t("componentData.mySupplier.StatusTxt"),
                ];
                // define an empty array of rows
                const tableRows = [];
                // for each account pass all its data into an array
                vendorsExportList.forEach((field) => {
                  // const data = {
                  //   "Payee Name": field.companyName,
                  //   "Payee ID": field.linkEntityIdentifier,
                  //   Location:
                  //     (field.payeeLocations && field.payeeLocations.city) +
                  //     "," +
                  //     (field.payeeLocations && field.payeeLocations.state),
                  //   "Payment Methods": field.paymentMethod.join(","),
                  //   Status:
                  //     field.profileStatus && field.profileStatus.description,
                  // };


                  if (
                    field.profileStatus.description === roleName ||
                    roleName.replace(/ /g, "").toLowerCase() === "allpayees"
                  ) {
                    const data = {};
                    data[t("componentData.mySupplier.PayeeName")] =
                      field.companyName;
                    data[t("componentData.mySupplier.PayeeID")] =
                      field.linkEntityIdentifier;
                    data[t("componentData.mySupplier.LocationTxt")] =
                      (field.payeeLocations && field.payeeLocations.city) +
                      "," +
                      (field.payeeLocations && field.payeeLocations.state);
                    data[t("componentData.mySupplier.PaymentMethods")] =
                      field.paymentMethod.join(",");
                    data[t("componentData.mySupplier.StatusTxt")] =
                      field.profileStatus && field.profileStatus.description;

                    //push each data info into a row
                    tableRows.push(data);
                  }
                });

                const payeeTitle = t("componentData.mySupplier.PayeeList");
                const ws = XLSX.utils.json_to_sheet(tableRows);
                const wb = {
                  Sheets: {},
                  SheetNames: [payeeTitle],
                };
                wb.Sheets[payeeTitle] = ws;

                const excelBuffer = XLSX.write(wb, {
                  bookType: "xlsx",
                  type: "array",
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
        variant: "success",
        error: t("componentData.mySupplier.downloadFile"),
        showExportDownload: false,
      },
      () => {
        this.getExportVendorsList().then((response) => {
          // this.showVendorsList(response);
          const { roleName } = this.state.selectedFilterItem;
          const vendorsExportList =
            response && response["data"] && response["data"]["rows"];
          this.setState(
            {
              downloadProgress: true,
            },
            () => {
              if (vendorsExportList && vendorsExportList.length > 0) {
                const tableColumn = [
                  t("componentData.mySupplier.PayeeName"),
                  t("componentData.mySupplier.PayeeID"),
                  t("componentData.mySupplier.LocationTxt"),
                  t("componentData.mySupplier.PaymentMethods"),
                  t("componentData.mySupplier.StatusTxt"),
                ];
                // define an empty array of rows
                const tableRows = [];
                // for each account pass all its data into an array
                vendorsExportList.forEach((field) => {
                  if (
                    field.profileStatus.description === roleName ||
                    roleName.replace(/ /g, "").toLowerCase() === "allpayees"
                  ) {
                    const data = [
                      field.companyName,
                      field.linkEntityIdentifier,
                      (field.payeeLocations && field.payeeLocations.city) +
                        "," +
                        (field.payeeLocations && field.payeeLocations.state),
                      field.paymentMethod.join(","),
                      field.profileStatus && field.profileStatus.description,
                    ];

                    //push each data info into a row
                    tableRows.push(data);
                  }
                });
                const title = t("componentData.mySupplier.PayeeList");
                const date = Date().split(" ");
                // we use a date string to generate our filename.
                const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
                const fileName = `supp_lst_${dateStr}.pdf`;
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
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={showDownload}
        onClose={() => this.setState({ showDownload: false, anchorEl: null })}
      >
        <MenuItem onClick={() => this.handleDownloadCSV()}>.XLSX</MenuItem>
        <MenuItem onClick={() => this.handleDownloadPDF()}>.PDF</MenuItem>
      </Menu>
    );
  };
  getApprovedDate = (d) => {
    const { t } = this.props;
    if (d > 365) {
      return Math.floor(d / 365) === 1
        ? `${Math.floor(d / 365)} ${t("componentData.mySupplier.YearAgo")}`
        : `${Math.floor(d / 365)} ${t("componentData.mySupplier.YearsAgo")}`;
    } else if (d > 30) {
      return Math.floor(d / 30) === 1
        ? `${Math.floor(d / 30)} ${t("componentData.mySupplier.MonthAgo")}`
        : `${Math.floor(d / 30)} ${t("componentData.mySupplier.MonthsAgo")}`;
    } else {
      return `${d} ${t("componentData.mySupplier.daysAgo")}`;
    }
  };
  handleNotificationClose = () => {
    this.setState({
      error: null,
    });
  };
  render() {
    const { theme } = this.props.clientConfig.layout;
    const { classes, user, t } = this.props;
    const { showExportDownload } = this.state;
    const {
      filterList,
      customList,
      selectedFilterItem,
      openVendorInformationDialog,
      openFiltersSection,
      vendorsList,
      viewGrid,
      rowsPerPage,
      page,
      name,
      id,
      location,
      paymentList,
      programList,
      error,
      variant,
      fetchingList,
      showDownload,
      supplierCounts,
      count,
      flag,
      selectedPayeeIds,
      selectAllCheck,
      openRevokeDialog,
      openDisapproveDialog,
      sortList,
      enrollmentOnly,
      isImplementationProgSelected,
    } = this.state;
    const columns = [
      { id: "name", label: "Payee Name" },
      { id: "id", label: "Payee ID" },
      { id: "location", label: "Location" },
      { id: "payment", label: "Payment Methods" },
      { id: "status", label: "Status" },
      { id: "edit_icon", label: "" },
    ];
    if (fetchingList) {
      return (
        <Box className="loader-container">
          <CircularProgress color="primary" />
        </Box>
      );
    }

    const isMySupplierEditEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_EDIT"])) ||
      false;
    const isMySupplierRevokeEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_MY_SUPPLIERS_REVOKE"]
        )) ||
      false;
  
    const isMySupplierRejectEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_MY_SUPPLIERS_REJECT"]
        )) ||
      false;
    const isMySupplierDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(
          accessRights["SUPPLIERS_MY_SUPPLIERS_DOWNLOAD"]
        )) ||
      false;
    return (
      <Box px={6}>
        <Grid container spacing={2} className={classes.firstGrid}>
          <Grid item xs>
            <Tile
              heading={t("componentData.mySupplier.Payees")}
              highlight={
                (supplierCounts &&
                  supplierCounts[0] &&
                  supplierCounts[0].totalCount &&
                  supplierCounts[0].totalCount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")) ||
                0
              }
              entity={entityType.B2B}
			  notClickable={true}
            />
          </Grid>
          {supplierCounts && supplierCounts[0] && (
            <Grid item xs={6} sm={6}>
              <Box>
                <StackBar
                  heading={t("componentData.mySupplier.PayeeOnboarding")}
                  weight={supplierCounts[0]}
                />
              </Box>
            </Grid>
          )}
          <Grid item xs>
            <Tile
              heading={t("componentData.mySupplier.PayeeUpdates")}
              highlight={ supplierCounts &&
                supplierCounts[0] && supplierCounts[0].supplierUpdatesCount
                  ? supplierCounts[0].supplierUpdatesCount
                  : "0"
              }
              onClick={() => {
                this.props.history.push(
                  `${config.baseName}/suppliers/supplierUpdates`
                );
              }}
              entity={entityType.B2B}
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
              justify="flex-end"
              className={classes.gridItem}
            >
              <Box display="flex" justifyContent="flex-end">
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
                      btnName={t("componentData.mySupplier.ExportAs")}
                    />
                    {showExportDownload &&
                      this.renderDownloadOptions(showDownload)}
                  </Box>
                )}
                <Box pt={1}>
                  {isMySupplierRevokeEnabled && (
                    <Button
                      color="primary"
                      aria-label="Revoke"
                      title={t("componentData.mySupplier.Revoke")}
                      component="span"
                      className={classes.smallBtn}
                      onClick={() =>
                        selectedPayeeIds.length > 0
                          ? this.setState({
                              openRevokeDialog: true,
                            })
                          : null
                      }
                      disabled={
                        (selectedFilterItem && Object.keys(selectedFilterItem).length > 0 &&
                          (selectedFilterItem.filterKey === "approved" ||
                            selectedFilterItem.filterKey ===
                              "isPendingProfileConfirmation" ||
                            selectedFilterItem.filterKey ===
                              "isPendingProfileCompletion" ||
                            selectedFilterItem.filterKey ===
                              "isUnableToValidate")) ||
                        flag === 1
                          ? false
                          : true
                      }
                    >
                      <img
                        src={require(`~/assets/icons/icon_undo.svg`)}
                        alt={t("componentData.mySupplier.undo")}
                        className={classes.imgIcon}
                      />
                      <Typography variant="h6" className={classes.iconGreyText}>
                        {t("componentData.mySupplier.Revoke")}
                      </Typography>
                    </Button>
                  )}
                </Box>
                <Box pt={1}>
                  {isMySupplierRejectEnabled && (
                    <Button
                      color="primary"
                      aria-label="Disapprove"
                      title={t("componentData.mySupplier.Disapprove")}
                      component="span"
                      className={classes.smallBtn}
                      onClick={() =>
                        selectedPayeeIds.length > 0
                          ? this.setState({
                              openDisapproveDialog: true,
                            })
                          : null
                      }
                      disabled={
                        (Object.keys(selectedFilterItem).length > 0 &&
                          (selectedFilterItem.filterKey === "pending" ||
                            selectedFilterItem.filterKey ===
                              "isPayeeApprovedByClient")) ||
                        flag === 2
                          ? false
                          : true
                      }
                    >
                      <img
                        src={require(`~/assets/icons/icon_close.svg`)}
                        alt={t("componentData.mySupplier.Disapprove")}
                        className={classes.imgIcon}
                      />
                      <Typography variant="h6" className={classes.iconGreyText}>
                        {t("componentData.mySupplier.Disapprove")}
                      </Typography>
                    </Button>
                  )}
                </Box>
                <Box pt={1}>
                  <Button
                    color="primary"
                    aria-label="View"
                    title={t("componentData.mySupplier.ViewGridOrTable")}
                    component="span"
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
                          ? t("componentData.mySupplier.ViewGrid")
                          : t("componentData.mySupplier.ViewTable")
                      }
                      className={classes.imgIcon}
                    />
                    <Typography variant="h6" className={classes.iconText}>
                      {viewGrid
                        ? t("componentData.mySupplier.ViewGrid")
                        : t("componentData.mySupplier.ViewTable")}
                    </Typography>
                  </Button>
                </Box>
                <Box pt={0.6} display="flex" alignItems="center">
                  <label className={classes.smallBtn} color="primary">
                    <Typography variant="h6" className={classes.iconText}>
                      {t(`componentData.supplierFilters.sortByPayee`)}
                    </Typography>
                  </label>
                  <TextField
                    select
                    variant="outlined"
                    size="small"
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
                            transformOrigin: "center bottom",
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                        >
                          {t(`componentData.supplierFilters.${item.key}`)}
                        </MenuItem>
                      ))}
                  </TextField>
                </Box>
                <Box pt={1} pr={1}>
                  <Button
                    color="primary"
                    aria-label="View"
                    title={t("componentData.mySupplier.Filter")}
                    component="span"
                    className={classes.smallBtn}
                    onClick={() => {
                      this.setState({
                        openFiltersSection: true,
                      });
                    }}
                  >
                    <img
                      src={require(`~/assets/icons/icon_filter.svg`)}
                      alt={t("componentData.mySupplier.ViewFilter")}
                      className={classes.imgIcon}
                    />
                    <Typography variant="h6" className={classes.iconText}>
                      {t("componentData.mySupplier.Filters")}
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
              justify="flex-start"
              className={classes.gridItem}
            >
              <Box display="flex" width="100%" justifyContent="flex-start">
                <ChipFilter
                  list={filterList}
                  handleClickFilter={this.handleClickFilter.bind(this)}
                  selectedFilterItem={selectedFilterItem}
                />
              </Box>
            </Grid>
            {viewGrid && vendorsList && vendorsList.length === 0 && (
              <Grid
                container
                style={{
                  padding: "10px 0",
                }}
              >
                <Grid
                  item
                  xs={12}
                  style={{
                    position: "absolute",
                    left: "48%",
                  }}
                >
                  {t("componentData.mySupplier.NoResultsFound")}
                </Grid>
              </Grid>
            )}

            {viewGrid && vendorsList && vendorsList.length > 0 && (
              <Grid container item xs={12} md={12} className={classes.cardView}>
                {vendorsList &&
                  vendorsList.map((vendor) => (
                    <Grid
                      item
                      xs={12}
                      md={4}
                      style={{
                        padding: "10px 0",
                      }}
                    >
                      <Box mx={2}>
                        <Card
                          style={{ cursor: "pointer" }}
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
                                type="checkbox"
                                name="vendor"
                                style={{
                                  width: 18,
                                  height: 18,
                                }}
                                onChange={(e) =>
                                  this.handleVendorCheck(e, vendor)
                                }
                                disabled={
                                  vendor.payeeId === null ? true : false
                                }
                              />
                            </span>
                            {vendor.profileStatus && (
                              <span className={classes.floatRight}>
                                <span
                                  className={`${classes.approvedText} ${classes.displayBlock}`}
                                  style={{
                                    background: theme.palette.primary.dark,
                                    color: "#fff",
                                    fontSize: 14,
                                    borderRadius: 2,
                                    letterSpacing: "normal",
                                  }}
                                >
                                  {vendor.profileStatus.description}
                                </span>
                                <div
                                  style={{
                                    color: theme.palette.text.secondary,
                                    fontSize: 12,
                                  }}
                                  className={classes.alignCenter}
                                >
                                  {vendor.profileStatus && (
                                    <>
                                      {vendor.profileStatus.updatedAgo &&
                                      vendor.profileStatus.updatedAgo > 0 ? (
                                        <>
                                          {"- "}
                                          {this.getApprovedDate(
                                            vendor.profileStatus.updatedAgo
                                          )}
                                        </>
                                      ) : (
                                        ` - ${t(
                                          "componentData.mySupplier.todayTxt"
                                        )}`
                                      )}
                                    </>
                                  )}
                                </div>
                              </span>
                            )}
                            <div
                              style={{ color: theme.palette.primary.main }}
                              className={classes.cardTexts}
                            >
                              <span
                                style={{
                                  background: theme.palette.background.default,
                                  color: theme.palette.primary.main,
                                }}
                                className={[classes.profileCircle]}
                              >
                                {this.getProfileCircleName(vendor.companyName)}
                              </span>
                              <div
                                className={classes.supplierName}
                                title={vendor.companyName}
                              >
                                {vendor.companyName &&
                                vendor.companyName.length > 20
                                  ? vendor.companyName.substring(0, 20) + "..."
                                  : vendor.companyName}
                              </div>
                              <div className={classes.alignCenter}>
                                <span title={vendor.linkEntityIdentifier}>
                                  {vendor.linkEntityIdentifier &&
                                  vendor.linkEntityIdentifier.length > 10
                                    ? vendor.linkEntityIdentifier.substring(
                                        0,
                                        10
                                      ) + "..."
                                    : vendor.linkEntityIdentifier &&
                                      vendor.linkEntityIdentifier.length !== "0"
                                    ? vendor.linkEntityIdentifier
                                    : "-"}
                                </span>
                                <span
                                  className={classes.marginHorizontal}
                                >{` | `}</span>
                                <span>
                                  {vendor.payeeLocations &&
                                    vendor.payeeLocations.city}
                                  {", "}
                                  {vendor.payeeLocations &&
                                    vendor.payeeLocations.state}
                                </span>
                              </div>
                              <div className={classes.smallTitle}>
                                {" "}
                                {t(
                                  "componentData.mySupplier.PaymentMethods"
                                )}{" "}
                              </div>
                              <div className="">
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes("ACH") && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/ACH_main.svg`)}
                                        alt={t("componentData.mySupplier.ACH")}
                                        title={t(
                                          "componentData.mySupplier.BANK_ACCOUNT"
                                        )}
                                      />
                                    </span>
                                  )}
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes("CHK") && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/CHK_main.svg`)}
                                        alt={t(
                                          "componentData.mySupplier.CHECK"
                                        )}
                                        title={t(
                                          "componentData.mySupplier.CHECK"
                                        )}
                                      />
                                    </span>
                                  )}
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes("VCA") && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/VCA_main.svg`)}
                                        alt={t("componentData.mySupplier.VCA")}
                                        title={t(
                                          "componentData.mySupplier.VIRTUAL_CARD"
                                        )}
                                      />
                                    </span>
                                  )}
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes("WIRE") && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/WIRE_main.svg`)}
                                        alt={t("componentData.mySupplier.WIRE")}
                                        title={t(
                                          "componentData.mySupplier.Wire"
                                        )}
                                      />
                                    </span>
                                  )}
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes(
                                    "CROSS_BORDER"
                                  ) && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/Cross_main.svg`)}
                                        alt={t(
                                          "componentData.mySupplier.CROSS_BORDER"
                                        )}
                                        title={t(
                                          "componentData.mySupplier.CROSS_BORDER"
                                        )}
                                      />
                                    </span>
                                  )}
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
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            padding="checkbox"
                            align="left"
                            className={classes.supTable}
                          >
                            <input
                              type="checkbox"
                              name="vendor"
                              className={classes.checkBoxHeader}
                              onClick={this.handleSelectAll}
                              checked={selectAllCheck}
                            />
                          </TableCell>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align="left"
                              className={classes.supTable}
                            >
                              <Box
                                fontSize={16}
                                fontWeight="600"
                                color="rgba(18,18,18,0.87)"
                              >
                                {column.label !== "" &&
                                  (column.label !== "Payment Methods"
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
                      {vendorsList && vendorsList.length === 0 && (
                        <Grid
                          container
                          style={{
                            padding: "10px 0",
                          }}
                        >
                          <Grid
                            item
                            xs={12}
                            style={{
                              position: "absolute",
                              left: "48%",
                            }}
                          >
                            {t("componentData.mySupplier.NoResultsFound")}
                          </Grid>
                        </Grid>
                      )}
                      <TableBody className={classes.bodyTextColor}>
                        {vendorsList &&
                          vendorsList.map((vendor) => (
                            <TableRow
                              key={vendor.payeeId}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                //if (isMySupplierEditEnabled) {
                                this.setState({
                                  openVendorInformationDialog: true,
                                  selectedVendor: vendor,
                                });
                                //}
                              }}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  name="vendor"
                                  onChange={(e) =>
                                    this.handleVendorCheck(e, vendor)
                                  }
                                  checked={vendor.isChecked}
                                  disabled={
                                    vendor.payeeId === null ? true : false
                                  }
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.textBold}
                                title={vendor.companyName}
                              >
                                {vendor.companyName &&
                                vendor.companyName.length > 20
                                  ? vendor.companyName.substring(0, 20) + "..."
                                  : vendor.companyName}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.textBold}
                                title={vendor.linkEntityIdentifier}
                              >
                                {vendor.linkEntityIdentifier &&
                                vendor.linkEntityIdentifier.length > 10
                                  ? vendor.linkEntityIdentifier.substring(
                                      0,
                                      10
                                    ) + "..."
                                  : vendor.linkEntityIdentifier &&
                                    vendor.linkEntityIdentifier.length !== "0"
                                  ? vendor.linkEntityIdentifier
                                  : "-"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.textBold}
                              >
                                {vendor.payeeLocations &&
                                  vendor.payeeLocations.city}
                                {", "}
                                {vendor.payeeLocations &&
                                  vendor.payeeLocations.state}
                              </TableCell>
                              <TableCell align="left">
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes("ACH") && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/ACH_main.svg`)}
                                        alt={t("componentData.mySupplier.ACH")}
                                        title={t(
                                          "componentData.mySupplier.BANK_ACCOUNT"
                                        )}
                                      />
                                    </span>
                                  )}
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes("CHK") && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/CHK_main.svg`)}
                                        alt={t(
                                          "componentData.mySupplier.CHECK"
                                        )}
                                        title={t(
                                          "componentData.mySupplier.CHECK"
                                        )}
                                      />
                                    </span>
                                  )}
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes("VCA") && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/VCA_main.svg`)}
                                        alt={t("componentData.mySupplier.VCA")}
                                        title={t(
                                          "componentData.mySupplier.VIRTUAL_CARD"
                                        )}
                                      />
                                    </span>
                                  )}
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes("WIRE") && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/WIRE_main.svg`)}
                                        alt={t("componentData.mySupplier.WIRE")}
                                        title={t(
                                          "componentData.mySupplier.Wire"
                                        )}
                                      />
                                    </span>
                                  )}
                                {vendor.paymentMethod &&
                                  vendor.paymentMethod.includes(
                                    "CROSS_BORDER"
                                  ) && (
                                    <span className={classes.checkedIcon}>
                                      <img
                                        className={classes.checkClass}
                                        src={require(`~/assets/icons/Cross_main.svg`)}
                                        alt={t(
                                          "componentData.mySupplier.CROSS_BORDER"
                                        )}
                                        title={t(
                                          "componentData.mySupplier.CROSS_BORDER"
                                        )}
                                      />
                                    </span>
                                  )}
                              </TableCell>
                              <TableCell align="left">
                                {vendor.profileStatus && (
                                  <>
                                    <b>{vendor.profileStatus.description}</b>
                                    {vendor.profileStatus.updatedAgo &&
                                    vendor.profileStatus.updatedAgo > 0 ? (
                                      <>
                                        {"- "}
                                        {this.getApprovedDate(
                                          vendor.profileStatus.updatedAgo
                                        )}
                                      </>
                                    ) : (
                                      ` - ${t(
                                        "componentData.mySupplier.todayTxt"
                                      )}`
                                    )}
                                  </>
                                )}
                              </TableCell>
                              <TableCell align="left">
                                {isMySupplierEditEnabled && (
                                  <EditIcon
                                    fontSize="small"
                                    className={classes.cursorPointer}
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
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
                          ? t("componentData.mySupplier.CardsPerPage")
                          : t("componentData.mySupplier.RowsPerPage")
                      }
                      rowsPerPageOptions={[10, 25, 50]}
                      component="div"
                      count={count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('componentData.fileName.Of')} ${count !== -1 ? count : `${t('componentData.fileName.MoreThan')} ${to}`}`}
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
                  payeeId:null
                },
              });
            }}
            title={
              this.state.selectedVendor && this.state.selectedVendor.companyName
                ? `${this.state.selectedVendor.companyName} ${t(
                    "componentData.mySupplier.Information"
                  )}`
                : t("componentData.mySupplier.PayeeNameInformation")
            }
            width="960px"
          >
            <VendorInformation
              vendorDetail={this.state.selectedVendor}
              getAllVendorsList={this.getAllVendorsList}
              canEdit={isMySupplierEditEnabled}
              closeApproveVendorDetails={this.closeApproveVendorDetails}
              closeSaveVendorDetails={this.closeSaveVendorDetails}
              closeDisapproveVendorDetails={this.closeDisapproveVendorDetails}
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
            title={t("componentData.mySupplier.Filters")}
            icon={true}
            width="400px"
          >
            <SupplierFilters
              name={name}
              id={id}
              location={location}
              paymentList={paymentList}
              enrollmentOnly={enrollmentOnly}
              isImplementationProgSelected={isImplementationProgSelected}
              programList={programList}
              customList={customList}
              // status={status}
              selectedFilterItem={selectedFilterItem}
              filterList={filterList}
              onConfirm={() => {
                this.setState({
                  openFiltersSection: false,
                });
              }}
              handleChangeInput={(e) => {
                const { filterList } = this.state;

                e.target.name === "status"
                  ? this.setState({
                      selectedFilterItem: filterList.find(
                        (s) => s.filterKey === e.target.value
                      ),
                    })
                  : e.target.name === "id"
                  ? this.setState({
                      [e.target.name]: e.target.value.replace(
                        /[^A-Za-z0-9-_+@$~%* ]/g,
                        ""
                      ),
                    })
                  : this.setState({
                      [e.target.name]: e.target.value,
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
            title={t("componentData.mySupplier.revokeConfirmation")}
            px={12}
            py={2.4}
            onCancel={() => {
              this.setState({
                openRevokeDialog: false,
              });
            }}
            onConfirm={() => this.handleRevoke()}
            confirmText={t("componentData.mySupplier.CONTINUE")}
            open={true}
          />
        )}
        {openDisapproveDialog && (
          <InfoDialogue
            title={t("componentData.mySupplier.disapproveConfirmation")}
            px={12}
            py={2.4}
            onCancel={() => {
              this.setState({
                openDisapproveDialog: false,
              });
            }}
            onConfirm={() => this.handleDisapprove()}
            confirmText={t("componentData.mySupplier.CONTINUE")}
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
  }))(withStyles(styles)(MySupplier))
);