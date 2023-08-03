import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import {
  TextField,
  InputAdornment,
  OutlinedInput,
  Grid,
  Paper,
  Box,
  Button,
  CircularProgress,
  Table,
  TableRow,
  TableBody,
  TablePagination,
  TableCell,
  TableSortLabel,
  Select,
  Checkbox,
  MenuItem,
  ListItemText,
  Avatar,
  Typography
} from "@material-ui/core";
import {
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledTableFooter,
} from "~/components/StyledTable";
import { withStyles } from "@material-ui/styles";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import LockIcon from "@material-ui/icons/Lock";
import SearchIcon from "@material-ui/icons/Search";
import trim from "deep-trim-node";
import { connect } from "react-redux";
import "moment/locale/fr";

import {
  createUser,
  fetchUserList,
  updateUserDetails,
  lockUser,
  removeUser,
  fetchFilterList,
} from "~/redux/actions/user";
import { fetchRoles } from "~/redux/actions/role";

import Notification from "~/components/Notification";
import DetailView from "~/components/DetailView";

import UserView from "../View/";
import UserEdit from "../EditView/";

import { ConfirmDialog, AlertDialog } from "~/components/Dialogs";
import ChipFilter from "~/components/Filter";
import "./styles.scss";
import config from "~/config";
import styles from "./styles";
import moment from "moment";

import { accessRights } from "~/config/accessRights";

moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    ss: "%d seconds",
    m: "One minute",
    mm: "%d minutes",
    h: "One hour",
    hh: "%d hours",
    d: "One day",
    dd: "%d days",
    w: "One week",
    ww: "%d weeks",
    M: "One month",
    MM: "%d months",
    y: "One year",
    yy: "%d years",
  },
});

class UserListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      fetchingList: true,
      page: 0,
      rowsPerPage: 10,
      sortColumn: "",
      sortOrder: "",
      name: "",
      phone: "",
      email: "",
      role: "",
      roleList: [], //System Role list
      filterOpen: false,
      alertType: "success",
      alertMessage: "",
      alertMessageCallbackType: null,
      showConfirmRemoveDialog: false,
      removeUserId: null,
      showDetail: false,
      editDetail: false,
      userList: [],
      selectedUsers: [],
      userInfo: {},
      newUserInfo: {},
      //selectedFilterItem:{roleId:null, roleName:"All Users"},
      selectedFilterItem: {},
      filterList: [],
      validation: {},
      checkedAll: false,
      canEditAction: false,
      saveNotificationSetup: false,
      detailTitle: "",
    };
  }

  fetchChipsFilterList = () => {
    const { userData } = this.props.user;
    this.props
      .dispatch(
        fetchFilterList({
          portalProfileId: userData.portalProfileId,
          portalTypeId: userData.portalTypeId,
        })
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessageCallbackType: null,
            alertMessage: this.props.user.error,
          });
          return false;
        }
        this.setState({
          filterList: this.props.user.chipFilterList,
        });
      });
  };

  componentDidMount = async () => {
    //const { accessToken } = this.props.user.userData;

    this.fetchRoleList();
    this.fetchChipsFilterList();
    this.getUserList();
  };

  filterCliCkFun = () => {
    this.setState({
      filterOpen: !this.state.filterOpen,
    });
  };

  clearFilter = () => {
    this.setState(
      {
        name: "",
        phone: "",
        email: "",
        role: "",
      },
      () => {
        this.getUserList();
      }
    );
  };

  handlePageChange = (event, page) => {
    const { sortColumn, sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    this.setState(
      {
        page,
        sortColumn: sortColumn,
        sortOrder: newSortOrder,
      },
      () => this.getUserList()
    );
  };

  handleRowsPerPageChange = (event) => {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";
    this.setState(
      {
        page: 0,
        rowsPerPage: parseInt(event.target.value, 10),
        sortOrder: newSortOrder,
      },
      () => this.getUserList()
    );
  };

  handleSorting(sortColumn) {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    this.setState({ sortColumn: sortColumn, sortOrder: newSortOrder }, () => {
      this.getUserList(sortColumn, newSortOrder === "asc" ? "ASC" : "DESC");
    });
  }

  getUserList = () => {
    const {
      name,
      phone,
      email,
      selectedFilterItem,
      page,
      rowsPerPage,
      sortColumn,
      sortOrder,
    } = this.state;

    this.setState(
      {
        fetchingList: true,
      },
      () => {
        const { userData } = this.props.user;

        this.props
          .dispatch(
            fetchUserList({
              portalProfileId: userData.portalProfileId,
              portalTypeId: userData.portalTypeId,
              name,
              phone,
              email,
              role: selectedFilterItem,
              pageNo: page + 1,
              pageSize: rowsPerPage,
              sortColumn,
              sortOrder,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.user.error,
                fetchingList: false,
              });
              return false;
            }

            this.setState({
              isLoading: false,
              fetchingList: false,
              userList: this.props.user.list,
            });
          });
      }
    );
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
  };

  fetchRoleList = () => {
    this.props.dispatch(fetchRoles()).then((response) => {
      if (!response) {
        this.setState({
          alertType: "error",
          alertMessageCallbackType: null,
          alertMessage: this.props.role.error,
        });
        return false;
      }
      this.setState({
        roleList: this.props.role.list,
      });
    });
  };

  handleFormPageChange = (pageNo) => {
    this.setState({ formPageNo: pageNo });
  };

  handleRoleChange = (user, event, position) => {
    const { value: options } = event.target;
    const { roleList } = this.state;
    const { userData } = this.props.user;
    const { t } = this.props;
    const canEditAction =
      (!user.isFirstUser && user.userId !== userData.userId) || false;
    if (!canEditAction) {
      this.setState({
        alertType: "error",
        alertMessage: t("componentData.userListView.notAuthorize"),
      });
      return false;
    }

    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      //if (options[i].selected) {
      const newRole = roleList.filter((item) => item.roleId == options[i]);
      if (newRole.length) {
        value.push({
          roleId: newRole[0].roleId,
          roleName: newRole[0].roleName,
        });
      }
      //}
    }

    const newRoleIds = value.map((item) => item.roleId);
    const newUserDetail = { ...user, roleId: newRoleIds, roles: value };

    if (value.length === 0) {
      this.setState({
        alertType: "error",
        alertMessage: t("componentData.userListView.selectRole"),
      });
      return false;
    }
    //restrict the role change for first user from list page
    if (newUserDetail.isFirstUser) {
      return false;
    }
    this.setState(
      {
        updateProgress: true,
      },
      () => {
        const { userData } = this.props.user;
        this.props
          .dispatch(
            updateUserDetails({
              portalProfileId: userData.portalProfileId,
              portalTypeId: userData.portalTypeId,
              user: trim(newUserDetail),
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertMessage: this.props.user.error,
                alertType: "error",
                alertMessageCallbackType: null,
                updateProgress: false,
              });

              return false;
            }
            this.setState({
              updateProgress: false,
              newUserInfo: trim({ ...newUserDetail }),
              userInfo: trim(newUserDetail),
            });
            this.fetchChipsFilterList();
          });
      }
    );
  };

  handleLock = (e, item) => {
    const { selectedUsers, userList } = this.state;
    const selectedConfirmUser = item ? [item.userId] : [...selectedUsers];
    const { t } = this.props;
    //if locked from the list
    if (!item) {
      const selectedLockedUsers =
        userList.filter(
          (user) =>
            selectedConfirmUser.indexOf(user.userId) != -1 && user.isLocked
        ) || [];
      if (selectedLockedUsers && selectedLockedUsers.length > 0) {
        this.setState({
          alertMessage: t("componentData.userListView.lockAccountMsg"),
          alertType: "error",
          alertMessageCallbackType: null,
          progressLock: false,
        });

        return false;
      }
    }

    if (selectedConfirmUser.length > 0) {
      this.setState(
        {
          progressLock: true,
        },
        () => {
          const isLocked = item ? (item.isLocked ? false : true) : true;
          this.props
            .dispatch(
              lockUser({ userIds: selectedConfirmUser, isLocked: isLocked })
            )
            .then((response) => {
              //set state here on success
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertMessageCallbackType: null,
                  alertType: "error",
                  progressLock: false,
                });

                return false;
              }

              this.setState({
                progressLock: false,
                userInfo: { ...item, isLocked },
                newUserInfo: { ...item, isLocked },
                userList: this.props.user.list,
                alertType: "success",
                alertMessage: isLocked
                  ? t("componentData.userListView.userLocked")
                  : t("componentData.userListView.userUnlocked"),
              });
              this.fetchChipsFilterList();
            });
        }
      );
    } else {
      this.setState({
        alertType: "info",
        alertMessage: t("componentData.userListView.selectUser"),
      });
    }
  };

  handleDelete = (e, id) => {
    e.stopPropagation();
    const { selectedUsers } = this.state;
    const { t } = this.props;
    const selectedConfirmUser = id ? [id] : [...selectedUsers];
    if (selectedConfirmUser.length > 0) {
      this.setState({
        showConfirmRemoveDialog: true,
        removeUserId: id ? id : null,
      });
    } else {
      this.setState({
        alertType: "info",
        alertMessage: t("componentData.userListView.selectUser"),
      });
    }
  };

  onConfirmDelete = () => {
    const { removeUserId, selectedUsers } = this.state;
    const { t } = this.props;
    const selectedConfirmUser = removeUserId
      ? [removeUserId]
      : [...selectedUsers];
    this.setState(
      {
        showConfirmRemoveDialog: false,
        removeUserId: null,
      },
      () => {
        const { userData } = this.props.user;

        this.props
          .dispatch(
            removeUser({
              userIds: selectedConfirmUser,
              username: userData.userName,
            })
          )
          .then((response) => {
            //set state here on success
            if (!response) {
              this.setState({
                alertType: "error",
                alertMessageCallbackType: null,
                alertMessage: this.props.user.error,
              });
              return false;
            }

            this.setState({
              selectedUsers: [],
              removeUserId: null,
              alertType: "success",
              alertMessage: t("componentData.userListView.userDeleted"),
            });

            this.hideDetailView();
            this.fetchChipsFilterList();
          });
      }
    );
  };

  isSuperAdmin = (item) => {
    const { roleList } = this.state;
    const currentRoles = item.roles.map((user) => user.roleId);
    const selectedRoles = roleList
      ? roleList.filter((role) => {
          const flag =
            currentRoles.length > 0 &&
            currentRoles.indexOf(role.roleId) !== -1 &&
            role.roleName === "System Admin";
          if (flag) {
            return true;
          }
        })
      : [];

    return selectedRoles.length > 0 ? true : false;
  };

  onCancelDelete = () => {
    this.setState({
      showConfirmRemoveDialog: false,
      removeUserId: null,
    });
  };

  showDetailView = (item) => {
    const { editDetail } = this.state;
    const { userData } = this.props.user;
    const { t } = this.props;
    //In case of Edit mode open don't change the info
    const canEditAction =
      (!item.isFirstUser && item.userId !== userData.userId) || false;
    if (!editDetail) {
      this.setState({
        showDetail: true,
        detailTitle: t("componentData.userListView.Details"),
        userInfo: item,
        canEditAction: canEditAction,
      });
    }
  };

  handleEdit = (event, item) => {
    //First user can not be edited
    const { userData } = this.props.user;
    const { t } = this.props;
    const canEditAction =
      (!item.isFirstUser && item.userId !== userData.userId) || false;
    const roles = item.roles.map((user) => user.roleId);
    if (item.isFirstUser) {
      this.setState({
        editDetail: false,
        showDetail: true,
        detailTitle: t("componentData.userListView.Details"),
        newUserInfo: {
          ...item,
          roleId: roles,
          newPassword: null,
          confirmPassword: null,
        },
      });
    } else {
      //this.setState({validation:{}, editDetail:true, newUserInfo: {...item, roleId: roles, password: item.pWDHash || null,  newPassword: item.pWDHash || null}});
      this.setState({
        validation: {},
        editDetail: true,
        detailTitle: t("componentData.userListView.EditUserDetails"),
        showDetail: true,
        canEditAction: canEditAction,
        newUserInfo: {
          ...item,
          roleId: roles,
          newPassword: null,
          confirmPassword: null,
        },
      });
    }
  };

  //On edit cancel close only edit mode
  handleCancelEdit = (event) => {
    const { t } = this.props;
    this.setState({
      editDetail: false,
      detailTitle: t("componentData.userListView.Details"),
    });
  };

  hideDetailView = () => {
    const { t } = this.props;
    this.setState({
      showDetail: false,
      editDetail: false,
      detailTitle: t("componentData.userListView.Details"),
      userInfo: {},
      newUserInfo: {},
    });
  };

  handleSelectAllClick = (event) => {
    const { userList } = this.state;
    if (event.target.checked) {
      const { userData } = this.props.user;
      const newSelecteds = userList
        .filter((user) => !user.isFirstUser && user.userId !== userData.userId)
        .map((n) => n.userId);
      this.setState({ selectedUsers: newSelecteds, checkedAll: true });

      return;
    }
    this.setState({ selectedUsers: [], checkedAll: false });
  };

  handleClick = (event, item) => {
    const { selectedUsers, checkedAll } = this.state;
    const { userData } = this.props.user;
    const canEditAction =
      (!item.isFirstUser && item.userId !== userData.userId) || false;
    if (!canEditAction) return false;

    const selectedIndex = selectedUsers.indexOf(item.userId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, item.userId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    this.setState({
      selectedUsers: newSelected,
      checkedAll: newSelected && newSelected.length === 0 ? false : checkedAll,
    });
  };

  handleClickFilter = (event, item, index) => {
    const { sortOrder } = this.state;
    const newSortOrder = sortOrder === "asc" ? "asc" : "desc";

    this.setState(
      {
        selectedFilterItem: item,
        page: 0,
        rowsPerPage: 10,
        sortOrder: newSortOrder,
      },
      () => {
        this.getUserList();
      }
    );
  };

  validateForm = () => {
    const { newUserInfo } = this.state;
    const { t } = this.props;
    let valid = true;
    let validation = {};
    if (!newUserInfo || !newUserInfo.title || newUserInfo.title.trim() === "") {
      validation["title"] = t("componentData.roleAddView.PrefixRequired");
      valid = false;
    }
    if (
      !newUserInfo ||
      !newUserInfo.firstName ||
      newUserInfo.firstName.trim() === ""
    ) {
      validation["firstName"] = t("componentData.roleAddView.fNameReq");
      valid = false;
    }
    if (
      !newUserInfo ||
      !newUserInfo.lastName ||
      newUserInfo.lastName.trim() === ""
    ) {
      validation["lastName"] = t("componentData.roleAddView.lNameReq");
      valid = false;
    }
    if (
      !newUserInfo ||
      !newUserInfo.phone ||
      newUserInfo.phone.toString().trim() === "" ||
      newUserInfo.phone.toString().trim().length !== 10
    ) {
      validation["phone"] = t("componentData.userListView.phoneLen");
      valid = false;
    }
    if (!newUserInfo || !newUserInfo.email || newUserInfo.email.trim() === "") {
      validation["email"] = t("componentData.roleAddView.emailReq");
      valid = false;
    }
    if (
      newUserInfo &&
      newUserInfo.email &&
      newUserInfo.email.trim().length > 0
    ) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z-]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(newUserInfo.email.trim().toLowerCase())) {
        validation["email"] = t("componentData.userListView.InvalidEmail");
        valid = false;
      }
    }
    if (!newUserInfo || !newUserInfo.isSSO || newUserInfo.isSSO == false) {
      if (
        !newUserInfo ||
        !newUserInfo.userName ||
        newUserInfo.userName.trim() === ""
      ) {
        validation["userName"] = t(
          "componentData.roleAddView.userNameRequired"
        );
        valid = false;
      }
      if (
        newUserInfo &&
        newUserInfo.newPassword &&
        newUserInfo.newPassword.trim().length > 0
      ) {
        if (
          !newUserInfo ||
          !newUserInfo.newPassword ||
          (newUserInfo.newPassword && newUserInfo.newPassword.trim() === "")
        ) {
          validation["password"] = t(
            "componentData.roleAddView.passwordRequired"
          );
          valid = false;
        }

        const re =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
        if (!re.test(newUserInfo.newPassword.trim())) {
          validation["password"] = t("componentData.userListView.passMsg");
          valid = false;
        }

        if (
          !newUserInfo ||
          !newUserInfo.confirmPassword ||
          newUserInfo.confirmPassword.trim() === ""
        ) {
          validation["confirmPassword"] = t(
            "componentData.roleAddView.confirmPassword"
          );
          valid = false;
        }
        if (
          newUserInfo &&
          newUserInfo.newPassword !== newUserInfo.confirmPassword
        ) {
          validation["confirmPassword"] = t(
            "componentData.userListView.passSameMsg"
          );
          valid = false;
        }
      }

      if (
        newUserInfo &&
        newUserInfo.confirmPassword &&
        newUserInfo.confirmPassword.trim().length > 0
      ) {
        if (
          !newUserInfo ||
          !newUserInfo.confirmPassword ||
          newUserInfo.confirmPassword.trim() === ""
        ) {
          validation["confirmPassword"] = true;
          valid = false;
        }
        if (
          newUserInfo &&
          newUserInfo.newPassword !== newUserInfo.confirmPassword
        ) {
          validation["confirmPassword"] = t(
            "componentData.userListView.passSameMsg"
          );
          valid = false;
        }
      }
    }
    if (!newUserInfo || !newUserInfo.roleId || newUserInfo.roleId.length == 0) {
      validation["roleId"] = t("componentData.userListView.selectRole");
      valid = false;
    }

    this.setState({ validation: { ...validation } });

    return valid;
  };

  handleChange = (field, event, value, position) => {
    const { newUserInfo } = this.state;
    const newUserDetail = { ...newUserInfo };
    const fieldName = event.target.name;

    switch (field) {
      case "roleId":
        let newValues;
        if(newUserDetail.roleId.includes(value.roleId)) {
          const searchValue = newUserDetail.roles.filter(
            (item) => item.roleId !== value.roleId
          );

          newValues = searchValue;
        }
        else {
          const searchValue = newUserDetail.roles.filter(
            (item) => item.roleId === value.roleId
          );

          newValues =
          searchValue.length === 0
            ? [...newUserDetail.roles, value]
            : [...newUserDetail.roles];

        }
      
        newUserDetail["roleId"] = newValues.map((item) => item.roleId);
        newUserDetail["roles"] = newValues;
        //this.setState({roles: value});

        break;
      case "removeRoleId":
        const updatedRoles = [...newUserDetail.roles];
        const newUpdatedValues = updatedRoles.filter(
          (item, index) => item.roleId !== value.roleId
        );

        //newUserDetail[fieldName] = value.join();
        newUserDetail["roleId"] = newUpdatedValues.map((item) => item.roleId);
        newUserDetail["roles"] = newUpdatedValues;
        //this.setState({roles: value});

        break;
      case "SSOUserId":
        const SSOUserId = event.target.value;
        newUserDetail["SSOUserId"] = SSOUserId.replace(/[^a-zA-Z0-9]/g, "");
        break;
      case "phone":
        const phoneValue = event.target.value;
        newUserDetail["phoneCountryCode"] = phoneValue.ccode;
        newUserDetail["phone"] = phoneValue.phone;
        newUserDetail["phoneExt"] = phoneValue.ext;
        break;
      default:
        newUserDetail[fieldName] = event.target.value.trim();
        break;
    }

    this.setState({ newUserInfo: { ...newUserDetail } });
  };

  handleSubmit = () => {
    const { newUserInfo } = this.state;
    const valid = this.validateForm();
    const { t } = this.props;
    if (!valid) {
      return false;
    }

    this.setState(
      {
        updateProgress: true,
      },
      () => {
        const { userData } = this.props.user;
        if (newUserInfo && newUserInfo.userId) {
          this.props
            .dispatch(
              updateUserDetails({
                portalProfileId: userData.portalProfileId,
                portalTypeId: userData.portalTypeId,
                user: trim(newUserInfo),
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertMessageCallbackType: null,
                  alertType: "error",
                  updateProgress: false,
                });
                return false;
              }

              this.setState({
                editDetail: false,
                showDetail: true,
                userInfo: trim(newUserInfo),
                updateProgress: false,
                saveNotificationSetup: true,
                alertMessage: t(
                  "componentData.userListView.UserInformationUpdated"
                ),
                alertType: "success",
              });

              this.fetchChipsFilterList();
              this.hideDetailView();
            });
        } else {
          this.props
            .dispatch(
              createUser({
                portalProfileId: userData.portalProfileId,
                portalTypeId: userData.portalTypeId,
                user: trim(newUserInfo),
              })
            )
            .then((response) => {
              if (!response) {
                this.setState({
                  alertMessage: this.props.user.error,
                  alertMessageCallbackType: null,
                  alertType: "error",
                  updateProgress: false,
                });
                return false;
              }
              this.setState({
                updateProgress: false,
                saveNotificationSetup: true,
                alertMessage: t("componentData.userListView.UserAdded"),
                alertType: "success",
              });
              this.fetchChipsFilterList();
              this.hideDetailView();
            });
        }
      }
    );
  };

  handleSearch = (event) => {
    if (event.keyCode == 13) {
      this.setState(
        {
          page: 0,
          rowsPerPage: 10,
        },
        () => {
          this.getUserList();
        }
      );
    }
  };

  handleSearchClick = () => {
    this.setState(
      {
        page: 0,
        rowsPerPage: 10,
      },
      () => {
        this.getUserList();
      }
    );
  };

  render() {
    const { t } = this.props;
    const {
      alertMessage,
      updateProgress,
      validation,
      editDetail,
      filterList,
      checkedAll,
      canEditAction,
      selectedFilterItem,
      newUserInfo,
      userInfo,
      selectedUsers,
      showDetail,
      userList,
      showConfirmRemoveDialog,
      alertMessageCallbackType,
      isLoading,
      fetchingList,
      roleList,
      page,
      rowsPerPage,
      sortColumn,
      sortOrder,
      saveNotificationSetup,
      detailTitle,
    } = this.state;
    const { classes } = this.props;
    const { user } = this.props;

    const isAddEnabled =
      (user.userRoles && user.userRoles.includes(accessRights["USER_ADD"])) ||
      false;
    const isEditEnabled =
      (user.userRoles && user.userRoles.includes(accessRights["USER_EDIT"])) ||
      false;
    const isLockEnabled =
      (user.userRoles && user.userRoles.includes(accessRights["USER_LOCK"])) ||
      false;
    const isUnlockEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["USER_UNLOCK"])) ||
      false;
    const isDeleteEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["USER_DELETE"])) ||
      false;

    if (isLoading) {
      return (
        <Box display="flex" p={10} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }

    return (
      <Fragment>
        <Box mx={6} my={3}>
          <Grid container item xs={12} md={12} justify="flex-end">
            <Box mt={"-40px"}>
              {isAddEnabled && (
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.mediumBtn}
                  style={
                    this.props.i18n.language === "fr" ? { width: 250 } : {}
                  }
                  startIcon={<AddOutlinedIcon />}
                  onClick={() =>
                    this.props.history.push(
                      `${config.baseName}/manage/user/add`
                    )
                  }
                >
                  {t("componentData.userListView.addUser")}
                </Button>
              )}
            </Box>
          </Grid>
          <Box my={2}>
            <Paper>
              <Grid container item xs={12} md={12}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  flexGrow={1}
                  alignItems="start"
                  mx={2}
                  p={1}
                >
                  <Box display="flex" p={1}>
                    <TextField
                      size="small"
                      id="emni"
                      className={classes.searchBox}
                      placeholder={t("componentData.userListView.searchUSer")}
                      inputProps={{
                        "aria-label": "Search Users by name / email",
                        // style={{padding:"0px",paddingLeft:"2px"}},
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Button
                              aria-label="search"
                              onClick={() => this.handleSearchClick()}
                              onMouseDown={null}
                              edge="end"
                              // endIcon={<SearchIcon size="small" />}
                              style={{ paddingLeft: "62%" }}
                            >
                              <SearchIcon />
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                      onChange={(event) =>
                        this.setState({ name: event.target.value })
                      }
                      onKeyDown={(event) => this.handleSearch(event)}
                      variant="outlined"
                    />
                  </Box>
                  <Box display="flex">
                    <Box p={1}>
                      {isLockEnabled && (
                        <Button
                          color="primary"
                          aria-label="Lock User account"
                          title={t(
                            "componentData.userListView.LockUserAccount"
                          )}
                          component="span"
                          size="small"
                          className={classes.textTtransform}
                          onClick={(event) => this.handleLock(event)}
                          startIcon={<LockIcon />}
                        >
                          {t("componentData.userListView.Lock")}
                        </Button>
                      )}
                    </Box>

                    <Box p={1}>
                      {isDeleteEnabled && (
                        <Button
                          color="primary"
                          aria-label="Delete User"
                          title={t("componentData.userListView.DeleteUser")}
                          size="small"
                          component="span"
                          onClick={(event) => this.handleDelete(event)}
                          className={classes.textTtransform}
                          startIcon={<DeleteIcon />}
                        >
                          {t("componentData.userListView.Delete")}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid
                container
                item
                xs={12}
                md={12}
                justify="flex-start"
                className={classes.gtidItem}
              >
                <Box
                  display="flex"
                  width="100%"
                  justifyContent="flex-start"
                  pb={1}
                >
                  <ChipFilter
                    list={filterList}
                    handleClickFilter={this.handleClickFilter}
                    selectedFilterItem={
                      !selectedFilterItem.roleName
                        ? {
                            roleId: null,
                            roleName: t("componentData.userListView.AllUsers"),
                          }
                        : selectedFilterItem
                    }
                  />
                </Box>
              </Grid>
              <Grid container item xs={12} md={12}>
                <Table>
                  <StyledTableHead
                    style={{ background: "#D9EBFF", height: 40 }}
                  >
                    <TableRow>
                      <StyledTableCell className="tableHeadPadding">
                        <Checkbox
                          checked={checkedAll}
                          indeterminate={
                            selectedUsers.length > 0 &&
                            selectedUsers.length < userList.length
                          }
                          onChange={(event) => this.handleSelectAllClick(event)}
                          icon={
                            <CheckBoxOutlineBlankIcon
                              style={{ color: "#000" }}
                            />
                          }
                          checkedIcon={
                            <CheckBoxIcon style={{ color: "#000" }} />
                          }
                        />
                      </StyledTableCell>
                      <StyledTableCell className="tableHeadPadding"></StyledTableCell>
                      <StyledTableCell
                        sortDirection={
                          sortColumn === "displayName" ? sortOrder : false
                        }
                        className="tableHeadPadding"
                      >
                        <TableSortLabel
                          active={sortColumn === "displayName"}
                          direction={
                            sortColumn === "displayName" ? sortOrder : "asc"
                          }
                          onClick={() => this.handleSorting("displayName")}
                        >
                          {t("componentData.userListView.name")}
                          {sortColumn === "displayName" ? (
                            <span
                              style={{
                                border: 0,
                                clip: "rect(0 0 0 0)",
                                height: 1,
                                margin: -1,
                                overflow: "hidden",
                                padding: 0,
                                position: "absolute",
                                top: 20,
                                width: 1,
                              }}
                            >
                              {sortOrder === "desc"
                                ? t(
                                    "componentData.userListView.sortedDescending"
                                  )
                                : t(
                                    "componentData.userListView.sortedAscending"
                                  )}
                            </span>
                          ) : null}
                        </TableSortLabel>
                      </StyledTableCell>
                      <StyledTableCell className="tableHeadPadding">
                        {t("componentData.userListView.Status")}
                      </StyledTableCell>
                      <StyledTableCell className="tableHeadPadding">
                        {t("componentData.userListView.LastVisited")}
                      </StyledTableCell>
                      <StyledTableCell className="tableHeadPadding">
                        {t("componentData.userListView.RoleAssigned")}
                      </StyledTableCell>
                      <StyledTableCell className="tableHeadPadding"></StyledTableCell>
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {fetchingList ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Box
                            display="flex"
                            p={5}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <CircularProgress color="primary" />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      user.list &&
                      user.list.map((item, index) => {
                        // const roleIds = item.RoleID.split(',').map(Number);
                        const roleIds = item.roles.map(
                          (userItem) => userItem.roleId
                        );
                        const isSelected =
                          selectedUsers.indexOf(item.userId) !== -1;
                        const currentDate = moment();
                        const lastActiveDate = item.successfullLoginAt
                          ? moment(item.successfullLoginAt)
                          : null;
                        const activeDays = currentDate.diff(
                          lastActiveDate,
                          "days"
                        );

                        return (
                          <Fragment key={index}>
                            <StyledTableRow>
                              <StyledTableCell
                                style={{ width: "5%" }}
                                className="tablePadding"
                              >
                                <Checkbox
                                  onChange={(event) =>
                                    this.handleClick(event, item)
                                  }
                                  checked={isSelected}
                                  inputProps={{
                                    "aria-labelledby": item.userId,
                                  }}
                                />
                              </StyledTableCell>
                              <StyledTableCell
                                onClick={() => this.showDetailView(item)}
                                style={{ width: "5%" }}
                                className="tablePadding"
                              >
                                <Avatar
                                  alt={item.displayName}
                                  src="/static/images/avatar/1.jpg"
                                />
                              </StyledTableCell>
                              <StyledTableCell
                                onClick={() => this.showDetailView(item)}
                                style={{ width: "35%", wordWrap: "break-word" }}
                                className="tablePadding"
                              >
                                <Typography variant="body1" component="h2">
                                  {`${item.firstName}  ${item.lastName}`}
                                </Typography>
                                <Typography variant="caption" component="h2">
                                  {item.email}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell
                                style={{ width: "15%" }}
                                className="tablePadding"
                                onClick={() => this.showDetailView(item)}
                              >
                                {isNaN(activeDays) || activeDays > 7
                                  ? t("componentData.userListView.Inactive")
                                  : t("componentData.userListView.Active")}
                              </StyledTableCell>
                              <StyledTableCell
                                style={{ width: "15%" }}
                                className="tablePadding"
                                onClick={() => this.showDetailView(item)}
                              >
                                {item.successfullLoginAt
                                  ? moment(lastActiveDate)
                                      .locale(this.props.i18n.language)
                                      .fromNow()
                                      .replace(/\b[a-z]/, (match) =>
                                        match.toUpperCase()
                                      )
                                  : "NA"}
                              </StyledTableCell>
                              <StyledTableCell
                                style={{ width: "10%" }}
                                className="tablePadding"
                              >
                                <Select
                                  fullWidth={true}
                                  className="dropDownStyle"
                                  input={<OutlinedInput />}
                                  disabled={!isEditEnabled}
                                  multiple
                                  value={roleIds}
                                  autoComplete="off"
                                  name="roleId"
                                  MenuProps={{
                                    classes: { paper: classes.dropdownStyle },
                                  }}
                                  onChange={(event) =>
                                    this.handleRoleChange(item, event)
                                  }
                                  renderValue={(selected) => {
                                    if (selected.length === 1) {
                                      const selectedRole =
                                        roleList &&
                                        roleList.filter(
                                          (role) => role.roleId == selected[0]
                                        );
                                      return (
                                        <span>
                                          {(roleList.length &&
                                            selectedRole.length &&
                                            selectedRole[0].roleName) ||
                                            ""}
                                        </span>
                                      );
                                    }

                                    return `${t(
                                      "componentData.userListView.Multiple"
                                    )} (${selected.length} ${t(
                                      "componentData.userListView.roles"
                                    )})`;
                                  }}
                                >
                                  {roleList ? (
                                    roleList.map((role) => (
                                      <MenuItem
                                        key={role.roleId}
                                        value={role.roleId}
                                      >
                                        <Checkbox
                                          checked={
                                            roleIds.length > 0 &&
                                            roleIds.indexOf(role.roleId) > -1
                                          }
                                        />
                                        <ListItemText primary={role.roleName} />
                                      </MenuItem>
                                    ))
                                  ) : (
                                    <Box
                                      width="100px"
                                      display="flex"
                                      mt={1.875}
                                      justifyContent="center"
                                      alignItems="center"
                                    >
                                      <CircularProgress color="primary" />
                                    </Box>
                                  )}
                                </Select>
                              </StyledTableCell>
                              <StyledTableCell
                                style={{ width: "2%" }}
                                className="tablePadding"
                              >
                                {isEditEnabled &&
                                  !item.isFirstUser &&
                                  item.userId != user.userData.userId && (
                                    <span
                                      aria-label={t(
                                        "componentData.userRoleView.EditUser"
                                      )}
                                      title={t(
                                        "componentData.userRoleView.EditUser"
                                      )}
                                    >
                                      <EditIcon
                                        size="small"
                                        className={classes.smallIcon}
                                        onClick={(event) =>
                                          this.handleEdit(event, item)
                                        }
                                      />
                                    </span>
                                  )}
                              </StyledTableCell>
                            </StyledTableRow>
                          </Fragment>
                        );
                      })
                    )}

                    {user.list.length == 0 && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Box
                            display="flex"
                            p={1}
                            justifyContent="center"
                            alignItems="center"
                          >
                            {t("componentData.userListView.NoResultFound")}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <StyledTableFooter>
                    <TableRow>
                      <TablePagination
                        labelRowsPerPage={t(
                          "componentData.userListView.rowsPerPage"
                        )}
                        rowsPerPageOptions={[10, 25, 50]}
                        colSpan={7}
                        count={user.totalCount || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                          inputProps: {
                            "aria-label": t(
                              "componentData.userListView.rowsPerPage"
                            ),
                          },
                          native: true,
                        }}
                        onChangePage={this.handlePageChange}
                        onChangeRowsPerPage={this.handleRowsPerPageChange}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('componentData.fileName.Of')} ${count !== -1 ? count : `${t('componentData.fileName.MoreThan')} ${to}`}`}
                      />
                    </TableRow>
                  </StyledTableFooter>
                </Table>
              </Grid>
            </Paper>
          </Box>
          {alertMessage &&
            this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
          {showConfirmRemoveDialog &&
            this.renderDeleteDialog(
              t("componentData.userListView.deleteUSer"),
              ""
            )}
        </Box>

        <DetailView
          open={showDetail}
          title={detailTitle}
          handleClose={() => this.hideDetailView()}
        >
          {editDetail ? (
            <UserEdit
              validation={validation}
              userInfo={newUserInfo}
              roleList={roleList}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              //handleCancel={this.handleCancelEdit}
              handleCancel={this.hideDetailView}
              handleDelete={this.handleDelete}
              handleLock={this.handleLock}
              updateProgress={updateProgress}
              canEditAction={canEditAction}
              isEditEnabled={isEditEnabled}
              isLockEnabled={isLockEnabled}
              isUnlockEnabled={isUnlockEnabled}
              isDeleteEnabled={isDeleteEnabled}
              submit={saveNotificationSetup}
            />
          ) : (
            <UserView
              userInfo={userInfo}
              roleList={roleList}
              handleEdit={this.handleEdit}
              handleDelete={this.handleDelete}
              handleLock={this.handleLock}
              canEditAction={canEditAction}
              isEditEnabled={isEditEnabled}
              isLockEnabled={isLockEnabled}
              isUnlockEnabled={isUnlockEnabled}
              isDeleteEnabled={isDeleteEnabled}
            />
          )}
        </DetailView>
      </Fragment>
    );
  }

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
      />
    );
  };

  renderDeleteDialog = (title, message) => {
    return (
      <ConfirmDialog
        title={title}
        message={message}
        onCancel={() => this.onCancelDelete()}
        onConfirm={() => this.onConfirmDelete()}
      />
    );
  };

  renderAlertMessage = (title, message, callbackType) => {
    return (
      <AlertDialog
        dialogClassName={"alert-dialoge-root"}
        title={title}
        message={message}
        onConfirm={() => {
          callbackType === "REDIRECT" ? this.goBack() : this.hideAlertMessage();
        }}
      />
    );
  };
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.role,
    ...state.permissions,
  }))(withStyles(styles)(UserListView))
);
