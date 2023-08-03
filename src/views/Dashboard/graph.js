import {
    Box,    
    Grid,    
    Paper,
    TextField,
    withStyles,
    MenuItem,
    Button,
    CircularProgress,
  } from "@material-ui/core";
  import React, { Component } from "react";
  import { connect } from "react-redux";
  import { Line, Doughnut } from "react-chartjs-2";  
  import styles from "./styles";
  import moment from "moment";
  import {
    fetchDashboardPayments,
    fetchDashboardPaymentSummary,
    fetchDashboardChildEntities,
    fetchDashboardSupplierEnrollmentData,
    fetchDashboardSankeyData,
  } from "../../redux/helpers/dashboard";
  import { SideDialog } from "../../components/Dialogs";
  import DashboardDateFilter from "../../modules/DashboardDateFilter";   
  import { getDashboardCampaignList } from "../../redux/helpers/campaigns";
  import EventIcon from "@material-ui/icons/Event";
  import "chartjs-plugin-annotation";  
  import { withTranslation } from "react-i18next";
  import { accessRights } from "~/config/accessRights";  
  import Notification from "~/components/Notification";
  import Highcharts from "highcharts";
  import HighchartsSankey from "highcharts/modules/sankey";
  import HighchartsReact from "highcharts-react-official";
  import "./sankey.css"; 
  import Options from "./sankey/options";
  import Callback from "./sankey/callback";
  import 'chartjs-plugin-labels';
  import {
    getNodeColor,
    getStatusColorToPoint,
    getStatusColorFromPoint,
  } from "./sankey/colors";
  HighchartsSankey(Highcharts);
  
  var H = Highcharts;
  
  H.seriesTypes.sankey.prototype.pointAttribs = function (point, state) {
    var opacity = this.options.linkOpacity,
      color = point.color;
  
    if (state) {
      opacity = this.options.states[state].linkOpacity || opacity;
      color = this.options.states[state].color || point.color;
    }
  
    return {
      fill: point.isNode
        ? point.column === 0
          ? "#939393"
          : getNodeColor(point)
        : point.fromNode.column === 0
        ? {
            linearGradient: {
              x1: 0,
              x2: 1,
              y1: 0,
              y2: 0,
            },
            stops: [
              [0, H.color("#939393").setOpacity(0.6).get()],
              [1, H.color(getStatusColorToPoint(point)).setOpacity(0.8).get()],
            ],
          }
        : {
            linearGradient: {
              x1: 0,
              x2: 1,
              y1: 0,
              y2: 0,
            },
            stops: [
              [0, H.color(getStatusColorFromPoint(point)).setOpacity(0.8).get()],
              [1, H.color(getStatusColorToPoint(point)).setOpacity(0.6).get()],
            ],
          },
    };
  };
  
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  if (month === 0) {
    month = 12;
    year = year - 1;
  }
  
  class Graph extends Component {
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
      paymentFiles: [],
      displayWelcomeModal: false,
      openSupplierUpdates: false,
      openSupplierApproval: false,
      openPaymentFiles: false,
      enableDateFilter: false,
      selectedFilter: 2,
      selectedCurrentDateFilter: 2,
      filters: [
        {
          label: "All time",
          key: 0,
        },
        {
          label: "Previous Month",
          key: 1,
        },
        {
          label: "Previous Quarter",
          key: 2,
        },
        {
          label: "Previous Year",
          key: 3,
        },
        {
          label: "Last 7 days",
          key: 4,
        },
        {
          label: "Last 30 Days",
          key: 5,
        },
        {
          label: "Custom",
          key: 6,
        },
      ],
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
      doughnutData: {
        labels: ["ACH", "CHK", "VCA"],
        datasets: [
          {
            label: "# of Tomatoes",
            data: [0, 0, 0],
            backgroundColor: ["#1AABA3", "#008CE6", "#CCE4FF"],
            borderWidth: 0,
          },
        ],
      },
  
      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            // Any unspecified dimensions are assumed to be 0
            right: 86,
          },
        },
        legend: {
          display: false,
          position: "right",
          fillStyle: "",
          color: "rgba(0,0,0,0)",
          labels: {
            usePointStyle: true,
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          yAxes: [
            {
              gridLines: { color: "#E9EBF1" },
              ticks: {
                beginAtZero: true,
                fontFamily: "Interstate",
                fontColor: "#9AA1A9",
                maxTicksLimit: 5,
                min: 0,
                callback: function (value, index, array) {
                  return value < 1000
                    ? value
                    : value < 1000000
                    ? value / 1000 + "K"
                    : value < 1000000000
                    ? value / 1000000 + "M"
                    : value / 1000000000 + "B";
                },
              },
            },
          ],
          xAxes: [
            {
              gridLines: { color: "#E9EBF1" },
              ticks: {
                beginAtZero: true,
                fontFamily: "Interstate",
                fontColor: "#9AA1A9",
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: "white",
          titleFontColor: "#7F7F7F",
          bodyFontColor: "#7F7F7F",
          bodySpacing: 2,
          bodyFontStyle: "bold",
          bodyAlign: "left",
          titleFontSize: 14,
          titleFontStyle: "bold",
          bodyFontFamily: "Interstate",
          axis: "x",
          animationDuration: 400,
          mode: "index",
          intersect: false,
          usePointStyle: true,
          callbacks: {
            label: function (tooltipItem, data) {
              let dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
              let currObject = data && data["datasets"][dataSetIndex];
              return (
                tooltipItem &&
                `${tooltipItem["value"]
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - ${
                  currObject && currObject["label"]
                }`
              );
            },
          },
        },
        hover: {
          usePointStyle: true,
          mode: "y",
        },
      },
      payeeEnrollmentOptions: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            // Any unspecified dimensions are assumed to be 0
            right: 86,
          },
        },
        legend: {
          display: true,
          position: "bottom",
          fillStyle: "",
          color: "rgba(0,0,0,0)",
          labels: {
            usePointStyle: true,
          },
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          yAxes: [
            {
              gridLines: { color: "#E9EBF1" },
              ticks: {
                beginAtZero: true,
                fontFamily: "Interstate",
                fontColor: "#9AA1A9",
                maxTicksLimit: 5,
                // max: 5,
                min: 0,
                callback: function (value, index, array) {
                  return value < 1000
                    ? value
                    : value < 1000000
                    ? value / 1000 + "K"
                    : value < 1000000000
                    ? value / 1000000 + "M"
                    : value / 1000000000 + "B";
                },
              },
            },
          ],
          xAxes: [
            {
              gridLines: { color: "#E9EBF1" },
              ticks: {
                beginAtZero: true,
                fontFamily: "Interstate",
                fontColor: "#9AA1A9",
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: "white",
          titleFontColor: "#7F7F7F",
          bodyFontColor: "#7F7F7F",
          titleFontStyle: "bold",
          titleFontSize: 14,
          bodySpacing: 2,
          bodyFontStyle: "bold",
          bodyAlign: "left",
          bodyFontFamily: "Interstate",
          axis: "x",
          animationDuration: 400,
          mode: "index",
          intersect: false,
          usePointStyle: true,
          callbacks: {
            label: function (tooltipItem, data) {
              let dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
              let currObject = data && data["datasets"][dataSetIndex];
              return (
                tooltipItem &&
                `${tooltipItem["value"]
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - ${
                  currObject && currObject["label"]
                }`
              );
            },
          },
        },
        hover: {
          usePointStyle: true,
          mode: "y",
        },
      },
      doughnutOptions: {
        tooltips: {
          enabled: true,
          callbacks: {
            label: function(tooltipItem, data) {
              let label = data.labels[tooltipItem.index];
              let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return ' ' + label + ': ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
          }
        },
        aspectRatio: 1,
        clip: { left: 5, top: false, right: -2, bottom: 0 },
        height: 200,
        width: 200,
        cutoutPercentage: 60,
        animation: {
          animateRotate: true,
        },
        responsive: false,
        maintainAspectRatio: true,
        legend: {
          display: true,
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
          }
        }
      },
      filter: {
        clientID: 0,
        payeeID: 0,
        year: year,
        month: month,
        quarter: "",
        lastDays: undefined,
        resultType: "",
        currency: "",
        fromDate: undefined,
        toDate: undefined,
      },
      modalMessage:null,
      variant:''
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
  
    getSankeyChartData = () => {
      const {t} = this.props
      const { selectedCampaign, selectedEntityClientId } = this.state;
      const reportType =
        selectedCampaign.campaignId === 0
          ? "ALL"
          : selectedCampaign.campaignId === -1
          ? "ACTIVE"
          : "SPECIFIC";
      this.setState({ isSankeyLoading: true }, () => {
        fetchDashboardSankeyData(
          selectedEntityClientId,
          selectedCampaign.campaignId,
          reportType
        ).then((res) => {
          if(!res || res.error){
            this.setState({
              isSankeyLoading: false,
              variant:'error',
              modalMessage: res.message || t(`componentData.reduxData.SomethingWentWrong`)
            });
            return false
          } else if (res) {
            this.setState({
              data: res && res["data"],
              isSankeyLoading: false,
            });
          }
        });
      });
    };
  
    componentDidMount() {
      const clientId = this.props.user.userData.portalProfileId;      
      this.setState(
        {
          selectedEntityPaymentClientId: clientId,
          selectedEntityClientId: clientId,
        },
        () => {  
          this.getCampaignsList(0);
          const { userRoles } = this.props.user;
          const flag =
            (userRoles &&
              userRoles.includes(accessRights["PARENT_CHILD_ACCESS_VIEW"])) ||
            false;
          //Call API if use has parent child permission view
          if (flag) {
            this.getChildEntitiesList();
          }  
          this.prepareData();
        }
      );
    }
  
    getCampaignsList = (childClientId) => {
      getDashboardCampaignList(childClientId).then((resp) => {
        this.setState({
          campaignList: resp,
        });
      });
    };
  
    getChildEntitiesList = () => {
      fetchDashboardChildEntities().then((res) => {
        this.setState({
          childEntities: res && res.data,
        });
      });
    };
  
    prepareSupplierEnrollmentData(campaignId) {
      const { t } = this.props;
      const { selectedCampaign, selectedEntityClientId } = this.state;
      const reportType =
        selectedCampaign.campaignId === 0
          ? "ALL"
          : selectedCampaign.campaignId === -1
          ? "ACTIVE"
          : "SPECIFIC";
      this.getCampaignsList(selectedEntityClientId);
      fetchDashboardSupplierEnrollmentData(
        selectedEntityClientId,
        selectedCampaign.campaignId,
        reportType
      ).then((re) => {
        this.setState({ supplierEnrollmentData: re && re.data }, () => {
          const { supplierEnrollmentData } = this.state;
          const timeline = [];
          const approved =
            supplierEnrollmentData &&
            supplierEnrollmentData.length &&
            supplierEnrollmentData.length > 0 &&
            supplierEnrollmentData.map((o) => ({
              y: o && o["approved"],
              x: o && o["figureFor"],
            }));
          const enrollmentInitiated =
            supplierEnrollmentData &&
            supplierEnrollmentData.length &&
            supplierEnrollmentData.length > 0 &&
            supplierEnrollmentData.map((o) => ({
              y: o && o["enrollmentInitiated"],
              x: o && o["figureFor"],
            }));
          const total =
            supplierEnrollmentData &&
            supplierEnrollmentData.length &&
            supplierEnrollmentData.length > 0 &&
            supplierEnrollmentData.map((o) => ({
              y: o && o["totalPayee"],
              x: o && o["figureFor"],
            }));
          supplierEnrollmentData &&
            supplierEnrollmentData.length &&
            supplierEnrollmentData.length > 0 &&
            supplierEnrollmentData.forEach((obj) => {
              if (!timeline.includes(obj["date"])) {
                timeline.push(obj["date"]);
              }
            });
          this.setState({
            payeeEnrollmentData: {
              labels: this.sortDates(timeline),
              datasets: [
                {
                  fill: true,
                  label: t("componentData.dashboard.approved"),
                  backgroundColor: "#F7B500",
                  borderColor: "#F7B500",
                  lineTension: 0,
                  data: approved,
                  pointHoverBackgroundColor: "#ffffff",
                },
                {
                  fill: true,
                  label: t("componentData.dashboard.enrollmentInitiated"),
                  lineTension: 0,
                  backgroundColor: "#68BBF1",
                  borderColor: "#68BBF1",
                  data: enrollmentInitiated,
                  pointHoverBackgroundColor: "#ffffff",
                },
                {
                  fill: true,
                  label: t("componentData.dashboard.total"),
                  lineTension: 0,
                  backgroundColor: "#264D88",
                  borderColor: "#264D88",
                  data: total,
                  pointHoverBackgroundColor: "#ffffff",
                },
              ],
            },
          });
        });
      });
    }
  
    prepareDashboardSummary(payload) {
      fetchDashboardPaymentSummary(payload).then((res) => {
        this.setState(res.data && res.data[0], () => {
          const {
            totalCHKPayment,
            totalACHPayment,
            totalVCAPayment,
          } = this.state;
          let doughnutChart = document.getElementById("doughnutChart");
          doughnutChart.style.float = "left";
          this.setState({
            doughnutData: {
              labels: [`ACH`, `CHK`, `VCA`],
              datasets: [
                {
                  label: "# of Tomatoes",
                  data: [
                    totalACHPayment || 0,
                    totalCHKPayment || 0,
                    totalVCAPayment || 0,
                  ],
                  backgroundColor: ["#008CE6", "#CCE4FF", "#1AABA3"],
                  borderWidth: 0,
                },
              ],
            },
          });
        });
      });
    }
  
    prepareDashboardPayments(payload) {
      const { t } = this.props;
      fetchDashboardPayments(payload).then((response) => {
        if (response && response["data"] && response["data"].length > 0) {
          const totalDataSets = [];
          const CHKPayments =
            response.data &&
            response.data.filter((o) => o["paymentType"] === "CHK");
          const ACHPayments =
            response.data &&
            response.data.filter((o) => o["paymentType"] === "ACH");
          const VCAPayments =
            response.data &&
            response.data.filter((o) => o["paymentType"] === "VCA");
          const timeLine = [];
          response.data &&
            response.data.forEach((obj) => {
              if (!timeLine.includes(obj["figureFor"])) {
                timeLine.push(obj["figureFor"]);
              }
            });
  
          response &&
            response.data &&
            response.data.forEach((obj) => {
              totalDataSets.push({
                figure: obj["figure"],
                figureFor: obj["figureFor"],
              });
            });
  
          var temp = {};
          var obj = null;
          for (var i = 0; i < totalDataSets.length; i++) {
            obj = totalDataSets[i];
  
            if (!temp[obj.figureFor]) {
              temp[obj.figureFor] = obj;
            } else {
              temp[obj.figureFor].figure = (
                Number(temp[obj.figureFor].figure) + Number(obj.figure)
              ).toFixed(2);
            }
          }
          var newTotalData = [];
          for (var prop in temp) newTotalData.push(temp[prop]);
  
          this.setState({
            paymentsData: {
              labels: timeLine,
              datasets: [
                {
                  fill: false,
                  hoverBackgroundColor: "white",
                  pointHoverBackgroundColor: "white",
                  label: t("componentData.dashboard.TotalPayments"),
                  backgroundColor: "#002D72",
                  borderColor: "#002D72",
                  lineTension: 0,
                  pointStyle: "circle",
                  data:
                    newTotalData &&
                    newTotalData.map((item) => ({
                      y: item.figure,
                      x: item.figureFor,
                    })),
                },
                {
                  fill: false,
                  hoverBackgroundColor: "white",
                  pointHoverBackgroundColor: "white",
                  label: "CHK",
                  backgroundColor: "#CCE4FF",
                  borderColor: "#CCE4FF",
                  lineTension: 0,
                  pointStyle: "circle",
                  data:
                    CHKPayments &&
                    CHKPayments.map((item) => ({
                      y: item.figure,
                      x: item.figureFor,
                    })),
                },
                {
                  fill: false,
                  label: "VCA",
                  hoverBackgroundColor: "white",
                  pointHoverBackgroundColor: "white",
                  backgroundColor: "#1AABA3",
                  borderColor: "#1AABA3",
                  pointStyle: "circle",
                  lineTension: 0,
                  data:
                    VCAPayments &&
                    VCAPayments.map((item) => ({
                      y: item.figure,
                      x: item.figureFor,
                    })),
                },
                {
                  fill: false,
                  label: "ACH",
                  hoverBackgroundColor: "white",
                  pointHoverBackgroundColor: "white",
                  lineTension: 0,
                  pointStyle: "circle",
                  backgroundColor: "#008CE6",
                  borderColor: "#008CE6",
                  data:
                    ACHPayments &&
                    ACHPayments.map((item) => ({
                      y: item.figure,
                      x: item.figureFor,
                    })),
                },
              ],
            },
          });
        } else {
          this.setState({ paymentsData: null });
        }
      });
    }
  
    prepareData() {
      const { selectedCampaign } = this.state;
      const campaignId =
        selectedCampaign.campaignId == -1 ? null : selectedCampaign.campaignId;
      this.prepareSupplierEnrollmentData(campaignId);
      this.preparePaymentsData();
    }
  
    preparePaymentsData() {
      const {
        selectedView,
        selectedCurrency,
        filter,
        selectedEntityPaymentClientId,
        childEntities,
      } = this.state;
      const clientId =
        selectedEntityPaymentClientId === -1
          ? childEntities &&
            childEntities.map((childEntity) => childEntity["clientId"]).join(",")
          : selectedEntityPaymentClientId;
      const payload = {
        clientID: clientId,
        payeeID: 0,
        year: filter["year"],
        month: filter["month"],
        quarter: filter["quarter"],
        lastDays: filter["lastDays"],
        resultType: selectedView,
        currency: selectedCurrency,
        fromDate: filter["fromDate"]
          ? moment(filter["fromDate"]).format("MM/DD/YYYY")
          : undefined,
        toDate: filter["toDate"]
          ? moment(filter["toDate"]).format("MM/DD/YYYY")
          : undefined,
      };
      //this.prepareDashboardSummary(payload);
      //this.prepareDashboardPayments(payload);
    }
  
    returnFilterLabel(index) {
      switch (index) {
        case 1:
          return "All time";
        case 2:
          return "Previous Month";
        case 3:
          return "Previous Quarter";
        case 4:
          return "Previous Year";
        case 5:
          return "Last 7 days";
        case 6:
          return "Last 30 days";
        case 7:
          return "Custom";
        default:
          return "Previous Month";
      }
    }
  
    render() {      
      const { classes, t } = this.props;
      const {
        totalPayments,
        totalCADPayments,
        totalUSDPayments,
        totalCHKPayment,
        totalACHPayment,
        totalVCAPayment,
        totalCADAmount,
        totalUSDAmount,
        selectedCurrency,
        selectedView,
        filters,
        selectedFilter,
        selectedCurrentDateFilter,
        enableDateFilter,        
        filter,
        campaignList,
        supplierEnrollmentData,
        selectedCampaign,
        chkPercent,
        achPercent,
        vcaPercent,        
        paymentsData,
        childEntities,
        selectedEntityClientId,
        selectedEntityPaymentClientId,
        selectedPayeeView,
        data,
        isSankeyLoading,
      } = this.state;
  
      const campaignSupplierObj =
        data &&
        data["numberOfSupplier"] &&
        data["numberOfSupplier"].filter((obj) => obj["key"] == "campaign");
      const statusSupplierObj =
        data &&
        data["numberOfSupplier"] &&
        data["numberOfSupplier"].filter((obj) => obj["key"] == "status");
      const methodSupplierObj =
        data &&
        data["numberOfSupplier"] &&
        data["numberOfSupplier"].filter((obj) => obj["key"] == "paymentMethod");
  
      const clientId = this.props.user.userData.portalProfileId;      
  
      return (
        <Grid>         
          <Box>
            <Grid container>
              <Grid item xs={12} sm={12}>
                <Box>
                  <Paper elevation={0}>
                    <Box py={1} px={2}>
                      <Box display="flex" justifyContent="space-between">
                        <h2 className={classes.h1}>
                          {t("componentData.dashboard.paymentTxt")}
                        </h2>
                        <Box display="flex">
                          {" "}
                          <Button
                            variant="text"
                            startIcon={<EventIcon />}
                            style={{
                              textTransform: "capitalize",
                              color: "#0B1941",
                              display: "flex",
                              marginLeft: 8,
                            }}
                            size="small"
                            onClick={() =>
                              this.setState({ enableDateFilter: true })
                            }
                          >
                            {t("componentData.dashboard.ViewingTxt")}&nbsp;
                            {t(
                              `componentData.dashboard.${this.returnFilterLabel(
                                selectedCurrentDateFilter
                              )}`
                            )}
                          </Button>
                        </Box>
                      </Box>
  
                      <Box
                        display="flex"
                        width={1}
                        justifyContent="space-between"
                        mt={2}
                      >
                        {childEntities && childEntities.length > 1 && (
                          <Box display="flex" maxWidth={350}>
                            <TextField
                              value={selectedEntityPaymentClientId}
                              label={t("componentData.dashboard.Entities")}
                              onChange={(e) =>
                                this.setState(
                                  {
                                    selectedEntityPaymentClientId: e.target.value,
                                  },
                                  () => this.preparePaymentsData()
                                )
                              }
                              select
                              variant="outlined"
                              size="medium"
                              fullWidth
                            >
                              {childEntities && childEntities.length > 1 && (
                                <MenuItem
                                  selected={selectedEntityClientId === -1}
                                  value={-1}
                                >
                                  {t("componentData.dashboard.AllEntities")}
                                </MenuItem>
                              )}
                              {/* <MenuItem
                              selected={selectedEntityClientId == clientId+0}
                              value={clientId+0}
                            >
                              Parent Entity (Self)
                            </MenuItem> */}
                              {childEntities &&
                                childEntities.map((childEntity) => (
                                  <MenuItem
                                    selected={
                                      selectedEntityClientId ===
                                      childEntity["clientId"]
                                    }
                                    value={childEntity && childEntity["clientId"]}
                                  >
                                    {`${
                                      childEntity && childEntity["clientName"]
                                    } ${
                                      childEntity &&
                                      childEntity["clientId"] == clientId &&
                                      childEntities &&
                                      childEntities.length > 1
                                        ? "(Self)"
                                        : ""
                                    }`}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Box>
                        )}
                      </Box>
                      <Box
                        pb={1}
                        display="flex"
                        justifyContent="center"
                        style={{ borderBottom: `2px solid #e6e6e6` }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Box mr={2}>
                            <h1 className={classes.textNum}>{totalPayments}</h1>
                            <span className={classes.dot}> </span>
                            <span style={{ color: "#4C4C4C", fontSize: 16 }}>
                              {t("componentData.dashboard.TotalPaymentsMade")}
                            </span>
                          </Box>
  
                          <Box>
                            {totalCHKPayment ||
                            totalACHPayment ||
                            totalVCAPayment ? (
                              <Doughnut
                                id="doughnutChart"
                                width={130}
                                height={100}
                                data={this.state.doughnutData}
                                options={this.state.doughnutOptions}
                              />
                            ) : (
                              <Doughnut
                                id="doughnutChart"
                                width={130}
                                height={100}
                                data={{
                                  labels: ["ACH", "CHK", "VCA"],
                                  datasets: [
                                    {
                                      label: "# of Tomatoes",
                                      data: [
                                        0.00000000000000001, 0.000000000000001,
                                        0.00000000000000001,
                                        100000000000000000000,
                                      ],
                                      backgroundColor: [
                                        "#008CE6",
                                        "#1AABA3",
                                        "#1AABA3",
                                        "#EAECF1",
                                      ],
                                      borderWidth: 0,
                                    },
                                  ],
                                }}
                                options={{
                                  showTooltips: false,
                                  tooltips: {
                                    enabled: false,                                    
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
                                  maintainAspectRatio: true,
                                  legend: {
                                    display: true,
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
                                    }
                                  }
                                }}
                              />
                            )}
                            <span
                              style={{
                                float: "right",
                                position: "relative",
                                fontSize: "11px",
                                top: "6px",
                                margin: "0px 25px",
                                fontWeight: 600,
                                color: "#282828",
                              }}
                            >
                              <ul>
                                <li style={{ margin: "11px 0" }}>
                                  {achPercent || "-"} %
                                </li>
                                <li style={{ margin: "11px 0" }}>
                                  {chkPercent || "-"} %
                                </li>
                                <li style={{ margin: "11px 0" }}>
                                  {vcaPercent || "-"} %
                                </li>
                              </ul>
                            </span>
                          </Box>
                        </Box>
                      </Box>
                      <Box my={2} display="flex" justifyContent="center">
                        <span
                          onClick={() =>
                            this.setState({ selectedCurrency: "USD" }, () =>
                              this.preparePaymentsData()
                            )
                          }
                          className={classes.flagContainer}
                        >
                          <img
                            src={require(`~/assets/icons/USAFlag.svg`)}
                            alt={t("componentData.dashboard.USAFlag")}
                            style={
                              selectedCurrency === "USD"
                                ? {
                                    border: `2px solid #fff`,
                                    boxShadow: `0 0 0 2px #002D72`,
  
                                    borderRadius: "100%",
                                    backgroundPosition: "center center",
                                  }
                                : {
                                    borderRadius: "100%",
                                    backgroundPosition: "center center",
                                  }
                            }
                          />{" "}
                          <h3>
                            {selectedView === "Amount" ? (
                              <Box
                                ml={1}
                                mr={5}
                                fontWeight="normal"
                                fontFamily="Interstate"
                                fontSize={16}
                                style={
                                  selectedCurrency === "USD"
                                    ? {
                                        color: "#002D72",
                                        fontWeight: 600,
                                      }
                                    : {}
                                }
                              >
                                {t("componentData.dashboard.USD")} $
                                {totalUSDAmount || 0}
                              </Box>
                            ) : (
                              <Box
                                ml={1}
                                mr={4}
                                fontWeight={500}
                                fontSize={16}
                                fontFamily="Interstate"
                                style={
                                  selectedCurrency === "USD"
                                    ? {
                                        color: "#002D72",
                                        fontWeight: 600,
                                      }
                                    : {}
                                }
                              >
                                {t("componentData.dashboard.USD")}{" "}
                                {totalUSDPayments || 0}{" "}
                                {t("componentData.dashboard.PaymentsTxt")}
                              </Box>
                            )}
                          </h3>
                        </span>
                        <span
                          onClick={() =>
                            this.setState({ selectedCurrency: "CAD" }, () =>
                              this.preparePaymentsData()
                            )
                          }
                          className={classes.flagContainer}
                        >
                          <img
                            src={require(`~/assets/icons/CanadianFlag.svg`)}
                            alt={t("componentData.dashboard.CanadianFlag")}
                            style={
                              selectedCurrency === "CAD"
                                ? {
                                    border: `2px solid #fff`,
                                    boxShadow: `0 0 0 2px #002D72`,
  
                                    borderRadius: "100%",
                                    backgroundPosition: "center center",
                                  }
                                : {
                                    borderRadius: "100%",
                                    backgroundPosition: "center center",
                                  }
                            }
                          />
  
                          <h3>
                            {selectedView === "Amount" ? (
                              <Box
                                ml={1}
                                mr={4}
                                fontWeight={500}
                                fontFamily="Interstate"
                                fontSize={16}
                                style={
                                  selectedCurrency === "CAD"
                                    ? {
                                        color: "#002D72",
                                        fontWeight: 600,
                                      }
                                    : {}
                                }
                              >
                                {t("componentData.dashboard.CAD")} $
                                {totalCADAmount || 0}
                              </Box>
                            ) : (
                              <Box
                                ml={1}
                                mr={4}
                                fontWeight={500}
                                fontFamily="Interstate"
                                style={
                                  selectedCurrency === "CAD"
                                    ? {
                                        color: "#002D72",
                                        fontWeight: 600,
                                      }
                                    : {}
                                }
                              >
                                {t("componentData.dashboard.CAD")}{" "}
                                {totalCADPayments || 0}{" "}
                                {t("componentData.dashboard.PaymentsTxt")}
                              </Box>
                            )}
                          </h3>
                        </span>
                      </Box>
                      <Box my={2}>
                        <span>
                          {selectedView === "Payment" ? (
                            <Box
                              mx={6}
                              fontWeight="normal"
                              style={{ color: "#4C4C4C", fontSize: "12px" }}
                            >
                              {selectedCurrency}{" "}
                              <span style={{ color: "#282828", fontWeight: 600 }}>
                                ${" "}
                                {selectedCurrency === "USD"
                                  ? totalUSDAmount
                                  : totalCADAmount}
                              </span>
                            </Box>
                          ) : (
                            <Box
                              mx={6}
                              fontWeight="normal"
                              style={{ color: "#4C4C4C", fontSize: "12px" }}
                            >
                              {t("componentData.dashboard.PaymentsTxt")}
                              <span style={{ color: "#282828", fontWeight: 600 }}>
                                {selectedCurrency === "USD"
                                  ? totalUSDPayments
                                  : totalCADPayments}
                              </span>
                            </Box>
                          )}
                        </span>
                      </Box>
                      {(selectedView === "Payment" &&
                        ((selectedCurrency === "USD" &&
                          (!totalUSDPayments || totalUSDPayments === 0)) ||
                          (selectedCurrency === "CAD" &&
                            (!totalCADPayments || totalCADPayments === 0)))) ||
                      (selectedView === "Amount" &&
                        ((selectedCurrency === "USD" &&
                          (!totalUSDAmount || totalUSDAmount === 0)) ||
                          (selectedCurrency === "CAD" &&
                            (!totalCADAmount || totalCADAmount === 0)))) ||
                      !paymentsData ||
                      paymentsData === null ? (
                        <Box display="block" textAlign="center" width={1} my={6}>
  
                          <Box
                            py={3}
                            color="#A1A1A1"
                            fontSize={14}
                            display="block"
                          >
                            <img
                              src={require("~/assets/images/nodata.svg")}
                              alt=""
                            />
  
                            <Box
                              py={3}
                              color="#A1A1A1"
                              fontSize={14}
                              display="block"
                            >
                              {t("componentData.dashboard.noDataToShow")}
                            </Box>
                          </Box>
                        </Box>
                      ) : (
                        <Line
                          id={"paymentsChart"}
                          width={739}
                          height={190}
                          data={this.state.paymentsData}
                          options={this.state.lineChartOptions}
                          redraW={false}
                        />
                      )}
  
                      <Box my={2} display="flex" justifyContent="center">
                        <span
                          className={classes.tabContainer}
                          style={
                            this.props.i18n.language === "fr"
                              ? { width: 360 }
                              : {}
                          }
                        >
                          <span
                            onClick={() =>
                              this.setState({ selectedView: "Payment" }, () =>
                                this.preparePaymentsData()
                              )
                            }
                            className={classes.tab}
                            style={
                              selectedView === "Payment"
                                ? { color: "white", background: "#008CE6" }
                                : {}
                            }
                          >
                            {t("componentData.dashboard.NoOfPayments")}
                          </span>
                          <span
                            className={classes.tab}
                            style={
                              selectedView === "Amount"
                                ? { color: "white", background: "#008CE6" }
                                : {}
                            }
                            onClick={() =>
                              this.setState({ selectedView: "Amount" }, () =>
                                this.preparePaymentsData()
                              )
                            }
                          >
                            {t("componentData.dashboard.Amount")}
                          </span>
                        </span>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
                <Box my={4}>
                  <Paper elevation={0}>
                    <Box py={2} px={2}>
                      <h1 className={classes.headingNew}>
                        {t("componentData.dashboard.PayeeEnrollment")}
                      </h1>{" "}
                      <Box
                        display="flex"
                        justifyContent="flex-start"
                        maxWidth={400}
                        width={300}
                      >
                        {childEntities && childEntities.length > 1 && (
                          <Box mr={6}>
                            <TextField
                              style={{ width: 300 }}
                              value={selectedEntityClientId}
                              label={t("componentData.dashboard.Entities")}
                              onChange={(e) =>
                                this.setState(
                                  {
                                    selectedEntityClientId: e.target.value,
                                  },
                                  () => {
                                    this.setState(
                                      {
                                        selectedCampaign: {
                                          campaignId: -1,
                                        },
                                      },
                                      () => {
                                        this.prepareSupplierEnrollmentData(
                                          e.target.value
                                        );
                                        this.getSankeyChartData();
                                      }
                                    );
                                  }
                                )
                              }
                              select
                              variant="outlined"
                              size="medium"
                              fullWidth
                            >
                              {childEntities && childEntities.length > 1 && (
                                <MenuItem
                                  selected={selectedEntityClientId == -1}
                                  value={-1}
                                >
                                  {t("componentData.dashboard.AllEntities")}
                                </MenuItem>
                              )}
                              {childEntities &&
                                childEntities.map((childEntity) => (
                                  <MenuItem
                                    selected={
                                      selectedEntityClientId ===
                                      childEntity["clientId"]
                                    }
                                    value={childEntity && childEntity["clientId"]}
                                  >
                                    {`${
                                      childEntity && childEntity["clientName"]
                                    } ${
                                      childEntity &&
                                      childEntity["clientId"] == clientId &&
                                      childEntities &&
                                      childEntities.length > 1
                                        ? "(Self)"
                                        : ""
                                    }`}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </Box>
                        )}
                        <Box
                          display="flex"
                          justifyContent="flex-start"
                          width={290}
                        >
                          <TextField
                            value={selectedCampaign.campaignId}
                            label={t("componentData.dashboard.CampaignLabel")}
                            onChange={(e) =>
                              this.setState(
                                {
                                  selectedCampaign: {
                                    campaignId: e.target.value,
                                  },
                                },
                                () => {
                                  this.prepareSupplierEnrollmentData(
                                    e.target.value
                                  );
                                  this.getSankeyChartData();
                                }
                              )
                            }
                            select
                            variant="outlined"
                            size="medium"
                          >
                            <MenuItem
                              selected={selectedCampaign.campaignId === 0}
                              value={0}
                            >
                              {selectedPayeeView === "status"
                                ? t("componentData.dashboard.AllCampaigns")
                                : t("componentData.dashboard.Last3Campaigns")}
                            </MenuItem>
                            <MenuItem
                              selected={selectedCampaign.campaignId === -1}
                              value={-1}
                            >
                              {selectedPayeeView === "status"
                                ? t("componentData.dashboard.AllActiveCampaigns")
                                : t(
                                    "componentData.dashboard.Last3ActiveCampaigns"
                                  )}
                            </MenuItem>
                            {campaignList &&
                              campaignList.map((campaign) => (
                                <MenuItem
                                  key={campaign}
                                  selected={
                                    selectedCampaign.campaignId ===
                                    campaign.campaignId
                                  }
                                  value={campaign.campaignId}
                                >
                                  {campaign.campaignName}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Box>
                      </Box>
                      <Box pt={0.2} fontSize={12} color="rgba(0,0,0,0.38)">
                        {t("componentData.dashboard.visualiseBetter")}
                      </Box>
                      <Box my={3}>
                        <Box>
                          {selectedPayeeView === "status" ? (
                            <Box>
                              {supplierEnrollmentData &&
                              supplierEnrollmentData.length > 0 ? (
                                <Line
                                  id={"paymentsChart"}
                                  width={739}
                                  height={190}
                                  data={this.state.payeeEnrollmentData}
                                  options={this.state.payeeEnrollmentOptions}
                                  redraW={false}
                                />
                              ) : (
                                <Box
                                  display="block"
                                  textAlign="center"
                                  width={1}
                                  my={6}
                                >
                                  <img
                                    src={require("~/assets/images/nodata.svg")}
                                    alt=""
                                  />
                                  <Box
                                    py={3}
                                    color="#A1A1A1"
                                    fontSize={14}
                                    display="block"
                                  >
                                    {" "}
                                    {t(
                                      "componentData.dashboard.noDataToShow"
                                    )}{" "}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Box mx={0}>
                              {!isSankeyLoading ? (
                                // <Sankey data={sankeyData} />
                                <Box>
                                  {data &&
                                  data.mapping &&
                                  data.mapping["length"] > 0 ? (
                                    <Box>
                                      <HighchartsReact
                                        allowChartUpdate={true}
                                        immutable={false}
                                        updateArgs={[true, true, true]}
                                        containerProps={{
                                          className: "chartContainer",
                                        }}
                                        highcharts={Highcharts}
                                        callback={(chart) =>
                                          Callback(chart, data)
                                        }
                                        options={Options(data)}
                                      />
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        // mt={-1}
                                        mr={5}
                                        ml={8}
                                        my={4}
                                        style={{ fontSize: "15px" }}
                                      >
                                        <span>
                                          {t("componentData.dashboard.Of")}{" "}
                                          {campaignSupplierObj &&
                                            campaignSupplierObj[0] &&
                                            campaignSupplierObj[0]["count"]}{" "}
                                          {t("componentData.dashboard.Payees")}
                                        </span>
                                        <span>
                                          {t("componentData.dashboard.Of")}{" "}
                                          {statusSupplierObj &&
                                            statusSupplierObj[0] &&
                                            statusSupplierObj[0]["count"]}{" "}
                                          {t("componentData.dashboard.Payees")}
                                        </span>
                                        <span>
                                          {t("componentData.dashboard.Of")}{" "}
                                          {methodSupplierObj &&
                                            methodSupplierObj[0] &&
                                            methodSupplierObj[0]["count"]}{" "}
                                          {t("componentData.dashboard.Payees")}
                                        </span>
                                      </Box>
                                    </Box>
                                  ) : (
                                    <Box width={1} my={6}>
                                      <Box display="block" textAlign="center">
                                        <img
                                          src={require("~/assets/images/nodata.svg")}
                                          alt=""
                                        />
                                        <Box
                                          py={3}
                                          color="#A1A1A1"
                                          fontSize={14}
                                          display="block"
                                        >
                                          {" "}
                                          {t(
                                            "componentData.dashboard.noDataToShow"
                                          )}{" "}
                                        </Box>
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                              ) : (
                                <Box>
                                  <CircularProgress color="primary" />
                                </Box>
                              )}
                            </Box>
                          )}
                        </Box>
  
                        <Box my={2} display="flex" justifyContent="center">
                          <span className={classes.tabContainer}>
                            <span
                              onClick={() =>
                                this.setState(
                                  { selectedPayeeView: "status" },
                                  () => this.prepareSupplierEnrollmentData()
                                )
                              }
                              className={classes.tab}
                              style={
                                selectedPayeeView === "status"
                                  ? { color: "white", background: "#008CE6" }
                                  : {}
                              }
                            >
                              {t("componentData.dashboard.ByStatus")}
                            </span>
                            <span
                              className={classes.tab}
                              style={
                                selectedPayeeView === "campaign"
                                  ? { color: "white", background: "#008CE6" }
                                  : {}
                              }
                              onClick={() =>
                                this.setState(
                                  { selectedPayeeView: "campaign" },
                                  () => this.getSankeyChartData()
                                )
                              }
                            >
                              {t("componentData.dashboard.ByCampaign")}
                            </span>
                          </span>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Grid>            
            </Grid>
          </Box>
  
          {enableDateFilter && (
            <SideDialog
              showButton={false}
              alignSide={true}
              icon="calendar"
              onConfirm={() => this.setState({ enableDateFilter: false })}
              title={t("componentData.dashboard.DateFilter")}
              // className={classes.notifySidePanel}
            >
              <DashboardDateFilter
                filters={filters}
                selectedFilter={selectedFilter}
                handleFilterSelect={(i) => this.setState({ selectedFilter: i })}
                selectedView={selectedView}
                selectedCurrency={selectedCurrency}
                clientId={clientId}
                resetFilter={() => {
                  this.setState(
                    {
                      selectedFilter: 2,
                      // enableDateFilter: false,
                      selectedCurrentDateFilter: 2,
                      filter: {
                        ...this.state.filter,
                        clientID: 0,
                        payeeID: 0,
                        year: year,
                        month: month,
                        quarter: "",
                        lastDays: undefined,
                        resultType: "",
                        currency: "",
                        fromDate: undefined,
                        toDate: undefined,
                      },
                    },
                    () => this.preparePaymentsData()
                  );
                }}
                filterData={(selectedCurrentDateFilter, fromDate, toDate) =>
                  this.setState(
                    {
                      selectedCurrentDateFilter: selectedCurrentDateFilter,
                      selectedFilter: selectedCurrentDateFilter,
                      enableDateFilter: false,
                      filter: {
                        ...this.state.filter,
                        fromDate:
                          selectedCurrentDateFilter === 7 ? fromDate : undefined,
                        toDate:
                          selectedCurrentDateFilter === 7 ? toDate : undefined,
                      },
                    },
                    () => this.preparePaymentsData()
                  )
                }
                filter={filter}
                changeFilter={(filter) => {
                  this.setState({ filter: filter });
                }}
              />
            </SideDialog>
          )}
          
          {this.state.modalMessage && (
            <Notification
              variant={this.state.variant}
              message={this.state.modalMessage}
              handleClose={() => {
                this.setState({ modalMessage: "" });
              }}
            />
          )}
        </Grid>
      );
    }
  }
  
  export default withTranslation()(
    connect((state) => ({ ...state.user, ...state.campaign }))(
      withStyles(styles)(Graph)
    )
  );
  