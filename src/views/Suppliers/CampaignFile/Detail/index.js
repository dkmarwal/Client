import React, { Component } from "react";
import Notification from "~/components/Notification";
import {
  Grid,
  Box,
  CircularProgress,
  Tabs,
  Tab,
} from "@material-ui/core";
import { TabPanel } from "~/components/TabPanel/index";
import config from "~/config";
import PaymentFilesDetails from "./paymentFilesDetails";
import { withStyles } from "@material-ui/core/styles";
import GetAppIcon from "@material-ui/icons/GetApp";
import IconButton from "@material-ui/core/IconButton";
import {
  downloadCampaignFile, getCampaignFileExceptionById, updateCampaignFileAction
} from "~/redux/helpers/campaigns";
import { connect } from "react-redux";
import { withTranslation } from 'react-i18next';

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

import { Button } from "@material-ui/core";
import { styles } from "./styles";
import { accessRights } from "~/config/accessRights";
import * as FileSaver from "file-saver";
import { approveFileStatusList, rejectFileStatusList } from '~/utils/const';
import PayeeEnrollmentDetails from '~/modules/PayeeEnrollmentDetails';
import { entityType } from '~/config/entityTypes';

class Detail extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;
    this.state = {
      error: false,
      variant: "error",
      isLoading: false,
      campaignFileData: state && state.data ? state.data : [],
      paymentData: [],
      paymentException: [],
      selectedTab: 0,
      pageNumber: 1,
      count: 2,
    };
  }

  downLoadCampaignFile = (id) => {
    const { t } = this.props;
    downloadCampaignFile(id)
      .then((response) => {

        const fileName = `${response.headers["x-file-name"]}`;
        if (!response) {
          this.setState({ error: t('componentData.fileDetails.FileNotExists') });
          return false;
        }
        const type = response.headers["content-type"];
        const data = new Blob([response.data], {
          type: type,
          encoding: "UTF-8",
        });
        FileSaver.saveAs(data, fileName);
        this.setState({ error: false });
      })
      .catch((error) => {
        this.setState({ error: t('componentData.fileDetails.FileNotExists') });
      });
  };
  componentDidMount() {
    this.loadData();
  }

  loadData = () => {
    const {t} = this.props;
    const { campaignFileData } = this.state;
    getCampaignFileExceptionById(campaignFileData.FileID).then((res) => {
      if (!res || res.error) {
        this.setState({
          error: res?.message ?? t('componentData.reduxData.SomethingWentWrong'),
          variant: "error",
        });
        return;
      }
      this.setState({
        paymentException: res,
      });
    });
  };
  groupBy = (objectArray, property) => {
    return (
      objectArray &&
      objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
          acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
      }, {})
    );
  };
  handleBtnClick = async (item) => {

    const { campaignFileData } = this.state;
    const { t } = this.props;
    const res = await updateCampaignFileAction([campaignFileData.FileID], item);
    if (res.error) {
      this.setState({
        error: res.message || t("componentData.importPaymentFiles.SomethingWrong"),
        variant: "error",
      });
      return false;
    }
    this.setState({
      error: t("componentData.importPaymentFiles.ActionUpdated"),
      variant: "success",
    }, () => {
      this.props.history.push(`${config.baseName}/suppliers/campaignFiles`);
    });
  };  

  render() {
    const { classes, user, t } = this.props;
    const {appType} = this.props.user.userData;
    const {
      error,
      variant,
      isLoading,
      campaignFileData,
      paymentException,
      selectedTab
    } = this.state;

    const isCampaignFileApproveEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_CAMPAIGN_FILE_APPROVE"])) ||
      false;
    const isCampaignFileRejectEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_CAMPAIGN_FILE_REJECT"])) ||
      false;
    const isCampaignFileDownloadEnabled =
      (user.userRoles &&
        user.userRoles.includes(accessRights["SUPPLIERS_CAMPAIGN_FILE_DOWNLOAD"])) ||
      false;
    if (isLoading) {
      return (
        <Box className="loader-container">
          <CircularProgress color="primary" />
        </Box>
      );
    }   

    return (
      <>
        <Box
          mx={6}
          mt={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <h4 className={classes.fileText}>
              {" "}
              <span>{t('componentData.supplierCampaignFile.Campaign')} </span> /{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={
                  () =>
                    this.props.history.push(
                      `${config.baseName}/suppliers/campaignFiles`
                    )
                }
              >
                {t('componentData.fileDetails.FileID')} {campaignFileData.FileID}{" "}
              </span>
            </h4>
          </Box>
          <Box className={classes.buttonAlign}>

            {isCampaignFileRejectEnabled && (
              <Button
                color="primary"
                size="small"
                onClick={() => this.handleBtnClick("REJECTED")}
                disabled={
                  (campaignFileData && rejectFileStatusList.includes(campaignFileData.FileStatusId))
                    ? false
                    : true
                }
              >
                {" "}
                <CancelIcon size="small" /> {t('componentData.fileDetails.Reject')} {" "}
              </Button>
            )}
            {isCampaignFileApproveEnabled && (
              <Button
                color="primary"
                size="small"
                onClick={() => this.handleBtnClick("APPROVED")}
                disabled={
                  (campaignFileData && approveFileStatusList.includes(campaignFileData.FileStatusId))
                    ? false
                    : true
                }
              >
                {" "}
                <CheckCircleIcon size="small" />
                {t('componentData.fileDetails.Approve')}{" "}
              </Button>
            )}
          </Box>
        </Box>

        <Box mx={4} my={2} display="flex" alignItems="stretch">
          <Box
            bgcolor="white"
            p={1}
            width="100%"
            boxShadow={
              "0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2)"
            }
          >
            <Box
              fontSize={16}
              color="primary"
              textAlign="center"
              display="flex"
              alignItems="center"
              style={{ wordBreak: "break-word" }}
            >
              <span style={{ color: "#0098e9", paddingRight: "10px" }}>
                {" "}
                {t('componentData.supplierCampaignFile.CampaignFileName')}{" "}
              </span>{" "}
              {campaignFileData && campaignFileData.FileName
                ? campaignFileData.FileName
                : "--"}
              {isCampaignFileDownloadEnabled && (
                <IconButton
                  color="primary"
                  aria-label="download"
                  component="span"
                  size="small"
                  style={{ marginLeft: "10px" }}
                  onClick={() =>
                    this.downLoadCampaignFile(campaignFileData.FileID)
                  }
                >
                  <GetAppIcon color="primary" fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>

        <Box
          mx={4} my={2}
          display="flex"
          justifyContent="space-between"
          alignItems="stretch"
        >
          <PaymentFilesDetails
            campaignFileData={campaignFileData}
            {...this.props}
          />
        </Box>


        {Boolean(appType) && parseInt(appType) === entityType.B2C 
          ? <PayeeEnrollmentDetails
            parentFileData={campaignFileData}
            type="campaignFile"
            {...this.props}
           />
          : null
        }

        <Box
          mx={4} my={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12}>
            <div className={classes.paymentsTabContainer}>
              <Grid item xs={12} md={12} lg={12}>
                <Tabs
                  orientation="horizontal"
                  variant="standard"
                  value={selectedTab}
                  TabIndicatorProps={{ className: classes.indicator }}
                  style={{ color: "#008CE6", padding: "0 20px", boxSizing: "border-box" }}
                >
                  <Tab
                    label={`${t('componentData.supplierCampaignFile.NoOfExceptions')} `}
                    disabled={false}
                    classes={classes.tabClasses}
                  />
                </Tabs>
              </Grid>

              <Grid item xs={12} md={12}>
                <TabPanel value={selectedTab} index={0} className={classes.tabContentArea}>
                  <Grid container style={{borderRadius: "10px", background: "#fff"}}>
                      {paymentException && Object.keys(paymentException).length > 0 && (
                        <>
                          <Grid container
                            style={{
                              background: "#CEE1F0", 
                              display: "flex", 
                              padding: "8px",
                              borderRadius: "10px 10px 0 0",
                              fontSize: "18px"                          
                            }}                      
                          >
                              <Grid item xs={3}>
                                {t('componentData.fileDetails.ConsumerIDTxt')}
                              </Grid>
                              <Grid item xs={9}>
                                {t('componentData.fileDetails.ReasonForException')}
                              </Grid>
                        </Grid>
                        </>
                      )}

                    {paymentException.length > 0 &&
                      paymentException.map((item, index) => {
                        return (
                          <>
                            <Grid item xs={12} className={classes.repeatedBox}>
                              <Box>
                                <Grid container>
                                  <Grid item xs={3}>
                                    {item.consumerIdentifier}
                                  </Grid>
                                  <Grid item xs={9}>
                                    {item.failureDataReason}
                                  </Grid>
                                </Grid>                                

                              </Box>
                            </Grid>
                          </>
                        );
                      })}
                  </Grid>
                </TabPanel>
              </Grid>
            </div>
          </Grid>
        </Box>
        {error && <Notification variant={variant} message={error} />}
      </>
    );
  }
}

export default withTranslation()(connect((state) => ({ ...state.user }))(
  withStyles(styles)(Detail)
));
