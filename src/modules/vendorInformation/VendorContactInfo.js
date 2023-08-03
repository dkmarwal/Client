import React, { Component } from "react";
import {
  Grid,
  Box,
  Card,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@material-ui/core";
import styles from "./styles";
import { withStyles } from "@material-ui/styles";
import EditIcon from "@material-ui/icons/Edit";
import { connect } from "react-redux";
import { fetchContactInfo } from "~/redux/helpers/suppliers";
import EditContactView from "./EditContactView";
import { withTranslation } from "react-i18next";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import config from "~/config";
import { updateRPUSelectedTab } from "~/redux/helpers/suppliers";

class VendorContactInfo extends Component {
  state = { contactInfo: {}, editDetail: false, selectedContact: null };
  componentDidMount() {
    const { id } = this.props;
    if (id !== null) {
      this.fetchVendorContactInfo(id);
    }
  }
  fetchVendorContactInfo = (id) => {
    fetchContactInfo(id)
      .then((response) => {
        this.setState({ contactInfo: response.data.rows });
      })
      .catch((error) => {
        this.setState({ contactInfo: {} });
      });
  };
  showListView = () => {
    this.setState({
      editDetail: false,
    });
    const { id } = this.props;
    this.fetchVendorContactInfo(id);
  };
  render() {
    const { classes, id, isPayeeEditable, isPayeeEditableDisabled, t } =
      this.props;
    const { contactInfo, editDetail, selectedContact } = this.state;
    const { theme } = this.props.clientConfig.layout;
    return (
      <>
        {" "}
        {editDetail ? (
          <EditContactView
            data={selectedContact}
            id={id}
            showListView={this.showListView}
            onCancel={() => this.setState({ editDetail: false })}
          />
        ) : (
          <Grid container className={classes.details}>
            {contactInfo &&
              Object.values(contactInfo).map((obj) => (
                <Grid item xs={12} md={12} style={{ marginBottom: 24 }}>
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
                              aria-label="Edit Contact"
                              title={t(
                                "componentData.vendorContactInfo.EditContact"
                              )}
                              component="span"
                              onClick={(event) =>
                                this.setState({
                                  editDetail: true,
                                  selectedContact: obj,
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
                      alignItems="end"
                      style={{
                        padding: isPayeeEditable ? "0 24px 24px" : "24px",
                      }}
                    >
                      <Grid item xs={1} md={1}>
                        <Box>
                          <span
                            style={{
                              background: theme.palette.background.default,
                              color: theme.palette.primary.main,
                              width: 50,
                              height: 50,
                              display: "block",
                              textAlign: "center",
                              lineHeight: 2,
                            }}
                            className={classes.circleContact}
                          >
                            {this.props.getProfileCircleName(
                              obj.firstName + obj.lastName
                            )}
                          </span>
                        </Box>
                      </Grid>
                      <Grid item xs={3} md={3}>
                        <Box
                          fontSize={24}
                          color="#0B1941"
                          lineHeight="normal"
                          title={obj.displayName}
                          style={{ wordBreak: "break-word" }}
                        >
                          {obj.displayName && obj.displayName.length > 12
                            ? obj.displayName.substring(0, 12) + "..."
                            : obj.displayName}
                        </Box>
                        <Box
                          lineHeight="normal"
                          justifyContent="flex-end"
                          style={{
                            color: theme.palette.text.default,
                          }}
                        >
                          {obj.contactType && obj.contactType.contactTypeName
                            ? obj.contactType.contactTypeName
                            : ""}
                        </Box>
                      </Grid>
                      <Grid item xs={5} md={5}>
                        <Box display="flex">
                          <Box flexGrow={0}>
                            <span className={classes.value}>
                              <img
                                className={classes.contactIcons}
                                src={require(`~/assets/icons/print.svg`)}
                                alt=""
                              />
                            </span>
                          </Box>
                          <Box>
                            {Boolean(obj?.fax ?? false) && (
                              <span className={classes.value}>
                                {`${obj.fax.substring(
                                  0,
                                  3
                                )}-${obj.fax.substring(
                                  3,
                                  6
                                )}-${obj.fax.substring(6, 10)}`}
                              </span>
                            )}
                          </Box>
                        </Box>

                        <Box style={{ wordBreak: "break-word" }}>
                          <Link
                            color="inherit"
                            href={`mailto:${obj.email || ""}`}
                          >
                            <span className={classes.value}>
                              <img
                                className={classes.contactIcons}
                                src={require(`~/assets/icons/mail.svg`)}
                                alt=""
                              />
                              {obj.email || ""}
                            </span>
                          </Link>
                        </Box>
                      </Grid>
                      <Grid item xs={3} md={3}>
                        <Box display="flex">
                          <Box flexGrow={0}>
                            <span className={classes.value}>
                              <img
                                className={classes.contactIcons}
                                src={require(`~/assets/icons/phone.svg`)}
                                alt=""
                              />
                            </span>
                          </Box>
                          <Box>
                            {obj.phone && (
                              <span className={classes.value}>
                                {`${obj.phoneCountryCode || ""}
                                (${obj.phone.substring(
                                  0,
                                  3
                                )})-${obj.phone.substring(
                                  3,
                                  6
                                )}-${obj.phone.substring(6, 10)}
                                    ${obj.phoneExt || ""}`}
                              </span>
                            )}
                          </Box>
                        </Box>
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
  }))(withStyles(styles)(VendorContactInfo))
);
