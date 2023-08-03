import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Box, Grid, Typography, MenuItem, Radio, RadioGroup, FormControl, FormControlLabel, Tooltip,
  Checkbox, Link, Tabs, Tab, CircularProgress, FormLabel
} from "@material-ui/core";
import { TextField, CheckboxGroup } from "~/components/Forms";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import PaymentAttribute from './PaymentAttribute';
import PayeeAttribute from './PayeeAttribute';

import { styles } from "./styles";
import { withTranslation } from 'react-i18next';
import { csvFileFormat, statusCode } from '~/config/entityTypes';
import { connect } from "react-redux";
import { updatePaymentFileTypeSelection, updatePaymentFileHeader, setTabValue } from "~/redux/actions/paymentAttribute";
import { updatePayeeFileTypeSelection, updatePayeeFileHeader } from "~/redux/actions/payeeAttribute";
import { downloadPaymentFileFormat, downloadPayeeFileFormat } from "~/redux/helpers/payments";
import * as FileSaver from "file-saver";
import Notification from "~/components/Notification";
import { TabPanel } from "~/components/TabPanel/index";
import config from "~/config";

class ResponseFileSettings extends Component {
  state = {
    varient: '',
    message: '',
    isLoading: false
  };
  getResponseValue = (item) => {
    const { returnFileSettings } = this.props;
    return returnFileSettings[item] ? returnFileSettings[item] : "";
  };

