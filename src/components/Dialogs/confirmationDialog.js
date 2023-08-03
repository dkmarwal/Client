import React from "react";
import {
  Dialog,
  DialogActions,
  makeStyles,
  Button,
  DialogContent,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  dialogBox: {
    "& .MuiDialog-paper": {
      alignItems: "center",
      textAlign: "center",
      padding: theme.spacing(2),
    },
  },
  dialogContentText: {
    fontSize: "18px",
  },
  dialogActionButtons: {
    "&.MuiDialogActions-root": {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(4),
    },
    "&.MuiDialogActions-spacing > :not(:first-child)": {
      marginLeft: theme.spacing(3),
    },
    "& .MuiButtonBase-root": {
      fontSize: "16px",
    },
  },
}));

export default function ConfirmationDialog(props) {
  const {
    open,
    handleClose,
    dialogContent,
    handleConfirm,
    saveButtonLabel,
    cancelButtonLabel,
  } = props;
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-describedby="alert-dialog-description"
      className={classes.dialogBox}
    >
      <DialogContent
        className={classes.dialogContentText}
        id="alert-dialog-description"
      >
        {dialogContent}
      </DialogContent>
      <DialogActions className={classes.dialogActionButtons}>
        <Button onClick={handleClose} color="primary" variant="contained">
          {cancelButtonLabel ?? "CANCEL"}
        </Button>
        <Button onClick={handleConfirm} color="primary" variant="outlined">
          {saveButtonLabel ?? "SUBMIT"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
