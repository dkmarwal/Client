import React from 'react';
import Styles from './style';
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import SecurityIcon from '@material-ui/icons/Security';
import CheckboxGroup from "~/components/Forms/CheckboxGroup";
import IPAddress from '~/components/IPAddress';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import {getIPAddress, updateSecurityDetail} from "~/redux/actions/security";
import Notification from "~/components/Notification"; 

import { connect } from 'react-redux';
import { withTranslation } from "react-i18next";
import publicIp from 'public-ip';

class Security extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isActive: 0,            
            variant: '',
            errMsg: '',
            saveBtnClick: false,
            ipAddresses:[''],                
            clientIPAdd: null,         
        }        
    } 

    componentDidMount = () => { 
        this.getIPList()
        this.getIPAdd();
    };

    handleChange =(elm)=>{
        this.setState({
            isActive: elm.value
        })        
    }   
    
    setIPVal =(id, val)=>{        
        let index = id;
        let markers = [ ...this.state.ipAddresses];
        markers[index] = val;
        this.setState({ 
            ipAddresses : markers 
        });
    }

    addBtnClicked =()=>{ 
        let index = this.state.ipAddresses.length;
        let markers = [ ...this.state.ipAddresses];
        markers[index] = '';          
        this.setState({ 
            ipAddresses : markers 
        });                   
    }

    getIPList = ()=>{                        
        this.props.dispatch(getIPAddress()).then((res)=>{
            if(!res){
                this.setState({
                    variant: "error",
                    errMsg: this.props.IPAddress.error
                })
                return false                                                   
            }

            let recivedList = [''];
            const {IPs, isIpRestriction} = this.props.IPAddress;
            if(Boolean(IPs && IPs.length > 0)){
                recivedList = IPs;          
            }   
            this.setState({
                ipAddresses: recivedList,
                isActive: Boolean(isIpRestriction) ? isIpRestriction :  0
            })
        });    
    }    

    saveIP = ()=>{ 
        const isErr = this.checkIPsData(); 
        const {isActive, ipAddresses} = this.state; 
        const isDuplicateIP = ipAddresses.filter((s => v => s.has(v) || !s.add(v))(new Set));
        const {t} = this.props;

        if(isActive === 0){
            this.setState({                
                ipAddresses:[''],   
                variant: "",
                errMsg: ""
            })
        }  

        if(isErr && isActive === 1){
            this.setState({
                variant: "error",
                errMsg: t('componentData.IPSecurity.ValidationError')
            })
        }
        else if(isDuplicateIP.length > 0 && ipAddresses.indexOf("") === -1 && isActive === 1){
            this.setState({
                variant: "error",
                errMsg: t('componentData.IPSecurity.duplicateIP')
            }) 
        }
        else{                      
            if(isActive === 1 && ipAddresses.indexOf("") != -1){
                this.setState({
                    variant: "error",
                    errMsg: t('componentData.IPSecurity.IPAddressEmpty')
                })
            }
            else{
                this.setState({
                    saveBtnClick: true
                }, ()=>{                                             
                    this.props.dispatch(updateSecurityDetail(isActive, ipAddresses)).then((res)=>{
                        if(res){ 
                            this.setState({
                                variant: "success",
                                errMsg: t('componentData.IPSecurity.DataSaved'),
                                saveBtnClick: false
                            }, ()=> this.getIPList())                
                        }
                        else{                             
                            this.setState({
                                variant: "error",
                                errMsg: this.props.IPAddress.error,
                                saveBtnClick: false
                            }) 
                        }
                    });
                })
            }
        }        
    }

    notificationClose =()=>{
        this.setState({
            variant: "",
            errMsg: ""
        }) 
    }

    deleteItem =(id)=>{ 
        let markers = [ ...this.state.ipAddresses];
        markers.splice(id, 1);                  
        this.setState({ 
            ipAddresses : markers 
        });   
    }

    checkIPsData =()=>{        
        const ipv4 = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;  

        const ipv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
        
        const {ipAddresses} = this.state;
        let errFound = false;
        for(var i = 0; i<ipAddresses.length; i++ ){                       
            if(Boolean(ipAddresses[i])){
                if(!ipv4.test(ipAddresses[i]) && !ipv6.test(ipAddresses[i])){                   
                    errFound = true;
                    break;                             
                }
            }           
        }         
        return errFound;
    }    
    
    getIPAdd =()=>{
        (async () => {            
            let recivedIP = '';
            try {
                recivedIP = await publicIp.v4();
            } catch(e) {                
                recivedIP = await publicIp.v6();
            }
            this.setState({
                clientIPAdd: recivedIP
            }) 
        })();
    }

    render(){
        const {classes, t} = this.props;
        const {isActive, variant, errMsg, saveBtnClick, ipAddresses, clientIPAdd} = this.state;

        return(
            <>             
                <Grid container className={classes.SecurityContainer}>
                    <Grid item xs={5} className={classes.headingSec}>
                        <Typography  variant="h1">
                            <label><SecurityIcon /></label>                            
                            <span>{t('componentData.IPSecurity.heading')}</span>    
                        </Typography >
    
                        <Typography className={classes.paraTxt}>
                            {t('componentData.IPSecurity.paraTxt')}
                        </Typography>

                        {clientIPAdd 
                            ? <Typography className={classes.paraTxt}>
                                    {t('componentData.IPSecurity.publicIP')} <strong>{clientIPAdd}</strong> 
                                </Typography>
                            : null
                        }                                                                         
                    </Grid>  
                    <Grid item xs={7} className={classes.yesNoBox}>
                        <CheckboxGroup                     
                            color="default"
                            options={[
                            {
                                label: t('componentData.IPSecurity.yesBtn'),
                                value: 1,
                            },
                            {
                                label: t('componentData.IPSecurity.noBtn'),
                                value: 0,
                            },
                            ]}
                            onChange={(value) =>
                                this.handleChange(value)
                            }
                            selectedOption={isActive || 0}
                        />
                    </Grid> 
    
                    <Grid container className={classes.IPTextSec}>  
                        {ipAddresses.map((elm, i) => (                            
                            <>
                               <Grid item xs={6} className={classes.IPBox}>
                                    <IPAddress
                                        key={i}
                                        id={i}
                                        label={t('componentData.IPSecurity.IPAddress')}
                                        getValue={(id, val) =>{this.setIPVal(id, val)}}
                                        disabled={isActive === 0 ? true : false}
                                        value={Boolean(elm) ? elm : ""}
                                        deleteItem={this.deleteItem}                                        
                                        required={true}
                                        errMsg={t('componentData.IPSecurity.validIP')}
                                    />
                                </Grid>
                            </>                        
                        ))}  
                    </Grid> 

                    {ipAddresses.length < 5 
                        ? <Grid container className={classes.addIPBtn}>
                            <Button 
                                variant="outlined" 
                                color="primary"
                                disabled={isActive === 0 ? true : false}
                                onClick={()=>this.addBtnClicked()}
                            >
                                <AddIcon /> {t('componentData.IPSecurity.addMoreIP')}
                            </Button>
                        </Grid> 
                        : null
                    }                    
                   
    
                    <Grid container className={classes.saveIPBtn}>
                        {saveBtnClick 
                            ? <CircularProgress color="primary" />
                            : <Button 
                                variant="contained"
                                color="primary"                        
                                onClick={()=>this.saveIP()}                            
                            >
                                {t('componentData.IPSecurity.saveBtn')}

                            </Button>
                        } 
                    </Grid>
    
               </Grid>
               {variant && <Notification variant={variant} message={errMsg} handleClose={()=>this.notificationClose()} />}
            </>
        )
    }    
}

export default connect(state=>(
    { ...state.IPSecurity}
))(withTranslation()(withStyles(Styles)(Security)));