import React, {Component} from 'react';
import { 
    Typography, 
    withStyles, 
    Box, 
    FormControl,     
    FormControlLabel,
    Radio,
    RadioGroup,    
    Button,     
    Grid,    
    CircularProgress,
    TextField, InputAdornment, IconButton  
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { connect } from "react-redux";
import styles from './style';
import USAFlag from '~/assets/images/USA_flag.svg';
import CADFlag from '~/assets/images/CAD_flag.svg';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Bar, Line } from "react-chartjs-2";
import Notification from "~/components/Notification";
import {
    fetchCCEnrollVendorsList,
    fetchCCEnrollPayersList,
    fetchCCEnrollCampaignsList,
    fetchCCEnrollGraphs
  } from "~/redux/helpers/dashboard";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import moment from "moment";  
import { withTranslation } from "react-i18next";
import { accessRights } from "~/config/accessRights";
import config from "~/config"; 
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
  } from '@material-ui/pickers';

class PayeesEnrollment extends Component{
    constructor(props){
        super(props);        
        this.state={            
            alertType: null,
            alertMsg: null,
            vendorsList: [],
            selectedVendor: null,
            payersList: [],
            selectedPayer: null,
            campaignsList: [],
            selectedCampaign: null,
            dateToggleOpen: false,
            startDate: null,
            endDate: null,
            selectedDate: this.props.t("componentData.dashboard.LastMonth"),
            selectedDateID: 'prevMonth',
            selectedTimePeriod: '1', // 1: Weekly, 2: Monthly, 3: Quarterly
            selectedCurrency: 'USD',
            payeeEnrollBarGraph: [],
            payeeEnrollBarGraphOpt: [],
            selectedPayeeView: "Payees",
            hasBothDateSelected: true,
            payeeEnrollLineGraph: [],
            payeeEnrollLineGraphOpt: [],
            graphAPIData: [],
            isGraphDataAllZero: false,
            isLoading: false,
            selectedDuration: this.props.t("componentData.dashboard.LastMonth"),
            isQuarterRadioDisable: false,
            isMonthRadioDisable: false,
            isWeekRadioDisable: false,
            isFDValid: true,
            FDErrMsg: '',
            isTDValid: true,
            TDErrMsg: '',
            minYear: '2010',
            maxYear: new Date()
        }
    }   
    
    componentDidMount=()=>{
        this.getVendorsList(); 
        this.setDateOnDatePicker();        
    }    

    getVendorsList=()=>{
        const {t} = this.props;

        const allVendor = {
            campaignVendorId: 0,
            campaignVendorName: t("componentData.dashboard.AllVendors")
        }

        fetchCCEnrollVendorsList().then((res) => {            
            if(res.error || res.isError){
                this.setState({
                    alertMsg: res.message || res.title,
                    alertType: "error"
                })
                return false
            }
            this.setState({
                selectedVendor: allVendor,
                vendorsList: [allVendor, ...res?.result?.vendorsList]
            }, ()=> this.getCampaignsList())
        })        
    } 

    getPayersList=()=>{
        const {t} = this.props;

        const allPayers = {
            clientId: 0,
            clientName: t("componentData.dashboard.AllPayers")
        }    

        const {selectedVendor} = this.state;
        fetchCCEnrollPayersList(selectedVendor?.campaignVendorId ?? 0).then((res) => {            
            if(res.error || res.isError){
                this.setState({
                    alertMsg: res.message || res.title,
                    alertType: "error"
                })
                return false
            }      
            this.setState({
                selectedPayer: allPayers,
                payersList: [allPayers, ...res?.result?.payersList]
            }, ()=> this.getCampaignsList())
        })         
    } 

    getCampaignsList=()=>{
        const {t} = this.props;
        const {portalProfileId} = this.props.user.userData

        const allCampaigns = {
            ccCampaignId: 0,
            ccCampaignName: t("componentData.dashboard.AllCampaign")
        }  

        const {selectedVendor} = this.state;

        fetchCCEnrollCampaignsList(selectedVendor?.campaignVendorId ?? 0, portalProfileId).then((res) => {            
            if(res.error || res.isError){
                this.setState({
                    alertMsg: res.message || res.title,
                    alertType: "error"
                })
                return false
            }                  
            this.setState({
                selectedCampaign: allCampaigns,
                campaignsList: [allCampaigns, ...res?.result?.ccCampaignList]
            }, ()=> this.drawEnrollGraphFn())
        })        
    }
  
    renderSnackbar = (type, msg) => {
        return <Notification variant={type} message={msg} handleClose={this.hideAlertMessage} />
    }

    hideAlertMessage = () => {
        this.setState({
            alertMsg: null,
            alertType: null
        })
    }     

    handelDateBoxClick=(e)=>{ 
        if(e.target.tagName !== 'UL'){            
            this.setState({
                selectedDuration: e.target.getAttribute('value') === 'curMonth'
                    ? 'Today'
                    :e.target.getAttribute('value') === 'curYear'
                        ? 'Today'
                        : e.target.getInnerHTML(),
                selectedDate: e.target.getInnerHTML(),
                selectedDateID: e.target.getAttribute('value'),
                isFDValid: true,
                FDErrMsg: '',
                isTDValid: true,
                TDErrMsg: '',
            }, ()=> this.setDateOnDatePicker(e))
        }
    }

