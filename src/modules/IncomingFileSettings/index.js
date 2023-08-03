import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography, MenuItem } from "@material-ui/core";
import { TextField } from "~/components/Forms";
import { withTranslation } from 'react-i18next';
import { styles } from "./styles";

class IncomingFileSettings extends Component {
  render() {
    const { classes, selectedPaymentFileTypes } = this.props;
    return (
      <Box className={classes.contentBackground} p={1.75}>
        {this.renderFileNamingConvention()}
        {selectedPaymentFileTypes.map((selectedPaymentFileType, index) =>
          selectedPaymentFileType.selected
            ? this.renderSettingSection(selectedPaymentFileType.label)
            : ""
        )}
      </Box>
    );
  }

  renderSettingSection = (fileType) => {
    const {
      classes,
      delimiters,
      subElementDelimiters,
      segmentDelimiters,
      incomingDelimeterSetting,
      handleIncomingDelimeterSetting,
      onBlurDelimiterChange,
      validation,
      isOnboarding,
      canEdit,
    } = this.props;
    const { t } = this.props;
    if (fileType === "EDI820" || fileType === "EDI835") {
      return (
        <Box key={`selected-file-type-setting-${fileType.key}`}>
          <Typography variant="h4" className={classes.primaryDark}>
            {t('componentData.incomingFileSettings.DelimiterSettings')}
          </Typography>
          <Box px={0} py={2}>
            <Grid container spacing={4}>
              <Grid item xs={3} sm={3}>
                <TextField
                  select
                  fullWidth={true}
                  disabled={!canEdit}
                  color="secondary"
                  autoComplete="off"
                  name="segmentDelimiter"
                  label={t('componentData.incomingFileSettings.SegmentDelimiter')}
                  error={validation.segmentDelimiter}
                  value={
                    incomingDelimeterSetting &&
                      incomingDelimeterSetting.segmentDelimiter
                      ? incomingDelimeterSetting.segmentDelimiter
                      : " "
                  }
                  variant="outlined"
                  onChange={(e) => handleIncomingDelimeterSetting(e)}
                  onBlur={(e) => onBlurDelimiterChange(e)}
                  required={isOnboarding ? false : true}
                >
                  <MenuItem value=" ">
                    <em>{t('componentData.incomingFileSettings.Select')}</em>
                  </MenuItem>
                  {segmentDelimiters.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3} sm={3}>
                <TextField
                  select
                  disabled={!canEdit}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="elementDelimiter"
                  label={t('componentData.incomingFileSettings.elementDelimiter')}
                  error={validation.elementDelimiter}
                  value={
                    incomingDelimeterSetting &&
                      incomingDelimeterSetting.elementDelimiter
                      ? incomingDelimeterSetting.elementDelimiter
                      : " "
                  }
                  variant="outlined"
                  onChange={(e) => handleIncomingDelimeterSetting(e)}
                  onBlur={(e) => onBlurDelimiterChange(e)}
                  required={isOnboarding ? false : true}
                >
                  <MenuItem value=" ">
                    <em>{t('componentData.incomingFileSettings.Select')}</em>
                  </MenuItem>
                  {delimiters.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={3} sm={3}>
                <TextField
                  select
                  disabled={!canEdit}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="subElementDelimiter"
                  error={validation.subElementDelimiter}
                  label={t('componentData.incomingFileSettings.subElementDelimiter')}
                  value={
                    incomingDelimeterSetting &&
                      incomingDelimeterSetting.subElementDelimiter
                      ? incomingDelimeterSetting.subElementDelimiter
                      : " "
                  }
                  variant="outlined"
                  onChange={(e) => handleIncomingDelimeterSetting(e)}
                  onBlur={isOnboarding ? null : (e) => onBlurDelimiterChange(e)}
                  required={isOnboarding ? false : true}
                >
                  <MenuItem value=" ">
                    <em>{t('componentData.incomingFileSettings.Select')}</em>
                  </MenuItem>
                  {subElementDelimiters.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Box>
      );
    }
  };

  renderFileNamingConvention = () => {
    const {
      classes,
      namingConvention,
      handleNamingChange,
      validation,
      onBlurNamingChange,
      isOnboarding,
      canEdit,
    } = this.props;
    const { t } = this.props;

    return (
      <Box>
        <Typography variant="h4" className={classes.primaryDark}>
          {t('componentData.incomingFileSettings.FileNamingConvention')}
        </Typography>
        <Box px={0} py={2}>
          <Grid container spacing={4}>
            <Grid item xs={3} sm={3}>
              <TextField
                fullWidth={true}
                disabled={!canEdit}
                color="secondary"
                autoComplete="off"
                name="clientUid"
                label={t('componentData.incomingFileSettings.ClientUID')}
                error={validation.clientUid}
                helperText={validation.clientUid}
                variant="outlined"
                value={
                  namingConvention.clientUid ? namingConvention.clientUid : ""
                }
                inputProps={{
                  maxLength: 10,
                }}
                onChange={(e) => handleNamingChange(e)}
                onBlur={isOnboarding ? null : (e) => onBlurNamingChange(e)}
                required={isOnboarding ? false : true}
              />
            </Grid>
            <Grid item xs={3} sm={3}>
              <TextField
                fullWidth={true}
                disabled={!canEdit}
                color="secondary"
                autoComplete="off"
                name="outBesId"
                label={t('componentData.incomingFileSettings.outBesId')}
                error={validation.outBesId}
                variant="outlined"
                value={
                  namingConvention.outBesId ? namingConvention.outBesId : ""
                }
                inputProps={{
                  maxLength: 10,
                }}
                onChange={(e) => handleNamingChange(e)}
                // onBlur={(e) => onBlurNamingChange(e)}
                onBlur={isOnboarding ? null : (e) => onBlurNamingChange(e)}
                required={isOnboarding ? false : true}
              />
            </Grid>
            <Grid item xs={3} sm={3}>
              <TextField
                fullWidth={true}
                disabled={!canEdit}
                color="secondary"
                autoComplete="off"
                name="fpid"
                label={t('componentData.incomingFileSettings.fpid')}
                error={validation.fpid}
                helperText={validation.fpid}
                variant="outlined"
                value={namingConvention.fpid ? namingConvention.fpid : ""}
                inputProps={{
                  maxLength: 10,
                }}
                onChange={(e) => handleNamingChange(e)}
                // onBlur={(e) => onBlurNamingChange(e)}
                onBlur={isOnboarding ? null : (e) => onBlurNamingChange(e)}
                required={isOnboarding ? false : true}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };
}

export default withTranslation()(withStyles(styles)(IncomingFileSettings));
