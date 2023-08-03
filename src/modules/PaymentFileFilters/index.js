import React from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  MenuItem,
  CircularProgress,
  InputAdornment,
  OutlinedInput,
} from "@material-ui/core";
import EventIcon from "@material-ui/icons/Event";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import { TextField } from "~/components/Forms";
import { withTranslation } from "react-i18next";
import { PayerTypes } from '~/config/entityTypes';
import en from "date-fns/locale/es";
import fr from "date-fns/locale/es";
import es from "date-fns/locale/es";
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("es", es);

class PaymentFileFilters extends React.Component {
  state = {
    processing: false,
    // formatEndDate: "",
    // formatStartDate: "",
    error: false,
    errorText: ""
  };
  validate = (startDt, endDt) => {
    const { t } = this.props;
    let flag = false;
    if (new Date(startDt) > new Date(endDt)) {
      flag = true;
      this.setState({
        error: true,
        errorText: t("componentData.paymentFileFilters.ERROR"),
      })
    } else {
      this.setState({
        errorText: "",
        error: false,
      })
    }
    return flag;
  };
  // componentDidMount() {
  //     const { startDate, endDate } = this.props;
  //     this.setState({
  //         formatStartDate: startDate !== "" ? new Date(startDate) : "",
  //         formatEndDate: endDate !== "" ? new Date(endDate) : "",
  //     });
  // }
  handleDateChange = (date) => {
    // this.setState({
    //     formatStartDate: date,
    // });
    this.props.updateDateFilter("startDate", date);
  };
  handleEndDateChange = (date) => {
    // this.setState({
    //     formatEndDate: date,
    // });
    this.props.updateDateFilter("endDate", date);
  };

