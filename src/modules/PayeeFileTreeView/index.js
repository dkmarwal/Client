import React, { useState, Fragment } from "react";
import { connect } from "react-redux";
import { styles } from "./styles";
import { withStyles } from "@material-ui/core/styles";
import { withTranslation } from 'react-i18next';
import { Box, Divider, Button, CircularProgress } from "@material-ui/core";
import ReplayIcon from '@material-ui/icons/Replay';
import { setPayeeEditId, fetchDefaultPayeeAttributeList, updateFileTypePayeeDefaultSelection } from "~/redux/actions/payeeAttribute";
import PayeeFileAttribute from "../PayeeFileAttribute";
import Notification from "~/components/Notification";

function PayeeFileTreeView(props) {
    const [downloadResponse, setDownloadResponse] = useState({ varient: '', message: '' });
    const [defaultLoader, setDefaultLoader] = useState(false);
    const { payeeAttribute, classes, t, dispatch } = props;
    const { editId, attributeList, fileSelectionType } = payeeAttribute;

    const onEdit = (item) => {
        dispatch(setPayeeEditId(item.index));
    }

    const defaultSelection = () => {
        setDefaultLoader(true);
        dispatch(fetchDefaultPayeeAttributeList(fileSelectionType?.fileTypeId)).then((response) => {
            if (!response) {
                setDownloadResponse({ varient: 'error', message: payeeAttribute.error });
                setDefaultLoader(false);
                return false;
            }
            setDefaultLoader(false);
            if (fileSelectionType) {
                dispatch(updateFileTypePayeeDefaultSelection(1))
            }
        });
    };

    return (
        <>
            {!defaultLoader ?
                attributeList.length ? attributeList.map((item, ind) => {
                    return (
                        <Fragment key={ind}>
                            <PayeeFileAttribute
                                listItem={item}
                                onEdit={onEdit}
                                editId={editId}
                            />
                            <Divider variant="middle" className={classes.divider} />
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
                </Box>
            }

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
    )
}

export default withTranslation()(connect((state) => ({ ...state.payeeAttribute, ...state.user }))(
    withStyles(styles)(PayeeFileTreeView)
));
