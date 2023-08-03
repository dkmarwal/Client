import React from "react";
import {
  Box,
  makeStyles,
  Dialog,
  DialogContent,
  Typography,
  IconButton,
} from "@material-ui/core";

import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import AccountBoxRoundedIcon from "@material-ui/icons/AccountBoxRounded";
import { withTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 768,
    margin: 0,
    padding: "0px 16px",
    backgroundColor: theme.palette.background.active,
    zIndex: 1,
    marginBottom: "10px",
    overflowY: "scroll",
    height: "95%",
  },
  paper: {
    width: "100%",
    paddingTop: "16px",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    alignContent: "flex-start",
    padding: "0px 12px",
    boxShadow: "0 4px 6px -6px grey",
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
    color: "rgba(0,0,0,0.87)",
    fontSize: 24,
    lineHeight: "24px",
  },
}));

export default withTranslation()(function DetailView(props) {
  const classes = useStyles();

  const { open, title = "Details", handleClose, children, t } = props;

  return (
    <Dialog
      open={open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0 }}
      maxWidth="768px"
    >
      <DialogTitle style={{ padding: "16px 0px 5px 0px" }}>
        <Box
          display="flex"
          width="100%"
          justifyContent="space-between"
          className={classes.header}
        >
          <Box p={1} justifyItems="center">
            <Typography className={classes.heading}>
              <Box pr={2} display="flex">
                {" "}
                <AccountBoxRoundedIcon />
                <Box component="span" pl={2}>
                  {title}
                </Box>{" "}
              </Box>
            </Typography>
          </Box>
          <Box>
            <IconButton
              color="primary"
              aria-label="Close"
              title={t("componentData.detailView.Close")}
              component="span"
              onClick={() => handleClose()}
            >
              <CloseIcon variant="contained" color="primary" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.root} hidden={!open}>
        {children}
      </DialogContent>
    </Dialog>
  );
});
