import React, { Fragment } from 'react';
import { Grid, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '~/components/Forms/CheckboxDashboard';
import { filters } from '~/views/Reports/Report/const';
import { styles } from './styles';
import { withTranslation } from 'react-i18next';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import { getDateRange, getFormattedDate } from '~/views/Reports/Report/utils';
import {defaultFromDate, defaultToDate,defaultReportData} from '~/views/Reports/Report/const'
import en from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";
import es from "date-fns/locale/es";

const localeMap = {
  en,
  fr:frLocale,
  es,
};

const CommonDateFilter = (props) => {
  const {
    classes,
    t,
    selectedFilter,
    handleChange,
    fromDate,
    toDate,
    setShowDateFilter,
    validation,
    setValidation,
    i18n
  } = props;
  const [currentDateValues, setCurrentDateValues] = React.useState({
    fromDate: fromDate,
    toDate: toDate,
    dateFilter: selectedFilter,
  });

  React.useEffect(() => {
    if (!fromDate && !toDate) {
      setCurrentDateValues({ ...currentDateValues, dateFilter: null });
    }
  }, [selectedFilter, fromDate, toDate]);

  const resetFilter = () => {
    setCurrentDateValues({ fromDate: defaultFromDate, toDate: defaultToDate, dateFilter: defaultReportData.dateFilter });
    handleChange({ fromDate: defaultFromDate, toDate: defaultToDate, dateFilter: defaultReportData.dateFilter });
    // setShowDateFilter(false);
    setValidation({ ...validation, fromDate: false, toDate: false });
  };
  const handleValueChange = (name, value) => {
    if (name !== 'dateFilter' || currentDateValues.dateFilter !== value) {
      let currentSelectedDates = {};
      if (name === 'dateFilter') {
        if (value !== 'CUSTOM') {
          currentSelectedDates = getDateRange(value);
          setCurrentDateValues({
            [name]: value,
            fromDate: currentSelectedDates.fromDate,
            toDate: currentSelectedDates.toDate,
          });
          setValidation({ ...validation, fromDate: false, toDate: false });
        } else {
          setCurrentDateValues({
            ...currentDateValues,
            [name]: value,
            fromDate: null,
            toDate: null,
          });
        }
      } else {
        setValidation({ ...validation, [name]: !Boolean(value) });
        setCurrentDateValues({ ...currentDateValues, [name]: value });
      }
    }
  };
  const applyFilter = () => {
    if (!currentDateValues.dateFilter) {
      setShowDateFilter(false);
    } else if (currentDateValues.fromDate && currentDateValues.toDate) {
      if (
        Date.parse(currentDateValues.fromDate) >
        Date.parse(currentDateValues.toDate)
      ) {
        setValidation({ ...validation, fromDate: true, toDate: true });
      } else {
        handleChange(currentDateValues);
        setShowDateFilter(false);
      }
    } else {
      if (!currentDateValues.fromDate && !currentDateValues.toDate) {
        setValidation({ ...validation, fromDate: true, toDate: true });
      } else if (!currentDateValues.toDate) {
        setValidation({ ...validation, toDate: true });
      } else if (!currentDateValues.fromDate) {
        setValidation({ ...validation, fromDate: true });
      }
    }
  };
  return (
    <Fragment>
      <Grid item container spacing={2} className={classes.heght100}>
        {filters &&
          filters.map((item, index) => (
            <Grid className={classes.gridBox}>
              <Checkbox
                key={item.value}
                checked={currentDateValues.dateFilter === item.value}
                label={t(`componentData.dashboard.${item.label}`)}
                value={item.value}
                onChange={() => handleValueChange('dateFilter', item.value)}
              />
            </Grid>
          ))}
      </Grid>
      {currentDateValues.dateFilter === 'CUSTOM' && (
        <Grid container>
          <Grid item className={classes.dateFieldItem}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[i18n.language]}>
              <KeyboardDatePicker
                disableFuture
                autoOk={true}
                clearable={true}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="fromDate"
                name="fromDate"
                initialFocusedDate={new Date()}
                label={t('componentData.addView.SelectFromDate')}
                value={currentDateValues.fromDate}
                maxDate={moment().subtract(0, 'days')}
                shouldDisableDate={(dateVal) =>
                  currentDateValues.toDate &&
                  getFormattedDate(dateVal) >
                    getFormattedDate(currentDateValues.toDate)
                }
                error={validation.fromDate}
                onChange={(dateValue) =>
                  handleValueChange('fromDate', dateValue)
                }
                KeyboardButtonProps={{
                  'aria-label': 'From Date',
                }}
                InputProps={{ readOnly: true }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item className={classes.dateFieldItem}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[i18n.language]}>
              <KeyboardDatePicker
                autoOk={true}
                clearable={true}
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="toDate"
                name="toDate"
                initialFocusedDate={new Date()}
                label={t('componentData.addView.SelectToDate')}
                value={currentDateValues.toDate}
                maxDate={moment().subtract(0, 'days')}
                shouldDisableDate={(dateVal) =>
                  currentDateValues.fromDate &&
                  getFormattedDate(dateVal) <
                    getFormattedDate(currentDateValues.fromDate)
                }
                error={validation.toDate}
                helperText={
                  validation.toDate &&
                  validation.fromDate &&
                  currentDateValues.fromDate &&
                  currentDateValues.toDate &&
                  t('componentData.SmallTxt.dateCompare')
                }
                onChange={(dateValue) => handleValueChange('toDate', dateValue)}
                KeyboardButtonProps={{
                  'aria-label': 'To Date',
                }}
                InputProps={{ readOnly: true }}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      )}
      <Grid container item xs={12} direction="row" justify="space-around">
        <Grid item xs={5}>
          <Button
            type="submit"
            fullWidth={false}
            variant="outlined"
            color="primary"
            size="large"
            className={classes.filterBTN}
            onClick={() => {
              resetFilter();
            }}
          >
            {t('componentData.dashboardDateFilter.RESETFILTER')}
          </Button>
        </Grid>
        <Grid item xs={5}>
          <Button
            type="submit"
            fullWidth={false}
            variant="contained"
            size="large"
            color="primary"
            className={classes.filterBTN}
            onClick={() => applyFilter()}
          >
            {t('componentData.dashboardDateFilter.APPLYFILTER')}
          </Button>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withTranslation()(withStyles(styles)(CommonDateFilter));
