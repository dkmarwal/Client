import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import B2CCheckboxGroup from '~/components/Forms/B2C/CheckboxGroup';
import { withStyles } from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';

const styles = (theme) => ({
  genralTitleBold: {
    fontSize: '16px',
    lineHeight: '22px',
    color: '#000000',
    fontWeight: 'bold',
    marginTop: '10px',
    padding: theme.spacing(3, 4, 3.5),
  },
});

const EnableRemittance = (props) => {
  const { classes, setShowRemittance, showRemittance, disabledRemittance=false, t } = props;
  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography className={classes.genralTitleBold}>
          {t('componentData.remittanceSettings.RemittanceSettingEnable')}
        </Typography>
      </Grid>
      <B2CCheckboxGroup
        options={[
          {
            label: 'Yes',
            value: 1,
          },
          {
            label: 'No',
            value: 0,
          },
        ]}
        isChecked={true}
        disabled={disabledRemittance}
        onChange={(selectedValue) => {
          setShowRemittance(selectedValue.value);
        }}
        selectedOption={showRemittance}
      />
    </Grid>
  );
};

export default withTranslation()(withStyles(styles)(EnableRemittance));