  render() {
    const { processing } = this.state;
    const {
      classes,
      name,
      id,
      count,
      noOfPayment,
      startDate,
      endDate,
      handleChangeInput,
      applySupplierFilter,
      resetSupplierFilter,
      isCampaignFlag,
      appType, noOfPayees,
      t,
      actionType,
      actionTypeList,
      payerTypeId
    } = this.props;
    const { errorText } = this.state;
    const paymentCount = [
      { id: ">", label: ">" },
      { id: "<", label: "<" },
      { id: ">=", label: ">=" },
      { id: "<=", label: "<=" },
      { id: "=", label: "=" },
    ];

    return (
      <Grid>
        <Grid item xs={12}>
          <Box my={1}>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="name"
              label={t("componentData.paymentFileFilters.FileName")}
              variant="outlined"
              value={name}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>
        <Grid item>
          <Box my={1}>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="id"
              label={t("componentData.paymentFileFilters.FileID")}
              variant="outlined"
              inputProps={{
                maxLength: 9,
              }}
              value={id}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>

        {payerTypeId == PayerTypes.CARDS && <Grid item>
          <Box my={1}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="actionType"
              label={t("componentData.paymentFileFilters.actionType")}
              variant="outlined"
              value={actionType}
              onChange={handleChangeInput}
            >
              <MenuItem key="status_0" id="status_0" value={0}>
                {t("componentData.paymentFileFilters.all")}
              </MenuItem>
              {actionTypeList && actionTypeList.map((option) => (
                <MenuItem
                  id={`status_${option.ActionTypeId}`}
                  key={`status_${option.ActionTypeId}`}
                  value={option.ActionTypeId}
                >
                  {option.ActionType}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Grid>}

        {isCampaignFlag &&
          <Grid item xs={12}>
            <Box
              flexDirection="row"
              display="flex"
              justifyContent="space-between"
            >
              <Box width="30%" my={1}>
                <TextField
                  select
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="count"
                  label=""
                  variant="outlined"
                  value={count}
                  onChange={handleChangeInput}
                >
                  <MenuItem>
                    {t("componentData.paymentFileFilters.Select")}
                  </MenuItem>
                  {paymentCount &&
                    paymentCount.map((option) => (
                      <MenuItem
                        id={`status_${option.id}`}
                        key={`status_${option.id}`}
                        value={option.id}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
              <Box width="65%" my={1}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="noOfPayees"
                  value={noOfPayees}
                  label={t("componentData.paymentFileFilters.NumberOfPayees")}
                  variant="outlined"
                  onChange={handleChangeInput}
                />
              </Box>
            </Box>
          </Grid>}
        {!isCampaignFlag &&
          <Grid item xs={12}>
            <Box
              flexDirection="row"
              display="flex"
              justifyContent="space-between"
            >
              <Box width="30%" my={1}>
                <TextField
                  select
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="count"
                  label=""
                  variant="outlined"
                  value={count}
                  onChange={handleChangeInput}
                >
                  <MenuItem>
                    {t("componentData.paymentFileFilters.Select")}
                  </MenuItem>
                  {paymentCount &&
                    paymentCount.map((option) => (
                      <MenuItem
                        id={`status_${option.id}`}
                        key={`status_${option.id}`}
                        value={option.id}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                </TextField>
              </Box>
              <Box width="65%" my={1}>
                <TextField
                  fullWidth={true}
                  color="secondary"
                  autoComplete="off"
                  name="noOfPayment"
                  value={noOfPayment}
                  label={t("componentData.paymentFileFilters.NumberOfPayments")}
                  variant="outlined"
                  onChange={handleChangeInput}
                />
              </Box>
            </Box>
          </Grid>}
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.filterText}>
            {(appType === 1 || isCampaignFlag) ? t("componentData.paymentFileFilters.UploadedOn") : t("componentData.paymentFileFilters.ReceivedOn")}
          </Typography>
          <Box>
            <DatePicker
              customInput={
                <OutlinedInput
                  variant="outlined"
                  className="full-width"
                  color="primary"
                  endAdornment={
                    <InputAdornment position="end">
                      <EventIcon fontSize="small" style={{ cursor: 'pointer' }} />
                    </InputAdornment>
                  }
                />
              }
              selected={startDate !== "" ? new Date(startDate) : ""}
              // selected={formatStartDate}
              onChange={this.handleDateChange}
              name="startDate"
              placeholderText={t("componentData.paymentFileFilters.StartDate")}
              dateFormat="MM-dd-yyyy"
              className={classes.datePicker}
              locale={this.props.i18n.language}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h3" className={classes.filterText}>
            {t("componentData.paymentFileFilters.to")}
          </Typography>
          <Box>
            <DatePicker
              customInput={
                <OutlinedInput
                  variant="outlined"
                  className="full-width"
                  color="primary"
                  endAdornment={
                    <InputAdornment position="end">
                      <EventIcon fontSize="small" style={{ cursor: 'pointer' }} />
                    </InputAdornment>
                  }
                />
              }
              selected={endDate !== "" ? new Date(endDate) : ""}
              onChange={this.handleEndDateChange}
              name="endDate"
              placeholderText={t("componentData.paymentFileFilters.EndDate")}
              dateFormat="MM-dd-yyyy"
              className={classes.datePicker}
              locale={this.props.i18n.language}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box mx={4} my={1} style={{ color: "red", fontSize: "11px" }}>{errorText}</Box>
        </Grid>

        <Grid
          container
          item
          direction="row"
          justify="space-between"
          spacing={3}
        >
          <Grid item xs={this.props.i18n.language === "fr" ? 12 : true}>
            <Box mt={4}>
              <Button
                type="submit"
                fullWidth={this.props.i18n.language === "fr" ? true : false}
                style={
                  this.props.i18n.language === "fr" ? { marginTop: 16 } : {}
                }
                variant="outlined"
                color="primary"
                size="large"
                className={classes.filterBTN}
                onClick={resetSupplierFilter}
              >
                {t("componentData.paymentFileFilters.RESETFILTER")}
              </Button>
            </Box>
          </Grid>
          {processing ? (
            <CircularProgress color="primary" />
          ) : (
            <Grid item xs={this.props.i18n.language === "fr" ? 12 : true}>
              <Box mt={this.props.i18n.language === "fr" ? 2 : 4}>
                <Button
                  type="submit"
                  fullWidth={this.props.i18n.language === "fr" ? true : false}
                  variant="contained"
                  size="large"
                  color="primary"
                  disableElevation
                  className={classes.filterBTN}
                  onClick={
                    () => {
                      const isNotValid = this.validate(startDate, endDate);
                      if (!isNotValid) {
                        applySupplierFilter();
                      }
                    }
                  }
                >
                  {t("componentData.paymentFileFilters.APPLYFILTER")}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid >
    );
  }
}

export default withTranslation()(withStyles(styles)(PaymentFileFilters));
