import React from "react";
import {
  Button,
  Grid,
  Box,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  IconButton,
} from "@material-ui/core";
import "./styles.scss";
import { ReactComponent as BellIcon } from "~/assets/icons/notiBell.svg";
import CloseIcon from "@material-ui/icons/Close";
import { withTranslation, useTranslation } from "react-i18next";
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

function confirmDialog(props) {
  const { icon, title, message, onConfirm, onCancel, open = true, t } = props;
  return (
    <div id="mainDialogs">
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box p={2}>
          <Box display="flex" justifyContent="center">
            {icon}
          </Box>
          <DialogTitle className="dialogTitle">
            <div className="confirmTitle">{title}</div>
          </DialogTitle>
          <DialogContent>
            <Box>
              <Typography variant="h3">{message}</Typography>
            </Box>
          </DialogContent>
        </Box>
        <Box
          display="flex"
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
          mb={2}
        >
          <Box p={1}>
            <Button
              variant="outlined"
              fullWidth={true}
              onClick={onCancel}
              color="primary"
            >
              {t("componentData.dialogs.No")}
            </Button>
          </Box>
          <Box p={1}>
            <Button
              variant="contained"
              fullWidth={true}
              onClick={onConfirm}
              color="primary"
              autoFocus
            >
              {t("componentData.dialogs.Yes")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}

export const ConfirmDialog = withTranslation()(confirmDialog);

function alertDialog(props) {
  const {
    dialogClassName = "",
    title,
    message,
    onConfirm,
    boxSize,
    open = true,
    t,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={dialogClassName || ""}
      maxWidth={boxSize ? boxSize : "sm"}
    >
      <Box py={6} px={6}>
        {title && (
          <DialogTitle className="alert-dialog-title dialogTitle">
            {title}
          </DialogTitle>
        )}
        {message && (
          <DialogContent className="alert-dialog-message">
            <Box color="primary.main" mb={2}>
              <div className="dialogConten">{message}</div>
            </Box>
          </DialogContent>
        )}
        <DialogActions>
          <Grid container justify="center">
            <Grid item xs={props.i18n.language === "fr" ? 4 : 5}>
              <Button
                variant="contained"
                disableElevation
                fullWidth
                onClick={onConfirm}
                color="primary"
                autoFocus
              >
                {t("componentData.dialogs.OK")}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export const AlertDialog = withTranslation()(alertDialog);

function contentDialog(props) {
  const { onConfirm, open = true, t } = props;
  return (
    <Dialog
      fullWidth="true"
      maxWidth="md"
      open={open}
      className="DialogContainerNew"
      onClose={onConfirm}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle className="alert-dialog-title dialogTitle">
        <Box display="flex" justifyContent="space-between">
          <Box fontSize={24} color="primary.main" my={2}>
            {t("componentData.dialogs.Preview")}{" "}
          </Box>

          <IconButton onClick={onConfirm}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Box width={1}>{props.children}</Box>
      </DialogContent>
      <DialogActions>
        <Grid container justify="center">
          <Grid item xs={props.i18n.language === "fr" ? 4 : 3}>
            <Button
              variant="contained"
              fullWidth="true"
              onClick={onConfirm}
              color="primary"
              autoFocus
            >
              {t("componentData.dialogs.CLOSE")}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

export const ContentDialog = withTranslation()(contentDialog);

function customDialog(props) {
  const {
    dialogClassName = "",
    title,
    height,
    onConfirm,
    open = true,
    showButton,
    alignSide,
    width,
    icon,
    t,
    btnDisabled = false,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0, width: "600px" }}
      className={` ${dialogClassName || ""}`}
    >
      <div
        style={{ width: width || "630px", height }}
        className={`${alignSide ? "sideDialog" : "centerDialog"}`}
      >
        <Box
          p={alignSide ? 2 : 0}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <div className="heading">
            <span className="dialogTitle">
              {icon && (
                <img
                  src={require(`~/assets/icons/icon_filter.svg`)}
                  alt={t("componentData.dialogs.ViewFilter")}
                  className="imgIcon"
                />
              )}
              {title}
            </span>
            <IconButton
              className="dialogCross"
              onClick={onConfirm}
              size="small"
            >
              <img
                src={require(`~/assets/icons/cancel-close.svg`)}
                alt={t("componentData.dialogs.Close")}
              />
            </IconButton>
          </div>
        </Box>
        <Box py={6} px={6} style={{ padding: 0 }}>
          <DialogContent className="alert-dialog-message">
            <Box color="primary.main" mb={2}>
              <div className="dialogConten">{props.children}</div>
            </Box>
          </DialogContent>
          {showButton && (
            <DialogActions>
              <Grid container justify="center">
                <Grid item xs={props.i18n.language === "fr" ? 4 : 3}>
                  <Button
                    disabled={btnDisabled}
                    variant="contained"
                    fullWidth="true"
                    onClick={onConfirm}
                    color="primary"
                    autoFocus
                  >
                    {t("componentData.dialogs.OK")}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          )}
        </Box>
      </div>
    </Dialog>
  );
}

export const CustomDialog = withTranslation()(customDialog);

function customDialogNew(props) {
  const {
    dialogClassName = "",
    onClose,
    open,
    btnDisabled,
    showBtn,
    showCloseIcon,
    t
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={dialogClassName || ""}
    >
      {(showCloseIcon || showBtn) && (
        <Box display={"flex"} position="absolute" right={5} top={5} justifyContent="flex-end" zIndex="modal">
           <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
         
      )}
      {/* {(showCloseIcon ||showBtn ) && (
        <span
          style={{
            position: 'absolute',
            right: 5,
            top: 5,
          }}
        >
          <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </span>
      )} */}
      <Box>
        <DialogContent className="alert-dialog-messaged">
          <Box color="primary.main" mb={2}>
            {props.children}
          </Box>
        </DialogContent>
        {showBtn && (
          <DialogActions>
            <Grid container justifyContent="center">
              <Grid item xs={4} lg={4} justifyContent="center">
                <Button
                  disabled={btnDisabled}
                  style={
                    btnDisabled
                      ? {
                          opacity: 0.5,
                          pointerEvents: "none",
                          cursor: "not-allowed",
                        }
                      : {}
                  }
                  variant="contained"
                  fullWidth="true"
                  onClick={onClose}
                  color="primary"
                  autoFocus
                >
                  {t("dialogs.UserExistConfirmDialog.label.ok")}
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        )}
      </Box>
    </Dialog>
  );
}

export const CustomDialogNew = withTranslation()(customDialogNew);

function noitificationDialog(props) {
  const {
    dialogClassName = "",
    title,
    onConfirm,
    open = true,
    showButton,
    alignSide,
    t,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0 }}
      className={`${dialogClassName || ""}`}
    >
      <div
        className={`${alignSide ? "notificationSideDialog" : ""}`}
        style={props.i18n.language === "fr" ? { width: 520 } : {}}
      >
        <Grid container className="heading">
          <Grid item xs={2}>
            <BellIcon />
          </Grid>
          <Grid item xs={7}>
            <Typography variant="h1">{title}</Typography>
          </Grid>
          <Grid item xs={2}>
            {" "}
            <Typography className="dialogCross" onClick={onConfirm}>
              X
            </Typography>
          </Grid>
        </Grid>
        <Box style={{ padding: 0 }}>
          <DialogContent className="alert-dialog-message">
            <Box color="primary.main" m={1}>
              {props.children}
            </Box>
          </DialogContent>
          {showButton && (
            <DialogActions>
              <Grid container justify="center">
                <Grid item xs={props.i18n.language === "fr" ? 4 : 3}>
                  <Button
                    variant="contained"
                    fullWidth="true"
                    onClick={onConfirm}
                    color="primary"
                    autoFocus
                  >
                    {t("componentData.dialogs.OK")}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          )}
        </Box>
      </div>
    </Dialog>
  );
}

export const NoitificationDialog = withTranslation()(noitificationDialog);

function sideDialog(props) {
  const {
    t,
    dialogClassName = "",
    title,
    onConfirm,
    open = true,
    showButton,
    alignSide,
    icon,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onConfirm}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 0 }}
      className={`${dialogClassName || ""}`}
    >
      <div className={`${alignSide ? "customSideDialog" : ""}`}>
        <Grid container className="heading">
          <Grid xs={1}></Grid>
          {icon && (
            <Grid xs={1}>
              <img
                src={require(`~/assets/icons/${icon}.svg`)}
                alt={"Icon"}
                className="imgIcon"
              />
            </Grid>
          )}
          <Grid item xs={8}>
            <Typography variant="h1">{title}</Typography>
          </Grid>
          <Grid item xs={2}>
            {" "}
            <IconButton onClick={onConfirm}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
        <Box style={{ padding: 0 }}>
          <DialogContent className="alert-dialog-message">
            <Box color="primary.main" m={1}>
              {props.children}
            </Box>
          </DialogContent>
          {showButton && (
            <DialogActions>
              <Grid container justify="center">
                <Grid item xs={props.i18n.language === "fr" ? 4 : 3}>
                  <Button
                    variant="contained"
                    fullWidth="true"
                    onClick={onConfirm}
                    color="primary"
                    autoFocus
                  >
                    {t("componentData.dialogs.OK")}
                  </Button>
                </Grid>
              </Grid>
            </DialogActions>
          )}
        </Box>
      </div>
    </Dialog>
  );
}

