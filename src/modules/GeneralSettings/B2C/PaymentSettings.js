import React, { Component } from "react";
import {
  Box,
  FormControlLabel,
  Grid,
  Checkbox,
  RadioGroup,
  Radio,
  TextField,
  Button,
  CircularProgress,
  FormHelperText,
  FormGroup,
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  paymentMethodFileFormatIds,
  paymentMethods,
} from "~/config/paymentMethods";
import CurrencyInput from "~/components/CurrencyInput";

class PaymentSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      isSettingGeneralEditEnabled,
      disableEdit,
      onClearAllClick,
      onSelectClick,
      permissionList,
      onPermissionChange,
      defaultPaymentMethod,
	    preEnrollmentPaymentHistory,
      defaultPaymentMethodSelected,
      defaultPaymentMethodB2BSelected,
      alternatePaymentOption,
      alternatePaymentOptionACH,
      alternatePaymentOptionCHK,
      alternatePaymentChange,
      handleFieldChange,
      ddDays,
      handleChange,
      thZelle,
      thRtp,
      thDepositToDebit,
      thCorpRewardCard,
      minthCorpRewardCard,
      thMaster,
      thPaypal,
      payeePaymentAuthTh,
      onPayeeAuthChange,
      paymentAuthCDM,
      paymentAuthNonCDM,
      paymentAmountTh,
      paymentAuthSMS,
      paymentAuthEmail,
      paymentAuthExpDays,
      cardExpiryAlertDays,
      paymentAuthExpiry,
      onMFAChanged,
      isMFARequired,
      mfaAttemptsAllowed,
      isMFARequiredLogin,
      isMFARequiredRegistration,
      isMFARequiredPasswordReset,
      isMFARequiredPaymentPreference,
      isMFAForgotPassword,
      isMFAForgotUsername,
      isLoading,
      savingData,
      savePermissions,
      handleDefaultCheckboxChange,
      validation,
      theme,
      PreferredPaymentMethod,
      PreferredPrepaidPaymentMethod,
      handlePreferredCheckboxChange,
      preferredPaymentMethodCheked,
      preferredPaymentMethodChange,
      selectedPreferredPaymentMethod,
      ACHPreferredPayment,
      CHKPreferredPayment,
      PayPalPreferredPayment,
      PushToCardPreferredPayment,
      ZellePreferredPayment,
      USbankPPDPreferredPayment,
      USbankDDCPreferredPayment,
      USbankCHKPreferredPayment,
      USBankZellePreferredPayment,
      USbankACHPreferredPayment,
      USbankRTPPreferredPayment,
      payerPaymentAuthTh,
      paymentAmountThPayer,
      onPayerAuthChange,
      noOfAttemptsAllowedToResendOtp,
      otpExpiryTime,
      isAVS,
      isAVSAccountStatus,
      isAVSAccountStatusOwnership,
      onAVSChange,
      handleChangeAccountStatus,
    } = this.props;
    const { t } = this.props;
    let isACHEnabled = false;
    let isCHKEnabled = false;
    let isZelleEnabled = false;
    let isPushToCardEnabled = false;
    let isPayPalEnabled = false;
    let isUSbankRtpEnabled = false;
    let isUSbankPPDEnabled = false;
    let isUSbankFocusEnabled = false;
    let isUSbankReliaEnabled = false;
    let isUSbankPlasticEnabled = false;
    let isUSbankDigitalEnabled = false;
    let isUSbankDDCEnabled = false;
    let isUSbankZelleEnabled = false;
    let isUSbankACHEnabled = false;
    let isUSbankCHKEnabled = false;

    if (Boolean(PreferredPaymentMethod) && PreferredPaymentMethod.length > 0) {
      const { isPayeeChoicePortal } = this.props.user;
      // PreferredPaymentMethod.map((e) => {
        if(!isPayeeChoicePortal) {
          PreferredPaymentMethod.map((e) => {
          if (e.paymentCode === paymentMethods.ACH) {
            isACHEnabled = true;
          } else if (e.paymentCode === paymentMethods.CHK) {
            isCHKEnabled = true;
          } else if (e.paymentCode === paymentMethods.Zelle) {
            isZelleEnabled = true;
          } else if (e.paymentCode === paymentMethods.PushToCard) {
            isPushToCardEnabled = true;
          } else if (e.paymentCode === paymentMethods.PayPal) {
            isPayPalEnabled = true;
          }
        })
        } 
         else {
          PreferredPrepaidPaymentMethod.map((e) => {
          if (e.paymentCode === paymentMethods.USBankRTP) {
            isUSbankRtpEnabled = true;
          } 
         
          else if (e.paymentCode === paymentMethods.USBankPrepaidCard) {
            isUSbankPPDEnabled = true;
          }  else if (e.paymentCode === paymentMethods.PrepaidFocusNonPayroll) {
            isUSbankFocusEnabled = true;
          }  else if (e.paymentCode === paymentMethods.PrepaidReliaCard) {
            isUSbankReliaEnabled = true;
          }  else if (e.paymentCode === paymentMethods.PlasticCorporateCard) {
            isUSbankPlasticEnabled = true;
          }  else if (e.paymentCode === paymentMethods.DigitalCorporateCard) {
            isUSbankDigitalEnabled = true;
          }
          
          
          else if (e.paymentCode === paymentMethods.USBankDepositToDebitcard) {
            isUSbankDDCEnabled = true;
          } else if (e.paymentCode === paymentMethods.USBankZelle) {
            isUSbankZelleEnabled = true;
          } else if (e.paymentCode === paymentMethods.USBankACH) {
            isUSbankACHEnabled = true;
          } else if (e.paymentCode === paymentMethods.USBankCHK) {
            isUSbankCHKEnabled = true;
          }
        });
        }
    
    }
    
    const willAlternetPaymentBoxShow = isACHEnabled || isCHKEnabled || isUSbankCHKEnabled || isUSbankACHEnabled;
    const willThresholdSettingsBoxShow =
      isZelleEnabled || isPayPalEnabled || isPushToCardEnabled || isUSbankRtpEnabled || isUSbankPPDEnabled || isUSbankDDCEnabled||isUSbankFocusEnabled||isUSbankReliaEnabled||isUSbankDigitalEnabled||isUSbankPlasticEnabled;
    const willDefaultPaymentBoxShow = isACHEnabled || isCHKEnabled || isUSbankPPDEnabled || isUSbankCHKEnabled || isUSbankACHEnabled||isUSbankFocusEnabled||isUSbankReliaEnabled||isUSbankDigitalEnabled||isUSbankPlasticEnabled;

    const { isPayeeChoicePortal } = this.props.user;

    return (
      <Box mx={3} mb={2}>
        <Grid container>
          <Grid item lg={6} md={5} xs={12}>
            <h3 className="firstHeading">
              {t("componentData.generalSettings.FileProcessing")}
            </h3>
          </Grid>
          {isSettingGeneralEditEnabled && (
            <Grid
              item
              lg={6}
              md={7}
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                variant="outlined"
                className="displayInlineBLock floatLeft horizontalMargin button"
                style={{
                  textTransform: "uppercase",
                }}
                disabled={disableEdit}
                onClick={onClearAllClick}
              >
                {t("componentData.generalSettings.ClearAll")}
              </Button>
              <Button
                className="displayInlineBLock horizontalMargin button"
                style={{
                  textTransform: "uppercase",
                  background: theme.palette.button.primary,
                  color: theme.palette.secondary.contrastText,
                  marginLeft: "30px",
                }}
                disabled={disableEdit}
                onClick={onSelectClick}
              >
                {t("componentData.generalSettings.SelectAll")}
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid container spacing={3}>
          {permissionList &&
            permissionList
              .filter(
                (p) =>
                  p.id !== 32768 && p.displayOnUi === 1 && p.categoryId === 1
              )
              .map((permission) => (
                <Grid item xs={6}>
                  {permission &&
                    permission.showCheckBox === false ? undefined : (
                    <Box my={1}>
                      {permission && permission.displayOnUi === 1 ? (
                        <Grid>
                          <FormControlLabel
                            control={
                              <Checkbox
                                key={`${permission.id}_check`}
                                checked={permission["isChecked"] || false}
                                onChange={(event) =>
                                  onPermissionChange(event, permission)
                                }
                                name="checkedB"
                                color="primary"
                                disabled={disableEdit}
                              />
                            }
                            label={permission.nameOnUiForB2c}
                            className="textHeading"
                          />
                          <Box className={"description"} mx={4} mb={2}>
                            {permission.descriptionOnUiForB2c}
                          </Box>
                        </Grid>
                      ) : null}
                    </Box>
                  )}
                </Grid>
              ))}
        </Grid>
        <div className="mainConatiner"></div>
        <Grid container>
          <Grid item xs={12}>
            <h3 className="settingHeading">
              {t("componentData.generalSettings.PaymentSettings")}
            </h3>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <>
            {permissionList &&
              permissionList
                .filter(
                  (p) =>
                    p.id !== 32768 && p.displayOnUi === 1 && p.categoryId === 2
                )
                .map((permission) => (
                  <>
                    {permission &&
                      permission.showCheckBox === false ? undefined : (
                      <Box>
                        {
                          isPayeeChoicePortal ? 
                          <>
                          {permission && permission.id !== 2097152 && permission.displayOnUi === 1 ? (
                          <Grid>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  key={`${permission.id}_check`}
                                  checked={permission["isChecked"] || false}
                                  onChange={(event) =>
                                    onPermissionChange(event, permission)
                                  }
                                  name="checkedB"
                                  color="primary"
                                  disabled={disableEdit}
                                />
                              }
                              label={permission.nameOnUiForB2c}
                              className="textHeading"
                            />
                            <Box className={"description"} mx={4} mb={2}>
                              {permission.descriptionOnUiForB2c}
                            </Box>
                          </Grid>
                        ) : null}
                          </> 
                          : 
                          <>
                          {permission && permission.displayOnUi === 1 ? (
                          <Grid>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  key={`${permission.id}_check`}
                                  checked={permission["isChecked"] || false}
                                  onChange={(event) =>
                                    onPermissionChange(event, permission)
                                  }
                                  name="checkedB"
                                  color="primary"
                                  disabled={disableEdit}
                                />
                              }
                              label={permission.nameOnUiForB2c}
                              className="textHeading"
                            />
                            <Box className={"description"} mx={4} mb={2}>
                              {permission.descriptionOnUiForB2c}
                            </Box>
                          </Grid>
                        ) : null}
                          </>
                        }
                      </Box>
                    )}
                  </>
                ))}
                </>
                <Box>
                {Boolean(willDefaultPaymentBoxShow) && (
            <>
              <Grid item xs={12}>
                <Box my={1}>
                  <Grid>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={defaultPaymentMethod}
                          onChange={handleDefaultCheckboxChange}
                          disabled={disableEdit}
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label={t(
                        "componentData.generalSettings.DefaultPaymentMethod"
                      )}
                    // className="boldText"
                    />
                    <Box ml={2.5}></Box>
                    <Box className={"description"} mx={4} ml={4}>
                      {t("componentData.generalSettings.msg19")}
                    </Box>
                  </Grid>
                </Box>

                {defaultPaymentMethod ? (
                  <Box my={1} ml={4}>
                    <Grid>
                    
                        {!isPayeeChoicePortal ? <>
                          <RadioGroup
                        aria-label={t(
                          "componentData.generalSettings.DefaultPaymentMethod"
                        )}
                        name="defaultPaymentMethodSelected"
                        value={defaultPaymentMethodSelected}
                        onChange={this.props.onDefaultMethodChange}
                        className={"radioBtnClass"}
                        style={{ marginRight: "2rem" }}
                      >
                          {Boolean(isACHEnabled) &&  (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.ACH}`}
                              control={<Radio color="primary" />}
                              label={t(
                                "componentData.generalSettings.BankAccount"
                              )}
                              disabled={disableEdit}
                            />
                          )}
  
                          {(Boolean(isCHKEnabled)) && (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.CHK}`}
                              control={<Radio color="primary" />}
                              label={t("componentData.generalSettings.Check")}
                              disabled={disableEdit}
                            />
                          )}
                          </RadioGroup>
                        </> : <>
                 
                  
                    
                  <Box   ml={0.5}>
                    {t("componentData.generalSettings.B2B")}
                    </Box>
                  
                  <Grid>
                  <RadioGroup
                        aria-label={t(
                          "componentData.generalSettings.DefaultPaymentMethod"
                        )}
                        name="defaultPaymentMethodB2BSelected"
                        value={defaultPaymentMethodB2BSelected}
                        onChange={this.props.onDefaultMethodB2BChange}
                        className={"radioBtnClass"}
                        style={{ marginRight: "2rem" }}
                      >
                     
                          {Boolean(isUSbankACHEnabled) &&  (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.USBankACH}`}
                              control={<Radio color="primary" />}
                              label={t(
                                "componentData.generalSettings.BankAccount"
                              )}
                              disabled={disableEdit}
                            />
                          )}
  
                          {Boolean(isUSbankCHKEnabled) && (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.USBankCHK}`}
                              control={<Radio color="primary" />}
                              label={t("componentData.generalSettings.Check")}
                              disabled={disableEdit}
                            />
                          )}
                             
                            <FormControlLabel
                              value={"0"}
                              control={<Radio color="primary" />}
                              label={t(
                                "componentData.generalSettings.none"
                              )}
                            />
                          
  
                          </RadioGroup>
                           </Grid>
  
  <Grid>
                    
                    <Box   ml={0.5}>
                    {t("componentData.generalSettings.B2C")}
                    </Box>
                  </Grid>
                  <Grid>
                  <RadioGroup
                        aria-label={t(
                          "componentData.generalSettings.DefaultPaymentMethod"
                        )}
                        name="defaultPaymentMethodSelected"
                        value={defaultPaymentMethodSelected}
                        onChange={this.props.onDefaultMethodChange}
                        className={"radioBtnClass"}
                        style={{ marginRight: "2rem" }}
                      >
                          {Boolean(isUSbankACHEnabled) &&  (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.USBankACH}`}
                              control={<Radio color="primary" />}
                              label={t(
                                "componentData.generalSettings.BankAccount"
                              )}
                              disabled={disableEdit}
                            />
                          )}
  
                          {Boolean(isUSbankCHKEnabled) && (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.USBankCHK}`}
                              control={<Radio color="primary" />}
                              label={t("componentData.generalSettings.Check")}
                              disabled={disableEdit}
                            />
                          )}
  
  
                          {Boolean(isUSbankPPDEnabled) && (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.USBankPrepaidCard}`}
                              control={<Radio color="primary" />}
                              label={t("componentData.generalSettings.PrepaidCard")}
                              disabled={disableEdit}
                            />
                          )}
                           {Boolean(isUSbankFocusEnabled) && (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.PrepaidFocusNonPayroll}`}
                              control={<Radio color="primary" />}
                              label={t("componentData.generalSettings.FocusNonPayroll")}
                              disabled={disableEdit}
                            />
                          )}
                           {Boolean(isUSbankReliaEnabled) && (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.PrepaidReliaCard}`}
                              control={<Radio color="primary" />}
                              label={t("componentData.generalSettings.ReliaCard")}
                              disabled={disableEdit}
                            />
                          )}
                           {Boolean(isUSbankPlasticEnabled) && (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.PlasticCorporateCard}`}
                              control={<Radio color="primary" />}
                              label={t("componentData.generalSettings.PlasticCard")}
                              disabled={disableEdit}
                            />
                          )}
                           {Boolean(isUSbankDigitalEnabled) && (
                            <FormControlLabel
                              value={`${paymentMethodFileFormatIds.DigitalCorporateCard}`}
                              control={<Radio color="primary" />}
                              label={t("componentData.generalSettings.DigitalCard")}
                              disabled={disableEdit}
                            />
                          )}
                              
                            <FormControlLabel
                              value={"0"}
                              control={<Radio color="primary" />}
                              label={t(
                                "componentData.generalSettings.none"
                              )}
                            />
                          
                          </RadioGroup>
                           </Grid>
                        </>
                        }

                        {/* {Boolean(isZelleEnabled) && (
                          <FormControlLabel
                            value={`${paymentMethodFileFormatIds.Zelle}`}
                            control={<Radio color="primary" />}
                            label={t('componentData.generalSettings.Zelle')}
                          />
                        )} */}

                      <FormHelperText className="errorText">
                        {validation.defaultPaymentMethod}
                      </FormHelperText>
                    </Grid>
                  </Box>
                ) : null}
              </Grid>
            </>
          )}
                </Box>
                {!isPayeeChoicePortal && 
                <Box my={1}>
              <Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={preEnrollmentPaymentHistory}
                      onChange={handleChange}
                      disabled={disableEdit}
                      name="preEnrollmentPaymentHistory"
                      color="primary"
                    />
                  }
                  label={t(
                    "componentData.generalSettings.PreEnrollmentPaymentHistory"
                  )}
                />
                <Box ml={2.5}></Box>
                <Box className={"description"} mx={4} ml={4}>
                  {t("componentData.generalSettings.msg38")}
                </Box>
              </Grid>
            </Box>}
          </Grid>

          <Grid item xs={6}>
            {!isPayeeChoicePortal && 
            <Box>
            {Boolean(willAlternetPaymentBoxShow) && (
              <>
                <Box my={1}>
                  <Grid>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={alternatePaymentOption}
                          onChange={alternatePaymentChange}
                          disabled={disableEdit}
                          name="checkedB"
                          color="primary"
                        />
                      }
                      label={t(
                        "componentData.generalSettings.AlternatePaymentOption"
                      )}
                    />
                  </Grid>
                  <Box className={"description"} mx={4} ml={4}>
                    {t("componentData.generalSettings.msg30")}
                  </Box>
                </Box>

                {alternatePaymentOption ? (
                  <Box my={1} ml={4}>
                    {Boolean(isACHEnabled) || Boolean(isUSbankACHEnabled) && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={alternatePaymentOptionACH}
                            onChange={handleChange}
                            disabled={disableEdit}
                            name="alternatePaymentOptionACH"
                            color="primary"
                          />
                        }
                        label={isPayeeChoicePortal ? t("componentData.generalSettings.AlternatePaymentOptionUSbankACH") : t(
                          "componentData.generalSettings.AlternatePaymentOptionACH"
                        )}
                        className={isPayeeChoicePortal ? "checkboxBtnLabel" : "boldText checkboxBtnLabel"}
                      />
                    )}

                    {Boolean(isCHKEnabled) || Boolean(isUSbankCHKEnabled) && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={alternatePaymentOptionCHK}
                            onChange={handleChange}
                            disabled={disableEdit}
                            name="alternatePaymentOptionCHK"
                            color="primary"
                          />
                        }
                        label={t(
                          "componentData.generalSettings.AlternatePaymentOptionCHK"
                        )}
                        className={isPayeeChoicePortal ? "checkboxBtnLabel" : "boldText checkboxBtnLabel"}
                      />
                    )}
                  </Box>
                ) : null}
                <FormHelperText className="errorText">
                  {validation.alternatePaymentOption}
                </FormHelperText>
              </>
            )}
            </Box>
            }
            {!isPayeeChoicePortal && 
            <Box my={1} ml={4}>
            <Box className={"textHeading"} my={1} mt={2}>
              {t("componentData.generalSettings.ddDays")}
            </Box>
            <Box className={"description"} my={1}>
              {t("componentData.generalSettings.msg15")}
            </Box>
            <Box width="60%">
              <TextField
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                name="ddDays"
                label={t("componentData.generalSettings.noOfDays")}
                variant="outlined"
                value={ddDays || ""}
                onChange={handleFieldChange}
                inputProps={{ maxLength: 4 }}
                error={validation.ddDays && validation.ddDays.length > 0}
                helperText={validation.ddDays || ""}
                disabled={disableEdit}
              />
            </Box>
          </Box>
            }

            <Box>
            {PreferredPaymentMethod.length > 0 ? (
            <Grid item xs={12}>
              <Box my={1}>
                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={preferredPaymentMethodCheked}
                        onChange={handlePreferredCheckboxChange}
                        disabled={disableEdit}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={t(
                      "componentData.generalSettings.PreferredPaymentMethod"
                    )}
                  />
                  <Box ml={2.5}></Box>
                  <Box className={"description"} mx={4} ml={4}>
                    {t("componentData.generalSettings.selectionTxt")}
                  </Box>
                </Grid>
              </Box>

              {Boolean(preferredPaymentMethodCheked) ? (
                <Box my={1} ml={4}>
                  <Grid>
                    <FormGroup
                      aria-label="Preferred Payment Method"
                      name="selectedPreferredPaymentMethod"
                      value={selectedPreferredPaymentMethod}
                      onChange={preferredPaymentMethodChange}
                      className={"radioBtnClass"}
                    >
                      {PreferredPaymentMethod.map((e) => {
                        if(!isPayeeChoicePortal) {
                          return (
                            <FormControlLabel
                              value={e.fileFormatId}
                              control={<Checkbox color="primary" />}
                              label={e.b2cDescription}
                              name={e.b2cDescription}
                              disabled={disableEdit}
                              checked={
                                e.fileFormatId === paymentMethodFileFormatIds.ACH
                                  ? ACHPreferredPayment
                                  : e.fileFormatId ===
                                  paymentMethodFileFormatIds.CHK
                                  ? CHKPreferredPayment
                                  : e.fileFormatId ===
                                  paymentMethodFileFormatIds.PayPal
                                  ? PayPalPreferredPayment
                                  : e.fileFormatId ===
                                  paymentMethodFileFormatIds.PushToCard
                                  ? PushToCardPreferredPayment
                                  : ZellePreferredPayment
                              }
                            />
                          );
                        } else {
                          return (
                            <FormControlLabel
                              value={e.fileFormatId}
                              control={<Checkbox color="primary" />}
                              label={e.b2cDescription}
                              name={e.b2cDescription}
                              disabled={disableEdit}
                              checked={
                                e.fileFormatId === paymentMethodFileFormatIds.USBankACH
                                  ? USbankACHPreferredPayment
                                  : e.fileFormatId ===
                                  paymentMethodFileFormatIds.USBankCHK
                                  ? USbankCHKPreferredPayment
                                  : e.fileFormatId ===
                                  paymentMethodFileFormatIds.USBankDepositToDebitcard
                                  ? USbankDDCPreferredPayment
                                  : e.fileFormatId ===
                                  paymentMethodFileFormatIds.USBankRTP
                                  ? USbankRTPPreferredPayment
                                  : e.fileFormatId ===
                                  paymentMethodFileFormatIds.USBankPrepaidCard
                                  ? USbankPPDPreferredPayment
                                  : USBankZellePreferredPayment
                              }
                            />
                          );
                        }
                      })}
                    </FormGroup>

                    {selectedPreferredPaymentMethod.length === 0 &&
                      validation.willPreferredErrShow ? (
                      <FormHelperText className="errorText">
                        {t("componentData.generalSettings.errTxt")}
                      </FormHelperText>
                    ) : null}
                  </Grid>
                </Box>
              ) : null}
              {isPayeeChoicePortal && 
              <Box my={1} ml={4} mt={2}>
              <Grid>
                <Box className={"textHeading"} my={1}>
                  {t("componentData.generalSettings.cardExpiryAlert")}
                </Box>
                <Box width="60%" mt={2}>
                  <TextField
                    fullWidth={true}
                    disabled={disableEdit}
                    color="secondary"
                    autoComplete="off"
                    name="cardExpiryAlertDays"
                    label={t("componentData.generalSettings.noOfDays")}
                    variant="outlined"
                    value={cardExpiryAlertDays || ""}
                    onChange={handleFieldChange}
                    inputProps={{ maxLength: 4 }}
                    error={
                      validation.cardExpiryAlertDays &&
                      validation.cardExpiryAlertDays.length > 0
                    }
                    helperText={validation.cardExpiryAlertDays || ""}
                  />
                </Box>
              </Grid>
            </Box>
            }
            </Grid>
          ) : null}
            </Box>

          </Grid>
        </Grid>

        {isPayeeChoicePortal && 
        <>
        <div className="mainConatiner"></div>
        <Grid container>
          <Grid item xs={12}>
            <h3 className="settingHeading">
              {t("componentData.generalSettings.AccountValidationSettings")}
            </h3>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box my={1}>
              <Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAVS}
                      onChange={onAVSChange}
                      disabled={disableEdit}
                      name="isAVS"
                      color="primary"
                    />
                  }
                  label={t("componentData.generalSettings.isAVS")}
                  className="textHeading"
                />
              </Grid>
              <Box className={"description"} mx={4} ml={4}>
                {t("componentData.generalSettings.msg48")}
              </Box>
            </Box>

            {isAVS ? (
              <Box my={1} ml={4}>
                <RadioGroup
                  aria-label={t(
                  "componentData.generalSettings.isAVS"
                  )}
                  column
                  name="isAVS"
                  value={isAVS}
                  onChange={handleChangeAccountStatus}
                  >
                <FormControlLabel checked={isAVSAccountStatus} value={isAVSAccountStatus} name="isAVSAccountStatus" control={<Radio />} label={t("componentData.generalSettings.isAVSAccountStatus")} disabled={disableEdit}/>
                  <Box className={"description"} mx={4} ml={4}>
                    {t("componentData.generalSettings.msg49")}
                  </Box>
                <FormControlLabel checked={isAVSAccountStatusOwnership} value={isAVSAccountStatusOwnership} name="isAVSAccountStatusOwnership" control={<Radio />} label={t("componentData.generalSettings.isAVSAccountStatusOwnership")} disabled={disableEdit}/>
                <Box className={"description"} mx={4} ml={4}>
                    {t("componentData.generalSettings.msg50")}
                  </Box>
              </RadioGroup>
                
              </Box>
            ) : null}
          </Grid>
        </Grid>
        </>
        }
        
        {Boolean(willThresholdSettingsBoxShow) && (
          <>
            <div className="mainConatiner"></div>
            <Grid container>
              <Grid item xs={12}>
                <h3 className="settingHeading">
                  {t("componentData.generalSettings.ThresholdSettings")}
                </h3>
              </Grid>
              <Grid container spacing={3}></Grid>
              <Grid container item xs={11} justify="flex-start">
                <Grid item xs={12}>
                  <Grid xs={12}>
                    <Box className={"description"} my={1} ml={3}>
                      {t("componentData.generalSettings.thresholdMessage")}
                    </Box>
                  </Grid>
                </Grid>

                {Boolean(isZelleEnabled) && (
                  <Grid item xs={5}>
                    <Box className={"textHeading"} my={1} ml={3}>
                      {t("componentData.generalSettings.thZelle")}
                    </Box>
                    <Box className={"description"} ml={3} my={1}>
                      {/*t("componentData.generalSettings.msg10")*/}
                    </Box>
                    <Box width="60%" ml={3} my={1}>
                      {/* <TextField
                        fullWidth={true}
                        color="secondary"
                        autoComplete="off"
                        name="thZelle"
                        label={t('componentData.generalSettings.amount')}
                        variant="outlined"
                        value={thZelle || ''}
                        onChange={handleFieldChange}
                        inputProps={{ maxLength: 11 }}
                        error={validation.thZelle || ''}
                        helperText={validation.thZelle || ''}
                        disabled={disableEdit}
                      /> */}
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        value={thZelle || ""}
                        name="thZelle"
                        label={t("componentData.generalSettings.amount")}
                        onChange={handleFieldChange}
                        error={validation.thZelle || ""}
                        helperText={validation.thZelle || ""}
                        inputProps={{ maxLength: 5 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
                )}

                {Boolean(isPushToCardEnabled) && (
                  <Grid item xs={5}>
                    <Box className={"textHeading"} ml={3} my={1}>
                      {t("componentData.generalSettings.thMaster")}
                    </Box>
                    <Box className={"description"} ml={3} my={1}>
                      {/*t("componentData.generalSettings.msg11")*/}
                    </Box>
                    <Box width="60%" ml={3} my={1}>
                      {/* <TextField
                        fullWidth={true}
                        color="secondary"
                        autoComplete="off"
                        name="thMaster"
                        label={t('componentData.generalSettings.amount')}
                        variant="outlined"
                        value={thMaster || ''}
                        onChange={handleFieldChange}
                        inputProps={{ maxLength: 11 }}
                        error={validation.thMaster || ''}
                        helperText={validation.thMaster || ''}
                        disabled={disableEdit}
                      /> */}
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        value={thMaster || ""}
                        name="thMaster"
                        label={t("componentData.generalSettings.amount")}
                        onChange={handleFieldChange}
                        error={validation.thMaster || ""}
                        helperText={validation.thMaster || ""}
                        inputProps={{ maxLength: 5 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Grid container item xs={11} justify="flex-start">
                {Boolean(isPayPalEnabled) && (
                  <Grid item xs={5}>
                    <Box className={"textHeading"} my={1} ml={3}>
                      {t("componentData.generalSettings.thPaypal")}
                    </Box>
                    <Box className={"description"} ml={3} my={1}>
                      {/*t("componentData.generalSettings.msg12")*/}
                    </Box>
                    <Box width="60%" ml={3} my={1}>
                      {/* <TextField
                        fullWidth={true}
                        color="secondary"
                        autoComplete="off"
                        name="thPaypal"
                        label={t('componentData.generalSettings.amount')}
                        variant="outlined"
                        value={thPaypal || ''}
                        onChange={handleFieldChange}
                        inputProps={{ maxLength: 11 }}
                        error={validation.thPaypal || ''}
                        helperText={validation.thPaypal || ''}
                        disabled={disableEdit}
                      /> */}
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        value={thPaypal || ""}
                        name="thPaypal"
                        label={t("componentData.generalSettings.amount")}
                        onChange={handleFieldChange}
                        error={validation.thPaypal || ""}
                        helperText={validation.thPaypal || ""}
                        inputProps={{ maxLength: 5 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={5}></Grid>
              </Grid>

              {isPayeeChoicePortal && 
              <>
              <Grid container item xs={11} justify="flex-start">
                {/* {Boolean(isBankDepositRtpEnabled) && ( */}
                  <Grid item xs={5}>
                    <Box className={"textHeading"} my={1} ml={3}>
                      {t("componentData.generalSettings.thRtp")}
                    </Box>
                    <Box width="60%" ml={3} my={1}>
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        value={thRtp || ""}
                        name="thRtp"
                        label={t("componentData.generalSettings.amount")}
                        onChange={handleFieldChange}
                        error={validation.thRtp || ""}
                        helperText={validation.thRtp || ""}
                        inputProps={{ maxLength: 5 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
                {/* )} */}
                <Grid item xs={5}>
                    <Box className={"textHeading"} my={1} ml={3}>
                      {t("componentData.generalSettings.depositToDebit")}
                    </Box>
                    <Box width="60%" ml={3} my={1}>
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        value={thDepositToDebit || ""}
                        name="thDepositToDebit"
                        label={t("componentData.generalSettings.amount")}
                        onChange={handleFieldChange}
                        error={validation.thDepositToDebit || ""}
                        helperText={validation.thDepositToDebit || ""}
                        inputProps={{ maxLength: 5 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
              </Grid>

            {!isPayeeChoicePortal?  <Grid container item xs={11} justify="flex-start">
                {/* {Boolean(isPayPalEnabled) && ( */}
                  <Grid item xs={5}>
                    <Box className={"textHeading"} my={1} ml={3}>
                      {t("componentData.generalSettings.corporateRewardCard")}
                    </Box>
                    <Box width="60%" ml={3} my={1}>
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        value={thCorpRewardCard || ""}
                        name="thCorpRewardCard"
                        label={t("componentData.generalSettings.amount")}
                        onChange={handleFieldChange}
                        error={validation.thCorpRewardCard || ""}
                        helperText={validation.thCorpRewardCard || ""}
                        inputProps={{ maxLength: 5 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
                {/* )} */}
                <Grid item xs={5}></Grid>
              </Grid>
              :   <Grid container item xs={11} justify="flex-start">
                {/* {Boolean(isPayPalEnabled) && ( */}
                  <Grid item xs={5}>
                    <Box className={"textHeading"} my={1} ml={3}>
                      {t("componentData.generalSettings.corporateRewardCard")}
                    </Box>
                    <Box width="60%" ml={3} my={1}>
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        value={minthCorpRewardCard || ""}
                        name="minthCorpRewardCard"
                        label={t("componentData.generalSettings.Minamount")}
                        onChange={handleFieldChange}
                        error={validation.minthCorpRewardCard || ""}
                        helperText={validation.minthCorpRewardCard || ""}
                        inputProps={{ maxLength: 5 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
                {/* )} */}
                {/* <Grid item xs={5}></Grid> */}
                <Grid item xs={5}>
                    <Box className={"textHeading"} my={5} ml={3}>
                    
                    </Box>
                    <Box width="60%" ml={3} my={1}>
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        value={thCorpRewardCard || ""}
                        name="thCorpRewardCard"
                        label={t("componentData.generalSettings.Maxamount")}
                        onChange={handleFieldChange}
                        error={validation.thCorpRewardCard || ""}
                        helperText={validation.thCorpRewardCard || ""}
                        inputProps={{ maxLength: 5 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
              </Grid>}

              </>
              }

            </Grid>
          </>
        )}

        <div className="mainConatiner"></div>
        <Grid container>
          <Grid item xs={12}>
            <h3 className="settingHeading">
              {t("componentData.generalSettings.GeneralThresholdSettings")}
            </h3>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box my={1}>
              <Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={payeePaymentAuthTh}
                      onChange={onPayeeAuthChange}
                      disabled={disableEdit}
                      name="payeePaymentAuthTh"
                      color="primary"
                    />
                  }
                  label={t("componentData.generalSettings.PayeePaymentAuthTh")}
                  className="textHeading"
                />
              </Grid>
              <Box className={"description"} mx={4} ml={4}>
                {t("componentData.generalSettings.msg29")}
              </Box>
            </Box>

            {payeePaymentAuthTh ? (
              <Box my={1} ml={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={paymentAuthNonCDM}
                      //checked={false}
                      onChange={handleChange}
                      disabled={disableEdit}
                      //disabled={true}
                      name="paymentAuthNonCDM"
                      color="primary"
                    />
                  }
                  label={isPayeeChoicePortal? t("componentData.generalSettings.PaymentAuthNonForced") : t("componentData.generalSettings.PaymentAuthNonCDM")}
                  className="description"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={paymentAuthCDM}
                      onChange={handleChange}
                      disabled={disableEdit}
                      name="paymentAuthCDM"
                      color="primary"
                    />
                  }
                  label={isPayeeChoicePortal? t("componentData.generalSettings.PaymentAuthBlank") : t("componentData.generalSettings.PaymentAuthCDM")}
                  className="description"
                />
                <Grid style={{ display: "flex" }}>
                  <Box>
                    <FormHelperText className="errorText">
                      {validation.payeePaymentAuthThCDM}
                    </FormHelperText>
                  </Box>
                </Grid>
              </Box>
            ) : null}
            {payeePaymentAuthTh ? (
              <>
                <Box my={1} ml={4}>
                  <Grid>
                    <Box className={"textHeading"} my={1}>
                      {t("componentData.generalSettings.paymentAmountTh")}
                    </Box>
                    <Box className={"description"} my={1}>
                      {t("componentData.generalSettings.msg13")}
                    </Box>
                    <Box width="60%">
                      {/* <TextField
                        required
                        fullWidth={true}
                        color="secondary"
                        autoComplete="off"
                        name="paymentAmountTh"
                        label={t('componentData.generalSettings.amount')}
                        variant="outlined"
                        value={paymentAmountTh || ''}
                        onChange={handleFieldChange}
                        inputProps={{ maxLength: 11 }}
                        error={validation.paymentAmountTh || ''}
                        helperText={validation.paymentAmountTh || ''}
                        disabled={disableEdit}
                      /> */}
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        //value={`${paymentAmountTh}`}
                        value={paymentAmountTh || ''}
                        name="paymentAmountTh"
                        label={t("componentData.generalSettings.amount")}
                        onChange={handleFieldChange}
                        error={Boolean(validation.paymentAmountTh)}
                        helperText={validation.paymentAmountTh}
                        inputProps={{ maxLength: 11 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
                </Box>

                <Box my={1} ml={4}>
                  <Grid style={{ paddingTop: "4px" }}>
                    <Box className={"textHeading"} my={1}>
                      {t("componentData.generalSettings.multiFactorAuth")}
                    </Box>
                    <Box className={"description"} my={1}>
                      {t("componentData.generalSettings.multiFactorAuthDesc")}
                    </Box>
                    <Grid style={{ display: "flex" }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={paymentAuthEmail}
                            onChange={handleChange}
                            disabled={isPayeeChoicePortal ? "disable" : disableEdit}
                            name="paymentAuthEmail"
                            color="primary"
                          />
                        }
                        label={t(
                          "componentData.generalSettings.PaymentAuthEmail"
                        )}
                        className="textHeading"
                      />
                      {!isPayeeChoicePortal && 
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={paymentAuthSMS}
                            onChange={handleChange}
                            disabled={disableEdit}
                            name="paymentAuthSMS"
                            color="primary"
                          />
                        }
                        label={t(
                          "componentData.generalSettings.PaymentAuthSMS"
                        )}
                        className="textHeading"
                      /> 
                    }
                    </Grid>

                    <Grid style={{ display: "flex" }}>
                      <Box>
                        <FormHelperText className="errorText">
                          {validation.payeePaymentAuthTh}
                        </FormHelperText>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                {isPayeeChoicePortal && 
                <>
                <Box my={2} ml={4}>
                  <Grid>
                    <Box className={"textHeading"} my={1}>
                      {t("componentData.generalSettings.attemptsAllowToResendOtp")}
                    </Box>
                    <Box width="65%" mt={2}>
                    <TextField
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      name="noOfAttemptsAllowedToResendOtp"
                      label={t("componentData.generalSettings.attemptsAllowToResendOtp")}
                      variant="outlined"
                      value={noOfAttemptsAllowedToResendOtp || ""}
                      onChange={handleFieldChange}
                      inputProps={{ maxLength: 4 }}
                      error={validation.noOfAttemptsAllowedToResendOtp || ""}
                      helperText={validation.noOfAttemptsAllowedToResendOtp || ""}
                      disabled={disableEdit}
                    />
                  </Box>
                  </Grid>
                </Box>

                <Box my={2} ml={4}>
                  <Grid>
                    <Box className={"textHeading"} my={1}>
                      {t("componentData.generalSettings.otpValidityInMinutes")}
                    </Box>
                    <Box width="65%" mt={2}>
                    <TextField
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      name="otpExpiryTime"
                      label={t("componentData.generalSettings.time")}
                      variant="outlined"
                      value={otpExpiryTime || ""}
                      onChange={handleFieldChange}
                      inputProps={{ maxLength: 8 }}
                      error={validation.otpExpiryTime && validation.otpExpiryTime.length > 0}
                      helperText={validation.otpExpiryTime || ""}
                      disabled={disableEdit}
                    />
                  </Box>
                  </Grid>
                </Box>
                </>
                }
              </>
            ) : null}
          </Grid>
          <Grid item xs={6}>
            <Box my={1} ml={4} mt={2}>
              <Grid>
                <Box className={"textHeading"} my={1}>
                  {t("componentData.generalSettings.paymentAuthExpDays")}
                </Box>
                <Box className={"description"} my={2}>
                  {isPayeeChoicePortal ? t("componentData.generalSettings.msg51") : 
                    t("componentData.generalSettings.msg14")
                  }
                </Box>
                <Box width="60%">
                  <TextField
                    fullWidth={true}
                    disabled={disableEdit}
                    color="secondary"
                    autoComplete="off"
                    name="paymentAuthExpDays"
                    label={t("componentData.generalSettings.noOfDays")}
                    variant="outlined"
                    value={paymentAuthExpDays || ""}
                    onChange={handleFieldChange}
                    inputProps={{ maxLength: 4 }}
                    error={
                      validation.paymentAuthExpDays &&
                      validation.paymentAuthExpDays.length > 0
                    }
                    helperText={validation.paymentAuthExpDays || ""}
                  />
                </Box>
              </Grid>
            </Box>
            <Box my={1}>
              <Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={paymentAuthExpiry}
                      onChange={handleChange}
                      disabled={
                       !isPayeeChoicePortal?( disableEdit || !parseInt(defaultPaymentMethodSelected)):( disableEdit || !parseInt( defaultPaymentMethodB2BSelected+defaultPaymentMethodSelected))
                      }
                      name="paymentAuthExpiry"
                      color="primary"
                    />
                  }
                  label={t("componentData.generalSettings.PaymentAuthExpiry")}
                  className="textHeading"
                />
              </Grid>
              <Box className={"description"} mx={4} ml={4}>
                {t("componentData.generalSettings.msg18")}
              </Box>
            </Box>

            {isPayeeChoicePortal && 
            <>
            <Box my={1}>
              <Grid>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={payerPaymentAuthTh}
                      onChange={onPayerAuthChange}
                      disabled={disableEdit}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label={t("componentData.generalSettings.paymentAuthByPayer")}
                  className="textHeading"
                />
              </Grid>
              <Box className={"description"} mx={4} ml={4}>
                {t("componentData.generalSettings.msg40")}
              </Box>
            </Box>
              {payerPaymentAuthTh ? 
            (
            <>
            <Box my={2} ml={4}>
                  <Grid>
                    <Box className={"textHeading"} my={1}>
                      {t("componentData.generalSettings.paymentAmountThPayer")}
                    </Box>
                    <Box className={"description"} my={1}>
                      {t("componentData.generalSettings.msg47")}
                    </Box>
                    <Box width="60%">
                      <CurrencyInput
                        fullWidth={true}
                        color="secondary"
                        variant="outlined"
                        value={`${paymentAmountThPayer??""}`}
                        name="paymentAmountThPayer"
                        label={t("componentData.generalSettings.amount")}
                        onChange={handleFieldChange}
                        error={Boolean(validation.paymentAmountThPayer)}
                        helperText={validation.paymentAmountThPayer}
                        inputProps={{ maxLength: 11 }}
                        required
                        disabled={disableEdit}
                      />
                    </Box>
                  </Grid>
                </Box>

                
            </>
            ) : null  
            }
              

          </>
          }
          </Grid>
        </Grid>
        {!isPayeeChoicePortal && 
        <>
        <div className="mainConatiner"></div>
        <Grid container spacing={3}>
          <Grid item xs={8} sm={6}>
            <h3 className="settingHeading">
              {t("componentData.generalSettings.MFASettingsTxt")}
            </h3>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Box my={1}>
              <Box my={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isMFARequired}
                      onChange={onMFAChanged}
                      disabled={disableEdit}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label={t("componentData.generalSettings.MFASettingsCheck")}
                  className="textHeading"
                />
              </Box>

              {isMFARequired ? (
                <>
                  <Box ml={4} my={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isMFARequiredLogin}
                          onChange={handleChange}
                          disabled={disableEdit}
                          name="isMFARequiredLogin"
                          color="primary"
                        />
                      }
                      label={t("componentData.generalSettings.LoginTxt")}
                      className="description"
                    />
                  </Box>

                  <Box ml={4} my={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isMFARequiredRegistration}
                          onChange={handleChange}
                          disabled={disableEdit}
                          name="isMFARequiredRegistration"
                          color="primary"
                        />
                      }
                      label={t("componentData.generalSettings.RegistrationTxt")}
                      className="description"
                    />
                  </Box>

                  <Box ml={4} my={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isMFARequiredPasswordReset}
                          onChange={handleChange}
                          disabled={disableEdit}
                          name="isMFARequiredPasswordReset"
                          color="primary"
                        />
                      }
                      label={t(
                        "componentData.generalSettings.ChangePassTxt"
                      )}
                      className="description"
                    />
                  </Box>

                  <Box ml={4} my={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isMFARequiredPaymentPreference}
                          onChange={handleChange}
                          disabled={disableEdit}
                          name="isMFARequiredPaymentPreference"
                          color="primary"
                        />
                      }
                      label={t(
                        "componentData.generalSettings.PaymentPreferenceUpdateTxt"
                      )}
                      className="description"
                    />
                  </Box>
                  <Box ml={4} my={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isMFAForgotPassword}
                          onChange={handleChange}
                          disabled={disableEdit}
                          name="isMFAForgotPassword"
                          color="primary"
                        />
                      }
                      label={t(
                        "componentData.generalSettings.PasswordResetTxt"
                      )}
                      className="description"
                    />
                  </Box>
                  <Box ml={4} my={1}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isMFAForgotUsername}
                          onChange={handleChange}
                          disabled={disableEdit}
                          name="isMFAForgotUsername"
                          color="primary"
                        />
                      }
                      label={t(
                        "componentData.generalSettings.UsernameResetTxt"
                      )}
                      className="description"
                    />
                  </Box>
                  <FormHelperText className="errorText2">
                    {validation.isMFARequired}
                  </FormHelperText>

                  <Box width="65%" ml={4} mt={4}>
                    <TextField
                      fullWidth={true}
                      color="secondary"
                      autoComplete="off"
                      name="mfaAttemptsAllowed"
                      label={t("componentData.generalSettings.NoOfAttempts")}
                      variant="outlined"
                      value={mfaAttemptsAllowed || ""}
                      onChange={handleFieldChange}
                      inputProps={{ maxLength: 4 }}
                      error={validation.mfaAttemptsAllowed || ""}
                      helperText={validation.mfaAttemptsAllowed || ""}
                      disabled={disableEdit}
                    />
                  </Box>
                </>
              ) : null}
            </Box>
          </Grid>
        </Grid>
        </>
        }
        {!isLoading ? (
          <Grid container item xs={12} justify="center">
            <Box mt={1.875}>
              {isSettingGeneralEditEnabled && (
                <div
                  style={{
                    justify: "center",
                    margin: "0 auto",
                    display: "table",
                  }}
                >
                  {savingData ? (
                    <CircularProgress color="primary" />
                  ) : (
                    <Box px={0}>
                      <Button
                        variant="contained"
                        disableElevation
                        style={{
                          display: "inline-block",
                          padding: "6px 10px",
                          margin: "0px",
                        }}
                        color="primary"
                        onClick={savePermissions}
                        disabled={disableEdit}
                      >
                        {t("componentData.generalSettings.Update")}
                      </Button>
                    </Box>
                  )}
                </div>
              )}
            </Box>
          </Grid>
        ) : null}
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
    ...state.payment,
  }))(PaymentSettings)
);
