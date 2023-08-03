import React from "react";
import { Card } from "@material-ui/core";
import "./styles.scss";
import { withTranslation } from "react-i18next";
import { entityType } from '~/config/entityTypes';

class Tile extends React.Component {
  render() {
    const { heading, highlight, onClick, entity, notClickable } = this.props;
    return (
      <span className="tileWrap" style={notClickable? {}: {cursor: "pointer"}}>
        <Card onClick={onClick ? onClick : () => null}>
          <div className="content" style={{ height: this.props.i18n.language === "fr" ? 148 : (entity === entityType.B2C ? 132 : 124) }}>
            <span className={"heading"} style={{ fontSize: (entity === entityType.B2C ? "16px" : "18px") }}>{heading}</span>
            <span className={"highlights"} style={{ fontSize: (entity === entityType.B2C ? "24px" : "34px") }}>{highlight}</span>
          </div>
        </Card>
      </span>
    );
  }
}

export default withTranslation()(Tile);
