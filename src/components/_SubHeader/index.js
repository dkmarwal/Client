import React, { Component } from "react";
import { Typography, Box, Card, Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { TabPanel } from "~/components/TabPanel/index";
import "./styles.scss";

const styles = (theme) => ({
  root: {
    marginBottom: 0,
    padding: "0px 3%",
    marginTop: "5px",
  },
  headingTop: {
    fontWeight: 400,
    fontSize: "24px",
    color: "#0B1941",
    padding: "0 0 0 8px",
  },
  logoWrap: {
    padding: "0.70rem 1.875rem",
    fontSize: "16px",
    color: "#051b2",
  },
  headerBottom: {
    width: "auto",
    padding: "5px",
    fontSize: "14px",
    borderBottom: "0px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  card: {
    height: 85,
    overflow: "visible",
    display: "flex",
    alignItems: "center",
    position: "fixed",
    top: 56,
    zIndex: 7,
    width: "100%",
  },
});

class SubHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
    };
  }

  handleTabChange = (index) => {
    this.setState({ selectedTab: index });
  };

  render() {
    const { classes, title } = this.props;
    const { tabs } = this.props;
    const { selectedTab } = this.state;
    const totalTabs = tabs.filter((tab) => tab.showTab).length;

    return (
      <Box display="flex" flexDirection="column">
        <Card
          square
          className={classes.card}
          style={{ alignItems: totalTabs > 0 && "flex-end" }}
        >
          <Box px={5}>
            <Typography
              color="primary"
              variant="h2"
              className={classes.headingTop}
            >
              {title}
            </Typography>

            {totalTabs > 0 && (
              <Tabs
                value={selectedTab}
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
                className={this.props.customeWidth || ""}
              >
                {tabs
                  .filter((tab) => tab.showTab)
                  .map(
                    (tab, index) =>
                      tab.showTab && (
                        <Tab
                          onClick={() => this.handleTabChange(index)}
                          label={tab.name}
                          textColor="secondary"
                          disabled={false}
                          index={index}
                          value={index}
                          selected={selectedTab === index}
                        />
                      )
                  )}
              </Tabs>
            )}
          </Box>
        </Card>
        {tabs
          .filter((tab) => tab.showTab)
          .map((obj, i) => (
            <div>
              {selectedTab === i && obj.showTab && (
                <TabPanel value={selectedTab} index={i}>
                  {obj.component}
                </TabPanel>
              )}
            </div>
          ))}
      </Box>
    );
  }
}

export default withStyles(styles)(SubHeader);
