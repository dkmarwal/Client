import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { styles } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
import { Box, Button, CircularProgress } from "@material-ui/core";
import ReplayIcon from '@material-ui/icons/Replay';
import { setPaymentEditId, fetchDefaultPaymentAttributeList, updateFileTypePaymentDefaultSelection } from "~/redux/actions/paymentAttribute";
import PaymentFileAttribute from "../PaymentFileAttribute";
import Notification from "~/components/Notification";

function PaymentFileTreeView(props) {
    const [defaultLoader, setDefaultLoader] = useState(false);
    const [downloadResponse, setDownloadResponse] = useState({ varient: '', message: '' });
    const { paymentAttribute, dispatch, classes, t } = props;
    const { editId, fileSelectionType } = paymentAttribute;

    const onEdit = (item) => {
        dispatch(setPaymentEditId(item.index));
    }

    const defaultSelection = () => {
        setDefaultLoader(true);
        dispatch(fetchDefaultPaymentAttributeList(fileSelectionType?.fileTypeId)).then((response) => {
            if (!response) {
                setDownloadResponse({ varient: 'error', message: paymentAttribute.error });
                setDefaultLoader(false);
                return false;
            }
            if (fileSelectionType) {
                dispatch(updateFileTypePaymentDefaultSelection(1))
            }
            setDefaultLoader(false);
        });
    };

    return (
        <>
            {!defaultLoader ?
                paymentAttribute.attributeList.length ? paymentAttribute.attributeList.map((item, ind) => {
                    return (
                        <Fragment key={ind}>
                            <PaymentFileAttribute
                                listItem={item}
                                onEdit={onEdit}
                                editId={editId}
                            />
                        </Fragment>
                    )
                }) : null
                :
                <Box
                    display="flex"
                    p={10}
                    justifyContent="center"
                    alignItems="center"
                >
                    <CircularProgress color="primary" />
                </Box>}


            <Box py={3} pl={3.2}>
                <Box>
                    <Button
                        variant="link"
                        color="default"
                        className={classes.resetBtn}
                        startIcon={<ReplayIcon className={classes.icons} />}
                        onClick={defaultSelection}
                    >
                        {t('componentData.FileMappingTool.goToDefaultSelectionBtn')}
                    </Button>
                </Box>
            </Box>
            {downloadResponse.message &&
                <Notification variant={downloadResponse.varient} message={downloadResponse.message}
                    handleClose={() => setDownloadResponse({ varient: '', message: '' })} />
            }
        </>
    );
}

export default withTranslation()(connect((state) => ({ ...state.paymentAttribute }))(
    withStyles(styles)(PaymentFileTreeView)
));
