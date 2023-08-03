import React from 'react';
import {
  Typography,
  Grid,
  Box,
  Button,
  Chip,
  InputAdornment,
  OutlinedInput,
  IconButton,
} from '@material-ui/core';
import { connect } from 'react-redux';
import EventIcon from '@material-ui/icons/Event';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../styles';
import { TextField } from '~/components/Forms';
import { withTranslation } from 'react-i18next';
import SearchIcon from '@material-ui/icons/Search';
import Checkbox from '~/components/Forms/Checkbox';
import moment from 'moment';
import { getFormattedDate } from '~/views/Reports/Report/utils';
import en from "date-fns/locale/es";
import fr from "date-fns/locale/es";
import es from "date-fns/locale/es";
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("es", es);

class B2CReviewPayeeUpdateFilters extends React.Component {
  state = {
    dateRangeError: false,
    invalidDateError: false
  }
  isValidDate = (dateString) => {
    const date = dateString ? moment(dateString).format('MM/DD/YYYY') : '';
    let valid = true;
    // First check for the pattern
    if (date && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
      valid = false;
    }
    return valid;
  };

  handleDateValidation = (fromDate,toDate)=>{
    if(fromDate && toDate && this.isValidDate(fromDate) && this.isValidDate(toDate)){
      if(getFormattedDate(fromDate) > getFormattedDate(toDate)){
        return true;
      } else {
        return false;
      }
    }
    return false;
  }


  handleSearch = (event) => {
    if (event.keyCode === 13) {
      this.handleSubmit();
    }
  };

  handleSubmit = () => {
    const {startDate, endDate, applyPayeeFilter } = this.props;
        const isValidDateRangeError = this.handleDateValidation(startDate, endDate);
        const isValidDates = this.isValidDate(startDate) && this.isValidDate(endDate);
        this.setState({
          dateRangeError : isValidDateRangeError,
          invalidDateError: !isValidDates
        }, () => {
          if (!this.state.dateRangeError && ! this.state.invalidDateError) {
            applyPayeeFilter();
          }
        })
    }

