import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";

const styles = (theme) => ({
  contentBackground: {
    backgroundColor: theme.palette.background.header,
    padding: "1.665rem 0.8rem",
    borderRadius: "4px",
  },
});

class ContentHeader extends Component {
  render() {
    const { classes, title } = this.props;
    return (
      <Box className={classes.contentBackground}>
        <Typography variant="h2" color={"primary"}>
          {title}
        </Typography>
      </Box>
    );
  }
}

export default withStyles(styles)(ContentHeader);
