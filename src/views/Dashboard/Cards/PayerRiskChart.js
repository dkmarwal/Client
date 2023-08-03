import React, { Component } from 'react';
import { 
    Typography, 
    withStyles, 
    Box,     
    Grid,
    CircularProgress   
} from '@material-ui/core';
import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell
  } from "recharts";  
import styles from './style';
import { connect } from "react-redux";
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Doughnut  } from "react-chartjs-2";
import MaterialTooltip from '@material-ui/core/Tooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Notification from "~/components/Notification";
import moment from "moment"; 
import { accessRights } from "~/config/accessRights";
import config from "~/config"; 

import {
    fetchCCRiskAnalysisGraph    
} from "~/redux/helpers/dashboard";
import { withTranslation } from "react-i18next";

const CustomTooltip = (data) => { 
    const {active, payload, label, APIData, view, t} = data;
    if (active && payload && payload.length > 0 && APIData && view) { 
        var index = payload[0]?.payload?.id ?? 0;

        let actualSpendInPerc = APIData[index]?.ActualSpendInPer ?? 0;
        actualSpendInPerc = Boolean(actualSpendInPerc) ? actualSpendInPerc+"%" : null;
        
        return (
            <div 
                style={{
                    background: '#f7f7f7', 
                    padding: "10px", 
                    borderRadius: '4px', 
                    fontWeight: 300,
                    maxWidth: 350
                }}
            >
                <p style={{fontSize: 14, fontWeight:'bold', paddingBottom: 2}}>{`${APIData[index]?.name}`}</p> 

                <p style={{paddingBottom: 2}}>
                    {`${t("componentData.dashboard.ActualSpent")}: $${APIData[index]?.ActualSpend?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} (${actualSpendInPerc})`}
                </p>

                <p style={{paddingBottom: 2}}>
                    {`${t("componentData.dashboard.CommittedSpend")}: $${APIData[index]?.commitedSpent?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`}
                </p>                

                {view === 'Percentage'
                    ? <>
                        <p style={{paddingBottom: 2}}>
                            {`${t("componentData.dashboard.RiskPercentage")}: ${APIData[index]?.LineOfRisk?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`}%
                        </p>

                        <p style={{paddingBottom: 2}}>
                            {`${t("componentData.dashboard.THPercentage")}: ${APIData[index]?.THLine?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}`}%
                        </p>
                    </>
                    : null
                }                

            </div>
        );
    }
  
    return null;
};

class PayerRiskChart extends Component{
    constructor(props){
        super(props);
        this.state={
            selectedPayeeView: "Percentage",
            DoughnutData: [],
            DoughnutOpt:[],
            barGraphData: [],                 
            selectedCurrency: 'USD',  
            alertMsg: null,
            alertType: null,
            apiRes: [],
            isLoading: false,
            isDoughnutAllZero: false      
        }
    }   
    
    componentDidMount=()=>{
        this.fetchGraphData() 
    }

    fetchGraphData=()=>{
        this.setState({
            isLoading: true
        }, ()=>{
            const {portalProfileId} = this?.props?.user?.userData ?? 0;            
            const payload ={
                ClientID: portalProfileId,
                PayeeRegInfoId: 0,
                LineOfRisk: 0,
                AboveThreshhold: 0,
                UserID: 0
            }

            fetchCCRiskAnalysisGraph(payload).then((res) => {                        
                if(res.error || res.isError){
                    this.setState({
                        alertMsg: res.message || res.title,
                        alertType: "error",
                        isLoading: false
                    })
                    return false
                }
                this.setState({
                    apiRes: res?.result ?? [],
                    isLoading: false            
                }, ()=> {
                    this.drawDoughnutGraph();
                    this.drawBarGraph();
                })
            })
        })
    }

