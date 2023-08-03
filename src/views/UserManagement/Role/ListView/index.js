import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import SettingsIcon from '@material-ui/icons/Settings';
import RolesTable from './rolesTable';
import { fetchRoles } from "~/redux/actions/role";
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import Notification from '~/components/Notification';
import { AlertDialog } from "~/components/Dialogs";
import {Box, CircularProgress} from "@material-ui/core"
import config from '~/config'

class Role extends Component {

    constructor(props) {
        super(props);
        const { t } = this.props;
        this.state = {
            page: 0,
            rowsPerPage: 10,
            roleList : [],
            alertType:"success",
            alertMessage:"",
            alertMessageCallbackType:null,
            loading: true
        };

        this.columns = [
            { id: 'name', label: t('componentData.roleListView.name'), minWidth: 100 },
            { id: 'description', label: t('componentData.roleListView.description'), minWidth: 170 },
            { id: 'customize', label: t('componentData.roleListView.customize'), minWidth: 100, align: 'center' },
            { id: 'newrole', label: t('componentData.roleListView.newrole'), minWidth: 100, align: 'center'}
        ];
    }

    fetchRoleList = () => {
        this.props.dispatch(fetchRoles()).then((response) => {
            if (!response) {
                this.setState({
                    alertType:"error",
                    alertMessageCallbackType:null,
                    alertMessage: this.props.role.error
                });
                return false;
            }
            const rowData = [];
            this.props.role.list.map((role) => {
                rowData.push(this.createData(role.roleName,
                    role.description === null ? '' : role.description,
                    <SettingsIcon onClick={() => this.editData(role.roleId, role.roleName, role.description, role.isCustom, false)} />,
                    <ControlPointIcon onClick={() => this.editData(role.roleId, role.roleName, role.description, role.isCustom, true)} />
                ));
            });
            this.setState({
                roleList: this.props.role.list,
                loading: false
            });
        });
    }

    hideAlertMessage = () => {
        this.setState({
            alertMessage: null,
            alertType:null,
            alertMessageCallbackType:null,
        })
    }

    componentDidMount() {
        this.fetchRoleList();
    }

    editData = (id, name, description, customRole, newRole) => {
        this.props.history.push({
            pathname: `${config.baseName}/manage/user/permissions/${id}`,
            state: {
                roleId: id === "add" ? '' : id,
                roleName: name,
                roleDescription: description,
                isNewRole: newRole,
                isCustomRole: newRole === true ? 1 : customRole
            }
        });
    }

    createData = (name, description, customize, newrole) => {
        return { name, description, customize, newrole };
    };

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = (event) => {
         this.setState({ page: 0, rowsPerPage: +event.target.value });
    };

    render() {
        const {alertMessage, alertMessageCallbackType, loading} = this.state;
        return (
            <Fragment>
                {loading ? (
          <Box
            display="flex"
            p={10}
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress color="primary" />
          </Box>
        ) : (<><RolesTable page={this.state.page}
            rowsPerPage={this.state.rowsPerPage}
            rows={this.state.roleList}
            columns={this.columns}
            createData={this.createData}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage}
            editData={this.editData}
            claims={this.props.user.userRoles}
        />
        {alertMessage && this.renderAlertMessage('', alertMessage, alertMessageCallbackType)}</>)} 
            </Fragment>
        );
    }

    renderSnackbar =(type, message) => {
		return <Notification variant={type} message={message} handleClose={this.hideAlertMessage} />
	}

    renderAlertMessage = (title, message, callbackType) => {
        return <AlertDialog 
            dialogClassName={"alert-dialoge-root"}
            title={title} 
            message={message}
            onConfirm={() => {callbackType === 'REDIRECT' ? this.goBack() : this.hideAlertMessage() }} 
        />
    }
}

export default withTranslation()(connect(state => (
    { ...state.user, ...state.role }
))(Role))