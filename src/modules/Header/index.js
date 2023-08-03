import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Box, Menu, MenuItem } from "@material-ui/core";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { withStyles } from "@material-ui/core/styles";
import CitiLogo from "~/assets/images/CitiLogo.svg";
import styles from "./styles";
import { withTranslation } from 'react-i18next';

class Header extends Component {
  state = { anchorEl: null, open: false };

  handleMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget, open: true });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, open: false });
  };

  subMenu = (menuItems) => {
    const { anchorEl, open } = this.state;

    if (menuItems.length > 0) {
      return (
        <Menu
          id={menuItems.id}
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={open}
          onClose={this.handleClose}
        >
          {menuItems.map((item, i) => (
            <MenuItem key={i}>{item.title}</MenuItem>
          ))}
        </Menu>
      );
    }
  };
  render() {
    const { t } = this.props;
    const { classes } = this.props;
    const { anchorEl, open } = this.state;
    return (
      <Box className={classes.headerContainer}>
        <Box className={classes.logoContainer}>
          <img src={CitiLogo} alt= {t('componentData.header.CITIBank')} className={classes.logo} />
        </Box>
        <Box className={classes.searchBarContainer}></Box>
        <Box className={classes.userInfoContainer}>
          <Box className={classes.rightNavContainer}>
            <Box className={classes.rightNavIconContainer}>
              <NotificationsNoneIcon fontSize="small" />
            </Box>
            <Box className={classes.rightNavDropdownContainer} id="profile-nav">
              <div className="LeftNav">
                <div className={classes.headerMenuList}>
                  <Link
                    underline="none"
                    size="small"
                    aria-controls="header-menu"
                    aria-haspopup="menu"
                    onClick={(event) => this.handleToggle(event)}
                  >
                    <span>{t('componentData.header.Welcome')}</span>
                    <ArrowDropDownIcon />
                    <AccountCircleIcon fontSize="small" />
                  </Link>
                  <Menu
                    className={classes.headerMenu}
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={() => this.handleClose()}
                  >
                    <MenuItem onClick={() => this.logout()}>{t('componentData.header.Logout')}</MenuItem>
                  </Menu>
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
  renderNavItem = (navItem, user) => (
    <Link to="#" key={navItem.id}>
      {navItem.icon.type === "image" && (
        <img
          onClick={navItem.items.length > 0 ? this.handleMenu : null}
          src={navItem.icon.url}
          alt={navItem.title}
          title={navItem.title}
        />
      )}
      {navItem.icon.type === "user_image" && (
        <img
          onClick={navItem.items.length > 0 ? this.handleMenu : null}
          width="40"
          className="user_image"
          src={user.picture.url}
          alt={`${user.name.firstName} ${user.name.lastName}`}
          title={`${user.name.firstName} ${user.name.lastName}`}
        />
      )}
    </Link>
  );
}

export default withTranslation()(connect((state) => ({
  ...state.user,
  ...state.clientConfig,
  ...state.filters,
}))(withStyles(styles)(Header)));
