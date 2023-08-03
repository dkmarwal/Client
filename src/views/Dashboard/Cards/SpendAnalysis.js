import React, {Component} from 'react';
import { 
    Typography, 
    withStyles, 
    Box, 
    FormControl, 
    InputLabel,
    FormControlLabel,
    Radio,
    RadioGroup,
    Select,
    MenuItem,     
    Grid,
    Checkbox,
    CircularProgress
} from '@material-ui/core';
import { connect } from "react-redux";
import styles from './style';
import USAFlag from '~/assets/images/USA_flag.svg';
import CADFlag from '~/assets/images/CAD_flag.svg';
import TrendForecastImg from '~/assets/images/Trend_Forecast.svg';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Bar } from "react-chartjs-2";
import Notification from "~/components/Notification";
import {
    fetchCCYearList,
    fetchCCGraphData
} from "~/redux/helpers/dashboard";
import { withTranslation } from "react-i18next";
import moment from "moment"; 
import { accessRights } from "~/config/accessRights";
import config from "~/config";


class SpendAnalysis extends Component{
    constructor(props){
        super(props);
        this.state={            
            selectedTime: "2",
            selectedYear: null,                        
            selectedCurrency: 'USD',
            trendForecast: false,
            SpendAnalysisGraphData:[],
            SpendAnalysisGraphOpt:[],
            yearList: [],
            alertMsg: null,
            alertType: null,
            spendAPIData: [],
            isLoading: false,
            isDataAvilable: true,
            leftPanelObj: [],
            isGraphDataAllZero: false,   
            avgSpend: 0        
        }
    }   
    
    componentDidMount=()=>{
        this.fetchYearList();        
    }

    fetchYearList=()=>{
        fetchCCYearList().then((res) => {
            if(res.error || res.isError){
                this.setState({
                    alertMsg: res.message || res.title,
                    alertType: "error"
                })
                return false
            } 
           const data = res?.result?.yearsList ?? [];
           if(data.length > 0){
               this.setYearList(data)
           }
        })
    }

    setYearList=(data)=>{
        const years = data.map((item)=>item.years);
        const sortedList = years.sort((a, b) => (a > b ? -1 : 1));
        this.setState({
            selectedYear: sortedList[0],
            yearList: sortedList
        }, ()=>{
            this.getGraphDataFromAPI();
        })
    }

    getGraphDataFromAPI=()=>{
        this.setState({
            isLoading: true
        }, ()=>{
            const {selectedYear, selectedCurrency, selectedTime, trendForecast} = this.state;
            const {portalProfileId} = this?.props?.user?.userData ?? 0;
            
            const payload={
                "clientID": portalProfileId,
                "payeeRegInfoId": 0,
                "years": selectedYear,                
                "currencyCode": selectedCurrency,
                "modeOfPeriod": selectedTime === '1' ? 1 : 2,
                "trendForecast": trendForecast,
                'UserID': 0
            }
            fetchCCGraphData(payload).then((res) => {              
                if(res.error || res.isError){
                    this.setState({
                        alertMsg: res.message || res.title,
                        alertType: "error",
                        isLoading: false
                    })
                    return false
                }    
                this.setState({
                    spendAPIData: res?.result[0] ?? [],
                    leftPanelObj: Boolean(res?.result[0]?.cumulativeSpendGraphResponseList ?? false) ? res?.result[0]?.cumulativeSpendGraphResponseList[0] : [],                    
                    isDataAvilable: Object.keys(res?.result[0]).length > 0 ? true : false
                }, ()=>{
                    this.drawSpendAnalysisGraph();
                })        
            })
        })        
    }