  render() {
    const {
      isISOselected,
      isCSVselected,
      isEDIselected,
      isXMLMSCSelected,
      isISOXMLMSCSelected,
      isCSVMSCSelected,
      showResponseFile
    } = this.props;
    return (
      <>
        {isISOselected && this.renderISOField()}
        {isEDIselected && this.renderQuestionText()}
        {isEDIselected && showResponseFile === 1 && this.renderResponseField()}
        {isCSVselected && config.showFMT && this.renderCSVFields()}
        {isXMLMSCSelected && this.renderXMLMSCFields()}
        {isISOXMLMSCSelected && this.renderISOXMLMSCFields()}
        {isCSVMSCSelected && this.renderCSVMSCFields()}
      </>
    );
  }
  renderQuestionText = () => {
    const { classes, handleShowResponseFile, showResponseFile, canEdit = true, t } = this.props;
    return (
      <Box className={classes.contentBackground} p={1} px={3.2} pb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Typography variant="h4" className={classes.primaryDark}>
              {t('componentData.responseFileSett.ResponseFile')}
            </Typography>
          </Grid>
          <Grid item xs={3} spacing={2}>
            <CheckboxGroup
              options={[
                {
                  label: t('componentData.responseFileSett.Yes'),
                  value: 1,
                },
                {
                  label: t('componentData.responseFileSett.No'),
                  value: 0,
                },
              ]}
              disabled={!canEdit}
              onChange={handleShowResponseFile}
              selectedOption={showResponseFile}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  renderResponseField = () => {
    const {
      classes,
      delimiters,
      segmentDelimiters,
      returnEDI,
      returnFileSettings,
      ediResponsePaymentFile,
      responseValidation,
      onChange,
      getScheduledTime,
      handleScheduleSettingsChange,
      onBlurResponseChange,
      isOnboarding,
      canEdit,
      t
    } = this.props;
    return (
      <Box className={classes.contentBackground} p={1.75}>
        <Typography variant="h4" className={classes.primaryDark}>
          {t('componentData.responseFileSett.ReturnEDI')}
        </Typography>
        <Box px={0} py={2}>
          <Grid container spacing={4}>
            {Object.keys(returnEDI).map((ediItem, index) =>
              ediItem == "isPaymentMethodEnabled" ? (
                <Grid item xs={3} sm={3} key={`edi-824-997-${index}`}>
                  <TextField
                    select
                    disabled={!canEdit}
                    fullWidth={true}
                    color="secondary"
                    autoComplete="off"
                    variant="outlined"
                    label={returnEDI[ediItem].label}
                    name={ediItem}
                    // helperText={
                    //   responseValidation[
                    //   `${ediResponsePaymentFile["824/997 File"]}`
                    //   ]
                    // }
                    error={responseValidation[ediItem]}
                    value={
                      returnFileSettings.isPaymentMethodEnabled
                        ? returnFileSettings.isPaymentMethodEnabled
                        : returnEDI[ediItem].value
                    }
                    id={ediResponsePaymentFile["824/997 File"]}
                    onChange={(e) => onChange(e, ediItem)}
                    onBlur={
                      isOnboarding
                        ? null
                        : (e) => onBlurResponseChange(e, ediItem)
                    }
                    inputProps={{
                      maxLength: 20,
                    }}
                    required={isOnboarding ? false : true}
                  >
                    <MenuItem key="select" value="">
                      {t('componentData.responseFileSett.Select')}
                    </MenuItem>
                    <MenuItem
                      key="2"
                      id={ediResponsePaymentFile["824/997 File"]}
                      value="2"
                    >
                      {t('componentData.responseFileSett.twoCharacters')}
                    </MenuItem>
                    <MenuItem
                      key="1"
                      id={ediResponsePaymentFile["824/997 File"]}
                      value="1"
                    >
                      {t('componentData.responseFileSett.threeCharacters')}
                    </MenuItem>
                  </TextField>
                </Grid>
              ) : (
                <Grid
                  item
                  xs={3}
                  sm={3}
                  className={classes.gridItem}
                  key={`edi-824-997-${index}`}
                >
                  <TextField
                    fullWidth={true}
                    disabled={!canEdit}
                    color="secondary"
                    autoComplete="off"
                    variant="outlined"
                    label={returnEDI[ediItem].label}
                    name={ediItem}
                    helperText={responseValidation[ediItem]}
                    error={responseValidation[ediItem] && responseValidation[ediItem].length > 0 ? true : false}
                    inputProps={{
                      maxLength: returnEDI[ediItem].length,
                    }}
                    value={this.getResponseValue(ediItem)}
                    id={ediResponsePaymentFile["824/997 File"]}
                    onChange={(e) => onChange(e, ediItem)}
                    onBlur={
                      isOnboarding
                        ? null
                        : (e) => onBlurResponseChange(e, ediItem)
                    }
                    required={isOnboarding ? false : true}
                  />
                </Grid>
              )
            )}
            <Grid item xs={3} sm={3}>
              <TextField
                fullWidth={true}
                disabled={!canEdit}
                color="secondary"
                autoComplete="off"
                label={t('componentData.responseFileSett.DeliveryTime')}
                variant="outlined"
                value={getScheduledTime("824/997 File")}
                id={ediResponsePaymentFile["824/997 File"]}
                name={ediResponsePaymentFile["824/997 File"]}
                helperText={
                  responseValidation[
                  `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
                  ]
                }
                error={
                  responseValidation[
                  `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
                  ] && responseValidation[
                    `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
                  ].length > 0
                }
                inputProps={{
                  maxLength: 8,
                }}
                onChange={(e) => handleScheduleSettingsChange(e)}
                // onBlur={
                //   isOnboarding
                //     ? null
                //     : (e) =>
                //       onBlurResponseChange(
                //         e,
                //         `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
                //       )
                // }
                onBlur={(e) =>
                  onBlurResponseChange(
                    e,
                    `scheduleSetting${ediResponsePaymentFile["824/997 File"]}`
                  )
                }
                required={isOnboarding ? false : true}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth={true}
                disabled={!canEdit}
                color="secondary"
                autoComplete="off"
                label={t('componentData.responseFileSett.DeltaDeliveryTime')}
                name="Delta Delivery Time"
                variant="outlined"
                helperText={
                  responseValidation[
                    `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                  ] && responseValidation[
                    `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                  ].length > 0 ? responseValidation[
                  `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                  ] : t('componentData.responseFileSett.DeltaDeliveryMsg')
                }
                error={
                  responseValidation[
                  `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                  ] && responseValidation[
                    `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                  ].length > 0
                }
                value={getScheduledTime("DeltaFile")}
                id={ediResponsePaymentFile["DeltaFile"]}
                onChange={(event) => handleScheduleSettingsChange(event)}
                // onBlur={
                //   isOnboarding
                //     ? null
                //     : (e) =>
                //         onBlurResponseChange(
                //           e,
                //           `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                //         )
                // }
                onBlur={
                  (e) =>
                    onBlurResponseChange(
                      e,
                      `scheduleSetting${ediResponsePaymentFile["DeltaFile"]}`
                    )
                }
                required={isOnboarding ? false : true}
                inputProps={{
                  maxLength: 8,
                }}
              />
            </Grid>
          </Grid>
        </Box>
        <Typography variant="h4" className={classes.primaryDark}>
          {t('componentData.responseFileSett.ReturnEDIDelimiter')}
        </Typography>
        <Box px={0} py={2}>
          <Grid container spacing={4}>
            <Grid item xs={3} sm={3}>
              <TextField
                select
                disabled={!canEdit}
                fullWidth={true}
                color="secondary"
                autoComplete="off"
                name="segmentDelimiter"
                label={t('componentData.responseFileSett.SegmentDelimiter')}
                value={returnFileSettings.segmentDelimiter || " "}
                variant="outlined"
                onChange={(e) => onChange(e, "segmentDelimiter")}
                error={responseValidation.segmentDelimiter}
                onBlur={
                  isOnboarding
                    ? null
                    : (e) => onBlurResponseChange(e, "segmentDelimiter")
                }
                required={isOnboarding ? false : true}
              >
                <MenuItem value=" ">{t('componentData.responseFileSett.Select')}</MenuItem>
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
                label={t('componentData.responseFileSett.ElementDelimiter')}
                value={returnFileSettings.elementDelimiter || " "}
                variant="outlined"
                onChange={(e) => onChange(e, "elementDelimiter")}
                onBlur={
                  isOnboarding
                    ? null
                    : (e) => onBlurResponseChange(e, "elementDelimiter")
                }
                required={isOnboarding ? false : true}
                error={responseValidation.elementDelimiter}
              >
                <MenuItem value=" ">{t('componentData.responseFileSett.Select')}</MenuItem>
                {delimiters.map((option) => (
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
  };

  renderISOField = () => {
    const {
      classes,
      getScheduledTime,
      responseValidation,
      handleScheduleSettingsChange,
      ediResponsePaymentFile,
      isOnboarding,
      onBlurResponseChange,
      canEdit,
      t
    } = this.props;
    return (
      <Box className={classes.contentBackground} p={1} px={3.2} pb={3}>
        <Typography variant="h4" className={classes.primaryDark}>
          {t('componentData.responseFileSett.ReturnISO')}
        </Typography>
        <Box py={2}>
          <Grid container spacing={4}>
            <Grid item xs={6} sm={6}>
              <TextField
                fullWidth={true}
                disabled={!canEdit}
                color="secondary"
                autoComplete="off"
                label={t('componentData.responseFileSett.Acknowledgement')}
                variant="outlined"
                name={ediResponsePaymentFile["ISOTransactional XML"]}
                value={getScheduledTime("ISOTransactional XML")}
                id={ediResponsePaymentFile["ISOTransactional XML"]}
                onChange={(e) => handleScheduleSettingsChange(e)}
                helperText={
                  responseValidation[
                  `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
                  ]
                }
                error={responseValidation[
                  `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
                ] && responseValidation[
                  `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
                ].length > 0}
                onBlur={
                  (e) =>
                    onBlurResponseChange(
                      e,
                      `scheduleSetting${ediResponsePaymentFile["ISOTransactional XML"]}`
                    )
                }
                required={isOnboarding ? false : true}
                inputProps={{
                  maxLength: 8,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  };

  handleFileTypeChange = (event) => {
    const { dispatch } = this.props;
    dispatch(updatePaymentFileTypeSelection(Number(event.target.value)));
    dispatch(updatePayeeFileTypeSelection(Number(event.target.value)));
  }

  handleIncludeHeaderChange = (event) => {
    const { dispatch, paymentAttribute, payeeAttribute } = this.props;
    const { tabValue } = paymentAttribute;

    const fileSelectionType = paymentAttribute.fileSelectionType && paymentAttribute.fileSelectionType.fileTypeId &&
      paymentAttribute.fileSelectionType.paymentHeader != null ? paymentAttribute.fileSelectionType : payeeAttribute.fileSelectionType;

    if (fileSelectionType && fileSelectionType.fileTypeId == csvFileFormat.PAYMENT ||
      fileSelectionType.fileTypeId == csvFileFormat.BOTHPAYEEPAYMENT && tabValue == 1) {
      dispatch(updatePaymentFileHeader(event.target.checked ? 1 : 0, "paymentHeader"));
      dispatch(updatePayeeFileHeader(event.target.checked ? 1 : 0, "paymentHeader"));
    } else {
      dispatch(updatePaymentFileHeader(event.target.checked ? 1 : 0, "payeeHeader"));
      dispatch(updatePayeeFileHeader(event.target.checked ? 1 : 0, "payeeHeader"));
    }
  }

  handleDownloadPaymentFile = (isDefaultSchema = false) => {
    const { t } = this.props;
    this.setState({ isLoading: true });
    downloadPaymentFileFormat(isDefaultSchema).then(response => {
      if (response && response.status !== statusCode.UNAUTHORIZED) {
        if (response && response.data && response.data.error || response.status === statusCode.INTERNAL_SERVER_ERROR || response.status === statusCode.NOT_FOUND) {
          this.setState({
            varient: 'error',
            message: response.status === statusCode.NOT_FOUND ? t('componentData.FileMappingTool.downloadDataNotAvailable') : t('componentData.bankFileDetail.FileNotExists'),
            isLoading: false
          })
          return false;
        }
        const fileName = `${response.headers["x-file-name"]}`;
        const type = response.headers["content-type"];
        const data = new Blob([response.data], {
          type: type,
          encoding: "UTF-8",
        });
        FileSaver.saveAs(data, fileName);
        this.setState({ isLoading: false });
      }
      else {
        this.setState({
          varient: 'error',
          message: t('componentData.bankFileDetail.FileNotExists'),
          isLoading: false
        })

      }
    }).catch((error) => {
      this.setState({
        varient: 'error',
        message: t('componentData.bankFileDetail.FileNotExists'),
        isLoading: false
      })
    });
  }

  handleDownloadPayeeFile = (isDefaultSchema = false) => {
    const { t } = this.props;
    this.setState({ isLoading: true });
    downloadPayeeFileFormat(isDefaultSchema).then(response => {
      if (response && response.status !== statusCode.UNAUTHORIZED) {
        if (response && response.data && response.data.error || response.status === statusCode.INTERNAL_SERVER_ERROR || response.status === statusCode.NOT_FOUND) {
          this.setState({
            varient: 'error',
            message: response.status === statusCode.NOT_FOUND ? t('componentData.FileMappingTool.downloadDataNotAvailable') : t('componentData.bankFileDetail.FileNotExists'),
            isLoading: false
          })
          return false;
        }
        const fileName = `${response.headers["x-file-name"]}`;
        const type = response.headers["content-type"];
        const data = new Blob([response.data], {
          type: type,
          encoding: "UTF-8",
        });
        FileSaver.saveAs(data, fileName);
        this.setState({ isLoading: false });
      }
      else {
        this.setState({
          varient: 'error',
          message: t('componentData.bankFileDetail.FileNotExists'),
          isLoading: false
        })

      }
    }).catch((error) => {
      this.setState({
        varient: 'error',
        message: t('componentData.bankFileDetail.FileNotExists'),
        isLoading: false
      })
    });
  }

  handleTabChange = (newValue) => {
    this.props.dispatch(setTabValue(newValue))
  }

  renderCSVFields = () => {
    const { classes, paymentAttribute, payeeAttribute, t } = this.props;
    const { tabValue } = paymentAttribute;
    const { varient, message, isLoading } = this.state;

    const fileSelectionType = paymentAttribute.fileSelectionType && paymentAttribute.fileSelectionType?.paymentHeader &&
      paymentAttribute.fileSelectionType.paymentHeader !== null ? paymentAttribute.fileSelectionType : payeeAttribute.fileSelectionType;

    return (
      <>
        <Box className={classes.contentBackground} px={3.2} pb={3}>
          <Typography variant="h4" className={classes.primaryDark}>
            {t('componentData.FileMappingTool.customizeCSVFormat')}
            <Tooltip title={t('componentData.FileMappingTool.customizeTooltip')} placement="top" arrow >
              <InfoOutlinedIcon fontSize="small" className={classes.infoIcon} />
            </Tooltip>
          </Typography>

          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <FormControl component="fieldset" className={classes.paymentRadio}>
              <RadioGroup row aria-label="position" name="position" onChange={e => this.handleFileTypeChange(e)} value={Number(fileSelectionType?.fileTypeId) || csvFileFormat.DEFAULT}>
                <Grid item xs>
                  <FormControlLabel
                    className={classes.formLabel}
                    value={csvFileFormat.DEFAULT}
                    control={<Radio color="primary" />}
                    label={t('componentData.FileMappingTool.customizeNo')}
                  />
                </Grid>
                <Grid item xs>
                  <FormControlLabel
                    className={classes.formLabel}
                    value={csvFileFormat.PAYEE}
                    control={<Radio color="primary" />}
                    label={t('componentData.FileMappingTool.customizePayee')}
                  />
                </Grid>
                <Grid item xs>
                  <FormControlLabel
                    className={classes.formLabel}
                    value={csvFileFormat.PAYMENT}
                    control={<Radio color="primary" />}
                    label={t('componentData.FileMappingTool.customizePayment')}
                  />
                </Grid>
                <Grid item xs>
                  <FormControlLabel
                    className={classes.formLabel}
                    value={csvFileFormat.BOTHPAYEEPAYMENT}
                    control={<Radio color="primary" />}
                    label={t('componentData.FileMappingTool.customizeBothPaymentPayee')}
                  />
                </Grid>
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* <Box pt={3}>
            <Typography variant="h4" className={classes.primaryDark}>
              <VisibilityIcon fontSize="small" style={{ marginRight: '5px', verticalAlign: 'middle' }} />
              Preview Default File Formats
            </Typography>
          </Box> */}

          {isLoading ?
            <Box
              width="100px"
              display="flex"
              mt={1.875}
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress color="primary" />
            </Box> :
            <Grid container className={classes.downloadContainer}>
              <Grid item xs={6} className={classes.downloadListSpacing}>
                <GetAppIcon fontSize="small" className={fileSelectionType && fileSelectionType.fileTypeId &&
                  fileSelectionType.fileTypeId == csvFileFormat.PAYEE ? classes.disabledDownloadIcon : classes.enableDownloadIcon}
                />
                <Link
                  component="button"
                  className={classes.previewText}
                  underline='none'
                  onClick={() => this.handleDownloadPaymentFile(true)}
                  disabled={fileSelectionType && fileSelectionType.fileTypeId ?
                    fileSelectionType.fileTypeId == csvFileFormat.PAYEE : false}
                >
                  {t('componentData.FileMappingTool.downloadDefaultPaymentFile')}
                </Link>
              </Grid>
              <Grid item xs={6} className={classes.downloadListSpacing}>
                <GetAppIcon fontSize="small"
                  className={fileSelectionType && fileSelectionType.fileTypeId ? fileSelectionType.fileTypeId == csvFileFormat.DEFAULT ||
                    fileSelectionType.fileTypeId == csvFileFormat.PAYEE || paymentAttribute.fileSelectionType.isDefaultUser ?
                    classes.disabledDownloadIcon : classes.enableDownloadIcon : classes.disabledDownloadIcon} />
                <Link
                  component="button"
                  className={classes.previewText}
                  underline='none'
                  disabled={fileSelectionType && fileSelectionType.fileTypeId ? fileSelectionType.fileTypeId == csvFileFormat.DEFAULT ||
                    fileSelectionType.fileTypeId == csvFileFormat.PAYEE || paymentAttribute.fileSelectionType.isDefaultUser : true}
                  onClick={() => this.handleDownloadPaymentFile()}
                >
                  {t('componentData.FileMappingTool.downloadCustomizePaymentFile')}
                </Link>
              </Grid>
              <Grid item xs={6} className={classes.downloadListSpacing}>
                <GetAppIcon fontSize="small" className={fileSelectionType && fileSelectionType.fileTypeId &&
                  fileSelectionType.fileTypeId == csvFileFormat.PAYMENT ? classes.disabledDownloadIcon : classes.enableDownloadIcon}
                />
                <Link
                  component="button"
                  className={classes.previewText}
                  underline='none'
                  onClick={() => this.handleDownloadPayeeFile(true)}
                  disabled={fileSelectionType && fileSelectionType.fileTypeId ?
                    fileSelectionType.fileTypeId == csvFileFormat.PAYMENT : false}
                >
                  {t('componentData.FileMappingTool.downloadDefaultPayeeFile')}
                </Link>
              </Grid>
              <Grid item xs={6} className={classes.downloadListSpacing}>
                <GetAppIcon fontSize="small" className={fileSelectionType && fileSelectionType.fileTypeId ?
                  fileSelectionType.fileTypeId == csvFileFormat.DEFAULT || fileSelectionType.fileTypeId == csvFileFormat.PAYMENT ||
                    payeeAttribute.fileSelectionType.isDefaultUser ? classes.disabledDownloadIcon : classes.enableDownloadIcon
                  : classes.disabledDownloadIcon} />
                <Link
                  component="button"
                  className={classes.previewText}
                  underline='none'
                  //disabled={true}
                  disabled={fileSelectionType && fileSelectionType.fileTypeId ? fileSelectionType.fileTypeId == csvFileFormat.DEFAULT ||
                    fileSelectionType.fileTypeId == csvFileFormat.PAYMENT || payeeAttribute.fileSelectionType.isDefaultUser : true}
                  onClick={() => this.handleDownloadPayeeFile()}
                >
                  {t('componentData.FileMappingTool.downloadCustomizePayeeFile')}
                </Link>
              </Grid>
            </Grid>
          }

          {fileSelectionType?.fileTypeId && fileSelectionType.fileTypeId != csvFileFormat.DEFAULT ?
            <Box pt={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fileSelectionType?.fileTypeId && fileSelectionType.fileTypeId == csvFileFormat.PAYMENT ||
                      fileSelectionType.fileTypeId == csvFileFormat.BOTHPAYEEPAYMENT && paymentAttribute.tabValue == 1 ?
                      !!fileSelectionType.paymentHeader : !!fileSelectionType.payeeHeader}
                    onChange={e => this.handleIncludeHeaderChange(e)}
                    name="includeHeader"
                    color="primary"
                  />
                }
                label={t('componentData.FileMappingTool.includeHeader')}
              />
              {/* <FormControl component="fieldset" className={classes.paymentRadio}>
                <Typography variant="h4" className={classes.primaryDark}>Include File Header</Typography>
                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">                

                  <RadioGroup row name="fileHeader" onChange={e => this.handleIncludeHeaderChange(e)} value={fileSelectionType?.includeHeader || includeFileHeader.NO}>
                    <Grid item xs>
                      <FormControlLabel
                        value={includeFileHeader.NO}
                        control={<Radio color="primary" />}
                        label="No"
                      />
                    </Grid>
                    <Grid item xs>
                      <FormControlLabel
                        value={includeFileHeader.YES}
                        control={<Radio color="primary" />}
                        label="Yes"
                      />
                    </Grid>
                  </RadioGroup>
                </Grid>
              </FormControl> */}
            </Box> : null}
        </Box>

        {fileSelectionType?.fileTypeId && fileSelectionType.fileTypeId == csvFileFormat.PAYMENT ?
          <Box className={classes.attributeAccordian}>
            <PaymentAttribute />
          </Box>
          : null}

        {fileSelectionType?.fileTypeId && fileSelectionType.fileTypeId == csvFileFormat.PAYEE ?
          <Box className={classes.attributeAccordian}>
            <PayeeAttribute />
          </Box>
          : null}

        {fileSelectionType?.fileTypeId && fileSelectionType.fileTypeId == csvFileFormat.BOTHPAYEEPAYMENT ?
          <Box className={classes.attributeAccordian}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} pl={3}>
              <Tabs value={tabValue} aria-label="basic tabs example" textColor="secondary">
                <Tab
                  label={t('componentData.FileMappingTool.tabPayeeLabel')}
                  onClick={() => this.handleTabChange(0)}
                  textColor="secondary"
                />
                <Tab
                  label={t('componentData.FileMappingTool.tabPaymentLabel')}
                  onClick={() => this.handleTabChange(1)}
                  textColor="secondary"
                />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0} isFMT={true}>
              <PayeeAttribute />
            </TabPanel>
            <TabPanel value={tabValue} index={1} isFMT={true}>
              <PaymentAttribute />
            </TabPanel>
          </Box>
          : null}
        {message &&
          <Notification variant={varient} message={message}
            handleClose={() => this.setState({ varient: '', message: '' })} />
        }
      </>
    )
  }

  renderXMLMSCFields = () => {
    const { classes, t, handleAckToggleChange, showXMLMSCResponse,
      handleAckSettingChange, onBlurResponseChange, responseValidation, getAckTime } = this.props;
    return (
      <Box className={classes.contentBackground} px={4} pb={2}>
        <Grid container>
          <Grid item xs={4}>
            {/* <CheckboxGroup
              options={[
                {
                  label: t('componentData.responseFileSett.Yes'),
                  value: 1
                },
                {
                  label: t('componentData.responseFileSett.No'),
                  value: 0
                }
              ]}
              onChange={(e) => handleAckToggleChange(e, "MC XML")}
              selectedOption={showXMLMSCResponse}
            /> */}
            <FormControl component="xmlmsc_fieldset">
              <FormLabel component="legend" className={classes.mscResponseLegend}>
                {t('componentData.masterCardFileSetting.xmlMSCResposneText')}
              </FormLabel>
              <RadioGroup row aria-label="xmlmsc" name="xmlmsc" value={showXMLMSCResponse} onChange={(e) => handleAckToggleChange(e, "MC XML")}>
                <FormControlLabel value={1} control={<Radio />} label={t('componentData.responseFileSett.Yes')} />
                <FormControlLabel value={0} control={<Radio />} label={t('componentData.responseFileSett.No')} />
              </RadioGroup>
            </FormControl>
          </Grid>

          {showXMLMSCResponse ?
            <Grid item xs={4}>
              <Box mx={1}>
                <TextField
                  className={classes.smallPlaceholderText}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="MC XML"
                  label={t('componentData.masterCardFileSetting.xmlResDeliveryTime')}
                  placeholder={t('componentData.masterCardFileSetting.timeFormat')}
                  value={getAckTime("MC XML")}
                  onChange={(event) => handleAckSettingChange(event)}
                  onBlur={(e) => onBlurResponseChange(e, "MC XML")}
                  helperText={responseValidation["MC XML"]}
                  error={responseValidation["MC XML"] && responseValidation["MC XML"].length > 0}
                  inputProps={{
                    maxLength: 8
                  }}
                />
              </Box>
            </Grid>
            : null}
        </Grid>
      </Box>
    )
  }
  renderISOXMLMSCFields = () => {
    const { classes, t, handleAckToggleChange, showISOXMLMSCResponse, handleAckSettingChange,
      onBlurResponseChange, responseValidation, getAckTime } = this.props;
    return (
      <Box className={classes.contentBackground} px={4} pb={2}>
        <Grid container>
          <Grid item xs={4}>
            <FormControl component="isoxmlmsc_fieldset">
              <FormLabel component="legend" className={classes.mscResponseLegend}>
                {t('componentData.masterCardFileSetting.isoxmlMSCResposneText')}
              </FormLabel>
              <RadioGroup row aria-label="isoxmlmsc" name="isoxmlmsc" value={showISOXMLMSCResponse} onChange={(e) => handleAckToggleChange(e, "Card ISO XML")}>
                <FormControlLabel value={1} control={<Radio />} label={t('componentData.responseFileSett.Yes')} />
                <FormControlLabel value={0} control={<Radio />} label={t('componentData.responseFileSett.No')} />
              </RadioGroup>
            </FormControl>
          </Grid>
          {showISOXMLMSCResponse ?
            <Grid item xs={4}>
              <Box mx={1}>
                <TextField
                  className={classes.smallPlaceholderText}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="Card ISO XML"
                  label={t('componentData.masterCardFileSetting.isoxmlResDeliveryTime')}
                  placeholder={t('componentData.masterCardFileSetting.timeFormat')}
                  value={getAckTime("Card ISO XML")}
                  onChange={(event) => handleAckSettingChange(event)}
                  onBlur={(e) => onBlurResponseChange(e, "Card ISO XML")}
                  helperText={responseValidation["Card ISO XML"]}
                  error={responseValidation["Card ISO XML"] && responseValidation["Card ISO XML"].length > 0}
                  inputProps={{
                    maxLength: 8
                  }}
                />
              </Box>
            </Grid>
            : null}
        </Grid>
      </Box>
    )
  }
  renderCSVMSCFields = () => {
    const { classes, t, handleAckToggleChange, showCSVMSCResponse, handleAckSettingChange,
      onBlurResponseChange, responseValidation, getAckTime } = this.props;

    return (
      <Box className={classes.contentBackground} px={4} pb={2}>
        <Grid container>
          <Grid item xs={4}>
            <FormControl component="csvmsc_fieldset">
              <FormLabel component="legend" className={classes.mscResponseLegend}>
                {t('componentData.masterCardFileSetting.csvMSCResposneText')}
              </FormLabel>
              <RadioGroup row aria-label="csvmsc" name="csvmsc" value={showCSVMSCResponse} onChange={(e) => handleAckToggleChange(e, "MC CSV")}>
                <FormControlLabel value={1} control={<Radio />} label={t('componentData.responseFileSett.Yes')} />
                <FormControlLabel value={0} control={<Radio />} label={t('componentData.responseFileSett.No')} />
              </RadioGroup>
            </FormControl>
          </Grid>
          {showCSVMSCResponse ?
            <Grid item xs={4}>
              <Box mx={1}>
                <TextField
                  className={classes.smallPlaceholderText}
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  variant="outlined"
                  name="MC CSV"
                  label={t('componentData.masterCardFileSetting.csvResDeliveryTime')}
                  placeholder={t('componentData.masterCardFileSetting.timeFormat')}
                  value={getAckTime("MC CSV")}
                  onChange={(event) => handleAckSettingChange(event)}
                  onBlur={(e) => onBlurResponseChange(e, "MC CSV")}
                  helperText={responseValidation["MC CSV"]}
                  error={responseValidation["MC CSV"] && responseValidation["MC CSV"].length > 0}
                  inputProps={{
                    maxLength: 8
                  }}
                />
              </Box>
            </Grid>
            : null}
        </Grid>
      </Box >
    )
  }
}

export default withTranslation()(connect((state) => ({ ...state.paymentAttribute, ...state.payeeAttribute }))(
  withStyles(styles)(ResponseFileSettings)
));
