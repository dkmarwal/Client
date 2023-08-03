import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { styles } from '../../styles';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';

const CustomParameter = (props) => {
    const { classes, paymentsCustomdata } = props;

    return (
        <>
            {paymentsCustomdata && paymentsCustomdata.length ? paymentsCustomdata.map((item, index) => {
                return (
                    <Grid item xs={3} key={`key-${index}`}>
                        <Typography className={classes.keyLabel}>
                            {item.customFieldLabel}
                        </Typography>

                        <Typography className={classes.valueLabel}>
                            {item.customFieldValue}
                        </Typography>
                    </Grid>
                )
            })
                : null}
        </>
    )
}
export default withTranslation()(withStyles(styles)(CustomParameter));
