import React, { useState } from "react";
import {
  Grid,
  Box,
  Button,
  OutlinedInput,
  InputAdornment,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "~/components/Forms/CheckboxDashboard";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EventIcon from "@material-ui/icons/Event";
import { styles } from "./styles";
import { withTranslation } from "react-i18next";
import en from "date-fns/locale/es";
import fr from "date-fns/locale/es";
import es from "date-fns/locale/es";
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("es", es);

const DashboardDateFilter = ({
  filters,
  selectedFilter,
  classes,
  handleFilterSelect,
  selectedView,
  selectedCurrency,
  clientId,
  filterData,
  filter,
  changeFilter,
  resetFilter,
  FromDate,
  ToDate,
  t,
  i18n
}) => {
  const [_fromDate, setFromDate] = useState(filter && filter["fromDate"]);
  const [_toDate, setToDate] = useState(filter && filter["toDate"]);
  const [filterIndex, setFilterIndex] = useState(selectedFilter);
  const [errors, setErrors] = useState({});

  const validate = () => {
    if(filterIndex === 7){
      let flag = false;
      if (_fromDate > _toDate) {
        flag = true;
        setErrors({
          ...errors,
          date: t(`componentData.SmallTxt.dateCompare`),
        });
      }
      else if (!Boolean(_fromDate) && !Boolean(_toDate)) {
        flag = true;
        setErrors({
          ...errors,
          date: t(`componentData.SmallTxt.FromToDateRequired`),
        });
      }
      else if (!Boolean(_fromDate)) {
        flag = true;
        setErrors({
          ...errors,
          date: t(`componentData.SmallTxt.FromDateRequired`),
        });
      }
      else if (!Boolean(_toDate)) {
        flag = true;
        setErrors({
          ...errors,
          date: t(`componentData.SmallTxt.ToDateRequired`),
        });
      }      
      else {
        setErrors({
          ...errors,
        });
      }
      return flag;
    }
    else{
      let flag = false;
      if (_fromDate > _toDate) {
        flag = true;
        setErrors({
          ...errors,
          date: t(`componentData.SmallTxt.dateCompare`),
        });
      } else {
        setErrors({
          ...errors,
        });
      }
      return flag;
    }
    
  };

  const onChangeFilter = (index) => {
    setFilterIndex(index);
    switch (index) {
      case 1:
        filter["year"] = 0;
        filter["month"] = undefined;
        filter["lastDays"] = 0;
        filter["quarter"] = "";
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 2:
        let _month = new Date().getMonth();
        let _year = new Date().getFullYear();
        if (_month === 0) {
          _month = 12;
          _year = _year - 1;
        }
        filter["year"] = _year;
        filter["month"] = _month;
        filter["quarter"] = "";
        filter["lastDays"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 3:
        let today = new Date();
        let quarter = Math.ceil(today.getMonth() / 3);
        let year;
        let previousQuarter = 0;
        if (quarter <= 1) {
          previousQuarter = 4;
          year = new Date().getFullYear() - 1;
        } else {
          previousQuarter = quarter - 1;
          year = new Date().getFullYear();
        }
        filter["month"] = undefined;
        filter["quarter"] = `Q${previousQuarter}`;
        filter["year"] = year;
        filter["lastDays"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 4:
        filter["year"] = new Date().getFullYear() - 1;
        filter["lastDays"] = undefined;
        filter["quarter"] = undefined;
        filter["month"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 5:
        filter["lastDays"] = 7;
        filter["year"] = undefined;
        filter["quarter"] = undefined;
        filter["month"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 6:
        filter["lastDays"] = 30;
        filter["year"] = undefined;
        filter["quarter"] = undefined;
        filter["month"] = undefined;
        filter["fromDate"] = undefined;
        filter["toDate"] = undefined;
        changeFilter(filter);
        break;
      case 7:
        filter["lastDays"] = undefined;
        filter["year"] = undefined;
        filter["quarter"] = undefined;
        filter["month"] = undefined;
        changeFilter(filter);
        break;
      default:
    }
  };

  return (
    <Grid item container className={classes.heght100}>
      {filters &&
        filters.map((item, index) => (
          <Grid className={classes.gridBox}>
            <Checkbox
              checked={filterIndex === index + 1}
              label={t(`componentData.dashboard.${item.label}`)}
              index={index + 1}
              onChange={(e, index, isChecked) => onChangeFilter(index)}
            />
          </Grid>
        ))}

      {filterIndex === 7 && (
        <Grid container>
          <Grid item xs={12} sm={12}>
            <Box md={2}>
              <DatePicker
                customInput={
                  <OutlinedInput
                    variant="outlined"
                    className="full-width"
                    color="primary"
                    endAdornment={
                      <InputAdornment position="end">
                        <EventIcon fontSize="small" style={{cursor : 'pointer'}}/>
                      </InputAdornment>
                    }
                  />
                }
                selected={_fromDate || FromDate}
                onKeyDown={(e) => {
                  e.preventDefault();
                  return false;
                }}
                onChange={(val) => {
                  setFromDate(val);
                }}
                // onChange={this.handleDateChange}
                // value={}
                name="FromDate"
                placeholderText={t("componentData.dashboard.FromDate") || ""}
                dateFormat="MM-dd-yyyy"
                className={classes.datePicker}
                locale={i18n.language}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Box mt={2}>
              <DatePicker
                customInput={
                  <OutlinedInput
                    variant="outlined"
                    className="full-width"
                    color="primary"
                    endAdornment={
                      <InputAdornment position="end">
                        <EventIcon fontSize="small" style={{cursor : 'pointer'}}/>
                      </InputAdornment>
                    }
                  />
                }
                selected={_toDate || ToDate}
                onKeyDown={(e) => {
                  e.preventDefault();
                  return false;
                }}
                onChange={(val) => {
                  setToDate(val);
                }}
                // value={}
                name="ToDate"
                placeholderText={t("componentData.dashboard.ToDate") || ""}
                dateFormat="MM-dd-yyyy"
                className={classes.datePicker}
                locale={i18n.language}
              />
            </Box>
          </Grid>
          <Box mx={4} my={1} style={{ color: "red", fontSize: "11px" }}>
            {errors["date"]}
          </Box>
        </Grid>
      )}
      <Grid container item direction="row" justify="space-between" spacing={3}>
        <Grid item xs>
          <Button
            type="submit"
            fullWidth={false}
            variant="outlined"
            color="primary"
            size="large"
            className={classes.filterBTN}
            onClick={() => {
              resetFilter();
              handleFilterSelect(2);
              setFilterIndex(2);
              setFromDate(undefined);
              setToDate(undefined);
              setErrors({});
            }}
          >
            {t("componentData.dashboardDateFilter.RESETFILTER")}
          </Button>
        </Grid>
        <Grid item xs>
          <Button
            type="submit"
            fullWidth={false}
            variant="contained"
            size="large"
            color="primary"
            className={classes.filterBTN}
            disableElevation
            onClick={() => {
              // handleFilterSelect(filterIndex);
              const isNotValid = validate();
              if (!isNotValid) {
                filterData(filterIndex, _fromDate, _toDate);
              }
            }}
          >
            {t("componentData.dashboardDateFilter.APPLYFILTER")}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withTranslation()(withStyles(styles)(DashboardDateFilter));