    drawSpendAnalysisGraph=()=>{ 
        const {spendAPIData, trendForecast} = this.state;
        const graphData = spendAPIData?.cumulativeSpendGraphDetail ?? [];
        const {t} = this.props;

        let graphLabel = [];
        let graphDataSet = [];            
        let isValGreaterZero = false;  

        graphData.map((item)=>{            
            if(graphLabel.indexOf(item.label) === -1){
                if(item?.label?.includes('Current')){
                    const val = item?.label?.split('(Current)')[0]?.trim('');
                    let index = graphLabel.indexOf(val);
                    index = index < 0 ? 0 : index;
                    graphLabel[index] = item.label
                }
                else{
                    const val = graphLabel.find(a =>a.includes(item.label));
                    if(!Boolean(val)){
                        graphLabel.push(item.label)
                    }                    
                }                
            }              

            isValGreaterZero = Boolean(isValGreaterZero) 
                ? isValGreaterZero 
                : item.labelData > 0
                    ? true
                    : false;

            var isValAvilable = graphDataSet.findIndex(x => x.id === item.labelId);

            if(isValAvilable === -1){
                if(item.labelId === "lblCommittedSpend"){
                    graphDataSet.push({
                        type: 'line',
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
                    })
                }
                else if(item.labelId === "lblForecastedSpend"){                    
                    graphDataSet.push({
                        type: 'line',
                        label: item.labelText,
                        data: [item.labelData.toFixed(0)],
                        id: item.labelId,
                        backgroundColor: item.labelColorCode,
                        borderColor: item.labelColorCode,
                        fill: false,
                        tension: 0,
                        borderWidth: 2,  
                    })

                    graphDataSet.push({
                        type: 'line',
                        label: ` ${item.labelText}`,
                        data: [item.labelData.toFixed(0)],
                        id: 'lblForecastedSpendDash',
                        backgroundColor: item.labelColorCode,
                        borderColor: item.labelColorCode,
                        fill: false,
                        tension: 0,
                        borderWidth: 2,  
                        borderDash: [9, 9],  
                        spanGaps: true
                    })
                }                
                else{
                    graphDataSet.push({
                        type: 'bar',
                        label: item.labelText,
                        data: [item.labelData.toFixed(0)],
                        id: item.labelId,
                        backgroundColor: item.labelColorCode,
                        borderColor: item.labelColorCode,
                    })
                }                
            }
            else{
                if(item.labelId === "lblForecastedSpend"){
                    graphDataSet[isValAvilable].data = [...graphDataSet[isValAvilable].data, item.labelData.toFixed(0)]
                    graphDataSet[isValAvilable+1].data = [...graphDataSet[isValAvilable+1].data, item.labelData.toFixed(0)]
                }
                else if(item.labelId === "lblForecastedSpendDash"){
                    graphDataSet[isValAvilable].data = [...graphDataSet[isValAvilable].data, item.labelData.toFixed(0)]
                }
                else{
                    graphDataSet[isValAvilable].data = [...graphDataSet[isValAvilable].data, item?.labelData.toFixed(0)]
                }                
            }
        }) 

        var findInd = graphDataSet.findIndex(x => x.id === 'lblForecastedSpend');
        if(findInd !== -1){
            const sliceItem = graphDataSet.slice(findInd);
            graphDataSet.splice(findInd, 2);            
            graphDataSet.splice(1,0, sliceItem[0]);
            graphDataSet.splice(2,0, sliceItem[1]);
        } 
        
        var actualSpendThisYearIndx = graphDataSet.findIndex(x => x.id === 'lblActualSpendThisYear');
        const spendSum = graphDataSet[actualSpendThisYearIndx]?.data?.reduce((a, b) => parseInt(a) + parseInt(b), 0);
        const spendAvg = (spendSum / graphDataSet[actualSpendThisYearIndx]?.data?.length) || 0;

        const data = {
            labels: graphLabel,
            datasets: graphDataSet,
        }; 

        const options = {
            scales: {
              xAxes: [
                {
                  stacked: false,     
                  barPercentage: 0.4           
                },
              ],
              yAxes: [
                {
                  stacked: false,  
                  ticks: {
                    beginAtZero: true,  
                    precision: 0, 
                    callback: function(value, index, values) {
                        const valInK = Boolean(value) ? Number(value/1000).toFixed(0) : 0; 
                        if(parseInt(valInK) >= 1000){                            
                          return '$' + valInK.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"K";
                        } else {
                          return '$' + valInK +"K";
                        }
                    }                                                            
                  },
                  scaleLabel: {
                    display: true,
                    labelString: t("componentData.dashboard.AmountInDollars")
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
                filter: function (tooltipItem, data) {                     
                    var id = data.datasets[tooltipItem.datasetIndex].id;  
                    if (id === "lblForecastedSpend") {
                        return false;
                    } else {
                        return true;
                    }
                },     
                itemSort: function(a, b) {                   
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
                filter: function(item, chart) {                                        
                    return chart.datasets[item.datasetIndex].id != 'lblForecastedSpendDash';
                }                                          
              },
              title: {
                padding: 6,
              },
              onClick: function(e, legendItem) {
                const index = legendItem.datasetIndex;
                const ci = this.chart;
                if(index === 1 && trendForecast){
                    const meta = ci.getDatasetMeta(index);                
                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                    const meta2 = ci.getDatasetMeta(index+1);                
                    meta2.hidden = meta2.hidden === null ? !ci.data.datasets[index].hidden : null;
                }
                else{
                    const meta = ci.getDatasetMeta(index);                
                    meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                }                
                ci.update();              
              }                   
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
    }    

    handleRadioChange=(e)=>{
        this.setState({
            selectedTime: e.target.value
        }, ()=> this.getGraphDataFromAPI())
    }

    handleYearChange=(e)=>{        
        this.setState({
            selectedYear: e.target.value
        }, ()=> this.getGraphDataFromAPI())
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

    currencyFormateFnInK=(val)=>{
        if(Number(val) < 1000){
            return val
        }
        let newVal = val/1000;
        newVal = newVal.toFixed(0);
        return newVal.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"K"
    }

    handleDrillDown=(val)=>{  
        const {user} = this.props;
        const { selectedYear } = this.state;
        let fromDate = null, toDate = null;
        const isPaymentViewEnabled = (user.userRoles && user.userRoles.includes(accessRights["PAYMENTS_PAYMENTS_VIEW"])) || false;

        if(!isPaymentViewEnabled){
            return false
        }  
        if(selectedYear) {
            fromDate = moment(new Date(selectedYear, 0, 1)).format('MM/DD/YYYY');
            toDate = moment(new Date(selectedYear, 11, 31)).format('MM/DD/YYYY');
        }
        this.props.history.push({
            pathname: `${config.baseName}/payments/paymentDetails`,
            state: {
                vCardUsageTypes: parseInt(val) > 1 ? "2" : val?.toString(),
                cardIntiation: val?.toString() === "2" ? true : false,
                cardExpirationDays: val?.toString() === "3" ? 7 : 0,
                FromDate: fromDate,
                ToDate: toDate
              },
        });
    }
    

    render(){
        const {classes, t, user} = this.props;
        const { selectedTime, 
            selectedYear,                      
            selectedCurrency, 
            SpendAnalysisGraphData, 
            SpendAnalysisGraphOpt,
            yearList,
            alertMsg,
            alertType,
            spendAPIData,
            isLoading,
            isDataAvilable,
            leftPanelObj,
            isGraphDataAllZero,  
            avgSpend          
        } = this.state;         
        
        const isForcastAvilable = Boolean(spendAPIData?.trendForecastDetail ?? false) && spendAPIData?.trendForecastDetail[0]?.isTrendForecast === 1 ? true : false;

        const isPaymentViewEnabled = (user.userRoles && user.userRoles.includes(accessRights["PAYMENTS_PAYMENTS_VIEW"])) || false;
        
                
        return(
            <>   
                <Box className={classes.spendAnalysis}>
                    <Box className={classes.topFilterBox}>
                        <Box className='leftFilter'>
                            <Typography variant='h2'>
                                {t("componentData.dashboard.CumulativeSpendAnalysis")}
                            </Typography>  
                            <Typography variant='h4'>
                                {Number(selectedYear) === new Date().getFullYear() 
                                    ? `${selectedYear} (${t("componentData.dashboard.CurrentYear")}) vs ${selectedYear-1} (${t("componentData.dashboard.PreviousYear")})`
                                    : `${selectedYear} (${t("componentData.dashboard.SelectedYear")}) vs ${selectedYear-1} (${t("componentData.dashboard.PreviousYear")})`
                                }                                
                            </Typography> 
                        </Box>

                        <Box className={classes.yearFilterBox}>
                            <FormControl 
                                variant="outlined" 
                                className='yearBox' 
                                size="small"
                            >
                                <InputLabel 
                                    shrink={true} 
                                    id="select-label"
                                >
                                    {t("componentData.dashboard.Year")}
                                </InputLabel>
                                <Select                                    
                                    value={selectedYear}
                                    onChange={(e)=>this.handleYearChange(e)}
                                    label={t("componentData.dashboard.Year")}
                                    notched={true}
                                    labelId="select-label"                                    
                                >
                                    {yearList.map((item)=> { 
                                        return(
                                            <MenuItem value={item}>{item}</MenuItem>
                                        )                                        
                                    })}                                 
                                </Select>
                            </FormControl> 
                        </Box>
                    </Box>

                    {/* {Boolean(isLoading) && (
                        <Box 
                            style={{
                                margin: '20px auto',
                                float: 'left',
                                width: '100%',
                                textAlign: 'center',
                            }}>
                            <CircularProgress />
                        </Box>                        
                    )} */}

                    {!Boolean(isDataAvilable) && !Boolean(isLoading) && (
                        <Box                            
                            textAlign="center"
                            width={1}
                            mt={6}
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
                    )}

                    {Boolean(isDataAvilable) && (
                       <Box component={'div'}>
                            <Grid container className={classes.coutrySeclectionBox}>
                                <Grid item xs={4}> 

                                    {leftPanelObj?.usdAmount > 0 && (
                                        <Box 
                                            mt={3}
                                            className="countryBox"
                                            onClick={(e)=>{
                                                this.setState({
                                                    selectedCurrency: 'USD'
                                                }, ()=> this.getGraphDataFromAPI())
                                            }}
                                                active={selectedCurrency === 'USD' ? 'true' : null}
                                            >
                                                <img src={USAFlag} alt="USD" />
                                                <Typography 
                                                    variant='h4'
                                                    title={`USD $${leftPanelObj?.usdAmount?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0}`}
                                                >
                                                    USD ${this.currencyFormateFnInK(leftPanelObj?.usdAmount ?? 0)} 
                                                </Typography>                                
                                        </Box>
                                    )}
                                    
                                    {leftPanelObj?.cadAmount > 0 && (
                                        <Box 
                                        mt={3}
                                        className="countryBox"
                                        onClick={(e)=>{
                                            this.setState({
                                                selectedCurrency: 'CAD'
                                            }, ()=> this.getGraphDataFromAPI())
                                        }}
                                            active={selectedCurrency === 'CAD' ? 'true' : null}
                                        >
                                            <img src={CADFlag} alt="CAD" /> 
                                            <Typography 
                                                variant='h4'
                                                title={`CAD $${leftPanelObj?.cadAmount?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0}`}
                                            >
                                                CAD ${this.currencyFormateFnInK(leftPanelObj?.cadAmount ?? 0)} 
                                            </Typography>           
                                        </Box>
                                    )} 

                                </Grid>

                                <Grid item xs={8}>
                                    <Box mt={2}>
                                        <FormControl component="div" style={{float: 'right'}}>                                
                                            <RadioGroup
                                                value={selectedTime} 
                                                onChange={(e)=>this.handleRadioChange(e)}
                                                style={{flexDirection: 'row'}}
                                            >
                                                <FormControlLabel 
                                                    value="1"
                                                    control={<Radio />} 
                                                    label={t("componentData.dashboard.Monthly")} 
                                                />
                                                <FormControlLabel 
                                                    value="2"  
                                                    control={<Radio />} 
                                                    label={t("componentData.dashboard.Quarterly")} 
                                                />                                    
                                            </RadioGroup>
                                        </FormControl>                 
                                    </Box>
                                </Grid>

                            </Grid>

                            <Grid container className={classes.grpahBox}>
                                <Grid item xs={4} className="graphLeft">
                                    <Typography variant='body1'>
                                        {t("componentData.dashboard.generalTxt")}  {" "}
                                        {selectedTime === "1" ? 'month' : 'quarter'}
                                    </Typography>  

                                    <Typography variant='h3'>
                                        {t("componentData.dashboard.AllTimeCardRequests")}
                                    </Typography> 

                                    <Typography variant='h1'>
                                        {leftPanelObj?.allTimeCardRequest?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0}
                                    </Typography>

                                    {leftPanelObj?.changesOfAllTimeCardRequest != 0 && (
                                        <Typography 
                                            variant='h2' 
                                            className={Number(leftPanelObj?.changesOfAllTimeCardRequest ?? 0) < 0   ? 'red' : 'green'}
                                        >
                                            {Number(leftPanelObj?.changesOfAllTimeCardRequest ?? 0) < 0
                                                ? <ArrowDropDownIcon />
                                                : <ArrowDropUpIcon />
                                            }                                        
                                            {Math.abs(leftPanelObj?.changesOfAllTimeCardRequest ?? 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                                        </Typography>
                                    )}                                   

                                    <Grid container>
                                        <Grid item xs={6} className="spendList">
                                            <Typography 
                                                variant='h3'
                                                onClick={()=>this.handleDrillDown("0")}
                                                style={{
                                                    pointerEvents: Boolean(isPaymentViewEnabled) && Number(leftPanelObj?.totalSingleUseCards ?? 0) > 0
                                                        ? 'auto'
                                                        : 'none',
                                                    textDecoration: Boolean(isPaymentViewEnabled) && Number(leftPanelObj?.totalSingleUseCards ?? 0) > 0
                                                        ? 'underline'
                                                        : 'none'  
                                                }}
                                            >
                                                {t("componentData.dashboard.TotalSingleUseCardsInitiated")}
                                            </Typography>
                                            <Typography variant='h4'>
                                                {leftPanelObj?.totalSingleUseCards?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0}
                                            </Typography>

                                            {leftPanelObj?.changesOfTotalSingleUseCards != 0 && (
                                                <Typography 
                                                    variant='h2' 
                                                    className={Number(leftPanelObj?.changesOfTotalSingleUseCards ?? 0) < 0   ? 'red' : 'green'}
                                                >
                                                    {Number(leftPanelObj?.changesOfTotalSingleUseCards ?? 0) < 0
                                                        ? <ArrowDropDownIcon />
                                                        : <ArrowDropUpIcon />
                                                    }
                                                    {Math.abs(leftPanelObj?.changesOfTotalSingleUseCards ?? 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                                                </Typography>
                                            )}     
                                        </Grid>

                                        <Grid item xs={6} className="spendList">
                                            <Typography 
                                                variant='h3'
                                                onClick={()=>this.handleDrillDown("1")}
                                                style={{
                                                    pointerEvents: Boolean(isPaymentViewEnabled) && Number(leftPanelObj?.totalMultiUseCards ?? 0) > 0
                                                        ? 'auto'
                                                        : 'none',
                                                    textDecoration: Boolean(isPaymentViewEnabled) && Number(leftPanelObj?.totalMultiUseCards ?? 0) > 0
                                                        ? 'underline'
                                                        : 'none'  
                                                }}
                                            >
                                                {t("componentData.dashboard.TotalMultiUseCardsInitiated")}
                                            </Typography>
                                            <Typography variant='h4'>
                                                {leftPanelObj?.totalMultiUseCards?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0}
                                            </Typography>

                                             {leftPanelObj?.changesOfTotalMultiUseCards != 0 && (
                                                 <Typography 
                                                    variant='h2' 
                                                    className={Number(leftPanelObj?.changesOfTotalMultiUseCards ?? 0) < 0   ? 'red' : 'green'}
                                                >
                                                    {Number(leftPanelObj?.changesOfTotalMultiUseCards ?? 0) < 0
                                                        ? <ArrowDropDownIcon />
                                                        : <ArrowDropUpIcon />
                                                    }
                                                    {Math.abs(leftPanelObj?.changesOfTotalMultiUseCards ?? 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                                                </Typography>
                                             )}       
                                            

                                        </Grid>

                                        <Grid item xs={6} className="spendList">
                                            <Typography 
                                                variant='h3'
                                                onClick={()=>this.handleDrillDown("2")}
                                                style={{
                                                    pointerEvents: Boolean(isPaymentViewEnabled) && Number(leftPanelObj?.cardsInitiationFailed ?? 0) > 0
                                                        ? 'auto'
                                                        : 'none',
                                                    textDecoration: Boolean(isPaymentViewEnabled) && Number(leftPanelObj?.cardsInitiationFailed ?? 0) > 0
                                                        ? 'underline'
                                                        : 'none'  
                                                }}
                                            >
                                                {t("componentData.dashboard.CardsInitiationFailed")}
                                            </Typography>
                                            <Typography variant='h4'>
                                                {leftPanelObj?.cardsInitiationFailed?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0}
                                            </Typography>

                                             {leftPanelObj?.changesOfCardsInitiationFailed != 0 && (
                                                 <Typography 
                                                    variant='h2' 
                                                    className={Number(leftPanelObj?.changesOfCardsInitiationFailed ?? 0) < 0   ? 'red' : 'green'}
                                                >
                                                    {Number(leftPanelObj?.changesOfCardsInitiationFailed ?? 0) < 0
                                                        ? <ArrowDropDownIcon />
                                                        : <ArrowDropUpIcon />
                                                    }
                                                    {Math.abs(leftPanelObj?.changesOfCardsInitiationFailed ?? 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                                                </Typography>
                                             )} 
                                        </Grid>

                                        <Grid item xs={6} className="spendList">
                                            <Typography 
                                                variant='h3'
                                                onClick={()=>this.handleDrillDown("3")}
                                                style={{
                                                    pointerEvents: Boolean(isPaymentViewEnabled) && Number(leftPanelObj?.cardsExpiring ?? 0) > 0
                                                        ? 'auto'
                                                        : 'none',
                                                    textDecoration: Boolean(isPaymentViewEnabled) && Number(leftPanelObj?.cardsExpiring ?? 0) > 0
                                                        ? 'underline'
                                                        : 'none'  
                                                }}
                                            >
                                                {t("componentData.dashboard.CardsExpiring")}
                                            </Typography>
                                            <Typography variant='h4'>
                                                {leftPanelObj?.cardsExpiring?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") ?? 0}
                                            </Typography>

                                             {/* {leftPanelObj?.changesOfCardsExpiring != 0 && (
                                                 <Typography 
                                                    variant='h2' 
                                                    className={Number(leftPanelObj?.changesOfCardsExpiring ?? 0) < 0   ? 'red' : 'green'}
                                                >
                                                    {Number(leftPanelObj?.changesOfCardsExpiring ?? 0) < 0
                                                        ? <ArrowDropDownIcon />
                                                        : <ArrowDropUpIcon />
                                                    }
                                                    {Math.abs(leftPanelObj?.changesOfCardsExpiring ?? 0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
                                                </Typography>
                                             )}   */}

                                            <Typography variant='h5'>
                                                {t("componentData.dashboard.withinFiveBusinessdays")}
                                            </Typography>
                                        </Grid>
                                    </Grid> 

                                    <Box className={classes.updatedTimeTxt} marginTop={'25px'}>
                                        {t("componentData.dashboard.UpdatedAt")} {moment(leftPanelObj?.lastUpdatedTime).locale(this?.props?.user?.userData?.locale ?? "en").format('Do MMMM YYYY, h:mm:ss A')} EST
                                    </Box>

                                </Grid>

                                <Grid item xs={8} className="graphRight">
                                    {isForcastAvilable && (
                                        <Box className='trendForceBox'>
                                            <Checkbox
                                                defaultChecked={false}
                                                color="secondary"
                                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                onChange={(e)=>{
                                                    this.setState({
                                                        trendForecast:e.target.checked
                                                    }, ()=> this.getGraphDataFromAPI())
                                                }}
                                                id="TrendForecastCheck"
                                            />
                                            <label for="TrendForecastCheck">
                                                <img 
                                                    src={TrendForecastImg} 
                                                    alt={t("componentData.dashboard.TrendForecast")} 
                                                />
                                                {t("componentData.dashboard.TrendForecast")}
                                            </label>
                                        </Box>
                                    )}                                   

                                    {!isGraphDataAllZero && (
                                        <Box className='averageSpent' component={'div'}>
                                            <Typography variant='h3'>
                                                {t("componentData.dashboard.AverageSpent")}:
                                                <span>${avgSpend.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</span>
                                            </Typography>
                                        </Box>
                                    )}                                    

                                    <Box>
                                        {Boolean(isLoading)
                                            ? <>
                                                <Box 
                                                    style={{
                                                        margin: '20px auto',
                                                        float: 'left',
                                                        width: '100%',
                                                        textAlign: 'center',
                                                    }}>
                                                    <CircularProgress />
                                                </Box>
                                            </>
                                            : !isGraphDataAllZero && Object.keys(SpendAnalysisGraphData).length > 0
                                                ? <>
                                                    <Bar
                                                        data={SpendAnalysisGraphData}      
                                                        options={SpendAnalysisGraphOpt} 
                                                        id="spendAnalysisGraph"
                                                    />
                                                 </>
                                                : <>
                                                    <Box                            
                                                        textAlign="center"
                                                        width={1}
                                                        mt={6}
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
                                    </Box>                                    
                                </Grid>
                            </Grid>
                       </Box>
                    )}                    
                </Box> 
                {alertMsg && this.renderSnackbar(alertType, alertMsg)}               
            </>
        )
    }
}

export default withTranslation()(connect((state) => ({ ...state.user }))(withStyles(styles)(SpendAnalysis)))
