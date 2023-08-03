import React from "react";
import {
  Paper,
  Box,
  makeStyles,
  Dialog,
  Typography,
  IconButton,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    top: 0,
    right: 0,
    position: "fixed",
    width: "420px",
    backgroundColor: theme.palette.background.active,
    zIndex: 1,
    marginBottom: "10px",
    overflowY: "scroll",
    height: "100%",
  },
  paper: {
    width: "100%",
    paddingTop: "0px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    height: "55px",
    alignItems: "center",
    alignContent: "flex-start",
    boxShadow:
      "0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2)",
  },
  checkBox: {
    "& span": {
      color: "#000000",
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: 1.6,
    },
  },
  heading: {
    paddingTop: 0,
    marginLeft: "12px",
    marginBottom: 0,
    color: "rgba(0,0,0,0.87)",
    fontSize: 24,
    lineHeight: "24px",
  },
}));

export default function ReportsFilter(props) {
  const classes = useStyles();

  const { open, handleClose, children, headerText, icon } = props;

  return (
    <Dialog
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0 }}
    >
      <Box className={classes.root} hidden={!open}>
        <Paper square className={classes.paper}>
          <Box className={classes.header}>
            <Box p={1} pl={3} width="100%" display="flex">
              <Box>{icon}</Box>
              <Typography variant="body1" className={classes.heading}>
                {headerText}
              </Typography>
            </Box>
            <Box mr={1}>
              <IconButton
                color="primary"
                aria-label="Close"
                title="Close"
                component="span"
                onClick={() => handleClose()}
              >
                <CloseIcon
                  fontSize="small"
                  style={{ float: "right" }}
                  variant="contained"
                  color="primary"
                />
              </IconButton>
            </Box>
          </Box>
          <Box p={1}>{children}</Box>
        </Paper>
      </Box>
    </Dialog>
  );
}
