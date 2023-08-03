import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { styles } from './styles';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import CancelPaymentReasons from './cancelPaymentReasons';
import Button from '@material-ui/core/Button';
import { CancelReasonId } from '~/utils/const'

const CancelPayment = (props) => {
  const {
    classes,
    cancelReasonsList,
    handleCancelPaymentDialog,
    openCancelPaymentDialog,
    handleSubmitCancelPayment,
    t
  } = props;
  const [cancelReasonId, setCancelReasonId] = useState(0);
  const [otherCancelReason, setOtherCancelReason] = useState(null);

  const cancelPayment = () => {
    setCancelReasonId(0);
    setOtherCancelReason(null);
    handleCancelPaymentDialog();
  };

  const handleCancelPayment = () => {
    let finalValue = otherCancelReason?.trim() ?? ''
    if (cancelReasonId !== CancelReasonId) {
      finalValue = cancelReasonsList.find((reason) => reason.Id === cancelReasonId).Reason
    }
    handleSubmitCancelPayment(finalValue)
  };

  const isCancelButtonDisabled =
    !cancelReasonId ||
    (cancelReasonId === CancelReasonId &&
      (!otherCancelReason || !otherCancelReason.trim().length));
  return (
    <>
      <Grid container className={classes.cancelContainer}>
        <Divider className={classes.dividerBorder} />
        <Grid container className={classes.cancelDiv}>
          <Grid
            item
            className={classes.cancelItem}
            onClick={cancelPayment}
          >
            <img
              alt="Cancel"
              src={require('~/assets/icons/cancel.svg')}
              className={classes.cancelIcon}
            />
            <Typography className={classes.cancelText}>
              {t('componentData.cancelPaymentTexts.cancelPayment')}
            </Typography>
          </Grid>
          <Grid
            item
            className={classes.plusMinusIcon}
            onClick={handleCancelPaymentDialog}
          >
            {openCancelPaymentDialog ? (
              <img
                alt="Cancel"
                src={require('~/assets/icons/indeterminate_check_box.svg')}
                className={classes.addBoxIcon}
              />
            ) : (
              <img
                alt="Cancel"
                src={require('~/assets/icons/add_box.svg')}
                className={classes.addBoxIcon}
              />
            )}
          </Grid>
        </Grid>
        {openCancelPaymentDialog && (
          <>
            <CancelPaymentReasons
              cancelReasonsList={cancelReasonsList}
              setCancelReasonId={setCancelReasonId}
              cancelReasonId={cancelReasonId}
              setOtherCancelReason={setOtherCancelReason}
              otherCancelReason={otherCancelReason}
            />
            <Grid item>
              <Button
                color="primary"
                variant="outlined"
                className={classes.cancelPaymentButtons}
                onClick={cancelPayment}
              >
                {t('componentData.cancelPaymentTexts.cancelButton')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.cancelPaymentButtons}
                disabled={isCancelButtonDisabled}
                onClick={handleCancelPayment}
              >
                {t('componentData.cancelPaymentTexts.confirmPayment')}
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default withTranslation()(withStyles(styles)(CancelPayment));
