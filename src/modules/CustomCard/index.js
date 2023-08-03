import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Box, Typography, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { fetchModuleData } from '~/redux/actions/moduleData';
import numeral from 'numeral'
import { styles } from './styles';

class CustomCard extends Component {

    componentDidMount() {
        this.props.fetchModuleData(this.props.id, this.props.dataSettings.endpoint);
    }

    render() {
        const { classes, moduleData, id, settings } = this.props;
        const data = moduleData[id] || {}
        return (
            <Box className={classes.cardContainer} px={2} py={2}>
            {data.value ? (
                <Fragment>
                    <Typography variant="h5" className={classes.title} noWrap>{settings.cardTitle}</Typography>
                    <Box className={classes.itemWrapper}>
                        <Typography variant="h1" className={classes.content}>{numeral(data.value).format(`${settings.valueSymbol}0.00 a`)}</Typography>
                    </Box>
                </Fragment>
            ) : (
                <Box display="flex" p={4} justifyContent="center" alignItems="center"><CircularProgress color="primary" /></Box>
            )}
            </Box>
        )
    }
}
const mapStateToProps = ({ moduleData }) => {
    return { moduleData };
}
const mapDispatchToProps = { fetchModuleData }
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CustomCard))
