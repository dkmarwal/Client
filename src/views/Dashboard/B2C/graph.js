import {
  Box,
  Grid,
  Paper,
  TextField,
  withStyles,
  MenuItem,
  Button, Tooltip, Typography, FormControlLabel, Checkbox 
} from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import styles from "~/views/Dashboard/styles";
import moment from "moment";
import {
  fetchDashboardPayments,
  fetchDashboardPaymentSummary,
  fetchDashboardChildEntities, fetchB2CDashboardSankeyData
} from "~/redux/helpers/B2C/dashboard";
import { SideDialog } from "~/components/Dialogs";
import DashboardDateFilter from "~/modules/DashboardDateFilter";
import EventIcon from "@material-ui/icons/Event";
import "chartjs-plugin-annotation";
import { withTranslation } from "react-i18next";
import { accessRights } from "~/config/accessRights";
import Notification from "~/components/Notification";
import "~/views/Dashboard/sankey.css";
import 'chartjs-plugin-labels';
import HighchartsSankey from "highcharts/modules/sankey";
import Highcharts from "highcharts";
import { entityType } from "~/config/entityTypes";
import { B2CfetchSelectedTabs} from "~/redux/helpers/settings";
import PayeeDetail from "~/components/PayeeDetail"

import {
  getNodeColor,
  getStatusColorToPoint,
  getStatusColorFromPoint,
} from "~/views/Dashboard/sankey/colors";
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

class B2CGraph extends Component {
  constructor(props){
    super(props);  
    this.state = {
      name: "React",
      type: "line",
      selectedEnroll: 0,    
      enrollFilters: [
        {
          label: "Allfiles",
          key: "ALL",
          value: 0
        },
        {
          label: "CampaignFiles",
          key: "CAMPAIGN",
          value: 2
        },
        {
          label: "ComboFiles",
          key: "COMBO",
          value: 1
        },
      ],
      optedPaymentMethod: null,
      selectedEntityPaymentClientId: 0,
      selectedEntityClientId: -1,
      campaignList: [],
      childEntities: [],
      enrollmentConsumerData: [],
      payeeEnrollGraphInfo: [],
      paymentTypeData: [],
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
      totalPaymentGraphRef: null,
      enrollGraphRef: null,
      viewAllStatus: false,
      mixedGraphData: [],
      mixedGraphOpt: [],
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
      totalZELPayment: "",
      totalPPLPayment: "",
      totalMSCPayment: "",
      chkPercent: "",
      achPercent: "",
      vcaPercent: "",
      mscPercent: "",
      pplPercent: "",
      zelPercent: "",
      paymentsData: {},    
      data: {},
      doughnutData: {
        labels: [
          this.props.t("componentData.dashboard.Zelle"), 
          this.props.t("componentData.dashboard.InstantPayP2C"),
          this.props.t("componentData.dashboard.PayPal"), 
          this.props.t("componentData.dashboard.BankDepositACH"),
          this.props.t("componentData.dashboard.Check"),           
        ],
        datasets: [
          {
            label: "# of Tomatoes",
            data: [0, 0, 0, 0, 0],
            backgroundColor: ["#6F459C", "#9B7FBC", "#C5BBDB", "#3F007D", "#DADAEB", ],
            borderWidth: 0,
          },
        ],
      },
      b2cEnrolldoughnutOptions: {
        aspectRatio: 1,
        clip: { left: 5, top: false, right: -2, bottom: 0 },
        height: 200,
        width: 200,
        cutoutPercentage: 60,
        animation: {
          animateRotate: true,
        },
        responsive: true,
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
          }
        }
      },

      b2cEnrollDonutData: {
        labels: [
          this.props.t("componentData.dashboard.Zelle"),
          this.props.t("componentData.dashboard.InstantPayP2C"),
          this.props.t("componentData.dashboard.PayPal"), 
          this.props.t("componentData.dashboard.BankDepositACH"),    
          this.props.t("componentData.dashboard.Check"), 
        ],
        datasets: [
          {
            label: "# of Tomatoes",
            data: [0, 0, 0, 0, 0],
            backgroundColor: ["#6F459C", "#9B7FBC", "#C5BBDB", "#3F007D", "#DADAEB"],
            borderWidth: 0,
          },
        ],
      },    

