import React, { Component } from "react";
import {
  Grid,
  Box,
  IconButton,
  Paper,
  Link,
  Tooltip,
  Typography,
} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import EditIcon from "@material-ui/icons/Edit";
import EditCompanyView from "./EditCompanyView";
import {
  fetchPayeeDetails,
  updateRPUSelectedTab,
} from "~/redux/helpers/suppliers";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import config from "~/config";

class VendorCompanyInfo extends Component {
  state = { editDetail: false, vendorInfo: {} };
  componentDidMount() {
    this.fetchCompanyData();
  }
  fetchCompanyData = () => {
    const { userData } = this.props.user;
    const { vendorDetail } = this.props;
    fetchPayeeDetails(vendorDetail.payeeId, userData.portalProfileId)
      .then((response) => {
        if (response.error) {
          this.setState({ vendorInfo: { ...vendorDetail } });
        } else {
          this.setState({ vendorInfo: response.data });
          const newVendorDetail = {
            ...vendorDetail,
            isTaxIdSsn: response.data.isTaxIdSsn || vendorDetail.isTaxIdSsn,
            payeeLocations:
              response.data.payeeLocations || vendorDetail.payeeLocations,
            companyName: response.data.companyName || vendorDetail.companyName,
          };
          this.props.setCompanyDetail &&
            this.props.setCompanyDetail(newVendorDetail);
        }
      })
      .catch((error) => {
        this.setState({ vendorInfo: { ...vendorDetail } });
      });
  };
  showListView = () => {
    this.setState({
      editDetail: false,
    });
    this.fetchCompanyData();

    this.props.getAllVendorsList && this.props.getAllVendorsList();
  };
  render() {
    const { editDetail, vendorInfo } = this.state;
    const {
      vendorDetail,
      classes,
      isPayeeEditable,
      isPayeeEditableDisabled,
      t,
    } = this.props;
    return (
      <>
        {editDetail ? (
          <EditCompanyView
            vendorInfo={vendorInfo}
            showListView={this.showListView}
            onCancel={() => this.setState({ editDetail: false })}
          />
        ) : (
          <Paper className={classes.card} elevation="0">
            {isPayeeEditable && (
              <Box
                justifyContent="flex-end"
                alignSelf="flex-end"
                display="flex"
              >
                <Tooltip
                  title={
                    isPayeeEditableDisabled
                      ? t("componentData.vendorInfo.disabledEditTooltip")
                      : ""
                  }
                  arrow
                  placement="left"
                >
                  <span>
                    <IconButton
                      color="primary"
                      aria-label="Edit Company"
                      title={t("componentData.vendorCompanyInfo.EditCompany")}
                      component="span"
                      onClick={(event) => this.setState({ editDetail: true })}
                      disabled={isPayeeEditableDisabled}
                    >
                      <EditIcon
                        className={classes.smallIcon}
                        color={
                          isPayeeEditableDisabled ? "disabled" : "secondary"
                        }
                      />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            )}
            <Grid
              container
              className={classes.details}
              spacing={3}
              style={{ padding: isPayeeEditable ? "0 25px" : "25px" }}
            >
              <Grid item xs={12}>
                <Grid container item xs={12}>
                  <Grid item xs={6}>
                    <Box my={1}>
                      <Grid container item xs={12} spacing={2}>
                        <Grid item xs={4} className={classes.key}>
                          {t("componentData.vendorCompanyInfo.Address")}
                        </Grid>
                        <Grid item xs={6} className={classes.value}>
                          {vendorInfo.payeeLocations && (
                            <>
                              {`${vendorInfo.payeeLocations.address1 || ""}, ${
                                vendorInfo.payeeLocations.address2 || ""
                              } ${vendorInfo.payeeLocations.address2 ? "," : ""}
                          ${vendorInfo.payeeLocations.city || ""},${
                                vendorInfo.payeeLocations.state || ""
                              }, ${vendorInfo.payeeLocations.zipCode || ""}, ${
                                vendorInfo.payeeLocations.country || ""
                              }`}
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box my={1}>
                      <Grid container item xs={12} spacing={2}>
                        <Grid item xs={1} className={classes.key}>
                          <img
                            className={classes.contactIcons}
                            src={require(`~/assets/icons/phone.svg`)}
                            alt=""
                          />
                        </Grid>
                        {vendorInfo && vendorInfo.payeeLocations && (
                          <Grid item xs={11} className={classes.value}>
                            {`${
                              vendorInfo.payeeLocations.phoneCountryCode || ""
                            } 
                              (${vendorInfo.payeeLocations.phone.substring(
                                0,
                                3
                              )})-${vendorInfo.payeeLocations.phone.substring(
                              3,
                              6
                            )}-${vendorInfo.payeeLocations.phone.substring(
                              6,
                              10
                            )} ${vendorInfo.payeeLocations.phoneExt || ""} `}
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container item xs={12}>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6}>
                    <Box my={1}>
                      <Grid container item xs={12} spacing={2}>
                        <Grid item xs={1} className={classes.key}>
                          <img
                            className={classes.contactIcons}
                            src={require(`~/assets/icons/print.svg`)}
                            alt=""
                          />
                        </Grid>
                        {vendorInfo &&
                          vendorInfo.payeeLocations &&
                          vendorInfo.payeeLocations.fax && (
                            <Grid item xs={11} className={classes.value}>
                              {`${vendorInfo.payeeLocations.fax.substring(
                                0,
                                3
                              )}-${vendorInfo.payeeLocations.fax.substring(
                                3,
                                6
                              )}-${vendorInfo.payeeLocations.fax.substring(
                                6,
                                10
                              )}`}
                            </Grid>
                          )}
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container item xs={12} alignItems="center">
                  <Grid item xs={6}>
                    <Box my={1}>
                      <Grid container item xs={12} spacing={2}>
                        <Grid item xs={4} className={classes.key}>
                          {vendorDetail && vendorDetail.isTaxIdSsn
                            ? "SSN"
                            : vendorDetail.payeeLocations &&
                              vendorDetail.payeeLocations.country === "CA"
                            ? t(
                                "componentData.vendorCompanyInfo.BusinessNumber"
                              )
                            : t("componentData.vendorCompanyInfo.FederalTaxID")}
                        </Grid>

                        {vendorInfo && vendorInfo.taxId && (
                          <Grid item xs={6} className={classes.value}>
                            {`${vendorInfo.taxId.substring(
                              0,
                              3
                            )}-${vendorInfo.taxId.substring(
                              3,
                              5
                            )}-${vendorInfo.taxId.substring(5, 9)}`}
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box my={1}>
                      <Grid container item xs={12} spacing={2}>
                        <Grid item xs={1} className={classes.key}>
                          <img
                            className={classes.contactIcons}
                            src={require(`~/assets/icons/link.svg`)}
                            alt=""
                          />
                        </Grid>
                        {vendorInfo && vendorInfo.website && (
                          <Grid item xs={11} className={classes.value}>
                            {vendorInfo.website || ""}
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container item xs={12} alignItems="center">
                  <Grid item xs={6}>
                    <Box my={1}>
                      <Grid container item xs={12} spacing={2}>
                        <Grid item xs={4} className={classes.key}>
                          {t("componentData.vendorCompanyInfo.DUNSNumber")}
                        </Grid>
                        {vendorInfo && vendorInfo.dunsNumber !== null && (
                          <Grid item xs={6} className={classes.value}>
                            {vendorInfo.dunsNumber
                              ? `${vendorInfo.dunsNumber
                                  .toString()
                                  .substring(0, 3)}-${vendorInfo.dunsNumber
                                  .toString()
                                  .substring(3, 5)}-${vendorInfo.dunsNumber
                                  .toString()
                                  .substring(5, 10)}`
                              : ""}
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={1} className={classes.key}>
                        <img
                          className={classes.contactIcons}
                          src={require(`~/assets/icons/mail.svg`)}
                          alt=""
                        />
                      </Grid>

                      {vendorInfo &&
                        vendorInfo.payeeContact &&
                        vendorInfo.payeeContact.email && (
                          <Grid item xs={11} className={classes.value}>
                            <Link
                              color="inherit"
                              href={`mailto:${
                                vendorInfo.payeeContact.email || ""
                              }`}
                            >
                              {vendorInfo.payeeContact.email || ""}
                            </Link>
                          </Grid>
                        )}
                    </Grid>
                  </Grid>
                </Grid>
                {vendorInfo &&
                  vendorInfo.clearingHouseName &&
                  vendorInfo.clearingHouseName !== null &&
                  vendorInfo.clearingHouseName.length !== 0 && (
                    <Grid container item xs={12} alignItems="center">
                      <Grid item xs={6}>
                        <Box my={1}>
                          <Grid container item xs={12} spacing={2}>
                            <Grid item xs={4} className={classes.key}>
                              {t(
                                "componentData.vendorCompanyInfo.ClearingHouseName"
                              )}
                            </Grid>
                            <Grid item xs={6} className={classes.value}>
                              {vendorInfo.clearingHouseName || ""}
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                {vendorInfo &&
                  vendorInfo.npiId &&
                  vendorInfo.npiId !== null &&
                  vendorInfo.npiId.length !== 0 && (
                    <Grid container item xs={12} alignItems="center">
                      <Grid item xs={6}>
                        <Box my={1}>
                          <Grid container item xs={12} spacing={2}>
                            <Grid item xs={4} className={classes.key}>
                              {t("componentData.vendorCompanyInfo.NpiID")}
                            </Grid>
                            <Grid item xs={6} className={classes.value}>
                              {vendorInfo.npiId || ""}
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                {vendorInfo.message && vendorInfo.message.length > 0 && (
                  <Grid item xs={12}>
                    <Box display="flex" my={4} className={`button-container`}>
                      <Box display="flex">
                        <InfoOutlinedIcon style={{ color: "#E03617" }} />
                        <Typography
                          style={{ padding: "5px", color: "#E03617" }}
                          variant="h4"
                        >
                          {vendorInfo.message}{" "}
                          {(vendorInfo.updatedByClient ||
                            vendorInfo.updatedBySupplier) &&
                            t("componentData.vendorInfo.approveChange")}
                          <Link
                            style={{
                              color: "#4C4C4C",
                              cursor: "pointer",
                            }}
                            className={classes.lnk}
                            onClick={() => {
                              const selectedTab = vendorInfo.updatedByClient
                                ? 0
                                : vendorInfo.updatedBySupplier
                                ? 1
                                : 0;
                              this.props
                                .dispatch(updateRPUSelectedTab(selectedTab))
                                .then(() => {
                                  this.props.history.push(
                                    `${config.baseName}/suppliers/supplierUpdates`
                                  );
                                });
                            }}
                          >
                            {t("componentData.vendorInfo.PayeeUpdates")}
                          </Link>{" "}
                          {(vendorInfo.updatedByClient ||
                            vendorInfo.updatedBySupplier) &&
                            t("componentData.vendorInfo.tocontinue")}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Paper>
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(withStyles(styles)(VendorCompanyInfo))
);
