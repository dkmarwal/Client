import React, { Component } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  dialogModel: {
    "& .MuiDialog-paperScrollPaper": {
      display: "block",
      padding: theme.spacing(4, 5),
      maxWidth: "418px",
      borderRadius: "6px",
      boxShadow:
        "0px 4px 5px rgba(0, 0, 0, 0.14), 0px 1px 10px -1px rgba(0, 0, 0, 0.12), 0px 2px 4px -1px rgba(0, 0, 0, 0.2)",
    },
  },
  dialogTitle: {
    textAlign: "center",
    padding: theme.spacing(2, 0),
  },
  dialogActions: {
    justifyContent: "center",
  },
  dialogTitleHeading: {
    color: "#000000",
    paddingTop: theme.spacing(4),
  },
  stepDoneIcon: {
    width: "34px",
    height: "34px",
  },
  dialogSubTitle: {
    color: "#4C4C4C",
  },
  confirmButton: {
    background: "#F4F4F4",
    borderRadius: "6px",
    color: "#008CE6",
    letterSpacing: "0.5px",
    "&:hover": {
      background: "#F4F4F4",
    },
  },
  dialogContent: {
    padding: theme.spacing(1, 0),
  },
});
class DialogueModal extends Component {
  render() {
    const { classes, title, confirmText, onConfirm, open, subtitle } =
      this.props;
    return (
      <Dialog
        open={open}
        aria-labelledby="simple-dialog-title"
        className={classes.dialogModel}
      >
        <DialogTitle className={classes.dialogTitle}>
          <img
            src={require(`~/assets/icons/Step_Done.svg`)}
            alt="StepDone"
            className={classes.stepDoneIcon}
          />
          <Typography variant="h3" className={classes.dialogTitleHeading}>
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>
            <Typography className={classes.dialogSubTitle} variant="body">
              {subtitle}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button
            type="submit"
            fullWidth={false}
            variant="contained"
            color="primary"
            onClick={onConfirm}
            className={classes.confirmButton}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export default withStyles(styles)(DialogueModal);
