import React, { Component } from "react";
import {
  Grid,
  Box,
  Card,
  IconButton,
  Tooltip,
  Typography,
  Link,
} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import EditIcon from "@material-ui/icons/Edit";
import { connect } from "react-redux";
import { fetchPayeeLocationsDetails } from "~/redux/helpers/suppliers";
import EditLocationsView from "./EditLocationsView";
import { withTranslation } from "react-i18next";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import config from "~/config";
import { updateRPUSelectedTab } from "~/redux/helpers/suppliers";
class VendorLocations extends Component {
  state = { locationsInfo: {}, editDetail: false, selectedLocation: null };
  componentDidMount() {
    const { id } = this.props;
    if (id !== null) {
      this.fetchVendorLocations(id);
    }
  }
  fetchVendorLocations = (id) => {
    fetchPayeeLocationsDetails(id)
      .then((response) => {
        this.setState({ locationsInfo: response.data.rows });
      })
      .catch((error) => {
        this.setState({ locationsInfo: {} });
      });
  };
  showListView = () => {
    this.setState({
      editDetail: false,
    });
    const { id } = this.props;
    this.fetchVendorLocations(id);
    this.props.getAllVendorsList();
  };
  render() {
    const { classes, id, isPayeeEditable, isPayeeEditableDisabled, t } =
      this.props;
    const { locationsInfo, editDetail, selectedLocation } = this.state;

    return (
      <>
        {" "}
        {editDetail ? (
          <EditLocationsView
            data={selectedLocation}
            id={id}
            showListView={this.showListView}
            onCancel={() => this.setState({ editDetail: false })}
          />
        ) : (
          <Grid container className={classes.details} spacing={3}>
            {locationsInfo &&
              Object.values(locationsInfo).map((obj) => (
                <Grid item xs={12} md={12}>
                  <Card className={classes.card}>
                    {isPayeeEditable && (
                      <Box
                        justifyContent="flex-end"
                        alignSelf="flex-end"
                        display="flex"
                      >
                        <Tooltip
                          title={
                            isPayeeEditableDisabled
                              ? t(
                                  "componentData.vendorInfo.disabledEditTooltip"
                                )
                              : ""
                          }
                          arrow
                          placement="left"
                        >
                          <span>
                            <IconButton
                              color="primary"
                              aria-label="Edit Locations"
                              title={t(
                                "componentData.vendorContactInfo.EditLocations"
                              )}
                              component="span"
                              onClick={(event) =>
                                this.setState({
                                  editDetail: true,
                                  selectedLocation: obj,
                                })
                              }
                              disabled={isPayeeEditableDisabled}
                            >
                              <EditIcon
                                className={classes.smallIcon}
                                color={
                                  isPayeeEditableDisabled
                                    ? "disabled"
                                    : "secondary"
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
                      style={{
                        padding: isPayeeEditable ? "0 24px 24px" : "24px",
                      }}
                    >
                      <Grid item xs={6} md={6}>
                        <div>
                          <Box my={1}>
                            <Grid container item xs={12} spacing={2}>
                              <Grid item xs={4} className={classes.key}>
                                {t("componentData.vendorContactInfo.Address")}
                              </Grid>
                              <Grid item xs={6} className={classes.value}>
                                {`${obj.address1 || ""}, ${
                                  obj.address2 || ""
                                }  ${obj.address2 ? "," : ""} ${
                                  obj.city || ""
                                }, ${obj.state || ""},
                                ${obj.zipCode || ""}, ${obj.country || ""}`}
                              </Grid>
                            </Grid>
                          </Box>
                          <Box my={1}>
                            <Grid container item xs={12} spacing={2}>
                              <Grid item xs={4} className={classes.key}>
                                {t(
                                  "componentData.vendorContactInfo.LocationType"
                                )}
                              </Grid>
                              <Grid item xs={6} className={classes.value}>
                                {`${
                                  (obj &&
                                    obj.locationType &&
                                    obj.locationType.locationTypeName) ||
                                  ""
                                }`}
                              </Grid>
                            </Grid>
                          </Box>
                        </div>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <div>
                          <Box my={1}>
                            <Grid container item xs={12} spacing={2}>
                              <Grid item xs={1} className={classes.key}>
                                <img
                                  className={classes.contactIcons}
                                  src={require(`~/assets/icons/phone.svg`)}
                                  alt=""
                                />
                              </Grid>
                              {obj.phone && (
                                <Grid item xs={11} className={classes.value}>
                                  {obj.phone &&
                                    `${obj.phoneCountryCode || ""}
                                (${obj.phone.substring(
                                  0,
                                  3
                                )})-${obj.phone.substring(
                                      3,
                                      6
                                    )}-${obj.phone.substring(6, 10)}
                                ${obj.phoneExt || ""}`}
                                </Grid>
                              )}
                            </Grid>
                          </Box>
                        </div>
                      </Grid>
                    </Grid>
                    {obj.payerReviewUpdate && obj.payerReviewUpdate.length > 0 && (
                      <Grid item xs={12} display="flex" justifyContent="center">
                        <Box
                          display="flex"
                          mb={3}
                          className={`button-container`}
                        >
                          <Box display="flex">
                            <InfoOutlinedIcon style={{ color: "#E03617" }} />
                            <Typography
                              style={{ padding: "5px", color: "#E03617" }}
                              variant="h4"
                            >
                              {obj.payerReviewUpdate[0].message}{" "}
                              {obj.payerReviewUpdate[0].updatedByClient &&
                                t("componentData.vendorInfo.approveChange")}
                              <Link
                                style={{
                                  color: "#4C4C4C",
                                  cursor: "pointer",
                                }}
                                className={classes.lnk}
                                onClick={() => {
                                  const selectedTab = obj.payerReviewUpdate[0]
                                    .updatedByClient
                                    ? 0
                                    : 1;
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
                              {obj.payerReviewUpdate[0].updatedByClient &&
                                t("componentData.vendorInfo.tocontinue")}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </Card>
                </Grid>
              ))}
          </Grid>
        )}
      </>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.clientConfig,
    ...state.user,
  }))(withStyles(styles)(VendorLocations))
);
