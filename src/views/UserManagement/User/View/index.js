import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  Paper,
  Box,
  makeStyles,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
  Avatar,
  Chip,
  Link as MLink
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import PersonIcon from "@material-ui/icons/Person";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/Phone";
import LockIcon from "@material-ui/icons/Lock";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import DeleteIcon from "@material-ui/icons/Delete";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import { withTranslation } from 'react-i18next';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
  },
  paper: {
    width: "100%",
    paddingTop: "15px",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  userHeader: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  userImage: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  userAction: {
    width: "25%",
  },
  userActionBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
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
    height: 100,
    width: 100,
    fontSize: 30,
  },
  name: {
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
}));

export default withTranslation()(function UserView(props) {
  const classes = useStyles();
  const { t } = props;
  const {
    userInfo,
    canEditAction,
    isEditEnabled,
    isLockEnabled,
    isUnlockEnabled,
    isDeleteEnabled,
    handleLock,
    handleEdit,
    handleDelete,
  } = props;

  const formatPhoneNumber = (phoneNumberString) => {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "" + match[1] + "-" + match[2] + "-" + match[3];
    }
    return "";
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.container} alignItems="center">
        <Box className={classes.userHeader}>
          <div style={{ width: "25%" }}></div>
          <div className={classes.userImage}>
            <Box p={1} borderRadius="50%" style={{ float: "right" }}>
              <Avatar
                alt= {t('componentData.userRoleView.userPic')}
                src="/static/images/avatar/1.jpg"
                className={classes.large}
              >
                {userInfo && userInfo.displayName && userInfo.displayName.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()}
              </Avatar>
            </Box>
            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              alignItems="center"
            >
              <Box display="flex" flexWrap="wrap">
                <Typography variant="body1" className={classes.name}>
                  {`${userInfo.firstName} ${userInfo.lastName}`}
                </Typography>
              </Box>
              <Box justifyContent="center" alignSelf="center" display="flex">
                {!userInfo.isFirstUser && canEditAction && isEditEnabled && (
                  <IconButton
                    color="primary"
                    aria-label="Edit User"
                    title= {t('componentData.userRoleView.EditUser')}
                    component="span"
                    onClick={(event) => handleEdit(event, userInfo)}
                  >
                    <BorderColorIcon className={classes.smallIcon} />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box pb={1} style={{ textAlign: "center" }}>
              {userInfo.roles &&
                userInfo.roles.map((item, index) => {
                  return <span style={{marginRight:"5px"}}>{item.roleName}</span>;
                })}
            </Box>
            <Box
              width="50px"
              height="2px"
              style={{ backgroundColor: "#999999" }}
            >
              &nbsp;
            </Box>
          </div>
          <div className={classes.userAction}>
            {canEditAction && (
              <Box className={classes.userActionBtn}>
                <Box p={1}>
                  <Box display="flex">
                    <Box>
                      {userInfo.isLocked ? (
                        isUnlockEnabled ? (
                          <IconButton
                            color="primary"
                            aria-label="Unlock User account"
                            title= {t('componentData.userRoleView.UnlockUserAccount')}
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
                          title= {t('componentData.userRoleView.LockUserAccount')}
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
                            ? t('componentData.userRoleView.UnlockUser')
                            : ""
                          : isLockEnabled
                          ? t('componentData.userRoleView.LockUser')
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
                          title= {t('componentData.userRoleView.DeleteUser')}
                          component="span"
                          onClick={(event) =>
                            handleDelete(event, userInfo.userId)
                          }
                        >
                          <DeleteIcon size="small" color="primary" />
                        </IconButton>
                      </Box>
                      <Box pl={1} alignSelf="center">
                        <Typography variant="h6" color="primary">
                        {t('componentData.userRoleView.DeleteUser')}
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

      <Box className={classes.container} pl={1}>
        <Box>
          <Typography variant="body1" className={classes.heading}>
          {t('componentData.userRoleView.Contact')}
          </Typography>
        </Box>
        <Box p={1}>
          <Box display="flex">
            <Box>
              <PersonIcon />
            </Box>
            <Box pl={1} alignSelf="center">
              {userInfo.isSSO ==0 ? userInfo.userName : (userInfo.SSOUserId + " (SSO Id)") }
            </Box>
          </Box>
          <Box display="flex">
            <Box>
              <EmailOutlinedIcon />
            </Box>
          
            <Box pl={1} alignSelf="center">
            <MLink color="inherit" href={`mailto:${userInfo.email}`}>
              {userInfo.email}
            </MLink>
            </Box>
            
          </Box>
          <Box display="flex">
            <Box>
              <PhoneIcon />
            </Box>
            <Box pl={1} alignSelf="center">
              {userInfo.phone &&
                `${userInfo.phoneCountryCode || ""}
                                (${userInfo.phone.substring(
                                  0,
                                  3
                                )})-${userInfo.phone.substring(
                  3,
                  6
                )}-${userInfo.phone.substring(6, 10)}
                                ${userInfo.phoneExt || ""}`}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.container} pl={1}>
        <Box>
          <Typography variant="body1" className={classes.heading}>
          {t('componentData.userRoleView.Roles')}
          </Typography>
        </Box>
        <Box p={1} display="flex" flexWrap="wrap">
          {userInfo.roles &&
            userInfo.roles.map((item, index) => {
              return (
                <Chip
                  label={item.roleName}
                  className={classes.roleName}
                  size="small"
                />
              );
            })}
        </Box>
      </Box>
    </Box>
  );
})