    setDateOnDatePicker=(e)=>{
        const {selectedDateID, startDate, endDate} = this.state;
        let fDate = null;
        let lDate= null;

        const date = new Date();
        const y = date.getFullYear(); 
        const m = date.getMonth();        
        
        if(selectedDateID === 'curMonth'){            
            fDate = new Date(y, m, 1);
            lDate = new Date(y, m, date.getDate());
        }
        else if(selectedDateID === 'prevMonth'){            
            fDate = new Date(y, m-1, 1);
            lDate = new Date(y, m, 0);
        }
        else if(selectedDateID === 'curYear'){            
            fDate = new Date(y, 0, 1);
            lDate = new Date(y, m, date.getDate());
        }
        else if(selectedDateID === 'prevYear'){            
            fDate = new Date(y-1, 0, 1);
            lDate = new Date(y-1, 11, 31);
        }
        else{
            fDate = Boolean(startDate) && !Boolean(e) ? startDate : new Date(y, m, date.getDate()-2);
            lDate = Boolean(endDate) && !Boolean(e) ? endDate : new Date(y, m, date.getDate());
        } 

        let daysCount = (lDate - fDate) / (1000 * 60 * 60 * 24);
        daysCount += 1;

        this.setState({
            startDate: fDate,
            endDate: lDate,
            isWeekRadioDisable: false,
            isMonthRadioDisable: daysCount < 30 ? true : false,
            isQuarterRadioDisable: daysCount < 90 ? true : false,
            selectedTimePeriod: daysCount < 30 ? '1' : daysCount >= 90 ? '3' : '2'
        }, ()=> this.addActiveClassOnBtn())
    }

    addActiveClassOnBtn=()=>{
        const {selectedDateID} = this.state;
        const currentClass = document.getElementsByClassName("btn");
        for(let i = 0; i < currentClass.length; i++) {
            currentClass[i].classList.remove("active");
            const val = currentClass[i].getAttribute('value');
            if(val === selectedDateID){
                currentClass[i].classList.add("active");
            }
        }                
    }

    handleDateOnChange=(dates)=>{
        const [start, end] = dates;
        const {t} = this.props;
        this.setState({
            startDate: start,
            endDate: end,
            selectedDateID: 'custom',
            selectedDate: t("componentData.dashboard.custom"),
            selectedDuration: t("componentData.dashboard.custom"),
            isTDValid: true,
            TDErrMsg: '',
            isFDValid: true,
            FDErrMsg: '',
        }, ()=>this.addActiveClassOnBtn())
    } 

    drawEnrollGraphFn=()=>{ 
        this.setState({
            isLoading: true
        }, ()=>{
            const {
                selectedVendor, 
                selectedPayer, 
                selectedCampaign,  
                selectedTimePeriod,          
                selectedCurrency,
                startDate,
                endDate,
                selectedPayeeView
            } = this.state;
            
            const {portalProfileId} = this.props.user.userData;
    
            const payload = {
                vendorId: selectedVendor?.campaignVendorId ?? 0,
                payerId: portalProfileId,
                campaignsId: selectedCampaign?.ccCampaignId ?? 0,
                period: selectedTimePeriod,
                currency: selectedCurrency,
                fromDate: moment(startDate).locale("en").format("YYYY-MM-DD"),
                toDate: moment(endDate).locale("en").format("YYYY-MM-DD"),
                gType: selectedPayeeView === 'Amount' ? 'AMOUNT' : 'NOOFPAYEES'
            }        
    
            fetchCCEnrollGraphs(payload).then((res) => {            
                if(res.error || res.isError){
                    this.setState({
                        alertMsg: res.message || res.title,
                        alertType: "error",
                        isLoading: false
                    })
                    return false
                }
                this.setState({
                    graphAPIData: res?.result ?? []
                }, ()=>{
                    if(selectedTimePeriod === "1"){
                        this.setPayeeEnrollLineGraph();
                    }else{
                        this.setPayeeEnrollBarGraph();
                    }
                })
            }) 
        })                 
    }
    
    setPayeeEnrollBarGraph=()=>{        
        const {selectedPayeeView, graphAPIData, selectedTimePeriod} = this.state;        
        const resData = graphAPIData?.enrollmentOverTimeGraphList ?? [];
        const {t} = this.props;

        let graphlabels = [];
        let graphDataSet = [];
        let isValGreaterZero = false;  

        resData.map((item)=>{
            if(graphlabels.indexOf(item.label) === -1){
                graphlabels.push(item.label)
            }              
            
            isValGreaterZero = Boolean(isValGreaterZero) 
                ? isValGreaterZero 
                : item.dataValue > 0
                    ? true
                    : false;

            let isValAvilable = graphDataSet.findIndex(x => x.id === item.labelId);            
            if(isValAvilable === -1){
                graphDataSet.push({
                    label: item.labelType,
                    data: [Number(item.dataValue.toFixed(0))],
                    backgroundColor: item.labelColorCode,
                    id: item.labelId
                })
            }
            else{
                graphDataSet[isValAvilable].data = [...graphDataSet[isValAvilable].data, Number(item.dataValue.toFixed(0))]
            }
        }) 

        const data = {
            labels: graphlabels,
            datasets: graphDataSet,
        };          

        const options = {
            scales: {
              xAxes: [
                {
                    stacked: true,  
                    barPercentage: 0.4,
                    ticks: {
                        maxRotation: selectedTimePeriod === '2' ? 45 : 0,
                        minRotation: selectedTimePeriod === '2' ? 45 : 0
                    }          
                },
              ],
              yAxes: [
                {
                  stacked: true,  
                  ticks: {
                    beginAtZero: true,  
                    precision: 0, 
                    callback: function(value, index, values) {
                        if(selectedPayeeView === "Amount"){
                            const valInK = Boolean(value) ? Number(value/1000).toFixed(0) : 0; 
                            if(parseInt(valInK) >= 1000){                            
                                return '$' + valInK.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"K";
                            } else {
                                return '$' + valInK +"K";
                            }
                        }  
                        else{
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }                      
                    }                                           
                  },
                  scaleLabel: {
                    display: true,
                    labelString: selectedPayeeView === 'Amount' ? t("componentData.dashboard.AmountInDollars") : t("componentData.dashboard.NoOfPayees")
                  }          
                },
              ],
            },
            interaction: {
              mode: 'point',
              intersect: false,
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
                itemSort: function(a, b) {                   
                    //return b.value - a.value;
                },
                callbacks: {
                    label: function (tooltipItem, data) {
                      let dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
                      let currObject = data && data["datasets"][dataSetIndex];
                      if(selectedPayeeView === "Amount"){
                        return (
                            tooltipItem &&
                            `${currObject && currObject["label"]} - $${tooltipItem["value"]
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                          );
                      }
                      else{
                        return (
                            tooltipItem &&
                            `${currObject && currObject["label"]} - ${tooltipItem["value"]
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                          );
                      }                      
                    },
                }        
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
              },
              title: {
                padding: 6,
              },                              
            },
            responsive: true,        
        }; 
      
        this.setState({
            payeeEnrollBarGraph: data,
            payeeEnrollBarGraphOpt: options,
            isGraphDataAllZero: Boolean(isValGreaterZero) ? false : true,
            isLoading: false
        });
    }

