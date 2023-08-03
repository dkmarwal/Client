import React, { useEffect, useState } from "react";
import {
  Box,
  makeStyles,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Avatar,
  Chip,
  FormControlLabel,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  Grid,
} from "@material-ui/core";
import { withTranslation } from 'react-i18next';
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import {
  getNotificationOptions,
  saveNotificationSetting,
  getUserNotifications,
} from "~/redux/helpers/notificationSetttings";
import ExpansionBar from "~/components/ExpansionBar";
import CheckBoxOutlineBlankOutlinedIcon from "@material-ui/icons/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import NotiSettingUpdateIcon from "~/assets/icons/notiSettingUpdate.svg";
import NotiPaymentUpdateIcon from "~/assets/icons/notiPaymentUpdate.svg";
import NotiSupplierUpdateIcon from "~/assets/icons/notiSupplierUpdate.svg";
import ChildCompany from "~/assets/icons/child_company.svg";
import SupplierPending from "~/assets/icons/supplier_pending.svg";
import NotiBellIcon from "~/assets/icons/notiBell.svg";

import TextField from "~/components/Forms/TextField";
import Phone from "~/components/TextBox/Phone";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    maxWidth: "730px",
    width: "100%",
    display: "block",
  },
  paper: {
    width: "100%",
    paddingTop: "15px",
  },
  container: {
    margin: "4px",
  },
  heading: {
    color: "#0B1941",
    fontSize: "16px",
    letterSpacing: "0.1px",
    lineHeight: "24px",
    textTransform: "uppercase",
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    height: "124px",
    width: "124px",
    background: "#E6E6E6",
    color: "#7F7F7F",
    margin: "auto",
  },
  name: {
    height: "24px",
    color: "rgba(0,0,0,0.87)",
    fontSize: "20px",
    letterSpacing: "0.15px",
    lineHeight: "24px",
    textAlign: "center",
    paddingRight: "5px",
    textTransform: "capitalize",
  },
  roleName: {
    margin: "5px",
    minWidth: "100px",
  },
  smallIcon: {
    width: "20px",
    height: "24px",
    color: "#F0582A",
  },
  textField: {
    width: "200px",
  },
  hide: {
    display: "none",
  },
  userHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
}));

