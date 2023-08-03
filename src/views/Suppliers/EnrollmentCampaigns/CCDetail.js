import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Paper,
  Link,
  Tabs,Tab
} from "@material-ui/core";

import { withStyles } from "@material-ui/styles";
import { TabPanel } from "~/components/TabPanel/index";
import styles from "./ccDetailStyle";
import config from "~/config";
import EnrollmentGraphs from "~/modules/CCEnrollmentCampaigns/EnrollmentGraphs";
import Payees from "~/modules/CCEnrollmentCampaigns/Payees";
import Files from "~/modules/CCEnrollmentCampaigns/Files";
import {  fetchSuppliersGraphData} from "~/redux/helpers/suppliers";

class CCEnrollmentCampaignDetails extends Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location;    
    this.state = {
      isLoading: true,
      selectedTab: 0,
      item: (state && state.item) || {},
      declinedCount: [],
      otherReasons:[],
      totalWeight: 0,
      payeeStatuses: [],
      payeeStatusByAmount: [],
    };
  }

  componentDidMount = async () => {
    this.getAllGraphData();
  };

  getAllGraphData = () => {
    const {item} = this.state;
    fetchSuppliersGraphData(item?.ccCampaignId).then((response) => {
      if (response) {
        this.setState({
          declinedCount: response?.data?.declinedStatus || [],
          otherReasons :response?.data?.otherReasons || [],
          payeeStatuses:response?.data?.payeeStatuses || [], 
          payeeStatusByAmount: response?.data?.payeeStatusesByAmount || [],
        });
      }
    });
  };
  handleTabChange = (val) => {
    this.setState({ selectedTab: val });
  };
  render() {
    const {
      item,
      selectedTab,
      declinedCount,
      otherReasons,
      payeeStatuses,
      payeeStatusByAmount,
    } = this.state;
    const { t } = this.props;
    const { classes, campaign } = this.props;

    return (
      <Box mx={6} mt={2}>
        <Box my={2}>
          <h4 className={classes.fileText}>
            <span>
              <Link
                style={{ color: "#2996EE" }}
                href="javascript:return void(0)"
                onClick={() =>
                  this.props.history.push(
                    `${config.baseName}/suppliers/enrollmentCampaigns/`
                  )
                }
              >
                {t("componentData.supplierDetail.EnrollmentCampaigns")}
              </Link>
            </span>
            {" "}/ {t("componentData.supplierDetail.CampaignName")}:{" "}
            {item.ccCampaignName}
          </h4>
        </Box>
        {/* <Grid container justifyContent="center"> */}
          <EnrollmentGraphs
            otherReasons={otherReasons}
            declinedCount={declinedCount}
            payeeStatuses={payeeStatuses}
            payeeStatusByAmount={payeeStatusByAmount}
          />
        {/* </Grid> */}

        {/*****Start Table Section****/}
        <Box my={4}>
          <Grid container xs={12}>
            <Grid item xs={8}>
              <Box mx={2}>
                <Tabs
                  orientation="horizontal"
                  variant="standard"
                  value={selectedTab}
                  indicatorColor="secondary"
                  textColor="secondary"
                >
                  <Tab
                    onClick={() => this.handleTabChange(0)}
                    label={t("componentData.CCEnrollmentCampaign.Payees")}
                    disabled={false}
                    textColor="secondary"
                  />
                  {/* <Tab
                    onClick={() => this.handleTabChange(1)}
                    label={this.props.t(
                      "componentData.CCEnrollmentCampaign.Weeklyfiles"
                    )}
                    disabled={false}
                    textColor="secondary"
                  /> */}
                </Tabs>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" justifyContent="flex-end">
                <Box p={1} fontSize={12} color={"#828282"}>
                  {campaign.fileText ? (
                    <>
                      {t("componentData.CCEnrollmentCampaign.LastFileText")} {" "}
                      {campaign.fileText}
                    </>
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper>
                <TabPanel value={selectedTab} index={0} isFMT={true}>
                  <Payees item={item} />
                </TabPanel>
                <TabPanel value={selectedTab} index={1} isFMT={true}>
                  <Files item={item} />
                </TabPanel>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.role,
    ...state.permissions,
    ...state.ccCampaign,
  }))(withStyles(styles)(CCEnrollmentCampaignDetails))
);
