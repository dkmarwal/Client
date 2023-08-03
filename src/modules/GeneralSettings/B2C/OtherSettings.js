import React, { Component } from "react";
import {
  Box,
  FormControlLabel,
  Grid,
  Checkbox,
  RadioGroup, Radio,
  TextField,
  Button,
  CircularProgress,
  FormHelperText,
  MenuItem
} from "@material-ui/core";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
class OtherSettings extends Component {
  // constructor(props) {
  //   super(props);
  // }
  render() {
    const { isSettingGeneralEditEnabled, disableEdit, onClearAllClick, onSelectClick, onEnrollChange, enrollmentMode, enrollmentModeEmail,
      enrollmentModeSMS, defaultPaymentMethodSelected, defaultPaymentMethodB2BSelected, noOfAttemptsToResendOtpPayeeAuth, otpExpiryTimePayeeAuth,
      campaignExpiryDays, campaignReminderDays, handleFieldChange, isSsnMandatory, expiredCampaigns, oneTimePreference,
      stalePayeeProfileDecision, onProfileChange, payeeProfileDays, emailAlertToProfileDays, stalePayeeProfilePaymentDecision, onProfilePaymentChange,
      onDefaultPaymentChange, stalePayeeProfileDefaultPaymentMethod,
      defaultPaymentMethod, isReportingEnabled, onReportingChanged, defaultPaymentClientReport,
      handleChange, paymentReconciliationReport, enrollmentReport, rejectEmailReport, rejectSMSReport, paymentReconciliationTime,
      reconciliationReport, rejectedDeliveryReport, dailyStatusReport, dailyEnrollmentReport, smsOptOutReport, isCampaignFileApprovalRequired, isPayeeAuthenticationUsingOTP,
      onPayeeAuthUsingOTPChange, isLoading, savingData, savePermissions, validation, theme, /*isReportFixedTime, isReportFrequencyBasis, handleChangeReportTime*/
      transmissionFrequency, handleChangeReportFrequency
     } = this.props;
    const { t } = this.props;
    const { isPayeeChoicePortal } = this.props.user;
    return (<Box mx={3} mb={2}>
      <Grid container>
        <Grid item lg={6} md={5} xs={12}>
          <h3 className="firstHeading">
            {t("componentData.generalSettings.EnrollmentSettings")}
          </h3>
        </Grid>
        {isSettingGeneralEditEnabled && (
          <Grid item
            lg={6}
            md={7}
            xs={12}
            style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                className="displayInlineBLock floatLeft button"
                style={{
                  textTransform: "uppercase",
                }}
                disabled={disableEdit}
                onClick={onClearAllClick}
              >
                {t("componentData.generalSettings.ClearAll")}
              </Button>
              <Button
                className="displayInlineBLock button"
                style={{
                  textTransform: "uppercase",
                  background: theme.palette.button.primary,
                  color: theme.palette.secondary.contrastText,
                  marginLeft: "30px"
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
        <Grid item xs={6}>
          <Box my={1}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enrollmentMode}
                    onChange={onEnrollChange}
                    disabled={disableEdit}
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.EnrollmentMode"
                )}
                className="textHeading"
              />
            </Grid>
            <Box className={"description"} mx={4} ml={4}>
              {t("componentData.generalSettings.msg31")}
            </Box>
          </Box>
          {enrollmentMode ? (<Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enrollmentModeEmail}
                    onChange={handleChange}
                    disabled={isPayeeChoicePortal ? "disable" : disableEdit}
                    name="enrollmentModeEmail"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.EnrollmentModeEmail"
                )}
                className="description"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enrollmentModeSMS}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="enrollmentModeSMS"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.EnrollmentModeSMS"
                )}
                className="description"
              />
              <FormHelperText className="errorText">{validation.enrollmentMode}</FormHelperText>
            </Grid>
          </Box>) : null}
          <Box my={1} ml={4} mt={3}>
            <Grid >
              <Box className={"textHeading"} my={1}>
                {t("componentData.generalSettings.campaignExpiryDays")}
              </Box>
              <Box className={"description"} my={1}>
                {t("componentData.generalSettings.msg6")}
              </Box>
              <Box width="40%">
                <TextField
                  required
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="campaignExpiryDays"
                  label={t("componentData.generalSettings.noOfDays")}
                  variant="outlined"
                  value={campaignExpiryDays || ""}
                  onChange={handleFieldChange}
                  inputProps={{ maxLength: 4 }}
                  error={validation.campaignExpiryDays || ""}
                  helperText={validation.campaignExpiryDays || ""}
                  disabled={disableEdit}
                />
              </Box>
            </Grid>
          </Box>
          <Box my={1} ml={4} mt={3}>
            <Grid >
              <Box className={"textHeading"} my={1}>
                {t("componentData.generalSettings.CampaignReminderDays")}
              </Box>
              <Box className={"description"} my={1}>
                {t("componentData.generalSettings.msg32")}
              </Box>
              <Box width="40%">
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="campaignReminderDays"
                  label={t("componentData.generalSettings.noOfDays")}
                  variant="outlined"
                  value={campaignReminderDays || ""}
                  onChange={handleFieldChange}
                  inputProps={{ maxLength: 4 }}
                  error={validation.campaignReminderDays || ""}
                  helperText={validation.campaignReminderDays || ""}
                  disabled={disableEdit}
                />
              </Box>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={6}>
          {!isPayeeChoicePortal &&
          <Box my={1}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSsnMandatory}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="isSsnMandatory"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.IsSsnMandatory"
                )}
                className="textHeading"
              />
            </Grid>
            <Box className={"description"} mx={4} ml={4}>
              {t("componentData.generalSettings.msg33")}
            </Box>
          </Box>
          }
          <Box my={1}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={expiredCampaigns}
                    onChange={handleChange}
                    disabled={!isPayeeChoicePortal?( disableEdit || !parseInt(defaultPaymentMethodSelected)):( disableEdit || !parseInt( defaultPaymentMethodB2BSelected+defaultPaymentMethodSelected))}
                    name="expiredCampaigns"
                    color="primary"
                  />
                }
                label={!isPayeeChoicePortal? t(
                  "componentData.generalSettings.expiredCampaigns"
                ) : t(
                  "componentData.generalSettings.expiredEnrollment"
                )}
                className="textHeading"
              />
            </Grid>
            <Box className={"description"} mx={4} ml={4}>
              {!isPayeeChoicePortal ? t("componentData.generalSettings.msg17") : t("componentData.generalSettings.msg52")}
            </Box>
          </Box>
          <Box my={1}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={oneTimePreference}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="oneTimePreference"
                    color="primary"
                  />
                }
                label={t("componentData.generalSettings.OneTimePreference")}
                className="textHeading"
              />
            </Grid>
            <Box className={"description"} mx={4} ml={4}>
              {t("componentData.generalSettings.msg26")}
            </Box>
          </Box>
          {!isPayeeChoicePortal &&
          <Box my={1}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isCampaignFileApprovalRequired}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="isCampaignFileApprovalRequired"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.CampaignFileApprovalRequired"
                )}
                className="textHeading"
              />
            </Grid>
            <Box className={"description"} mx={4} ml={4}>
              {t("componentData.generalSettings.msg27")}
            </Box>
          </Box>
          }
          {isPayeeChoicePortal && 
          <Box my={1}>
          <Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPayeeAuthenticationUsingOTP}
                  onChange={onPayeeAuthUsingOTPChange}
                  disabled={disableEdit}
                  name="isPayeeAuthenticationUsingOTP"
                  color="primary"
                />
              }
              label={t(
                "componentData.generalSettings.payeeAuthenticationUsingOtp"
              )}
              className="textHeading"
            />
          </Grid>
          <Box className={"description"} mx={4} ml={4}>
            {t("componentData.generalSettings.msg46")}
          </Box>
          {isPayeeAuthenticationUsingOTP ? (
            <>
            <Box my={1} ml={4} mt={3}>
            <Grid >
              <Box className={"textHeading"} my={1}>
                {t("componentData.generalSettings.noOfAttemptsToResendOtpPayeeAuth")}
              </Box>
              <Box width="40%" mt={2}>
                <TextField
                  required
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="noOfAttemptsToResendOtpPayeeAuth"
                  label={t("componentData.generalSettings.noOfDays")}
                  variant="outlined"
                  value={noOfAttemptsToResendOtpPayeeAuth || ""}
                  onChange={handleFieldChange}
                  inputProps={{ maxLength: 2 }}
                  error={validation.noOfAttemptsToResendOtpPayeeAuth || ""}
                  helperText={validation.noOfAttemptsToResendOtpPayeeAuth || ""}
                  disabled={disableEdit}
                />
              </Box>
            </Grid>
          </Box>
          <Box my={1} ml={4} mt={3}>
            <Grid >
              <Box className={"textHeading"} my={1}>
                {t("componentData.generalSettings.otpExpiryTimePayeeAuth")}
              </Box>
              <Box width="40%" mt={2}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="otpExpiryTimePayeeAuth"
                  label={t("componentData.generalSettings.noOfDays")}
                  variant="outlined"
                  value={otpExpiryTimePayeeAuth || ""}
                  onChange={handleFieldChange}
                  inputProps={{ maxLength: 2 }}
                  error={validation.otpExpiryTimePayeeAuth || ""}
                  helperText={validation.otpExpiryTimePayeeAuth || ""}
                  disabled={disableEdit}
                />
              </Box>
            </Grid>
          </Box>
            </>
          ) :         
          null}
        </Box>
          }
        </Grid>
      </Grid>

      <div className="mainConatiner"></div>
      <Grid container spacing={3}>
        <Grid item xs={8} sm={6}>
          <h3 className="settingHeading">
            {t("componentData.generalSettings.ProfileValidationSettings")}
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
                    checked={stalePayeeProfileDecision}
                    onChange={onProfileChange}
                    disabled={disableEdit}
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.StalePayeeProfileDecision"
                )}
                className="textHeading"
              />
            </Grid>
            <Box className={"description"} mx={4} ml={4}>
              {t("componentData.generalSettings.msg20")}
            </Box>
          </Box>
          {stalePayeeProfileDecision ? (
          <>
          <Box my={1} ml={4}>
            <Grid >
              <Box className={"textHeading"} my={1}>
                {t("componentData.generalSettings.payeeProfileDays")}
              </Box>
              <Box className={"description"} my={1}>
                {t("componentData.generalSettings.msg7")}
              </Box>
              <Box width="60%">
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="payeeProfileDays"
                  label={t("componentData.generalSettings.noOfDays")}
                  variant="outlined"
                  value={payeeProfileDays || ""}
                  onChange={handleFieldChange}
                  inputProps={{ maxLength: 4 }}
                  error={validation.payeeProfileDays || ""}
                  helperText={validation.payeeProfileDays || ""}
                  disabled={disableEdit}
                />
              </Box>
            </Grid>
          </Box>
          {isPayeeChoicePortal && 
            <Box my={1} ml={4}>
            <Grid >
              <Box className={"textHeading"} my={1}>
                {t("componentData.generalSettings.emailAlertToReverify")}
              </Box>
              <Box className={"description"} my={1}>
                {t("componentData.generalSettings.msg45")}
              </Box>
              <Box width="60%">
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="emailAlertToProfileDays"
                  label={t("componentData.generalSettings.noOfDays")}
                  variant="outlined"
                  value={emailAlertToProfileDays || ""}
                  onChange={handleFieldChange}
                  inputProps={{ maxLength: 4 }}
                  error={validation.emailAlertToProfileDays || ""}
                  helperText={validation.emailAlertToProfileDays || ""}
                  disabled={disableEdit}
                />
              </Box>
            </Grid>
          </Box>
            }
          </>
          ) : null}
        </Grid>
        <Grid item xs={6}>
          {stalePayeeProfileDecision ?
            <>
              <Box my={1}>
                <Grid>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={stalePayeeProfilePaymentDecision}
                        onChange={onProfilePaymentChange}
                        disabled={disableEdit}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={t(
                      "componentData.generalSettings.StalePayeeProfilePaymentDecision"
                    )}
                    className="textHeading"
                  />
                  <FormHelperText className="errorText">{validation.stalePayeeProfilePaymentDecision}</FormHelperText>
                </Grid>
                <Box className={"description"} mx={4} ml={4}>
                  {t("componentData.generalSettings.msg28")}
                </Box>
              </Box>

              {stalePayeeProfilePaymentDecision ? (
                <Box my={1} ml={4}>
                  <Grid>
                    <RadioGroup aria-label={t("componentData.generalSettings.DefaultPaymentMethod")}
                      name="stalePayeeProfileDefaultPaymentMethod" value={stalePayeeProfileDefaultPaymentMethod}
                      onChange={onDefaultPaymentChange} className="radioBtnGrp"
                    >
                      <FormControlLabel value={"1"} control={<Radio />}
                        label={t("componentData.generalSettings.DormantProfile")} />
                      {defaultPaymentMethod && parseInt(defaultPaymentMethodSelected) ? (
                        <FormControlLabel value={"2"} control={<Radio />}
                          label={t("componentData.generalSettings.StalePayeeProfileDefaultPaymentMethod")} />
                      ) : null}
                    </RadioGroup>
                  </Grid>
                </Box>) : null}
            </>
            : null}

        </Grid>
      </Grid>
      <div className="mainConatiner"></div>
      <Grid container spacing={3}>
        <Grid item xs={8} sm={6}>
          <h3 className="settingHeading">
            {t("componentData.generalSettings.ReportSettings")}
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
                    checked={isReportingEnabled}
                    onChange={onReportingChanged}
                    disabled={disableEdit}
                    name="checkedB"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.IsPaymentReconciliationReport"
                )}
                className="description"
              />
            </Grid>
          </Box>
          {!isPayeeChoicePortal &&
          <>
          <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={defaultPaymentClientReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="defaultPaymentClientReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.DefaultPaymentClientReport"
                )}
                className="description"
              />
            </Grid>
          </Box>
          <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={paymentReconciliationReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="paymentReconciliationReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.PaymentReconciliationReport"
                )}
                className="description"
              />
            </Grid>
          </Box>
          <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enrollmentReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="enrollmentReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.EnrollmentReport"
                )}
                className="description"
              />
            </Grid>
          </Box>

          <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rejectEmailReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="rejectEmailReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.RejectEmailReport"
                )}
                className="description"
              />
            </Grid>
          </Box>
          <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rejectSMSReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="rejectSMSReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.RejectSMSReport"
                )}
                className="description"
              />
              <FormHelperText className="errorText">{validation.paymentReportRequired}</FormHelperText>
            </Grid>
          </Box>
          </>
          }
          {isPayeeChoicePortal && 
          <>
            {/* <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={reconciliationReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="reconciliationReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.reconciliationReport"
                )}
                className="description"
              />
            </Grid>
          </Box> */}
          <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rejectedDeliveryReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="rejectedDeliveryReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.rejectedDeliveryReport"
                )}
                className="description"
              />
            </Grid>
          </Box>
          <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dailyStatusReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="dailyStatusReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.dailyStatusReport"
                )}
                className="description"
              />
            </Grid>
          </Box>
          <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dailyEnrollmentReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="dailyEnrollmentReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.dailyEnrollmentReport"
                )}
                className="description"
              />
            </Grid>
          </Box>
          <Box my={1} ml={4}>
            <Grid>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={smsOptOutReport}
                    onChange={handleChange}
                    disabled={disableEdit}
                    name="smsOptOutReport"
                    color="primary"
                  />
                }
                label={t(
                  "componentData.generalSettings.smsOptOutReport"
                )}
                className="description"
              />
              <FormHelperText className="errorText">{validation.paymentReportRequired}</FormHelperText>
            </Grid>
          </Box>
          </>
          }
        </Grid>
        <Grid item xs={6}>
          {isReportingEnabled ? (<Box my={1} ml={4}>
            <Grid xs={12}>
              <Box className={"textHeading"} my={1}>
                <h3 className="settingHeading">
                  {t("componentData.generalSettings.paymentReconciliationTime")}
                </h3>
              </Box>
              <Box className={"textHeading"} my={1} mt={1} mb={2}>
              {t("componentData.generalSettings.paymentReportTime")}
              </Box>
              </Grid>
              {/* <Box my={1} mt={1}>
                <RadioGroup
                  aria-label={t(
                  "componentData.generalSettings.isAVS"
                  )}
                  row
                  name="isAVS"
                  //value={isAVS}
                  onChange={handleChangeReportTime}
                  >
                <FormControlLabel checked={isReportFixedTime} value={isReportFixedTime} name="isReportFixedTime" control={<Radio />} label={t("componentData.generalSettings.isReportFixedTime")} disabled={disableEdit}/>
                <FormControlLabel checked={isReportFrequencyBasis} value={isReportFrequencyBasis} name="isReportFrequencyBasis" control={<Radio />} label={t("componentData.generalSettings.isReportFrequencyBasis")} disabled={disableEdit}/>
              </RadioGroup>
                
              </Box> */}
              <Grid container spacing={3}>
                
              <Grid item xs={6}>
              
                <TextField
              label={t("componentData.generalSettings.isReportSelectFrequency")}
              fullWidth={true}
              select
              value={transmissionFrequency || ""}
              autoComplete="off"
              variant="outlined"
              name="transmissionFrequency"
              onChange={(e) => handleChangeReportFrequency(e)}
            >
              <MenuItem value={0}>{t("componentData.generalSettings.isReportSelect")}</MenuItem>
          <MenuItem value={6}>{t("componentData.generalSettings.isReportSelectEverySix")}</MenuItem>
          <MenuItem value={12}>{t("componentData.generalSettings.isReportSelectEveryTwelve")}</MenuItem>
          <MenuItem value={24}>{t("componentData.generalSettings.isReportSelectEveryTwentyFour")}</MenuItem>
            </TextField>
              </Grid>
              <Grid item xs={1} className={"dot"}>
                <p>:</p>
              </Grid>
              <Grid item xs={5}>
              <Box width="60%">
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="paymentReconciliationTime"
                  label={t("componentData.generalSettings.time")}
                  variant="outlined"
                  value={paymentReconciliationTime || ""}
                  onChange={handleFieldChange}
                  inputProps={{ maxLength: 8 }}
                  error={validation.paymentReconciliationTime && validation.paymentReconciliationTime.length > 0}
                  helperText={validation.paymentReconciliationTime || ""}
                  disabled={disableEdit}
                />
              </Box>
              </Grid>
              
              </Grid>
              {/* {isReportFixedTime ? 
              <Box width="30%">
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="paymentReconciliationTime"
                  label={t("componentData.generalSettings.time")}
                  variant="outlined"
                  value={paymentReconciliationTime || ""}
                  onChange={handleFieldChange}
                  inputProps={{ maxLength: 8 }}
                  error={validation.paymentReconciliationTime && validation.paymentReconciliationTime.length > 0}
                  helperText={validation.paymentReconciliationTime || ""}
                  disabled={disableEdit}
                />
              </Box> :
              <Box width="50%">
                <TextField
              label={t("componentData.generalSettings.isReportSelectFrequency")}
              fullWidth={true}
              select
              //value={sourceRoleId || ""}
              autoComplete="off"
              variant="outlined"
              //name="sourceRoleId"
              //onChange={(event) => handleCopyPermission(event)}
            >
              <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Twenty</MenuItem>
          <MenuItem value={21}>Twenty one</MenuItem>
          <MenuItem value={22}>Twenty one and a half</MenuItem>
            </TextField>
            </Box>
              }*/}
            
          </Box>) : null} 
        </Grid>
      </Grid>
      {!isLoading ? (<Grid container item xs={12} justify="center">
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
      </Grid>) : null}
    </Box>)
  }

}

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.clientConfig, ...state.payment }))(
    OtherSettings
  )
);