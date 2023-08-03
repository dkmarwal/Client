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
  Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import config from "~/config";
import { logout, updateLanguage } from "~/redux/actions/user";

import styles from "./styles";
import { withTranslation } from "react-i18next";
import Cookies from "universal-cookie";
import {PortalLogo, PortalBankLabel} from '~/components/PortalDetails';

class ClientHeader extends Component {
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

  render() {
    const { langAnchorEl, langMenuOpen } = this.state;
    const { classes, user, height, t } = this.props;

    return (
      <Fragment>
        <Paper
          className={classes.headerContainer}
          style={{ height: { height } || "3.5rem" }}
          square
          elevation={1}
        >
          <Box className={classes.logoContainer}>
            <Box className={classes.citiLogo}>
              <Box display="flex" justifyContent="center">
              <PortalLogo t={t} isHeader={true}/>
              </Box>
            </Box>
            {
              <Box className={classes.headerSmText}>
                <PortalBankLabel t={t}/>
              </Box>
            }
          </Box>

          <Box className={classes.searchBarContainer}></Box>
          <Box className={classes.rightNavContainer}>
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
                                    this.handleLanguageChange(event, lang.code)
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
          </Box>
        </Paper>
      </Fragment>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user }))(withStyles(styles)(ClientHeader))
);
