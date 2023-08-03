import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import {
  Button,
  Grow,
  Popper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Paper,
  Link,
  Box,
  Divider,
  Avatar,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

import PersonIcon from "@material-ui/icons/Person";
import CitiLogo from "~/assets/images/CitiLogo.svg";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import config from "~/config";
import { logout, updateLanguage } from "~/redux/actions/user";
import {singlePoint} from '~/redux/helpers/user';

import ChildParentMenu from "~/modules/ChildParentMenu/";
import styles from "./styles";
import SystemNotifications from "../../modules/SystemNotifications";
import { accessRights } from "~/config/accessRights";
import Popover from "@material-ui/core/Popover";
import { withTranslation } from "react-i18next";
import Cookies from "universal-cookie";
import {PortalLogo, PortalBankLabel} from '~/components/PortalDetails';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      langMenuOpen: false,
      anchorEl: null,
      langAnchorEl: null,
      dialogActive: false,
      title: "",
      message: "",
    };
  }

  handleToggle = (event) => {
    this.setState({
      menuOpen: !this.state.menuOpen,
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      menuOpen: false,
      anchorEl: null,
    });
  };

  handleLangToggle = (event) => {
    this.setState({
      langMenuOpen: !this.state.langMenuOpen,
      langAnchorEl: event.currentTarget,
    });
  };

  handleLangClose = () => {
    this.setState({
      langMenuOpen: false,
      langAnchorEl: null,
    });
  };

  handleLanguageChange = (event, langCode) => {
    const cookies = new Cookies(window.document.cookie);
    const { isLoggedIn, userData } = this.props.user;
    if (isLoggedIn) {
      this.setState(
        {
          langMenuOpen: false,
        },
        () => {
          //Check for bank admin
          if (
            userData.activeBankParentProfileId &&
            userData.activeBankParentProfileId == 1
          ) {
            this.props.i18n.changeLanguage(langCode);
            cookies.set("localeLang", this.props.i18n.language, {
              path: `${config.baseName}/`,
            });
            this.setState({
              langMenuOpen: false,
            });
            window.location.reload();
            return false;
          }

          //API call to change user selected language
          this.props
            .dispatch(updateLanguage({ locale: langCode }))
            .then((response) => {
              if (!response) {
                return false;
              }
              this.props.i18n.changeLanguage(langCode);
              cookies.set("localeLang", this.props.i18n.language, {
                path: `${config.baseName}/`,
              });
              this.setState({
                langMenuOpen: false,
              });
              window.location.reload();
            });
        }
      );
    } else {
      this.props.i18n.changeLanguage(langCode);
      cookies.set("localeLang", this.props.i18n.language, {
        path: `${config.baseName}/`,
      });
      this.setState({
        langMenuOpen: false,
      });
      window.location.reload();
    }
  };

  handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      this.setState({
        langMenuOpen: false,
      });
    }
  };

  logout = () => {
    const { isSSO } = this.props.user.userData;
    this.props.dispatch(logout(isSSO));
  };
  singlePoint = () => {
    const { isSSO } = this.props.user.userData;
    singlePoint();
  };

  render() {
    const { menuOpen, anchorEl, langAnchorEl, langMenuOpen } = this.state;
    const { classes, info, user, t } = this.props;
    const isParentChildEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["PARENT_CHILD_ACCESS_VIEW"])) ||
      false;
    return (
      <Fragment>
        <Paper
          className={classes.headerContainer}
          style={{ height: "3.5rem" }}
          square
          elevation={1}
        >
          <Box className={classes.logoContainer}>
            <Box className={classes.citiLogo}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <PortalLogo t={t} isHeader={true}/>
              </Box>
            </Box>
            { <Box className={classes.headerSmText}>
              <PortalBankLabel t={t}/>
            </Box> }
          </Box>

          <Box className={classes.searchBarContainer}></Box>
          {this.props.user.isLoggedIn && (
            <Box className={classes.rightNavContainer}>
              <Box className={classes.rightNavIconContainer}>
                <SystemNotifications />
              </Box>

              {config.willTranslate && (
                <Box p={1} className={classes.rightNavIconContainer}>
                  <Button
                    ref={langAnchorEl}
                    aria-controls={langMenuOpen ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    variant="text"
                    onClick={this.handleLangToggle}
                  >
                    {this.props.i18n.language &&
                      this.props.i18n.language.toUpperCase()}

                    <ArrowDropDownIcon />
                  </Button>

                  <Popper
                    open={langMenuOpen}
                    anchorEl={langAnchorEl}
                    role={undefined}
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === "bottom"
                              ? "center top"
                              : "center bottom",
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={this.handleLangClose}>
                            <MenuList
                              autoFocusItem={langMenuOpen}
                              id="menu-list-grow"
                              onKeyDown={this.handleListKeyDown}
                            >
                              {user.slList &&
                                user.slList.map((lang, index) => (
                                  <MenuItem
                                    value={lang.code}
                                    onClick={(event) =>
                                      this.handleLanguageChange(
                                        event,
                                        lang.code
                                      )
                                    }
                                  >
                                    {`${
                                      lang.description
                                    } (${lang.code.toUpperCase()})`}
                                  </MenuItem>
                                ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Box>
              )}

              <Box className={classes.rightNavDropdownContainer}>
                <div className="LeftNav">
                  <div className={classes.headerMenuList}>
                    <Link
                      underline="none"
                      size="small"
                      aria-controls="header-menu"
                      aria-haspopup="menu"
                      onClick={(event) => this.handleToggle(event)}
                    >
                      <span className={classes.userIconBg}>
                        {" "}
                        <PersonIcon />{" "}
                      </span>
                    </Link>
                    <Popover
                      className={classes.headerMenu}
                      anchorEl={anchorEl}
                      keepMounted
                      // onBlur={() => this.handleClose()}
                      open={menuOpen}
                      onClose={() => this.handleClose()}
                    >
                      <Box
                        pt={2}
                        px={5}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          alt="user pic"
                          src="/static/images/avatar/1.jpg"
                          className={classes.large}
                        >
                          {info &&
                            info.displayName &&
                            info.displayName
                              .match(/(\b\S)?/g)
                              .join("")
                              .match(/(^\S|\S$)?/g)
                              .join("")
                              .toUpperCase()}
                        </Avatar>
                        <Box pt={2}>
                          <span className={classes.profileHeading}>
                            {info && info.displayName}
                          </span>
                        </Box>
                        <Box>
                          <span className={classes.profileEmail}>
                            {info && info.email}
                          </span>
                        </Box>
                        <Box
                          mt={0.5}
                          width="36px"
                          height="1.5px"
                          style={{ backgroundColor: "#999999" }}
                        ></Box>
                        <Box mt={2} mb={1}>
                          <MenuItem
                            onClick={() => {
                              this.handleClose();
                              this.props.history.push("/user");
                            }}
                          >
                            <span className={classes.profileManage}>
                              {t("componentData.headerComp.ManageYourAccount")}
                            </span>
                          </MenuItem>
                        </Box>
                      </Box>
                      {isParentChildEnabled && (
                        <Box
                          px={2}
                          py={1}
                          style={{ borderTop: "1px solid #e0e0e0" }}
                        >
                          <ChildParentMenu {...this.props} />
                        </Box>
                      )}
<Divider />
                      <MenuItem
                        onClick={() => {
                          this.singlePoint();
                        }}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {t("componentData.headerComp.SinglePoint")}
                      </MenuItem>  
                      <Divider />
                      <MenuItem
                        onClick={() => {
                          this.logout();
                        }}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {t("componentData.headerComp.LOGOUT")}
                      </MenuItem>
                    </Popover>
                  </div>
                </div>
              </Box>
            </Box>
          )}
        </Paper>
      </Fragment>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user }))(withStyles(styles)(Header))
);
