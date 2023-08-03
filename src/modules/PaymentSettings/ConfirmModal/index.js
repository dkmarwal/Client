import React from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import InfoIcon from "@material-ui/icons/Info";
import { useStyles } from "./styles";

const ConfirmModal = ({ closeModal, goNext, saveInfo, message, confirmText, declinedText }) => {
  const classes = useStyles();
  return (
    <Box width="500px">
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item className={classes.infoIcon} align="center">
            <InfoIcon className={classes.alignBottom} align="center" color="primary" />
          </Grid>
          <Grid item>
            <IconButton onClick={() => closeModal()}>
              <CloseIcon fontSize="small" className={classes.closeIcon} />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent boxSizing="border-box">
        <DialogContentText className={classes.modalContent}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button
          variant="outlined"
          onClick={() => goNext()}
        >
          {declinedText}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => saveInfo()}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default ConfirmModal;