  render() {
    const {
      classes,
      startDate,
      endDate,
      payeeIdSearch,
      tempDateFilter,
      handleDateFilterChange,
      handleStartDateChange,
      handleEndDateChange,
      handlePayeeId,
      resetPayeeFilter,
      typeOfPayeeUpdates,
      handleChipClick,
      t,
    } = this.props;
    const {isPayeeChoicePortal} = this.props.user;
    const { dateRangeError } = this.state;
    return (
      <>
        <Grid>
          <Grid item xs={12}>
            <div className={classes.filterLabel}>
              <Typography variant="h4" className={classes.filterText}>
              {t("componentData.supplierUdateList.Payee ID")}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Box my={1}>
              <TextField
                fullWidth={true}
                placeholder={t("componentData.supplierUdateList.searchByPayeeID")}
                inputProps={{
                  'aria-label': t("componentData.supplierUdateList.searchByPayeeID"),
                }}
                value={payeeIdSearch || ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="id"
                        onClick={this.handleSubmit}
                        onMouseDown={null}
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => handlePayeeId(event.target.value)}
                onKeyDown={this.handleSearch}
                variant="outlined"
                size="small"
                style={{ color: '#000' }}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <Box className={classes.filterLabel}>
              <Typography
                variant="h4"
                className={(classes.filterText, classes.dateFilter)}
              >
                {t('componentData.b2cSupplierUpdateList.dateFilter')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box mb={2} className={classes.gridBox}>
              <Checkbox
                className={classes.checkBox}
                onChange={() => handleDateFilterChange(1)}
                label={t('componentData.b2cSupplierUpdateList.Today')}
                checked={tempDateFilter === 1}
                icon={''}
                index={1}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box mb={2} className={classes.gridBox}>
              <Checkbox
                className={classes.checkBox}
                onChange={() => handleDateFilterChange(2)}
                label={t('componentData.b2cSupplierUpdateList.Last 7 Days')}
                checked={tempDateFilter === 2}
                icon={''}
                index={2}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box mb={2} className={classes.gridBox}>
              <Checkbox
                className={classes.checkBox}
                onChange={() => handleDateFilterChange(3)}
                label={t('componentData.b2cSupplierUpdateList.Last 30 Days')}
                checked={tempDateFilter === 3}
                icon={''}
                index={3}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box mb={2} className={classes.gridBox}>
              <Checkbox
                className={classes.checkBox}
                onChange={() => handleDateFilterChange(4)}
                label={t('componentData.b2cSupplierUpdateList.Previous Month')}
                checked={tempDateFilter === 4}
                icon={''}
                index={4}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box mb={2} className={classes.gridBox}>
              <Checkbox
                className={classes.checkBox}
                onChange={() => handleDateFilterChange(0)}
                label={t('componentData.b2cSupplierUpdateList.Custom')}
                checked={tempDateFilter === 0}
                icon={''}
                index={0}
              />
            </Box>
          </Grid>

          {tempDateFilter === 0 && (
            <Grid container>
              <Grid item xs={12} sm={12}>
                <Box width={1} mb={2} position="relative">
                  <DatePicker
                    id="starDate"
                    locale={this.props.i18n.language}
                    selected={startDate}
                    onChange={handleStartDateChange}
                    name="startDate"
                    placeholderText={t(
                      'componentData.b2cSupplierUpdateList.startDate'
                    )}
                    dateFormat="MM-dd-yyyy"
                    className={classes.datePicker}
                    customInput={
                      <OutlinedInput
                        variant="outlined"
                        className="full-width"
                        color="primary"
                        endAdornment={
                          <InputAdornment position="end">
                            <EventIcon fontSize="small" style={{cursor: 'pointer'}}/>
                          </InputAdornment>
                        }
                      />
                    }
                  />
                  {startDate && !this.isValidDate(startDate) && (
                    <span className={classes.errorMessage}>
                      {t('componentData.b2cSupplierUpdateList.validDate')}
                    </span>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={12}>
                <Box width={1} mb={2} position="relative">
                  <DatePicker
                    popperPlacement="bottom-start"
                    locale={this.props.i18n.language}
                    selected={endDate}
                    onChange={handleEndDateChange}
                    name="endDate"
                    placeholderText={t(
                      'componentData.b2cSupplierUpdateList.endDate'
                    )}
                    dateFormat="MM-dd-yyyy"
                    className={classes.datePicker}
                    customInput={
                      <OutlinedInput
                        variant="outlined"
                        className="full-width"
                        color="primary"
                        endAdornment={
                          <InputAdornment position="end">
                            <EventIcon fontSize="small" style={{cursor: 'pointer'}}/>
                          </InputAdornment>
                        }
                      />
                    }
                  />
                  
                  {endDate && (!this.isValidDate(endDate) || dateRangeError) && (
                    <span className={classes.errorMessage}>
                      {dateRangeError ? isPayeeChoicePortal ? t('componentData.SmallTxt.dateCompareUSbank') : t('componentData.SmallTxt.dateCompare') : t("componentData.supplierUdateList.validDate")}
                    </span>
                  )}
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid container>
          <Grid item xs={12}>
            <div className={classes.filterLabel}>
              <Typography variant="h4" className={classes.filterText}>
                {t('componentData.b2cSupplierUpdateList.typeOfPayeeUpdate')}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box mt={2}>
            {typeOfPayeeUpdates.length > 0 &&
                  typeOfPayeeUpdates.map((item, index) => (
                      <Box display="block">
                        <Chip
                          key={item.id}
                          label={t(`componentData.b2cSupplierUpdateList.${item.label}`)}
                          size="medium"
                          className={
                            item.selected ? classes.itemSelected : classes.item
                          }
                          variant={item.selected ? "default" : "outlined"}
                          color="primary"
                          onClick={(event) =>
                            handleChipClick(item, index)
                          }
                          /> 
                </Box>))}
            </Box>    
          </Grid>
        </Grid>
        <Grid container className={classes.filterLabel}>
          <Grid item xs={this.props.i18n.language === 'fr' ? 12 : 6}>
            <Button
              type="submit"
              fullWidth={this.props.i18n.language === 'fr' ? true : false}
              style={
                this.props.i18n.language === 'fr' ? { margin: '20px 0' } : {}
              }
              variant="outlined"
              color="primary"
              size="large"
              onClick={resetPayeeFilter}
            >
              {t('componentData.SmallTxt.resetFilter')}
            </Button>
          </Grid>
          <Grid item xs={this.props.i18n.language === 'fr' ? 12 : 6}>
            <Button
              type="submit"
              fullWidth={this.props.i18n.language === 'fr' ? true : false}
              disableElevation
              variant="contained"
              size="large"
              color="primary"
              onClick={this.handleSubmit}
            >
              {t('componentData.SmallTxt.applyFilter')}
            </Button>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withTranslation() (
  connect((state) => ({ ...state.user }))(withStyles(styles)(B2CReviewPayeeUpdateFilters))
)