export default withTranslation()(function UserEdit(props) {
  const classes = useStyles();
  const { t } = props;
  const {
    submit,
    userInfo,
    canEditAction,
    roleList,
    handleChange,
    handleSubmit,
    handleCancel,
    isEditEnabled,
    isLockEnabled,
    isUnlockEnabled,
    isDeleteEnabled,
    handleLock,
    handleDelete,
    validation,
    updateProgress,
  } = props;

  const [notificationOptions, setNotificationOptions] = useState([]);
  const [notificationGroupMap, setNotificationGroupMap] = useState({});
  const [clientNotifications, setClientNotifications] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [portalId, setPortalId] = useState(2);

  useEffect(() => {
    setPortalId(2);
    fetchNotificationOptions(2);

    //get user notification
    fetchNotification();
    //}
  }, [submit]);

  const handleSave = () => {
    handleSubmit();
    saveNotifications();
  };

  const roleIds = userInfo && userInfo.roles.map((item) => item.roleId);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleShow = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchNotification = () => {
    getUserNotifications({ userId: userInfo.userId, portalTypeId: 2 }).then(
      (response) => {
        if (!response.error && response.data) {
          const clientNotificationData =
            Array.isArray(response.data) &&
            response.data.reduce(
              (
                obj,
                { notificationGroupId, description, notificationTypes }
              ) => {
                obj[notificationGroupId] =
                  Array.isArray(notificationTypes) &&
                  notificationTypes
                    .filter((item) => item.isActive == 1)
                    .map(({ notificationTypeId }) => notificationTypeId);
                return obj;
              },
              {}
            );
          setClientNotifications({ ...clientNotificationData });
        } else {
        }
      }
    );
  };

  const fetchNotificationOptions = async (portalId) => {
    const response = await getNotificationOptions(portalId); // portal type id =1

    if (!response.error && response.data) {
      setNotificationOptions(response.data);
      const notificationGroupData =
        Array.isArray(response.data) &&
        response.data.reduce(
          (obj, { notificationGroupId, description, notificationTypes }) => {
            obj[notificationGroupId] =
              Array.isArray(notificationTypes) &&
              notificationTypes.map(
                ({ notificationTypeId }) => notificationTypeId
              );
            return obj;
          },
          {}
        );
      setNotificationGroupMap(notificationGroupData);
    } else {
      //NotificationManager.error(response.message || "", "Error!!", 2000);
    }
  };

  const clearAllHandler = () => {
    setClientNotifications({});
  };
  const grantAllHandler = () => {
    setClientNotifications(notificationGroupMap);
  };

  const onChangeNotifications = (event) => {
    const { name, checked, id } = event.target;
    let newClientNotification;
    if (checked) {
      newClientNotification = [
        ...(clientNotifications[id] || []),
        parseInt(name),
      ];
    } else {
      newClientNotification =
        Array.isArray(clientNotifications[id]) &&
        clientNotifications[id].filter((key) => parseInt(name) !== key);
    }

    setClientNotifications({
      ...clientNotifications,
      [id]: newClientNotification,
    });
  };

  const saveNotifications = async () => {
    setSaveLoading(true);

    try {
      const notificationData = Object.keys(clientNotifications).reduce(
        (arr, key) => {
          arr.push({
            notificationTypeId: clientNotifications[key],
            notificationGroupId: key,
          });
          return arr;
        },
        []
      );

      const data = {
        portalTypeId: userInfo.portalTypeId,
        portalProfileId: userInfo.portalProfileId,
        notificationData: notificationData,
        userIds: [userInfo.userId],
      };

      const resp = await saveNotificationSetting(data);
      if (resp) {
        const { data, error } = resp;
        if (error) {
          /*NotificationManager.error(
              message || "Server Response Error",
              "Error !!",
              3000
            );*/
          return;
        } else if (data) {
        }
      } else {
        //NotificationManager.error("Server Error", "Error !!", 3000);
      }
      //   setSaveLoading(false);
    } catch (error) {
      //   setSaveLoading(false);
      //NotificationManager.error("Client Error", "Error !!", 3000);
    }
  };

    const tooltipObj = {
        title: t("componentData.firstLogin.passTypeTxt"),
        arrow: true,
        placement: "top-end",
    }

  return (
    <Box className={classes.root}>
      <Box className={classes.container} alignItems="center">
        <Box className={classes.userHeader}>
          <div style={{ width: "25%" }}></div>
          <div className={classes.userImage}>
            <Box p={1} borderRadius="50%" mx="auto">
              <Avatar
                alt="user pic"
                src="/static/images/avatar/1.jpg"
                className={classes.large}
              >
                {userInfo &&
                  userInfo.displayName &&
                  userInfo.displayName
                    .match(/(\b\S)?/g)
                    .join("")
                    .match(/(^\S|\S$)?/g)
                    .join("")
                    .toUpperCase()}
              </Avatar>
            </Box>
            <Box width="320px" mx="auto">
              <Box pt={3}>
                <Typography
                  variant="body1"
                  className={classes.name}
                  noWrap="true"
                >
                  {`${userInfo.firstName} ${userInfo.lastName}`}
                </Typography>
              </Box>
            </Box>
            <Box py={1} style={{ textAlign: "center" }}>
              {userInfo.roles &&
                userInfo.roles.map((item, index) => {
                  return <span style={{ marginRight: "5px" }}>{item.roleName}</span>;
                })}
            </Box>
            <Box width={1} mt={1} display="block">
              <Box
                width="50px"
                height="2px"
                mx="auto"
                style={{ backgroundColor: "#979797" }}
              >
                &nbsp;
              </Box>
            </Box>
          </div>
          <div className={classes.userAction}>
            {canEditAction && isEditEnabled && (
              <Box className={classes.userActionBtn}>
                <Box p={1}>
                  <Box display="flex">
                    <Box>
                      {userInfo.isLocked ? (
                        isUnlockEnabled ? (
                          <IconButton
                            color="primary"
                            aria-label="Unlock User account"
                            title={t('componentData.roleEditView.UnlockUseraccount')}
                            component="span"
                            onClick={(event) => handleLock(event, userInfo)}
                            style={{ padding: "0px 12px" }}
                          >
                            <LockOpenIcon color="primary" />
                          </IconButton>
                        ) : (
                          <Box></Box>
                        )
                      ) : isLockEnabled ? (
                        <IconButton
                          color="primary"
                          aria-label="Lock User account"
                          title={t('componentData.roleEditView.LockUseraccount')}
                          component="span"
                          onClick={(event) => handleLock(event, userInfo)}
                          style={{ padding: "0px 12px" }}
                        >
                          <LockIcon color="primary" />
                        </IconButton>
                      ) : (
                        <Box></Box>
                      )}
                    </Box>
                    <Box pl={1} alignSelf="center">
                      <Typography variant="h6" color="primary">
                        {userInfo.isLocked
                          ? isUnlockEnabled
                            ? t('componentData.roleEditView.UnlockUser')
                            : ""
                          : isLockEnabled
                            ? t('componentData.roleEditView.LockUser')
                            : ""}
                      </Typography>
                    </Box>
                  </Box>
                  {isDeleteEnabled && (
                    <Box display="flex">
                      <Box>
                        <IconButton
                          color="primary"
                          aria-label="Delete User"
                          title={t('componentData.roleEditView.DeleteUser')}
                          component="span"
                          onClick={(event) =>
                            handleDelete(event, userInfo.userId)
                          }
                        >
                          <DeleteIcon color="primary" />
                        </IconButton>
                      </Box>
                      <Box pl={1} alignSelf="center">
                        <Typography variant="h6" color="primary">
                          {t('componentData.roleEditView.DeleteUser')}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </div>
        </Box>
      </Box>
      <Box className={classes.container}>
        <Box pb={2} mt={4} width={1} color="primary.main" fontSize={20}>
          {t('componentData.roleEditView.Contact')}
        </Box>
        <Grid item sm={9} xs={9} container>
          <Grid container spacing={1} justify="space-between">
            <Grid item xs={2}>
              <TextField
                error={validation && validation.title}
                helperText={validation && validation.title}
                fullWidth={true}
                select
                autoComplete="off"
                variant="outlined"
                name="title"
                label={t('componentData.roleEditView.Prefix')}
                value={(userInfo && userInfo.title) || ""}
                onChange={(event) => handleChange("title", event)}
              >
                <MenuItem value=" ">
                  <em>{t('componentData.roleEditView.Select')}</em>
                </MenuItem>
                <MenuItem value="Mr">{t('componentData.roleEditView.mr')}</MenuItem>
                <MenuItem value="Mrs">{t('componentData.roleEditView.mrs')}</MenuItem>
                <MenuItem value="Ms">{t('componentData.roleEditView.ms')}</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={5}>
              <TextField
                name={"firstName"}
                id={"firstName"}
                label={t('componentData.roleEditView.FirstName')}
                type="text"
                fullWidth={true}
                variant="outlined"
                value={(userInfo && userInfo.firstName) || ""}
                required
                onChange={(event) => handleChange("firstName", event)}
                error={validation.firstName}
                helperText={validation.firstName}
                autoComplete="off"
                autoFocus={false}
                inputProps={{
                  maxLength: 20,
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                name={"lastName"}
                fullWidth={true}
                id={"lastName"}
                label={t('componentData.roleEditView.LastName')}
                type="text"
                variant="outlined"
                value={(userInfo && userInfo.lastName) || ""}
                required
                onChange={(event) => handleChange("lastName", event)}
                error={validation.lastName}
                helperText={validation.lastName}
                autoComplete="off"
                autoFocus={false}
                inputProps={{
                  maxLength: 20,
                }}
              />
            </Grid>
          </Grid>
          <Grid item sm={12} xs={12}>
            <input type="text" name="userName" style={{ display: "none" }} />
            <input
              type="password"
              name="password"
              autocomplete="new-password"
              style={{ display: "none" }}
            />
            {userInfo && userInfo.isSSO == 0 && (
              <TextField
                name={"userName"}
                disabled={userInfo && userInfo.isSSO == 1 ? true : false}
                id={"userName"}
                label={t('componentData.roleEditView.UserName')}
                variant="outlined"
                type="text"
                autoFocus={false}
                autoComplete="off"
                value={(userInfo && userInfo.userName) || ""}
                required
                onChange={(event) => handleChange("userName", event)}
                error={validation.userName}
                helperText={validation.userName}
                inputProps={{
                  maxLength: 50,
                  autoComplete: "new-password",
                }}
                style={{ width: "100%", marginTop: "16px" }}
              />
            )}
            {userInfo && userInfo.isSSO == 1 && (
              <TextField
                name={"SSOUserId"}
                disabled={true}
                id={"SSOUserId"}
                label={t('componentData.roleEditView.SSOId')}
                variant="outlined"
                type="text"
                autoFocus={false}
                autoComplete="off"
                value={(userInfo && userInfo.SSOUserId) || ""}
                required
                error={validation.SSOUserId}
                helperText={validation.SSOUserId}
                onChange={(event) => handleChange("SSOUserId", event)}
                inputProps={{
                  maxLength: 20,
                }}
                style={{ width: "100%", marginTop: "16px" }}
              />
            )}
          </Grid>
          <Grid item sm={12} xs={12}>
            <TextField
              className={classes.textField}
              name={"email"}
              id={"email"}
              label={t('componentData.roleEditView.Email')}
              type="text"
              autoFocus={false}
              autoComplete="off"
              value={(userInfo && userInfo.email) || ""}
              variant="outlined"
              required
              onChange={(event) => handleChange("email", event)}
              error={validation.email}
              helperText={validation.email}
              style={{ width: "100%", marginTop: "16px", marginBottom: "16px" }}
              inputProps={{
                maxLength: 50,
              }}
            />
          </Grid>
          <Grid item sm={12} xs={12}>
            <Phone
              required
              variant="outlined"
              error={validation.phone}
              helperText={validation.phone}
              id="phone"
              name="phone"
              ext={(userInfo && userInfo.phoneExt) || ""}
              value={(userInfo && userInfo.phone) || ""}
              ccode={(userInfo && userInfo.phoneCountryCode) || ""}
              prefixCcode="+1"
              onChange={(event) => handleChange("phone", event)}
              style={{ width: "100%" }}
            />
          </Grid>
          {userInfo && userInfo.isSSO == 0 && (
            <Grid item sm={12} xs={12}>
              <TextField
                required
                disabled={userInfo && userInfo.isSSO == 1 ? true : false}
                error={validation.password}
                autoFocus={false}
                autoComplete="off"
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onDrag={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                label={t('componentData.roleEditView.Password')}
                value={(userInfo && userInfo.newPassword) || ""}
                name="newPassword"
                type="password"
                tooltipProps={tooltipObj}
                variant="outlined"
                onChange={(event) => handleChange("newPassword", event)}
                style={{ width: "100%" }}
                inputProps={{
                  autoComplete: "new-password",
                }}              />
              <Typography
                variant="body2"
                style={{ paddingLeft: "14px" }}
                color="error"
              >
                {validation.password}
              </Typography>
            </Grid>
          )}
          {userInfo && userInfo.isSSO == 0 && (
            <Grid item sm={12} xs={12}>
              <TextField
                required
                disabled={userInfo && userInfo.isSSO == 1 ? true : false}
                error={validation.confirmPassword}
                helperText={validation.confirmPassword}
                autoComplete="off"
                autoFocus={false}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onDrag={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}



                label={t('componentData.roleEditView.ConfirmPassword')}
                value={(userInfo && userInfo.confirmPassword) || ""}
                name="confirmPassword"
                type="password"
                variant="outlined"
                onChange={(event) => handleChange("confirmPassword", event)}
                style={{ width: "100%" }}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      <Box className={classes.container}>
        <Box pb={1} mt={3} width={1} color="primary.main" fontSize={20}>
          {t('componentData.SmallTxt.Roles')}
        </Box>
        <Box display="flex" flexWrap="wrap">
          {userInfo &&
            userInfo.roles.map((item, index) => {
              return (
                <Chip
                  label={item.roleName}
                  className={classes.roleName}
                  size="medium"
                  onDelete={(event) =>
                    handleChange("removeRoleId", event, item)
                  }
                />
              );
            })}
          
          <IconButton
            color="primary"
            component="span"
            size="small"
            onClick={(event) => handleShow(event)}
          >
            <AddIcon color="primary" />
          </IconButton>
          {validation.roleId && (
            <Typography
              variant="body2"
              color="error"
              style={{ paddingLeft: "22px", paddingTop:"11px" }}
            >
              {validation.roleId}
            </Typography>
          )}
          <Menu
            id="roleId"
            anchorEl={anchorEl}
            PaperProps={{
              style: {
                marginTop: "50px",
                marginRight: "50px",
                maxHeight: "200px",
              },
            }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {roleList ? (
              roleList.map((role) => (
                <MenuItem key={role.roleId} value={role.roleId}>
                  <Checkbox
                    checked={
                      roleIds.length > 0 && roleIds.indexOf(role.roleId) > -1
                    }
                    onChange={(event) =>
                      handleChange("roleId", event, {
                        roleId: role.roleId,
                        roleName: role.roleName,
                      })
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
          </Menu>
        </Box>
      </Box>
      <Box className={classes.container}>
        <Box>
          <ExpansionBar
            label={t('componentData.roleEditView.AlertsAndNotifications')}
            icon={NotiBellIcon}
            bColor="#F6F6F6"
          >
            <Box mx={2} display="flex" justifyContent="space-between">
              <Box width={1 / 2}>
                <Typography variant="caption">
                  {t('componentData.notificationSetting.msgTxt')}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Button
                  style={{ fontSize: 14, color: "#0B1941" }}
                  color="primary"
                  onClick={clearAllHandler}
                  variant="filled"
                  size="medium"
                >
                  {t('componentData.roleEditView.CLEARALLPARAMETERS')}
                </Button>
                <Button
                  style={{ fontSize: 14, color: "#fff" }}
                  size="medium"
                  variant="contained"
                  color="primary"
                  disableElevation
                  onClick={grantAllHandler}
                >
                  {t('componentData.roleEditView.GrantAllParameters')}
                </Button>
              </Box>
            </Box>

            <Box mx={1} my={3}>
              {Array.isArray(notificationOptions) &&
                notificationOptions.map(
                  ({ notificationGroupId, description, notificationTypes }) => {
                    return (
                      <>
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Box pr={1} display="flex" alignItems="center">
                            {notificationGroupId == 2 ? (
                              <img
                                src={NotiSettingUpdateIcon}
                                width={20}
                                alt={t('componentData.roleEditView.Setting')}
                              />
                            ) : notificationGroupId == 1 ? (
                              <img
                                src={NotiPaymentUpdateIcon}
                                width={20}
                                alt="$"
                              />
                            ) : notificationGroupId == 4 ? (
                              <img
                                src={NotiSupplierUpdateIcon}
                                width={16}
                                alt={t('componentData.roleEditView.Payee')}
                              />
                            ) : notificationGroupId == 64 ? (
                              <img
                                src={ChildCompany}
                                width={20}
                                alt={t('componentData.roleEditView.ChildCompany')}
                              />
                            ) : notificationGroupId == 128 ? (
                              <img
                                src={SupplierPending}
                                width={20}
                                alt={t('componentData.roleEditView.SupplierPending')}
                              />
                            ) : null}
                          </Box>
                          <Typography variant="h3">{description}</Typography>
                        </Box>
                        <Box
                          ml={3}
                          my={2}
                          display="flex"
                          flexDirection="column"
                        >
                          {Array.isArray(notificationTypes) &&
                            notificationTypes.map(
                              ({ notificationName, notificationTypeId }) => {
                                return (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        size="small"
                                        checked={
                                          Array.isArray(
                                            clientNotifications[
                                            notificationGroupId
                                            ]
                                          ) &&
                                          clientNotifications[
                                            notificationGroupId
                                          ].includes(notificationTypeId)
                                        }
                                        onChange={onChangeNotifications}
                                        id={notificationGroupId}
                                        name={notificationTypeId}
                                        color="secondary"
                                        variant="outlined"
                                        checkedIcon={<CheckBoxOutlinedIcon />}
                                        icon={
                                          <CheckBoxOutlineBlankOutlinedIcon />
                                        }
                                      />
                                    }
                                    label={notificationName}
                                  />
                                );
                              }
                            )}
                        </Box>
                      </>
                    );
                  }
                )}
            </Box>
            {/* {
                          !controlled ? (<Box display='flex' width="100%" justifyContent="center">
                            <Button variant="contained" color="primary" onClick={saveNotifications}>Save</Button>'
                          </Box>) : ''
                        } */}
          </ExpansionBar>
        </Box>
      </Box>

      <Box className={classes.container} p={1}>
        <Box display="flex" justifyContent="center">
          <Box p={1}>
            <Button
              variant="outlined"
              style={{ marginLeft: "10px" }}
              color="primary"
              size="small"
              onClick={() => handleCancel()}
            >
              {t('componentData.roleEditView.CancelBtn')}
            </Button>
          </Box>
          <Box p={1}>
            {updateProgress ? (
              <CircularProgress color="primary" />
            ) : (
              <Button
                variant="contained"
                disableElevation
                color="primary"
                size="small"
                onClick={() => handleSave()}
              >
                {t('componentData.roleEditView.SubmitBtn')}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
})
