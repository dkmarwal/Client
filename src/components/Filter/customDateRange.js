import React, { Component } from "react";
import {
  Box,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { withTranslation } from 'react-i18next';
import en from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";
import es from "date-fns/locale/es";

const localeMap = {
  en,
  fr:frLocale,
  es,
};


class CustomDateRange extends Component {
  constructor() {
    super();
    this.state = {
      startDate: null,
      endDate: null,
    };
  }

  handleStartDateChange = (date) => {    
    this.setState({ startDate: date });
    this.props.handleDateChange("startDate", date);
  };

  handleEndDateChange = (date) => {
    this.setState({ endDate: date });
    this.props.handleDateChange("endDate", date);
  };

  render() {
    const { startDate, endDate,i18n,t } = this.props;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[i18n.language]}>
        <Box display="flex">
            <Box p={1}>
                <KeyboardDatePicker
                  autoOk={true}
                  clearable={true}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="startDate"
                  name="startDate"
                  label= {t('componentData.filter.StartDate')}
                  value={startDate}
                  onChange={this.handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': t('componentData.filter.StartDate'),
                  }}
                />
            </Box>
            <Box p={1}>
                <KeyboardDatePicker
                  autoOk={true}
                  clearable={true}
                  disableToolbar
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="endDate"
                  name="endDate"
                  label= {t('componentData.filter.EndDate')}
                  value={endDate}
                  onChange={this.handleEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': t('componentData.filter.EndDate'),
                  }}
                />
            </Box>
        </Box>
      </MuiPickersUtilsProvider>
    );
  }
}

export default withTranslation()(CustomDateRange);