    drawDoughnutGraph=()=>{
        const {apiRes} = this.state;
        const graphOption = {
            aspectRatio: 1,
            clip: { left: 5, top: false, right: -2, bottom: 0 },
            height: 200,
            width: 200,
            cutoutPercentage: 60,
            animation: {
              animateRotate: true,
            },
            responsive: false,
            tooltips: {
              enabled: true,
            },
            plugins: {
                labels: {
                  fontSize: 0,
                }
            },
            legend: {
              display: false,
              position: "right",
              labels: {
                usePointStyle: true,
                //fontColor: "#121212",
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
        }

        const graphDataVal = apiRes?.doughnutGraphObj?.doughnutGraphData?.data ?? [];
        let boolVal = false;
        if(graphDataVal.length === 0){
            boolVal = true
        }
        else{
            boolVal = graphDataVal.every(item => Number(item) === 0);            
        }

        const graphData= {
            labels: apiRes?.doughnutGraphObj?.labels ?? [],
            datasets: [
              {
                //label: "# of Tomatoes",
                data: graphDataVal,
                backgroundColor: apiRes?.doughnutGraphObj?.doughnutGraphData?.backgroundColor ?? [],
                borderWidth: 0,
              },
            ],
        };        

        this.setState({
            DoughnutData: graphData,
            DoughnutOpt: graphOption,
            isDoughnutAllZero: boolVal
        })
    }

    drawBarGraph=()=>{
        const {apiRes} = this.state;
        const barGraphAPIData = apiRes?.rightGraphObj ?? []; 
        let barData = []; 
        
        barGraphAPIData.forEach((item, index)=>{            
            barData.push({
                "id": index,
                "name": item?.payerName ?? "",
                "YName": item?.payerName?.length === 0
                        ? ""
                        : item?.payerName?.length > 25
                            ? item?.payerName?.substring(0, 10)+"..."
                            : item?.payerName,
                "LineOfRisk": Number(Number(item?.lineOfRisk ?? 0).toFixed(0)),
                "THLine": Number(Number(item?.thValue ?? 0).toFixed(0)),
                "ActualSpend": Number(Number(item?.actualSpend ?? 0).toFixed(0)),                  
                "commitedSpent": Number(Number(item?.committedSpend ?? 0).toFixed(0)),
                'ActualSpendInPer': Number(Number(item?.riskPercentage ?? 0).toFixed(2))                
            })
        })        

        this.setState({            
            barGraphData: barData             
        })
    }

    handleTabClick=(val)=>{
        this.setState({
            selectedPayeeView: val
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

    renderSnackbar = (type, msg) => {
        return <Notification variant={type} message={msg} handleClose={this.hideAlertMessage} />
    }

    hideAlertMessage = () => {
        this.setState({
            alertMsg: null,
            alertType: null
        })
    }

    currencyFormateFn=(val)=> val.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    getPercentage=(cVal, TVal)=> {
        if(Number(cVal) > 0 && Number(TVal) > 0){
            return (cVal/TVal*100).toFixed(0)
        }
        else{
            return 0
        }        
    };

    handleDrillDown=(val)=>{  
        const {user} = this.props;        
        const isMySupplierEnabled = (user.userRoles && user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_VIEW"])) || false;

        if(!isMySupplierEnabled){
            return false
        }  
        this.props.history.push({
            pathname: `${config.baseName}/suppliers/mySupplier`,
            state: {              
              filterID: val?.toString() ?? "1"
            },
        });
    }

    render(){
        const {classes, t, user} = this.props;
        const {
            selectedPayeeView, DoughnutData, DoughnutOpt, barGraphData, 
            alertMsg, alertType, isLoading, apiRes, isDoughnutAllZero
        } = this.state
        const getCurrentYear = new Date().getFullYear();
        const isMySupplierEnabled = (user.userRoles && user.userRoles.includes(accessRights["SUPPLIERS_MY_SUPPLIERS_VIEW"])) || false;

        return(
            <>
                <Box className={classes.payerRiskChartBox}>
                    <Box width={1}>
                        <Grid container>
                            <Grid itam xs={12}>
                                <Typography>{t("componentData.dashboard.PayeesMostRisk")}</Typography>
                            </Grid>
                            <Grid itam xs={12}>
                                <Typography
                                    color="textSecondary"
                                    gutterBottom
                                    display="block"
                                    style={{
                                        fontSize: "13px", 
                                        color: '#9E9E9E', 
                                        margin: 0, 
                                        padding: '0 0 10px'
                                    }}
                                >
                                    {getCurrentYear} ({t("componentData.dashboard.CurrentYear")})
                                </Typography>
                            </Grid>
                        </Grid>

                        <Box borderTop="1px solid #9E9E9E" px={5}></Box>

                        {isLoading 
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
                            : Object.keys(apiRes).length > 0 
                                ? <>
                                    <Grid container component={Box} mt={2}>
                                        <Grid item xs={4}>
                                            {/* <div 
                                                className={classes.coutrySeclectionBox}
                                                style={{
                                                    marginBottom: 15,
                                                    float: 'left',
                                                    width: '100%'
                                                }}
                                            >
                                                <Box                                         
                                                    className="countryBox"
                                                    onClick={(e)=>this.setState({selectedCurrency: 'USD'})}
                                                    active={selectedCurrency === 'USD' ? 'true' : null}
                                                >
                                                    <img src={USAFlag} alt="USD" />
                                                    <Typography 
                                                        variant='h4'
                                                        title={'USD $987,000'}
                                                    >
                                                        USD ${this.currencyFormateFnInK(987000)}
                                                    </Typography>                                
                                                </Box>

                                                <Box                                         
                                                    className="countryBox"
                                                    onClick={(e)=>this.setState({selectedCurrency: 'CAD'})}
                                                    active={selectedCurrency === 'CAD' ? 'true' : null}
                                                >
                                                    <img src={CADFlag} alt="CAD" /> 
                                                    <Typography 
                                                        variant='h4'
                                                        title='CAD $10,000.45'
                                                    >
                                                        CAD ${this.currencyFormateFnInK(10000.45)}
                                                    </Typography>           
                                                </Box>
                                            </div>   */}

                                            <Box fontSize={12} mb={3} color="#828282">
                                                {t("componentData.dashboard.ChangesLastMonth")}
                                            </Box>
                                            <Typography gutterBottom>
                                                {t("componentData.dashboard.TotalCardPayees")}
                                            </Typography>
                                            <Box fontSize={34}>
                                                {this.currencyFormateFn(apiRes?.leftGraph?.totalCardPayer ?? 0)}
                                            </Box>

                                            <Box
                                                fontSize={14}
                                                fontWeight="bold"
                                                color={
                                                    Number(apiRes?.leftGraph?.changesOfTotalCardPayer ?? 0) > 0 ? "#219653" 
                                                    : Number(apiRes?.leftGraph?.changesOfTotalCardPayer ?? 0) < 0 
                                                        ? "#e03617" 
                                                        : "#fff"
                                                }
                                                display="flex"
                                                alignItems="center"
                                            >
                                                {Number(apiRes?.leftGraph?.changesOfTotalCardPayer ?? 0) > 0
                                                    ? <>
                                                        <ArrowDropUpIcon />
                                                        {
                                                            Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfTotalCardPayer ?? 0))
                                                        }
                                                    </>
                                                    : Number(apiRes?.leftGraph?.changesOfTotalCardPayer ?? 0) < 0
                                                        ? <>
                                                            <ArrowDropDownIcon />
                                                            {
                                                                Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfTotalCardPayer ?? 0))
                                                            }
                                                        </>
                                                        : null
                                                }                                            
                                                
                                            </Box>

                                            <Box pb={4}>
                                                {isDoughnutAllZero
                                                    ? (
                                                        <MaterialTooltip
                                                          title={t("componentData.dashboard.NoDataAvailable")}
                                                          aria-label={t("componentData.dashboard.NoDataAvailable")}
                                                        >
                                                          <img
                                                            src={require(`~/assets/images/blankDoughnut.PNG`)}
                                                            alt={t("componentData.dashboard.NoDataFound")}
                                                            style={{
                                                              height: "90px",
                                                              width: "93px",
                                                              margin: '0 auto',
                                                              display: 'block'
                                                            }}
                                                          />
                                                        </MaterialTooltip>
                                                      )
                                                    : <>
                                                        <Doughnut  
                                                            height={100}                                      
                                                            data={DoughnutData}
                                                            options={DoughnutOpt}
                                                        />
                                                    </>
                                                }
                                                
                                            </Box>

                                            <Grid container xs={9} style={{marginLeft: '10%'}}>

                                                <Grid item xs={6} style={{marginTop: 10}}>
                                                    <Typography 
                                                        component="span" 
                                                        variant="h4" 
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontWeight: 400,
                                                            fontSize: '1rem',
                                                            pointerEvents: Boolean(isMySupplierEnabled) && Number(apiRes?.leftGraph?.atRisk ?? 0) > 0 ? 'auto' : 'none',
                                                            textDecoration: Boolean(isMySupplierEnabled) && Number(apiRes?.leftGraph?.atRisk ?? 0) > 0 ? 'underline' : 'none'
                                                        }}
                                                        onClick={()=>this.handleDrillDown('1')}
                                                    >
                                                        <Box
                                                            width={10}
                                                            height={10}
                                                            mr={1}
                                                            bgcolor="#FFBBBB"
                                                            display="inline-block"
                                                            borderRadius="100%"
                                                        ></Box>
                                                        {t("componentData.dashboard.AtRisk")}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={6} style={{marginTop: 10}}>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="flex-end"
                                                        alignItems="flex-end"
                                                    >
                                                        <Typography
                                                            component="span"
                                                            color="textSecondary"
                                                            variant="subtitle2"
                                                        >
                                                        <Box
                                                            fontSize={11}
                                                            color="#4C4C4C"
                                                            display="inline-block"
                                                        >
                                                            {this.currencyFormateFn(apiRes?.leftGraph?.atRisk ?? 0)} ({this.getPercentage(apiRes?.leftGraph?.atRisk ?? 0, apiRes?.leftGraph?.totalCardPayer ?? 0)}%)
                                                        </Box>
                                                        <Box
                                                            component="span"
                                                            alignItems="center"
                                                            color={
                                                                Number(apiRes?.leftGraph?.changesOfAtRisk ?? 0) > 0 ? "#219653" 
                                                                : Number(apiRes?.leftGraph?.changesOfAtRisk ?? 0) < 0 
                                                                    ? "#e03617" 
                                                                    : "#fff"
                                                            }
                                                            fontSize={14}                              
                                                            ml={1}                              
                                                            display="inline-block"
                                                            minWidth={45}
                                                        >
                                                            {Number(apiRes?.leftGraph?.changesOfAtRisk ?? 0) > 0
                                                                ? <>
                                                                    <ArrowDropUpIcon
                                                                        style={{
                                                                            float: 'left', 
                                                                            margin: '-4px 0 0 0'
                                                                        }}
                                                                    />
                                                                    {
                                                                        Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfAtRisk ?? 0))
                                                                    }
                                                                </>
                                                                : Number(apiRes?.leftGraph?.changesOfAtRisk ?? 0) < 0
                                                                    ? <>
                                                                        <ArrowDropDownIcon
                                                                            style={{
                                                                                float: 'left', 
                                                                                margin: '-4px 0 0 0'
                                                                            }}
                                                                        />
                                                                        {
                                                                            Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfAtRisk ?? 0))
                                                                        }
                                                                    </>
                                                                    : null
                                                            } 
                                                        </Box>
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={6} style={{marginTop: 10}}>
                                                    <Typography 
                                                        component="span" 
                                                        variant="h4"
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontWeight: 400,
                                                            fontSize: '1rem',
                                                            pointerEvents: Boolean(isMySupplierEnabled) && Number(apiRes?.leftGraph?.onTrack ?? 0) > 0 ? 'auto' : 'none',
                                                            textDecoration: Boolean(isMySupplierEnabled) && Number(apiRes?.leftGraph?.onTrack ?? 0) > 0 ? 'underline' : 'none'
                                                        }}
                                                        onClick={()=>this.handleDrillDown('2')}
                                                    >
                                                        <Box
                                                            width={10}
                                                            height={10}
                                                            mr={1}
                                                            bgcolor="#CCE4FF"
                                                            display="inline-block"
                                                            borderRadius="100%"  
                                                        ></Box>
                                                        {t("componentData.dashboard.OnTrack")}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={6} style={{marginTop: 10}}>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="flex-end"
                                                        alignItems="flex-end"
                                                    >
                                                        <Typography
                                                            component="span"
                                                            color="textSecondary"
                                                            variant="subtitle2"
                                                        >
                                                        <Box
                                                            fontSize={11}
                                                            color="#4C4C4C"
                                                            display="inline-block"
                                                        >
                                                            {this.currencyFormateFn(apiRes?.leftGraph?.onTrack ?? 0)} ({this.getPercentage(apiRes?.leftGraph?.onTrack ?? 0, apiRes?.leftGraph?.totalCardPayer ?? 0)}%)
                                                        </Box>

                                                        <Box
                                                            component="span"
                                                            alignItems="center"
                                                            color={
                                                                Number(apiRes?.leftGraph?.changesOfOnTrack ?? 0) > 0 ? "#219653" 
                                                                : Number(apiRes?.leftGraph?.changesOfOnTrack ?? 0) < 0 
                                                                    ? "#e03617" 
                                                                    : "#fff"
                                                            }
                                                            fontSize={14}                                                
                                                            ml={1}
                                                            display="inline-block" 
                                                            minWidth={45}
                                                        >

                                                            {Number(apiRes?.leftGraph?.changesOfOnTrack ?? 0) > 0
                                                                ? <>
                                                                    <ArrowDropUpIcon
                                                                        style={{
                                                                            float: 'left', 
                                                                            margin: '-4px 0 0 0'
                                                                        }}
                                                                    />
                                                                    {
                                                                        Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfOnTrack ?? 0))
                                                                    }
                                                                </>
                                                                : Number(apiRes?.leftGraph?.changesOfOnTrack ?? 0) < 0
                                                                    ? <>
                                                                        <ArrowDropDownIcon
                                                                            style={{
                                                                                float: 'left', 
                                                                                margin: '-4px 0 0 0'
                                                                            }}
                                                                        />
                                                                        {
                                                                            Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfOnTrack ?? 0))
                                                                        }
                                                                    </>
                                                                    : null
                                                            }
                                                            
                                                        </Box>
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={6} style={{marginTop: 10}}>
                                                    <Typography 
                                                        component="span" 
                                                        variant="h4" 
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontWeight: 400,
                                                            fontSize: '1rem',
                                                            pointerEvents: Boolean(isMySupplierEnabled) && Number(apiRes?.leftGraph?.aboveTH ?? 0) > 0 ? 'auto' : 'none',
                                                            textDecoration: Boolean(isMySupplierEnabled) && Number(apiRes?.leftGraph?.aboveTH ?? 0) > 0 ? 'underline' : 'none'
                                                        }}
                                                        onClick={()=>this.handleDrillDown('3')}
                                                    >
                                                        <Box
                                                            width={10}
                                                            height={10}
                                                            mr={1}
                                                            bgcolor="#62BBF3"
                                                            display="inline-block"
                                                            borderRadius="100%"
                                                        ></Box>
                                                        {t("componentData.dashboard.AboveTH")}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={6} style={{marginTop: 10}}>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="flex-end"
                                                        alignItems="flex-end"
                                                    >
                                                        <Typography
                                                            component="span"
                                                            color="textSecondary"
                                                            variant="subtitle2"
                                                        >
                                                        <Box
                                                            fontSize={11}
                                                            color="#4C4C4C"
                                                            display="inline-block"
                                                        >
                                                            {this.currencyFormateFn(apiRes?.leftGraph?.aboveTH ?? 0)} ({this.getPercentage(apiRes?.leftGraph?.aboveTH ?? 0, apiRes?.leftGraph?.totalCardPayer ?? 0)}%)
                                                        </Box>
                                                        <Box
                                                            component="span"
                                                            alignItems="center"
                                                            color={
                                                                Number(apiRes?.leftGraph?.changesOfAboveTH ?? 0) > 0 ? "#219653" 
                                                                : Number(apiRes?.leftGraph?.changesOfAboveTH ?? 0) < 0 
                                                                    ? "#e03617" 
                                                                    : "#fff"
                                                            }
                                                            fontSize={14}                                     
                                                            ml={1}                                   
                                                            display="inline-block"
                                                            minWidth={45}
                                                        >

                                                            {Number(apiRes?.leftGraph?.changesOfAboveTH ?? 0) > 0
                                                                ? <>
                                                                    <ArrowDropUpIcon
                                                                        style={{
                                                                            float: 'left', 
                                                                            margin: '-4px 0 0 0'
                                                                        }}
                                                                    />
                                                                    {
                                                                        Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfAboveTH ?? 0))
                                                                    }
                                                                </>
                                                                : Number(apiRes?.leftGraph?.changesOfAboveTH ?? 0) < 0
                                                                    ? <>
                                                                        <ArrowDropDownIcon
                                                                            style={{
                                                                                float: 'left', 
                                                                                margin: '-4px 0 0 0'
                                                                            }}
                                                                        />
                                                                        {
                                                                            Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfAboveTH ?? 0))
                                                                        }
                                                                    </>
                                                                    : null
                                                            }
                                                            
                                                        </Box>
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={6} style={{marginTop: 10}}>
                                                    <Typography 
                                                        component="span" 
                                                        variant="h4" 
                                                        style={{
                                                            cursor: 'pointer',
                                                            fontWeight: 400,
                                                            fontSize: '1rem',
                                                            pointerEvents: Boolean(isMySupplierEnabled) && Number(apiRes?.leftGraph?.others ?? 0) > 0 ? 'auto' : 'none',
                                                            textDecoration: Boolean(isMySupplierEnabled) && Number(apiRes?.leftGraph?.others ?? 0) > 0 ? 'underline' : 'none'
                                                        }}
                                                        onClick={()=>this.handleDrillDown('4')}
                                                    >
                                                        <Box
                                                            width={10}
                                                            height={10}
                                                            mr={1}
                                                            bgcolor="#D4B78A"
                                                            display="inline-block"
                                                            borderRadius="100%"
                                                        ></Box>
                                                        {t("componentData.dashboard.Others")}
                                                        <MaterialTooltip 
                                                            title={t("componentData.dashboard.NotConsidered")} 
                                                            arrow={true}
                                                            style={{
                                                                fontSize: 18,
                                                                display: 'inline-block',
                                                                margin:'0 0 -4px 8px',
                                                                pointerEvents: 'auto'
                                                            }}
                                                        >
                                                            <InfoOutlinedIcon />
                                                        </MaterialTooltip>                                            
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={6} style={{marginTop: 10}}>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="flex-end"
                                                        alignItems="flex-end"
                                                    >
                                                        <Typography
                                                            component="span"
                                                            color="textSecondary"
                                                            variant="subtitle2"
                                                        >
                                                        <Box
                                                            fontSize={11}
                                                            color="#4C4C4C"
                                                            display="inline-block"
                                                        >
                                                            {this.currencyFormateFn(apiRes?.leftGraph?.others ?? 0)} ({this.getPercentage(apiRes?.leftGraph?.others ?? 0, apiRes?.leftGraph?.totalCardPayer ?? 0)}%)
                                                        </Box>
                                                        <Box
                                                            component="span"
                                                            alignItems="center"
                                                            color={
                                                                Number(apiRes?.leftGraph?.changesOfOthers ?? 0) > 0 ? "#219653" 
                                                                : Number(apiRes?.leftGraph?.changesOfOthers ?? 0) < 0 
                                                                    ? "#e03617" 
                                                                    : "#fff"
                                                            }
                                                            fontSize={14}                                
                                                            ml={1}                               
                                                            display="inline-block"
                                                            minWidth={45}
                                                        >
                                                            {Number(apiRes?.leftGraph?.changesOfOthers ?? 0) > 0
                                                                ? <>
                                                                    <ArrowDropUpIcon
                                                                        style={{
                                                                            float: 'left', 
                                                                            margin: '-4px 0 0 0'
                                                                        }} 
                                                                    />
                                                                    {
                                                                        Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfOthers ?? 0))
                                                                    }
                                                                </>
                                                                : Number(apiRes?.leftGraph?.changesOfOthers ?? 0) < 0
                                                                    ? <>
                                                                        <ArrowDropDownIcon
                                                                            style={{
                                                                                float: 'left', 
                                                                                margin: '-4px 0 0 0'
                                                                            }} 
                                                                        />
                                                                        {
                                                                            Math.abs(this.currencyFormateFn(apiRes?.leftGraph?.changesOfOthers ?? 0))
                                                                        }
                                                                    </>
                                                                    : null
                                                            }       
                                                        </Box>
                                                        </Typography>
                                                    </Box>
                                                </Grid>

                                            </Grid>
                                            <Box className={classes.updatedTimeTxt} marginTop={'25px'}>
                                                {t("componentData.dashboard.UpdatedAt")} {moment(apiRes?.leftGraph?.lastUpdatedTime).locale(this?.props?.user?.userData?.locale ?? "en").format('Do MMMM YYYY, h:mm:ss A')} EST
                                            </Box> 
                                        </Grid>

                                        <Grid item xs={8}>
                                            <Box 
                                                borderLeft="1px solid #828282" 
                                                style={{float: 'left', height: "100%", width: "100%", boxSizing: 'border-box'}}
                                            >       
                                                                
                                                     {barGraphData?.length > 0 
                                                        ? <>
                                                            <Box mt={2}> 
                                                                <Box 
                                                                    variant='div'
                                                                    className={classes.customLegends}
                                                                >
                                                                    <ul>
                                                                        <li className='ActualSpent'>
                                                                            <label></label>
                                                                            {t("componentData.dashboard.ActualSpent")}
                                                                        </li>
                                                                        {selectedPayeeView === "Percentage" && (
                                                                            <>
                                                                                <li className='LineOfRisk'>
                                                                                    <label></label>
                                                                                    {t("componentData.dashboard.LineOfrisk")}
                                                                                </li>
                                                                                <li className='THLine'>
                                                                                    <label></label>
                                                                                    {t("componentData.dashboard.THLine")}
                                                                                </li>
                                                                            </>                                       
                                                                        )}                                                
                                                                    </ul>
                                                                </Box>
                                                                <Box className={classes.highRiskTxt}>
                                                                    {t("componentData.dashboard.MostRisk")}
                                                                </Box>

                                                                <ComposedChart
                                                                    layout="vertical"
                                                                    width={700}
                                                                    height={350}
                                                                    data={barGraphData}  
                                                                    style={{fontSize: 13, float: 'left'}}
                                                                >
                                                                    <CartesianGrid stroke="#e9e9e9" />
                                                                    <XAxis 
                                                                        type="number" 
                                                                        height={45}   
                                                                        allowDecimals={false}
                                                                        padding={{right: 15}}
                                                                        tickFormatter={(value, index) =>{
                                                                            return value?.toString()?.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")+"%"
                                                                        }}
                                                                    >                         
                                                                    </XAxis>
                                                                    
                                                                    <YAxis 
                                                                        dataKey="YName" 
                                                                        type="category"           
                                                                        width={130}
                                                                        padding={{ top: 20 }}
                                                                    />

                                                                    <Tooltip 
                                                                        labelStyle={{fontSize: 16, fontWeight: "bold"}} 
                                                                        itemStyle={{fontSize: 14, color: '#000'}}
                                                                        content={<CustomTooltip APIData={barGraphData} view={selectedPayeeView} t={t} />}
                                                                    />                                            

                                                                    <Bar 
                                                                        dataKey="ActualSpendInPer" 
                                                                        barSize={20} 
                                                                        fill="#FF5776"
                                                                    >
                                                                        {
                                                                            barGraphData.map((entry, index) => {                     
                                                                                const colorCode = entry?.ActualSpendInPer < entry?.LineOfRisk
                                                                                    ? "#FFBBBB"
                                                                                    : entry?.ActualSpendInPer > entry?.LineOfRisk && entry?.ActualSpendInPer < entry?.THLine
                                                                                        ? "#B3DFFF"
                                                                                        : entry?.ActualSpendInPer > entry?.THLine
                                                                                            ? "#62BBF3"
                                                                                            :  false

                                                                                return (
                                                                                    <Cell 
                                                                                        key={`cell-${index}`} 
                                                                                        fill={colorCode} 
                                                                                    />
                                                                                )
                                                                            })
                                                                        }                                            
                                                                    </Bar>

                                                                    {selectedPayeeView === "Percentage" && (
                                                                        <>
                                                                            <Line 
                                                                                dataKey="LineOfRisk" 
                                                                                stroke="#EB5757" 
                                                                                strokeDasharray="3 3" 
                                                                                dot={false} 
                                                                                strokeWidth={1} 
                                                                            />

                                                                            <Line 
                                                                                dataKey="THLine" 
                                                                                stroke="#2D9CDB" 
                                                                                strokeDasharray="3 3" 
                                                                                dot={false} 
                                                                                strokeWidth={1} 
                                                                            />
                                                                        </> 
                                                                    )}                                               

                                                                </ComposedChart>  

                                                                <Box className={classes.actualSpendTxt}>
                                                                    {t("componentData.dashboard.ActualSpent")}
                                                                </Box>
                                                            </Box>
                                                        </>
                                                        : <>
                                                            <Box
                                                                textAlign="center"
                                                                width={1}
                                                                mt={15}
                                                            >
                                                                <img
                                                                    alt={t("componentData.dashboard.NoData")}
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

                                                

                                                {/* <Box
                                                    display="flex"
                                                    width={1}
                                                    pt={1}
                                                    justifyContent="center"
                                                    mt={2}
                                                    mb={2}
                                                >
                                                    <span className={classes.tabContainer}>
                                                        <span                                             
                                                            className={classes.tab}
                                                            style={
                                                                selectedPayeeView == "Percentage"
                                                                ? { color: "white", background: "#008CE6" }
                                                                : {}
                                                            }
                                                            onClick={() => this.handleTabClick('Percentage')}
                                                        >
                                                            {selectedPayeeView == "Percentage" && (
                                                                <CheckCircleIcon />
                                                            )}                                            
                                                            Percentage
                                                        </span>
                                                        <span
                                                            className={classes.tab}
                                                            style={
                                                                selectedPayeeView == "Amount"
                                                                ? { color: "white", background: "#008CE6" }
                                                                : {}
                                                            }
                                                            onClick={() => this.handleTabClick('Amount')}
                                                        >
                                                            {selectedPayeeView == "Amount" && (
                                                                <CheckCircleIcon />
                                                            )}  
                                                            Amount
                                                        </span>
                                                    </span>
                                                </Box> */}

                                                        
                                                {/* <Box
                                                    mb={3}
                                                    fontSize={11}
                                                    color="#828282"
                                                    mt={1}
                                                    display="flex"
                                                    justifyContent="center"
                                                    letterSpacing={0.3}
                                                >
                                                    {selectedPayeeView == "Percentage" 
                                                        ? '%age of Actual spent w.r.t. commited spent by Payees of each payer.'
                                                        : 'Amount is in Thousand Dollars'
                                                    }                                    
                                                </Box> */}

                                            </Box>
                                        </Grid>
                                    </Grid>
                                </>
                            : <>
                                <Box                            
                                    textAlign="center"
                                    width={1}
                                    mt={5}
                                    style={{float: 'left'}}
                                >
                                    <img
                                        alt={t("componentData.dashboard.NoData")}
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
                </Box>
                {alertMsg && this.renderSnackbar(alertType, alertMsg)}
            </>
        )
    }
}

export default withTranslation()(connect((state) => ({ ...state.user }))(withStyles(styles)(PayerRiskChart)))
