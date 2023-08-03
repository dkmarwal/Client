import React from 'react';
import Portal  from '@material-ui/core/Portal';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton"
import CloseIcon from '@material-ui/icons/Close';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  
export const SnackbarComponent = (props) => {
    const {openSnackbar, handleClose, snackbarMessage, icon, messageVariant} = props
  return (
    <Portal>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackbar}
        onClose={handleClose}
        autoHideDuration={5000}
      >
        <Alert icon={icon} action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={handleClose}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                } severity={messageVariant}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Portal>
  );
};
