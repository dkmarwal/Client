import React from 'react';
import { FormControlLabel, Checkbox, Grid, FormLabel, FormGroup, makeStyles } from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

const formControlStyle = makeStyles((theme) => ({
    root: {

    },
    label: {
        textAlign: 'left',        
        marginRight: '10px',
        color: 'rgba(0,0,0,0.87)',
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px',
        letterSpacing: 0,
        lineHeight: '16px',
    }
}));

const useStyle = makeStyles((theme) => ({
    formLabel: {
        color: '#4C4C4C',
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px',
        fontWeight: 600,
        letterSpacing: 0,
        lineHeight: '22px',

    }
}));

const MultiCheckBoxGroup = ({ label, options, onChangeCheckBox, selectedCheckbox=[] }) => {

    const FormControlClasses = formControlStyle();
    const classes = useStyle();

    const accessOptions = options.map(({ name, value, label }) => {
        return (
            <FormControlLabel
                key={value}
                classes={FormControlClasses}
                control={
                    <Checkbox
                        name={name}
                        value={parseInt(value)}
                        checked={selectedCheckbox.includes(value)}
                        onChange={onChangeCheckBox}
                        icon={<CheckBoxOutlineBlankIcon fontSize="small" style={{ color: 'rgba(0,0,0,0.6)' }} />}
                        checkedIcon={<CheckBoxIcon fontSize="small" style={{ color: 'rgba(0,0,0,0.6)' }} />}
                    />
                }
                label={label}
            />
        );
    });

    return (
        <Grid container>
            <Grid item container xs={12} sm={4} alignItems="center">
                <FormLabel component="legend" className={classes.formLabel}>
                    {label}
                </FormLabel>
            </Grid>
            <Grid item xs={12} sm={8}>
                <FormGroup aria-label="position" row>
                    {accessOptions}
                </FormGroup>
            </Grid>
        </Grid>

    );
};

export default MultiCheckBoxGroup;
