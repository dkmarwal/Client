import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import { styles } from './styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const CancelPaymentDialog = (props) => {
    const { open, handleCancelPaymentDialog, handleSubmitCancelPayment }=props
    const [cancelPaymentValue,setCancelPaymentValue]=React.useState(null)
  
    const handleClose = () => {
        handleCancelPaymentDialog(false)
    };

    const handleChange = (event) => {
        const {value}=event.target
        setCancelPaymentValue(value)
    }
    const handleSubmit = () => {
      handleSubmitCancelPayment(cancelPaymentValue)
    }
  
    return (
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Cancel Payment</DialogTitle>
          <DialogContent>
            <TextField
                variant='outlined'
                label='Cancel Payment Reason'
                value={cancelPaymentValue}
                onChange={handleChange}
                inputProps={{
                  maxLength: 255
                }}
              />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  export default withTranslation()(withStyles(styles)(CancelPaymentDialog));
  