import React from "react";
import { Grid, Typography, Box, MenuItem } from "@material-ui/core";
import TextField from "~/components/Forms/TextField";
import { CheckboxGroup } from "~/components/Forms";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Phone from "~/components/TextBox/Phone";
import CurrencyInput from "~/components/CurrencyInput";
import { paymentMethodIds } from "~/config/paymentMethods";
import { PayeeType } from "~/config/entityTypes"

const PaymentInformation = (props) => {
  const {
    inputs,
    handleInputChange,
    selectedPaymentMethod,
    handlePaymentMethodChange,
    handleForcedPayment,
    isForcedPayment,
    validationState,
    t,
    hasClickNext,
    handlePayeeTypeChange,
    selectedPayeeType,
    paymentMethods,
    fieldsDisabled,
    consumerPayeeInfo,
    USBankPayment
  } = props;

  const tooltipObj = {
    title: t("componentData.addPayment.tooltip.notes"),
    arrow: true,
    placement: "top-end",
  };

  const payeeIdTooltipObj = {
    title: t("componentData.addPayment.tooltip.payeeId"),
    arrow: true,
    placement: "top-end",
  };

  const isPrepaidCardSelected = [
    paymentMethodIds["PrepaidFocusNonPayroll"],
    paymentMethodIds["PrepaidReliaCard"],
    paymentMethodIds["PlasticCorporateCard"],
    paymentMethodIds["DigitalCorporateCard"],
  ].includes(selectedPaymentMethod);
  return (
    <>
    <Grid xs={12} container spacing={2}>
      {hasClickNext && (
        <Grid item xs={6}>
          <TextField
            tooltipProps={payeeIdTooltipObj}
            variant="outlined"
            name="payeeId"
            label={t("componentData.addPayment.labels.payeeId")}
            value={inputs.payeeId}
            onChange={handleInputChange}
            fullWidth={true}
            required
            error={Boolean(validationState["payeeId"])}
            helperText={(validationState && validationState["payeeId"]) || ""}
            inputProps={{
              maxLength: 35,
            }}
            disabled={true}
            />
        </Grid>
      )}
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          name="payeeType"
          label={t("componentData.addPayment.labels.payeeType")}
          required
          value={selectedPayeeType ?? ""}
          fullWidth={true}
          select
          onChange={handlePayeeTypeChange}
          disabled={consumerPayeeInfo && Object.keys(consumerPayeeInfo) ?.length}
          error={Boolean(validationState["payeeType"])}
          helperText={(validationState && validationState["payeeType"]) || ""}
          >
          {props.Payee ?.payeeTypeList ?.data ?.map((option) => (
            <MenuItem key={option.payeeTypeId} value={option.payeeTypeId}>
              {option.description}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid xs={6} item>
        <TextField
          required={selectedPayeeType !== PayeeType.Business}
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.firstName")}
          value={inputs.firstName || ""}
          name="firstName"
          onChange={handleInputChange}
          error={Boolean(validationState["firstName"])}
          helperText={(validationState && validationState["firstName"]) || ""}
          inputProps={{
            maxLength: 35,
          }}
          />
      </Grid>
      <Grid xs={6} item>
        <TextField
          required={selectedPayeeType !== PayeeType.Business}
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.lastName")}
          value={inputs.lastName || ""}
          name="lastName"
          onChange={handleInputChange}
          error={Boolean(validationState["lastName"])}
          helperText={(validationState && validationState["lastName"]) || ""}
          inputProps={{
            maxLength: 35,
          }}
          />
      </Grid>
      <Grid xs={6} item>
        <TextField
          type="email"
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.emailAddress")}
          value={inputs.email || ""}
          name="email"
          onChange={handleInputChange}
          error={Boolean(validationState["email"])}
          helperText={(validationState && validationState["email"]) || ""}
          inputProps={{
            maxLength: 48,
          }}
          />
      </Grid>
      <Grid xs={6} item style={{ marginTop: "8px" }}>
        <Phone
          error={Boolean(validationState["phoneNumber"])}
          helperText={
            (validationState && validationState["phoneNumber"]) || ""
          }
          isExt={false}
          id="phoneNumber"
          name="phoneNumber"
          value={inputs.phoneNumber ?.phone ?? ""}
          ccode={inputs.countryCode ?.ccode ?? ""}
          prefixCcode="+1"
          fullWidth={true}
          variant="outlined"
          onChange={handleInputChange}
          />
      </Grid>
      {selectedPayeeType === PayeeType.Business && (
        <Grid xs={6} item>
          <TextField
            required
            fullWidth={true}
            variant="outlined"
            label={t("componentData.addPayment.labels.companyName")}
            value={inputs.companyName || ""}
            name="companyName"
            onChange={handleInputChange}
            error={Boolean(validationState["companyName"])}
            helperText={
              (validationState && validationState["companyName"]) || ""
            }
            inputProps={{
              maxLength: 50,
            }}
            />
        </Grid>
      )}
    </Grid>
    <Box pt={4} pb={3}>
      <Typography>
        {t("componentData.addPayment.headings.paymentDetails")}
      </Typography>
    </Box>
    <Grid xs={12} container spacing={2}>
      <Grid xs={6} item>
        <TextField
          required
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.paymentRef")}
          value={inputs.paymentRef || ""}
          name="paymentRef"
          onChange={handleInputChange}
          error={Boolean(validationState["paymentRef"])}
          helperText={
            (validationState && validationState["paymentRef"]) || ""
          }
          inputProps={{
            maxLength: 35,
          }}
          />
      </Grid>
      <Grid xs={6} container item>
        <Grid xs={2} item>
          <TextField
            select
            required
            fullWidth={true}
            label={t("componentData.addPayment.labels.curr")}
            variant="outlined"
            value={inputs.currency || ""}
            onChange={handleInputChange}
            name="currency"
            >
            <MenuItem value="USD">USD</MenuItem>
          </TextField>
        </Grid>
        <Grid xs={10} item>
          <Box ml={2}>
            <CurrencyInput
              hidePrefix={true}
              required
              variant="outlined"
              fullWidth={true}
              label={t("componentData.addPayment.labels.amount")}
              value={inputs.paymentAmount || ""}
              onChange={handleInputChange}
              name="paymentAmount"
              error={
                Boolean(validationState["paymentAmount"]) ||
                Boolean(validationState["paymentAmountThreshold"])
              }
              helperText={
                (validationState && validationState["paymentAmount"]) ||
                (validationState &&
                  validationState["paymentAmountThreshold"]) ||
                ""
              }
              inputProps={{
                maxLength: 21,
              }}
              />
          </Box>
        </Grid>
      </Grid>
      <Grid xs={6} item>
        <TextField
          fullWidth={true}
          variant="outlined"
          label={t("componentData.addPayment.labels.notes")}
          tooltipProps={tooltipObj}
          value={inputs.notes}
          onChange={handleInputChange}
          name="notes"
          inputProps={{
            maxLength: 420,
          }}
          />
      </Grid>
    </Grid>
    <Box pt={4} pb={3}>
      <Typography>
        {t("componentData.addPayment.headings.paymentInfo")}
      </Typography>
    </Box>

    <Typography style={{ marginBottom: "16px" }}>
      {t("componentData.addPayment.headings.forcedPayment")}
    </Typography>
    <Grid xs={6} container spacing={2}>
      <Grid item xs={2} md={3} lg={2}>
        <CheckboxGroup
          options={[
            {
              label: t("componentData.responseFileSett.Yes"),
              value: 1,
            },
            {
              label: t("componentData.responseFileSett.No"),
              value: 0,
            },
          ]}
          onChange={(selectedValue) => {
            handleForcedPayment(selectedValue.value);
          } }
          selectedOption={isForcedPayment}
          />
      </Grid>
    </Grid>
    <Grid contaienr xs={12}>
      <Box mb={3} mt={3}>
        <Typography>
          {t("componentData.addPayment.headings.primaryPayment")}
        </Typography>
      </Box>
    </Grid>
    <Grid container item xs={12} spacing={2}>
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          name="paymentMethodSelection"
          label={t("componentData.addPayment.labels.paymentMethod")}
          value={ selectedPaymentMethod ?? "" }
          fullWidth={true}
          select
          onChange={handlePaymentMethodChange}
          disabled={!isForcedPayment ? true : false}
          error={Boolean(validationState["paymentMethodSelection"])}
          helperText={
            (validationState && validationState["paymentMethodSelection"]) ||
            ""
          }
          >
          <MenuItem value={0}>
            <em>
              {t("componentData.addPayment.headings.selectPaymentMethod")}
            </em>
          </MenuItem>
          {USBankPayment?.preferredTypes?.map((option) => {
            if (!fieldsDisabled && option.paymentTypeId === paymentMethodIds["USBankDepositToDebitcard"]) {
              return null
            }
            if (selectedPayeeType) {
              if (selectedPayeeType === PayeeType.Business && !option.isB2b) {
                return null
              }
              if (selectedPayeeType === PayeeType.Consumer && !option.isB2c) {
                return null
              }
            }
            return (
              <MenuItem
                key={option.paymentTypeId}
                value={option.paymentTypeId}
                >
                {option.b2cDescription}
              </MenuItem>
            );
          })}
        </TextField>
      </Grid>
    </Grid>
    </>
  );
};

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.Payee,
    ...state.USBankPayment,
    ...state.b2cPayments,
  }))(PaymentInformation)
);
