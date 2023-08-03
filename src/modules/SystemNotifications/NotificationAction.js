import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import MarkReadIcon from "~/assets/icons/notiMarkRead.svg";
import DeleteNotiIcon from "~/assets/icons/notiDelete.svg";
import { Box, Typography, withStyles } from "@material-ui/core";
import { withTranslation, useTranslation } from "react-i18next";

const NotificationAction = ({
  userId,
  NotificationId,
  read,
  //clearNotify,
  markReadNotification,
  markClearNotification,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [clearNotify, setClearNotify] = useState(true);
  const { t } = useTranslation();

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const markReadHandler = () => {
    markReadNotification(
      read,
      userId,
      NotificationId,
      Boolean(read) ? "undoMarkRead" : "markRead"
    );
    handleClose();
  };

  const deleteNotificationHandler = () => {
    markClearNotification(
      clearNotify,
      userId,
      NotificationId,
      t("componentData.SmallTxt.clear")
    );
    setClearNotify(true);
    handleClose();
  };

  const CustomTypography = withStyles((theme) => ({
    root: {
      marginLeft: "5px",
    },
  }))(Typography);

  const options = [
    {
      key: 1,
      label: Boolean(read)
        ? t("componentData.SmallTxt.MarkAsUnread")
        : t("componentData.SmallTxt.MarkAsRead"),
      onClickListener: markReadHandler,
      icon: MarkReadIcon,
    },
    {
      key: 2,
      label: t("componentData.SmallTxt.RemoveNotification"),
      onClickListener: deleteNotificationHandler,
      icon: DeleteNotiIcon,
    },
  ];

  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: 230,
            marginLeft: "-50px",
          },
        }}
      >
        {options.map(({ key, label, onClickListener, icon }) => (
          <MenuItem key={key} onClick={onClickListener}>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
            >
              <img
                src={icon}
                alt="label"
                style={{ width: "22px", height: "22px" }}
              />
              <CustomTypography variant="subtitle1"> {label}</CustomTypography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default withTranslation()(NotificationAction);