      lineChartOptions: {
        responsive: false,
        maintainAspectRatio: false,
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
          enabled: true,
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
          itemSort: function(a, b) {                   
            return b.value - a.value;
          },
          callbacks: {
            label: function (tooltipItem, data) {
              let dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
              let currObject = data && data["datasets"][dataSetIndex];                        
              return (
                tooltipItem &&
                ` ${currObject && currObject["label"]}: ${tooltipItem["value"]
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                `
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
        responsive: true,
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
      modalMessage: null,
      variant: ''
    }
  }

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
    this.setState(
      {
        selectedEntityPaymentClientId: clientId,
        selectedEntityClientId: clientId,
      },
      () => {       
        const { userRoles } = this.props.user;
        const flag =
          (userRoles &&
            userRoles.includes(accessRights["PARENT_CHILD_ACCESS_VIEW"])) ||
          false;
        //Call API if use has parent child permission view
        if (flag) {
          this.getChildEntitiesList();
        }
        this.getOptedPaymentList();         
      }
    );
    this.resetGraphStrike();       
  }

  getOptedPaymentList=()=>{
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchSelectedTabs(clientId).then((response) => {
      if (response.error) {
        return false;
      }     
      else{        
        if(Boolean(response?.data?.rows2 ?? false)){
          let list = response.data.rows2.map((e)=>{
            return e.b2cDescription.toLowerCase();
          });  
          this.setState({
            optedPaymentMethod: list
          }, ()=>{
            this.prepareData();
          })        
        }        
      }
    });
  }

  getSankeyChartData = () => {    
    const { selectedEnroll, enrollFilters, selectedEntityClientId, filter, viewAllStatus } = this.state;
    const fileType = enrollFilters.find((x) => x.value === selectedEnroll).key;     
    const payloadData ={
      clientId: selectedEntityClientId,
      fileType: fileType, 
      showAllStatus: viewAllStatus,            
      lastDays: filter.lastDays || undefined,
      fromDate: filter["fromDate"]
        ? moment(filter["fromDate"]).format("MM/DD/YYYY")
        : undefined,
      toDate: filter["toDate"]
        ? moment(filter["toDate"]).format("MM/DD/YYYY")
        : undefined,
      month: filter.month || undefined,     
      quarter: filter.quarter || undefined, 
      year: filter.year || undefined,
    }

    this.setState({ isSankeyLoading: true }, () => {
      fetchB2CDashboardSankeyData(payloadData).then((res) => {                                
        this.setState({
          enrollmentConsumerData: res?.data?.enrollmentData ?? [],
          paymentTypeData: Boolean(res.data.paymentTypeData) ? res.data.paymentTypeData[0] : [],
          payeeEnrollGraphInfo: res?.data?.graphData ?? [],
        }, () => {           
          this.createMixedGraph();
          this.loadB2CEnrollDoughnut();
        });
      });
    });
    this.resetGraphStrike();
  };
  loadB2CEnrollDoughnut = () => {
    const { paymentTypeData } = this.state;

    const payData = [       
      ["Zelle", paymentTypeData.zelle || 0, "#6F459C"],
      ["Instant Pay (P2C)", paymentTypeData.pushToCard || 0, "#9B7FBC"],
      ["PayPal", paymentTypeData.paypal || 0, "#C5BBDB"],
      ["Bank Deposit (ACH)", paymentTypeData.ach || 0, "#3F007D"],
      ["Check", paymentTypeData.check || 0, "#DADAEB"],
    ]    
    const getPaymentList = this.sortPaymentDataWithMultiVal(payData);
    let getGraphVal= [];
    let getGraphcolor= [];
    let getTitle = [];

    getPaymentList.map((e)=> {  
      getTitle.push(this.props.t(`componentData.dashboard.graphLabels.${e[0]}`));        
      getGraphVal.push(Number(e[1]));
      getGraphcolor.push(e[2])
    });

    this.setState({
      b2cEnrollDonutData: {
        labels: getTitle,
        datasets: [
          {
            //label: "# of Tomatoes",
            data: getGraphVal,
            backgroundColor: getGraphcolor,
            borderWidth: 0,
          },
        ],
      },
    });
  }
  getChildEntitiesList = () => {
    fetchDashboardChildEntities().then((res) => {
      this.setState({
        childEntities: res && res.data,
      });
    });
  };



  prepareDashboardSummary(payload) {
    fetchDashboardPaymentSummary(payload).then((res) => {
      this.setState(res.data && res.data[0], () => {
        const {
          totalACHPayment,
          totalPPLPayment,
          totalZELPayment,
          totalCHKPayment,
          totalMSCPayment
        } = this.state;

        // let doughnutChart = document.getElementById("doughnutChart");        
        //doughnutChart.style.float = "left";    
        
        const payData = [   
          ["Zelle", totalZELPayment || 0, "#6F459C"],
          ["Instant Pay (P2C)", totalMSCPayment || 0, "#9B7FBC"],
          ["PayPal", totalPPLPayment || 0, "#C5BBDB"],
          ["Bank Deposit (ACH)", totalACHPayment || 0, "#3F007D"],
          ["Check", totalCHKPayment || 0, "#DADAEB"],
        ]    
        const getPaymentList = this.sortPaymentDataWithMultiVal(payData);
        let getGraphVal= [];
        let getGraphcolor= [];
        let getTitle = [];        

        getPaymentList.map((e)=> {  
          getTitle.push(this.props.t(`componentData.dashboard.graphLabels.${e[0]}`));        
          getGraphVal.push(Number(e[1]));
          getGraphcolor.push(e[2])
        });         

        this.setState({
          doughnutData: {
            labels: getTitle,
            datasets: [
              {
                label: "# of Tomatoes",
                data: getGraphVal,
                backgroundColor: getGraphcolor,
                borderWidth: 0,
              },
            ],
          },
        });
      });
    });
  }

  sortPaymentDataWithMultiVal=(data)=>{       
    if(Object.keys(data).length > 0){      
      const {optedPaymentMethod} = this.state;
      var sortable = data;      
      let shortData = sortable.sort(function(a, b) {
        return b[1] - a[1];
      });  
      
      if(Boolean(optedPaymentMethod)){
        let list = [];
        shortData.map((e)=>{          
          let index = optedPaymentMethod.indexOf(e[0].toLowerCase());
          if(index !== -1){
            return list.push(e)
          }
        });        
        return list;
      }
      else{
        return shortData;
      }        
    }
  }

  prepareDashboardPayments(payload) {
    const { t } = this.props;
    fetchDashboardPayments(payload).then((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        const totalDataSets = [];

        const ACHPayments =
          response.data &&
          response.data.filter((o) => o["paymentType"] === "ACH");

        const PPLPayments =
          response.data &&
          response.data.filter((o) => o["paymentType"] === "PPL");

        const CXCPayments =
          response.data &&
          response.data.filter((o) => o["paymentType"] === "CXC");

        const CHKPayments =
          response.data &&
          response.data.filter((o) => o["paymentType"] === "CHK");

        const MSCPayments =
          response.data &&
          response.data.filter((o) => o["paymentType"] === "MSC");

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

        const {optedPaymentMethod} = this.state;
        let list = [];  
        
        if(Boolean(optedPaymentMethod) && optedPaymentMethod.length > 0){
          list.push({
            fill: false,
            hoverBackgroundColor: "white",
            pointHoverBackgroundColor: "white",
            label: t("componentData.dashboard.TotalPayments"),
            backgroundColor: "#333333",
            borderColor: "#333333",
            lineTension: 0,
            pointStyle: "circle",
            data:
              newTotalData &&
              newTotalData.map((item) => ({
                y: Number(item.figure).toFixed(0),
                x: item.figureFor,
              })),
          })
          optedPaymentMethod.map((e)=>{
            if(e === "check"){
              list.push({
                fill: false,
                hoverBackgroundColor: "white",
                pointHoverBackgroundColor: "white",
                label: t("componentData.dashboard.Check"),
                backgroundColor: "#DADAEB",
                borderColor: "#DADAEB",
                lineTension: 0,
                pointStyle: "circle",
                data:
                  CHKPayments &&
                  CHKPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              })
            }
            else if(e === "bank deposit (ach)"){
              list.push({
                fill: false,
                label: t("componentData.dashboard.ACH"),
                hoverBackgroundColor: "white",
                pointHoverBackgroundColor: "white",
                lineTension: 0,
                pointStyle: "circle",
                backgroundColor: "#3F007D",
                borderColor: "#3F007D",
                data:
                  ACHPayments &&
                  ACHPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              })
            }
            else if(e === "paypal"){
              list.push({
                fill: false,
                label: t("componentData.dashboard.PayPal"),
                hoverBackgroundColor: "white",
                pointHoverBackgroundColor: "white",
                backgroundColor: "#C5BBDB",
                borderColor: "#C5BBDB",
                pointStyle: "circle",
                lineTension: 0,
                data:
                  PPLPayments &&
                  PPLPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              })
            }
            else if(e === "instant pay (p2c)"){
              list.push({
                fill: false,
                hoverBackgroundColor: "white",
                pointHoverBackgroundColor: "white",
                label: t("componentData.dashboard.PushToCard"),
                backgroundColor: "#9B7FBC",
                borderColor: "#9B7FBC",
                lineTension: 0,
                pointStyle: "circle",
                data:
                  MSCPayments &&
                  MSCPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              })
            }
            else if(e === "zelle"){
              list.push({
                fill: false,
                label: t("componentData.dashboard.Zelle"),
                hoverBackgroundColor: "white",
                pointHoverBackgroundColor: "white",
                backgroundColor: "#6F459C",
                borderColor: "#6F459C",
                pointStyle: "circle",
                lineTension: 0,
                data:
                  CXCPayments &&
                  CXCPayments.map((item) => ({
                    y: Number(item.figure).toFixed(0),
                    x: item.figureFor,
                  })),
              })
            }
            return list
          })
        }  

        this.setState({
          paymentsData: {
            labels: timeLine,
            datasets: list,
          },
        });
      } else {
        this.setState({ paymentsData: null });
      }
    });
  }