    handleTabClick=(val)=>{
        this.setState({
            selectedPayeeView: val
        }, ()=> {
            this.drawEnrollGraphFn();            
        })
    }   
    
    handlePopupDateSubmit=()=>{
        const {startDate, endDate} = this.state;
        if(Boolean(startDate) && Boolean(endDate)){
            let daysCount = (endDate - startDate) / (1000 * 60 * 60 * 24);
            daysCount += 1;
            this.setState({
                dateToggleOpen: false,
                hasBothDateSelected: true,
                isWeekRadioDisable: false,
                isMonthRadioDisable: daysCount < 30 ? true : false,
                isQuarterRadioDisable: daysCount < 90 ? true : false,
                selectedTimePeriod: daysCount < 30 ? '1' : daysCount >= 90 ? '3' : '2',
                isTDValid: true,
                TDErrMsg: '',
                isFDValid: true,
                FDErrMsg: ''
            }, ()=> this.drawEnrollGraphFn())
        }
        else{
            this.setState({
                hasBothDateSelected: false
            })
        }
    }

    setPayeeEnrollLineGraph=()=>{ 
        const {selectedPayeeView, graphAPIData} = this.state;        
        const resData = graphAPIData?.enrollmentOverTimeGraphList ?? [];
        const {t} = this.props;

        let graphlabels = [];
        let graphDataSet = [];
        let isValGreaterZero = false;  

        resData.map((item)=>{
            if(graphlabels.indexOf(item.label) === -1){
                graphlabels.push(item.label)
            }              
            
            isValGreaterZero = Boolean(isValGreaterZero) 
                ? isValGreaterZero 
                : item.dataValue > 0
                    ? true
                    : false;

            let isValAvilable = graphDataSet.findIndex(x => x.id === item.labelId);            
            if(isValAvilable === -1){
                graphDataSet.push({
                    label: item.labelType,
                    data: [Number(item.dataValue.toFixed(0))],
                    backgroundColor: item.labelColorCode,
                    id: item.labelId,
                    borderColor: item.labelColorCode,
                    fill: false,
                    tension: 0,
                    borderWidth: 2, 
                    pointRadius: 2,
                    steppedLine: false,
                })
            }
            else{
                graphDataSet[isValAvilable].data = [...graphDataSet[isValAvilable].data, Number(item.dataValue.toFixed(0))]
            }
        })         

        const data = {
            labels: graphlabels,
            datasets: graphDataSet,
        };          

        const options = {            
            scales: {
              xAxes: [
                {
                  stacked: false, 
                  ticks: {
                    maxTicksLimit: 6
                  }           
                },
              ],
              yAxes: [
                {
                  stacked: false,  
                  ticks: {
                    beginAtZero: true,  
                    precision: 0,  
                    callback: function(value, index, values) {
                        if(selectedPayeeView === "Amount"){
                            const valInK = Boolean(value) ? Number(value/1000).toFixed(0) : 0; 
                            if(parseInt(valInK) >= 1000){                            
                                return '$' + valInK.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"K";
                            } else {
                                return '$' + valInK +"K";
                            }
                        }  
                        else{
                            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }                      
                    }                                          
                  },
                  scaleLabel: {
                    display: true,
                    labelString: selectedPayeeView === 'Amount' ? t("componentData.dashboard.AmountInDollars") : t("componentData.dashboard.NoOfPayees")
                  }          
                },
              ],
            },
            interaction: {
              mode: 'point',
              intersect: false,
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
                itemSort: function(a, b) {                   
                    //return b.value - a.value;
                },
                callbacks: {
                    label: function (tooltipItem, data) {
                      let dataSetIndex = tooltipItem && tooltipItem["datasetIndex"];
                      let currObject = data && data["datasets"][dataSetIndex];
                      if(selectedPayeeView === "Amount"){
                        return (
                            tooltipItem &&
                            `${currObject && currObject["label"]} - $${tooltipItem["value"]
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                          );
                      }
                      else{
                        return (
                            tooltipItem &&
                            `${currObject && currObject["label"]} - ${tooltipItem["value"]
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                          );
                      }                      
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
              },
              title: {
                padding: 6,
              },                              
            },
            responsive: true,        
        }; 
      
        this.setState({
            payeeEnrollLineGraph: data,
            payeeEnrollLineGraphOpt: options,
            isGraphDataAllZero: Boolean(isValGreaterZero) ? false : true,
            isLoading: false
        });
    }

    currencyFormateFn=(val)=> val.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    getPercentage=(cVal, TVal)=> {
        if(Number(cVal) > 0 && Number(TVal) > 0){
            return (cVal/TVal*100).toFixed(2)
        }
        else{
            return 0
        }        
    };

    currencyFormateFnInK=(val)=>{
        if(Number(val) < 1000){
            return val
        }
        let newVal = val/1000;
        newVal = newVal.toFixed(0);
        return newVal.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"K"
    }

    handleDrillDown=(key)=>{  
        const {user} = this.props;
        const {
            selectedVendor, 
            selectedPayer, 
            selectedCampaign, 
            startDate, 
            endDate, 
            selectedCurrency,selectedDateID
        } = this.state;    

        const isMySupplierEnabled = (user.userRoles && user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_VIEW"])) || false;

        if(!isMySupplierEnabled){
            return false
        }
        this.props.history.push({
            pathname: `${config.baseName}/suppliers/mySupplier`,
            state: {              
                key: key,
                vendor: selectedVendor?.campaignVendorId ?? "",
                payer: selectedPayer?.clientId ?? "",
                campaign: selectedCampaign?.ccCampaignId ?? "",
                startDate: startDate,
                endDate: endDate,
                currencyCode: selectedCurrency,
                selectedDateID:selectedDateID
            }
        });
    }

    handleFromDate=(date)=>{
        const {minYear, maxYear, endDate} = this.state;
        const isValid = moment(date).isValid();
        const year = moment(date).year();
        var isAfter = moment(date).isAfter(endDate); 
        var isSame = moment(date).isSame(endDate);
        var isFutureDate = moment(date).isAfter(maxYear); 
        const {t} = this.props;

        if(isValid && year >= minYear && !isFutureDate && !isAfter && !isSame){
            this.setState({
                startDate: date,
                isFDValid: true,
                FDErrMsg: '',
                isTDValid: true,
                TDErrMsg: '',
                selectedDateID: 'custom',
                selectedDate: t("componentData.dashboard.custom"),
                selectedDuration: t("componentData.dashboard.custom")
            }, ()=> this.addActiveClassOnBtn())
        }
        else if(!isValid){
            this.setState({
                isFDValid: false,
                FDErrMsg: t("componentData.dashboard.validDate")
            })
        }
        else if(year < minYear){
            this.setState({
                isFDValid: false,
                FDErrMsg: `${t("componentData.dashboard.beforeTxt")} ${minYear}`
            })
        }
        else if(isFutureDate){
            this.setState({
                isFDValid: false,
                FDErrMsg: `${t("componentData.dashboard.greaterThanTxt1")} ${moment(maxYear).locale(this?.props?.user?.userData?.locale ?? "en").format("DD/MM/YYYY")}`
            })
        }
        else if(isAfter){
            this.setState({
                isFDValid: false,
                FDErrMsg: t("componentData.dashboard.lessThanTxt1")
            })
        }
        else if(isSame){
            this.setState({
                isFDValid: false,
                FDErrMsg: t("componentData.dashboard.lessThanTxt1")
            })
        }
    }

    handleToDate=(date)=>{
        const {minYear, maxYear, startDate} = this.state;
        const isValid = moment(date).isValid();
        const year = moment(date).year();
        var isAfter = moment(date).isAfter(startDate); 
        var isSame = moment(date).isSame(startDate);  
        var isFutureDate = moment(date).isAfter(maxYear);  
        const {t} = this.props;    

        if(isValid && year >= minYear && !isFutureDate && isAfter && !isSame){
            this.setState({
                endDate: date,
                isTDValid: true,
                TDErrMsg: '',
                isFDValid: true,
                FDErrMsg: '',
                selectedDateID: 'custom',
                selectedDate: t("componentData.dashboard.custom"),
                selectedDuration: t("componentData.dashboard.custom")
            }, ()=> this.addActiveClassOnBtn())
        }
        else if(!isValid){
            this.setState({
                isTDValid: false,
                TDErrMsg: t("componentData.dashboard.validDate")
            })
        }
        else if(year < minYear){
            this.setState({
                isTDValid: false,
                TDErrMsg: `${t("componentData.dashboard.beforeTxt")} ${minYear}`
            })
        }
        else if(isFutureDate){
            this.setState({
                isTDValid: false,
                TDErrMsg: `${t("componentData.dashboard.greaterThanTxt2")} ${moment(maxYear).locale(this?.props?.user?.userData?.locale ?? "en").format("DD/MM/YYYY")}`
            })
        }
        else if(!isAfter){
            this.setState({
                isTDValid: false,
                TDErrMsg: t("componentData.dashboard.greaterThanTxt3")
            })
        }
        else if(isSame){
            this.setState({
                isTDValid: false,
                TDErrMsg: t("componentData.dashboard.greaterThanTxt3")
            })
        }
    }
       

    render(){
        const {classes, t, user} = this.props;
        const {alertType,  alertMsg, vendorsList, selectedVendor, 
            selectedPayer, payersList, campaignsList, selectedCampaign,
            dateToggleOpen, selectedDate, startDate, endDate, selectedCurrency, selectedTimePeriod,
            payeeEnrollBarGraph, payeeEnrollBarGraphOpt, selectedPayeeView, hasBothDateSelected, payeeEnrollLineGraph, payeeEnrollLineGraphOpt, isGraphDataAllZero, isLoading, graphAPIData, selectedDuration, isQuarterRadioDisable,
            isMonthRadioDisable,
            isWeekRadioDisable, isFDValid,
            FDErrMsg,
            isTDValid,
            TDErrMsg,
            minYear
        } = this.state; 

        const leftPanelData = graphAPIData?.enrollmentOverTimeReportDataList ?? {};
        const isMySupplierEnabled = (user.userRoles && user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_VIEW"])) || false;
                
        return(
            <>   
                <Box className={classes.payeeEnrollBox}>
                    <Box 
                        className={classes.topFilterBox}
                        style={{pointerEvents: Boolean(dateToggleOpen) ? 'none' : Boolean(isLoading) ? 'none' : 'auto'}}
                    >
                        <Box className='leftFilter'>
                            <Typography variant='h2'>
                                {t("componentData.dashboard.PayeesEnrollmentOT")}
                            </Typography>
                            <Typography variant='h4'>
                               { `${selectedVendor?.campaignVendorName ?? ''} |  ${selectedCampaign?.ccCampaignName ?? ''}`}
                            </Typography>
                        </Box>

                        <Box className={classes.payeeEnrollHead}>
                            <Autocomplete
                                id="vendorsList"
                                className='dropdownBox'
                                size="small"                                
                                options={vendorsList}
                                getOptionLabel={(option) => option?.campaignVendorName ?? ''}
                                style={{ width: 200, cursor: 'pointer' }}
                                renderInput={(params) => <TextField {...params} label={t("componentData.dashboard.Vendor")} variant="outlined" />}
                                value={selectedVendor}
                                onChange={(e, val)=>{                
                                    if(val === null){
                                        this.setState({
                                            selectedVendor: {
                                                campaignVendorId: 0,
                                                campaignVendorName: t("componentData.dashboard.AllVendors")
                                            }
                                        }, ()=> this.getCampaignsList())
                                    }
                                    else{
                                        this.setState({
                                            selectedVendor: val
                                        }, ()=> this.getCampaignsList())
                                    }                                    
                                }}                                   
                                autoSelect={true}                            
                            />

                            {/* <Autocomplete
                                id="payersList"
                                className='dropdownBox'
                                size="small"                                
                                options={payersList}
                                getOptionLabel={(option) => option?.clientName ?? ''}
                                style={{ width: 200, cursor: 'pointer' }}
                                renderInput={(params) => <TextField {...params} label={t("componentData.dashboard.Payer")} variant="outlined" />}
                                value={selectedPayer}
                                onChange={(e, val)=>{
                                    if(val === null){
                                        this.setState({
                                            selectedPayer: {
                                                clientId: 0,
                                                clientName: t("componentData.dashboard.AllPayers")
                                            }        
                                        }, ()=> this.getCampaignsList())
                                    }
                                    else{
                                        this.setState({
                                            selectedPayer: val
                                        }, ()=> this.getCampaignsList())
                                    }                                    
                                }}                                   
                                autoSelect={true}                            
                            /> */}

                            <Box className='dropdownBox'>
                                <label
                                    style={{
                                        float: 'left',
                                        width: '1px',
                                        height: '35px',
                                        background: '#9E9E9E',
                                        marginTop: 2
                                    }}
                                >
                                </label>
                            </Box>

                            <Autocomplete
                                id="campaignsList"
                                className='dropdownBox'
                                size="small"                                
                                options={campaignsList}
                                getOptionLabel={(option) => option?.ccCampaignName ?? ''}
                                style={{ width: 200, cursor: 'pointer' }}
                                renderInput={(params) => <TextField {...params} label={t("componentData.dashboard.Campaign")} variant="outlined" />}
                                value={selectedCampaign}
                                onChange={(e, val)=>{
                                    if(val === null){
                                        this.setState({
                                            selectedCampaign: {
                                                ccCampaignId: 0,
                                                ccCampaignName: t("componentData.dashboard.AllCampaign")
                                            }        
                                        }, ()=> this.drawEnrollGraphFn())
                                    }
                                    else{
                                        this.setState({
                                            selectedCampaign: val
                                        }, ()=> this.drawEnrollGraphFn())
                                    }                                    
                                }}                                   
                                autoSelect={true}                            
                            />

                        </Box>
                    </Box> 

                    <Box className={classes.enrollMidSec} my={2}>
                        <Box className='DateBox'>
                            <Box className='DateBoxTop'>
                                <TextField 
                                    id="dateRangeBox" 
                                    placeholder= {t("componentData.dashboard.Date")}
                                    variant="outlined"  
                                    size="small"    
                                    autoComplete="off"
                                    style={{ width: 140}}  
                                    value={selectedDate}                                    
                                    onFocus={()=>this.setState({dateToggleOpen: true}, ()=>this.setDateOnDatePicker())}
                                    InputProps={{
                                        readOnly: true,
                                        endAdornment: (
                                        <InputAdornment>
                                            <IconButton className='dateIcon'>
                                                <ArrowDropDownIcon 
                                                    size="small" 
                                                    onClick={()=>this.setState({dateToggleOpen: true})}
                                                />
                                            </IconButton>
                                        </InputAdornment>
                                        )
                                    }}
                                />  

                                <span className='selectedDate'>
                                    {Boolean(startDate) && Boolean(endDate) 
                                        ? `${moment(startDate).locale(this?.props?.user?.userData?.locale ?? "en").format("DD/MM/YYYY")} - ${moment(endDate).locale(this?.props?.user?.userData?.locale ?? "en").format("DD/MM/YYYY")} (${selectedDuration})`
                                        : null
                                    }                                    
                                </span>  
                            </Box> 

                            {Boolean(dateToggleOpen) && (
                                <Box className={"datePickerBox"}>
                                    <div className="arrowUp"><ArrowDropUpIcon /></div>
                                    <ul onClick={(e)=>this.handelDateBoxClick(e)}>
                                        <li value="curMonth" className='btn'>
                                            {t("componentData.dashboard.ThisMonth")}
                                        </li>
                                        <li value="prevMonth" className='btn'>
                                            {t("componentData.dashboard.LastMonth")}
                                        </li>
                                        <li value="curYear" className='btn'>
                                            {t("componentData.dashboard.ThisYear")}
                                        </li>
                                        <li value="prevYear" className='btn'>
                                            {t("componentData.dashboard.LastYear")}
                                        </li>
                                        <li value="custom" className='btn'>
                                            {t("componentData.dashboard.custom")}
                                        </li>
                                    </ul>
                                    <Box 
                                        component={'div'}  
                                        className="datePicker"                                      
                                    >
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <Grid container justifyContent="space-around">
                                                        <KeyboardDatePicker
                                                            disableToolbar={true}
                                                            variant="inline"
                                                            inputVariant="outlined"
                                                            size="small"
                                                            format="dd/MM/yyyy"
                                                            margin="normal"
                                                            id="FromDate"
                                                            label={t("componentData.dashboard.FromDate")}
                                                            value={startDate}
                                                            placeholder='dd/mm/yyyy'
                                                            InputLabelProps={{shrink: true}}
                                                            onChange={this.handleFromDate}
                                                            className={classes.dateInputBox}
                                                            keyboardIcon={""}                  
                                                            error={!isFDValid} 
                                                            helperText={FDErrMsg}
                                                        />
                                                    </Grid>
                                                </MuiPickersUtilsProvider>
                                            </Grid>

                                            <Grid item xs={6}>
                                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                    <Grid container justifyContent="space-around">
                                                        <KeyboardDatePicker
                                                            disableToolbar={true}
                                                            variant="inline"
                                                            inputVariant="outlined"
                                                            size="small"
                                                            format="dd/MM/yyyy"
                                                            margin="normal"
                                                            id="ToDate"
                                                            label={t("componentData.dashboard.ToDate")}
                                                            value={endDate}
                                                            placeholder='dd/mm/yyyy'
                                                            InputLabelProps={{shrink: true}}
                                                            onChange={this.handleToDate}
                                                            className={classes.dateInputBox}
                                                            keyboardIcon={""}
                                                            error={!isTDValid} 
                                                            helperText={TDErrMsg}
                                                        />
                                                    </Grid>
                                                </MuiPickersUtilsProvider>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <DatePicker
                                                    selected={startDate}
                                                    startDate={startDate}
                                                    endDate={endDate}
                                                    selectsRange={true}
                                                    inline={true}
                                                    monthsShown={2}
                                                    locale={'en'}
                                                    minDate={new Date(`01-01-${minYear}`)}
                                                    maxDate={new Date()}
                                                    showDisabledMonthNavigation={true}
                                                    formatWeekDay={nameOfDay => nameOfDay?.substring(0,1)}
                                                    onChange={(dates)=>this.handleDateOnChange(dates)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Box
                                        component={'div'}
                                        style={{
                                            float: 'left',
                                            width: '100%',
                                            borderTop:'1px solid #9E9E9E',
                                            padding: '8px 0 0'
                                        }}
                                    >     
                                        {!Boolean(hasBothDateSelected) && (
                                            <Typography 
                                                variant='h2'
                                                style={{
                                                    float: 'left',
                                                    margin: '9px 0 0',
                                                    fontSize: '14px',
                                                    color: '#E03617',
                                                    fontWeight: '300',
                                                }}
                                            >
                                                {t("componentData.dashboard.selectDateBoth")}
                                            </Typography>
                                        )}  

                                        <Box
                                            component={"div"}
                                            style={{float: 'right'}}
                                        >
                                            <Button 
                                                variant="contained" 
                                                color="primary"
                                                style={{
                                                    float: 'left',
                                                    width: '110px',
                                                }}
                                                disabled={!isTDValid || !isFDValid}
                                                onClick={()=>this.handlePopupDateSubmit()}
                                            >
                                                {t("componentData.dashboard.Done")}
                                            </Button> 

                                        </Box>
                                    </Box>                                    
                                </Box> 
                            )}                              
                        </Box> 

                        <Box 
                            component={'div'} 
                            className={classes.timePeriodBox}
                            style={{pointerEvents: Boolean(dateToggleOpen) ? 'none' : 'auto'}}
                        >
                            <FormControl component="fieldset">                                
                                <RadioGroup 
                                    aria-label="timePeriod" 
                                    name="timePeriod" 
                                    value={selectedTimePeriod} 
                                    onChange={(e)=>this.setState({selectedTimePeriod: e.currentTarget.value}, ()=> this.drawEnrollGraphFn())}
                                >
                                    <FormControlLabel 
                                        value="1" 
                                        control={<Radio />} 
                                        label={t("componentData.dashboard.Weekly")}
                                        disabled={isWeekRadioDisable} 
                                    />
                                    <FormControlLabel 
                                        value="2" 
                                        control={<Radio />} 
                                        label={t("componentData.dashboard.Monthly")}
                                        disabled={isMonthRadioDisable}
                                    />
                                    <FormControlLabel 
                                        value="3" 
                                        control={<Radio />} 
                                        label={t("componentData.dashboard.Quarterly")}
                                        disabled={isQuarterRadioDisable}
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Box>                                              
                    </Box>

                    <Grid 
                        container                         
                        className={classes.payeeEnrollGraphBox}
                    >
                        <Grid 
                            item 
                            xs={4}
                            style={{borderRight: '1px solid rgb(130, 130, 130)'}}
                        >
                            <Box 
                                component={'div'} 
                                className={classes.coutrySeclectionBox}
                            >
                                {leftPanelData?.usdAmount > 0 && (
                                    <Box                                     
                                        className="countryBox"
                                        onClick={(e)=>this.setState({selectedCurrency: 'USD'}, ()=> this.drawEnrollGraphFn())}
                                        active={selectedCurrency === 'USD' ? 'true' : null}
                                    >
                                        <img src={USAFlag} alt="USD" />
                                        <Typography 
                                            variant='h4'
                                            title={`USD $${this.currencyFormateFn(leftPanelData?.usdAmount ?? 0)}`}
                                        >
                                            USD ${this.currencyFormateFnInK(leftPanelData?.usdAmount ?? 0)} 
                                        </Typography>                                
                                    </Box>
                                )}
                                
                                {leftPanelData?.cadAmount > 0 && (
                                    <Box                                     
                                        className="countryBox"
                                        onClick={(e)=>this.setState({selectedCurrency: 'CAD'}, ()=> this.drawEnrollGraphFn())}
                                        active={selectedCurrency === 'CAD' ? 'true' : null}
                                    >
                                        <img src={CADFlag} alt="CAD" /> 
                                        <Typography 
                                            variant='h4'
                                            title={`CAD $${this.currencyFormateFn(leftPanelData?.cadAmount ?? 0)}`}
                                        >
                                            CAD ${this.currencyFormateFnInK(leftPanelData?.cadAmount ?? 0)} 
                                        </Typography>           
                                    </Box>
                                )}    
                                
                            </Box>
                            
                            <Box 
                                component={'div'}
                                className={classes.filterInfo}                                
                            >
                                <ul>
                                    <li>
                                        <Typography variant='h3'>
                                            {t("componentData.dashboard.TotalPayees")}
                                        </Typography>
                                        <Typography variant='h2'>
                                            {this.currencyFormateFn(leftPanelData?.totalPayees ?? 0)}
                                        </Typography>
                                    </li>

                                    <li className='underline'>
                                        <Typography 
                                            variant='h3'
                                            onClick={()=>this.handleDrillDown('enrolled')}
                                            style={{
                                                textDecoration: Boolean(isMySupplierEnabled) && Number(leftPanelData?.enrolledPayees ?? 0) > 0
                                                    ? 'underline' 
                                                    : 'none',
                                                pointerEvents: Boolean(isMySupplierEnabled) && Number(leftPanelData?.enrolledPayees ?? 0) > 0
                                                    ? 'auto' 
                                                    : 'none'
                                            }}
                                        >
                                            {t("componentData.dashboard.EnrolledPayees")}
                                        </Typography>
                                        <Typography variant='h2'>
                                            {this.currencyFormateFn(leftPanelData?.enrolledPayees ?? 0)}
                                            {" "}
                                            <label>({this.getPercentage(leftPanelData?.enrolledPayees ?? 0, leftPanelData?.totalPayees ?? 0)}%)</label>
                                        </Typography>
                                    </li>

                                    <li className='underline'>
                                        <Typography 
                                            variant='h3'
                                            onClick={()=>this.handleDrillDown('pending')}
                                            style={{
                                                textDecoration: Boolean(isMySupplierEnabled) && Number(leftPanelData?.pendingPayees ?? 0) > 0
                                                    ? 'underline' 
                                                    : 'none',
                                                pointerEvents: Boolean(isMySupplierEnabled) && Number(leftPanelData?.pendingPayees ?? 0) > 0
                                                    ? 'auto' 
                                                    : 'none'
                                            }}
                                        >
                                            {t("componentData.dashboard.PendingPayees")}
                                        </Typography>
                                        <Typography variant='h2'>
                                            {this.currencyFormateFn(leftPanelData?.pendingPayees ?? 0)}
                                            {" "}
                                            <label>({this.getPercentage(leftPanelData?.pendingPayees ?? 0, leftPanelData?.totalPayees ?? 0)}%)</label>
                                        </Typography>
                                    </li>

                                    <li className='underline'>
                                        <Typography 
                                            variant='h3'
                                            onClick={()=>this.handleDrillDown('declined')}
                                            style={{
                                                textDecoration: Boolean(isMySupplierEnabled) && Number(leftPanelData?.declinedPayees ?? 0) > 0
                                                    ? 'underline' 
                                                    : 'none',
                                                pointerEvents: Boolean(isMySupplierEnabled) && Number(leftPanelData?.declinedPayees ?? 0) > 0
                                                    ? 'auto' 
                                                    : 'none'
                                            }}
                                        >
                                            {t("componentData.dashboard.DeclinedPayees")}
                                        </Typography>
                                        <Typography variant='h2'>
                                            {this.currencyFormateFn(leftPanelData?.declinedPayees ?? 0)}
                                            {" "}
                                            <label>({this.getPercentage(leftPanelData?.declinedPayees ?? 0, leftPanelData?.totalPayees ?? 0)}%)</label>
                                        </Typography>
                                    </li>

                                    <li>
                                        <Typography variant='h3'>
                                            {t("componentData.dashboard.PotentialSpend")} <br/>({t("componentData.dashboard.TotalPayees")})
                                        </Typography>
                                        <Typography variant='h2'>
                                            ${this.currencyFormateFnInK(leftPanelData?.poTentialSpendTotalPayees ?? 0)}
                                        </Typography>
                                    </li>

                                    <li className='underline'>
                                        <Typography 
                                            variant='h3'
                                            onClick={()=>this.handleDrillDown('enrolled')}
                                            style={{
                                                textDecoration: Boolean(isMySupplierEnabled) && Number(leftPanelData?.committedSpendEnrolledPayees ?? 0) > 0
                                                    ? 'underline' 
                                                    : 'none',
                                                pointerEvents: Boolean(isMySupplierEnabled) && Number(leftPanelData?.committedSpendEnrolledPayees ?? 0) > 0
                                                    ? 'auto' 
                                                    : 'none'
                                            }}
                                        >
                                            {t("componentData.dashboard.CommittedSpend")} <br/>({t("componentData.dashboard.EnrolledPayees")})
                                        </Typography>
                                        <Typography variant='h2'>
                                            ${this.currencyFormateFnInK(leftPanelData?.committedSpendEnrolledPayees ?? 0)}
                                            {" "}
                                            <label>({this.getPercentage(leftPanelData?.committedSpendEnrolledPayees ?? 0, leftPanelData?.poTentialSpendTotalPayees ?? 0)}%) </label>
                                        </Typography>
                                    </li>

                                    <li className='underline'>
                                        <Typography 
                                            variant='h3'
                                            onClick={()=>this.handleDrillDown('pending')}
                                            style={{
                                                textDecoration: Boolean(isMySupplierEnabled) && Number(leftPanelData?.poTentialSpendPendingPayees ?? 0) > 0
                                                    ? 'underline' 
                                                    : 'none',
                                                pointerEvents: Boolean(isMySupplierEnabled) && Number(leftPanelData?.poTentialSpendPendingPayees ?? 0) > 0
                                                    ? 'auto' 
                                                    : 'none'
                                            }}
                                        >
                                            {t("componentData.dashboard.PotentialSpend")} <br/>({t("componentData.dashboard.PendingPayees")})
                                        </Typography>
                                        <Typography variant='h2'>
                                            ${this.currencyFormateFnInK(leftPanelData?.poTentialSpendPendingPayees ?? 0)}
                                            {" "}
                                            <label>({this.getPercentage(leftPanelData?.poTentialSpendPendingPayees ?? 0, leftPanelData?.poTentialSpendTotalPayees ?? 0)}%) </label>
                                        </Typography>
                                    </li>

                                    <li className='underline'>
                                        <Typography 
                                            variant='h3'
                                            onClick={()=>this.handleDrillDown('declined')}
                                            style={{
                                                textDecoration: Boolean(isMySupplierEnabled) && Number(leftPanelData?.lostSpendDeclinedPayees ?? 0) > 0
                                                    ? 'underline' 
                                                    : 'none',
                                                pointerEvents: Boolean(isMySupplierEnabled) && Number(leftPanelData?.lostSpendDeclinedPayees ?? 0) > 0
                                                    ? 'auto' 
                                                    : 'none'
                                            }}
                                        >
                                            {t("componentData.dashboard.LostSpend")} <br/>({t("componentData.dashboard.DeclinedPayees")})
                                        </Typography>
                                        <Typography variant='h2'>
                                            ${this.currencyFormateFnInK(leftPanelData?.lostSpendDeclinedPayees ?? 0)}
                                            {" "}
                                            <label>({this.getPercentage(leftPanelData?.lostSpendDeclinedPayees ?? 0, leftPanelData?.poTentialSpendTotalPayees ?? 0)}%) </label>
                                        </Typography>
                                    </li>

                                </ul>
                            </Box>

                            <Box className={classes.updatedTimeTxt}>
                                {t("componentData.dashboard.UpdatedAt")} {moment(leftPanelData?.lastUpdatedTime).locale(this?.props?.user?.userData?.locale ?? "en").format('Do MMMM YYYY, h:mm:ss A')} EST
                            </Box>
                            
                        </Grid>

                        <Grid item xs={8}>
                            <Box 
                                component={'div'}
                                className={classes.payeeGraphArea}
                            >
                                {Boolean(isLoading) 
                                    ? <>
                                        <Box 
                                            style={{
                                                margin: '100px auto',
                                                float: 'left',
                                                width: '100%',
                                                textAlign: 'center',
                                            }}>
                                            <CircularProgress />
                                        </Box>
                                    </>
                                    : <>
                                        {selectedTimePeriod === "1"
                                            ? <>
                                                {!Boolean(isGraphDataAllZero) && Object.keys(payeeEnrollLineGraph).length > 0
                                                    ? <>
                                                        <Line
                                                            data={payeeEnrollLineGraph}           
                                                            options={payeeEnrollLineGraphOpt} 
                                                            id="spendAnalysisGraph"
                                                        />
                                                    </>
                                                    : <>
                                                        <Box                            
                                                            textAlign="center"
                                                            width={1}
                                                            mt={15}
                                                            style={{float: 'left'}}
                                                        >
                                                            <img
                                                                alt="no-data"
                                                                src={require("~/assets/images/nodata.svg")}
                                                            />
                                                            <Box
                                                                py={3}
                                                                color="#A1A1A1"
                                                                fontSize={14}
                                                                display="block"
                                                            >
                                                                {" "}
                                                                {t("componentData.dashboard.NoDataToShow")}
                                                            </Box>
                                                        </Box>
                                                    </>
                                                }
                                                
                                            </>
                                            : <>
                                                {!Boolean(isGraphDataAllZero) && Object.keys(payeeEnrollBarGraph).length > 0
                                                    ? <>
                                                        <Bar
                                                            data={payeeEnrollBarGraph}               
                                                            options={payeeEnrollBarGraphOpt} 
                                                            id="spendAnalysisGraph"
                                                        />
                                                    </>
                                                    : <>
                                                        <Box                            
                                                            textAlign="center"
                                                            width={1}
                                                            mt={15}
                                                            style={{float: 'left'}}
                                                        >
                                                            <img
                                                                alt="no-data"
                                                                src={require("~/assets/images/nodata.svg")}
                                                            />
                                                            <Box
                                                                py={3}
                                                                color="#A1A1A1"
                                                                fontSize={14}
                                                                display="block"
                                                            >
                                                                {" "}
                                                                {t("componentData.dashboard.NoDataToShow")}
                                                            </Box>
                                                        </Box>
                                                    </>
                                                }
                                                
                                            </>
                                        } 

                                        {!Boolean(isGraphDataAllZero) && (
                                            <Box
                                                display="flex"
                                                width={1}
                                                pt={1}
                                                justifyContent="center"
                                                mt={2}
                                                mb={2}
                                                style={{pointerEvents: Boolean(dateToggleOpen) ? 'none' : 'auto'}}
                                            >
                                                <span className={classes.tabContainer}>
                                                    <span                                             
                                                        className={classes.tab}
                                                        style={
                                                            selectedPayeeView === "Payees"
                                                            ? { color: "white", background: "#008CE6" }
                                                            : {}
                                                        }
                                                        onClick={() => this.handleTabClick('Payees')}
                                                    >
                                                        {selectedPayeeView === "Payees" && (
                                                            <CheckCircleIcon />
                                                        )}                                            
                                                        {t("componentData.dashboard.NoOfPayees")}
                                                    </span>
                                                    <span
                                                        className={classes.tab}
                                                        style={
                                                            selectedPayeeView === "Amount"
                                                            ? { color: "white", background: "#008CE6" }
                                                            : {}
                                                        }
                                                        onClick={() => this.handleTabClick('Amount')}
                                                    >
                                                        {selectedPayeeView === "Amount" && (
                                                            <CheckCircleIcon />
                                                        )}  
                                                        {t("componentData.dashboard.Amount")}
                                                    </span>
                                                </span>
                                            </Box>
                                        )}  
                                    </>
                                }                                                           
                                
                            </Box>
                        </Grid>

                    </Grid>

                </Box> 
                {alertMsg && this.renderSnackbar(alertType, alertMsg)}               
            </>
        )
    }
}

export default withTranslation()(connect((state) => ({ ...state.user }))(withStyles(styles)(PayeesEnrollment)))
