import React from "react";
import { Grid, Box, withStyles, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { styles } from "./styles";
import { withTranslation } from "react-i18next";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  getSMSEmailCount,
  getTotalPayeeGraphData,
  getProfileStatusGraphData,
  getPaymentGraphData,
} from "~/redux/helpers/campaigns";
import NoData from "~/components/NoData";
import "chartjs-plugin-labels";
import { paymentMethodIds } from "~/config/paymentMethods";
import { B2CfetchSelectedTabs } from "~/redux/helpers/settings";
import { getUSBankClientPaymentTypes } from "~/redux/actions/USbank/payments";

class PayeeEnrollmentDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secondGraphData: [],
      secondGraphOpt: [],
      smsEmailData: [],
      totalPayeeData: [],
      totalPayeeOpt: [],
      profileStatusData: [],
      profileStatusOpt: [],
      profileStatusAPIData: [],
      totalPayeeAPIData: [],
      paymentAPIResData: [],
      paymentGraphData: [],
      paymentGraphOpt: [],
      paymentChartRef: null,
      SMSEmailyRef: null,
      profileRef: null,
      payeesStatusRef: null,
      optedPaymentMethod: [],
      PreferredPrepaidPaymentMethod: [],
    };
  }

  componentDidMount() {
    const { isPayeeChoicePortal } = this.props.user;
    this.getOptedPaymentList();
    this.totalPayeeGraph();
    this.renderSecondChart();
    this.profileStatusGraph();
    if (isPayeeChoicePortal) {
      this.fetchPrepaidPreferredClientPaymentTypes();
    }
  }
  fetchPrepaidPreferredClientPaymentTypes() {
    const clientId = this.props.user.userData.portalProfileId;
    this.props
      .dispatch(getUSBankClientPaymentTypes(clientId))
      .then((response) => {
        if (!response) {
          return false;
        }
        const paymentprepaidMethods =
          (this.props.USBankPayment &&
            this.props.USBankPayment.preferredTypes) ||
          [];
          const list = paymentprepaidMethods.map((e) => {
            return e.b2cDescription;
          });
        this.setState({
          PreferredPrepaidPaymentMethod: list,
          //preferredPaymentMethodCheked: paymentMethods.length > 0 ? true : false
        });
      });
  }

  getOptedPaymentList = () => {
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchSelectedTabs(clientId).then((response) => {
      if (response.error) {
        return false;
      } else {
        if (Boolean(response?.data?.rows2 ?? false)) {
          const list = response.data.rows2.map((e) => {
            return e.b2cDescription;
          });
          this.setState(
            {
              optedPaymentMethod: list,
            },
            () => {
              this.PaymentPreferenceGraph();
            }
          );
        }
      }
    });
  };

  totalPayeeGraph = () => {
    const { parentFileData, t, type, fileId } = this.props;

    if (type === "campaignFile") {
      getTotalPayeeGraphData(parentFileData.FileID || fileId).then((res) => {
        if (!res || res.error) {
          this.setState({
            error:
              res?.message ?? t("componentData.reduxData.SomethingWentWrong"),
            variant: "error",
          });
          return;
        }
        let respData = null;
        if (type === "campaignFile") {
          respData = res[0];
        } else {
          respData = res[0].PaymentFileDetails[0];
        }
        this.setState(
          {
            totalPayeeAPIData: respData,
          },
          () => {
            if (respData) {
              this.setTotalPayeeAPIDataInGraph(respData, type);
            }
          }
        );
      });
    } else {
      this.setState(
        {
          totalPayeeAPIData: parentFileData,
        },
        () => {
          if (Boolean(parentFileData)) {
            this.setTotalPayeeAPIDataInGraph(parentFileData, type);
          }
        }
      );
    }
  };

  setTotalPayeeAPIDataInGraph = (apiData, type) => {
    const { t } = this.props;
    let graphArr = [];
    if (type === "campaignFile") {
      graphArr = [apiData.Contacted, apiData.Existing, apiData.Invalid];
    } else {
      graphArr = [
        apiData.ContactedPayeesCount,
        apiData.ExistingPayeesCount,
        apiData.InvalidPayeesCount,
      ];
    }

    const payeeDoughnutData = {
      labels: [
        t("componentData.paymentEnrollmentDetails.contacted"),
        t("componentData.paymentEnrollmentDetails.existing"),
        t("componentData.paymentEnrollmentDetails.invalid"),
      ],
      datasets: [
        {
          data: graphArr,
          backgroundColor: ["#5A86B5", "#C1F1E6", "#FDB6C3"],
          borderWidth: 0,
        },
      ],
    };

    const payeeDoughnutOptions = {
      tooltips: {
        enabled: true,
        titleAlign: "center",
        callbacks: {
          title: function (tooltipItem, data) {
            const total = data.datasets[0].data.reduce(function (
              previousValue,
              currentValue,
              currentIndex,
              array
            ) {
              return previousValue + currentValue;
            });
            const currentValue = data.datasets[0].data[tooltipItem[0].index];
            let precentage = 0;
            if (total > 0) {
              precentage = Math.round((currentValue / total) * 100);
            }
            return precentage + "%";
          },
          label: function (tooltipItem, data) {
            return (
              data.labels[tooltipItem["index"]] +
              " : " +
              data["datasets"][0]["data"][tooltipItem["index"]]
            );
          },
        },
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
        display: false,
        position: "left",
        labels: {
          render: "percentage",
          usePointStyle: true,
          fontSize: 14,
          fontStyle: "normal",
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
          render: "percentage",
          arc: false,
          overlap: false,
          precision: 0,
          fontColor: ["#fff", "#fff", "#fff"],
        },
      },
    };

    this.setState({
      totalPayeeData: payeeDoughnutData,
      totalPayeeOpt: payeeDoughnutOptions,
    });
  };

  renderSecondChart = () => {
    const { parentFileData, t, type, fileId } = this.props;
    getSMSEmailCount(parentFileData.FileID || fileId, type).then((res) => {
      if (!res || res.error) {
        this.setState({
          error:
            res?.message ?? t("componentData.reduxData.SomethingWentWrong"),
          variant: "error",
        });
        return;
      }
      this.setState(
        {
          smsEmailData: res,
        },
        () => {
          if (Boolean(res)) {
            this.setBarAPIData();
          }
        }
      );
    });
  };

  setBarAPIData = () => {
    const { t } = this.props;
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
              stepSize: 1,
            },
          },
        ],
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
        labels: {
          usePointStyle: true,
          fontColor: "#121212",
          fontSize: 14,
          fontStyle: "normal",
          padding: 15,
          boxWidth: 8,
        },
        title: {
          padding: 6,
        },
      },
      responsive: true,
    };

    const arbitraryStackKey = "stack1";
    const { isEmailBounced, isEmailDelivered, isSmsBounced, isSmsDelivered } =
      this.state.smsEmailData;
    const data = {
      labels: [
        t("componentData.paymentEnrollmentDetails.Emails"),
        t("componentData.paymentEnrollmentDetails.SMSes"),
      ],
      datasets: [
        {
          stack: arbitraryStackKey,
          label: t("componentData.paymentEnrollmentDetails.delivered"),
          data: [Number(isEmailDelivered), Number(isSmsDelivered)],
          backgroundColor: "#5A86B5",
        },
        {
          stack: arbitraryStackKey,
          label: t("componentData.paymentEnrollmentDetails.bounced"),
          data: [Number(isEmailBounced), Number(isSmsBounced)],
          backgroundColor: "#FDB6C3",
        },
      ],
    };

    this.setState({
      secondGraphData: data,
      secondGraphOpt: options,
    });
  };

  profileStatusGraph = () => {
    const { parentFileData, t, type, fileId } = this.props;
    getProfileStatusGraphData(parentFileData.FileID || fileId, type).then(
      (res) => {
        if (!res || res.error) {
          this.setState({
            error:
              res?.message ?? t("componentData.reduxData.SomethingWentWrong"),
            variant: "error",
          });
          return;
        }
        this.setState(
          {
            profileStatusAPIData: res,
          },
          () => {
            this.setProfileStatusAPIDataInGraph(res);
          }
        );
      }
    );
  };

  setProfileStatusAPIDataInGraph = (apiRes) => {
    const recordArr = [];
    const lebalArr = [];
    const bgColor = [];

    apiRes.map((i) => {
      if (i.key !== "all") {
        recordArr.push(i.count);
        lebalArr.push(i.label);
        switch (i.key) {
          case "isEnrolledAsGuest":
            bgColor.push("#92C8BA");
            break;
          case "isActive":
            bgColor.push("#C1F1E6");
            break;
          case "isPaymentPreferencePending":
            bgColor.push("#86B1D9");
            break;
          case "isProfileCreationPending":
            bgColor.push("#B2DFFF");
            break;
          case "isLocked":
            bgColor.push("#63A191");
            break;
          case "isRevoked":
            bgColor.push("#FDB6C3");
            break;
          case "isDeleted":
            bgColor.push("#A34045");
            break;
          case "isDeactivated":
            bgColor.push("#DA868E");
            break;
          case "isInactive":
            bgColor.push("#93601E");
            break;
          default:
            break;
        }
      }
    });

    const profileDoughnutData = {
      labels: lebalArr,
      datasets: [
        {
          data: recordArr,
          backgroundColor: bgColor,
          borderWidth: 0,
        },
      ],
    };

    const profileDoughnutOptions = {
      tooltips: {
        enabled: true,
        titleAlign: "center",
        callbacks: {
          title: function (tooltipItem, data) {
            const total = data.datasets[0].data.reduce(function (
              previousValue,
              currentValue,
              currentIndex,
              array
            ) {
              return previousValue + currentValue;
            });
            const currentValue = data.datasets[0].data[tooltipItem[0].index];
            let precentage = 0;
            if (total > 0) {
              precentage = Math.round((currentValue / total) * 100);
            }
            return precentage + "%";
          },
          label: function (tooltipItem, data) {
            return (
              data.labels[tooltipItem["index"]] +
              " : " +
              data["datasets"][0]["data"][tooltipItem["index"]]
            );
          },
        },
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
        display: false,
        position: "left",
        labels: {
          render: "percentage",
          usePointStyle: true,
          fontSize: 14,
          fontStyle: "normal",
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
          render: "percentage",
          arc: false,
          overlap: false,
          precision: 0,
          fontColor: [
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
          ],
        },
      },
    };

    this.setState({
      profileStatusData: profileDoughnutData,
      profileStatusOpt: profileDoughnutOptions,
    });
  };

  getProfileStatusCount = () => {
    if (
      Boolean(this.state.profileStatusAPIData) &&
      this.state.profileStatusAPIData.length > 0
    ) {
      const getInd = this.state.profileStatusAPIData
        .map((o) => o.key)
        .indexOf("all");
      return this.state.profileStatusAPIData[getInd].count;
    }
  };

  PaymentPreferenceGraph = () => {
    const { parentFileData, t, type, fileId } = this.props;

    getPaymentGraphData(parentFileData.FileID || fileId, type).then((res) => {
      if (!res || res.error) {
        this.setState({
          error:
            res?.message ?? t("componentData.reduxData.SomethingWentWrong"),
          variant: "error",
        });
        return;
      }
      this.setState(
        {
          paymentAPIResData: res,
        },
        () => {
          if (
            Boolean(res.finalGraphResult) &&
            res.finalGraphResult.length === 0
          ) {
            //No data found condition
          } else if (
            Boolean(res.resultantArray) &&
            res.resultantArray.length > 0
          ) {
            this.setPaymentDataInGraph(res);
          }
        }
      );
    });
  };

  setPaymentDataInGraph = (apiRes) => {
    const { isPayeeChoicePortal } = this.props.user;
    const recordArr = [];
    const lebalArr = [];
    const percent = [];
    const colorCode = [];

    const arr = [];
    isPayeeChoicePortal
      ? apiRes.resultantArray.map((i) => {
          if (i.key !== "all") {
            if (i.primaryPaymentMethodId === paymentMethodIds.USBankACH) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#3F007D",
              ]);
            } else if (i.primaryPaymentMethodId === paymentMethodIds.Zelle) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#6F459C",
              ]);
            } else if (
              i.primaryPaymentMethodId === paymentMethodIds.USBankRTP
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#D52DB7",
              ]);
            } else if (
              i.primaryPaymentMethodId ===
              paymentMethodIds.USBankDepositToDebitcard
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#FF2E7E",
              ]);
            } else if (
              i.primaryPaymentMethodId === paymentMethodIds.USBankPrepaidCard
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#FF6B45",
              ]);
            }
            else if (
              i.primaryPaymentMethodId === paymentMethodIds.PrepaidFocusNonPayroll
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#FF6B45",
              ]);
            }
            else if (
              i.primaryPaymentMethodId === paymentMethodIds.PrepaidReliaCard
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#FF6B45",
              ]);
            }
            else if (
              i.primaryPaymentMethodId === paymentMethodIds.PrepaidCorporateReward
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#FF6B45",
              ]);
            }
            else if (
              i.primaryPaymentMethodId === paymentMethodIds.PlasticCorporateCard
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#FF6B45",
              ]);
            }
            else if (
              i.primaryPaymentMethodId === paymentMethodIds.DigitalCorporateCard
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#FF6B45",
              ]);
            }
            
            
            
            
            else if (
              i.primaryPaymentMethodId === paymentMethodIds.USBankCHK
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#DADAEB",
              ]);
            }
          }
        })
      : apiRes.resultantArray.map((i) => {
          if (i.key !== "all") {
            if (i.primaryPaymentMethodId === paymentMethodIds.ACH) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#3F007D",
              ]);
            } else if (i.primaryPaymentMethodId === paymentMethodIds.Zelle) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#6F459C",
              ]);
            } else if (
              i.primaryPaymentMethodId === paymentMethodIds.PushToCard
            ) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#9B7FBC",
              ]);
            } else if (i.primaryPaymentMethodId === paymentMethodIds.PayPal) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#C5BBDB",
              ]);
            } else if (i.primaryPaymentMethodId === paymentMethodIds.CHK) {
              return arr.push([
                i.paymentCode,
                i.count,
                i.paymentPerc,
                "#DADAEB",
              ]);
            }
          }
        });
        let getPaymentList 
    if (isPayeeChoicePortal) {
       getPaymentList = this.sortPaymentDataWithMultiValUSbank(arr);
    } else {
       getPaymentList = this.sortPaymentDataWithMultiVal(arr);
    }
    getPaymentList.map((e) => {
      lebalArr.push(e[0]);
      recordArr.push(Number(e[1]));
      percent.push(e[2]);
      colorCode.push(e[3]);
    });
    const paymentDoughnutData = {
      labels: lebalArr,
      percentage: percent,
      datasets: [
        {
          data: recordArr,
          backgroundColor: colorCode,
          borderWidth: 0,
        },
      ],
    };

    const paymentDoughnutOptions = {
      tooltips: {
        enabled: true,
        titleAlign: "center",
        callbacks: {
          title: function (tooltipItem, data) {
            const total = data.datasets[0].data.reduce(function (
              previousValue,
              currentValue,
              currentIndex,
              array
            ) {
              return previousValue + currentValue;
            });
            const currentValue = data.datasets[0].data[tooltipItem[0].index];
            let precentage = 0;
            if (total > 0) {
              precentage = Math.round((currentValue / total) * 100);
            }
            return precentage + "%";
          },
          label: function (tooltipItem, data) {
            return (
              data.labels[tooltipItem["index"]] +
              " : " +
              data["datasets"][0]["data"][tooltipItem["index"]]
            );
          },
        },
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
        display: false,
        position: "left",
        labels: {
          render: "percentage",
          usePointStyle: true,
          fontSize: 14,
          fontStyle: "normal",
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
          render: "percentage",
          arc: false,
          overlap: false,
          precision: 0,
          fontColor: [
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
            "#fff",
          ],
        },
      },
    };
    this.setState({
      paymentGraphData: paymentDoughnutData,
      paymentGraphOpt: paymentDoughnutOptions,
    });
  };

  sortPaymentDataWithMultiVal = (data) => {
    if (Object.keys(data).length > 0) {
      const { optedPaymentMethod } = this.state;
      var sortable = data;
      const shortData = sortable.sort(function (a, b) {
        return b[1] - a[1];
      });
      if (Boolean(optedPaymentMethod)) {
        const list = [];
        shortData.map((e) => {
          let index = optedPaymentMethod.indexOf(e[0]);
          if (index != -1) {
            return list.push(e);
          }
        });
        return list;
      } else {
        return shortData;
      }
    }
  };
  sortPaymentDataWithMultiValUSbank = (data) => {
    if (Object.keys(data).length > 0) {
      const { PreferredPrepaidPaymentMethod } = this.state;
      var sortable = data;
      const shortData = sortable.sort(function (a, b) {
        return b[1] - a[1];
      });
      if (Boolean(PreferredPrepaidPaymentMethod)) {
        const list = [];
        shortData.map((e) => {
          let index = PreferredPrepaidPaymentMethod.indexOf(e[0]);
          if (index != -1) {
            return list.push(e);
          }
        });
        return list;
      } else {
        return shortData;
      }
    }
  };
  applyPaymentRef = (ref) => {
    this.setState(
      {
        paymentChartRef: ref,
      },
      () => {
        this.insertLegends(ref);
      }
    );
  };

  applSMSEmailyRef = (ref) => {
    this.setState(
      {
        SMSEmailyRef: ref,
      },
      () => {
        this.insertLegends(ref);
      }
    );
  };

  profileStatusRef = (ref) => {
    this.setState(
      {
        profileRef: ref,
      },
      () => {
        this.insertLegends(ref);
      }
    );
  };

  payeesRef = (ref) => {
    this.setState(
      {
        payeesStatusRef: ref,
      },
      () => {
        this.insertLegends(ref);
      }
    );
  };

  insertLegends = (ref) => {
    const { labels, percentage } = ref.props.data;
    const { backgroundColor } = ref.props.data.datasets[0];

    if (ref.chartInstance.canvas.getAttribute("id") === "doughnutChart_3") {
      let str = "<ul>";
      labels.map((elm, index) => {
        str += `<li class="legend-item" index= ${index}>
        <span style="background: ${backgroundColor[index]}"></span> 
        <h4>${elm}</h4>      
        <label>${percentage[index]}</label>
        </li>`;
      });
      str += "</ul>";
      document.getElementById("legendHolder").innerHTML = str;
      var element = document.querySelector("#legendHolder");
      var elementChildren = element.querySelectorAll(".legend-item");
      for (var i = 0; i < elementChildren.length; i++) {
        elementChildren[i].addEventListener(
          "click",
          (e) => this.onClickLegend(e, ref),
          false
        );
      }
    } else if (
      ref.chartInstance.canvas.getAttribute("id") === "doughnutChart_2"
    ) {
      let str = "<ul>";
      labels.map((elm, index) => {
        str += `<li class="legend-item" index= ${index}>
        <span style="background: ${backgroundColor[index]}"></span> 
        <h4>${elm}</h4>  
        </li>`;
      });
      str += "</ul>";
      document.getElementById("profileStatusLegend").innerHTML = str;
      var element = document.querySelector("#profileStatusLegend");
      var elementChildren = element.querySelectorAll(".legend-item");
      for (var i = 0; i < elementChildren.length; i++) {
        elementChildren[i].addEventListener(
          "click",
          (e) => this.onClickLegend(e, ref),
          false
        );
      }
    } else if (
      ref.chartInstance.canvas.getAttribute("id") === "doughnutChart_1"
    ) {
      const { data } = ref.props.data.datasets[0];
      let str = "<ul>";
      labels.map((elm, index) => {
        str += `<li class="legend-item" index= ${index}>
        <span style="background: ${backgroundColor[index]}"></span> 
        <h4>${elm}</h4> 
        <label>${data[index]}</label> 
        </li>`;
      });
      str += "</ul>";
      document.getElementById("payeesLegend").innerHTML = str;
      var element = document.querySelector("#payeesLegend");
      var elementChildren = element.querySelectorAll(".legend-item");
      for (var i = 0; i < elementChildren.length; i++) {
        elementChildren[i].addEventListener(
          "click",
          (e) => this.onClickLegend(e, ref),
          false
        );
      }
    }
  };

  onClickLegend = (e, ref) => {
    const index = Number(e.currentTarget.getAttribute("index"));
    var meta = ref.chartInstance.getDatasetMeta(0);
    var result = meta.data[index].hidden == true ? false : true;
    if (result === true) {
      meta.data[index].hidden = true;
      e.currentTarget.classList.add("strike");
    } else {
      e.currentTarget.classList.remove("strike");
      meta.data[index].hidden = false;
    }
    ref.chartInstance.update();
  };

  render() {
    const {
      secondGraphData,
      secondGraphOpt,
      smsEmailData,
      totalPayeeData,
      totalPayeeOpt,
      profileStatusData,
      profileStatusOpt,
      profileStatusAPIData,
      totalPayeeAPIData,
      paymentGraphData,
      paymentGraphOpt,
      paymentAPIResData,
    } = this.state;
    const { t, classes, type } = this.props;
    const profileCount = this.getProfileStatusCount();

    return (
      <Box
        mx={6}
        my={1}
        className={classes.enrollmentDetailBox}
        style={{
          margin: type === "paymentFile" ? "24px 47px 8px" : "8px 32px",
        }}
      >
        <Typography variant="h1" className={classes.heading}>
          {t("componentData.paymentEnrollmentDetails.heading")}
        </Typography>

        <Grid container className={classes.innerBox}>
          <Grid item xs={6} className={classes.graphBox}>
            {(Boolean(totalPayeeAPIData.Total_Records) &&
              totalPayeeAPIData.Total_Records > 0) ||
            (Boolean(totalPayeeAPIData.TotalPayeesCount) &&
              totalPayeeAPIData.TotalPayeesCount > 0) ? (
              <>
                <Typography variant="h2">
                  <span>
                    {t("componentData.paymentEnrollmentDetails.totalPayees")}
                  </span>
                  <label>
                    {type === "campaignFile"
                      ? totalPayeeAPIData.Total_Records
                      : totalPayeeAPIData.TotalPayeesCount}
                  </label>
                </Typography>

                <div className={classes.chartOuterDiv2}>
                  <div id="payeesLegend"></div>
                  <div className="doughnutChart_1">
                    <Doughnut
                      id="doughnutChart_1"
                      width={130}
                      height={100}
                      data={totalPayeeData}
                      options={totalPayeeOpt}
                      ref={this.payeesRef}
                    />
                  </div>
                </div>

                <Typography variant="caption" className={classes.captionTxt}>
                  {type === "campaignFile" ? (
                    <>
                      <strong>
                        {t("componentData.paymentEnrollmentDetails.note")}:
                      </strong>{" "}
                      {t(
                        "componentData.paymentEnrollmentDetails.noteEnrollment"
                      )}
                    </>
                  ) : (
                    <>
                      <strong>
                        {t("componentData.paymentEnrollmentDetails.note")}:
                      </strong>{" "}
                      {t(
                        "componentData.paymentEnrollmentDetails.noteEnrollmentPayments"
                      )}
                    </>
                  )}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h2" style={{ marginBottom: 80 }}>
                  <span>
                    {t("componentData.paymentEnrollmentDetails.totalPayees")}
                  </span>
                </Typography>
                <NoData />
              </>
            )}
          </Grid>

          <Grid item xs={6} className={classes.graphBox}>
            {Boolean(profileStatusAPIData) && profileCount > 0 ? (
              <>
                <Typography variant="h3">
                  <span>
                    {t(
                      "componentData.paymentEnrollmentDetails.profileStatusDynamic",
                      { profileCount: profileCount || "" }
                    )}
                  </span>
                </Typography>
                <div className={classes.chartOuterDiv2}>
                  <div id="profileStatusLegend"></div>
                  <div className="doughnutChart_2">
                    <Doughnut
                      id="doughnutChart_2"
                      width={140}
                      height={100}
                      data={profileStatusData}
                      options={profileStatusOpt}
                      ref={this.profileStatusRef}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Typography variant="h3" style={{ marginBottom: 80 }}>
                  <span>
                    {t("componentData.paymentEnrollmentDetails.profileStatus")}
                  </span>
                </Typography>
                <NoData />
              </>
            )}
          </Grid>

          <div className={classes.dividerDiv}></div>

          <Grid item xs={6} className={classes.graphBox}>
            {Object.keys(smsEmailData).length > 0 ? (
              <>
                <Typography variant="h2">
                  <span>
                    {t("componentData.paymentEnrollmentDetails.contacted")}
                  </span>
                  <label
                    onClick={() =>
                      this.props.history.push("/suppliers/mySupplier")
                    }
                  >
                    {smsEmailData?.contacted ?? 0}
                  </label>
                </Typography>
                <div className={classes.chartOuterDiv}>
                  <div id="SMSEmailLegend"></div>
                  <Bar
                    data={secondGraphData}
                    width={100}
                    height={100}
                    options={secondGraphOpt}
                    //ref={this.applSMSEmailyRef}
                    id="SMSEmailChart"
                  />
                </div>
              </>
            ) : (
              <>
                <Typography variant="h2" style={{ marginBottom: 80 }}>
                  <span>
                    {t("componentData.paymentEnrollmentDetails.contacted")}
                  </span>
                </Typography>
                <NoData />
              </>
            )}
          </Grid>

          <Grid item xs={6} className={classes.graphBox}>
            {Boolean(paymentAPIResData.resultantArray) &&
            paymentAPIResData.resultantArray.length > 0 ? (
              <>
                <Typography variant="h2">
                  <span>
                    {t(
                      "componentData.paymentEnrollmentDetails.PaymentPreferenceTxt"
                    )}
                  </span>
                  <label>{paymentAPIResData?.totalCount[0]}</label>
                </Typography>
                <div className={classes.chartOuterDiv2}>
                  <div id="legendHolder"></div>
                  <div className="doughnutChart_3">
                    <Doughnut
                      id="doughnutChart_3"
                      width={130}
                      height={100}
                      data={paymentGraphData}
                      options={paymentGraphOpt}
                      ref={this.applyPaymentRef}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Typography variant="h3" style={{ marginBottom: 80 }}>
                  <span>
                    {t(
                      "componentData.paymentEnrollmentDetails.PaymentPreferenceNotFound"
                    )}
                  </span>
                </Typography>
                <NoData />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default withTranslation()(
  connect((state) => ({
    ...state.user,
    ...state.clientConfig,
    ...state.USBankPayment,
  }))(withStyles(styles)(PayeeEnrollmentDetails))
);
