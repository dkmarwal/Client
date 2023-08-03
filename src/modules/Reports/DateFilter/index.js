import React from 'react';
import { Box, Button, CircularProgress } from '@material-ui/core';
import { Checkbox } from "~/components/Forms";
import CustomDateRange from "~/components/Filter/customDateRange";
import { withStyles } from '@material-ui/styles';
import styles from '../styles';
import { withTranslation } from 'react-i18next';

const DateFilter = (props) => {
  const { filterList, selectedDateFilter, startDate, endDate, classes, handleChange, handleDateChange, resetFilter, applyFilter, processing, t } = props;

  const filterListOptions = filterList && filterList.map((item, index) => {
    return { id: item.id, label: item.name, selected: item.id == selectedDateFilter };
  }) || [];

  return (
    <Box display="flex" className={classes.root} width="100%" flexDirection="column">
      <Box p={1} display="flex" justifyContent="flex-start">
        <Box display="flex" justifyContent="center" width="100%" flexWrap="wrap">
          {filterListOptions && filterListOptions.map((item, index) => {
            return <Box p={1} pb={2} width="100%">
              <Checkbox
                onChange={(event, index, checked) => handleChange("selectedDateFilter", event, item.id)}
                label={item.label}
                checked={item.selected}
                index={index}
              />
            </Box>
          })
          }
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-start">
        <CustomDateRange
          startDate={startDate}
          endDate={endDate}
          handleDateChange={handleDateChange}
        />
      </Box>

      <Box p={1} display="flex" justifyContent="center">
        <Box mt={2}>
          <Button
            type="submit"
            fullWidth={false}
            variant="outlined"
            color="primary"
            className={classes.btnScpace}
            onClick={resetFilter}
          >
            {t('componentData.reportsComp.RESETFILTER')}
          </Button>
        </Box>
        <Box mt={2} pl={2}>
          {processing ? (
            <CircularProgress color="primary" />
          ) : (
            <Button
              type="submit"
              fullWidth={false}
              variant="contained"
              color="primary"
              className={classes.btnScpace}
              onClick={applyFilter}
            >
              {t('componentData.reportsComp.APPLYFILTER')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
export default withTranslation()(withStyles(styles)(DateFilter));
