import React from "react";
import {
  Grid,
  Box,
  Paper,  
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { connect } from "react-redux";
import styles from "./styles";
import { Doughnut } from "react-chartjs-2";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/styles";
import StackBar from "~/components/StackBar/CC";
import { payeeLabels } from "~/config/entityTypes";

class EnrollmentGraphs extends React.Component {
  state = {
    statusByAmount: true,
    showDropdown: false,
  };

  componentDidMount() {}

  render() {
    const { classes, t,declinedCount, otherReasons, payeeStatusByAmount, payeeStatuses} = this.props;
    const { statusByAmount } = this.state;

    return (
      <Grid item className={classes.campaignsStatus} lg={12}>
        <Paper elevation={0}>
          <Box display="flex" width={1} justifyContent="space-between">
            <Box display="flex" justifyContent="flex-start" m={2} width={0.25}>
               
                <Box width={1}>
                  <Box
                    mb={2}
                    display="flex"
                    color={"#4c4c4c"}
                    fontWeight="700"
                  >
                    <FormControl className={classes.formControl}>
                      <Select
                        id="payee-select"
                        value={statusByAmount}
                        onChange={(e) => {
                          this.setState({
                            statusByAmount: e.target.value,
                          });
                        }}
                        className={classes.selectItem}
                      >
                        <MenuItem value={true}>
                          {t(
                            "componentData.CCEnrollmentCampaign.PayeeStatusByAmount"
                          )}
                        </MenuItem>
                        <MenuItem value={false}>
                          {t(
                            "componentData.CCEnrollmentCampaign.PayeesStatuses"
                          )}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  {statusByAmount ? <>
                  <Box style={{ float: "left" }}>
                  <Doughnut
                    width={110}
                    height={75}
                    data={{
                      labels: payeeStatusByAmount.length > 0 ? payeeStatusByAmount.map(item => item.label):[],
                      datasets: [
                        {
                          label: "",
                          data: payeeStatusByAmount.length > 0 ? payeeStatusByAmount.map(item => item.count):[1],
                          backgroundColor: payeeStatusByAmount.length > 0 ? payeeStatusByAmount.map(item => item.color):['#F4F4F4'],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      showTooltips: false,
                      tooltips: {
                        enabled: true,
                        displayColors: false,
                        callbacks: {
                          label: function(tooltipItem, data) {
                            if(payeeStatusByAmount.length > 0){
                              let value =  data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            }
                            else{
                              return 'No Data to show';
                            }
                          }
                        }              
                      },
                      aspectRatio: 1,
                      clip: {
                        left: 5,
                        top: false,
                        right: -2,
                        bottom: 0,
                      },
                      height: 200,
                      width: 200,
                      cutoutPercentage: 60,
                      animation: {
                        animateRotate: true,
                      },
                      responsive: false,
                      maintainAspectRatio: false,
                      legend: {
                        display: false,
                        position: "right",
                        labels: {
                          usePointStyle: true,                          
                          fontSize: 11,
                          fontStyle: "bold",
                          padding: 15,
                          boxWidth: 8,
                          fontColor: "rgba(18,18,18,0.87)",
                        },
                        title: {
                          padding: 6,
                        },
                      },
                      plugins: {
                        labels: {
                          fontSize: 0,
                        },
                      },
                    }}
                  />
                </Box>
                <span>
                  <ul className={classes.legendList}>
                    {payeeLabels.map((item) => {
                      return (
                        <li className="legendItem" name={item[0]}>
                          <Box
                            pb={1}
                            display="flex"
                            fontWeight={700}
                            fontSize={11}
                            alignItems="center"
                          >
                            <Box
                              width={"13px"}
                              height={"13px"}
                              marginRight={1}
                              style={{ backgroundColor: item.color, borderRadius:'50%' }}
                            >
                              {" "}
                            </Box>
                            <span className={classes.statusesLabel}>
                              {item.label}
                            </span>
                          </Box>
                        </li>
                      );
                    })}
                  </ul>
                </span></>
                  :
                    <>
                    <Box style={{ float: "left" }}>
                    <Doughnut
                      width={110}
                      height={75}
                      data={{
                        labels: payeeStatuses.length > 0 ? payeeStatuses.map(item => item.label):[],
                        datasets: [
                          {
                            label: "",
                            data: payeeStatuses.length > 0 ? payeeStatuses.map(item => item.count):[1],
                            backgroundColor: payeeStatuses.length > 0 ? payeeStatuses.map(item => item.color):['#F4F4F4'],
                            borderWidth: 0,
                          },
                        ],
                      }}
                      options={{
                        showTooltips: false,
                        tooltips: {
                          enabled: true,
                          displayColors: false,
                          callbacks: {
                            label: function(tooltipItem, data) {
                              if(payeeStatuses.length > 0){
                                let value =  data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                              }
                              else{
                                return 'No Data to show';
                              }
                            }
                          }              
                        },
                        aspectRatio: 1,
                        clip: {
                          left: 5,
                          top: false,
                          right: -2,
                          bottom: 0,
                        },
                        height: 200,
                        width: 200,
                        cutoutPercentage: 60,
                        animation: {
                          animateRotate: true,
                        },
                        responsive: false,
                        maintainAspectRatio: false,
                        legend: {
                          display: false,
                          position: "right",
                          labels: {
                            usePointStyle: true,                            
                            fontSize: 11,
                            fontStyle: "bold",
                            padding: 15,
                            boxWidth: 8,
                            fontColor: "rgba(18,18,18,0.87)",
                          },
                          title: {
                            padding: 6,
                          },
                        },
                        plugins: {
                          labels: {
                            fontSize: 0,
                          },
                        },
                      }}
                    />
                  </Box>
                  <span>
                    <ul className={classes.legendList}>
                      {payeeLabels.map((item) => {
                        return (
                          <li className="legendItem" name={item[0]}>
                            <Box
                              pb={1}
                              display="flex"
                              fontWeight={700}
                              fontSize={11}
                              alignItems="center"
                            >
                              <Box
                                width={"13px"}
                                height={"13px"}
                                marginRight={1}
                                style={{ backgroundColor: item.color, borderRadius:'50%' }}
                              >
                                {" "}
                              </Box>
                              <span className={classes.statusesLabel}>
                                {item.label}
                              </span>
                            </Box>
                          </li>
                        );
                      })}
                    </ul>
                  </span>
                    </>
                  }
                  
                </Box>
              
            </Box>
            <Box display="flex" justifyContent="flex-end" m={2} sx={{ width: '100%' }}>
              <StackBar
                heading={this.props.t(
                  "componentData.CCEnrollmentCampaign.DeclineReasons"
                )}
                data={declinedCount}
                otherReasons={otherReasons}
              />
            </Box>
          </Box>
        </Paper>
      </Grid>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
  }))(withStyles(styles)(EnrollmentGraphs))
);
