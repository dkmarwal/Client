import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Cookies from "universal-cookie";

import {
  Typography,
  Box,
  Grid,
  Divider,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
} from "@material-ui/core";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import {
  getNotifications,
  processNotificationsAction,
} from "../../redux/helpers/notificationSetttings";
import { NoitificationDialog } from "~/components/Dialogs";
import NotificationAction from "./NotificationAction";
import { connect } from "react-redux";
import socketIOClient from "socket.io-client";
import NotiProfileIcon from "~/assets/icons/notiProfile.svg";
import NotiProfileUnreadIcon from "~/assets/icons/notiProfileUnread.svg";
import PayFileReceivedIcon from "~/assets/icons/payFileReceived.svg";
import PayFileReceivedUnreadIcon from "~/assets/icons/payFileReceivedUnread.svg";
import PayFileWaitForApprovalIcon from "~/assets/icons/payFileWaitForApproval.svg";
import PayFileWaitForApprovalUnreadIcon from "~/assets/icons/payFileWaitForApprovalUnread.svg";
import PayFileFailIcon from "~/assets/icons/payFileFail.svg";
import PayFileFailUnreadIcon from "~/assets/icons/payFileFailUnread.svg";
import CampFileReceivedIcon from "~/assets/icons/campFileReceived.svg";
import CampFileReceivedUnreadIcon from "~/assets/icons/campFileReceivedUnread.svg";
import CampFileWaitForApprovalIcon from "~/assets/icons/campFileWaitForApproval.svg";
import CampFileWaitForApprovalUnreadIcon from "~/assets/icons/campFileWaitForApprovalUnread.svg";
import CampFileFailIcon from "~/assets/icons/campFileFail.svg";
import CampFileFailUnreadIcon from "~/assets/icons/campFileFailUnread.svg";
import config from "~/config";
import BannerNotification from "../../components/BannerNotification";
import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";
import moment from "moment";
import "moment/locale/fr";
import "moment/locale/es";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    marginRight: theme.spacing(2),
    maxHeight: 470,
    overflowY: "auto",
    overflowX: "hidden",
    minWidth: "400px",
  },
  notifySidePanel: {
    padding: "0px",
  },
}));
const usePropoverStyles = makeStyles((theme) => ({
  menuList: {
    display: "flex",
    flexDirection: "row",
  },
  paper: {
    height: "80vh",
    overflow: "hidden",
  },
}));

const useMenuListStyles = makeStyles((theme) => ({
  menuList: {
    width: "100%",
    flexDirection: "column",
  },
  menuItem: {
    width: "100%",
    flexDirection: "row",
  },

  // paper: {
  //     height: '80vh',
  //     overflow: 'hidden',
  // }
}));

const useCustomStyles = makeStyles((theme) => ({
  notificationContainer: {
    position: "relative",
  },
  notificationAlert: {
    textAlign: "center",
    width: "15px",
    borderRadius: "50%",
    height: "15px",
    backgroundColor: "red",
    position: "absolute",
    left: "20px",
    top: "0px",
  },
  notiCount: {},
  menuList: {
    width: "100%",
  },
  content: {
    color: "#7F7F7F",
    fontWeight: "normal",
    // whiteSpace: 'pre-wrap'
  },
  item: {
    padding: "0px",
  },
  headTitle: {
    color: "#1C4B6B",

    marginLeft: "15px",
    // fontSize: '18px',
  },
  underlIned: {
    textTransform: "none",
    textDecoration: "underline",
    color: "#286787",
    cursor: "pointer",
  },
  title: {
    color: "rgba(0,0,0,0.87)",
  },
  text: {
    color: "#7F7F7F",
    fontWeight: "normal",
  },
  timestamp: {
    color: "#286787",
  },
  Icon: {
    //     marginRight: '15px'
    width: "15px",
    height: "15px",
  },

  notificationList: {
    height: "100%",
    alignItems: "stretch",
  },
  divider: {
    height: "1px",
    // width: '100%',
    opacity: "0.12",
    backgroundColor: "#000000",
  },
  notiCatgoryIcon: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    backgroundColor: `#E8F1F5`,
    borderRadius: "50%",
    width: "50px",
    height: "50px",
  },
  circleUnread: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    // backgroundColor: `${theme.palette.primary.text}`,
    backgroundColor: `#002D72`,
    borderRadius: "50%",
    width: "50px",
    height: "50px",
  },
  noNotifications: {
    padding: "10px",
    display: "flex",
    alignItems: "center",
  },
}));

