import React from "react";
import {
  Box,
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";
import clsx from "clsx";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import { styles } from "./styles";
import { withTranslation } from 'react-i18next';

const FilterCard = ({ classes, record, selected, onSelectPaymentGroup, t }) => {
  const {
    Figure,
    PaymentCount,
    PaymentStatus,
    PaymentStatusID,
    StatusMapping,
  } = record;

  const onSelectPaymentType = () => {   
    onSelectPaymentGroup(PaymentStatusID, StatusMapping);
  };
  return (
    <Paper
      className={
        selected
          ? clsx(classes.paymentFilterBox, classes.selected)
          : classes.paymentFilterBox
      }
      elevation={3}
      onClick={onSelectPaymentType}
    >
      <Typography variant="h1">
        {PaymentCount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}{" "}
      </Typography>
      <Typography variant="h5"> {PaymentStatus}</Typography>
      {Boolean(Figure) && (
        <Box display="flex" alignItems="center">
          <span>
            {"-1".includes("-") ? (
              <ArrowDownwardIcon className={classes.errorColor} />
            ) : (
              <ArrowUpwardIcon />
            )}
            <div className={"Figure".includes("-") ? classes.errorColor : ""}>
              {" "}
              {Figure}{" "}
            </div>
          </span>
          {t('componentData.filter.fromMonthPrior')}
        </Box>
      )}
    </Paper>
  );
};

export default withTranslation()(withStyles(styles)(FilterCard));