export const SideDialog = withTranslation()(sideDialog);

function idleTimeOutModal(props) {
  const { title, message, onConfirm, open = true, t } = props;
  return (
    <div id="mainDialogs">
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box py={6} px={6}>
          <DialogTitle className="dialogTitle">{title}</DialogTitle>
          <DialogContent>
            <div className="dialogConten">{message}</div>
          </DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              variant="contained"
              className="yesBtn"
              onClick={onConfirm}
              color="primary"
            >
              {t("componentData.dialogs.Yes")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}

export const IdleTimeOutModal = withTranslation()(idleTimeOutModal);

export function PayeeConfirmDialog(props) {
  const { icon, title, message, onConfirm, onCancel, open = true } = props;
  const { t } = useTranslation();
  return (
    <div id="mainDialogs">
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={"sm"}
        fullWidth={"sm"}
      >
        <Box p={2}>
          <Box display="flex" justifyContent="center">
            <Box justifyContent="center" flexGrow={1} display="flex">
              {icon}
            </Box>
            <Box alignSelf="flex-end" m={0} p={0} style={{ cursor: "pointer" }}>
              <CloseIcon fontSize="small" size="small" onClick={onCancel} />
            </Box>
          </Box>
          <DialogTitle className="dialogTitle" style={{ color: "#E03617" }}>
            {title}
          </DialogTitle>
          <DialogContent>
            <Box style={{ color: "#E03617" }} textAlign="center">
              <Typography variant="h3">{message}</Typography>
            </Box>
          </DialogContent>
        </Box>
        <Box
          display="flex"
          flexGrow={1}
          justifyContent="center"
          alignItems="center"
          mb={2}
        >
          <Box p={1}>
            <Button
              variant="outlined"
              fullWidth={true}
              onClick={onCancel}
              color="primary"
            >
              {t("componentData.editCompanyView.cancel")}
            </Button>
          </Box>
          <Box p={1}>
            <Button
              variant="contained"
              fullWidth={true}
              onClick={onConfirm}
              color="primary"
            >
              {t("componentData.SmallTxt.gotoUpdates")}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </div>
  );
}
export function CustomDialogrouting(props) {
  const { t } = useTranslation("common");
  const {
    dialogClassName = "",
    onClose,
    open,
    btnDisabled,
    showBtn,
    showCloseIcon,
  } = props;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={dialogClassName || ""}
    >
      {(showCloseIcon || showBtn) && (
        <Box display={"flex"} position="absolute" right={5} top={5} justifyContent="flex-end" zIndex="modal">
           <IconButton onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
         
      )}
    
      <Box>
        <DialogContent className="alert-dialog-messaged">
          <Box color="primary.main" mb={2}>
            {props.children}
          </Box>
        </DialogContent>
        {showBtn && (
          <DialogActions>
            <Grid container justifyContent="center">
              <Grid item xs={4} lg={4} justifyContent="center">
                <Button
                  disabled={btnDisabled}
                  style={
                    btnDisabled
                      ? {
                          opacity: 0.5,
                          pointerEvents: "none",
                          cursor: "not-allowed",
                        }
                      : {}
                  }
                  variant="contained"
                  fullWidth="true"
                  onClick={onClose}
                  color="primary"
                  autoFocus
                >
                  {t("dialogs.UserExistConfirmDialog.label.ok")}
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        )}
      </Box>
    </Dialog>
  );
}
function fullWidthDialog(props) {
  const { title, onConfirm, open = true, t } = props;
  return (
    <Dialog
      fullWidth="true"
      maxWidth="lg"
      open={open}
      onClose={onConfirm}
      scroll={"paper"}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle className="alert-dialog-title previewDialogTitle">
        <Grid container className="heading">
          <Grid item xs={10}>
            <Typography>{title}</Typography>
          </Grid>
          <Grid item xs={2}>
            <CloseIcon className="dialogCross" onClick={onConfirm} />
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent dividers={false}>
        <Box width={1}>{props.children}</Box>
      </DialogContent>
      <DialogActions>
        <Grid container justify="center">
          <Grid item xs={2} className="previewCloseBtn">
            <Button
              variant="contained"
              fullWidth="true"
              onClick={onConfirm}
              color="primary"
              autoFocus
            >
              {t("componentData.dialogs.CLOSE")}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
}

export const FullWidthDialog = withTranslation()(fullWidthDialog);

function simpleCustomDialog(props) {
  const { dialogClassName = "", onConfirm, open = true } = props;
  return (
    <div className="cstmDialog">
      <Dialog
        maxWidth="md"
        open={open}
        onClose={onConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={`${dialogClassName} customDialog`}
      >
        {props.children}
      </Dialog>
    </div>
  );
}

export const SimpleCustomDialog = withTranslation()(simpleCustomDialog);

export function ConfirmModal(props) {
  const { open, handleClose, dialogContent, handleConfirm, saveButtonLabel, cancelButtonLabel, title } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-describedby="confirm-dialog-description"
      maxWidth={"xs"}
      className="confirmModalBox"
    >
      <DialogTitle>
        <Box textAlign="right">
          <CloseIcon onClick={handleClose} className="closeBtn" fontSize="small" />
        </Box>
        <Box className="confirmTitle">{title}</Box>
      </DialogTitle>
      <DialogContent id="confirm-dialog-description" className="confirmMessage">
        {dialogContent}
      </DialogContent>
      <DialogActions className="actionBtns">
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <Button onClick={handleClose} color="primary" variant="outlined">
              {cancelButtonLabel ?? "CANCEL"}
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={handleConfirm} color="primary" variant="contained">
              {saveButtonLabel ?? "SUBMIT"}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}

function errorDialog(props) {
  const { t, open, onConfirm, dialogContent } = props;

  return (
    <Dialog
      open={open}
      //onClose={handleClose}
      aria-describedby="confirm-dialog-description"
      maxWidth={"sm"}
      fullWidth
      className="confirmModalBox"
    >
      <DialogTitle>
        <Box textAlign="center" pt={2}>
          <ErrorOutlineIcon color="error" />
        </Box>
      </DialogTitle>
      <DialogContent id="confirm-dialog-description" className="confirmMessage">
        {dialogContent}
      </DialogContent>
      <DialogActions className="actionBtns">
        <Grid container spacing={2} direction="row" justifyContent="center" alignItems="center">
          <Grid item>
            <Button onClick={onConfirm} color="primary" variant="contained">
              {t("componentData.dialogs.OK")}
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  )
}
export const ErrorDialog = withTranslation()(errorDialog);
