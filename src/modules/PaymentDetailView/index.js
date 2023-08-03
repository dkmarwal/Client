import React, { useState } from "react";
import { Box, Grid, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { styles } from "./styles";
import { entityType, PayerTypes } from "~/config/entityTypes";
import PaymentTranxDetails from "~/modules/PaymentTranxDetails";
import B2CPaymentTranxDetails from "~/modules/PaymentTranxDetails/B2C";
import USbankPaymentTranxDetails from "~/modules/PaymentTranxDetails/USbank";
import CommercialCardDetails from "~/modules/PaymentTranxDetails/CommercialCardDetails";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { useHistory } from "react-router-dom";
import config from "~/config";
import { accessRights } from "~/config/accessRights";
import Notification from "~/components/Notification";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { USBankPaymentPendingApprovalDetail } from "~/config/entityTypes";

const PaymentDetailView = (props) => {
  let history = useHistory();
  const { location, user, t, classes } = props;
  const { paymentId, appType, clientId, payeeRemitToId, filters, queryParams } =
    location.state;
  const { isPayeeChoicePortal } = user;
  const username = user?.userData?.userName ?? "";
  const isUSBankApproveEnabled =
    (user.userRoles &&
      user.userRoles.includes(
        accessRights["PAYMENTS_PAYMENTS_REMITTANCES_APPROVE"]
      )) ||
    false;
  const isUSBankRejectEnabled =
    (user.userRoles &&
      user.userRoles.includes(
        accessRights["PAYMENTS_PAYMENTS_REMITTANCES_REJECT"]
      )) ||
    false;
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [returnStatusID, setReturnStatusID] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [createdByUserID, setCreatedByUserID] = useState(null);

  const goBack = () => {
    history.push({
      pathname: `${config.baseName}/payments/paymentDetails`,
      search: queryParams,
      state: {
        backFilter: filters,
      },
    });
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

  return (
    <>
      <Grid container>
        <Grid item xs={12} className={classes.headerContainer}>
          <Box display="flex" mx={6} my={1} fontSize={16}>
            <Box className={classes.backButton}>
              <KeyboardBackspaceIcon color="secondary" onClick={goBack} />
            </Box>
            <Box color="#008CE6">{t("componentData.payments.MyPayments")}</Box>
            <Box mx={0.5}>/</Box>
            <Box>
              {`${paymentId} ${
                user.userData && user.userData.payerTypeId == PayerTypes.CARDS
                  ? t("componentData.CCPaymentTransaction.virtualDetails")
                  : t("componentData.paymentDetailss.PaymentDetailsTxt")
              }`}
            </Box>
          </Box>
          {
            user.isPayeeChoicePortal &&
            returnStatusID === USBankPaymentPendingApprovalDetail[0] ? (
              <Box style={{ marginRight: "48px" }}>
                {isPayeeChoicePortal && isUSBankApproveEnabled && (
                  <Button
                    onClick={() => setConfirmModal(true)}
                    startIcon={<CheckCircleIcon />}
                    className={classes.appRejButton}
                    disabled={createdByUserID === user?.userData?.userId}
                  >
                    {t("componentData.addPayment.buttons.approve")}
                  </Button>
                )}
                {isPayeeChoicePortal && isUSBankRejectEnabled && (
                  <Button
                    onClick={() => setApproveModalOpen(true)}
                    startIcon={<CancelIcon />}
                    className={classes.appRejButton}
                    disabled={createdByUserID === user?.userData?.userId}
                  >
                    {t("componentData.addPayment.buttons.reject")}
                  </Button>
                )}
              </Box>
            ) : null
          }
        </Grid>

        <Grid item xs={12}>
          <Box mx={6}>
            {user.userData && user.userData.payerTypeId == PayerTypes.CARDS ? (
              <CommercialCardDetails
                paymentId={paymentId}
                clientId={clientId}
                businessType={appType}
                selectedPayeeRemitToId={payeeRemitToId}
                userName={username}
                {...props}
              />
            ) : !appType || entityType.B2B === parseInt(appType) ? (
              <PaymentTranxDetails
                clientId={clientId}
                paymentId={paymentId}
                claims={user.userRoles}
                selectedPayeeRemitToId={payeeRemitToId}
                {...props}
                userData={user.userData}
                businessType={appType || entityType.B2B}
              />
            ) : isPayeeChoicePortal ? (
              <USbankPaymentTranxDetails
                clientId={clientId}
                paymentId={paymentId}
                claims={user.userRoles}
                selectedPayeeRemitToId={payeeRemitToId}
                {...props}
                userData={user.userData}
                businessType={appType || entityType.B2C}
                approveModalOpen={approveModalOpen}
                setApproveModalOpen={setApproveModalOpen}
                setReturnStatusID={setReturnStatusID}
                confirmModal={confirmModal}
                setConfirmModal={setConfirmModal}
                setCreatedByUserID={setCreatedByUserID}
              />
            ) : (
              <B2CPaymentTranxDetails
                clientId={clientId}
                paymentId={paymentId}
                claims={user.userRoles}
                selectedPayeeRemitToId={payeeRemitToId}
                {...props}
                userData={user.userData}
                businessType={appType || entityType.B2C}
              />
            )}
          </Box>
        </Grid>
      </Grid>
      {alertMessage && renderSnackbar()}
    </>
  );
};
export default withTranslation()(
  withStyles(styles)(
    connect((state) => ({
      ...state.user,
    }))(PaymentDetailView)
  )
);
