import React, { Component } from "react";
import {
  Grid,
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

class FileProcessStatus extends Component {
  state = {};
  render() {
    const {
      classes,
      paymentFilesData,
      handleParentFileStatusClick,
    } = this.props;
    const { t } = this.props;
    return (
      <>
        <Grid container spacing={3} justify="space-between">
          {paymentFilesData &&
            paymentFilesData.length > 0 &&
            paymentFilesData.map((file, index) => {
              const fig = file.Figure;
              return (
                <Grid
                  className={classes.infoBox}
                  item
                  key={index}
                  onClick={() => handleParentFileStatusClick(file)}
                >
                  <Paper
                    className={
                      file.selected
                        ? clsx(classes.paymentFilterBox, classes.selected)
                        : classes.paymentFilterBox
                    }
                    elevation={3}
                  >
                    <Typography variant="h1">
                      {" "}
                      {file.FileCount.toString().replace(
                        /(\d)(?=(\d{3})+(?!\d))/g,
                        "$1,"
                      )}
                    </Typography>
                    <Typography variant="h5"> {file.FileStatus}</Typography>
                    {file.Figure && (
                      <Box display="flex" alignItems="center">
                        {" "}
                        <span>
                          {" "}
                          {file.Figure.includes("-") ? (
                            <ArrowDownwardIcon className={classes.errorColor} />
                          ) : (
                            <ArrowUpwardIcon />
                          )}
                          <div
                            className={
                              file.Figure.includes("-")
                                ? classes.errorColor
                                : ""
                            }
                          >
                            {" "}
                            {fig !== "" ? fig.substr(1, fig.length) : 0}
                          </div>
                        </span>{" "}
                        {t('componentData.fileProcessStatus.fromMonthPrior')}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
        </Grid>
      </>
    );
  }
}

export default withTranslation()(withStyles(styles)(FileProcessStatus));
