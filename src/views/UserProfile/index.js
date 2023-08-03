import React from "react";
import SubHeader from "~/components/_SubHeader";
import Profile from "~/modules/Profile";
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";
import { AlertDialog } from "~/components/Dialogs";
import {
  fetchUserProfileDetails,
  updateUserProfileDetails,
  fetchSecurityQuestions,
} from "~/redux/helpers/user";
import Notifications from "~/modules/ProfileNotification";
import Password from "~/modules/Password";
import Security from "~/modules/Security";

class UserProfile extends React.Component {
  state = {
    message: "",
    flag: false,
  };

  setDialogMessage(flag, message) {
    this.setState({ message: message, flag: flag });
  }

  hideAlertMessage() {
    this.setState({ message: "", flag: false });
  }

  getUserProfileDetails(userId) {
    return fetchUserProfileDetails(userId);
  }

  getSecurityQuestions() {
    //return fetchSecurityQuestions();
  }

  updateUserProfileDetails(payload) {
    return updateUserProfileDetails(payload);
  }

  render() {
    const { flag, message } = this.props.clientConfig.layout;
    const { isSSO } = this.props.user.userData;
    const {userData} = this.props.user;
    const { t } = this.props;
    
    const userName = userData ? (userData.firstName + " " + userData.lastName): t('componentData.userProfile.Profile');
    return (
      <div className={"paymentsTabContainer"}>
        <SubHeader
          {...this.props}
          title={userName || ""}
          alias={"profile"}
          tabs={[
            {
              url: "/user/profile",
              name: t('componentData.userProfile.Profile'),
              items: [],
              component: (
                <Profile
                  getUserProfileDetails={this.getUserProfileDetails.bind(this)}
                  updateUserProfileDetails={(payload) =>
                    this.updateUserProfileDetails(payload)
                  }
                />
              ),
              alias: "user",
              isProtected: true,
              showTab: true,
            },
            {
              url: "/user/password",
              name: t('componentData.userProfile.Password'),
              items: [],
              component: (
                <Password
                  getUserProfileDetails={this.getUserProfileDetails.bind(this)}
                  updateUserProfileDetails={(payload) =>
                    this.updateUserProfileDetails(payload)
                  }
                />
              ),
              alias: "user",
              isProtected: true,
              showTab: isSSO ? false : true,
            },
            {
              url: "/user/password",
              name: t('componentData.userProfile.Notifications'),
              items: [],
              component: (
                <Notifications
                  getUserProfileDetails={this.getUserProfileDetails}
                />
              ),
              alias: "user",
              isProtected: true,
              showTab: true,
            },
            {
              url: "/user/Security",
              name: t('componentData.IPSecurity.Security'),
              items: [],
              component: (
                <Security />
              ),
              alias: "user",
              isProtected: true,
              showTab: true,
            },
          ]}
        />

        {flag && (
          <AlertDialog
            title={message}
            open={flag}
            onConfirm={() => this.hideAlertMessage()}
          />
        )}
      </div>
    );
  }
}

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(UserProfile));
