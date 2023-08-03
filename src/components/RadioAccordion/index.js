import React from 'react';
import {
    Accordion, AccordionSummary, FormControlLabel, Radio, AccordionDetails, Box } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        padding: '10px 0'
    },
    accordionStyle: {
        backgroundColor: `rgba(239,239,239,0.54)`
    },
    expandedStyle: {
        "&.Mui-expanded": {
            backgroundColor: "#FFFFFF"
        }
    },
    label: {
        color: "#4C4C4C",
        fontFamily: theme.typography.fontFamily,
        fontSize: "16px",
        fontWeight: "bold",
        letterSpacing: "0",
        lineHeight: theme.spacing(2)
    },
    contentStyle:{
        background: '#FFF'
    }
}));

const RadioAccordion = ({ children, label, value, checked, handleChange, ...restProps }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Accordion key={label} {...restProps} className={classes.accordionStyle}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    className={classes.expandedStyle}
                    aria-label="Expand"
                    aria-controls="actions1-content"
                    id="actions1-header"
                >
                    <FormControlLabel
                        aria-label="Acknowledge"
                        className={classes.label}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<Radio
                            value={value}
                            checked={checked}
                            onChange={handleChange}
                            name={value}
                            size="small"
                        />}
                        label={label}
                    />
                </AccordionSummary>
                <AccordionDetails className={classes.contentStyle}>
                    <Box width="100%" mx={3}>
                        {children}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
export default RadioAccordion;