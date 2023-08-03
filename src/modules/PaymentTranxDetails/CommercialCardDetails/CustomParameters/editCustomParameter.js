import React from 'react';
import { Grid } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/styles';

import { styles } from '../../styles';
import { TextField } from "~/components/Forms";

const EditCustomParameter = (props) => {
    const { customReference, onChange, validation } = props;

    return (
        <Grid container spacing={3}>
            {customReference && customReference.length > 0 ?
                customReference.map((item, index) => {
                    return (
                        <Grid item xs={6} key={`custom-parameter-${index}`}>
                            <TextField
                                fullWidth={true}
                                color="secondary"
                                autoComplete="off"
                                name="customFieldLabel"
                                label={item.customFieldLabel}
                                variant="outlined"
                                inputProps={{ maxLength: 80 }}
                                value={(Boolean(item?.customFieldValue ?? false) && item.customFieldValue) || ''}
                                onChange={(e) => onChange(e, index)}
                                //onBlur={handleBlur}
                                error={validation.customReference && validation.customReference.length ? validation.customReference.includes(index) : false}
                                helperText={validation.customReference && validation.customReference.length && validation.customReference.includes(index) ?
                                    validation.customReferenceMsg : ''}
                            />
                        </Grid>
                    )
                })
                : null
            }
        </Grid>
    )
}
export default withTranslation()(withStyles(styles)(EditCustomParameter));