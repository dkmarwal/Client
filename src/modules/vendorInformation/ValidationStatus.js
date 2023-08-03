import React, { Component } from "react";
import {
  Grid,
  Box,
  Card,
  TableRow,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
  Typography,
  Tooltip,
} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import { fetchPayeeValidationDetails } from "~/redux/helpers/suppliers";
import { withTranslation } from "react-i18next";

class ValidationStatus extends Component {
  state = { validationDetails: [], isLoading: false, toolTipShow: false };
  componentDidMount() {
    const { id } = this.props;
    if (id !== null) {
      this.fetchValidationList(id);
    }
  }
  fetchValidationList = (id) => {
    this.setState(
      {
        isLoading: true,
      },
      () => {
        fetchPayeeValidationDetails(id)
          .then((response) => {
            this.setState({
              validationDetails: response.data,
              isLoading: false,
            });
          })
          .catch((error) => {
            this.setState({ validationDetails: [], isLoading: false });
          });
      }
    );
  };
  returnToolTipHTML = (type, data) => {
    const { t } = this.props;
    if (!data || (data && !data.length)) {
      return null;
    }
    return (
      <TableContainer component={Paper}>
        <Table className="tooltipTable" stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: "#fff" }}>
                <b>
                  {type === 8
                    ? t("componentData.vendorInfo.name")
                    : t("componentData.addAccountForm.AcNumber")}
                </b>
              </TableCell>
              <TableCell style={{ backgroundColor: "#fff" }} align="right">
                <b>{t("componentData.vendorCompanyInfo.Status")}</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.length > 0 &&
              data.map((row, i) => (
                <TableRow key={row.i}>
                  <TableCell component="th" scope="row">
                    {type === 8
                      ? `${row.firstName} ${row.lastName}`
                      : row.accountNumber}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ textTransform: "capitalize" }}
                  >
                    {row.validationStatus.toLowerCase()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  renderValidationStatus = (type, status, data) => {
    const { classes, t } = this.props;
    switch (status) {
      case "2":
        if (type === 16 || type === 64 || type === 128 || type === 8) {
          return (
            <>
              <img
                src={require(`~/assets/icons/validation_pending.svg`)}
                alt=""
              />{" "}
              <span style={{ verticalAlign: "middle" }}>
                {t("componentData.vendorInfo.ValidationPending")}
              </span>
              <Tooltip
                title={this.returnToolTipHTML(type, data)}
                placement="bottom"
                classes={{ tooltip: classes.showTooltip }}
              >
                <img src={require(`~/assets/icons/info_btn.svg`)} alt="" />
              </Tooltip>
            </>
          );
        } else {
          return (
            <>
              {" "}
              <img
                src={require(`~/assets/icons/validation_pending.svg`)}
                alt="info"
              />
              <span style={{ verticalAlign: "middle" }}>
                {t("componentData.vendorInfo.ValidationPending")}
              </span>
            </>
          );
        }
      case "3":
        if (type === 16 || type === 64 || type === 128 || type === 8) {
          return (
            <>
              {" "}
              <img
                src={require(`~/assets/icons/validation_failed.svg`)}
                alt=""
              />{" "}
              <span style={{ color: "#E02020", verticalAlign: "middle" }}>
                {t("componentData.vendorInfo.ValidationFailed")}
              </span>
              <Tooltip
                title={this.returnToolTipHTML(type, data)}
                placement="bottom"
                classes={{ tooltip: classes.showTooltip }}
              >
                <img src={require(`~/assets/icons/info_btn.svg`)} alt="info" />
              </Tooltip>
            </>
          );
        } else {
          return (
            <>
              <img
                src={require(`~/assets/icons/validation_failed.svg`)}
                alt=""
              />{" "}
              <span style={{ color: "#E02020", verticalAlign: "middle" }}>
                {t("componentData.vendorInfo.ValidationFailed")}
              </span>
            </>
          );
        }

      case "1":
        if (type === 16 || type === 64 || type === 128 || type === 8) {
          return (
            <>
              {" "}
              <img
                src={require(`~/assets/icons/validation_done.svg`)}
                alt=""
              />{" "}
              <span style={{ verticalAlign: "middle" }}>
                {t("componentData.vendorInfo.ValidationDone")}
              </span>
              <Tooltip
                title={this.returnToolTipHTML(type, data)}
                placement="bottom"
                classes={{ tooltip: classes.showTooltip }}
              >
                <img src={require(`~/assets/icons/info_btn.svg`)} alt="info" />
              </Tooltip>
            </>
          );
        } else {
          return (
            <>
              <img src={require(`~/assets/icons/validation_done.svg`)} alt="" />{" "}
              <span style={{ verticalAlign: "middle" }}>
                {t("componentData.vendorInfo.ValidationDone")}
              </span>
            </>
          );
        }
      default:
        return <></>;
    }
  };
  render() {
    const { classes, t } = this.props;
    const { validationDetails, isLoading } = this.state;
    const columns = [
      {
        id: "validationId",
        label: `${t("componentData.vendorInfo.TypesOfValidation")}`,
      },
      { id: "status", label: `${t("componentData.vendorInfo.status")}` },
      {
        id: "updateDate",
        label: `${t("componentData.vendorInfo.Lastupdatedon")}`,
      },
      {
        id: "reasonForFailure",
        label: `${t("componentData.vendorInfo.Reason")}`,
      },
    ];
    if (isLoading) {
      return (
        <Box className="loader-container">
          <CircularProgress color="primary" />
        </Box>
      );
    }
    return (
      <>
        {!validationDetails ||
        (validationDetails && validationDetails.length === 0) ? (
          <Typography align="center" gutterBottom>
            {t("componentData.fileDetails.NoDataToshow")}
          </Typography>
        ) : (
          <>
            {" "}
            <Grid container className={classes.details} spacing={3}>
              <Card
                className={classes.card}
                style={{ display: "flex", width: "100%" }}
              >
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column) => (
                          <TableCell
                            className={classes.cellHeading}
                            key={column.id}
                            align="left"
                          >
                            <b>{column.label}</b>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {validationDetails &&
                        validationDetails.length > 0 &&
                        validationDetails.map((detail) => (
                          <TableRow key={detail.validationType}>
                            <TableCell align="left" className={classes.cell}>
                              {detail.validationType}
                            </TableCell>
                            <TableCell align="left" className={classes.cell}>
                              {this.renderValidationStatus(
                                detail.validationTypeId,
                                detail.validationStatusId,
                                detail.elementData
                              )}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.validationStyle}
                            >
                              {detail.updatedAt}
                            </TableCell>
                            <TableCell align="left" className={classes.cell}>
                              {detail.failureReason}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>{" "}
          </>
        )}{" "}
      </>
    );
  }
}

export default withTranslation()(withStyles(styles)(ValidationStatus));
