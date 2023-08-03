import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
  makeStyles,
  TextField,
  CircularProgress
} from "@material-ui/core";
import CountryFlag from "~/components/CountryFlag";
import ErrorIcon from "~/assets/icons/error_icon.svg";
import { connect } from "react-redux";
import { approvePayment, rejectPayment } from "~/redux/helpers/payments";
import AddPaymentModal from "~/components/AddPayment/AddPaymentModal";
import Notification from "~/components/Notification";
import InfoIcon from "@material-ui/icons/Info";

function ApprovalModal({
  approveModalOpen,
  setApproveModalOpen,
  t,
  selectedAppRejPayment = [],
  user,
  isApprove,
  paymentDetail,
  paymentId = null,
  fetchClientPaymentStatusList,
  fetchClientPaymentList,
  setSelectedAppRejPayment,
  fetchPaymentDetails,
}) {
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: "#CCE4FF",
      color: "#333333",
      paddingTop: "8px",
      paddingBottom: "8px",
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const useStyles = makeStyles((theme) => ({
    dialog: {
      "& .MuiDialog-paperWidthSm": {
        maxWidth: "700px",
        width: "700px",
      },
    },
    headingContainer: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1),
      justifyContent: "flex-start",
      padding: "24px 0 24px 32px",
      color: "#2B2D30",
    },
    paymentAmount: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(2),
    },
    noPayments: {
      height: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    },
    rejectReason: { marginBottom: "8px", fontSize: "14px" },
    errorContainer: {
      display: "flex",
      alignItems: "center",
      marginTop: "12px",
      gap: theme.spacing(1),
    },
    errorMessage: { color: "#E02020", fontSize: "14px" },
    buttonContainer: { justifyContent: "center", gap: theme.spacing(2) },
    buttons: {
      borderRadius: "6px",
      marginBottom: theme.spacing(3),
      flexBasis: "140px",
    },
  }));
  const [rejectionReason, setRejectionReason] = useState(null);
  const [error, setError] = useState(false);
  const [actionProgress,setActionProgress] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

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

  const handleClose = () => {
    setRejectionReason(null);
    setError(false);
    setApproveModalOpen(false);
  };

  const handleApprove = () => {
    setActionProgress(true)
    const payload = selectedAppRejPayment?.map((item) => ({
      clientID: user?.userData?.portalProfileId,
      paymentID: item.PaymentID,
      isApproved:true,
      rejectReason:""
    }));
    approvePayment(payload).then((resp) => {
      if (!resp?.error) {
        onSuccessAction();
      } else {
        setActionProgress(false)
        setAlertMessage(resp?.message);
      }
    }).catch((err)=>{
      setActionProgress(false)
    })
  };

  const handleReject = () => {
    const isValid = rejectionValidation();
    if (isValid) {
      setActionProgress(true)
      let payload = [];
      if (!paymentDetail) {
        // For listing page
        payload = selectedAppRejPayment?.map((item) => ({
          clientID: user?.userData?.portalProfileId || null,
          paymentID: item.PaymentID || null,
          rejectReason: rejectionReason || "",
          isApproved:false
        }));
      } else {
        // For detail page
        payload = [
          {
            clientID: user?.userData?.portalProfileId || null,
            paymentID: paymentId || null,
            rejectReason: rejectionReason || "",
            isApproved:false
          },
        ];
      }
      rejectPayment(payload).then((resp) => {
        if (!resp?.error) {
          onSuccessAction();
        } else {
          setActionProgress(false)
          setAlertMessage(resp?.message);
        }
      }).catch((err)=>{
      setActionProgress(false)
    })
    }
  };

  const onSuccessAction = () => {
    handleClose();
    setActionProgress(false)
    setModalOpen(true);
    !paymentDetail &&
      fetchClientPaymentStatusList(user?.userData?.portalProfileId);
    !paymentDetail && fetchClientPaymentList();
    paymentDetail && fetchPaymentDetails(paymentId);
    setSelectedAppRejPayment([]);
  };

  const rejectionValidation = () => {
    let isValid = true;
    if (rejectionReason === null || rejectionReason?.length === 0) {
      isValid = false;
      setError(true);
    }
    return isValid;
  };

  const classes = useStyles();

  let desc = "";
  if (isApprove && !paymentDetail) {
    desc = t("componentData.addPayment.modalDesc.multipleApprove");
  } else if (!isApprove && paymentDetail) {
    desc = t("componentData.addPayment.modalDesc.singleReject");
  } else {
    desc = t("componentData.addPayment.modalDesc.multipleReject");
  }
  
  return (
    <>
      <Dialog
        open={approveModalOpen}
        onClose={handleClose}
        className={classes.dialog}
      >
        <DialogContent style={{ padding: "0px" }}>
          {!paymentDetail && (
            <DialogContentText>
              <Box className={classes.headingContainer}>
                <InfoIcon style={{ fontSize: "24px" }} />
                <Typography>
                  {t("componentData.addPayment.headings.review", {
                    number: selectedAppRejPayment?.length,
                    status: isApprove
                      ? t("componentData.addPayment.buttons.approve")
                      : t("componentData.addPayment.buttons.reject"),
                  })}
                </Typography>
              </Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>
                      {t("componentData.addPayment.tableCells.paymentRef")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {t("componentData.addPayment.tableCells.payeeId")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {t("componentData.addPayment.tableCells.paymentType")}
                    </StyledTableCell>
                    <StyledTableCell>
                      {t("componentData.addPayment.tableCells.paymentAmount")}
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ maxHeight: "200px" }}>
                  {selectedAppRejPayment?.map((item) => (
                    <TableRow>
                      <TableCell>{item.PaymentsRef}</TableCell>
                      <TableCell>{item.RemitToID}</TableCell>
                      <TableCell>
                        {item.PaymentTypeDesc ? item.PaymentTypeDesc : ""}
                      </TableCell>
                      <TableCell>
                        <Box className={classes.paymentAmount}>
                          <CountryFlag
                            countryCode={item.CurrencyCode || "USD"}
                            height={28}
                          />
                          <Typography>{item.Amount}</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContentText>
          )}
          {!isApprove ? (
            <>
              <Box
                px={4}
                mb={5}
                style={{ marginTop: paymentDetail ? "16px" : "0px" }}
              >
                <Typography className={classes.rejectReason}>
                  {t("componentData.addPayment.headings.rejectReason")}
                </Typography>
                <TextField
                  label=""
                  placeholder={t(
                    "componentData.addPayment.headings.rejectPlaceholder"
                  )}
                  multiline
                  minRows={5}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                {error && (
                  <Box className={classes.errorContainer}>
                    <img src={ErrorIcon} alt="Error icon" />
                    <Typography className={classes.errorMessage}>
                      {t("componentData.addPayment.errors.rejectReason")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </>
          ) : null}
        </DialogContent>
        <DialogActions className={classes.buttonContainer}>
          {actionProgress ? <CircularProgress color="primary"/> : <>
          <Button
            onClick={handleClose}
            color="primary"
            variant="outlined"
            className={classes.buttons}
          >
            {t("componentData.addPayment.buttons.cancel")}
          </Button>
          <Button
            onClick={isApprove ? handleApprove : handleReject}
            color="primary"
            variant="contained"
            disabled={
              paymentDetail
                ? false
                : selectedAppRejPayment?.length === 0
                ? true
                : false
            }
            className={classes.buttons}
          >
            {isApprove
              ? t("componentData.addPayment.buttons.approve")
              : t("componentData.addPayment.buttons.submit")}
          </Button></>}
        </DialogActions>
      </Dialog>
      <AddPaymentModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        desc={desc}
      />
      {alertMessage && renderSnackbar()}
    </>
  );
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(ApprovalModal)
);
