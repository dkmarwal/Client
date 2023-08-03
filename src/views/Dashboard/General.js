import {
  Box,
  Card,
  Grid,
  Typography,
  withStyles,
  Button,
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import styles from "./styles";
import { CustomDialog } from "~/components/Dialogs";
import { getClientSupplierUpdate } from "~/redux/helpers/supplier";
import { fetchReadyForApprovalsList } from "~/redux/helpers/suppliers";
import { getClientSupplierUpdateActionB2C } from "~/redux/actions/suppliers";
import { fetchFileList } from "~/redux/helpers/files";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import {
  getDashboardCampaignList,
  getCampaignfileRequiresAttentionList,
} from "~/redux/helpers/campaigns";
import { getClientPaymentTransactions } from "~/redux/helpers/clientPaymentTransactions";
import "chartjs-plugin-annotation";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Notification from "~/components/Notification";
import "./sankey.css";
import { entityType, PaymentPendingApproval } from "~/config/entityTypes";
import Graph from "./graph";
import PayeeUpdates from "./payeeUpdates";
import USbankPayeeUpdates from "./USbank/payeeUpdates";
import B2CGraph from "./B2C/graph";
import UsbankGraph from "./USbank/graph";
import B2CPayeeUpdates from "./B2C/payeeUpdates";
import config from "~/config";

class General extends Component {
  state = {
    name: "React",
    type: "line",
    selectedCampaign: {
      campaignId: -1,
    },
    selectedEntityPaymentClientId: 0,
    selectedEntityClientId: -1,
    campaignList: [],
    childEntities: [],
    supplierEnrollmentData: [],
    supplierUpdates: [],
    supplierApproval: [],
    campaignFiles: [],
    paymentFiles: [],
    displayWelcomeModal: false,
    openSupplierUpdates: false,
    openSupplierApproval: false,
    openCampaignFiles: false,
    openPendingApproval: false,
    openPaymentFiles: false,
    enableDateFilter: false,
    selectedFilter: 2,
    selectedCurrentDateFilter: 2,
    selectedCurrency: "USD",
    selectedView: "Amount",
    selectedPayeeView: "status",
    totalPayments: "",
    totalCADPayments: "",
    totalUSDPayments: "",
    totalCHKPayment: "",
    totalACHPayment: "",
    totalVCAPayment: "",
    totalCADAmount: "",
    totalUSDAmount: "",
    totalACHAmount: "",
    totalCHKAmount: "",
    totalVCAAmount: "",
    chkPercent: "",
    achPercent: "",
    vcaPercent: "",
    paymentsData: {},
    payeeEnrollmentData: {},
    data: {},
    modalMessage: null,
    variant: "",
    pendingApproval: [],
    totalPendingApprovalRecords: 0,
  };

  sortDates(timeline) {
    return (
      timeline &&
      timeline.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    );
  }

  sortArrayonDate(array) {
    array.sort(function compare(a, b) {
      var dateA = new Date(a["figureFor"]);
      var dateB = new Date(b["figureFor"]);
      return dateA - dateB;
    });
  }

  componentDidMount() {
    const clientId = this.props.user.userData.portalProfileId;
    const page = 0,
      rowsPerPage = -1;
    const appType = this.props.user.userData.appType
      ? parseInt(this.props.user.userData.appType)
      : entityType.B2B;
    const data = {
      clientID: clientId,
      pageNumber: 1,
      rowCount: 7,
      statusIDs: "4,5",
      BusinessType: appType,
    };
    this.setState(
      {
        selectedEntityPaymentClientId: clientId,
        selectedEntityClientId: clientId,
      },
      () => {
        if (appType === entityType.B2C) {
          this.fetchCampaignData(clientId);
          this.props
            .dispatch(
            getClientSupplierUpdateActionB2C(clientId, {}, 0, 10, true)
            )
            .then((response) => {
              if (this.props.user.isPayeeChoicePortal) {
                fetchReadyForApprovalsList(clientId, rowsPerPage, page).then(
                  (res) => {
                    fetchFileList(data).then((r) => {
                      getDashboardCampaignList(0).then((resp) => {
                        const { supplierUpdateList } = this.props.suppliers;
                        this.setState({
                          supplierUpdates: supplierUpdateList,
                          supplierApproval: res && res.data,
                          paymentFiles: r && r.data,
                        });
                      });
                    });
                  }
                );
              }
            });
        } else {
          getClientSupplierUpdate(clientId).then((response) => {
            // fetchReadyForApprovalsList(clientId, rowsPerPage, page).then(
            //   (res) => {
            //     fetchFileList(data).then((r) => {
            //       getDashboardCampaignList(0).then((resp) => {
            //         this.setState({
            //           supplierUpdates: (response && response.data) || [],
            //           supplierApproval: res && res.data,
            //           paymentFiles: r && r.data,
            //         });
            //       });
            //     });
            //   }
            // );
          });
        }
      }
    );
    this.fetchPendingApproval();
  }
  fetchCampaignData = (clientId) => {
    getCampaignfileRequiresAttentionList(clientId).then((response) => {
      // if (!response) {
      //   this.setState({
      //     error: response.message,
      //     variant: "error",
      //   });
      //   return false;
      // }
      let arr =
        response && response.rows && response.rows.length > 0
          ? response.rows.map((item) => {
            return {
              FileID: item.fileId,
              FileName: item.fileName,
              FileUploaded: item.createdAt,
              TotalPayee: item.noOfRecords,
              FileStatusId:
              item.fileStatus && item.fileStatus.fileStatusId
                ? item.fileStatus.fileStatusId
                : "",
              FileStatus:
              item.fileStatus && item.fileStatus.statusDescription
                ? item.fileStatus.statusDescription
                : "",
              StatusColor:
              item.fileStatus && item.fileStatus.statusColor
                ? item.fileStatus.statusColor
                : "",
              NoOfExceptions: item.noOfExceptions,
              NoOfRecords: item.noOfRecords,
              ProcessedRecords: item.processedRecords,
              FileApprovedAt: item.approvedAt,
              ApprovedBy: item.approvedBy,
              FailureReason: item.failureReason,
            };
          })
          : [];
      this.setState({
        campaignFiles: arr,
      });
    });
  };
  fetchPendingApproval = () => {
    const payload = {
      clientID: this.props.user ?.userData ?.portalProfileId,
      pageNumber: 1,
      rowCount: 7,
      statusIDs: PaymentPendingApproval[0],
      BusinessType: 2,
    };
    getClientPaymentTransactions(payload).then((resp) => {
      if (!resp ?.data ?.error) {
        this.setState({
          pendingApproval: resp ?.data ?.data ?.lstPaymentDetailsByClientId,
          totalPendingApprovalRecords: resp ?.data ?.data ?.TotalRecords,
        });
      } else {
        this.setState({ alertMessage: resp ?.data ?.message });
      }
    });
  };
  render() {
    const { classes, t } = this.props;
    const {
      campaignFiles,
      paymentFiles,
      supplierUpdates,
      supplierApproval,
      openSupplierUpdates,
      openSupplierApproval,
      openCampaignFiles,
      openPendingApproval,
      openPaymentFiles,
      displayWelcomeModal,
      pendingApproval,
      totalPendingApprovalRecords
    } = this.state;

    const appType = this.props.user.userData.appType
      ? parseInt(this.props.user.userData.appType)
      : entityType.B2B;
    return (
      <Grid>
        <Box mt={15} mb={1} mx={6}>
          <Grid container spacing={4}>
            <Grid item xs={8} sm={8}>
              {appType === entityType.B2C ? (
                this.props.user.isPayeeChoicePortal ? (
                  <UsbankGraph />
                ) : (
                    <B2CGraph />
                  )
              ) : (
                  <Graph />
                )}
            </Grid>
            <Grid item xs={4} sm={4}>
              <h1
                className={classes.textAttention}
                style={{ margin: "0 0 10px 0" }}
                >
                {t("componentData.dashboard.RequiresAttention")}
              </h1>
              {appType === entityType.B2C ? (
                this.props.user.isPayeeChoicePortal ? (
                  <USbankPayeeUpdates
                    supplierUpdates={supplierUpdates}
                    openSupplierUpdates={openSupplierUpdates}
                    onSupplierClick={() => {
                      this.setState({
                        openSupplierUpdates: !openSupplierUpdates,
                      });
                    } }
                    {...this.props}
                    />
                ) : (
                    <B2CPayeeUpdates
                      supplierUpdates={supplierUpdates}
                      openSupplierUpdates={openSupplierUpdates}
                      onSupplierClick={() => {
                        this.setState({
                          openSupplierUpdates: !openSupplierUpdates,
                        });
                      } }
                      {...this.props}
                      />
                  )
              ) : (
                  <PayeeUpdates
                    supplierUpdates={supplierUpdates}
                    openSupplierUpdates={openSupplierUpdates}
                    onSupplierClick={() => {
                      this.setState({
                        openSupplierUpdates: !openSupplierUpdates,
                      });
                    } }
                    {...this.props}
                    />
                )}

              {appType === entityType.B2C &&
                campaignFiles &&
                campaignFiles.length > 0 ? (
                  <Box mb={3}>
                    <Card
                      className={classes.expansionCards}
                      style={{ height: openCampaignFiles ? "494px" : "150px" }}
                      >
                      <Box px={2} py={1}>
                        <h1 className={classes.textAttention}>
                          {`${t(
                            "componentData.dashboard.CampaignFileRequiresAttention"
                          )} (${campaignFiles.length || ""})`}{" "}
                        </h1>
                        <Box>
                          {campaignFiles.map((file, index) => (
                            <div className={classes.text16}>
                              <span className={classes.iconContainer}>
                                <InsertDriveFileIcon className={classes.icon} />
                              </span>
                              <Link
                                className={classes.link}
                                to={{
                                  pathname: `${config.baseName}/suppliers/campaignFiles/fileDetails`,
                                  state: {
                                    data: file,
                                  },
                                }}
                                >
                                {t("componentData.dashboard.FileID")}{" "}
                                {file["FileID"]}
                              </Link>
                              <span style={{ color: "#4C4C4C" }}>
                                {" "}
                                {t("componentData.dashboard.pendingApproval")}
                              </span>
                            </div>
                          ))}
                        </Box>
                        {/* <div className={classes.subHeading}>General settings is pending</div> */}
                      </Box>
                      <div className={classes.bgBlur}>
                        <Box display="flex" justifyContent="center">
                          <span
                            className={classes.expansionBtn}
                            onClick={() => {
                              this.setState({
                                openCampaignFiles: !openCampaignFiles,
                              });
                            } }
                            >
                            {openCampaignFiles ? (
                            <>
                              <ExpandLessIcon className={classes.arrowsColor} />
                            </>
                          ) : (
                            <ExpandMoreIcon className={classes.arrowsColor} />
                            )}
                        </span>
                        </Box>
                      </div>
                    </Card>
                  </Box>
                ) : null}

              {appType === entityType.B2B ? (
                supplierApproval &&
                  supplierApproval["rows"] &&
                  supplierApproval["rows"].length &&
                  supplierApproval["rows"].length > 0 ? (
                    <Box my={3}>
                      <Card
                        className={classes.expansionCards}
                        style={{
                          height: openSupplierApproval ? "400px" : "150px",
                        }}
                        >
                        <Box px={2} py={1}>
                          <h1 className={classes.textAttention}>
                            {`${t("componentData.dashboard.NewPayeeApproval")} (${
                              (supplierApproval && supplierApproval.count) || ""
                              })`}
                          </h1>
                          <Box>
                            {supplierApproval &&
                              supplierApproval.rows &&
                              supplierApproval.rows.map((o, i) => (
                                <div
                                  key={i}
                                  className={classes.text16}
                                  style={{ display: "flex", marginTop: 10 }}
                                  >
                                  <span className={classes.circleText}>
                                    {" "}
                                    {o["companyName"] && o["companyName"][0]}
                                  </span>
                                  <span style={{ color: "#4C4C4C" }}>
                                    <label
                                      className={classes.link}
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        this.props.history.push({
                                          pathname: "/suppliers/mySupplier",
                                          state: "isPayeeApprovedByClient",
                                          vendor: o,
                                        })
                                      }
                                      >
                                      {" "}
                                      {`${o["companyName"]} `}
                                    </label>{" "}
                                    {t("componentData.dashboard.pendingAppr")}{" "}
                                  </span>
                                </div>
                              ))}
                          </Box>
                        </Box>
                        <div className={classes.bgBlur}>
                          {openSupplierApproval &&
                            supplierApproval &&
                            supplierApproval.count &&
                            supplierApproval.count > 6 ? (
                          <>
                              <Box className={classes.btnWrap}>
                                <Button
                                  color="secondary"
                                  onClick={() => {
                                    this.props.history.push({
                                      pathname: "/suppliers/mySupplier",
                                      state: "isPayeeApprovedByClient",
                                    });
                                  } }
                                  >
                                  {t("componentData.dashboard.SeeMore")}
                                </Button>
                              </Box>
                          </>
                        ) : null}

                        <Box display="flex" justifyContent="center">
                            <span
                              className={classes.expansionBtn}
                              onClick={() => {
                                this.setState({
                                  openSupplierApproval: !openSupplierApproval,
                                });
                              } }
                              >
                              {openSupplierApproval ? (
                                <ExpandLessIcon className={classes.arrowsColor} />
                              ) : (
                                  <ExpandMoreIcon className={classes.arrowsColor} />
                                )}
                            </span>
                          </Box>
                        </div>
                      </Card>
                    </Box>
                  ) : (
                    <Box display="block" textAlign="center" width={1} my={2}>
                      <Card
                        style={{ padding: 10 }}
                        className={classes.expansionCards}
                        >
                        <Box
                          color="#7F7F7F"
                          fontSize={20}
                          pb={2}
                          textAlign="left"
                          >
                          {t("componentData.dashboard.zeroNewPayeeApproval")}
                        </Box>
                        <img
                          src={require("~/assets/images/nodata-img2.svg")}
                          alt=""
                          />

                        <Box py={2} color="#A1A1A1" fontSize={14} display="block">
                          {" "}
                          {t("componentData.dashboard.noDataToShow")}{" "}
                        </Box>
                      </Card>
                    </Box>
                  )
              ) : null}

              {paymentFiles &&
                paymentFiles["lstPaymentFileByFileId"] &&
                paymentFiles["lstPaymentFileByFileId"].length &&
                paymentFiles["lstPaymentFileByFileId"].length > 0 ? (
                  <Box>
                    <Card
                      className={classes.expansionCards}
                      style={{ height: openPaymentFiles ? "400px" : "150px" }}
                      >
                      <Box px={2} py={1}>
                        <h1 className={classes.textAttention}>
                          {`${t(
                            "componentData.dashboard.PaymentFileRequiresAttention"
                          )} (${paymentFiles && paymentFiles.TotalRecords})`}
                        </h1>
                        <Box mb={3}>
                          {paymentFiles &&
                            paymentFiles.lstPaymentFileByFileId &&
                            paymentFiles.lstPaymentFileByFileId.map((file) => (
                              <div className={classes.text16}>
                                <span className={classes.iconContainer}>
                                  <InsertDriveFileIcon className={classes.icon} />
                                </span>
                                <Link
                                  className={classes.link}
                                  to={{
                                    pathname:
                                    "/payments/paymentFiles/fileDetails",
                                    state: {
                                      id: file["FileID"],
                                      appType: appType,
                                    },
                                  }}
                                  >
                                  {t("componentData.dashboard.FileID")}{" "}
                                  {file["FileID"]}
                                </Link>
                                <span style={{ color: "#4C4C4C" }}>
                                  {" "}
                                  {t("componentData.dashboard.pendingApproval")}
                                </span>
                              </div>
                            ))}
                        </Box>
                      </Box>

                      <div className={classes.bgBlur}>
                        {" "}
                        {openPaymentFiles &&
                          paymentFiles &&
                          paymentFiles.TotalRecords > 6 ? (
                        <>
                            <Box className={classes.btnWrap}>
                              <Button
                                color="secondary"
                                onClick={() =>
                                  this.props.history.push({
                                    pathname: "/payments/paymentFiles",
                                    state: "isPaymentFileRequiredAttention",
                                  })
                                }
                                >
                                {t("componentData.dashboard.SeeMore")}
                              </Button>
                            </Box>
                        </>
                      ) : null}
                      <Box display="flex" justifyContent="center">
                          <span
                            className={classes.expansionBtn}
                            onClick={() => {
                              this.setState({
                                openPaymentFiles: !openPaymentFiles,
                              });
                            } }
                            >
                            {openPaymentFiles ? (
                              <ExpandLessIcon className={classes.arrowsColor} />
                            ) : (
                                <ExpandMoreIcon className={classes.arrowsColor} />
                              )}
                          </span>
                        </Box>
                      </div>
                    </Card>
                  </Box>
                ) : appType === entityType.B2C ? null : (
                  <Box display="block" textAlign="center" width={1} my={2}>
                    <Card
                      style={{ padding: 10 }}
                      className={classes.expansionCards}
                      >
                      <Box color="#7F7F7F" fontSize={20} pb={2} textAlign="left">
                        {t(
                          "componentData.dashboard.zeroPaymentFileRequiresAttention"
                        )}
                      </Box>
                      <img
                        src={require("~/assets/images/nodata-img3.svg")}
                        alt="No Data"
                        />

                      <Box py={2} color="#A1A1A1" fontSize={14} display="block">
                        {t("componentData.dashboard.noDataToShow")}
                      </Box>
                    </Card>
                  </Box>
                )}
              {appType === entityType.B2C &&
                pendingApproval &&
                pendingApproval.length > 0 ? (
                  <Box mt={3}>
                    <Card
                      className={classes.expansionCards}
                      style={{ height: openPendingApproval ? "494px" : "150px" }}
                      >
                      <Box px={2} py={1}>
                        <h1 className={classes.textAttention}>
                          {`${t(
                            "componentData.addPayment.headings.pendingApproval"
                          )} (${totalPendingApprovalRecords || ""})`}{" "}
                        </h1>
                        <Box>
                          {pendingApproval.map((file) => (
                            <div className={classes.text16}>
                              <span className={classes.iconContainer}>
                                <InsertDriveFileIcon className={classes.icon} />
                              </span>
                              <Link
                                className={classes.link}
                                to={{
                                  pathname: `${config.baseName}/payments/paymentDetails/viewDetail`,
                                  state: {
                                    paymentId: file ?.PaymentID,
                                    appType: file ?.BusinessType,
                                    clientId: file ?.ClientId,
                                    payeeRemitToId: file ?.RemitToID,
                                    returnStatusID: file ?.ReturnStatusID,
                                    filters: {},
                                    queryParams: "",
                                  },
                                }}
                                >
                                {t("componentData.addPayment.headings.paymentId")}{" "}
                                {file.PaymentID}
                              </Link>
                              <span style={{ color: "#4C4C4C" }}>
                                {" "}
                                {t("componentData.addPayment.headings.approval")}
                              </span>
                            </div>
                          ))}
                        </Box>
                        {/* <div className={classes.subHeading}>General settings is pending</div> */}
                      </Box>
                      <div className={classes.bgBlur}>
                        {openPendingApproval &&
                          pendingApproval &&
                          pendingApproval.length > 6 ? (
                        <>
                            <Box className={classes.btnWrap}>
                              <Button
                                color="secondary"
                                onClick={() =>
                                  this ?.props ?.history ?.push({
                                    pathname: "payments/paymentDetails",
                                    state: { paymentFilePendingApproval: "paymentFilePendingApproval" }
                                  })
                              }
                                >
                                {t("componentData.dashboard.SeeMore")}
                              </Button>
                            </Box>
                        </>
                      ) : null}
                      <Box display="flex" justifyContent="center">
                          <span
                            className={classes.expansionBtn}
                            onClick={() => {
                              this.setState({
                                openPendingApproval: !openPendingApproval,
                              });
                            } }
                            >
                            {openPendingApproval ? (
                            <>
                              <ExpandLessIcon className={classes.arrowsColor} />
                            </>
                          ) : (
                            <ExpandMoreIcon className={classes.arrowsColor} />
                            )}
                        </span>
                        </Box>
                      </div>
                    </Card>
                  </Box>
                ) : null}
            </Grid>
          </Grid>
        </Box>

        {displayWelcomeModal && (
          <CustomDialog
            showButton={false}
            onConfirm={() => {
              this.setState({
                displayWelcomeModal: false,
              });
            } }
            title={t("componentData.dashboard.welcomeTxt")}
            width="960px"
            height="fit-content"
            >
            <Box className={classes.tourModalImageContainer}></Box>
            <Box className={classes.tourModalInfoContainer}>
              <Typography variant="h3">
                {t("componentData.dashboard.welcomeMsg")}
              </Typography>
            </Box>
            <Grid
              container
              spacing={2}
              justify="center"
              className={classes.tourModalActionContainer}
              >
              <Grid item>
                <Button
                  className={classes.marginRight}
                  variant="outlined"
                  onClick={() => {
                    this.setState({
                      displayWelcomeModal: false,
                    });
                  } }
                  color="secondary"
                  >
                  {t("componentData.dashboard.SkipTheTour")}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  onClick={() => {
                    this.setState(
                      {
                        displayWelcomeModal: false,
                      },
                      () => this.props.startGuidedTour()
                    );
                  } }
                  color="primary"
                  >
                  {t("componentData.dashboard.StartMyTour")}
                </Button>
              </Grid>
            </Grid>
          </CustomDialog>
        )}
        {this.state.modalMessage && (
          <Notification
            variant={this.state.variant}
            message={this.state.modalMessage}
            handleClose={() => {
              this.setState({ modalMessage: "" });
            } }
            />
        )}
      </Grid>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.campaign,
    ...state.suppliers,
  }))(withStyles(styles)(General))
);
