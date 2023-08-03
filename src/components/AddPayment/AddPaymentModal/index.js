import React from "react";
import { withTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box,
  makeStyles,
} from "@material-ui/core";
import CheckCircleIcon from "~/assets/icons/check_circle_primary.svg";

function AddPaymentModal({ modalOpen, handleModalClose, t, desc }) {
  const useStyles = makeStyles((theme) => ({
    dialogContent: { padding: "24px 60px 0 60px" },
    message: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(4),
      fontSize: theme.spacing(2),
      color: "#4C4C4C",
      textAlign: "center",
    },
    button: { borderRadius: "6px", marginBottom: theme.spacing(3) },
    iconContainer: { display: "flex", justifyContent: "center" },
  }));
  const classes = useStyles();
  return (
    <Dialog
      open={modalOpen}
      onClose={handleModalClose}
    >
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          <Box className={classes.iconContainer}>
            <img src={CheckCircleIcon} alt="Check Circle" />
          </Box>
          <Typography className={classes.message}>{desc}</Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button
          onClick={handleModalClose}
          color="primary"
          variant="contained"
          className={classes.button}
        >
          {t("componentData.addPayment.buttons.okay")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withTranslation()(AddPaymentModal);
