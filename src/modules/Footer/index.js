import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { Box,Grid, Typography } from "@material-ui/core";
import { withTranslation } from 'react-i18next';

const styles = theme => ({
    poweredText:{fontSize:'7px', color:'#999999', marginRight:'5px'}
})

class Footer extends Component {
    render(){
        const {classes,settings} = this.props
        const logo= settings.logo
        const { t } = this.props;

        return (<Box p={4} marginRight={4}>
            <Grid container direction="row" justify="flex-end" alignItems="flex-end">
                <Grid item><Typography className={classes.poweredText}>{t('componentData.footer.PoweredBy')}</Typography></Grid>
                <Grid><img alt="Incedo" title= {t('componentData.footer.imgTitle')} src={logo}/></Grid>
            </Grid>
        </Box>)
    }
}

export default withTranslation()(withStyles(styles)(Footer))
