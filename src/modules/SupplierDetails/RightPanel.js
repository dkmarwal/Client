import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem,
  RadioGroup,
  Radio,
  Divider,
  Select,
  Tooltip,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";
import TimelineIcon from "@material-ui/icons/Timeline";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { styles } from "./styles";
import { Bar } from "react-chartjs-2";
import USAFlag from "~/assets/images/USA_flag.svg";
import CADFlag from "~/assets/images/CAD_flag.svg";
import { ConfirmModal } from "~/components/Dialogs";
import PayeeRiskModal from './PayeeRiskModal';
import WarningIcon from '@material-ui/icons/Warning';

const RightPanel = (props) => {
  const [howlongNotConsider, setHowLongNotConsider] = useState(1);
  const [reasonNotConsider, setReasonNotConsider] = useState(1);
  const [otherReason, setOtherReason] = useState(null);
  const [considerInRisk, setConsiderInRisk] = useState(false);

  const { t, classes, SpendAnalysisGraphData, SpendAnalysisGraphOpt, handleRadioChange, selectedTime,
    leftPanelObj, changeCurrency, selectedCurrency, selectedYear, isDataAvilable, trendForecast, yearList,
    handleYearChange, onCheckChange, handleDeactiveConfirm, handleRiskConfirm, deactiveModal, payeeRiskAnalysis,
    onDeactivateClick, onPayeeRiskClick, handleRiskClose, handlePayeeClose, payeeResponseData, isDeactivated, payeeIsInRisk } = props;

  const currencyFormateFnInK = (val) => {
    let newVal = val / 1000;
    newVal = newVal.toFixed(2);
    return newVal.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'howlongNotConsider':
        setHowLongNotConsider(Number(value));
        break;
      case 'reasonNotConsider':
        setReasonNotConsider(Number(value));
        break;
      case 'otherReason':
        setOtherReason(value);
        break;
    }
  }

  const onChangePayeeRisk = () => {
    if(payeeIsInRisk) {
      setConsiderInRisk(true);
    } else {
      onPayeeRiskClick();
    }
  }

  const onConsiderConfirm = () => {
    onSubmitRiskDetail();
    setConsiderInRisk(false);
  }

  const onSubmitRiskDetail = () => {
    const data = {
      riskDurationId: howlongNotConsider,
      riskReasonId: reasonNotConsider,
      otherReason: otherReason,
      considerPayeeInRisk: payeeIsInRisk ? 1 : 0
    }
    handleRiskConfirm(data);
  }

  const renderContent = () => {
    return (
      <Grid item xs={12}>
        <Box>
          {t("componentData.PayeeDetails.modalContent")}
        </Box>
        <Box my={2} className={classes.redcolorText}>
          <WarningIcon color='error' fontSize='small' />
          <Box component="span" pl={1}>
            <Typography>{t("componentData.PayeeDetails.actionUndone")}</Typography>
          </Box>
        </Box>
      </Grid>
    )
  }

  return (
    <>
      <Grid item xs={12}>
        <Box mb={2}>
          <Typography className={classes.textColor}>
          {t("componentData.dashboard.CumulativeSpendFor")}{" "}
            {Number(selectedYear) === new Date().getFullYear()
              ? `${selectedYear} (${t(
                "componentData.dashboard.CurrentYear"
              )}) vs ${selectedYear - 1} (${t(
                "componentData.dashboard.PreviousYear"
              )})`
              : `${selectedYear} (${t(
                "componentData.dashboard.SelectedYear"
              )}) vs ${selectedYear - 1} (${t(
                "componentData.dashboard.PreviousYear"
              )})`}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={9}>
            <RadioGroup
              row
              aria-label="gender"
              name="period"
              value={selectedTime}
              onChange={(e) => handleRadioChange(e)}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label={t("componentData.dashboard.Monthly")}
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label={t("componentData.dashboard.Quarterly")}
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={3} className={classes.yearDropdown}>
            <Select
              labelId="demo-customized-select-label"
              id="demo-customized-select"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {yearList.map((item) => {
                return <MenuItem value={item}>{item}</MenuItem>;
              })}
            </Select>
          </Grid>
        </Grid>

        <Box mb={1}>
          <Divider />
        </Box>
      </Grid>

      <Grid item xs={12} className={classes.coutrySeclectionBox}>
        {leftPanelObj?.usdAmount > 0 && (
          <Box
            mt={3}
            className="countryBox"
            onClick={() => changeCurrency("USD")}
            active={selectedCurrency === "USD" ? "true" : null}
          >
            <img src={USAFlag} alt="USD" />
            <Typography
              variant="h4"
              title={`USD $${leftPanelObj?.usdAmount
                ?.toString()
                ?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0
                }`}
            >
              USD ${currencyFormateFnInK(leftPanelObj?.usdAmount ?? 0)}K
            </Typography>
          </Box>
        )}

        {leftPanelObj?.cadAmount > 0 && (
          <Box
            mt={3}
            className="countryBox"
            onClick={(e) => {
              this.setState(
                {
                  selectedCurrency: "CAD",
                },
                () => this.getGraphDataFromAPI()
              );
            }}
            active={selectedCurrency === "CAD" ? "true" : null}
          >
            <img src={CADFlag} alt="CAD" />
            <Typography
              variant="h4"
              title={`CAD $${leftPanelObj?.cadAmount
                ?.toString()
                ?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0
                }`}
            >
              CAD ${currencyFormateFnInK(leftPanelObj?.cadAmount ?? 0)}K
            </Typography>
          </Box>
        )}
      </Grid>

      <Grid item xs={12} className={classes.payeeContact}>
        <FormControlLabel
          control={
            <Checkbox
              checked={trendForecast}
              onChange={onCheckChange}
              id="TrendForecastCheck"
              name="trendForecast"
            />
          }
          label={
            <Box display="flex">
              <TimelineIcon className={classes.icon} />
              {t("componentData.PayeeDetails.trendForcast")}
            </Box>
          }
        />
        {!Boolean(isDataAvilable) ? (
          <Box display="block" textAlign="center" width={1} my={6}>
            <img src={require("~/assets/icons/bankFile_No_data.svg")} alt="" />
            <Box py={3} color="#A1A1A1" fontSize={14} display="block">
              {t("componentData.customTable.NoDatatoShow")}
            </Box>
          </Box>
        ) : (
          <Bar
            data={SpendAnalysisGraphData}
            options={SpendAnalysisGraphOpt}
            id="spendAnalysisGraph"
          />
        )}
      </Grid>

      <Grid item xs={12}>
        <Box my={2}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.actionButton}
            startIcon={<TimelineIcon />}
            onClick={onChangePayeeRisk}
            disabled={isDeactivated}
          >
            {payeeIsInRisk ? 
              t("componentData.PayeeDetails.payeeRiskAnalysis") : t("componentData.PayeeDetails.dontPayeeRiskAnalysisBtn") }
          </Button>
        </Box>

        {payeeResponseData && Object.keys(payeeResponseData).length !== 0 &&
          <Box className={classes.captionText}>
            <Box>{t("componentData.PayeeDetails.updatedBy")}: {`${payeeResponseData?.displayName || ''} ${t("componentData.PayeeDetails.onTxt")} ${payeeResponseData?.createdAt || ''}`}</Box>
            {payeeResponseData?.duration && <Box>
              {t("componentData.PayeeDetails.howLongConsiderText")}: {payeeResponseData?.duration || ''}
            </Box>
            }
            {payeeResponseData?.reason && 
            <Box>{t("componentData.PayeeDetails.notConsiderText")}: {payeeResponseData?.reason || ''} {payeeResponseData.riskReasonId === 3 ?
              payeeResponseData.otherReason ? `| ${payeeResponseData.otherReason}` : '' : ''}
            </Box>}
          </Box>}

        <Box my={2}>
          <Button
            variant="outlined"
            color="primary"
            className={classes.actionButton}
            startIcon={<CancelOutlinedIcon />}
            onClick={onDeactivateClick}
            disabled={isDeactivated}
          >
            {t("componentData.PayeeDetails.deactivePayee")}
          </Button>
          <Tooltip title={t("componentData.PayeeDetails.deactivateTooltip")} placement='top'>
            <InfoOutlinedIcon color='primary' className={classes.infoIcon} fontSize="small" />
          </Tooltip>
        </Box>
      </Grid>

      {payeeRiskAnalysis &&
        <PayeeRiskModal
          open={payeeRiskAnalysis}
          handleClose={handleRiskClose}
          handleConfirm={onSubmitRiskDetail}
          handleOnChange={handleOnChange}
          howlongNotConsider={howlongNotConsider}
          reasonNotConsider={reasonNotConsider}
          otherReason={otherReason}
        />
      }

      <ConfirmModal
        open={deactiveModal}
        title={t("componentData.PayeeDetails.modalTitle")}
        dialogContent={renderContent()}
        handleClose={handlePayeeClose}
        handleConfirm={handleDeactiveConfirm}
        cancelButtonLabel={t("componentData.PayeeDetails.cancelBtn")}
        saveButtonLabel={t("componentData.PayeeDetails.confirmBtn")}
      />

      <ConfirmModal
        open={considerInRisk}
        title={t("componentData.PayeeDetails.considerModalTitle")}
        dialogContent={t("componentData.PayeeDetails.considerConfirmTxt")}
        handleClose={() => setConsiderInRisk(false)}
        handleConfirm={onConsiderConfirm}
        cancelButtonLabel={t("componentData.PayeeDetails.cancelBtn")}
        saveButtonLabel={t("componentData.PayeeDetails.considerModalConfirmTxt")}
      />
    </>
  );
};
export default withTranslation()(withStyles(styles)(RightPanel));
