import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  makeStyles,
  CircularProgress
} from "@material-ui/core";
import AddPaymentModal from "~/components/AddPayment/AddPaymentModal";
import { approvePayment } from "~/redux/helpers/payments";
import { connect } from "react-redux";
import Notification from "~/components/Notification";

function ConfirmModal({
  confirmModal,
  setConfirmModal,
  t,
  user,
  paymentId,
  fetchPaymentDetails,
  i18n,
}) {
  const useStyles = makeStyles((theme) => ({
    buttons: {
      justifyContent: "center",
      gap: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    button: { borderRadius: "6px", marginBottom: theme.spacing(3) },
    message: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(4),
      fontSize: theme.spacing(2),
      color: "#4C4C4C",
      textAlign: "center",
    },
    dialog: {
      paddingTop: "24px",
      paddingLeft: i18n.language === "es" ? "100px" : "60px",
      paddingRight: i18n.language === "es" ? "100px" : "60px",
      paddingBottom: "0px",
    },
  }));
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [actionProgress, setActionProgress] = useState(false)

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const renderSnackbar = () => {
    return (
      <Notification
        variant="error"
        message={alertMessage}
        handleClose={hideAlertMessage}
      />
    );
  };

  const hideAlertMessage = () => {
    setAlertMessage(null);
  };

  const handleApprove = () => {
    setActionProgress(true)
    const payload = [
      {
        clientID: user?.userData?.portalProfileId,
        paymentID: paymentId,
        isApproved:true,
        rejectReason:""
      },
    ];
    approvePayment(payload).then((resp) => {
      if (!resp.error) {
        fetchPaymentDetails(paymentId);
        setConfirmModal(false);
        setActionProgress(false)
        setModalOpen(true);
      } else {
        setActionProgress(false)
        setAlertMessage(resp?.message);
      }
    }).catch((err)=>{
      setActionProgress(false)
    })
  };

  return (
    <>
      <Dialog
        open={confirmModal}
        onClose={() => setConfirmModal(false)}
      >
        <DialogContent className={classes.dialog}>
          <DialogContentText>
            <Typography className={classes.message}>
              {t("componentData.addPayment.modalDesc.approvePayment")}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.buttons}>
          {actionProgress ? <CircularProgress color="primary"/> :<><Button
            onClick={() => setConfirmModal(false)}
            color="primary"
            variant="outlined"
            className={classes.button}
          >
            {t("componentData.addPayment.buttons.cancel")}
          </Button>
          <Button
            onClick={handleApprove}
            color="primary"
            variant="contained"
            className={classes.button}
          >
            {t("componentData.addPayment.buttons.approve")}
          </Button>
          </>}
        </DialogActions>
      </Dialog>
      <AddPaymentModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        desc={t("componentData.addPayment.modalDesc.singleApprove")}
      />
      {alertMessage && renderSnackbar()}
    </>
  );
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(ConfirmModal)
);
