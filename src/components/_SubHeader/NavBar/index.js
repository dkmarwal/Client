import React, { Component, Fragment } from "react";
import "./styles.scss";

export default class NavBar extends Component {
  state = {
    selectedTab: 0,
  };

  isViewable(name, isProtected) {
    if (isProtected) {
      const { claims } = this.props;
      const str = `${name && name.toLowerCase()}_view`;
      const isEnabled = claims && claims.includes(str);
      if (isEnabled) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  handleTabChange = (index) => {
    this.setState({ selectedTab: index });
  };

  render() {
    return <Fragment></Fragment>;
  }
}
