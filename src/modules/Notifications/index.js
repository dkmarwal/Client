import React from "react";
import {
  Grid,
  Card,
  Box,
  Button,
  CircularProgress,
} from "@material-ui/core";
import {
  getNotifications,
  setNotification,
} from "../../redux/helpers/notifications";
import { connect } from "react-redux";
import { AlertDialog } from "~/components/Dialogs/index";
import "./styles.scss";
import { withTranslation } from 'react-i18next';

class Notifications extends React.Component {
  state = {
    flag: false,
    message: "",
    notiListData: [],
    userDetails: {},
    setNoti: {
      notificationTypes: [],
    },
  };

  componentDidMount() {
    const { userId } = this.props.user.userData;
    const portalTypeId = 2;
    // getNotifications(userId, portalTypeId).then((response) => {
    //   if (response.error) {
    //     this.setDialogMessage(response.message);
    //     return false;
    //   }
    //   response.data.map((obj) => {
    //     obj.notificationTypes.map((o) => {
    //       o.status = true;
    //     });
    //   });
    //   this.setState({ notiListData: response.data });
    // });
  }
  saveDetails = () => {
    const { userId, portalProfileId } = this.props.user.userData;
    const notificationData = [];
    this.state.notiListData.forEach((obj) => {
      obj.notificationTypes.forEach((type) => {
        notificationData.push({
          notificationTypeId: type.notificationTypeId,
          notificationGroupId: type.notificationGroupId,
          isActive: type.isActive == true ? 1 : 0,
        });
      });
    });
    const payload = {
      userId: userId,
      portalTypeId: 3,
      portalProfileId: portalProfileId,
      notificationData: notificationData,
    };
    setNotification(payload).then((response) => {
      this.setDialogMessage(response.message);
    });
  };
  onSiteChanged = (res) => {
    res.isActive = !res.isActive;
    this.setState({ ...this.state });
  };

  setDialogMessage(message) {
    this.setState({ message: message, flag: true });
  }

  hideDialogMessage() {
    this.setState({ flag: false, message: "" });
  }

  render() {
    const { t } = this.props;
    const { flag, message, notiListData } = this.state;
    return (
      <Box m={5}>
        <Card>
          <Box style={{ margin: "0 auto", display: "table" }}>
            {notiListData && notiListData.length > 0 && (
              <Grid xs={12} sm={12}>
                <Box my={2}>
                  <h3>
                    {t('componentData.notifications.msgTxt')}
                  </h3>
                </Box>
              </Grid>
            )}
            <Grid xs={12} sm={12}>
              {Object.keys(this.state.notiListData).map((rs) => {
                return (
                  <Box m={5}>
                    <h4>{this.state.notiListData[rs].description}</h4>
                    {this.state.notiListData[rs].notificationTypes.map(
                      (res, index) => {
                        return (
                          <div className="notifiRow" key={res.index}>
                            <label key={res.index}>
                              {res.notificationName}
                            </label>

                            <div className="switch">
                              <input
                                type="radio"
                                className="switch-input"
                                readOnly={false}
                                onChange={() => this.onSiteChanged(res)}
                                name={res.notificationName}
                                value={res.notificationTypeId}
                                id={res.notificationTypeId}
                                checked={res.isActive}
                              />
                              <label
                                htmlFor={res.notificationTypeId}
                                className="switch-label switch-label-off"
                              >
                                {t('componentData.notifications.ON')}
                              </label>
                              <input
                                type="radio"
                                className="switch-input"
                                name={res.notificationName}
                                readOnly={false}
                                value={res.notificationTypeId + "off"}
                                id={res.notificationTypeId + "off"}
                                checked={!res.isActive}
                                onChange={() => this.onSiteChanged(res)}
                              />
                              <label
                                htmlFor={res.notificationTypeId + "off"}
                                className="switch-label switch-label-on"
                              >
                                {t('componentData.notifications.OFF')}
                              </label>
                              <span className="switch-selection"></span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </Box>
                );
              })}
            </Grid>
          </Box>
          {notiListData && notiListData.length > 0 && (
            <Grid xs={12}>
              <Box my={12}>
                <div
                  style={{
                    justify: "center",
                    margin: "0 auto",
                    display: "table",
                  }}
                >
                  

                  <Box px={2}>
                    {false ? (
                      <CircularProgress color="primary" />
                    ) : (
                      <Button
                        variant="contained"
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          width: "120px",
                          margin: "0px 10px 0 0",
                        }}
                        color="primary"
                        onClick={() => this.saveDetails()}
                      >
                        {t('componentData.notifications.Save')}
                      </Button>
                    )}
                  </Box>
                </div>
              </Box>
            </Grid>
          )}
        </Card>
        {flag && (
          <AlertDialog
            title={message}
            onConfirm={this.hideDialogMessage.bind(this)}
          />
        )}
      </Box>
    );
  }
}

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.clientConfig,
}))(Notifications));
