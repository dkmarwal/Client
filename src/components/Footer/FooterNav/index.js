import React, { Component } from "react";
import { Box, withStyles, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import {PortalFooterLogo} from '~/components/PortalDetails';

const styles = (theme) => ({
  link: {
    "&:last-child": {
      fontWeight: "normal",
    },
    display: "inline-block",
    position: "relative",
    fontWeight: "600",
    lineHeight: "20px",
    textAlign: "left",
    fontSize: "10px",
    color: "#4C4C4C",
    transition: " all .3s ease",
  },
  copyRight: {
    whiteSpace: "nowrap",
    lineHeight: "20px",
    textAlign: "right",
  },
  img: {
    paddingRight: "10px",
    verticalAlign: "text-bottom",
  },
  fontSizeSmall: {
    fontSize: 18,
    verticalAlign: "middle",
    paddingRight: 5,
  },
});

class FooterNav extends Component {
  render() {
    const { classes, t } = this.props;
    const {isPayeeChoicePortal} = this.props.user
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        flexGrow={1}
        alignItems="center"
        width={1}
        ml="72px"
        boxShadow="border-box"
        borderTop="1px solid #ced3d6"
        padding="5px 0"
        px={6}
      >
        <Box>
          <Typography>
            <span className={classes.link}>
              <Link to="#" className={classes.link} key={1}>
                <PortalFooterLogo t={t}/>
              </Link>
              {isPayeeChoicePortal ? "" : t("componentData.footerComp.msgTxt")}
            </span>
          </Typography>
        </Box>

        <Box>
          <Typography className={classes.link}>
            {" "}
            {isPayeeChoicePortal ? t("componentData.footerComp.usBankCopyRightTxt", { year: (new Date().getFullYear()) }) : t("componentData.footerComp.copyRightTxt", { year: (new Date().getFullYear()) })}
          </Typography>
        </Box>
      </Box>
    );
  }
}

export default withTranslation() (
  connect((state) => ({ ...state.user }))(withStyles(styles)(FooterNav))
)
  