function SystemNotifications({ user, history, t }) {
  const cookies = new Cookies();
  const lang = cookies.get("localeLang") || "en";

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState();
  const anchorRef = useRef(null);
  const [clearNotify, setClearNotify] = useState(true);
  const [readNotify, setReadNotify] = useState(true);
  const [showAllNotification, setShowAllNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    openNotiCounter: 0,
    title: "",
    description: "",
  });
  const [openSystemNotification, setOpenSystemNotification] = useState(false);

  useEffect(() => {
    if (user.userData) {
      setUserId(user.userData.userId);
    }
    fetchNotifications();
  }, [clearNotify, readNotify]);

  useEffect(() => {
    if (user.userData) {
      setUserId(user.userData.userId);
    }

    // const socket = socketIOClient(config.apiBase.notificationSocket, {
    //   path: "/socket",
    // });
    // socket.on("connect", () => {});
    // socket.emit("subscribe_notification", { userId: user.userData.userId });
    // socket.on("new_notification", ({ title, description, counter }) => {
    //   const desc = description
    //     ? description.substr(0, description.indexOf(".") + 1)
    //     : "";
    //   setNotificationData({
    //     title,
    //     //description,
    //     description: desc,
    //     openNotiCounter: counter,
    //   });
    //   setOpenSystemNotification(true);
    //   fetchNotifications();
    // });
    // // CLEAN UP THE EFFECT
    // return () => socket.disconnect();
  }, []);

  // classes define
  const classes = useStyles();
  const customClasses = useCustomStyles();
  const propoverClass = usePropoverStyles();
  const menuListClasses = useMenuListStyles();

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(user.userData.userId);
      const notificationsFilter = response.data?.filter((item) => {
        return item.status === 0;
      })
      if (!response.error && response.data) {
        const Notifications =
          response.data &&
          response.data.reduce((obj, values) => {
            obj[values.notificationId] = values;
            return obj;
          }, {});
          setNotificationData({
            // openNotiCounter: Object.keys(Notifications).length,
            openNotiCounter: notificationsFilter.length,
          });
        setNotifications(Notifications);
      }
    } catch (error) {
      // NotificationManager.error(error || 'Server Exception', 'Error!!', 2000);
    }
  };

  const ClearAllNotificationHandler = async () => {
    if (clearNotify) {
      const response = await notificationAction(userId, 1, "clearAll");
      if (response) {
        setClearNotify(false);
      }
    } else {
      const response = await notificationAction(userId, 1, "undoClearAll");
      if (response) {
        setClearNotify(true);
      }
    }
  };

  const readAllNotificationHandler = () => {
    if (readNotify) {
      notificationAction(userId, 1, "markReadAll");
    } else {
      notificationAction(userId, 1, "undoMarkReadAll");
    }
  };

  const markReadNotification = async (
    readNotify,
    userId,
    NotificationId,
    action
  ) => {
    const response = notificationAction(userId, NotificationId, action);
    const status = Boolean(readNotify) ? 0 : 1;

    if (response) {
      setNotifications({
        ...notifications,
        [NotificationId]: {
          ...notifications[NotificationId],
          status: status,
        },
      });
    }
  };

  const markClearNotification = async (
    clearNotify,
    userId, 
    NotificationId, 
    action
    ) => {
    const response = notificationAction(userId, NotificationId, action);
    if (response) {
      const { [NotificationId]: omit, ...res } = notifications;

      setNotifications(res);
    }
  };

  const notificationAction = async (userId, NotificationId, action) => {
    const response = await processNotificationsAction(
      userId,
      NotificationId,
      action
    ); // user id

    if (response) {
      if (action === "clearAll") {
        setClearNotify(false);
        setNotifications({});
      } else if (action === "undoClearAll") {
        setClearNotify(true);
      } else if (action === "markReadAll") {
        setReadNotify(false);
      } else if (action === "undoMarkReadAll") {
        setReadNotify(true);
      }
      return true;
    } else {
      return false;
    }
  };

  const handleToggle = (e) => {
    setOpen((prevOpen) => !prevOpen);
    setNotificationData({
      ...notificationData,
      openNotiCounter: 0,
    });
  };

  const handleClose = (event) => {
    event.preventDefault();
    setOpen(false);
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    prevOpen.current = open;
  }, [open]);

  const earlierHeader = (createdAt) => {
    if (Date.parse(new Date()) - Date.parse(createdAt) > 86400000) {
      earlierString();
    }
    return null;
  };

  var earlierString = (function () {
    var executed = false;
    return function () {
      if (!executed) {
        executed = true;
        return (
          <MenuItem classsName={classes.item}>
            <Typography variant="h3" className={customClasses.headTitle}>
              {t("componentData.systemNotification.Earlier")}
            </Typography>
          </MenuItem>
        );
      }
    };
  })();

  const handleCloseNotification = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSystemNotification(false);
  };

  const onClickNotification = (
    event,
    readStatus,
    notificationId,
    notificationTypeId,
    notificationGroupId
  ) => {
    if (!Boolean(readStatus)) {
      markReadNotification(readStatus, userId, notificationId, "markRead");
    }

    gotoUrl(notificationTypeId, event);
  };

  const gotoUrl = (notificationTypeId, event) => {
    let url;
    switch (notificationTypeId) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 137438953472:
        url = "payments/paymentFiles";
        break;
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 4194304:
        url = "settings";
        break;
      case 1024:
        url = "suppliers/mySupplier";
        break;
      case 2048:
      case 4096:
      case 1048576:
        url = "suppliers/supplierUpdates";
        break;
      case 549755813888:
      case 4398046511104:
      case 1099511627776:
        url = "suppliers/campaignFiles";
        break;
      default:
        return;
    }

    handleToggle(event);
    setShowAllNotification(false);
    history.push(`${config.baseName}/${url}`);
  };

  const { openNotiCounter, title, description } = notificationData;

  return (
    <div className={classes.root}>
      <Box alignItems="center" display="flex" position="relative">
        <NotificationsNoneIcon
          ref={anchorRef}
          variant="contained"
          color="primary"
          fontSize="small"
          style={{ cursor: "pointer" }}
          onClick={(event) => handleToggle(event)}
          onDoubleClick={(event) => handleToggle(event)}
        />

        {Boolean(openNotiCounter) ? (
          <Box className={customClasses.notificationAlert}>
            {openNotiCounter}
          </Box>
        ) : null}

        <Popper
          classes={propoverClass}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper className={classes.paper} style={{ width: 520 }}>
                <ClickAwayListener onClickAway={(event) => handleClose(event)}>
                  {Object.keys(notifications).length > 0 ? (
                    <Grid container direction="column" spacing={1}>
                      <Grid
                        container
                        item
                        justify="space-between"
                        alignItems="flex-end"
                      >
                        <Grid item xs={3}>
                          <Typography
                            variant="h2"
                            className={customClasses.headTitle}
                          >
                            {t("componentData.systemNotification.New")}
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <Typography
                            variant="h5"
                            className={customClasses.underlIned}
                            onClick={ClearAllNotificationHandler}
                          >
                            {clearNotify
                              ? t(
                                  "componentData.systemNotification.ClearAllNotification"
                                )
                              : t(
                                  "componentData.systemNotification.UndoClearNotification"
                                )}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          {" "}
                          <Typography
                            variant="h5"
                            className={customClasses.underlIned}
                            onClick={readAllNotificationHandler}
                          >
                            {readNotify
                              ? t(
                                  "componentData.systemNotification.MarkAllAsRead"
                                )
                              : t(
                                  "componentData.systemNotification.UndoReadAll"
                                )}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item container className={classes.MenuContainer}>
                        <Box className={menuListClasses.menuList}>
                          {Object.keys(notifications)
                            .reverse()
                            .filter((value, i) => i < 5)
                            .map((key, i) => {
                              const {
                                title,
                                description,
                                createdAt,
                                notificationId,
                                status,
                                NotificationTypeMapping,
                              } = notifications[key] || {};
                              const {
                                notificationGroupId = 1,
                                notificationTypeId = 1,
                              } = NotificationTypeMapping || {};
                              return (
                                <>
                                  {earlierHeader(createdAt)}
                                  <Box
                                    classsName={menuListClasses.menuItem}
                                    key={i}
                                    p={1}
                                  >
                                    <Grid
                                      container
                                      direction="row"
                                      className={customClasses.notificationList}
                                      alignItems="center"
                                    >
                                      <Grid
                                        item
                                        xs={3}
                                        className={
                                          customClasses.notiCatgoryIcon
                                        }
                                        alignItems="center"
                                        justify="center"
                                        onClick={(event) =>
                                          onClickNotification(
                                            event,
                                            status,
                                            notificationId,
                                            notificationTypeId,
                                            notificationGroupId
                                          )
                                        }
                                      >
                                        {Boolean(status) ? (
                                          <PaymentReadImage
                                            groupId={notificationTypeId}
                                          />
                                        ) : (
                                          <PaymentUnreadImage
                                            groupId={notificationTypeId}
                                          />
                                        )}
                                      </Grid>
                                      <Grid
                                        item
                                        xs={7}
                                        direction="column"
                                        alignItems="left"
                                        style={{ cursor: "pointer" }}
                                        onClick={(event) =>
                                          onClickNotification(
                                            event,
                                            status,
                                            notificationId,
                                            notificationTypeId,
                                            notificationGroupId
                                          )
                                        }
                                      >
                                        <Typography
                                          noWrap
                                          variant="h4"
                                          title={title || ""}
                                          className={
                                            !Boolean(status)
                                              ? customClasses.title
                                              : customClasses.content
                                          }
                                        >
                                          {title}
                                        </Typography>
                                        <Typography
                                          noWrap
                                          variant="h4"
                                          title={description || ""}
                                          className={
                                            !Boolean(status)
                                              ? customClasses.text
                                              : customClasses.content
                                          }
                                        >
                                          {description}
                                        </Typography>
                                        <Typography
                                          variant="h5"
                                          className={
                                            Boolean(!status)
                                              ? customClasses.timestamp
                                              : customClasses.content
                                          }
                                        >
                                          {" "}
                                          {moment(createdAt)
                                            .locale(lang)
                                            .fromNow()
                                            .replace(/\b[a-z]/, (match) =>
                                              match.toUpperCase()
                                            )}
                                          {/*<Moment fromNow>{createdAt}</Moment>*/}
                                        </Typography>
                                      </Grid>
                                      <Grid item xs={2} alignItems="center">
                                        <NotificationAction
                                          userId={userId}
                                          read={status}
                                          //clearNotify={status}
                                          markReadNotification={
                                            markReadNotification
                                          }
                                          markClearNotification={
                                            markClearNotification
                                          }
                                          NotificationId={notificationId}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Box>

                                  <Divider className={customClasses.divider} />
                                </>
                              );
                            })}
                        </Box>
                      </Grid>
                      {Object.keys(notifications).length > 4 && (
                        <Grid item container justify="center">
                          <Typography
                            variant="overline"
                            className={customClasses.underlIned}
                            onClick={() => {
                              setShowAllNotification(true);
                              setOpen((prevOpen) => !prevOpen);
                            }}
                          >
                            {t(
                              "componentData.systemNotification.ShowAllNotification"
                            )}{" "}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  ) : (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignContent="center"
                      width="100%"
                      height="100px"
                    >
                      <Typography
                        variant="h3"
                        className={customClasses.noNotifications}
                      >
                        {t(
                          "componentData.systemNotification.NoNotificationstoShare"
                        )}
                      </Typography>
                    </Box>
                  )}
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        {showAllNotification && (
          <NoitificationDialog
            showButton={false}
            alignSide={true}
            onConfirm={() => {
              setShowAllNotification(false);
            }}
            title={t("componentData.systemNotification.Notifications")}
            className={classes.notifySidePanel}
          >
            <Grid container direction="column" spacing={1}>
              <Grid
                container
                item
                justify="space-between"
                alignItems="flex-end"
              >
                <Grid item xs={3}>
                  {" "}
                  <Typography variant="h2" className={customClasses.headTitle}>
                    {" "}
                    {t("componentData.systemNotification.New")}
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  {" "}
                  <Typography
                    variant="h5"
                    className={customClasses.underlIned}
                    onClick={ClearAllNotificationHandler}
                  >
                    {clearNotify
                      ? t(
                          "componentData.systemNotification.ClearAllNotification"
                        )
                      : t(
                          "componentData.systemNotification.UndoClearNotification"
                        )}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  {" "}
                  <Typography
                    variant="h5"
                    className={customClasses.underlIned}
                    onClick={readAllNotificationHandler}
                  >
                    {readNotify
                      ? t("componentData.systemNotification.MarkAllAsRead")
                      : t("componentData.systemNotification.UndoReadAll")}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container className={classes.MenuContainer}>
                <Box className={menuListClasses.menuList}>
                  {Object.keys(notifications).length > 0 &&
                    Object.keys(notifications)
                      .reverse()
                      .map((key, i) => {
                        const {
                          title,
                          description,
                          createdAt,
                          notificationId,
                          status,
                          NotificationTypeMapping,
                        } = notifications[key] || {};
                        const {
                          notificationGroupId = 1,
                          notificationTypeId = 1,
                        } = NotificationTypeMapping || {};
                        return (
                          <>
                            {earlierHeader(createdAt)}
                            <Box
                              classsName={menuListClasses.menuItem}
                              key={i}
                              p={1}
                            >
                              <Grid
                                container
                                direction="row"
                                className={customClasses.notificationList}
                                alignItems="center"
                              >
                                <Grid
                                  item
                                  xs={3}
                                  className={customClasses.notiCatgoryIcon}
                                  alignItems="center"
                                  justify="center"
                                  onClick={(event) =>
                                    onClickNotification(
                                      event,
                                      status,
                                      notificationId,
                                      notificationTypeId,
                                      notificationGroupId
                                    )
                                  }
                                >
                                  {Boolean(status) ? (
                                    <PaymentReadImage
                                      groupId={notificationTypeId}
                                    />
                                  ) : (
                                    <PaymentUnreadImage
                                      groupId={notificationTypeId}
                                    />
                                  )}
                                </Grid>
                                <Grid
                                  item
                                  xs={7}
                                  direction="column"
                                  alignItems="left"
                                  style={{ cursor: "pointer" }}
                                  onClick={(event) =>
                                    onClickNotification(
                                      event,
                                      status,
                                      notificationId,
                                      notificationTypeId,
                                      notificationGroupId
                                    )
                                  }
                                >
                                  <Typography
                                    noWrap
                                    variant="h4"
                                    title={title || ""}
                                    className={
                                      !Boolean(status)
                                        ? customClasses.title
                                        : customClasses.content
                                    }
                                  >
                                    {title}
                                  </Typography>
                                  <Typography
                                    noWrap
                                    variant="h4"
                                    title={description || ""}
                                    className={
                                      !Boolean(status)
                                        ? customClasses.text
                                        : customClasses.content
                                    }
                                  >
                                    {description}
                                  </Typography>
                                  <Typography
                                    variant="h5"
                                    className={
                                      Boolean(!status)
                                        ? customClasses.timestamp
                                        : customClasses.content
                                    }
                                  >
                                    {" "}
                                    {/*<Moment fromNow>{createdAt}</Moment>*/}
                                    {moment(createdAt)
                                      .locale(lang)
                                      .fromNow()
                                      .replace(/\b[a-z]/, (match) =>
                                        match.toUpperCase()
                                      )}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2} alignItems="center">
                                  <NotificationAction
                                    userId={userId}
                                    read={status}
                                    markReadNotification={markReadNotification}
                                    markClearNotification={
                                      markClearNotification
                                    }
                                    NotificationId={notificationId}
                                  />
                                </Grid>
                              </Grid>
                            </Box>

                            <Divider className={customClasses.divider} />
                          </>
                        );
                      })}
                </Box>
              </Grid>
            </Grid>
          </NoitificationDialog>
        )}
        <NotificationContainer />
        {openSystemNotification && (
          <BannerNotification
            title={title}
            description={description}
            handleClose={handleCloseNotification}
          />
        )}
      </Box>
    </div>
  );
}

