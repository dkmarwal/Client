import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import SubHeader from "~/components/SubHeader";
import ListView from "./User/ListView/";
import UserEdit from "./User/EditView/";
import UserAdd from "./User/AddView/";
import Role from "./Role/ListView";
import Permissions from "./Role/Permissions";
import { withStyles } from "@material-ui/styles";
import config from "~/config";
import { connect } from "react-redux";
import styles from "./styles";
import { accessRights } from "~/config/accessRights";
import { withTranslation } from 'react-i18next';

class AuthRoute extends Component {
  isAllowed(claims, name) {
    //return true;

    const permissions = claims;
    const accessId = accessRights[name] || null;
    const isEnabled = accessId && permissions && permissions.includes(accessId);
    if (isEnabled) {
      return true;
    }
    return false;
  }

  render() {
    const {
      component: Component,
      name,
      claims,
      title,
      alias,
      ...rest
    } = this.props;
    const isAccessable = this.isAllowed(claims, name);
    return (
      <Route
        exact={true}
        {...rest}
        render={(props) =>
          isAccessable === true ? (
            <Fragment>
              <SubHeader
                {...props}
                title={title}
                alias={alias}
                name={name}
                claims={claims}
              />
              <Component {...props} />
            </Fragment>
          ) : null
        }
      />
    );
  }
}

class UserManagement extends Component {
  render() {
    const { user, classes } = this.props;
    const claims = user.userRoles;
    const { t } = this.props;
    return (
      <div className={classes.root}>
        <Fragment>
          <Switch>
            <AuthRoute
              exact
              path={`${config.baseName}/manage/user`}
              component={ListView}
              claims={claims}
              name={"USER_VIEW"}
              title= {t('componentData.userRoleView.Users')}
              alias="USER_VIEW"
            />
            <AuthRoute
              exact
              path={`${config.baseName}/manage/user/add`}
              component={UserAdd}
              claims={claims}
              name={"USER_ADD"}
              title= {t('componentData.userRoleView.Adduser')}
              alias="none"
            />
            <AuthRoute
              exact
              path={`${config.baseName}/manage/user/edit/:userId`}
              component={UserEdit}
              claims={claims}
              name={"USER_EDIT"}
              title= {t('componentData.userRoleView.EditUser')}
              alias="none"
            />
            <AuthRoute
              exact
              path={`${config.baseName}/manage/user/role`}
              component={Role}
              claims={claims}
              name={"USER_ROLE_VIEW"}
              title= {t('componentData.userRoleView.Roles')}
              alias="USER_ROLE_VIEW"
            />
            <AuthRoute
              exact
              path={`${config.baseName}/manage/user/permissions/add`}
              component={Permissions}
              claims={claims}
              name={"USER_ROLE_ADD"}
              title= {t('componentData.userRoleView.AddRole')}
              alias="USER_ROLE_VIEW"
            />
            <AuthRoute
              exact
              path={`${config.baseName}/manage/user/permissions/:roleId`}
              component={Permissions}
              claims={claims}
              name={"USER_ROLE_VIEW"}
              title= {t('componentData.userRoleView.EditRole')}
              alias="USER_ROLE_VIEW"
            />
          </Switch>
        </Fragment>
      </div>
    );
  }
}

export default withTranslation()(connect((state) => ({ ...state.user }))(
  withStyles(styles)(UserManagement)
));
