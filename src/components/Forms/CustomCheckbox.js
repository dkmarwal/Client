import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { FormControlLabel, Checkbox, Typography, Box, Tooltip } from '@material-ui/core';
import { dataTypeToolTipValue } from '~/config/entityTypes';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const LightTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: '#4C4C4C',
        color: "#FFFFFF",
        boxShadow: theme.shadows[1],
        fontSize: 12,
        fontWeight: 'normal'
    }
}))(Tooltip);

const useStyles = makeStyles({
    root: {
        '&:hover': {
            backgroundColor: 'transparent',
        }
    },
    childLabel: {
        width: 305,
        color: '#4C4C4C',
        marginRight: 0
    },
    parentLabel: {
        padding: '0 17px',
        width: 'auto',
        color: '#0B1941'
    },
    icon: {
        borderRadius: 3,
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5'
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)'
        }
    },
    checkedIcon: {
        backgroundColor: '#fff',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='DodgerBlue'/%3E%3C/svg%3E\")",
            content: '""'
        },
        'input:hover ~ &': {
            backgroundColor: '#bbbbb'
        }
    },
    indeterminateIcon: {
        backgroundColor: '#fff',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 10,
            marginLeft: '3px',
            marginTop: '7px',
            background: 'dodgerblue',
            border: 'solid 1.2px #1e90ff',
            borderWidth: '1.2px',
            content: '""'
        },
        'input:hover ~ &': {
            backgroundColor: '#bbbbb'
        }
    },
    subLabel: {
        paddingLeft: '40px',
        fontSize: '14px',
        color: '#4C4C4C',
        lineHeight: '16px',
        paddingBottom: '8px'
    },
    childSubLabel: {
        paddingLeft: '5px',
        fontSize: '12px',
        color: '#4C4C4C',
        fontStyle: 'italic'
    },
    mainBox: {
        width: '60%'
    },
    childBox: {
        width: 'auto'
    },
    infoIcon: {
        verticalAlign: 'bottom'
    },
    tooltipColor: {
        background: 'red'
    }
});

export default function CustomCheckbox(props) {
    const classes = useStyles();
    const { isChild, item, listItems } = props;
    let grpPermissionIds = [], itemlength = 0, rec = [];

    let isChecked = item.isChecked === 1;    

    if (!isChild) {
        itemlength = (item['childRecord'] && item['childRecord'].length) || 0;
        grpPermissionIds = item['childRecord'] && item['childRecord'].filter(ele => {
            return ele.isChecked == 1;
        });
        isChecked = grpPermissionIds.length > 0 && grpPermissionIds.length == itemlength;
    }

    if (item.control_group && item.control_group !== null) {        
        rec = listItems.childRecord && listItems.childRecord.filter(a => a.control_group == item.control_group
            && a.fieldName != item.fieldName);

    }

    const getToolTipMessage = (rec) => {
        return <>
            {rec.map((item, index) => {
                const { fieldName, dataTypeDisplay, minLength, maxLength } = item;
                return <Box key={index}>{`${fieldName} (${dataTypeToolTipValue[dataTypeDisplay]},
                    ${minLength} - ${maxLength})`}
                </Box>
            })}
        </>
    }

    return (
        <Box className={!isChild ? classes.mainBox : classes.childBox}>
            <FormControlLabel
                className={isChild ? classes.childLabel : classes.parentLabel}
                control={<Checkbox
                    className={classes.root}
                    disableRipple
                    //disabled={isDisabled}
                    checked={isChecked}
                    indeterminate={grpPermissionIds.length > 0 && grpPermissionIds.length < itemlength}
                    color="default"
                    checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                    indeterminateIcon={<span className={clsx(classes.icon, classes.indeterminateIcon)} />}
                    icon={<span className={classes.icon} />}
                    inputProps={{ 'aria-label': 'decorative checkbox' }}
                    {...props}
                />}
                label={item.name ? item.name : <>
                    {item.fieldName} 
                    {rec.length > 0 
                        ?   <LightTooltip 
                                title={getToolTipMessage(rec)} 
                                placement="top" 
                                arrow
                            >
                                <InfoOutlinedIcon fontSize="small" className={classes.infoIcon} />
                            </LightTooltip>
                        : ''
                    }
                </>}
            />
            <Typography 
                className={isChild ? classes.childSubLabel : classes.subLabel}
            >
                {Boolean(item.description) ? (item.description) : ''}
            </Typography>
        </Box>
    );
}