export default withTranslation()(
  connect((state) => ({ ...state.user }))(withRouter(SystemNotifications))
);

function PaymentReadImage({ groupId }) {
  const customClasses = useCustomStyles();
  useEffect(() => {});

  return (
    <Box className={customClasses.circle}>
      {groupId === 1 ? (
        <img src={PayFileReceivedIcon} alt="Setting" />
      ) : groupId === 2 ? (
        <img src={PayFileWaitForApprovalIcon} alt="$" />
      ) : groupId === 4 ? (
        <img src={NotiProfileIcon} alt="Payee" />
      ) : groupId === 137438953472 ? (
        <img src={PayFileFailIcon} alt="Payee" />
      ) : groupId === 549755813888 ? (
        <img src={CampFileReceivedIcon} alt="Payee" />
      ) : groupId === 4398046511104 ? (
        <img src={CampFileFailIcon} alt="Payee" />
      ) : groupId === 1099511627776 ? (
        <img src={CampFileWaitForApprovalIcon} alt="Payee" />
      ) : (
        <AccountCircleIcon fontSize="small" />
      )}
    </Box>
  );
}

function PaymentUnreadImage({ groupId }) {
  useEffect(() => {});
  const customClasses = useCustomStyles();

  return (
    <Box className={customClasses.circleUnread}>
      {groupId == 1 ? (
        <img src={PayFileReceivedUnreadIcon} alt="Setting" />
      ) : groupId == 2 ? (
        <img src={PayFileWaitForApprovalUnreadIcon} alt="$" />
      ) : groupId == 4 ? (
        <img src={NotiProfileUnreadIcon} alt="Payee" />
      ) : groupId === 137438953472 ? (
        <img src={PayFileFailUnreadIcon} alt="Payee" />
      ) : groupId === 549755813888 ? (
        <img src={CampFileReceivedUnreadIcon} alt="Payee" />
      ) : groupId === 4398046511104 ? (
        <img src={CampFileFailUnreadIcon} alt="Payee" />
      ) : groupId === 1099511627776 ? (
        <img src={CampFileWaitForApprovalUnreadIcon} alt="Payee" />
      ) : null}
    </Box>
  );
}
