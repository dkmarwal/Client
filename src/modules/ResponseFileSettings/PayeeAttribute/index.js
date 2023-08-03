import React, { useState } from 'react';
import { styles } from "./styles";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
import { Card, Grid, Box, Button, CardContent } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PayeeFileTreeView from '~/modules/PayeeFileTreeView';
import { FullWidthDialog } from '~/components/Dialogs';
import PaymentPreviewFile from '../PaymentAttribute/PaymentPreviewFile';

const PayeeAttribute = (props) => {
    const { classes, t, payeeAttribute } = props;
    const { attributeList } = payeeAttribute;
    const [isOpen, setOpen] = useState(false);

    const openPreviewModal = () => {
        setOpen(!isOpen);
    }

    return (
        <Box>
            <Card className={classes.root}>
                <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ background: '#CCE4FF' }}>
                    <Grid item xs={12} sm={6} className={classes.cardHeaderLeft}>
                        {t('componentData.FileMappingTool.payeeAttributeHeader')}
                    </Grid>

                    <Grid item xs={12} sm={6} className={classes.cardHeaderRight}>
                        <Button size="small" className={classes.previewBtn}
                            startIcon={<VisibilityIcon />}
                            onClick={openPreviewModal}
                        >
                            {t('componentData.FileMappingTool.previewBtn')}
                        </Button>
                    </Grid>
                </Grid>

                <CardContent>
                    <PayeeFileTreeView />
                </CardContent>
            </Card>
            <FullWidthDialog
                open={isOpen}
                title={t("componentData.FileMappingTool.previewPayeeFileFormat")}
                onConfirm={openPreviewModal}
            >
                <PaymentPreviewFile data={attributeList} title={t("componentData.FileMappingTool.payeeFileTreeHeader")} />
            </FullWidthDialog>
        </Box>
    );
}

export default withTranslation()(connect((state) => ({ ...state.payeeAttribute }))(
    withStyles(styles)(PayeeAttribute)
));
