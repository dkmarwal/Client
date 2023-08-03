import React, { useState } from 'react';
import {
  Grid,
  Box,
  Button,
  OutlinedInput,
  InputAdornment,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { styles } from './styles';
import { Checkbox } from '~/components/Forms';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import EventIcon from '@material-ui/icons/Event';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { getFormattedDate } from '~/views/Reports/Report/utils';
import en from "date-fns/locale/es";
import fr from "date-fns/locale/es";
import es from "date-fns/locale/es";
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("es", es);

const MyPaymentDateFilter = ({
  classes,
  updateFilter,
  selectedDateFilter,
  dateFilterList,
  onDateFilterChange,
  fromDate: _fromDate,
  toDate: _toDate,
  t,
  i18n
}) => {
  const [errorMsg,setErrorMsg]=useState(null)
  const onChangeFilter = (index) => {
    let FromDate = new Date();
    let ToDate = new Date();
    switch (index) {
      case 1:
        FromDate = '';
        ToDate = '';
        break;
      case 3:
        FromDate.setMonth(FromDate.getMonth() - 1);
        ToDate.setMonth(ToDate.getMonth() - 1);
        FromDate.setDate(1);
        ToDate.setFullYear(ToDate.getFullYear(), ToDate.getMonth() + 1, 0);
        break;
      case 4:
        FromDate.setMonth(FromDate.getMonth() - 3);
        ToDate.setMonth(ToDate.getMonth() - 1);
        FromDate.setDate(1);
        ToDate.setFullYear(ToDate.getFullYear(), ToDate.getMonth() + 1, 0);
        break;
      case 5:
        FromDate.setFullYear(new Date().getFullYear() - 1, 0, 1);
        ToDate.setFullYear(new Date().getFullYear() - 1, 11, 31);
        break;
      case 6:
        FromDate.setDate(new Date().getDate() - 7);
        break;
      case 7:
        FromDate.setDate(new Date().getDate() - 30);
        break;
      default:
    }
    onDateFilterChange(index, FromDate, ToDate);
  };

  const resetFilter = () => {
    onDateFilterChange(null);
  };

  const isValidDate = (dateString) => {
    const date = dateString ? moment(dateString).format('MM/DD/YYYY') : '';
    let valid = true;
    // First check for the pattern
    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
      valid = false;
    }
    return valid;
  };

  const handleDateValidation = (fromD,toD)=>{
    if(fromD && toD && isValidDate(fromD) && isValidDate(toD)){
      if(getFormattedDate(fromD)>getFormattedDate(toD)){
        setErrorMsg(t('componentData.SmallTxt.dateCompare'))
      } else {
        setErrorMsg(null)
      }
    }
  }

  return (
    <Grid item container direction="column" spacing={2}>
      {dateFilterList &&
        dateFilterList.length &&
        dateFilterList.map((item, index) => (
          <Grid className={classes.gridBox}>
            <Checkbox
              checked={selectedDateFilter === index + 1}
              label={t(`componentData.paymentDetailss.${item}`)}
              index={index + 1}
              onChange={(e, index, isChecked) => {
                onChangeFilter(index);
              }}
            />
          </Grid>
        ))}

      {selectedDateFilter === 8 && (
        <Grid>
          <Box m={2}>
            <DatePicker
              customInput={
                <OutlinedInput
                  variant="outlined"
                  className="full-width"
                  color="primary"
                  endAdornment={
                    <InputAdornment position="end">
                      <EventIcon className={classes.iconColor} style={{cursor : 'pointer'}}/>
                    </InputAdornment>
                  }
                  error={!isValidDate(_fromDate) || errorMsg}
                />
              }
              selected={_fromDate}
              onChange={(val) => {
                if (isValidDate(val)) {
                  handleDateValidation(val,_toDate)
                  onDateFilterChange(selectedDateFilter, val, _toDate);
                } else {
                  if(errorMsg){
                    setErrorMsg(null)
                  }
                  onDateFilterChange(selectedDateFilter, undefined, _toDate);
                }
              }}
              name="FromDate"
              placeholderText={t('componentData.SmallTxt.FromDate')}
              dateFormat="MM-dd-yyyy"
              className={classes.datePicker}
              locale={i18n.language}
            />
            {!isValidDate(_toDate) ? (
              <span className={classes.errorMessage}>
                {t('componentData.SmallTxt.validDate')}
              </span>
            ):null}

            <DatePicker
              customInput={
                <OutlinedInput
                  variant="outlined"
                  className="full-width"
                  color="primary"
                  endAdornment={
                    <InputAdornment position="end">
                      <EventIcon className={classes.iconColor} style={{cursor : 'pointer'}}/>
                    </InputAdornment>
                  }
                  error={!isValidDate(_toDate) || errorMsg}
                />
              }
              selected={_toDate}
              onChange={(val) => {
                if (isValidDate(val)) {
                  handleDateValidation(_fromDate,val)
                  onDateFilterChange(selectedDateFilter, _fromDate, val);
                } else {
                  if(errorMsg){
                    setErrorMsg(null)
                  }
                  onDateFilterChange(selectedDateFilter, _fromDate, undefined);
                }
              }}
              name="ToDate"
              placeholderText={t('componentData.SmallTxt.ToDate')}
              dateFormat="MM-dd-yyyy"
              className={classes.datePicker}
              locale={i18n.language}
            />
            {(!isValidDate(_fromDate) || errorMsg) ? (
              <span className={classes.errorMessage}>
                {errorMsg ?? t('componentData.SmallTxt.validDate')}
              </span>
            ) : null}
            
          </Box>
        </Grid>
      )}
      <Box>
        <Grid container item xs={12} direction="row" justify="space-around">
          <Grid item xs={5}>
            <Box mt={4}>
              <Button
                type="submit"
                fullWidth={false}
                variant="outlined"
                color="primary"
                size="large"
                className={classes.filterBTN}
                onClick={resetFilter}
              >
                {t('componentData.SmallTxt.resetFilter')}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={5}>
            <Box mt={4}>
              <Button
                type="submit"
                fullWidth={false}
                variant="contained"
                size="large"
                color="primary"
                className={classes.filterBTN}
                onClick={updateFilter}
              >
                {t('componentData.SmallTxt.applyFilter')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
};

export default withTranslation()(withStyles(styles)(MyPaymentDateFilter));
