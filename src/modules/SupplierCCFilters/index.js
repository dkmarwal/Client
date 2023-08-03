import React from "react";
import {
  Typography,
  Grid,
  Box,
  Button,
  MenuItem,
  CircularProgress,
  InputAdornment,
  Popover,
  IconButton,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,ClickAwayListener,
} from "@material-ui/core";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import { TextField } from "~/components/Forms";
import { withTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import moment from "moment";

class SupplierCCFilters extends React.Component {
  state = {
    processing: false,
    committedPopover: false,
    hasBothDateSelected: true,
    invalidMaxSpend: false,
  };

  handleCommittedPopover = (event) => {
    this.setState({ committedPopover: event.currentTarget });
  };

  handleCommittedPopoverClose = () => {
    const { minSpend, maxSpend } = this.props;
    if (maxSpend != 0 && minSpend > maxSpend) {
      this.setState({ invalidMaxSpend: true });
    } else {
      this.setState({ committedPopover: false });
    }
  };

  handleCommittedBlur = () => {
    const { minSpend, maxSpend } = this.props;
    if (maxSpend != 0 && minSpend > maxSpend) {
      this.setState({ invalidMaxSpend: true });
    } else {
      this.setState({ invalidMaxSpend: false });
    }
  };

  closeDatePickerPopup = () => {
    const { startDate, endDate } = this.props;
    if (Boolean(startDate) && Boolean(endDate)) {
      this.setState({
        dateToggleOpen: false,
        hasBothDateSelected: true,
      });
    } else {
      this.setState({
        hasBothDateSelected: false,
      });
    }
  };

  render() {
    const {
      processing,
      committedPopover,
      dateToggleOpen,
      hasBothDateSelected,
      invalidMaxSpend,
    } = this.state;
    const {
      classes,
      name,
      id,
      expectedResultList,
      expectedResult,
      committedSpendList,
      handleChangeInput,
      applySupplierFilter,
      resetSupplierFilter,
      handleExpectedResult,
      campaignVendorList,
      campaignList,
      t,
      minSpend,
      maxSpend,
      onRangeChange,
      handleRangeClick,
      committedLabel,
      startDate,
      endDate,
      selectedVendorId,
      selectedCampaignId,
      selectedCurrency,
      handleVendorChange,
      handleCampaignChange,
      handleCurrencyChange,
      onboardDuringList,
      selectedDateID,
      handleOnboardDuring,
    } = this.props;
    return (
      <Grid className="vendorInfo overflowAuto">
        <Grid item xs={12}>
          <Box>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="name"
              label={t("componentData.supplierFilters.PayeeName")}
              variant="outlined"
              value={name}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <TextField
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              name="id"
              label={t("componentData.supplierFilters.PayeeID")}
              variant="outlined"
              value={id}
              onChange={handleChangeInput}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box my={1}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              label={t("componentData.supplierFilters.ExpectedResult")}
              variant="outlined"
              value={expectedResult}
              onChange={handleExpectedResult}
            >
              {expectedResultList &&
                expectedResultList.map((option) => (
                  <MenuItem
                    id={`expected_${option.id}`}
                    key={`expected_${option.id}`}
                    value={option.id}
                  >
                    {option.expectedValue}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box my={1}>
            {/* <Button
              variant="outlined"
              fullWidth
              size="large"
              className={classes.selectBtn}
              onClick={this.handleCommittedPopover}
            >
              {committedLabel()}
              <InputAdornment position="end">
                <ArrowDropDownIcon />
              </InputAdornment>
            </Button> */}
              <TextField
                  className={classes.inputBox}
                  // size="small"
                  color="secondary"
                  name="commitedSpend"
                  label="Enrolled Spend"
                  value={committedLabel()}
                  onClick={() => this.setState({ committedPopover: true })}
                  fullWidth={true}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <ArrowDropDownIcon style={{"color":"#757575"}} />
                      </InputAdornment>
                    ),
                  }}
                />
                {committedPopover && 
                <>
                <ClickAwayListener
                onClickAway={()=>this.setState({ committedPopover: false })}>
                <Box p={3} className={classes.annualPopup}>
                <Box mb={2}>
                  {committedSpendList &&
                    committedSpendList.length > 0 &&
                    committedSpendList.map((item) => (
                      <Typography className={classes.cursorPointer}>
                        <Box
                          onClick={handleRangeClick}
                          data-value={item.key}
                          pb={1}
                        >
                          {item.label}
                        </Box>
                      </Typography>
                    ))}
                </Box>
                <Box sx={{ maxWidth: "270px" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={5}>
                      <TextField
                        name="minSpend"
                        label="Min"
                        size="small"
                        placeholder="Min"
                        value={minSpend}
                        onChange={(e) => onRangeChange(e)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        name="maxSpend"
                        label="Max"
                        size="small"
                        placeholder="Max"
                        value={maxSpend}
                        onChange={(e) => onRangeChange(e)}
                        onBlur={this.handleCommittedBlur}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  {invalidMaxSpend && (
                    <Typography className={classes.error}>
                      {t("componentData.supplierFilters.committedSpendErr")}
                    </Typography>
                  )}
                </Box>
              </Box>
            </ClickAwayListener>
            </>
            }
            {/* <Popover
              open={Boolean(committedPopover)}
              anchorEl={committedPopover}
              onClose={this.handleCommittedPopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              className={classes.popoverMargin}
            >
              
            </Popover> */}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box my={1}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              label={t("componentData.supplierFilters.Vendor")}
              variant="outlined"
              value={selectedVendorId}
              onChange={handleVendorChange}
            >
              <MenuItem id="" value=" ">
                All Vendors
              </MenuItem>
              {campaignVendorList &&
                campaignVendorList.map((option) => (
                  <MenuItem
                    id={`vendor_${option.campaignVendorId}`}
                    key={`vendor_${option.campaignVendorId}`}
                    value={option.campaignVendorId}
                  >
                    {option.campaignVendorName}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box my={1}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              label={t("componentData.supplierFilters.Campaign")}
              variant="outlined"
              value={selectedCampaignId}
              onChange={handleCampaignChange}
            >
              {campaignList &&
                campaignList.map((option) => (
                  <MenuItem
                    id={`campaign_${option.ccCampaignId}`}
                    key={`campaign_${option.ccCampaignId}`}
                    value={option.ccCampaignId}
                  >
                    {option.ccCampaignName}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box my={1}>
            <TextField
              select
              fullWidth={true}
              color="secondary"
              autoComplete="off"
              label={t("componentData.supplierFilters.OnboardedDuring")}
              variant="outlined"
              value={selectedDateID}
              onChange={(e) => handleOnboardDuring(e)}
            >
              {onboardDuringList &&
                onboardDuringList.map((option) => (
                  <MenuItem
                    id={`onboarded_${option.key}`}
                    key={`onboarded_${option.key}`}
                    value={option.key}
                  >
                    {option.label}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box className={classes.enrollMidSec}>
            <Box className="DateBox">
              <Box className="DateBoxTop">
                <TextField
                  id="dateRangeBox"
                  variant="outlined"
                  label={t("componentData.supplierFilters.DateRange")}
                  fullWidth={true}
                  autoComplete="off"
                  value={
                    startDate &&
                    endDate &&
                    `${moment(startDate).format("D MMM YYYY")} - ${moment(
                      endDate
                    ).format("D MMM YYYY")}`
                  }
                  onFocus={() => this.setState({ dateToggleOpen: true })}
                  InputLabelProps={{ shrink: startDate ? true : false }}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment>
                        <IconButton className="dateIcon">
                          <ArrowDropDownIcon
                            size="small"
                            onClick={() =>
                              this.setState({ dateToggleOpen: true })
                            }
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {Boolean(dateToggleOpen) && (
                <Box className={"datePickerBox"}>
                  <div class="arrowUp">
                    <ArrowDropUpIcon />
                  </div>
                  <Box component={"div"} className="datePicker">
                    <DatePicker
                      monthsShown={1}
                      selected={startDate}
                      onChange={(dates) => this.props.handleDateOnChange(dates)}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                    />
                  </Box>

                  <Box
                    component={"div"}
                    style={{
                      float: "left",
                      width: "100%",
                    }}
                  >
                    {!Boolean(hasBothDateSelected) && (
                      <Typography
                        variant="h2"
                        className={classes.error}
                        style={{
                          float: "left",
                          margin: "17px 0 0 20px",
                          fontSize: "14px",
                          color: "#E03617",
                          fontWeight: "300",
                        }}
                      >
                         {t("componentData.dashboard.selectDateBoth")}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        float: "right",
                        margin: "10px 6px 0 0",
                        width: "110px",
                      }}
                      onClick={() => this.closeDatePickerPopup()}
                    >
                      {t("componentData.dashboard.Done")}
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box my={1}>
            <FormLabel id="demo-controlled-radio-buttons-group">{t("componentData.supplierFilters.Currency")}</FormLabel>
            <RadioGroup row aria-label="currency" name="period" value={selectedCurrency} onChange={(e) => handleCurrencyChange(e)}>
                <FormControlLabel value="ALL" control={<Radio />} label={t("componentData.supplierFilters.Both")} />
                <FormControlLabel value="USD" control={<Radio />} label={t("componentData.supplierFilters.USD")} />
                <FormControlLabel value="CAD" control={<Radio />} label={t("componentData.supplierFilters.CAD")} />
            </RadioGroup>
          </Box>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Button
              type="submit"
              size="large"
              fullWidth={true}
              variant="outlined"
              color="primary"
              onClick={resetSupplierFilter}
            >
              {t("componentData.supplierFilters.resetFilter")}
            </Button>
          </Grid>
          {processing ? (
            <CircularProgress color="primary" />
          ) : (
            <Grid item xs={12}>
              <Button
                disableElevation
                size="large"
                type="submit"
                fullWidth={true}
                variant="contained"
                color="primary"
                onClick={applySupplierFilter}
              >
                {t("componentData.supplierFilters.applyFilter")}
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default withTranslation()(withStyles(styles)(SupplierCCFilters));