  prepareData() {
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
    const appType = this.props.user.userData.appType
      ? parseInt(this.props.user.userData.appType)
      : entityType.B2B;
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
      BusinessType: appType
    };
    //this.prepareDashboardSummary(payload);
    //this.prepareDashboardPayments(payload);
    this.getSankeyChartData()
  }

  returnFilterLabel(index) {
    this.resetGraphStrike();
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

  sortPaymentDataFn=(data)=>{    
    if(Object.keys(data).length > 0){      
      const {optedPaymentMethod} = this.state;
      var sortable = [];
      for(var item in data) {
        sortable.push([item, data[item]]);
      }
      let shortData = sortable.sort(function(a, b) {
        return b[1] - a[1];
      });  
      
      if(Boolean(optedPaymentMethod)){
        let list = [];
        shortData.map((e)=>{          
          let index = optedPaymentMethod.indexOf(e[0].toLowerCase());
          if(index !== -1){
            return list.push(e)
          }
        });        
        return list;
      }
      else{
        return shortData;
      }        
    }
  } 
  
  totalPaymentRef=(ref)=>{    
    this.setState({
      totalPaymentGraphRef: ref
    })
  }

  totalEnrollRef=(ref)=>{
    this.setState({
      enrollGraphRef: ref
    })
  }

  totalPaymentLegendClick=(e)=>{   
    const {totalPaymentGraphRef} = this.state;
    if(Boolean(totalPaymentGraphRef)){
      const name = e.currentTarget.getAttribute("name");
      const index = totalPaymentGraphRef.props.data.labels.indexOf(name);
      const meta = totalPaymentGraphRef.chartInstance.getDatasetMeta(0); 
      const result= (meta.data[index].hidden == true) ? false : true;
      if(result === true)
      {
        meta.data[index].hidden = true;      
        e.currentTarget.classList.add("strike");
      }else{
        e.currentTarget.classList.remove("strike");
        meta.data[index].hidden = false;
      } 
      totalPaymentGraphRef.chartInstance.update();
    }
    else{
      e.currentTarget.classList.toggle("strike");
    }    
  }

  enrollLegendClick=(e)=>{    
    const {enrollGraphRef} = this.state;
    if(Boolean(enrollGraphRef)){      
      const name = e.currentTarget.getAttribute("name");
      const index = enrollGraphRef.props.data.labels.indexOf(name);
      const meta = enrollGraphRef.chartInstance.getDatasetMeta(0); 
      const result= (meta.data[index].hidden == true) ? false : true;
      if(result === true)
      {
        meta.data[index].hidden = true;      
        e.currentTarget.classList.add("strike");
      }else{
        e.currentTarget.classList.remove("strike");
        meta.data[index].hidden = false;
      } 
      enrollGraphRef.chartInstance.update();
    }
    else{
      e.currentTarget.classList.toggle("strike");
    }   
  }

  resetGraphStrike=()=>{          
    let item = document.getElementsByClassName("legendItem");
    for(let i=0; i< item.length; i++){
      item[i].classList.remove("strike");
    } 

    const {totalPaymentGraphRef, enrollGraphRef} = this.state;

    if(Boolean(totalPaymentGraphRef)){      
      const meta_1 = totalPaymentGraphRef?.chartInstance?.getDatasetMeta(0) ?? null;
      if(Boolean(meta_1)){
        for(let a=0; a< meta_1.data.length; a++){
          meta_1.data[a].hidden = false;
        } 
        totalPaymentGraphRef.chartInstance.update();
      }      
    } 
    
    if(Boolean(enrollGraphRef)){      
      const meta_2 = enrollGraphRef?.chartInstance?.getDatasetMeta(0) ?? null;
      if(Boolean(meta_2)){
        for(let b=0; b< meta_2.data.length; b++){
          meta_2.data[b].hidden = false;
        } 
        enrollGraphRef.chartInstance.update();
      }      
    }   
    
  }

  createMixedGraph=()=>{  
    const options = {
      scales: {
        xAxes: [
          {
            stacked: true,            
          },
        ],
        yAxes: [
          {
            stacked: true,  
            ticks: {
              beginAtZero: true,  
              precision: 0,                                             
            }          
          },
        ],
      },
      interaction: {
        mode: 'point'
      }, 

      layout: {
        padding: {
          bottom: 0,
          top: 0
        }
       },
      
      tooltips: {
        enabled: true,
        padding: 10, 
        footerSpacing: 4, 
        mode: 'index',
        backgroundColor: "#f7f7f7",
        bodyFontColor: "#000",  
        titleFontColor: "#000", 
        bodySpacing: 6,     
        titleMarginBottom: 10,
        displayColors: true,  
        reverse: false, 
        position: 'nearest',
        yAlign: 'center',     
        itemSort: function(a, b) {                   
          //return b.value - a.value;
        },
        callbacks: {
          label: function (tooltipItem, data) {
            let dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
            let currObject = data && data["datasets"][dataSetIndex];                        
            return (
              tooltipItem &&
              ` ${currObject && currObject["label"]}: ${tooltipItem["value"]
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              `
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
          usePointStyle: true,       
          fontColor: "#121212",
          fontSize: 12,
          fontStyle: "normal",
          padding: 10,  
          boxWidth: 8,                               
        },
        title: {
          padding: 6,
        }                       
      },
      responsive: true,
    };

    const {enrollmentConsumerData} = this.state; 
    
    const labels = Boolean(enrollmentConsumerData.dates) && [...new Set( enrollmentConsumerData.dates.map(obj => obj)) ];     
    let graphData = [];  
    let legendsList = [];

     Object.keys(enrollmentConsumerData).map((e)=>{
      if(e.toLocaleLowerCase() !== "dates"){
        legendsList.push(e);
      }      
    });    

    legendsList.map((e)=>{
      if(e.toLocaleLowerCase() === 'contacted'){
        graphData.push({
          type: 'line',
          label: enrollmentConsumerData[e]?.label ?? "",
          data: enrollmentConsumerData[e]?.data ?? [],
          backgroundColor: enrollmentConsumerData[e]?.colorCode ?? "",
          borderColor: enrollmentConsumerData[e]?.colorCode ?? "",
          fill: false,
          tension: 0,
          borderWidth: 2,
          //order: 1
        })
      }
      else{
        graphData.push({
          type: 'bar',
          label: enrollmentConsumerData[e]?.label ?? "",
          data: enrollmentConsumerData[e]?.data ?? [],          
          backgroundColor: enrollmentConsumerData[e]?.colorCode ?? "",
          //order: 2
        })
      }         
    });    
      
    const data = {
      labels: labels,
      datasets: graphData,
    };   

    this.setState({
      mixedGraphData: data,
      mixedGraphOpt: options,
    });
  } 
  
  handleAllStatus=(e)=>{    
    this.setState({
      viewAllStatus: e.target.checked
    }, ()=>{
      this.getSankeyChartData();
    })
  }

  render() {
    const { classes, t } = this.props;
    const {
      totalPayments,
      totalCADPayments,
      totalUSDPayments,
      totalCHKPayment,
      totalACHPayment,      
      totalCADAmount,
      totalUSDAmount,
      selectedCurrency,
      selectedView,
      filters,
      selectedFilter,
      selectedCurrentDateFilter,
      enableDateFilter,
      filter,      
      enrollmentConsumerData,
      selectedEnroll,
      enrollFilters,
      chkPercent,
      achPercent,      
      paymentsData,
      childEntities,
      selectedEntityClientId,
      selectedEntityPaymentClientId, 
      pplPercent,
      zelPercent,
      mscPercent,
      totalMSCPayment,
      totalPPLPayment,
      totalZELPayment, paymentTypeData, b2cEnrolldoughnutOptions, b2cEnrollDonutData,    
      viewAllStatus, mixedGraphData, mixedGraphOpt, payeeEnrollGraphInfo  
    } = this.state;        

    const clientId = this.props.user.userData.portalProfileId;    
    
    const payList = {   
      "Zelle": paymentTypeData.zelle || 0,
      "Instant Pay (P2C)": paymentTypeData.pushToCard || 0,
      "PayPal": paymentTypeData.paypal || 0,
      "Bank Deposit (ACH)": paymentTypeData.ach || 0,
      "Check": paymentTypeData.check || 0,
    } 

    const getSortPaymentData = this.sortPaymentDataFn(payList);     

    const payData = {   
      "Zelle": zelPercent || 0,
      "Instant Pay (P2C)": mscPercent || 0,
      "PayPal": pplPercent || 0,
      "Bank Deposit (ACH)": achPercent || 0,
      "Check": chkPercent || 0,
    }    
    const getPaymentList = this.sortPaymentDataFn(payData);      

    return (
      <Grid>
        <Box>

          <Box display="flex" style={{float: "right", marginBottom: "10px"}}>
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

          <Grid container>
            <Grid item xs={12} sm={12}>  
              <Box style={{ marginBottom: "30px" }}>  
                <Paper elevation={0}>
                  <Box py={1} px={2}>
                    <Box display="flex" justifyContent="space-between">
                      <h2 className={classes.h1}>
                        {t("componentData.dashboard.paymentTxt")}
                      </h2>                     
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
                                  {`${childEntity && childEntity["clientName"]
                                    } ${childEntity &&
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
                      display="flex"
                      justifyContent="center"
                      style={{ borderBottom: `2px solid #e6e6e6`, margin: "-35px 0 0" }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box>
                          <h1 className={classes.textNum}>{totalPayments}</h1>
                          <span className={classes.dot}> </span>
                          <span style={{ color: "#4C4C4C", fontSize: 16 }}>
                            {t("componentData.dashboard.TotalPaymentsMade")}
                          </span>
                        </Box>

                        <Box style={{margin: "45px 0"}}>
                          {totalACHPayment ||
                            totalPPLPayment ||
                            totalZELPayment ||
                            totalCHKPayment ||
                            totalMSCPayment ? (
                              <Box style={{float: "left"}}>
                                <Doughnut
                                  //id="doughnutChart"                                    
                                  width={200}
                                  height={120}
                                  data={this.state.doughnutData}
                                  options={this.state.doughnutOptions}
                                  ref={this.totalPaymentRef}
                                />
                              </Box>
                            
                          ) : (
                            <Box style={{float: "left"}}>
                              <Doughnut                              
                                width={200}
                                height={120}                              
                                data={{
                                  labels: [
                                    this.props.t("componentData.dashboard.BankDepositACH"), 
                                    this.props.t("componentData.dashboard.PayPal"), 
                                    this.props.t("componentData.dashboard.Zelle"), 
                                    this.props.t("componentData.dashboard.Check"), 
                                    this.props.t("componentData.dashboard.InstantPayP2C")
                                  ],
                                  datasets: [
                                    {
                                      label: "# of Tomatoes",
                                      data: [0, 0, 0, 0, 0, 100000000000000000000,],
                                      backgroundColor: ["#3F007D", "#C5BBDB", "#6F459C", "#DADAEB", "#9B7FBC"],
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
                                    }
                                  }
                                }}
                              />
                            </Box>
                          )}
                          <span
                            style={{
                              float: "right",
                              position: "relative",
                              fontSize: "11px",
                              top: "6px",
                              margin: "0 0 0 3px",
                              fontWeight: 600,
                              color: "#282828",
                            }}
                          >
                            <ul 
                              className={classes.legendList}
                              style={{
                                height: "120px",
                                display: "table-cell",
                                verticalAlign: 'middle'
                              }}
                            >
                              {Boolean(getPaymentList)
                                ? getPaymentList.map((item) =>{                                  
                                  return(
                                    <li 
                                      className="legendItem" 
                                      onClick={(e)=>this.totalPaymentLegendClick(e)} 
                                      name={item[0]}
                                    >
                                      <Box
                                        pb={1}
                                        display="flex"
                                        fontWeight={700}
                                        fontSize={11}
                                        alignItems="center"
                                      >
                                        <span
                                          className={classes.dot}
                                          style={{ backgroundColor: item[0] === "Bank Deposit (ACH)"
                                            ? "#3F007D"
                                            : item[0] === "Check"
                                            ? "#DADAEB"
                                            : item[0] === "PayPal"
                                            ? "#C5BBDB"
                                            : item[0] === "Instant Pay (P2C)"
                                            ? "#9B7FBC"
                                            : item[0] === "Zelle"
                                            ? "#6F459C"
                                            : null
                                          }}
                                        >
                                          {" "}
                                        </span>
                                        <span style={{ fontSize: 12, width: 150, fontWeight: 400}}>{this.props.t(`componentData.dashboard.graphLabels.${item[0]}`)}</span>
                                        <span>
                                          {" "}
                                          {item[1]}%
                                        </span>
                                      </Box>
                                    </li>
                                  )
                                })
                                : null
                              } 
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
                            {t("componentData.dashboard.PaymentsTxt")} {" "}
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
                        (!totalUSDPayments || totalUSDPayments === 0)))) ||
                      (selectedView === "Amount" &&
                        ((selectedCurrency === "USD" &&
                          (!totalUSDAmount || totalUSDAmount === 0)))) ||
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
                      <Box className={classes.lineChartBox}>
                        <Line
                          id={"paymentsChart"}
                          width={760}
                          height={210}
                          data={this.state.paymentsData}
                          options={this.state.lineChartOptions}
                          redraW={true}                        
                        />
                       </Box> 
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
                  <Box py={3} px={4} className={classes.graphSec}>

                    <Box className={classes.graphHead}>
                      <h1 className={classes.headingNew}>
                        {t("componentData.dashboard.ContactedPayees")}
                      </h1>

                      <Box className="selectBox">
                        <TextField
                          value={selectedEnroll}                          
                          onChange={(e) =>
                            this.setState(
                              { selectedEnroll: e.target.value },
                              () => {
                                this.getSankeyChartData();
                              }
                            )
                          }
                          select
                          variant="outlined"
                          size="small"
                          style={{ "width": "100%" }}
                        >
                          {enrollFilters &&
                            enrollFilters.map((c) => (
                              <MenuItem
                                key={c.key}
                                value={c.value}
                              >
                                {t(
                                  `componentData.dashboard.${c.label}`
                                )}
                              </MenuItem>
                            ))}
                        </TextField>
                      </Box>
                    </Box>  

                    <Grid container>
                      <Grid item xs={12}>
                          <Box className={classes.payeeGraphTitles}>
                            <Typography variant="h3">
                              {t('componentData.dashboard.PayeesEnrollmentStatus')}
                            </Typography>                            

                            {enrollmentConsumerData?.dates?.length > 0
                              ? <>
                                <Typography variant="subtitle2">
                                  {payeeEnrollGraphInfo?.currentPeriodText ?? ""}
                                </Typography>

                                <Box className="viewAllStatus">
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={viewAllStatus}
                                        onChange={(e)=> this.handleAllStatus(e)}
                                        name="viewAllStatus"
                                        color="primary"
                                      />
                                    }
                                    label={t('componentData.dashboard.ViewAllStatus')}
                                  />
                                </Box>
                              </>                              
                              : null
                            }  

                          </Box>   
                          
                          {enrollmentConsumerData?.dates?.length > 0
                            ? <Box className={classes.mixedGraph}>
                                <Typography 
                                  variant="h3"
                                  style={{left: this.props.user.userData.locale === 'en' ? "-47px" : "-60px"}}
                                >
                                  {t('componentData.dashboard.NumberOfPayees')}
                                </Typography>
                                <Box className="GraphHolder">
                                  <Bar
                                    data={mixedGraphData}                              
                                    options={mixedGraphOpt} 
                                    height= '200px'
                                  />
                                </Box>                            
                              </Box>
                            : <Box
                                py={3}
                                color="#A1A1A1"
                                fontSize={14}
                                display="block"
                                textAlign="center"
                                borderBottom='1px solid #8F9EC3'
                                mb={4}
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
                          } 

                          {payeeEnrollGraphInfo?.difference?.length > 0 && enrollmentConsumerData?.dates?.length > 0 && (
                            <Box className={classes.PayeeDetailBox}>
                              <Box className="box">
                                <PayeeDetail 
                                  data={payeeEnrollGraphInfo?.difference ?? []}
                                />
                              </Box>                             

                              <Typography variant="h4" className="bottomTxt">
                                {payeeEnrollGraphInfo?.currentPeriodText && payeeEnrollGraphInfo?.previousPeriodText && (
                                  <>
                                    {t("componentData.dashboard.ChangeIn")} {payeeEnrollGraphInfo.currentPeriodText} {t("componentData.dashboard.vsPreviousPeriod")} ({payeeEnrollGraphInfo.previousPeriodText})
                                  </>
                                )}
                              </Typography>

                          </Box>
                          )}                            
                               
                      </Grid>
                    </Grid>

                    <Grid container>
                      <Grid item xs={3} className={classes.B2CPaymentsPrefrences}> 
                        <Typography variant="h1">
                          {paymentTypeData?.all?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? 0}
                        </Typography>                   
                        <Typography variant="h2">
                          {t("componentData.dashboard.paymentPreferance")}                         
                        </Typography>                        
                      </Grid>

                      <Grid item xs={4}>
                        <Box>
                          {Boolean(Number(paymentTypeData.all)) ? (
                            <Box className={classes.B2CEnrollDoughnutChrt}>
                              <Doughnut
                                id="B2CEnrollDoughnutChart"
                                width={120}
                                height={120}
                                data={b2cEnrollDonutData}
                                options={b2cEnrolldoughnutOptions}
                                ref={this.totalEnrollRef}
                              />
                            </Box>
                          ) : (
                            <Tooltip
                              title="No Data Available"
                              aria-label="No Data Available"
                            >
                              <img
                                src={require(`~/assets/images/blankDoughnut.PNG`)}
                                alt={"No Data Found"}
                                style={{
                                  height: "95px",
                                  width: "100px",
                                  margin: "0 auto",
                                  float: "none",
                                  display: "block"
                                }}
                              />
                            </Tooltip>
                          )}

                        </Box>
                      </Grid>

                      <Grid item xs={5}>                        
                        <Box 
                          className={classes.legendList2}
                          style={{
                            height: '120px',
                            display: 'flex',
                            verticalAlign: 'middle',    
                            flexDirection: 'row',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            alignContent: 'center',
                            justifyContent: 'flex-start',
                          }}
                        >
                          {Boolean(getSortPaymentData) 
                            ? getSortPaymentData.map((i)=>{
                              return(                              
                              i[0].toLocaleLowerCase() !== 'all'
                                ? <>
                                    <Box
                                      pb={1}
                                      display="flex"
                                      width={"100%"}
                                      fontWeight={700}
                                      fontSize={11}
                                      alignItems="center"
                                      className="legendItem" 
                                      onClick={(e)=>this.enrollLegendClick(e)} 
                                      name={i[0]}
                                    >
                                      <span
                                        className={classes.dot}
                                        style={{ backgroundColor: i[0] === "Bank Deposit (ACH)"
                                          ? "#3F007D"
                                          : i[0] === "Check"
                                          ? "#DADAEB"
                                          : i[0] === "PayPal"
                                          ? "#C5BBDB"
                                          : i[0] === "Instant Pay (P2C)"
                                          ? "#9B7FBC"
                                          : i[0] === "Zelle"
                                          ? "#6F459C"
                                          : null
                                        }}
                                      >
                                        {" "}
                                      </span>
                                      <span style={{ fontSize: 12, width: 150, fontWeight: 400 }}>
                                        {i[0] === "Bank Deposit (ACH)"
                                          ? t("componentData.dashboard.BankDepositACH")
                                            : i[0] === "Check"
                                              ? t("componentData.dashboard.Check")
                                                : i[0] === "PayPal"
                                                  ? t("componentData.dashboard.PayPal")
                                                    : i[0] === "Instant Pay (P2C)"
                                                      ? t("componentData.dashboard.InstantPayP2C")
                                                        : t("componentData.dashboard.Zelle")
                                        } 
                                        </span>
                                      <span>
                                        {" "}
                                        {Boolean(Number(paymentTypeData.all))
                                          ? parseFloat(Number(i[1]) / Number(paymentTypeData.all) * 100).toFixed(2)
                                          : 0
                                        }%
                                      </span>
                                    </Box>
                                  </>
                                : null
                              )})
                            : null
                          }                         

                        </Box>
                      </Grid>

                    </Grid>  
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
    withStyles(styles)(B2CGraph)
  )
);
