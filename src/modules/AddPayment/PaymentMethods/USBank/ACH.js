import React, { useState, useEffect } from "react";
import TextField from "~/components/Forms/TextField";
import {
  Grid,
  InputAdornment,
  Link,
  makeStyles,
  MenuItem,
  Box,
  CircularProgress,
  withStyles,
} from "@material-ui/core";
import DatePicker, { registerLocale } from "react-datepicker";
import { connect } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import EventIcon from "@material-ui/icons/Event";
import { withTranslation } from "react-i18next";
import en from "date-fns/locale/es";
import fr from "date-fns/locale/es";
import es from "date-fns/locale/es";
import moment from "moment";
import AlphaNumericMaskInput from "~/components/MaskInput/AlphaNumericMaskInput";
import SearchIcon from "~/assets/icons/search.svg";
import { CustomDialogNew } from "~/components/Dialogs";
import RoutingCodeSearch from '~/modules/RoutingCodeResults/USbank/routingCodeSearch';
import { getClientPaymentTypesPayee } from "~/redux/actions/payments";
import { styles } from "./styles";
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("es", es);

function USBankACH({
  achInputs,
  handleAchChange,
  t,
  i18n,
  achDate,
  handleAchDate,
  handleBankDetails,
  handleGetValue,
  handleResetValue,
  dispatch,
  payment,
  validationState,
  handleResetValueConfirm,
  handleGetValueConfirm,
  fieldsDisabled,
  classes,
  isForcedPayment,
  user
}) {
  const useStyles = makeStyles((theme) => ({
    searchRoutingText: {
      color: "#008CE6",
      display: "flex",
      fontSize: "0.75rem",
      paddingTop: theme.spacing(0.5),
      textDecoration: "underline",
      marginLeft: "4px",
    },
    routingCodeDialog: {
      "& .MuiDialog-paper": {
        maxWidth: "860px !important",
        minWidth: "600px",
        borderRadius: "10px",
        [theme.breakpoints.down("xs")]: {
          minWidth: "90%",
          width: "100%",
          margin: "0px 16px !important",
        },
      },
    },
    bankNameContainer: {
      marginTop: theme.spacing(1),
    },
    bankName: {
      "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
        {
          borderColor:
            Boolean(validationState["bankName"]) && "#f44336 !important",
        },
    },
  }));
  const classes1 = useStyles();
  const [openSearchModal, setOpenSearchModal] = useState(false);

  const handleDialogClose = () => {
    setOpenSearchModal(false);
  };

  useEffect(() => {
    dispatch(getClientPaymentTypesPayee());
  }, []);

  const { types } = payment;

  return (
    <Grid xs={12} container spacing={2} className={classes.gridMarginTop}>
      <Grid xs={6} item>
        <AlphaNumericMaskInput
          required
          label={t("componentData.addPayment.labels.accountNum")}
          error={Boolean(validationState["accountNum"])}
          helperText={(validationState && validationState["accountNum"]) || ""}
          fullWidth={true}
          autoComplete="off"
          variant="outlined"
          value={achInputs.accountNum || ""}
          name="accountNum"
          getValue={(val) => handleGetValue(val)}
          resetValue={() => handleResetValue()}
          disabled={fieldsDisabled}
          inputProps={{
            maxLength: 17,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <AlphaNumericMaskInput
          required
          label={t("componentData.addPayment.labels.confirmAccountNum")}
          error={
            Boolean(validationState["confirmAccountNum"]) ||
            Boolean(validationState["sameAccountNumber"])
          }
          helperText={
            (validationState && validationState["confirmAccountNum"]) ||
            validationState["sameAccountNumber"] ||
            ""
          }
          fullWidth={true}
          autoComplete="off"
          variant="outlined"
          disabled={fieldsDisabled}
          value={achInputs.confirmAccountNum || ""}
          name="confirmAccountNum"
          getValue={(val) => handleGetValueConfirm(val)}
          resetValue={() => handleResetValueConfirm()}
          inputProps={{
            maxLength: 17,
          }}
        />
      </Grid>
      <Grid xs={6} item>
        <TextField
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.routingCode")}
          value={achInputs.routingCode || ""}
          name="routingCode"
          onChange={handleAchChange}
          disabled={fieldsDisabled}
          style={{ marginBottom: "0px" }}
          error={Boolean(validationState["routingCode"])}
          helperText={(validationState && validationState["routingCode"]) || ""}
          inputProps={{
            maxLength: 9,
            minLength: 9,
          }}
        />
        {isForcedPayment === 1 && (
          <Link
            component="button"
            variant="body2"
            onClick={() => setOpenSearchModal(true)}
            className={classes1.searchRoutingText}
          >
            {t("componentData.addPayment.headings.searchBank")}
            <img style={{ marginLeft: "4px" }} src={SearchIcon} alt="search" />
          </Link>
        )}
      </Grid>
      <CustomDialogNew
        showBtn={false}
        showCloseIcon={true}
        fullWidth={true}
        open={openSearchModal}
        onClose={handleDialogClose}
        dialogClassName={classes1.routingCodeDialog}
      >
        <RoutingCodeSearch
          onClose={handleDialogClose}
          onSelectBank={handleBankDetails}
        />
      </CustomDialogNew>
      <Grid xs={6} item className={classes1.bankNameContainer}>
        <TextField
          className={classes1.bankName}
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.bank")}
          value={achInputs.bankName || ""}
          disabled={true}
          name="bankName"
          onChange={handleAchChange}
          error={Boolean(validationState["bankName"])}
          helperText={(validationState && validationState["bankName"]) || ""}
        />
      </Grid>
      <Grid xs={6} item>
        <TextField
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.accountType")}
          disabled={fieldsDisabled}
          value={achInputs.accountType}
          name="accountType"
          onChange={handleAchChange}
          select
          error={Boolean(validationState["accountType"])}
          helperText={(validationState && validationState["accountType"]) || ""}
        >
          <MenuItem value={0}>
            <em>{t("componentData.addPayment.headings.select")}</em>
          </MenuItem>
          {types ? (
            types?.rows?.map((item) => {
              return (
                <MenuItem key={item.accountTypeId} value={item.accountTypeId}>
                  {item.description}
                </MenuItem>
              );
            })
          ) : (
            <Box
              width="100px"
              display="flex"
              mt={1.875}
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress color="primary" />
            </Box>
          )}
        </TextField>
      </Grid>
      <Grid xs={6} item className={classes.gridMarginTop}>
        <DatePicker
          customInput={
            <TextField
              variant="outlined"
              required
              className="full-width"
              color="primary"
              name="valueDate"
              label={t("componentData.addPayment.labels.date")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <EventIcon style={{ cursor: "pointer" }} />
                  </InputAdornment>
                ),
              }}
              error={Boolean(validationState["valueDate"])}
              helperText={
                (validationState && validationState["valueDate"]) || ""
              }
            />
          }
          selected={achDate}
          minDate={moment().toDate()}
          onChange={(achDate) => handleAchDate(achDate)}
          dateFormat="MM/dd/yyyy"
          locale={i18n.language}
        />
      </Grid>
    </Grid>
  );
}

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.payment }))(
    withStyles(styles)(USBankACH)
  )
);
