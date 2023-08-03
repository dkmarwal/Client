import React, { Component } from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import { Box, Typography, Icon } from "@material-ui/core";
import { Button } from "~/components/Forms";

const styles = (theme) => ({
  contentBackground: {
    backgroundColor: theme.palette.background.header,
    borderRadius: "4px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.15)",
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    flexBasis: "50%",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-around",
    flexBasis: "33%",
  },
});

class Banner extends Component {
  render() {
    const {
      classes,
      title,
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      px,
      py,
    } = this.props;
    return (
      <Box className={classes.contentBackground} px={px || 0} py={py || 0}>
        <Box className={classes.titleContainer}>
          <Icon
            color={"primary"}
            className={clsx("fa fa-info-circle", classes.icon)}
          />
          <Typography variant="h3" color={"primary"}>
            <Box lineHeight={1.4}>{title}</Box>
          </Typography>
        </Box>
        <Box className={classes.buttonContainer}>
          <Button
            type="submit"
            fullWidth={false}
            variant="contained"
            color="primary"
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            type="submit"
            fullWidth={false}
            variant="outlined"
            color="primary"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        </Box>
      </Box>
    );
  }
}

export default withStyles(styles)(Banner);
