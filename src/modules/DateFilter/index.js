import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { styles } from './styles';
import DatePicker, { registerLocale } from "react-datepicker";
import {  Button } from '@material-ui/core'

import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';
import { updateDateFilter } from '~/redux/actions/filter';
import en from "date-fns/locale/es";
import fr from "date-fns/locale/es";
import es from "date-fns/locale/es";
registerLocale("en", en);
registerLocale("fr", fr);
registerLocale("es", es);

class DateFilter extends Component{
    state = {
        startDate :  '',
        endDate : '',
    }
    handleDateChange = date => {
        this.props.updateDateFilter('startDate',date);
        
    };
    handleEndDateChange = date=>{
        this.props.updateDateFilter('endDate',date);
    }

    render(){
        var {classes,settings} = this.props;
        
        return(
            <Box display="flex" justifyContent="flex-end" m={1} p={1} >
                    <Box p={1} >                        
                        <DatePicker 
                            selected={this.props.filter.selectedFilter.startDate} 
                            onChange={this.handleDateChange} 
                            name="startDate" 
                            placeholderText={settings.startDateLabel} 
                            className={classes.dateInput} 
                            dateFormat="dd-MM-yyyy"
                            locale={this.props.i18n.language}
                        />
                     
                    </Box>
                    <Box p={1} >                        
                        <DatePicker 
                            selected={this.props.filter.selectedFilter.endDate} 
                            onChange={this.handleEndDateChange} 
                            name="endDate" 
                            placeholderText={settings.endDateLabel} 
                            className={classes.dateInput} 
                            dateFormat="dd-MM-yyyy"
                            locale={this.props.i18n.language}
                        />
                    </Box>
                    <Box p={1}>                       
                       <Button  variant="contained" fullWidth={true} className={classes.filterButton}>{settings.butttonFilter}</Button>
                    </Box>
            </Box>
           
        )
    }
}

const mapStateToProps = ({ filter }) => ({ filter })

const mapDispatchToProps = { updateDateFilter }

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(styles)(DateFilter));
