import React from "react";
import {
  Grid,
  Card,
  Box,
  Button,
  CircularProgress,
  Typography
} from "@material-ui/core";
import {
  getNotifications,
  setNotification,
} from "~/redux/actions/notifications";
import { AlertDialog } from "~/components/Dialogs/index";
import CheckboxGroup from "~/components/Forms/CheckboxGroup";
import { connect } from "react-redux";
import "./styles.scss";
import { withTranslation } from "react-i18next";

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
      isLoading: false,
      fetchingList: true,
      alertMessage: "",
      alertMessageCallbackType: null,
      updateProgress: false,
    };
  }

  componentDidMount() {
    this.fetchNotification();
  }

  fetchNotification = () => {
    this.setState(
      {
        fetchingList: true,
      },
      () => {
        const { userData } = this.props.user;
        this.props
          .dispatch(
            getNotifications({
              userId: userData.userId,
              portalTypeId: userData.portalTypeId,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                //alertType: "error",
                //alertMessage: this.props.notification.error,
                //alertMessageCallbackType: null,
                isLoading: false,
                fetchingList: false,
              });
              return false;
            }

            this.setState({
              isLoading: false,
              fetchingList: false,
              details: this.props.notification.details,
            });
          });
      }
    );
  };

  setDialogMessage(message) {
    this.setState({ message: message, flag: true });
  }

  hideDialogMessage() {
    this.setState({ flag: false, message: "" });
  }

  saveDetails = () => {
    const { userId, portalProfileId } = this.props.user.info;
    let notificationData = [];
    this.setState({ btnLoader: true }, () => {
      this.state.notiListData.forEach((obj) => {
        obj.notificationTypes.forEach((type) => {
          notificationData.push({
            notificationTypeId: type.notificationTypeId,
            notificationGroupId: obj.notificationGroupId,
            isActive: type.isActive == true ? 1 : 0,
          });
        });
      });

      let payload = {
        userId: userId,
        portalTypeId: 3,
        portalProfileId: portalProfileId,
        notificationData: notificationData,
      };
      setNotification(payload).then((response) => {
        this.setDialogMessage(response.message);
        this.setState({ btnLoader: false });
      });
    });
  };

  handleSubmit = () => {
    const { details } = this.state;
    const { t } = this.props;
    this.setState(
      {
        updateProgress: true,
      },
      () => {
        const { userData } = this.props.user;
        let notificationData = [];
        details &&
          details.forEach((obj) => {
            obj.notificationTypes &&
              obj.notificationTypes.forEach((type) => {
                notificationData.push({
                  notificationTypeId: type.notificationTypeId,
                  notificationGroupId: obj.notificationGroupId,
                  isActive: type.isActive,
                });
              });
          });
        this.props
          .dispatch(
            setNotification({
              userId: userData.userId,
              portalTypeId: userData.portalTypeId,
              portalProfileId: userData.portalProfileId,
              notificationData: notificationData,
            })
          )
          .then((response) => {
            if (!response) {
              this.setState({
                alertMessage: this.props.notification.error,
                alertMessageCallbackType: null,
                updateProgress: false,
              });
              return false;
            }

            this.setState({
              updateProgress: false,
              showDetail: false,
              editDetail: false,
              alertMessage: t(
                "componentData.profileNotification.NotificationsUpdated"
              ),
              alertMessageCallbackType: null,
            });
          });
      }
    );
  };

  handleChange = (itemIndex, res, value) => {
    const { details } = this.state;
    const newData = [...details];
    newData.map((obj) => {
      obj.notificationTypes &&
        obj.notificationTypes.map((item, index) => {
          if (item.notificationTypeId == res.notificationTypeId) {
            item.isActive = value.value;
          }
        });
    });
    this.setState({ details: [...newData] });
  };

  hideAlertMessage = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
  };

  goBack = () => {
    this.setState({
      alertMessage: null,
      alertMessageCallbackType: null,
    });
  };

  render() {
    const {
      alertMessage,
      alertMessageCallbackType,
      details,
      isLoading,
      updateProgress,
    } = this.state;
    const { t } = this.props;

    if (isLoading) {
      return (
        <Box display="flex" p={10} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return (
      <Box mx={6} my={1}>
        <Card>
          {details && details.length !== 0 && (
            <Box mt={2} mx={4}>
              <b>{t("componentData.profileNotification.msgTxt")}</b>
            </Box>
          )}
          <Box p={4}>
            <Grid item xs={12}>
              <Grid
                container
                item
                m={5}
                style={{ justifyContent: "space-between" }}
              >
                {details &&
                  details.length != 0 &&
                  details.map((detail, parentIndex) => {
                    return detail.notificationTypes &&
                      detail.notificationTypes.length > 0 ? (
                      <Grid
                        xs={6}
                        mx={5}
                        p={1}
                        style={{
                          display: "block",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <h4>{detail.description}</h4>
                        {detail.notificationTypes &&
                          detail.notificationTypes.map((res, index) => {
                            return (
                              <Grid item sm={11} xs={11}>
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  p={1}
                                  key={res.index}
                                >
                                  <Box width="70%">
                                    <Typography variant="body1">
                                      {res.notificationName}
                                    </Typography>
                                  </Box>
                                  <Box
                                    p={1}
                                    width={"30%"}
                                    className={
                                      res.isActive ? "" : "offContainer"
                                    }
                                  >
                                    <CheckboxGroup
                                      color="default"
                                      options={[
                                        {
                                          label: t(
                                            "componentData.profileNotification.On"
                                          ),
                                          value: 1,
                                        },
                                        {
                                          label: t(
                                            "componentData.profileNotification.Off"
                                          ),
                                          value: 0,
                                        },
                                      ]}
                                      onChange={(value, index, event) =>
                                        this.handleChange(index, res, value)
                                      }
                                      selectedOption={res.isActive || 0}
                                    />
                                  </Box>
                                </Box>
                              </Grid>
                            );
                          })}
                      </Grid>
                    ) : null;
                  })}
                {details && details.length == 0 && (
                  <Box dispplay="flex" justifyContent="center">
                    <Box display="block" textAlign="center" width={1} my={6}>
                      <img
                        src={require("~/assets/icons/bankFile_No_data.svg")}
                        alt=""
                      />

                      <Box py={3} color="#A1A1A1" fontSize={14} display="block">
                        {" "}
                        {t(
                          "componentData.profileNotification.NoDataToShow"
                        )}{" "}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>

            {details && details.length > 0 && (
              <Grid xs={12}>
                <Box display="flex" justifyContent="center" p={3}>
                  {updateProgress ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => this.handleSubmit()}
                      disableElevation
                    >
                      {t("componentData.profileNotification.Save")}
                    </Button>
                  )}
                </Box>
              </Grid>
            )}
          </Box>
        </Card>
        {alertMessage &&
          this.renderAlertMessage("", alertMessage, alertMessageCallbackType)}
      </Box>
    );
  }

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
    ...state.notification,
  }))(Notifications)
);
