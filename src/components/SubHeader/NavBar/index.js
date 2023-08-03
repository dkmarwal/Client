import React, { Component, Fragment } from "react";
import { Tabs, Tab, Box } from "@material-ui/core";
import { Link } from "react-router-dom";
import _ from "lodash";
import "./styles.scss";
import config from "~/config";
import { accessRights } from "~/config/accessRights";
import { withTranslation } from 'react-i18next';

class NavBar extends Component {
  state = {
    leftMenu: [
      {
        url: "manage/user",
        name: "My Users",
        items: [],
        alias: "USER_VIEW",
        isProtected: true,
      },
      {
        url: "manage/user/role",
        name: "My Roles",
        items: [],
        alias: "USER_ROLE_VIEW",
        isProtected: true,
      },
    ],
  };

  isViewable(name, isProtected) {
    if (isProtected) {
      const { claims } = this.props;
      const isEnabled = (claims && claims.includes(accessRights[name])) || false;
      if (isEnabled) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { leftMenu } = this.state;
    const { alias, t } = this.props;
    let currentNavIndex = _.findIndex(leftMenu, (item) => item.alias == alias);
    currentNavIndex = currentNavIndex == -1 ? 0 : currentNavIndex;
    return (
      <Fragment>
        <div id="navbar">
          {alias != "none" ? (
            <Tabs
              value={currentNavIndex}
              textColor="#008CE6"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#008CE6",
                  color: "#008CE6",
                },
              }}
            >
              {leftMenu.map((navItem, index) => (
                <span key={index}>
                  {this.isViewable(navItem.alias, navItem.isProtected) ===
                  true ? (
                    <Link to={`${config.baseName}/${navItem.url}`} key={index}>
                      <Tab
                        label= {t(`componentData.SmallTxt.${navItem.name}`)}
                        value={currentNavIndex}
                        index={index}
                        selected={currentNavIndex == index ? true : false}
                      />
                    </Link>
                  ) : null}
                </span>
              ))}
            </Tabs>
          ) : (
            <Box p={1}> </Box>
          )}
        </div>
      </Fragment>
    );
  }
}

export default withTranslation()(NavBar);
