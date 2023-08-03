import React, { Fragment } from "react";
import { connect } from "react-redux";
import RolesPermission from "./rolesPermission";
import {
  fetchAccessRights,
  fetchPermissions,
  createRole,
  updateRole,
  fetchRoles,
} from "~/redux/actions/role";
import Notification from "~/components/Notification";
import { AlertDialog } from "~/components/Dialogs";
import { withTranslation } from 'react-i18next';

import config from "~/config";
import trim from 'deep-trim-node';

class Permissions extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      selected: state,
      validation: {},
      rolePermissionOptions: [],
      permissionsGranted: [],
      roleList: [],
      sourceRoleId: null,
      currentPermissionIds: [], //
      alertType: "success",
      alertMessage: "",
      updateProgress: false,
    };
  }

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertType: null,
      alertMessageCallbackType: null,
    });
  };

  fetchAccessRightsList = () => {
    const { userData } = this.props.user;
    this.props
      .dispatch(fetchAccessRights({ portalTypeId: userData.portalTypeId }))
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessageCallbackType: null,
            alertMessage: this.props.role.error,
          });
          return false;
        }
        this.setState({
          rolePermissionOptions: this.props.role.accessRights,
        });
      });
  };

  fetchRolePermissions = () => {
    const { userData } = this.props.user;
    this.props
      .dispatch(
        fetchPermissions(userData.portalProfileId, this.state.selected.roleId)
      )
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessageCallbackType: null,
            alertMessage: this.props.role.error,
          });
          return false;
        }
        const permissions = this.props.role.permissions;
        this.setState({
          permissionsGranted: permissions ? [...new Set(permissions)] : [],
          currentPermissionIds: permissions ? [...new Set(permissions)] : [],
        });
      });
  };

  fetchPermissionsByRoleId = (roleId) => {
    const { userData } = this.props.user;
    this.props
      .dispatch(fetchPermissions(userData.portalProfileId, roleId))
      .then((response) => {
        if (!response) {
          this.setState({
            alertType: "error",
            alertMessageCallbackType: null,
            alertMessage: this.props.role.error,
          });
        }
        const permissions = this.props.role.permissions;
        this.setState({
          permissionsGranted: permissions ? [...new Set(permissions)] : [],
        });
      });
  };

  fetchRoleList = () => {
    this.props
      .dispatch(
        fetchRoles()
      )
      .then((response) => {
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

  componentDidMount() {
    this.fetchAccessRightsList();
    this.fetchRoleList();
    if (this.state.selected.roleId !== "") {
      this.fetchRolePermissions();
    }
  }

  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
    this.backToRolesScreen();
  };
  backToRolesScreen = () => {
    this.props.history.push(`${config.baseName}/manage/user/role`);
  };

  createUserRoles = () => {
    const { userData,isPayeeChoicePortal } = this.props.user;
    const { t } = this.props;
    const data = {
      roleName: this.state.selected.roleName.trim(),
      permissions: this.state.permissionsGranted,
      portalTypeId: userData.portalTypeId,
      portalProfileId: userData.portalProfileId,
      description: this.state.selected.roleDescription.trim(),
    };
    this.props.dispatch(createRole(trim(data))).then((response) => {
      if (!response) {
        this.setState({
          alertType: "error",
          updateProgress: false,
          alertMessageCallbackType: null,
          alertMessage: this.props.role.error,
        });
        return false;
      } else {
        this.setState({
          alertType: "success",
          updateProgress: false,
          alertMessage: isPayeeChoicePortal?t('componentData.permissions.roleAddeddUSbank'):t('componentData.permissions.roleAddedd'),
          alertMessageCallbackType: "REDIRECT",
        });
        //this.backToRolesScreen();
      }
    });
  };
  editUserRoles = () => {
    const { userData } = this.props.user;
    const { t } = this.props;
    const data = {
      roleName: this.state.selected.roleName.trim(),
      permissions: this.state.permissionsGranted,
      roleId: this.state.selected.roleId,
      portalProfileId: userData.portalProfileId,
      description: this.state.selected.roleDescription.trim(),
    };
    this.props.dispatch(updateRole(trim(data))).then((response) => {
      if (!response) {
        this.setState({
          alertType: "error",
          updateProgress: false,
          alertMessageCallbackType: null,
          alertMessage: this.props.role.error,
        });
        return false;
      } else {
        this.setState({
          alertType: "success",
          updateProgress: false,
          alertMessage: t('componentData.permissions.roleUpdated'),
          alertMessageCallbackType: "REDIRECT",
        });
        //this.backToRolesScreen();
      }
    });
  };

  saveBtnClicked = () => {
    const valid = this.validate();
    if (!valid) {
      return false;
    }
    if (this.state.selected.isNewRole) {
      this.setState({ updateProgress: true }, () => {
        this.createUserRoles();
      });
    } else {
      this.setState({ updateProgress: true }, () => {
        this.editUserRoles();
      });
    }
  };

  validate = () => {
    const selectedRole = this.state.selected;
    const { t } = this.props;
    let valid = true;
    let validation = {};
    if (!selectedRole.roleName || selectedRole.roleName.trim().length === 0) {
      validation["roleName"] = t('componentData.permissions.roleReq');
      valid = false;
    }
    const str1 = selectedRole.roleName.replace(/[^a-zA-Z0-9]/g, '');
    const str2 = selectedRole.roleName.replace(/^0+/, "");
    if (!isNaN(selectedRole.roleName) || str1.trim().length === 0 || str2.trim().length === 0) {
      validation["roleName"] = "Please enter meaningful Role Name!";
      valid = false;
    }

    if (!selectedRole.roleDescription || selectedRole.roleDescription.trim().length === 0) {
      validation["roleDescription"] = t('componentData.permissions.roleDesReq');
      valid = false;
    }
    this.setState({ validation: { ...validation } });

    return valid;
  };

  /*
        copy permission for selected roles drop down
    */
  handleCopyPermission = (event) => {
    const sourceRoleId = event.target.value;
    this.setState(
      {
        sourceRoleId: sourceRoleId,
      },
      () => {
        if (sourceRoleId) {
          this.fetchPermissionsByRoleId(sourceRoleId);
        }
      }
    );
  };

  onRoleChange = (event) => {
    this.setState({
      selected: {
        ...this.state.selected,
        [event.target.name]: event.target.value,
      },
    });
  };

  onClearAllPermissions = (event) => {
    this.setState({
      permissionsGranted: [],
    });
  };

  flatten = (arr) => {
    return arr.reduce(
      (flat, next) =>
        flat.concat(Array.isArray(next) ? this.flatten(next) : next),
      []
    );
  };

  onSaveAllPermissions = (event) => {
    const { rolePermissionOptions } = this.state;
    const allPermissions = this.flatten(
      rolePermissionOptions.map(({ RightsGroup }) =>
        RightsGroup.map(({ Rights }) =>
          Rights.map(({ AccessRightMappingId }) => {
            return AccessRightMappingId;
          })
        )
      )
    );

    this.setState({ permissionsGranted: allPermissions });
  };

  onGroupSelection = (event, rightsGroup) => {
    const { permissionsGranted } = this.state;
    let newPermissions = [];
    const allGroupPermissons = this.flatten(
      rightsGroup.map(({ Rights }) =>
        Rights.map(({ AccessRightMappingId }) => {
          return AccessRightMappingId;
        })
      )
    );
    if (event.target.checked) {
      newPermissions = new Set([...permissionsGranted, ...allGroupPermissons]);
    } else {
      newPermissions =
        permissionsGranted &&
        permissionsGranted.filter(
          (item) => allGroupPermissons.indexOf(item) == -1
        );
    }

    this.setState({ permissionsGranted: [...newPermissions] });
  };

  onChangePermission = (event) => {
    const { value, checked } = event.target;
    const currentPermissionIDs = this.state.permissionsGranted;
    let permissionIDs;
    if (checked) {
      permissionIDs = [...currentPermissionIDs, parseInt(value)];
    } else {
      let index = currentPermissionIDs.indexOf(parseInt(value));
      if (index > -1) {
        permissionIDs = currentPermissionIDs.splice(index, 1);
      }
      permissionIDs = currentPermissionIDs;
    }
    this.setState({
      permissionsGranted: permissionIDs,
    });
  };

  render() {
    const {
      roleList,
      sourceRoleId,
      alertMessage,
      alertMessageCallbackType,
      updateProgress,
    } = this.state;
    return (
      <Fragment>
        <RolesPermission
          roleList={roleList}
          saveBtnClicked={this.saveBtnClicked}
          backToRolesScreen={this.backToRolesScreen}
          sourceRoleId={sourceRoleId}
          selectedRole={this.state.selected}
          onRoleChange={this.onRoleChange}
          validation={this.state.validation}
          rolePermissionOptions={this.state.rolePermissionOptions}
          permissionsGranted={this.state.permissionsGranted}
          onSaveAllPermissions={this.onSaveAllPermissions}
          onClearAllPermissions={this.onClearAllPermissions}
          onChangePermission={this.onChangePermission}
          handleCopyPermission={this.handleCopyPermission}
          onGroupSelection={this.onGroupSelection}
          updateProgress={updateProgress}
          claims={this.props.user.userRoles}
        />
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
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
export default withTranslation()(connect((state) => ({ ...state.user, ...state.role }))(
  Permissions
));
