import React, { Component } from "react";
import {
  Typography,
  Card,
  Box,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import NavBar from "./NavBar";
import "./styles.scss";

const styles = (theme) => ({
  root: {
    marginBottom: 0,
    padding: "0px 3%",
    marginTop: "5px",
  },
  headingTop: {
    fontWeight: 400,
    fontSize: "24px",
    color: "#0B1941",
    padding: "0 0 0 8px",
  },
  logoWrap: {
    padding: "0.70rem 1.875rem",
    fontSize: "16px",
    color: "#051b2",
  },
  headerBottom: {
    width: "auto",
    padding: "5px",
    fontSize: "14px",
    borderBottom: "0px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  card: {
    height: 85,
    overflow: "visible",
    display: "flex",
    alignItems: "flex-end",
    position: "fixed",
    top: 56,
    zIndex: 4,
    width: "100%",
  },
});

class SubHeader extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, title } = this.props;

    return (
      <Card square className={classes.card}>
        <Box display="flex" flexDirection="column">
          <Box px={5}>
            <Typography variant="h2" className={classes.headingTop}>
              {title}
            </Typography>
            <NavBar {...this.props} />
          </Box>
        </Box>
      </Card>
    );
  }
}

export default withStyles(styles)(SubHeader);
