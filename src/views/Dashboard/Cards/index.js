import React, {Component} from 'react';
import {     
    withStyles, 
    Box,
    Grid,     
} from '@material-ui/core';
import styles from './style';
import SpendAnalysis from './SpendAnalysis.js';
import PayerRiskChart from './PayerRiskChart';
import PayeesEnrollment from './PayeesEnrollment';
import { withTranslation } from "react-i18next";

class Cards extends Component{
    render(){
        const {classes} = this.props;       
                
        return(
            <>
                <Grid container>
                    <Box
                        style={{
                            margin: '100px 4% 50px',
                            float: 'left',
                            width: '92%'
                        }}
                    > 
                        <Box className={classes.fullWidth}>
                            <SpendAnalysis {...this.props} />
                        </Box>

                        <Box className={classes.fullWidth} mt={4}>
                            <PayerRiskChart {...this.props} />
                        </Box>

                        <Box className={classes.fullWidth} mt={4}>
                            <PayeesEnrollment {...this.props} />
                        </Box>
                    </Box>  
                </Grid>                        
            </>
        )
    }
}

export default withTranslation()(withStyles(styles)(Cards))
