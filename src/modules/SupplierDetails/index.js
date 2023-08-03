import React, { Component } from "react";
import { Grid, Box, CircularProgress, Divider } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from "react-i18next";

import { styles } from "./styles";
import { getPayeeDetails, deactivatePayee, updatePayeeRisk, getPayeeRiskDetails } from "~/redux/helpers/suppliers";
import { fetchCCYearList, fetchCCGraphData } from "~/redux/helpers/dashboard";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import Notification from "~/components/Notification";

class SupplierDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      payeeData: {},
      loader: false,
      selectedTime: "2",
      selectedYear: null,
      selectedCurrency: "USD",
      trendForecast: false,
      SpendAnalysisGraphData: [],
      SpendAnalysisGraphOpt: [],
      yearList: [],
      alertMsg: null,
      alertType: null,
      spendAPIData: [],
      isLoading: false,
      isDataAvilable: true,
      leftPanelObj: [],
      isGraphDataAllZero: false,
      avgSpend: 0,
      deactiveModal: false,
      payeeRiskAnalysis: false,
      payeeResponseData: null
    };
  }

  componentDidMount = () => {
    this.fetchPayeeDetails();
    this.fetchYearList();
    this.fetchPayeeRiskDetails();
  };

  fetchPayeeRiskDetails = () => {
    const { location } = this.props;
    const { payeeRegInfoId } = location.state;

    getPayeeRiskDetails(payeeRegInfoId).then((res) => {
      if (res && !res.error) {
        this.setState({ payeeResponseData: res.data });
      }
    })
  }

  fetchPayeeDetails = () => {
    const { location } = this.props;
    const { payeeRegInfoId, clientId } = location.state;

    this.setState(
      {
        loader: true,
      },
      () => {
        getPayeeDetails(payeeRegInfoId, clientId).then((res) => {
          if (
            res.result &&
            res.result.payeeDetailsResponse &&
            res.result.payeeDetailsResponse.length
          ) {
            this.setState({
              payeeData: res.result.payeeDetailsResponse[0],
              loader: false,
            });
          } else {
            this.setState({
              alertMsg: res.message || res.title,
              alertType: "error",
              loader: false,
            });
            return false;
          }
        });
      }
    );
  };

  fetchYearList = () => {
    fetchCCYearList().then((res) => {
      if (res.error || res.isError) {
        this.setState({
          alertMsg: res.message || res.title,
          alertType: "error",
        });
        return false;
      }
      const data = res?.result?.yearsList ?? [];
      if (data.length > 0) {
        this.setYearList(data);
      }
    });
  };

  setYearList = (data) => {
    const years = data.map((item) => item.years);
    const sortedList = years.sort((a, b) => (a > b ? -1 : 1));
    this.setState(
      {
        selectedYear: sortedList[0],
        yearList: sortedList,
      },
      () => {
        this.getGraphDataFromAPI();
      }
    );
  };

  getGraphDataFromAPI = () => {
    const { location } = this.props;
    const { payeeRegInfoId, clientId } = location.state;

    this.setState(
      {
        isLoading: true,
      },
      () => {
        const { selectedYear, selectedCurrency, selectedTime, trendForecast } =
          this.state;

        const payload = {
          clientID: clientId,
          payeeRegInfoId: payeeRegInfoId,
          years: selectedYear,
          currencyCode: selectedCurrency,
          modeOfPeriod: selectedTime === "1" ? 1 : 2,
          trendForecast: trendForecast,
        };
        fetchCCGraphData(payload).then((res) => {
          if (res.error || res.isError) {
            this.setState({
              alertMsg: res.message || res.title,
              alertType: "error",
              isLoading: false,
            });
            return false;
          }
          this.setState(
            {
              spendAPIData: res?.result[0] ?? [],
              leftPanelObj: Boolean(
                res?.result[0]?.cumulativeSpendGraphResponseList ?? false
              )
                ? res?.result[0]?.cumulativeSpendGraphResponseList[0]
                : [],
              isDataAvilable:
                Object.keys(res?.result[0]).length > 0 ? true : false,
            },
            () => {
              this.drawSpendAnalysisGraph();
            }
          );
        });
      }
    );
  };

  drawSpendAnalysisGraph = () => {
    const { spendAPIData, trendForecast } = this.state;
    const graphData = spendAPIData?.cumulativeSpendGraphDetail ?? [];
    const { t } = this.props;

    let graphLabel = [];
    let graphDataSet = [];
    let isValGreaterZero = false;

    graphData.map((item) => {
      if (graphLabel.indexOf(item.label) == -1) {
        if (item?.label?.includes("Current")) {
          const val = item?.label?.split("(Current)")[0]?.trim("");
          let index = graphLabel.indexOf(val);
          index = index < 0 ? 0 : index;
          graphLabel[index] = item.label;
        } else {
          const val = graphLabel.find((a) => a.includes(item.label));
          if (!Boolean(val)) {
            graphLabel.push(item.label);
          }
        }
      }

      isValGreaterZero = Boolean(isValGreaterZero)
        ? isValGreaterZero
        : item.labelData > 0
          ? true
          : false;

      var isValAvilable = graphDataSet.findIndex((x) => x.id === item.labelId);

      if (isValAvilable === -1) {
        if (item.labelId === "lblCommittedSpend") {
          graphDataSet.push({
            type: "line",
            label: item.labelText,
            data: [item.labelData.toFixed(0)],
            id: item.labelId,
            backgroundColor: "#4A6EA7",
            borderColor: "#4A6EA7",
            fill: false,
            tension: 0,
            borderWidth: 2,
            borderDash: [0, 0],
            pointRadius: 1,
            steppedLine: true,
          });
        } else if (item.labelId === "lblForecastedSpend") {
          graphDataSet.push({
            type: "line",
            label: item.labelText,
            data: [item.labelData.toFixed(0)],
            id: item.labelId,
            backgroundColor: item.labelColorCode,
            borderColor: item.labelColorCode,
            fill: false,
            tension: 0,
            borderWidth: 2,
          });

          graphDataSet.push({
            type: "line",
            label: ` ${item.labelText}`,
            data: [item.labelData.toFixed(0)],
            id: "lblForecastedSpendDash",
            backgroundColor: item.labelColorCode,
            borderColor: item.labelColorCode,
            fill: false,
            tension: 0,
            borderWidth: 2,
            borderDash: [9, 9],
            spanGaps: true,
          });
        } else {
          graphDataSet.push({
            type: "bar",
            label: item.labelText,
            data: [item.labelData.toFixed(0)],
            id: item.labelId,
            backgroundColor: item.labelColorCode,
            borderColor: item.labelColorCode,
          });
        }
      } else {
        if (item.labelId === "lblForecastedSpend") {
          graphDataSet[isValAvilable].data = [
            ...graphDataSet[isValAvilable].data,
            item.labelData.toFixed(0),
          ];
          graphDataSet[isValAvilable + 1].data = [
            ...graphDataSet[isValAvilable + 1].data,
            item.labelData.toFixed(0),
          ];
        } else if (item.labelId === "lblForecastedSpendDash") {
          graphDataSet[isValAvilable].data = [
            ...graphDataSet[isValAvilable].data,
            item.labelData.toFixed(0),
          ];
        } else {
          graphDataSet[isValAvilable].data = [
            ...graphDataSet[isValAvilable].data,
            item?.labelData.toFixed(0),
          ];
        }
      }
    });

    var findInd = graphDataSet.findIndex((x) => x.id === "lblForecastedSpend");
    if (findInd != -1) {
      const sliceItem = graphDataSet.slice(findInd);
      graphDataSet.splice(findInd, 2);
      graphDataSet.splice(1, 0, sliceItem[0]);
      graphDataSet.splice(2, 0, sliceItem[1]);
    }

    var actualSpendThisYearIndx = graphDataSet.findIndex(
      (x) => x.id === "lblActualSpendThisYear"
    );
    const spendSum = graphDataSet[actualSpendThisYearIndx]?.data?.reduce(
      (a, b) => parseInt(a) + parseInt(b),
      0
    );
    const spendAvg =
      spendSum / graphDataSet[actualSpendThisYearIndx]?.data?.length || 0;

    const data = {
      labels: graphLabel,
      datasets: graphDataSet,
    };

    const options = {
      scales: {
        xAxes: [
          {
            stacked: false,
            barPercentage: 0.4,
          },
        ],
        yAxes: [
          {
            stacked: false,
            ticks: {
              beginAtZero: true,
              precision: 0,
              //max: maxValuePlusBuffer
              callback: function (value, index, values) {
                const valInK = Boolean(value)
                  ? Number(value / 1000).toFixed(0)
                  : 0;
                if (parseInt(valInK) >= 1000) {
                  return (
                    "$" +
                    valInK.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                    "K"
                  );
                } else {
                  return "$" + valInK + "K";
                }
              },
            },
            scaleLabel: {
              display: true,
              labelString: t("componentData.dashboard.AmountInDollars"),
            },
          },
        ],
      },
      interaction: {
        mode: "point",
        intersect: false,
      },

      tooltips: {
        enabled: true,
        padding: 10,
        footerSpacing: 4,
        mode: "index",
        backgroundColor: "#f7f7f7",
        bodyFontColor: "#000",
        titleFontColor: "#000",
        bodySpacing: 6,
        titleMarginBottom: 10,
        displayColors: true,
        reverse: false,
        filter: function (tooltipItem, data) {
          var id = data.datasets[tooltipItem.datasetIndex].id;
          if (id === "lblForecastedSpend") {
            return false;
          } else {
            return true;
          }
        },
        itemSort: function (a, b) {
          //return b.value - a.value;
        },
        callbacks: {
          label: function (tooltipItem, data) {
            let dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
            let currObject = data && data["datasets"][dataSetIndex];
            return (
              tooltipItem &&
              `${currObject && currObject["label"]} - $${tooltipItem["value"]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
            );
          },
        },
      },
      plugins: {
        labels: {
          render: "percentage",
          fontColor: ["#000", "#000"],
          textMargin: -25,
          precision: 1,
          fontSize: 0,
        },
      },
      legend: {
        display: true,
        position: "bottom",
        reverse: false,
        labels: {
          usePointStyle: false,
          fontColor: "#121212",
          fontSize: 12,
          fontStyle: "normal",
          padding: 10,
          boxWidth: 20,
          filter: function (item, chart) {
            return (
              chart.datasets[item.datasetIndex].id != "lblForecastedSpendDash"
            );
          },
        },
        title: {
          padding: 6,
        },
        onClick: function (e, legendItem) {
          const index = legendItem.datasetIndex;
          const ci = this.chart;
          if (index === 1 && trendForecast) {
            const meta = ci.getDatasetMeta(index);
            meta.hidden =
              meta.hidden === null ? !ci.data.datasets[index].hidden : null;
            const meta2 = ci.getDatasetMeta(index + 1);
            meta2.hidden =
              meta2.hidden === null ? !ci.data.datasets[index].hidden : null;
          } else {
            const meta = ci.getDatasetMeta(index);
            meta.hidden =
              meta.hidden === null ? !ci.data.datasets[index].hidden : null;
          }
          ci.update();
        },
      },
      responsive: true,
    };

    this.setState({
      SpendAnalysisGraphData: data,
      SpendAnalysisGraphOpt: options,
      isGraphDataAllZero: Boolean(isValGreaterZero) ? false : true,
      avgSpend: spendAvg.toFixed(2),
      isLoading: false,
    });
  };

  handleRadioChange = (e) => {
    this.setState(
      {
        selectedTime: e.target.value,
      },
      () => this.getGraphDataFromAPI()
    );
  };
  onChangeCurrency = (type) => {
    this.setState(
      {
        selectedCurrency: type,
      },
      () => this.getGraphDataFromAPI()
    );
  };

  onTrendForcasteChange = (e) => {
    this.setState(
      {
        trendForecast: e.target.checked,
      },
      () => this.getGraphDataFromAPI()
    );
  };
  handleYearChange = (e) => {
    this.setState(
      {
        selectedYear: e.target.value,
      },
      () => this.getGraphDataFromAPI()
    );
  };

  onCheckChange = (e) => {
    const { name, checked } = e.target;

    if (name == 'trendForecast') {
      this.setState({
        [name]: checked
      }, () => this.getGraphDataFromAPI())
    }
    else {
      this.setState({ [name]: checked })
    }
  }

  handleDeactiveConfirm = async () => {
    const { t, location } = this.props;
    const { payeeRegInfoId } = location.state;

    const payload = {
      payeeRegInfoId: payeeRegInfoId
    };
    const res = await deactivatePayee(payload);

    if (res.error) {
      this.setState({
        alertMsg: res.message ? res.message : t('componentData.reduxData.SomethingWentWrong'),
        alertType: 'error'
      });
    } else {
      if (res && res.data && res.data.success) {
        this.setState({
          alertMsg: res.message,
          alertType: 'success'
        });
        this.fetchPayeeDetails();
      } else {
        this.setState({
          alertMsg: res.message ? res.message : t('componentData.PayeeDetails.deactiveFailed'),
          alertType: 'error'
        });
      }
    }
    this.handlePayeeClose();
  }

  handleRiskConfirm = async (data) => {
    const { t, location } = this.props;
    const { payeeRegInfoId } = location.state;

    const payload = {
      ...data,
      payeeRegInfoId: payeeRegInfoId
    };
    const res = await updatePayeeRisk(payload);

    if (res.error) {
      this.setState({
        alertMsg: res.message ? res.message : t('componentData.reduxData.SomethingWentWrong'),
        alertType: 'error'
      });
    } else {
      if (res && res.data && res.data.success) {
        this.setState({
          alertMsg: res.message,
          alertType: 'success'
        });
        this.fetchPayeeRiskDetails();
        this.fetchPayeeDetails();
      } else {
        this.setState({
          alertMsg: res.message ? res.message : t('componentData.PayeeDetails.payeeRiskFailed'),
          alertType: 'error'
        });
      }
    }
    this.handleRiskClose();
  }

  onDeactivateClick = () => {
    this.setState({ deactiveModal: true })
  }
  handlePayeeClose = () => {
    this.setState({ deactiveModal: false })
  }
  onPayeeRiskClick = () => {
    this.setState({ payeeRiskAnalysis: true })
  }
  handleRiskClose = () => {
    this.setState({ payeeRiskAnalysis: false })
  }

  hideAlertMessage = () => {
    this.setState({
      alertType: null,
      alertMsg: null
    });
  }

  renderSnackbar = (type, message) => {
    return (
      <Notification
        variant={type}
        message={message}
        handleClose={this.hideAlertMessage}
      />
    );
  };

  render() {
    const { classes, location } = this.props;
    const { payeeRegInfoId } = location.state;
    const {
      payeeData,
      loader,
      SpendAnalysisGraphData,
      SpendAnalysisGraphOpt,
      leftPanelObj,
      selectedTime,
      isLoading,
      selectedCurrency,
      selectedYear,
      isDataAvilable,
      trendForecast,
      yearList,
      alertType,
      alertMsg,
      deactiveModal,
      payeeRiskAnalysis,
      payeeResponseData
    } = this.state;

    return (
      <Grid container className={classes.mainSection}>
        <Grid item xs={payeeData && (payeeData.payeeStatusId == 1) ? 6 : 12} className={classes.detailSection}>
          {!loader ?
            <LeftPanel data={payeeData} payeeRegInfoId={payeeRegInfoId} />
            :
            <Box display="flex" justifyContent="center">
              <CircularProgress color="primary" />
            </Box>
          }
        </Grid>

        {payeeData && (payeeData.payeeStatusId == 1) ?
          <Grid item xs={6} className={classes.graphSection}>
            <Grid className={classes.border}>
              {!isLoading ?
                <RightPanel
                  SpendAnalysisGraphData={SpendAnalysisGraphData}
                  SpendAnalysisGraphOpt={SpendAnalysisGraphOpt}
                  handleRadioChange={this.handleRadioChange}
                  selectedTime={selectedTime}
                  leftPanelObj={leftPanelObj}
                  changeCurrency={this.onChangeCurrency}
                  selectedCurrency={selectedCurrency}
                  selectedYear={selectedYear}
                  isDataAvilable={isDataAvilable}
                  trendForecast={trendForecast}
                  yearList={yearList}
                  handleYearChange={this.handleYearChange}
                  onCheckChange={this.onCheckChange}
                  handleDeactiveConfirm={this.handleDeactiveConfirm}
                  handleRiskConfirm={this.handleRiskConfirm}
                  deactiveModal={deactiveModal}
                  payeeRiskAnalysis={payeeRiskAnalysis}
                  onDeactivateClick={this.onDeactivateClick}
                  onPayeeRiskClick={this.onPayeeRiskClick}
                  handleRiskClose={this.handleRiskClose}
                  handlePayeeClose={this.handlePayeeClose}
                  payeeResponseData={payeeResponseData}
                  isDeactivated={payeeData && payeeData.payeeActiveStatus ? !payeeData.payeeActiveStatus : true}
                  payeeIsInRisk={payeeData && payeeData.isPayeeConsideredNotAtRisk ? payeeData.isPayeeConsideredNotAtRisk : false}
                />
                :
                <Box display="flex" justifyContent="center">
                  <CircularProgress color="primary" />
                </Box>
              }
            </Grid>
          </Grid>
          :
          null
        }
        {alertMsg && this.renderSnackbar(alertType, alertMsg)}
      </Grid>
    );
  }
}

export default withTranslation()(withStyles(styles)(SupplierDetails));
