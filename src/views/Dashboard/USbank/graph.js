import {
  Box,
  Grid,
  Paper,
  TextField,
  withStyles,
  MenuItem,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Divider,
} from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Line, Bar } from 'react-chartjs-2';
import styles from '~/views/Dashboard/styles';
import moment from 'moment';
import {
  getLineChartDataFormat,
  getEnrolledPayeesBarChartData,
  getBarChartDataFormat,
  formatter,
} from '~/utils/common.js';
import {
  fetchDashboardPayments,
  fetchDashboardPaymentSummary,
  fetchDashboardChildEntities,
  fetchB2CDashboardSankeyData,
} from '~/redux/helpers/B2C/dashboard';
import { SideDialog } from '~/components/Dialogs';
import DashboardDateFilter from '~/modules/DashboardDateFilter';
import EventIcon from '@material-ui/icons/Event';
import 'chartjs-plugin-annotation';
import { withTranslation } from 'react-i18next';
import { accessRights } from '~/config/accessRights';
import Notification from '~/components/Notification';
import '~/views/Dashboard/sankey.css';
import 'chartjs-plugin-labels';
import HighchartsSankey from 'highcharts/modules/sankey';
import Highcharts from 'highcharts';
import { entityType } from '~/config/entityTypes';
import { B2CfetchSelectedTabs } from '~/redux/helpers/settings';
import PayeeDetail from '~/components/PayeeDetail';

import {
  getNodeColor,
  getStatusColorToPoint,
  getStatusColorFromPoint,
} from '~/views/Dashboard/sankey/colors';
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
        ? '#939393'
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
            [0, H.color('#939393').setOpacity(0.6).get()],
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

class UsbankGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'React',
      type: 'line',
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
      viewAllStatus: false,
      mixedGraphData: [],
      mixedGraphOpt: [],
      filters: [
        {
          label: 'All time',
          key: 0,
        },
        {
          label: 'Previous Month',
          key: 1,
        },
        {
          label: 'Previous Quarter',
          key: 2,
        },
        {
          label: 'Previous Year',
          key: 3,
        },
        {
          label: 'Last 7 days',
          key: 4,
        },
        {
          label: 'Last 30 Days',
          key: 5,
        },
        {
          label: 'Custom',
          key: 6,
        },
      ],
      selectedCurrency: 'USD',
      selectedView: 'Amount',
      selectedPayeeView: 'status',
      totalPayments: '',
      totalCADPayments: '',
      totalUSDPayments: '',
      totalCHKPayment: '',
      totalACHPayment: '',
      totalVCAPayment: '',
      totalCADAmount: '',
      totalUSDAmount: '',
      totalACHAmount: '',
      totalCHKAmount: '',
      totalVCAAmount: '',
      totalZELPayment: '',
      totalPPLPayment: '',
      totalMSCPayment: '',
      chkPercent: '',
      achPercent: '',
      vcaPercent: '',
      mscPercent: '',
      pplPercent: '',
      zelPercent: '',
      paymentsData: {},
      data: {},
      usBankData: null,
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
          position: 'right',
          fillStyle: '',
          color: 'rgba(0,0,0,0)',
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
              gridLines: { color: '#E9EBF1' },
              ticks: {
                beginAtZero: true,
                fontFamily: 'Interstate',
                fontColor: '#9AA1A9',
                maxTicksLimit: 5,
                min: 0,
                callback: function (value, index, array) {
                  return value < 1000
                    ? value
                    : value < 1000000
                    ? value / 1000 + 'K'
                    : value < 1000000000
                    ? value / 1000000 + 'M'
                    : value / 1000000000 + 'B';
                },
              },
            },
          ],
          xAxes: [
            {
              gridLines: { color: '#E9EBF1' },
              ticks: {
                beginAtZero: true,
                fontFamily: 'Interstate',
                fontColor: '#9AA1A9',
              },
            },
          ],
        },
        tooltips: {
          enabled: true,
          backgroundColor: 'white',
          titleFontColor: '#7F7F7F',
          bodyFontColor: '#7F7F7F',
          bodySpacing: 2,
          bodyFontStyle: 'bold',
          bodyAlign: 'left',
          titleFontSize: 14,
          titleFontStyle: 'bold',
          bodyFontFamily: 'Interstate',
          axis: 'x',
          animationDuration: 400,
          mode: 'index',
          intersect: false,
          usePointStyle: true,
          itemSort: function (a, b) {
            return b.value - a.value;
          },
          callbacks: {
            label: function (tooltipItem, data) {
              let dataSetIndex = tooltipItem && tooltipItem['datasetIndex'];
              let currObject = data && data['datasets'][dataSetIndex];
              return (
                tooltipItem &&
                ` ${currObject && currObject['label']}: ${tooltipItem['value']
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                `
              );
            },
          },
        },
        hover: {
          usePointStyle: true,
          mode: 'y',
        },
      },
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },
        scales: {
          xAxes: [
            {
              ticks: {
                callback: function (label, index, labels) {
                  if (/\s/.test(label)) {
                    return label.split(' ');
                  } else {
                    return label;
                  }
                },
                fontSize: 12,
                maxRotation: 0,
                minRotation: 0,
              },
              maxBarThickness: 50,
            },
          ],
          yAxes: [{
            ticks:{
              min:0
            }
          }]
        },
        plugins: {
          labels: {
            fontSize: 0,
            textAlign: 'left',
            font: {
              size: 10,
            },
          },
        },
      },
      filter: {
        clientID: 0,
        payeeID: 0,
        year: year,
        month: month,
        quarter: '',
        lastDays: undefined,
        resultType: '',
        currency: '',
        fromDate: undefined,
        toDate: undefined,
      },
      modalMessage: null,
      variant: '',
      barChartData: null,
      enrolledPayeesBarChartData: null,
      totalPaymentCount: 0,
    };
  }

  sortDates(timeline) {
    return (
      timeline &&
      timeline.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    );
  }

  sortArrayonDate(array) {
    array.sort(function compare(a, b) {
      var dateA = new Date(a['figureFor']);
      var dateB = new Date(b['figureFor']);
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
            userRoles.includes(accessRights['PARENT_CHILD_ACCESS_VIEW'])) ||
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

  getOptedPaymentList = () => {
    const clientId = this.props.user.userData.portalProfileId;
    B2CfetchSelectedTabs(clientId).then((response) => {
      if (response.error) {
        return false;
      } else {
        if (Boolean(response?.data?.rows2 ?? false)) {
          let list = response.data.rows2.map((e) => {
            return e.b2cDescription.toLowerCase();
          });
          this.setState(
            {
              optedPaymentMethod: list,
            },
            () => {
              this.prepareData();
            }
          );
        } else {
          this.setState({
            barChartData: {},
            usBankData:{ totalPayments: 0, totalAmount: 0 }
          });
        }
      }
    });
  };

  getSankeyChartData = () => {
    const { selectedEntityClientId, filter, viewAllStatus } = this.state;
    const payloadData = {
      clientId: selectedEntityClientId,
      fileType: 'ALL',
      showAllStatus: viewAllStatus,
      lastDays: filter.lastDays || undefined,
      fromDate: filter['fromDate']
        ? moment(filter['fromDate']).format('MM/DD/YYYY')
        : undefined,
      toDate: filter['toDate']
        ? moment(filter['toDate']).format('MM/DD/YYYY')
        : undefined,
      month: filter.month || undefined,
      quarter: filter.quarter || undefined,
      year: filter.year || undefined,
    };

    this.setState({ isSankeyLoading: true }, () => {
      fetchB2CDashboardSankeyData(payloadData).then((res) => {
        this.setState(
          {
            enrollmentConsumerData: res?.data?.enrollmentData ?? [],
            paymentTypeData: Boolean(res.data.paymentTypeData)
              ? res.data.paymentTypeData
              : [],
            payeeEnrollGraphInfo: res?.data?.graphData ?? [],
          },
          () => {
            this.createMixedGraph();
            this.loadEnrollCount();
            this.loadEnrollBarChart();
          }
        );
      });
    });
    this.resetGraphStrike();
  };

  loadEnrollBarChart = () => {
    const { paymentTypeData } = this.state;
    this.setState({
      enrolledPayeesBarChartData:
        getEnrolledPayeesBarChartData(paymentTypeData),
    });
  };

  loadEnrollCount = () => {
    const { paymentTypeData } = this.state;
    let totalCount = 0;
    paymentTypeData.forEach((item, index) => {
      totalCount += item.totalcount;
    });
    this.setState({
      totalPaymentCount: totalCount,
    });
  };

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
        this.setState({
          usBankData: res.data,
          barChartData: getBarChartDataFormat(res.data?.paymentDetails ?? []),
        });
      });
    });
  }

  sortPaymentDataWithMultiVal = (data) => {
    if (Object.keys(data).length > 0) {
      const { optedPaymentMethod } = this.state;
      var sortable = data;
      let shortData = sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      if (Boolean(optedPaymentMethod)) {
        let list = [];
        shortData.map((e) => {
          let index = optedPaymentMethod.indexOf(e[0].toLowerCase());
          if (index !== -1) {
            return list.push(e);
          }
        });
        return list;
      } else {
        return shortData;
      }
    }
  };

  prepareDashboardPayments(payload) {
    fetchDashboardPayments(payload).then((response) => {
      if (response && response['data'] && response['data'].length > 0) {
        const totalDataSets = [];
        const timeLine = [];
        response.data &&
          response.data.forEach((obj) => {
            if (!timeLine.includes(obj['figureFor'])) {
              timeLine.push(obj['figureFor']);
            }
          });

        response &&
          response.data &&
          response.data.forEach((obj) => {
            totalDataSets.push({
              figure: obj['figure'],
              figureFor: obj['figureFor'],
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

        // const { optedPaymentMethod } = this.state;

        if (response?.data?.length) {
          this.setState({
            paymentsData: {
              labels: timeLine,
              datasets: [
                {
                  fill: false,
                  label: 'Total Payments',
                  backgroundColor: '#002D72',
                  borderColor: '#002D72',
                  lineTension: 0,
                  data:
                    newTotalData &&
                    newTotalData.map((item) => ({
                      y: item.figure,
                      x: item.figureFor,
                    })),
                },
                ...getLineChartDataFormat('description', response.data),
              ],
            },
          });
        }
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
          childEntities.map((childEntity) => childEntity['clientId']).join(',')
        : selectedEntityPaymentClientId;
    const appType = this.props.user.userData.appType
      ? parseInt(this.props.user.userData.appType)
      : entityType.B2B;
    const payload = {
      clientID: clientId,
      payeeID: 0,
      year: filter['year'],
      month: filter['month'],
      quarter: filter['quarter'],
      lastDays: filter['lastDays'],
      resultType: selectedView,
      currency: selectedCurrency,
      fromDate: filter['fromDate']
        ? moment(filter['fromDate']).format('MM/DD/YYYY')
        : undefined,
      toDate: filter['toDate']
        ? moment(filter['toDate']).format('MM/DD/YYYY')
        : undefined,
      BusinessType: appType,
    };
    this.prepareDashboardSummary(payload);
    this.prepareDashboardPayments(payload);
    this.getSankeyChartData();
  }

  returnFilterLabel(index) {
    this.resetGraphStrike();
    switch (index) {
      case 1:
        return 'All time';
      case 2:
        return 'Previous Month';
      case 3:
        return 'Previous Quarter';
      case 4:
        return 'Previous Year';
      case 5:
        return 'Last 7 days';
      case 6:
        return 'Last 30 days';
      case 7:
        return 'Custom';
      default:
        return 'Previous Month';
    }
  }

  sortPaymentDataFn = (data) => {
    if (Object.keys(data).length > 0) {
      const { optedPaymentMethod } = this.state;
      var sortable = [];
      for (var item in data) {
        sortable.push([item, data[item]]);
      }
      let shortData = sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      if (Boolean(optedPaymentMethod)) {
        let list = [];
        shortData.map((e) => {
          let index = optedPaymentMethod.indexOf(e[0].toLowerCase());
          if (index !== -1) {
            return list.push(e);
          }
        });
        return list;
      } else {
        return shortData;
      }
    }
  };

  totalPaymentLegendClick = (e) => {
    const { totalPaymentGraphRef } = this.state;
    if (Boolean(totalPaymentGraphRef)) {
      const name = e.currentTarget.getAttribute('name');
      const index = totalPaymentGraphRef.props.data.labels.indexOf(name);
      const meta = totalPaymentGraphRef.chartInstance.getDatasetMeta(0);
      const result = meta.data[index]?.hidden === true ? false : true;
      if (result === true) {
        meta.data[index].hidden = true;
        e.currentTarget.classList.add('strike');
      } else {
        e.currentTarget.classList.remove('strike');
        meta.data[index].hidden = false;
      }
      totalPaymentGraphRef.chartInstance.update();
    } else {
      e.currentTarget.classList.toggle('strike');
    }
  };

  resetGraphStrike = () => {
    let item = document.getElementsByClassName('legendItem');
    for (let i = 0; i < item.length; i++) {
      item[i].classList.remove('strike');
    }

    const { totalPaymentGraphRef } = this.state;

    if (Boolean(totalPaymentGraphRef)) {
      const meta_1 =
        totalPaymentGraphRef?.chartInstance?.getDatasetMeta(0) ?? null;
      if (Boolean(meta_1)) {
        for (let a = 0; a < meta_1.data.length; a++) {
          meta_1.data[a].hidden = false;
        }
        totalPaymentGraphRef.chartInstance.update();
      }
    }
  };

  createMixedGraph = () => {
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
            },
          },
        ],
      },
      interaction: {
        mode: 'point',
      },

      layout: {
        padding: {
          bottom: 0,
          top: 0,
        },
      },

      tooltips: {
        enabled: true,
        padding: 10,
        footerSpacing: 4,
        mode: 'index',
        backgroundColor: '#f7f7f7',
        bodyFontColor: '#000',
        titleFontColor: '#000',
        bodySpacing: 6,
        titleMarginBottom: 10,
        displayColors: true,
        reverse: false,
        position: 'nearest',
        yAlign: 'center',
        itemSort: function (a, b) {
          //return b.value - a.value;
        },
        callbacks: {
          label: function (tooltipItem, data) {
            let dataSetIndex = tooltipItem && tooltipItem['datasetIndex'];
            let currObject = data && data['datasets'][dataSetIndex];
            return (
              tooltipItem &&
              ` ${currObject && currObject['label']}: ${tooltipItem['value']
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              `
            );
          },
        },
      },
      plugins: {
        labels: {
          render: 'percentage',
          fontColor: ['#000', '#000'],
          textMargin: -25,
          precision: 1,
          fontSize: 0,
        },
      },
      legend: {
        display: true,
        position: 'bottom',
        reverse: false,
        labels: {
          usePointStyle: true,
          fontColor: '#121212',
          fontSize: 12,
          fontStyle: 'normal',
          padding: 10,
          boxWidth: 8,
        },
        title: {
          padding: 6,
        },
      },
      responsive: true,
    };

    const { enrollmentConsumerData } = this.state;

    const labels = Boolean(enrollmentConsumerData.dates) && [
      ...new Set(enrollmentConsumerData.dates.map((obj) => obj)),
    ];
    let graphData = [];
    let legendsList = [];

    Object.keys(enrollmentConsumerData).map((e) => {
      if (e.toLocaleLowerCase() !== 'dates') {
        legendsList.push(e);
      }
    });

    legendsList.map((e) => {
      if (e.toLocaleLowerCase() === 'contacted') {
        graphData.push({
          type: 'line',
          label: enrollmentConsumerData[e]?.label ?? '',
          data: enrollmentConsumerData[e]?.data ?? [],
          backgroundColor: enrollmentConsumerData[e]?.colorCode ?? '',
          borderColor: enrollmentConsumerData[e]?.colorCode ?? '',
          fill: false,
          tension: 0,
          borderWidth: 2,
          //order: 1
        });
      } else {
        graphData.push({
          type: 'bar',
          label: enrollmentConsumerData[e]?.label ?? '',
          data: enrollmentConsumerData[e]?.data ?? [],
          backgroundColor: enrollmentConsumerData[e]?.colorCode ?? '',
          //order: 2
        });
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
  };

  handleAllStatus = (e) => {
    this.setState(
      {
        viewAllStatus: e.target.checked,
      },
      () => {
        this.getSankeyChartData();
      }
    );
  };
  render() {
    const { classes, t } = this.props;

    const {
      selectedCurrency,
      selectedView,
      filters,
      selectedFilter,
      selectedCurrentDateFilter,
      enableDateFilter,
      filter,
      enrollmentConsumerData,
      paymentsData,
      childEntities,
      selectedEntityClientId,
      selectedEntityPaymentClientId,
      enrolledPayeesBarChartData,
      viewAllStatus,
      mixedGraphData,
      mixedGraphOpt,
      payeeEnrollGraphInfo,
      usBankData,
      barChartOptions,
      barChartData,
      totalPaymentCount,
    } = this.state;
    const clientId = this.props.user.userData.portalProfileId;
    return (
      <Grid>
        <Box>
          <Box display='flex' style={{ float: 'right', marginBottom: '10px' }}>
            <Button
              variant='text'
              startIcon={<EventIcon />}
              style={{
                textTransform: 'capitalize',
                color: '#0B1941',
                display: 'flex',
                marginLeft: 8,
              }}
              size='small'
              onClick={() => this.setState({ enableDateFilter: true })}
            >
              {t('componentData.dashboard.ViewingTxt')}&nbsp;
              {t(
                `componentData.dashboard.${this.returnFilterLabel(
                  selectedCurrentDateFilter
                )}`
              )}
            </Button>
          </Box>

          <Grid container>
            <Grid item xs={12} sm={12}>
              <Box style={{ marginBottom: '30px' }}>
                <Paper elevation={0}>
                  <Box py={1} px={2}>
                    <Box display='flex' justifyContent='space-between'>
                      <h2 className={classes.h1}>
                        {t('componentData.dashboard.paymentTxt')}
                      </h2>
                    </Box>

                    <Box
                      display='flex'
                      width={1}
                      justifyContent='space-between'
                      mt={2}
                    >
                      <Box width='100%'>
                        <span className={classes.dot}> </span>
                        <span
                          style={{
                            color: '#4C4C4C',
                            fontSize: 16,
                            fontWeight: 500,
                          }}
                        >
                          {t('componentData.dashboard.TotalPaymentsMade')}
                        </span>
                        <h1 className={classes.textNum}>
                          {usBankData?.totalPayments}
                        </h1>
                      </Box>
                      {childEntities && childEntities.length > 1 && (
                        <Box display='flex' maxWidth={350}>
                          <TextField
                            value={selectedEntityPaymentClientId}
                            label={t('componentData.dashboard.Entities')}
                            onChange={(e) =>
                              this.setState(
                                {
                                  selectedEntityPaymentClientId: e.target.value,
                                },
                                () => this.preparePaymentsData()
                              )
                            }
                            select
                            variant='outlined'
                            size='medium'
                            fullWidth
                          >
                            {childEntities && childEntities.length > 1 && (
                              <MenuItem
                                selected={selectedEntityClientId === -1}
                                value={-1}
                              >
                                {t('componentData.dashboard.AllEntities')}
                              </MenuItem>
                            )}
                            {childEntities &&
                              childEntities.map((childEntity) => (
                                <MenuItem
                                  selected={
                                    selectedEntityClientId ===
                                    childEntity['clientId']
                                  }
                                  value={childEntity && childEntity['clientId']}
                                >
                                  {`${
                                    childEntity && childEntity['clientName']
                                  } ${
                                    childEntity &&
                                    childEntity['clientId'] == clientId &&
                                    childEntities &&
                                    childEntities.length > 1
                                      ? '(Self)'
                                      : ''
                                  }`}
                                </MenuItem>
                              ))}
                          </TextField>
                        </Box>
                      )}
                    </Box>

                    <Grid container>
                      {!barChartData ? (
                        <Grid
                          item
                          container
                          xs={3}
                          justifyContent='center'
                          style={{ margin: 'auto', marginTop: '8px' }}
                        >
                          <Box width='100%'>
                            <Box px={2} ml={2}>
                              <CircularProgress />
                            </Box>
                          </Box>
                        </Grid>
                      ) : (
                        <Grid item container xs={12}>
                          <Box width='100%'>
                            <Box px={2} ml={2}>
                              <Box
                                textAlign='center'
                                justifyContent='center'
                                display='flex'
                                flexGrow={1}
                                mt={5}
                                pb={2}
                              >
                                {usBankData?.totalPayments &&
                                barChartData &&
                                Object.keys(barChartData).length ? (
                                  <Bar
                                    height={350}
                                    options={barChartOptions}
                                    data={barChartData}
                                  />
                                ) : (
                                  <Box
                                    display='block'
                                    textAlign='center'
                                    width={1}
                                    my={6}
                                  >
                                    <img
                                      alt='no-data'
                                      src={require('~/assets/images/nodata.svg')}
                                    />

                                    <Box
                                      py={3}
                                      color='#A1A1A1'
                                      fontSize={14}
                                      display='block'
                                    >
                                      {t(
                                        'componentData.dashboard.noDataToShow'
                                      )}
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>

                    <Divider style={{ width: '100%', background: '#8F9EC4' }} />

                    <Box my={2} display='flex' justifyContent='center'>
                      <span
                        onClick={() =>
                          this.setState({ selectedCurrency: 'USD' }, () =>
                            this.preparePaymentsData()
                          )
                        }
                        className={classes.flagContainer}
                      >
                        <img
                          src={require(`~/assets/icons/USAFlag.svg`)}
                          alt={t('componentData.dashboard.USAFlag')}
                          style={
                            selectedCurrency === 'USD'
                              ? {
                                  border: `2px solid #fff`,
                                  boxShadow: `0 0 0 2px #002D72`,

                                  borderRadius: '100%',
                                  backgroundPosition: 'center center',
                                }
                              : {
                                  borderRadius: '100%',
                                  backgroundPosition: 'center center',
                                }
                          }
                        />{' '}
                        <h3>
                          {selectedView === 'Amount' ? (
                            <Box
                              ml={1}
                              mr={5}
                              fontWeight='normal'
                              fontFamily='Interstate'
                              fontSize={16}
                              style={
                                selectedCurrency === 'USD'
                                  ? {
                                      color: '#002D72',
                                      fontWeight: 600,
                                    }
                                  : {}
                              }
                            >
                              {t('componentData.dashboard.USD')}
                              {usBankData?.totalAmount
                                ? ` ${formatter.format(usBankData.totalAmount)}`
                                : ` $0`}
                            </Box>
                          ) : (
                            <Box
                              ml={1}
                              mr={4}
                              fontWeight={500}
                              fontSize={16}
                              fontFamily='Interstate'
                              style={
                                selectedCurrency === 'USD'
                                  ? {
                                      color: '#002D72',
                                      fontWeight: 600,
                                    }
                                  : {}
                              }
                            >
                              {t('componentData.dashboard.USD')}{' '}
                              {usBankData?.totalPayments || 0}{' '}
                              {t('componentData.dashboard.PaymentsTxt')}
                            </Box>
                          )}
                        </h3>
                      </span>
                    </Box>
                    <Box my={2}>
                      <span>
                        {selectedView === 'Payment' ? (
                          <Box
                            mx={6}
                            fontWeight='normal'
                            style={{ color: '#4C4C4C', fontSize: '12px' }}
                          >
                            {selectedCurrency}{' '}
                            <span style={{ color: '#282828', fontWeight: 600 }}>
                              ${' '}
                              {selectedCurrency === 'USD'
                                ? usBankData?.totalAmount
                                : usBankData?.totalPayments}
                            </span>
                          </Box>
                        ) : (
                          <Box
                            mx={6}
                            fontWeight='normal'
                            style={{ color: '#4C4C4C', fontSize: '12px' }}
                          >
                            {t('componentData.dashboard.PaymentsTxt')}{' '}
                            <span style={{ color: '#282828', fontWeight: 600 }}>
                              {selectedCurrency === 'USD'
                                ? usBankData?.totalAmount
                                : usBankData?.totalPayments}
                            </span>
                          </Box>
                        )}
                      </span>
                    </Box>
                    {(selectedView === 'Payment' &&
                      !usBankData?.totalPayments) ||
                    (selectedView === 'Amount' && !usBankData?.totalAmount) ||
                    !paymentsData ||
                    !Object.keys(paymentsData).length ? (
                      <Box display='block' textAlign='center' width={1} my={6}>
                        <Box
                          py={3}
                          color='#A1A1A1'
                          fontSize={14}
                          display='block'
                        >
                          <img
                            src={require('~/assets/images/nodata.svg')}
                            alt=''
                          />

                          <Box
                            py={3}
                            color='#A1A1A1'
                            fontSize={14}
                            display='block'
                          >
                            {t('componentData.dashboard.noDataToShow')}
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box className={classes.lineChartBox}>
                        <Line
                          id={'paymentsChart'}
                          width={794}
                          height={340}
                          data={this.state.paymentsData}
                          options={this.state.lineChartOptions}
                          redraW={true}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box pb={2} mt={2} display='flex' justifyContent='center'>
                    <span
                      className={classes.tabContainer}
                      style={
                        this.props.i18n.language === 'fr' ? { width: 360 } : {}
                      }
                    >
                      <span
                        onClick={() =>
                          this.setState({ selectedView: 'Payment' }, () =>
                            this.preparePaymentsData()
                          )
                        }
                        className={classes.tab}
                        style={
                          selectedView === 'Payment'
                            ? {
                                color: 'white',
                                background: '#008CE6',
                              }
                            : {}
                        }
                      >
                        {t('componentData.dashboard.NoOfPayments')}
                      </span>
                      <span
                        className={classes.tab}
                        style={
                          selectedView === 'Amount'
                            ? {
                                color: 'white',
                                background: '#008CE6',
                              }
                            : {}
                        }
                        onClick={() =>
                          this.setState({ selectedView: 'Amount' }, () =>
                            this.preparePaymentsData()
                          )
                        }
                      >
                        {t('componentData.dashboard.Amount')}
                      </span>
                    </span>
                  </Box>
                </Paper>
              </Box>
              <Box my={4}>
                <Paper elevation={0}>
                  <Box py={3} px={4} className={classes.graphSec}>
                    <Box className={classes.graphHead}>
                      <h1 className={classes.headingNew}>
                        {t('componentData.dashboard.ContactedPayees')}
                      </h1>
                    </Box>

                    <Grid container>
                      <Box width='100%'>
                        <span className={classes.dot}> </span>
                        <span
                          style={{
                            color: '#4C4C4C',
                            fontSize: 16,
                            fontWeight: 500,
                          }}
                        >
                          {t('componentData.dashboard.paymentPreferedShared')}
                        </span>
                        <h1 className={classes.textNum}>{totalPaymentCount}</h1>
                      </Box>
                      <Box
                        display='flex'
                        width={1}
                        mt={3}
                        justifyContent='flex-end'
                      >
                        <Grid container>
                          <Grid item xs={12}>
                            <Box>
                              {Boolean(Number(totalPaymentCount)) ? (
                                <Box className={classes.B2CEnrollDoughnutChrt}>
                                  <Bar
                                    height={350}
                                    data={enrolledPayeesBarChartData}
                                    options={barChartOptions}
                                  />
                                </Box>
                              ) : (
                                <Box
                                  display='block'
                                  textAlign='center'
                                  width={1}
                                  my={6}
                                >
                                  <img
                                    alt='no-data'
                                    src={require('~/assets/images/nodata.svg')}
                                  />

                                  <Box
                                    py={3}
                                    color='#A1A1A1'
                                    fontSize={14}
                                    display='block'
                                  >
                                    {t('componentData.dashboard.noDataToShow')}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Divider style={{ width: '100%', background: '#8F9EC4' }} />
                    <Grid container>
                      <Grid item xs={12}>
                        <Box className={classes.payeeGraphTitles}>
                          <Typography variant='h3'>
                            {t(
                              'componentData.dashboard.PayeesEnrollmentStatus'
                            )}
                          </Typography>

                          {enrollmentConsumerData?.dates?.length > 0 ? (
                            <>
                              <Typography variant='subtitle2'>
                                {payeeEnrollGraphInfo?.currentPeriodText ?? ''}
                              </Typography>

                              <Box className='viewAllStatus'>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={viewAllStatus}
                                      onChange={(e) => this.handleAllStatus(e)}
                                      name='viewAllStatus'
                                      color='primary'
                                    />
                                  }
                                  label={t(
                                    'componentData.dashboard.ViewAllStatus'
                                  )}
                                />
                              </Box>
                            </>
                          ) : null}
                        </Box>

                        {enrollmentConsumerData?.dates?.length > 0 ? (
                          <Box className={classes.mixedGraph}>
                            <Typography
                              variant='h3'
                              style={{
                                left:
                                  this.props.user.userData.locale === 'en'
                                    ? '-47px'
                                    : '-60px',
                              }}
                            >
                              {t('componentData.dashboard.NumberOfPayees')}
                            </Typography>
                            <Box className='GraphHolder'>
                              <Bar
                                data={mixedGraphData}
                                options={mixedGraphOpt}
                                height={200}
                              />
                            </Box>
                          </Box>
                        ) : (
                          <Box
                            py={3}
                            color='#A1A1A1'
                            fontSize={14}
                            display='block'
                            textAlign='center'
                            mb={4}
                          >
                            <img
                              src={require('~/assets/images/nodata.svg')}
                              alt=''
                            />

                            <Box
                              py={3}
                              color='#A1A1A1'
                              fontSize={14}
                              display='block'
                            >
                              {t('componentData.dashboard.noDataToShow')}
                            </Box>
                          </Box>
                        )}

                        {payeeEnrollGraphInfo?.difference?.length > 0 &&
                          enrollmentConsumerData?.dates?.length > 0 && (
                            <Box className={classes.PayeeDetailBox}>
                              <Box className='box'>
                                <PayeeDetail
                                  data={payeeEnrollGraphInfo?.difference ?? []}
                                />
                              </Box>

                              <Typography variant='h4' className='bottomTxt'>
                                {payeeEnrollGraphInfo?.currentPeriodText &&
                                  payeeEnrollGraphInfo?.previousPeriodText && (
                                    <>
                                      {t('componentData.dashboard.ChangeIn')}{' '}
                                      {payeeEnrollGraphInfo.currentPeriodText}{' '}
                                      {t(
                                        'componentData.dashboard.vsPreviousPeriod'
                                      )}{' '}
                                      ({payeeEnrollGraphInfo.previousPeriodText}
                                      )
                                    </>
                                  )}
                              </Typography>
                            </Box>
                          )}
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
            icon='calendar'
            onConfirm={() => this.setState({ enableDateFilter: false })}
            title={t('componentData.dashboard.DateFilter')}
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
                      quarter: '',
                      lastDays: undefined,
                      resultType: '',
                      currency: '',
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
              this.setState({ modalMessage: '' });
            }}
          />
        )}
      </Grid>
    );
  }
}

export default withTranslation()(
  connect((state) => ({ ...state.user, ...state.campaign }))(
    withStyles(styles)(UsbankGraph)
  )
);
