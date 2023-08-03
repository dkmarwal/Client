import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';
import clsx from 'clsx';

import { styles } from '../../styles';
import { entityType } from '~/config/entityTypes';
import config from "~/config";
import { useHistory } from "react-router-dom";

const DetailsInfo = (props) => {
    const history = useHistory();
    const { t, classes, infoData } = props;

    const routeToFileDetails = () => {
        history.push({
            pathname: `${config.baseName}/payments/paymentFiles/fileDetails`,
            state: {
                id: infoData.FileID,
                appType: entityType.B2B
            }
        })
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography className={classes.keyLabel}>
                            {t('componentData.paymentTransDetail.PaymentReference')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.valueLabel}>
                            {infoData && infoData.PaymentRef}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            {infoData && infoData.ProcessedOn &&
                <Grid item xs={6}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography className={classes.keyLabel}>
                                {t('componentData.paymentTransDetail.ProcessedOn')}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography className={classes.valueLabel}>
                                {infoData && infoData.ProcessedOn}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>}
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography className={classes.keyLabel}>
                            {t('componentData.paymentTransDetail.PaymentID')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.valueLabel}>
                            {infoData && infoData.PaymentID}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography className={classes.keyLabel}>
                            {t('componentData.paymentTransDetail.ReceivedOn')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.valueLabel}>
                            {infoData && infoData.CreatedAt}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography className={classes.keyLabel}>
                            {t('componentData.paymentTransDetail.PaymentMethod')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.valueLabel}>
                            {infoData && infoData.PaymentTypeDesc}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography className={classes.keyLabel}>
                            {t('componentData.paymentTransDetail.FileId')}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={clsx(classes.valueLabel, classes.linkText)}
                            onClick={() => routeToFileDetails()}>
                            {infoData && infoData.FileID}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}
export default withTranslation()(withStyles(styles)(DetailsInfo));
