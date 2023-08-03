import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/styles';
import { styles } from './styles';
import { Tree, TreeNode } from 'react-organizational-chart';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import './style.css';
import { withTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
    rootStyledDiv: {
        color: '#0B1941',
        padding: '5px',
        borderRadius: '6px',
        border: '1px solid #0B1941',
        display: 'inline-block'
    },
    styledDiv: {
        padding: '5px',
        borderRadius: '6px',
        display: 'inline-block',
        border: '1px solid #008CE6',
        color: '#008CE6'
    },
    childDiv: {
        display: 'inline-block',
        color: '#4C4C4C',
        textAlign: 'left'
    },
    formatBtn: {
        textTransform: "none"
    }
}));

const PaymentPreviewFile = (props) => {
    const classes = useStyles();
    const { data, title } = props;

    useEffect(() => {
        var elmnt = document.getElementById('treeRoot');
        elmnt.scrollIntoView();
    })
    const previewList = data.map(item => {
        if (item) {
            const previewItem = { ...item };
            if (previewItem.childRecord && previewItem.childRecord.length) {
                previewItem.childRecord = previewItem.childRecord.filter(function (ele) {
                    return ele.isChecked == 1;
                });
                return previewItem;
            }
            else {
                return previewItem;
            }
        }
    });

    return (
        <Box pt={2} pb={2} id={'treeRoot'}>
            <Tree
                lineWidth='1px'
                lineColor='#8F9EC3'
                lineBorderRadius='5px'
                label={<Box className={classes.rootStyledDiv}>{title}</Box>}
            >
                {previewList.length && previewList.map((item, index) => {
                    return (
                        <TreeNode className="parentRoot" label={<Box key={index} className={classes.styledDiv}>{item.name}</Box>}>
                            {item.childRecord && item.childRecord.length > 0 ?
                                <div className="rootLabel">
                                    {item.childRecord.map((childItem, ind) => {
                                        return (
                                            <TreeNode label={
                                                <Box className={classes.childDiv} key={ind}>
                                                    <i></i>
                                                    <div style={{ display: 'inherit', paddingTop: '6px', position: 'absolute' }}>
                                                        <span>{childItem.fieldName}</span>
                                                    </div>
                                                </Box>}
                                            />
                                        )
                                    })}
                                </div>
                                :
                                ''}
                        </TreeNode>
                    )
                })}
            </Tree>
        </Box>
    )
}
export default withTranslation()(withStyles(styles)(PaymentPreviewFile));